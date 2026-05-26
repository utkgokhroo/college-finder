import { PlacementStat } from "@/types/college";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface PlacementsSectionProps {
  placement: PlacementStat;
}

function StatHighlight({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 rounded-2xl p-5 ${accent ? "bg-blue-600 text-white" : "bg-slate-50"}`}>
      <span className={`text-2xl font-bold ${accent ? "text-white" : "text-slate-900"}`}>{value}</span>
      {sub && <span className={`text-xs ${accent ? "text-blue-200" : "text-slate-400"}`}>{sub}</span>}
      <span className={`text-xs font-semibold uppercase tracking-wider ${accent ? "text-blue-200" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}

// Simple donut chart using SVG
function DonutChart({ sectors, placementRate }: { sectors: PlacementStat["sectors"]; placementRate: number }) {
  const total  = sectors.reduce((s, c) => s + c.percent, 0);
  const radius = 70;
  const cx     = 90;
  const cy     = 90;
  const circ   = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row">
      {/* SVG donut */}
      <div className="relative shrink-0">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {sectors.map((s, i) => {
            const dasharray = (s.percent / total) * circ;
            const dashoffset = -offset * (circ / total) + circ * 0.25;
            offset += s.percent;
            return (
              <circle
                key={i}
                cx={cx} cy={cy} r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={28}
                strokeDasharray={`${dasharray} ${circ}`}
                strokeDashoffset={dashoffset}
                className="transition-all duration-500"
              />
            );
          })}
          {/* Inner white circle */}
          <circle cx={cx} cy={cy} r={56} fill="white"/>
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#1e293b" fontSize="18" fontWeight="700">{Math.round(placementRate * 100)}%</text>
          <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="500">placed</text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-1 flex-col gap-2.5">
        {sectors.map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
            <span className="flex-1 text-sm text-slate-700">{s.name}</span>
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.percent}%`, backgroundColor: s.color }}/>
              </div>
              <span className="w-8 text-right text-sm font-semibold text-slate-800">{s.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlacementsSection({ placement }: PlacementsSectionProps) {
  return (
    <div className="space-y-8">
      {/* Key stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatHighlight
          label="Placement Rate"
          value={formatPercent(placement.placementRate)}
          sub={`Class of ${placement.year}`}
          accent
        />
        <StatHighlight
          label="Average Package"
          value={formatCurrency(placement.avgPackage)}
          sub="per year"
        />
        <StatHighlight
          label="Highest Package"
          value={formatCurrency(placement.highestPackage)}
          sub="per year"
        />
        <StatHighlight
          label="Top Recruiters"
          value={`${placement.topRecruiters.length}+`}
          sub="companies"
        />
      </div>

      {/* Two-column: donut + recruiters */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sector breakdown */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Placements by Sector</h3>
          <DonutChart sectors={placement.sectors} placementRate={placement.placementRate} />
        </div>

        {/* Top recruiters */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Top Recruiters</h3>
          <div className="grid grid-cols-2 gap-2">
            {placement.topRecruiters.map((r, i) => (
              <div
                key={r}
                className="flex items-center gap-2.5 rounded-xl border border-slate-50 bg-slate-50 px-3 py-2.5 hover:border-slate-200 transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-slate-400 shadow-sm ring-1 ring-slate-100">
                  {i + 1}
                </span>
                <span className="truncate text-sm font-medium text-slate-800">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary insight bar */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">Salary Range</h3>
        <div className="relative">
          <div className="h-8 rounded-full bg-gradient-to-r from-emerald-100 via-blue-100 to-violet-100 overflow-hidden">
            <div
              className="absolute top-1/2 -translate-y-1/2 h-6 w-1.5 rounded-full bg-blue-600 shadow-sm"
              style={{ left: `${((placement.avgPackage - 80000) / (placement.highestPackage - 80000)) * 90}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>$80k</span>
            <span className="font-semibold text-blue-600">Avg: {formatCurrency(placement.avgPackage)}</span>
            <span>{formatCurrency(placement.highestPackage)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
