import os
import pytest
import numpy as np
import rasterio
from rasterio.transform import from_origin

# Make sure we can import from src
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.utils.eo_algorithms import compute_ndvi

TEST_DIR = "test_data"
os.makedirs(TEST_DIR, exist_ok=True)

@pytest.fixture
def mock_raster():
    # Create a 4-band dummy GeoTIFF
    file_path = os.path.join(TEST_DIR, "dummy_scene.tif")
    transform = from_origin(10.0, 20.0, 10.0, 10.0)
    
    # 3x3 pixels
    red_data = np.array([[100, 200, 300], [0, 50, 100], [50, 150, 200]], dtype=np.float32)
    nir_data = np.array([[200, 100, 300], [0, 50, 200], [250, 150, 200]], dtype=np.float32)
    
    with rasterio.open(
        file_path, 'w', driver='GTiff',
        height=3, width=3, count=4, dtype=str(red_data.dtype),
        crs='+proj=latlong', transform=transform,
        nodata=-9999.0
    ) as dst:
        dst.write(np.zeros((3, 3), dtype=np.float32), 1)
        dst.write(np.zeros((3, 3), dtype=np.float32), 2)
        dst.write(red_data, 3) # RED
        dst.write(nir_data, 4) # NIR
        
    yield file_path
    if os.path.exists(file_path):
        os.remove(file_path)

def test_compute_ndvi(mock_raster):
    out_tif, out_png, stats, warnings = compute_ndvi(
        scene_id="test_scene",
        source_uri=mock_raster,
        red_idx=3,
        nir_idx=4,
        output_dir=TEST_DIR
    )
    
    assert os.path.exists(out_tif)
    assert os.path.exists(out_png)
    
    # Check stats
    # At (0,0): red=100, nir=200 => (200-100)/(200+100) = 100/300 = 0.333
    # At (1,0): red=0, nir=0 => masked due to division by zero
    assert stats["valid_pixels"] == 8
    assert len(warnings) > 0 # Division by zero masked
    assert "Division by zero" in warnings[0]
    
    # Cleanup
    if os.path.exists(out_tif):
        os.remove(out_tif)
    if os.path.exists(out_png):
        os.remove(out_png)

def test_invalid_band_idx(mock_raster):
    with pytest.raises(ValueError, match="Invalid RED band index"):
        compute_ndvi("test", mock_raster, 5, 4, TEST_DIR)
