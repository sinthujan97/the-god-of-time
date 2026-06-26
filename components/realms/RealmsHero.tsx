"use client";

import React from "react";
import StarField from "@/components/homepage/StarField";

export default function RealmsHero() {
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
      {/* Starfield background */}
      <StarField />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 12,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "var(--accent-cosmos)",
            marginBottom: 24,
          }}
        >
          ✦ FUN REALMS
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(56px, 8vw, 96px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--text-primary)",
            marginBottom: 24,
            lineHeight: 1.05,
          }}
        >
          Enter a Realm
        </h1>

        {/* Subheadline */}
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
          25 immersive experiences where physics bends, time distorts, and
          curiosity is the only instrument you need.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "stretch",
            gap: 0,
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--bg-card)",
          }}
        >
          {[
            { num: "25", label: "Realms" },
            { num: "9", label: "AI-Powered" },
            { num: "∞", label: "Discoveries" },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && (
                <div
                  style={{
                    width: 1,
                    background: "var(--border)",
                    alignSelf: "stretch",
                  }}
                />
              )}
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
                    color: "var(--text-primary)",
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
