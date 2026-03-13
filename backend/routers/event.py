"""
Event Router
=============
POST /compare_event — analyze and compare multiple outlets for a single event.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from services.event_compare import compare_event
from typing import List

router = APIRouter(prefix="/compare_event", tags=["Event Comparison"])

class EventRequest(BaseModel):
    url: HttpUrl

class ArticleResult(BaseModel):
    source: str
    headline: str
    bias_score: float
    bias_level: str
    bias_visual: str
    linguistic_bias: float
    framing_bias: float
    entity_bias: float

class EventComparisonResponse(BaseModel):
    event: str
    articles: List[ArticleResult]

@router.post("/", response_model=EventComparisonResponse)
def compare_event_bias(payload: EventRequest):
    """
    Accept an article URL, find related coverage, and compare bias across all outlets.
    """
    url_str = str(payload.url)
    
    try:
        result = compare_event(url_str)
        if "error" in result:
            raise HTTPException(status_code=422, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Event comparison failed: {str(e)}")
