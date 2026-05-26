"use client";

import { useMemo } from "react";
import { MAX_COMPARE } from "@/lib/constants";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { useCompareStore } from "@/store/useCompareStore";
import { useSavedStore } from "@/store/useSavedStore";
import { College } from "@/types/college";

export function useSavedItems() {
  const {
    savedCollegeIds,
    savedComparisons,
    unsaveCollege,
    unsaveComparison,
  } = useSavedStore();
  const { add, clear } = useCompareStore();

  const savedColleges = useMemo(
    () =>
      savedCollegeIds
        .map((id) => MOCK_COLLEGES.find((college) => college.id === id))
        .filter((college): college is College => Boolean(college)),
    [savedCollegeIds]
  );

  const getCollegeNames = (ids: string[]) =>
    ids
      .map((id) => MOCK_COLLEGES.find((college) => college.id === id)?.name)
      .filter((name): name is string => Boolean(name));

  const loadComparison = (ids: string[]) => {
    clear();
    ids.slice(0, MAX_COMPARE).forEach(add);
  };

  return {
    savedCollegeIds,
    savedColleges,
    savedComparisons,
    savedCollegeCount: savedColleges.length,
    savedComparisonCount: savedComparisons.length,
    getCollegeNames,
    loadComparison,
    unsaveCollege,
    unsaveComparison,
  };
}
