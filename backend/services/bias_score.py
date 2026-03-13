"""
Bias Score Aggregation Service
================================
Combines individual bias model scores into a single overall bias score.
"""

# New weights to reduce framing dominance and prioritize linguistic reliability
LINGUISTIC_WEIGHT = 0.40
FRAMING_WEIGHT = 0.35
ENTITY_WEIGHT = 0.25


def combine_scores(
    linguistic: float,
    framing: float,
    entity: float,
) -> dict:
    """
    Compute a weighted-average bias score scaled to 0–100.
    Returns a dict with the final score and a confidence level (bias band).
    """
    bias_score = (
        linguistic * LINGUISTIC_WEIGHT +
        framing * FRAMING_WEIGHT +
        entity * ENTITY_WEIGHT
    ) * 100

    bias_score = round(bias_score, 2)

    # Determine Bias Level / Confidence Band
    if bias_score < 40:
        bias_level = "Low Bias"
    elif bias_score < 70:
        bias_level = "Moderate Bias"
    else:
        bias_level = "High Bias"

    return {
        "score": bias_score,
        "level": bias_level
    }
