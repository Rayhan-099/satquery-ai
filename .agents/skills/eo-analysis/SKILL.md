---
name: eo-analysis
description: Use when implementing or reviewing remote sensing analysis such as spectral indices, raster operations, masks, statistics, classification, segmentation, detection, change detection, or temporal analysis.
---

# Earth Observation Analysis

SatQuery must treat remote sensing analysis as scientific computation, not generic image processing.

## Deterministic analysis

Prefer deterministic geospatial computation for:

- NDVI
- NDWI
- NDBI
- SAVI
- spectral ratios
- band arithmetic
- raster algebra
- masks
- thresholds
- zonal statistics
- raster statistics
- temporal differences
- change maps

Always handle:

- nodata
- scaling factors
- units
- valid ranges
- band identity
- spatial resolution
- CRS
- raster alignment

## Task-specific ML

Use specialized models/tools for:

- classification
- semantic segmentation
- object detection
- change detection
- land-cover mapping

Do not use an LLM as a substitute for a scientific image-analysis algorithm.

## Evidence

Every meaningful analysis should produce structured evidence such as:

- raster output
- bounding box
- polygon
- mask
- heatmap
- point
- chart
- before/after comparison

## Important

Never silently assume that RGB imagery contains the required spectral information.

If a requested analysis requires a band that is unavailable, return insufficient evidence rather than inventing a result.
