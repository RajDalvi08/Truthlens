"""
TruthLens Database Layer
=========================
SQLite database for persisting analysis results and dashboard data.
Uses aiosqlite for async operations but also provides synchronous helpers
for use inside the analysis pipeline.
"""

import sqlite3
import os
from datetime import datetime, timezone
from typing import Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "truthlens.db")


def get_connection() -> sqlite3.Connection:
    """Return a new SQLite connection with WAL mode for concurrency."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db():
    """Create all tables if they do not exist."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS analyzed_articles (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            headline        TEXT,
            source          TEXT    NOT NULL DEFAULT 'unknown',
            topic           TEXT    NOT NULL DEFAULT 'General',
            bias_score      REAL    NOT NULL,
            linguistic_bias REAL    NOT NULL DEFAULT 0,
            framing_bias    REAL    NOT NULL DEFAULT 0,
            entity_bias     REAL    NOT NULL DEFAULT 0,
            bias_level      TEXT    NOT NULL DEFAULT 'Low Bias',
            sentiment       TEXT    NOT NULL DEFAULT 'Neutral',
            region          TEXT    NOT NULL DEFAULT 'Unknown',
            timestamp       TEXT    NOT NULL
        );

        CREATE TABLE IF NOT EXISTS regional_bias (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            region          TEXT    NOT NULL UNIQUE,
            bias_index      REAL    NOT NULL DEFAULT 0,
            archive_packets INTEGER NOT NULL DEFAULT 0
        );
    """)

    # Seed regional_bias with default regions if empty
    cursor.execute("SELECT COUNT(*) FROM regional_bias")
    if cursor.fetchone()[0] == 0:
        regions = [
            ("North America", 0.0, 0),
            ("Europe", 0.0, 0),
            ("Asia Pacific", 0.0, 0),
            ("Middle East", 0.0, 0),
            ("Africa", 0.0, 0),
            ("Latin America", 0.0, 0),
        ]
        cursor.executemany(
            "INSERT INTO regional_bias (region, bias_index, archive_packets) VALUES (?, ?, ?)",
            regions,
        )

    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# Write helpers (called from analysis pipeline)
# ---------------------------------------------------------------------------

def _detect_topic(headline: str, text: str) -> str:
    """Very simple keyword-based topic classifier."""
    combined = (headline + " " + text).lower()
    topics = {
        "Politics": ["president", "government", "election", "congress", "senate", "law", "policy", "political", "democrat", "republican", "vote", "legislation", "parliament"],
        "Economy": ["economy", "market", "stock", "trade", "inflation", "gdp", "finance", "economic", "bank", "investment", "fiscal", "monetary", "recession"],
        "Technology": ["tech", "ai ", "artificial intelligence", "software", "google", "apple", "microsoft", "startup", "data", "cyber", "digital", "algorithm", "machine learning"],
        "Health": ["health", "medical", "vaccine", "disease", "hospital", "doctor", "patient", "treatment", "pandemic", "virus", "who ", "clinical"],
        "Sports": ["sport", "game", "team", "player", "tournament", "championship", "score", "match", "athlete", "league", "cup "],
        "Science": ["science", "research", "study", "discovery", "nasa", "space", "climate", "environment", "energy", "physics", "biology"],
        "Entertainment": ["movie", "film", "music", "celebrity", "entertainment", "actor", "singer", "album", "show", "concert"],
        "World": ["war", "conflict", "military", "nato", "united nations", "refugee", "diplomacy", "crisis", "international"],
    }
    for topic, keywords in topics.items():
        if any(kw in combined for kw in keywords):
            return topic
    return "General"


def _detect_region(source: str, text: str) -> str:
    """Very simple region classifier based on source / text keywords."""
    combined = (source + " " + text).lower()
    region_map = {
        "North America": ["cnn", "fox", "nbc", "abc news", "usa", "united states", "america", "washington", "new york", "canada", "nytimes", "ap news"],
        "Europe": ["bbc", "guardian", "reuters", "france", "germany", "uk ", "london", "paris", "eu ", "european", "spiegel", "le monde"],
        "Asia Pacific": ["asia", "china", "japan", "india", "korea", "australia", "pacific", "beijing", "tokyo", "scmp", "times of india"],
        "Middle East": ["middle east", "iran", "iraq", "saudi", "israel", "palestine", "al jazeera", "dubai", "qatar"],
        "Africa": ["africa", "kenya", "nigeria", "south africa", "egypt", "ethiopia", "ghana"],
        "Latin America": ["brazil", "mexico", "argentina", "latin america", "colombia", "chile", "latin"],
    }
    for region, keywords in region_map.items():
        if any(kw in combined for kw in keywords):
            return region
    return "Unknown"


def _detect_sentiment(bias_score: float, bias_level: str) -> str:
    """Derive sentiment from bias score."""
    if bias_score < 30:
        return "Positive"
    elif bias_score < 60:
        return "Neutral"
    else:
        return "Negative"


def save_analysis(article: dict, result: dict):
    """
    Persist a completed analysis result to the database.
    Called after a successful bias analysis.
    """
    conn = get_connection()
    cursor = conn.cursor()

    headline = result.get("headline") or article.get("headline") or "Untitled"
    source = result.get("source") or article.get("source") or "unknown"
    text = article.get("text", "")
    bias_score = result.get("bias_score", 0)
    bias_level = result.get("bias_level", "Low Bias")

    topic = _detect_topic(headline, text)
    region = _detect_region(source, text)
    sentiment = _detect_sentiment(bias_score, bias_level)

    now = datetime.now(timezone.utc).isoformat()

    cursor.execute("""
        INSERT INTO analyzed_articles
            (headline, source, topic, bias_score, linguistic_bias, framing_bias, entity_bias,
             bias_level, sentiment, region, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        headline, source, topic, bias_score,
        result.get("linguistic_bias", 0),
        result.get("framing_bias", 0),
        result.get("entity_bias", 0),
        bias_level, sentiment, region, now,
    ))

    # Update regional_bias table
    cursor.execute("""
        INSERT INTO regional_bias (region, bias_index, archive_packets)
        VALUES (?, ?, 1)
        ON CONFLICT(region) DO UPDATE SET
            bias_index = (regional_bias.bias_index * regional_bias.archive_packets + ?) / (regional_bias.archive_packets + 1),
            archive_packets = regional_bias.archive_packets + 1
    """, (region, bias_score, bias_score))

    conn.commit()
    conn.close()


# ---------------------------------------------------------------------------
# Read helpers (called from dashboard endpoints)
# ---------------------------------------------------------------------------

def get_overview_stats() -> dict:
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total, AVG(bias_score) as avg_bias, MAX(timestamp) as last_upd FROM analyzed_articles")
    row = cursor.fetchone()
    total = row["total"] or 0
    avg_bias = round(row["avg_bias"] or 0, 2)
    last_updated = row["last_upd"]

    cursor.execute("SELECT COUNT(DISTINCT source) as active FROM analyzed_articles")
    active_sources = cursor.fetchone()["active"] or 0

    # Approximate: articles in the last hour
    cursor.execute("""
        SELECT COUNT(*) as cnt FROM analyzed_articles
        WHERE timestamp >= datetime('now', '-1 hour')
    """)
    articles_per_hour = cursor.fetchone()["cnt"] or 0

    conn.close()
    return {
        "total_articles": total,
        "avg_bias_score": avg_bias,
        "active_sources": active_sources,
        "articles_per_hour": articles_per_hour,
        "last_updated": last_updated,
    }


def get_bias_timeseries(days: int = 30) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DATE(timestamp) as date, AVG(bias_score) as average_bias, COUNT(*) as article_count
        FROM analyzed_articles
        WHERE timestamp >= datetime('now', ? || ' days')
        GROUP BY DATE(timestamp)
        ORDER BY date ASC
    """, (f"-{days}",))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_narrative_balance() -> dict:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM analyzed_articles")
    total = cursor.fetchone()["total"] or 1  # avoid division by zero

    cursor.execute("SELECT COUNT(*) as cnt FROM analyzed_articles WHERE bias_score < 35")
    neutral = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM analyzed_articles WHERE bias_score >= 35 AND bias_score < 60")
    left_leaning = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM analyzed_articles WHERE bias_score >= 60")
    right_leaning = cursor.fetchone()["cnt"]

    conn.close()
    return {
        "neutral": round((neutral / total) * 100, 1),
        "left_leaning": round((left_leaning / total) * 100, 1),
        "right_leaning": round((right_leaning / total) * 100, 1),
        "total": total,
    }


def get_recent_articles(limit: int = 10) -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, headline, source, topic, bias_score, linguistic_bias,
               framing_bias, entity_bias, bias_level, sentiment, timestamp
        FROM analyzed_articles
        ORDER BY id DESC
        LIMIT ?
    """, (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_regional_bias() -> list:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT region, ROUND(bias_index, 2) as bias_index, archive_packets
        FROM regional_bias
        ORDER BY archive_packets DESC
    """)
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_bias_distribution() -> dict:
    """Returns counts for left/neutral/right bias buckets."""
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as cnt FROM analyzed_articles WHERE bias_score < 35")
    low_bias = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM analyzed_articles WHERE bias_score >= 35 AND bias_score < 60")
    moderate_bias = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM analyzed_articles WHERE bias_score >= 60")
    high_bias = cursor.fetchone()["cnt"]

    conn.close()
    return {
        "low_bias": low_bias,
        "moderate_bias": moderate_bias,
        "high_bias": high_bias,
    }


def get_sentiment_correlation() -> list:
    """Returns bias vs sentiment scatter data from stored articles."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT
            bias_score,
            linguistic_bias,
            framing_bias,
            entity_bias,
            sentiment
        FROM analyzed_articles
        ORDER BY id DESC
        LIMIT 100
    """)
    rows = cursor.fetchall()
    conn.close()

    data = []
    for row in rows:
        # Normalize bias_score to [-1, 1] range
        bias = (row["bias_score"] - 50) / 50
        # Derive sentiment score from sentiment label
        sent_map = {"Positive": 0.6, "Neutral": 0.0, "Negative": -0.6}
        sentiment_val = sent_map.get(row["sentiment"], 0)
        # Add some variation from component scores
        sentiment_val += (row["linguistic_bias"] - row["framing_bias"]) * 0.02
        size = max(10, min(40, int(row["bias_score"] / 3)))
        data.append({
            "bias": round(bias, 2),
            "sentiment": round(sentiment_val, 2),
            "size": size,
        })
    return data


# Initialize the database on module import
init_db()
