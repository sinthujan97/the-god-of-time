"use client";

import { useState, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "reaction-time")!;

type State = "idle" | "armed" | "ready" | "result" | "tooearly";

const HUMAN_AVG_MS = 250;

export default function ReactionTimeTester() {
  const [state, setState] = useState<State>("idle");
  const [reactionMs, setReactionMs] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readyAt = useRef(0);

  function clearTimer() {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }

  function handleClick() {
    if (state === "idle" || state === "result" || state === "tooearly") {
      setState("armed");
      timerRef.current = setTimeout(() => {
        readyAt.current = Date.now();
        setState("ready");
      }, 1000 + Math.random() * 3000);
    } else if (state === "armed") {
      clearTimer();
      setState("tooearly");
    } else if (state === "ready") {
      const ms = Date.now() - readyAt.current;
      setReactionMs(ms);
      setHistory((prev) => [ms, ...prev].slice(0, 10));
      setState("result");
    }
  }

  const avg = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null;
  const best = history.length > 0 ? Math.min(...history) : null;

  const bgColor =
    state === "ready"    ? "color-mix(in srgb, var(--accent-utility-a) 12%, var(--bg-surface))"
    : state === "tooearly" ? "color-mix(in srgb, var(--destructive) 10%, var(--bg-surface))"
    : "var(--bg-surface)";

  return (
    <ClockLayout clock={clock}>
      <div
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === " " || e.key === "Enter" ? handleClick() : null}
        style={{ minHeight: 360, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "48px 32px", cursor: "pointer", background: bgColor, transition: "background 0.15s ease", userSelect: "none" }}
      >
        {state === "idle" && (
          <>
            <span style={{ fontSize: 48 }}>⚡</span>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 800, color: "var(--text-primary)", textAlign: "center" }}>How fast are you?</p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center", maxWidth: 320 }}>
              Click anywhere to start. Wait for green, then click as fast as you can.
            </p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "11px 28px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--section-clocks-accent)", color: "#000000", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              START
            </div>
          </>
        )}

        {state === "armed" && (
          <>
            <div style={{ width: 160, height: 160, borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Wait…</span>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>Don&apos;t click yet</p>
          </>
        )}

        {state === "ready" && (
          <div style={{ width: 160, height: 160, borderRadius: "50%", background: "var(--accent-utility-a)", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: "#000000", textTransform: "uppercase", letterSpacing: "0.1em" }}>CLICK!</span>
          </div>
        )}

        {state === "tooearly" && (
          <>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--destructive)" }}>Too early!</p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>Wait for the green circle. Click to try again.</p>
          </>
        )}

        {state === "result" && (
          <>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--text-muted)", marginBottom: 8 }}>Your time</p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 72, fontWeight: 700, color: "var(--section-clocks-accent)", lineHeight: 1 }}>{reactionMs}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, color: "var(--text-muted)" }}> ms</span>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: reactionMs < HUMAN_AVG_MS ? "var(--accent-utility-a)" : "var(--text-muted)" }}>
              {reactionMs < HUMAN_AVG_MS
                ? `${HUMAN_AVG_MS - reactionMs}ms faster than average`
                : `${reactionMs - HUMAN_AVG_MS}ms slower than average`}{" "}
              <span style={{ color: "var(--text-faint)" }}>(avg: {HUMAN_AVG_MS}ms)</span>
            </p>
            {avg !== null && best !== null && (
              <div style={{ display: "flex", gap: 32, marginTop: 4 }}>
                {[{ label: `Avg (${history.length})`, val: `${avg}ms`, color: "var(--text-primary)" },
                  { label: "Best", val: `${best}ms`, color: "var(--accent-utility-a)" }].map((s) => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 700, color: s.color }}>{s.val}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)" }}>Click anywhere to try again</p>
          </>
        )}
      </div>
    </ClockLayout>
  );
}
