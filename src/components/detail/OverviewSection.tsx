import { CollegeDetail } from "@/types/college";
import { formatCurrency } from "@/lib/utils";

interface OverviewSectionProps {
  college: CollegeDetail;
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-sm text-slate-600">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-semibold text-slate-800">{value.toFixed(1)}</span>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        {icon}
      </span>
      <span className="flex-1 text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export function OverviewSection({ college }: OverviewSectionProps) {
  const icons = {
    phone: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
      </svg>
    ),
    email: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
    ),
    calendar: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
    ),
    users: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
    ),
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Left: about + facilities */}
      <div className="lg:col-span-2 space-y-8">
        {/* About */}
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900">About</h2>
          <p className="text-slate-600 leading-relaxed">{college.description}</p>
        </div>

        {/* Accreditation */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Accreditation</h3>
          <div className="flex flex-wrap gap-2">
            {college.accreditation.map((a) => (
              <span key={a} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                {a}
              </span>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Campus Facilities</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {college.facilities.map((f) => (
              <div key={f} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm text-slate-700">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scholarships */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Scholarships & Aid</h3>
          <div className="space-y-3">
            {college.scholarships.map((s) => (
              <div key={s.name} className="flex items-start gap-4 rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-800">{s.name}</p>
                    <span className="shrink-0 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                      {s.amount >= college.tuition ? "Full Tuition" : formatCurrency(s.amount)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">{s.criteria}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: quick info + ratings */}
      <div className="space-y-6">
        {/* Quick info card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Quick Info</h3>
          <InfoRow icon={icons.phone} label="Phone" value={college.phone} />
          <InfoRow icon={icons.email} label="Email" value={college.email} />
          <InfoRow icon={icons.calendar} label="Founded" value={college.founded.toString()} />
          <InfoRow icon={icons.users} label="Total Students" value={college.enrollment.toLocaleString()} />
        </div>

        {/* Ratings breakdown */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Ratings</h3>
            <span className="text-2xl font-bold text-slate-900">{college.rating.toFixed(1)}</span>
          </div>
          <div className="space-y-3">
            <RatingBar label="Academics"  value={college.overallRatings.academics}  />
            <RatingBar label="Campus"     value={college.overallRatings.campus}     />
            <RatingBar label="Faculty"    value={college.overallRatings.faculty}    />
            <RatingBar label="Placements" value={college.overallRatings.placements} />
            <RatingBar label="Value"      value={college.overallRatings.value}      />
          </div>
        </div>
      </div>
    </div>
  );
}
