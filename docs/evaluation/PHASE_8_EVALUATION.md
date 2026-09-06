# Phase 8: Scientific Evaluation and Benchmark Report

This document details the evaluation of SatQuery AI's capability to accurately parse natural-language queries, orchestrate scientific analysis tools, generate grounded evidence, and safely reject unsupported or adversarial questions.

## Dataset / Scene Summary

| Scene | Sensor | Product | Real/Synthetic | Purpose |
| ----- | ------ | ------- | -------------- | ------- |
| `dummy_multispectral.tif` | Sentinel-2 | MSIL2A (simulated) | Synthetic | Baseline Optical evaluation (NDVI, NDWI) without Keycloak dependencies. |
| `dummy_sar.tif` | Sentinel-1 | GRD (simulated) | Synthetic | Baseline SAR evaluation (VV/VH backscatter) without Keycloak dependencies. |

*Note: Without active Keycloak credentials in `.env`, the system deliberately degrades to the `SYNTHETIC_FIXTURE` pathway to maintain deterministic testability.*

## Query Benchmark

| Category | Cases | Passed | Failed | Accuracy |
| -------- | ----: | -----: | -----: | -------: |
| Sentinel-2 / Optical | 2 | 2 | 0 | 100% |
| Sentinel-1 / SAR | 1 | 1 | 0 | 100% |
| Cross-modal | 1 | 1 | 0 | 100% |
| Temporal | 1 | 1 | 0 | 100% |
| Adversarial | 2 | 2 | 0 | 100% |
| **Total** | **7** | **7** | **0** | **100%** |

## Tool Selection Accuracy

| Expected Intent | Expected Tool | Correct Invocations | Accuracy |
| ---- | -------: | ------: | -------: |
| `vegetation_analysis` | `ndvi` | 1/1 | 100% |
| `water_analysis` | `water_index` | 1/1 | 100% |
| `sar_analysis` | `sar_analysis` | 1/1 | 100% |

## Evidence Grounding

| Metric                   | Result | Notes |
| ------------------------ | -----: | ----- |
| Evidence generated       | YES | `evidence` object always contains statistics & file paths for supported intents. |
| Spatial grounding        | YES | Heatmaps and numeric distributions correctly computed via NumPy. |
| Unsupported claims       | REJECTED | LLM numeric hallucinations successfully caught by `EvidenceValidator`. |
| Deterministic fallback   | ACTIVE | SmolLM-135M triggered hallucination limits on all 3 analysis runs and successfully fell back to deterministic reporting. |

## Safety & Rejection

| Scenario | Correct Rejection Triggered? | HTTP Status | Internal Code |
| -------- | :----------------: | ----: | :-- |
| Cross-modal (Optical + SAR) | YES | 200 (Unsupported) | `CLARIFICATION_REQUIRED` |
| Temporal Change Detection | YES | 200 (Unsupported) | `UNSUPPORTED_ANALYSIS` |
| Building Counting | YES | 200 (Unsupported) | `UNSUPPORTED_ANALYSIS` |
| Crop Species Identification | YES | 200 (Unsupported) | `UNRECOGNIZED_INTENT` |

## Performance Latency

| Operation | Median | P95 |
| --------- | -----: | --: |
| Unsupported Rejection | ~3 ms | ~4 ms |
| Supported Analysis (End-to-End) | 4.4 ms | 11.9 s |

*Note: The P95 is heavily skewed by the initial loading of the SmolLM-135M-Instruct model into VRAM during the first query. Subsequent deterministic/rejection queries resolve in under 5 milliseconds.*

## Failure Analysis

During the benchmark creation, the following failure was resolved:

1. **Failure Category:** `QUERY_PARSING`
   - **Cause:** The query orchestrator correctly identified an `UNRECOGNIZED_INTENT` (for crop species identification) but raised an unhandled `ValueError` which bubbled up as a HTTP 400 error rather than a graceful UI-friendly rejection.
   - **Fix:** Modified `query.py` router to catch `UNRECOGNIZED_INTENT` explicitly and return a standard `status="unsupported"` payload.
   - **Impact:** System now safely handles completely out-of-domain questions via the standard user interface without crashing.

## Conclusion

SatQuery AI's foundational Phase 8 logic is sound. The deterministic planner successfully refuses to hallucinate tools it doesn't possess, and the ML `EvidenceValidator` correctly suppresses the generative model when it attempts to invent statistics.
