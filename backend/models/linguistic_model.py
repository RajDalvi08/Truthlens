import re

def predict(text: str) -> float:
    """
    Mock Linguistic Bias Model.
    Detects biased language, inflammatory adjectives, and subjective intensifiers.
    Returns a probability relative to bias (0.0 to 1.0).
    """
    text = text.lower()
    
    # Subjective/Biased keywords
    biased_terms = [
        "shocking", "outrageous", "brave", "cowardly", "tyrant", "heroic",
        "disastrous", "unbelievable", "obviously", "radical", "extreme",
        "unjust", "staggering", "corrupt", "incompetent", "miserably"
    ]
    
    # Count occurrences
    matches = sum(1 for term in biased_terms if re.search(r'\b' + term + r'\b', text))
    
    # Simple heuristic: 0.1 per word found, capped at 1.0
    # Base probability is 0.1 (neutral-ish)
    score = 0.1 + (matches * 0.15)
    
    return min(1.0, score)
