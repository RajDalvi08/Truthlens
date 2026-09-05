"""
AI Explainer Service
====================
Provides context-aware explanation generation via LLM.
STRICT BOUNDARY: The LLM is strictly an EXPLANATION LAYER.
It NEVER calculates, alters, classifies, calibrates, or overrides the bias score.
"""

import os
import requests
from typing import List, Dict, Any

# Candidate Groq models to query in order of preference
GROQ_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
    "groq/compound",
    "allam-2-7b"
]


def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ.setdefault(k.strip(), v.strip().strip("'\""))
        except Exception:
            pass


def _sanitize_text(text: str) -> str:
    """Normalize unicode smart quotes, hyphens, and markdown formatting."""
    replacements = {
        "\u2018": "'", "\u2019": "'", "\u201c": '"', "\u201d": '"',
        "\u2013": "-", "\u2014": "-", "\u2011": "-", "\u2026": "..."
    }
    for k, v in replacements.items():
        text = text.replace(k, v)
    return text.replace("**", "").replace("*", "").replace("`", "").strip()


def generate_llm_explanation(
    text: str,
    score: float,
    level: str,
    indicators: List[str],
    strong_count: int = 0,
    moderate_count: int = 0,
    model_scores: Dict[str, float] = None,
    key_sentences: List[str] = None,
) -> str:
    """
    Generate an article-specific explanation for the already-computed bias score.
    
    Args:
        text: Full article text.
        score: Precomputed final bias score (0-100).
        level: Precomputed final bias level ('Low Bias', 'Moderate Bias', etc.).
        indicators: Deterministically detected indicators from the article.
        strong_count: Number of detected strong bias indicators.
        moderate_count: Number of detected moderate bias indicators.
        model_scores: Dict with 'linguistic', 'framing', 'entity' scores.
        key_sentences: List of relevant article sentences containing indicators.

    Returns:
        String explanation citing specific article evidence, or empty string on failure.
    """
    load_env()
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return ""

    if model_scores is None:
        model_scores = {}
    if key_sentences is None:
        key_sentences = []

    sentences_block = "\n".join(f'- "{s}"' for s in key_sentences) if key_sentences else "None flagged explicitly."
    indicators_str = ", ".join(indicators) if indicators else "No explicit subjective keywords detected."

    prompt = f"""You are the explainability engine for TruthLens, an objective media bias analysis system.

The mathematical scoring pipeline has ALREADY evaluated the article and computed the final bias score.
Your ONLY task is to provide a 2 to 3 sentence explanation of WHY this specific article received this score, referencing the actual article content.

=== PRECOMPUTED AUDIT METRICS (DO NOT MODIFY) ===
- Final Calibrated Bias Score: {score}/100
- Final Bias Classification: {level}
- Model Breakdown:
  * Linguistic Bias: {model_scores.get('linguistic', 'N/A')}
  * Framing Bias: {model_scores.get('framing', 'N/A')}
  * Entity Bias: {model_scores.get('entity', 'N/A')}
- Detected Lexical Indicators ({strong_count} strong, {moderate_count} moderate):
  {indicators_str}
- Salient Sentences Flagged in Text:
{sentences_block}

=== FULL ARTICLE TEXT ===
{text}

=== MANDATORY RULES ===
1. STRICT SAFETY BOUNDARY: You are an EXPLANATION LAYER ONLY. You must NEVER calculate, dispute, recalculate, reclassify, or suggest an alternative bias score (e.g. NEVER say "The score should actually be X"). Accept the given score {score}/100 and level '{level}' as ground truth.
2. NO GENERIC TEMPLATES: Do NOT produce generic clichés like "The article shows bias due to strong wording."
3. CITE SPECIFIC EVIDENCE: Directly discuss the actual subject matter, specific words (quote them from the detected indicators), and the framing techniques used in THIS article.
4. If the score is Low, explain how the objective tone, attributed sources, and factual reportage support the low score.
5. If the score is Moderate or High, explain how the specific negative or one-sided phrasing affects neutrality.
6. OUTPUT LENGTH: Exactly 2 to 3 concise, clear sentences. No markdown headers, bullet points, asterisks, or bold tags."""

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    for model_choice in GROQ_MODELS:
        payload = {
            "model": model_choice,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 200
        }

        try:
            response = requests.post(url, headers=headers, json=payload, timeout=4.0)
            if response.status_code == 200:
                data = response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
                cleaned = _sanitize_text(content)
                if len(cleaned) > 25:
                    return cleaned
            elif response.status_code == 404:
                continue
            else:
                continue
        except Exception:
            continue

    return ""
