from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Body
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from ..database import get_db
from ..models import Scene
from ..schemas import SceneResponse, NDVIRequest, EvidenceResponse
from ..utils.geo import extract_metadata
from ..utils.eo_algorithms import compute_ndvi

router = APIRouter(prefix="/images", tags=["images"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

MAX_UPLOAD_SIZE = 100 * 1024 * 1024  # 100 MB

@router.post("/upload", response_model=SceneResponse)
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = file.filename or ""
    # Sanitize filename: reject path traversal and non-safe characters
    if ".." in filename or "/" in filename or "\\" in filename:
        raise HTTPException(status_code=400, detail="Invalid filename.")
    if not filename.lower().endswith(('.tif', '.tiff')):
        raise HTTPException(status_code=400, detail="Only GeoTIFF files are supported.")
    
    # Enforce file size limit
    contents = await file.read()
    if len(contents) > MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=413, detail=f"File too large. Maximum size is {MAX_UPLOAD_SIZE // (1024*1024)} MB.")
    
    scene_id = f"scene_{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(UPLOAD_DIR, f"{scene_id}.tif")
    
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
        
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
        source_type="LOCAL_UPLOAD",
        provenance={"description": "Locally uploaded by user"},
        bands_metadata=metadata["bands_metadata"],
        status="processing"
    )
    
    db.add(new_scene)
    db.commit()
    db.refresh(new_scene)
    
    return new_scene

@router.post("/{scene_id}/analyze/ndvi", response_model=EvidenceResponse)
async def analyze_ndvi(scene_id: str, request: NDVIRequest = Body(default=NDVIRequest()), db: Session = Depends(get_db)):
    scene = db.query(Scene).filter(Scene.id == scene_id).first()
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
        
    if not os.path.exists(scene.source_uri):
        raise HTTPException(status_code=404, detail="Scene file missing from storage")

    # Determine RED and NIR bands
    red_idx = request.red_band_idx
    nir_idx = request.nir_band_idx
    
    if not red_idx or not nir_idx:
        # Try to infer from metadata
        bands = scene.bands_metadata or []
        for b in bands:
            desc = (b.get("description") or "").upper()
            color = (b.get("color_interpretation") or "").upper()
            if not red_idx and ("RED" in desc or "B04" in desc or color == "RED"):
                red_idx = b.get("index")
            if not nir_idx and ("NIR" in desc or "B08" in desc or "NEAR INFRARED" in desc):
                nir_idx = b.get("index")
                
    if not red_idx or not nir_idx:
        raise HTTPException(status_code=400, detail="Cannot automatically determine RED and NIR bands. Please specify them explicitly.")
        
    try:
        out_raster, vis_asset, stats, warnings = compute_ndvi(
            scene_id=scene_id,
            source_uri=scene.source_uri,
            red_idx=red_idx,
            nir_idx=nir_idx,
            output_dir=UPLOAD_DIR
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
        
    return EvidenceResponse(
        analysis_type="NDVI",
        scene_id=scene_id,
        formula="(NIR - RED) / (NIR + RED)",
        input_bands={"RED": f"Band {red_idx}", "NIR": f"Band {nir_idx}"},
        output_raster=out_raster,
        visualization_asset=vis_asset,
        statistics=stats,
        warnings=warnings
    )
