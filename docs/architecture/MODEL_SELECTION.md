# Model Selection

## Evaluation of Pretrained VLMs
For Phase 4, we evaluated generic Vision-Language Models (VLMs) like LLaVA, Qwen-VL, and InternVL, as well as domain-specific remote-sensing models (e.g., Prithvi, GeoCLIP) for integrating spatial question answering.

### Findings:
1. **Modality Mismatch**: Generic VLMs fundamentally expect 3-channel RGB imagery. They fail catastrophically when presented with physical metrics like SAR backscatter (Sentinel-1 VV/VH) or non-visual multispectral bands (e.g., SWIR, NIR).
2. **Hallucinations**: VLMs are highly prone to inventing statistics and hallucinating geographic coordinate bounds, directly violating the SatQuery "Evidence First" mandate.
3. **Hardware Constraints**: Loading a massive 16GB+ parameter model creates high latency (10s+) per query, which violates the hackathon requirement for a fast, responsive demo.

## Decision: Deterministic Multimodal Pipelines
Instead of adding a VLM, Phase 4 expands SatQuery's capabilities using deterministic scientific algorithms to establish true multimodal pipelines:
- **Sentinel-1 SAR**: Analyzed natively using Sentinel-1 dual-polarization logic, preserving VV/VH structures and calculating backscatter stats.
- **Sentinel-2 Optical (Water Detection)**: Extends our optical pipeline by introducing NDWI `(GREEN - NIR) / (GREEN + NIR)`.

This guarantees 100% scientific validity, maintains spatial/CRS correctness, allows instant (<1s) query response times, and keeps the Model Gateway ready for an eventual Phase 5 specialized EO model once a robust benchmark is established.
