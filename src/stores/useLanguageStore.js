"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en } from "../data/en";
import { bn } from "../data/bn";

const translations = { en, bn };

export const useLanguageStore = create()(
  persist(
    (set, get) => ({
      lang: "en",
      t: en,
      toggleLanguage: () => {
        const newLang = get().lang === "en" ? "bn" : "en";
        set({ lang: newLang, t: translations[newLang] });
      },
    }),
    {
      name: "language",
      onRehydrateStorage: () => (state) => {
        if (state) {
          useLanguageStore.setState({ t: translations[state.lang] });
        }
      },
    },
  ),
);
