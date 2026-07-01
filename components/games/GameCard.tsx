"use client";

import React from "react";
import Link from "next/link";
import { Game } from "@/lib/data/gamesRegistry";

const DIFFICULTY_LABEL: Record<Game["difficulty"], string> = {
  easy:   "Easy",
  medium: "Medium",
  hard:   "Hard",
  brutal: "Brutal",
};

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="group block relative overflow-hidden cursor-pointer h-[300px] transition-all duration-150"
      style={{
        textDecoration: "none",
        border: "var(--border-width) solid var(--border)",
        boxShadow: "var(--shadow-offset-lg) var(--shadow-color)",
        background: `color-mix(in srgb, var(--bg-card) 92%, ${game.accent} 8%)`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translate(-3px, -3px)";
        el.style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translate(0, 0)";
        el.style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)";
      }}
    >
      {/* Radial accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, color-mix(in srgb, ${game.accent} 10%, transparent), transparent 65%)`,
        }}
      />

      {/* Bottom gradient */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-bg-base/95 via-bg-base/50 to-transparent" />

      {/* Difficulty + play-time tags */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <span
          className="px-2.5 py-0.5 rounded-none font-sans text-[9px] font-bold tracking-wider uppercase"
          style={{
            color: "var(--section-games-text-on-accent)",
            background: game.accent,
            border: "var(--border-width-thin) solid var(--border)",
          }}
        >
          {DIFFICULTY_LABEL[game.difficulty]}
        </span>
        <span
          className="px-2.5 py-0.5 rounded-none font-sans text-[9px] font-bold tracking-wider uppercase text-text-faint bg-bg-card"
          style={{ border: "var(--border-width-thin) solid var(--border)" }}
        >
          {game.playTime}
        </span>
      </div>

      {/* Hover badge */}
      <span
        className="game-enter-badge absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-none font-sans text-xs font-bold opacity-0 translate-x-2"
        style={{
          transition: "opacity 150ms ease, transform 150ms ease",
          color: "var(--section-games-text-on-accent)",
          background: "var(--section-games-accent)",
          border: "var(--border-width-thin) solid var(--border)",
        }}
      >
        Play →
      </span>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-7">
        {/* Badge icons */}
        <div className="flex gap-1 mb-3">
          {game.badgeEmojis.map((emoji, i) => (
            <span key={i} className="text-base opacity-60">{emoji}</span>
          ))}
        </div>

        <h3
          className="font-display font-light text-text-primary leading-tight mb-2"
          style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)" }}
        >
          {game.name}
        </h3>
        <p className="font-sans text-[13px] text-text-muted leading-relaxed max-w-[380px]">
          {game.description}
        </p>
      </div>

      <style>{`
        .group:hover .game-enter-badge {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </Link>
  );
}
