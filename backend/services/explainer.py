"""
Explanation Generator Service
============================
Provides human-readable explanations for bias scores.
"""

def generate_explanation(linguistic: float, framing: float, entity: float, final_score: float) -> list[str]:
    """
    Generate a list of strings explaining the different components of the bias score.
    """
    explanation = []

    # 1. Linguistic Bias
    if linguistic > 0.7:
        explanation.append("The article uses emotionally loaded or subjective language.")
    elif linguistic < 0.3:
        explanation.append("The language is mostly neutral and factual.")

    # 2. Framing Bias
    if framing > 0.7:
        explanation.append("The article presents a strong narrative or perspective.")
    elif framing < 0.3:
        explanation.append("The article maintains a balanced narrative.")

    # 3. Entity Bias
    if entity > 0.6:
        explanation.append("Specific individuals or organizations are portrayed with noticeable bias.")
    elif entity < 0.3:
        explanation.append("No strong bias toward specific entities is detected.")

    # 4. Overall Assessment based on the Final Score
    if final_score >= 80:
        explanation.append("Overall, the article shows strong bias.")
    elif final_score >= 60:
        explanation.append("Overall, the article shows moderate to high bias.")
    elif final_score >= 30:
        explanation.append("Overall, the article shows moderate bias.")
    else:
        explanation.append("Overall, the article is relatively neutral.")

    return explanation


def extract_bias_indicators(text: str) -> list[str]:
    """
    Identifies emotionally strong words, subjective phrases, and repeated emphasis.
    Returns 5-10 impactful phrases.
    """
    import re
    from collections import Counter

    indicators = []
    text_lower = text.lower()

    # 1. Emotionally strong words / Subjective markers
    bias_keywords = [
        "crisis", "shock", "panic", "war", "failure", "disastrous", "staggering",
        "outrageous", "brave", "cowardly", "tyrant", "heroic", "unbelievable",
        "obviously", "clearly", "radical", "extreme", "unjust", "drastic",
        "catastrophic", "scandalous", "appalling", "triumph", "miracle"
    ]
    
    found_keywords = []
    for word in bias_keywords:
        if re.search(r'\b' + re.escape(word) + r'\b', text_lower):
            # Find the original casing from the text if possible, or just use the word
            found_keywords.append(word)

    # 2. Subjective phrases (simplified regex)
    subjective_patterns = [
        r"everyone knows", r"it is obvious that", r"clearly showing",
        r"without a doubt", r"total failure", r"complete success",
        r"unprecedented move", r"deeply concerning", r"highly controversial"
    ]
    
    found_phrases = []
    for pattern in subjective_patterns:
        if re.search(pattern, text_lower):
            found_phrases.append(pattern)

    # 3. Repeated emphasis (words repeated 3+ times, excluding common stop words)
    words = re.findall(r'\b\w{5,}\b', text_lower) # only words with 5+ chars
    counts = Counter(words)
    repeated = [word for word, count in counts.items() if count >= 3]

    # Combine and prioritize
    # We want a mix but capped at 10
    all_indicators = list(dict.fromkeys(found_phrases + found_keywords + repeated))
    
    # Clean up (capitalize for display)
    final_indicators = [idx.title() for idx in all_indicators[:10]]
    
    if not final_indicators:
        # Fallback if nothing found
        return ["Neutral Tone", "Factual Reporting"]
        
    return final_indicators
