import os
import sys
import json
import time
from fastapi.testclient import TestClient

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.main import app

client = TestClient(app)

def upload_dummy_scene(file_name):
    # Upload the file
    with open(file_name, "rb") as f:
        response = client.post("/images/upload", files={"file": f})
    if response.status_code != 200:
        raise Exception(f"Failed to upload {file_name}: {response.text}")
    return response.json()["id"]

def run_benchmark():
    print("Loading benchmark queries...")
    with open("tests/benchmark_queries.json", "r") as f:
        queries = json.load(f)
        
    print("Uploading dummy scenes...")
    opt_id = upload_dummy_scene("dummy_multispectral.tif")
    sar_id = upload_dummy_scene("dummy_sar.tif")
    
    results = []
    latencies = []
    
    print("Running benchmark...")
    for q in queries:
        print(f"Testing {q['id']}: '{q['query']}'")
        
        # Select scene based on modality
        scene_id = sar_id if q['modality'] == 'sentinel-1' else opt_id
        
        start_time = time.time()
        res = client.post("/query", json={"scene_id": scene_id, "query": q['query']})
        end_time = time.time()
        
        latency = (end_time - start_time) * 1000
        latencies.append(latency)
        
        res_data = res.json()
        
        # Evaluate
        status = res_data.get("status")
        
        if q["expected_rejection"]:
            is_correct_rejection = (status == "unsupported" or status == "clarification_required")
            passed = is_correct_rejection
            plan_intent = res_data.get("limitations", [""])[0] if is_correct_rejection else None
            actual_tool = "none"
        else:
            plan = res_data.get("plan", {})
            plan_intent = plan.get("intent")
            actual_tool = plan.get("tool")
            
            intent_correct = (plan_intent == q["expected_intent"])
            tool_correct = (actual_tool == q["expected_tool"])
            evidence_present = res_data.get("evidence") is not None
            
            passed = (status == "completed") and intent_correct and tool_correct and evidence_present
            
        result = {
            "query_id": q["id"],
            "category": q["category"],
            "passed": passed,
            "actual_intent": plan_intent,
            "actual_tool": actual_tool,
            "latency_ms": latency
        }
        results.append(result)
        
    passed_count = sum(1 for r in results if r["passed"])
    
    print("\nBenchmark Results:")
    print(f"Total: {len(results)}")
    print(f"Passed: {passed_count}")
    print(f"Failed: {len(results) - passed_count}")
    
    median_latency = sorted(latencies)[len(latencies)//2]
    p95_latency = sorted(latencies)[int(len(latencies) * 0.95)]
    
    print(f"Median Latency: {median_latency:.2f} ms")
    print(f"P95 Latency: {p95_latency:.2f} ms")
    
    with open("benchmark_results.json", "w") as f:
        json.dump({
            "results": results,
            "metrics": {
                "total": len(results),
                "passed": passed_count,
                "median_latency_ms": median_latency,
                "p95_latency_ms": p95_latency
            }
        }, f, indent=2)

if __name__ == "__main__":
    run_benchmark()
