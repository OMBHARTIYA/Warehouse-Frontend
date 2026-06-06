"use client";

import { useEffect, type ReactNode } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "warehouse-theme";
const THEME_EVENT = "warehouse-theme-change";

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (storedTheme === "dark" || storedTheme === "light") return storedTheme;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const syncTheme = () => applyTheme(getStoredTheme());

    syncTheme();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) syncTheme();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncTheme();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", syncTheme);
    window.addEventListener(THEME_EVENT, syncTheme);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", syncTheme);
      window.removeEventListener(THEME_EVENT, syncTheme);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
}
