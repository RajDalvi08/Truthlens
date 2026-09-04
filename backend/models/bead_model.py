import re

def predict(text: str) -> float:
    """
    Mock BEAD Entity Bias Model.
    Focuses on how specific actors (People, Orgs) are portrayed.
    Returns a probability relative to bias (0.0 to 1.0).
    """
    text = text.lower()
    
    # Entity-specific markers (positive/negative portrayal)
    entity_markers = [
        "vile", "saintly", "monster", "legend", "traitor", "patriot",
        "dictator", "liberator", "criminal", "innocent"
    ]
    
    matches = sum(1 for marker in entity_markers if re.search(r'\b' + marker + r'\b', text))
    
    # Base probability 0.05
    score = 0.05 + (matches * 0.25)
    
    return min(1.0, score)
