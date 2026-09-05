from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from ..database import get_db
from ..models import Scene
from ..schemas import SceneResponse
from ..utils.geo import extract_metadata

router = APIRouter(prefix="/images", tags=["images"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=SceneResponse)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(('.tif', '.tiff')):
        raise HTTPException(status_code=400, detail="Only GeoTIFF files are supported")
    
    scene_id = f"scene_{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(UPLOAD_DIR, f"{scene_id}.tif")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        metadata = extract_metadata(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=str(e))
        
    new_scene = Scene(
        id=scene_id,
        sensor="unknown", # We can infer this later or from filename
        crs=metadata["crs"],
        bounds=metadata["bounds"],
        width=metadata["width"],
        height=metadata["height"],
        source_uri=file_path,
        status="processing"
    )
    
    db.add(new_scene)
    db.commit()
    db.refresh(new_scene)
    
    return new_scene
