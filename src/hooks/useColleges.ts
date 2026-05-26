import { useMemo, useState, useCallback } from "react";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { useDebounce } from "./useDebounce";
import { FilterState, SortKey, ViewMode } from "@/types/college";

const PAGE_SIZE = 9;

export const DEFAULT_FILTERS: FilterState = {
  search:     "",
  type:       [],
  maxTuition: 70000,
  minRating:  0,
  maxRanking: 500,
  programs:   [],
  states:     [],
};

export function useColleges() {
  const [filters,  setFilters]  = useState<FilterState>(DEFAULT_FILTERS);
  const [sortKey,  setSortKey]  = useState<SortKey>("ranking");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page,     setPage]     = useState(1);

  const debouncedSearch = useDebounce(filters.search, 250);
  const isSearching = filters.search !== debouncedSearch;

  // ── Filtered + sorted result ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();

    return MOCK_COLLEGES.filter((c) => {
      // text search: name, location, programs, tags
      if (q) {
        const haystack = [c.name, c.location, c.city, c.state, ...c.programs, ...c.tags]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // type filter
      if (filters.type.length && !filters.type.includes(c.type)) return false;

      // tuition filter
      if (c.tuition > filters.maxTuition) return false;

      // rating filter
      if (c.rating < filters.minRating) return false;

      // ranking filter
      if (c.ranking > filters.maxRanking) return false;

      // program filter
      if (filters.programs.length) {
        const hasAll = filters.programs.every((p) => c.programs.includes(p));
        if (!hasAll) return false;
      }

      // state filter
      if (filters.states.length && !filters.states.includes(c.state)) return false;

      return true;
    }).sort((a, b) => {
      switch (sortKey) {
        case "ranking":       return a.ranking - b.ranking;
        case "tuition_asc":   return a.tuition - b.tuition;
        case "tuition_desc":  return b.tuition - a.tuition;
        case "rating":        return b.rating - a.rating;
        case "acceptanceRate": return b.acceptanceRate - a.acceptanceRate;
        case "name":          return a.name.localeCompare(b.name);
        default:              return 0;
      }
    });
  }, [filters, debouncedSearch, sortKey]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage    = Math.min(page, totalPages);
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((f) => ({ ...f, [key]: value }));
      setPage(1); // reset to page 1 on filter change
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  }, []);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.type.length)               n++;
    if (filters.maxTuition < 70000)        n++;
    if (filters.minRating > 0)             n++;
    if (filters.maxRanking < 500)          n++;
    if (filters.programs.length)           n++;
    if (filters.states.length)             n++;
    return n;
  }, [filters]);

  return {
    // data
    colleges: paginated,
    allFiltered: filtered,
    totalCount: filtered.length,
    isSearching,
    // pagination
    page: safePage,
    totalPages,
    setPage,
    pageSize: PAGE_SIZE,
    // filters
    filters,
    sortKey,
    viewMode,
    activeFilterCount,
    updateFilter,
    resetFilters,
    setSortKey: (k: SortKey) => { setSortKey(k); setPage(1); },
    setViewMode,
  };
}
