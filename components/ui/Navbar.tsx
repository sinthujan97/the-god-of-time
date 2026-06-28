"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { gamesRegistry } from "@/lib/data/gamesRegistry";
import ThemeToggle from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useTheme } from "@/components/ui/ThemeProvider";

const EMOJI_MAP: Record<string, string> = {
  // Utility Tools
  "days-between-dates": "📅",
  "add-days-to-date": "➕",
  "subtract-days-from-date": "➖",
  "time-duration-calculator": "⏱️",
  "add-subtract-time": "⏰",
  "business-days-calculator": "💼",
  "business-days-with-holidays": "🏖️",
  "days-until-counter": "⏳",
  "days-since-counter": "🕰️",
  "decimal-time-converter": "🔢",
  "leap-year-checker": "🐸",
  "iso-week-number": "🗓️",
  "day-of-week-finder": "🔮",
  "time-percentage-calculator": "📊",
  "date-midpoint-calculator": "📍",
  "millisecond-timer": "⚡",
  "day-of-year-converter": "📅",
  "working-hours-tracker": "📝",
  "overtime-hours-calculator": "💵",
  "payroll-period-planner": "🗓️",
  "time-card-calculator": "💳",
  "time-card-with-breaks": "☕",
  "overtime-pay-calculator": "💰",
  "hourly-to-salary": "📈",
  "salary-to-hourly": "📉",
  "freelance-capacity-planner": "🎯",
  "pto-accrual-calculator": "🏖️",
  "furlough-pay-calculator": "🤕",
  "shift-differential-pay": "🌙",
  "gross-to-net-pay": "🧾",
  "billable-hours-tracker": "📁",
  "commission-by-hour": "💎",
  "break-deductor": "⏸️",
  "annual-work-hours": "🗓️",
  "multi-job-income-sync": "🔄",
  "biweekly-timesheet": "🗂️",
  "semi-monthly-pay": "💵",
  "retainer-burndown": "🔥",
  "labor-cost-tracker": "📊",
  "fractional-executive": "👔",
  "project-back-planner": "↩️",
  "gantt-chart-date-calculator": "📊",
  "sprint-date-calculator": "🏃‍♂️",
  "sla-countdown-timer": "🚨",
  "lead-time-calculator": "🏎️",
  "statutory-notice-period": "✉️",
  "subscription-renewal-schedule": "🔄",
  "event-countdown-back-timer": "🎪",
  "fiscal-quarter-calculator": "🏢",
  "milestone-buffer-calculator": "🛡️",
  "document-retention-expiry": "🗄️",
  "downtime-uptime-calculator": "🟢",
  "recurring-event-rrule": "🔁",
  "invoice-due-date-calculator": "🧾",
  "court-deadline-calculator": "⚖️",
  "delivery-slip-risk": "⚠️",
  "pomodoro-time-segmenter": "🍅",
  "remote-team-overlap": "🗺️",
  "cpm-critical-path-float": "🛣️",
  "campaign-deployment-timeline": "📢",
  "world-time-converter": "🌐",
  "meeting-planner": "🤝",
  "utc-gmt-offset": "🌐",
  "military-time-converter": "🎖️",
  "dst-tracker": "⏰",
  "flight-duration-calculator": "✈️",
  "timezone-map-finder": "🗺️",
  "unix-timestamp-converter": "💻",
  "date-line-simulator": "🚢",
  "timezone-abbreviations": "🔤",
  "zulu-time-coordinator": "🛸",
  "internet-time-converter": "🌐",
  "gps-time-correction": "🛰️",
  "multi-city-clock": "⏰",
  "cross-border-deadline": "🏁",
  "timezone-difference-grid": "🏁",
  "solar-vs-standard-time": "☀️",
  "ntp-latency-tester": "📶",
  "leap-second-log": "📜",
  "solar-noon-tracker": "☀️",
  "pregnancy-due-date": "👶",
  "trimester-calendar": "🤰",
  "age-calculator": "🎂",
  "sleep-calculator": "💤",
  "ovulation-calculator": "🌸",
  "fasting-planner": "🍽️",
  "medication-scheduler": "💊",
  "habit-streak-planner": "🔥",
  "pet-age-translator": "🐶",
  "caffeine-half-life": "☕",
  "alcohol-clearance": "🍷",
  "nicotine-detox": "🚭",
  "shift-sleep-adjuster": "🛌",
  "vaccination-tracker": "💉",
  "screen-break-timer": "👁️",
  "loan-maturity-date": "🏦",
  "interest-day-count": "📈",
  "tenancy-notice": "🔑",
  "golden-hour-tracker": "📸",
  "perpetual-calendar": "📆",

  // Realms
  "solar-system-age": "🪐",
  "cosmic-countdown": "💥",
  "relativistic-travel": "🚀",
  "body-in-numbers": "🫀",
  "deep-time-context": "🦕",
  "black-hole-gravity": "🕳️",
  "spacetime-fabric": "🕸️",
  "wormhole-portal": "🌀",
  "time-dilation-slider": "⏱️",
  "planet-billiards": "🎱",
  "what-year-am-i": "🕵️",
  "butterfly-effect": "🦋",
  "born-wrong-era": "🕰️",
  "genius-age-matcher": "🧠",
  "quantum-leap": "⚡",
  "retrocausality": "↩️",
  "alternate-history": "📜",
  "destiny-matrix": "🔮",
  "cosmic-personal-stats": "🌌",
  "life-mosaic": "🧩",
  "time-wasters": "🗑️",
  "absurd-clocks": "🐌",
  "paint-dry-simulator": "🎨",
  "cosmic-horror": "🐙"
};

function getEmoji(id: string, isRealm: boolean): string {
  return EMOJI_MAP[id] || (isRealm ? "🪐" : "⏱️");
}

const UTILITY_CATEGORIES = [
  { id: "standard-time", name: "Standard Time & Date", accent: "#52C4A0" },
  { id: "hr-payroll", name: "HR, Payroll & Freelance", accent: "#60A5D4" },
  { id: "project-management", name: "Project Management", accent: "#9B8EF5" },
  { id: "global-time", name: "Global Time & Zones", accent: "#F5A857" },
  { id: "health-lifecycle", name: "Health & Lifecycle", accent: "#E87C7C" }
];

const REALM_CATEGORIES = [
  { id: "cosmos", name: "Space & Cosmos", accent: "#4B8EF1" },
  { id: "biology", name: "Biology & History", accent: "#C9A84C" },
  { id: "scifi", name: "Sci-Fi & Paradox", accent: "#7B61FF" },
  { id: "whimsical", name: "Whimsical & Absurd", accent: "#3ABFBF" },
  { id: "destiny", name: "Personal Destiny", accent: "#E09A3A" },
  { id: "physics", name: "Physics Playground", accent: "#4B8EF1" }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'tools' | 'realms' | 'games' | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // Scroll handler to make navbar background frosted on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "h-14 md:h-16 bg-bg-surface/80 backdrop-blur-[12px] border-b border-border shadow-md"
          : "h-14 md:h-16 bg-transparent border-b border-border/20"
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center cursor-pointer select-none">
            <span className="font-display font-light text-lg md:text-[18px] tracking-[0.25em] text-text-primary transition-opacity hover:opacity-80">
              ✦ GOD OF TIME
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav 
          className="hidden md:flex items-center gap-6 h-full"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {/* Utility Tools */}
          <div className="static flex items-center h-full">
            <button
              onMouseEnter={() => setActiveDropdown('tools')}
              onClick={() => setActiveDropdown(activeDropdown === 'tools' ? null : 'tools')}
              aria-expanded={activeDropdown === 'tools'}
              aria-haspopup="true"
              className="flex items-center gap-1.5 px-3 py-1.5 h-9 text-text-muted hover:text-text-primary font-sans font-medium rounded-md cursor-pointer transition-colors border-none outline-none select-none"
            >
              Utility Tools
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'tools' && (
              <div 
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-2 border-text-primary shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-50 py-6 animate-in fade-in-0 slide-in-from-top-1 duration-200"
                onMouseEnter={() => setActiveDropdown('tools')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {UTILITY_CATEGORIES.map((cat) => {
                      const catTools = toolsRegistry.find((g) => g.id === cat.id)?.tools || [];
                      const displayedTools = catTools.slice(0, 5);
                      const remaining = catTools.length - displayedTools.length;
                      return (
                        <div
                          key={cat.id}
                          style={{ "--category-accent": cat.accent } as React.CSSProperties}
                          className="group/card flex flex-col p-5 bg-bg-surface hover:bg-bg-card-hover border-2 border-border hover:border-[var(--category-accent)] rounded-2xl transition-all duration-200 shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[6px_6px_0px_0px_var(--category-accent)]"
                        >
                          <Link
                            href={`/tools#${cat.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="font-sans font-semibold text-[13px] text-text-primary hover:text-[var(--category-accent)] mb-3 text-left transition-colors block"
                          >
                            {cat.name}
                          </Link>
                          
                          <div className="flex items-center justify-between w-full mt-auto">
                            <div className="flex -space-x-2 overflow-hidden">
                              {displayedTools.map((tool) => (
                                <div key={tool.id} className="relative group/tooltip">
                                  <Link
                                    href={`/tools/${tool.slug}`}
                                    onClick={() => setActiveDropdown(null)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-card border-2 border-text-primary text-base shadow-[1px_1px_0px_0px_var(--border)] hover:scale-120 hover:-translate-y-1 hover:z-20 transition-all select-none cursor-pointer"
                                  >
                                    {getEmoji(tool.id, false)}
                                  </Link>
                                  {/* CSS Tooltip */}
                                  <div className="invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-sans font-semibold tracking-wide text-bg-base bg-text-primary rounded-md whitespace-nowrap shadow-md pointer-events-none z-30">
                                    {tool.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-primary" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {remaining > 0 ? (
                              <Link 
                                href={`/tools#${cat.id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="h-8 px-2 rounded-full flex items-center justify-center border-2 border-text-primary bg-bg-card text-[10px] font-bold font-mono text-text-primary shadow-[1px_1px_0px_0px_var(--border)] group-hover/card:shadow-[1px_1px_0px_0px_var(--category-accent)] hover:scale-105 transition-all select-none"
                              >
                                +{remaining}
                              </Link>
                            ) : (
                              <Link 
                                href={`/tools#${cat.id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-text-primary bg-bg-card text-xs text-text-primary shadow-[1px_1px_0px_0px_var(--border)] group-hover/card:shadow-[1px_1px_0px_0px_var(--category-accent)] hover:scale-105 transition-all select-none"
                              >
                                →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full border-t-2 border-dashed border-border/80 my-1" />

                  <div className="flex flex-row items-center justify-between gap-4">
                    <Link
                      href="/tools"
                      onClick={() => setActiveDropdown(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-text-primary bg-accent-utility-a/10 hover:bg-accent-utility-a/20 text-text-primary font-sans font-bold text-xs transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_var(--border)] hover:shadow-[3px_3px_0px_0px_var(--color-text-primary)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
                    >
                      All categories →
                    </Link>

                    {/* Retro theme rocker switch */}
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider font-bold text-text-muted select-none">
                      <span>Lights</span>
                      <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className="flex flex-col border-2 border-text-primary rounded-lg overflow-hidden w-8 h-10 font-bold cursor-pointer select-none transition-all shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[2px_2px_0px_0px_var(--color-text-primary)] active:translate-y-0.5 active:shadow-none"
                        aria-label="Toggle lights"
                      >
                        <span className={`flex-1 w-full flex items-center justify-center text-[9px] transition-colors leading-none ${!isDark ? 'bg-text-primary text-bg-base font-black' : 'bg-bg-surface text-text-muted'}`}>
                          I
                        </span>
                        <span className="h-[2px] w-full bg-text-primary" />
                        <span className={`flex-1 w-full flex items-center justify-center text-[9px] transition-colors leading-none ${isDark ? 'bg-text-primary text-bg-base font-black' : 'bg-bg-surface text-text-muted'}`}>
                          O
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Fun Realms */}
          <div className="static flex items-center h-full">
            <button
              onMouseEnter={() => setActiveDropdown('realms')}
              onClick={() => setActiveDropdown(activeDropdown === 'realms' ? null : 'realms')}
              aria-expanded={activeDropdown === 'realms'}
              aria-haspopup="true"
              className="flex items-center gap-1.5 px-3 py-1.5 h-9 text-text-muted hover:text-text-primary font-sans font-medium rounded-md cursor-pointer transition-colors border-none outline-none select-none"
            >
              Fun Realms
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'realms' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'realms' && (
              <div 
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-2 border-text-primary shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-50 py-6 animate-in fade-in-0 slide-in-from-top-1 duration-200"
                onMouseEnter={() => setActiveDropdown('realms')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {REALM_CATEGORIES.filter((cat) => realmsRegistry.some((r) => r.category === cat.id)).map((cat) => {
                      const catRealms = realmsRegistry.filter((r) => r.category === cat.id) || [];
                      const displayedRealms = catRealms.slice(0, 5);
                      const remaining = catRealms.length - displayedRealms.length;
                      return (
                        <div
                          key={cat.id}
                          style={{ "--category-accent": cat.accent } as React.CSSProperties}
                          className="group/card flex flex-col p-5 bg-bg-surface hover:bg-bg-card-hover border-2 border-border hover:border-[var(--category-accent)] rounded-xl transition-all duration-200 shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--category-accent)]"
                        >
                          <Link
                            href={`/realms#${cat.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="font-sans font-semibold text-[13px] text-text-primary hover:text-[var(--category-accent)] mb-3 text-left transition-colors block"
                          >
                            {cat.name}
                          </Link>
                          
                          <div className="flex items-center justify-between w-full mt-auto">
                            <div className="flex -space-x-2 overflow-hidden">
                              {displayedRealms.map((realm) => (
                                <div key={realm.id} className="relative group/tooltip">
                                  <Link
                                    href={`/realms/${realm.slug}`}
                                    onClick={() => setActiveDropdown(null)}
                                    className="w-8 h-8 rounded-full flex items-center justify-center bg-bg-card border-2 border-text-primary text-base shadow-[1px_1px_0px_0px_var(--border)] hover:scale-120 hover:-translate-y-1 hover:z-20 transition-all select-none cursor-pointer"
                                  >
                                    {getEmoji(realm.id, true)}
                                  </Link>
                                  {/* CSS Tooltip */}
                                  <div className="invisible group-hover/tooltip:visible opacity-0 group-hover/tooltip:opacity-100 transition-all duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 text-[10px] font-sans font-semibold tracking-wide text-bg-base bg-text-primary rounded-md whitespace-nowrap shadow-md pointer-events-none z-30">
                                    {realm.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-text-primary" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {remaining > 0 ? (
                              <Link 
                                href={`/realms#${cat.id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="h-8 px-2 rounded-full flex items-center justify-center border-2 border-text-primary bg-bg-card text-[10px] font-bold font-mono text-text-primary shadow-[1px_1px_0px_0px_var(--border)] group-hover/card:shadow-[1px_1px_0px_0px_var(--category-accent)] hover:scale-105 transition-all select-none"
                              >
                                +{remaining}
                              </Link>
                            ) : (
                              <Link 
                                href={`/realms#${cat.id}`}
                                onClick={() => setActiveDropdown(null)}
                                className="h-8 w-8 rounded-full flex items-center justify-center border-2 border-text-primary bg-bg-card text-xs text-text-primary shadow-[1px_1px_0px_0px_var(--border)] group-hover/card:shadow-[1px_1px_0px_0px_var(--category-accent)] hover:scale-105 transition-all select-none"
                              >
                                →
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full border-t-2 border-dashed border-border/80 my-1" />

                  <div className="flex flex-row items-center justify-between gap-4">
                    <Link
                      href="/realms"
                      onClick={() => setActiveDropdown(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-text-primary bg-accent-utility-a/10 hover:bg-accent-utility-a/20 text-text-primary font-sans font-bold text-xs transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_var(--border)] hover:shadow-[3px_3px_0px_0px_var(--color-text-primary)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
                    >
                      All categories →
                    </Link>

                    {/* Retro theme rocker switch */}
                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider font-bold text-text-muted select-none">
                      <span>Lights</span>
                      <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className="flex flex-col border-2 border-text-primary rounded-lg overflow-hidden w-8 h-10 font-bold cursor-pointer select-none transition-all shadow-[2px_2px_0px_0px_var(--border)] hover:shadow-[2px_2px_0px_0px_var(--color-text-primary)] active:translate-y-0.5 active:shadow-none"
                        aria-label="Toggle lights"
                      >
                        <span className={`flex-1 w-full flex items-center justify-center text-[9px] transition-colors leading-none ${!isDark ? 'bg-text-primary text-bg-base font-black' : 'bg-bg-surface text-text-muted'}`}>
                          I
                        </span>
                        <span className="h-[2px] w-full bg-text-primary" />
                        <span className={`flex-1 w-full flex items-center justify-center text-[9px] transition-colors leading-none ${isDark ? 'bg-text-primary text-bg-base font-black' : 'bg-bg-surface text-text-muted'}`}>
                          O
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Games */}
          <div className="static flex items-center h-full">
            <button
              onMouseEnter={() => setActiveDropdown('games')}
              onClick={() => setActiveDropdown(activeDropdown === 'games' ? null : 'games')}
              aria-expanded={activeDropdown === 'games'}
              aria-haspopup="true"
              className="flex items-center gap-1.5 px-3 py-1.5 h-9 text-text-muted hover:text-text-primary font-sans font-medium rounded-md cursor-pointer transition-colors border-none outline-none select-none"
            >
              Games
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'games' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'games' && (
              <div
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-2 border-text-primary shadow-[0_15px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-50 py-6 animate-in fade-in-0 slide-in-from-top-1 duration-200"
                onMouseEnter={() => setActiveDropdown('games')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gamesRegistry.map((game) => (
                      <div
                        key={game.id}
                        style={{ "--category-accent": game.accent } as React.CSSProperties}
                        className="group/card flex flex-col p-5 bg-bg-surface hover:bg-bg-card-hover border-2 border-border hover:border-[var(--category-accent)] rounded-xl transition-all duration-200 shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--category-accent)]"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link
                            href={`/games/${game.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="font-sans font-semibold text-[13px] text-text-primary hover:text-[var(--category-accent)] transition-colors"
                          >
                            {game.name}
                          </Link>
                          <span
                            className="px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-wider flex-shrink-0"
                            style={{
                              background: `color-mix(in srgb, ${game.accent} 12%, transparent)`,
                              color: game.accent,
                            }}
                          >
                            Daily
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-text-muted leading-snug mb-4">
                          {game.tagline}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex gap-1 text-sm opacity-60 select-none">
                            {game.badgeEmojis.map((b, i) => <span key={i}>{b}</span>)}
                          </div>
                          <Link
                            href={`/games/${game.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className="h-8 px-3 rounded-full flex items-center justify-center border-2 border-text-primary bg-bg-card text-[10px] font-bold font-sans text-text-primary shadow-[1px_1px_0px_0px_var(--border)] group-hover/card:shadow-[1px_1px_0px_0px_var(--category-accent)] hover:scale-105 transition-all select-none"
                          >
                            Play →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="w-full border-t-2 border-dashed border-border/80 my-1" />

                  <Link
                    href="/games"
                    onClick={() => setActiveDropdown(null)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-text-primary bg-accent-utility-a/10 hover:bg-accent-utility-a/20 text-text-primary font-sans font-bold text-xs transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_var(--border)] hover:shadow-[3px_3px_0px_0px_var(--color-text-primary)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)] self-start"
                  >
                    All games →
                  </Link>
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Right: Theme Toggle & Mobile Menu Hamburger */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-md border border-border text-text-primary bg-bg-surface/50 hover:bg-bg-card transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-surface border-b border-border shadow-xl p-4 max-h-[calc(100vh-60px)] overflow-y-auto z-40 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          
          {/* Utility Tools Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Utility Tools
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {UTILITY_CATEGORIES.map((cat) => (
                <div key={cat.id} className="border-l border-border pl-3 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accent }} />
                    <span className="text-xs font-sans font-medium text-text-primary">
                      {cat.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {toolsRegistry
                      .find((g) => g.id === cat.id)
                      ?.tools.slice(0, 5) // Show top 5 on mobile to keep compact
                      .map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          {tool.name}
                        </Link>
                      ))}
                    <Link
                      href="/tools"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[10px] font-sans text-accent-cosmos hover:underline py-0.5"
                    >
                      View all tools ›
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Games
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {gamesRegistry.map((game) => (
                <div key={game.id} className="border-l border-border pl-3 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: game.accent }} />
                    <span className="text-xs font-sans font-medium text-text-primary">{game.name}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`/games/${game.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5"
                    >
                      {game.tagline}
                    </Link>
                    <Link
                      href="/games"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[10px] font-sans hover:underline py-0.5"
                      style={{ color: game.accent }}
                    >
                      All games ›
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Realms Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Fun Realms
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {REALM_CATEGORIES.filter((cat) => realmsRegistry.some((r) => r.category === cat.id)).map((cat) => (
                <div key={cat.id} className="border-l border-border pl-3 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accent }} />
                    <span className="text-xs font-sans font-medium text-text-primary">
                      {cat.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {realmsRegistry
                      .filter((r) => r.category === cat.id)
                      .slice(0, 4) // Show top 4 on mobile
                      .map((realm) => (
                        <Link
                          key={realm.id}
                          href={`/realms/${realm.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          {realm.name}
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
