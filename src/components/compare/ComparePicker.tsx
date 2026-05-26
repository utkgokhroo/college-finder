"use client";

import { useMemo, useState } from "react";
import { MAX_COMPARE } from "@/lib/constants";
import { MOCK_COLLEGES } from "@/lib/mock-data";
import { Button } from "@/components/ui/Button";

interface ComparePickerProps {
  selectedIds: string[];
  onAdd: (id: string) => void;
}

export function ComparePicker({ selectedIds, onAdd }: ComparePickerProps) {
  const [collegeId, setCollegeId] = useState("");
  const isFull = selectedIds.length >= MAX_COMPARE;

  const options = useMemo(
    () => MOCK_COLLEGES.filter((college) => !selectedIds.includes(college.id)),
    [selectedIds]
  );

  const handleAdd = () => {
    if (!collegeId || isFull) return;
    onAdd(collegeId);
    setCollegeId("");
  };

  return (
    <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--cloud)] bg-white p-4 shadow-[var(--shadow-sm)] sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="compare-college-picker" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[var(--mist)]">
          Add college
        </label>
        <select
          id="compare-college-picker"
          value={collegeId}
          onChange={(event) => setCollegeId(event.target.value)}
          disabled={isFull || options.length === 0}
          className="h-10 w-full rounded-[var(--radius)] border border-[var(--cloud)] bg-white px-3 text-sm text-[var(--ink)] outline-none transition-colors focus:border-[var(--sapphire)] focus:ring-2 focus:ring-[var(--sapphire-light)] disabled:cursor-not-allowed disabled:bg-[var(--snow)] disabled:text-[var(--mist)]"
        >
          <option value="">
            {isFull ? `You can compare up to ${MAX_COMPARE} colleges` : "Choose a college"}
          </option>
          {options.map((college) => (
            <option key={college.id} value={college.id}>
              {college.name} - {college.location}
            </option>
          ))}
        </select>
      </div>
      <Button onClick={handleAdd} disabled={!collegeId || isFull} className="sm:w-auto">
        Add to compare
      </Button>
    </div>
  );
}
