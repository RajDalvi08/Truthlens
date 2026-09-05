"""
Hugging Face Inference Client
=============================
Provides querying for DistilBERT classification models with server-side debug logging.
Supports remote Hugging Face Inference endpoints with automatic local transformer execution
fallback so that inference never fails or silently returns arbitrary default scores.
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
    """Retrieve HF token from environment or local cache without exposing it."""
    token = os.getenv("HF_TOKEN", "").strip()
    if not token:
        try:
            from huggingface_hub import get_token
            cached = get_token()
            if cached:
                token = cached.strip()
        except Exception:
            pass
    if not token:
        cache_path = os.path.expanduser("~/.cache/huggingface/token")
        if os.path.exists(cache_path):
            try:
                with open(cache_path, "r", encoding="utf-8") as f:
                    token = f.read().strip()
            except Exception:
                pass
    return token


# In-memory cache for local DistilBERT models and tokenizer
_LOCAL_MODELS = {}
_LOCAL_TOKENIZER = None


def _get_local_tokenizer():
    global _LOCAL_TOKENIZER
    if _LOCAL_TOKENIZER is None:
        from transformers import DistilBertTokenizerFast
        _LOCAL_TOKENIZER = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
    return _LOCAL_TOKENIZER


def _get_local_model(model_id: str):
    global _LOCAL_MODELS
    if model_id not in _LOCAL_MODELS:
        import torch
        from transformers import DistilBertForSequenceClassification
        token = _get_hf_token() or None
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model = DistilBertForSequenceClassification.from_pretrained(model_id, token=token)
        model.to(device)
        model.eval()
        _LOCAL_MODELS[model_id] = (model, device)
    return _LOCAL_MODELS[model_id]


def _infer_locally(model_id: str, text: str, max_chars: int = 512):
    """Run model inference locally using cached fine-tuned DistilBERT weights."""
    import torch
    tokenizer = _get_local_tokenizer()
    model, device = _get_local_model(model_id)
    
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=min(max_chars, 512),
    )
    inputs = {k: v.to(device) for k, v in inputs.items()}
    
    with torch.no_grad():
        logits = model(**inputs).logits
        
    probs_unscaled = torch.softmax(logits, dim=1)
    biased_prob_unscaled = probs_unscaled[0][1].item()
    
    raw_response = {
        "source": "local_transformer",
        "logits": logits[0].tolist(),
        "probabilities": probs_unscaled[0].tolist(),
        "classes": [{"label": "LABEL_0", "score": probs_unscaled[0][0].item()},
                    {"label": "LABEL_1", "score": biased_prob_unscaled}]
    }
    return raw_response, "LABEL_1", biased_prob_unscaled


def query_hf_classification(
    model_id: str,
    text: str,
    temperature: float = 2.0,
    max_chars: int = 512,
    model_name: str = "Bias Model",
) -> float:
    """
    Query a binary classification model (via HF Inference API or local fallback).
    Applies temperature scaling and clamping [0.05, 0.95].
    Emits server-side debug logging for model auditing.

    Returns:
        float in [0.05, 0.95] representing biased class probability.
    """
    if not text or not text.strip():
        # Clean empty input case
        final_val = 0.05
        print(f"\n==================================================")
        print(f"MODEL NAME: {model_name}")
        print(f"HF REPOSITORY: {model_id}")
        print(f"INPUT TEXT LENGTH: 0")
        print(f"RAW HF RESPONSE: EMPTY_INPUT")
        print(f"PARSED LABEL: LABEL_0")
        print(f"PARSED SCORE: 0.0")
        print(f"FINAL FLOAT RETURNED BY predict(text): {final_val}")
        print(f"==================================================")
        return final_val

    token = _get_hf_token()
    truncated_text = text.strip()[:max_chars]
    
    headers = {
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    payload = {
        "inputs": truncated_text,
        "options": {"wait_for_model": True},
    }

    custom_endpoint = os.getenv(f"{model_name.upper().replace(' ', '_')}_ENDPOINT") or os.getenv("HF_INFERENCE_ENDPOINT")
    endpoints = []
    if custom_endpoint:
        endpoints.append(custom_endpoint)
    endpoints.append(f"https://router.huggingface.co/hf-inference/models/{model_id}")

    raw_response = None
    parsed_label = None
    parsed_score = None
    remote_success = False

    # 1. Attempt remote HF Inference
    for url in endpoints:
        try:
            resp = requests.post(url, headers=headers, json=payload, timeout=8)
            if resp.status_code == 200:
                raw_response = resp.json()
                items = []
                if isinstance(raw_response, list):
                    if len(raw_response) > 0 and isinstance(raw_response[0], list):
                        items = raw_response[0]
                    elif len(raw_response) > 0 and isinstance(raw_response[0], dict):
                        items = raw_response

                for item in items:
                    lbl = str(item.get("label", "")).upper()
                    scr = float(item.get("score", 0.0))
                    if "1" in lbl or "BIAS" in lbl or lbl == "POSITIVE":
                        parsed_label = lbl
                        parsed_score = scr
                        remote_success = True
                        break
                    elif "0" in lbl or "NEUTRAL" in lbl or lbl == "NEGATIVE":
                        parsed_label = "LABEL_1 (derived from LABEL_0)"
                        parsed_score = 1.0 - scr
                        remote_success = True
                if remote_success:
                    break
            elif resp.status_code == 503:
                logger.info("Model %s is loading on HF (503)...", model_id)
            else:
                logger.debug("HF remote endpoint %s returned %s: %s", url, resp.status_code, resp.text[:100])
        except Exception as exc:
            logger.debug("HF remote query error on %s: %s", url, exc)

    # 2. If remote API did not yield a parsed score, run local model inference
    if not remote_success or parsed_score is None:
        try:
            raw_response, parsed_label, parsed_score = _infer_locally(model_id, truncated_text, max_chars=max_chars)
        except Exception as exc:
            logger.error("Inference execution failed for %s (%s): %s", model_name, model_id, exc)
            raise RuntimeError(f"Inference failure for {model_name} on {model_id}: {exc}")

    # 3. Apply Temperature Scaling (T=2.0)
    # Scaled probability: p_T = 1 / (1 + ((1 - p) / p) ** (1 / temperature))
    biased_prob = max(1e-6, min(1.0 - 1e-6, float(parsed_score)))
    if temperature > 0 and temperature != 1.0:
        ratio = (1.0 - biased_prob) / biased_prob
        scaled_prob = 1.0 / (1.0 + math.pow(ratio, 1.0 / temperature))
    else:
        scaled_prob = biased_prob

    # 4. Probability Clamping [0.05, 0.95] and rounding
    clamped_prob = max(0.05, min(0.95, scaled_prob))
    final_float = round(clamped_prob, 4)

    # 5. Temporary Server-Side Debug Logging
    print(f"\n==================================================")
    print(f"MODEL NAME: {model_name}")
    print(f"HF REPOSITORY: {model_id}")
    print(f"INPUT TEXT LENGTH: {len(truncated_text)}")
    print(f"RAW HF RESPONSE: {raw_response}")
    print(f"PARSED LABEL: {parsed_label}")
    print(f"PARSED SCORE: {parsed_score}")
    print(f"FINAL FLOAT RETURNED BY predict(text): {final_float}")
    print(f"==================================================")

    return final_float
