from typing import Dict, Any
from .base import AnalysisTool
from ..utils.eo_algorithms import compute_ndwi

class WaterTool(AnalysisTool):
    name = "water_index"
    description = "Calculate water index (NDWI) from GREEN and NIR bands."
    supported_modalities = ["optical", "multispectral"]
    required_inputs = ["green_idx", "nir_idx"]
    optional_inputs = []

    def execute(self, scene_id: str, source_uri: str, inputs: Dict[str, Any], output_dir: str) -> Dict[str, Any]:
        green_idx = inputs.get("green_idx")
        nir_idx = inputs.get("nir_idx")
        
        if not green_idx or not nir_idx:
            raise ValueError("Water tool requires both 'green_idx' and 'nir_idx'")
            
        out_raster, vis_asset, stats, warnings = compute_ndwi(
            scene_id=scene_id,
            source_uri=source_uri,
            green_idx=green_idx,
            nir_idx=nir_idx,
            output_dir=output_dir
        )
        
        return {
            "analysis_type": "Water Analysis",
            "scene_id": scene_id,
            "formula": "(GREEN - NIR) / (GREEN + NIR)",
            "input_bands": {"GREEN": f"Band {green_idx}", "NIR": f"Band {nir_idx}"},
            "output_raster": out_raster,
            "visualization_asset": vis_asset,
            "statistics": stats,
            "warnings": warnings
        }
