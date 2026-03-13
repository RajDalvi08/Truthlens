"""
Analyze Router
===============
POST /analyze — analyse a single news article for bias.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from services.article_fetcher import fetch_article
from services.preprocessing import clean_article
from services.bias_engine import analyze_bias

router = APIRouter(prefix="/analyze", tags=["Analysis"])


# -------------------------
# Request / Response schemas
# -------------------------
class AnalyzeRequest(BaseModel):
    url: HttpUrl


class AnalyzeResponse(BaseModel):
    headline: str
    bias_score: float
    bias_level: str
    linguistic_bias: float
    framing_bias: float
    entity_bias: float


# -------------------------
# Endpoint
# -------------------------
@router.post("/", response_model=AnalyzeResponse)
def analyze_article(payload: AnalyzeRequest):
    """
    Fetch an article by URL, extract text and headline, run it through all 
    three bias models, and return the combined bias analysis.
    """
    url_str = str(payload.url)

    # 1. Fetch article
    try:
        raw_article = fetch_article(url_str)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to fetch article: {exc}",
        )

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
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Bias analysis failed: {exc}",
        )

    return AnalyzeResponse(**result)
