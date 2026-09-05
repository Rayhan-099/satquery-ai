import pytest
from unittest.mock import patch
from src.providers.copernicus import CopernicusDataProvider
import os

@patch("src.providers.copernicus.httpx.Client.get")
def test_copernicus_search_scenes(mock_get):
    provider = CopernicusDataProvider()
    
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "value": [
            {
                "Id": "1234-abcd",
                "Name": "S2A_MSIL2A_20230805T101010_N0509_R022_T33UUP_20230805T151515.SAFE",
                "ContentDate": {"Start": "2023-08-05T10:10:10.000Z"},
                "ContentLength": 1000000,
                "Online": True
            }
        ]
    }
    
    results = provider.search_scenes(
        bbox=[12.45, 41.89, 12.55, 41.95],
        start_date="2023-08-01T00:00:00Z",
        end_date="2023-08-10T23:59:59Z",
        sensor="sentinel-2"
    )
    
    assert len(results) == 1
    assert results[0]["id"] == "1234-abcd"
    assert results[0]["sensor"] == "sentinel-2"
    assert results[0]["provider"] == "Copernicus Data Space Ecosystem"

@patch("src.providers.copernicus.shutil.copy")
@patch("src.providers.copernicus.os.path.exists")
def test_copernicus_download_mocked(mock_exists, mock_copy):
    # Tests the mock fallback download
    provider = CopernicusDataProvider()
    mock_exists.return_value = True
    
    # We mock the CDSE call that checks the name
    with patch("src.providers.copernicus.httpx.Client.get") as mock_get:
        mock_get.return_value.json.return_value = {"Name": "S2A_MSIL2A_20230805"}
        
        path = provider.download_asset("1234-abcd", "/tmp")
        assert path.startswith("/tmp/scene_")
        assert path.endswith(".tif")
        mock_copy.assert_called_once()
