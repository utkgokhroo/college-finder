"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface MockAccount extends User {
  password: string;
  createdAt: string;
}

interface AuthStore {
  user: User | null;
  accounts: MockAccount[];
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const DEMO_ACCOUNT: MockAccount = {
  id: "demo-user",
  name: "Demo Student",
  email: "student@example.com",
  password: "College123",
  createdAt: "2026-01-01T00:00:00.000Z",
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toUser(account: MockAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
  };
}

function getAccounts(accounts: MockAccount[]) {
  const merged = [DEMO_ACCOUNT, ...accounts];
  const unique = new Map<string, MockAccount>();

  merged.forEach((account) => {
    unique.set(normalizeEmail(account.email), {
      ...account,
      email: normalizeEmail(account.email),
    });
  });

  return Array.from(unique.values());
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accounts: [],
      isLoggedIn: false,
      login: async (email, password) => {
        const normalizedEmail = normalizeEmail(email);
        const account = getAccounts(get().accounts).find(
          (item) => item.email === normalizedEmail
        );

        if (!account || account.password !== password) {
          throw new Error("Invalid email or password.");
        }

        set({
          user: toUser(account),
          isLoggedIn: true,
        });
      },
      signup: async (name, email, password) => {
        const normalizedEmail = normalizeEmail(email);
        const accountExists = getAccounts(get().accounts).some(
          (item) => item.email === normalizedEmail
        );

        if (accountExists) {
          throw new Error("An account already exists for this email.");
        }

        const account: MockAccount = {
          id: `user-${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          password,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          accounts: [...state.accounts, account],
          user: toUser(account),
          isLoggedIn: true,
        }));
      },
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: "auth-storage",
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<AuthStore> | undefined;
        const user = persistedState?.user ?? null;
        const accounts = Array.isArray(persistedState?.accounts)
          ? persistedState.accounts
          : [];

        return {
          ...current,
          user,
          accounts,
          isLoggedIn: Boolean(user),
        };
      },
    }
  )
);
