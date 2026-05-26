"use client";
import { useRouter } from "next/navigation";
import { useCompareStore } from "@/store/useCompareStore";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";
import { MAX_COMPARE } from "@/lib/constants";

export function CompareBar() {
  const { selectedIds, remove, clear } = useCompareStore();
  const router = useRouter();

  if (selectedIds.length === 0) return null;

  const selected = selectedIds
    .map((id) => MOCK_COLLEGES.find((c) => c.id === id)!)
    .filter(Boolean);

  return (
    <div
      role="region"
      aria-label="Compare colleges bar"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-lg backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Label */}
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:block">
          Comparing
        </span>

        {/* Chips */}
        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-0.5">
          {selected.map((c) => (
            <div
              key={c.id}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              <span className="max-w-[100px] truncate sm:max-w-none">
                {c.name.split(" ").slice(-1)[0]}
              </span>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="shrink-0 rounded-full text-blue-400 transition-colors hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`Remove ${c.name} from comparison`}
              >
                ×
              </button>
            </div>
          ))}

          {/* Placeholder slots — use MAX_COMPARE not hardcoded 4 */}
          {Array.from({ length: MAX_COMPARE - selected.length }).map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              className="flex shrink-0 items-center justify-center rounded-full border border-dashed border-slate-200 px-4 py-1 text-xs text-slate-400"
            >
              + add
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
          <Button size="sm" onClick={() => router.push("/compare")}>
            Compare ({selectedIds.length})
          </Button>
        </div>
      </div>
    </div>
  );
}
