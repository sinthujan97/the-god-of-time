"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "ramen-timer")!;

const PRESETS = [
  { label: "2:00", seconds: 120 },
  { label: "3:00", seconds: 180 },
  { label: "3:30", seconds: 210 },
  { label: "4:00", seconds: 240 },
];

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function fmt(s: number) {
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

let audioCtx: AudioContext | null = null;
function playRamenBell() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const ctx = audioCtx;
    [0, 0.28, 0.56].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = [660, 880, 1100][i];
      gain.gain.setValueAtTime(0.28, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.7);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.7);
    });
  } catch {}
}

const R = 90;
const CIRC = 2 * Math.PI * R;

export default function RamenTimer() {
  const [totalSecs, setTotalSecs] = useState(180);
  const [secsLeft, setSecsLeft] = useState(180);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const selectPreset = (secs: number) => {
    clearTimer();
    setRunning(false);
    setDone(false);
    setTotalSecs(secs);
    setSecsLeft(secs);
  };

  const start = () => {
    if (running || secsLeft <= 0) return;
    setDone(false);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setSecsLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          setRunning(false);
          setDone(true);
          playRamenBell();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pause = () => {
    clearTimer();
    setRunning(false);
  };

  const reset = () => {
    clearTimer();
    setRunning(false);
    setDone(false);
    setSecsLeft(totalSecs);
  };

  const progress = totalSecs > 0 ? 1 - secsLeft / totalSecs : 0;
  const dashOffset = CIRC * (1 - progress);

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
            Cook Time
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.seconds}
              onClick={() => selectPreset(p.seconds)}
              disabled={running}
              style={{
                height: 36,
                padding: "0 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: totalSecs === p.seconds ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                color: totalSecs === p.seconds ? "#0A0A0A" : "var(--text-muted)",
                cursor: running ? "not-allowed" : "pointer",
                opacity: running ? 0.5 : 1,
                boxShadow: totalSecs === p.seconds ? "2px 2px 0 var(--shadow-color)" : "none",
                transition: "all 0.15s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, padding: "40px 24px", minHeight: 320 }}>
        <style>{`
          @keyframes tgot-ramen-steam {
            0% { transform: translateY(0) scaleX(1); opacity: 0; }
            15% { opacity: 0.55; }
            85% { opacity: 0.2; }
            100% { transform: translateY(-34px) scaleX(1.4); opacity: 0; }
          }
          @keyframes tgot-ramen-bob {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}</style>

        <div style={{ position: "relative", width: 220, height: 220 }}>
          <svg width={220} height={220} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={110} cy={110} r={R} fill="none" stroke="var(--border)" strokeWidth={10} />
            <circle
              cx={110}
              cy={110}
              r={R}
              fill="none"
              stroke={done ? "var(--accent-utility-a)" : "var(--section-clocks-accent)"}
              strokeWidth={10}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <div style={{ position: "relative", fontSize: 56, animation: running ? "tgot-ramen-bob 1.6s ease-in-out infinite" : "none" }}>
              🍜
              {running && (
                <>
                  <span style={{ position: "absolute", left: "30%", top: -6, fontSize: 14, animation: "tgot-ramen-steam 2.2s ease-in-out infinite" }}>﹍</span>
                  <span style={{ position: "absolute", left: "55%", top: -10, fontSize: 14, animation: "tgot-ramen-steam 2.2s ease-in-out infinite 0.7s" }}>﹍</span>
                  <span style={{ position: "absolute", left: "45%", top: -14, fontSize: 14, animation: "tgot-ramen-steam 2.2s ease-in-out infinite 1.4s" }}>﹍</span>
                </>
              )}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em" }}>
              {fmt(secsLeft)}
            </div>
          </div>
        </div>

        <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 600, color: done ? "var(--accent-utility-a)" : "var(--text-muted)", textAlign: "center", minHeight: 20 }}>
          {done ? "Noodles are ready!" : running ? "Cooking…" : "Ready when you are."}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {!running ? (
            <button
              onClick={start}
              disabled={secsLeft <= 0}
              style={{
                height: 44,
                padding: "0 28px",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                border: "2px solid var(--border)",
                borderRadius: 8,
                background: "var(--section-clocks-accent)",
                color: "#0A0A0A",
                cursor: secsLeft <= 0 ? "not-allowed" : "pointer",
                opacity: secsLeft <= 0 ? 0.5 : 1,
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              Start
            </button>
          ) : (
            <button
              onClick={pause}
              style={{
                height: 44,
                padding: "0 28px",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                border: "2px solid var(--border)",
                borderRadius: 8,
                background: "var(--bg-surface)",
                color: "var(--text-primary)",
                cursor: "pointer",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
            >
              Pause
            </button>
          )}
          <button
            onClick={reset}
            style={{
              height: 44,
              padding: "0 24px",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              border: "2px solid var(--border)",
              borderRadius: 8,
              background: "transparent",
              color: "var(--text-muted)",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </ClockLayout>
  );
}
