"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "time-blindness")!;

type Phase = "idle" | "counting" | "judging";
type GameMode = "classic" | "paced" | "ticking" | "distraction";

interface Attempt {
  elapsed: number;
  target: number;
  error: number;
  errorPct: number;
  mode: GameMode;
  grade: string;
}

const PRESETS = [
  { label: "5s", secs: 5 },
  { label: "10s", secs: 10 },
  { label: "30s", secs: 30 },
  { label: "1m", secs: 60 },
  { label: "3m", secs: 180 },
  { label: "5m", secs: 300 },
];

const DISTRACTION_WORDS = [
  "Squirrel! 🐿️",
  "Did I lock the front door?",
  "Wait, how long has it been?",
  "Tick... or is it Tock? 🕰️",
  "Is that a text message? 📱",
  "Fast! No, slow down...",
  "ADHD Mode Active 🌀",
  "Look at this flashing light! 💡",
  "What was the target again?",
  "1, 2, 3... wait, 8?",
  "Time is slipping away... ⏳",
  "Did you blink? 👀",
];

// Helper to play a clean synth audio beep
const playTickSound = (frequency = 800, duration = 0.04) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn("AudioContext blocked or failed", e);
  }
};

// Calculate Grade and Score
const calculateGrade = (errorPct: number) => {
  const absPct = Math.abs(errorPct);
  if (absPct <= 2.5) return { grade: "S", label: "Zen Master 🌟", desc: "Your internal clock is incredibly precise!", color: "var(--accent-utility-a)" };
  if (absPct <= 6) return { grade: "A", label: "Time Bender ✨", desc: "Excellent pacing and focus!", color: "var(--accent-utility-c)" };
  if (absPct <= 12) return { grade: "B", label: "Punctual 👍", desc: "Good job! Quite close to target.", color: "var(--text-primary)" };
  if (absPct <= 22) return { grade: "C", label: "Slightly Blind 🤷", desc: "A bit off. Time blindness is kicking in.", color: "var(--accent-utility-d)" };
  return { grade: "F", label: "Chronologically Lost 🌀", desc: "Heavy time blindness! You completely lost track.", color: "var(--destructive)" };
};

export default function TimeBlindnessTester() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [targetSecs, setTargetSecs] = useState<number>(30);
  const [gameMode, setGameMode] = useState<GameMode>("classic");
  const [history, setHistory] = useState<Attempt[]>([]);
  const [isCustom, setIsCustom] = useState(false);

  // Fullscreen support state
  const [isFs, setIsFs] = useState(false);

  // Distraction mode states
  const [distractionWord, setDistractionWord] = useState("");
  const [wordPosition, setWordPosition] = useState({ top: 40, left: 50 });
  const [flashBg, setFlashBg] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => {
      const active = !!document.fullscreenElement || 
                     document.body.classList.contains("fallback-fullscreen-active") || 
                     !!document.querySelector(".fullscreen-active");
      setIsFs(active);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    const iv = setInterval(handler, 400);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      clearInterval(iv);
    };
  }, []);

  // Clean timers
  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const startTest = () => {
    startRef.current = Date.now();
    setPhase("counting");
    setElapsedSecs(0);
    setDistractionWord("");

    // Start a 1-second interval to handle sound pacing and visual distractions
    let ticks = 0;
    timerRef.current = setInterval(() => {
      ticks++;
      setElapsedSecs(ticks);

      // Play tick sound based on mode
      if (gameMode === "paced" && ticks <= 3) {
        // High pitch start anchor
        playTickSound(ticks === 3 ? 1000 : 700, 0.06);
      } else if (gameMode === "ticking") {
        playTickSound(600, 0.04);
      } else if (gameMode === "distraction") {
        // Chaotic, random frequency beeps!
        if (Math.random() > 0.4) {
          playTickSound(300 + Math.random() * 800, 0.05);
        }
        // Background color flash
        if (Math.random() > 0.7) {
          setFlashBg(true);
          setTimeout(() => setFlashBg(false), 80);
        }
        // Random distraction words appearing
        if (Math.random() > 0.5) {
          const randomIndex = Math.floor(Math.random() * DISTRACTION_WORDS.length);
          setDistractionWord(DISTRACTION_WORDS[randomIndex]);
          setWordPosition({
            top: 20 + Math.random() * 60, // 20% to 80%
            left: 10 + Math.random() * 80, // 10% to 90%
          });
        } else {
          setDistractionWord("");
        }
      }
    }, 1000);

    // Play first tick instantly
    if (gameMode === "paced" || gameMode === "ticking" || gameMode === "distraction") {
      playTickSound(700, 0.06);
    }
  };

  const stopTest = () => {
    clearTimers();
    const elapsed = Date.now() - startRef.current;
    const targetMs = targetSecs * 1000;
    const error = elapsed - targetMs;
    const errorPct = (error / targetMs) * 100;
    const { grade } = calculateGrade(errorPct);

    const newAttempt: Attempt = {
      elapsed,
      target: targetMs,
      error,
      errorPct,
      mode: gameMode,
      grade,
    };

    setHistory((prev) => [newAttempt, ...prev].slice(0, 10));
    setPhase("judging");
  };

  const last = history[0];
  const rating = last ? calculateGrade(last.errorPct) : null;

  // Streak Calculation (Consecutive S or A Grades)
  const getStreak = () => {
    let streak = 0;
    for (const a of history) {
      if (a.grade === "S" || a.grade === "A") {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  // Average accuracy calculation
  const getAverageError = () => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, curr) => acc + Math.abs(curr.errorPct), 0);
    return sum / history.length;
  };

  return (
    <ClockLayout clock={clock} noScale={true}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-base)",
        height: isFs ? "100%" : "auto",
        width: "100%",
        boxSizing: "border-box",
      }}>
        
        {/* Game Mode / Configuration Section - hidden in counting phase */}
        {phase !== "counting" && (
          <div style={{ borderBottom: "2.5px solid var(--border)", padding: isFs ? "12px 20px" : "16px 20px" }}>
            {/* Mode selection row */}
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                Select Mode
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8 }}>
                {[
                  { value: "classic", label: "🧘 Classic", desc: "Pure silent counting" },
                  { value: "paced", label: "🎵 Anchored", desc: "3s ticking guide" },
                  { value: "ticking", label: "🔊 Continuous", desc: "Ticks play non-stop" },
                  { value: "distraction", label: "🌀 Chaos Mode", desc: "Visual & audio disruptions" },
                ].map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setGameMode(mode.value as GameMode)}
                    style={{
                      padding: "8px 10px",
                      border: "2px solid var(--border)",
                      borderRadius: 6,
                      background: gameMode === mode.value ? "var(--text-primary)" : "var(--bg-surface)",
                      color: gameMode === mode.value ? "var(--bg-base)" : "var(--text-primary)",
                      cursor: "pointer",
                      fontFamily: "var(--font-ui)",
                      fontSize: 12,
                      fontWeight: 700,
                      textAlign: "center",
                      transition: "background 0.15s, color 0.15s",
                      boxShadow: gameMode === mode.value ? "none" : "2px 2px 0 var(--shadow-color)",
                    }}
                    title={mode.desc}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Selectors */}
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: 8 }}>
                Target Duration
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setTargetSecs(p.secs);
                      setIsCustom(false);
                    }}
                    style={{
                      padding: "6px 12px",
                      border: "2.5px solid var(--border)",
                      borderRadius: 6,
                      background: (!isCustom && targetSecs === p.secs) ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                      color: (!isCustom && targetSecs === p.secs) ? "#000000" : "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: (!isCustom && targetSecs === p.secs) ? "none" : "1.5px 1.5px 0 var(--shadow-color)",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
                
                <button
                  onClick={() => setIsCustom(true)}
                  style={{
                    padding: "6px 12px",
                    border: "2.5px solid var(--border)",
                    borderRadius: 6,
                    background: isCustom ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                    color: isCustom ? "#000000" : "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: isCustom ? "none" : "1.5px 1.5px 0 var(--shadow-color)",
                  }}
                >
                  ⚙️ Custom
                </button>

                {isCustom && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                    <input
                      type="number"
                      min={5}
                      max={600}
                      value={targetSecs}
                      onChange={(e) => setTargetSecs(Math.max(5, Math.min(600, Number(e.target.value) || 30)))}
                      style={{
                        width: 70,
                        height: 30,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "center",
                        border: "2px solid var(--border)",
                        borderRadius: 4,
                        background: "var(--bg-surface)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", fontWeight: 700 }}>secs</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Display Canvas area */}
        <div
          style={{
            flex: 1,
            minHeight: isFs ? "calc(100vh - 180px)" : 330,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: isFs ? 36 : 24,
            padding: isFs ? "48px 32px" : "40px 24px",
            position: "relative",
            background: flashBg ? "rgba(220, 38, 38, 0.25)" : "transparent",
            transition: "background-color 0.08s ease",
            overflow: "hidden",
          }}
        >
          {/* Distraction floating words */}
          {phase === "counting" && gameMode === "distraction" && distractionWord && (
            <div
              style={{
                position: "absolute",
                top: `${wordPosition.top}%`,
                left: `${wordPosition.left}%`,
                transform: "translate(-50%, -50%)",
                fontFamily: "var(--font-display)",
                fontSize: isFs ? "clamp(18px, 4vw, 36px)" : "clamp(13px, 3.5vw, 24px)",
                fontWeight: 900,
                color: Math.random() > 0.5 ? "var(--section-clocks-accent)" : "var(--accent-utility-d)",
                opacity: 0.85,
                pointerEvents: "none",
                textShadow: "0 0 10px rgba(0,0,0,0.8)",
                animation: "pulse 0.4s infinite alternate",
                whiteSpace: "nowrap",
                zIndex: 10,
              }}
            >
              {distractionWord}
            </div>
          )}

          {phase === "idle" && (
            <>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: isFs ? 32 : 24, fontWeight: 800, color: "var(--text-primary)", margin: "0 0 8px" }}>
                  Time Blindness Test
                </p>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: isFs ? 16 : 14, color: "var(--text-muted)", margin: 0, maxWidth: 440, lineHeight: 1.5, marginLeft: "auto", marginRight: "auto" }}>
                  Press **START** and count silently. Press **STOP** when you think exactly <strong style={{ color: "var(--section-clocks-accent)", fontFamily: "var(--font-mono)" }}>{targetSecs}s</strong> has elapsed. No peeking!
                </p>
              </div>

              {/* Pulsing Visual Ring */}
              <div
                style={{
                  width: isFs ? 140 : 90,
                  height: isFs ? 140 : 90,
                  borderRadius: "50%",
                  border: "3px solid var(--border)",
                  borderTopColor: "var(--section-clocks-accent)",
                  animation: "spin 2.5s linear infinite",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: isFs ? 32 : 20 }}>🧠</span>
              </div>

              <button
                onClick={startTest}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: isFs ? 15 : 13,
                  fontWeight: 700,
                  padding: isFs ? "18px 64px" : "14px 50px",
                  border: "2.5px solid var(--border)",
                  borderRadius: 8,
                  background: "var(--section-clocks-accent)",
                  color: "#000000",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 var(--shadow-color)",
                  letterSpacing: "0.08em",
                  transition: "transform 0.1s",
                }}
              >
                START TEST
              </button>
            </>
          )}

          {phase === "counting" && (
            <>
              {/* Pulsing Center Orb */}
              <div
                style={{
                  position: "relative",
                  width: isFs ? 220 : 120,
                  height: isFs ? 220 : 120,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Outer Ring */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "3.5px solid var(--border-subtle)",
                    borderTopColor: "var(--section-clocks-accent)",
                    // Pulse at 1Hz in classic, else random speeds in chaos mode
                    animation: gameMode === "distraction"
                      ? "spin 0.6s linear infinite"
                      : "spin 1.5s linear infinite",
                  }}
                />
                
                {/* Glowing Center Core */}
                <div
                  style={{
                    width: isFs ? 130 : 70,
                    height: isFs ? 130 : 70,
                    borderRadius: "50%",
                    background: gameMode === "distraction" ? "var(--destructive)" : "var(--section-clocks-accent)",
                    boxShadow: gameMode === "distraction"
                      ? "0 0 25px var(--destructive)"
                      : "0 0 20px var(--section-clocks-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                    animation: gameMode === "distraction" ? "pulse 0.4s infinite alternate" : "pulse 1s infinite alternate",
                  }}
                >
                  <span style={{ fontSize: isFs ? 40 : 24 }}>🤔</span>
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: isFs ? 26 : 20, fontWeight: 950, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "0.02em" }}>
                  {gameMode === "distraction" ? "🌀 CHAOS LEVEL MAXIMUM" : "Counting silently..."}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: isFs ? 13 : 11, color: "var(--text-muted)", margin: 0, fontWeight: 700 }}>
                  Target: {targetSecs}s · Mode: {gameMode.toUpperCase()}
                </p>
              </div>

              <button
                onClick={stopTest}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: isFs ? 15 : 13,
                  fontWeight: 700,
                  padding: isFs ? "18px 72px" : "14px 50px",
                  border: "2.5px solid var(--border)",
                  borderRadius: 8,
                  background: "var(--destructive)",
                  color: "#000000",
                  cursor: "pointer",
                  boxShadow: "4px 4px 0 var(--shadow-color)",
                  letterSpacing: "0.08em",
                }}
              >
                STOP NOW
              </button>
            </>
          )}

          {phase === "judging" && last && rating && (
            <>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 4 }}>
                  You stopped at
                </p>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: isFs ? 72 : 58, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                  {(last.elapsed / 1000).toFixed(2)}
                  <span style={{ fontSize: isFs ? 30 : 24, color: "var(--text-muted)", marginLeft: 2 }}>s</span>
                </span>
                
                {/* Evaluation Grade Card */}
                <div style={{ marginTop: 14 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: isFs ? 28 : 24,
                      fontWeight: 900,
                      color: rating.color,
                      display: "block",
                      textShadow: `0 0 10px ${rating.color}44`,
                    }}
                  >
                    Grade {rating.grade}: {rating.label}
                  </span>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: isFs ? 14 : 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                    {rating.desc}
                  </p>
                </div>
              </div>

              {/* Accuracy Badge Info */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                {[
                  { label: "Target", val: `${targetSecs}s` },
                  { label: "Error Gap", val: `${last.error > 0 ? "+" : ""}${(last.error / 1000).toFixed(2)}s`, color: rating.color },
                  { label: "Off By", val: `${last.errorPct > 0 ? "+" : ""}${last.errorPct.toFixed(1)}%`, color: rating.color },
                ].map(({ label, val, color }) => (
                  <div
                    key={label}
                    style={{
                      textAlign: "center",
                      border: "2px solid var(--border)",
                      borderRadius: 8,
                      padding: isFs ? "12px 24px" : "10px 16px",
                      background: "var(--bg-card)",
                      minWidth: isFs ? 110 : 90,
                    }}
                  >
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: isFs ? 18 : 16, fontWeight: 800, color: color || "var(--text-primary)" }}>
                      {val}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", marginTop: 2 }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={startTest}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "10px 24px",
                    border: "2px solid var(--border)",
                    borderRadius: 6,
                    background: "var(--section-clocks-accent)",
                    color: "#000000",
                    cursor: "pointer",
                    boxShadow: "2px 2px 0 var(--shadow-color)",
                    letterSpacing: "0.06em",
                  }}
                >
                  RETRY PRESSED TARGET
                </button>
                <button
                  onClick={() => setPhase("idle")}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "10px 24px",
                    border: "2px solid var(--border)",
                    borderRadius: 6,
                    background: "var(--bg-surface)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    boxShadow: "2px 2px 0 var(--shadow-color)",
                    letterSpacing: "0.06em",
                  }}
                >
                  SETUP SCREEN
                </button>
              </div>
            </>
          )}
        </div>

        {/* Statistics & Streak Dashboard - hidden in fullscreen counting phase to avoid clutter */}
        {history.length > 0 && (!isFs || phase !== "counting") && (
          <div style={{ borderTop: "2.5px solid var(--border)", padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, background: "var(--bg-surface)" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                Performance Index
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "var(--font-mono)", fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Total Tests:</span>
                  <span style={{ fontWeight: 700 }}>{history.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Avg Error:</span>
                  <span style={{ fontWeight: 700, color: getAverageError() < 10 ? "var(--accent-utility-a)" : "var(--accent-utility-d)" }}>
                    {getAverageError().toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Accurate Streak:</span>
                  <span style={{ fontWeight: 700, color: getStreak() > 0 ? "var(--section-clocks-accent)" : "var(--text-muted)" }}>
                    🔥 {getStreak()} consecutive (Grade A+)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
                Recent Attempts Log
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 90, overflowY: "auto", paddingRight: 4 }}>
                {history.map((a, i) => {
                  const modeIcons: Record<GameMode, string> = { classic: "🧘", paced: "🎵", ticking: "🔊", distraction: "🌀" };
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        borderBottom: "1px solid var(--border-subtle)",
                        paddingBottom: 2,
                      }}
                    >
                      <span style={{ color: "var(--text-faint)" }}>
                        {modeIcons[a.mode]} #{history.length - i} ({Math.round(a.target / 1000)}s)
                      </span>
                      <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
                        {(a.elapsed / 1000).toFixed(2)}s
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: Math.abs(a.errorPct) <= 6 ? "var(--accent-utility-a)" : "var(--destructive)",
                        }}
                      >
                        {a.errorPct > 0 ? "+" : ""}{a.errorPct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Embedded CSS Animations */}
      <style jsx global>{`
        @keyframes spin {
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </ClockLayout>
  );
}
