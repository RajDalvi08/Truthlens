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
    # Clamp score for safety
    val = max(0, min(100, score))
    
    # Return a styled HTML bar
    return f"""
    <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 99px; overflow: hidden; margin-top: 8px;">
        <div style="width: {val}%; height: 100%; background: linear-gradient(90deg, #6366f1, #06b6d4, #a855f7); box-shadow: 0 0 8px rgba(6,182,212,0.4);"></div>
    </div>
    """
