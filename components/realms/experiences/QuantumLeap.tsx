"use client";

import React, { useState, useEffect, useRef } from "react";
import { callRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "quantum-leap")!;

// Simple Typewriter component
function TypewriterText({ text, speed = 10, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayedText(text);
      if (onComplete) onComplete();
      return;
    }

    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
}

export default function QuantumLeap() {
  const [currentStep, setCurrentStep] = useState(1);
  const [situation, setSituation] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [eraPreference, setEraPreference] = useState("No preference");
  const [totalLeaps, setTotalLeaps] = useState(0);

  // AI & Animation states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scanActive, setScanActive] = useState(false);
  const [revealStage, setRevealStage] = useState(0); // 0: none, 1: dest, 2: who, 3: objective, 4: advantage, 5: success

  const SKILLS = [
    "Problem solving",
    "People skills",
    "Research",
    "Physical ability",
    "Creativity",
    "Leadership",
    "Technical skills",
    "Empathy",
  ];

  const ERAS = ["Ancient", "Medieval", "Modern (1700-1900)", "20th Century", "No preference"];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : prev.length < 3
        ? [...prev, skill]
        : prev
    );
  };

  const handleLeap = async () => {
    if (!situation.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setScanActive(true);
    setRevealStage(0);

    const systemPrompt = `You are the Quantum Leap computer system (Al's handlink). You match people's current life challenges to historical missions where solving a problem in the past would teach them the exact lesson they need today.

Structure your response EXACTLY as follows with these exact headers:

LEAP DESTINATION: [Specific year and location, e.g. 'Memphis, Tennessee — August 1963']
WHO YOU LEAP INTO: [A specific historical person or archetype — name them and their role]
YOUR MISSION: [1-2 sentences: the specific historical problem you must solve to 'put right what once went wrong']
WHY THIS LEAP: [2-3 sentences connecting this historical challenge to the person's current life situation — make the parallel explicit]
THE LESSON: [The core insight or skill this historical situation teaches that directly addresses their challenge]
YOUR ADVANTAGE: [How their specific skills make them uniquely suited for this mission]
SUCCESS CONDITION: [Exactly what must happen for you to leap back to the present — the moment you'll know you've succeeded]

Keep under 300 words. Make it feel personal and cinematic. Use real historical details.`;

    const userPrompt = `Here is my current life situation that needs quantum leaping:
Challenge: ${situation}
My skills: ${selectedSkills.join(", ") || "adaptability"}
Era preference: ${eraPreference}

Find my quantum leap destination.`;

    try {
      const { content, error: apiError } = await callRealmAI({
        systemPrompt,
        userPrompt,
        maxTokens: 1000,
      });

      // Let scan line animation complete a full run
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (apiError) {
        setError(apiError);
        setScanActive(false);
        setIsLoading(false);
      } else {
        setResult(content);
        setScanActive(false);
        setIsLoading(false);
        setTotalLeaps((prev) => prev + 1);

        // Staggered parameter reveals
        setRevealStage(1);
        setTimeout(() => setRevealStage(2), 800);
        setTimeout(() => setRevealStage(3), 1600);
        setTimeout(() => setRevealStage(4), 2400);
        setTimeout(() => setRevealStage(5), 3200);
      }
    } catch (err) {
      setError("The timeline is unclear. Try again.");
      setScanActive(false);
      setIsLoading(false);
    }
  };

  const parseResult = (text: string) => {
    const getSection = (header: string) => {
      const regex = new RegExp(
        `${header}\\s*:\\s*([\\s\\S]*?)(?=\\n(?:LEAP DESTINATION|WHO YOU LEAP INTO|YOUR MISSION|WHY THIS LEAP|THE LESSON|YOUR ADVANTAGE|SUCCESS CONDITION)\\s*:|$)`,
        "i"
      );
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    return {
      destination: getSection("LEAP DESTINATION"),
      who: getSection("WHO YOU LEAP INTO"),
      mission: getSection("YOUR MISSION"),
      why: getSection("WHY THIS LEAP"),
      lesson: getSection("THE LESSON"),
      advantage: getSection("YOUR ADVANTAGE"),
      success: getSection("SUCCESS CONDITION"),
    };
  };

  const parsed = result ? parseResult(result) : null;
  const hasAnimation = !prefersReducedMotion();

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        !result && !isLoading && !error ? (
          <div
            style={{
              background: "color-mix(in srgb, var(--bg-card) 85%, transparent)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            {/* Step Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-scifi)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                ✦ Step {currentStep} of 3
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: currentStep === s ? "var(--accent-scifi)" : currentStep > s ? "var(--accent-bio)" : "var(--border)",
                      transition: "all 300ms",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* STEP 1: The Challenge */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 300, color: "var(--text-primary)", marginBottom: 8 }}>
                  Identify Your Lifelong Challenge
                </h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
                  What major obstacle or personal hurdle is preventing you from reaching your potential in the present timeline?
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                  <textarea
                    value={situation}
                    onChange={(e) => setSituation(e.target.value)}
                    placeholder="e.g. I struggle to stand up for myself in conflicts, or I work too hard and miss out on connecting with my loved ones."
                    style={{
                      width: "100%",
                      minHeight: 120,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 16,
                      fontFamily: "var(--font-ui), sans-serif",
                      fontSize: 14,
                      color: "var(--text-primary)",
                      resize: "vertical",
                      lineHeight: "1.6",
                      outline: "none",
                    }}
                  />
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!situation.trim()}
                  style={{
                    width: "100%",
                    height: 48,
                    borderRadius: 8,
                    background: situation.trim() ? "var(--accent-scifi)" : "var(--border)",
                    border: "none",
                    color: situation.trim() ? "#ffffff" : "var(--text-faint)",
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: situation.trim() ? "pointer" : "not-allowed",
                    textTransform: "uppercase",
                  }}
                >
                  Configure Quantum Core →
                </button>
              </div>
            )}

            {/* STEP 2: The Strengths */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 300, color: "var(--text-primary)", marginBottom: 8 }}>
                  Select Your Quantum Advantages
                </h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
                  Select up to 3 qualities or competencies you want the computer to calculate relative advantage formulas for:
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                    gap: 10,
                    marginBottom: 24,
                  }}
                >
                  {SKILLS.map((skill) => {
                    const selected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => handleSkillToggle(skill)}
                        style={{
                          height: 40,
                          borderRadius: 8,
                          border: `1px solid ${selected ? "var(--accent-scifi)" : "var(--border)"}`,
                          background: selected ? "color-mix(in srgb, var(--accent-scifi) 8%, transparent)" : "transparent",
                          color: selected ? "var(--accent-scifi)" : "var(--text-muted)",
                          fontFamily: "var(--font-ui)",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 150ms",
                        }}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setCurrentStep(1)}
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
                    ← Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    style={{
                      flex: 2,
                      height: 48,
                      borderRadius: 8,
                      background: "var(--accent-scifi)",
                      border: "none",
                      color: "#ffffff",
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Set Coordinate Filters
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Timeline Coordinates */}
            {currentStep === 3 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 300, color: "var(--text-primary)", marginBottom: 8 }}>
                  Establish Chrono Preferences
                </h3>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24, lineHeight: 1.5 }}>
                  Do you have a preference for which historical epoch the handlink scan sweeps? (Leave as 'No preference' for default calculations):
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {ERAS.map((era) => {
                    const selected = eraPreference === era;
                    return (
                      <button
                        key={era}
                        onClick={() => setEraPreference(era)}
                        style={{
                          height: 44,
                          borderRadius: 8,
                          border: `1px solid ${selected ? "var(--accent-scifi)" : "var(--border)"}`,
                          background: selected ? "color-mix(in srgb, var(--accent-scifi) 8%, transparent)" : "var(--bg-surface)",
                          color: selected ? "var(--accent-scifi)" : "var(--text-primary)",
                          fontFamily: "var(--font-ui)",
                          fontSize: 13,
                          fontWeight: 500,
                          textAlign: "left",
                          padding: "0 16px",
                          cursor: "pointer",
                          transition: "all 150ms",
                        }}
                      >
                        {era}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setCurrentStep(2)}
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
                    ← Back
                  </button>
                  <button
                    onClick={handleLeap}
                    style={{
                      flex: 2,
                      height: 48,
                      borderRadius: 8,
                      background: "var(--accent-bio)",
                      border: "none",
                      color: "#ffffff",
                      fontFamily: "var(--font-ui)",
                      fontSize: 13,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Initiate Quantum Leap!
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null
      }
      resultsZone={
        result && parsed ? (
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
              maxWidth: 640,
              width: "100%",
              margin: "0 auto",
              boxSizing: "border-box"
            }}
          >
            {/* Stage 1: Leap Destination */}
            {revealStage >= 1 && (
              <div
                style={{
                  background: "linear-gradient(135deg, #117A65 0%, #1F3A3D 100%)",
                  padding: "40px 32px 32px 32px",
                  color: "#ffffff",
                  boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.4)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#00ffcc",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  Chrono Destination Reached
                </span>
                <h1
                  style={{
                    fontFamily: "var(--font-display), Georgia, serif",
                    fontSize: "clamp(26px, 4vw, 38px)",
                    fontWeight: 300,
                    color: "#ffffff",
                    margin: "8px 0 12px 0",
                    lineHeight: 1.3,
                  }}
                >
                  <TypewriterText text={parsed.destination} speed={12} />
                </h1>

                {/* Stage 2: Host Persona (800ms) */}
                {revealStage >= 2 && parsed.who && (
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontStyle: "italic",
                      color: "rgba(255,255,255,0.9)",
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    You have leaped into: <TypewriterText text={parsed.who} speed={10} />
                  </p>
                )}
              </div>
            )}

            <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Stage 3: Typewriter Objective (1600ms) */}
              {revealStage >= 3 && parsed.mission && (
                <div>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-scifi)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    YOUR MISSION OBJECTIVE
                  </span>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, margin: 0 }}>
                    <TypewriterText text={parsed.mission} speed={10} />
                  </p>
                </div>
              )}

              {revealStage >= 3 && parsed.why && (
                <div>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    WHY THIS LEAP
                  </span>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>
                    <TypewriterText text={parsed.why} speed={8} />
                  </p>
                </div>
              )}

              {revealStage >= 3 && parsed.lesson && (
                <div>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    THE TEMPORAL LESSON
                  </span>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.6, margin: 0, fontWeight: 300 }}>
                    <TypewriterText text={parsed.lesson} speed={8} />
                  </p>
                </div>
              )}

              {/* Stage 4: Advantage (2400ms) */}
              {revealStage >= 4 && parsed.advantage && (
                <div>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-scifi)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    YOUR ADVANTAGE
                  </span>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, margin: 0 }}>
                    <TypewriterText text={parsed.advantage} speed={8} />
                  </p>
                </div>
              )}

              {/* Stage 5: Pulsing Success Condition (3200ms) */}
              {revealStage >= 5 && parsed.success && (
                <div
                  style={{
                    background: "color-mix(in srgb, var(--accent-scifi) 8%, transparent)",
                    border: "1px solid color-mix(in srgb, var(--accent-scifi) 30%, transparent)",
                    borderRadius: 8,
                    padding: 20,
                    marginTop: 8,
                    animation: hasAnimation ? "pulseBorder 2s infinite" : "none",
                  }}
                >
                  <style>{`
                    @keyframes pulseBorder {
                      0%, 100% { border-color: color-mix(in srgb, var(--accent-scifi) 30%, transparent); }
                      50% { border-color: var(--accent-scifi); box-shadow: 0 0 10px rgba(0, 255, 255, 0.15); }
                    }
                  `}</style>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-scifi)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                    ⚡ SUCCESS CONDITION (LOCK BACK TO PRESENT)
                  </span>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, margin: 0 }}>
                    <TypewriterText text={parsed.success} speed={10} />
                  </p>
                </div>
              )}
            </div>

            {/* Reset buttons revealed at the end */}
            {revealStage >= 5 && (
              <div style={{ display: "flex", gap: 12, padding: "0 32px 32px 32px" }}>
                <button
                  onClick={() => {
                    setResult(null);
                    setRevealStage(0);
                    setCurrentStep(1);
                  }}
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
                  Leap Again
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(result || "");
                    alert("Leap logs copied to clipboard!");
                  }}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 8,
                    background: "var(--accent-scifi)",
                    border: "none",
                    color: "#ffffff",
                    fontFamily: "var(--font-ui)",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Log Leap Coordinates
                </button>
              </div>
            )}
          </div>
        ) : null
      }
    >
      <style>{`
        @keyframes staticGlitch {
          0%, 100% { background-position: 0 0; }
          50% { background-position: 4px 2px; }
        }
        @keyframes viewportScan {
          0% { top: -10px; }
          100% { top: 100%; opacity: 0; }
        }
        .glitch-static {
          animation: staticGlitch 0.2s steps(2) infinite;
        }
        .viewport-scan-line {
          position: fixed;
          left: 0;
          width: 100%;
          height: 6px;
          background: #00ffff;
          box-shadow: 0 0 15px 4px #00ffff, 0 0 30px 10px rgba(0, 255, 255, 0.4);
          z-index: 9999;
          pointer-events: none;
          animation: viewportScan 1.5s ease-in-out infinite;
        }
        .leap-scan-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 255, 255, 0.03);
          z-index: 9998;
          pointer-events: none;
          mix-blend-mode: color-dodge;
        }
      `}</style>

      {/* Viewport scan line when starting a leap */}
      {scanActive && hasAnimation && (
        <>
          <div className="viewport-scan-line" />
          <div className="leap-scan-overlay" />
        </>
      )}

      {/* Grid static background */}
      <div
        className={hasAnimation ? "glitch-static" : ""}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle, rgba(0, 255, 255, 0.05) 1px, transparent 1.2px)",
          backgroundSize: "12px 12px",
          opacity: 0.2,
          pointerEvents: "none",
          zIndex: 0,
          minHeight: "20vh"
        }}
      />

      <div style={{ position: "relative", zIndex: 1, padding: "24px 0", width: "100%" }}>
        {isLoading && <AILoadingShimmer message="Syncing timelines with history's minds..." />}
        {error && <AIErrorState message={error} onRetry={handleLeap} />}
      </div>

      <FloatingPanel id="ql-controls" title="QUANTUM COMPUTER" defaultPosition="top-right">
        <PanelDisplay
          label="LEAP STATUS"
          value={isLoading ? "LEAPING..." : result ? "MISSION ACTIVE" : "STANDBY"}
        />
        <PanelDisplay label="LEAPS TAKEN" value={totalLeaps} />
      </FloatingPanel>
    </RealmLayout>
  );
}
