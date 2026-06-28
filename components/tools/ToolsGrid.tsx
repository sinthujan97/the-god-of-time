"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { toolsRegistry, Tool, ToolGroup } from "@/lib/data/toolsRegistry";

// ── Emoji icon map per tool id ────────────────────────────────────────────────
const TOOL_ICONS: Record<string, string> = {
  "days-between-dates": "📅",
  "add-days-to-date": "➕",
  "subtract-days-from-date": "➖",
  "time-duration-calculator": "⏱️",
  "add-subtract-time": "🕐",
  "business-days-calculator": "💼",
  "business-days-with-holidays": "🏖️",
  "days-until-counter": "⏳",
  "days-since-counter": "📆",
  "day-of-week-finder": "🗓️",
  "day-of-year-converter": "🌍",
  "date-midpoint-calculator": "📍",
  "iso-week-number": "🔢",
  "leap-year-checker": "🦘",
  "perpetual-calendar": "♾️",
  "decimal-time-converter": "🔟",
  "military-time-converter": "🪖",
  "unix-timestamp-converter": "🖥️",
  "internet-time-converter": "🌐",
  "timezone-difference-grid": "🗺️",
  "timezone-abbreviations": "🏷️",
  "timezone-map-finder": "📡",
  "world-time-converter": "🌏",
  "multi-city-clock": "🏙️",
  "utc-gmt-offset": "📻",
  "dst-tracker": "🌅",
  "solar-noon-tracker": "☀️",
  "solar-vs-standard-time": "🌤️",
  "zulu-time-coordinator": "✈️",
  "date-line-simulator": "🌐",
  "cross-border-deadline": "🛃",
  "meeting-planner": "🤝",
  "remote-team-overlap": "👥",
  "time-card-calculator": "🕔",
  "time-card-with-breaks": "☕",
  "overtime-hours-calculator": "💪",
  "working-hours-tracker": "📊",
  "shift-sleep-adjuster": "😴",
  "pomodoro-time-segmenter": "🍅",
  "screen-break-timer": "👁️",
  "millisecond-timer": "⚡",
  "time-percentage-calculator": "📈",
  "hourly-to-salary": "💰",
  "salary-to-hourly": "💵",
  "overtime-pay-calculator": "💸",
  "gross-to-net-pay": "🧾",
  "semi-monthly-pay": "📑",
  "payroll-period-planner": "📋",
  "furlough-pay-calculator": "🏠",
  "shift-differential-pay": "🌙",
  "labor-cost-tracker": "🏗️",
  "commission-by-hour": "💹",
  "multi-job-income-sync": "🔄",
  "annual-work-hours": "📅",
  "billable-hours-tracker": "🧮",
  "retainer-burndown": "🔥",
  "freelance-capacity-planner": "🎯",
  "fractional-executive": "📐",
  "pto-accrual-calculator": "🌴",
  "biweekly-timesheet": "📝",
  "sprint-date-calculator": "🏃",
  "project-back-planner": "🗺️",
  "lead-time-calculator": "📦",
  "gantt-chart-date-calculator": "📉",
  "milestone-buffer-calculator": "🎯",
  "campaign-deployment-timeline": "🚀",
  "cpm-critical-path-float": "🔗",
  "sla-countdown-timer": "⏰",
  "court-deadline-calculator": "⚖️",
  "statutory-notice-period": "📜",
  "document-retention-expiry": "🗃️",
  "tenancy-notice": "🏠",
  "loan-maturity-date": "🏦",
  "interest-day-count": "💳",
  "invoice-due-date-calculator": "📧",
  "subscription-renewal-schedule": "🔁",
  "delivery-slip-risk": "📬",
  "downtime-uptime-calculator": "🖧",
  "age-calculator": "🎂",
  "pregnancy-due-date": "🍼",
  "trimester-calendar": "🤰",
  "ovulation-calculator": "🌸",
  "medication-scheduler": "💊",
  "vaccination-tracker": "💉",
  "sleep-calculator": "🌙",
  "fasting-planner": "🥗",
  "nicotine-detox": "🚭",
  "alcohol-clearance": "🍷",
  "caffeine-half-life": "☕",
  "pet-age-translator": "🐾",
  "habit-streak-planner": "🔥",
  "leap-second-log": "🕰️",
  "ntp-latency-tester": "📡",
  "gps-time-correction": "🛰️",
  "fiscal-quarter-calculator": "🏢",
  "golden-hour-tracker": "🌇",
  "flight-duration-calculator": "✈️",
  "recurring-event-rrule": "🔄",
  "event-countdown-back-timer": "🎉",
};

// ── Category tab list ─────────────────────────────────────────────────────────
const ALL_TAB = { id: "all", label: "All Tools" };

// ── Individual tool card ──────────────────────────────────────────────────────
function ToolCard({ tool, accent }: { tool: Tool; accent: string }) {
  const icon = TOOL_ICONS[tool.id] ?? "🔧";
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="tool-index-card"
      style={{ "--card-accent": accent } as React.CSSProperties}
    >
      {/* Icon thumbnail */}
      <div className="tool-index-card__icon">
        <span>{icon}</span>
      </div>

      {/* Text */}
      <div className="tool-index-card__body">
        <h3 className="tool-index-card__name">{tool.name}</h3>
        <p className="tool-index-card__desc">{tool.description}</p>
      </div>

      {/* Arrow */}
      <span className="tool-index-card__arrow">→</span>
    </Link>
  );
}

// ── Main Grid ─────────────────────────────────────────────────────────────────
export default function ToolsGrid() {
  const [activeGroup, setActiveGroup] = useState("all");
  const [search, setSearch] = useState("");

  const tabs = [ALL_TAB, ...toolsRegistry.map((g) => ({ id: g.id, label: g.name }))];

  const filteredGroups = useMemo<ToolGroup[]>(() => {
    const groups =
      activeGroup === "all" ? toolsRegistry : toolsRegistry.filter((g) => g.id === activeGroup);

    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups
      .map((g) => ({
        ...g,
        tools: g.tools.filter(
          (t) =>
            t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.tools.length > 0);
  }, [activeGroup, search]);

  const totalVisible = filteredGroups.reduce((acc, g) => acc + g.tools.length, 0);

  return (
    <div className="tools-index-page">
      {/* ── Sticky filter bar ── */}
      <div className="tools-index-filterbar">
        <div className="tools-index-filterbar__inner">
          {/* Search */}
          <div className="tools-index-search">
            <span className="tools-index-search__icon">⌕</span>
            <input
              type="text"
              placeholder="Search tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="tools-index-search__input"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="tools-index-search__clear"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="tools-index-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveGroup(tab.id)}
                className={`tools-index-tab${activeGroup === tab.id ? " tools-index-tab--active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tool groups ── */}
      <div className="tools-index-content">
        {filteredGroups.length === 0 && (
          <div className="tools-index-empty">
            No tools match "{search}". Try a different search term.
          </div>
        )}

        {filteredGroups.map((group) => (
          <section key={group.id} id={group.id} className="tools-index-group">
            {/* Group heading */}
            <div className="tools-index-group__header">
              <span
                className="tools-index-group__dot"
                style={{ background: group.accent }}
              />
              <h2 className="tools-index-group__name">{group.name}</h2>
              <span className="tools-index-group__count">{group.tools.length} tools</span>
            </div>

            {/* 3-column card grid */}
            <div className="tools-index-grid">
              {group.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} accent={group.accent} />
              ))}
            </div>
          </section>
        ))}

        {totalVisible > 0 && search && (
          <p className="tools-index-results-count">
            Showing {totalVisible} tool{totalVisible !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ── Styles ── */}
      <style>{`
        /* Page wrapper */
        .tools-index-page {
          background: var(--bg-base);
          min-height: 100vh;
        }

        /* Filter bar */
        .tools-index-filterbar {
          position: sticky;
          top: 64px;
          z-index: 40;
          background: var(--bg-base);
          border-bottom: 1px solid var(--border);
        }
        .tools-index-filterbar__inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Search */
        .tools-index-search {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--bg-surface);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 0 12px;
          height: 40px;
          transition: border-color 150ms;
        }
        .tools-index-search:focus-within {
          border-color: var(--text-primary);
        }
        .tools-index-search__icon {
          font-size: 18px;
          color: var(--text-faint);
          line-height: 1;
          margin-top: -2px;
        }
        .tools-index-search__input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-ui);
          font-size: 14px;
          color: var(--text-primary);
          outline: none;
        }
        .tools-index-search__input::placeholder {
          color: var(--text-faint);
        }
        .tools-index-search__clear {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-faint);
          font-size: 12px;
          padding: 0;
          line-height: 1;
        }

        /* Category tabs */
        .tools-index-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tools-index-tab {
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 500;
          padding: 5px 14px;
          border-radius: 999px;
          border: 1.5px solid transparent;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 140ms;
          white-space: nowrap;
        }
        .tools-index-tab:hover {
          color: var(--text-primary);
          border-color: var(--border);
        }
        .tools-index-tab--active {
          background: var(--text-primary);
          color: var(--bg-base);
          border-color: var(--text-primary);
        }

        /* Content area */
        .tools-index-content {
          max-width: 1280px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        /* Group section */
        .tools-index-group__header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }
        .tools-index-group__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tools-index-group__name {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 400;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.01em;
        }
        .tools-index-group__count {
          font-family: var(--font-ui);
          font-size: 12px;
          color: var(--text-faint);
          margin-left: auto;
        }

        /* 3-column grid */
        .tools-index-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
        }

        /* Tool card */
        .tool-index-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 18px;
          background: var(--bg-card);
          text-decoration: none;
          transition: background 140ms;
          position: relative;
          min-height: 80px;
        }
        .tool-index-card:hover {
          background: var(--bg-card-hover, color-mix(in srgb, var(--card-accent, var(--border)) 6%, var(--bg-card)));
          z-index: 1;
        }
        .tool-index-card:hover .tool-index-card__name {
          color: var(--card-accent, var(--text-primary));
        }
        .tool-index-card:hover .tool-index-card__arrow {
          opacity: 1;
          transform: translateX(0);
        }

        /* Icon box */
        .tool-index-card__icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          background: var(--bg-surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          transition: border-color 140ms;
        }
        .tool-index-card:hover .tool-index-card__icon {
          border-color: var(--card-accent, var(--border));
        }

        /* Text body */
        .tool-index-card__body {
          flex: 1;
          min-width: 0;
        }
        .tool-index-card__name {
          font-family: var(--font-ui);
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 3px;
          line-height: 1.3;
          transition: color 140ms;
          /* truncate long names */
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .tool-index-card__desc {
          font-family: var(--font-ui);
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        /* Arrow indicator */
        .tool-index-card__arrow {
          font-size: 14px;
          color: var(--card-accent, var(--text-muted));
          flex-shrink: 0;
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 140ms, transform 140ms;
        }

        /* Empty state */
        .tools-index-empty {
          text-align: center;
          padding: 80px 24px;
          font-family: var(--font-ui);
          font-size: 15px;
          color: var(--text-faint);
        }

        /* Results count */
        .tools-index-results-count {
          font-family: var(--font-ui);
          font-size: 13px;
          color: var(--text-faint);
          text-align: center;
          margin: -32px 0 0;
        }

        /* Responsive */
        @media (max-width: 960px) {
          .tools-index-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .tools-index-grid {
            grid-template-columns: 1fr;
          }
          .tools-index-filterbar__inner {
            padding: 12px 16px;
          }
          .tools-index-content {
            padding: 32px 16px 60px;
          }
        }
      `}</style>
    </div>
  );
}
