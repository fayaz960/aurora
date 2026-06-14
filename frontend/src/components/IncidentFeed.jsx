const SEV = {
  critical: { ring: "border-crit/40", dot: "bg-crit", label: "text-crit" },
  warning: { ring: "border-warn/40", dot: "bg-warn", label: "text-warn" },
  info: { ring: "border-electric/40", dot: "bg-electric", label: "text-electric" },
};

function ago(ts) {
  const mins = Math.floor((Date.now() - new Date(ts)) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return hrs < 24 ? `${hrs}h ago` : `${Math.floor(hrs / 24)}d ago`;
}

export default function IncidentFeed({ items }) {
  return (
    <div className="rounded-xl border border-edge bg-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold tracking-wide">Active incidents</h3>
        <span className="text-[11px] text-muted font-mono">{items.length}</span>
      </div>
      <div className="space-y-2.5">
        {items.map((i) => {
          const s = SEV[i.severity] || SEV.info;
          return (
            <div key={i.id} className={`rounded-lg border ${s.ring} bg-panel2 px-3.5 py-3`}>
              <div className="flex items-start gap-2.5">
                <span className={`mt-1 w-2 h-2 rounded-full ${s.dot} pulse-dot shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink leading-snug">{i.title}</p>
                  <div className="mt-1.5 flex items-center gap-2 text-[11px] font-mono">
                    <span className={`uppercase ${s.label}`}>{i.severity}</span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">{i.service}</span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">{ago(i.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
