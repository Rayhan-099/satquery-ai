import rasterio
import json

def extract_metadata(file_path: str):
    try:
        with rasterio.open(file_path) as src:
            crs = src.crs.to_string() if src.crs else "UNKNOWN"
            bounds = {
                "left": src.bounds.left,
                "bottom": src.bounds.bottom,
                "right": src.bounds.right,
                "top": src.bounds.top
            }
            bands_metadata = []
            for i in range(1, src.count + 1):
                desc = src.descriptions[i - 1]
                try:
                    color = src.colorinterp[i - 1].name
                except Exception:
                    color = "UNKNOWN"
                    
                bands_metadata.append({
                    "index": i,
                    "description": desc,
                    "color_interpretation": color
                })

            return {
                "crs": crs,
                "bounds": json.dumps(bounds),
                "width": float(src.width),
                "height": float(src.height),
                "count": src.count,
                "dtypes": src.dtypes,
                "bands_metadata": bands_metadata
            }
    except Exception as e:
        raise Exception(f"Failed to extract metadata: {str(e)}")
