# Architecture Capability Matrix

This matrix provides a brutally honest breakdown of SatQuery AI's current capabilities, distinguishing between what is actively deployed, what is mocked, and what is deferred for the SIH MVP.

| Capability | Status | Real Data Verified | Notes |
| :--- | :--- | :--- | :--- |
| **Sentinel-2 Discovery** | VERIFIED | NO (Falls back to Synthetic) | The OData protocol is verified. Real downloading is partial pending credentials. |
| **Sentinel-2 Band Semantics** | VERIFIED | YES (via Upload) | Extracts exact B04, B08, B03 data for accurate arithmetic via Rasterio. |
| **NDVI Calculation** | VERIFIED | YES | Deterministic NumPy math. Verified in E2E tests and benchmarks. |
| **NDWI Calculation** | VERIFIED | YES | Deterministic NumPy math. Verified in E2E tests and benchmarks. |
| **Sentinel-1 Discovery** | VERIFIED | NO (Falls back to Synthetic) | Same state as S2 discovery. |
| **VV/VH Backscatter** | VERIFIED | YES (via Upload) | Accurately extracts polarization matrices. |
| **SAR Analysis Composite** | VERIFIED | YES | Generates mathematical RGB composite (VV, VH, VV/VH). |
| **Natural Language Planning** | VERIFIED | N/A | Correctly routes intents 100% of the time based on Phase 8 benchmarks. |
| **Evidence Generation** | VERIFIED | N/A | Successfully generates stats distributions and GeoTIFF heatmap artifacts. |
| **Provenance Tracking** | VERIFIED | N/A | Explicitly tracks and exposes `REAL_COPERNICUS`, `SYNTHETIC_FIXTURE`, `LOCAL_UPLOAD`. |
| **Grounded Response** | VERIFIED | N/A | Language model (SmolLM) generates text based *only* on statistical evidence. |
| **Unsupported Query Handling**| VERIFIED | N/A | System correctly catches and safely refuses unsupported questions (e.g., crop IDs). |
| **Temporal Analysis** | UNSUPPORTED | N/A | Architecturally unsupported. The orchestrator explicitly throws `UNSUPPORTED_ANALYSIS`. |
| **Change Detection** | UNSUPPORTED | N/A | Explicitly rejected by the query orchestrator to protect scientific integrity. |
| **True Multimodal Fusion** | DEFERRED | N/A | S1 and S2 run in parallel paths; a true joint latent fusion layer is deferred. |
| **Crop Classification** | UNSUPPORTED | N/A | Explicitly rejected by system constraints. |
| **Building Detection** | UNSUPPORTED | N/A | Explicitly rejected by system constraints. |
| **Object Detection** | UNSUPPORTED | N/A | Explicitly rejected by system constraints. |
