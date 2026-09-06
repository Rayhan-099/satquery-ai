# SatQuery AI: Performance Baseline

This document records the official performance snapshot of the SIH MVP built on the reference architecture.

## Target Hardware Specifications
- **CPU**: AMD Ryzen 5 or equivalent Intel Core i5
- **RAM**: 16 GB+
- **GPU**: Not strictly required for MVP, but a CUDA-enabled GPU (e.g. 16GB VRAM) accelerates the SmolLM text interpretation.
- **Python**: 3.14+
- **Node**: v20+

## Phase 8/10 Benchmark Metrics
Measured against `backend/evaluation/run_benchmark.py`:

| Operation | Latency | Notes |
| :--- | :--- | :--- |
| **API Rejection / Unsupported Routing** | ~4.2 ms | Rule-based planner executes instantly to safely refuse unsupported tasks. |
| **Deterministic EO Analysis (NDVI)** | ~200 - 450 ms | Depends heavily on raster size; currently bounded by NumPy array operations and heatmap generation. |
| **Model Initialization (Cold Start)** | ~23.4 sec | Downloading/loading `SmolLM-135M-Instruct` into memory on the first request. **This is the primary P95 latency outlier.** |
| **Model Inference (Hot)** | ~3 - 5 sec | Generating the textual response interpreting the evidence. |

## CDSE OData Performance (Real Data)
- **OData Discovery (`$filter` queries)**: ~500 ms - 2 sec
- **OData Ingestion (Full `.SAFE` archive)**: Upwards of 2-5 minutes depending on bandwidth. 
*Note: Due to CDSE API constraints, the `$value` endpoint downloads the entire 1GB+ SAFE archive. For the SIH demonstration, using `SYNTHETIC_FIXTURE` mock datasets is heavily recommended to bypass this network bottleneck.*
