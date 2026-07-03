"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "pomodoro")!;

type PomoPhase = "work" | "short-break" | "long-break";

const DURATIONS: Record<PomoPhase, number> = {
  "work": 25 * 60,
  "short-break": 5 * 60,
  "long-break": 15 * 60,
};

const SEQUENCE: PomoPhase[] = [
  "work", "short-break",
  "work", "short-break",
  "work", "short-break",
  "work", "long-break",
];

const PHASE_LABEL: Record<PomoPhase, string> = {
  "work": "FOCUS",
  "short-break": "SHORT BREAK",
  "long-break": "LONG BREAK",
};

const PHASE_COLOR: Record<PomoPhase, string> = {
  "work": "var(--section-clocks-accent)",
  "short-break": "var(--accent-utility-a)",
  "long-break": "var(--accent-utility-d)",
};

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtSecs(s: number) { return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; }
function todayStr() { return new Date().toISOString().slice(0, 10); }

let audioCtx: AudioContext | null = null;
function playBell() {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    const ctx = audioCtx;
    [0, 0.35, 0.7].forEach((t, i) => {
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = [880, 1046, 1318][i];
      gain.gain.setValueAtTime(0.3, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.9);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.9);
    });
  } catch {}
}

function loadStorage() {
  try {
    const date = localStorage.getItem("pomo_date");
    const completed = date === todayStr() ? Number(localStorage.getItem("pomo_completed") ?? 0) : 0;
    const streak = Number(localStorage.getItem("pomo_streak") ?? 0);
    return { completed, streak };
  } catch { return { completed: 0, streak: 0 }; }
}

const R = 90;
const CIRC = 2 * Math.PI * R;

export default function PomodoroTimer() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secsLeft, setSecsLeft] = useState(DURATIONS["work"]);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(() => loadStorage().completed);
  const [streak] = useState(() => loadStorage().streak);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(secsLeft);
  const phaseIdxRef = useRef(0);
  secsRef.current = secsLeft;
  phaseIdxRef.current = phaseIdx;

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

  function advance() {
    clearIv();
    setRunning(false);
    const currentPhase = SEQUENCE[phaseIdxRef.current];
    const nextIdx = (phaseIdxRef.current + 1) % SEQUENCE.length;
    if (currentPhase === "work") {
      const newCount = completed + 1;
      setCompleted(newCount);
      try {
        localStorage.setItem("pomo_completed", String(newCount));
        localStorage.setItem("pomo_date", todayStr());
      } catch {}
      try {
        if (Notification.permission === "granted") {
          new Notification("Pomodoro complete!", { body: "Take a break." });
        }
      } catch {}
    }
    playBell();
    setPhaseIdx(nextIdx);
    setSecsLeft(DURATIONS[SEQUENCE[nextIdx]]);
  }

  function startStop() {
    if (running) {
      clearIv();
      setRunning(false);
    } else {
      try { if (Notification.permission === "default") Notification.requestPermission(); } catch {}
      setRunning(true);
      ivRef.current = setInterval(() => {
        const next = secsRef.current - 1;
        if (next <= 0) { advance(); } else { setSecsLeft(next); }
      }, 1000);
    }
  }

  function skip() {
    clearIv(); setRunning(false);
    const nextIdx = (phaseIdx + 1) % SEQUENCE.length;
    setPhaseIdx(nextIdx);
    setSecsLeft(DURATIONS[SEQUENCE[nextIdx]]);
  }

  function reset() {
    clearIv(); setRunning(false);
    setPhaseIdx(0);
    setSecsLeft(DURATIONS["work"]);
  }

  useEffect(() => {
    if (running) document.title = `${fmtSecs(secsLeft)} — Pomodoro | God of Time`;
    return () => { if (!running) document.title = ""; };
  }, [secsLeft, running]);

  useEffect(() => () => clearIv(), []);

  const phase = SEQUENCE[phaseIdx];
  const total = DURATIONS[phase];
  const ringOffset = CIRC * (1 - secsLeft / total);
  const accentColor = PHASE_COLOR[phase];

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Today</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 700, color: "var(--section-clocks-accent)", lineHeight: 1 }}>{completed}</span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>sessions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Streak</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, fontWeight: 700, color: "var(--accent-utility-d)", lineHeight: 1 }}>{streak}</span>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>days 🔥</span>
          </div>
          {/* Session progress dots */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {SEQUENCE.map((p, i) => (
              <div
                key={i}
                title={`${i + 1}. ${PHASE_LABEL[p]}`}
                style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${i === phaseIdx ? PHASE_COLOR[p] : "var(--border)"}`,
                  background: i < phaseIdx ? PHASE_COLOR[p] : "transparent",
                  transition: "background 0.3s, border-color 0.3s",
                }}
              />
            ))}
          </div>
        </div>
      }
    >
      <div style={{ minHeight: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "48px 32px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor }}>
          {PHASE_LABEL[phase]} · {Math.floor(phaseIdx / 2) + 1} of 4
        </span>

        {/* Circular ring */}
        <div style={{ position: "relative", width: 216, height: 216 }}>
          <svg width={216} height={216} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={108} cy={108} r={R} fill="none" stroke="var(--border)" strokeWidth={10} />
            <circle
              cx={108} cy={108} r={R}
              fill="none" stroke={accentColor} strokeWidth={10}
              strokeDasharray={CIRC} strokeDashoffset={ringOffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.4s ease" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 46, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
              {fmtSecs(secsLeft)}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={startStop}
            style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 28px", border: "2px solid var(--border)", borderRadius: 6, background: running ? "var(--destructive)" : accentColor, color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}
          >
            {running ? "PAUSE" : "START"}
          </button>
          <button onClick={skip} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 18px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
            SKIP →
          </button>
          <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 14px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
            ↺
          </button>
        </div>
      </div>
    </ClockLayout>
  );
}
