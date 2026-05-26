"use client";
import { FilterState, CollegeType } from "@/types/college";
import { ALL_PROGRAMS, ALL_STATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters:        FilterState;
  onUpdate:       <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset:        () => void;
  activeCount:    number;
  isMobileOpen?:  boolean;
  onMobileClose?: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
      {children}
    </h3>
  );
}

function CheckChip({
  checked, onChange, label, count
}: {
  checked: boolean; onChange: () => void; label: string; count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all",
        checked
          ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200 font-medium"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      )}
    >
      <span className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded",
        "border-2 transition-colors",
        checked ? "border-blue-600 bg-blue-600" : "border-slate-200 bg-white"
      )}>
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {count !== undefined && (
        <span className="text-xs text-slate-400">{count}</span>
      )}
    </button>
  );
}

// ─── Panel content ────────────────────────────────────────────────────────────
const COLLEGE_TYPES: { value: CollegeType; label: string }[] = [
  { value: "public",    label: "Public"    },
  { value: "private",   label: "Private"   },
  { value: "community", label: "Community" },
];

const TUITION_PRESETS = [
  { label: "Any budget",  value: 70000 },
  { label: "Under $15k",  value: 15000 },
  { label: "Under $30k",  value: 30000 },
  { label: "Under $50k",  value: 50000 },
  { label: "Under $60k",  value: 60000 },
];

const RATING_OPTIONS = [
  { label: "Any rating",  value: 0 },
  { label: "4.5+",        value: 4.5 },
  { label: "4.0+",        value: 4.0 },
  { label: "3.5+",        value: 3.5 },
];

function FilterPanel({ filters, onUpdate, onReset, activeCount }: Omit<FilterSidebarProps, "isMobileOpen" | "onMobileClose">) {
  const toggleType = (t: CollegeType) => {
    const curr = filters.type;
    onUpdate("type", curr.includes(t) ? curr.filter(x => x !== t) : [...curr, t]);
  };

  const toggleProgram = (p: string) => {
    const curr = filters.programs;
    onUpdate("programs", curr.includes(p) ? curr.filter(x => x !== p) : [...curr, p]);
  };

  const toggleState = (s: string) => {
    const curr = filters.states;
    onUpdate("states", curr.includes(s) ? curr.filter(x => x !== s) : [...curr, s]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 9h10M11 14h2"/>
          </svg>
          <span className="text-sm font-semibold text-slate-800">Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button type="button" onClick={onReset} className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Institution Type */}
      <div>
        <SectionTitle>Institution Type</SectionTitle>
        <div className="space-y-0.5">
          {COLLEGE_TYPES.map(({ value, label }) => (
            <CheckChip
              key={value}
              checked={filters.type.includes(value)}
              onChange={() => toggleType(value)}
              label={label}
            />
          ))}
        </div>
      </div>

      {/* Tuition */}
      <div>
        <SectionTitle>Annual Fees</SectionTitle>
        <div className="space-y-1">
          {TUITION_PRESETS.map(({ label, value }) => (
            <button
              type="button"
              key={label}
              onClick={() => onUpdate("maxTuition", value)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left text-sm transition-all",
                filters.maxTuition === value
                  ? "border-blue-200 bg-blue-50 font-medium text-blue-700"
                  : "border-transparent text-slate-600 hover:bg-slate-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <SectionTitle>Minimum Rating</SectionTitle>
        <div className="space-y-1">
          {RATING_OPTIONS.map(({ label, value }) => (
            <button
              type="button"
              key={label}
              onClick={() => onUpdate("minRating", value)}
              className={cn(
                "w-full rounded-xl border px-3 py-2 text-left text-sm transition-all",
                filters.minRating === value
                  ? "border-blue-200 bg-blue-50 font-medium text-blue-700"
                  : "border-transparent text-slate-600 hover:bg-slate-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ranking */}
      <div>
        <SectionTitle>Max Ranking</SectionTitle>
        <div className="px-1 space-y-2">
          <input
            type="range"
            min={1} max={500}
            value={filters.maxRanking}
            onChange={(e) => onUpdate("maxRanking", Number(e.target.value))}
            aria-label="Maximum ranking"
            aria-valuetext={`Top #${filters.maxRanking}`}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">#1</span>
            <span className="font-semibold text-blue-700">Top #{filters.maxRanking}</span>
            <span className="text-slate-400">#500</span>
          </div>
        </div>
      </div>

      {/* Programs */}
      <div>
        <SectionTitle>Programs</SectionTitle>
        <div className="max-h-48 space-y-0.5 overflow-y-auto">
          {ALL_PROGRAMS.map((p) => (
            <CheckChip
              key={p}
              checked={filters.programs.includes(p)}
              onChange={() => toggleProgram(p)}
              label={p}
            />
          ))}
        </div>
      </div>

      {/* States */}
      <div>
        <SectionTitle>State</SectionTitle>
        <div className="flex flex-wrap gap-1.5">
          {ALL_STATES.map((s) => {
            const active = filters.states.includes(s);
            return (
              <button
                type="button"
                key={s}
                onClick={() => toggleState(s)}
                aria-pressed={active}
                className={cn(
                  "rounded-lg border px-2.5 py-1 text-xs font-medium transition-all",
                  active
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-700"
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function FilterSidebar(props: FilterSidebarProps) {
  const { isMobileOpen, onMobileClose, ...panelProps } = props;

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <FilterPanel {...panelProps} />
        </div>
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
            onClick={onMobileClose}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-drawer-title"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white px-5 py-6 shadow-2xl lg:hidden"
          >
            <div className="mb-5 flex items-center justify-between">
              <span id="filter-drawer-title" className="text-base font-semibold text-slate-900">Filters</span>
              <button
                type="button"
                onClick={onMobileClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"
                aria-label="Close filters"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <FilterPanel {...panelProps} />
            <div className="mt-6 pb-2">
              <button
                type="button"
                onClick={onMobileClose}
                className="w-full rounded-2xl bg-slate-900 py-3 text-sm font-semibold text-white"
              >
                Show {panelProps.activeCount > 0 ? "filtered " : ""}results
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export function FilterTriggerButton({ onClick, activeCount }: { onClick: () => void; activeCount: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={activeCount > 0 ? `Open filters, ${activeCount} active` : "Open filters"}
      className={cn(
        "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all lg:hidden",
        activeCount > 0
          ? "border-blue-200 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 9h10M11 14h2"/>
      </svg>
      Filters
      {activeCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
          {activeCount}
        </span>
      )}
    </button>
  );
}
