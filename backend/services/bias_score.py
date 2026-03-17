"""
Bias Score Aggregation Service
================================
Combines individual bias model scores into a single overall bias score.
"""

# Reduced entity weight to prevent topic-based false positives
# Balanced framing and linguistic for better conceptual capture
LINGUISTIC_WEIGHT = 0.45
FRAMING_WEIGHT = 0.40
ENTITY_WEIGHT = 0.15


def combine_scores(
    linguistic: float,
    framing: float,
    entity: float,
) -> dict:
    """
    Compute a weighted-average bias score scaled to 0–100.
    """
    bias_score = (
        linguistic * LINGUISTIC_WEIGHT +
        framing * FRAMING_WEIGHT +
        entity * ENTITY_WEIGHT
    ) * 100

    bias_score = round(bias_score, 2)

    # Determine Bias Level with more granular descriptive bands
    if bias_score < 40:
        bias_level = "Low Bias"
    elif bias_score < 70:
        bias_level = "Moderate Bias"
    else:
        bias_level = "Strong Bias"

    return {
        "score": bias_score,
        "level": bias_level
    }
