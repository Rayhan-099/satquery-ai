# SatQuery AI — Production Audit

**Date:** 2026-09-07  
**Scope:** Full repository audit before production hardening

---

## 1. Current Architecture

```
Browser (Vercel-deployed Next.js 16)
  ↓ /api/* (catch-all proxy route)
Next.js API Routes (server-side)
  ↓ HTTP fetch
FastAPI backend (OCI ARM64 container, port 8000)
  ├── /images/upload       → GeoTIFF ingestion + metadata extraction
  ├── /images/{id}/analyze/ndvi → Direct NDVI endpoint (legacy)
  ├── /query               → NL query orchestrator
  ├── /discovery/search    → CDSE OData search
  ├── /discovery/ingest    → CDSE download / synthetic fallback
  └── /uploads/...         → Static file serving (generated assets)

Database: SQLite file (satquery.db) — despite MEMORY.md claiming PostgreSQL
ML: SmolLM-135M-Instruct via HuggingFace Transformers (lazy-loaded)
EO: Rasterio + NumPy deterministic pipelines (NDVI, NDWI, SAR composite)
Map: Leaflet via react-leaflet
```

---

## 2. Verified Working Capabilities

| Capability | Status | Notes |
|---|---|---|
| GeoTIFF upload + metadata extraction | VERIFIED | Via /images/upload |
| NDVI computation (deterministic) | VERIFIED | Correct raster algebra, PNG vis output |
| NDWI computation (deterministic) | VERIFIED | Same pattern as NDVI |
| SAR dual-pol composite (VV/VH) | VERIFIED | Percentile stretch, RGB composite |
| Rule-based query planner | VERIFIED | Maps NL to intent to tool |
| Plan executor | VERIFIED | Band resolution, tool dispatch |
| Evidence validator | VERIFIED | Regex-based hallucination check |
| Model gateway (SmolLM fallback) | VERIFIED | Graceful degradation if torch missing |
| Response generator (deterministic fallback) | VERIFIED | Statistics-grounded text |
| Tool registry | VERIFIED | 3 tools: ndvi, water_index, sar_analysis |
| CDSE OData search | VERIFIED | Real API calls to catalogue.dataspace.copernicus.eu |
| CDSE ingest (synthetic fallback) | VERIFIED | Falls back to dummy TIFs without creds |
| Unsupported query handling | VERIFIED | UNSUPPORTED_ANALYSIS / UNRECOGNIZED_INTENT |
| Provenance tracking | VERIFIED | LOCAL_UPLOAD / SYNTHETIC_FIXTURE / REAL_COPERNICUS |
| Next.js proxy route | PARTIAL | Functional but has issues (see below) |
| Leaflet map with bounds | VERIFIED | CARTO dark basemap, image overlay |
| Backend tests (pytest) | VERIFIED | 4 test files, approx 11 tests |
| Frontend tests (Playwright) | VERIFIED | 3 spec files including golden path |
| Benchmark suite | VERIFIED | 7 curated queries in evaluation/ |

---

## 3. Broken / Incomplete Capabilities

| Issue | Severity | Description |
|---|---|---|
| No /health endpoint | HIGH | Backend has no health check. Required for monitoring and proxy verification. |
| Discovery ingest DB model mismatch | HIGH | discovery.py sets filename= and path= on Scene, but models.py has no such columns. Will crash. |
| Proxy error response leaks internals | MEDIUM | Proxy returns raw error.cause string to browser (route.ts line 47). |
| Proxy returns 500 instead of 502 | MEDIUM | Backend connection failures return 500 rather than 502. |
| No file size limit on upload | MEDIUM | Arbitrary file sizes accepted. |
| No filename sanitization | MEDIUM | File extension check only. No path traversal protection. |
| httpx not in requirements.txt | MEDIUM | copernicus.py uses it but it is not listed. |
| No acquisition_time from metadata | LOW | geo.extract_metadata does not return acquisition_time. |
| .env contains SQLite URL | LOW | Contradicts MEMORY.md PostgreSQL claim. SQLite works for MVP. |
| Layout metadata says Create Next App | LOW | layout.tsx title and description are defaults. |
| lucide-react in package.json | LOW | Installed but never used. Prohibited by AWESOMEDESIGN.md. |
| Geist font in layout.tsx | LOW | AWESOMEDESIGN.md prohibits Geist. |

---

## 4. Deployment Blockers

### 4.1 Hard-coded OCI IP in proxy (CRITICAL)
- File: frontend/src/app/api/[...path]/route.ts line 3
- Issue: Fallback to http://161.118.164.37:8000 if env var missing
- Fix: Remove fallback. Require BACKEND_API_URL. Return 503 if missing.

### 4.2 Discovery ingest will crash in production
- File: backend/src/routers/discovery.py lines 90-103
- Issue: Sets nonexistent filename and path fields on Scene model
- Fix: Map to correct model fields (source_uri).

### 4.3 Database is SQLite in Docker container
- Impact: Container restart = data loss.
- Fix: Volume mount or PostgreSQL.

### 4.4 Uploads directory inside container
- Impact: Generated assets not persisted across restarts.
- Fix: Docker volume mount for uploads/.

### 4.5 No CORS restriction in production
- File: backend/src/main.py line 14
- Issue: FRONTEND_URL defaults to * (all origins allowed).
- Fix: Require explicit FRONTEND_URL in production.

---

## 5. Frontend Issues

| Issue | File | Description |
|---|---|---|
| 388-line monolithic page.tsx | page.tsx | All state, UI, and logic in one component |
| Geist font loaded (prohibited) | layout.tsx | AWESOMEDESIGN.md says DO NOT use Geist |
| Default Next.js metadata | layout.tsx | Title: Create Next App |
| lucide-react dependency | package.json | Unused but installed. Prohibited. |
| No centralized API client | page.tsx | Inline axios calls with string concatenation |
| Stale NEXT_PUBLIC_API_URL comment | page.tsx L16-17 | Confusing commented-out reference |
| No loading skeleton for map | page.tsx | Static text only |
| No responsive layout | page.tsx | Single grid layout |
| No accessibility | page.tsx | No ARIA labels, focus states, keyboard nav |
| dummy.tif in frontend root | frontend/ | 6-byte placeholder, unused |
| test-proxy.ts in frontend root | frontend/ | Single import, dead file |
| CLAUDE.md in frontend root | frontend/ | 11 bytes, dead |
| No error boundary | page.tsx | Unhandled errors crash the app |

---

## 6. Backend Issues

| Issue | File | Description |
|---|---|---|
| Duplicate import os | main.py L12, L24 | os imported twice |
| CORS wildcard default | main.py | allow_origins=* in production |
| No structured health endpoint | main.py | Root / is not a health check |
| Discovery ingest manual DB session | discovery.py | Uses next(get_db()) instead of Depends() |
| Discovery ingest model mismatch | discovery.py | Sets nonexistent filename, path fields |
| Bare except in copernicus.py | copernicus.py L94, L111 | Silently swallows all exceptions |
| No file size validation | scenes.py | Accepts arbitrarily large uploads |
| geopandas in requirements but unused | requirements.txt | Dead dependency |
| supabase in requirements but unused | requirements.txt | Dead dependency |
| httpx not in requirements.txt | requirements.txt | Used but not listed |
| satquery.db committed to repo | backend/ | Database file in version control |
| benchmark_results.json committed | backend/ | Generated artifact in version control |
| __pycache__ committed | backend/ | Bytecode cache in version control |

---

## 7. Security Issues

| Issue | Severity | Description |
|---|---|---|
| Hard-coded OCI IP | HIGH | Internal infrastructure IP exposed in source code |
| Proxy error leaks stack traces | MEDIUM | error.cause forwarded to browser |
| CORS allows all origins | MEDIUM | FRONTEND_URL defaults to * |
| No upload file size limit | MEDIUM | Potential DoS |
| No filename sanitization | MEDIUM | Only extension check |
| .env not tracked (good) | OK | .gitignore covers .env |
| No secrets in code | OK | CDSE creds are env-only |

---

## 8. Temporary / Demo-Only Code

| File | Purpose | Action |
|---|---|---|
| test_stac.py (root) | One-off STAC test | Remove |
| test_stac2.py (root) | One-off STAC test | Remove |
| test_stac_dl.py (root) | One-off download test | Remove |
| test_stac_dl2.py (root) | One-off download test | Remove |
| test_odata.py (root) | One-off OData test | Remove |
| test_odata_nodes.py (root) | One-off OData test | Remove |
| test_odata_online.py (root) | One-off OData test | Remove |
| test_anon_dl.py (root) | One-off download test | Remove |
| backend/script_api.py | Manual API test script | Remove |
| backend/script_model_inference.py | Manual model test script | Remove |
| backend/generate_dummy.py | Fixture generator | Keep |
| backend/generate_dummy_sar.py | SAR fixture generator | Keep |
| backend/benchmark_results.json | Generated output | Remove from repo |
| backend/satquery.db | SQLite database file | Add to .gitignore |
| frontend/test-proxy.ts | Dead 2-line file | Remove |
| frontend/dummy.tif | 6-byte placeholder | Remove |
| frontend/CLAUDE.md | 11-byte file | Remove |
| frontend/tests/example.spec.ts | Tests playwright.dev, not SatQuery | Remove |

---

## 9. Files That Should NOT Be Changed

| File | Reason |
|---|---|
| backend/src/utils/eo_algorithms.py | Core EO science. Correct and verified. |
| backend/src/ml/validator.py | Evidence validation logic. Working. |
| backend/src/ml/gateway.py | Model gateway with proper fallback. Working. |
| backend/src/tools/base.py | Clean tool abstraction. |
| backend/src/tools/registry.py | Simple, correct registry. |
| backend/src/tools/ndvi_tool.py | Correct tool implementation. |
| backend/src/tools/water_tool.py | Correct tool implementation. |
| backend/src/tools/sar_tool.py | Correct tool implementation. |
| backend/src/planner/rule_based.py | Deterministic, tested planner. |
| backend/src/planner/executor.py | Correct plan execution. |
| backend/src/planner/response_generator.py | Proper fallback chain. |
| backend/src/planner/models.py | Clean Pydantic models. |
| backend/src/providers/base.py | Clean abstraction. |
| backend/src/utils/geo.py | Correct metadata extraction. |
| backend/generate_dummy.py | Fixture generator. |
| backend/generate_dummy_sar.py | Fixture generator. |
| backend/tests/* | All passing tests. |
| backend/evaluation/run_benchmark.py | Evaluation suite. |
| configs/models.yaml | Model registry config. |
| AGENTS.md | Project constitution. |
| AWESOMEDESIGN.md | Design constitution. |
| PRD.md | Product requirements. |

---

## 10. Summary

The backend architecture is fundamentally sound: deterministic EO tools, validated ML gateway, structured tool registry, rule-based planner, and proper response generation with hallucination detection. The core analytical capabilities (NDVI, NDWI, SAR) are correctly implemented and tested.

The primary issues are:
1. Deployment hazards — hardcoded IP, no health check, no error containment
2. Data model bug — discovery ingest will crash due to field mismatch
3. Frontend — monolithic, unstyled for production, violates design guidelines
4. Infrastructure — no volume persistence, CORS wide open, no file limits

None of these require architectural changes. They are all incremental fixes on a working system.
