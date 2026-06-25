/* eslint-disable react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";

export interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string | string[];
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
  themes?: string[];
  disableTransitionOnChange?: boolean;
}

export interface ThemeContextType {
  theme?: string;
  resolvedTheme?: string;
  setTheme: (theme: string) => void;
  themes: string[];
  systemTheme?: "light" | "dark";
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

const getSystemTheme = (e?: MediaQueryList | MediaQueryListEvent): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  const m = e || window.matchMedia("(prefers-color-scheme: dark)");
  return m.matches ? "dark" : "light";
};

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = false,
  storageKey = "theme",
  themes = ["light", "dark"],
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<string>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = React.useState<string>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const saved = localStorage.getItem(storageKey) || defaultTheme;
      if (saved === "system" && enableSystem) {
        return getSystemTheme();
      }
      return saved;
    } catch (e) {
      return defaultTheme;
    }
  });

  // Apply theme class/attribute helper
  const applyTheme = React.useCallback((targetTheme: string) => {
    let resolved = targetTheme;
    if (targetTheme === "system" && enableSystem) {
      resolved = getSystemTheme();
    }

    // Disable transition if requested
    let cleanupTransition: (() => void) | null = null;
    if (disableTransitionOnChange && typeof window !== "undefined") {
      const css = document.createElement("style");
      css.appendChild(
        document.createTextNode(
          "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}"
        )
      );
      document.head.appendChild(css);
      cleanupTransition = () => {
        // Force repaint
        window.getComputedStyle(document.body);
        setTimeout(() => {
          document.head.removeChild(css);
        }, 1);
      };
    }

    const el = document.documentElement;
    const attrs = Array.isArray(attribute) ? attribute : [attribute];

    attrs.forEach((attr) => {
      if (attr === "class") {
        themes.forEach((t) => {
          el.classList.remove(t);
        });
        el.classList.add(resolved);
      } else {
        el.setAttribute(attr, resolved);
      }
    });

    if (resolved === "dark" || resolved === "light") {
      el.style.colorScheme = resolved;
    }

    if (cleanupTransition) {
      cleanupTransition();
    }

    setResolvedTheme(resolved);
  }, [attribute, themes, disableTransitionOnChange, enableSystem]);

  // Listen for system theme changes if system is enabled
  React.useEffect(() => {
    if (!enableSystem) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme, enableSystem, applyTheme]);

  // Listen for localStorage changes from other tabs
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) return;
      const val = e.newValue || defaultTheme;
      setThemeState(val);
      applyTheme(val);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [storageKey, defaultTheme, applyTheme]);

  // Set theme function
  const setTheme = React.useCallback((newTheme: string) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {}
    applyTheme(newTheme);
  }, [storageKey, applyTheme]);

  // Sync on mount
  React.useEffect(() => {
    const current = localStorage.getItem(storageKey) || defaultTheme;
    setThemeState(current);
    applyTheme(current);
  }, [storageKey, defaultTheme, applyTheme]);

  // Server-inserted HTML script to prevent FOUC.
  // Only runs during server-side render.
  useServerInsertedHTML(() => {
    const scriptContent = `(function() {
      try {
        var key = ${JSON.stringify(storageKey)};
        var defaultTheme = ${JSON.stringify(defaultTheme)};
        var enableSystem = ${JSON.stringify(enableSystem)};
        var themes = ${JSON.stringify(themes)};
        var attribute = ${JSON.stringify(attribute)};
        
        var theme = localStorage.getItem(key) || defaultTheme;
        var resolved = theme;
        
        if (theme === 'system' && enableSystem) {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        
        var el = document.documentElement;
        var attrs = Array.isArray(attribute) ? attribute : [attribute];
        
        attrs.forEach(function(attr) {
          if (attr === 'class') {
            themes.forEach(function(t) {
              el.classList.remove(t);
            });
            el.classList.add(resolved);
          } else {
            el.setAttribute(attr, resolved);
          }
        });
        
        if (resolved === 'dark' || resolved === 'light') {
          el.style.colorScheme = resolved;
        }
      } catch (e) {}
    })()`;

    return (
      <script
        id="theme-initializer-script"
        dangerouslySetInnerHTML={{ __html: scriptContent }}
      />
    );
  });

  const contextValue = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      themes: enableSystem ? [...themes, "system"] : themes,
      systemTheme: typeof window !== "undefined" ? getSystemTheme() : undefined,
    }),
    [theme, resolvedTheme, setTheme, themes, enableSystem]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
