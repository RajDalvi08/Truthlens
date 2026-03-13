"""
Compare Router
===============
POST /compare — compare bias between two news articles.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from services.article_fetcher import fetch_article
from services.preprocessing import clean_article
from services.comparison_engine import compare_articles

router = APIRouter(prefix="/compare", tags=["Comparison"])


# -------------------------
# Request / Response schemas
# -------------------------
class CompareRequest(BaseModel):
    url1: HttpUrl
    url2: HttpUrl


class BiasResult(BaseModel):
    headline: str
    bias_score: float
    bias_level: str
    linguistic_bias: float
    framing_bias: float
    entity_bias: float


class CompareResponse(BaseModel):
    article_1: BiasResult
    article_2: BiasResult
    bias_difference: float


# -------------------------
# Endpoint
# -------------------------
@router.post("/", response_model=CompareResponse)
def compare_two_articles(payload: CompareRequest):
    """
    Fetch two articles, extract and clean their text, analyse each for bias, 
    and return a side-by-side comparison including the absolute difference.
    """
    url1_str = str(payload.url1)
    url2_str = str(payload.url2)

    # 1. Fetch both articles
    try:
        raw1 = fetch_article(url1_str)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to fetch article 1 ({url1_str}): {exc}",
        )

    try:
        raw2 = fetch_article(url2_str)
    except Exception as exc:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to fetch article 2 ({url2_str}): {exc}",
        )

    # 2. Preprocess
    cleaned1 = clean_article(raw1)
    cleaned2 = clean_article(raw2)

    if not cleaned1["text"]:
        raise HTTPException(
            status_code=422,
            detail="Article 1 text is empty after preprocessing.",
        )
    if not cleaned2["text"]:
        raise HTTPException(
            status_code=422,
            detail="Article 2 text is empty after preprocessing.",
        )

    # 3. Compare
    try:
        comparison = compare_articles(cleaned1, cleaned2)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Comparison failed: {exc}",
        )

    return CompareResponse(**comparison)
