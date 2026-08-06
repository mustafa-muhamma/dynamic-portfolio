"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "portfolio-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

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
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") setThemeState(stored);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback(
    () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
    []
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      <div
        className={cn(
          "min-h-dvh bg-background text-foreground transition-colors duration-300",
          theme === "dark" && "dark",
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
