"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const ACCENT = "var(--section-tools-accent)";

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

function LiveClock() {
  const [h, setH] = useState("--");
  const [m, setM] = useState("--");
  const [s, setS] = useState("--");
  const [ms, setMs] = useState("---");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setH(pad(now.getHours()));
      setM(pad(now.getMinutes()));
      setS(pad(now.getSeconds()));
      setMs(pad(now.getMilliseconds(), 3));
      setDateStr(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    tick();
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, []);

  const units = [
    { label: "HR", value: h, sm: false },
    { label: "MIN", value: m, sm: false },
    { label: "SEC", value: s, sm: false },
    { label: "MS", value: ms, sm: true },
  ];

  return (
    <div
      style={{
        border: "var(--border-width) solid var(--border)",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-card)",
        boxShadow: "var(--shadow-offset-lg) var(--shadow-color)",
        overflow: "hidden",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 18px",
          borderBottom: "1px solid var(--border-subtle)",
          background: "var(--bg-surface)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            color: ACCENT,
          }}
        >
          ◎ LIVE
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-faint)",
            letterSpacing: "0.04em",
          }}
        >
          {dateStr}
        </span>
      </div>

      {/* Time digit boxes */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
          padding: "20px 18px 16px",
        }}
      >
        {units.map(({ label, value, sm }) => (
          <div
            key={label}
            style={{
              border: "var(--border-width) solid var(--border)",
              borderRadius: "var(--radius-sm)",
              background: "var(--bg-base)",
              boxShadow: "var(--shadow-offset-sm) var(--shadow-color)",
              padding: sm ? "12px 4px" : "12px 8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: sm ? "1.3rem" : "2rem",
                fontWeight: 700,
                color: ACCENT,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {value}
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 8,
                letterSpacing: "0.18em",
                color: "var(--text-faint)",
                marginTop: 7,
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Stats strip */}
      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {[
          { n: "100+", label: "Tools" },
          { n: "3", label: "Games" },
          { n: "1", label: "Realm" },
        ].map(({ n, label }, i) => (
          <div
            key={label}
            style={{
              padding: "14px 10px",
              textAlign: "center",
              borderRight: i < 2 ? "1px solid var(--border-subtle)" : "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1,
              }}
            >
              {n}
            </div>
            <div
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 10,
                color: "var(--text-faint)",
                marginTop: 4,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const words = ["CALCULATOR.", "SIMULATOR.", "PLAYGROUND.", "OBSESSION.", "EVERYTHING."];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setFade(true);
      }, 800); // 800ms transition for a slow crossfade
    }, 8000); // every 8 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full bg-bg-base overflow-hidden select-none"
      style={{
        paddingTop: "clamp(72px, 12vw, 120px)",
        paddingBottom: "clamp(72px, 12vw, 120px)",
      }}
    >
      {/* Background: faint watermark time numbers */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden
      >
        {(["23", "59", "00", "47", "12"] as const).map((num, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: ACCENT,
              opacity: 0.025,
              userSelect: "none",
              lineHeight: 1,
              fontSize: `clamp(5rem, ${9 + i * 3}vw, 16rem)`,
              top: ["8%", "48%", "72%", "18%", "62%"][i],
              left: ["8%", "62%", "28%", "82%", "48%"][i],
              transform: "translate(-50%, -50%)",
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* Subtle lime gradient top-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 80% -10%, color-mix(in srgb, var(--section-tools-accent) 6%, transparent) 0%, transparent 55%)",
        }}
      />

      {/* Main grid */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_460px] gap-14 lg:gap-20 items-center">

          {/* ── Left: text + CTAs ── */}
          <div>
            {/* Badge */}
            <span
              className="badge-brutal badge-brutal-filled animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out fill-mode-both"
              style={{ animationDelay: "60ms" }}
            >
              ✦ The God of Time
            </span>

            {/* Headline */}
            <h1
              className="poster-head mt-6 animate-in fade-in slide-in-from-bottom-4 duration-600 ease-out fill-mode-both"
              style={{ animationDelay: "120ms" }}
            >
              <span
                className="poster-head-lg poster-head-accent"
                style={{
                  fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
                }}
              >
                EVERY SECOND
              </span>
              <span
                className="poster-head-lg poster-head-accent"
                style={{
                  fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
                }}
              >
                HAS A
              </span>
              <span
                className="poster-head-lg poster-head-accent"
                style={{
                  fontSize: "clamp(2.8rem, 7.5vw, 5.5rem)",
                  ["--poster-accent" as string]: ACCENT,
                  opacity: fade ? 1 : 0,
                  transition: "opacity 800ms ease-in-out",
                  display: "inline-block",
                  color: "#00b415ff",
                }}
              >
                {words[wordIndex]}
              </span>
            </h1>

            {/* Sub */}
            <p
              className="font-ui text-[17px] text-text-muted leading-relaxed max-w-[460px] mt-5 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out fill-mode-both"
              style={{ animationDelay: "200ms" }}
            >
              100+ precision time tools for business, health &amp; planning.
              Daily mental games. An immersive realm. All free, no account needed.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-both"
              style={{ animationDelay: "280ms" }}
            >
              <Link href="/tools" className="btn-brutal btn-brutal-primary">
                Explore 100+ Tools →
              </Link>
              <Link href="/games" className="btn-brutal">
                Play Today's Game
              </Link>
              <Link href="/realms" className="btn-brutal">
                Enter Realm
              </Link>
            </div>

            {/* Feature checks */}
            <div
              className="flex flex-wrap gap-5 mt-7 animate-in fade-in duration-500 ease-out fill-mode-both"
              style={{ animationDelay: "360ms" }}
            >
              {["No signup", "Instant results", "100% free forever"].map((text) => (
                <span
                  key={text}
                  className="font-ui text-[11px] font-bold uppercase tracking-[0.1em] text-text-muted flex items-center gap-1.5"
                >
                  <span style={{ color: ACCENT }}>✓</span>
                  {text}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Live clock ── */}
          <div
            className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both"
            style={{ animationDelay: "160ms" }}
          >
            <LiveClock />
          </div>

        </div>
      </div>
    </section>
  );
}
