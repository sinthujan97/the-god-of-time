"use client";

import { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "math-speed-test")!;

type TestPhase = "idle" | "playing" | "finished";
type OperatorType = "mixed" | "add" | "sub" | "mul" | "div";
type DifficultyType = "easy" | "medium" | "hard";

interface MathEquation {
  left: number;
  right: number;
  ans: number;
  sign: string;
  display: string;
}

// Synthesized Tone Players
function playBuzzer(freq: number, dur: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  } catch {}
}

const generateEquation = (diff: DifficultyType, op: OperatorType): MathEquation => {
  let finalOp = op;
  if (op === "mixed") {
    const ops: ("add" | "sub" | "mul" | "div")[] = ["add", "sub", "mul", "div"];
    finalOp = ops[Math.floor(Math.random() * ops.length)];
  }

  let left = 0;
  let right = 0;
  let ans = 0;
  let sign = "";

  if (diff === "easy") {
    if (finalOp === "add") {
      left = Math.floor(Math.random() * 9) + 1;
      right = Math.floor(Math.random() * 9) + 1;
      ans = left + right;
      sign = "+";
    } else if (finalOp === "sub") {
      left = Math.floor(Math.random() * 9) + 4;
      right = Math.floor(Math.random() * (left - 1)) + 1;
      ans = left - right;
      sign = "-";
    } else if (finalOp === "mul") {
      left = Math.floor(Math.random() * 8) + 2;
      right = Math.floor(Math.random() * 8) + 2;
      ans = left * right;
      sign = "×";
    } else {
      right = Math.floor(Math.random() * 8) + 2;
      ans = Math.floor(Math.random() * 7) + 2;
      left = right * ans;
      sign = "÷";
    }
  } else if (diff === "medium") {
    if (finalOp === "add") {
      left = Math.floor(Math.random() * 45) + 10;
      right = Math.floor(Math.random() * 25) + 5;
      ans = left + right;
      sign = "+";
    } else if (finalOp === "sub") {
      left = Math.floor(Math.random() * 50) + 20;
      right = Math.floor(Math.random() * (left - 10)) + 5;
      ans = left - right;
      sign = "-";
    } else if (finalOp === "mul") {
      left = Math.floor(Math.random() * 11) + 4;
      right = Math.floor(Math.random() * 9) + 3;
      ans = left * right;
      sign = "×";
    } else {
      right = Math.floor(Math.random() * 11) + 4;
      ans = Math.floor(Math.random() * 9) + 3;
      left = right * ans;
      sign = "÷";
    }
  } else {
    // Hard Mode
    if (finalOp === "add") {
      left = Math.floor(Math.random() * 90) + 10;
      right = Math.floor(Math.random() * 90) + 10;
      ans = left + right;
      sign = "+";
    } else if (finalOp === "sub") {
      left = Math.floor(Math.random() * 120) + 30;
      right = Math.floor(Math.random() * 90) + 10;
      ans = left - right;
      sign = "-";
    } else if (finalOp === "mul") {
      left = Math.floor(Math.random() * 18) + 6;
      right = Math.floor(Math.random() * 13) + 5;
      ans = left * right;
      sign = "×";
    } else {
      right = Math.floor(Math.random() * 14) + 6;
      ans = Math.floor(Math.random() * 11) + 5;
      left = right * ans;
      sign = "÷";
    }
  }

  return { left, right, ans, sign, display: `${left} ${sign} ${right} = ?` };
};

const getMathRank = (correct: number) => {
  if (correct >= 40) return { title: "Math Deity 👑", color: "var(--accent-utility-a)", desc: "Unbelievable speed, standard calculators are jealous." };
  if (correct >= 25) return { title: "Human Calculator 🧠", color: "var(--accent-utility-c)", desc: "Outstanding arithmetic mastery and instant reflexes!" };
  if (correct >= 12) return { title: "Sharp Thinker ⚡", color: "var(--text-primary)", desc: "Strong focus and fast analytical capacity." };
  if (correct >= 5) return { title: "Standard Brain 🔢", color: "var(--accent-utility-d)", desc: "Solid normal speed. Keep exercising to step it up!" };
  return { title: "Abacus User 🧮", color: "var(--destructive)", desc: "Slow speed. Try Easy mode to improve timing rhythm." };
};

export default function MathSpeedTester() {
  const [duration, setDuration] = useState<number>(30); // 30s, 60s, 120s
  const [difficulty, setDifficulty] = useState<DifficultyType>("medium");
  const [operator, setOperator] = useState<OperatorType>("mixed");

  // Gameplay state
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [equation, setEquation] = useState<MathEquation | null>(null);
  const [userInput, setUserInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(duration);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load high score
  useEffect(() => {
    try {
      const stored = localStorage.getItem("math_speed_high_score");
      if (stored) setHighScore(Number(stored));
    } catch {}
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const triggerNextEquation = () => {
    setEquation(generateEquation(difficulty, operator));
    setUserInput("");
  };

  const startTest = () => {
    clearTimer();
    setCorrectCount(0);
    setIncorrectCount(0);
    setSecondsRemaining(duration);
    setPhase("playing");
    setEquation(generateEquation(difficulty, operator));
    setUserInput("");

    // Start timer interval
    let timePassed = 0;
    const startMs = Date.now();
    timerRef.current = setInterval(() => {
      const diff = Math.floor((Date.now() - startMs) / 1000);
      const remaining = duration - diff;
      if (remaining <= 0) {
        setSecondsRemaining(0);
        setPhase("finished");
        clearTimer();
        
        // Save high score
        setCorrectCount((finalCorrect) => {
          try {
            const currentRecord = Number(localStorage.getItem("math_speed_high_score") ?? 0);
            if (finalCorrect > currentRecord) {
              setHighScore(finalCorrect);
              localStorage.setItem("math_speed_high_score", String(finalCorrect));
            }
          } catch {}
          return finalCorrect;
        });
        
        // Finish chime
        playBuzzer(800, 0.15);
        setTimeout(() => playBuzzer(1100, 0.2), 100);
      } else {
        setSecondsRemaining(remaining);
      }
    }, 200);

    // Auto-focus input
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 50);
  };

  // Live input evaluation (enables ultra-fast auto-advancement on exact match)
  const handleInputChange = (val: string) => {
    setUserInput(val);
    if (!equation) return;

    const trimmed = val.trim();
    if (trimmed === "") return;

    const numVal = Number(trimmed);
    if (!isNaN(numVal) && numVal === equation.ans) {
      // Correct!
      playBuzzer(1000, 0.08);
      setCorrectCount((c) => c + 1);
      triggerNextEquation();
    }
  };

  // Capture Enter keys as fallback check or manual submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && equation) {
      const numVal = Number(userInput.trim());
      if (numVal !== equation.ans) {
        // Wrong answer buzz
        playBuzzer(280, 0.2);
        setIncorrectCount((w) => w + 1);
        setWrongFlash(true);
        setTimeout(() => setWrongFlash(false), 200);
        setUserInput("");
      }
    }
  };

  const accuracyPercent = (correctCount + incorrectCount) > 0
    ? Math.round((correctCount / (correctCount + incorrectCount)) * 100)
    : 100;

  const controlsSection = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
      
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Difficulty</span>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as any)}
          disabled={phase === "playing"}
          style={{ height: 32, width: 110, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
        >
          <option value="easy">Easy (1 Digit)</option>
          <option value="medium">Medium (Std)</option>
          <option value="hard">Hard (Advanced)</option>
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Arithmetic Operation</span>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value as any)}
          disabled={phase === "playing"}
          style={{ height: 32, width: 130, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
        >
          <option value="mixed">Mixed Operator</option>
          <option value="add">Addition (+)</option>
          <option value="sub">Subtraction (-)</option>
          <option value="mul">Multiplication (×)</option>
          <option value="div">Division (÷)</option>
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Trial Time</span>
        <select
          value={duration}
          onChange={(e) => {
            setDuration(Number(e.target.value));
            setSecondsRemaining(Number(e.target.value));
          }}
          disabled={phase === "playing"}
          style={{ height: 32, width: 90, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
        >
          <option value={30}>30s Test</option>
          <option value={60}>60s Std</option>
          <option value={120}>120s Endurance</option>
        </select>
      </label>

      <div style={{ display: "flex", gap: 16, borderLeft: "2px solid var(--border)", paddingLeft: 16, height: 36, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 800, color: "var(--accent-utility-d)" }}>{highScore}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Personal Best</span>
        </div>
      </div>

      <button
        onClick={() => {
          clearTimer();
          setPhase("idle");
          setCorrectCount(0);
          setIncorrectCount(0);
          setSecondsRemaining(duration);
        }}
        disabled={phase === "idle"}
        style={{
          marginLeft: "auto",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 700,
          padding: "8px 18px",
          border: "2px solid var(--border)",
          borderRadius: 4,
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          cursor: phase === "idle" ? "default" : "pointer",
          opacity: phase === "idle" ? 0.5 : 1,
          boxShadow: phase === "idle" ? "none" : "2px 2px 0 var(--shadow-color)"
        }}
      >
        RESET
      </button>
    </div>
  );

  return (
    <ClockLayout clock={clock} controlsSection={controlsSection}>
      <div style={{ minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "48px 32px", background: "var(--bg-base)" }}>
        
        {phase === "idle" && (
          <>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 850, color: "var(--text-primary)", margin: "0 0 10px" }}>
                Arithmetic Speed Test
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: 0, maxWidth: 400, lineHeight: 1.5, marginLeft: "auto", marginRight: "auto" }}>
                Challenge your mental calculation speed. Solve as many equations as you can before the countdown timer hits zero!
              </p>
            </div>

            <button
              onClick={startTest}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                padding: "14px 50px",
                border: "2.5px solid var(--border)",
                borderRadius: 8,
                background: "var(--section-clocks-accent)",
                color: "#000000",
                cursor: "pointer",
                boxShadow: "3px 3px 0 var(--shadow-color)",
                letterSpacing: "0.08em",
              }}
            >
              START SPEED MATH
            </button>
          </>
        )}

        {phase === "playing" && equation && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
            
            {/* Live Metrics Header */}
            <div style={{ display: "flex", gap: 40, justifyContent: "center", width: "100%" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 800, color: "var(--accent-utility-a)", lineHeight: 1 }}>
                  {correctCount}
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>CORRECT</p>
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 800, color: secondsRemaining < 5 ? "var(--destructive)" : "var(--text-primary)", lineHeight: 1 }}>
                  {secondsRemaining}s
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>TIME LEFT</p>
              </div>
            </div>

            {/* Core Equation display card */}
            <div 
              style={{
                width: "100%",
                maxWidth: 420,
                background: wrongFlash ? "rgba(239, 68, 68, 0.12)" : "var(--bg-card)",
                border: `3px solid ${wrongFlash ? "var(--destructive)" : "var(--border)"}`,
                borderRadius: 12,
                padding: "36px 24px",
                textAlign: "center",
                boxShadow: "var(--shadow-offset-md) var(--shadow-color)",
                transition: "background 0.15s, border-color 0.15s"
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "0.04em" }}>
                {equation.display}
              </span>
            </div>

            {/* Answer text input field */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 320 }}>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type answer..."
                style={{
                  width: "100%",
                  fontFamily: "var(--font-mono)",
                  fontSize: 24,
                  fontWeight: 700,
                  textAlign: "center",
                  border: "2.5px solid var(--border)",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  padding: "10px 16px",
                  borderRadius: 6,
                  outline: "none",
                  boxShadow: "3px 3px 0 var(--shadow-color)",
                }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>
                Tip: Correct answers auto-submit. Press ENTER for incorrect guesses.
              </span>
            </div>

          </div>
        )}

        {phase === "finished" && (
          <div style={{ width: "100%", maxWidth: 440, background: "rgba(197,241,53,0.06)", border: "2.5px solid var(--section-clocks-accent)", borderRadius: 12, padding: "32px 24px", textAlign: "center", boxShadow: "var(--shadow-offset-md) var(--shadow-color)" }}>
            <span style={{ fontSize: 54 }}>🧠</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 900, color: "var(--section-clocks-accent)", margin: "12px 0 6px" }}>
              ARITHMETIC RUN COMPLETED
            </h3>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 20px", minWidth: 120 }}>
                <span style={{ fontSize: 28, fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)" }}>{correctCount}</span>
                <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Score</p>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 20px", minWidth: 120 }}>
                <span style={{ fontSize: 28, fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)" }}>{accuracyPercent}%</span>
                <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Accuracy</p>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: getMathRank(correctCount).color, display: "block" }}>
                {getMathRank(correctCount).title}
              </span>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                "{getMathRank(correctCount).desc}"
              </p>
            </div>

            <button
              onClick={startTest}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                padding: "12px 36px",
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: "var(--section-clocks-accent)",
                color: "#000000",
                cursor: "pointer",
                boxShadow: "2px 2px 0 var(--shadow-color)",
                marginTop: 24,
                letterSpacing: "0.06em"
              }}
            >
              RUN AGAIN ↺
            </button>
          </div>
        )}

      </div>
    </ClockLayout>
  );
}
