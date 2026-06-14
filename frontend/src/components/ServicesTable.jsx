const STATUS = {
  healthy: { dot: "bg-healthy", text: "text-healthy" },
  degraded: { dot: "bg-warn", text: "text-warn" },
  down: { dot: "bg-crit", text: "text-crit" },
};

function Bar({ value }) {
  const color = value > 85 ? "bg-crit" : value > 65 ? "bg-warn" : "bg-signal";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-edge overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="font-mono text-xs text-muted w-9">{Number(value).toFixed(0)}%</span>
    </div>
  );
}

export default function ServicesTable({ rows }) {
  return (
    <div className="rounded-xl border border-edge bg-panel overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-edge">
        <h3 className="font-display text-sm font-semibold tracking-wide">Services</h3>
        <span className="text-[11px] text-muted font-mono">{rows.length} tracked</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-muted">
              <th className="text-left font-medium px-5 py-2.5">Service</th>
              <th className="text-left font-medium px-3 py-2.5">Region</th>
              <th className="text-left font-medium px-3 py-2.5">CPU</th>
              <th className="text-right font-medium px-3 py-2.5">Latency</th>
              <th className="text-right font-medium px-3 py-2.5">Uptime</th>
              <th className="text-right font-medium px-5 py-2.5">Cost/mo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const st = STATUS[s.status] || STATUS.healthy;
              return (
                <tr key={s.id} className="border-t border-edge/60 hover:bg-panel2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${st.dot} ${s.status !== "healthy" ? "pulse-dot" : ""}`} />
                      <span className="font-mono text-ink">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-muted">{s.region}</td>
                  <td className="px-3 py-3"><Bar value={s.cpu} /></td>
                  <td className="px-3 py-3 text-right font-mono text-xs text-ink">{s.latency_ms}ms</td>
                  <td className={`px-3 py-3 text-right font-mono text-xs ${st.text}`}>{Number(s.uptime).toFixed(2)}%</td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-ink">${Number(s.monthly_cost).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
