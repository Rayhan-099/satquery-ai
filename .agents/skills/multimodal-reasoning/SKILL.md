---
name: multimodal-reasoning
description: Use when designing or implementing reasoning across Sentinel-1 SAR, Sentinel-2 optical/multispectral imagery, multimodal embeddings, retrieval, fusion, or vision-language models.
---

# Multimodal Remote Sensing Reasoning

SatQuery is multimodal.

## Modality separation

Sentinel-2 optical and Sentinel-1 SAR must remain semantically distinct.

Conceptually:

Sentinel-2
→ optical encoder / spectral features

Sentinel-1
→ SAR encoder / SAR features

Both
→ shared evidence / retrieval / reasoning layer

## Never blindly convert everything to RGB

Do not:

- discard Sentinel-2 spectral bands
- pretend SAR is RGB
- feed arbitrary bands into models without checking compatibility
- assume generic vision models understand EO modalities

## Fusion

Fusion may occur through:

- separate modality encoders
- shared embeddings
- retrieval
- analytical evidence
- late fusion
- multimodal reasoning

Choose the simplest approach that satisfies the task.

## Task awareness

A query determines which modalities and tools are necessary.

Example:

"Is vegetation healthier?"

May require:

- Sentinel-2
- spectral indices
- temporal comparison

"Did flooding occur?"

May require:

- Sentinel-1
- Sentinel-2
- water/flood analysis
- temporal comparison

## Evidence

Multimodal reasoning should connect conclusions to actual modality-specific evidence.
