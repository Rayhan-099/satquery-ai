# MEMORY.md: SatQuery AI

## Project Identity
- **Project:** SatQuery AI
- **Context:** SIH 2026 / ISRO-SAC context (Problem Statement: SIH26167)
- **Goal:** Multimodal remote-sensing analysis via natural-language query interface.
- **Core Value:** Evidence-grounded responses over LLM guesses.

SatQuery is an evidence-grounded natural-language copilot for exploring, comparing, and interpreting multimodal satellite imagery.
The core interaction is:
```
Scene
  ↓
Natural-language question
  ↓
Query planner
  ↓
EO analysis tools
  ↓
Evidence
  ↓
Reasoning / response generation
  ↓
Spatial visualization
  ↓
Follow-up question
```

## Current Architecture
- **Frontend:** Next.js 15, React, Tailwind CSS (IMPLEMENTED)
- **Map:** Leaflet/React-Leaflet used for spatial bounds and visualization (IMPLEMENTED)
- **Backend:** FastAPI (Python) (IMPLEMENTED)
- **Database:** PostgreSQL on Supabase accessed via SQLAlchemy / Alembic (IMPLEMENTED). SQLite fallback strictly deprecated.
- **Data Pipeline:** Rasterio, NumPy, Shapely for deterministic geospatial computation (IMPLEMENTED)
- **Local Storage:** Ephemeral artifact storage for raster processing (IMPLEMENTED)
- **Copernicus Data Provider (CDSE):** OData and Keycloak implemented (IMPLEMENTED - Phase 7 fix)
- **Models:** SmolLM-135M-Instruct via local HF Transformers, used solely for semantic interpretation, not science (IMPLEMENTED)
- **Authentication (User):** Keycloak/Supabase Auth (DEFERRED)
- **Datasets (BigEarthNet / VRSBench):** (DEFERRED)

## Current Implementation State
- **Phase 1 (COMPLETE):** Initial FastAPI backend, scene ingestion, Rasterio metadata extraction, upload flow.
- **Supabase Architecture Setup (COMPLETE):** PostgreSQL migration, `.env` security, `AGENTS.md` rules, Playwright tests.
- **Phase 2 (COMPLETE):** Band semantics enforced. Optical NDVI pipeline implemented with GeoTIFF outputs and PNG visualization.
- **Phase 3 (COMPLETE):** Query orchestrator implemented (`query → planner → plan → executor → tool → evidence → response`). Type-safe `AnalysisPlan` and `RuleBasedPlanner` with unsupported-query handling.
- **Phase 4 (COMPLETE):** Multimodal EO intelligence. NDWI (water) and Sentinel-1 SAR dual-pol (VV/VH) backscatter pipelines implemented.
- **Phase 5 (COMPLETE):** Model gateway with SmolLM-135M-Instruct. Evidence-number validation and deterministic fallback if hallucination occurs. 
- **Phase 6 (COMPLETE):** `CopernicusDataProvider` fetching CDSE OData API. Data discovery UI allows querying by bbox and dates.
- **Phase 7 (COMPLETE):** Real CDSE ingestion implemented with Keycloak Auth token fetching and OData `$value` raster extraction. Strict fallback to `SYNTHETIC_FIXTURE` if credentials are missing to keep demos intact. Provenance tracking implemented in DB and UI.
- **Phase 8 (COMPLETE):** End-to-end evaluation benchmark suite built. 7 curated categories (Optical, SAR, Cross-modal, Temporal, Adversarial) evaluated against deterministic baseline. ML Gateway correctly falls back on hallucinations. Orchestrator accurately rejects unsupported capabilities.
- **Phase 9 (COMPLETE):** SIH Demo Readiness achieved. UI polished with skeleton loaders, query suggestions, clean unsupported capability responses, and Playwright Golden Path E2E verification. Added `DEMO_GUIDE.md` and `CAPABILITY_MATRIX.md`.

## What Actually Works
- Local GeoTIFF ingestion with metadata extraction.
- Natural language querying of scene features (Vegetation, Water).
- Deterministic NDVI and NDWI calculations with spatial heatmaps.
- Sentinel-1 SAR backscatter ingestion (VV/VH).
- CDSE OData Discovery by bounding box, date, and sensor.
- Provenance tracking (REAL vs SYNTHETIC vs LOCAL_UPLOAD).
- Scientific accuracy benchmarking via `run_benchmark.py`.
- End-to-end Playwright tests on frontend query UI.

## What Is Synthetic
- CDSE Asset Download if `CDSE_USERNAME` and `CDSE_PASSWORD` are missing from `.env` will fallback to copying `dummy_multispectral.tif` or `dummy_sar.tif`, marking its source explicitly as `SYNTHETIC_FIXTURE` in the UI to avoid misleading users.
- Phase 8 Benchmarks were run entirely on these `SYNTHETIC_FIXTURE` files to guarantee deterministic CI testability without relying on third-party Keycloak servers during standard runs.

## What Uses Real Copernicus Data
- Keycloak-authenticated CDSE downloads use the real OData `$value` endpoint to fetch the product, marked as `REAL_COPERNICUS`. (Requires valid credentials).

## What Is Deferred
- External User Authentication & RLS.
- Training/Evaluation on BigEarthNet and VRSBench.
- Persistent Cloud Storage (Supabase Storage) for TIFFs.
- Cross-modal true fusion (currently evaluates independently).
- Temporal change detection over time-series data.

## Current Tests
- `pytest` suite covers backend EO algorithms, query planner, and the mock CDSE provider endpoints. 
- `run_benchmark.py` covers E2E orchestration and NLP intent classification over `benchmark_queries.json`.
- `playwright` covers E2E search, query, and fallback UI states (Golden Path verified).

## Known Limitations
- The CDSE OData `$value` download pulls the entire SAFE archive, which is very slow/large. In production, a node-traversal logic should extract only necessary `.jp2` files, but for the MVP without guaranteed credentials, the current fallback structure is used.
- SmolLM-135M is very small and occasionally struggles with complex interpretations, relying on the deterministic fallback. (As proven in Phase 8, it hallucinates numbers on all complex tasks, correctly forcing the deterministic fallback every time). This is fully handled in the UI gracefully as "Evidence-based result".

## Next Recommended Phase
- **READY FOR SIH PRESENTATION.** SatQuery AI has achieved the goals set out for the MVP. It deterministically analyzes multimodal satellite data, tracks provenance, validates generative output, and safely rejects impossible tasks. It is fully ready for the SIH 2026 hackathon demonstration.

## Last Updated
- 2026-09-06
