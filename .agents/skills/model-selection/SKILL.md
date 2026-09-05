---
name: model-selection
description: Use whenever SatQuery considers adding, replacing, fine-tuning, downloading, or deploying an AI/ML model.
---

# Model Selection

Never select a model merely because it is popular or available on Hugging Face.

Evaluate:

1. modality
2. input format
3. supported bands
4. domain
5. task
6. license
7. VRAM requirement
8. latency
9. benchmark evidence
10. fine-tuning requirements
11. checkpoint quality
12. deployment complexity

## Remote sensing compatibility

Ask:

- Was the model trained on EO imagery?
- Does it understand multispectral data?
- Does it support SAR?
- What input dimensions does it expect?
- What preprocessing does it require?
- Does its training domain match the task?

## Hardware

Prefer models that can realistically run on the target hardware.

Do not introduce huge models without measuring:

- VRAM
- inference latency
- memory
- throughput

## Model registry

Models should ideally be represented in a central configuration/registry containing:

- name
- checkpoint
- task
- modality
- input format
- license
- VRAM estimate
- latency estimate
- status

## Rule

A model must solve a demonstrated SatQuery requirement.

Do not add models because they are merely interesting.
