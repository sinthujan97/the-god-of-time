/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  // Prevent layout shifts / hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full bg-bg-surface border border-border opacity-50" />
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleTheme}
      className={`theme-toggle-pill relative w-12 h-6 rounded-full border cursor-pointer select-none transition-colors duration-300 ${
        isDark ? "bg-bg-surface border-border" : "bg-[#E8E5D8] border-border"
      }`}
    >
      <span
        className="theme-toggle-thumb absolute top-[2px] w-[18px] h-[18px] rounded-full bg-text-primary flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: isDark ? "translateX(3px)" : "translateX(27px)",
          color: "var(--bg-base)",
        }}
      >
        {isDark ? <Moon size={12} className="fill-current" /> : <Sun size={12} />}
      </span>
    </button>
  );
}
export { ThemeToggle };
