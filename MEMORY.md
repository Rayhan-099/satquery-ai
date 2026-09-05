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
- Phase 2 Deterministic EO Pipeline implemented: 
  - GeoTIFF upload and metadata/bands extraction robustly implemented.
  - NDVI engine handles zero-division, nodata masks, and generates scientific GeoTIFFs alongside lightweight PNG overlays.
  - Frontend features a dark-mode Leaflet MapViewer overlaying NDVI results with bounding-box precision.
  - End-to-end testing verifies raster math and spatial bounds handling.

## Active Models
- *None currently integrated.*

## Important Environment / Setup
- **Dependencies:** Python 3.11+, Node 20+.
- **Database Connection:** Driven via `DATABASE_URL` in `.env`.
- *Never commit secrets.*

## Known Problems
- None yet.

## Decisions That Must Not Be Casually Reversed
- **Deterministic First:** Do not replace deterministic geospatial tools (e.g., NDVI calculation) with VLM predictions.
- **No Generic UI:** Do not use generic SaaS dashboard aesthetics. AWESOMEDESIGN.md must be followed strictly.
