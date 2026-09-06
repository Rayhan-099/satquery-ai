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

## Final Architecture
- **Frontend:** Next.js 15, React, Tailwind CSS (VERIFIED)
- **Map:** Leaflet/React-Leaflet used for spatial bounds and visualization (VERIFIED)
- **Backend:** FastAPI (Python) (VERIFIED)
- **Database:** PostgreSQL on Supabase accessed via SQLAlchemy / Alembic (VERIFIED). SQLite fallback strictly deprecated.
- **Data Pipeline:** Rasterio, NumPy, Shapely for deterministic geospatial computation (VERIFIED)
- **Local Storage:** Ephemeral artifact storage on disk for raster processing (VERIFIED)
- **Copernicus Data Provider (CDSE):** OData and Keycloak implemented (PARTIAL - Falls back to synthetic locally due to missing prod credentials)
- **Models:** SmolLM-135M-Instruct via local HF Transformers, used solely for semantic interpretation, not science (VERIFIED)
- **Authentication (User):** Keycloak/Supabase Auth (DEFERRED)
- **Datasets (BigEarthNet / VRSBench):** (DEFERRED)

## Phase History
- **Phase 1 (IMPLEMENTED):** Initial FastAPI backend, scene ingestion, Rasterio metadata extraction, upload flow.
- **Phase 2 (IMPLEMENTED):** Band semantics enforced. Optical NDVI pipeline implemented with GeoTIFF outputs and PNG visualization.
- **Phase 3 (IMPLEMENTED):** Query orchestrator implemented (`query → planner → plan → executor → tool → evidence → response`). Type-safe `AnalysisPlan` and `RuleBasedPlanner` with unsupported-query handling.
- **Phase 4 (IMPLEMENTED):** Multimodal EO intelligence. NDWI (water) and Sentinel-1 SAR dual-pol (VV/VH) backscatter pipelines implemented.
- **Phase 5 (IMPLEMENTED):** Model gateway with SmolLM-135M-Instruct. Evidence-number validation and deterministic fallback if hallucination occurs. 
- **Phase 6 (IMPLEMENTED):** `CopernicusDataProvider` fetching CDSE OData API. Data discovery UI allows querying by bbox and dates.
- **Phase 7 (IMPLEMENTED):** Real CDSE ingestion implemented with Keycloak Auth token fetching and OData `$value` raster extraction. Strict fallback to `SYNTHETIC_FIXTURE`. Provenance tracking implemented in DB and UI.
- **Phase 8 (VERIFIED):** End-to-end evaluation benchmark suite built. 7 curated categories evaluated against deterministic baseline. ML Gateway correctly falls back on hallucinations. Orchestrator accurately rejects unsupported capabilities.
- **Phase 9 (VERIFIED):** SIH Demo Readiness achieved. UI polished with skeleton loaders, query suggestions, clean unsupported capability responses, and Playwright Golden Path E2E verification. Added `DEMO_GUIDE.md` and `CAPABILITY_MATRIX.md`.
- **Phase 10 (VERIFIED):** Final Engineering Audit. Security check passed. Dependency audit passed. Playwright E2E and Pytest (11/11) passing. Phase 8 Benchmark passing 100%. `PERFORMANCE.md` established. `SIH_JUDGE_QA.md` finalized. Final SIH submission status confirmed.

## Final Capabilities (Verified)
- Local GeoTIFF ingestion with metadata extraction.
- Natural language querying of scene features (Vegetation, Water).
- Deterministic NDVI and NDWI calculations with spatial heatmaps.
- Sentinel-1 SAR backscatter ingestion (VV/VH).
- CDSE OData Discovery by bounding box, date, and sensor.
- Provenance tracking (REAL vs SYNTHETIC vs LOCAL_UPLOAD).
- Scientific accuracy benchmarking via `run_benchmark.py`.
- End-to-end Playwright tests on frontend query UI.

## Real Data
- **Sentinel-1**: End-to-end processing logic works (VV/VH extraction), but CDSE payload fetching defaults to `SYNTHETIC_FIXTURE` if `.env` lacks active credentials.
- **Sentinel-2**: Same behavior. OData logic verified, but large payload fetching defaults to `SYNTHETIC_FIXTURE`.

## Synthetic Data
- `dummy_multispectral.tif` and `dummy_sar.tif` act as resilient offline fallback fixtures. All benchmark cases and standard dev environment demos rely on these for instant, reliable validation.

## Generative AI
- **Planner**: `RuleBasedPlanner` (Deterministic intent extraction mapping NLP to code).
- **Model**: `SmolLM-135M-Instruct` (Strictly used as a translation layer from statistical evidence to English).
- **Validation**: `EvidenceValidator` extracts generated numbers via Regex and compares them to actual Python floats.
- **Fallback**: If numbers don't match, system discards the LLM entirely and prints: *"Evidence-based result: The generative explanation could not be reliably grounded..."*

## Evaluation
- **Benchmark**: 7/7 tests pass across 5 domains.
- **Pytest**: 11/11 tests pass.
- **Playwright**: Golden Path workflow passes perfectly.
- **Security**: No tokens or passwords leaked in Git history. `.env` strictly ignored.

## Performance
- **Planner Refusals**: ~4 ms
- **EO Analysis (NDVI)**: ~200 - 450 ms
- **LLM Cold Start**: ~23.4 sec
- **LLM Hot Inference**: ~3 - 5 sec
- *(See `PERFORMANCE.md` for full hardware breakdown)*

## Demo
- Recommended workflow detailed in `docs/DEMO_GUIDE.md` utilizing Local Upload of `dummy_multispectral.tif` to showcase provenance, analysis, and safety fallback in 3 distinct steps.

## Judge Questions
- All potential SIH Judge critiques recorded and answered in `docs/SIH_JUDGE_QA.md`. The strategy focuses on scientific rigor over flashy, hallucinatory LLM features.

## Known Limitations
- CDSE API `$value` downloads the entire `.SAFE` archive, which is 1GB+ per scene.
- Small LLM (135M) struggles with zero-shot interpretation, relying heavily on the robust deterministic validation net.

## Deferred Work
- True multimodal joint fusion (S1+S2 processed together).
- Temporal change detection over time series.
- BigEarthNet fine-tuning.
- User Authentication (RLS) via Supabase.

## Final Status
- **SIH DEMO READY**

## Last Updated
- 2026-09-06
