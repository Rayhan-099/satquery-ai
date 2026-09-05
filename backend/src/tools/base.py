from abc import ABC, abstractmethod
from typing import Dict, Any, List

class AnalysisTool(ABC):
    name: str
    description: str
    supported_modalities: List[str]
    required_inputs: List[str]
    optional_inputs: List[str]
    
    @abstractmethod
    def execute(self, scene_id: str, source_uri: str, inputs: Dict[str, Any], output_dir: str) -> Dict[str, Any]:
        """
        Executes the deterministic tool.
        Must return a structured dictionary representing the evidence payload.
        """
        pass
