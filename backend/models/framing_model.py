import re

def predict(text: str) -> float:
    """
    Mock Framing Bias Model.
    Analyzes how a story is "packaged" or the ideological angle.
    Returns a probability relative to bias (0.0 to 1.0).
    """
    text = text.lower()
    
    # Framing markers (ideological or emotive framing)
    framing_markers = [
        "narrative", "mainstream", "agenda", "propaganda", "exposed",
        "unveiled", "secret", "truth about", "hidden", "war on", "attack on"
    ]
    
    matches = sum(1 for marker in framing_markers if re.search(r'\b' + marker + r'\b', text))
    
    # Base probability 0.15
    score = 0.15 + (matches * 0.2)
    
    return min(1.0, score)
