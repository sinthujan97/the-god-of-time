"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { gamesRegistry } from "@/lib/data/gamesRegistry";
import { clocksRegistry, CLOCK_CATEGORIES, type ClockEntry } from "@/lib/data/clocksRegistry";
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
  "leap-year-calculator": "🐸",
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
  "shift-differential-calculator": "🌙",
  "gross-to-net-pay": "🧾",
  "billable-hours-tracker": "📁",
  "commission-per-hour-calculator": "💎",
  "break-deductor": "⏸️",
  "annual-work-hours": "🗓️",
  "multi-job-income-sync": "🔄",
  "free-biweekly-timesheet-calculator": "🗂️",
  "semi-monthly-pay-calculator": "💵",
  "retainer-hours-tracker-online": "🔥",
  "labor-cost-tracker": "📊",
  "fractional-work-hours-allocator": "👔",
  "employee-utilization-calculator": "🎯",
  "project-back-planner": "↩️",
  "gantt-chart-date-calculator": "📊",
  "agile-sprint-date-calculator": "🏃‍♂️",
  "sla-timer": "🚨",
  "lead-time-calculator": "🏎️",
  "statutory-notice-period": "✉️",
  "subscription-renewal-schedule": "🔄",
  "event-countdown-back-timer": "🎪",
  "fiscal-quarter-calculator": "🏢",
  "project-buffer-calculator": "🛡️",
  "document-expiration-date-calculator": "🗄️",
  "downtime-uptime-calculator": "🟢",
  "rrule-generator-online": "🔁",
  "invoice-due-date-calculator": "🧾",
  "free-legal-deadline-calculator": "⚖️",
  "delivery-slip-risk": "⚠️",
  "pomodoro-time-segmenter": "🍅",
  "remote-team-overlap": "🗺️",
  "critical-path-calculator": "🛣️",
  "campaign-deployment-timeline": "📢",
  "world-time-converter": "🌐",
  "world-clock-meeting-planner": "🤝",
  "utc-gmt-offset": "🌐",
  "military-time-converter": "🎖️",
  "dst-tracker": "⏰",
  "flight-duration-calculator": "✈️",
  "timezone-map-finder": "🗺️",
  "unix-timestamp-converter": "💻",
  "date-line-simulator": "🚢",
  "timezone-abbreviations": "🔤",
  "zulu-time-converter": "🛸",
  "swatch-time-converter": "🌐",
  "gps-time-converter": "🛰️",
  "multi-city-clock": "⏰",
  "cross-border-deadline-calculator": "🏁",
  "timezone-difference-grid": "🏁",
  "solar-vs-standard-time": "☀️",
  "ntp-time-tester-online": "📶",
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
  "watch-paint-dry": "🎨",
  "fifth-dimension": "⬡",
  "cosmic-horror": "🐙"
};

function getEmoji(id: string, isRealm: boolean): string {
  return EMOJI_MAP[id] || (isRealm ? "🪐" : "⏱️");
}

const UTILITY_CATEGORIES = [
  { id: "standard-time", name: "Standard Time & Date", accent: "#C5F135", tagline: "Dates, durations & calendars" },
  { id: "hr-payroll", name: "HR, Payroll & Freelance", accent: "#A8CC1C", tagline: "Pay, hours & freelance tools" },
  { id: "project-management", name: "Project Management", accent: "#8BA812", tagline: "Plan, track & deliver on time" },
  { id: "global-time", name: "Global Time & Zones", accent: "#D8F870", tagline: "Time zones across the globe" },
  { id: "health-lifecycle", name: "Health & Lifecycle", accent: "#B2D828", tagline: "Health milestones & life tracking" }
];

const REALM_CATEGORIES = [
  { id: "cosmos", name: "Space & Cosmos", accent: "#C5F135", tagline: "Space & cosmic scale" },
  { id: "biology", name: "Biology & History", accent: "#D8F870", tagline: "Life, history & deep time" },
  { id: "scifi", name: "Sci-Fi & Paradox", accent: "#B2D828", tagline: "Paradoxes & sci-fi thought experiments" },
  { id: "whimsical", name: "Whimsical & Absurd", accent: "#A8CC1C", tagline: "Absurd & pointless fun" },
  { id: "destiny", name: "Personal Destiny", accent: "#8BA812", tagline: "Your personal cosmic stats" },
  { id: "physics", name: "Physics Playground", accent: "#D8F870", tagline: "Play with the laws of physics" }
];

type NavSection = "tools" | "realms" | "games" | "clocks" | "default";

function sectionFromPathname(pathname: string): NavSection {
  if (pathname.startsWith("/tools"))  return "tools";
  if (pathname.startsWith("/realms")) return "realms";
  if (pathname.startsWith("/games"))  return "games";
  if (pathname.startsWith("/clocks")) return "clocks";
  return "default";
}

const SECTION_CTA_LABEL: Record<NavSection, string> = {
  tools:   "Explore Tools →",
  realms:  "Enter Realm →",
  games:   "Play Now →",
  clocks:  "Browse Clocks →",
  default: "Get Started →",
};

const SECTION_CTA_HREF: Record<NavSection, string> = {
  tools:   "/tools",
  realms:  "/realms",
  games:   "/games",
  clocks:  "/clocks",
  default: "/tools",
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'tools' | 'realms' | 'games' | 'clocks' | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const section = sectionFromPathname(pathname || "/");

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
      className={`navbar-brutal fixed top-0 left-0 right-0 z-50 transition-all duration-150 h-14 md:h-16 ${
        isScrolled ? "shadow-md" : ""
      }`}
      style={{
        "--accent-color":
          section === "tools"   ? "var(--section-tools-accent)"
          : section === "realms"  ? "var(--section-realms-accent)"
          : section === "games"   ? "var(--section-games-accent)"
          : section === "clocks"  ? "var(--section-clocks-accent)"
          : "var(--section-tools-accent)",
        "--accent-color-dark":
          section === "tools"   ? "var(--section-tools-accent-dark)"
          : section === "realms"  ? "var(--section-realms-accent-dark)"
          : section === "games"   ? "var(--section-games-accent-dark)"
          : section === "clocks"  ? "var(--section-clocks-accent-dark)"
          : "var(--section-tools-accent-dark)",
        "--text-on-accent":
          section === "games" ? "var(--section-games-text-on-accent)" : "#1A1A1A",
      } as React.CSSProperties}
    >
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between gap-4">

        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer select-none">
            <span className="logo-icon-box">✦</span>
            <span className="hidden md:inline font-headline font-extrabold text-base md:text-[17px] tracking-[0.02em] text-text-primary transition-opacity hover:opacity-80">
              GOD OF <span style={{ color: "var(--accent-color)" }}>TIME</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-3 h-full"
          onMouseLeave={() => setActiveDropdown(null)}
        >
          {/* Utility Tools */}
          <div className="static flex items-center h-full">
            <button
              onMouseEnter={() => setActiveDropdown('tools')}
              onClick={() => setActiveDropdown(activeDropdown === 'tools' ? null : 'tools')}
              aria-expanded={activeDropdown === 'tools'}
              aria-haspopup="true"
              className="nav-dropdown-trigger h-9 text-text-primary font-sans select-none"
            >
              Utility Tools
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'tools' && (
              <div
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-[length:var(--border-width-thick)] border-border shadow-[var(--shadow-offset-lg)_var(--shadow-color)] z-50 py-5 animate-in fade-in-0 slide-in-from-top-1 duration-150"
                onMouseEnter={() => setActiveDropdown('tools')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
                  <div className="grid grid-cols-5 gap-4">
                    {UTILITY_CATEGORIES.map((cat, idx) => {
                      const catTools = toolsRegistry.find((g) => g.id === cat.id)?.tools || [];
                      const displayedTools = catTools.slice(0, 6);
                      return (
                        <div
                          key={cat.id}
                          style={{
                            "--category-accent": cat.accent,
                            animationDelay: `${idx * 40}ms`,
                          } as React.CSSProperties}
                          className="dropdown-category-box animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-200"
                        >
                          <div className="dropdown-category-box__header">
                            <span className="dropdown-category-box__name">{cat.name}</span>
                            <span className="dropdown-category-box__count">{catTools.length}</span>
                          </div>
                          <p className="dropdown-category-box__tagline">{cat.tagline}</p>
                          <ol className="dropdown-category-box__list">
                            {displayedTools.map((tool, i) => (
                              <li key={tool.id}>
                                <Link
                                  href={`/tools/${tool.slug}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="dropdown-category-box__row"
                                >
                                  <span className="dropdown-category-box__row-num">{i + 1}.</span>
                                  <span className="dropdown-category-box__row-icon">{getEmoji(tool.id, false)}</span>
                                  <span className="dropdown-category-box__row-name">{tool.name}</span>
                                  <ChevronRight className="dropdown-category-box__row-chevron" />
                                </Link>
                              </li>
                            ))}
                          </ol>
                          <Link
                            href={`/tools#${cat.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="dropdown-category-box__viewall"
                          >
                            View all {catTools.length} →
                          </Link>
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
              className="nav-dropdown-trigger h-9 text-text-primary font-sans select-none"
            >
              Fun Realms
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'realms' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'realms' && (
              <div
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-[length:var(--border-width-thick)] border-border shadow-[var(--shadow-offset-lg)_var(--shadow-color)] z-50 py-5 animate-in fade-in-0 slide-in-from-top-1 duration-150"
                onMouseEnter={() => setActiveDropdown('realms')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
                  <div className="grid grid-cols-6 gap-4">
                    {REALM_CATEGORIES.filter((cat) => realmsRegistry.some((r) => r.category === cat.id)).map((cat, idx) => {
                      const catRealms = realmsRegistry.filter((r) => r.category === cat.id) || [];
                      const displayedRealms = catRealms.slice(0, 4);
                      return (
                        <div
                          key={cat.id}
                          style={{
                            "--category-accent": cat.accent,
                            animationDelay: `${idx * 40}ms`,
                          } as React.CSSProperties}
                          className="dropdown-category-box animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-200"
                        >
                          <div className="dropdown-category-box__header">
                            <span className="dropdown-category-box__name">{cat.name}</span>
                            <span className="dropdown-category-box__count">{catRealms.length}</span>
                          </div>
                          <p className="dropdown-category-box__tagline">{cat.tagline}</p>
                          <ol className="dropdown-category-box__list">
                            {displayedRealms.map((realm, i) => (
                              <li key={realm.id}>
                                <Link
                                  href={`/realms/${realm.slug}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="dropdown-category-box__row"
                                >
                                  <span className="dropdown-category-box__row-num">{i + 1}.</span>
                                  <span className="dropdown-category-box__row-icon">{getEmoji(realm.id, true)}</span>
                                  <span className="dropdown-category-box__row-name">{realm.name}</span>
                                  <ChevronRight className="dropdown-category-box__row-chevron" />
                                </Link>
                              </li>
                            ))}
                          </ol>
                          <Link
                            href={`/realms#${cat.id}`}
                            onClick={() => setActiveDropdown(null)}
                            className="dropdown-category-box__viewall"
                          >
                            View all {catRealms.length} →
                          </Link>
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
              className="nav-dropdown-trigger h-9 text-text-primary font-sans select-none"
            >
              Games
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'games' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'games' && (
              <div
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-[length:var(--border-width-thick)] border-border shadow-[var(--shadow-offset-lg)_var(--shadow-color)] z-50 py-5 animate-in fade-in-0 slide-in-from-top-1 duration-150"
                onMouseEnter={() => setActiveDropdown('games')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      style={{ "--category-accent": "var(--section-games-accent)" } as React.CSSProperties}
                      className="dropdown-category-box animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-200"
                    >
                      <div className="dropdown-category-box__header">
                        <span className="dropdown-category-box__name">Daily Games</span>
                        <span className="dropdown-category-box__count">{gamesRegistry.length}</span>
                      </div>
                      <p className="dropdown-category-box__tagline">One shot. Every day.</p>
                      <ol className="dropdown-category-box__list">
                        {gamesRegistry.map((game, i) => (
                          <li key={game.id}>
                            <Link
                              href={`/games/${game.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="dropdown-category-box__row"
                            >
                              <span className="dropdown-category-box__row-num">{i + 1}.</span>
                              <span className="dropdown-category-box__row-icon">{game.badgeEmojis[0]}</span>
                              <span className="dropdown-category-box__row-name">{game.name}</span>
                              <span className="dropdown-category-box__row-tag" style={{ color: game.accent }}>
                                {game.difficulty}
                              </span>
                              <ChevronRight className="dropdown-category-box__row-chevron" />
                            </Link>
                          </li>
                        ))}
                      </ol>
                      <Link
                        href="/games"
                        onClick={() => setActiveDropdown(null)}
                        className="dropdown-category-box__viewall"
                      >
                        View all games →
                      </Link>
                    </div>
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

          {/* Clocks */}
          <div className="static flex items-center h-full">
            <button
              onMouseEnter={() => setActiveDropdown('clocks')}
              onClick={() => setActiveDropdown(activeDropdown === 'clocks' ? null : 'clocks')}
              aria-expanded={activeDropdown === 'clocks'}
              aria-haspopup="true"
              className="nav-dropdown-trigger h-9 text-text-primary font-sans select-none"
            >
              Clocks
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-200 ${activeDropdown === 'clocks' ? 'rotate-180' : ''}`} />
            </button>

            {activeDropdown === 'clocks' && (
              <div
                className="absolute top-full left-0 right-0 w-full bg-bg-card border-b-[length:var(--border-width-thick)] border-border shadow-[var(--shadow-offset-lg)_var(--shadow-color)] z-50 py-5 animate-in fade-in-0 slide-in-from-top-1 duration-150"
                onMouseEnter={() => setActiveDropdown('clocks')}
              >
                <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
                  <div className="grid grid-cols-5 gap-4">
                    {(Object.entries(CLOCK_CATEGORIES) as [ClockEntry["category"], typeof CLOCK_CATEGORIES[keyof typeof CLOCK_CATEGORIES]][]).map(([catId, cat], idx) => {
                      const catClocks = clocksRegistry.filter((c) => c.category === catId);
                      const displayed = catClocks.slice(0, 4);
                      return (
                        <div
                          key={catId}
                          style={{
                            "--category-accent": cat.accent,
                            animationDelay: `${idx * 40}ms`,
                          } as React.CSSProperties}
                          className="dropdown-category-box animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-200"
                        >
                          <div className="dropdown-category-box__header">
                            <span className="dropdown-category-box__name">{cat.name}</span>
                            <span className="dropdown-category-box__count">{catClocks.length}</span>
                          </div>
                          <p className="dropdown-category-box__tagline">{cat.tagline}</p>
                          <ol className="dropdown-category-box__list">
                            {displayed.map((clock, i) => (
                              <li key={clock.id}>
                                <Link
                                  href={clock.isExistingTool ? `/tools/${clock.existingToolSlug}` : `/clocks/${clock.slug}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="dropdown-category-box__row"
                                >
                                  <span className="dropdown-category-box__row-num">{i + 1}.</span>
                                  <span className="dropdown-category-box__row-icon">{clock.icon}</span>
                                  <span className="dropdown-category-box__row-name">{clock.name}</span>
                                  <ChevronRight className="dropdown-category-box__row-chevron" />
                                </Link>
                              </li>
                            ))}
                          </ol>
                          <Link
                            href={`/clocks#${catId}`}
                            onClick={() => setActiveDropdown(null)}
                            className="dropdown-category-box__viewall"
                          >
                            View all {catClocks.length} →
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full border-t-2 border-dashed border-border/80 my-1" />

                  <div className="flex flex-row items-center justify-between gap-4">
                    <Link
                      href="/clocks"
                      onClick={() => setActiveDropdown(null)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-text-primary bg-accent-utility-a/10 hover:bg-accent-utility-a/20 text-text-primary font-sans font-bold text-xs transition-all duration-150 cursor-pointer shadow-[3px_3px_0px_0px_var(--border)] hover:shadow-[3px_3px_0px_0px_var(--color-text-primary)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_var(--border)]"
                    >
                      All clocks →
                    </Link>

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

        </nav>

        {/* Right: Status Badge, CTA, Theme Toggle & Mobile Menu Hamburger */}
        <div className="flex items-center gap-3">
          <span className="nav-status-badge hidden lg:inline-flex">✦ 100+ Free Tools</span>

          <Link href={SECTION_CTA_HREF[section]} className="nav-cta hidden sm:inline-flex">
            {SECTION_CTA_LABEL[section]}
          </Link>

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
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-surface border-b-[length:var(--border-width)] border-border shadow-[var(--shadow-offset-lg)_var(--shadow-color)] p-4 max-h-[calc(100vh-60px)] overflow-y-auto z-40 flex flex-col gap-4 animate-in slide-in-from-top duration-300">

          {/* Utility Tools Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Utility Tools
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {UTILITY_CATEGORIES.map((cat) => (
                <div key={cat.id} className="border-l-[length:var(--border-width)] border-border pl-3 py-1">
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
                      .map((tool, i) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-1.5 text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          <span className="font-mono text-text-faint">{i + 1}.</span>
                          <span>{getEmoji(tool.id, false)}</span>
                          <span className="truncate">{tool.name}</span>
                        </Link>
                      ))}
                    <Link
                      href="/tools"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[10px] font-sans font-bold hover:underline py-0.5"
                      style={{ color: cat.accent }}
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
              {gamesRegistry.map((game, i) => (
                <div key={game.id} className="border-l-[length:var(--border-width)] border-border pl-3 py-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-text-faint">{i + 1}.</span>
                    <span>{game.badgeEmojis[0]}</span>
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
                      className="text-[10px] font-sans font-bold hover:underline py-0.5"
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
                <div key={cat.id} className="border-l-[length:var(--border-width)] border-border pl-3 py-1">
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
                      .map((realm, i) => (
                        <Link
                          key={realm.id}
                          href={`/realms/${realm.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-1.5 text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          <span className="font-mono text-text-faint">{i + 1}.</span>
                          <span>{getEmoji(realm.id, true)}</span>
                          <span className="truncate">{realm.name}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clocks Section */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-wider text-text-muted mb-2 font-semibold">
              Clocks & Timers
            </h4>
            <div className="flex flex-col gap-2 pl-2">
              {(Object.entries(CLOCK_CATEGORIES) as [ClockEntry["category"], typeof CLOCK_CATEGORIES[keyof typeof CLOCK_CATEGORIES]][]).map(([catId, cat]) => {
                const catClocks = clocksRegistry.filter((c) => c.category === catId);
                return (
                  <div key={catId} className="border-l-[length:var(--border-width)] border-border pl-3 py-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.accent }} />
                      <span className="text-xs font-sans font-medium text-text-primary">{cat.name}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {catClocks.slice(0, 3).map((clock, i) => (
                        <Link
                          key={clock.id}
                          href={clock.isExistingTool ? `/tools/${clock.existingToolSlug}` : `/clocks/${clock.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-1.5 text-[11px] font-sans text-text-muted hover:text-text-primary py-0.5 truncate"
                        >
                          <span className="font-mono text-text-faint">{i + 1}.</span>
                          <span>{clock.icon}</span>
                          <span className="truncate">{clock.name}</span>
                        </Link>
                      ))}
                      <Link
                        href="/clocks"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-[10px] font-sans font-bold hover:underline py-0.5"
                        style={{ color: cat.accent }}
                      >
                        View all clocks ›
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
