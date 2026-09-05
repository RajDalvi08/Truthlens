"""
Bias Analysis Engine
====================
Orchestrates the multi-model bias detection pipeline:
- Linguistic, Framing, and BEAD Entity inference
- Deterministic article-grounded indicator extraction
- Mathematical score aggregation (bias_score.py)
- Context-aware LLM explanation generation with deterministic fallback
"""

import re
import logging
from typing import List, Dict, Any

from models.linguistic_model import predict as predict_linguistic
from models.framing_model import predict as predict_framing
from models.bead_model import predict as predict_entity
from services.bias_score import combine_scores
from services.nlp_utils import split_text, has_named_entities, extract_entities
from services.bias_visualizer import generate_bias_bar
from services.explainer import (
    generate_explanation,
    extract_bias_indicators,
    extract_key_sentences,
    STRONG_BIAS_TERMS,
    MODERATE_BIAS_TERMS,
)
from services.ai_explainer import generate_llm_explanation

logger = logging.getLogger("truthlens.bias_engine")


def _check_reporting_tone(text: str) -> float:
    """
    Analyzes the text for objective reporting markers vs subjective/emotional language.
    Returns a dampening factor (0.4 to 1.0). 1.0 means highly subjective,
    0.5 means neutral, <0.4 means very objective/descriptive.
    """
    text_lower = text.lower()

    # Objective markers: Attribute statements, official references, research
    objective_markers = [
        r"according to", r"stated that", r"reported by", r"officials said",
        r"press release", r"spokesperson", r"in a statement", r"research shows",
        r"data indicates", r"confirmed that", r"previously", r"during a"
    ]

    # Subjective/Emotional markers: Adjectives and framing words
    subjective_markers = [
        r"staggering", r"outrageous", r"shocking", r"brave", r"cowardly",
        r"tyrant", r"heroic", r"disastrous", r"unbelievable", r"obviously",
        r"clearly", r"everyone knows", r"radical", r"extreme", r"unjust"
    ]

    obj_count = sum(1 for m in objective_markers if re.search(m, text_lower))
    sub_count = sum(1 for m in subjective_markers if re.search(m, text_lower))

    dampener = 0.8  # Start at baseline dampener

    if obj_count > sub_count:
        dampener -= 0.3 * (obj_count / (obj_count + sub_count + 1))
    elif sub_count > obj_count:
        dampener += 0.2

    return max(0.4, min(1.0, dampener))


def analyze_bias(article: dict) -> dict:
    """
    Run all three bias models on the given article dict and return the combined analysis.
    The scoring pipeline strictly follows:
      models -> existing scoring system -> final score -> final bias level
    followed by context-aware LLM explanation generation.
    """
    headline = article.get("headline", "") or ""
    text = article.get("text", "") or ""

    if headline.strip():
        full_text = f"{headline.strip()} {text.strip()}".strip()
    else:
        full_text = text.strip()

    # Calculate neutrality dampener for reporting tone
    neutrality_dampener = _check_reporting_tone(full_text)

    # Handle long articles by splitting into chunks
    chunks = split_text(full_text, max_chars=1500)
    if not chunks:
        chunks = [full_text]

    lin_scores = []
    fra_scores = []
    ent_scores = []

    text_has_entities = has_named_entities(full_text)
    entities = extract_entities(full_text)

    # 1. Run inference across chunks
    for chunk in chunks:
        # Linguistic Bias (scaled by reporting tone)
        l_score = predict_linguistic(chunk) * neutrality_dampener
        lin_scores.append(l_score)

        # Framing Bias
        fra_scores.append(predict_framing(chunk))

        # Entity Bias (BEAD)
        e_prob = predict_entity(chunk)
        if not text_has_entities:
            e_prob *= 0.4  # Reduction when no named entities exist
        else:
            e_prob *= neutrality_dampener
        ent_scores.append(e_prob)

    def calculate_aggregation(scores: List[float]) -> float:
        if not scores:
            return 0.0
        # 90% average, 10% peak
        avg_score = float(sum(scores) / len(scores))
        max_score = float(max(scores))
        return 0.9 * avg_score + 0.1 * max_score

    final_linguistic = round(float(calculate_aggregation(lin_scores)), 4)
    final_framing = round(float(calculate_aggregation(fra_scores)), 4)
    final_entity = round(float(calculate_aggregation(ent_scores)), 4)

    # 2. Extract deterministic bias indicators from the ACTUAL ARTICLE TEXT
    indicators, score_boost = extract_bias_indicators(full_text)
    strong_count = sum(1 for ind in indicators if ind.lower() in STRONG_BIAS_TERMS)
    moderate_count = sum(1 for ind in indicators if ind.lower() in MODERATE_BIAS_TERMS)

    # 3. Compute final bias score using UNMODIFIED existing scoring mathematics
    score_data = combine_scores(
        final_linguistic,
        final_framing,
        final_entity,
        full_text,
        score_boost
    )

    # 4. Extract key sentences containing detected indicators for LLM & fallback
    key_sentences = extract_key_sentences(full_text, indicators)

    # 5. Generate Fallback Explanation
    fallback_explanation = generate_explanation(
        text=full_text,
        indicators=indicators,
        score=score_data["score"],
        level=score_data["level"]
    )

    # 6. Generate Context-Aware LLM Explanation (Explanation Layer Only)
    explanation = fallback_explanation
    try:
        model_scores = {
            "linguistic": final_linguistic,
            "framing": final_framing,
            "entity": final_entity,
        }
        ai_exp = generate_llm_explanation(
            text=full_text,
            score=score_data["score"],
            level=score_data["level"],
            indicators=indicators,
            strong_count=strong_count,
            moderate_count=moderate_count,
            model_scores=model_scores,
            key_sentences=key_sentences,
        )
        if ai_exp and len(ai_exp) > 25:
            # Split explanation into readable sentences/paragraphs for UI display
            sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', ai_exp) if len(s.strip()) > 10]
            explanation = sentences if sentences else [ai_exp]
    except Exception as exc:
        logger.warning("LLM explanation failed, falling back to deterministic explanation: %s", exc)
        explanation = fallback_explanation

    return {
        "headline": headline,
        "bias_score": score_data["score"],
        "bias_level": score_data["level"],
        "linguistic_bias": final_linguistic,
        "framing_bias": final_framing,
        "entity_bias": final_entity,
        "indicators": indicators,
        "entities": {
            "persons": entities.get("persons", []),
            "organizations": entities.get("organizations", [])
        },
        "explanation": explanation,
        "bias_visual": generate_bias_bar(score_data["score"]),
        "source": article.get("source", "manual"),
    }
