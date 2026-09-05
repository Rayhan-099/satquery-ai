# Datasets & Benchmarks Evaluation

SatQuery places a high priority on evidence-based evaluation. For this MVP hackathon project, we have reviewed several established datasets and benchmarks.

### BigEarthNet
BigEarthNet (and its variations like BigEarthNet-S2, BigEarthNet-MM) is a major large-scale Sentinel-1 and Sentinel-2 dataset, predominantly used for multi-label image classification. 
**Status**: *Evaluated as a candidate benchmark; integration deferred.* We are aware of its utility for training representation models, but our current architecture prioritizes natural-language-driven orchestrations of deterministic EO pipelines rather than global classification, making its immediate inclusion unnecessary for the MVP.

### VRSBench
VRSBench is a large-scale visual question answering dataset specifically tailored for remote sensing. It pairs imagery with complex spatial and counting questions.
**Status**: *Evaluated as a candidate benchmark; integration deferred.* As SatQuery relies on deterministic mathematical tools (NDVI, SAR backscatter) over generic VQA, VRSBench does not perfectly align with our strict evidence-grounding constraints. It remains a prime candidate for future evaluation of advanced VLM architectures if integrated.
