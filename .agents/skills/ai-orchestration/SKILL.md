---
name: ai-orchestration
description: Use when implementing natural-language query understanding, planning, tool selection, analytical execution, evidence validation, multimodal reasoning, or grounded response generation in SatQuery.
---

# SatQuery AI Orchestration

SatQuery is NOT:

Question
→ LLM
→ guess

SatQuery is:

Question
→ Intent
→ Requirements
→ Plan
→ Tool selection
→ Execution
→ Evidence
→ Validation
→ Reasoning
→ Answer

## LLM responsibility

The language model acts primarily as:

- query interpreter
- planner
- tool selector
- reasoning layer
- response generator

It must not blindly perform scientific computation itself.

## Tool responsibility

Tools perform:

- raster calculations
- spectral indices
- metadata retrieval
- spatial statistics
- masking
- change detection
- segmentation
- classification
- detection
- retrieval

## Structured tool calls

Tools should have explicit:

- name
- description
- input schema
- output schema
- validation
- error handling

## Evidence requirement

Claims about imagery should preferably be supported by analytical evidence.

If evidence is insufficient:

Return an explicit insufficient-evidence result.

Do not hallucinate.

## Validation

Before generating a final answer, validate:

- tool execution
- evidence existence
- spatial validity
- temporal validity
- modality compatibility
- confidence
- limitations

## Response

Prefer structured responses containing:

- answer
- confidence
- evidence
- limitations
- relevant metadata

Never expose private chain-of-thought.
