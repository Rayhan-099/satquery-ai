---
name: provenance
description: Use when implementing evidence tracking, analytical results, metadata, model outputs, reproducibility, citations, exports, or auditability in SatQuery.
---

# SatQuery Provenance

Meaningful results should be traceable.

Track where possible:

- dataset
- scene/item
- acquisition time
- AOI
- bands
- preprocessing
- operation
- operation parameters
- model
- model version
- tool
- software version
- output artifact

## Evidence

An evidence object should identify:

- type
- source
- spatial extent
- temporal context
- operation
- confidence where applicable

Possible evidence types:

- bbox
- polygon
- segmentation mask
- heatmap
- point
- evidence tile
- before/after pair
- spectral chart

## Reproducibility

A result should contain enough information to understand how it was produced.

## Limitations

If an analysis has known limitations, preserve them with the result.

Never claim certainty when the evidence does not support it.
