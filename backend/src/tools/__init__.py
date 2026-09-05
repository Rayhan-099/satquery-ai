from .registry import registry
from .ndvi_tool import NDVITool
from .water_tool import WaterTool
from .sar_tool import SARTool

registry.register(NDVITool())
registry.register(WaterTool())
registry.register(SARTool())
