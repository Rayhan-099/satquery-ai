---
name: testing
description: Use when writing tests, reviewing changes, debugging failures, validating analytical correctness, or preparing SatQuery for deployment/demo.
---

# SatQuery Testing

Testing is broader than unit tests.

## Testing layers

1. EO correctness
2. Geospatial correctness
3. Tool correctness
4. AI orchestration
5. API
6. Frontend
7. End-to-end
8. Benchmark evaluation

## EO tests

Verify:

- spectral calculations
- masks
- nodata
- scaling
- band selection
- temporal comparisons

## Geospatial tests

Verify:

- CRS
- reprojection
- coordinate ordering
- raster alignment
- geometry validity
- bounds
- pixel size

## Tool tests

Verify:

- input schema
- output schema
- validation
- error handling
- deterministic behavior

## Orchestration tests

Test:

- intent extraction
- plan generation
- correct tool selection
- invalid requests
- insufficient evidence
- conflicting evidence
- unsupported modalities

## E2E

Test:

User query
→ API
→ orchestration
→ tools/models
→ evidence
→ response
→ visualization

## Benchmark

Maintain an internal benchmark targeting approximately:

100–500 expert-curated queries

with:

- known scenes
- expected evidence
- answer constraints
- task categories

## Rule

Do not mark a feature complete merely because the code runs.

Scientific correctness and evidence correctness matter.
