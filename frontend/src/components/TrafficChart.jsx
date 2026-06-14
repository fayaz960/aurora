import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

function fmt(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n;
}

function Box({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-edge bg-panel2 px-3 py-2 text-xs font-mono shadow-xl">
      <p className="text-muted mb-1">{label}</p>
      <p className="text-signal">{fmt(payload[0].value)} req</p>
      {payload[1] && <p className="text-crit">{fmt(payload[1].value)} err</p>}
    </div>
  );
}

export default function TrafficChart({ data }) {
  return (
    <div className="rounded-xl border border-edge bg-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-sm font-semibold tracking-wide">Request volume · 48h</h3>
        <div className="flex gap-4 text-[11px] text-muted font-mono">
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-signal" />requests</span>
          <span className="flex items-center gap-1.5"><i className="w-2 h-2 rounded-full bg-crit" />errors</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="gReq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#39D8C8" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#39D8C8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gErr" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2557A" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#F2557A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c2535" vertical={false} />
          <XAxis dataKey="label" stroke="#8A97AD" fontSize={10} tickLine={false}
                 interval={7} fontFamily="JetBrains Mono" />
          <YAxis stroke="#8A97AD" fontSize={10} tickLine={false} axisLine={false}
                 tickFormatter={fmt} fontFamily="JetBrains Mono" />
          <Tooltip content={<Box />} />
          <Area type="monotone" dataKey="requests" stroke="#39D8C8" strokeWidth={2}
                fill="url(#gReq)" />
          <Area type="monotone" dataKey="errors" stroke="#F2557A" strokeWidth={1.5}
                fill="url(#gErr)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
