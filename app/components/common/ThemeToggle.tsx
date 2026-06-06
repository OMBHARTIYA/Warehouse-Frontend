"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "warehouse-theme";
const THEME_EVENT = "warehouse-theme-change";

function getInitialTheme(): Theme {
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

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const syncStoredTheme = () => {
      const storedTheme = getInitialTheme();
      setTheme(storedTheme);
      applyTheme(storedTheme);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncStoredTheme();
    };

    const handleThemeChange = () => syncStoredTheme();

    window.addEventListener("focus", syncStoredTheme);
    window.addEventListener(THEME_EVENT, handleThemeChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", syncStoredTheme);
      window.removeEventListener(THEME_EVENT, handleThemeChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const nextTheme = theme === "dark" ? "light" : "dark";
  const isDark = theme === "dark";

  const handleToggle = () => {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/80 px-3 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-[var(--brand-red-soft)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800/80"
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      <span className="inline-flex min-w-0 items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red-strong)] dark:bg-rose-950/70 dark:text-rose-200">
          {isDark ? <Moon size={14} aria-hidden="true" /> : <Sun size={14} aria-hidden="true" />}
        </span>
        <span className="truncate">{isDark ? "Dark" : "Light"}</span>
      </span>

      <span
        aria-hidden="true"
        className={`relative h-5 w-10 shrink-0 rounded-full border transition-colors ${
          isDark ? "border-rose-700/70 bg-rose-950/80" : "border-zinc-200 bg-zinc-100"
        }`}
      >
        <span
          className={`absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform dark:bg-rose-200 ${
            isDark ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
