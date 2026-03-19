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
LINGUISTIC_WEIGHT: float = 0.45
FRAMING_WEIGHT: float = 0.40
ENTITY_WEIGHT: float = 0.15


def normalize(score: float) -> float:
    return min(max(score, 0.05), 0.90)

def combine_scores(
    linguistic: float,
    framing: float,
    entity: float,
    text: str = ""
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

    adjusted_score = math.sqrt(base_score)
    final_score = adjusted_score * 100 * 0.90
    final_score = round(final_score, 2)

    # Determine Bias Level with more granular descriptive bands
    if final_score < 30:
        bias_level = "Low Bias"
    elif final_score < 60:
        bias_level = "Moderate Bias"
    elif final_score < 80:
        bias_level = "Moderate-High Bias"
    else:
        bias_level = "Strong Bias"

    return {
        "score": final_score,
        "level": bias_level
    }
