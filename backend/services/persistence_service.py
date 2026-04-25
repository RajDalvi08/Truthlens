import json
import os
from datetime import datetime
from typing import List, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "db.json")

def _ensure_db():
    """Ensure the data directory and db.json file exist."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f:
            json.dump({"analyses": []}, f)

def save_analysis(analysis: Dict[str, Any], user_id: str = None):
    """Save an analysis result to the persistence layer."""
    _ensure_db()
    
    # Add user_id if provided
    if user_id:
        analysis["user_id"] = user_id
    
    # Add timestamp and ID if not present
    if "id" not in analysis:
        import uuid
        analysis["id"] = str(uuid.uuid4())
    
    if "timestamp" not in analysis:
        analysis["timestamp"] = datetime.utcnow().isoformat()
        
    with open(DB_PATH, "r+") as f:
        data = json.load(f)
        data["analyses"].append(analysis)
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
    return analysis

def get_recent_analyses(limit: int = 10, user_id: str = None) -> List[Dict[str, Any]]:
    """Get the most recent analysis results, optionally filtered by user."""
    _ensure_db()
    with open(DB_PATH, "r") as f:
        data = json.load(f)
        analyses = data.get("analyses", [])
        
        # Filter by user_id if provided
        if user_id:
            analyses = [a for a in analyses if a.get("user_id") == user_id]
            
        # Sort by timestamp descending
        sorted_analyses = sorted(
            analyses, 
            key=lambda x: x.get("timestamp", ""), 
            reverse=True
        )
        return sorted_analyses[:limit]

def get_stats(user_id: str = None) -> Dict[str, Any]:
    """Calculate statistics from stored analyses, optionally filtered by user."""
    _ensure_db()
    with open(DB_PATH, "r") as f:
        data = json.load(f)
        analyses = data.get("analyses", [])
        
        # Filter by user_id if provided
        if user_id:
            analyses = [a for a in analyses if a.get("user_id") == user_id]
        
        if not analyses:
            return {
                "totalArticles": 0,
                "avgBias": 0.0,
                "activeSources": 0,
                "neutralRatio": 0.0,
                "distribution": {
                    "left": 0,
                    "neutral": 0,
                    "right": 0
                }
            }
            
        total_bias = sum(a.get("bias_score", 0) for a in analyses)
        sources = set(a.get("source", "") for a in analyses)
        
        # Bias Distribution
        left_count = sum(1 for a in analyses if a.get("bias_score", 0) <= -0.2)
        neutral_count = sum(1 for a in analyses if -0.2 < a.get("bias_score", 0) < 0.2)
        right_count = sum(1 for a in analyses if a.get("bias_score", 0) >= 0.2)
        
        return {
            "totalArticles": len(analyses),
            "avgBias": round(total_bias / len(analyses), 2),
            "activeSources": len(sources),
            "neutralRatio": round((neutral_count / len(analyses)) * 100, 1),
            "distribution": {
                "left": left_count,
                "neutral": neutral_count,
                "right": right_count
            }
        }

def delete_analysis(analysis_id: str, user_id: str = None) -> bool:
    """Delete an analysis report by ID, optionally checking user ownership."""
    _ensure_db()
    with open(DB_PATH, "r+") as f:
        data = json.load(f)
        initial_count = len(data.get("analyses", []))
        
        # Keep analyses that DO NOT match the ID OR (if user_id provided) do not belong to the user
        def should_keep(a):
            if str(a.get("id")) != str(analysis_id):
                return True
            if user_id and a.get("user_id") != user_id:
                return True
            return False

        data["analyses"] = [a for a in data.get("analyses", []) if should_keep(a)]
        
        if len(data["analyses"]) == initial_count:
            return False # Not found or deleted
            
        f.seek(0)
        json.dump(data, f, indent=4)
        f.truncate()
        return True
