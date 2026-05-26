"use client";
import { useState } from "react";
import Link from "next/link";
import type { College } from "@/types/college";
import { useCompareStore } from "@/store/useCompareStore";
import { useSavedStore } from "@/store/useSavedStore";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { toComparableCollege } from "@/lib/compare-data";
import { CompareTable } from "@/components/compare/CompareTable";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { MAX_COMPARE } from "@/lib/constants";

export default function ComparePage() {
  const { selectedIds, add, remove, clear } = useCompareStore();
  const { saveComparison, isComparisonSaved, getSavedComparison, unsaveComparison } = useSavedStore();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const colleges = selectedIds
    .map((id) => MOCK_COLLEGES.find((c) => c.id === id))
    .filter((c): c is College => c !== undefined)
    .map(toComparableCollege);

  const alreadySaved = isComparisonSaved(selectedIds);
  const savedEntry   = getSavedComparison(selectedIds);

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveComparison(saveName.trim(), selectedIds);
    setSaveModalOpen(false);
    setSaveName("");
  };

  const handleUnsave = () => {
    if (savedEntry) unsaveComparison(savedEntry.id);
  };

  if (colleges.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-24 text-center px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
          ⚖️
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Nothing to compare yet</h2>
          <p className="max-w-sm text-sm text-slate-500">
            Go to the college listing and hit <strong>Compare</strong> on any card. You can add up to {MAX_COMPARE} colleges.
          </p>
        </div>
        <Link href="/colleges">
          <Button>Browse Colleges</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Compare Colleges</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Comparing {colleges.length} of {MAX_COMPARE} colleges
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={clear}>
              Clear all
            </Button>
            {alreadySaved ? (
              <Button variant="secondary" size="sm" onClick={handleUnsave}>
                ✓ Saved
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  setSaveName("");
                  setSaveModalOpen(true);
                }}
              >
                Save comparison
              </Button>
            )}
          </div>
        </div>

        {/* Add college picker (shown when below MAX) */}
        {colleges.length < MAX_COMPARE && (
          <ComparePicker selectedIds={selectedIds} onAdd={add} />
        )}

        <CompareTable colleges={colleges} onRemove={remove} />

        <p className="text-center text-xs text-slate-400">
          <span className="font-semibold text-emerald-600">Best</span> highlights the top-performing college for each metric.
        </p>
      </div>

      {/* Save modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save this comparison"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!saveName.trim()}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Give this comparison a name so you can find it later under Saved.
          </p>
          <Input
            label="Comparison name"
            placeholder="e.g. Top CS Schools"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}
