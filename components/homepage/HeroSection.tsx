"use client";

import React, { useState, useEffect } from "react";
import StarField from "./StarField";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [unixTime, setUnixTime] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Static value for Sun age in days: 4.603 billion years * 365.25 days
  const sunAgeDays = Math.floor(4.603e9 * 365.25);

  useEffect(() => {
    setMounted(true);
    setUnixTime(Math.floor(Date.now() / 1000));

    // Live ticking clock loop
    const clockInterval = setInterval(() => {
      setUnixTime(Math.floor(Date.now() / 1000));
    }, 1000);

    // Scroll listener for fading out scroll indicator
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(clockInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="relative h-screen w-full bg-bg-base overflow-hidden flex flex-col justify-center items-center select-none z-10">
      {/* 1. Canvas Starfield Background */}
      <StarField />

      {/* 2. Hero Content Area */}
      <div className="relative z-10 max-w-[800px] w-full px-6 flex flex-col items-center justify-center text-center">
        
        {/* Eyebrow */}
        <span 
          className="font-ui text-xs font-semibold uppercase tracking-[0.3em] text-accent-bio mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-both"
          style={{ animationDelay: "200ms" }}
        >
          ✦ THE GOD OF TIME
        </span>

        {/* Headline */}
        <h1 
          className="font-display font-light text-text-primary tracking-tight leading-[0.95] mb-8 select-none text-[64px] md:text-[80px] lg:text-[128px] animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both"
          style={{ animationDelay: "400ms" }}
        >
          Every Second<br />
          <em className="font-display italic text-accent-cosmos not-italic">Counts.</em>
        </h1>

        {/* Subheadline */}
        <p 
          className="font-ui text-[16px] md:text-[18px] lg:text-[20px] font-normal text-text-muted max-w-[560px] mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-both"
          style={{ animationDelay: "600ms" }}
        >
          100 precision time tools. Immersive cosmic experiences. From business day calculators to black hole gravity playgrounds.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-both"
          style={{ animationDelay: "800ms" }}
        >
          <a
            href="/tools/days-between-dates"
            className="h-[52px] px-8 bg-accent-cosmos text-white font-ui text-sm font-semibold uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(75,142,241,0.3)] hover:brightness-95 w-full sm:w-auto"
          >
            Explore Tools
          </a>
          <a
            href="/realms"
            className="h-[52px] px-8 bg-transparent text-text-primary border border-border hover:border-accent-cosmos hover:text-accent-cosmos font-ui text-sm font-semibold uppercase tracking-wider rounded-md inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 w-full sm:w-auto"
          >
            Enter the Realms
          </a>
        </div>

        {/* Live Counters */}
        <div 
          className="mt-16 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 w-full animate-in fade-in slide-in-from-bottom-5 duration-700 ease-out fill-mode-both"
          style={{ animationDelay: "1000ms" }}
        >
          {/* Counter 1: Unix Epoch Ticks */}
          <div className="flex flex-col items-center px-8 w-full md:w-auto">
            <span 
              className="font-mono text-[20px] md:text-[28px] text-text-primary tabular-nums tracking-tighter"
              suppressHydrationWarning
            >
              {mounted && unixTime !== null ? unixTime : "0000000000"}
            </span>
            <span className="font-ui text-[9px] md:text-[10px] font-semibold text-text-muted uppercase tracking-wider mt-1.5">
              SECONDS SINCE JAN 1 1970
            </span>
          </div>

          {/* Divider 1 */}
          <div className="hidden md:block w-px h-10 bg-border align-self-center" />

          {/* Counter 2: Days the Sun has existed */}
          <div className="hidden md:flex flex-col items-center px-8 w-full md:w-auto">
            <span className="font-mono text-[28px] text-text-primary tabular-nums tracking-tighter">
              {sunAgeDays.toLocaleString()}
            </span>
            <span className="font-ui text-[10px] font-semibold text-text-muted uppercase tracking-wider mt-1.5">
              DAYS THE SUN HAS EXISTED
            </span>
          </div>

          {/* Divider 2 */}
          <div className="hidden md:block w-px h-10 bg-border align-self-center" />

          {/* Counter 3: Current Unix Timestamp */}
          <div className="hidden md:flex flex-col items-center px-8 w-full md:w-auto">
            <span 
              className="font-mono text-[28px] text-text-primary tabular-nums tracking-tighter"
              suppressHydrationWarning
            >
              {mounted && unixTime !== null ? unixTime : "0000000000"}
            </span>
            <span className="font-ui text-[10px] font-semibold text-text-muted uppercase tracking-wider mt-1.5">
              YOUR UNIX TIMESTAMP
            </span>
          </div>
        </div>

      </div>

      {/* 3. Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none z-10 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: scrollY > 100 ? 0 : 0.6 }}
      >
        <span className="font-ui text-[10px] text-text-faint uppercase tracking-[0.2em]">
          Scroll
        </span>
        <div 
          className="w-px h-10 bg-linear-to-b from-text-faint to-transparent origin-top motion-safe:animate-[scrollPulse_2s_ease-in-out_infinite]"
          style={{
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style jsx global>{`
        @keyframes scrollPulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(1);
          }
          50% {
            opacity: 1;
            transform: scaleY(0.6);
          }
        }
      `}</style>
    </section>
  );
}
