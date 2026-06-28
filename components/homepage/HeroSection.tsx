"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import StarField from "./StarField";

const SUN_AGE_DAYS = Math.floor(4.603e9 * 365.25);

function getHeartbeatsToday(): number {
  const now = new Date();
  const s = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  return Math.floor(s * (70 / 60));
}

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [unixTime, setUnixTime] = useState<number | null>(null);
  const [heartbeats, setHeartbeats] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUnixTime(Math.floor(Date.now() / 1000));
    setHeartbeats(getHeartbeatsToday());

    const interval = setInterval(() => {
      setUnixTime(Math.floor(Date.now() / 1000));
      setHeartbeats(getHeartbeatsToday());
    }, 1000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative h-screen w-full bg-bg-base overflow-hidden flex flex-col justify-center z-10 select-none">
      <StarField />

      {/* Content — left-aligned, viewport-wide */}
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-16 lg:px-20 flex flex-col">

        {/* Headline block */}
        <div
          className="mb-7 md:mb-9 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-both"
          style={{ animationDelay: "200ms" }}
        >
          <h1>
            <span className="block font-ui text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-text-muted/60 mb-3 md:mb-4">
              Every Second
            </span>
            <em
              className="block font-display font-light text-text-primary leading-[0.85]"
              style={{
                fontSize: "clamp(3.5rem, 14vw, 8rem)",
                letterSpacing: "-0.03em",
              }}
            >
              Counts.
            </em>
          </h1>
        </div>

        {/* Subheadline */}
        <p
          className="font-ui text-[14px] md:text-[16px] text-text-muted max-w-[500px] leading-relaxed mb-9 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "440ms" }}
        >
          100 precision time tools. Immersive cosmic experiences.
          From business day calculators to black hole gravity playgrounds.
        </p>

        {/* Instrument panel — live data */}
        <div
          className="mb-9 md:mb-12 animate-in fade-in duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "640ms" }}
        >
          <div className="inline-flex border border-border divide-x divide-border">
            {/* Counter 1: Unix timestamp */}
            <div className="flex flex-col px-4 sm:px-5 py-3 sm:py-4 min-w-[110px] sm:min-w-[140px]">
              <span
                className="font-mono text-[16px] sm:text-[20px] md:text-[24px] text-text-primary tabular-nums tracking-tighter leading-none"
                suppressHydrationWarning
              >
                {mounted && unixTime !== null ? unixTime.toLocaleString() : "—"}
              </span>
              <span className="font-ui text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.12em] text-text-muted mt-2 whitespace-nowrap">
                Unix Timestamp
              </span>
            </div>

            {/* Counter 2: Days the Sun has existed */}
            <div className="hidden sm:flex flex-col px-5 py-4 min-w-[140px]">
              <span className="font-mono text-[20px] md:text-[24px] text-text-primary tabular-nums tracking-tighter leading-none">
                {SUN_AGE_DAYS.toLocaleString()}
              </span>
              <span className="font-ui text-[9px] font-bold uppercase tracking-[0.12em] text-text-muted mt-2 whitespace-nowrap">
                Days Sun Existed
              </span>
            </div>

            {/* Counter 3: Estimated heartbeats today */}
            <div className="hidden md:flex flex-col px-5 py-4 min-w-[140px]">
              <span
                className="font-mono text-[20px] md:text-[24px] text-text-primary tabular-nums tracking-tighter leading-none"
                suppressHydrationWarning
              >
                {mounted && heartbeats !== null ? heartbeats.toLocaleString() : "—"}
              </span>
              <span className="font-ui text-[9px] font-bold uppercase tracking-[0.12em] text-text-muted mt-2 whitespace-nowrap">
                Your Heartbeats Today
              </span>
            </div>
          </div>
        </div>

        {/* CTA buttons — below the data, per brief */}
        <div
          className="flex flex-col sm:flex-row gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out fill-mode-both"
          style={{ animationDelay: "840ms" }}
        >
          <Link
            href="/tools"
            className="h-[50px] px-7 bg-accent-cosmos text-white font-ui text-[12px] font-bold uppercase tracking-[0.1em] rounded-[6px] inline-flex items-center gap-2 shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[4px_4px_0px_0px_var(--accent-cosmos)] hover:brightness-95 transition-all duration-150 w-full sm:w-auto"
          >
            Explore Tools
          </Link>
          <Link
            href="/realms"
            className="h-[50px] px-7 bg-transparent text-text-primary border border-border hover:border-accent-cosmos hover:text-accent-cosmos font-ui text-[12px] font-bold uppercase tracking-[0.1em] rounded-[6px] inline-flex items-center gap-2 transition-all duration-150 w-full sm:w-auto"
          >
            Enter the Realms →
          </Link>
        </div>
      </div>

      {/* Scroll indicator — matches content left edge */}
      <div
        className="absolute bottom-8 left-6 sm:left-10 md:left-16 lg:left-20 flex items-center gap-3 z-10 pointer-events-none transition-opacity duration-500"
        style={{ opacity: scrollY > 80 ? 0 : 0.45 }}
      >
        <div className="w-8 h-px bg-text-faint" />
        <span className="font-ui text-[9px] text-text-faint uppercase tracking-[0.25em]">
          Scroll
        </span>
      </div>
    </section>
  );
}
