import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import scenes, query, discovery

logger = logging.getLogger(__name__)

app = FastAPI(
    title="SatQuery AI API",
    description="Multimodal geospatial intelligence API",
    version="0.1.0"
)

frontend_url = os.getenv("FRONTEND_URL", "*")
if frontend_url == "*":
    logger.warning("FRONTEND_URL not set — CORS allows all origins. Set FRONTEND_URL for production.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url] if frontend_url != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(scenes.router)
app.include_router(query.router)
app.include_router(discovery.router)

@app.get("/")
def read_root():
    return {"service": "satquery-api", "version": "0.1.0", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "satquery-api", "version": "0.1.0"}
