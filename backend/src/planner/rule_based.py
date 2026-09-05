from .models import AnalysisPlan

class RuleBasedPlanner:
    """
    Deterministic NLP parser providing a secure LLM boundary proxy.
    Resolves natural language queries to supported intents/tools.
    """
    def generate_plan(self, scene_id: str, query: str) -> AnalysisPlan:
        query_lower = query.lower()
        
        # Unsupported queries check
        if any(w in query_lower for w in ["building", "water", "change", "sar", "radar"]):
            raise ValueError("UNSUPPORTED_ANALYSIS: This query requires tools not currently registered.")
            
        # Vegetation / NDVI intent
        if any(w in query_lower for w in ["vegetation", "ndvi", "health"]):
            return AnalysisPlan(
                intent="vegetation_analysis",
                tool="ndvi",
                scene_id=scene_id,
                inputs={"red": "B04", "nir": "B08"}, # logical names, will be resolved by executor
                requested_output="spatial_vegetation_density",
                requires_confirmation=False
            )
            
        raise ValueError("UNRECOGNIZED_INTENT: Could not determine an appropriate analysis tool for this query.")
