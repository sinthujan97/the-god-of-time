"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "presentation-timer")!;

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtSecs(s: number) {
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${pad2(h)}:${pad2(m % 60)}:${pad2(s % 60)}` : `${pad2(m)}:${pad2(s % 60)}`;
}

export default function PresentationTimer() {
  const [totalMins, setTotalMins] = useState(20);
  const [slides, setSlides] = useState(5);
  const [useCustomSlides, setUseCustomSlides] = useState(false);
  const [slideDurations, setSlideDurations] = useState<number[]>([]);
  const [slideNames, setSlideNames] = useState<string[]>([]);
  
  const [secsLeft, setSecsLeft] = useState(20 * 60);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(secsLeft);
  secsRef.current = secsLeft;

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

  // Sync slide counts on mount and adjustments
  useEffect(() => {
    setSlideDurations((prev) => {
      const next = [...prev];
      if (slides > prev.length) {
        // Equal division defaults
        const defaultSecs = Math.max(10, Math.floor((totalMins * 60) / slides));
        while (next.length < slides) {
          next.push(defaultSecs);
        }
      } else if (slides < prev.length) {
        next.length = slides;
      }
      return next;
    });

    setSlideNames((prev) => {
      const next = [...prev];
      if (slides > prev.length) {
        while (next.length < slides) {
          next.push(`Slide ${next.length + 1}`);
        }
      } else if (slides < prev.length) {
        next.length = slides;
      }
      return next;
    });
  }, [slides, totalMins]);

  function startStop() {
    if (running) {
      clearIv(); setRunning(false);
    } else {
      setStarted(true); setRunning(true);
      ivRef.current = setInterval(() => {
        if (secsRef.current <= 1) { clearIv(); setRunning(false); setSecsLeft(0); }
        else setSecsLeft((s) => s - 1);
      }, 1000);
    }
  }

  function reset() {
    clearIv(); setRunning(false); setStarted(false);
    const s = useCustomSlides && slideDurations.length > 0
      ? slideDurations.reduce((a, b) => a + b, 0)
      : totalMins * 60;
    setSecsLeft(s); secsRef.current = s;
  }

  useEffect(() => {
    if (!started) {
      if (useCustomSlides && slideDurations.length > 0) {
        const s = slideDurations.reduce((a, b) => a + b, 0);
        setSecsLeft(s);
        secsRef.current = s;
      } else {
        const s = totalMins * 60;
        setSecsLeft(s);
        secsRef.current = s;
      }
    }
  }, [totalMins, slideDurations, started, useCustomSlides]);

  useEffect(() => () => clearIv(), []);

  // Time calculations
  const totalSecs = useCustomSlides && slideDurations.length > 0
    ? slideDurations.reduce((a, b) => a + b, 0)
    : totalMins * 60;

  const ratio = totalSecs > 0 ? secsLeft / totalSecs : 0;
  const elapsedSecs = Math.max(0, totalSecs - secsLeft);

  const phaseColor = ratio > 0.25
    ? "var(--accent-utility-a)"
    : ratio > 0.10
      ? "var(--accent-utility-d)"
      : "var(--destructive)";

  // Calculate current slide and slide progress
  let currentSlide = 0;
  let slideSecsLeft = 0;
  let currentSlideName = "";
  let currentSlideDuration = 0;

  if (slides > 0 && slideDurations.length === slides) {
    if (useCustomSlides) {
      let accum = 0;
      let foundIdx = 0;
      for (let i = 0; i < slides; i++) {
        const dur = slideDurations[i];
        if (elapsedSecs < accum + dur) {
          foundIdx = i;
          break;
        }
        accum += dur;
        if (i === slides - 1) {
          foundIdx = i;
        }
      }
      currentSlide = foundIdx + 1;
      currentSlideName = slideNames[foundIdx] || `Slide ${currentSlide}`;
      currentSlideDuration = slideDurations[foundIdx];
      const elapsedOnSlide = elapsedSecs - accum;
      slideSecsLeft = Math.max(0, currentSlideDuration - elapsedOnSlide);
    } else {
      const secsPerSlide = Math.floor(totalSecs / slides);
      currentSlide = Math.min(slides, Math.floor(elapsedSecs / secsPerSlide) + 1);
      currentSlideName = slideNames[currentSlide - 1] || `Slide ${currentSlide}`;
      currentSlideDuration = secsPerSlide;
      slideSecsLeft = secsPerSlide - (elapsedSecs % secsPerSlide);
    }
  }

  // Update specific slide duration
  const updateSlideDuration = (idx: number, secs: number) => {
    setSlideDurations((prev) => {
      const next = [...prev];
      next[idx] = Math.max(5, secs); // Minimum 5 seconds per slide
      return next;
    });
  };

  // Update specific slide name
  const updateSlideName = (idx: number, name: string) => {
    setSlideNames((prev) => {
      const next = [...prev];
      next[idx] = name;
      return next;
    });
  };

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end" }}>
            
            {!useCustomSlides && (
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Total Time (min)</span>
                <input
                  type="number" min={1} max={240} value={totalMins}
                  onChange={(e) => { if (!started) setTotalMins(Math.max(1, Math.min(240, Number(e.target.value)))); }}
                  disabled={started}
                  style={{ width: 96, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: started ? "var(--text-muted)" : "var(--text-primary)", padding: "8px 6px", borderRadius: 4 }}
                />
              </label>
            )}

            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Number of Slides</span>
              <input
                type="number" min={1} max={50} value={slides}
                onChange={(e) => { if (!started) setSlides(Math.max(1, Math.min(50, Number(e.target.value)))); }}
                disabled={started}
                style={{ width: 96, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: started ? "var(--text-muted)" : "var(--text-primary)", padding: "8px 6px", borderRadius: 4 }}
              />
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 44 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: started ? "not-allowed" : "pointer", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={useCustomSlides}
                  onChange={(e) => { if (!started) setUseCustomSlides(e.target.checked); }}
                  disabled={started}
                  style={{ width: 18, height: 18, cursor: started ? "not-allowed" : "pointer", accentColor: "var(--section-clocks-accent)" }}
                />
                Individual Slide Times
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
              <button onClick={startStop} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "12px 28px", border: "2px solid var(--border)", borderRadius: 6, background: running ? "var(--destructive)" : "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)", letterSpacing: "0.06em" }}>
                {running ? "PAUSE" : started ? "RESUME" : "START PRESENTATION"}
              </button>
              <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "12px 20px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
                ↺ RESET
              </button>
            </div>
          </div>

          {/* Individual Slide Configuration Grid */}
          {useCustomSlides && !started && (
            <div style={{ border: "2px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", padding: 18 }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 12 }}>
                Configure Slide Times (Total: {fmtSecs(slideDurations.reduce((a, b) => a + b, 0))})
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, maxHeight: 200, overflowY: "auto", paddingRight: 4 }}>
                {Array.from({ length: slides }).map((_, i) => {
                  const duration = slideDurations[i] || 120;
                  const mins = Math.floor(duration / 60);
                  const secs = duration % 60;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 4, padding: "8px 12px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--text-muted)", width: 24 }}>
                        #{i + 1}
                      </span>
                      <input
                        type="text"
                        value={slideNames[i] || ""}
                        onChange={(e) => updateSlideName(i, e.target.value)}
                        placeholder={`Slide ${i + 1}`}
                        style={{ flex: 1, minWidth: 70, fontFamily: "var(--font-ui)", fontSize: 13, background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-primary)", padding: "4px 8px", borderRadius: 3 }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <input
                          type="number" min={0} max={59} value={mins}
                          onChange={(e) => updateSlideDuration(i, Math.max(0, Number(e.target.value)) * 60 + secs)}
                          style={{ width: 44, fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, textAlign: "center", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", padding: 4, borderRadius: 3 }}
                        />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>m</span>
                        <input
                          type="number" min={0} max={59} value={secs}
                          onChange={(e) => updateSlideDuration(i, mins * 60 + Math.max(0, Math.min(59, Number(e.target.value))))}
                          style={{ width: 44, fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, textAlign: "center", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", padding: 4, borderRadius: 3 }}
                        />
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>s</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      }
    >
      <div style={{ minHeight: 330, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "48px 32px", background: started ? `${phaseColor}10` : "transparent", transition: "background 0.6s ease" }}>

        {/* Main Presentation Timer */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(60px, 12vw, 110px)", fontWeight: 800, lineHeight: 1, color: started ? phaseColor : "var(--text-primary)", transition: "color 0.6s ease" }}>
            {fmtSecs(secsLeft)}
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 8 }}>
            Total Remaining Time
          </p>
        </div>

        {/* Progress Bar with Custom Slide Markers */}
        <div style={{ width: "100%", maxWidth: 520, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ width: "100%", height: 10, background: "var(--bg-card)", border: "2px solid var(--border)", borderRadius: 5, overflow: "hidden", position: "relative" }}>
            
            {/* Active progress color scale */}
            <div style={{ height: "100%", width: "100%", background: phaseColor, borderRadius: 4, transform: `scaleX(${ratio})`, transformOrigin: "left", transition: "transform 0.9s linear, background 0.6s ease" }} />
            
            {/* Custom slide segmentation markers */}
            {slides > 0 && slideDurations.length === slides && (
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {(() => {
                  let runningSum = 0;
                  return slideDurations.slice(0, -1).map((dur, idx) => {
                    runningSum += dur;
                    const pct = (runningSum / totalSecs) * 100;
                    return (
                      <div
                        key={idx}
                        style={{
                          position: "absolute",
                          left: `${pct}%`,
                          top: 0,
                          bottom: 0,
                          width: 2,
                          background: "var(--border)",
                          opacity: 0.6,
                        }}
                      />
                    );
                  });
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Slide Navigation / Indicator */}
        {slides > 0 && started && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginTop: 10, width: "100%", maxWidth: 440 }}>
            <div style={{ display: "flex", width: "100%", gap: 24, justifyContent: "center" }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                  {currentSlide} <span style={{ fontSize: 14, color: "var(--text-muted)" }}>/ {slides}</span>
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
                  Current Slide
                </p>
              </div>

              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, fontWeight: 800, color: "var(--text-primary)" }}>
                  {fmtSecs(slideSecsLeft)}
                </div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
                  Slide Remaining
                </p>
              </div>
            </div>

            {/* Slide title / upcoming list banner */}
            <div style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent-utility-c)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
                Active Slide Topic
              </span>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginTop: 2 }}>
                {currentSlideName}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                Duration: {fmtSecs(currentSlideDuration)}
              </div>
            </div>
          </div>
        )}

        {!started && (
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>
            Setup presentation details, toggle Individual Times to configure each slide, then click START.
          </p>
        )}

        {secsLeft === 0 && (
          <div style={{ padding: "12px 24px", background: "rgba(220,38,38,0.15)", border: "2px dashed var(--destructive)", borderRadius: 6, animation: "pulse 1s infinite alternate" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--destructive)", margin: 0, letterSpacing: "0.05em" }}>
              ⏱️ PRESENTATION TIME COMPLETED
            </p>
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
