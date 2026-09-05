from typing import Dict, Any
from .models import AnalysisPlan

class ResponseGenerator:
    def generate(self, plan: AnalysisPlan, evidence: Dict[str, Any]) -> str:
        if evidence.get("analysis_type") == "NDVI":
            stats = evidence.get("statistics", {})
            mean = stats.get("mean", 0)
            max_val = stats.get("max", 0)
            valid = stats.get("valid_pixels", 0)
            
            return (
                f"Based on the generated NDVI evidence, vegetation density has been spatially mapped. "
                f"The analysis calculated a mean NDVI of {mean:.4f} with a maximum of {max_val:.4f} "
                f"across {valid} valid pixels in the selected scene."
            )
            
        return "Analysis completed successfully."
