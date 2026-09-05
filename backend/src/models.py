from sqlalchemy import Column, String, Float, DateTime
from .database import Base
import datetime

class Scene(Base):
    __tablename__ = "scenes"

    id = Column(String, primary_key=True, index=True)
    sensor = Column(String, index=True)
    acquisition_time = Column(DateTime, default=datetime.datetime.utcnow)
    crs = Column(String)
    bounds = Column(String) # JSON string or WKT
    width = Column(Float)
    height = Column(Float)
    source_uri = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
