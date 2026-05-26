import { COLLEGE_DETAILS } from "@/lib/detail-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { College } from "@/types/college";

export interface ComparableCollege extends College {
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  placementYear: number;
}

export type CompareRowKind = "text" | "badge" | "money" | "percent" | "number" | "rating";

export interface CompareRow {
  label: string;
  helper?: string;
  kind: CompareRowKind;
  getValue: (college: ComparableCollege) => string | number;
  getNumeric?: (college: ComparableCollege) => number;
  highlight?: "low" | "high";
}

function getPlacementFallback(college: College) {
  const rankScore = Math.max(0, 1 - college.ranking / 60);
  const placementRate = Math.min(0.98, Math.max(0.78, 0.76 + college.rating * 0.035 + rankScore * 0.08));
  const averagePackage = Math.round((65000 + college.rating * 12000 + rankScore * 45000) / 1000) * 1000;
  const highestPackage = Math.round((averagePackage * (2.7 + rankScore)) / 1000) * 1000;

  return {
    placementRate,
    averagePackage,
    highestPackage,
    placementYear: 2024,
  };
}

export function toComparableCollege(college: College): ComparableCollege {
  const detail = COLLEGE_DETAILS[college.id];

  if (detail?.placement) {
    return {
      ...college,
      placementRate: detail.placement.placementRate,
      averagePackage: detail.placement.avgPackage,
      highestPackage: detail.placement.highestPackage,
      placementYear: detail.placement.year,
    };
  }

  return {
    ...college,
    ...getPlacementFallback(college),
  };
}

export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Location",
    kind: "text",
    getValue: (college) => college.location,
  },
  {
    label: "Annual fees",
    helper: "Lower is better",
    kind: "money",
    getValue: (college) => college.tuition,
    getNumeric: (college) => college.tuition,
    highlight: "low",
  },
  {
    label: "Placement rate",
    helper: "Latest available year",
    kind: "percent",
    getValue: (college) => college.placementRate,
    getNumeric: (college) => college.placementRate,
    highlight: "high",
  },
  {
    label: "Average package",
    helper: "Graduate outcome estimate",
    kind: "money",
    getValue: (college) => college.averagePackage,
    getNumeric: (college) => college.averagePackage,
    highlight: "high",
  },
  {
    label: "Highest package",
    kind: "money",
    getValue: (college) => college.highestPackage,
    getNumeric: (college) => college.highestPackage,
    highlight: "high",
  },
  {
    label: "Rating",
    helper: "Student score",
    kind: "rating",
    getValue: (college) => college.rating,
    getNumeric: (college) => college.rating,
    highlight: "high",
  },
  {
    label: "National rank",
    helper: "Lower is better",
    kind: "number",
    getValue: (college) => college.ranking,
    getNumeric: (college) => college.ranking,
    highlight: "low",
  },
  {
    label: "Acceptance rate",
    kind: "percent",
    getValue: (college) => college.acceptanceRate,
    getNumeric: (college) => college.acceptanceRate,
    highlight: "high",
  },
  {
    label: "Enrollment",
    kind: "number",
    getValue: (college) => college.enrollment,
    getNumeric: (college) => college.enrollment,
    highlight: "high",
  },
  {
    label: "Type",
    kind: "badge",
    getValue: (college) => college.type,
  },
];

export function getBestCollegeId(colleges: ComparableCollege[], row: CompareRow) {
  if (!row.highlight || !row.getNumeric || colleges.length < 2) return null;

  const values = colleges.map(row.getNumeric);
  const best = row.highlight === "low" ? Math.min(...values) : Math.max(...values);
  const hasTie = values.filter((value) => value === best).length > 1;

  if (hasTie) return null;
  return colleges[values.indexOf(best)]?.id ?? null;
}

export function formatCompareValue(row: CompareRow, value: string | number) {
  if (row.kind === "money" && typeof value === "number") return formatCurrency(value);
  if (row.kind === "percent" && typeof value === "number") return formatPercent(value);
  if (row.kind === "number" && typeof value === "number") return formatNumber(value);
  if (row.kind === "rating" && typeof value === "number") return value.toFixed(1);
  return String(value);
}
