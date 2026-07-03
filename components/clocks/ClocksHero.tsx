"use client";

import React from "react";

export default function ClocksHero() {
  return (
    <div
      style={{
        position: "relative",
        padding: "120px 24px 80px",
        textAlign: "center",
        overflow: "hidden",
        background: "var(--bg-base)",
      }}
    >
      {/* Ticking dot grid background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--section-clocks-accent)",
            marginBottom: 24,
          }}
        >
          ✦ CLOCKS & TIMERS
        </p>

        <h1 className="poster-head poster-head--center" style={{ marginBottom: 24 }}>
          <span
            className="poster-head-sm"
            style={{ fontSize: "clamp(0.8rem, 2vw, 1.1rem)", color: "var(--text-muted)" }}
          >
            Every kind of
          </span>
          <span
            className="poster-head-lg poster-head-accent"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              ["--poster-accent" as string]: "var(--section-clocks-accent)",
            }}
          >
            Clock
          </span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 18,
            color: "var(--text-muted)",
            maxWidth: 600,
            margin: "0 auto 48px",
            lineHeight: 1.6,
          }}
        >
          Stopwatches, countdowns, world clocks, meditation bells, chess timers, ambient displays
          and more. All free. No sign-up.
        </p>

        {/* Stats */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "stretch",
            gap: 0,
            border: "1px solid var(--border)",
            borderRadius: 0,
            overflow: "hidden",
            background: "var(--bg-card)",
          }}
        >
          {[
            { num: "17", label: "Clocks" },
            { num: "5", label: "Categories" },
            { num: "100%", label: "Free" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div style={{ width: 1, background: "var(--border)", alignSelf: "stretch" }} />}
              <div
                style={{
                  padding: "20px 32px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 32,
                    color: "var(--section-clocks-accent)",
                    lineHeight: 1,
                  }}
                >
                  {stat.num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--text-muted)",
                  }}
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
