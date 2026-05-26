"use client";
import { College, ViewMode } from "@/types/college";
import { CollegeCard, CollegeListCard } from "./CollegeCard";
import { CollegeCardSkeleton, CollegeListCardSkeleton } from "@/components/ui/Skeleton";

interface CollegeGridProps {
  colleges:   College[];
  viewMode:   ViewMode;
  isLoading?: boolean;
}

export function CollegeGrid({ colleges, viewMode, isLoading }: CollegeGridProps) {
  if (isLoading) {
    if (viewMode === "list") {
      return (
        <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading colleges">
          {Array.from({ length: 6 }).map((_, i) => (
            <CollegeListCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading colleges">
        {Array.from({ length: 6 }).map((_, i) => (
          <CollegeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {colleges.map((college) => (
          <CollegeListCard key={college.id} college={college} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {colleges.map((college) => (
        <CollegeCard key={college.id} college={college} />
      ))}
    </div>
  );
}
