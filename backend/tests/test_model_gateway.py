import pytest
from src.ml.validator import EvidenceValidator
from src.ml.gateway import ModelGateway

def test_evidence_validator():
    validator = EvidenceValidator()
    
    evidence = {
        "analysis_type": "NDVI",
        "statistics": {
            "mean": 0.5134,
            "max": 0.87,
            "valid_pixels": 65536
        }
    }
    
    # 1. Valid claim
    assert validator.validate_claims("The mean NDVI is 0.51.", evidence) is True
    assert validator.validate_claims("Max value reached 0.87 over 65536 pixels.", evidence) is True
    
    # 2. Hallucinated claim
    assert validator.validate_claims("The mean NDVI is 0.99.", evidence) is False
    assert validator.validate_claims("There are 1000 buildings.", evidence) is False
    
    # 3. Generic claim lacking evidence numbers
    assert validator.validate_claims("The NDVI is a measure of vegetation.", evidence) is False

def test_model_gateway_fallback():
    # If we pass an invalid model, it should fail to load and return None,
    # which allows the ResponseGenerator to fallback cleanly.
    gateway = ModelGateway(model_id="invalid-model-name-for-test")
    
    # Ensure it doesn't crash on invalid evidence
    evidence = {"test": 123}
    result = gateway.interpret_evidence(evidence)
    
    # It should return None on failure
    assert result is None
    assert gateway.load_failed is True
