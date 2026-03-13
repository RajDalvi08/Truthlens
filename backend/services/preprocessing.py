"""
Text Preprocessing Service
============================
Cleans and normalizes article text before model inference.
"""

import re
import string


def clean_text(text: str) -> str:
    """Helper function to clean a single string."""
    if not text:
        return ""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation (DISABLED: Transformers need punctuation for context)
    # text = text.translate(str.maketrans("", "", string.punctuation))
    # Normalize whitespace (collapse multiple spaces / newlines)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean_article(article: dict) -> dict:
    """
    Clean and normalize article headline and text.

    Args:
        article: Dict with 'headline' and 'text'.

    Returns:
        Dict with cleaned 'headline' and 'text'.
    """
    cleaned_headline = clean_text(article.get("headline", ""))
    cleaned_text = clean_text(article.get("text", ""))
    
    return {
        "headline": cleaned_headline,
        "text": cleaned_text,
        "source": article.get("source", "")
    }
