"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode
} from "react";

import { cn } from "@/lib/utils";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "portfolio-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

let currentTheme: Theme = typeof window === "undefined" ? "dark" : readStoredTheme();

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(next: Theme) {
  currentTheme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // storage unavailable — keep theme for this session only
  }
  listeners.forEach((listener) => listener());
}

/**
 * Scopes the theme to the public portfolio only. The `dark`/`light` class is
 * applied to a wrapper div, never to <html>, so the admin dashboard and login
 * routes (which do not mount this provider) keep the default light theme.
 * Dark is the default; user preference persists in localStorage.
 */
export function ThemeProvider({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => applyTheme(next), []);
  const toggleTheme = useCallback(() => applyTheme(currentTheme === "dark" ? "light" : "dark"), []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className={cn(
          "min-h-dvh bg-background text-foreground transition-colors duration-300",
          theme === "dark" && "dark",
          theme === "light" && "public-light",
          className
        )}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
