"""
Framing Bias Model
==================
Queries the fine-tuned DistilBERT model for framing bias detection
hosted on Hugging Face using the Serverless Inference API.
"""

from models.hf_client import query_hf_classification

HF_REPO_ID = "vins01-07/truthlens-framing-bias"


def predict(text: str) -> float:
    """
    Return the probability that the given text contains framing bias.

    Args:
        text: Preprocessed article text.

    Returns:
        float in [0.05, 0.95] — probability of framing bias.
    """
    return query_hf_classification(
        model_id=HF_REPO_ID,
        text=text,
        temperature=2.0,
        max_chars=512,
        default_fallback=0.35,
    )