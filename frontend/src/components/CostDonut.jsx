import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = { aws: "#F5B14C", azure: "#5B8DEF", gcp: "#3ED598" };

export default function CostDonut({ data }) {
  const total = data.reduce((s, d) => s + Number(d.cost), 0);
  return (
    <div className="rounded-xl border border-edge bg-panel p-5">
      <h3 className="font-display text-sm font-semibold tracking-wide mb-4">Spend by provider</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} dataKey="cost" nameKey="provider" innerRadius={58}
                 outerRadius={82} paddingAngle={3} stroke="none">
              {data.map((d) => <Cell key={d.provider} fill={COLORS[d.provider] || "#8A97AD"} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-2xl font-bold text-ink">${(total / 1000).toFixed(1)}k</span>
          <span className="text-[10px] text-muted uppercase tracking-widest">/ month</span>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        {data.map((d) => (
          <div key={d.provider} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 text-muted">
              <i className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[d.provider] }} />
              <span className="uppercase font-mono">{d.provider}</span>
            </span>
            <span className="font-mono text-ink">${Number(d.cost).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
