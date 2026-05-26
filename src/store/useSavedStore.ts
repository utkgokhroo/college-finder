"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SavedComparison } from "@/types/college";

interface SavedStore {
  savedCollegeIds: string[];
  savedComparisons: SavedComparison[];
  saveCollege: (id: string) => void;
  unsaveCollege: (id: string) => void;
  toggleCollege: (id: string) => void;
  isSaved: (id: string) => boolean;
  saveComparison: (name: string, collegeIds: string[]) => string;
  unsaveComparison: (id: string) => void;
  deleteComparison: (id: string) => void;
  getSavedComparison: (collegeIds: string[]) => SavedComparison | undefined;
  isComparisonSaved: (collegeIds: string[]) => boolean;
}

function uniqueIds(ids: string[]) {
  return Array.from(new Set(ids.filter(Boolean)));
}

function comparisonKey(ids: string[]) {
  return uniqueIds(ids).sort().join("|");
}

function isSavedComparison(value: unknown): value is SavedComparison {
  if (!value || typeof value !== "object") return false;
  const item = value as SavedComparison;

  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    Array.isArray(item.collegeIds) &&
    item.collegeIds.every((id) => typeof id === "string") &&
    typeof item.savedAt === "string"
  );
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set, get) => ({
      savedCollegeIds: [],
      savedComparisons: [],
      saveCollege: (id) =>
        set((state) => ({
          savedCollegeIds: state.savedCollegeIds.includes(id)
            ? state.savedCollegeIds
            : [...state.savedCollegeIds, id],
        })),
      unsaveCollege: (id) =>
        set((state) => ({
          savedCollegeIds: state.savedCollegeIds.filter((collegeId) => collegeId !== id),
        })),
      toggleCollege: (id) => {
        const { isSaved, saveCollege, unsaveCollege } = get();
        if (isSaved(id)) {
          unsaveCollege(id);
        } else {
          saveCollege(id);
        }
      },
      isSaved: (id) => get().savedCollegeIds.includes(id),
      saveComparison: (name, collegeIds) => {
        const ids = uniqueIds(collegeIds);
        const key = comparisonKey(ids);
        const existing = get().savedComparisons.find(
          (comparison) => comparisonKey(comparison.collegeIds) === key
        );
        const id = existing?.id ?? `comparison-${Date.now()}`;
        const savedAt = new Date().toISOString();

        set((state) => ({
          savedComparisons: existing
            ? state.savedComparisons.map((comparison) =>
                comparison.id === existing.id
                  ? { ...comparison, name, collegeIds: ids, savedAt }
                  : comparison
              )
            : [
                ...state.savedComparisons,
                {
                  id,
                  name,
                  collegeIds: ids,
                  savedAt,
                },
              ],
        }));

        return id;
      },
      unsaveComparison: (id) =>
        set((state) => ({
          savedComparisons: state.savedComparisons.filter((comparison) => comparison.id !== id),
        })),
      deleteComparison: (id) => get().unsaveComparison(id),
      getSavedComparison: (collegeIds) => {
        const key = comparisonKey(collegeIds);
        return get().savedComparisons.find(
          (comparison) => comparisonKey(comparison.collegeIds) === key
        );
      },
      isComparisonSaved: (collegeIds) => Boolean(get().getSavedComparison(collegeIds)),
    }),
    {
      name: "saved-storage",
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<SavedStore> | undefined;
        const savedCollegeIds = Array.isArray(persistedState?.savedCollegeIds)
          ? uniqueIds(persistedState.savedCollegeIds.filter((id): id is string => typeof id === "string"))
          : [];
        const savedComparisons = Array.isArray(persistedState?.savedComparisons)
          ? persistedState.savedComparisons.filter(isSavedComparison).map((comparison) => ({
              ...comparison,
              collegeIds: uniqueIds(comparison.collegeIds),
            }))
          : [];

        return {
          ...current,
          savedCollegeIds,
          savedComparisons,
        };
      },
    }
  )
);
