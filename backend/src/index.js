import express from "express";
import cors from "cors";
import { query } from "./db.js";

const app = express();
const PORT = parseInt(process.env.PORT || "4000", 10);

app.use(cors());
app.use(express.json());

// --- Health checks ---------------------------------------------------------
// Liveness: is the process up at all? (used by orchestrators to restart pods)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), ts: new Date().toISOString() });
});

// Readiness: can we actually serve traffic? (checks the DB dependency)
app.get("/api/ready", async (_req, res) => {
  try {
    await query("SELECT 1");
    res.json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not-ready", reason: "database unreachable" });
  }
});

// --- Overview KPIs ---------------------------------------------------------
app.get("/api/metrics/overview", async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT
        COUNT(*)                                          AS total_services,
        COUNT(*) FILTER (WHERE status = 'healthy')        AS healthy,
        COUNT(*) FILTER (WHERE status = 'degraded')       AS degraded,
        COUNT(*) FILTER (WHERE status = 'down')           AS down,
        COALESCE(SUM(requests_pm), 0)                     AS total_rpm,
        COALESCE(ROUND(AVG(latency_ms)), 0)               AS avg_latency,
        COALESCE(ROUND(AVG(uptime), 3), 0)                AS avg_uptime,
        COALESCE(ROUND(SUM(monthly_cost), 2), 0)          AS monthly_cost
      FROM services
    `);
    res.json(rows[0]);
  } catch (err) { next(err); }
});

// --- Time series for charts ------------------------------------------------
app.get("/api/metrics/timeseries", async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT to_char(bucket, 'HH24:MI') AS label,
             requests, errors, latency, cost
      FROM timeseries ORDER BY bucket ASC
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

// --- Services table --------------------------------------------------------
app.get("/api/services", async (req, res, next) => {
  try {
    const { status } = req.query;
    const rows = status
      ? (await query("SELECT * FROM services WHERE status = $1 ORDER BY monthly_cost DESC", [status])).rows
      : (await query("SELECT * FROM services ORDER BY monthly_cost DESC")).rows;
    res.json(rows);
  } catch (err) { next(err); }
});

// --- Cost split by provider ------------------------------------------------
app.get("/api/metrics/cost-by-provider", async (_req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT provider, ROUND(SUM(monthly_cost), 2) AS cost, COUNT(*) AS services
      FROM services GROUP BY provider ORDER BY cost DESC
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

// --- Incidents -------------------------------------------------------------
app.get("/api/incidents", async (_req, res, next) => {
  try {
    const { rows } = await query("SELECT * FROM incidents ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) { next(err); }
});

// --- Error handler ---------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error("Request error:", err.message);
  res.status(500).json({ error: "internal_error", message: err.message });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Aurora API listening on port ${PORT}`);
});
