"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CollegeCard } from "@/components/college/CollegeCard";
import { cn } from "@/lib/utils";
import { College, SavedComparison } from "@/types/college";

interface SavedSectionProps {
  savedColleges: College[];
  savedComparisons: SavedComparison[];
  getCollegeNames: (ids: string[]) => string[];
  onUnsaveComparison: (id: string) => void;
  onLoadComparison: (ids: string[]) => void;
}

type ActiveTab = "colleges" | "comparisons";

function BookmarkIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10M7 20h10M6 8l-3 6h6L6 8zm12 0-3 6h6l-3-6zM12 4v16" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7 18.13 19.14A2 2 0 0 1 16.14 21H7.86a2 2 0 0 1-1.99-1.86L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
    </svg>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm font-medium transition-colors sm:px-4",
        active
          ? "bg-white text-[var(--sapphire-dark)] shadow-[var(--shadow-sm)]"
          : "text-[var(--slate)] hover:bg-white/70 hover:text-[var(--ink)]"
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
      <span
        className={cn(
          "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 text-xs font-bold",
          active ? "bg-[var(--sapphire)] text-white" : "bg-white text-[var(--mist)]"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function EmptyState({
  title,
  message,
  href,
  action,
  icon,
}: {
  title: string;
  message: string;
  href: string;
  action: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--cloud)] bg-white px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sapphire-light)] text-[var(--sapphire-dark)]">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-[var(--navy)]">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-[var(--mist)]">{message}</p>
      <Link href={href} className="mt-5">
        <Button variant="secondary">{action}</Button>
      </Link>
    </div>
  );
}

function ComparisonCard({
  comparison,
  collegeNames,
  onLoad,
  onRemove,
}: {
  comparison: SavedComparison;
  collegeNames: string[];
  onLoad: () => void;
  onRemove: () => void;
}) {
  return (
    <Card accent className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-base font-semibold text-[var(--ink)]">{comparison.name}</h3>
          <Badge variant="blue">{comparison.collegeIds.length} colleges</Badge>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--slate)]">
          {collegeNames.length > 0 ? collegeNames.join(" vs ") : "Saved college set"}
        </p>
        <p className="mt-2 text-xs text-[var(--mist)]">
          Saved {new Date(comparison.savedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="flex shrink-0 gap-2 sm:justify-end">
        <Button variant="secondary" size="sm" onClick={onLoad}>
          Load
        </Button>
        <Button variant="ghost" size="sm" onClick={onRemove} title="Remove saved comparison">
          <span className="text-[var(--rose)]">
            <TrashIcon />
          </span>
        </Button>
      </div>
    </Card>
  );
}

export function SavedSection({
  savedColleges,
  savedComparisons,
  getCollegeNames,
  onUnsaveComparison,
  onLoadComparison,
}: SavedSectionProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("colleges");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full gap-1 overflow-x-auto rounded-[var(--radius-lg)] bg-[var(--cloud)] p-1 sm:w-fit">
        <TabButton
          active={activeTab === "colleges"}
          onClick={() => setActiveTab("colleges")}
          icon={<BookmarkIcon />}
          label="Saved Colleges"
          count={savedColleges.length}
        />
        <TabButton
          active={activeTab === "comparisons"}
          onClick={() => setActiveTab("comparisons")}
          icon={<CompareIcon />}
          label="Comparisons"
          count={savedComparisons.length}
        />
      </div>

      {activeTab === "colleges" &&
        (savedColleges.length === 0 ? (
          <EmptyState
            title="No saved colleges yet"
            message="Use the bookmark action on any college card or detail page to build your shortlist."
            href="/colleges"
            action="Browse Colleges"
            icon={<BookmarkIcon />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {savedColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        ))}

      {activeTab === "comparisons" &&
        (savedComparisons.length === 0 ? (
          <EmptyState
            title="No saved comparisons yet"
            message="Compare 2-3 colleges, then save that comparison so you can revisit it later."
            href="/compare"
            action="Start Comparing"
            icon={<CompareIcon />}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {savedComparisons.map((comparison) => (
              <ComparisonCard
                key={comparison.id}
                comparison={comparison}
                collegeNames={getCollegeNames(comparison.collegeIds)}
                onLoad={() => onLoadComparison(comparison.collegeIds)}
                onRemove={() => onUnsaveComparison(comparison.id)}
              />
            ))}
          </div>
        ))}
    </div>
  );
}
