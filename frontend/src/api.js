// Single place that talks to the backend. In every environment the frontend
// calls "/api/..." and the web server (Vite proxy locally, nginx in prod)
// forwards it to the backend. The frontend never needs to know the backend URL.
const BASE = "/api";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${path} -> ${res.status}`);
  return res.json();
}

export const api = {
  overview: () => get("/metrics/overview"),
  timeseries: () => get("/metrics/timeseries"),
  services: () => get("/services"),
  costByProvider: () => get("/metrics/cost-by-provider"),
  incidents: () => get("/incidents"),
  health: () => get("/health"),
};
