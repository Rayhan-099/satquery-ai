from typing import Dict, Any
from .models import AnalysisPlan

class ResponseGenerator:
    def generate(self, plan: AnalysisPlan, evidence: Dict[str, Any]) -> str:
        analysis_type = evidence.get("analysis_type", "")
        stats = evidence.get("statistics", {})
        
        if analysis_type == "NDVI":
            mean = stats.get("mean", 0)
            max_val = stats.get("max", 0)
            valid = stats.get("valid_pixels", 0)
            return (
                f"Based on the generated NDVI evidence, vegetation density has been spatially mapped. "
                f"The analysis calculated a mean NDVI of {mean:.4f} with a maximum of {max_val:.4f} "
                f"across {valid} valid pixels in the selected scene."
            )
            
        elif analysis_type == "Water Analysis":
            mean = stats.get("mean", 0)
            max_val = stats.get("max", 0)
            valid = stats.get("valid_pixels", 0)
            return (
                f"Based on NDWI computation, potential water bodies have been spatially highlighted. "
                f"The index ranges up to a maximum of {max_val:.4f}, with a scene mean of {mean:.4f} "
                f"across {valid} valid pixels. (Values > 0 typically indicate water)."
            )
            
        elif analysis_type == "SAR Analysis":
            vv = stats.get("vv_mean", 0)
            vh = stats.get("vh_mean", 0)
            ratio = stats.get("ratio_mean", 0)
            valid = stats.get("valid_pixels", 0)
            return (
                f"A dual-polarization Sentinel-1 SAR composite has been generated. "
                f"The scene exhibits a mean VV backscatter of {vv:.4f} and VH of {vh:.4f} "
                f"(Ratio: {ratio:.4f}) across {valid} valid pixels. "
                f"The composite visualizes R=VV, G=VH, and B=VV/VH."
            )
            
        return "Analysis completed successfully."
