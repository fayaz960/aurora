export default function KpiCard({ label, value, unit, accent = "signal", sub, delay = 0 }) {
  const accents = {
    signal: "text-signal",
    electric: "text-electric",
    healthy: "text-healthy",
    warn: "text-warn",
    crit: "text-crit",
  };
  return (
    <div
      className="rise rounded-xl border border-edge bg-panel p-5 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -top-px left-5 right-5 h-px bg-current ${accents[accent]} opacity-40`} />
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-medium">{label}</p>
      <div className="mt-3 flex items-baseline gap-1.5">
        <span className={`font-mono text-3xl font-bold ${accents[accent]}`}>{value}</span>
        {unit && <span className="text-muted text-sm font-mono">{unit}</span>}
      </div>
      {sub && <p className="mt-2 text-xs text-muted">{sub}</p>}
    </div>
  );
}
