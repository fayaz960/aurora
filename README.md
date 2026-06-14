# Aurora — Infrastructure Console

A demo full-stack application built to learn DevOps. It's a cloud
infrastructure monitoring dashboard with live-updating charts, a services
table, and an incident feed.

This repo is intentionally a **multi-service** app, because that's what makes
it a realistic thing to containerize, automate, and deploy.

## Architecture

```
┌──────────────┐      /api/*       ┌──────────────┐       SQL        ┌────────────┐
│   frontend   │  ───────────────▶ │   backend    │  ─────────────▶  │  postgres  │
│ React + nginx│                   │ Node/Express │                  │  database  │
│   (port 80)  │ ◀───────────────  │  (port 4000) │ ◀─────────────   │ (port 5432)│
└──────────────┘                   └──────────────┘                  └────────────┘
```

- **frontend** — React (Vite + Tailwind + Recharts), built to static files and
  served by nginx. nginx also proxies `/api` to the backend.
- **backend** — Node.js/Express REST API. Exposes metrics, services, and
  incidents endpoints, plus `/api/health` and `/api/ready` checks.
- **db** — PostgreSQL. Seeded with sample data by a one-shot `seed` job.

## Run it locally

Prerequisites: Docker Desktop running.

```bash
cp .env.example .env      # then edit .env and set a real DB_PASSWORD
docker compose up --build
```

Open http://localhost:8080

To stop: `Ctrl+C`, then `docker compose down`.
To wipe the database too: `docker compose down -v`.

## API endpoints

| Method | Path                            | Purpose                       |
|--------|---------------------------------|-------------------------------|
| GET    | `/api/health`                   | Liveness probe                |
| GET    | `/api/ready`                    | Readiness probe (checks DB)   |
| GET    | `/api/metrics/overview`         | KPI summary                   |
| GET    | `/api/metrics/timeseries`       | 48h request/error series      |
| GET    | `/api/metrics/cost-by-provider` | Spend grouped by provider     |
| GET    | `/api/services`                 | All services (`?status=` opt) |
| GET    | `/api/incidents`                | Incident feed                 |
```
