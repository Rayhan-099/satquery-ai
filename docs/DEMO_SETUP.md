# SatQuery AI: Demo Setup Guide

This guide ensures a fresh developer or presenter can start SatQuery AI from a clean laptop for the SIH 2026 presentation with minimal friction.

## Prerequisites
- **Python**: 3.14.6+ (For FastAPI backend)
- **Node.js**: v20+ (For Next.js frontend)
- **npm**: v10+
- **Database**: PostgreSQL (Hosted via Supabase or locally; `DATABASE_URL` required in `.env`)

## One-Time Initialization
Run these commands from the repository root:

```bash
# 1. Setup Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head

# 2. Setup Frontend
cd ../frontend
npm ci
```

## Environment Variables (`backend/.env`)
Ensure your `.env` contains:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
# Leave CDSE credentials empty to automatically use SYNTHETIC_FIXTURE fallbacks for reliable offline demos!
CDSE_USERNAME=
CDSE_PASSWORD=
```

## Running the Demo (One-Terminal Command)
To run both servers simultaneously from the project root:

```bash
# In Terminal 1 (Backend)
cd backend && source venv/bin/activate && uvicorn src.main:app --host 0.0.0.0 --port 8000

# In Terminal 2 (Frontend)
cd frontend && npm run dev
```

Open `http://localhost:3000` in your browser.

## ML Model Initialization Warning
The first query processed by the backend will automatically download and initialize `SmolLM-135M-Instruct` into memory via HuggingFace Transformers. **This requires an active internet connection on the very first run.** 
- **Recommendation:** Submit a test query before walking on stage to ensure the model is cached in RAM and VRAM, bypassing the 10-20 second cold-start latency.
