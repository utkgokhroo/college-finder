"use client";

import { DEFAULT_FILTERS } from "@/hooks/useColleges";
import { formatCurrency } from "@/lib/utils";
import { FilterState } from "@/types/college";

interface ActiveFiltersProps {
  filters: FilterState;
  onUpdate: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onReset: () => void;
}

interface Chip {
  label: string;
  onRemove: () => void;
}

export function ActiveFilters({ filters, onUpdate, onReset }: ActiveFiltersProps) {
  const chips: Chip[] = [];

  filters.type.forEach((type) =>
    chips.push({
      label: `Type: ${type}`,
      onRemove: () => onUpdate("type", filters.type.filter((item) => item !== type)),
    })
  );

  if (filters.maxTuition !== DEFAULT_FILTERS.maxTuition) {
    chips.push({
      label: `Fees under ${formatCurrency(filters.maxTuition)}`,
      onRemove: () => onUpdate("maxTuition", DEFAULT_FILTERS.maxTuition),
    });
  }

  if (filters.minRating > 0) {
    chips.push({
      label: `Rating ${filters.minRating}+`,
      onRemove: () => onUpdate("minRating", 0),
    });
  }

  if (filters.maxRanking < DEFAULT_FILTERS.maxRanking) {
    chips.push({
      label: `Top #${filters.maxRanking}`,
      onRemove: () => onUpdate("maxRanking", DEFAULT_FILTERS.maxRanking),
    });
  }

  filters.programs.forEach((program) =>
    chips.push({
      label: program,
      onRemove: () => onUpdate("programs", filters.programs.filter((item) => item !== program)),
    })
  );

  filters.states.forEach((state) =>
    chips.push({
      label: `State: ${state}`,
      onRemove: () => onUpdate("states", filters.states.filter((item) => item !== state)),
    })
  );

  if (chips.length === 0) return null;

  return (
    <div className="flex items-start gap-2 overflow-x-auto pb-1" aria-label="Active filters">
      <span className="mt-1 shrink-0 text-xs font-medium text-slate-500">Active:</span>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip.label}
            className="flex items-center gap-1.5 rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
          >
            {chip.label}
            <button
              type="button"
              onClick={chip.onRemove}
              className="rounded-full text-blue-400 transition-colors hover:text-blue-700"
              aria-label={`Remove ${chip.label} filter`}
            >
              <span aria-hidden="true">×</span>
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 hover:underline"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
