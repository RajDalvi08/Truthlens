"""
Analyze Router
===============
POST /analyze — analyse a single news article for bias.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl, model_validator
from typing import Optional

from services.article_fetcher import fetch_article
from services.preprocessing import clean_article
from services.bias_engine import analyze_bias

router = APIRouter(prefix="/analyze", tags=["Analysis"])


# -------------------------
# Request / Response schemas
# -------------------------
class AnalyzeRequest(BaseModel):
    url: Optional[HttpUrl] = None
    headline: Optional[str] = None
    text: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def require_url_or_text(cls, values):
        if not values.get("url") and not values.get("text"):
            raise ValueError("Either 'url' or 'text' must be provided.")
        return values


class AnalyzeResponse(BaseModel):
    headline: Optional[str] = None
    bias_score: float
    bias_level: str
    linguistic_bias: float
    framing_bias: float
    entity_bias: float
    source: str


# -------------------------
# Endpoint
# -------------------------
@router.post("/", response_model=AnalyzeResponse)
def analyze_article(payload: AnalyzeRequest):
    """Fetch an article by URL or analyze raw text, then return bias analysis."""

    # 1. Acquire raw article data
    if payload.url:
        try:
            raw_article = fetch_article(str(payload.url))
        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Failed to fetch article: {exc}",
            )
    else:
        raw_article = {
            "headline": payload.headline or None,
            "text": payload.text or "",
            "source": "manual",
        }

    # 2. Preprocess
    cleaned_article = clean_article(raw_article)
    if not cleaned_article["text"]:
        raise HTTPException(
            status_code=422,
            detail="Article text is empty after preprocessing.",
        )

    # 3. Bias analysis
    try:
        result = analyze_bias(cleaned_article)
        # Restore original headline from raw_article to preserve case in the response
        result["headline"] = raw_article.get("headline")
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Bias analysis failed: {exc}",
        )

    return AnalyzeResponse(**result)
