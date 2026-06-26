"use client";

import React, { useState, useEffect, useRef } from "react";
import { callRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "what-year-am-i")!;

type FloatingDigit = {
  id: number;
  digit: number;
  left: number;
  duration: number;
  delay: number;
};

type HistoryItem = {
  fact: string;
  contribution: string;
};

type ConfettiPiece = {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
};

export default function WhatYearAmI() {
  const [floatingDigits, setFloatingDigits] = useState<FloatingDigit[]>([]);
  const [currentFact, setCurrentFact] = useState("");
  const [facts, setFacts] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // State returned by the AI detective
  const [yearRangeStart, setYearRangeStart] = useState(-3000);
  const [yearRangeEnd, setYearRangeEnd] = useState(2026);
  const [confidence, setConfidence] = useState(0);
  const [hotOrCold, setHotOrCold] = useState<"freezing" | "cold" | "warm" | "hot" | "locked">("freezing");
  const [cluePrompt, setCluePrompt] = useState("Enter your first fact to begin tracking.");
  const [partialVerdict, setPartialVerdict] = useState("Timeline is drifting in space...");
  const [isLocked, setIsLocked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Confetti particles
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const list: FloatingDigit[] = [];
    for (let i = 0; i < 20; i++) {
      list.push({
        id: i,
        digit: Math.floor(Math.random() * 10),
        left: Math.random() * 95 + 2,
        duration: 10 + Math.random() * 10,
        delay: -Math.random() * 15,
      });
    }
    setFloatingDigits(list);
  }, []);

  const triggerConfetti = () => {
    const list: ConfettiPiece[] = [];
    const colors = ["#4B8EF1", "#C9A84C", "#7B61FF", "#3ABFBF", "#E09A3A", "#EF4444", "#10B981"];
    for (let i = 0; i < 40; i++) {
      list.push({
        id: i,
        x: 50, // center %
        y: 50, // center %
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 6,
      });
    }
    setConfetti(list);
  };

  const runDetection = async (allFacts: string[]) => {
    if (allFacts.length === 0) {
      // Reset to defaults
      setYearRangeStart(-3000);
      setYearRangeEnd(2026);
      setConfidence(0);
      setHotOrCold("freezing");
      setCluePrompt("Enter your first fact to begin tracking.");
      setPartialVerdict("Timeline is drifting in space...");
      setIsLocked(false);
      setHistory([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const systemPrompt = `You are a temporal detective. Facts are given one at a time and you narrow down the year progressively.

Given ALL facts so far, return ONLY JSON:
{
  "yearRangeStart": 1965,
  "yearRangeEnd": 1972,
  "confidence": 45,
  "hotOrCold": "freezing|cold|warm|hot|locked",
  "rangeNarrowedBy": "Narrowed by 15 years",
  "cluePrompt": "Add a fact about technology or a specific leader to narrow further",
  "partialVerdict": "Somewhere in the late 1960s to early 1970s...",
  "isLocked": false
}

Note: If the confidence is 90% or above, set "isLocked" to true and let "yearRangeStart" and "yearRangeEnd" be the exact target year (same number).`;

    const userPrompt = `Facts submitted so far: ${allFacts.join(" | ")}. Determine the coordinates.`;

    try {
      const res = await callRealmAI({
        systemPrompt,
        userPrompt,
        maxTokens: 1000,
      });

      if (res.error) throw new Error(res.error);

      let jsonText = res.content.trim();
      const startIdx = jsonText.indexOf("{");
      const endIdx = jsonText.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        jsonText = jsonText.substring(startIdx, endIdx + 1);
      }

      const data = JSON.parse(jsonText);
      setYearRangeStart(data.yearRangeStart);
      setYearRangeEnd(data.yearRangeEnd);
      setConfidence(data.confidence);
      setHotOrCold(data.hotOrCold);
      setCluePrompt(data.cluePrompt);
      setPartialVerdict(data.partialVerdict);
      setIsLocked(data.isLocked);

      if (data.isLocked || data.confidence >= 90) {
        triggerConfetti();
      }

      // Append latest fact to history
      const latestFact = allFacts[allFacts.length - 1];
      const newHistoryItem = {
        fact: latestFact,
        contribution: data.rangeNarrowedBy || "Analyzing coordinate variables",
      };

      setHistory((prev) => [...prev, newHistoryItem]);
    } catch (err: any) {
      setError(err.message || "The timeline is unclear. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentFact.trim()) {
      const updated = [...facts, currentFact.trim()];
      setFacts(updated);
      setCurrentFact("");
      runDetection(updated);
    }
  };

  const handleRemoveFact = (index: number) => {
    const updated = facts.filter((_, i) => i !== index);
    setFacts(updated);
    runDetection(updated);
  };

  const handleReset = () => {
    setFacts([]);
    runDetection([]);
  };

  const getEstimatedYear = () => {
    if (isLocked) return yearRangeStart;
    return Math.round((yearRangeStart + yearRangeEnd) / 2);
  };

  const getTemperatureDetails = () => {
    switch (hotOrCold) {
      case "locked":
        return { label: "LOCKED", color: "var(--accent-utility-a)", shadow: "0 0 16px var(--accent-utility-a)", icon: "✓" };
      case "hot":
        return { label: "HOT", color: "#EF4444", shadow: "0 0 16px #EF4444", icon: "🔥" };
      case "warm":
        return { label: "WARM", color: "#F59E0B", shadow: "0 0 12px #F59E0B", icon: "☀️" };
      case "cold":
        return { label: "COLD", color: "#3B82F6", shadow: "none", icon: "❄️" };
      default:
        return { label: "FREEZING", color: "#3ABFBF", shadow: "none", icon: "🧊" };
    }
  };

  const temp = getTemperatureDetails();
  const estimatedYear = getEstimatedYear();
  const hasAnimation = !prefersReducedMotion();

  // Normalize range position for progress bar
  const getProgressPercentage = (val: number) => {
    const min = -3000;
    const max = 2026;
    const perc = ((val - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, perc));
  };

  const leftPerc = getProgressPercentage(yearRangeStart);
  const rightPerc = getProgressPercentage(yearRangeEnd);

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20, width: "100%", boxSizing: "border-box" }}>
          {/* Tag chips */}
          {facts.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
              {facts.map((fact, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "4px 12px",
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 100,
                    fontSize: 12,
                    fontFamily: "var(--font-ui)",
                    color: "var(--text-primary)"
                  }}
                >
                  <span>{fact}</span>
                  <button
                    onClick={() => handleRemoveFact(idx)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: "bold", padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            value={currentFact}
            onChange={(e) => setCurrentFact(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLocked || isLoading}
            placeholder={isLocked ? "TIMELINE COORDINATES LOCKED" : "Type one historical fact and press Enter..."}
            style={{
              width: "100%",
              height: 44,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "0 16px",
              fontFamily: "var(--font-ui)",
              fontSize: 14,
              color: "var(--text-primary)",
              outline: "none",
              boxSizing: "border-box"
            }}
          />

          {/* Clue Prompt */}
          {!isLocked && (
            <div style={{ marginTop: 12, display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--accent-scifi)", fontStyle: "italic" }}>
              <span>💡</span>
              <span>Clue: {cluePrompt}</span>
            </div>
          )}
        </div>
      }
      resultsZone={
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, width: "100%" }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
            <h4 style={{ margin: "0 0 16px 0", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              COORDINATE LOGS
            </h4>

            {history.length === 0 ? (
              <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)", fontStyle: "italic", padding: "32px 0", textAlign: "center" }}>
                Awaiting tracking logs...
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {history.map((item, idx) => (
                  <div key={idx} style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: 12 }}>
                    <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)", margin: 0, lineHeight: 1.4 }}>
                      "{item.fact}"
                    </p>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-scifi)", marginTop: 4, display: "block" }}>
                      ⚡ {item.contribution}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 12 }}>
            {/* Quick controls */}
            <button
              onClick={handleReset}
              style={{
                width: "100%",
                height: 44,
                border: "1px solid var(--border)",
                background: "transparent",
                borderRadius: 8,
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                cursor: "pointer",
                transition: "background 150ms"
              }}
            >
              Clear Diagnostic Matrix
            </button>
          </div>
        </div>
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "450px", overflow: "hidden", background: "var(--bg-base)" }}>
        {/* Confetti container */}
        {confetti.length > 0 && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50 }}>
            {confetti.map((c) => (
              <div
                key={c.id}
                style={{
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: c.color,
                  left: `calc(50% + ${Math.cos(c.angle) * c.speed * 20}px)`,
                  top: `calc(40% + ${Math.sin(c.angle) * c.speed * 20}px)`,
                  transform: `rotate(${c.angle * 50}deg)`,
                  opacity: 0,
                  animation: hasAnimation ? "confettiFall 1.8s ease-out forwards" : "none",
                }}
              />
            ))}
          </div>
        )}

        {/* Floatingbackdrop digits */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.05 }}>
          {floatingDigits.map((item) => (
            <span
              key={item.id}
              className={hasAnimation ? "float-digit" : ""}
              style={{
                position: "absolute",
                left: `${item.left}%`,
                bottom: "-5vh",
                fontFamily: "var(--font-mono), monospace",
                fontSize: "clamp(12px, 3vw, 24px)",
                color: "var(--accent-scifi)",
                // Inline variables support in React
                animationDuration: `${item.duration}s`,
                animationDelay: `${item.delay}s`
              } as React.CSSProperties}
            >
              {item.digit}
            </span>
          ))}
        </div>

        {/* Game Area */}
        <div style={{ position: "relative", zIndex: 10, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%" }}>
          {isLoading && <AILoadingShimmer message="Filtering chronological metrics..." />}
          {error && <AIErrorState message={error} onRetry={() => runDetection(facts)} />}

          {!isLoading && !error && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
              {/* Midpoint Year Display */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                  ESTIMATED COORDINATE
                </span>
                <div 
                  style={{ 
                    fontFamily: "var(--font-mono)",
                    fontWeight: 300,
                    color: isLocked ? "var(--accent-utility-a)" : "var(--text-primary)",
                    fontSize: isLocked ? 80 : 48,
                    textShadow: isLocked ? "0 0 20px rgba(16, 185, 129, 0.3)" : "none",
                    transition: "all 500ms"
                  }}
                >
                  {isLocked ? `${estimatedYear}` : `~ ${estimatedYear}`}
                </div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                  {partialVerdict}
                </div>
              </div>

              {/* Progress visual bar mapping the uncertainty window */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, maxWidth: 500 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)" }}>
                  <span>3000 BCE</span>
                  <span>2026 CE</span>
                </div>
                <div style={{ width: "100%", height: 16, background: "var(--bg-surface)", borderRadius: 100, position: "relative", overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div
                    style={{
                      position: "absolute",
                      height: "100%",
                      left: `${leftPerc}%`,
                      right: `${100 - rightPerc}%`,
                      background: isLocked ? "var(--accent-utility-a)" : "color-mix(in srgb, var(--accent-scifi) 40%, transparent)",
                      boxShadow: isLocked ? "0 0 10px var(--accent-utility-a)" : "none",
                      transition: "all 500ms"
                    }}
                  />
                </div>
                {!isLocked && (
                  <div style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", marginTop: 4 }}>
                    Uncertainty window: {Math.round(yearRangeEnd - yearRangeStart)} years
                  </div>
                )}
              </div>

              {/* Temperature status box */}
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  borderRadius: 100,
                  border: `1px solid ${temp.color}`,
                  boxShadow: temp.shadow,
                  color: temp.color,
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  animation: hotOrCold === "hot" && hasAnimation ? "tempPulse 1.2s infinite ease-in-out" : "none",
                }}
              >
                <span>{temp.icon}</span>
                <span>{temp.label}</span>
              </div>

              {/* Reset when completed */}
              {isLocked && (
                <button
                  onClick={handleReset}
                  style={{
                    padding: "8px 24px",
                    background: "var(--accent-utility-a)",
                    color: "white",
                    border: "none",
                    fontFamily: "var(--font-ui)",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Scan Another Timeline
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <FloatingPanel id="wy-controls" title="DETECTION TELEMETRY" defaultPosition="top-right">
        <PanelDisplay
          label="CONFIDENCE"
          value={`${confidence}%`}
        />
        <PanelDisplay
          label="STATUS"
          value={isLocked ? "COORDINATE SECURED" : "SEARCHING TIMELINE"}
        />
      </FloatingPanel>

      <style jsx>{`
        :global(.float-digit) {
          animation: floatDigit var(--drift-duration) linear infinite;
          animation-delay: var(--drift-delay);
        }
        @keyframes floatDigit {
          from { transform: translateY(105vh); opacity: 0; }
          20% { opacity: 0.05; }
          80% { opacity: 0.05; }
          to { transform: translateY(-10vh); opacity: 0; }
        }
        @keyframes tempPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes confettiFall {
          0% { opacity: 1; transform: translate(0, 0) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--dx, 20px), 300px) rotate(360deg); }
        }
      `}</style>
    </RealmLayout>
  );
}
