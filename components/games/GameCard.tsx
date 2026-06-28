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
      className="group block relative rounded-xl border border-border bg-bg-card overflow-hidden cursor-pointer h-[300px] transition-all duration-300"
      style={{ textDecoration: "none" }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = game.accent;
        el.style.transform   = "scale(1.01)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.transform   = "scale(1)";
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
          className="px-2.5 py-0.5 rounded-full font-sans text-[9px] font-semibold tracking-wider uppercase border"
          style={{
            color:            game.accent,
            backgroundColor:  `color-mix(in srgb, ${game.accent} 10%, transparent)`,
            borderColor:      `color-mix(in srgb, ${game.accent} 28%, transparent)`,
          }}
        >
          {DIFFICULTY_LABEL[game.difficulty]}
        </span>
        <span className="px-2.5 py-0.5 rounded-full font-sans text-[9px] font-semibold tracking-wider uppercase border border-border text-text-faint bg-bg-surface/60">
          {game.playTime}
        </span>
      </div>

      {/* Hover badge */}
      <span
        className="game-enter-badge absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full font-sans text-xs font-medium text-text-primary bg-bg-card/80 border border-border/60 backdrop-blur-sm opacity-0 translate-x-2"
        style={{ transition: "opacity 300ms, transform 300ms" }}
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
