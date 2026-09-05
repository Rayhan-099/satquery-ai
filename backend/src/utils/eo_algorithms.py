import rasterio
import numpy as np
import os
import matplotlib
import matplotlib.pyplot as plt
from typing import Dict, Any, Tuple

matplotlib.use('Agg')

def compute_ndvi(scene_id: str, source_uri: str, red_idx: int, nir_idx: int, output_dir: str = "uploads") -> Tuple[str, str, Dict[str, Any], list]:
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
        
        nodata_val = src.nodata
        if nodata_val is not None:
            mask = (red == nodata_val) | (nir == nodata_val)
        else:
            mask = np.isnan(red) | np.isnan(nir) | np.isinf(red) | np.isinf(nir)
            
        red = np.ma.masked_array(red, mask=mask)
        nir = np.ma.masked_array(nir, mask=mask)
        
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
        
        kwargs = src.meta.copy()
        kwargs.update({"driver": "GTiff", "count": 1, "dtype": rasterio.float32, "nodata": -9999.0})
        
        output_data = ndvi_masked.filled(-9999.0).astype(rasterio.float32)
        with rasterio.open(output_raster, 'w', **kwargs) as dst:
            dst.write(output_data, 1)
            
        cmap = plt.get_cmap("RdYlGn").with_extremes(bad=(0, 0, 0, 0))
        norm = plt.Normalize(vmin=-1, vmax=1)
        
        rgba = cmap(norm(ndvi_masked))
        rgba_8bit = (rgba * 255).astype(np.uint8)
        
        png_kwargs = src.meta.copy()
        png_kwargs.update({"driver": "PNG", "count": 4, "dtype": rasterio.uint8, "nodata": None})
        
        with rasterio.open(vis_asset, 'w', **png_kwargs) as dst_png:
            dst_png.write(rgba_8bit[:, :, 0], 1)
            dst_png.write(rgba_8bit[:, :, 1], 2)
            dst_png.write(rgba_8bit[:, :, 2], 3)
            dst_png.write(rgba_8bit[:, :, 3], 4)
            
    return output_raster, vis_asset, stats, warnings

def compute_ndwi(scene_id: str, source_uri: str, green_idx: int, nir_idx: int, output_dir: str = "uploads") -> Tuple[str, str, Dict[str, Any], list]:
    warnings = []
    output_raster = os.path.join(output_dir, f"{scene_id}_ndwi.tif")
    vis_asset = os.path.join(output_dir, f"{scene_id}_ndwi_vis.png")
    
    with rasterio.open(source_uri) as src:
        if green_idx < 1 or green_idx > src.count:
            raise ValueError(f"Invalid GREEN band index: {green_idx}")
        if nir_idx < 1 or nir_idx > src.count:
            raise ValueError(f"Invalid NIR band index: {nir_idx}")
            
        green = src.read(green_idx).astype(float)
        nir = src.read(nir_idx).astype(float)
        
        nodata_val = src.nodata
        mask = (green == nodata_val) | (nir == nodata_val) if nodata_val is not None else (np.isnan(green) | np.isnan(nir) | np.isinf(green) | np.isinf(nir))
            
        green = np.ma.masked_array(green, mask=mask)
        nir = np.ma.masked_array(nir, mask=mask)
        
        denominator = (green + nir)
        zero_denom = (denominator == 0)
        final_mask = mask | zero_denom
        if np.any(zero_denom):
            warnings.append("Division by zero encountered and masked.")
            
        ndwi = np.zeros_like(green, dtype=float)
        valid = ~final_mask
        ndwi[valid] = (green[valid] - nir[valid]) / denominator[valid]
        
        ndwi_masked = np.ma.masked_array(ndwi, mask=final_mask)
        
        valid_pixels = int(valid.sum())
        if valid_pixels == 0:
            raise ValueError("No valid pixels to compute NDWI.")
            
        stats = {
            "min": float(ndwi_masked.min()),
            "max": float(ndwi_masked.max()),
            "mean": float(ndwi_masked.mean()),
            "median": float(np.ma.median(ndwi_masked)),
            "std_dev": float(ndwi_masked.std()),
            "valid_pixels": valid_pixels
        }
        
        kwargs = src.meta.copy()
        kwargs.update({"driver": "GTiff", "count": 1, "dtype": rasterio.float32, "nodata": -9999.0})
        
        with rasterio.open(output_raster, 'w', **kwargs) as dst:
            dst.write(ndwi_masked.filled(-9999.0).astype(rasterio.float32), 1)
            
        cmap = plt.get_cmap("Blues").with_extremes(bad=(0, 0, 0, 0))
        norm = plt.Normalize(vmin=0, vmax=1) 
        rgba = cmap(norm(ndwi_masked))
        
        # Transparent non-water pixels (NDWI <= 0)
        non_water = (ndwi_masked <= 0) | final_mask
        rgba[non_water] = [0, 0, 0, 0]
        
        rgba_8bit = (rgba * 255).astype(np.uint8)
        
        png_kwargs = src.meta.copy()
        png_kwargs.update({"driver": "PNG", "count": 4, "dtype": rasterio.uint8, "nodata": None})
        
        with rasterio.open(vis_asset, 'w', **png_kwargs) as dst_png:
            for i in range(4):
                dst_png.write(rgba_8bit[:, :, i], i + 1)
                
    return output_raster, vis_asset, stats, warnings

def compute_sar_composite(scene_id: str, source_uri: str, vv_idx: int, vh_idx: int, output_dir: str = "uploads") -> Tuple[str, str, Dict[str, Any], list]:
    warnings = []
    output_raster = os.path.join(output_dir, f"{scene_id}_sar.tif")
    vis_asset = os.path.join(output_dir, f"{scene_id}_sar_vis.png")
    
    with rasterio.open(source_uri) as src:
        if vv_idx < 1 or vv_idx > src.count:
            raise ValueError(f"Invalid VV band index: {vv_idx}")
        if vh_idx < 1 or vh_idx > src.count:
            raise ValueError(f"Invalid VH band index: {vh_idx}")
            
        vv = src.read(vv_idx).astype(float)
        vh = src.read(vh_idx).astype(float)
        
        nodata_val = src.nodata
        mask = (vv == nodata_val) | (vh == nodata_val) if nodata_val is not None else (np.isnan(vv) | np.isnan(vh) | np.isinf(vv) | np.isinf(vh))
        
        vv = np.ma.masked_array(vv, mask=mask)
        vh = np.ma.masked_array(vh, mask=mask)
        
        ratio_mask = mask | (vh == 0)
        ratio = np.zeros_like(vv, dtype=float)
        valid = ~ratio_mask
        ratio[valid] = vv[valid] / vh[valid]
        ratio = np.ma.masked_array(ratio, mask=ratio_mask)
        
        valid_pixels = int(valid.sum())
        if valid_pixels == 0:
            raise ValueError("No valid pixels for SAR analysis.")
            
        stats = {
            "vv_mean": float(vv.mean()),
            "vh_mean": float(vh.mean()),
            "ratio_mean": float(ratio.mean()),
            "valid_pixels": valid_pixels
        }
        
        kwargs = src.meta.copy()
        kwargs.update({"driver": "GTiff", "count": 3, "dtype": rasterio.float32, "nodata": -9999.0})
        
        with rasterio.open(output_raster, 'w', **kwargs) as dst:
            dst.write(vv.filled(-9999.0).astype(rasterio.float32), 1)
            dst.write(vh.filled(-9999.0).astype(rasterio.float32), 2)
            dst.write(ratio.filled(-9999.0).astype(rasterio.float32), 3)
            
        def stretch(arr):
            arr_valid = arr[~arr.mask]
            if len(arr_valid) == 0: return np.zeros_like(arr, dtype=np.uint8)
            p2, p98 = np.percentile(arr_valid, (2, 98))
            if p98 == p2: p98 = p2 + 1e-5
            stretched = np.clip((arr - p2) / (p98 - p2), 0, 1)
            return (stretched * 255).filled(0).astype(np.uint8)
            
        r = stretch(vv)
        g = stretch(vh)
        b = stretch(ratio)
        alpha = (~mask * 255).astype(np.uint8)
        
        png_kwargs = src.meta.copy()
        png_kwargs.update({"driver": "PNG", "count": 4, "dtype": rasterio.uint8, "nodata": None})
        
        with rasterio.open(vis_asset, 'w', **png_kwargs) as dst_png:
            dst_png.write(r, 1)
            dst_png.write(g, 2)
            dst_png.write(b, 3)
            dst_png.write(alpha, 4)
            
    return output_raster, vis_asset, stats, warnings
