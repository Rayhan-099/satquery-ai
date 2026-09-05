import os
import numpy as np
import rasterio
from rasterio.transform import from_origin

# Create a dummy 4-band GeoTIFF, 256x256
file_path = "dummy_multispectral.tif"
transform = from_origin(77.0, 28.0, 0.0001, 0.0001)

red_data = np.random.uniform(100, 500, (256, 256)).astype(np.float32)
nir_data = np.random.uniform(200, 800, (256, 256)).astype(np.float32)
blue_data = np.zeros((256, 256), dtype=np.float32)
green_data = np.zeros((256, 256), dtype=np.float32)

with rasterio.open(
    file_path, 'w', driver='GTiff',
    height=256, width=256, count=4, dtype=str(red_data.dtype),
    crs='+proj=latlong', transform=transform,
    nodata=-9999.0
) as dst:
    dst.write(blue_data, 1)
    dst.set_band_description(1, 'Blue')
    dst.write(green_data, 2)
    dst.set_band_description(2, 'Green')
    dst.write(red_data, 3)
    dst.set_band_description(3, 'Red')
    dst.write(nir_data, 4)
    dst.set_band_description(4, 'NIR')
    
print(f"Created {file_path}")
