from typing import List, Dict, Any
import database

def save_analysis(analysis: Dict[str, Any], user_id: str = None):
    """Save an analysis result via the database layer (Firestore/SQLite)."""
    # The database.py save_analysis expects (article, result, user_id)
    # We'll pass the analysis dict as both the 'article' (for headline/text) and 'result'
    return database.save_analysis(analysis, analysis, user_id=user_id)

def get_recent_analyses(limit: int = 10, user_id: str = None) -> List[Dict[str, Any]]:
    """Get recent analysis results via the database layer."""
    results = database.get_recent_articles(limit=limit, user_id=user_id)
    # Convert IDs and timestamps to match expected format if necessary
    return results

def get_stats(user_id: str = None) -> Dict[str, Any]:
    """Calculate statistics via the database layer."""
    stats = database.get_overview_stats(user_id=user_id)
    balance = database.get_narrative_balance(user_id=user_id)
    
    # Map database stats to the keys expected by the frontend
    return {
        "totalArticles": stats.get("total_articles", 0),
        "avgBias": stats.get("avg_bias_score", 0.0),
        "activeSources": stats.get("active_sources", 0),
        "articlesPerHour": stats.get("articles_per_hour", 0),
        "neutralRatio": balance.get("neutral", 0.0),
        "distribution": {
            "left": balance.get("left_leaning", 0),
            "neutral": balance.get("neutral", 0),
            "right": balance.get("right_leaning", 0)
        }
    }

def delete_analysis(analysis_id: str, user_id: str = None) -> bool:
    """Delete an analysis report. (Note: database.py currently lacks a specific delete, 
    so we'll keep a placeholder or implement it there)."""
    # For now, let's keep it as is or return False if not implemented in database.py
    return False 

