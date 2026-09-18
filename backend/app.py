"""
Austria Tech Masters Tracker — Backend API

A tiny FastAPI service that serves the current programme dataset as JSON,
and exposes a couple of admin endpoints for triggering / inspecting scraper
runs. It intentionally does NOT try to scrape on every request — scraping
happens on a schedule (see scraper/ and .github/workflows/update.yml) and
writes to data/programs.json, which this API just reads and serves.

Run locally:
    cd backend
    pip install -r requirements.txt
    uvicorn app:app --reload --port 8000

Then:
    GET  http://localhost:8000/api/programs          -> full dataset
    GET  http://localhost:8000/api/programs?field=AI -> filtered
    GET  http://localhost:8000/api/meta               -> last-updated info
    POST http://localhost:8000/api/refresh            -> re-run scraper now
                                                           (requires ADMIN_TOKEN)
"""
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_FILE = BASE_DIR / "data" / "programs.json"
META_FILE = BASE_DIR / "data" / "meta.json"
SCRAPER_SCRIPT = BASE_DIR / "scraper" / "scrape.py"

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")  # set this in production!

app = FastAPI(
    title="Austria Tech Masters Tracker API",
    description="Serves tracked Austrian Master's programmes (CS, Data Science, "
                 "AI, Cybersecurity, Cloud, Software/Computer Engineering) with "
                 "deadlines, fees, language and application-portal links.",
    version="1.0.0",
)

# Allow the frontend (served from anywhere — file://, localhost, a static host,
# or the published artifact) to call this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


def _load_json(path: Path, default):
    if not path.exists():
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)


@app.get("/api/programs")
def get_programs(
    field: Optional[str] = Query(None, description="Filter by field, e.g. 'AI'"),
    status: Optional[str] = Query(None, description="Filter by status: open/soon/unknown/closed"),
    lang: Optional[str] = Query(None, description="Filter by teaching language"),
):
    data = _load_json(DATA_FILE, [])
    if field:
        data = [d for d in data if d.get("field", "").lower() == field.lower()]
    if status:
        data = [d for d in data if d.get("status", "").lower() == status.lower()]
    if lang:
        data = [d for d in data if d.get("lang", "").lower() == lang.lower()]
    return {"count": len(data), "programs": data}


@app.get("/api/meta")
def get_meta():
    """When the data was last scraped/updated, and whether the last run had errors."""
    meta = _load_json(META_FILE, {
        "last_updated": None,
        "last_run_status": "never run",
        "entries": 0,
        "warnings": [],
    })
    return meta


@app.post("/api/refresh")
def trigger_refresh(x_admin_token: str = Header(default="")):
    """
    Manually trigger a scraper run. Protect this in production by setting
    the ADMIN_TOKEN environment variable — without it, this endpoint is
    open, which is fine for local development only.
    """
    if ADMIN_TOKEN and x_admin_token != ADMIN_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid or missing admin token")

    result = subprocess.run(
        [sys.executable, str(SCRAPER_SCRIPT)],
        capture_output=True,
        text=True,
        timeout=300,
    )
    ok = result.returncode == 0
    return {
        "triggered_at": datetime.now(timezone.utc).isoformat(),
        "success": ok,
        "stdout_tail": result.stdout[-2000:],
        "stderr_tail": result.stderr[-2000:],
    }


@app.get("/")
def root():
    return {
        "service": "Austria Tech Masters Tracker API",
        "endpoints": ["/api/programs", "/api/meta", "/api/refresh (POST)"],
        "docs": "/docs",
    }
