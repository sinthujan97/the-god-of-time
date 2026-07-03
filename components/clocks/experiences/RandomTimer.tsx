"use client";

import { useState, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "random-timer")!;

type Phase = "idle" | "running" | "revealed";

interface Result {
  secretMs: number;
  stoppedAt: number;
  error: number;
}

function randomDuration(): number {
  return (15 + Math.floor(Math.random() * 58) * 5) * 1000;
}

function fmt(ms: number): string {
  const s = Math.abs(ms) / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${String(Math.round(s % 60)).padStart(2, "0")}s`;
}

export default function RandomTimer() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [results, setResults] = useState<Result[]>([]);
  const secretRef = useRef(0);
  const startRef = useRef(0);

  function start() {
    secretRef.current = randomDuration();
    startRef.current = Date.now();
    setPhase("running");
  }

  function stop() {
    const stoppedAt = Date.now() - startRef.current;
    const error = stoppedAt - secretRef.current;
    setResults((prev) => [{ secretMs: secretRef.current, stoppedAt, error }, ...prev].slice(0, 6));
    setPhase("revealed");
  }

  const last = results[0];
  const best = results.length > 1
    ? results.reduce((b, r) => Math.abs(r.error) < Math.abs(b.error) ? r : b)
    : null;

  return (
    <ClockLayout clock={clock}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "40px 32px" }}>

          {phase === "idle" && (
            <>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--text-primary)", textAlign: "center" }}>
                Hidden Timer
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 300, lineHeight: 1.55 }}>
                A random timer between 15 seconds and 5 minutes will be set secretly. Press START, then press STOP the moment you feel the timer has run out.
              </p>
              <button
                onClick={start}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "14px 44px", border: "2px solid var(--border)", borderRadius: 8, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)", letterSpacing: "0.08em" }}
              >
                START
              </button>
            </>
          )}

          {phase === "running" && (
            <>
              <style>{`@keyframes tgot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.55;transform:scale(.9)}}`}</style>
              <div style={{ width: 80, height: 80, borderRadius: "50%", border: "3px solid var(--section-clocks-accent)", display: "flex", alignItems: "center", justifyContent: "center", animation: "tgot-pulse 1.6s ease-in-out infinite" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--section-clocks-accent)" }} />
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Timer Running</p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-faint)", textAlign: "center", maxWidth: 260 }}>
                Stop when you sense it has ended. Trust your instincts.
              </p>
              <button
                onClick={stop}
                style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "14px 44px", border: "2px solid var(--border)", borderRadius: 8, background: "var(--destructive)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)", letterSpacing: "0.08em" }}
              >
                STOP
              </button>
            </>
          )}

          {phase === "revealed" && last && (
            <>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 6 }}>
                  Secret timer was
                </p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 52, fontWeight: 700, color: "var(--section-clocks-accent)", lineHeight: 1 }}>
                  {fmt(last.secretMs)}
                </span>
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { label: "You stopped at", val: fmt(last.stoppedAt), color: "var(--text-primary)" },
                  {
                    label: last.error >= 0 ? "Too late by" : "Too early by",
                    val: fmt(last.error),
                    color: Math.abs(last.error) < 2000 ? "var(--accent-utility-a)"
                      : Math.abs(last.error) < 8000 ? "var(--accent-utility-d)"
                      : "var(--destructive)",
                  },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ textAlign: "center", border: "2px solid var(--border)", borderRadius: 8, padding: "14px 20px", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)", minWidth: 130 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              {best && (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)" }}>
                  Best so far: {fmt(Math.abs(best.error))} off across {results.length} attempts
                </p>
              )}
              <button
                onClick={start}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "11px 30px", border: "2px solid var(--border)", borderRadius: 7, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)", letterSpacing: "0.06em" }}
              >
                NEW TIMER
              </button>
            </>
          )}
        </div>

        {/* History */}
        {results.length > 0 && (
          <div style={{ borderTop: "2px solid var(--border)", padding: "16px 24px" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 10 }}>
              Past Attempts
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {results.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "var(--font-mono)", fontSize: 11, padding: "6px 0", borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ color: "var(--text-faint)", width: 18, flexShrink: 0 }}>#{i + 1}</span>
                  <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>Set: {fmt(r.secretMs)}</span>
                  <span style={{ color: "var(--text-primary)", flexShrink: 0 }}>Stopped: {fmt(r.stoppedAt)}</span>
                  <span style={{ marginLeft: "auto", flexShrink: 0, color: Math.abs(r.error) < 4000 ? "var(--accent-utility-a)" : "var(--destructive)" }}>
                    {r.error > 0 ? "+" : ""}{(r.error / 1000).toFixed(1)}s
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
