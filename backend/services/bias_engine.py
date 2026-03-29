import re
from typing import List
from models.linguistic_model import predict as predict_linguistic
from models.framing_model import predict as predict_framing
from models.bead_model import predict as predict_entity
from services.bias_score import combine_scores
from services.nlp_utils import split_text, has_named_entities, extract_entities
from services.bias_visualizer import generate_bias_bar
from services.explainer import generate_explanation, extract_bias_indicators


def _check_reporting_tone(text: str) -> float:
    """
    Analyzes the text for objective reporting markers vs subjective/emotional language.
    Returns a dampening factor (0.0 to 1.0). 1.0 means highly subjective, 
    0.5 means neutral, <0.4 means very objective/descriptive.
    """
    text = text.lower()
    
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
    
    obj_count = sum(1 for m in objective_markers if re.search(m, text))
    sub_count = sum(1 for m in subjective_markers if re.search(m, text))
    
    # Base dampener
    dampener = 0.8  # Start at slightly reduced
    
    if obj_count > sub_count:
        # High density of reporting markers relative to emotional language
        dampener -= 0.3 * (obj_count / (obj_count + sub_count + 1))
    elif sub_count > obj_count:
        # Emotional language dominates
        dampener += 0.2
        
    return max(0.4, min(1.0, dampener))


def analyze_bias(article: dict) -> dict:
    """
    Run all three bias models on the given article dict and return a combined result.
    Splits long articles into chunks and uses a balanced average aggregation.
    """
    headline = article.get("headline", "").strip()
    text = article.get("text", "").strip()
    
    if headline:
        full_text = f"{headline} {text}".strip()
    else:
        full_text = text

    print("TEXT LENGTH:", len(full_text))
    print("TEXT SAMPLE:", full_text[:200])

    # Calculate neutrality dampener for the whole text
    neutrality_dampener = _check_reporting_tone(full_text)

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
        # 1. Linguistic Bias (Scaled by neutrality)
        l_score = predict_linguistic(chunk) * neutrality_dampener
        lin_scores.append(l_score)
        
        # 2. Framing Bias
        fra_scores.append(predict_framing(chunk))
        
        # 3. Entity Bias (BEAD)
        e_prob = predict_entity(chunk)
        if not text_has_entities:
            e_prob *= 0.4  # Stronger reduction for no entities
        else:
            # Even with entities, if context is neutral, reduce weight
            e_prob *= neutrality_dampener
        ent_scores.append(e_prob)

    def calculate_aggregation(scores: List[float]) -> float:
        if not scores:
            return 0.0
        # More conservative aggregation: 90% average, 10% max peak
        # This prevents a single 'hot' sentence from ruining a neutral article.
        avg_score = float(sum(scores) / len(scores))
        max_score = float(max(scores))
        return 0.9 * avg_score + 0.1 * max_score

    # Compute final probabilities across chunks
    final_linguistic = round(float(calculate_aggregation(lin_scores)), 4)
    final_framing = round(float(calculate_aggregation(fra_scores)), 4)
    final_entity = round(float(calculate_aggregation(ent_scores)), 4)

    # Combine into final score
    score_data = combine_scores(final_linguistic, final_framing, final_entity, full_text)

    # Final explainability features
    entities = extract_entities(full_text)
    explanation = generate_explanation(
        final_linguistic,
        final_framing,
        final_entity,
        score_data["score"]
    )

    print("FINAL ENTITIES:", entities)
    print("EXPLANATION:", explanation)

    return {
        "headline": headline,
        "bias_score": score_data["score"],
        "bias_level": score_data["level"],
        "linguistic_bias": final_linguistic,
        "framing_bias": final_framing,
        "entity_bias": final_entity,
        "bias_visual": generate_bias_bar(score_data["score"]),
        "source": article.get("source", ""),
        "entities": {
            "persons": entities["persons"],
            "organizations": entities["organizations"]
        },
        "explanation": explanation,
        "indicators": extract_bias_indicators(full_text)
    }
