"use client";

interface EmptyStateProps {
  query: string;
  onReset: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-16 text-center sm:py-20">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14 3 9l9-5 9 5-9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12v4.5c0 .9 2.2 2.5 5 2.5s5-1.6 5-2.5V12" />
        </svg>
      </div>
      <div className="space-y-1.5">
        <p className="text-base font-semibold text-slate-800">No colleges found</p>
        <p className="max-w-md text-sm text-slate-400">
          {query ? (
            <>
              No results for &quot;<span className="font-medium text-slate-600">{query}</span>&quot;.
            </>
          ) : (
            "No colleges match your current filters."
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
      >
        Clear filters
      </button>
    </div>
  );
}
