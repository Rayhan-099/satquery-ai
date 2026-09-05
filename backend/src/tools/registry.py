from typing import Dict
from .base import AnalysisTool

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, AnalysisTool] = {}
        
    def register(self, tool: AnalysisTool):
        self._tools[tool.name] = tool
        
    def get(self, name: str) -> AnalysisTool:
        if name not in self._tools:
            raise ValueError(f"Tool '{name}' is not registered.")
        return self._tools[name]
        
    def is_registered(self, name: str) -> bool:
        return name in self._tools

registry = ToolRegistry()
