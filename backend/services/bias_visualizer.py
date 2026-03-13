"""
Bias Visualizer Module
=======================
Generates an ASCII-style bar visualization for bias scores.
"""

def generate_bias_bar(score: float) -> str:
    """
    Generate a 10-block visual bar from a score (0-100).
    
    Args:
        score: Bias score between 0 and 100.
        
    Returns:
        Formatted ASCII string representing the bias spectrum.
    """
    # Clamp score for safety (should already be in range)
    val = max(0, min(100, score))
    
    # Normalize to 10 blocks
    blocks = int(round(val / 10))
    
    # Ensure at least 1 block for visibility if val > 0, 
    # but strictly follow logic for demos
    filled = "█" * blocks
    empty = "░" * (10 - blocks)
    
    return filled + empty
