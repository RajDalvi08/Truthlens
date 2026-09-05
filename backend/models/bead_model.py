"""
BEAD Entity Bias Model
=======================
Queries the fine-tuned DistilBERT model trained for entity-level bias detection.
"""

from models.hf_client import query_hf_classification

HF_REPO_ID = "vins01-07/truthlens-BEAD-entity-bias"


def predict(text: str) -> float:
    """
    Return the probability that the given text is biased
    according to the BEAD entity bias model.

    Args:
        text: Preprocessed article text.

    Returns:
        float in [0.05, 0.95] — probability of entity bias.
    """
    return query_hf_classification(
        model_id=HF_REPO_ID,
        text=text,
        temperature=2.0,
        max_chars=1500,
        model_name="BEAD Entity Bias",
    )