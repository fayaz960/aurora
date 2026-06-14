import pool from "./db.js";

// Regions and service names used to generate realistic-looking sample data.
const REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "ap-south-1", "ap-southeast-2"];
const SERVICE_NAMES = [
  "api-gateway", "auth-service", "billing-worker", "checkout-api",
  "notification-hub", "search-indexer", "media-transcoder", "analytics-pipeline",
  "session-store", "recommendation-engine", "audit-logger", "image-resizer",
];
const PROVIDERS = ["aws", "azure", "gcp"];

const rand = (min, max) => Math.random() * (max - min) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function createSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id           SERIAL PRIMARY KEY,
      name         TEXT NOT NULL,
      region       TEXT NOT NULL,
      provider     TEXT NOT NULL,
      status       TEXT NOT NULL,
      cpu          NUMERIC(5,2) NOT NULL,
      memory       NUMERIC(5,2) NOT NULL,
      requests_pm  INTEGER NOT NULL,
      latency_ms   INTEGER NOT NULL,
      uptime       NUMERIC(6,3) NOT NULL,
      monthly_cost NUMERIC(10,2) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id         SERIAL PRIMARY KEY,
      service    TEXT NOT NULL,
      severity   TEXT NOT NULL,
      title      TEXT NOT NULL,
      status     TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS timeseries (
      id        SERIAL PRIMARY KEY,
      bucket    TIMESTAMPTZ NOT NULL,
      requests  INTEGER NOT NULL,
      errors    INTEGER NOT NULL,
      latency   INTEGER NOT NULL,
      cost      NUMERIC(8,2) NOT NULL
    );
  `);
}

async function seed() {
  await pool.query("TRUNCATE services, incidents, timeseries RESTART IDENTITY");

  // Services
  for (const name of SERVICE_NAMES) {
    const cpu = rand(8, 92);
    const status = cpu > 85 ? "degraded" : cpu > 95 ? "down" : "healthy";
    await pool.query(
      `INSERT INTO services
        (name, region, provider, status, cpu, memory, requests_pm, latency_ms, uptime, monthly_cost)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [
        name, pick(REGIONS), pick(PROVIDERS), status,
        cpu.toFixed(2), rand(20, 88).toFixed(2),
        Math.floor(rand(200, 48000)), Math.floor(rand(12, 480)),
        rand(99.0, 99.999).toFixed(3), rand(40, 4200).toFixed(2),
      ]
    );
  }

  // Incidents
  const incidents = [
    ["checkout-api", "critical", "Elevated 5xx error rate on checkout", "investigating"],
    ["auth-service", "warning", "Token refresh latency above threshold", "monitoring"],
    ["search-indexer", "warning", "Index lag exceeding 30s", "monitoring"],
    ["billing-worker", "info", "Scheduled maintenance window", "resolved"],
    ["media-transcoder", "critical", "Worker pool saturation", "investigating"],
  ];
  for (let i = 0; i < incidents.length; i++) {
    const [service, severity, title, status] = incidents[i];
    await pool.query(
      `INSERT INTO incidents (service, severity, title, status, created_at)
       VALUES ($1,$2,$3,$4, now() - ($5 || ' hours')::interval)`,
      [service, severity, title, status, i * 7 + 1]
    );
  }

  // Timeseries — 48 hourly buckets
  for (let h = 47; h >= 0; h--) {
    const base = 18000 + Math.sin(h / 3) * 6000 + rand(-2000, 2000);
    const requests = Math.max(800, Math.floor(base));
    await pool.query(
      `INSERT INTO timeseries (bucket, requests, errors, latency, cost)
       VALUES (now() - ($1 || ' hours')::interval, $2, $3, $4, $5)`,
      [h, requests, Math.floor(requests * rand(0.001, 0.03)),
       Math.floor(rand(45, 260)), (requests * 0.00004).toFixed(2)]
    );
  }

  console.log("Seed complete: 12 services, 5 incidents, 48 timeseries buckets.");
}

(async () => {
  try {
    await createSchema();
    await seed();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
})();
