"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ComparePicker } from "@/components/compare/ComparePicker";
import { CompareTable } from "@/components/compare/CompareTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MAX_COMPARE } from "@/lib/constants";
import { toComparableCollege } from "@/lib/compare-data";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { useCompareStore } from "@/store/useCompareStore";
import { useSavedStore } from "@/store/useSavedStore";
import { College } from "@/types/college";

function isCollege(college: College | undefined): college is College {
  return Boolean(college);
}

export default function ComparePage() {
  const { selectedIds, add, remove, clear } = useCompareStore();
  const { saveComparison } = useSavedStore();

  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const colleges = useMemo(
    () =>
      selectedIds
        .map((id) => MOCK_COLLEGES.find((college) => college.id === id))
        .filter(isCollege)
        .map(toComparableCollege),
    [selectedIds]
  );

  const canSave = colleges.length >= 2;

  const handleSave = () => {
    if (!saveName.trim() || !canSave) return;
    saveComparison(saveName.trim(), colleges.map((college) => college.id));
    setSaveModalOpen(false);
    setSaveName("");
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--navy)]">
              Compare Colleges
            </h1>
            <p className="mt-1 text-sm text-[var(--mist)]">
              Select 2-{MAX_COMPARE} colleges to compare fees, placements, ratings, and location.
            </p>
          </div>

          {colleges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={clear}>
                Clear all
              </Button>
              <Button
                size="sm"
                onClick={() => setSaveModalOpen(true)}
                disabled={!canSave}
                title={!canSave ? "Add at least 2 colleges to save" : undefined}
              >
                Save comparison
              </Button>
            </div>
          )}
        </div>

        <ComparePicker selectedIds={selectedIds} onAdd={add} />

        {colleges.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--cloud)] bg-white px-6 py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--sapphire-light)] text-lg font-bold text-[var(--sapphire-dark)]">
              C
            </div>
            <h2 className="text-lg font-semibold text-[var(--navy)]">
              Nothing to compare yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-[var(--mist)]">
              Add colleges from the picker above or use Compare on any college card in the listing.
            </p>
            <Link href="/colleges" className="mt-5">
              <Button variant="secondary">Browse Colleges</Button>
            </Link>
          </div>
        ) : (
          <>
            {colleges.length < 2 && (
              <div className="rounded-[var(--radius)] border border-[var(--amber-light)] bg-[var(--amber-light)]/50 px-4 py-3 text-sm text-[var(--amber)]">
                Add one more college to make this a side-by-side comparison.
              </div>
            )}

            <CompareTable colleges={colleges} onRemove={remove} />

            <p className="text-center text-xs text-[var(--mist)]">
              Best badges highlight the strongest value in rows where a clear comparison is possible.
            </p>
          </>
        )}
      </div>

      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save this comparison"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setSaveModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={!saveName.trim() || !canSave}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-[var(--slate)]">
            Give this comparison a name so you can find it later.
          </p>
          <Input
            label="Comparison name"
            placeholder="e.g. Top CS Schools"
            value={saveName}
            onChange={(event) => setSaveName(event.target.value)}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
}
