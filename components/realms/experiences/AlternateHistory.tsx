"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import AIResultReveal from "@/components/realms/AIResultReveal";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

type PresetPivot = {
  label: string;
  divergence: string;
};

const realm = realmsRegistry.find((r) => r.slug === "alternate-history")!;

const PRESETS: Record<string, PresetPivot[]> = {
  "Ancient World": [
    {
      label: "Alexander the Great lives past 32 (323 BC)",
      divergence: "Alexander unifies Greece and Persia, establishing a lasting global Hellenistic empire that blocks Roman expansion.",
    },
    {
      label: "Rome never falls (476 AD)",
      divergence: "The Western Roman Empire successfully repels barbarian invasions and embraces early industrial steam power.",
    },
    {
      label: "The Library of Alexandria never burns (48 BC)",
      divergence: "Ancient scientific texts survive intact, jumpstarting the global scientific revolution 1,000 years early.",
    },
  ],
  Medieval: [
    {
      label: "The Black Death never happens (1347)",
      divergence: "Europe's population continues to grow rapidly, locking in feudal structures and preventing the rise of merchant capitalism.",
    },
    {
      label: "The Mongols conquer Europe (1241)",
      divergence: "Ögedei Khan does not die, and the Mongol hordes push past Vienna to occupy Germany, France, and Italy.",
    },
    {
      label: "Gutenberg never invents printing (1440)",
      divergence: "Information remains locked inside hand-copied monastery scribes, halting the Reformation and scientific sharing.",
    },
  ],
  "Early Modern": [
    {
      label: "Columbus never reaches Americas (1492)",
      divergence: "Native American empires (Aztec and Inca) continue to expand and establish sovereign maritime trade networks.",
    },
    {
      label: "The Industrial Revolution begins 100 years earlier",
      divergence: "Practical coal-powered steam engines are developed in 1680, causing rapid carbonization by 1800.",
    },
    {
      label: "Napoleon wins at Waterloo (1815)",
      divergence: "Napoleon consolidates the French Empire across the European continent, establishing a single imperial law system.",
    },
  ],
  Modern: [
    {
      label: "WWI never happens (1914)",
      divergence: "Archduke Franz Ferdinand survives the assassination, preserving the multi-ethnic Austro-Hungarian and German Empires.",
    },
    {
      label: "The atomic bomb is never developed (1945)",
      divergence: "World War II resolves with a conventional land invasion of Japan, leading to a divided Allied occupation.",
    },
    {
      label: "The internet is invented in 1950",
      divergence: "Cold War computing structures develop a centralized analog net by 1960, bypassing personal computing waves.",
    },
    {
      label: "The Cold War turns hot (1962)",
      divergence: "The Cuban Missile Crisis escalates into localized tactical nuclear warfare in Europe and the Caribbean.",
    },
  ],
};

export default function AlternateHistory() {
  const [selectedPivot, setSelectedPivot] = useState("The Library of Alexandria never burns (48 BC)");
  const [divergingChoice, setDivergingChoice] = useState(
    "Ancient scientific texts survive intact, jumpstarting the global scientific revolution 1,000 years early."
  );
  const [customPivotActive, setCustomPivotActive] = useState(false);
  const [customPivotText, setCustomPivotText] = useState("");
  const [focusArea, setFocusArea] = useState("All");
  const [totalTimelines, setTotalTimelines] = useState(0);
  const [mapPulse, setMapPulse] = useState(false);

  const { isLoading, error, result, generate, reset } = useRealmAI();

  const FOCUS_AREAS = ["Technology", "Politics", "Culture", "Geography", "All"];

  // Handle dropdown preset change
  const handlePivotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPivot(val);

    if (val === "custom") {
      setCustomPivotActive(true);
      setDivergingChoice("");
    } else {
      setCustomPivotActive(false);
      // Look up divergence description
      let foundDiv = "";
      Object.values(PRESETS).forEach((group) => {
        const found = group.find((item) => item.label === val);
        if (found) foundDiv = found.divergence;
      });
      setDivergingChoice(foundDiv);
    }
  };

  const handleProject = () => {
    const activePivot = customPivotActive ? customPivotText : selectedPivot;
    if (!activePivot.trim() || !divergingChoice.trim()) return;

    // Trigger map pulse animation
    setMapPulse(true);
    setTimeout(() => {
      setMapPulse(false);
    }, 2000);

    const systemPrompt = `You are an alternate history expert who projects detailed, divergent timelines. You have deep knowledge of history and can trace cause-and-effect chains with nuance.

Structure your response EXACTLY as follows with these exact headers:

THE DIVERGENCE: [1-2 sentences dramatically stating what changes and when]
IMMEDIATE AFTERMATH (first 10 years): [Paragraph of 3-4 sentences on immediate political, social, and technological consequences]
THE MIDDLE PERIOD (first 100 years): [Paragraph describing how the world diverges — name specific nations, technologies, cultural movements that emerge or disappear]
THE WORLD IN 2026: [Paragraph describing today's world in this alternate timeline — be specific about technology level, political structures, geography of nations, and daily life. What exists that doesn't in our timeline? What never happened?]
MOST DRAMATIC DIFFERENCE: [1 sentence on the single biggest way this world differs from ours]
WHAT'S SURPRISINGLY SIMILAR: [1 sentence on what stayed the same despite the divergence]
ALTERNATE TIMELINE NAME: [A proper noun name for this timeline, like historians might use, e.g. 'The Alexandrian Timeline' or 'The Unbroken Roman World']

Keep under 400 words. Be specific and bold. Name real countries, technologies, people.`;

    generate({
      systemPrompt,
      userPrompt: `Project an alternate history based on:
Pivot point: ${activePivot}
What changes: ${divergingChoice}
Focus area: ${focusArea}

Project this alternate timeline to today.`,
      maxTokens: 1000,
    });

    setTotalTimelines((prev) => prev + 1);
  };

  // Parsing helper to extract headers from alternate timeline outcome
  const parseResult = (text: string) => {
    const getSection = (header: string) => {
      const regex = new RegExp(`${header}\\s*:\\s*([\\s\\S]*?)(?=\\n(?:THE DIVERGENCE|IMMEDIATE AFTERMATH|THE MIDDLE PERIOD|THE WORLD IN 2026|MOST DRAMATIC DIFFERENCE|WHAT'S SURPRISINGLY SIMILAR|ALTERNATE TIMELINE NAME)\\s*:|$)`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    return {
      divergence: getSection("THE DIVERGENCE"),
      aftermath: getSection("IMMEDIATE AFTERMATH \\(first 10 years\\)"),
      middle: getSection("THE MIDDLE PERIOD \\(first 100 years\\)"),
      today: getSection("THE WORLD IN 2026") || getSection("THE WORLD IN 2025"),
      dramatic: getSection("MOST DRAMATIC DIFFERENCE"),
      similar: getSection("WHAT'S SURPRISINGLY SIMILAR"),
      name: getSection("ALTERNATE TIMELINE NAME"),
    };
  };

  const parsed = result ? parseResult(result) : null;
  const hasAnimation = !prefersReducedMotion();

  const inputZone = !result && !isLoading && !error ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Input 1 — Pivot Point Dropdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          HISTORICAL PIVOT POINT
        </label>
        <select
          value={selectedPivot}
          onChange={handlePivotChange}
          style={{
            width: "100%",
            height: 44,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "0 12px",
            fontFamily: "var(--font-ui), sans-serif",
            fontSize: 14,
            color: "var(--text-primary)",
            outline: "none",
            cursor: "pointer",
          }}
        >
          {Object.entries(PRESETS).map(([groupName, list]) => (
            <optgroup key={groupName} label={groupName}>
              {list.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="custom">Write my own pivot point...</option>
        </select>

        {customPivotActive && (
          <input
            type="text"
            value={customPivotText}
            onChange={(e) => setCustomPivotText(e.target.value)}
            placeholder="Describe your custom historical event (e.g. Rome falls in 300 AD)..."
            style={{
              width: "100%",
              height: 44,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "0 16px",
              fontFamily: "var(--font-ui)",
              fontSize: 14,
              color: "var(--text-primary)",
              outline: "none",
              marginTop: 10,
            }}
          />
        )}
      </div>

      {/* Input 2 — Diverging Choice */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          WHAT CHANGES AT THIS MOMENT?
        </label>
        <textarea
          value={divergingChoice}
          onChange={(e) => setDivergingChoice(e.target.value)}
          placeholder="Describe what occurs differently..."
          style={{
            width: "100%",
            minHeight: 80,
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

      {/* Input 3 — Focus Pill toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
          FOCUS THE ALTERNATE HISTORY ON
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FOCUS_AREAS.map((area) => {
            const selected = focusArea === area;
            return (
              <button
                key={area}
                onClick={() => setFocusArea(area)}
                style={{
                  padding: "6px 14px",
                  background: selected ? "var(--accent-scifi)" : "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 100,
                  fontFamily: "var(--font-ui), sans-serif",
                  fontSize: 12,
                  color: selected ? "#ffffff" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Project button */}
      <button
        onClick={handleProject}
        style={{
          width: "100%",
          height: 52,
          borderRadius: 8,
          background: "var(--accent-scifi)",
          border: "none",
          color: "#ffffff",
          fontFamily: "var(--font-ui), sans-serif",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 200ms",
        }}
      >
        Project Alternate Timeline
      </button>
    </div>
  ) : null;

  const resultsZone = result && parsed ? (
    <AIResultReveal>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Timeline Header Banner */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--bg-surface), color-mix(in srgb, var(--accent-scifi) 8%, transparent))",
            padding: "40px 32px 32px 32px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
            ALTERNATE TIMELINE PROJECTED
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "clamp(26px, 5vw, 38px)",
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--text-primary)",
              margin: "8px 0 0 0",
              lineHeight: 1.3,
            }}
          >
            {parsed.name || "The Divergent Path"}
          </h1>
        </div>

        {/* Divergence Block */}
        {parsed.divergence && (
          <div style={{ background: "var(--bg-surface)", padding: "20px 32px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
              THE DIVERGENCE POINT
            </span>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-primary)", margin: 0, fontWeight: 300 }}>
              "{parsed.divergence}"
            </p>
          </div>
        )}

        {/* Chronological timelines progression blocks */}
        <div style={{ padding: "32px 32px 20px 32px", display: "flex", flexDirection: "column", gap: 28 }}>
          {parsed.aftermath && (
            <div style={{ display: "flex", gap: 16 }}>
              {/* Left node graph */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-scifi)", margin: "4px 0" }} />
                <div style={{ flex: 1, width: 2, background: "var(--border)" }} />
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-scifi)" }}>
                  IMMEDIATE AFTERMATH (FIRST 10 YEARS)
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, marginTop: 6, marginBottom: 0 }}>
                  {parsed.aftermath}
                </p>
              </div>
            </div>
          )}

          {parsed.middle && (
            <div style={{ display: "flex", gap: 16 }}>
              {/* Left node graph */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-scifi)", margin: "4px 0" }} />
                <div style={{ flex: 1, width: 2, background: "var(--border)" }} />
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-scifi)" }}>
                  THE MIDDLE PERIOD (FIRST 100 YEARS)
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, marginTop: 6, marginBottom: 0 }}>
                  {parsed.middle}
                </p>
              </div>
            </div>
          )}

          {parsed.today && (
            <div style={{ display: "flex", gap: 16 }}>
              {/* Left node graph */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent-scifi)", margin: "4px 0" }} />
              </div>
              <div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-scifi)" }}>
                  THE WORLD TODAY (2026)
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-primary)", lineHeight: 1.7, marginTop: 6, marginBottom: 0 }}>
                  {parsed.today}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Differences / Similarities */}
        {parsed.dramatic && (
          <div style={{ padding: "0 32px 24px 32px" }}>
            <div style={{ background: "color-mix(in srgb, var(--accent-scifi) 6%, transparent)", border: "1px solid var(--border)", borderRadius: 10, padding: "20px 24px" }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-scifi)", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                MOST DRAMATIC DIFFERENCE
              </span>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-primary)", margin: 0, fontWeight: 300 }}>
                {parsed.dramatic}
              </p>
            </div>
          </div>
        )}

        {parsed.similar && (
          <div style={{ padding: "16px 32px 24px 32px", background: "var(--bg-surface)", borderTop: "1px solid var(--border-subtle)" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>
              SURPRISINGLY SIMILAR
            </span>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", fontStyle: "italic", margin: 0 }}>
              {parsed.similar}
            </p>
          </div>
        )}
      </div>

      {/* Actions row */}
      <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
        <button
          onClick={reset}
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
          Project Another Timeline
        </button>
        <button
          onClick={() => alert("Timeline URL copied!")}
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
          Share Projections
        </button>
      </div>
    </AIResultReveal>
  ) : null;

  return (
    <RealmLayout realm={realm} hasInputZone={!result && !isLoading && !error} inputZone={inputZone} resultsZone={resultsZone}>
      {/* ─── Simplified World Map Silhouette Backdrop ─── */}
      <style>{`
        @keyframes mapPulseKey {
          0% { opacity: 0.05; }
          50% { opacity: 0.20; }
          100% { opacity: 0.05; }
        }
        .map-pulse-active {
          animation: mapPulseKey 2s ease-in-out;
        }
      `}</style>
      
      <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          className={hasAnimation && mapPulse ? "map-pulse-active" : ""}
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            opacity: 0.8,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "absolute", inset: 0, opacity: 0.15, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg viewBox="0 0 1000 600" style={{ width: "90%", height: "90%" }}>
              {/* North America */}
              <polygon points="100,100 250,80 350,150 300,280 200,320 180,240 100,180" fill="var(--text-faint)" />
              {/* South America */}
              <polygon points="280,320 340,350 360,450 300,550 260,480 260,380" fill="var(--text-faint)" />
              {/* Eurasia */}
              <polygon points="400,80 650,50 850,70 920,200 800,280 620,240 500,280 400,180" fill="var(--text-faint)" />
              {/* Africa */}
              <polygon points="450,280 580,260 620,380 560,480 500,450 440,340" fill="var(--text-faint)" />
              {/* Australia */}
              <polygon points="750,380 820,390 850,450 780,470 740,420" fill="var(--text-faint)" />
            </svg>
          </div>

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: 24 }}>
            {isLoading && <AILoadingShimmer message="Simulating alternate timelines..." />}
            {error && <AIErrorState message={error} onRetry={handleProject} />}
            {!isLoading && !error && (
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: 32, display: "block", marginBottom: 12 }}>🧭</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-scifi)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  TEMPORAL CHART READY
                </span>
                <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", marginTop: 6, margin: "6px auto 0", maxWidth: 380 }}>
                  Enter your divergence settings above and click project to generate alternate histories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Timeline Viewer controls (Floating Panel) ─── */}
      <FloatingPanel id="ah-controls" title="TIMELINE VIEWER" defaultPosition="top-right">
        <PanelDisplay
          label="ACTIVE TIMELINE"
          value={parsed?.name ? parsed.name.slice(0, 18) + "..." : "AWAITING PROJECT"}
        />
        <PanelDisplay
          label="TIMELINES EXPLORED"
          value={totalTimelines}
        />
      </FloatingPanel>
    </RealmLayout>
  );
}
