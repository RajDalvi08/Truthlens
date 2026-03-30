"""
Bias Score Aggregation Service
================================
Combines individual bias model scores into a single overall bias score.
"""
import math
import re
from typing import Any

# Reduced entity weight to prevent topic-based false positives
# Balanced framing and linguistic for better conceptual capture
LINGUISTIC_WEIGHT: float = 0.40
FRAMING_WEIGHT: float = 0.45
ENTITY_WEIGHT: float = 0.15


def normalize(score: float) -> float:
    return min(max(score, 0.05), 0.90)

def combine_scores(
    linguistic: float,
    framing: float,
    entity: float,
    text: str = "",
    score_boost: float = 0.0
) -> dict[str, float | str]:
    """
    Compute a weighted-average bias score scaled to 0–100.
    """
    # Step 2: Use regex for real quoted segments (avoids contractions/possessives)
    if re.findall(r'".+?"', text):
        linguistic = linguistic * 0.80

    linguistic = normalize(linguistic)
    framing = normalize(framing)
    entity = normalize(entity)

    base_score = (
        linguistic * LINGUISTIC_WEIGHT +
        framing * FRAMING_WEIGHT +
        entity * ENTITY_WEIGHT
    )

    base_score += score_boost
    base_score = min(base_score, 0.95)

    # Step 2: apply sqrt scaling
    sqrt_component = math.sqrt(base_score)

    # Step 3: blend with linear score to reduce inflation
    adjusted_score = (sqrt_component * 0.25) + (base_score * 0.75)

    # Step 4: final scaling
    final_score = adjusted_score * 100 * 0.90

    # apply correction only to mid-range scores
    if 0.45 < base_score < 0.75:
        final_score *= 0.96

    # Extreme boosting and reducing based on base_score
    if base_score > 0.75:
        final_score *= 1.08
    elif base_score < 0.30:
        final_score *= 0.96

    if 40 <= final_score <= 60:
        final_score *= 1.08

    # Step 5: rounding
    final_score = round(final_score, 2)

    # Determine Bias Level with more granular descriptive bands
    if final_score >= 75:
        bias_level = "Strong Bias"
    elif final_score >= 60:
        bias_level = "Moderate-High Bias"
    elif final_score >= 40:
        bias_level = "Moderate Bias"
    else:
        bias_level = "Low Bias"

    return {
        "score": final_score,
        "level": bias_level
    }
