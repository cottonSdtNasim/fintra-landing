"use client";

import { useEffect } from "react";
import { useThemeStore } from "../../stores/useThemeStore";

export function StoreHydration() {
  const setMounted = useThemeStore((s) => s.setMounted);

  useEffect(() => {
    const theme = useThemeStore.getState().theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    setMounted(true);
  }, [setMounted]);

  return null;
}
