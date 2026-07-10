"use client";

import { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "cps-test")!;

type TestMode = "cps" | "double-click";

interface ClickEventRecord {
  id: number;
  button: "Left" | "Right" | "Middle";
  timestamp: number;
  deltaMs: number | null; // time since last click of same button
  isDouble: boolean; // delta < 80ms
}

function playClickSound(freq = 600, dur = 0.01) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.01);
  } catch {}
}

const getCpsRank = (cps: number) => {
  if (cps >= 12) return { name: "Cheetah 🐆", color: "var(--accent-utility-a)", desc: "Godlike speed! Absolute typing/gaming beast." };
  if (cps >= 9) return { name: "Falcon 🦅", color: "var(--accent-utility-c)", desc: "Expert pace. Incredible click efficiency!" };
  if (cps >= 6) return { name: "Rabbit 🐇", color: "var(--text-primary)", desc: "Fast pace. Solid reaction and speed." };
  if (cps >= 3) return { name: "Turtle 🐢", color: "var(--accent-utility-d)", desc: "Average pace. Safe and steady." };
  return { name: "Sloth 🦥", color: "var(--destructive)", desc: "Slow pace. Great for precision, not speed." };
};

export default function CpsTester() {
  const [mode, setMode] = useState<TestMode>("cps");

  // CPS Mode state
  const [cpsDuration, setCpsDuration] = useState<number>(5); // 5s, 10s, 15s
  const [cpsCount, setCpsCount] = useState(0);
  const [cpsStartMs, setCpsStartMs] = useState<number | null>(null);
  const [cpsElapsed, setCpsElapsed] = useState(0);
  const [cpsFinished, setCpsFinished] = useState(false);

  // Double Click Mode state
  const [clickRecords, setClickRecords] = useState<ClickEventRecord[]>([]);
  const [lastClickTimes, setLastClickTimes] = useState<Record<string, number>>({
    Left: 0,
    Right: 0,
    Middle: 0
  });
  const [stats, setStats] = useState({
    leftTotal: 0,
    leftDouble: 0,
    rightTotal: 0,
    rightDouble: 0,
    middleTotal: 0,
    middleDouble: 0
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cpsCountRef = useRef(cpsCount);
  cpsCountRef.current = cpsCount;

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  // Handle click in CPS Mode
  const handleCpsClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (cpsFinished) return;

    // Start timer on first click
    let startTime = cpsStartMs;
    if (startTime === null) {
      startTime = Date.now();
      setCpsStartMs(startTime);
      timerRef.current = setInterval(() => {
        setCpsStartMs((startedAt) => {
          if (startedAt !== null) {
            const diff = (Date.now() - startedAt) / 1000;
            if (diff >= cpsDuration) {
              setCpsFinished(true);
              clearTimer();
              return startedAt;
            }
            setCpsElapsed(diff);
          }
          return startedAt;
        });
      }, 50);
    }

    setCpsCount((prev) => prev + 1);

    // Play click sound with pitch that increases with faster clicking rate
    const currentRate = cpsCountRef.current / Math.max(0.1, cpsElapsed);
    const freq = 500 + Math.min(500, currentRate * 25);
    playClickSound(freq, 0.012);
  };

  const resetCps = () => {
    clearTimer();
    setCpsCount(0);
    setCpsStartMs(null);
    setCpsElapsed(0);
    setCpsFinished(false);
  };

  // Handle click in Double Click diagnostic Mode
  const handleDiagnosticClick = (e: React.MouseEvent, buttonType: "Left" | "Right" | "Middle") => {
    e.preventDefault();
    playClickSound(750, 0.015);

    const now = Date.now();
    const lastTime = lastClickTimes[buttonType];
    const delta = lastTime > 0 ? now - lastTime : null;
    const isDouble = delta !== null && delta < 80; // Typically < 80ms is switch chatter

    const record: ClickEventRecord = {
      id: now + Math.random(),
      button: buttonType,
      timestamp: now,
      deltaMs: delta,
      isDouble
    };

    setClickRecords((prev) => [record, ...prev].slice(0, 50)); // Keep last 50 clicks
    setLastClickTimes((prev) => ({ ...prev, [buttonType]: now }));

    // Update stats counters
    setStats((prev) => {
      const next = { ...prev };
      if (buttonType === "Left") {
        next.leftTotal += 1;
        if (isDouble) next.leftDouble += 1;
      } else if (buttonType === "Right") {
        next.rightTotal += 1;
        if (isDouble) next.rightDouble += 1;
      } else {
        next.middleTotal += 1;
        if (isDouble) next.middleDouble += 1;
      }
      return next;
    });
  };

  const clearDiagnosticLogs = () => {
    setClickRecords([]);
    setLastClickTimes({ Left: 0, Right: 0, Middle: 0 });
    setStats({
      leftTotal: 0,
      leftDouble: 0,
      rightTotal: 0,
      rightDouble: 0,
      middleTotal: 0,
      middleDouble: 0
    });
  };

  // Calculate live WPM/CPS metrics
  const liveCps = cpsElapsed > 0 ? cpsCount / cpsElapsed : 0;
  const cpsSecondsRemaining = Math.max(0, Math.ceil(cpsDuration - cpsElapsed));

  const controlsSection = (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
      
      {/* Selector toggle */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Tester Mode</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { value: "cps", label: "⚡ CPS Speed Test" },
            { value: "double-click", label: "🖱️ Double Click Diagnostics" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setMode(opt.value as any);
                resetCps();
                clearDiagnosticLogs();
              }}
              style={{
                padding: "6px 12px",
                border: "2px solid var(--border)",
                borderRadius: 4,
                background: mode === opt.value ? "var(--text-primary)" : "var(--bg-surface)",
                color: mode === opt.value ? "var(--bg-base)" : "var(--text-primary)",
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: mode === opt.value ? "none" : "2px 2px 0 var(--shadow-color)",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration selector for CPS Speed Test */}
      {mode === "cps" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Trial Time</span>
          <div style={{ display: "flex", gap: 6 }}>
            {[5, 10, 15].map((t) => (
              <button
                key={t}
                onClick={() => { if (cpsStartMs === null) setCpsDuration(t); }}
                disabled={cpsStartMs !== null && !cpsFinished}
                style={{
                  padding: "6px 12px",
                  border: "2px solid var(--border)",
                  borderRadius: 4,
                  background: cpsDuration === t ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                  color: cpsDuration === t ? "#000000" : "var(--text-primary)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: (cpsStartMs !== null && !cpsFinished) ? "not-allowed" : "pointer",
                  opacity: (cpsStartMs !== null && !cpsFinished) ? 0.5 : 1,
                  boxShadow: cpsDuration === t ? "none" : "2px 2px 0 var(--shadow-color)",
                }}
              >
                {t}s
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === "cps" ? (
        <button
          onClick={resetCps}
          disabled={cpsStartMs === null}
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
            cursor: cpsStartMs === null ? "default" : "pointer",
            opacity: cpsStartMs === null ? 0.5 : 1,
            boxShadow: cpsStartMs === null ? "none" : "2px 2px 0 var(--shadow-color)"
          }}
        >
          RESTART
        </button>
      ) : (
        <button
          onClick={clearDiagnosticLogs}
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
          CLEAR LOGS
        </button>
      )}

    </div>
  );

  return (
    <ClockLayout clock={clock} controlsSection={controlsSection}>
      <div style={{ minHeight: 420, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "40px 24px", background: "var(--bg-base)" }}>
        
        {/* MODE 1: CPS Speed Clicker */}
        {mode === "cps" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
            
            {/* CPS metrics row */}
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 500 }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 800, color: "var(--section-clocks-accent)", lineHeight: 1 }}>
                  {cpsCount}
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Total Clicks</p>
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
                  {liveCps.toFixed(1)}
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Clicks / Sec</p>
              </div>

              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 48, fontWeight: 800, color: cpsSecondsRemaining < 3 ? "var(--destructive)" : "var(--text-primary)", lineHeight: 1 }}>
                  {cpsSecondsRemaining}s
                </span>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>Time Remaining</p>
              </div>
            </div>

            {/* Tap speed Click Pad */}
            <button
              onMouseDown={handleCpsClick}
              onTouchStart={handleCpsClick}
              style={{
                width: "100%",
                maxWidth: 480,
                height: 180,
                border: "3px solid var(--border)",
                borderRadius: 12,
                background: "var(--bg-card)",
                cursor: cpsFinished ? "default" : "pointer",
                boxShadow: "var(--shadow-offset-md) var(--shadow-color)",
                outline: "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                userSelect: "none"
              }}
            >
              {cpsStartMs === null ? (
                <>
                  <span style={{ fontSize: 32 }}>⚡</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--section-clocks-accent)", marginTop: 8 }}>
                    CLICK PAD TO START TIMER
                  </span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                    Tap as fast as you can!
                  </span>
                </>
              ) : cpsFinished ? (
                <>
                  <span style={{ fontSize: 32 }}>🏁</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800, color: "var(--accent-utility-a)", marginTop: 8 }}>
                    TRIAL COMPLETED
                  </span>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                    See results below
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: 36 }}>🔥</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 900, color: "var(--text-primary)", marginTop: 4 }}>
                    CLICK! CLICK! CLICK!
                  </span>
                </>
              )}
            </button>

            {/* Results score panel */}
            {cpsFinished && (
              <div style={{ width: "100%", maxWidth: 480, background: "rgba(197,241,53,0.06)", border: "2.5px solid var(--section-clocks-accent)", borderRadius: 10, padding: "20px 24px", textAlign: "center" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 900, color: "var(--section-clocks-accent)", margin: "0 0 10px" }}>
                  CPS BENCHMARK COMPLETED
                </h3>
                
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 12 }}>
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 24px", minWidth: 140 }}>
                    <span style={{ fontSize: 32, fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-primary)" }}>{liveCps.toFixed(2)}</span>
                    <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Clicks / Sec (CPS)</p>
                  </div>
                  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 24px", minWidth: 140 }}>
                    <span style={{ fontSize: 32, fontFamily: "var(--font-mono)", fontWeight: 800, color: getCpsRank(liveCps).color }}>{getCpsRank(liveCps).name}</span>
                    <p style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-muted)", margin: "4px 0 0", textTransform: "uppercase" }}>Speed Rank</p>
                  </div>
                </div>

                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", marginTop: 16, fontStyle: "italic" }}>
                  "{getCpsRank(liveCps).desc}"
                </p>

                <button
                  onClick={resetCps}
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
                  RETRY BENCHMARK ↺
                </button>
              </div>
            )}

          </div>
        )}

        {/* MODE 2: Mouse Double Click Diagnostics */}
        {mode === "double-click" && (
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", width: "100%", maxWidth: 640 }}>
            
            {/* Left Column: Diagnostics Click Area */}
            <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 900, color: "var(--text-primary)", margin: "0 0 4px" }}>
                  Switch Diagnostics Pad
                </p>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
                  Click buttons inside the boxes to test for switch bounce/chatter errors.
                </p>
              </div>

              {/* Grid of test mouse buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                
                {/* Left & Right Button split row */}
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onMouseDown={(e) => handleDiagnosticClick(e, "Left")}
                    style={{
                      flex: 1,
                      height: 100,
                      border: "3px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--bg-card)",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      boxShadow: "2px 2px 0 var(--shadow-color)",
                      outline: "none"
                    }}
                  >
                    LEFT CLICK
                  </button>

                  <button
                    onMouseDown={(e) => handleDiagnosticClick(e, "Right")}
                    onContextMenu={(e) => handleDiagnosticClick(e, "Right")}
                    style={{
                      flex: 1,
                      height: 100,
                      border: "3px solid var(--border)",
                      borderRadius: 8,
                      background: "var(--bg-card)",
                      cursor: "pointer",
                      fontFamily: "var(--font-mono)",
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      boxShadow: "2px 2px 0 var(--shadow-color)",
                      outline: "none"
                    }}
                  >
                    RIGHT CLICK
                  </button>
                </div>

                {/* Middle scroll wheel click button */}
                <button
                  onMouseDown={(e) => {
                    // Button value 1 is middle scroll wheel click
                    if (e.button === 1) {
                      handleDiagnosticClick(e, "Middle");
                    }
                  }}
                  onClick={(e) => {
                    // Prevent page scrolling on middle click
                    e.preventDefault();
                  }}
                  style={{
                    width: "100%",
                    height: 64,
                    border: "3px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-card)",
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    boxShadow: "2px 2px 0 var(--shadow-color)",
                    outline: "none"
                  }}
                >
                  SCROLL WHEEL (MIDDLE) CLICK
                </button>
              </div>

              {/* Statistics Panel */}
              <div style={{ background: "var(--bg-card)", border: "2px solid var(--border)", borderRadius: 8, padding: 16 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Diagnostics Stats
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "between", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Left Clicks:</span>
                    <strong style={{ color: "var(--text-primary)" }}>
                      {stats.leftTotal} ({stats.leftDouble} chatter warning)
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "between", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Right Clicks:</span>
                    <strong style={{ color: "var(--text-primary)" }}>
                      {stats.rightTotal} ({stats.rightDouble} chatter warning)
                    </strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "between", fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Middle Clicks:</span>
                    <strong style={{ color: "var(--text-primary)" }}>
                      {stats.middleTotal} ({stats.middleDouble} chatter warning)
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Diagnostic event logs list */}
            <div style={{ flex: 1.2, minWidth: 280, display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                Switch Chatter Event Log
              </span>
              <div 
                style={{ 
                  height: 310, 
                  border: "2px solid var(--border)", 
                  borderRadius: 8, 
                  background: "var(--bg-surface)", 
                  padding: 12, 
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8
                }}
              >
                {clickRecords.length === 0 ? (
                  <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)" }}>
                      Waiting for click events...
                    </span>
                  </div>
                ) : (
                  clickRecords.map((rec) => (
                    <div
                      key={rec.id}
                      style={{
                        background: rec.isDouble ? "rgba(239, 68, 68, 0.08)" : "var(--bg-card)",
                        border: `1px solid ${rec.isDouble ? "var(--destructive)" : "var(--border)"}`,
                        borderRadius: 4,
                        padding: "6px 10px",
                        display: "flex",
                        justifyContent: "between",
                        alignItems: "center",
                        fontSize: 12,
                        fontFamily: "var(--font-mono)"
                      }}
                    >
                      <span style={{ color: rec.isDouble ? "var(--destructive)" : "var(--text-primary)", fontWeight: 700 }}>
                        {rec.button} Click
                      </span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {rec.deltaMs !== null ? (
                          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            {rec.deltaMs}ms interval
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: "var(--text-faint)" }}>
                            First
                          </span>
                        )}
                        {rec.isDouble && (
                          <span
                            title="Very short click-release bounce interval indicates hardware switch bounce malfunction."
                            style={{
                              background: "var(--destructive)",
                              color: "#ffffff",
                              fontSize: 9,
                              fontWeight: 700,
                              padding: "2px 4px",
                              borderRadius: 3
                            }}
                          >
                            CHATTER!
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </ClockLayout>
  );
}
