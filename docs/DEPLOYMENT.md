# SatQuery AI: Deployment Guide

This document outlines the recommended deployment strategy for SatQuery AI. 

## Architectural Constraints
- **Frontend (Next.js):** Lightweight, stateless. Ideal for serverless deployments.
- **Backend (FastAPI):** Heavy dependencies (`GDAL`, `Rasterio`, `PyTorch`). **Must be containerized (Docker).**
- **Storage:** Currently, SatQuery relies on local filesystem storage (`uploads/`) for processing `.tif` files and generating PNG heatmaps. Therefore, **backend containers should be treated as ephemeral.** Uploaded files will vanish on container restart. For production persistence, this layer should be migrated to Amazon S3 or Supabase Storage, but for an MVP/Hackathon, ephemeral processing is completely sufficient.

## 1. Backend Deployment (Docker)

### Prerequisites
- A VPS (DigitalOcean, AWS EC2) or a PaaS that supports Dockerfiles (Railway, Render, Fly.io).

### Steps
1. Create a project in your PaaS pointing to the `backend/` directory of this repository.
2. The platform will detect the `Dockerfile`.
3. Configure the following environment variables:
   - `DATABASE_URL`: Your Supabase/PostgreSQL connection string.
   - `FRONTEND_URL`: The deployed URL of your Next.js app (e.g., `https://satquery-ai.vercel.app`) to properly configure CORS.
   - `CDSE_USERNAME` & `CDSE_PASSWORD`: *(Optional)* Leave blank to use offline synthetic mock data, or provide Keycloak credentials for real satellite data ingestion.
4. Deploy the container. It will expose port `8000`.

## 2. Frontend Deployment (Vercel)

### Prerequisites
- A Vercel account linked to your GitHub repository.

### Steps
1. Import the repository into Vercel.
2. Set the **Framework Preset** to `Next.js`.
3. Set the **Root Directory** to `frontend`.
4. Configure the environment variables:
   - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend container (e.g., `https://api.yourdomain.com`). Ensure you omit the trailing slash.
5. Click **Deploy**.

## 3. Testing the Golden Path

Once both are deployed:
1. Navigate to your frontend URL.
2. Select the **Local Upload** tab and upload `dummy_multispectral.tif`.
3. Verify that the UI successfully connects to the backend and extracts metadata.
4. Ask a question: *"Where is vegetation strongest?"*
5. Wait for the analysis to complete (up to 20-30s on first inference due to model cold-start).
6. Verify that the map updates with a spatial heatmap and evidence statistics are returned.

### Known Demo Risks
- **Model Cold-Start:** The very first time the backend receives a query after a deployment, it will download `SmolLM-135M-Instruct` from HuggingFace into the container's memory. This takes ~20 seconds.
- **CDSE Payload Size:** If using real credentials, downloading a full Sentinel-2 `.SAFE` archive takes several minutes. For rapid live demos, use the `dummy_multispectral.tif` local upload instead.
