from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

from ..providers.copernicus import CopernicusDataProvider
import os
import shutil

router = APIRouter(prefix="/discovery", tags=["Discovery"])

class DiscoveryQuery(BaseModel):
    bbox: List[float] = Field(..., description="[min_lon, min_lat, max_lon, max_lat]")
    start_date: str
    end_date: str
    sensor: str = Field(..., description="'sentinel-2' or 'sentinel-1'")
    max_cloud_cover: float = 20.0
    max_results: int = 5

class IngestRequest(BaseModel):
    product_id: str
    sensor: str

@router.post("/search")
def search_scenes(query: DiscoveryQuery):
    provider = CopernicusDataProvider()
    try:
        results = provider.search_scenes(
            bbox=query.bbox,
            start_date=query.start_date,
            end_date=query.end_date,
            sensor=query.sensor,
            max_cloud_cover=query.max_cloud_cover,
            max_results=query.max_results
        )
        return {"status": "success", "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest")
def ingest_discovered_scene(req: IngestRequest):
    provider = CopernicusDataProvider()
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    try:
        # Download (or mock download) the asset
        asset_info = provider.download_asset(req.product_id, upload_dir)
        asset_path = asset_info["path"]
        source_type = asset_info["source_type"]
        provenance = asset_info["provenance"]
        
        # We need to ingest it similarly to how the /images/upload endpoint works
        # The upload endpoint calls geo.extract_metadata and saves to db
        import logging
        logger = logging.getLogger(__name__)
        from ..utils.geo import extract_metadata
        from ..database import get_db
        from ..models import Scene
        from sqlalchemy.orm import Session
        
        # We need a DB session. We can use a context manager or dependency injection
        # But this is a simple route
        db_gen = get_db()
        db: Session = next(db_gen)
        
        try:
            metadata = extract_metadata(asset_path)
            
            # Identify bands for S2 or S1 explicitly since we know what we downloaded
            if req.sensor.lower() == "sentinel-2":
                metadata["sensor"] = "sentinel-2"
                metadata["bands_metadata"] = [
                    {"index": 1, "description": "Blue"},
                    {"index": 2, "description": "Green"},
                    {"index": 3, "description": "Red"},
                    {"index": 4, "description": "NIR"},
                ]
            elif req.sensor.lower() == "sentinel-1":
                metadata["sensor"] = "sentinel-1"
                metadata["bands_metadata"] = [
                    {"index": 1, "description": "VV"},
                    {"index": 2, "description": "VH"}
                ]
                
            scene_id = os.path.basename(asset_path).replace(".tif", "")
            
            # Save to DB
            db_scene = Scene(
                id=scene_id,
                filename=os.path.basename(asset_path),
                path=asset_path,
                sensor=metadata["sensor"],
                acquisition_time=datetime.fromisoformat(metadata["acquisition_time"]) if metadata["acquisition_time"] else datetime.utcnow(),
                crs=metadata["crs"],
                bounds=metadata["bounds"],
                width=metadata["width"],
                height=metadata["height"],
                source_type=source_type,
                provenance=provenance,
                status="processing",
                bands_metadata=metadata["bands_metadata"]
            )
            db.add(db_scene)
            db.commit()
            db.refresh(db_scene)
            
            return db_scene
            
        finally:
            db_gen.close()
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
