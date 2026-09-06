from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .routers import scenes, query, discovery

app = FastAPI(
    title="SatQuery AI API",
    description="Multimodal geospatial intelligence API",
    version="0.1.0"
)

import os

frontend_url = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url] if frontend_url != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(scenes.router)
app.include_router(query.router)
app.include_router(discovery.router)

@app.get("/")
def read_root():
    return {"message": "SatQuery AI API is running"}
