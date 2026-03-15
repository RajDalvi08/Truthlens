"""
Comparison Engine Service
==========================
Compares bias analysis results between two articles.
"""

from services.bias_engine import analyze_bias


def compare_articles(article1: dict, article2: dict) -> dict:
    """
    Analyse two articles for bias and compute the difference.

    Args:
        article1: Preprocessed dict of the first article.
        article2: Preprocessed dict of the second article.

    Returns:
        Dictionary with individual bias scores and their absolute difference.
    """
    result1 = analyze_bias(article1)
    result2 = analyze_bias(article2)

    bias_difference = round(abs(result1["bias_score"] - result2["bias_score"]), 2)

    return {
        "article_1": result1,
        "article_2": result2,
        "bias_difference": bias_difference,
    }
