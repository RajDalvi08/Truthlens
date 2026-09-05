"""
Explanation Generator Service
============================
Provides deterministic bias indicator extraction and article-specific logic tracing.
"""

import re
from typing import List, Tuple, Dict

# ---------------------------------------------------------------------------
# Indicator Taxonomy: Categorized into Strong and Moderate lexical markers
# ---------------------------------------------------------------------------
STRONG_BIAS_TERMS = [
    "disastrous", "catastrophic", "reckless", "irresponsible", "dangerous", "failure",
    "crisis", "panic", "tyrant", "cowardly", "heroic", "scandalous", "appalling",
    "collapse", "devastating", "disaster", "outrageous", "staggering", "drastic",
    "unjust", "extreme", "radical", "corruption", "corrupt", "miserably", "unbelievable",
    "shocking", "biased", "unfair", "poorly", "triumph", "miracle", "catastrophic failure",
    "total failure", "complete disaster"
]

MODERATE_BIAS_TERMS = [
    "concern", "concerns", "critic", "critics", "criticized", "criticism",
    "suggests", "suggested", "argues", "argued", "claims", "claimed",
    "questions", "questioned", "controversial", "debate", "debated",
    "mixed", "uncertain", "doubt", "doubts", "appears", "seems", "likely",
    "alleged", "allegedly", "purported", "purportedly", "supposedly",
    "deeply concerning", "highly controversial", "unprecedented move"
]


def extract_bias_indicators(text: str) -> Tuple[List[str], float]:
    """
    Extracts bias indicators strictly from the ACTUAL ARTICLE TEXT using
    deterministic case-insensitive matching with strict word boundaries.
    
    Preserves the distinction between strong and moderate indicators.
    Calculates mathematical score boost (+0.08 strong, +0.03 moderate, max 0.15).

    Returns:
        tuple of (list_of_detected_indicator_strings, score_boost_float)
    """
    if not text or not text.strip():
        return [], 0.0

    detected_strong = []
    detected_moderate = []

    # 1. Match Strong Indicators with word boundaries
    for term in STRONG_BIAS_TERMS:
        pattern = rf'\b{re.escape(term)}\b'
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            # Capitalize indicator nicely for display
            detected_strong.append(term.title())

    # 2. Match Moderate Indicators with word boundaries
    for term in MODERATE_BIAS_TERMS:
        pattern = rf'\b{re.escape(term)}\b'
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            term_title = term.title()
            if term_title not in detected_strong:
                detected_moderate.append(term_title)

    # Combine unique indicators preserving order
    all_detected = []
    seen = set()
    for item in detected_strong + detected_moderate:
        if item.lower() not in seen:
            seen.add(item.lower())
            all_detected.append(item)

    # 3. Calculate mathematical score boost
    # Strong = +0.08, Moderate = +0.03, capped at 0.15
    score_boost = 0.0
    for item in all_detected:
        if item.lower() in STRONG_BIAS_TERMS:
            score_boost += 0.08
        elif item.lower() in MODERATE_BIAS_TERMS:
            score_boost += 0.03

    score_boost = min(score_boost, 0.15)
    return all_detected, round(score_boost, 4)


def extract_key_sentences(text: str, indicators: List[str]) -> List[str]:
    """
    Extracts sentences from text that contain any of the detected indicators.
    """
    if not text or not text.strip():
        return []

    # Split on sentence terminals
    raw_sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    matched_sentences = []

    if indicators:
        for sent in raw_sentences:
            clean_sent = sent.strip()
            if not clean_sent:
                continue
            for ind in indicators:
                if re.search(rf'\b{re.escape(ind)}\b', clean_sent, re.IGNORECASE):
                    if clean_sent not in matched_sentences:
                        matched_sentences.append(clean_sent)
                    break
    
    # If no indicator match or no indicators, select the leading informative sentences
    if not matched_sentences and raw_sentences:
        matched_sentences = [s.strip() for s in raw_sentences if len(s.strip()) > 15][:2]

    # Truncate overly long individual sentences cleanly for explainability
    formatted = []
    for s in matched_sentences[:3]:
        if len(s) > 180:
            formatted.append(s[:177] + "...")
        else:
            formatted.append(s)
    return formatted


def generate_explanation(
    text: str,
    indicators: List[str],
    score: float,
    level: str = None
) -> List[str]:
    """
    Deterministic fallback explanation generator derived directly from the
    actual article text and detected indicators.
    """
    explanation = []
    key_sentences = extract_key_sentences(text, indicators)

    # 1. Evidence Citation from Actual Article
    if len(key_sentences) >= 2:
        explanation.append(
            f'The article employs targeted phrasing in statements such as "{key_sentences[0]}" and "{key_sentences[1]}".'
        )
    elif len(key_sentences) == 1:
        explanation.append(
            f'The text establishes perspective in statements such as "{key_sentences[0]}".'
        )

    # 2. Indicator Discussion
    if indicators:
        strong_matches = [i for i in indicators if i.lower() in STRONG_BIAS_TERMS]
        mod_matches = [i for i in indicators if i.lower() in MODERATE_BIAS_TERMS]
        
        detail_parts = []
        if strong_matches:
            quoted_strong = ", ".join(f'"{w}"' for w in strong_matches[:4])
            detail_parts.append(f'explicit evaluative language ({quoted_strong})')
        if mod_matches:
            quoted_mod = ", ".join(f'"{w}"' for w in mod_matches[:4])
            detail_parts.append(f'qualifying rhetoric ({quoted_mod})')
            
        if detail_parts:
            explanation.append(
                f'Specific lexical indicators including {" and ".join(detail_parts)} drive the assessed polarity.'
            )

    # 3. Score-aligned concluding reasoning
    if score >= 75:
        explanation.append(
            f"The dense concentration of emotionally charged descriptors produces a calibrated score of {score}/100 ('Strong Bias')."
        )
    elif score >= 60:
        explanation.append(
            f"The framing leans noticeably toward an interpretive narrative, resulting in a score of {score}/100 ('Moderate-High Bias')."
        )
    elif score >= 40:
        explanation.append(
            f"Selective emphasis and subjective terminology yield a score of {score}/100 ('Moderate Bias')."
        )
    else:
        if not explanation:
            explanation.append(
                "The text maintains an objective, descriptive reporting structure with neutral vocabulary and standard attribution."
            )
        explanation.append(
            f"Minimal subjective markers and balanced sourcing result in a calibrated score of {score}/100 ('Low Bias')."
        )

    return explanation
