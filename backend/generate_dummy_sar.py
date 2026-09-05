import os
import numpy as np
import rasterio
from rasterio.transform import from_origin

file_path = "dummy_sar.tif"
transform = from_origin(77.0, 28.0, 0.0001, 0.0001)

vv_data = np.random.uniform(0.01, 0.5, (256, 256)).astype(np.float32)
vh_data = np.random.uniform(0.001, 0.1, (256, 256)).astype(np.float32)

with rasterio.open(
    file_path, 'w', driver='GTiff',
    height=256, width=256, count=2, dtype=str(vv_data.dtype),
    crs='+proj=latlong', transform=transform,
    nodata=-9999.0
) as dst:
    dst.write(vv_data, 1)
    dst.set_band_description(1, 'VV')
    dst.write(vh_data, 2)
    dst.set_band_description(2, 'VH')
    
print(f"Created {file_path}")
