"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

type TravelerDate = {
  date: string;
  name: string;
  count: number;
  notes: string;
};

const FAMOUS_DATES: TravelerDate[] = [
  { date: "1969-07-20", name: "Apollo 11 Moon Landing", count: 342, notes: "Mostly disguised as backup telemetry engineers in white shirts. Chronal interference: Low." },
  { date: "1914-06-28", name: "Assassination of Archduke Franz Ferdinand", count: 1840, notes: "Extremely high density. Chronal congestion at maximum; many travelers caught trying to shift the driver's route." },
  { date: "1865-04-14", name: "Lincoln's Assassination at Ford's Theatre", count: 94, notes: "Faint temporal markers in the balcony box. Restricted zone due to grandfather hazard protocols." },
  { date: "2009-06-28", name: "Stephen Hawking's Time Traveler Party", count: 0, notes: "Chronal density: Zero. (Strict paradox guidelines prevented attendance, or everyone simply forgot)." },
  { date: "1776-07-04", name: "Signing of the US Declaration", count: 47, notes: "Disguised in high-collared jackets in the back benches. Spacetime integrity: 98%." },
];

const realm = realmsRegistry.find((r) => r.slug === "time-paradox")!;

export default function TimeParadox() {
  // Grandfather Parser
  const [paradoxInput, setParadoxInput] = useState("");
  const [parserResult, setParserResult] = useState<string | null>(null);

  // Deja Vu Calculator
  const [dejaVuProb, setDejaVuProb] = useState(4.1298);

  // Traveler Density
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);

  // Questionnaire
  const [loopAnswers, setLoopAnswers] = useState<Record<number, string>>({});
  const [loopDiagnosis, setLoopDiagnosis] = useState<string | null>(null);

  // Canvas Oscilloscope state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useCanvasSize(
    canvasRef,
    useCallback((w: number, h: number) => {
      sizeRef.current = { w, h };
    }, [])
  );

  // Update Deja Vu probability based on small sub-second oscillations
  useEffect(() => {
    const interval = setInterval(() => {
      setDejaVuProb((prev) => {
        const delta = (Math.random() - 0.5) * 0.15;
        const next = Math.max(0.01, Math.min(99.99, prev + delta));
        return next;
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Oscilloscope drawing logic
  const drawWaves = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(drawWaves);
      return;
    }

    const isDark = !document.documentElement.classList.contains("light");
    ctx.clearRect(0, 0, w, h);

    // Draw grid background
    ctx.strokeStyle = isDark ? "rgba(255, 50, 50, 0.04)" : "rgba(150, 0, 0, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 30;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw reference line in center
    ctx.strokeStyle = isDark ? "rgba(255, 50, 50, 0.1)" : "rgba(150, 0, 0, 0.08)";
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Draw timeline waves (1 original, 1 loop overlapping)
    const amp = h * 0.25;
    const freq = 0.015;
    timeRef.current += 0.02;

    // Timeline A (Stable base)
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * freq + timeRef.current) * amp;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDark ? "rgba(255, 80, 80, 0.45)" : "rgba(220, 40, 40, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Timeline B (Looping timeline overlap causing deja vu)
    ctx.beginPath();
    const overlapShift = dejaVuProb * 0.05; // overlaps more when deja vu is higher
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin(x * freq * 1.05 - timeRef.current * 0.8 + overlapShift) * amp * Math.cos(x * 0.002);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isDark ? "rgba(235, 178, 93, 0.45)" : "rgba(189, 131, 43, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Draw paradox collision nodes (where timelines intersect)
    ctx.fillStyle = isDark ? "rgba(255, 230, 100, 0.8)" : "rgba(200, 100, 0, 0.7)";
    for (let x = 100; x < w; x += 180) {
      const yA = h / 2 + Math.sin(x * freq + timeRef.current) * amp;
      ctx.beginPath();
      ctx.arc(x, yA, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(drawWaves);
  }, [dejaVuProb]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawWaves);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawWaves]);

  const handleParseCausality = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paradoxInput.trim()) return;

    const lower = paradoxInput.toLowerCase();
    let resultText = "";

    if (lower.includes("grandfather") || lower.includes("parent") || lower.includes("father") || lower.includes("mother") || lower.includes("born")) {
      resultText = "⚠️ CRITICAL HAZARD: Direct Ancestral Paradox detected. Your action interrupts the lineage required to construct the time machine. Self-erasure index: 99.7%. Status: Feedback loops will dissolve your molecular structure.";
    } else if (lower.includes("kill") || lower.includes("steal") || lower.includes("prevent")) {
      resultText = "⚡ TEMPORAL BRANCH DETECTED: Action introduces moderate causality changes. Origin timeline remains preserved; a branching timeline will split off at the event location. Stability rating: 78%.";
    } else {
      resultText = "✅ CAUSAL STABILITY ASSURED: Minor timeline perturbation. Spacetime elasticity is sufficient to absorb this deviation without collapsing. Stability rating: 96%.";
    }

    setParserResult(resultText);
  };

  const handleLoopAnswer = (qIndex: number, answer: string) => {
    const nextAnswers = { ...loopAnswers, [qIndex]: answer };
    setLoopAnswers(nextAnswers);

    if (Object.keys(nextAnswers).length === 3) {
      if (nextAnswers[1] === "yes" && nextAnswers[2] === "groundhog") {
        setLoopDiagnosis("DIAGNOSIS: Level 5 Chronal Loop. You are currently on loop iteration #482,714. Escape protocol: drink your morning beverage in reverse order, skip two paving stones tomorrow, and avoid reading this exact warning again.");
      } else {
        setLoopDiagnosis("DIAGNOSIS: Mild Habit Loop detected. You are not physically trapped in space-time, but your daily routine mimics a loop. Escape protocol: take a different route home today, write a letter to your future self, or walk backwards for 5 paces.");
      }
    }
  };

  const resetLoopQuiz = () => {
    setLoopAnswers({});
    setLoopDiagnosis(null);
  };

  const inputZone = (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* 1. Grandfather Parser input */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", fontWeight: 400 }}>
          Causality Loop Parser
        </h3>
        <p style={{ margin: "0 0 16px 0", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)" }}>
          Type your proposed past intervention to run causal logic analysis.
        </p>
        <form onSubmit={handleParseCausality} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <textarea
            value={paradoxInput}
            onChange={(e) => setParadoxInput(e.target.value)}
            placeholder="e.g. I travel to 1930 and steal my grandfather's blueprint before he invents the generator."
            style={{
              width: "100%",
              minHeight: 80,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: 12,
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-primary)",
              outline: "none",
              resize: "vertical"
            }}
          />
          <button
            type="submit"
            disabled={!paradoxInput.trim()}
            style={{
              height: 38,
              borderRadius: 6,
              background: paradoxInput.trim() ? "var(--accent-utility-d)" : "var(--border)",
              border: "none",
              color: paradoxInput.trim() ? "#ffffff" : "var(--text-faint)",
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              fontWeight: 600,
              cursor: paradoxInput.trim() ? "pointer" : "not-allowed"
            }}
          >
            Verify Stability
          </button>
        </form>
      </div>

      {/* 2. Congestion select */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", fontWeight: 400 }}>
          Time Traveler Congestion Density
        </h3>
        <p style={{ margin: "0 0 16px 0", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)" }}>
          Select target dates to scan observers present in historical timelines.
        </p>
        <select
          value={selectedDateIdx}
          onChange={(e) => setSelectedDateIdx(Number(e.target.value))}
          style={{
            width: "100%",
            height: 38,
            padding: "0 10px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            fontFamily: "var(--font-ui)",
            color: "var(--text-primary)",
            cursor: "pointer",
            outline: "none"
          }}
        >
          {FAMOUS_DATES.map((item, idx) => (
            <option key={item.date} value={idx}>{item.name}</option>
          ))}
        </select>
      </div>

      {/* 3. Loop Escape Questionnaire */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", fontWeight: 400 }}>
          Loop Escape Questionnaire
        </h3>
        <p style={{ margin: "0 0 16px 0", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)" }}>
          Verify if your timeline is locked in a Groundhog Loop.
        </p>
        {!loopDiagnosis ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {!loopAnswers[1] && (
              <div>
                <span style={{ display: "block", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text-muted)", marginBottom: 6 }}>1. Do you experience constant deja vu?</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleLoopAnswer(1, "yes")} style={{ flex: 1, padding: "6px 0", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>Yes</button>
                  <button onClick={() => handleLoopAnswer(1, "no")} style={{ flex: 1, padding: "6px 0", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>No</button>
                </div>
              </div>
            )}
            {loopAnswers[1] && !loopAnswers[2] && (
              <div>
                <span style={{ display: "block", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text-muted)", marginBottom: 6 }}>2. What day of the week is it today?</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button onClick={() => handleLoopAnswer(2, "normal")} style={{ padding: "6px 0", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>Today's Calendar Date</button>
                  <button onClick={() => handleLoopAnswer(2, "groundhog")} style={{ padding: "6px 0", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>Same as Yesterday</button>
                </div>
              </div>
            )}
            {loopAnswers[1] && loopAnswers[2] && !loopAnswers[3] && (
              <div>
                <span style={{ display: "block", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text-muted)", marginBottom: 6 }}>3. Could you be stuck in this browser tab?</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleLoopAnswer(3, "yes")} style={{ flex: 1, padding: "6px 0", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>Possibly</button>
                  <button onClick={() => handleLoopAnswer(3, "absolutely")} style={{ flex: 1, padding: "6px 0", border: "1px solid var(--border)", borderRadius: 4, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)" }}>Absolutely</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "rgba(224, 154, 58, 0.08)", border: "1px solid rgba(224, 154, 58, 0.2)", borderRadius: 6, padding: 12, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {loopDiagnosis}
            </div>
            <button onClick={resetLoopQuiz} style={{ height: 32, border: "1px solid var(--border)", borderRadius: 6, background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text-primary)", fontFamily: "var(--font-ui)", textTransform: "uppercase" }}>Re-run Test</button>
          </div>
        )}
      </div>
    </div>
  );

  const resultsZone = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, width: "100%" }}>
      {/* parser verdict */}
      {parserResult && (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>PARSER VERDICT</span>
          <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)", lineHeight: 1.5 }}>
            {parserResult}
          </p>
        </div>
      )}

      {/* Deja Vu Probability scanner */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", fontWeight: 400 }}>
          Déjà Vu Probability Scanner
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px 0",
            background: "var(--bg-surface)",
            borderRadius: 8,
            border: "1px dashed var(--border)"
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 36, color: "var(--accent-utility-d)", fontWeight: "bold" }}>
            {dejaVuProb.toFixed(4)}%
          </span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", textTransform: "uppercase", marginTop: 4 }}>
            Chronal Overlay Index
          </span>
        </div>
      </div>

      {/* Target date observations details */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>CONGESTION OBSERVATION LOGS</span>
        <div style={{ background: "var(--bg-surface)", borderRadius: 8, padding: 16, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--text-faint)", marginBottom: 8 }}>
            <span>DATE: {FAMOUS_DATES[selectedDateIdx].date}</span>
            <span style={{ color: "var(--accent-utility-d)", fontWeight: "bold" }}>{FAMOUS_DATES[selectedDateIdx].count} Detected</span>
          </div>
          <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
            {FAMOUS_DATES[selectedDateIdx].notes}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} hasInputZone={true} inputZone={inputZone} resultsZone={resultsZone}>
      <div style={{ position: "relative", width: "100%", height: "350px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      </div>

      {/* Floating Diagnostics Panel */}
      <FloatingPanel id="paradox-panel" title="LAB STATUS" defaultPosition="top-right">
        <PanelDisplay
          label="STABILITY INDEX"
          value={`${(100 - dejaVuProb * 0.1).toFixed(2)}%`}
        />
      </FloatingPanel>
    </RealmLayout>
  );
}
