export type CollegeType = "public" | "private" | "community";

export interface College {
  id:             string;
  name:           string;
  location:       string;
  city:           string;
  state:          string;
  type:           CollegeType;
  ranking:        number;       // national rank
  rating:         number;       // 1–5 stars (e.g. 4.3)
  tuition:        number;       // annual USD
  acceptanceRate: number;       // 0–1
  enrollment:     number;
  description:    string;
  programs:       string[];
  tags:           string[];     // e.g. ["Research", "STEM", "Urban"]
  founded:        number;
  satRange:       [number, number];
  color:          string;       // brand hex for card accent
}

export interface SavedComparison {
  id:         string;
  name:       string;
  collegeIds: string[];
  savedAt:    string;
}

export interface FilterState {
  search:     string;
  type:       CollegeType[];
  maxTuition: number;
  minRating:  number;
  maxRanking: number;
  programs:   string[];
  states:     string[];
}

export type SortKey = "ranking" | "tuition_asc" | "tuition_desc" | "rating" | "acceptanceRate" | "name";
export type ViewMode = "grid" | "list";

// ─── Detail-page types ────────────────────────────────────────────────────────

export interface Course {
  id:          string;
  name:        string;
  department:  string;
  duration:    string;   // e.g. "4 years"
  degree:      string;   // e.g. "B.S.", "M.S.", "Ph.D."
  tuition:     number;
  seats:       number;
  description: string;
  highlights:  string[];
}

export interface PlacementStat {
  year:            number;
  placementRate:   number;   // 0–1
  avgPackage:      number;   // USD
  highestPackage:  number;
  topRecruiters:   string[];
  sectors:         { name: string; percent: number; color: string }[];
}

export interface Review {
  id:         string;
  author:     string;
  avatar:     string;   // initials
  avatarColor: string;
  batch:      string;   // e.g. "Class of 2023"
  program:    string;
  rating:     number;
  date:       string;
  title:      string;
  body:       string;
  pros:       string[];
  cons:       string[];
  helpful:    number;
}

export interface CollegeDetail extends College {
  website:      string;
  email:        string;
  phone:        string;
  accreditation: string[];
  facilities:   string[];
  scholarships: { name: string; amount: number; criteria: string }[];
  courses:      Course[];
  placement:    PlacementStat;
  reviews:      Review[];
  overallRatings: {
    academics:    number;
    campus:       number;
    faculty:      number;
    placements:   number;
    value:        number;
  };
}
