"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import AIResultReveal from "@/components/realms/AIResultReveal";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion, getCSSVar } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

type Star = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  twinkleSpeed: number;
};

type ConstellationLine = {
  fromIdx: number;
  toIdx: number;
  progress: number;
};

const realm = realmsRegistry.find((r) => r.slug === "destiny-matrix")!;

export default function DestinyMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<(ts: number) => void>(() => {});
  const sizeRef = useRef({ w: 0, h: 0 });

  // Wizard state
  const [step, setStep] = useState(1);
  const [displayedStep, setDisplayedStep] = useState(1);
  const [isRotatingOut, setIsRotatingOut] = useState(false);

  const changeStep = (nextStep: number) => {
    if (prefersReducedMotion()) {
      setStep(nextStep);
      setDisplayedStep(nextStep);
      return;
    }
    setIsRotatingOut(true);
    setTimeout(() => {
      setStep(nextStep);
      setDisplayedStep(nextStep);
      setIsRotatingOut(false);
    }, 350);
  };

  // Form inputs
  const [birthdate, setBirthdate] = useState("");
  const [birthCity, setBirthCity] = useState("");
  const [shapingEvent, setShapingEvent] = useState("");
  const [soulDecade, setSoulDecade] = useState("Present");
  const [lifePurpose, setLifePurpose] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [lifeGoal, setLifeGoal] = useState("");
  const [unansweredQuestion, setUnansweredQuestion] = useState("");

  const VALUES = [
    "Love",
    "Knowledge",
    "Creation",
    "Justice",
    "Connection",
    "Freedom",
    "Legacy",
    "Survival",
    "Beauty",
    "Truth",
    "Power",
    "Peace",
  ];

  const DECADES = ["1920s", "1940s", "1960s", "1980s", "2000s", "Present"];

  const handleValueToggle = (val: string) => {
    setSelectedValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : prev.length < 3 ? [...prev, val] : prev
    );
  };

  // AI & Theatrical Loading state
  const { isLoading: apiLoading, error, result, generate, reset } = useRealmAI();
  const [theatricalLoading, setTheatricalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Calculating your position in spacetime...");
  const apiDoneRef = useRef(false);
  const [resultCache, setResultCache] = useState<string | null>(null);

  // Starfield and Constellations physics refs
  const starsRef = useRef<Star[]>([]);
  const constellationLinesRef = useRef<ConstellationLine[]>([]);
  const activeLinesCountRef = useRef(0);

  // Typewriter scan line states
  const [outcomeHeight, setOutcomeHeight] = useState(600);
  const [isScanning, setIsScanning] = useState(false);
  const outcomeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultCache && !theatricalLoading) {
      setIsScanning(true);
      setTimeout(() => {
        if (outcomeRef.current) {
          setOutcomeHeight(outcomeRef.current.offsetHeight || 600);
        }
      }, 80);
    } else {
      setIsScanning(false);
    }
  }, [resultCache, theatricalLoading]);

  // Handle resizing of canvas using useCanvasSize hook
  useCanvasSize(
    canvasRef,
    useCallback((w: number, h: number) => {
      sizeRef.current = { w, h };

      // Generate 300 stars
      const starList: Star[] = [];
      for (let i = 0; i < 300; i++) {
        starList.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + Math.random() * 0.8,
          alpha: Math.random(),
          twinkleSpeed: 0.01 + Math.random() * 0.02,
        });
      }
      starsRef.current = starList;

      // Define preset constellation links between star indices
      const linesList: ConstellationLine[] = [];
      for (let i = 0; i < 15; i++) {
        const fromIdx = Math.floor(Math.random() * 100);
        const toIdx = Math.floor(100 + Math.random() * 200);
        linesList.push({ fromIdx, toIdx, progress: 0.0 });
      }
      constellationLinesRef.current = linesList;
    }, [])
  );

  // Update active constellation lines count based on input completion
  useEffect(() => {
    let completedSteps = 0;
    if (birthdate) completedSteps += 2;
    if (shapingEvent || soulDecade !== "Present") completedSteps += 3;
    if (lifePurpose || selectedValues.length > 0) completedSteps += 3;
    if (lifeGoal || unansweredQuestion) completedSteps += 4;

    activeLinesCountRef.current = Math.min(completedSteps, 12);
  }, [birthdate, shapingEvent, soulDecade, lifePurpose, selectedValues, lifeGoal, unansweredQuestion]);

  // Twinkle & draw constellation lines loop
  const render = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, h } = sizeRef.current;
      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(renderRef.current);
        return;
      }
      const reduced = prefersReducedMotion();
      const isDark = !document.documentElement.classList.contains("light");

      // Draw background
      ctx.fillStyle = getCSSVar("--bg-base") || (isDark ? "#06060A" : "#F4F3EF");
      ctx.fillRect(0, 0, w, h);

      // Render stars
      starsRef.current.forEach((star) => {
        if (!reduced) {
          star.alpha += star.twinkleSpeed;
          if (star.alpha > 1.0 || star.alpha < 0.2) {
            star.twinkleSpeed *= -1;
          }
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${star.alpha * 0.4})`
          : `rgba(26, 26, 46, ${star.alpha * 0.1})`;
        ctx.fill();
      });

      // Render constellation connections
      const activeCount = activeLinesCountRef.current;
      const lines = constellationLinesRef.current;

      for (let i = 0; i < lines.length; i++) {
        if (i >= activeCount) break;

        const line = lines[i];
        const sFrom = starsRef.current[line.fromIdx];
        const sTo = starsRef.current[line.toIdx];

        if (sFrom && sTo) {
          // Increment draw progress animation
          if (!reduced && line.progress < 1.0) {
            line.progress += 0.05;
            if (line.progress > 1.0) line.progress = 1.0;
          } else if (reduced) {
            line.progress = 1.0;
          }

          const targetX = sFrom.x + (sTo.x - sFrom.x) * line.progress;
          const targetY = sFrom.y + (sTo.y - sFrom.y) * line.progress;

          ctx.beginPath();
          ctx.moveTo(sFrom.x, sFrom.y);
          ctx.lineTo(targetX, targetY);
          ctx.strokeStyle = isDark ? "rgba(224, 154, 58, 0.15)" : "rgba(201, 168, 76, 0.2)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      rafRef.current = requestAnimationFrame(renderRef.current);
    },
    []
  );

  useEffect(() => {
    renderRef.current = render;
    rafRef.current = requestAnimationFrame(renderRef.current);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  // Synchronise API completion with theatrical sequence minimum delay
  useEffect(() => {
    if (!apiLoading && result && theatricalLoading) {
      apiDoneRef.current = true;
      setResultCache(result);
    }
  }, [apiLoading, result, theatricalLoading]);

  const handleGenerate = () => {
    if (!birthdate.trim()) return;

    setTheatricalLoading(true);
    apiDoneRef.current = false;
    setResultCache(null);

    // Sequence theatrical loading messages
    const sequence = [
      { text: "Mapping local time gravity...", delay: 0 },
      { text: "Analyzing timeline convergence...", delay: 1800 },
      { text: "Synthesizing astrological matrices...", delay: 3500 },
      { text: "Locking temporal nodes...", delay: 5200 },
    ];

    sequence.forEach((msg) => {
      setTimeout(() => {
        // If API call fails early, stop setting messages
        setLoadingMessage((prev) => {
          if (apiDoneRef.current && msg.delay > 3500) return prev;
          return msg.text;
        });
      }, msg.delay);
    });

    // Automatically dismiss after 7.0 seconds and only if the api call has completed
    setTimeout(() => {
      const checkAndComplete = () => {
        if (apiDoneRef.current || !apiLoading) {
          setTheatricalLoading(false);
        } else {
          // If API still running, check again in 200ms
          setTimeout(checkAndComplete, 200);
        }
      };
      checkAndComplete();
    }, 7000);

    // Calculate age for AI query
    const bDate = new Date(birthdate);
    const today = new Date();
    let ageYrs = today.getFullYear() - bDate.getFullYear();
    const m = today.getMonth() - bDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < bDate.getDate())) {
      ageYrs--;
    }

    const systemPrompt = `You are an AI quantum astrologer. You calculate Destiny Matrices — highly personalized, deep psychological and philosophical maps of a person's path in spacetime.
Your voice is mystical, clinical, and profoundly serious, but with a slight touch of surreal cosmic irony.

Structure your response EXACTLY as follows with these exact headers:

TEMPORAL COORDINATES: [1-2 sentences calculating their position in cosmic history based on birthdate and city, e.g., how far the solar system has traveled since they were born]
YOUR HISTORICAL POSITION: [Paragraph of 3 sentences showing how the major historical event that shaped them anchors their personal timeline relative to other generations]
YOUR COSMIC ROLE: [Paragraph of 3 sentences analyzing their primary work and selected values to determine their archetypal function in the human machine]
THE QUESTION BEHIND YOUR QUESTION: [2 sentences dissecting the question they wish they knew the answer to, showing the deeper existential longing it represents]
YOUR PLACE IN THE UNIVERSE: [A poetic, sweeping statement of 2-3 sentences summarizing their meaning in the grand tapestry of spacetime]
WHAT YOU LEAVE BEHIND: [A single sentence on the legacy of their values and actions after they have returned to the starfields]

Keep under 400 words. Be profound.`;

    generate({
      systemPrompt,
      userPrompt: `Generate the Destiny Matrix for this person:
Born: ${birthdate} in ${birthCity || "an unknown city"}
Current age: ${ageYrs}

Historical event that shaped them: ${shapingEvent || "standard timeline drift"}
Decade their soul belongs to: ${soulDecade}

Life's primary work: ${lifePurpose || "exploring their coordinates"}
Values (most important): ${selectedValues.join(", ") || "universal stability"}

Hope to accomplish: ${lifeGoal || "leave a meaningful legacy"}
Unanswered question: ${unansweredQuestion || "why are we here?"}

Reveal their Destiny Matrix.`,
      maxTokens: 1000,
    });
  };

  // Parsing helper to separate the sections of the Destiny Matrix outcome
  const parseResult = (text: string) => {
    const getSection = (header: string) => {
      const regex = new RegExp(`${header}\\s*:\\s*([\\s\\S]*?)(?=\\n(?:TEMPORAL COORDINATES|YOUR HISTORICAL POSITION|YOUR COSMIC ROLE|THE QUESTION BEHIND YOUR QUESTION|YOUR PLACE IN THE UNIVERSE|WHAT YOU LEAVE BEHIND)\\s*:|$)`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    return {
      coordinates: getSection("TEMPORAL COORDINATES"),
      historical: getSection("YOUR HISTORICAL POSITION"),
      role: getSection("YOUR COSMIC ROLE"),
      question: getSection("THE QUESTION BEHIND YOUR QUESTION"),
      place: getSection("YOUR PLACE IN THE UNIVERSE"),
      legacy: getSection("WHAT YOU LEAVE BEHIND"),
    };
  };

  const parsedResult = resultCache ? parseResult(resultCache) : null;
  const stepsList = [1, 2, 3, 4];

  const inputZone = !resultCache && !theatricalLoading && !error ? (
    <div className="wizard-perspective">
      <div
        className="wizard-card-3d"
        style={{
          transform: isRotatingOut ? "rotateY(-90deg)" : "rotateY(0deg)",
          opacity: isRotatingOut ? 0 : 1,
        }}
      >
        <style>{`
          .wizard-perspective {
            perspective: 1500px;
            width: 100%;
          }
          .wizard-card-3d {
            transition: transform 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 350ms ease;
            transform-origin: left center;
            transform-style: preserve-3d;
            background: color-mix(in srgb, var(--bg-card) 85%, transparent);
            backdrop-filter: blur(12px);
            WebkitBackdrop-filter: blur(12px);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          }
        `}</style>
        {/* Progress indicators dots */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            STEP {step} OF 4
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {stepsList.map((s) => (
              <div
                key={s}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: step === s ? "var(--accent-destiny)" : step > s ? "var(--accent-bio)" : "var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  color: "#ffffff",
                  transition: "all 300ms",
                }}
              >
                {step > s ? "✓" : ""}
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1 */}
        {displayedStep === 1 && (
          <div className="slide-step">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", fontWeight: 300, marginBottom: 8 }}>
              When Are You?
            </h3>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
              Let us establish your precise coordinate location in time and space.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  YOUR DATE OF BIRTH (REQUIRED)
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  max={new Date().toISOString().slice(0, 10)}
                  style={{
                    width: "100%",
                    height: 44,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "0 16px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-primary)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                  BIRTH CITY / PLACE (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={birthCity}
                  onChange={(e) => setBirthCity(e.target.value)}
                  placeholder="e.g. London, United Kingdom"
                  style={{
                    width: "100%",
                    height: 44,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "0 16px",
                    fontFamily: "var(--font-ui)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <button
              onClick={() => changeStep(2)}
              disabled={!birthdate}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 8,
                background: birthdate ? "var(--accent-destiny)" : "var(--border)",
                border: "none",
                color: birthdate ? "#ffffff" : "var(--text-faint)",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 600,
                cursor: birthdate ? "pointer" : "not-allowed",
                marginTop: 32,
                textTransform: "uppercase",
              }}
            >
              Establish Coordinates →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {displayedStep === 2 && (
          <div className="slide-step">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", fontWeight: 300, marginBottom: 8 }}>
              What Has Shaped You?
            </h3>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
              Connect your temporal arc to key events that occurred during your lifetime.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em" }}>
                  MAJOR LIFE-SHAPING WORLD EVENT
                </label>
                <textarea
                  value={shapingEvent}
                  onChange={(e) => setShapingEvent(e.target.value)}
                  placeholder="e.g. The global shift of internet accessibility, economic changes..."
                  style={{
                    width: "100%",
                    minHeight: 80,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 16,
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em" }}>
                  WHICH DECADE DOES YOUR SOUL BELONG TO?
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {DECADES.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSoulDecade(d)}
                      style={{
                        padding: "6px 14px",
                        background: soulDecade === d ? "var(--accent-destiny)" : "transparent",
                        border: "1px solid var(--border)",
                        borderRadius: 100,
                        fontFamily: "var(--font-ui)",
                        fontSize: 12,
                        color: soulDecade === d ? "#ffffff" : "var(--text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button
                onClick={() => changeStep(1)}
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
                onClick={() => changeStep(3)}
                style={{
                  flex: 2,
                  height: 48,
                  borderRadius: 8,
                  background: "var(--accent-destiny)",
                  border: "none",
                  color: "#ffffff",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {displayedStep === 3 && (
          <div className="slide-step">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", fontWeight: 300, marginBottom: 8 }}>
              Your Cosmic Role
            </h3>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
              Establish how your work or values interact with the broader flow of human effort.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em" }}>
                  YOUR PRIMARY WORK OR PURPOSE
                </label>
                <textarea
                  value={lifePurpose}
                  onChange={(e) => setLifePurpose(e.target.value)}
                  placeholder="e.g. I build accessible software, teach literacy, raise a family..."
                  style={{
                    width: "100%",
                    minHeight: 80,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 16,
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em" }}>
                  WHAT MATTERS MOST? (SELECT UP TO 3)
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {VALUES.map((val) => {
                    const selected = selectedValues.includes(val);
                    return (
                      <button
                        key={val}
                        onClick={() => handleValueToggle(val)}
                        style={{
                          padding: "6px 14px",
                          background: selected ? "var(--accent-destiny)" : "transparent",
                          border: "1px solid var(--border)",
                          borderRadius: 100,
                          fontFamily: "var(--font-ui)",
                          fontSize: 12,
                          color: selected ? "#ffffff" : "var(--text-muted)",
                          cursor: "pointer",
                        }}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button
                onClick={() => changeStep(2)}
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
                onClick={() => changeStep(4)}
                style={{
                  flex: 2,
                  height: 48,
                  borderRadius: 8,
                  background: "var(--accent-destiny)",
                  border: "none",
                  color: "#ffffff",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {displayedStep === 4 && (
          <div className="slide-step">
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", fontWeight: 300, marginBottom: 8 }}>
              The Final Variables
            </h3>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
              Map out your goals and final questions to lock down the temporal diagnostics.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em" }}>
                  ONE THING YOU HOPE TO ACCOMPLISH BEFORE YOUR TIME ENDS
                </label>
                <textarea
                  value={lifeGoal}
                  onChange={(e) => setLifeGoal(e.target.value)}
                  placeholder="e.g. Write a novel, see the aurora borealis, secure my family's future..."
                  style={{
                    width: "100%",
                    minHeight: 80,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: 16,
                    fontFamily: "var(--font-ui)",
                    fontSize: 14,
                    color: "var(--text-primary)",
                    resize: "vertical",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.08em" }}>
                  ONE QUESTION YOU WISH YOU KNEW THE ANSWER TO
                </label>
                <input
                  type="text"
                  value={unansweredQuestion}
                  onChange={(e) => setUnansweredQuestion(e.target.value)}
                  placeholder="e.g. What lies beyond the event horizon? Is there other life?"
                  style={{
                    width: "100%",
                    height: 44,
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "0 16px",
                    fontFamily: "var(--font-ui)",
                    color: "var(--text-primary)",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              <button
                onClick={() => changeStep(3)}
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
                onClick={handleGenerate}
                style={{
                  flex: 2,
                  height: 48,
                  borderRadius: 8,
                  background: "var(--accent-destiny)",
                  border: "none",
                  color: "#ffffff",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Reveal My Destiny Matrix
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  const resultsZone = resultCache && parsedResult && !theatricalLoading ? (
    <div style={{ position: "relative", width: "100%", zIndex: 2 }}>
      <style>{`
        @keyframes scanSweep {
          0% { top: 0; opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes clipReveal {
          from { clip-path: inset(0 0 100% 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        .destiny-scan-line {
          position: absolute;
          left: -2%;
          width: 104%;
          height: 3px;
          background: #e09a3a;
          box-shadow: 0 0 10px 2px #e09a3a, 0 0 20px 4px rgba(224, 154, 58, 0.5);
          z-index: 10;
          pointer-events: none;
        }
        .destiny-scanned-content {
          position: relative;
        }
      `}</style>

      {/* The scanning line */}
      <div
        className="destiny-scan-line"
        style={
          prefersReducedMotion() || !isScanning
            ? { display: "none" }
            : { animation: `scanSweep ${outcomeHeight / 80}s linear forwards` }
        }
      />

      {/* The outcome content container */}
      <div
        ref={outcomeRef}
        className="destiny-scanned-content"
        style={
          prefersReducedMotion() || !isScanning
            ? {}
            : { animation: `clipReveal ${outcomeHeight / 80}s linear forwards` }
        }
      >
        {/* Header metadata */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-destiny)", letterSpacing: "0.4em" }}>
            DESTINY MATRIX
          </span>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>
            SUBJECT COORDINATES: {birthdate} — {birthCity || "Spacetime"}
          </div>
          <div
            style={{
              height: 1,
              background: "rgba(224, 154, 58, 0.3)",
              width: 120,
              margin: "24px auto 0",
            }}
          />
        </div>

        {/* Sections list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {parsedResult.coordinates && (
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-destiny)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Temporal Coordinates
              </span>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-primary)", lineHeight: 1.7, marginTop: 8 }}>
                {parsedResult.coordinates}
              </p>
            </div>
          )}

          {parsedResult.historical && (
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-destiny)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Your Historical Position
              </span>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-muted)", lineHeight: 1.7, marginTop: 8 }}>
                {parsedResult.historical}
              </p>
            </div>
          )}

          {parsedResult.role && (
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-destiny)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Your Cosmic Role
              </span>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, color: "var(--text-primary)", lineHeight: 1.7, marginTop: 8 }}>
                {parsedResult.role}
              </p>
            </div>
          )}

          {parsedResult.question && (
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-destiny)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                The Question Behind Your Question
              </span>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-muted)", lineHeight: 1.6, marginTop: 8, fontWeight: 300 }}>
                {parsedResult.question}
              </p>
            </div>
          )}

          {parsedResult.place && (
            <div style={{ background: "rgba(224, 154, 58, 0.08)", border: "1px solid rgba(224, 154, 58, 0.2)", borderRadius: 10, padding: 32 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-destiny)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ✦ Your Place In The Universe
              </span>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontStyle: "italic", color: "var(--text-primary)", lineHeight: 1.7, marginTop: 12, marginBottom: 0, fontWeight: 300 }}>
                {parsedResult.place}
              </p>
            </div>
          )}

          {parsedResult.legacy && (
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 24, textAlign: "center" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                What You Leave Behind
              </span>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.6, marginTop: 8 }}>
                {parsedResult.legacy}
              </p>
            </div>
          )}
        </div>

        {/* Action resets */}
        <div style={{ display: "flex", gap: 12, marginTop: 48, justifyContent: "center" }}>
          <button
            onClick={() => {
              reset();
              setStep(1);
              setDisplayedStep(1);
              setResultCache(null);
            }}
            style={{
              height: 48,
              borderRadius: 8,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              fontWeight: 600,
              padding: "0 24px",
              cursor: "pointer",
            }}
          >
            Recalculate Destiny
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(resultCache || "");
              alert("Copied Matrix logs!");
            }}
            style={{
              height: 48,
              borderRadius: 8,
              background: "var(--accent-destiny)",
              border: "none",
              color: "#ffffff",
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              fontWeight: 600,
              padding: "0 24px",
              cursor: "pointer",
            }}
          >
            Log Spacetime Coordinates
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <RealmLayout realm={realm} hasInputZone={!resultCache && !theatricalLoading && !error} inputZone={inputZone} resultsZone={resultsZone}>
      <div style={{ position: "relative", width: "100%", minHeight: "350px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        {/* Starfield canvas backdrop */}
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%", minHeight: "350px" }} />

        {/* Theatrical Loading Stage inside the canvas frame */}
        {theatricalLoading && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ maxWidth: 500, width: "100%" }}>
              <AILoadingShimmer message={loadingMessage} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <AIErrorState message={error} onRetry={handleGenerate} />
          </div>
        )}
      </div>

      {/* ─── Destiny Controls (Floating Panel) ─── */}
      <FloatingPanel id="dm-controls" title="DESTINY DIAGNOSTICS" defaultPosition="top-right">
        <PanelDisplay
          label="STATUS"
          value={theatricalLoading ? "SYNTHESIZING..." : resultCache ? "TIMELINE SHIFTED" : "AWAITING MATRIX"}
        />
      </FloatingPanel>
    </RealmLayout>
  );
}
