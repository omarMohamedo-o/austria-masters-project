# Austria & Germany Tech Masters Tracker

A production-grade, distributed microservices platform tracking European Tech Master's programmes (Artificial Intelligence, Machine Learning, Deep Learning, Computer Vision, Robotics, Quantum Computing, Cloud, Cybersecurity, Software Engineering, and Bioinformatics) across **Austria** and **Germany**.

Features live deadline tracking, QS world and national rankings, seat intake quotas, admission prerequisites, EU vs Non-EU tuition fees, student working rights (20h/week), 12-month post-study visa pathways (Rot-Weiß-Rot Karte & Opportunity Card), an authenticated Admin Portal, an intelligent ad monetization microservice, and Apache Kafka real-time event streaming.

---

## 🏗️ Architecture & Project Structure

```
austria-masters-project/
├── microservices/
│   ├── tech-masters-frontend/     # Next.js 15 App Router, React 19, Tailwind CSS, Lucide
│   │   ├── src/app/               # Application routes (Main catalog & /admin portal)
│   │   ├── src/components/        # ProgramList, Pill filters, Ad banners, Kafka stream
│   │   └── package.json
│   ├── tech-masters-backend/      # FastAPI Python REST API & Kafka Streamer
│   │   ├── main.py                # CRUD endpoints, university directory, stats, ranking
│   │   ├── kafka_stream.py        # Real-time event streaming publisher & consumer
│   │   └── requirements.txt
│   ├── tech-masters-ads-service/  # Node.js / Express Monetization Engine
│   │   ├── index.js               # Ad rotation, CPC tracking, live revenue metrics
│   │   └── package.json
│   └── tech-masters-llm-scraper/  # Playwright + Gemini AI Admission Monitor
│       ├── scrape.py              # Automated change-detection & structured extractor
│       ├── sources.json           # Tracked universities & admissions portals
│       └── requirements.txt
├── data/
│   ├── programs.json              # Source of truth: 41 tech masters programmes
│   └── meta.json                  # Last scraped timestamp, cache status
├── docker-compose.kafka.yml       # Apache Kafka (KRaft mode) streaming cluster
├── run_local.sh                   # Environment orchestration script
└── scripts/                       # Data enrichment & expansion utilities
```

---

## 🚀 Quick Start (Running Locally)

### 1. Start Apache Kafka (Event Streaming)
```bash
docker compose -f docker-compose.kafka.yml up -d
```

### 2. Start FastAPI Backend (Port 8000)
```bash
cd microservices/tech-masters-backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- Interactive API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Programs JSON Endpoint: [http://localhost:8000/api/programs](http://localhost:8000/api/programs)
- Universities Directory: [http://localhost:8000/api/universities](http://localhost:8000/api/universities)

### 3. Start Monetization Ads Service (Port 4000)
```bash
cd microservices/tech-masters-ads-service
npm install
node index.js
```
- Health Check: [http://localhost:4000/api/ads/health](http://localhost:4000/api/ads/health)
- Active Campaigns: [http://localhost:4000/api/ads](http://localhost:4000/api/ads)

### 4. Start Next.js Frontend (Port 3000)
```bash
cd microservices/tech-masters-frontend
npm install
npm run dev
```
- Public Catalog: [http://localhost:3000](http://localhost:3000)
- Authenticated Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin)
  - Default Admin Credentials: `admin@techmasters.eu` / `admin123`

---

## 🌟 Key Features

1. **Intelligent Search & Filter Bar**:
   - Filter by Application Status (*Open Now*, *Opening Soon*, *Check Window*).
   - Filter by Tech Domain (*AI & Data*, *Machine Learning / DL*, *Cybersecurity*, *Cloud*, *Robotics / Embedded*, *Quantum Computing*, *Software Engineering*).
   - Filter by Country (*Austria 🇦🇹*, *Germany 🇩🇪*) and all major university cities (*Vienna, Munich, Berlin, Graz, Linz, Aachen, Karlsruhe, Innsbruck, Salzburg, Darmstadt, Heidelberg, Klagenfurt*).
   - Filter by Tuition (*Free / Minimal Fee*, *Under €1,500/year*), Language (*English*, *German*), and QS World Ranking (*Top 100*, *Top 250*).

2. **Full Admission & Career Breakdown**:
   - Total opened seats & quota allocation per intake semester.
   - Exact academic prerequisites (ECTS in Math, Linear Algebra, Algorithms, Discrete Maths).
   - Language certification requirements (IELTS 6.5 - 7.5, TOEFL iBT 90 - 100, CEFR C1).
   - Work permission (20 hrs/week) and 12-month post-study job seeker visa (Rot-Weiß-Rot Karte / Opportunity Card).
   - University research clusters and industry partners (AVL, Infineon, BMW, Siemens, SAP, DeepMind, Microsoft).

3. **Secure Admin Portal (`/admin`)**:
   - Program Manager: Real-time CRUD operations to add, edit, or archive programmes.
   - Ad Campaigns: Toggle active sponsorships, adjust CPC pricing, view impressions and clicks.
   - Kafka Monitor: Stream live admission changes, view broker connectivity and consumer status.

4. **Apache Kafka Streaming Architecture**:
   - Kafka topic: `techmasters.admissions.stream`.
   - Produces event payloads for programme creations, status toggles, and deadline adjustments.
   - Asynchronously broadcasts real-time updates to connected consumers.
