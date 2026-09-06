import os
os.environ["CUDA_VISIBLE_DEVICES"] = ""

from src.ml.gateway import ModelGateway

gateway = ModelGateway("HuggingFaceTB/SmolLM-135M-Instruct")
evidence = {
    "analysis_type": "NDVI",
    "statistics": {
        "mean": 0.5134,
        "max": 0.87,
        "valid_pixels": 65536
    }
}

print("Running Model Gateway Inference...")
res = gateway.interpret_evidence(evidence)
print("Model Output:")
print(res)
