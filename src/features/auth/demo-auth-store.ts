"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DemoUser = {
  initials: string;
  name: string;
  email: string;
};

type DemoAuthStore = {
  user: DemoUser | null;
  signInDemo: () => void;
  signOut: () => void;
  reset: () => void;
};

const demoUser: DemoUser = {
  initials: "DC",
  name: "Demo Customer",
  email: "demo@roadassistnow.app",
};

const memoryStorage = (() => {
  const values = new Map<string, string>();
  return {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => {
      values.set(name, value);
    },
    removeItem: (name: string) => {
      values.delete(name);
    },
  };
})();

function safeStorage() {
  if (typeof window === "undefined") return memoryStorage;
  if (!window.localStorage || typeof window.localStorage.setItem !== "function") return memoryStorage;
  return window.localStorage;
}

export const useDemoAuthStore = create<DemoAuthStore>()(
  persist(
    (set) => ({
      user: null,
      signInDemo: () => set({ user: demoUser }),
      signOut: () => set({ user: null }),
      reset: () => set({ user: null }),
    }),
    {
      name: "roadassistnow-demo-auth-v1",
      storage: createJSONStorage(safeStorage),
    },
  ),
);
