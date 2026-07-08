"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "binary-clock")!;

const BIN_BITS = [8, 4, 2, 1];
const BIN_COLORS = ["var(--destructive)","var(--destructive)","var(--section-clocks-accent)","var(--section-clocks-accent)","var(--accent-utility-a)","var(--accent-utility-a)"];

function pad2(n: number) { return String(n).padStart(2, "0"); }

function BinaryFace({ h, m, s }: { h: number; m: number; s: number }) {
  const cols = [
    { d: Math.floor(h / 10), max: 2 }, { d: h % 10,           max: 9 },
    { d: Math.floor(m / 10), max: 5 }, { d: m % 10,           max: 9 },
    { d: Math.floor(s / 10), max: 5 }, { d: s % 10,           max: 9 },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "40px 24px" }}>
      <style>{`@keyframes tgot-bin-glow{0%,100%{box-shadow:0 0 0 0 currentColor}50%{box-shadow:0 0 10px 2px currentColor}}`}</style>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end" }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            {BIN_BITS.map((bit, bi) => {
              const active = (col.d & bit) !== 0;
              const relevant = bit <= col.max;
              return (
                <div
                  key={bi}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: active ? BIN_COLORS[ci] : relevant ? "var(--border)" : "transparent",
                    border: relevant ? `2px solid ${active ? BIN_COLORS[ci] : "var(--border)"}` : "none",
                    color: BIN_COLORS[ci],
                    transition: "background 0.25s, border-color 0.25s",
                    animation: active ? "tgot-bin-glow 1.8s ease-in-out infinite" : "none",
                  }}
                />
              );
            })}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: BIN_COLORS[ci], letterSpacing: "0.06em" }}>
              {["H","H","M","M","S","S"][ci]}
            </span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.08em" }}>
        {pad2(h)}:{pad2(m)}:{pad2(s)}
      </div>
    </div>
  );
}

export default function BinaryClock() {
  const [now, setNow] = useState(new Date(2026, 0, 1, 0, 0, 0));

  useEffect(() => {
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

  return (
    <ClockLayout clock={clock}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
        <BinaryFace h={h} m={m} s={s} />
      </div>
    </ClockLayout>
  );
}
