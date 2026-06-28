"use client";

import React from "react";
import Link from "next/link";
import { gamesRegistry } from "@/lib/data/gamesRegistry";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

const ACCENT = "#F0A830";

export default function GamesSection() {
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.05 });
  const game = gamesRegistry[0];
  if (!game) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full py-28 px-6"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-14">
          <div className="max-w-lg">
            <span
              className="font-sans text-[11px] font-bold uppercase tracking-[0.25em] block mb-3"
              style={{ color: ACCENT }}
            >
              ✦ DAILY GAMES
            </span>
            <h2 className="font-display font-light italic text-text-primary leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
              One shot. Every day.
            </h2>
            <p className="font-sans text-base text-text-muted mt-3 leading-relaxed max-w-[460px]">
              Precision timing games where missing the first move costs you everything you've collected.
            </p>
          </div>

          <Link
            href="/games"
            className="font-sans text-sm font-semibold lg:mb-2 shrink-0 inline-flex items-center gap-1.5 hover:underline"
            style={{ color: ACCENT }}
          >
            All games →
          </Link>
        </div>

        {/* Featured game card */}
        <Link
          href={`/games/${game.slug}`}
          className={`group relative flex flex-col md:flex-row overflow-hidden rounded-xl border border-border bg-bg-card cursor-pointer transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ textDecoration: "none", transitionProperty: "opacity, transform, border-color" }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = ACCENT;
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.borderColor = "var(--border)";
          }}
        >
          {/* Left: clock visualisation */}
          <div
            className="relative flex-shrink-0 w-full md:w-[340px] h-[220px] md:h-auto flex flex-col items-center justify-center gap-4 overflow-hidden"
            style={{ background: "var(--bg-base)" }}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 40%, rgba(240,168,48,0.12) 0%, transparent 70%)`,
              }}
            />

            {/* Decorative clock digits */}
            <div className="relative z-10 flex gap-3 items-center select-none">
              {["14", "37", "22", "456"].map((val, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <span className="font-mono font-bold text-text-faint" style={{ fontSize: "1.6rem" }}>:</span>
                  )}
                  <span
                    className="font-mono font-bold tabular-nums"
                    style={{
                      fontSize: i === 3 ? "1.8rem" : "2.2rem",
                      color: i === 0 ? ACCENT : "var(--text-faint)",
                      opacity: i === 0 ? 1 : 0.35 + i * 0.1,
                    }}
                  >
                    {val}
                  </span>
                </React.Fragment>
              ))}
            </div>

            {/* Freeze button hint */}
            <div
              className="relative z-10 px-6 py-2 rounded-lg font-sans font-bold text-xs uppercase tracking-[0.14em] select-none"
              style={{
                background: ACCENT,
                color: "#06060A",
                boxShadow: `3px 3px 0px 0px rgba(240,168,48,0.3)`,
              }}
            >
              ⏸ FREEZE
            </div>

            {/* Badge row */}
            <div className="relative z-10 flex gap-2 text-xl opacity-60 select-none">
              {["🥉", "🥈", "🥇", "💎"].map((b, i) => (
                <span key={i}>{b}</span>
              ))}
            </div>
          </div>

          {/* Right: info */}
          <div className="flex flex-col justify-center p-8 md:p-10">
            {/* Tags */}
            <div className="flex gap-2 mb-5">
              <span
                className="px-2.5 py-0.5 rounded-full font-sans text-[9px] font-semibold tracking-wider uppercase border"
                style={{
                  color:           ACCENT,
                  backgroundColor: "rgba(240,168,48,0.08)",
                  borderColor:     "rgba(240,168,48,0.25)",
                }}
              >
                Brutal
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-sans text-[9px] font-semibold tracking-wider uppercase border border-border text-text-faint">
                Daily
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-sans text-[9px] font-semibold tracking-wider uppercase border border-border text-text-faint">
                ~1 min
              </span>
            </div>

            <h3
              className="font-display font-light text-text-primary leading-tight mb-3"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
            >
              {game.name}
            </h3>

            <p className="font-sans text-sm text-text-muted leading-relaxed mb-6 max-w-[420px]">
              {game.description}
            </p>

            {/* How badges work */}
            <div className="flex flex-col gap-1.5">
              {[
                { emoji: "🥉", text: "Freeze the hour" },
                { emoji: "🥈", text: "+ freeze the minute" },
                { emoji: "🥇", text: "+ freeze the second" },
                { emoji: "💎", text: "+ freeze the millisecond" },
              ].map(({ emoji, text }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <span className="text-base w-5 flex-shrink-0">{emoji}</span>
                  <span className="font-sans text-xs text-text-muted">{text}</span>
                </div>
              ))}
            </div>

            {/* Hover CTA */}
            <div
              className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300"
              style={{ color: ACCENT }}
            >
              Play today's game →
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
