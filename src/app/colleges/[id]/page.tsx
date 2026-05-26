import { notFound } from "next/navigation";
import Link from "next/link";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { getCollegeDetail } from "@/lib/detail-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";

import { DetailHero }         from "@/components/detail/DetailHero";
import { SectionNav }         from "@/components/detail/SectionNav";
import { SectionWrapper }     from "@/components/detail/SectionWrapper";
import { OverviewSection }    from "@/components/detail/OverviewSection";
import { CoursesSection }     from "@/components/detail/CoursesSection";
import { PlacementsSection }  from "@/components/detail/PlacementsSection";
import { ReviewsSection }     from "@/components/detail/ReviewsSection";

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }   = await params;
  const detail   = getCollegeDetail(id);
  const fallback = MOCK_COLLEGES.find((c) => c.id === id);

  if (!detail && !fallback) notFound();

  // If we have full detail data, use it
  if (detail) {
    return (
      <div className="mx-auto max-w-6xl space-y-0">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-slate-400">
          <Link href="/colleges" className="hover:text-slate-600 transition-colors">Colleges</Link>
          <span>/</span>
          <span className="text-slate-600 truncate">{detail.name}</span>
        </nav>

        {/* Hero */}
        <DetailHero college={detail} />

        {/* Sticky section nav */}
        <SectionNav />

        {/* Sections */}
        <div className="space-y-16 pt-10">
          <SectionWrapper
            id="overview"
            title="Overview"
            subtitle="About the university, facilities, and financial aid"
          >
            <OverviewSection college={detail} />
          </SectionWrapper>

          <SectionWrapper
            id="courses"
            title="Courses & Programs"
            subtitle={`${detail.courses.length} programs offered across multiple departments`}
          >
            <CoursesSection courses={detail.courses} />
          </SectionWrapper>

          <SectionWrapper
            id="placements"
            title="Placements & Careers"
            subtitle={`Class of ${detail.placement.year} outcomes`}
          >
            <PlacementsSection placement={detail.placement} />
          </SectionWrapper>

          <SectionWrapper
            id="reviews"
            title="Student Reviews"
            subtitle="Honest perspectives from alumni and current students"
          >
            <ReviewsSection
              reviews={detail.reviews}
              overallRatings={detail.overallRatings}
              avgRating={detail.rating}
            />
          </SectionWrapper>
        </div>
      </div>
    );
  }

  // Fallback for colleges without full detail data
  const c = fallback!;
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <nav className="flex items-center gap-2 text-sm text-slate-400">
        <Link href="/colleges" className="hover:text-slate-600">Colleges</Link>
        <span>/</span>
        <span className="text-slate-600">{c.name}</span>
      </nav>

      {/* Simple hero */}
      <div
        className="rounded-3xl p-8 text-white"
        style={{ background: `linear-gradient(135deg, ${c.color}, #0f172a)` }}
      >
        <h1 className="text-3xl font-bold">{c.name}</h1>
        <p className="mt-1 text-white/70">{c.location} · Est. {c.founded}</p>
        <p className="mt-4 text-white/80 leading-relaxed">{c.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { l: "Tuition",    v: formatCurrency(c.tuition)          },
            { l: "Acceptance", v: formatPercent(c.acceptanceRate)     },
            { l: "Enrollment", v: formatNumber(c.enrollment)          },
            { l: "Ranking",    v: `#${c.ranking}`                    },
          ].map(({ l, v }) => (
            <div key={l} className="rounded-2xl bg-white/15 px-4 py-3 text-center backdrop-blur-sm ring-1 ring-white/20">
              <p className="text-lg font-bold">{v}</p>
              <p className="text-xs text-white/60">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Programs */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Programs</h2>
        <div className="flex flex-wrap gap-2">
          {c.programs.map((p) => (
            <span key={p} className="rounded-xl bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
              {p}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
        <p className="text-slate-500">Detailed profile coming soon.</p>
        <Link href="/colleges" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline">
          ← Browse all colleges
        </Link>
      </div>
    </div>
  );
}
