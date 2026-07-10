"use client";

import React, { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "speed-typing-test")!;

// Word & snippet datasets
const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him",
  "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use",
  "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these",
  "give", "day", "most", "us", "time", "clock", "second", "minute", "hour", "world", "epoch", "anchor",
  "quantum", "relativity", "decay", "future", "history", "timeline", "horizon", "gravity", "cosmic", "zen"
];

const QUOTES = [
  {
    author: "Shakespeare",
    text: "To be or not to be, that is the question: whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune."
  },
  {
    author: "Albert Einstein",
    text: "When a man sits with a pretty girl for an hour, it seems like a minute. But let him sit on a hot stove for a minute—and it's longer than any hour. That's relativity."
  },
  {
    author: "Marcus Aurelius",
    text: "Time is a river, a fierce torrent of things that come into being; no sooner is a thing brought to sight than it is swept away."
  },
  {
    author: "H.G. Wells",
    text: "We are always slipping away from the present. Our minds are built to process memories of the past and plan for the mystery of the future."
  }
];

const CODE_SNIPPETS = [
  "const time = async (tz) => { const res = await fetch(`/api/time/${tz}`); return res.json(); };",
  "export default function Timer({ duration }) { const [left, setLeft] = useState(duration); }",
  "<div className=\"flex items-center justify-between p-4 bg-surface border border-border\">",
  "for (let i = 0; i < timeline.length; i++) { if (timeline[i].collapsed) return collapse(i); }"
];

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", ";"],
  ["Z", "X", "C", "V", "B", "N", "M", ",", ".", "/"],
];

// Synthesized Switch Clicks
function playKeySound(type: "blue" | "brown" | "none") {
  if (type === "none") return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === "blue") {
      // High pitch sharp clicky sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 1750;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.006);
      osc.start();
      osc.stop(ctx.currentTime + 0.01);
      
      // Secondary metallic spring sound
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 850;
      gain2.gain.setValueAtTime(0.015, ctx.currentTime + 0.002);
      gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
      osc2.start(ctx.currentTime + 0.002);
      osc2.stop(ctx.currentTime + 0.025);
    } else {
      // Duller tactile brown switch sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 580;
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.012);
      osc.start();
      osc.stop(ctx.currentTime + 0.018);
    }
  } catch {}
}

export default function SpeedTypingTester() {
  // Config state
  const [duration, setDuration] = useState<number>(30); // seconds
  const [mode, setMode] = useState<"words" | "quotes" | "code">("words");
  const [soundProfile, setSoundProfile] = useState<"blue" | "brown" | "none">("blue");
  const [fontStyle, setFontStyle] = useState<"mono" | "sans" | "serif">("mono");

  // Gameplay state
  const [targetText, setTargetText] = useState("");
  const [typedText, setTypedText] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  // Hidden focus element to capture key strokes cleanly
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate target text based on selected mode
  const generateText = (selectedMode = mode) => {
    if (selectedMode === "words") {
      // Build a random sequence of common words
      const selection: string[] = [];
      for (let i = 0; i < 40; i++) {
        const randWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        selection.push(randWord);
      }
      setTargetText(selection.join(" "));
    } else if (selectedMode === "quotes") {
      const randQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      setTargetText(randQuote.text);
    } else {
      const randCode = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      setTargetText(randCode);
    }
  };

  // Run on first load
  useEffect(() => {
    generateText();
  }, []);

  const resetTest = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setTypedText("");
    setStartTime(null);
    setElapsedSecs(0);
    setMistakes(0);
    setIsFinished(false);
    generateText();
    // Re-focus input
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  const handleModeChange = (newMode: "words" | "quotes" | "code") => {
    setMode(newMode);
    setTypedText("");
    setStartTime(null);
    setElapsedSecs(0);
    setMistakes(0);
    setIsFinished(false);
    generateText(newMode);
  };

  // Key tracking & virtual keyboard support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const rawKey = e.key;
    const keyLabel = rawKey.toUpperCase();

    // Map special keys for virtual keyboard lighting
    if (rawKey === " ") {
      setPressedKeys((prev) => new Set(prev).add("SPACE"));
    } else {
      setPressedKeys((prev) => new Set(prev).add(keyLabel));
    }

    // Capture first typing strike to activate the timer
    if (startTime === null && rawKey !== "Escape" && rawKey !== "Tab") {
      setStartTime(Date.now());
      timerIntervalRef.current = setInterval(() => {
        setStartTime((startedAt) => {
          if (startedAt !== null) {
            const diff = (Date.now() - startedAt) / 1000;
            if (diff >= duration) {
              setIsFinished(true);
              if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
              }
              return startedAt;
            }
            setElapsedSecs(diff);
          }
          return startedAt;
        });
      }, 100);
    }

    // Play click sound
    if (rawKey.length === 1 || rawKey === "Backspace") {
      playKeySound(soundProfile);
    }

    // Evaluate keystroke errors
    if (rawKey.length === 1 && rawKey !== "Backspace") {
      const idx = typedText.length;
      if (idx < targetText.length) {
        const expected = targetText.charAt(idx);
        if (rawKey !== expected) {
          setMistakes((m) => m + 1);
        }
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const rawKey = e.key;
    const keyLabel = rawKey.toUpperCase();
    setPressedKeys((prev) => {
      const next = new Set(prev);
      if (rawKey === " ") {
        next.delete("SPACE");
      } else {
        next.delete(keyLabel);
      }
      return next;
    });
  };

  // Live Metrics calculations
  const totalTypedChars = typedText.length;
  const correctChars = totalTypedChars - mistakes;
  
  // WPM standard formula: (Total characters typed / 5) / (Time elapsed in minutes)
  const minutesPassed = elapsedSecs > 0 ? elapsedSecs / 60 : 0.01;
  const rawWpm = minutesPassed > 0 ? (totalTypedChars / 5) / minutesPassed : 0;
  const wpmVal = Math.max(0, Math.round(rawWpm));

  const accuracyVal = totalTypedChars > 0 
    ? Math.max(0, Math.min(100, Math.round((correctChars / totalTypedChars) * 100))) 
    : 100;

  const secondsRemaining = Math.max(0, Math.ceil(duration - elapsedSecs));

  // Focus container click handler
  const focusInput = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
            
            {/* Mode selection toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Typing Content</span>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { value: "words", label: "💬 Words" },
                  { value: "quotes", label: "✍️ Quotes" },
                  { value: "code", label: "💻 Code" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleModeChange(opt.value as any)}
                    disabled={startTime !== null && !isFinished}
                    style={{
                      padding: "6px 12px",
                      border: "2px solid var(--border)",
                      borderRadius: 4,
                      background: mode === opt.value ? "var(--text-primary)" : "var(--bg-surface)",
                      color: mode === opt.value ? "var(--bg-base)" : "var(--text-primary)",
                      fontFamily: "var(--font-ui)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: (startTime !== null && !isFinished) ? "not-allowed" : "pointer",
                      opacity: (startTime !== null && !isFinished) ? 0.5 : 1,
                      boxShadow: mode === opt.value ? "none" : "2px 2px 0 var(--shadow-color)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test duration */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Duration</span>
              <div style={{ display: "flex", gap: 6 }}>
                {[15, 30, 60, 120].map((t) => (
                  <button
                    key={t}
                    onClick={() => { if (startTime === null) setDuration(t); }}
                    disabled={startTime !== null && !isFinished}
                    style={{
                      padding: "6px 12px",
                      border: "2px solid var(--border)",
                      borderRadius: 4,
                      background: duration === t ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                      color: duration === t ? "#000000" : "var(--text-primary)",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: (startTime !== null && !isFinished) ? "not-allowed" : "pointer",
                      opacity: (startTime !== null && !isFinished) ? 0.5 : 1,
                      boxShadow: duration === t ? "none" : "2px 2px 0 var(--shadow-color)",
                    }}
                  >
                    {t}s
                  </button>
                ))}
              </div>
            </div>

            {/* Keyboard sound settings */}
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Key Switch Sound</span>
              <select
                value={soundProfile}
                onChange={(e) => setSoundProfile(e.target.value as any)}
                style={{ height: 32, width: 140, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
              >
                <option value="blue">Blue Clicky ⌨️</option>
                <option value="brown">Brown Tactile 🔊</option>
                <option value="none">Mute 🔇</option>
              </select>
            </label>

            {/* Font Style Selection */}
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Font Style</span>
              <select
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value as any)}
                style={{ height: 32, width: 130, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
              >
                <option value="mono">Rhythmic Mono</option>
                <option value="sans">Clean Sans</option>
                <option value="serif">Classic Serif</option>
              </select>
            </label>

            <button
              onClick={resetTest}
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
                cursor: "pointer",
                boxShadow: "2px 2px 0 var(--shadow-color)"
              }}
            >
              ↺ RESET TEST
            </button>
          </div>
        </div>
      }
    >
      <div 
        onClick={focusInput}
        style={{ 
          minHeight: 460, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 24, 
          padding: "36px 24px", 
          cursor: "text" 
        }}
      >
        
        {/* Hidden capturing input */}
        <input
          ref={hiddenInputRef}
          type="text"
          value={typedText}
          onChange={(e) => {
            if (!isFinished) {
              setTypedText(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            zIndex: -999,
          }}
          autoFocus
        />

        {/* Live Metrics Header Row */}
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 640 }}>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 800, color: "var(--section-clocks-accent)", lineHeight: 1 }}>
              {wpmVal}
            </span>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>WPM SPEED</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 800, color: accuracyVal > 90 ? "var(--accent-utility-a)" : "var(--accent-utility-d)", lineHeight: 1 }}>
              {accuracyVal}%
            </span>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>ACCURACY</p>
          </div>

          <div style={{ textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 44, fontWeight: 800, color: secondsRemaining < 10 ? "var(--destructive)" : "var(--text-primary)", lineHeight: 1 }}>
              {secondsRemaining}s
            </span>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>TIME LEFT</p>
          </div>
        </div>

        {/* Focus interactive Word Box */}
        <div 
          style={{ 
            width: "100%", 
            maxWidth: 640, 
            background: "var(--bg-card)", 
            border: "2px solid var(--border)", 
            borderRadius: 8, 
            padding: "24px 28px", 
            boxShadow: "var(--shadow-offset-md) var(--shadow-color)", 
            position: "relative",
            minHeight: 140,
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* Active status or instructions placeholder */}
          {startTime === null && (
            <div style={{ position: "absolute", bottom: 8, right: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <span className="dot dot-pulsing" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--section-clocks-accent)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Click in box & start typing to activate timer
              </span>
            </div>
          )}

          {/* Interactive Characters display */}
          <div 
            style={{ 
              lineHeight: 1.6, 
              letterSpacing: "0.02em", 
              fontFamily: fontStyle === "mono" ? "var(--font-mono)" : fontStyle === "serif" ? "var(--font-serif)" : "var(--font-ui)", 
              fontSize: "clamp(18px, 4.5vw, 24px)",
              textAlign: "left",
              width: "100%",
            }}
          >
            {targetText.split("").map((char, index) => {
              let color = "var(--text-faint)";
              let borderBottom = "none";
              let textDecoration = "none";

              if (index < typedText.length) {
                // Correct vs Incorrect
                const isCorrect = typedText.charAt(index) === char;
                color = isCorrect ? "var(--accent-utility-a)" : "var(--destructive)";
                textDecoration = isCorrect ? "none" : "underline";
              } else if (index === typedText.length && !isFinished) {
                // Flashing cursor style
                borderBottom = "3px solid var(--section-clocks-accent)";
                color = "var(--text-primary)";
              }

              // Visual space character replacement to make spaces visible if typed incorrectly
              const displayChar = char === " " && index < typedText.length && typedText.charAt(index) !== " " 
                ? "␣" 
                : char;

              return (
                <span 
                  key={index} 
                  style={{ 
                    color, 
                    borderBottom, 
                    textDecoration,
                    transition: "color 0.08s ease" 
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
          </div>
        </div>

        {/* Finished / Scoreboard View */}
        {isFinished && (
          <div style={{ width: "100%", maxWidth: 640, background: "rgba(197,241,53,0.06)", border: "2.5px solid var(--section-clocks-accent)", borderRadius: 8, padding: "20px 24px", textAlign: "center" }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 900, color: "var(--section-clocks-accent)", margin: "0 0 10px" }}>
              🏁 SPEED TYPING RESULT
            </h3>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 20px", minWidth: 120 }}>
                <span style={{ fontSize: 24, fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)" }}>{wpmVal}</span>
                <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Net WPM</p>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 20px", minWidth: 120 }}>
                <span style={{ fontSize: 24, fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)" }}>{accuracyVal}%</span>
                <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Accuracy</p>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 20px", minWidth: 120 }}>
                <span style={{ fontSize: 24, fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--destructive)" }}>{mistakes}</span>
                <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Key Errors</p>
              </div>
            </div>
            <button
              onClick={resetTest}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                padding: "10px 30px",
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: "var(--section-clocks-accent)",
                color: "#000000",
                cursor: "pointer",
                boxShadow: "2px 2px 0 var(--shadow-color)",
                marginTop: 20,
                letterSpacing: "0.06em"
              }}
            >
              PLAY AGAIN ↺
            </button>
          </div>
        )}

        {/* Tactile Virtual Keyboard visualizer */}
        <div 
          style={{ 
            width: "100%", 
            maxWidth: 580, 
            display: "flex", 
            flexDirection: "column", 
            gap: 6, 
            background: "var(--bg-card)", 
            border: "1px solid var(--border)", 
            borderRadius: 8, 
            padding: 12, 
            opacity: 0.85 
          }}
        >
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: "flex", gap: 5, justifyContent: "center" }}>
              {row.map((keyChar) => {
                const isActive = pressedKeys.has(keyChar);
                return (
                  <div
                    key={keyChar}
                    style={{
                      flex: 1,
                      maxWidth: 46,
                      height: 38,
                      borderRadius: 4,
                      border: "1px solid var(--border)",
                      background: isActive ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                      color: isActive ? "#000000" : "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      fontWeight: 700,
                      boxShadow: isActive ? "none" : "1px 1px 0 var(--shadow-color)",
                      transition: "background 0.05s, color 0.05s",
                    }}
                  >
                    {keyChar}
                  </div>
                );
              })}
            </div>
          ))}
          {/* Space bar row */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
            <div
              style={{
                width: "60%",
                height: 36,
                borderRadius: 4,
                border: "1px solid var(--border)",
                background: pressedKeys.has("SPACE") ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                color: pressedKeys.has("SPACE") ? "#000000" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                boxShadow: pressedKeys.has("SPACE") ? "none" : "1px 1px 0 var(--shadow-color)",
                transition: "background 0.05s",
              }}
            >
              SPACE
            </div>
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes pulse {
          0% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
        .dot-pulsing {
          animation: pulse 0.8s infinite alternate;
        }
      `}</style>
    </ClockLayout>
  );
}
