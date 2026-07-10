"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "rhythm-test")!;

type TestPhase = "idle" | "listening" | "playing" | "results";

interface StrikeRecord {
  beatIndex: number;
  expectedMs: number;
  actualMs: number;
  error: number; // actual - expected
}

// Synthesizer Audio Cues
function playMetronomeTick(freq = 900, dur = 0.03) {
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
    osc.stop(ctx.currentTime + dur + 0.02);
  } catch {}
}

const getRhythmGrade = (avgOffset: number) => {
  if (avgOffset <= 20) return { grade: "S", label: "Atomic Metronome 🌟", desc: "Absolute professional-grade clockwork timing!", color: "var(--accent-utility-a)" };
  if (avgOffset <= 45) return { grade: "A", label: "Tight Groove ✨", desc: "Excellent rhythmic consistency!", color: "var(--accent-utility-c)" };
  if (avgOffset <= 80) return { grade: "B", label: "Good Pocket 👍", desc: "Solid timing, very reactable.", color: "var(--text-primary)" };
  if (avgOffset <= 130) return { grade: "C", label: "Drifting Beat 🤷", desc: "Noticeable timing lag or rush. Keep practicing!", color: "var(--accent-utility-d)" };
  return { grade: "F", label: "Rhythmically Lost 🌀", desc: "Large timing offset. Your internal clock is drifting heavily.", color: "var(--destructive)" };
};

export default function RhythmTest() {
  const [tempoBPM, setTempoBPM] = useState(120);
  const [anchorBeats, setAnchorBeats] = useState(4); // Audible beats
  const [targetStrikes, setTargetStrikes] = useState(8); // Tap checks

  // Gameplay state
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [activeBeat, setActiveBeat] = useState(0); // 1, 2, 3, 4
  const [strikes, setStrikes] = useState<StrikeRecord[]>([]);
  const [flash, setFlash] = useState(false);
  const [avgDeviancy, setAvgDeviancy] = useState(0);

  const beatIntervalMs = (60 / tempoBPM) * 1000;

  // Refs for callbacks & loops
  const phaseRef = useRef<TestPhase>("idle");
  const activeBeatRef = useRef(0);
  const anchorBeatsRef = useRef(anchorBeats);
  const targetStrikesRef = useRef(targetStrikes);
  const beatIntervalMsRef = useRef(beatIntervalMs);
  const startMsRef = useRef(0);
  const strikesRef = useRef<StrikeRecord[]>([]);

  phaseRef.current = phase;
  activeBeatRef.current = activeBeat;
  anchorBeatsRef.current = anchorBeats;
  targetStrikesRef.current = targetStrikes;
  beatIntervalMsRef.current = beatIntervalMs;
  strikesRef.current = strikes;

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    clearTimers();
    setPhase("listening");
    setActiveBeat(0);
    setStrikes([]);
    setFlash(false);
    setAvgDeviancy(0);
    
    // Play initial visual beat tick instantly
    const startMs = Date.now();
    startMsRef.current = startMs;
    playMetronomeTick(1200, 0.04);
    setActiveBeat(1);
    setFlash(true);
    setTimeout(() => setFlash(false), 80);

    let tickCount = 1;
    timerRef.current = setInterval(() => {
      tickCount++;
      const currentInterval = beatIntervalMsRef.current;
      
      // Calculate current beat number (1, 2, 3, 4...)
      const visualBeat = ((tickCount - 1) % 4) + 1;
      setActiveBeat(visualBeat);

      if (phaseRef.current === "listening") {
        // Play audible metronome click
        const freq = visualBeat === 1 ? 1200 : 800;
        playMetronomeTick(freq, 0.03);
        setFlash(true);
        setTimeout(() => setFlash(false), 80);

        // Transition to silent tapping once audible cues complete
        if (tickCount >= anchorBeatsRef.current) {
          setPhase("playing");
        }
      } else if (phaseRef.current === "playing") {
        // In playing phase, we still flash the background subtly on beat 1 for visual support
        if (visualBeat === 1) {
          setFlash(true);
          setTimeout(() => setFlash(false), 80);
        }
      }
    }, beatIntervalMs);
  };

  // Perform tap registration on strike click or spacebar
  const handleStrike = useCallback(() => {
    if (phaseRef.current !== "playing") return;

    const actualMs = Date.now();
    const currentInterval = beatIntervalMsRef.current;
    
    // Find expected beat time closest to tap
    const elapsed = actualMs - startMsRef.current;
    const closestBeatIdx = Math.round(elapsed / currentInterval);
    const expectedMs = startMsRef.current + closestBeatIdx * currentInterval;
    const error = actualMs - expectedMs;

    // Check if we already registered this beat index
    const alreadyRegistered = strikesRef.current.some(s => s.beatIndex === closestBeatIdx);
    if (alreadyRegistered) return; // Ignore double taps on same beat

    // Play quick tap audio feedback tone
    playMetronomeTick(500, 0.015);

    const record: StrikeRecord = {
      beatIndex: closestBeatIdx,
      expectedMs,
      actualMs,
      error
    };

    const nextStrikes = [...strikesRef.current, record];
    setStrikes(nextStrikes);

    if (nextStrikes.length >= targetStrikesRef.current) {
      clearTimers();
      
      // Calculate results
      const sum = nextStrikes.reduce((acc, curr) => acc + Math.abs(curr.error), 0);
      const avg = sum / nextStrikes.length;
      setAvgDeviancy(avg);
      setPhase("results");
    }
  }, []);

  // Listen for spacebar key down
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleStrike();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleStrike]);

  const rating = phase === "results" ? getRhythmGrade(avgDeviancy) : null;

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
          
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Tempo (BPM)</span>
            <select
              value={tempoBPM}
              onChange={(e) => setTempoBPM(Number(e.target.value))}
              disabled={phase !== "idle" && phase !== "results"}
              style={{ height: 32, width: 110, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
            >
              <option value={60}>60 BPM</option>
              <option value={90}>90 BPM</option>
              <option value={120}>120 BPM</option>
              <option value={150}>150 BPM</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Anchor Beats</span>
            <select
              value={anchorBeats}
              onChange={(e) => setAnchorBeats(Number(e.target.value))}
              disabled={phase !== "idle" && phase !== "results"}
              style={{ height: 32, width: 110, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
            >
              <option value={2}>2 Beats</option>
              <option value={4}>4 Beats</option>
              <option value={8}>8 Beats</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Target Taps</span>
            <select
              value={targetStrikes}
              onChange={(e) => setTargetStrikes(Number(e.target.value))}
              disabled={phase !== "idle" && phase !== "results"}
              style={{ height: 32, width: 110, fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 700, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "4px 6px", borderRadius: 4, cursor: "pointer" }}
            >
              <option value={4}>4 Taps</option>
              <option value={8}>8 Taps</option>
              <option value={12}>12 Taps</option>
            </select>
          </label>

          <button
            onClick={() => {
              clearTimers();
              setPhase("idle");
              setStrikes([]);
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
      }
    >
      <div 
        style={{ 
          minHeight: 420, 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center", 
          gap: 28, 
          padding: "48px 32px", 
          background: flash ? "rgba(197,241,53,0.06)" : "transparent",
          transition: "background-color 0.08s ease" 
        }}
      >
        
        {phase === "idle" && (
          <>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 850, color: "var(--text-primary)", margin: "0 0 10px" }}>
                Internal Rhythm Test
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: 0, maxWidth: 400, lineHeight: 1.5, marginLeft: "auto", marginRight: "auto" }}>
                Align your timing to the metronome tempo. The sound will fade after **{anchorBeats} beats**. Keep tapping in sync to complete the test!
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
              START PACE
            </button>
          </>
        )}

        {phase === "listening" && (
          <>
            {/* Visual Beat Pulse circles */}
            <div style={{ display: "flex", gap: 16 }}>
              {[1, 2, 3, 4].map((beatNum) => {
                const isActive = beatNum === activeBeat;
                return (
                  <div
                    key={beatNum}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      border: "3px solid var(--border)",
                      borderColor: isActive ? "var(--section-clocks-accent)" : "var(--border)",
                      background: isActive ? "var(--section-clocks-accent)" : "transparent",
                      boxShadow: isActive ? "0 0 15px var(--section-clocks-accent)" : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: 16,
                      fontWeight: 800,
                      color: isActive ? "#000000" : "var(--text-faint)",
                      transition: "background 0.08s, border-color 0.08s, color 0.08s",
                    }}
                  >
                    {beatNum}
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 4px" }}>
                Listen to the Beat...
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Metronome active · Tap button starting soon
              </p>
            </div>
          </>
        )}

        {phase === "playing" && (
          <>
            {/* Big Tactile Tapping Zone */}
            <button
              onMouseDown={handleStrike}
              style={{
                width: 160,
                height: 160,
                borderRadius: "50%",
                border: "3px solid var(--border)",
                background: "var(--bg-card)",
                cursor: "pointer",
                boxShadow: "var(--shadow-offset-md) var(--shadow-color)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                userSelect: "none"
              }}
            >
              <span style={{ fontSize: 32 }}>🥁</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 800, color: "var(--section-clocks-accent)", marginTop: 8, letterSpacing: "0.05em" }}>
                TAP HERE
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)", marginTop: 4 }}>
                (OR SPACEBAR)
              </span>
            </button>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 4px" }}>
                Maintain the Tempo!
              </p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Paced hits: {strikes.length} of {targetStrikes}
              </p>
            </div>
          </>
        )}

        {phase === "results" && rating && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 560 }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 4 }}>
                Average Deviancy
              </p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 58, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                ±{avgDeviancy.toFixed(1)}
                <span style={{ fontSize: 24, color: "var(--text-muted)", marginLeft: 2 }}>ms</span>
              </span>
              
              {/* Grade label */}
              <div style={{ marginTop: 12 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 900,
                    color: rating.color,
                    display: "block",
                  }}
                >
                  Grade {rating.grade}: {rating.label}
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", margin: "4px 0 0" }}>
                  {rating.desc}
                </p>
              </div>
            </div>

            {/* Visual offset timing scatter plot wheel */}
            <div style={{ width: "100%", maxWidth: 320, background: "var(--bg-card)", border: "2px solid var(--border)", borderRadius: 8, padding: "16px 20px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: 12 }}>
                Beat Alignment Scatter Plot
              </p>
              <div style={{ position: "relative", height: 28, borderBottom: "1px dashed var(--border)", display: "flex", alignItems: "center" }}>
                
                {/* Perfect center line */}
                <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "var(--section-clocks-accent)" }} />
                <span style={{ position: "absolute", left: 4, top: -2, fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-faint)" }}>EARLY</span>
                <span style={{ position: "absolute", right: 4, top: -2, fontFamily: "var(--font-mono)", fontSize: 8, color: "var(--text-faint)" }}>LATE</span>
                
                {/* Render tap positions */}
                {strikes.map((s, idx) => {
                  // Normalize error within -120ms to +120ms to fit on line (50% is center)
                  const bound = 120;
                  const ratio = Math.max(-1, Math.min(1, s.error / bound));
                  const percentage = 50 + ratio * 45; // range 5% to 95%
                  const isHit = Math.abs(s.error) <= 25;
                  const isClose = Math.abs(s.error) <= 60;
                  const dotColor = isHit ? "var(--accent-utility-a)" : isClose ? "var(--accent-utility-d)" : "var(--destructive)";
                  
                  return (
                    <div
                      key={idx}
                      title={`Tap #${idx + 1}: ${s.error > 0 ? "+" : ""}${s.error.toFixed(1)}ms`}
                      style={{
                        position: "absolute",
                        left: `${percentage}%`,
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: dotColor,
                        transform: "translateX(-50%)",
                        boxShadow: `0 0 6px ${dotColor}`,
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <button
              onClick={startTest}
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
                letterSpacing: "0.06em",
              }}
            >
              TEST AGAIN ↺
            </button>
          </div>
        )}

      </div>
    </ClockLayout>
  );
}
