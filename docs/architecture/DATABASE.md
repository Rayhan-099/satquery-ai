# Supabase Database Architecture

## Overview
SatQuery AI uses **Supabase (PostgreSQL)** as the primary backend database. This replaces the previous SQLite implementation to provide a robust, scalable relational database suitable for spatial capabilities if needed in the future (via PostGIS), although the MVP currently relies on deterministic Rasterio operations outside the DB.

## Key Components

### 1. PostgreSQL Data Store
- All structured metadata (Scenes, Users, Queries, Evidence) is stored here.
- Interacted with via SQLAlchemy and Alembic.

### 2. Supabase Storage (Planned)
- GeoTIFF files and derived assets (masks, map tiles) will be stored in Supabase Storage.
- For processing, the FastAPI backend will temporarily download assets to process them using deterministic tools (like Rasterio), then upload the results to Supabase Storage.

### 3. Row Level Security (RLS)
- When authentication is implemented, RLS policies will ensure users can only access their own uploaded scenes and query histories.

## Connection & Security
- **Strictly `.env` driven:** The connection string is loaded via `os.getenv("DATABASE_URL")`.
- **No Hardcoded Credentials:** Never commit `DATABASE_URL` or Supabase service-role keys to source control.
- **Frontend Isolation:** Service-role credentials must remain securely in the FastAPI backend and must not be exposed to the Next.js frontend.
