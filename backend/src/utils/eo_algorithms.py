import rasterio
import numpy as np
import os
import matplotlib
import matplotlib.pyplot as plt
from typing import Dict, Any, Tuple

matplotlib.use('Agg')

def compute_ndvi(scene_id: str, source_uri: str, red_idx: int, nir_idx: int, output_dir: str = "uploads") -> Tuple[str, str, Dict[str, Any], list]:
    """
    Computes NDVI from a given raster and band indices (1-based).
    Returns (output_raster_path, vis_asset_path, stats_dict, warnings_list)
    """
    warnings = []
    output_raster = os.path.join(output_dir, f"{scene_id}_ndvi.tif")
    vis_asset = os.path.join(output_dir, f"{scene_id}_ndvi_vis.png")
    
    with rasterio.open(source_uri) as src:
        if red_idx < 1 or red_idx > src.count:
            raise ValueError(f"Invalid RED band index: {red_idx}")
        if nir_idx < 1 or nir_idx > src.count:
            raise ValueError(f"Invalid NIR band index: {nir_idx}")
            
        red = src.read(red_idx).astype(float)
        nir = src.read(nir_idx).astype(float)
        
        # Handle nodata
        nodata_val = src.nodata
        if nodata_val is not None:
            mask = (red == nodata_val) | (nir == nodata_val)
        else:
            # Mask NaN or Inf
            mask = np.isnan(red) | np.isnan(nir) | np.isinf(red) | np.isinf(nir)
            
        red = np.ma.masked_array(red, mask=mask)
        nir = np.ma.masked_array(nir, mask=mask)
        
        # Compute NDVI with zero-division protection
        denominator = (nir + red)
        zero_denom = (denominator == 0)
        final_mask = mask | zero_denom
        if np.any(zero_denom):
            warnings.append("Division by zero encountered and masked.")
            
        ndvi = np.zeros_like(red, dtype=float)
        valid = ~final_mask
        ndvi[valid] = (nir[valid] - red[valid]) / denominator[valid]
        
        ndvi_masked = np.ma.masked_array(ndvi, mask=final_mask)
        
        valid_pixels = int(valid.sum())
        if valid_pixels == 0:
            raise ValueError("No valid pixels to compute NDVI.")
            
        stats = {
            "min": float(ndvi_masked.min()),
            "max": float(ndvi_masked.max()),
            "mean": float(ndvi_masked.mean()),
            "median": float(np.ma.median(ndvi_masked)),
            "std_dev": float(ndvi_masked.std()),
            "valid_pixels": valid_pixels
        }
        
        # Save output scientific raster
        kwargs = src.meta.copy()
        kwargs.update({
            "driver": "GTiff",
            "count": 1,
            "dtype": rasterio.float32,
            "nodata": -9999.0
        })
        
        output_data = ndvi_masked.filled(-9999.0).astype(rasterio.float32)
        
        with rasterio.open(output_raster, 'w', **kwargs) as dst:
            dst.write(output_data, 1)
            
        # Generate visualization asset (PNG overlay)
        cmap = plt.get_cmap("RdYlGn").with_extremes(bad=(0, 0, 0, 0))
        norm = plt.Normalize(vmin=-1, vmax=1)
        
        rgba = cmap(norm(ndvi_masked))
        rgba_8bit = (rgba * 255).astype(np.uint8)
        
        png_kwargs = src.meta.copy()
        png_kwargs.update({
            "driver": "PNG",
            "count": 4,
            "dtype": rasterio.uint8,
            "nodata": None
        })
        
        with rasterio.open(vis_asset, 'w', **png_kwargs) as dst_png:
            dst_png.write(rgba_8bit[:, :, 0], 1)
            dst_png.write(rgba_8bit[:, :, 1], 2)
            dst_png.write(rgba_8bit[:, :, 2], 3)
            dst_png.write(rgba_8bit[:, :, 3], 4)
            
    return output_raster, vis_asset, stats, warnings
