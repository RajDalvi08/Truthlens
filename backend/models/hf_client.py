"""
Hugging Face Inference Client
=============================
Provides lightweight HTTP querying to Hugging Face Serverless Inference API
for DistilBERT classification models. Avoids loading PyTorch and Transformers
into local memory, keeping memory consumption < 100 MB.
"""

import os
import math
import logging
import requests

logger = logging.getLogger("truthlens.hf_client")

# Ensure .env is loaded if present
_env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
if os.path.exists(_env_path):
    try:
        with open(_env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip("'\""))
    except Exception as e:
        logger.warning("Could not parse .env: %s", e)


def _get_hf_token() -> str:
    return os.getenv("HF_TOKEN", "").strip()


def query_hf_classification(
    model_id: str,
    text: str,
    temperature: float = 2.0,
    max_chars: int = 1500,
    default_fallback: float = 0.35,
) -> float:
    """
    Query a Hugging Face binary sequence classification model via Serverless Inference API.
    Applies temperature scaling and clamping [0.05, 0.95].

    Args:
        model_id: Hugging Face model repository (e.g. 'vins01-07/truthlens-framing-bias')
        text: Input text to classify
        temperature: Temperature scaling factor (default 2.0)
        max_chars: Maximum characters to send (prevents oversized payloads)
        default_fallback: Baseline probability if API is unavailable

    Returns:
        float in [0.05, 0.95] representing biased class probability.
    """
    if not text or not text.strip():
        return 0.05

    token = _get_hf_token()
    headers = {
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    truncated_text = text.strip()[:max_chars]
    payload = {
        "inputs": truncated_text,
        "options": {"wait_for_model": True},
    }

    # Primary HF inference router and fallback endpoint
    endpoints = [
        f"https://router.huggingface.co/hf-inference/models/{model_id}",
        f"https://api-inference.huggingface.co/models/{model_id}",
    ]

    data = None
    last_error = None

    for url in endpoints:
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=12)
            if resp.status_code == 200:
                data = resp.json()
                break
            elif resp.status_code == 503:
                # Model is loading; try once more with slight delay if needed
                logger.info("Model %s is loading on HF (503)...", model_id)
                last_error = f"503 Model Loading: {resp.text}"
            else:
                last_error = f"HTTP {resp.status_code}: {resp.text}"
                logger.warning("HF API error for %s on %s: %s", model_id, url, last_error)
        except Exception as exc:
            last_error = str(exc)
            logger.warning("HF connection exception for %s on %s: %s", model_id, url, exc)

    if not data:
        logger.warning(
            "Using fallback score (%s) for %s due to API error: %s",
            default_fallback,
            model_id,
            last_error,
        )
        return default_fallback

    # Hugging Face returns classification output as:
    # [[{"label": "LABEL_0", "score": 0.3}, {"label": "LABEL_1", "score": 0.7}]]
    # or [{"label": "LABEL_0", "score": 0.3}, {"label": "LABEL_1", "score": 0.7}]
    items = []
    if isinstance(data, list):
        if len(data) > 0 and isinstance(data[0], list):
            items = data[0]
        elif len(data) > 0 and isinstance(data[0], dict):
            items = data

    biased_prob = None
    for item in items:
        label = str(item.get("label", "")).upper()
        score = float(item.get("score", 0.0))

        # Check for biased class indicator (LABEL_1, BIASED, 1, POSITIVE)
        if "1" in label or "BIAS" in label or label == "POSITIVE":
            biased_prob = score
            break
        elif "0" in label or "NEUTRAL" in label or label == "NEGATIVE":
            # If we only have label 0 score, class 1 is (1 - score)
            biased_prob = 1.0 - score

    if biased_prob is None:
        if items and "score" in items[0]:
            biased_prob = float(items[0]["score"])
        else:
            return default_fallback

    # Apply temperature scaling: p_T = sqrt(p) / (sqrt(p) + sqrt(1-p)) for T=2.0
    # General formula: p_T = 1 / (1 + ((1 - p) / p) ** (1 / temperature))
    biased_prob = max(1e-6, min(1.0 - 1e-6, biased_prob))
    if temperature > 0 and temperature != 1.0:
        ratio = (1.0 - biased_prob) / biased_prob
        scaled_prob = 1.0 / (1.0 + math.pow(ratio, 1.0 / temperature))
    else:
        scaled_prob = biased_prob

    # Probability Clamping [0.05, 0.95] to avoid overconfidence
    clamped_prob = max(0.05, min(0.95, scaled_prob))
    return round(clamped_prob, 4)
