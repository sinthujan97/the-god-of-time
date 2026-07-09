"use client";

import { useState, useEffect, type CSSProperties } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "fibonacci-clock")!;

const FIBS = [1, 1, 2, 3, 5];
function fiboSubset(target: number): boolean[] {
  const used = [false, false, false, false, false];
  let rem = target;
  for (let i = 4; i >= 0; i--) {
    if (FIBS[i] <= rem) { used[i] = true; rem -= FIBS[i]; }
  }
  return rem === 0 ? used : [false, false, false, false, false];
}

function pad2(n: number) { return String(n).padStart(2, "0"); }

type ThemeColors = { hour: string; minute: string; both: string; unused: string; textOnColor: string };

const THEMES: Record<string, { label: string; colors: ThemeColors }> = {
  classic: {
    label: "Classic",
    colors: { hour: "var(--destructive)", minute: "var(--accent-utility-a)", both: "var(--section-clocks-accent)", unused: "var(--border)", textOnColor: "var(--section-clocks-text-on-accent)" },
  },
  ocean: {
    label: "Ocean",
    colors: { hour: "#0EA5E9", minute: "#14B8A6", both: "#6366F1", unused: "var(--border)", textOnColor: "#FFFFFF" },
  },
  sunset: {
    label: "Sunset",
    colors: { hour: "#F97316", minute: "#EC4899", both: "#FACC15", unused: "var(--border)", textOnColor: "#1A1A1A" },
  },
  neon: {
    label: "Neon",
    colors: { hour: "#FF2FD0", minute: "#22F0FF", both: "#A3FF12", unused: "var(--border)", textOnColor: "#0A0A0A" },
  },
  mono: {
    label: "Monochrome",
    colors: { hour: "#E5E5E5", minute: "#9CA3AF", both: "#FFFFFF", unused: "var(--border)", textOnColor: "#0A0A0A" },
  },
};

type Arrangement = "row" | "column" | "spiral";

const ARRANGEMENTS: Record<Arrangement, string> = {
  row: "Row",
  column: "Column",
  spiral: "Spiral Grid",
};

// Classic Fibonacci square-spiral tiling: two 1x1 squares, a 2x2, a 3x3,
// and a 5x5, packed edge-to-edge into a 5-wide x 8-tall golden rectangle —
// the layout the original physical Fibonacci Clock uses.
const SPIRAL_PLACEMENT = [
  { col: "1 / 2", row: "1 / 2" }, // size 1
  { col: "2 / 3", row: "1 / 2" }, // size 1
  { col: "1 / 3", row: "2 / 3" }, // size 2
  { col: "3 / 4", row: "1 / 3" }, // size 3
  { col: "1 / 4", row: "3 / 4" }, // size 5
];

function FibonacciFace({
  h, m, colors, rounded, arrangement,
}: {
  h: number; m: number; colors: ThemeColors; rounded: boolean; arrangement: Arrangement;
}) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const min5 = Math.round(m / 5) % 12;
  const hourUsed = fiboSubset(hour12);
  const minUsed  = fiboSubset(min5);
  const U = 30;
  const color = (i: number) =>
    hourUsed[i] && minUsed[i] ? colors.both
    : hourUsed[i] ? colors.hour
    : minUsed[i] ? colors.minute
    : colors.unused;

  const squareBase = (i: number): CSSProperties => ({
    background: color(i),
    border: "2px solid var(--border)",
    transition: "background 0.5s ease, border-radius 0.3s ease, transform 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: color(i) === colors.unused ? "none" : "tgot-fib-pop 0.5s ease-out",
  });

  const squares = FIBS.map((f, i) => {
    if (arrangement === "spiral") {
      return (
        <div
          key={i}
          style={{
            ...squareBase(i),
            gridColumn: SPIRAL_PLACEMENT[i].col,
            gridRow: SPIRAL_PLACEMENT[i].row,
            width: "100%",
            height: "100%",
            borderRadius: rounded ? 14 : 4,
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: Math.max(9, f * 6), fontWeight: 700, color: color(i) === colors.unused ? "var(--text-muted)" : colors.textOnColor, opacity: 0.85 }}>{f}</span>
        </div>
      );
    }
    return (
      <div
        key={i}
        style={{
          ...squareBase(i),
          width: f * U,
          height: f * U,
          borderRadius: rounded ? f * U * 0.5 : 4,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: Math.max(9, f * 6), fontWeight: 700, color: color(i) === colors.unused ? "var(--text-muted)" : colors.textOnColor, opacity: 0.85 }}>{f}</span>
      </div>
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 24px" }}>
      <style>{`@keyframes tgot-fib-pop{0%{transform:scale(0.7)}60%{transform:scale(1.08)}100%{transform:scale(1)}}`}</style>

      {arrangement === "spiral" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `${1 * U}px ${1 * U}px ${3 * U}px`,
            gridTemplateRows: `${1 * U}px ${2 * U}px ${5 * U}px`,
            gap: 4,
          }}
        >
          {squares}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: arrangement === "column" ? "column" : "row",
            gap: 4,
            alignItems: "flex-end",
          }}
        >
          {squares}
        </div>
      )}

      <div style={{ display: "flex", gap: 14 }}>
        {([ ["Hours", colors.hour], ["Minutes", colors.minute], ["Both", colors.both] ] as [string, string][]).map(([label, c]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, background: c, borderRadius: rounded ? "50%" : 2 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>{label}</span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.08em" }}>
        {pad2(h % 12 === 0 ? 12 : h % 12)}:{pad2(m)} {h < 12 ? "AM" : "PM"}
      </div>
    </div>
  );
}

export default function FibonacciClock() {
  const [now, setNow] = useState(new Date(2026, 0, 1, 0, 0, 0));
  const [themeKey, setThemeKey] = useState<string>("classic");
  const [rounded, setRounded] = useState(false);
  const [arrangement, setArrangement] = useState<Arrangement>("row");

  useEffect(() => {
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = now.getHours(), m = now.getMinutes();
  const theme = THEMES[themeKey] ?? THEMES.classic;

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
              Color Theme
            </span>
            <select
              value={themeKey}
              onChange={(e) => setThemeKey(e.target.value)}
              style={{
                height: 36,
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                border: "2px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                borderRadius: 4,
                padding: "0 8px",
              }}
            >
              {Object.entries(THEMES).map(([key, t]) => (
                <option key={key} value={key}>{t.label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
              Arrangement
            </span>
            <select
              value={arrangement}
              onChange={(e) => setArrangement(e.target.value as Arrangement)}
              style={{
                height: 36,
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                border: "2px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                borderRadius: 4,
                padding: "0 8px",
              }}
            >
              {Object.entries(ARRANGEMENTS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
              Block Shape
            </span>
            <button
              onClick={() => setRounded((v) => !v)}
              style={{
                height: 36,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: rounded ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                color: rounded ? "#0A0A0A" : "var(--text-muted)",
                cursor: "pointer",
                boxShadow: rounded ? "2px 2px 0 var(--shadow-color)" : "none",
                transition: "all 0.15s",
              }}
            >
              {rounded ? "Rounded" : "Square"}
            </button>
          </div>
        </div>
      }
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
        <FibonacciFace h={h} m={m} colors={theme.colors} rounded={rounded} arrangement={arrangement} />
      </div>
    </ClockLayout>
  );
}
