export const COLLEGE_TYPES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "community", label: "Community" },
] as const;

export const SORT_OPTIONS = [
  { value: "ranking", label: "Ranking" },
  { value: "tuition", label: "Tuition (Low to High)" },
  { value: "acceptanceRate", label: "Acceptance Rate" },
  { value: "name", label: "Name (A–Z)" },
] as const;

export const MAX_COMPARE = 3;
