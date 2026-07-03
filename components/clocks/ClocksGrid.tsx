"use client";

import React from "react";
import { clocksRegistry, CLOCK_CATEGORIES, type ClockEntry } from "@/lib/data/clocksRegistry";
import ClockCard from "./ClockCard";

const CATEGORY_ORDER: ClockEntry["category"][] = ["precision", "world", "specialty", "ambient", "fun"];

export default function ClocksGrid() {
  const toolClocks = clocksRegistry.filter((c) => c.isExistingTool);

  return (
    <div style={{ background: "var(--bg-surface)", padding: "80px 24px 120px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexDirection: "column", gap: 72 }}>

        {CATEGORY_ORDER.map((catId) => {
          const cat = CLOCK_CATEGORIES[catId];
          const clocks = clocksRegistry.filter((c) => c.category === catId && !c.isExistingTool);
          if (clocks.length === 0) return null;
          return (
            <section key={catId} id={catId}>
              {/* Category header */}
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "inline-block",
                    height: 3,
                    width: 40,
                    background: cat.accent,
                    marginBottom: 12,
                  }}
                />
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(22px, 3vw, 30px)",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    marginBottom: 6,
                    lineHeight: 1.1,
                  }}
                >
                  {cat.name}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    color: "var(--text-muted)",
                  }}
                >
                  {cat.tagline}
                </p>
              </div>

              {/* Grid */}
              <div
                className="clocks-grid-inner"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 20,
                }}
              >
                {clocks.map((clock) => (
                  <ClockCard key={clock.id} clock={clock} accent={cat.accent} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Also in Tools section */}
        {toolClocks.length > 0 && (
          <section id="also-in-tools">
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  display: "inline-block",
                  height: 3,
                  width: 40,
                  background: "var(--text-muted)",
                  marginBottom: 12,
                }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(22px, 3vw, 30px)",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  lineHeight: 1.1,
                }}
              >
                Also Available in Tools
              </h2>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>
                These time tools live in the Utility Tools section — click to open them there.
              </p>
            </div>
            <div
              className="clocks-grid-inner"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 20,
              }}
            >
              {toolClocks.map((clock) => (
                <ClockCard key={clock.id} clock={clock} accent="var(--text-muted)" />
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) { .clocks-grid-inner { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .clocks-grid-inner { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
