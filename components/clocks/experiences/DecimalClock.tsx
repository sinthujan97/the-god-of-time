"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "decimal-clock")!;

function pad2(n: number) { return String(n).padStart(2, "0"); }

function DecimalFace({ h, m, s }: { h: number; m: number; s: number }) {
  const frac = (h * 3600 + m * 60 + s) / 86400;
  const dh = Math.floor(frac * 10);
  const dm = Math.floor((frac * 1000) % 100);
  const ds = Math.floor((frac * 100000) % 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "48px 32px", minHeight: 220 }}>
      <style>{`@keyframes tgot-dec-glow{0%,100%{text-shadow:0 0 0 transparent}50%{text-shadow:0 0 18px var(--section-clocks-accent)}}`}</style>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "clamp(44px, 9vw, 78px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          letterSpacing: "0.04em",
          lineHeight: 1,
          animation: "tgot-dec-glow 3s ease-in-out infinite",
        }}
      >
        {dh}:{pad2(dm)}:{pad2(ds)}
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
        Decimal Time · 10h · 100min · 100sec
      </p>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(18px, 3.5vw, 28px)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", borderTop: "2px solid var(--border)", paddingTop: 16 }}>
        {pad2(h)}:{pad2(m)}:{pad2(s)} standard
      </div>
    </div>
  );
}

export default function DecimalClock() {
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
        <DecimalFace h={h} m={m} s={s} />
      </div>
    </ClockLayout>
  );
}
