import { useEffect, useState, useCallback } from "react";
import { api } from "./api";
import KpiCard from "./components/KpiCard";
import TrafficChart from "./components/TrafficChart";
import CostDonut from "./components/CostDonut";
import ServicesTable from "./components/ServicesTable";
import IncidentFeed from "./components/IncidentFeed";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const load = useCallback(async () => {
    try {
      const [overview, timeseries, services, cost, incidents] = await Promise.all([
        api.overview(), api.timeseries(), api.services(), api.costByProvider(), api.incidents(),
      ]);
      setData({ overview, timeseries, services, cost, incidents });
      setLastSync(new Date());
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000); // auto-refresh every 15s
    return () => clearInterval(t);
  }, [load]);

  if (error && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="rounded-xl border border-crit/40 bg-panel p-8 max-w-md text-center">
          <div className="w-3 h-3 rounded-full bg-crit mx-auto mb-4 pulse-dot" />
          <h2 className="font-display text-lg font-semibold">Can't reach the API</h2>
          <p className="text-muted text-sm mt-2">
            The backend isn't responding. Check that the API container is running, then retry.
          </p>
          <p className="text-muted text-xs font-mono mt-3">{error}</p>
          <button onClick={load}
            className="mt-5 rounded-lg border border-edge bg-panel2 px-4 py-2 text-sm hover:border-signal transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted">
          <span className="w-2.5 h-2.5 rounded-full bg-signal pulse-dot" />
          <span className="font-mono text-sm">Connecting to telemetry…</span>
        </div>
      </div>
    );
  }

  const o = data.overview;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="aurora-glow border-b border-edge">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-signal to-electric flex items-center justify-center font-display font-bold text-base text-base">
              A
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight leading-none">AURORA</h1>
              <p className="text-[11px] text-muted tracking-wide">Infrastructure Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="w-2 h-2 rounded-full bg-healthy pulse-dot" />
            live · synced {lastSync ? lastSync.toLocaleTimeString() : "—"}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* KPI row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Healthy services" value={o.healthy} unit={`/ ${o.total_services}`}
                   accent="healthy" sub={`${o.degraded} degraded · ${o.down} down`} delay={0} />
          <KpiCard label="Requests / min" value={Number(o.total_rpm).toLocaleString()}
                   accent="signal" sub="across all regions" delay={60} />
          <KpiCard label="Avg latency" value={o.avg_latency} unit="ms"
                   accent="electric" sub={`${o.avg_uptime}% mean uptime`} delay={120} />
          <KpiCard label="Monthly spend" value={`$${(o.monthly_cost / 1000).toFixed(1)}k`}
                   accent="warn" sub="projected" delay={180} />
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><TrafficChart data={data.timeseries} /></div>
          <CostDonut data={data.cost} />
        </section>

        {/* Table + incidents */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2"><ServicesTable rows={data.services} /></div>
          <IncidentFeed items={data.incidents} />
        </section>

        <footer className="pt-4 pb-8 text-center text-[11px] text-muted font-mono">
          Aurora · demo telemetry · auto-refresh 15s
        </footer>
      </main>
    </div>
  );
}
