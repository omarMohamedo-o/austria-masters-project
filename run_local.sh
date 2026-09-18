#!/usr/bin/env bash
# Convenience script: installs deps and starts the backend, and reminds you
# how to open the frontend against it. See README.md for full details.
set -euo pipefail

cd "$(dirname "$0")"

echo "==> Installing backend dependencies..."
pip install -r backend/requirements.txt --quiet

echo "==> Starting backend on http://localhost:8000 (Ctrl+C to stop)"
echo "    API docs: http://localhost:8000/docs"
echo "    Programs: http://localhost:8000/api/programs"
echo ""
echo "==> To view the frontend against this backend:"
echo "    1. Edit frontend/index.html, set:  const API_BASE_URL = \"http://localhost:8000\";"
echo "    2. Open frontend/index.html directly in your browser, or run:"
echo "         cd frontend && python3 -m http.server 8080"
echo "       and visit http://localhost:8080"
echo ""

cd backend
uvicorn app:app --reload --port 8000
