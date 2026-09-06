import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers.analyze import router as analyze_router
from routers.compare import router as compare_router
from routers.dashboard import router as dashboard_router
from routers.event import router as event_router
from routers.stats import router as stats_router

app = FastAPI(
    title="TruthLens API",
    description="AI-powered news bias detection system",
    version="1.0.0",
)

# ---------------------
# CORS (allow frontend)
# ---------------------
origins = [
    "https://truthlens-frontend-7t98.onrender.com",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
app.include_router(stats_router)
app.include_router(dashboard_router)

# ---------------------
# Safe Static Mount
# ---------------------
# Ensures directory exists at boot so FastAPI won't throw a Startup RuntimeError
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", tags=["Health"])
def root():
    """Health-check endpoint."""
    return {"message": "TruthLens backend running"}


# ---------------------
# Render Web Server Entrypoint
# ---------------------
if __name__ == "__main__":
    # Render dynamically assigns a PORT variable at runtime
    port = int(os.environ.get("PORT", 10000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)