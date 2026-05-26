"use client";
import { useState } from "react";
import { Review } from "@/types/college";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews:        Review[];
  overallRatings: Record<string, number>;
  avgRating:      number;
}

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sz = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className={sz} viewBox="0 0 20 20">
          <path
            fill={rating >= s ? "#F59E0B" : "#E5E7EB"}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted,   setVoted]   = useState(false);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Reviewer header */}
      <div className="mb-4 flex items-start gap-3">
        {/* Avatar */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: review.avatarColor }}
        >
          {review.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">{review.author}</p>
              <p className="text-xs text-slate-400">{review.program} · {review.batch}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1">
              <Stars rating={review.rating} />
              <span className="text-xs text-slate-400">{review.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Title + body */}
      <h4 className="mb-2 text-sm font-bold text-slate-900">{review.title}</h4>
      <p className="mb-4 text-sm leading-relaxed text-slate-600">{review.body}</p>

      {/* Pros / Cons */}
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-emerald-50 p-3">
          <p className="mb-1.5 text-xs font-semibold text-emerald-700">Pros</p>
          <ul className="space-y-1">
            {review.pros.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-xs text-emerald-800">
                <span className="mt-0.5 shrink-0 text-emerald-500">+</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-rose-50 p-3">
          <p className="mb-1.5 text-xs font-semibold text-rose-700">Cons</p>
          <ul className="space-y-1">
            {review.cons.map((c) => (
              <li key={c} className="flex items-start gap-1.5 text-xs text-rose-800">
                <span className="mt-0.5 shrink-0 text-rose-400">−</span>{c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Helpful */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-3">
        <span className="text-xs text-slate-400">{helpful} people found this helpful</span>
        <button
          type="button"
          onClick={() => { if (!voted) { setHelpful(h => h + 1); setVoted(true); } }}
          aria-label={voted ? "Already marked as helpful" : "Mark review as helpful"}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-all",
            voted
              ? "bg-blue-50 text-blue-600"
              : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          )}
          disabled={voted}
        >
          <svg className="h-3.5 w-3.5" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
          </svg>
          {voted ? "Helpful!" : "Helpful"}
        </button>
      </div>
    </div>
  );
}

export function ReviewsSection({ reviews, avgRating }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"helpful" | "recent" | "rating">("helpful");

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === "helpful") return b.helpful - a.helpful;
    if (sortBy === "rating")  return b.rating - a.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Rating distribution
  const dist = [5,4,3,2,1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
  }));
  const maxCount = Math.max(...dist.map((d) => d.count), 1);

  return (
    <div className="space-y-8">
      {/* Summary + distribution */}
      <div className="flex flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        {/* Big score */}
        <div className="flex shrink-0 flex-col items-center gap-2 sm:pr-6 sm:border-r sm:border-slate-100">
          <span className="text-6xl font-bold text-slate-900">{avgRating.toFixed(1)}</span>
          <Stars rating={avgRating} size="lg" />
          <span className="text-sm text-slate-400">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Bar distribution */}
        <div className="flex-1 space-y-2">
          {dist.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="w-3 shrink-0 text-xs font-semibold text-slate-500">{star}</span>
              <svg className="h-3 w-3 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-4 text-right text-xs text-slate-400">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{reviews.length}</span> student reviews
        </p>
        <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
          {(["helpful", "recent", "rating"] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setSortBy(opt)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all",
                sortBy === opt
                  ? "bg-slate-900 text-white"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {sorted.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Write review CTA */}
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="text-sm font-semibold text-slate-800">Attended this college?</p>
        <p className="mt-1 text-xs text-slate-500">Share your experience to help future students decide.</p>
        <button type="button" className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition-colors">
          Write a Review
        </button>
      </div>
    </div>
  );
}
