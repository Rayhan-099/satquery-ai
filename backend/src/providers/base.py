from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class EODataProvider(ABC):
    """
    Abstract base class for Earth Observation Data Providers.
    """

    @abstractmethod
    def search_scenes(self, 
                      bbox: List[float], 
                      start_date: str, 
                      end_date: str, 
                      sensor: str, 
                      max_cloud_cover: float = 20.0,
                      max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Search for scenes matching the criteria.
        Returns a list of structured scene metadata dictionaries.
        """
        pass

    @abstractmethod
    def download_asset(self, product_id: str, output_dir: str) -> str:
        """
        Download required assets for a given product ID.
        Returns the path to the ingested/stacked asset file (e.g. GeoTIFF).
        """
        pass
