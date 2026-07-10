"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "pomodoro")!;

type PomoPhase = "work" | "short-break" | "long-break";

const SEQUENCE: PomoPhase[] = [
  "work", "short-break",
  "work", "short-break",
  "work", "short-break",
  "work", "long-break",
];

const PHASE_LABEL: Record<PomoPhase, string> = {
  "work": "FOCUS BLOCK",
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

// Synthesized Sound Profile Players
function playTickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1600;
    gain.gain.setValueAtTime(0.005, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.01);
    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {}
}

function triggerSound(profile: "bell" | "beep" | "chord" | "none") {
  if (profile === "none") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (profile === "beep") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 950;
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else if (profile === "chord") {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      });
    } else {
      // Default arpeggiated bells
      [0, 0.35, 0.7].forEach((t, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = [880, 1046, 1318][i];
        gain.gain.setValueAtTime(0.12, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.9);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.9);
      });
    }
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
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(() => loadStorage().completed);
  const [streak] = useState(() => loadStorage().streak);

  // Stateful customized durations
  const [workMins, setWorkMins] = useState(25);
  const [shortBreakMins, setShortBreakMins] = useState(5);
  const [longBreakMins, setLongBreakMins] = useState(15);

  // Auto start settings
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartFocus, setAutoStartFocus] = useState(false);

  // Sound selections
  const [soundProfile, setSoundProfile] = useState<"bell" | "beep" | "chord" | "none">("bell");
  const [enableTicking, setEnableTicking] = useState(false);

  // Todo / Focus task string
  const [focusTask, setFocusTask] = useState("");

  // Secs state relative to current configurations
  const getPhaseDurationSecs = (p: PomoPhase) => {
    if (p === "work") return workMins * 60;
    if (p === "short-break") return shortBreakMins * 60;
    return longBreakMins * 60;
  };

  const [secsLeft, setSecsLeft] = useState(() => workMins * 60);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(secsLeft);
  const phaseIdxRef = useRef(0);
  const workMinsRef = useRef(workMins);
  const shortBreakMinsRef = useRef(shortBreakMins);
  const longBreakMinsRef = useRef(longBreakMins);
  const autoStartBreaksRef = useRef(autoStartBreaks);
  const autoStartFocusRef = useRef(autoStartFocus);
  const soundProfileRef = useRef(soundProfile);
  const enableTickingRef = useRef(enableTicking);

  secsRef.current = secsLeft;
  phaseIdxRef.current = phaseIdx;
  workMinsRef.current = workMins;
  shortBreakMinsRef.current = shortBreakMins;
  longBreakMinsRef.current = longBreakMins;
  autoStartBreaksRef.current = autoStartBreaks;
  autoStartFocusRef.current = autoStartFocus;
  soundProfileRef.current = soundProfile;
  enableTickingRef.current = enableTicking;

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

  const advance = () => {
    clearIv();
    
    const currentPhase = SEQUENCE[phaseIdxRef.current];
    const nextIdx = (phaseIdxRef.current + 1) % SEQUENCE.length;
    const nextPhase = SEQUENCE[nextIdx];

    // Handle completed work sessions
    if (currentPhase === "work") {
      const newCount = completed + 1;
      setCompleted(newCount);
      try {
        localStorage.setItem("pomo_completed", String(newCount));
        localStorage.setItem("pomo_date", todayStr());
      } catch {}
      try {
        if (Notification.permission === "granted") {
          new Notification("Pomodoro completed!", { body: "Work block completed. Take a break!" });
        }
      } catch {}
    }

    triggerSound(soundProfileRef.current);
    setPhaseIdx(nextIdx);

    const nextDur = nextPhase === "work" ? workMinsRef.current * 60 : nextPhase === "short-break" ? shortBreakMinsRef.current * 60 : longBreakMinsRef.current * 60;
    setSecsLeft(nextDur);
    secsRef.current = nextDur;

    // Evaluate auto-start triggers
    const autoTrigger = (currentPhase === "work" && autoStartBreaksRef.current) || (currentPhase !== "work" && autoStartFocusRef.current);
    if (autoTrigger) {
      setTimeout(() => {
        setRunning(true);
        setStarted(true);
        ivRef.current = setInterval(() => {
          const nextVal = secsRef.current - 1;
          if (nextVal <= 0) {
            advance();
          } else {
            setSecsLeft(nextVal);
            if (enableTickingRef.current && SEQUENCE[phaseIdxRef.current] === "work") {
              playTickSound();
            }
          }
        }, 1000);
      }, 150);
    } else {
      setRunning(false);
    }
  };

  const startStop = () => {
    if (running) {
      clearIv(); setRunning(false);
    } else {
      setStarted(true);
      try { if (Notification.permission === "default") Notification.requestPermission(); } catch {}
      setRunning(true);
      ivRef.current = setInterval(() => {
        const nextVal = secsRef.current - 1;
        if (nextVal <= 0) {
          advance();
        } else {
          setSecsLeft(nextVal);
          if (enableTickingRef.current && SEQUENCE[phaseIdxRef.current] === "work") {
            playTickSound();
          }
        }
      }, 1000);
    }
  };

  function skip() {
    clearIv(); setRunning(false);
    const nextIdx = (phaseIdx + 1) % SEQUENCE.length;
    const nextPhase = SEQUENCE[nextIdx];
    setPhaseIdx(nextIdx);
    
    const nextDur = nextPhase === "work" ? workMins * 60 : nextPhase === "short-break" ? shortBreakMins * 60 : longBreakMins * 60;
    setSecsLeft(nextDur);
    secsRef.current = nextDur;
  }

  function reset() {
    clearIv(); setRunning(false); setStarted(false);
    setPhaseIdx(0);
    const s = workMins * 60;
    setSecsLeft(s); secsRef.current = s;
  }

  // Reactive duration display updates
  useEffect(() => {
    if (!started) {
      const currentPhase = SEQUENCE[phaseIdx];
      const nextDur = currentPhase === "work" ? workMins * 60 : currentPhase === "short-break" ? shortBreakMins * 60 : longBreakMins * 60;
      setSecsLeft(nextDur);
      secsRef.current = nextDur;
    }
  }, [workMins, shortBreakMins, longBreakMins, phaseIdx, started]);

  useEffect(() => {
    if (running) document.title = `${fmtSecs(secsLeft)} — Pomodoro | God of Time`;
    return () => { if (!running) document.title = ""; };
  }, [secsLeft, running]);

  useEffect(() => () => clearIv(), []);

  const phase = SEQUENCE[phaseIdx];
  const total = getPhaseDurationSecs(phase);
  const ringOffset = CIRC * (1 - secsLeft / total);
  const accentColor = PHASE_COLOR[phase];

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end" }}>
            
            {/* Custom durations */}
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Focus (min)</span>
              <input
                type="number" min={1} max={180} value={workMins}
                onChange={(e) => { if (!started) setWorkMins(Math.max(1, Math.min(180, Number(e.target.value)))); }}
                disabled={started}
                style={{ width: 80, fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: started ? "var(--text-muted)" : "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Short Break</span>
              <input
                type="number" min={1} max={60} value={shortBreakMins}
                onChange={(e) => { if (!started) setShortBreakMins(Math.max(1, Math.min(60, Number(e.target.value)))); }}
                disabled={started}
                style={{ width: 80, fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: started ? "var(--text-muted)" : "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Long Break</span>
              <input
                type="number" min={1} max={120} value={longBreakMins}
                onChange={(e) => { if (!started) setLongBreakMins(Math.max(1, Math.min(120, Number(e.target.value)))); }}
                disabled={started}
                style={{ width: 80, fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: started ? "var(--text-muted)" : "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
              />
            </label>

            {/* Sound profiles selection */}
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Alert Tone</span>
              <select
                value={soundProfile}
                onChange={(e) => setSoundProfile(e.target.value as any)}
                style={{ height: 35, width: 120, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
              >
                <option value="bell">Default Bell 🔔</option>
                <option value="beep">Digital Beep 🔊</option>
                <option value="chord">Warm Chord 🎵</option>
                <option value="none">Mute 🔇</option>
              </select>
            </label>

            {/* Stats */}
            <div style={{ display: "flex", gap: 16, borderLeft: "2px solid var(--border)", paddingLeft: 16, height: 40, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--section-clocks-accent)" }}>{completed}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Done</span>
              </div>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700, color: "var(--accent-utility-d)" }}>🔥{streak}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Streak</span>
              </div>
            </div>
          </div>

          {/* Autostart and ticking options */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={autoStartBreaks}
                onChange={(e) => setAutoStartBreaks(e.target.checked)}
                style={{ accentColor: "var(--section-clocks-accent)" }}
              />
              Auto-start Breaks
            </label>
            
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={autoStartFocus}
                onChange={(e) => setAutoStartFocus(e.target.checked)}
                style={{ accentColor: "var(--section-clocks-accent)" }}
              />
              Auto-start Focus Blocks
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)" }}>
              <input
                type="checkbox"
                checked={enableTicking}
                onChange={(e) => setEnableTicking(e.target.checked)}
                style={{ accentColor: "var(--section-clocks-accent)" }}
              />
              Play Soft Focus Ticking ⏱️
            </label>
          </div>
        </div>
      }
    >
      <div style={{ minHeight: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "48px 32px" }}>
        
        {/* Active Phase Label */}
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: accentColor }}>
            {PHASE_LABEL[phase]} · {Math.floor(phaseIdx / 2) + 1} of 4
          </span>
        </div>

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

        {/* Focus Task Overlay Banner */}
        <div style={{ width: "100%", maxWidth: 360 }}>
          {phase === "work" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
              <input
                type="text"
                value={focusTask}
                onChange={(e) => setFocusTask(e.target.value)}
                placeholder="What is your focus topic today? 🎯"
                disabled={started && running}
                style={{
                  width: "100%",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  background: started && running ? "transparent" : "var(--bg-card)",
                  border: started && running ? "none" : "2px solid var(--border)",
                  color: started && running ? "var(--section-clocks-accent)" : "var(--text-primary)",
                  padding: "8px 12px",
                  borderRadius: 6,
                  outline: "none",
                  transition: "color 0.3s, background 0.3s",
                }}
              />
              {started && running && focusTask && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                  Active Focus Target
                </span>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--bg-card)", border: "1px dashed var(--border)", borderRadius: 6, padding: "8px 12px" }}>
              <span style={{ fontSize: 14 }}>🧘 Take a deep breath & relax.</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
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

        {/* Session progress dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {SEQUENCE.map((p, i) => (
            <div
              key={i}
              title={`${i + 1}. ${PHASE_LABEL[p]}`}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                border: `2px solid ${i === phaseIdx ? PHASE_COLOR[p] : "var(--border)"}`,
                background: i < phaseIdx ? PHASE_COLOR[p] : "transparent",
                transition: "background 0.3s, border-color 0.3s",
              }}
            />
          ))}
        </div>

      </div>
    </ClockLayout>
  );
}
