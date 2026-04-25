from fastapi import APIRouter
from services.persistence_service import get_stats, get_recent_analyses

router = APIRouter(prefix="/stats", tags=["Stats"])

@router.get("/overview")
def read_stats(user_id: str = None):
    """Get overall analysis statistics."""
    return get_stats(user_id=user_id)

@router.get("/recent")
def read_recent(limit: int = 10, user_id: str = None):
    """Get the most recent analysis results."""
    return get_recent_analyses(limit, user_id=user_id)

@router.delete("/recent/{analysis_id}")
def delete_recent_analysis(analysis_id: str, user_id: str = None):
    """Delete a recent analysis by ID."""
    from services.persistence_service import delete_analysis
    from fastapi import HTTPException
    
    success = delete_analysis(analysis_id, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis not found or already deleted")
    return {"message": "Analysis deleted successfully", "id": analysis_id}
