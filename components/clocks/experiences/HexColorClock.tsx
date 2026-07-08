"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "hex-color-clock")!;

function pad2(n: number) { return String(n).padStart(2, "0"); }

function HexFace({ h, m, s }: { h: number; m: number; s: number }) {
  const r = Math.round((h / 23) * 255);
  const g = Math.round((m / 59) * 255);
  const b = Math.round((s / 59) * 255);
  const bg = `rgb(${r},${g},${b})`;
  const hex = `#${[r,g,b].map((v) => v.toString(16).padStart(2,"0")).join("").toUpperCase()}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 24px" }}>
      <style>{`@keyframes tgot-hex-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.035)}}`}</style>
      <div
        style={{
          width: 300,
          height: 220,
          borderRadius: 14,
          background: bg,
          border: "3px solid var(--border)",
          boxShadow: "6px 6px 0 var(--shadow-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 1s ease",
          animation: "tgot-hex-breathe 4s ease-in-out infinite",
        }}
      >
        <div style={{ background: "var(--bg-card)", border: "2px solid var(--border)", borderRadius: 10, padding: "16px 24px", textAlign: "center", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.06em", lineHeight: 1 }}>{hex}</p>
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.08em" }}>
        {pad2(h)}:{pad2(m)}:{pad2(s)}
      </div>
    </div>
  );
}

export default function HexColorClock() {
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
        <HexFace h={h} m={m} s={s} />
      </div>
    </ClockLayout>
  );
}
