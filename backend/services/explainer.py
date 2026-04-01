"""
Explanation Generator Service
============================
Provides human-readable explanations for bias scores.
"""

import re

def get_bias_label(score: float) -> str:
    if score >= 80:
        return "Strong Bias"
    elif score >= 60:
        return "Moderate-High Bias"
    elif score >= 40:
        return "Moderate Bias"
    else:
        return "Low Bias"

def extract_key_sentences(text, indicators):
    sentences = re.split(r'(?<=[.!?])\s+', text)

    matched = []

    for sent in sentences:
        for word in indicators:
            if re.search(rf'\b{re.escape(word)}\b', sent, re.IGNORECASE):
                matched.append(sent.strip())
                break

    return matched[:2]

def generate_explanation(text, indicators, score):
    explanation = []

    key_sentences = extract_key_sentences(text, indicators)

    # 1. Use real article content if available
    if len(key_sentences) >= 2:
        explanation.append(
            f'The article includes statements such as "{key_sentences[0]}" and "{key_sentences[1]}", indicating subjective or emotionally influenced language.'
        )
    elif len(key_sentences) == 1:
        explanation.append(
            f'The article includes statements such as "{key_sentences[0]}", indicating subjective or emotionally influenced language.'
        )

    # 2. If no sentence matched → fallback
    if not key_sentences:
        explanation.append(
            "The article expresses bias through tone and framing rather than explicit keywords."
        )

    # 3. Score-based reasoning (clean, no templates)
    if score >= 75:
        explanation.append(
            "The overall tone strongly pushes a one-sided perspective, resulting in high bias."
        )
    elif score >= 60:
        explanation.append(
            "The article leans toward a specific viewpoint, showing noticeable bias in presentation."
        )
    elif score >= 40:
        explanation.append(
            "Some selective emphasis and framing are present, indicating moderate bias."
        )
    else:
        explanation.append(
            "The article remains mostly neutral with minimal subjective influence."
        )

    # 4. FINAL SAFETY (never empty)
    if not explanation:
        explanation.append(
            "The article shows measurable bias based on linguistic and framing analysis."
        )

    return explanation


def extract_bias_indicators(text: str) -> tuple[list[str], float]:
    """
    Identifies emotionally strong words, subjective phrases, and repeated emphasis.
    Returns highly impactful phrases based on an aggressive filter.
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
        "catastrophic", "scandalous", "appalling", "triumph", "miracle",
        "collapse", "dangerous", "devastating", "disaster", 
        "reckless", "irresponsible", "shocking", "poorly", "biased", "unfair",
        "concern", "concerns", "critic", "critics", "criticized",
        "suggests", "suggested", "argues", "argued",
        "claims", "claimed", "questions", "questioned",
        "controversial", "debate", "debated",
        "mixed", "uncertain", "doubt", "doubts",
        "appears", "seems", "likely"
    ]
    
    found_keywords = []
    for word in bias_keywords:
        if re.search(r'\b' + re.escape(word) + r'\b', text_lower):
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

    # 3. Repeated emphasis
    words = re.findall(r'\b\w{5,}\b', text_lower)
    counts = Counter(words)
    repeated = [word for word, count in counts.items() if count >= 3]

    all_indicators = list(dict.fromkeys(found_phrases + found_keywords + repeated))
    raw_indicators = [idx.title() for idx in all_indicators[:10]]
    
    STRONG_BIAS_WORDS = [
        "failure", "disaster", "catastrophic", "radical",
        "reckless", "dangerous", "irresponsible", "extreme",
        "collapse", "crisis", "devastating", "shocking",
        "poorly", "biased", "unfair", "outrageous"
    ]
    
    MODERATE_BIAS_WORDS = [
        "concern", "concerns", "critic", "critics", "criticized",
        "suggests", "suggested", "argues", "argued",
        "claims", "claimed", "questions", "questioned",
        "controversial", "debate", "debated",
        "mixed", "uncertain", "doubt", "doubts",
        "appears", "seems", "likely"
    ]
    
    ALL_BIAS_WORDS = STRONG_BIAS_WORDS + MODERATE_BIAS_WORDS
    
    filtered_indicators = [
        word for word in raw_indicators if word.lower() in ALL_BIAS_WORDS
    ]

    score_boost = 0.0
    for word in filtered_indicators:
        w_lower = word.lower()
        if w_lower in STRONG_BIAS_WORDS:
            score_boost += 0.08
        elif w_lower in MODERATE_BIAS_WORDS:
            score_boost += 0.03
            
    score_boost = min(score_boost, 0.15)
    
    return filtered_indicators, score_boost
