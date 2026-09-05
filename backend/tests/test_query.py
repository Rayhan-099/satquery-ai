import pytest
from src.planner.rule_based import RuleBasedPlanner
from src.planner.models import AnalysisPlan

def test_rule_based_planner_supported():
    planner = RuleBasedPlanner()
    plan = planner.generate_plan("test_scene_123", "Where is the vegetation most dense?")
    
    assert plan.intent == "vegetation_analysis"
    assert plan.tool == "ndvi"
    assert plan.scene_id == "test_scene_123"
    assert plan.inputs["red"] == "B04"
    assert plan.inputs["nir"] == "B08"

def test_rule_based_planner_unsupported():
    planner = RuleBasedPlanner()
    with pytest.raises(ValueError, match="UNSUPPORTED_ANALYSIS"):
        planner.generate_plan("test_scene_123", "Show me the building footprints.")
        
    with pytest.raises(ValueError, match="UNSUPPORTED_ANALYSIS"):
        planner.generate_plan("test_scene_123", "Analyze data for change.")

def test_rule_based_planner_water():
    planner = RuleBasedPlanner()
    plan = planner.generate_plan("scene", "Where is the water?")
    assert plan.intent == "water_analysis"
    assert plan.tool == "water_index"

def test_rule_based_planner_sar():
    planner = RuleBasedPlanner()
    plan = planner.generate_plan("scene", "Analyze SAR data")
    assert plan.intent == "sar_analysis"
    assert plan.tool == "sar_analysis"

def test_rule_based_planner_unrecognized():
    planner = RuleBasedPlanner()
    with pytest.raises(ValueError, match="UNRECOGNIZED_INTENT"):
        planner.generate_plan("test_scene_123", "hello world what is this image")
