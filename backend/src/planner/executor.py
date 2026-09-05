from sqlalchemy.orm import Session
from ..models import Scene
from ..tools import registry
from .models import AnalysisPlan
from typing import Dict, Any

class PlanExecutor:
    def execute(self, plan: AnalysisPlan, db: Session, output_dir: str) -> Dict[str, Any]:
        if not registry.is_registered(plan.tool):
            raise ValueError(f"UNSUPPORTED_ANALYSIS: Tool '{plan.tool}' is not registered or allowed.")
            
        scene = db.query(Scene).filter(Scene.id == plan.scene_id).first()
        if not scene:
            raise ValueError(f"SCENE_NOT_FOUND: Scene {plan.scene_id} not found.")
            
        # Resolve inputs
        inputs = {}
        if plan.tool == "ndvi":
            red_idx = None
            nir_idx = None
            bands = scene.bands_metadata or []
            for b in bands:
                desc = (b.get("description") or "").upper()
                color = (b.get("color_interpretation") or "").upper()
                if not red_idx and ("RED" in desc or "B04" in desc or color == "RED"):
                    red_idx = b.get("index")
                if not nir_idx and ("NIR" in desc or "B08" in desc or "NEAR INFRARED" in desc):
                    nir_idx = b.get("index")
            
            if not red_idx or not nir_idx:
                raise ValueError("CLARIFICATION_REQUIRED: Scene does not contain explicitly identifiable RED and NIR bands. Cannot safely compute NDVI.")
                
            inputs["red_idx"] = red_idx
            inputs["nir_idx"] = nir_idx
            
        tool = registry.get(plan.tool)
        evidence = tool.execute(scene.id, scene.source_uri, inputs, output_dir)
        return evidence
