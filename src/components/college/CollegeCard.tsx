"use client";
import Link from "next/link";
import { College } from "@/types/college";
import { useSavedStore } from "@/store/useSavedStore";
import { useCompareStore } from "@/store/useCompareStore";
import { MAX_COMPARE } from "@/lib/constants";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";

// ─── Star rating ─────────────────────────────────────────────────────────────
// Use a stable id prefix based on a prop so SVG gradient ids don't collide
// across cards when multiple are rendered in the same document.
function StarRating({ rating, id }: { rating: number; id: string }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating.toFixed(1)} out of 5`}>
      <div className="flex" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled  = rating >= star;
          const partial = !filled && rating > star - 1;
          const gradId  = `star-grad-${id}-${star}`;
          const pct     = partial ? (rating - (star - 1)) * 100 : 0;
          return (
            <svg key={star} className="h-3.5 w-3.5" viewBox="0 0 20 20">
              {partial && (
                <defs>
                  <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset={`${pct}%`} stopColor="#F59E0B" />
                    <stop offset={`${pct}%`} stopColor="#E5E7EB" />
                  </linearGradient>
                </defs>
              )}
              <path
                fill={filled ? "#F59E0B" : partial ? `url(#${gradId})` : "#E5E7EB"}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-amber-600">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cn(
      "flex flex-col items-center rounded-xl px-3 py-2.5 text-center",
      highlight ? "bg-blue-50 ring-1 ring-blue-100" : "bg-slate-50"
    )}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <span className={cn("mt-0.5 text-sm font-bold", highlight ? "text-blue-700" : "text-slate-800")}>
        {value}
      </span>
    </div>
  );
}

// ─── Type badge ───────────────────────────────────────────────────────────────
const typeMeta: Record<string, { label: string; className: string }> = {
  public:    { label: "Public",    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" },
  private:   { label: "Private",   className: "bg-blue-50    text-blue-700    ring-1 ring-blue-200"    },
  community: { label: "Community", className: "bg-amber-50   text-amber-700   ring-1 ring-amber-200"   },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg className="h-4 w-4" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
  </svg>
);

const ScaleIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-4 9 4M3 6v13l9 4M3 6l9 4m9-4v13l-9 4m9-13L12 10m0 0v13"/>
  </svg>
);

const PinIcon = () => (
  <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

// ─── Grid card ────────────────────────────────────────────────────────────────
export function CollegeCard({ college }: { college: College }) {
  const { isSaved, toggleCollege } = useSavedStore();
  const { isSelected, add, remove, isFull } = useCompareStore();
  const saved     = isSaved(college.id);
  const inCompare = isSelected(college.id);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Color accent bar */}
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: college.color }} aria-hidden="true" />

      {/* Save button (top-right, visible on hover or when saved) */}
      <button
        type="button"
        onClick={() => toggleCollege(college.id)}
        className={cn(
          "absolute right-3 top-4 z-10 rounded-full p-1.5 transition-all",
          saved
            ? "bg-rose-50 text-rose-500 hover:bg-rose-100"
            : "bg-white/80 text-slate-300 opacity-0 shadow-sm hover:text-rose-400 group-hover:opacity-100 focus-visible:opacity-100"
        )}
        aria-label={saved ? `Remove ${college.name} from saved` : `Save ${college.name}`}
        aria-pressed={saved}
      >
        <BookmarkIcon filled={saved} />
      </button>

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2 pr-6">
            <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", typeMeta[college.type].className)}>
              {typeMeta[college.type].label}
            </span>
            <span className="shrink-0 rounded-lg bg-slate-800 px-2 py-0.5 text-xs font-bold tabular-nums text-white">
              #{college.ranking}
            </span>
          </div>

          <Link
            href={`/colleges/${college.id}`}
            className="block text-[15px] font-bold leading-snug text-slate-900 transition-colors hover:text-blue-600 line-clamp-2"
          >
            {college.name}
          </Link>

          <p className="flex items-center gap-1 text-xs text-slate-400">
            <PinIcon />
            {college.location}
          </p>
        </div>

        {/* Rating */}
        <StarRating rating={college.rating} id={college.id} />

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <StatPill label="Annual Fees" value={formatCurrency(college.tuition)} highlight />
          <StatPill label="Acceptance"  value={formatPercent(college.acceptanceRate)} />
        </div>

        {/* Programs */}
        <div className="flex flex-wrap gap-1.5">
          {college.programs.slice(0, 3).map((p) => (
            <span key={p} className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 ring-1 ring-slate-100">
              {p}
            </span>
          ))}
          {college.programs.length > 3 && (
            <span className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-400 ring-1 ring-slate-100">
              +{college.programs.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 border-t border-slate-50 pt-4">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() => inCompare ? remove(college.id) : add(college.id)}
            disabled={!inCompare && isFull()}
            aria-pressed={inCompare}
            title={!inCompare && isFull() ? `Compare list full (max ${MAX_COMPARE})` : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
              inCompare
                ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
            )}
          >
            <ScaleIcon />
            {inCompare ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── List / row card ─────────────────────────────────────────────────────────
export function CollegeListCard({ college }: { college: College }) {
  const { isSaved, toggleCollege } = useSavedStore();
  const { isSelected, add, remove, isFull } = useCompareStore();
  const saved     = isSaved(college.id);
  const inCompare = isSelected(college.id);

  return (
    <article className="group flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-5">
      {/* Rank badge */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
        style={{ backgroundColor: college.color }}
        aria-label={`Ranked #${college.ranking}`}
      >
        #{college.ranking}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/colleges/${college.id}`}
            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {college.name}
          </Link>
          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", typeMeta[college.type].className)}>
            {typeMeta[college.type].label}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <PinIcon />{college.location}
          </span>
          <StarRating rating={college.rating} id={`list-${college.id}`} />
        </div>
        {/* Stats visible on mobile too */}
        <div className="flex items-center gap-4 pt-1 sm:hidden">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fees </span>
            <span className="text-sm font-bold text-blue-700">{formatCurrency(college.tuition)}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Acceptance </span>
            <span className="text-sm font-bold text-slate-800">{formatPercent(college.acceptanceRate)}</span>
          </div>
        </div>
      </div>

      {/* Stats (sm+) */}
      <div className="hidden sm:flex items-center gap-6 shrink-0">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Fees</p>
          <p className="text-sm font-bold text-blue-700">{formatCurrency(college.tuition)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Acceptance</p>
          <p className="text-sm font-bold text-slate-800">{formatPercent(college.acceptanceRate)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => toggleCollege(college.id)}
          className={cn(
            "rounded-xl p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            saved ? "bg-rose-50 text-rose-500 focus-visible:ring-rose-400" : "text-slate-300 hover:bg-slate-50 hover:text-rose-400 focus-visible:ring-slate-300"
          )}
          aria-label={saved ? `Remove ${college.name} from saved` : `Save ${college.name}`}
          aria-pressed={saved}
        >
          <BookmarkIcon filled={saved} />
        </button>
        <button
          type="button"
          onClick={() => inCompare ? remove(college.id) : add(college.id)}
          disabled={!inCompare && isFull()}
          aria-label={inCompare ? `Remove ${college.name} from comparison` : `Add ${college.name} to comparison`}
          aria-pressed={inCompare}
          className={cn(
            "rounded-xl p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
            inCompare ? "bg-blue-50 text-blue-600 focus-visible:ring-blue-400" : "text-slate-300 hover:bg-slate-50 hover:text-blue-400 focus-visible:ring-slate-300 disabled:opacity-30"
          )}
        >
          <ScaleIcon />
        </button>
        <Link
          href={`/colleges/${college.id}`}
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
        >
          View
        </Link>
      </div>
    </article>
  );
}
