"use client";

import { SortKey, ViewMode } from "@/types/college";
import { cn } from "@/lib/utils";

interface SortBarProps {
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
  viewMode: ViewMode;
  onViewMode: (view: ViewMode) => void;
  totalCount: number;
  activeFilters: number;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "ranking", label: "Best Ranked" },
  { value: "rating", label: "Highest Rated" },
  { value: "tuition_asc", label: "Fees: Low to High" },
  { value: "tuition_desc", label: "Fees: High to Low" },
  { value: "acceptanceRate", label: "Most Accessible" },
  { value: "name", label: "A to Z" },
];

function GridIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5zM5 11a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H5zM11 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V5zM11 13a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function SortBar({ sortKey, onSort, viewMode, onViewMode, totalCount, activeFilters }: SortBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-slate-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-slate-800">{totalCount}</span>{" "}
        college{totalCount !== 1 ? "s" : ""}
        {activeFilters > 0 && <span className="text-slate-400"> filtered</span>}
      </p>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <label htmlFor="college-sort" className="text-xs font-medium text-slate-500">
            Sort by
          </label>
          <select
            id="college-sort"
            value={sortKey}
            onChange={(event) => onSort(event.target.value as SortKey)}
            className="h-9 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 sm:w-48 sm:flex-none"
          >
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex w-fit rounded-xl border border-slate-200 bg-white p-1" role="group" aria-label="View mode">
          <button
            type="button"
            onClick={() => onViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid view"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <GridIcon />
          </button>
          <button
            type="button"
            onClick={() => onViewMode("list")}
            aria-pressed={viewMode === "list"}
            aria-label="List view"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <ListIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
