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
            return {
                "crs": crs,
                "bounds": json.dumps(bounds),
                "width": float(src.width),
                "height": float(src.height),
                "count": src.count,
                "dtypes": src.dtypes
            }
    except Exception as e:
        raise Exception(f"Failed to extract metadata: {str(e)}")
