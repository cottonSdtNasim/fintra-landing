"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export const useThemeStore = create()(
  persist(
    (set, get) => ({
      theme: "dark",
      mounted: false,
      setMounted: (mounted) => set({ mounted }),
      toggleTheme: () => {
        const newTheme = get().theme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        set({ theme: newTheme });
      },
    }),
    {
      name: "theme",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
          state.setMounted(true);
        }
      },
    },
  ),
);
