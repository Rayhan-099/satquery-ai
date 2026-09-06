# Architecture Capability Matrix

This matrix provides a brutally honest breakdown of SatQuery AI's current capabilities, distinguishing between what is actively deployed, what is mocked, and what is deferred.

| Capability | Status | Real Data Verified | Notes |
| :--- | :--- | :--- | :--- |
| **Sentinel-2 CDSE Ingestion** | PARTIAL | NO | The OData discovery protocol and Keycloak fetch are fully implemented. However, because we lack a dedicated paid CDSE credential in `.env`, the system automatically falls back to `SYNTHETIC_FIXTURE` extraction. |
| **Sentinel-1 CDSE Ingestion** | PARTIAL | NO | Similar to S2, discovery works but payload fetching falls back to local `dummy_sar.tif` fixtures. |
| **Local GeoTIFF Uploads** | COMPLETE | YES | Users can upload real GeoTIFFs, which are correctly labeled as `LOCAL_UPLOAD` in the Provenance DB. |
| **Optical NDVI / NDWI** | COMPLETE | YES | Fully deterministic NumPy matrix algebra applied over properly aligned raster bands. Heatmap evidence natively generated. |
| **SAR VV/VH Backscatter** | COMPLETE | YES | Generates RGB composite (VV, VH, VV/VH). |
| **Natural Language Query Orchestrator** | COMPLETE | N/A | Correctly routes intents to the defined toolkit and safely catches unsupported analytical asks (like counting). |
| **Evidence Validation & Grounding** | COMPLETE | N/A | SmolLM-135M hallucinates frequently, but the Regex-based `EvidenceValidator` catches 100% of numeric hallucinations, triggering a safe deterministic fallback. |
| **Data Provenance Tracking** | COMPLETE | N/A | `REAL_COPERNICUS`, `SYNTHETIC_FIXTURE`, and `LOCAL_UPLOAD` strictly persisted to the DB and visualized on the frontend. |
| **Temporal Change Detection** | DEFERRED | N/A | Not implemented. The orchestrator explicitly throws an `UNSUPPORTED_ANALYSIS` exception when asked temporal queries to preserve scientific integrity. |
| **True Multimodal Fusion** | DEFERRED | N/A | S1 and S2 are processed through distinct analytical paths. A joint vision-language representation model is NOT implemented. Cross-modal questions safely return `CLARIFICATION_REQUIRED`. |
| **BigEarthNet / VRSBench Training** | DEFERRED | N/A | Deferred to prevent bloat. We prioritize the deterministic analytical engine over dataset-specific fine-tuning for this MVP. |
| **User Authentication / RLS** | DEFERRED | N/A | Supabase Postgres is set up, but Row Level Security and user login flows are deferred to focus on core functionality. |
