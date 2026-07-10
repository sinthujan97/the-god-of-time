"use client";

import { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "working-memory-test")!;

type TestPhase = "idle" | "memorizing" | "recalling" | "success" | "failure" | "gameover";
type SequenceMode = "numbers" | "letters" | "mixed";
type RecallMode = "forward" | "backward";

// Synthesizer Audio Helpers
function playTone(freq: number, dur: number) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.05);
  } catch {}
}

export default function WorkingMemoryTest() {
  // Config state
  const [seqMode, setSeqMode] = useState<SequenceMode>("numbers");
  const [recallMode, setRecallMode] = useState<RecallMode>("forward");
  const [flashSpeed, setFlashSpeed] = useState<number>(0.8); // seconds per digit

  // Game state
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [sequence, setSequence] = useState<string[]>([]);
  const [activeIdx, setActiveIdx] = useState<number>(-1);
  const [showItem, setShowItem] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [level, setLevel] = useState(3); // Start with 3 characters
  const [lives, setLives] = useState(3);
  const [highScore, setHighScore] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Load high score
  useEffect(() => {
    try {
      const stored = localStorage.getItem("memory_high_score");
      if (stored) setHighScore(Number(stored));
    } catch {}
  }, []);

  // Save high score
  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      try {
        localStorage.setItem("memory_high_score", String(score));
      } catch {}
    }
  };

  // Generate a random item based on mode
  const generateRandomItem = (): string => {
    if (seqMode === "numbers") {
      return String(Math.floor(Math.random() * 10));
    } else if (seqMode === "letters") {
      const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return alpha.charAt(Math.floor(Math.random() * alpha.length));
    } else {
      const mixed = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      return mixed.charAt(Math.floor(Math.random() * mixed.length));
    }
  };

  const startTest = () => {
    setLives(3);
    setLevel(3);
    setUserInput("");
    triggerRound(3);
  };

  const triggerRound = (currentLevel: number) => {
    setUserInput("");
    const newSeq: string[] = [];
    for (let i = 0; i < currentLevel; i++) {
      newSeq.push(generateRandomItem());
    }
    setSequence(newSeq);
    setPhase("memorizing");
    setActiveIdx(0);
    setShowItem(true);
    playTone(600, 0.1);
  };

  // Memorizing sequence loop
  useEffect(() => {
    if (phase !== "memorizing" || sequence.length === 0) return;

    if (activeIdx < sequence.length) {
      if (showItem) {
        // Flash sound
        playTone(720, 0.08);
        const timer = setTimeout(() => {
          setShowItem(false);
        }, flashSpeed * 1000 * 0.7); // Hide early for clean flash intervals
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setActiveIdx((prev) => prev + 1);
          setShowItem(true);
        }, flashSpeed * 1000 * 0.3);
        return () => clearTimeout(timer);
      }
    } else {
      // Completed memorization
      setPhase("recalling");
      setActiveIdx(-1);
      setShowItem(false);
      // Focus text box
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [phase, activeIdx, showItem, sequence, flashSpeed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== "recalling") return;

    // Evaluate response
    let expectedText = sequence.join("");
    if (recallMode === "backward") {
      expectedText = [...sequence].reverse().join("");
    }

    const cleanInput = userInput.trim().toUpperCase();
    if (cleanInput === expectedText) {
      // Success
      playTone(950, 0.12);
      // Wait a fraction of a second and trigger chord
      setTimeout(() => playTone(1200, 0.15), 80);
      setPhase("success");
      updateHighScore(level);
      setTimeout(() => {
        setLevel((prev) => prev + 1);
        triggerRound(level + 1);
      }, 1500);
    } else {
      // Mistake
      const newLives = lives - 1;
      setLives(newLives);
      playTone(320, 0.25);
      
      if (newLives <= 0) {
        setPhase("gameover");
      } else {
        setPhase("failure");
        setTimeout(() => {
          triggerRound(level);
        }, 2000);
      }
    }
  };

  const controlsSection = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
      
      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Sequence Type</span>
        <select
          value={seqMode}
          onChange={(e) => setSeqMode(e.target.value as any)}
          disabled={phase !== "idle" && phase !== "gameover"}
          style={{ height: 32, width: 130, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
        >
          <option value="numbers">Numbers Only</option>
          <option value="letters">Letters Only</option>
          <option value="mixed">Mixed Alpha</option>
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Recall Direction</span>
        <select
          value={recallMode}
          onChange={(e) => setRecallMode(e.target.value as any)}
          disabled={phase !== "idle" && phase !== "gameover"}
          style={{ height: 32, width: 140, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
        >
          <option value="forward">Normal (Forward)</option>
          <option value="backward">Reverse (Backward) ⚠️</option>
        </select>
      </label>

      <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Speed Interval</span>
        <select
          value={flashSpeed}
          onChange={(e) => setFlashSpeed(Number(e.target.value))}
          disabled={phase !== "idle" && phase !== "gameover"}
          style={{ height: 32, width: 100, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
        >
          <option value={0.5}>0.5s Fast</option>
          <option value={0.8}>0.8s Std</option>
          <option value={1.2}>1.2s Steady</option>
          <option value={1.6}>1.6s Slow</option>
        </select>
      </label>

      <div style={{ display: "flex", gap: 16, borderLeft: "2px solid var(--border)", paddingLeft: 16, height: 36, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 800, color: "var(--section-clocks-accent)" }}>{level}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Length</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 800, color: "var(--accent-utility-d)" }}>{highScore}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Record</span>
        </div>
      </div>

      <button
        onClick={() => {
          setPhase("idle");
          setLives(3);
          setLevel(3);
          setSequence([]);
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
      <div style={{ minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, padding: "48px 32px", background: "var(--bg-base)" }}>
        
        {/* Lives heart display */}
        {phase !== "idle" && phase !== "gameover" && (
          <div style={{ display: "flex", gap: 6, fontSize: 18, position: "absolute", top: 20 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ opacity: i < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
        )}

        {phase === "idle" && (
          <>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 850, color: "var(--text-primary)", margin: "0 0 10px" }}>
                Working Memory Test
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: 0, maxWidth: 380, lineHeight: 1.5, marginLeft: "auto", marginRight: "auto" }}>
                Test your cognitive limits. A sequence of characters will flash on screen. Recall and type them back correctly.
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
              START TEST
            </button>
          </>
        )}

        {phase === "memorizing" && (
          <>
            <div 
              style={{ 
                width: 200, 
                height: 200, 
                border: "3px solid var(--border)", 
                borderRadius: 12, 
                background: "var(--bg-card)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "var(--shadow-offset-md) var(--shadow-color)",
                position: "relative"
              }}
            >
              {showItem && activeIdx < sequence.length && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 80, fontWeight: 800, color: "var(--section-clocks-accent)" }}>
                  {sequence[activeIdx]}
                </span>
              )}
              
              {/* Flash remaining timeline bar indicator */}
              <div 
                style={{ 
                  position: "absolute", 
                  bottom: 0, 
                  left: 0, 
                  height: 6, 
                  background: "var(--section-clocks-accent)", 
                  width: showItem ? "100%" : "0%",
                  transition: showItem ? `width ${flashSpeed * 0.7}s linear` : "none" 
                }} 
              />
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Memorizing: {activeIdx + 1} of {sequence.length}
            </p>
          </>
        )}

        {phase === "recalling" && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", maxWidth: 360 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 4px" }}>
                What was the sequence?
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: recallMode === "backward" ? "var(--destructive)" : "var(--text-muted)", fontWeight: 700 }}>
                {recallMode === "backward" ? "⚠️ TYPE IN REVERSE ORDER!" : "Type in forward order"}
              </p>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type sequence here..."
              style={{
                width: "100%",
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                fontWeight: 700,
                textAlign: "center",
                border: "2.5px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                padding: "10px 16px",
                borderRadius: 6,
                outline: "none",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                boxShadow: "3px 3px 0 var(--shadow-color)",
              }}
              autoFocus
            />

            <button
              type="submit"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                fontWeight: 700,
                padding: "12px 40px",
                border: "2.5px solid var(--border)",
                borderRadius: 6,
                background: "var(--text-primary)",
                color: "var(--bg-base)",
                cursor: "pointer",
                boxShadow: "3px 3px 0 var(--shadow-color)",
                letterSpacing: "0.06em",
              }}
            >
              SUBMIT ANSWER
            </button>
          </form>
        )}

        {phase === "success" && (
          <div style={{ textAlign: "center", animation: "pulse 0.5s infinite alternate" }}>
            <span style={{ fontSize: 54 }}>✅</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--accent-utility-a)", margin: "12px 0 6px" }}>
              CORRECT RECALL!
            </h3>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
              Advancing level to {level + 1} characters...
            </p>
          </div>
        )}

        {phase === "failure" && (
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 54 }}>❌</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--destructive)", margin: "12px 0 6px" }}>
              INCORRECT RECALL
            </h3>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", maxWidth: 280, margin: "0 auto" }}>
              The target sequence was: <strong style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--text-primary)" }}>{sequence.join("")}</strong>
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--destructive)", marginTop: 6 }}>
              {lives} lives remaining. Retrying level {level}...
            </p>
          </div>
        )}

        {phase === "gameover" && (
          <div style={{ textAlign: "center", width: "100%", maxWidth: 400, background: "var(--bg-card)", border: "2.5px solid var(--border)", borderRadius: 12, padding: "32px 24px", boxShadow: "var(--shadow-offset-md) var(--shadow-color)" }}>
            <span style={{ fontSize: 60 }}>🧠</span>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 900, color: "var(--destructive)", margin: "12px 0 8px" }}>
              GAME OVER
            </h3>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: "0 0 20px" }}>
              Your working memory capacity reached a span of:
            </p>
            
            <div style={{ display: "inline-block", background: "var(--bg-surface)", border: "2px solid var(--border)", borderRadius: 8, padding: "16px 36px", marginBottom: 24 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 800, color: "var(--section-clocks-accent)" }}>
                {level}
              </span>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Characters Locked</p>
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
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
                TRY AGAIN ↺
              </button>
            </div>
          </div>
        )}

      </div>
    </ClockLayout>
  );
}
