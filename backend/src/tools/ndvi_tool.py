from typing import Dict, Any
from .base import AnalysisTool
from ..utils.eo_algorithms import compute_ndvi

class NDVITool(AnalysisTool):
    name = "ndvi"
    description = "Calculate vegetation index from RED and NIR bands."
    supported_modalities = ["optical", "multispectral"]
    required_inputs = ["red_idx", "nir_idx"]
    optional_inputs = []

    def execute(self, scene_id: str, source_uri: str, inputs: Dict[str, Any], output_dir: str) -> Dict[str, Any]:
        red_idx = inputs.get("red_idx")
        nir_idx = inputs.get("nir_idx")
        
        if not red_idx or not nir_idx:
            raise ValueError("NDVI tool requires both 'red_idx' and 'nir_idx'")
            
        out_raster, vis_asset, stats, warnings = compute_ndvi(
            scene_id=scene_id,
            source_uri=source_uri,
            red_idx=red_idx,
            nir_idx=nir_idx,
            output_dir=output_dir
        )
        
        return {
            "analysis_type": "NDVI",
            "scene_id": scene_id,
            "formula": "(NIR - RED) / (NIR + RED)",
            "input_bands": {"RED": f"Band {red_idx}", "NIR": f"Band {nir_idx}"},
            "output_raster": out_raster,
            "visualization_asset": vis_asset,
            "statistics": stats,
            "warnings": warnings
        }
