---
name: satquery-architecture
description: Use when deciding where SatQuery code belongs, designing components, modifying architecture, or adding new subsystems. Enforces clean separation between UI, orchestration, analytical tools, EO processing, models, data, provenance, and persistence.
---

# SatQuery Architecture

SatQuery is an evidence-grounded natural-language copilot for multimodal remote sensing analysis.

## Core architecture

Prefer this flow:

User Interface
→ Query API
→ Query Orchestrator
→ Intent / Requirements
→ Analysis Plan
→ Analytical Tools / Models
→ Evidence
→ Validation
→ Reasoning
→ Response + Visualization

## Architectural layers

Keep these responsibilities separated:

1. Frontend / visualization
2. API layer
3. Query orchestration
4. Deterministic geospatial analysis
5. Task-specific ML
6. Multimodal representation / retrieval
7. Language reasoning
8. Satellite data access
9. Provenance
10. Persistence / storage

## Rules

- Do not put EO analysis directly inside frontend code.
- Do not put business logic inside API route handlers.
- Do not let the LLM directly perform scientific calculations when deterministic tools can do them.
- Analytical tools should return structured results.
- Models should be accessed through a model gateway/registry where practical.
- Keep Sentinel-1 and Sentinel-2 pipelines distinct.
- Do not introduce microservices unless there is a demonstrated need.
- Prefer a simple modular monolith for the hackathon.
- Avoid Kubernetes, Kafka, Redis, or other infrastructure unless justified by an actual requirement.
- New functionality must have a clear architectural home.
