# SatQuery AI

**SatQuery AI** is an evidence-grounded, natural-language copilot for exploring, comparing, and interpreting multimodal satellite imagery. Built for **SIH 2026 (Problem Statement: SIH26167)** in collaboration with **ISRO-SAC**.

## The Problem
Earth Observation (EO) data is incredibly powerful but inaccessible. To understand a satellite scene, an analyst traditionally needs specialized GIS software, a deep understanding of spectral bands, and custom Python scripts. 

## The Solution
SatQuery AI allows users to ask natural-language questions about satellite imagery (e.g., *"Where is vegetation strongest?"*). 

Unlike a generic LLM which would hallucinate an answer, SatQuery's orchestrator translates the intent into a specific **deterministic EO tool** (like NDVI calculation). It processes the raster mathematics explicitly, generates a spatial heatmap, extracts precise statistics, and *only then* uses an LLM to summarize the proven evidence.

**Core Differentiator:** If the LLM hallucinates a number, our `EvidenceValidator` intercepts it and strictly forces a deterministic fallback response. We refuse to invent science.

## Capabilities

| Capability | Supported? | Description |
| :--- | :---: | :--- |
| **Sentinel-2** (Optical) | ✅ | Calculates NDVI, NDWI from B04, B08, B03. |
| **Sentinel-1** (SAR) | ✅ | Extracts VV/VH backscatter and creates RGB composites. |
| **Natural Language Queries** | ✅ | Intents are mapped to distinct, deterministic analysis pipelines. |
| **Data Provenance** | ✅ | Explicitly tracks whether data is `REAL_COPERNICUS`, `SYNTHETIC_FIXTURE`, or `LOCAL_UPLOAD`. |
| **Copernicus Integration** | 🟡 | CDSE OData discovery is verified. Asset downloading works, but falls back to synthetic data locally if Keycloak credentials aren't supplied in `.env`. |
| **Temporal Change Detection** | ❌ | **Unsupported.** System safely refuses questions to preserve scientific integrity. |
| **Crop/Object Detection** | ❌ | **Unsupported.** System safely refuses questions. |

*For a full capability matrix, see [CAPABILITY_MATRIX.md](./docs/architecture/CAPABILITY_MATRIX.md).*

## Architecture
- **Frontend:** Next.js 15, React, Tailwind CSS, React-Leaflet
- **Backend:** FastAPI (Python), SQLAlchemy, Alembic
- **Database:** PostgreSQL (via Supabase)
- **Data Engine:** Rasterio, NumPy, Shapely
- **Generative AI:** SmolLM-135M-Instruct (used *strictly* for text interpretation)

## Getting Started
Please see the [Demo Setup Guide](./docs/DEMO_SETUP.md) for one-command installation instructions to run the SIH prototype locally.

## Project History
SatQuery AI was developed over 10 strict engineering phases, emphasizing scientific validity, robustness, and deterministic design over hyped AI features. For the full engineering history, see `MEMORY.md`.
