# 🛰️ SatQuery AI

### An Interactive Vision-Language Assistant for Multimodal Remote Sensing Image Analysis Through Text Queries

**SatQuery AI** is an evidence-grounded, natural-language copilot for exploring, comparing, and interpreting multimodal satellite imagery.

Built for **Smart India Hackathon 2026 — Problem Statement SIH26167 (Space Technology)** in collaboration with **ISRO-SAC**.

> **Core principle:** SatQuery AI behaves like a scientific analysis system with an AI interface — not like a chatbot pretending to understand satellite imagery.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [The Problem](#-the-problem)
* [Our Solution](#-our-solution)
* [Why SatQuery AI?](#-why-satquery-ai)
* [How It Works](#-how-it-works)
* [Key Differentiator](#-key-differentiator)
* [Capabilities](#-capabilities)
* [Supported Analysis](#-supported-analysis)
* [System Architecture](#-system-architecture)
* [Evidence-Grounded AI](#-evidence-grounded-ai)
* [Data Provenance](#-data-provenance)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Running Locally](#-running-locally)
* [Judge Demonstration / Prototype Walkthrough](#-judge-demonstration--prototype-walkthrough)
* [Recommended Demo Queries](#-recommended-demo-queries)
* [What the Demo Proves](#-what-the-demo-proves)
* [Safety and Scientific Integrity](#-safety-and-scientific-integrity)
* [Evaluation](#-evaluation)
* [Performance](#-performance)
* [Deployment](#-deployment)
* [Limitations and Roadmap](#-limitations-and-roadmap)
* [Engineering History](#-engineering-history)
* [Documentation](#-documentation)
* [Team](#-team)
* [License](#-license)

---

# 🌍 Overview

Satellite imagery contains enormous amounts of information about Earth's surface — vegetation, water, urban areas, terrain, environmental changes, and more.

However, extracting that information traditionally requires:

* Understanding satellite sensors and spectral bands
* GIS and remote-sensing expertise
* Raster processing tools
* Python scripts
* Knowledge of indices such as NDVI and NDWI
* Separate workflows for optical and SAR imagery
* Manual interpretation of spatial results

SatQuery AI aims to make this interaction much simpler.

Instead of manually constructing an analysis pipeline, an analyst can ask:

> **"Where is vegetation strongest?"**

SatQuery interprets the intent, selects the appropriate remote-sensing analysis, executes it against the image, produces spatial evidence, extracts statistics, and then generates a concise explanation.

The AI is therefore used as an **interface to scientific analysis**, rather than as a replacement for the analysis itself.

---

# ❗ The Problem

Earth Observation data is incredibly powerful but difficult to access for non-specialists.

A traditional workflow can look like:

```text
Satellite Scene
      ↓
Understand Sensor
      ↓
Identify Bands
      ↓
Preprocess Raster
      ↓
Write Analysis Script
      ↓
Calculate Index / Model
      ↓
Generate Visualization
      ↓
Interpret Results
```

This creates several problems:

### 1. High technical barrier

Users need knowledge of remote sensing, GIS, raster formats, coordinate systems, spectral bands, and analytical indices.

### 2. Modality complexity

Different satellite modalities represent different physical measurements.

For example:

* Sentinel-2 → optical / multispectral reflectance
* Sentinel-1 → SAR / radar backscatter

These modalities cannot simply be treated as ordinary RGB photographs.

### 3. Difficult spatial interpretation

A numerical answer alone is often insufficient.

An analyst needs to know:

> **Where on the scene did this result come from?**

### 4. Generic AI can hallucinate

A conventional language model may produce plausible-looking answers without actually performing the required remote-sensing computation.

That is dangerous in scientific applications.

### 5. Repetitive workflows

Many common EO questions repeatedly require the same operations:

* vegetation analysis
* water analysis
* SAR interpretation
* statistics
* spatial localization
* comparison

SatQuery AI automates this orchestration through a controlled analytical pipeline.

---

# 💡 Our Solution

SatQuery AI introduces a natural-language interface over remote-sensing-specific analytical tools.

Instead of:

```text
"I need to load B08 and B04,
calculate NDVI,
handle nodata,
generate statistics,
and visualize the result."
```

the user can simply ask:

> **"Where is vegetation strongest?"**

SatQuery converts the question into a structured analytical plan:

```text
Natural Language Query
        ↓
Intent Recognition
        ↓
Analysis Plan
        ↓
Allowed EO Tool
        ↓
Raster Analysis
        ↓
Evidence
        ↓
Validation
        ↓
Natural-Language Response
```

For a vegetation query, the system can select the NDVI pipeline:

```text
B08 (NIR) + B04 (Red)
            ↓
          NDVI
            ↓
   Spatial NDVI Raster
            ↓
 Statistics + Valid Pixels
            ↓
   Heatmap / Spatial Evidence
            ↓
 Evidence-Grounded Answer
```

The important distinction is that **the LLM does not calculate NDVI**.

The EO analysis engine does.

---

# 🎯 Why SatQuery AI?

SatQuery is designed around one central idea:

> **Natural language should orchestrate remote-sensing analysis — not replace it.**

A generic vision-language model might look at an image and say:

> "The upper-right area appears to have dense vegetation."

SatQuery instead aims to produce:

```text
Query
  ↓
NDVI Tool
  ↓
Actual pixel-level calculation
  ↓
Statistics
  ↓
Spatial evidence
  ↓
Validated response
```

This makes the system:

* More explainable
* More reproducible
* More scientifically defensible
* Easier to test
* Safer against hallucinated numerical results

---

# 🔬 How It Works

## 1. Scene Selection

The user can work with:

* A local satellite image
* A discovered Copernicus scene
* Synthetic fixtures used for development/testing

The system preserves metadata such as:

* Dimensions
* CRS
* Bounds
* Band information
* Data provenance

---

## 2. Modality-Aware Processing

SatQuery does not blindly treat every satellite image as RGB.

### Sentinel-2

Optical/multispectral processing preserves band semantics.

Relevant bands include:

| Band | Meaning       | Example Use        |
| ---- | ------------- | ------------------ |
| B03  | Green         | Water / vegetation |
| B04  | Red           | Vegetation         |
| B08  | Near Infrared | Vegetation         |

This enables analyses such as:

```text
NDVI = (NIR - Red) / (NIR + Red)
```

and:

```text
NDWI = (Green - NIR) / (Green + NIR)
```

---

### Sentinel-1

Sentinel-1 is treated as a separate SAR modality.

The current pipeline supports:

* VV backscatter
* VH backscatter
* VV/VH statistics
* SAR visualization
* RGB-style dual-polarization composites

The SAR pipeline is intentionally separate from the optical pipeline.

---

# 🧠 Query Orchestration

SatQuery uses a controlled query orchestration architecture:

```text
User Query
    ↓
Planner
    ↓
Analysis Plan
    ↓
Tool Registry
    ↓
Tool Executor
    ↓
EO Analysis
    ↓
Evidence Object
    ↓
Response Generator
    ↓
Evidence Validator
    ↓
Final Answer
```

The planner maps supported natural-language intents to specific analytical tools.

For example:

```text
"Where is vegetation strongest?"
                ↓
          vegetation intent
                ↓
             NDVI tool
                ↓
         NDVI raster + stats
                ↓
          spatial evidence
```

Unsupported requests do not get fabricated answers.

Instead, SatQuery enters an explicit:

```text
INSUFFICIENT EVIDENCE
```

or unsupported state.

---

# 🛡️ Key Differentiator: Evidence-Grounded AI

One of SatQuery AI's most important safeguards is its **EvidenceValidator**.

The system separates:

### Deterministic evidence

Produced by the actual analysis engine:

* Calculated indices
* Pixel statistics
* Valid pixel counts
* SAR statistics
* Spatial regions
* Raster-derived measurements

### Generative explanation

Produced by the language model:

* Concise interpretation
* Natural-language summary
* Human-friendly explanation

The LLM is therefore downstream of the evidence.

---

## Example

Suppose the EO engine produces:

```json
{
  "mean": 0.61,
  "maximum": 0.91,
  "valid_pixels": 48321
}
```

The language model might generate:

> "Vegetation is strongest in the high-NDVI regions, with a maximum NDVI of 0.91."

The validator checks whether generated numerical claims are supported by the evidence.

If the model instead says:

> "The maximum NDVI is 0.97."

the claim does not match the evidence.

SatQuery rejects the generated numerical response and falls back to the deterministic analysis.

### The result:

**The model is never trusted as the source of scientific measurements.**

---

# 📊 Capabilities

| Capability                              | Status | Description                                              |
| --------------------------------------- | :----: | -------------------------------------------------------- |
| Sentinel-2 Optical Analysis             |    ✅   | Multispectral raster processing with band-aware analysis |
| NDVI                                    |    ✅   | Vegetation index using Red + NIR                         |
| NDWI                                    |    ✅   | Water-oriented index using Green + NIR                   |
| Sentinel-1 SAR                          |    ✅   | VV/VH backscatter statistics and visualization           |
| Natural-Language Queries                |    ✅   | Maps supported intents to analytical pipelines           |
| Spatial Evidence                        |    ✅   | Results can be visualized spatially                      |
| Evidence Validation                     |    ✅   | Numerical claims are checked against generated evidence  |
| Data Provenance                         |    ✅   | Tracks source type of scenes                             |
| Copernicus Discovery                    |   🟡   | CDSE discovery integration is implemented                |
| Copernicus Authenticated Asset Download |   🟡   | Supported when valid CDSE credentials are configured     |
| Synthetic Fixtures                      |    ✅   | Reproducible development/demo data                       |
| Temporal Change Detection               |    ❌   | Currently unsupported                                    |
| Crop/Object Detection                   |    ❌   | Currently unsupported                                    |
| Full Multimodal Latent Fusion           |    ❌   | Deferred                                                 |
| Large-Scale Time-Series Analysis        |    ❌   | Deferred                                                 |

For the detailed capability scope, see:

[`docs/architecture/CAPABILITY_MATRIX.md`](./docs/architecture/CAPABILITY_MATRIX.md)

---

# 🗺️ System Architecture

```text
┌───────────────────────────────────────────────┐
│                  Web Browser                  │
│                                               │
│  Scene Selection → Map → Natural Language    │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Next.js Frontend                 │
│                                               │
│  React + TypeScript + Tailwind + Leaflet      │
└───────────────────────┬───────────────────────┘
                        │ HTTP API
                        ▼
┌───────────────────────────────────────────────┐
│                FastAPI Backend                │
│                                               │
│  Query Orchestrator                           │
│       │                                       │
│       ├── Planner                             │
│       ├── Tool Registry                       │
│       ├── Evidence Validator                  │
│       └── Response Generator                  │
│                                               │
│  EO Analysis Layer                            │
│       ├── NDVI                                │
│       ├── NDWI                                │
│       └── Sentinel-1 SAR                     │
└───────────────┬───────────────────────────────┘
                │
       ┌────────┴────────┐
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ Raster Engine│  │ ML / LLM     │
│              │  │              │
│ Rasterio     │  │ SmolLM       │
│ NumPy        │  │              │
│ Shapely      │  │ Explanation  │
└──────────────┘  └──────────────┘
       │
       ▼
┌───────────────────────────────────────────────┐
│       Scene / Metadata / Provenance            │
│                                               │
│ PostgreSQL / Supabase                         │
│ Local Raster Storage                          │
└───────────────────────────────────────────────┘
```

---

# 🤖 Role of the Language Model

SatQuery currently uses **SmolLM-135M-Instruct** as a lightweight local language model.

Its role is intentionally constrained.

### The model can:

* Interpret/phrase analysis results
* Produce concise natural-language explanations
* Make the interface conversational

### The model does NOT:

* Calculate NDVI
* Calculate NDWI
* Determine SAR statistics
* Invent spatial evidence
* Decide scientific measurements independently
* Replace deterministic EO processing

This architecture allows the generative component to be swapped or upgraded independently from the scientific analysis layer.

---

# 🧾 Data Provenance

Every scene carries provenance information.

Current source types include:

### `REAL_COPERNICUS`

Data originating from the Copernicus Data Space Ecosystem.

### `LOCAL_UPLOAD`

A scene supplied directly by the user.

### `SYNTHETIC_FIXTURE`

Synthetic/test imagery used for reproducible development and demonstrations.

SatQuery deliberately exposes this distinction in the interface.

This prevents a synthetic development fixture from being presented as genuine satellite imagery.

---

# 🧰 Technology Stack

## Frontend

* Next.js 15
* React
* TypeScript
* Tailwind CSS
* React-Leaflet
* Map visualization

## Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Alembic
* Pydantic

## Remote Sensing / Geospatial

* Rasterio
* NumPy
* Shapely
* GeoPandas
* GDAL ecosystem

## AI

* PyTorch
* Hugging Face Transformers
* SmolLM-135M-Instruct

## Data

* PostgreSQL / Supabase
* Local raster storage
* Copernicus Data Space Ecosystem integration

## Testing

* Pytest
* Playwright

---

# 📁 Project Structure

```text
satquery-ai/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── tests/
│
├── backend/
│   ├── src/
│   │   ├── api/
│   │   ├── analysis/
│   │   ├── data/
│   │   ├── ml/
│   │   ├── models/
│   │   └── main.py
│   │
│   ├── evaluation/
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── configs/
│
├── docs/
│   ├── architecture/
│   ├── DEMO_GUIDE.md
│   ├── DEMO_SETUP.md
│   ├── DEPLOYMENT.md
│   ├── SIH_JUDGE_QA.md
│   └── references.md
│
├── AGENTS.md
├── AWESOMEDESIGN.md
├── MEMORY.md
├── PRD.md
└── README.md
```

---

# 🚀 Running Locally

## Prerequisites

Recommended environment:

* Python 3.11+
* Node.js
* npm
* Git
* Docker (recommended)
* A machine with sufficient RAM for the local language model

---

## Clone the repository

```bash
git clone https://github.com/Rayhan-099/satquery-ai.git
cd satquery-ai
```

---

## Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

The API should then be available at:

```text
http://localhost:8000
```

---

## Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

If required, configure the frontend API endpoint through:

```text
NEXT_PUBLIC_API_URL
```

---

# 🐳 Docker Backend

The backend includes a Dockerfile for reproducible deployment.

Build:

```bash
cd backend

docker build -t satquery-backend .
```

Run:

```bash
docker run -d \
  --name satquery-backend \
  -p 8000:8000 \
  -v ~/satquery-uploads:/app/uploads \
  satquery-backend
```

Verify:

```bash
curl http://localhost:8000/
```

Expected:

```json
{
  "message": "SatQuery AI API is running"
}
```

---

# 🎤 Judge Demonstration / Prototype Walkthrough

This is the recommended flow for demonstrating SatQuery AI during the SIH presentation.

The objective is **not** to show every feature.

The objective is to demonstrate the complete scientific pipeline from:

> **Natural-language question → actual EO computation → spatial evidence → validated answer**

---

## Step 1 — Open SatQuery AI

Start on the main dashboard.

Briefly explain:

> "This is SatQuery AI, our natural-language interface for remote-sensing analysis. Instead of manually writing GIS or Python workflows, the analyst can directly ask questions about the satellite scene."

Do not spend too much time on the landing UI.

Move quickly to the analysis interface.

---

## Step 2 — Select a Scene

Choose the available satellite scene.

If using the reproducible prototype fixture, point out the provenance indicator.

For example:

```text
Data Source: SYNTHETIC_FIXTURE
```

If a real Copernicus scene is available:

```text
Data Source: REAL_COPERNICUS
```

### Tell the judges:

> "We explicitly expose provenance, so the prototype never presents synthetic test imagery as real satellite data."

This is a good moment to demonstrate scientific transparency.

---

# Step 3 — Show the Satellite Scene

Let the judge see the scene on the map.

Briefly explain:

> "The important part here is that we retain the underlying raster and its metadata rather than reducing everything to a conventional RGB image."

If band information is visible, briefly show the available bands.

Do **not** spend several minutes explaining every band.

---

# Step 4 — Ask the Main Query

Use:

> **"Where is vegetation strongest?"**

This should trigger the vegetation/NDVI pipeline.

The judge should see the system process the query.

Explain:

> "The query is not answered directly by the language model. SatQuery first converts the question into an analysis plan and selects the NDVI tool."

---

# Step 5 — Explain the NDVI Pipeline

Point to the result and explain:

```text
Natural Language
       ↓
Vegetation Intent
       ↓
NDVI Tool
       ↓
B04 + B08
       ↓
Pixel-level NDVI
       ↓
Statistics + Spatial Evidence
       ↓
Natural-language explanation
```

Say:

> "For this query, the backend performs the actual NDVI calculation using the appropriate spectral bands. The resulting raster becomes our evidence."

This is one of the most important moments of the demo.

---

# Step 6 — Show the Spatial Evidence

Point to the generated visualization/heatmap.

Explain:

> "The answer is spatially grounded. We are not just saying vegetation is high — we can show where the high-value regions occur in the scene."

This directly demonstrates the project's core differentiator.

---

# Step 7 — Show the Statistics

Point out the available statistics.

Depending on the scene, these can include:

* Minimum
* Maximum
* Mean
* Median
* Standard deviation
* Valid pixel count

Explain:

> "These values come from the deterministic raster analysis rather than being generated by the LLM."

---

# Step 8 — Demonstrate the AI Layer

Now explain the role of the language model.

Say:

> "Only after the analysis has produced evidence do we use the language model to turn those results into a concise explanation."

This distinction is important.

The architecture is:

```text
Science first.
Language second.
```

---

# Step 9 — Demonstrate Another Modality

If the SAR fixture/scene is available, use:

> **"Compare VV and VH backscatter."**

Explain:

> "Sentinel-1 is fundamentally different from optical imagery. It measures radar backscatter, so SatQuery uses a separate SAR analysis pipeline rather than pretending it is an RGB image."

Show:

* VV
* VH
* Backscatter statistics
* SAR visualization/composite

This is an especially useful part of the demo because it demonstrates **multimodal remote-sensing awareness**.

---

# Step 10 — Demonstrate Water Analysis

Ask:

> **"Where is water concentrated?"**

This should invoke the NDWI pipeline.

Explain:

> "The same natural-language interface can select a different remote-sensing operation based on the user's intent."

The important point is:

```text
Same interface
      ↓
Different intent
      ↓
Different EO tool
      ↓
Different evidence
```

---

# Step 11 — Demonstrate the Safety Guardrail

Now ask an intentionally unsupported question.

For example:

> **"How much has the city expanded compared with five years ago?"**

The current prototype does **not** claim to perform temporal change detection.

The expected behavior is an unsupported/insufficient-evidence response.

Explain:

> "This is intentional. If the system does not have the required evidence or analytical capability, it refuses the question rather than generating a plausible-sounding answer."

This is an important feature, not a failure.

---

# Step 12 — Explain the Hallucination Guardrail

If asked about reliability, explain the EvidenceValidator.

Use the simple explanation:

> "The language model is not allowed to become the source of truth for measurements. Numerical claims in the generated explanation are checked against the evidence produced by the analysis engine. If the generated response cannot be grounded, SatQuery falls back to the deterministic result."

This demonstrates that hallucination mitigation is implemented at the architecture level rather than being only a prompt instruction.

---

# 🧪 Recommended Demo Queries

### 🌱 Vegetation

```text
Where is vegetation strongest?
```

Expected pipeline:

```text
Query → NDVI → Statistics → Spatial evidence
```

---

### 💧 Water

```text
Where is water concentrated?
```

Expected pipeline:

```text
Query → NDWI → Statistics → Spatial evidence
```

---

### 📡 SAR

```text
Compare VV and VH backscatter.
```

Expected pipeline:

```text
Query → SAR tool → VV/VH statistics → Visualization
```

---

### 🛡️ Unsupported capability

```text
How much has this area changed over the last five years?
```

Expected:

```text
Unsupported / Insufficient Evidence
```

The system should **not invent an answer**.

---

# 🏆 What the Demo Proves

A successful demonstration should establish the following:

| What Judges See             | What It Demonstrates               |
| --------------------------- | ---------------------------------- |
| Natural-language query      | Accessible EO interaction          |
| Query planner               | AI orchestration                   |
| NDVI result                 | Actual remote-sensing computation  |
| NDWI result                 | Multiple analytical tools          |
| SAR result                  | Separate modality-aware processing |
| Spatial visualization       | Geospatial grounding               |
| Statistics                  | Deterministic evidence             |
| Provenance label            | Scientific transparency            |
| Unsupported query rejection | Hallucination/safety guardrails    |
| Generated explanation       | Natural-language accessibility     |

The strongest demo narrative is therefore:

```text
Ask a question
      ↓
SatQuery understands the intent
      ↓
Selects the correct EO analysis
      ↓
Runs the actual computation
      ↓
Produces spatial + numerical evidence
      ↓
Validates the generated explanation
      ↓
Shows the result
```

---

# 🔐 Safety and Scientific Integrity

SatQuery follows an evidence-first philosophy.

## No fabricated measurements

Measurements must originate from analysis tools.

## No blind VLM interpretation

The language model is not treated as a remote-sensing calculator.

## Explicit unsupported state

If the requested analysis is outside the current capability boundary, the system should say so.

## Provenance visibility

The system distinguishes between real, local, and synthetic data.

## Modality separation

Optical and SAR imagery are processed according to their respective physical meanings.

## Numerical validation

Generated numerical claims are checked against structured evidence.

---

# 🧪 Evaluation

SatQuery includes a curated internal benchmark covering:

* Optical vegetation queries
* Water queries
* SAR analysis
* Cross-modal requests
* Temporal/change requests
* Unsupported/adversarial queries

The current evaluation benchmark contains **7 curated test cases**, with the latest run achieving:

> **7/7 passing**

This result represents the current curated prototype benchmark and should **not** be interpreted as universal model accuracy.

Automated testing includes:

### Backend

```bash
pytest
```

### Frontend / End-to-End

```bash
npx playwright test
```

The end-to-end golden path covers:

```text
Scene ingestion
      ↓
Query
      ↓
Successful analysis
      ↓
Evidence-backed response
      ↓
Graceful unsupported/failure state
```

---

# ⚡ Performance

The prototype was designed for realistic hackathon hardware rather than requiring a large GPU cluster.

Representative prototype timings include:

* Fast unsupported-query rejection: milliseconds
* Deterministic raster analysis: typically tens of milliseconds on synthetic 256×256 fixtures
* Local language-model inference: approximately several seconds to tens of seconds depending on initialization/runtime

The language model is loaded lazily to avoid unnecessary startup overhead.

The architecture is designed so that deterministic EO tools remain lightweight while the generative component can be upgraded independently.

---

# ☁️ Deployment

SatQuery is split into a frontend and backend deployment.

```text
                    Internet
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
        Vercel Frontend      OCI Backend
          Next.js             Docker
             │                   │
             └─────── HTTP ──────┘
```

## Frontend

The Next.js application is deployable through Vercel.

The backend endpoint is configured through:

```text
NEXT_PUBLIC_API_URL
```

---

## Backend

The FastAPI backend is containerized with Docker and can run on a Linux VM.

The production prototype uses:

```text
FastAPI
    ↓
Docker
    ↓
Linux VM
    ↓
Public API
```

See:

[`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)

for the detailed deployment procedure.

---

# ⚠️ Current Limitations

SatQuery AI is a functional prototype, not a finished enterprise EO platform.

The current version intentionally does **not** claim to support:

### Temporal change detection

The system currently refuses unsupported temporal-change questions.

### Crop/object detection

Dedicated crop and object detection models are not currently integrated into the production prototype.

### Full multimodal latent fusion

The current architecture preserves modality-specific processing but does not yet implement a full learned shared latent representation across all modalities.

### Large-scale time-series analysis

The prototype is not currently optimized for massive satellite archives or long-term temporal stacks.

### Large-scale production infrastructure

Kubernetes, distributed inference, dedicated vector databases, and other enterprise-scale infrastructure are intentionally outside the current hackathon prototype scope.

These limitations are documented rather than hidden.

---

# 🛣️ Roadmap

Future development can extend the current evidence-first architecture toward:

```text
Current Prototype
      │
      ├── More EO analytical tools
      │
      ├── Temporal change detection
      │
      ├── Crop classification
      │
      ├── Object detection
      │
      ├── Learned optical + SAR fusion
      │
      ├── Larger satellite archives
      │
      ├── Retrieval over EO knowledge
      │
      └── Advanced multimodal VLM reasoning
```

The architecture is intentionally modular so these capabilities can be introduced as additional evidence-producing tools rather than requiring the entire system to be rewritten.

---

# 📚 Documentation

Additional project documentation:

| Document                                                                             | Purpose                                        |
| ------------------------------------------------------------------------------------ | ---------------------------------------------- |
| [`PRD.md`](./PRD.md)                                                                 | Product requirements and system goals          |
| [`MEMORY.md`](./MEMORY.md)                                                           | Engineering history and implementation record  |
| [`docs/DEMO_SETUP.md`](./docs/DEMO_SETUP.md)                                         | Local/demo environment setup                   |
| [`docs/DEMO_GUIDE.md`](./docs/DEMO_GUIDE.md)                                         | Demonstration guide                            |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)                                         | Deployment instructions                        |
| [`docs/SIH_JUDGE_QA.md`](./docs/SIH_JUDGE_QA.md)                                     | Expected judge questions and answers           |
| [`docs/architecture/CAPABILITY_MATRIX.md`](./docs/architecture/CAPABILITY_MATRIX.md) | Verified/deferred/unsupported capability scope |
| [`docs/references.md`](./docs/references.md)                                         | Technical and research references              |
| [`AGENTS.md`](./AGENTS.md)                                                           | Engineering and architecture rules             |
| [`AWESOMEDESIGN.md`](./AWESOMEDESIGN.md)                                             | Frontend design constraints                    |

---

# 🧭 Engineering Philosophy

SatQuery AI was developed around several principles:

### Evidence before explanation

```text
Compute → Evidence → Explain
```

not:

```text
Prompt → Guess → Explain
```

### Scientific semantics matter

A Sentinel-1 SAR measurement should not be treated as an ordinary photograph.

### Unsupported is better than fabricated

A system that says:

> "I don't have sufficient evidence."

is more useful in a scientific workflow than one that confidently invents an answer.

### Deterministic tools are first-class components

Remote-sensing calculations belong in explicit analytical tools where they can be tested and reproduced.

### AI should orchestrate, not hallucinate science

The language model provides the natural-language interface while the analysis engine remains responsible for scientific computation.

---

# 🏗️ Project History

SatQuery AI was developed through **10 structured engineering phases**, progressively implementing:

1. Core architecture
2. Multispectral band semantics
3. Natural-language query orchestration
4. Deterministic EO analysis
5. Local language-model integration
6. Copernicus data-provider architecture
7. Real-vs-synthetic provenance handling
8. Evaluation and benchmark testing
9. UI/UX and end-to-end testing
10. Final engineering and SIH-readiness audit

The engineering process prioritized:

* Scientific correctness
* Evidence grounding
* Reproducibility
* Explicit capability boundaries
* Security
* Testing
* Explainability
* Realistic deployment constraints

For the detailed implementation history, see [`MEMORY.md`](./MEMORY.md).

---

# 👥 Team

**Team Lunaris**

Built for:

**Smart India Hackathon 2026**
**Problem Statement: SIH26167**
**Domain: Space Technology**

---

# 📜 License

See the repository and individual dependency/model documentation for applicable licensing information.

Model, dataset, satellite-data, and third-party software licenses should be reviewed independently before redistribution or commercial deployment.

---

# ⭐ Final Principle

SatQuery AI is built around one simple idea:

> **Ask the satellite a question — and show the evidence behind the answer.**

Instead of hiding the analytical process behind a chatbot, SatQuery connects natural-language interaction directly to remote-sensing tools, geospatial computation, spatial evidence, and validation.

**The AI explains the evidence.
The analysis produces the evidence.
The system never pretends to have evidence it doesn't have.**
