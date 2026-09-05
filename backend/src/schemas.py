from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SceneBase(BaseModel):
    sensor: Optional[str] = None
    crs: str
    bounds: str
    width: float
    height: float
    status: str
    source_uri: str

class SceneCreate(SceneBase):
    id: str

class SceneResponse(SceneBase):
    id: str
    acquisition_time: datetime
    created_at: datetime

    class Config:
        orm_mode = True
