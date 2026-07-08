"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "word-clock")!;

const HOUR_W = ["twelve","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"];
const MIN_PHRASES: [number, string][] = [
  [0,"o'clock"],[5,"five past"],[10,"ten past"],[15,"quarter past"],
  [20,"twenty past"],[25,"twenty-five past"],[30,"half past"],
  [35,"twenty-five to"],[40,"twenty to"],[45,"quarter to"],[50,"ten to"],[55,"five to"],
];

function pad2(n: number) { return String(n).padStart(2, "0"); }

function WordFace({ h, m, s }: { h: number; m: number; s: number }) {
  const rounded = Math.round(m / 5) * 5 % 60;
  const isTo = rounded > 30;
  const dh = isTo ? (h + 1) % 24 : h;
  const hourWord = HOUR_W[dh % 12 === 0 ? 0 : dh % 12];
  const [, phrase] = MIN_PHRASES.find(([min]) => min === rounded) ?? [0, "o'clock"];
  const text = phrase === "o'clock" ? `${hourWord}\no'clock` : `${phrase}\n${hourWord}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "40px 32px", minHeight: 220 }}>
      <style>{`@keyframes tgot-word-fade{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}`}</style>
      <p
        key={text}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(26px, 5vw, 48px)",
          fontWeight: 800,
          color: "var(--text-primary)",
          textAlign: "center",
          lineHeight: 1.25,
          textTransform: "uppercase",
          letterSpacing: "0.03em",
          whiteSpace: "pre-line",
          animation: "tgot-word-fade 0.5s ease-out",
        }}
      >
        {text}
      </p>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(18px, 3.5vw, 28px)", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", borderTop: "2px solid var(--border)", paddingTop: 16 }}>
        {pad2(h)}:{pad2(m)}:{pad2(s)}
      </div>
    </div>
  );
}

export default function WordClock() {
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
        <WordFace h={h} m={m} s={s} />
      </div>
    </ClockLayout>
  );
}
