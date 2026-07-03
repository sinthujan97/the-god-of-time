"use client";

import { useState, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "time-blindness")!;

type Phase = "idle" | "counting" | "judging";

interface Attempt {
  elapsed: number;
  target: number;
  error: number;
  errorPct: number;
}

const TARGETS = [
  { label: "30 sec", secs: 30 },
  { label: "1 min",  secs: 60 },
  { label: "5 min",  secs: 300 },
];

export default function TimeBlindnessTester() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetIdx, setTargetIdx] = useState(0);
  const [history, setHistory] = useState<Attempt[]>([]);
  const startRef = useRef(0);

  const target = TARGETS[targetIdx];

  function start() {
    startRef.current = Date.now();
    setPhase("counting");
  }

  function stop() {
    const elapsed = Date.now() - startRef.current;
    const targetMs = target.secs * 1000;
    const error = elapsed - targetMs;
    const errorPct = (error / targetMs) * 100;
    setHistory((prev) => [{ elapsed, target: targetMs, error, errorPct }, ...prev].slice(0, 8));
    setPhase("judging");
  }

  const last = history[0];

  return (
    <ClockLayout clock={clock}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* Target selector */}
        <div style={{ display: "flex", borderBottom: "2px solid var(--border)" }}>
          {TARGETS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => { if (phase !== "counting") { setTargetIdx(i); setPhase("idle"); } }}
              style={{
                flex: 1, padding: "12px 8px", border: "none",
                borderRight: i < TARGETS.length - 1 ? "2px solid var(--border)" : "none",
                background: targetIdx === i ? "var(--section-clocks-accent)" : "transparent",
                color: targetIdx === i ? "#000000" : "var(--text-muted)",
                fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                cursor: phase === "counting" ? "default" : "pointer",
                letterSpacing: "0.04em", transition: "background 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main area */}
        <div style={{ minHeight: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 32px" }}>
          {phase === "idle" && (
            <>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", textAlign: "center" }}>
                Time Blindness Test
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 300, lineHeight: 1.5 }}>
                Press START and count silently. Press STOP when you think exactly {target.label} has passed. No peeking at a clock.
              </p>
              <button
                onClick={start}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "14px 44px", border: "2px solid var(--border)", borderRadius: 8, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)", letterSpacing: "0.08em" }}
              >
                START
              </button>
            </>
          )}

          {phase === "counting" && (
            <>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text-muted)", textAlign: "center" }}>
                Counting…
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-faint)", textAlign: "center" }}>
                Stop when you feel {target.label} has passed
              </p>
              <button
                onClick={stop}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "14px 44px", border: "2px solid var(--border)", borderRadius: 8, background: "var(--destructive)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)", letterSpacing: "0.08em" }}
              >
                STOP
              </button>
            </>
          )}

          {phase === "judging" && last && (
            <>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 6 }}>
                  You stopped at
                </p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 54, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
                  {(last.elapsed / 1000).toFixed(2)}
                  <span style={{ fontSize: 22, color: "var(--text-muted)" }}>s</span>
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                  Target: {target.label} ({target.secs}s)
                </p>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { label: "Error", val: `${last.error > 0 ? "+" : ""}${(last.error / 1000).toFixed(2)}s`, color: Math.abs(last.error) < target.secs * 50 ? "var(--accent-utility-a)" : "var(--destructive)" },
                  { label: "Off by", val: `${last.errorPct > 0 ? "+" : ""}${last.errorPct.toFixed(1)}%`, color: Math.abs(last.errorPct) < 5 ? "var(--accent-utility-a)" : Math.abs(last.errorPct) < 15 ? "var(--accent-utility-d)" : "var(--destructive)" },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ textAlign: "center", border: "2px solid var(--border)", borderRadius: 8, padding: "14px 22px", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)", minWidth: 110 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setPhase("idle")}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "11px 30px", border: "2px solid var(--border)", borderRadius: 7, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)", letterSpacing: "0.06em" }}
              >
                TRY AGAIN
              </button>
            </>
          )}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div style={{ borderTop: "2px solid var(--border)", padding: "16px 24px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 10 }}>
              Recent Attempts
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {history.map((a, i) => {
                const tLabel = TARGETS.find((t) => t.secs * 1000 === a.target)?.label ?? `${a.target / 1000}s`;
                const earlyLate = a.error > 0 ? "late" : "early";
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 11, padding: "4px 0", borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <span style={{ color: "var(--text-faint)", width: 18, flexShrink: 0 }}>#{i + 1}</span>
                    <span style={{ color: "var(--text-muted)", width: 44, flexShrink: 0 }}>{tLabel}</span>
                    <span style={{ color: "var(--text-primary)" }}>{(a.elapsed / 1000).toFixed(2)}s</span>
                    <span style={{ marginLeft: "auto", color: a.error > 0 ? "var(--destructive)" : "var(--accent-utility-a)" }}>
                      {a.error > 0 ? "+" : ""}{(a.error / 1000).toFixed(2)}s {earlyLate} ({a.error > 0 ? "+" : ""}{a.errorPct.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
