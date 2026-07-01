"use client";

import React from "react";
import StarField from "@/components/homepage/StarField";
import { toolsRegistry } from "@/lib/data/toolsRegistry";

export default function ToolsHero() {
  const totalTools = toolsRegistry.reduce((acc, g) => acc + g.tools.length, 0);
  const totalGroups = toolsRegistry.length;

  return (
    <div
      style={{
        position: "relative",
        padding: "120px 24px 80px",
        textAlign: "center",
        overflow: "hidden",
        background: "var(--bg-base)",
        borderBottom: "1px solid var(--border)",
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
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "var(--accent-utility-a)",
            marginBottom: 24,
          }}
        >
          ✦ UTILITY TOOLS
        </p>

        {/* Headline */}
        <h1 className="poster-head poster-head--center" style={{ marginBottom: 24 }}>
          <span
            className="poster-head-sm"
            style={{ fontSize: "clamp(0.8rem, 2vw, 1.1rem)", color: "var(--text-muted)" }}
          >
            {totalTools}+ Precision
          </span>
          <span
            className="poster-head-lg poster-head-accent"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
              ["--poster-accent" as string]: "var(--accent-utility-a)",
            }}
          >
            Time
          </span>
          <span
            className="poster-head-lg poster-head-outline"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 7rem)",
            }}
          >
            Tools
          </span>
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
          Every calculator, converter, and planner you need for dates, time zones, payroll, 
          project management, health, and beyond. Organised across {totalGroups} categories.
        </p>

        {/* Stats row */}
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
            { num: String(totalTools), label: "Tools" },
            { num: String(totalGroups), label: "Categories" },
            { num: "100%", label: "Free & Open" },
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
