"use client";
import { CollegeDetail } from "@/types/college";
import { formatCurrency, formatPercent, formatNumber, cn } from "@/lib/utils";
import { useSavedStore } from "@/store/useSavedStore";
import { useCompareStore } from "@/store/useCompareStore";

interface DetailHeroProps {
  college: CollegeDetail;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 rounded-2xl bg-white/10 backdrop-blur-sm px-4 py-3 text-center ring-1 ring-white/20">
      <span className="text-xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-white/60">{sub}</span>}
      <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">{label}</span>
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <svg key={s} className="h-4 w-4" viewBox="0 0 20 20">
            <path
              fill={rating >= s ? "#FCD34D" : "rgba(255,255,255,0.25)"}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ))}
      </div>
      <span className="text-sm font-semibold text-yellow-300">{rating.toFixed(1)}</span>
      <span className="text-sm text-white/50">overall rating</span>
    </div>
  );
}

export function DetailHero({ college }: DetailHeroProps) {
  const { isSaved, saveCollege, unsaveCollege } = useSavedStore();
  const { isSelected, add, remove, isFull } = useCompareStore();
  const saved     = isSaved(college.id);
  const inCompare = isSelected(college.id);

  const typeMeta: Record<string, string> = {
    public:    "Public University",
    private:   "Private University",
    community: "Community College",
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: `linear-gradient(135deg, ${college.color} 0%, ${college.color}cc 50%, #0f172a 100%)` }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />

      <div className="relative px-6 py-10 sm:px-10">
        {/* Top row */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm ring-1 ring-white/30">
              {typeMeta[college.type]}
            </span>
            {college.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 ring-1 ring-white/20">
                {tag}
              </span>
            ))}
          </div>

          {/* Rank badge */}
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/15 ring-2 ring-white/30 backdrop-blur-sm">
            <span className="text-xs font-medium text-white/60">Rank</span>
            <span className="text-xl font-bold text-white">#{college.ranking}</span>
          </div>
        </div>

        {/* Name + location */}
        <div className="mb-3">
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{college.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-white/70">
            <span className="flex items-center gap-1.5 text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {college.location}
            </span>
            <span className="flex items-center gap-1.5 text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Est. {college.founded}
            </span>
            <a href={college.website} target="_blank" rel="noopener noreferrer"
               className="flex items-center gap-1.5 text-sm hover:text-white transition-colors">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
              Website
            </a>
          </div>
        </div>

        {/* Stars */}
        <div className="mb-8">
          <StarRow rating={college.rating} />
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Annual Fees"  value={formatCurrency(college.tuition)} />
          <StatCard label="Acceptance"   value={formatPercent(college.acceptanceRate)} />
          <StatCard label="Enrollment"   value={formatNumber(college.enrollment)} />
          <StatCard label="SAT Range"    value={`${college.satRange[0]}–${college.satRange[1]}`} sub="25th–75th" />
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => saved ? unsaveCollege(college.id) : saveCollege(college.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
              saved
                ? "bg-white text-rose-600 hover:bg-rose-50"
                : "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25 backdrop-blur-sm"
            )}
          >
            <svg className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            {saved ? "Saved" : "Save College"}
          </button>

          <button
            type="button"
            onClick={() => inCompare ? remove(college.id) : add(college.id)}
            disabled={!inCompare && isFull()}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all",
              inCompare
                ? "bg-white text-blue-700 hover:bg-blue-50"
                : "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/25 backdrop-blur-sm disabled:opacity-40"
            )}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l9-4 9 4M3 6v13l9 4M3 6l9 4m9-4v13l-9 4m9-13L12 10m0 0v13"/>
            </svg>
            {inCompare ? "In Compare" : "Add to Compare"}
          </button>

          <a
            href={`mailto:${college.email}`}
            className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 hover:bg-white/25 backdrop-blur-sm transition-all"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}
