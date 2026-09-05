# MEMORY.md: SatQuery AI

## Project Identity
- **Name:** SatQuery AI (SIH26167)
- **Goal:** Multimodal remote-sensing analysis via natural-language query interface.
- **Core Value:** Evidence-grounded responses over LLM guesses.

## Current Architecture
- **Frontend:** Next.js 15, React, Tailwind CSS (strict AWESOMEDESIGN rules apply).
- **Backend:** FastAPI (Python).
- **Database:** PostgreSQL hosted on Supabase (accessed via SQLAlchemy).
- **Geospatial Pipeline:** Rasterio, Shapely, GeoPandas for deterministic analysis.
- **Data Layer:** Local ephemeral storage for raster processing, migrating to Supabase Storage for persistent assets.

## Important Decisions
- **Database:** Supabase/PostgreSQL is the primary database platform. SQLite is deprecated for this project.
- **Modality Semantics:** Sentinel-1 (SAR) and Sentinel-2 (Optical) remain semantically distinct. Do NOT merge them into generic RGB arrays blindly.
- **Evidence-producing tools:** Preferred over LLM guesses. The LLM is a planner/reasoning layer, not the scientific computation engine.
- **Infrastructure:** The MVP should remain a modular monolith rather than unnecessary microservices. No Kubernetes or generic cloud overhead unless proven necessary.

## Current Implementation State
- Next.js and FastAPI initialized and migrated to Supabase.
- Phase 2 Deterministic EO Pipeline implemented (NDVI).
- Phase 3 Natural-Language Query Orchestration implemented:
  - Natural Language Chat interface fully functional.
  - Pluggable `AnalysisTool` registry implemented with `ndvi` wrapped as the first tool.
  - Deterministic `RuleBasedPlanner` correctly routes Vegetation queries to the NDVI execution engine, mapping optical bands correctly and generating grounded text from statistical evidence.
  - Architecture fully prepared for an LLM provider drop-in.
- Phase 4 Multimodal EO Intelligence & Real Analytical Tools implemented:
  - Documented Model Selection strategy favoring deterministic scientific capability over generic VLMs to guarantee SAR and spatial accuracy without hallucination.
  - Developed NDWI (Water Detection) and dual-pol Sentinel-1 SAR Backscatter pipelines.
  - Tools `water_index` and `sar_analysis` fully registered and orchestrated.
  - Established the `benchmark_queries.json` framework for future evaluation.
- Phase 5 Complete:
  - SatQuery now features a full UI with geospatial map overlays, multi-band GeoTIFF ingestion, rule-based query understanding, NDWI computation, SAR dual-pol (VV/VH) processing, and model-assisted natural language interpretation via a local LLM (`SmolLM-135M`).
  - A custom `EvidenceValidator` intercepts and prevents numerical hallucinations.
  - All commits are synced to `https://github.com/Rayhan-099/satquery-ai`.
  - A robust end-to-end Playwright test suite verifies UI query capabilities.

## Active Models
- *SmolLM-135M (integrated for local natural language interpretation).*

## Important Environment / Setup
- **Dependencies:** Python 3.11+, Node 20+.
- **Database Connection:** Driven via `DATABASE_URL` in `.env`.
- *Never commit secrets.*

## Known Problems
- None yet.

## Decisions That Must Not Be Casually Reversed
- **Deterministic First:** Do not replace deterministic geospatial tools (e.g., NDVI calculation) with VLM predictions.
- **No Generic UI:** Do not use generic SaaS dashboard aesthetics. AWESOMEDESIGN.md must be followed strictly.
