#!/usr/bin/env bash
# Convenience script: launches Austria & Germany Tech Masters microservices
set -euo pipefail

cd "$(dirname "$0")"

echo "================================================================"
echo "    Austria & Germany Tech Masters - Microservices Stack"
echo "================================================================"
echo "  1. Frontend:     http://localhost:3000 (Next.js 15, Lucide, Tailwind)"
echo "  2. Backend:      http://localhost:8000 (FastAPI, Uvicorn)"
echo "  3. Ads Service:  http://localhost:4000 (Node.js Express Engine)"
echo "  4. Kafka Broker: localhost:9092        (KRaft Event Streaming)"
echo "================================================================"
echo ""
echo "To start services individually:"
echo "  - Backend:   cd microservices/tech-masters-backend && pip install -r requirements.txt && python -m uvicorn main:app --reload --port 8000"
echo "  - Ads:       cd microservices/tech-masters-ads-service && npm install && node index.js"
echo "  - Frontend:  cd microservices/tech-masters-frontend && npm install && npm run dev"
echo "  - Kafka:     docker compose -f docker-compose.kafka.yml up -d"
echo ""
