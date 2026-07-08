"use client";

import { useState, useEffect } from "react";
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

function FibonacciFace({ h, m }: { h: number; m: number }) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const min5 = Math.round(m / 5) % 12;
  const hourUsed = fiboSubset(hour12);
  const minUsed  = fiboSubset(min5);
  const U = 30;
  const color = (i: number) =>
    hourUsed[i] && minUsed[i] ? "var(--section-clocks-accent)"
    : hourUsed[i] ? "var(--destructive)"
    : minUsed[i] ? "var(--accent-utility-a)"
    : "var(--border)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 24px" }}>
      <style>{`@keyframes tgot-fib-pop{0%{transform:scale(0.7)}60%{transform:scale(1.08)}100%{transform:scale(1)}}`}</style>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
        {FIBS.map((f, i) => (
          <div
            key={i}
            style={{
              width: f * U,
              height: f * U,
              background: color(i),
              border: "2px solid var(--border)",
              borderRadius: 4,
              transition: "background 0.5s ease, transform 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: color(i) === "var(--border)" ? "none" : "tgot-fib-pop 0.5s ease-out",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: Math.max(9, f * 6), fontWeight: 700, color: color(i) === "var(--border)" ? "var(--text-muted)" : "var(--section-clocks-text-on-accent)", opacity: 0.8 }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {([ ["Hours", "var(--destructive)"], ["Minutes", "var(--accent-utility-a)"], ["Both", "var(--section-clocks-accent)"] ] as [string,string][]).map(([label, c]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
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

  useEffect(() => {
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = now.getHours(), m = now.getMinutes();

  return (
    <ClockLayout clock={clock}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280 }}>
        <FibonacciFace h={h} m={m} />
      </div>
    </ClockLayout>
  );
}
