"use client";

import Link from "next/link";
import {
  ComparableCollege,
  CompareRow,
  COMPARE_ROWS,
  formatCompareValue,
  getBestCollegeId,
} from "@/lib/compare-data";
import { cn } from "@/lib/utils";
import { Badge, BadgeVariant } from "@/components/ui/Badge";

interface CompareTableProps {
  colleges: ComparableCollege[];
  onRemove: (id: string) => void;
}

function typeVariant(type: ComparableCollege["type"]): BadgeVariant {
  if (type === "public") return "green";
  if (type === "private") return "blue";
  return "amber";
}

function CompareValue({
  row,
  college,
  isBest,
}: {
  row: CompareRow;
  college: ComparableCollege;
  isBest: boolean;
}) {
  const rawValue = row.getValue(college);

  if (row.kind === "badge") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant={typeVariant(college.type)} className="capitalize">
          {rawValue}
        </Badge>
      </div>
    );
  }

  if (row.kind === "rating") {
    return (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[var(--ink)]">{formatCompareValue(row, rawValue)}</span>
        <span className="text-amber-500" aria-hidden="true">★</span>
        {isBest && <BestBadge />}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn(row.kind === "money" && "font-semibold text-[var(--ink)]")}>
        {formatCompareValue(row, rawValue)}
      </span>
      {isBest && <BestBadge />}
    </div>
  );
}

function BestBadge() {
  return (
    <span className="rounded-full bg-[var(--emerald-light)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--emerald)]">
      Best
    </span>
  );
}

function CompareTableRow({
  row,
  colleges,
}: {
  row: CompareRow;
  colleges: ComparableCollege[];
}) {
  const bestCollegeId = getBestCollegeId(colleges, row);

  return (
    <tr className="border-b border-[var(--cloud)] last:border-0">
      <th className="sticky left-0 z-10 w-36 bg-white px-4 py-4 text-left align-middle sm:w-44">
        <span className="block text-xs font-semibold uppercase tracking-wide text-[var(--slate)]">
          {row.label}
        </span>
        {row.helper && (
          <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-[var(--mist)]">
            {row.helper}
          </span>
        )}
      </th>
      {colleges.map((college) => {
        const isBest = bestCollegeId === college.id;

        return (
          <td
            key={college.id}
            className={cn(
              "min-w-44 px-4 py-4 text-sm text-[var(--slate)] align-middle sm:min-w-56",
              isBest && "bg-[var(--emerald-light)]/25"
            )}
          >
            <CompareValue row={row} college={college} isBest={isBest} />
          </td>
        );
      })}
    </tr>
  );
}

export function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--cloud)] bg-white shadow-[var(--shadow-sm)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse" aria-label="College comparison table">
          <thead>
            <tr className="border-b border-[var(--cloud)] bg-[var(--snow)]">
              <th className="sticky left-0 z-20 w-36 bg-[var(--snow)] px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[var(--mist)] sm:w-44">
                Compare
              </th>
              {colleges.map((college) => (
                <th key={college.id} className="min-w-44 px-4 py-4 text-left align-top sm:min-w-56">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="block text-sm font-bold leading-snug text-[var(--ink)] transition-colors hover:text-[var(--sapphire)]"
                      >
                        {college.name}
                      </Link>
                      <span className="mt-1 block text-xs font-normal text-[var(--mist)]">
                        {college.location}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(college.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--mist)] transition-colors hover:bg-[var(--rose-light)] hover:text-[var(--rose)]"
                      aria-label={`Remove ${college.name} from comparison`}
                      title="Remove"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <CompareTableRow key={row.label} row={row} colleges={colleges} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
