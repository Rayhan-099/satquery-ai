# SatQuery AI: SIH 2026 Demo Guide

## Demo Objective
SatQuery AI demonstrates an evidence-grounded, natural-language copilot for Earth Observation (EO). The core differentiator is that the LLM is used **strictly for query interpretation and explanation**. Actual scientific operations (e.g., NDVI, SAR backscatter analysis) are performed by deterministic tools, ensuring that **SatQuery behaves like a scientific analysis system with an AI interface, not a chatbot pretending to understand satellite imagery.**

## Recommended Scene
- **Optical Demo:** Use the provided `dummy_multispectral.tif` (simulating Sentinel-2 L2A).
- **SAR Demo:** Use `dummy_sar.tif` (simulating Sentinel-1 GRD).

## Presentation Flow

### 1. Scene Ingestion & Provenance
*Action:* Start by uploading `dummy_multispectral.tif` via the Local Upload tab.
*Talking Point:* "All imagery in SatQuery is explicitly tagged with its provenance. Here you can see it's marked as `LOCAL_UPLOAD` (or `REAL_COPERNICUS` / `SYNTHETIC_FIXTURE`), ensuring the analyst always knows exactly where the data came from."

### 2. Demo Query 1 (Optical / NDVI)
*Action:* Click the suggested query: **"Where is vegetation strongest?"** and click Analyze.
*Wait ~15-20s (first inference latency) while the skeleton loader plays.*
*Talking Point:* "SatQuery translates the natural language intent into a deterministic analysis plan. It selects the NDVI tool and computes it across the scene. The LLM then generates an explanation, but it is strictly audited by our `EvidenceValidator` to ensure no numerical hallucinations."

### 3. Demo Query 2 (SAR Backscatter)
*Action:* Upload `dummy_sar.tif`, then click the suggested query: **"Compare VV and VH backscatter."**
*Talking Point:* "The system is modality-aware. It recognizes SAR terminology and routes this to the Sentinel-1 pipeline to process VV and VH polarizations, producing an RGB composite evidence layer."

### 4. Demo Query 3 (Safety / Refusal)
*Action:* Enter: **"What exact crop species are growing here?"** and click Analyze.
*Talking Point:* "Scientific integrity requires saying 'I don't know'. SatQuery refuses to guess crop species because it lacks the specific hyperspectral or temporal evidence required, cleanly returning an 'Insufficient Evidence' state instead of hallucinating."

## Expected Results
Judges should see:
1. **Provenance:** Clear tracking of data origin.
2. **Spatial Grounding:** A heatmap overlay perfectly aligned with the bounding box.
3. **Statistical Grounding:** True mathematical means/medians displayed alongside the text response.
4. **Safety:** A robust refusal to answer unscientific questions.

## Backup Plan
If Keycloak CDSE authentication fails or the internet goes down, **do not panic**. 
SatQuery has a built-in strict fallback mechanism: it will automatically generate and serve `SYNTHETIC_FIXTURE` raster subsets. These will be visually marked with an amber warning tag in the UI so you can honestly disclose to the judges that it is currently operating in offline evaluation mode.
