"""
Dashboard Router
=================
GET endpoints that serve real-time analytics data to the frontend dashboard.
All data is sourced from the SQLite database — no mock values.
"""

from fastapi import APIRouter, Query
from database import (
    get_overview_stats,
    get_bias_timeseries,
    get_narrative_balance,
    get_recent_articles,
    get_regional_bias,
    get_bias_distribution,
    get_sentiment_correlation,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def dashboard_overview():
    """
    Returns high-level stats:
      total_articles, avg_bias_score, active_sources, articles_per_hour
    """
    return get_overview_stats()


@router.get("/bias-timeseries")
def dashboard_bias_timeseries(days: int = Query(30, ge=1, le=365)):
    """
    Returns daily average bias and article counts for the Temporal Bias Drift chart.
    """
    return get_bias_timeseries(days)


@router.get("/narrative-balance")
def dashboard_narrative_balance():
    """
    Returns percentage breakdown: neutral, left_leaning, right_leaning.
    """
    return get_narrative_balance()


@router.get("/recent-ingestion")
def dashboard_recent_ingestion(limit: int = Query(10, ge=1, le=100)):
    """
    Returns the most recently analyzed articles for the ingestion table.
    """
    return get_recent_articles(limit)


@router.get("/regional-bias")
def dashboard_regional_bias():
    """
    Returns per-region bias index and archive packet count.
    """
    return get_regional_bias()


@router.get("/bias-distribution")
def dashboard_bias_distribution():
    """
    Returns counts for low / moderate / high bias buckets.
    """
    return get_bias_distribution()


@router.get("/sentiment-correlation")
def dashboard_sentiment_correlation():
    """
    Returns scatter-plot data: bias vs sentiment intensity.
    """
    return get_sentiment_correlation()
