from typing import Dict, Any
from .base import AnalysisTool
from ..utils.eo_algorithms import compute_sar_composite

class SARTool(AnalysisTool):
    name = "sar_analysis"
    description = "Analyze Sentinel-1 dual-pol SAR backscatter."
    supported_modalities = ["sar"]
    required_inputs = ["vv_idx", "vh_idx"]
    optional_inputs = []

    def execute(self, scene_id: str, source_uri: str, inputs: Dict[str, Any], output_dir: str) -> Dict[str, Any]:
        vv_idx = inputs.get("vv_idx")
        vh_idx = inputs.get("vh_idx")
        
        if not vv_idx or not vh_idx:
            raise ValueError("SAR tool requires both 'vv_idx' and 'vh_idx'")
            
        out_raster, vis_asset, stats, warnings = compute_sar_composite(
            scene_id=scene_id,
            source_uri=source_uri,
            vv_idx=vv_idx,
            vh_idx=vh_idx,
            output_dir=output_dir
        )
        
        return {
            "analysis_type": "SAR Analysis",
            "scene_id": scene_id,
            "formula": "RGB Composite (R: VV, G: VH, B: VV/VH)",
            "input_bands": {"VV": f"Band {vv_idx}", "VH": f"Band {vh_idx}"},
            "output_raster": out_raster,
            "visualization_asset": vis_asset,
            "statistics": stats,
            "warnings": warnings
        }
