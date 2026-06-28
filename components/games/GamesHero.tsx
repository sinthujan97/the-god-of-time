"use client";

import React from "react";
import { gamesRegistry } from "@/lib/data/gamesRegistry";

export default function GamesHero() {
  const gameCount  = gamesRegistry.length;
  const badgeTypes = 4;

  return (
    <div
      className="relative w-full overflow-hidden text-center"
      style={{ padding: "120px 24px 80px", background: "var(--bg-base)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(240,168,48,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Floating badge icons */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        {[
          { emoji: "🥉", top: "18%", left:  "6%",  size: "2rem",  opacity: 0.22, rotate:  -12 },
          { emoji: "🥈", top: "32%", left:  "2%",  size: "1.4rem",opacity: 0.14, rotate:   8  },
          { emoji: "🥇", top: "12%", right: "8%",  size: "2.2rem",opacity: 0.20, rotate:   15 },
          { emoji: "💎", top: "40%", right: "3%",  size: "1.6rem",opacity: 0.15, rotate:  -6  },
          { emoji: "⏱️", top: "62%", left:  "5%",  size: "1.8rem",opacity: 0.10, rotate:   5  },
          { emoji: "⏸",  top: "70%", right: "6%",  size: "1.5rem",opacity: 0.12, rotate:  -10 },
        ].map((item, i) => (
          <span
            key={i}
            className="absolute font-sans"
            style={{
              top:     item.top,
              left:    item.left,
              right:   item.right,
              fontSize: item.size,
              opacity: item.opacity,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <p
          className="font-sans font-bold uppercase tracking-[0.22em] mb-6"
          style={{ fontSize: 10, color: "var(--accent-game)" }}
        >
          ✦ DAILY GAMES
        </p>

        <h1
          className="font-display font-light italic text-text-primary leading-[1.05] mb-6 text-balance"
          style={{ fontSize: "clamp(52px, 8vw, 88px)" }}
        >
          Play with Time
        </h1>

        <p
          className="font-sans text-text-muted leading-relaxed mx-auto mb-10"
          style={{ fontSize: 18, maxWidth: 560 }}
        >
          One game per day. Precision timing challenges where a single wrong press
          can cost you everything you've built.
        </p>

        {/* Stat strip */}
        <div
          className="inline-flex items-stretch border border-border rounded-xl overflow-hidden"
          style={{ background: "var(--bg-card)" }}
        >
          {[
            { num: String(gameCount),  label: gameCount === 1 ? "Game" : "Games" },
            { num: String(badgeTypes), label: "Badges" },
            { num: "1",                label: "Shot Per Day" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div className="w-px bg-border self-stretch" />}
              <div className="flex flex-col items-center gap-1 px-8 py-5">
                <span className="font-mono text-[2rem] text-text-primary leading-none">{stat.num}</span>
                <span
                  className="font-sans font-semibold uppercase tracking-[0.1em] text-text-muted"
                  style={{ fontSize: 11 }}
                >
                  {stat.label}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
