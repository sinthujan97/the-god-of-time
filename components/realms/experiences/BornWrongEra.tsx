"use client";

import React, { useState, useEffect, useRef } from "react";
import { callRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import FloatingPanel, { PanelDisplay, PanelToggle } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "born-wrong-era")!;

type SpeedDateEra = {
  id: string;
  name: string;
  gradient: string;
  yearRange: string;
  contexts: string[];
};

const ERAS_LIST: SpeedDateEra[] = [
  {
    id: "ancient",
    name: "Classical Antiquity",
    yearRange: "500 BC – 400 AD",
    gradient: "linear-gradient(135deg, #8C6239 0%, #D4B26F 100%)",
    contexts: [
      "Engage in philosophical dialogues in the open-air Agora.",
      "Live in a world dictated by mythology, epic poetry, and civic assemblies.",
      "Walk the marble halls of Roman baths or Greek city-states."
    ]
  },
  {
    id: "medieval",
    name: "The High Middle Ages",
    yearRange: "1000 – 1400 AD",
    gradient: "linear-gradient(135deg, #2E2E2E 0%, #8C5A3C 100%)",
    contexts: [
      "Live a quiet, seasonal agricultural rhythm bound to local guilds.",
      "Witness the construction of massive stone Gothic cathedrals.",
      "Swear fealty to a lord and live in a world of castles and knights."
    ]
  },
  {
    id: "renaissance",
    name: "The Italian Renaissance",
    yearRange: "1400 – 1600 AD",
    gradient: "linear-gradient(135deg, #D4AF37 0%, #5B2C6F 100%)",
    contexts: [
      "Work in a bustling workshop under the patronage of art-loving merchant houses.",
      "Explore the intersection of newfound classical philosophy and scientific discovery.",
      "Breathe the creative air of Florence, surrounding yourself with masterpieces."
    ]
  },
  {
    id: "industrial",
    name: "The Industrial & Victorian Era",
    yearRange: "1760 – 1900 AD",
    gradient: "linear-gradient(135deg, #566573 0%, #1C2833 100%)",
    contexts: [
      "Experience the birth of steam power, heavy locomotives, and sprawling factories.",
      "Navigate strict Victorian social codes, tea salons, and early mystery novels.",
      "Participate in the rapid expansion of technology, telegraphs, and scientific academies."
    ]
  },
  {
    id: "future",
    name: "The Space Colonization Era",
    yearRange: "2150 AD and Beyond",
    gradient: "linear-gradient(135deg, #4A235A 0%, #117A65 100%)",
    contexts: [
      "Travel between orbital stations and live inside terraformed geodesic dome colonies.",
      "Interact with advanced AI companions, neural interfaces, and cybernetic tech.",
      "Mine asteroids in the outer solar system, exploring the new frontier of space."
    ]
  }
];

export default function BornWrongEra() {
  const [currentEraIndex, setCurrentEraIndex] = useState(0);
  const [choices, setChoices] = useState<{ id: string; name: string; matched: boolean }[]>([]);
  const [includeFuture, setIncludeFuture] = useState(false);

  // Swipe / Drag Physics States
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // AI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const hasAnimation = !prefersReducedMotion();

  // Reset function
  const handleReset = () => {
    setCurrentEraIndex(0);
    setChoices([]);
    setDragOffset(0);
    setSwipeDirection(null);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  const executeSwipe = (matched: boolean) => {
    const era = ERAS_LIST[currentEraIndex];
    const nextChoices = [...choices, { id: era.id, name: era.name, matched }];
    setChoices(nextChoices);

    setSwipeDirection(matched ? "right" : "left");

    setTimeout(() => {
      setDragOffset(0);
      setSwipeDirection(null);
      const nextIndex = currentEraIndex + 1;
      setCurrentEraIndex(nextIndex);

      // If we finished swiping all 5 eras, call the AI
      if (nextIndex >= ERAS_LIST.length) {
        handleFindEra(nextChoices);
      }
    }, 300);
  };

  // Drag handlers for mouse & touch
  const handleStart = (clientX: number) => {
    if (swipeDirection) return;
    setDragStart(clientX);
  };

  const handleMove = (clientX: number) => {
    if (dragStart === null || swipeDirection) return;
    const diff = clientX - dragStart;
    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (dragStart === null || swipeDirection) return;
    const threshold = 120;
    if (dragOffset > threshold) {
      executeSwipe(true);
    } else if (dragOffset < -threshold) {
      executeSwipe(false);
    } else {
      setDragOffset(0);
    }
    setDragStart(null);
  };

  const handleFindEra = async (finalChoices: { id: string; name: string; matched: boolean }[]) => {
    setIsLoading(true);
    setError(null);

    const systemPrompt = `You are a chronological matchmaking agent. You analyze a user's choices regarding 5 different historical eras and match them to the single era they belong in.

Return a text response formatted EXACTLY like this (use ALL CAPS for headers):

ERA: Name of Match Era
YOUR MATCH SCORE: 98% (Perfect Match / Partial Match / High Match)
WHY YOU BELONG THERE: 2-3 sentences explaining based on their swiping choices.
YOUR IDEAL LIFE THERE: 1 poetic sentence describing their perfect day in that era.
YOUR STRUGGLE: 1 sentence describing their biggest historical nuisance (e.g., dysentery, candle tax, lag).
FAMOUS COMPANION: Companion Name - brief 1-sentence descriptor of what you do together.
RUNNER-UP ERA: 1 sentence detailing their next closest match.`;

    const likes = finalChoices.filter(c => c.matched).map(c => c.name).join(", ") || "None";
    const dislikes = finalChoices.filter(c => !c.matched).map(c => c.name).join(", ") || "None";

    const userPrompt = `User swiped YES to: ${likes}.
User swiped NO to: ${dislikes}.
Include future eras setting is: ${includeFuture ? "ENABLED" : "DISABLED"}.
Determine which era they belong in and complete the matchmaking card.`;

    try {
      const res = await callRealmAI({
        systemPrompt,
        userPrompt,
        maxTokens: 1000,
      });

      if (res.error) throw new Error(res.error);
      setResult(res.content);
    } catch (err: any) {
      setError(err.message || "The timeline is unclear. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseResult = (text: string) => {
    const getSection = (header: string) => {
      const regex = new RegExp(
        `${header}\\s*:\\s*([\\s\\S]*?)(?=\\n(?:ERA|YOUR MATCH SCORE|WHY YOU BELONG THERE|YOUR IDEAL LIFE THERE|YOUR STRUGGLE|FAMOUS COMPANION|RUNNER-UP ERA)\\s*:|$)`,
        "i"
      );
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    const rawScore = getSection("YOUR MATCH SCORE");
    const scoreType = rawScore.toLowerCase().includes("perfect")
      ? "Perfect"
      : rawScore.toLowerCase().includes("partial")
      ? "Partial"
      : "High";

    return {
      era: getSection("ERA"),
      scoreRaw: rawScore,
      scoreType,
      why: getSection("WHY YOU BELONG THERE"),
      idealLife: getSection("YOUR IDEAL LIFE THERE"),
      struggle: getSection("YOUR STRUGGLE"),
      companion: getSection("FAMOUS COMPANION"),
      runnerUp: getSection("RUNNER-UP ERA"),
    };
  };

  const parsed = result ? parseResult(result) : null;

  const getEraGradient = () => {
    if (!parsed) return "linear-gradient(135deg, var(--bg-surface), rgba(58,191,191,0.15))";
    const name = parsed.era.toLowerCase();
    if (name.includes("ancient") || name.includes("greece") || name.includes("rome")) {
      return "linear-gradient(135deg, #8C6239 0%, #D4B26F 100%)";
    }
    if (name.includes("medieval") || name.includes("middle ages") || name.includes("viking")) {
      return "linear-gradient(135deg, #3A3A3A 0%, #8C5A3C 100%)";
    }
    if (name.includes("renaissance") || name.includes("enlightenment") || name.includes("elizabethan")) {
      return "linear-gradient(135deg, #D4AF37 0%, #5B2C6F 100%)";
    }
    if (name.includes("industrial") || name.includes("victorian") || name.includes("coal")) {
      return "linear-gradient(135deg, #566573 0%, #1C2833 100%)";
    }
    if (name.includes("future") || name.includes("cyberpunk") || name.includes("space")) {
      return "linear-gradient(135deg, #4A235A 0%, #117A65 100%)";
    }
    return "linear-gradient(135deg, #2E86C1 0%, #5DADE2 100%)";
  };

  const currentEra = currentEraIndex < ERAS_LIST.length ? ERAS_LIST[currentEraIndex] : null;
  const rotateDeg = dragOffset * 0.08;
  const translationX = swipeDirection === "left" ? -500 : swipeDirection === "right" ? 500 : dragOffset;

  return (
    <RealmLayout realm={realm} hasInputZone={false} resultsZone={
      result && parsed ? (
        <div style={{ maxWidth: 600, width: "100%", margin: "0 auto" }}>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Era Hero Banner */}
            <div
              style={{
                background: getEraGradient(),
                padding: "40px 32px 32px 32px",
                color: "#ffffff",
                position: "relative",
                boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.5)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.7)",
                      textTransform: "uppercase",
                    }}
                  >
                    YOUR CHRONOLOGICAL ERA MATCH
                  </span>
                  <h1
                    style={{
                      fontFamily: "var(--font-display), Georgia, serif",
                      fontSize: "clamp(30px, 5vw, 44px)",
                      fontWeight: 300,
                      color: "#ffffff",
                      margin: "8px 0 0 0",
                      lineHeight: 1.2,
                      textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                    }}
                  >
                    {parsed.era}
                  </h1>
                </div>

                {parsed.scoreRaw && (
                  <span
                    style={{
                      fontFamily: "var(--font-ui), sans-serif",
                      fontSize: 11,
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 100,
                      textTransform: "uppercase",
                      color: "#ffffff",
                      background:
                        parsed.scoreType === "Perfect"
                          ? "var(--accent-bio)"
                          : parsed.scoreType === "Partial"
                          ? "var(--accent-utility-d)"
                          : "var(--accent-utility-a)",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                    }}
                  >
                    {parsed.scoreType} Match
                  </span>
                )}
              </div>
            </div>

            {/* Why you belong */}
            {parsed.why && (
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
                  Why You Belong There
                </div>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, margin: 0 }}>
                  {parsed.why}
                </p>
              </div>
            )}

            {/* Ideal life details */}
            {parsed.idealLife && (
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
                  Your Ideal Life There
                </div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                  {parsed.idealLife}
                </p>
              </div>
            )}

            {/* Struggle details */}
            {parsed.struggle && (
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-subtle)", borderLeft: "3px solid var(--accent-utility-d)" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 12 }}>
                  Your Struggle
                </div>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, margin: 0 }}>
                  {parsed.struggle}
                </p>
              </div>
            )}

            {/* Famous Companion card */}
            {parsed.companion && (
              <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--accent-bio)",
                    borderRadius: 10,
                    padding: "20px 24px",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-bio)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    YOUR HISTORICAL COMPANION
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontStyle: "italic", color: "var(--text-primary)", margin: "0 0 8px 0", fontWeight: 300 }}>
                    {parsed.companion.split("-")[0] || parsed.companion}
                  </h3>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", margin: 0 }}>
                    {parsed.companion.split("-")[1] || "A natural ally waiting in your chronological era."}
                  </p>
                </div>
              </div>
            )}

            {/* Runner up */}
            {parsed.runnerUp && (
              <div style={{ padding: "20px 32px", background: "var(--bg-surface)" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
                  RUNNER-UP ERA
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                  {parsed.runnerUp}
                </p>
              </div>
            )}
          </div>

          {/* Actions row */}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 8,
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Speed Date Again
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result || "");
                alert("Result URL copied to clipboard!");
              }}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 8,
                background: "var(--accent-whim)",
                border: "none",
                color: "#ffffff",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Share Era Match
            </button>
          </div>
        </div>
      ) : null
    }>
      <style>{`
        @keyframes fadeInContext {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .context-point-0 { animation: fadeInContext 0.5s ease 0.2s forwards; opacity: 0; }
        .context-point-1 { animation: fadeInContext 0.5s ease 0.6s forwards; opacity: 0; }
        .context-point-2 { animation: fadeInContext 0.5s ease 1.0s forwards; opacity: 0; }
      `}</style>

      {/* Foreground Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 600,
          margin: "0 auto",
          padding: "24px 0",
        }}
      >
        {/* Speed Dating game interface */}
        {!result && !isLoading && !error && currentEra && (
          <div>
            {/* Drag Container Card */}
            <div
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleMove(e.clientX);
              }}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
              style={{
                position: "relative",
                height: 400,
                background: currentEra.gradient,
                borderRadius: 16,
                boxShadow: "0 15px 35px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "36px 28px",
                color: "#ffffff",
                cursor: dragStart !== null ? "grabbing" : "grab",
                touchAction: "none",
                userSelect: "none",
                transform: `translateX(${translationX}px) rotate(${rotateDeg}deg)`,
                transition: swipeDirection ? "transform 300ms ease, opacity 300ms ease" : "none",
                opacity: swipeDirection ? 0 : 1,
              }}
            >
              {/* Card Header */}
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {currentEra.yearRange}
                </span>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(24px, 5vw, 36px)",
                    fontWeight: 300,
                    margin: "6px 0 0 0",
                    textShadow: "0 2px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {currentEra.name}
                </h3>
              </div>

              {/* Context points fading in sequentially */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, margin: "24px 0" }}>
                {currentEra.contexts.map((ctx, idx) => (
                  <div
                    key={idx}
                    className={`context-point-${idx}`}
                    style={{
                      fontFamily: "var(--font-ui)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      background: "rgba(0,0,0,0.15)",
                      padding: "8px 14px",
                      borderRadius: 8,
                    }}
                  >
                    • {ctx}
                  </div>
                ))}
              </div>

              {/* Visual overlay indicator for drag */}
              {dragOffset !== 0 && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background: dragOffset > 0 ? "rgba(46, 204, 113, 0.25)" : "rgba(231, 76, 60, 0.25)",
                    border: dragOffset > 0 ? "4px dashed #2ecc71" : "4px dashed #e74c3c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: "bold",
                    pointerEvents: "none",
                  }}
                >
                  {dragOffset > 0 ? "THIS IS ME!" : "NOT FOR ME"}
                </div>
              )}

              {/* Progress */}
              <div style={{ fontSize: 12, opacity: 0.8, fontFamily: "var(--font-mono)" }}>
                CARD {currentEraIndex + 1} OF 5
              </div>
            </div>

            {/* Quick buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 40 }}>
              <button
                onClick={() => executeSwipe(false)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(231, 76, 60, 0.15)",
                  border: "1px solid #e74c3c",
                  color: "#e74c3c",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 200ms",
                }}
                title="Not for me"
              >
                ✕
              </button>
              <button
                onClick={() => executeSwipe(true)}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "rgba(46, 204, 113, 0.15)",
                  border: "1px solid #2ecc71",
                  color: "#2ecc71",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 200ms",
                }}
                title="This is me!"
              >
                ♥
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && <AILoadingShimmer message="Searching the chronological archives..." />}

        {/* Error State */}
        {error && (
          <AIErrorState
            message={error}
            onRetry={handleReset}
          />
        )}
      </div>

      {/* Era Matcher controls (Floating Panel) */}
      <FloatingPanel id="era-controls" title="ERA MATCHER" defaultPosition="top-right">
        <PanelDisplay
          label="STATUS"
          value={isLoading ? "SEARCHING..." : result ? "ERA MATCHED" : `DATE SWIPING (${choices.length}/5)`}
        />
        <PanelToggle label="Include Future Eras" value={includeFuture} onChange={setIncludeFuture} />
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", marginTop: -4 }}>
          Expand options to future dates (2100-2300).
        </div>
      </FloatingPanel>
    </RealmLayout>
  );
}
