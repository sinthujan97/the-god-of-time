"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "meeting-cost-timer")!;

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${pad2(h)}:${pad2(m % 60)}:${pad2(s % 60)}` : `${pad2(m % 60)}:${pad2(s % 60)}`;
}

export default function MeetingCostTimer() {
  const [attendees, setAttendees] = useState(6);
  const [hourlyRate, setHourlyRate] = useState(75);
  const [, setTick] = useState(0);
  const [started, setStarted] = useState(false);

  const running = useRef(false);
  const startWall = useRef(0);
  const accumulated = useRef(0);
  const rafId = useRef(0);

  function elapsed() {
    return accumulated.current + (running.current ? Date.now() - startWall.current : 0);
  }

  function startStop() {
    if (running.current) {
      accumulated.current += Date.now() - startWall.current;
      running.current = false;
      cancelAnimationFrame(rafId.current);
      setTick((t) => t + 1);
    } else {
      setStarted(true);
      startWall.current = Date.now();
      running.current = true;
      function frame() { setTick((t) => t + 1); rafId.current = requestAnimationFrame(frame); }
      rafId.current = requestAnimationFrame(frame);
    }
  }

  function reset() {
    cancelAnimationFrame(rafId.current);
    running.current = false;
    accumulated.current = 0;
    setStarted(false);
    setTick(0);
  }

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  const ms = elapsed();
  const elapsedSecs = ms / 1000;
  const costPerSec = (attendees * hourlyRate) / 3600;
  const totalCost = costPerSec * elapsedSecs;
  const costPerMin = costPerSec * 60;

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-end" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Attendees</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="range" min={1} max={50} value={attendees}
                onChange={(e) => setAttendees(Number(e.target.value))}
                style={{ width: 120 }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", minWidth: 32 }}>{attendees}</span>
            </div>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Avg. hourly rate ($/hr)</span>
            <input
              type="number" min={1} max={10000} value={hourlyRate}
              onChange={(e) => setHourlyRate(Math.max(1, Number(e.target.value)))}
              style={{ width: 100, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
            />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={startStop} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "10px 20px", border: "2px solid var(--border)", borderRadius: 6, background: running.current ? "var(--destructive)" : "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              {running.current ? "PAUSE" : started ? "RESUME" : "START"}
            </button>
            <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "10px 16px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
              ↺
            </button>
          </div>
        </div>
      }
    >
      <div style={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "48px 32px" }}>

        {/* Cost display */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", marginBottom: 8 }}>
            Meeting cost
          </p>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(48px, 9vw, 84px)", fontWeight: 700, color: "var(--destructive)", lineHeight: 1 }}>
            ${totalCost.toFixed(2)}
          </div>
        </div>

        {/* Elapsed */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 700, color: "var(--text-muted)" }}>
          {fmtElapsed(ms)}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 0, border: "2px solid var(--border)", overflow: "hidden", borderRadius: 8 }}>
          {[
            { label: "Attendees",     value: String(attendees) },
            { label: "$/hr each",     value: `$${hourlyRate}` },
            { label: "$/min total",   value: `$${costPerMin.toFixed(2)}` },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: "14px 20px", textAlign: "center", borderLeft: i > 0 ? "2px solid var(--border)" : "none" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {!started && (
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>
            Set attendees and rate below, then press START.
          </p>
        )}
      </div>
    </ClockLayout>
  );
}
