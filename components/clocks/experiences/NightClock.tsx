"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "night-clock")!;

function pad2(n: number) { return String(n).padStart(2, "0"); }

const DIM_DELAY = 30000;

export default function NightClock() {
  const [now, setNow] = useState(new Date());
  const [dim, setDim] = useState(false);
  const [show24, setShow24] = useState(false);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdle = useCallback(() => {
    setDim(false);
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setDim(true), DIM_DELAY);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    resetIdle();
    return () => {
      clearInterval(iv);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [resetIdle]);

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();
  const display = show24
    ? `${pad2(h)}:${pad2(m)}`
    : `${pad2(h % 12 === 0 ? 12 : h % 12)}:${pad2(m)}`;
  const ampm = show24 ? null : (h < 12 ? "AM" : "PM");

  return (
    <ClockLayout clock={clock}>
      <div
        onMouseMove={resetIdle}
        onClick={resetIdle}
        onTouchStart={resetIdle}
        style={{
          minHeight: 340,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "48px 32px",
          background: "var(--bg-base)",
          cursor: "pointer",
          transition: "opacity 2.5s ease",
          opacity: dim ? 0.08 : 1,
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(60px, 14vw, 116px)", fontWeight: 200, color: "var(--text-primary)", letterSpacing: "0.04em", lineHeight: 1 }}>
            {display}
          </span>
          {ampm && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(18px, 4vw, 32px)", fontWeight: 300, color: "var(--text-muted)", alignSelf: "flex-end", marginBottom: "0.1em" }}>
              {ampm}
            </span>
          )}
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-faint)", letterSpacing: "0.06em" }}>
          {pad2(s)}s
        </span>
        {!dim && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginTop: 16 }}>
            Dims after 30s · move mouse or tap to restore
          </p>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: "12px 24px", borderTop: "2px solid var(--border)" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setShow24((v) => !v); resetIdle(); }}
          style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "8px 20px", border: "2px solid var(--border)", borderRadius: 6, background: show24 ? "var(--section-clocks-accent)" : "transparent", color: show24 ? "#000000" : "var(--text-muted)", cursor: "pointer", boxShadow: show24 ? "2px 2px 0 var(--shadow-color)" : "none", transition: "all 0.15s", textTransform: "uppercase", letterSpacing: "0.06em" }}
        >
          {show24 ? "24h" : "12h"}
        </button>
      </div>
    </ClockLayout>
  );
}
