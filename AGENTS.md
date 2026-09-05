# SatQuery AI — Agent Instructions

## 1. Mission

SatQuery AI is an evidence-grounded multimodal geospatial intelligence assistant that lets users explore, compare, and interpret remote-sensing imagery through natural-language questions.

Core experience:

User selects/uploads satellite imagery
→ asks a natural-language question
→ SatQuery determines what analysis is required
→ analytical tools/models produce evidence
→ evidence is validated
→ a grounded answer is generated
→ spatial/temporal evidence is visualized
→ user can ask follow-up questions.

SatQuery is being developed primarily as a technically defensible SIH prototype. Prioritize a convincing, working, scientifically credible MVP over unnecessary production-scale infrastructure.

---

# 2. NON-NEGOTIABLE PRINCIPLES

## Evidence before language

Never allow the language model to invent scientific conclusions.

The preferred architecture is:

Question
→ Intent
→ Requirements
→ Plan
→ Tool/model selection
→ Execution
→ Evidence
→ Validation
→ Reasoning
→ Answer

The LLM is primarily a query interpreter, planner, tool selector, reasoning layer, and response generator.

Scientific computations should be performed by deterministic geospatial tools or task-specific ML models whenever possible.

If evidence is insufficient, explicitly return an insufficient-evidence result.

Never fabricate:

* measurements
* coordinates
* dates
* sensor information
* CRS
* resolution
* land-cover classifications
* change
* confidence
* spatial locations

---

# 3. MULTIMODAL SATELLITE SEMANTICS

SatQuery must preserve the semantic differences between remote-sensing modalities.

## Sentinel-2

Treat Sentinel-2 as optical/multispectral imagery.

Preserve:

* individual bands
* band identity
* wavelength information
* spatial resolution
* acquisition time
* metadata
* scaling
* CRS
* scene footprint

Do NOT reduce Sentinel-2 to RGB internally unless a specific visualization or model explicitly requires it.

## Sentinel-1

Treat Sentinel-1 as SAR.

Preserve:

* polarization
* backscatter information
* acquisition metadata
* orbit/product information
* preprocessing state
* CRS
* spatial resolution

Do NOT treat SAR as ordinary RGB imagery.

Do NOT assume that a generic vision-language model understands SAR.

## Multimodal fusion

Prefer:

Sentinel-2
→ optical/spectral representation

Sentinel-1
→ SAR representation

Both
→ evidence/retrieval/fusion layer

→ multimodal reasoning

Never silently discard modality-specific information.

---

# 4. GEOSPATIAL CORRECTNESS

Geospatial correctness has priority over convenience.

Before spatial comparison or raster algebra, verify:

* CRS
* EPSG
* transform
* dimensions
* pixel size
* bounds
* resolution
* grid alignment
* nodata
* band compatibility

Never silently compare misaligned rasters.

Be explicit about coordinate order.

Never treat latitude/longitude degrees as meters.

Use an appropriate projected CRS for physical distance/area calculations when required.

Validate geometries and AOIs before analysis.

Never invent missing geospatial metadata.

---

# 5. EO ANALYSIS

Prefer deterministic computation for:

* NDVI
* NDWI
* NDBI
* SAVI
* spectral ratios
* raster algebra
* masks
* thresholds
* zonal statistics
* temporal differences
* raster statistics

Use task-specific ML when appropriate for:

* classification
* segmentation
* object detection
* change detection

Every analysis should produce structured output and, where possible, spatial evidence.

Possible evidence:

* bbox
* polygon
* segmentation mask
* heatmap
* point
* evidence tile
* before/after pair
* spectral chart

Never use an LLM as a replacement for deterministic scientific computation.

---

# 6. QUERY ORCHESTRATION

The query orchestrator is the core SatQuery differentiator.

Natural-language intent should be converted into a structured analytical plan.

Example:

"What areas have dense vegetation?"

Possible plan:

1. Determine required modality.
2. Check available Sentinel-2 bands.
3. Validate metadata.
4. Calculate an appropriate vegetation indicator.
5. Apply required masks.
6. Generate spatial evidence.
7. Calculate relevant statistics.
8. Validate the result.
9. Generate a grounded response.

Do not hard-code every natural-language query to one model.

The orchestrator should select tools based on:

* task
* modality
* available data
* required bands
* temporal requirements
* spatial requirements
* model availability
* confidence/evidence requirements

Tools must have explicit schemas and structured outputs.

---

# 7. MODEL POLICY

Never add a model merely because it is popular or interesting.

Before adopting a model evaluate:

* modality
* input format
* supported bands
* task
* domain
* checkpoint
* license
* VRAM
* latency
* benchmark evidence
* fine-tuning requirements
* deployment complexity

Generic VLMs must NOT be assumed to understand:

* Sentinel-1 SAR
* multispectral band semantics
* scientific indices
* geospatial coordinates
* remote-sensing terminology

Models should be replaceable through a model gateway/registry where practical.

The frontend must not depend directly on a specific model implementation.

---

# 8. MODEL GATEWAY

Prefer a model abstraction that allows model replacement without rewriting the frontend or orchestration layer.

Conceptually:

Query / task
→ model gateway
→ selected model
→ structured prediction
→ confidence + evidence

Model outputs should include structured information rather than free-form prose whenever possible.

---

# 9. PROVENANCE

Meaningful analytical results should be traceable.

Track where practical:

* dataset
* scene/item
* acquisition time
* AOI
* bands
* preprocessing
* operation
* parameters
* model
* model version
* tool
* software version
* output artifact

Results should preserve limitations and uncertainty.

A user should be able to understand where an answer came from without exposing private chain-of-thought.

---

# 10. RESPONSE CONTRACT

Prefer structured responses containing:

* answer
* confidence
* evidence
* limitations
* metadata where relevant

Evidence must reference actual analytical outputs.

Never expose chain-of-thought.

Instead provide concise evidence-based explanations such as:

"The result is based on the NDVI-derived vegetation mask over the selected AOI."

---

# 11. INSUFFICIENT EVIDENCE

Insufficient evidence is a valid and expected system state.

Use it when:

* required bands are unavailable
* metadata is missing
* imagery is corrupted
* the sensor is unsupported
* clouds/no-data prevent reliable analysis
* modalities cannot be aligned
* model confidence is inadequate
* requested analysis exceeds MVP capabilities
* the question requires unsupported forecasting
* required analytical evidence cannot be produced

Do not force a categorical answer.

---

# 12. TEMPORAL ANALYSIS

Before comparing scenes, verify:

* acquisition dates
* scene identity
* modality compatibility
* preprocessing compatibility
* CRS
* resolution
* raster alignment
* cloud/no-data effects

Never claim change from two images that have not been properly aligned and compared.

---

# 13. SECURITY

All user-controlled inputs are untrusted.

Protect:

* file uploads
* filenames
* paths
* raster metadata
* URLs
* tool arguments
* API inputs
* model inputs

Never allow arbitrary shell execution through an LLM.

Validate tool arguments against schemas.

Protect against:

* path traversal
* malicious files
* decompression bombs
* SSRF
* XSS
* injection
* unauthorized scene access
* secret leakage

Never commit credentials, API keys, tokens, or passwords.

---

# 14. ARCHITECTURE

Prefer a modular monolith for the SIH MVP.

Keep responsibilities separated:

Frontend
→ API
→ query orchestration
→ analytical tools / models
→ EO processing
→ data access
→ provenance
→ persistence
→ visualization

Do not introduce microservices without a demonstrated need.

Do not introduce Kubernetes, Kafka, Redis, or other infrastructure simply because it is common in production systems.

Architecture should remain understandable to a student team and deployable on realistic hardware.

---

# 15. FRONTEND

The frontend should communicate analytical state clearly.

Important concepts include:

* scene selection
* metadata
* query input
* analysis progress
* answer
* confidence
* spatial evidence
* temporal comparison
* limitations
* follow-up questions

Visualizations must correspond to actual analytical evidence.

Do not create decorative visualizations that imply scientific results that were never computed.

---

# 16. TESTING

Do not consider a feature complete merely because it runs.

Test:

1. EO correctness
2. Geospatial correctness
3. Tool schemas
4. Tool execution
5. Query orchestration
6. Model integration
7. API
8. Frontend
9. End-to-end workflows
10. Benchmark performance

Important failure cases:

* unsupported sensor
* corrupted image
* missing metadata
* missing bands
* cloud-covered imagery
* huge imagery
* GPU unavailable
* model unavailable
* low confidence
* modality mismatch
* invalid AOI
* misaligned rasters
* impossible queries

---

# 17. EVALUATION

Maintain an internal benchmark as the project matures.

Target approximately:

100–500 expert-curated queries

with:

* known scenes
* expected evidence
* answer constraints
* task categories

Evaluate relevant capabilities such as:

* classification
* retrieval
* localization
* segmentation
* change detection
* VQA

Do not optimize benchmark metrics at the expense of evidence-grounded behavior.

---

# 18. PERFORMANCE

The PRD proposes the following MVP targets:

* small upload acknowledgement: <3s
* metadata extraction: <5s
* typical analytical query: 5–20s
* cached query: <3s
* UI interaction latency: <200ms
* demo concurrency: 1–5 users
* suggested upload limit: 1–2 GB
* typical inference tile: 256–512 px
* preferred GPU: 16–24 GB
* preferred RAM: 32 GB
* recommended local storage: 100+ GB

These are engineering targets, not reasons to over-engineer the system.

Graceful degradation on weaker hardware is preferred.

---

# 19. HACKATHON PRIORITY

Prioritize features that visibly demonstrate:

* natural-language interaction
* actual satellite-specific analysis
* multimodal reasoning
* spatial grounding
* temporal reasoning
* professional visualization
* explainability

The defining differentiator is:

natural-language orchestration of remote-sensing-specific analytical tools, multimodal models, and geospatial evidence.

Do not market or architect SatQuery as merely "AI + satellite images."

---

# 20. DEFINITION OF DONE

The SIH MVP should ultimately support:

* real remote-sensing scene loading
* metadata display
* preserved Sentinel-2 bands
* distinct Sentinel-1 SAR pipeline
* natural-language questions
* 3–5 meaningful analytical tasks
* spatially grounded answers
* at least one temporal comparison
* at least one SAR + optical demonstration
* follow-up questions
* visible uncertainty
* safe handling of unsupported questions
* result export
* end-to-end operation on target hardware
* documented evaluation
* documented model/data licenses
* no core feature dependent on unavailable proprietary services

---

# 21. CODING RULES FOR AGENTS

Before implementing a non-trivial feature:

1. Understand the existing architecture.
2. Read relevant SatQuery skills.
3. Identify affected layers.
4. Check whether an existing utility/tool already solves the problem.
5. Prefer the smallest coherent change.
6. Add or update tests.
7. Validate scientific/geospatial correctness.
8. Verify the actual result rather than assuming success.

Do not rewrite working systems without evidence that they need rewriting.

Do not add dependencies without justification.

Do not duplicate functionality.

Do not create parallel implementations of the same analytical operation.

Do not silently change scientific assumptions.

If uncertain about a domain-specific decision, inspect the relevant SatQuery skill and PRD before proceeding.

---

# 22. DEVELOPMENT WORKFLOW

Use the Superpowers workflow for substantial work:

Brainstorm
→ clarify requirements
→ write plan
→ implement with TDD where appropriate
→ verify
→ review
→ integrate

For debugging:

reproduce
→ isolate
→ identify root cause
→ fix
→ test
→ verify

Do not skip verification merely because the implementation "looks correct."

---

# 23. SOURCE OF TRUTH

Primary project requirements:

PRD.md

Project-specific domain instructions:

.agents/skills/

Development methodology:

.agents/plugins/superpowers/

Project architecture and implementation documentation:

docs/

When these sources conflict, do not silently guess. Identify the conflict and resolve it explicitly.

---

# 24. FINAL RULE

SatQuery should behave like a scientific analysis system with an AI interface, NOT like a chatbot pretending to understand satellite imagery.

Evidence first.
Correctness first.
Modality-aware.
Geospatially valid.
Reproducible.
Secure.
Tested.
Then make it clever.
