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
  const [slides, setSlides] = useState(0);
  const [secsLeft, setSecsLeft] = useState(20 * 60);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(secsLeft);
  secsRef.current = secsLeft;

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

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
    const s = totalMins * 60;
    setSecsLeft(s); secsRef.current = s;
  }

  useEffect(() => {
    if (!started) { setSecsLeft(totalMins * 60); secsRef.current = totalMins * 60; }
  }, [totalMins, started]);

  useEffect(() => () => clearIv(), []);

  const totalSecs = totalMins * 60;
  const ratio = totalSecs > 0 ? secsLeft / totalSecs : 0;

  const phaseColor = ratio > 0.25
    ? "var(--accent-utility-a)"
    : ratio > 0.10
      ? "var(--accent-utility-d)"
      : "var(--destructive)";

  const secsPerSlide = slides > 0 ? Math.floor(totalSecs / slides) : 0;
  const currentSlide = slides > 0 ? Math.min(slides, Math.floor((totalSecs - secsLeft) / secsPerSlide) + 1) : 0;
  const slideSecsLeft = slides > 0 ? secsPerSlide - ((totalSecs - secsLeft) % secsPerSlide) : 0;

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Total time (min)</span>
            <input
              type="number" min={1} max={240} value={totalMins}
              onChange={(e) => { if (!started) setTotalMins(Math.max(1, Math.min(240, Number(e.target.value)))); }}
              style={{ width: 80, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Slides (0 = off)</span>
            <input
              type="number" min={0} max={200} value={slides}
              onChange={(e) => setSlides(Math.max(0, Math.min(200, Number(e.target.value))))}
              style={{ width: 80, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
            />
          </label>
          {slides > 0 && secsPerSlide > 0 && (
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>
              {fmtSecs(secsPerSlide)} per slide
            </p>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={startStop} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "10px 20px", border: "2px solid var(--border)", borderRadius: 6, background: running ? "var(--destructive)" : "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              {running ? "PAUSE" : started ? "RESUME" : "START"}
            </button>
            <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "10px 16px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
              ↺
            </button>
          </div>
        </div>
      }
    >
      <div style={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "48px 32px", background: started ? `${phaseColor}14` : "transparent", transition: "background 0.6s ease" }}>

        {/* Main timer */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(60px, 11vw, 100px)", fontWeight: 700, lineHeight: 1, color: started ? phaseColor : "var(--text-primary)", transition: "color 0.6s ease" }}>
          {fmtSecs(secsLeft)}
        </div>

        {/* Progress bar */}
        <div style={{ width: "100%", maxWidth: 480, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: "100%", background: phaseColor, borderRadius: 4, transform: `scaleX(${ratio})`, transformOrigin: "left", transition: "transform 0.9s linear, background 0.6s ease" }} />
        </div>

        {/* Slide info */}
        {slides > 0 && started && (
          <div style={{ display: "flex", gap: 24, marginTop: 4 }}>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>{currentSlide}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-muted)" }}> / {slides}</span>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Slide</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--text-primary)" }}>{fmtSecs(slideSecsLeft)}</span>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>This slide</p>
            </div>
          </div>
        )}

        {!started && (
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>
            Set your time below, then press START. Press F for fullscreen.
          </p>
        )}

        {secsLeft === 0 && (
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--destructive)" }}>TIME&apos;S UP</p>
        )}
      </div>
    </ClockLayout>
  );
}
