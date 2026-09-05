from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import scenes

app = FastAPI(
    title="SatQuery AI API",
    description="Multimodal geospatial intelligence API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # TODO: configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scenes.router)

@app.get("/")
def read_root():
    return {"message": "SatQuery AI API is running"}
