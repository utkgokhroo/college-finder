"use client";

import { useEffect, useRef, useState } from "react";
import { ActiveFilters } from "@/components/college/ActiveFilters";
import { CollegeGrid } from "@/components/college/CollegeGrid";
import { EmptyState } from "@/components/college/EmptyState";
import { Pagination } from "@/components/college/Pagination";
import { SortBar } from "@/components/college/SortBar";
import { FilterSidebar, FilterTriggerButton } from "@/components/search/FilterSidebar";
import { SearchBar } from "@/components/search/SearchBar";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { useColleges } from "@/hooks/useColleges";

export default function CollegesPage() {
  const {
    colleges,
    totalCount,
    isSearching,
    filters,
    sortKey,
    viewMode,
    activeFilterCount,
    updateFilter,
    resetFilters,
    setSortKey,
    setViewMode,
    page,
    totalPages,
    setPage,
    pageSize,
  } = useColleges();

  const [filterOpen, setFilterOpen] = useState(false);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    gridTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Find Your College
        </h1>
        <p className="text-sm text-slate-500">
          Browse {totalCount} colleges. Search, filter, and compare to find your perfect fit.
        </p>
      </div>

      <div className="flex gap-2 sm:gap-3">
        <SearchBar
          value={filters.search}
          onChange={(value) => updateFilter("search", value)}
          resultCount={totalCount}
          totalCount={MOCK_COLLEGES.length}
        />
        <FilterTriggerButton
          onClick={() => setFilterOpen(true)}
          activeCount={activeFilterCount}
        />
      </div>

      <ActiveFilters
        filters={filters}
        onUpdate={updateFilter}
        onReset={resetFilters}
      />

      <div className="flex items-start gap-6">
        <FilterSidebar
          filters={filters}
          onUpdate={updateFilter}
          onReset={resetFilters}
          activeCount={activeFilterCount}
          isMobileOpen={filterOpen}
          onMobileClose={() => setFilterOpen(false)}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5">
          <SortBar
            sortKey={sortKey}
            onSort={setSortKey}
            viewMode={viewMode}
            onViewMode={setViewMode}
            totalCount={totalCount}
            activeFilters={activeFilterCount}
          />

          <div ref={gridTopRef} className="-mt-2" />

          {isSearching ? (
            <CollegeGrid colleges={[]} viewMode={viewMode} isLoading />
          ) : colleges.length === 0 ? (
            <EmptyState query={filters.search} onReset={resetFilters} />
          ) : (
            <CollegeGrid colleges={colleges} viewMode={viewMode} />
          )}

          {!isSearching && (
            <Pagination
              page={page}
              totalPages={totalPages}
              totalCount={totalCount}
              pageSize={pageSize}
              onPage={setPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
