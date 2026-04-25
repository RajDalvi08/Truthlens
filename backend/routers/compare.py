"""
Compare Router
===============
POST /compare — compare bias between two news articles.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl, model_validator
from typing import Optional

from services.article_fetcher import fetch_article
from services.preprocessing import clean_article
from services.comparison_engine import compare_articles
from services.persistence_service import save_analysis

router = APIRouter(prefix="/compare", tags=["Comparison"])


# -------------------------
# Request / Response schemas
# -------------------------
class CompareRequest(BaseModel):
    url1: Optional[str] = None
    url2: Optional[str] = None
    text1: Optional[str] = None
    text2: Optional[str] = None

    @model_validator(mode='before')
    @classmethod
    def require_urls_or_texts(cls, values):
        if not (values.get("url1") or values.get("text1")):
            raise ValueError("Provide either url1 or text1 for article 1.")
        if not (values.get("url2") or values.get("text2")):
            raise ValueError("Provide either url2 or text2 for article 2.")
        return values


class BiasResult(BaseModel):
    headline: str
    bias_score: float
    bias_level: str
    linguistic_bias: float
    framing_bias: float
    entity_bias: float
    bias_visual: str
    source: str


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
    # 1. Acquire raw article data (URL fetch or direct text)
    if payload.url1:
        url1_str = str(payload.url1)
        try:
            raw1 = fetch_article(url1_str)
        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Failed to fetch article 1 ({url1_str}): {exc}",
            )
    else:
        raw1 = {
            "headline": "",
            "text": payload.text1 or "",
            "source": "manual",
        }

    if payload.url2:
        url2_str = str(payload.url2)
        try:
            raw2 = fetch_article(url2_str)
        except Exception as exc:
            raise HTTPException(
                status_code=422,
                detail=f"Failed to fetch article 2 ({url2_str}): {exc}",
            )
    else:
        raw2 = {
            "headline": "",
            "text": payload.text2 or "",
            "source": "manual",
        }

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

    # 4. Persist
    save_analysis(comparison["article_1"])
    save_analysis(comparison["article_2"])

    return CompareResponse(**comparison)
