"""
TruthLens Backend — FastAPI Server
===================================
Entry point for the TruthLens AI news bias detection API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers.analyze import router as analyze_router
from routers.compare import router as compare_router
from routers.event import router as event_router

app = FastAPI(
    title="TruthLens API",
    description="AI-powered news bias detection system",
    version="1.0.0",
)

# ---------------------
# CORS (allow frontend)
# ---------------------
# Allow any origin in development so the frontend can run safely from any local host.
# If deploying to production, lock this down to your known frontend host/domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------
# Routers
# ---------------------
app.include_router(analyze_router)
app.include_router(compare_router)
app.include_router(event_router)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", tags=["Health"])
def root():
    """Health-check endpoint."""
    return {"message": "TruthLens backend running"}
