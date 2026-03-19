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
