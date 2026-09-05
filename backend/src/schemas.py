from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class SceneResponse(BaseModel):
    id: str
    sensor: Optional[str]
    acquisition_time: Optional[datetime]
    crs: Optional[str]
    bounds: Optional[str]
    width: Optional[float]
    height: Optional[float]
    status: Optional[str]
    bands_metadata: Optional[List[Dict[str, Any]]] = []
    
    class Config:
        from_attributes = True

class NDVIRequest(BaseModel):
    red_band_idx: Optional[int] = None
    nir_band_idx: Optional[int] = None

class Statistics(BaseModel):
    min: float
    max: float
    mean: float
    median: float
    std_dev: float
    valid_pixels: int

class EvidenceResponse(BaseModel):
    analysis_type: str
    scene_id: str
    formula: str
    input_bands: Dict[str, str]
    output_raster: str
    visualization_asset: str
    statistics: Statistics
    warnings: List[str]
