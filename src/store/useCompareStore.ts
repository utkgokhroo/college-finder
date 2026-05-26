"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MAX_COMPARE } from "@/lib/constants";

interface CompareStore {
  selectedIds: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      selectedIds: [],
      add: (id) => {
        const selectedIds = get().selectedIds.slice(0, MAX_COMPARE);
        if (!selectedIds.includes(id) && selectedIds.length < MAX_COMPARE) {
          set({ selectedIds: [...selectedIds, id] });
        }
      },
      remove: (id) =>
        set((s) => ({
          selectedIds: s.selectedIds.filter((c) => c !== id),
        })),
      clear: () => set({ selectedIds: [] }),
      isSelected: (id) => get().selectedIds.includes(id),
      isFull: () => get().selectedIds.length >= MAX_COMPARE,
    }),
    {
      name: "compare-storage",
      merge: (persisted, current) => {
        const persistedIds =
          persisted &&
          typeof persisted === "object" &&
          "selectedIds" in persisted &&
          Array.isArray(persisted.selectedIds)
            ? persisted.selectedIds.filter((id): id is string => typeof id === "string")
            : [];

        return {
          ...current,
          selectedIds: Array.from(new Set(persistedIds)).slice(0, MAX_COMPARE),
        };
      },
    }
  )
);
