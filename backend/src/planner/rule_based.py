from .models import AnalysisPlan

class RuleBasedPlanner:
    """
    Deterministic NLP parser providing a secure LLM boundary proxy.
    Resolves natural language queries to supported intents/tools.
    """
    def generate_plan(self, scene_id: str, query: str) -> AnalysisPlan:
        query_lower = query.lower()
        
        # Unsupported queries check (Change, building)
        if any(w in query_lower for w in ["building", "change"]):
            raise ValueError("UNSUPPORTED_ANALYSIS: This query requires tools not currently registered.")
            
        # Water intent
        if any(w in query_lower for w in ["water", "ndwi"]):
            return AnalysisPlan(
                intent="water_analysis",
                tool="water_index",
                scene_id=scene_id,
                inputs={"green": "B03", "nir": "B08"}, # logical names
                requested_output="spatial_water_mask",
                requires_confirmation=False
            )
            
        # SAR intent
        if any(w in query_lower for w in ["sar", "radar", "backscatter"]):
            return AnalysisPlan(
                intent="sar_analysis",
                tool="sar_analysis",
                scene_id=scene_id,
                inputs={"vv": "VV", "vh": "VH"}, # logical names
                requested_output="sar_rgb_composite",
                requires_confirmation=False
            )
            
        # Vegetation / NDVI intent
        if any(w in query_lower for w in ["vegetation", "ndvi", "health"]):
            return AnalysisPlan(
                intent="vegetation_analysis",
                tool="ndvi",
                scene_id=scene_id,
                inputs={"red": "B04", "nir": "B08"},
                requested_output="spatial_vegetation_density",
                requires_confirmation=False
            )
            
        raise ValueError("UNRECOGNIZED_INTENT: Could not determine an appropriate analysis tool for this query.")
