import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg bg-slate-100", className)}
      aria-hidden="true"
    />
  );
}

// Grid card skeleton
export function CollegeCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm" aria-hidden="true">
      <div className="h-1.5 w-full bg-slate-100" />
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3.5 w-16 rounded-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-8 rounded-xl ml-3 shrink-0" />
        </div>
        <Skeleton className="h-4 w-28 rounded-full" />
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-20 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-lg" />
          <Skeleton className="h-5 w-14 rounded-lg" />
        </div>
        <div className="flex gap-2 pt-1 border-t border-slate-50">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

// List card skeleton — mirrors CollegeListCard layout
export function CollegeListCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm" aria-hidden="true">
      <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="hidden sm:flex items-center gap-6">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-8 w-14 rounded-xl" />
      </div>
    </div>
  );
}
