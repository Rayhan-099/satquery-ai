from pydantic import BaseModel
from typing import Dict, Any, Optional, List

class QueryRequest(BaseModel):
    scene_id: str
    query: str

class AnalysisPlan(BaseModel):
    intent: str
    tool: str
    scene_id: str
    inputs: Dict[str, Any] = {}
    requested_output: str
    requires_confirmation: bool = False

class QueryResponse(BaseModel):
    query: str
    status: str
    plan: Optional[AnalysisPlan] = None
    evidence: Optional[Dict[str, Any]] = None
    interpretation: Optional[str] = None
    limitations: List[str] = []
