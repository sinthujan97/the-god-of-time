"use client";

import { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "countdown")!;

interface Timer {
  id: string;
  label: string;
  totalMs: number;
  remainingMs: number;
  isRunning: boolean;
  isComplete: boolean;
}

function pad2(n: number) { return String(Math.floor(n)).padStart(2, "0"); }
function formatMs(ms: number) {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${pad2(h)}:${pad2(m % 60)}:${pad2(s % 60)}` : `${pad2(m % 60)}:${pad2(s % 60)}`;
}

let audioCtx: AudioContext | null = null;
function playBell() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const ctx = audioCtx;
    [0, 0.4, 0.8].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = [880, 1046, 1318][i];
      gain.gain.setValueAtTime(0.35, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.2);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.2);
    });
  } catch {}
}

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

export default function CountdownTimer() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(5);
  const [secs, setSecs] = useState(0);
  const [label, setLabel] = useState("");
  const idRef = useRef(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimers((prev) => {
        if (prev.every((t) => !t.isRunning)) return prev;
        let titleTimer: Timer | null = null;
        const next = prev.map((t) => {
          if (!t.isRunning || t.isComplete) return t;
          const rem = Math.max(0, t.remainingMs - 100);
          const done = rem === 0;
          if (done) playBell();
          if (!titleTimer) titleTimer = { ...t, remainingMs: rem };
          return { ...t, remainingMs: rem, isComplete: done, isRunning: !done };
        });
        if (titleTimer) {
          document.title = `${formatMs((titleTimer as Timer).remainingMs)} — ${(titleTimer as Timer).label} | God of Time`;
        }
        return next;
      });
    }, 100);
    return () => {
      clearInterval(iv);
    };
  }, []);

  function addTimer() {
    const totalMs = (hrs * 3600 + mins * 60 + secs) * 1000;
    if (totalMs === 0) return;
    idRef.current += 1;
    const id = String(idRef.current);
    setTimers((prev) => [...prev, {
      id, label: label.trim() || `Timer ${id}`,
      totalMs, remainingMs: totalMs,
      isRunning: false, isComplete: false,
    }]);
    setLabel("");
  }

  function toggle(id: string) {
    setTimers((prev) => prev.map((t) => t.id === id && !t.isComplete ? { ...t, isRunning: !t.isRunning } : t));
  }

  function resetTimer(id: string) {
    setTimers((prev) => prev.map((t) => t.id === id ? { ...t, remainingMs: t.totalMs, isRunning: false, isComplete: false } : t));
  }

  function removeTimer(id: string) {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <ClockLayout clock={clock} controlsSection={
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        {[
          { val: hrs, set: setHrs, lbl: "h", max: 23 },
          { val: mins, set: setMins, lbl: "m", max: 59 },
          { val: secs, set: setSecs, lbl: "s", max: 59 },
        ].map(({ val, set, lbl, max }) => (
          <div key={lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <input
              type="number" min={0} max={max} value={val}
              onChange={(e) => set(Math.min(max, Math.max(0, Number(e.target.value))))}
              style={{ width: 56, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
            />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>{lbl}</span>
          </div>
        ))}
        <input
          type="text" placeholder="Label (optional)" value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTimer()}
          style={{ fontFamily: "var(--font-ui)", fontSize: 13, padding: "9px 12px", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4, flex: "1 1 130px", minWidth: 0 }}
        />
        <button
          onClick={addTimer}
          style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "11px 18px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}
        >
          + ADD
        </button>
      </div>
    }>
      <div style={{ padding: "40px 32px 32px", minHeight: 300 }}>
        {timers.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220 }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
              Set a time below and press + ADD to start.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {timers.map((t) => {
              const progress = t.totalMs > 0 ? t.remainingMs / t.totalMs : 0;
              const dashOffset = CIRC * (1 - progress);
              return (
                <div key={t.id} style={{ flex: "1 1 190px", minWidth: 170, maxWidth: 240, background: "var(--bg-surface)", border: "2px solid var(--border)", borderRadius: 10, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
                  <button
                    onClick={() => removeTimer(t.id)}
                    style={{ position: "absolute", top: 8, right: 8, fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 6px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", color: "var(--text-faint)", lineHeight: 1 }}
                  >
                    ✕
                  </button>

                  {/* SVG ring */}
                  <div style={{ position: "relative", width: 126, height: 126 }}>
                    <svg width={126} height={126} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={63} cy={63} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={8} />
                      <circle
                        cx={63} cy={63} r={RADIUS} fill="none"
                        stroke={t.isComplete ? "var(--accent-utility-a)" : "var(--section-clocks-accent)"}
                        strokeWidth={8}
                        strokeDasharray={CIRC}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.08s linear" }}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: t.totalMs > 3_600_000 ? 18 : 24, fontWeight: 700, color: t.isComplete ? "var(--accent-utility-a)" : "var(--text-primary)" }}>
                        {t.isComplete ? "✓" : formatMs(t.remainingMs)}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.label}
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    {!t.isComplete && (
                      <button onClick={() => toggle(t.id)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "5px 12px", border: "2px solid var(--border)", borderRadius: 4, background: t.isRunning ? "var(--destructive)" : "var(--section-clocks-accent)", color: "#000000", cursor: "pointer" }}>
                        {t.isRunning ? "PAUSE" : "START"}
                      </button>
                    )}
                    <button onClick={() => resetTimer(t.id)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "5px 12px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer" }}>
                      RST
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
