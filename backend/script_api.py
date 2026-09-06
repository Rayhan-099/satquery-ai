import httpx

with httpx.Client() as client:
    with open("dummy_multispectral.tif", "rb") as f:
        res1 = client.post("http://localhost:8000/images/upload", files={"file": f})
    scene = res1.json()
    print("Upload:", scene)

    res2 = client.post("http://localhost:8000/query", json={"scene_id": scene["id"], "query": "Where is the water?"}, timeout=60.0)
    print("Query:", res2.json())
