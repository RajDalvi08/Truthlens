"""
Bias Engine Service
====================
Orchestrates all three bias models and produces a combined analysis result.
Supports long article chunking, hybrid scoring, and soft entity filtering.
"""

from models.linguistic_model import predict as predict_linguistic
from models.framing_model import predict as predict_framing
from models.bead_model import predict as predict_entity
from services.bias_score import combine_scores
from services.nlp_utils import split_text, has_named_entities


def analyze_bias(article: dict) -> dict:
    """
    Run all three bias models on the given article dict and return a combined result.
    Splits long articles into chunks and uses hybrid (avg/max) scoring.

    Args:
        article: Dict containing 'headline' and 'text'.

    Returns:
        Dictionary containing headline, combined bias score, and individual scores.
    """
    headline = article.get("headline", "").strip()
    text = article.get("text", "").strip()
    
    # Combine headline + text for general context
    if headline:
        full_text = f"{headline} {text}".strip()
    else:
        full_text = text

    # Handle long articles by splitting into chunks (approx 512 tokens / 1500 chars)
    chunks = split_text(full_text, max_chars=1500)
    if not chunks:
        chunks = [full_text]

    lin_scores = []
    fra_scores = []
    ent_scores = []

    # Check if text has any relevant named entities for BEAD filtering
    text_has_entities = has_named_entities(full_text)

    for chunk in chunks:
        # 1. Linguistic Bias
        lin_scores.append(predict_linguistic(chunk))
        
        # 2. Framing Bias
        fra_scores.append(predict_framing(chunk))
        
        # 3. Entity Bias (BEAD)
        e_prob = predict_entity(chunk)
        if not text_has_entities:
            # Apply soft reduction if no major entities found
            e_prob *= 0.5
        ent_scores.append(e_prob)

    def calculate_hybrid(scores):
        if not scores:
            return 0.0
        avg_score = sum(scores) / len(scores)
        max_score = max(scores)
        # Hybrid formula: 70% average + 30% max peak
        return 0.7 * avg_score + 0.3 * max_score

    # Compute final probabilities across chunks
    final_linguistic = round(calculate_hybrid(lin_scores), 4)
    final_framing = round(calculate_hybrid(fra_scores), 4)
    final_entity = round(calculate_hybrid(ent_scores), 4)

    # Combine into final score
    score_data = combine_scores(final_linguistic, final_framing, final_entity)

    return {
        "headline": headline,
        "bias_score": score_data["score"],
        "bias_level": score_data["level"],
        "linguistic_bias": final_linguistic,
        "framing_bias": final_framing,
        "entity_bias": final_entity,
    }
