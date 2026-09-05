# Query Orchestration Architecture

Phase 3 introduces the core SatQuery orchestration layer, responsible for translating natural-language intent into deterministic geospatial execution.

## 1. Flow
`Natural-Language Query` → `Planner` → `Analysis Plan` → `Plan Executor` → `Deterministic Tool` → `Evidence` → `Grounded Response`

## 2. Components
### Tool Registry (`src/tools/`)
The tool registry houses strongly typed wrapper classes that implement the `AnalysisTool` interface.
Tools register themselves with the singleton `ToolRegistry`.
**Current Tools:**
- `ndvi`: Wraps the deterministic `compute_ndvi` function. Expects `red_idx` and `nir_idx`.

### Planner (`src/planner/rule_based.py`)
Currently, an LLM provider is not integrated, in order to maintain zero external dependencies and ensure MVP deterministic safety.
We use a `RuleBasedPlanner` that simulates the strict output of an LLM. It routes intents:
- "Where is vegetation..." → `ndvi`
- "Show me water" → `UNSUPPORTED_ANALYSIS`

It produces a structured `AnalysisPlan` containing:
- `intent`
- `tool`
- `scene_id`
- `inputs` (logical names)
- `requested_output`

### Executor (`src/planner/executor.py`)
The executor receives the `AnalysisPlan`. It serves as the safety boundary.
1. Validates the `tool` is registered.
2. Validates the `scene_id`.
3. Resolves logical inputs (e.g., finding the physical `red_idx` based on raster metadata heuristics).
4. Executes the tool to collect `Evidence`.

### Response Generator (`src/planner/response_generator.py`)
Converts the JSON `Evidence` (statistics, pixel counts) back into a grounded natural-language interpretation for the frontend.

## 3. Security Model
- **Strict Boundary:** The planner (or future LLM) **cannot** arbitrarily execute python functions or bash commands. It can only emit an `AnalysisPlan`.
- **Validation:** The executor checks the `AnalysisPlan.tool` against an explicitly coded `allowlist` in the registry.
- **Data Safety:** The planner cannot invent statistics; the Response Generator only reads from the `Evidence` block.
