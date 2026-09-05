"""
Hugging Face Inference Client
=============================
Provides querying for fine-tuned DistilBERT classification models.

Production inference strategy:
  - Loads each model locally on demand (lazy loading).
  - Only ONE model is held in memory at a time to stay within Render's 512 MB limit.
  - After inference the loaded model is immediately deleted and memory cleared.
  - Peak RAM per request: ~240 MB (single DistilBERT model).
  - Falls back to a RuntimeError on load/inference failure so the caller can handle it.
"""

import gc
import os
import math
import logging

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


def _infer_with_pipeline(model_id: str, text: str, token: str):
    """
    Load the model via transformers.pipeline, run inference, then immediately
    unload to free memory. Only one model is in memory at any point in time.

    Returns:
        (raw_label: str, raw_score: float)
    """
    import torch
    from transformers import pipeline

    device = 0 if torch.cuda.is_available() else -1  # GPU if available, else CPU

    try:
        pipe = pipeline(
            "text-classification",
            model=model_id,
            token=token or None,
            device=device,
        )
        results = pipe(text, truncation=True, max_length=512)
        # results is a list of dicts: [{'label': 'LABEL_1', 'score': 0.97}, ...]
        if results and isinstance(results, list):
            top = results[0]
            label = str(top.get("label", "LABEL_0")).upper()
            score = float(top.get("score", 0.0))
            return label, score
        raise ValueError(f"Unexpected pipeline output: {results}")
    finally:
        # Aggressively unload model from memory
        try:
            del pipe
        except Exception:
            pass
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        gc.collect()


def query_hf_classification(
    model_id: str,
    text: str,
    temperature: float = 2.0,
    max_chars: int = 512,
    model_name: str = "Bias Model",
) -> float:
    """
    Run local on-demand inference for a fine-tuned DistilBERT classification model.
    Applies temperature scaling and clamping [0.05, 0.95].
    Emits server-side debug logging for model auditing.

    Strategy:
      1. Load model via transformers.pipeline (lazy, single-model, offloaded after use).
      2. Apply Temperature Scaling (T=2.0) to calibrate probabilities.
      3. Clamp result to [0.05, 0.95].

    Returns:
        float in [0.05, 0.95] representing biased class probability.
    """
    if not text or not text.strip():
        final_val = 0.05
        print(f"\n==================================================")
        print(f"MODEL NAME: {model_name}")
        print(f"HF REPOSITORY: {model_id}")
        print(f"INPUT TEXT LENGTH: 0")
        print(f"RAW RESPONSE: EMPTY_INPUT")
        print(f"PARSED LABEL: LABEL_0")
        print(f"PARSED SCORE: 0.0")
        print(f"FINAL FLOAT RETURNED BY predict(text): {final_val}")
        print(f"==================================================")
        return final_val

    token = _get_hf_token()
    truncated_text = text.strip()[:max_chars]

    parsed_label = None
    parsed_score = None

    # Load model locally and run inference (single-model, offloaded after use)
    try:
        raw_label, raw_score = _infer_with_pipeline(model_id, truncated_text, token)

        # Determine biased-class probability from the returned label
        if "1" in raw_label or "BIAS" in raw_label or raw_label == "POSITIVE":
            parsed_label = raw_label
            parsed_score = raw_score
        elif "0" in raw_label or "NEUTRAL" in raw_label or raw_label == "NEGATIVE":
            # LABEL_0 is the "not-biased" class; derive LABEL_1 probability
            parsed_label = "LABEL_1 (derived from LABEL_0)"
            parsed_score = 1.0 - raw_score
        else:
            parsed_label = raw_label
            parsed_score = raw_score

    except Exception as exc:
        logger.error(
            "Inference execution failed for %s (%s): %s", model_name, model_id, exc
        )
        raise RuntimeError(
            f"Inference failure for {model_name} on {model_id}: {exc}"
        )

    # Apply Temperature Scaling (T=2.0)
    # p_T = 1 / (1 + ((1 - p) / p) ** (1 / T))
    biased_prob = max(1e-6, min(1.0 - 1e-6, float(parsed_score)))
    if temperature > 0 and temperature != 1.0:
        ratio = (1.0 - biased_prob) / biased_prob
        scaled_prob = 1.0 / (1.0 + math.pow(ratio, 1.0 / temperature))
    else:
        scaled_prob = biased_prob

    # Probability Clamping [0.05, 0.95] and rounding
    clamped_prob = max(0.05, min(0.95, scaled_prob))
    final_float = round(clamped_prob, 4)

    # Server-Side Debug Logging
    print(f"\n==================================================")
    print(f"MODEL NAME: {model_name}")
    print(f"HF REPOSITORY: {model_id}")
    print(f"INPUT TEXT LENGTH: {len(truncated_text)}")
    print(f"PARSED LABEL: {parsed_label}")
    print(f"PARSED SCORE (raw): {parsed_score}")
    print(f"SCALED PROB (T={temperature}): {scaled_prob:.4f}")
    print(f"FINAL FLOAT RETURNED BY predict(text): {final_float}")
    print(f"==================================================")

    return final_float
