"use client";
import { useState } from "react";
import { Course } from "@/types/college";
import { formatCurrency, cn } from "@/lib/utils";

interface CoursesSectionProps {
  courses: Course[];
}

const DEGREE_COLORS: Record<string, string> = {
  "B.S.":    "bg-blue-50   text-blue-700   ring-blue-200",
  "B.A.":    "bg-sky-50    text-sky-700    ring-sky-200",
  "M.S.":    "bg-violet-50 text-violet-700 ring-violet-200",
  "M.B.A.":  "bg-amber-50  text-amber-700  ring-amber-200",
  "M.Arch.": "bg-orange-50 text-orange-700 ring-orange-200",
  "Ph.D.":   "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "J.D.":    "bg-rose-50   text-rose-700   ring-rose-200",
};

const DEPT_ALL = "All";

function CourseCard({ course, expanded, onToggle }: { course: Course; expanded: boolean; onToggle: () => void }) {
  const degreeStyle = DEGREE_COLORS[course.degree] ?? "bg-slate-50 text-slate-700 ring-slate-200";

  return (
    <div className={cn(
      "rounded-2xl border bg-white transition-all duration-200",
      expanded ? "border-blue-200 shadow-md shadow-blue-50" : "border-slate-100 hover:border-slate-200 hover:shadow-sm"
    )}>
      {/* Card header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={`course-body-${course.id}`}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        {/* Degree badge */}
        <div className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold ring-1",
          degreeStyle
        )}>
          {course.degree}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-bold text-slate-900">{course.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{course.department} · {course.duration}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="text-sm font-bold text-blue-700">
                {course.tuition === 0 ? "Fully Funded" : formatCurrency(course.tuition) + "/yr"}
              </span>
              <span className="text-xs text-slate-400">{course.seats} seats</span>
            </div>
          </div>
        </div>

        {/* Chevron */}
        <svg
          className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform mt-1", expanded && "rotate-180")}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div id={`course-body-${course.id}`} className="border-t border-blue-50 px-5 pb-5 pt-4">
          <p className="mb-4 text-sm leading-relaxed text-slate-600">{course.description}</p>
          <div>
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Program Highlights</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {course.highlights.map((h) => (
                <div key={h} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
                  <svg className="h-3.5 w-3.5 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-xs text-slate-700">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function CoursesSection({ courses }: CoursesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(courses[0]?.id ?? null);
  const [activeDept, setActiveDept] = useState(DEPT_ALL);

  // Unique departments
  const departments = [DEPT_ALL, ...Array.from(new Set(courses.map((c) => c.department)))];

  const filtered = activeDept === DEPT_ALL
    ? courses
    : courses.filter((c) => c.department === activeDept);

  return (
    <div className="space-y-6">
      {/* Header + stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{courses.length} programs</span> available
          </p>
        </div>
        {/* Degree legend */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(DEGREE_COLORS).map(([deg, style]) => {
            if (!courses.some((c) => c.degree === deg)) return null;
            return (
              <span key={deg} className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1", style)}>
                {deg}
              </span>
            );
          })}
        </div>
      </div>

      {/* Department filter */}
      {departments.length > 2 && (
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
          onClick={() => setActiveDept(dept)}
              className={cn(
                "rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-all",
                activeDept === dept
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {/* Course list */}
      <div className="space-y-3">
        {filtered.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            expanded={expandedId === course.id}
            onToggle={() => setExpandedId(expandedId === course.id ? null : course.id)}
          />
        ))}
      </div>
    </div>
  );
}
