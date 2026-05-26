"use client";

import { useRouter } from "next/navigation";
import { SavedSection } from "@/components/saved/SavedSection";
import { useSavedItems } from "@/hooks/useSavedItems";

export default function SavedPage() {
  const router = useRouter();
  const {
    savedColleges,
    savedComparisons,
    savedCollegeCount,
    savedComparisonCount,
    getCollegeNames,
    loadComparison,
    unsaveComparison,
  } = useSavedItems();

  const handleLoadComparison = (ids: string[]) => {
    loadComparison(ids);
    router.push("/compare");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--navy)]">
            Your Saved Items
          </h1>
          <p className="mt-1 text-sm text-[var(--mist)]">
            {savedCollegeCount} saved college{savedCollegeCount === 1 ? "" : "s"} and{" "}
            {savedComparisonCount} saved comparison{savedComparisonCount === 1 ? "" : "s"}.
          </p>
        </div>
      </div>

      <SavedSection
        savedColleges={savedColleges}
        savedComparisons={savedComparisons}
        getCollegeNames={getCollegeNames}
        onUnsaveComparison={unsaveComparison}
        onLoadComparison={handleLoadComparison}
      />
    </div>
  );
}
