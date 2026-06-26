"use client";

import React, { useState, useEffect } from "react";
import { useRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import AIResultReveal from "@/components/realms/AIResultReveal";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "genius-age-matcher")!;

type GeniusItem = {
  name: string;
  initial: string;
  color: string;
};

const GENIUSES_LIST: GeniusItem[] = [
  { name: "Albert Einstein", initial: "E", color: "#4B8EF1" },
  { name: "Leonardo da Vinci", initial: "V", color: "#E09A3A" },
  { name: "Marie Curie", initial: "C", color: "#3ABFBF" },
  { name: "Isaac Newton", initial: "N", color: "#7B61FF" },
  { name: "Nikola Tesla", initial: "T", color: "#C9A84C" },
  { name: "Ada Lovelace", initial: "L", color: "#E87C7C" },
  { name: "Galileo Galilei", initial: "G", color: "#52C4A0" },
  { name: "Charles Darwin", initial: "D", color: "#60A5D4" },
  { name: "Wolfgang Mozart", initial: "M", color: "#9B8EF5" },
  { name: "Frida Kahlo", initial: "K", color: "#F5A857" },
];

type GeniusResponse = {
  name: string;
  ageAtTime: number;
  year: number | string;
  title: string;
  description: string;
  significance: string;
  quote: string;
  comparison: string;
};

type AIResultJson = {
  geniuses: GeniusResponse[];
  overallInsight: string;
  encouragement: string;
};

export default function GeniusAgeMatcher() {
  const [inputType, setInputType] = useState<"birthdate" | "age">("age");
  const [birthdate, setBirthdate] = useState("");
  const [ageDirect, setAgeDirect] = useState("25");
  const [selectedGeniuses, setSelectedGeniuses] = useState<string[]>([
    "Albert Einstein",
    "Leonardo da Vinci",
    "Marie Curie",
  ]);

  const { isLoading, error, result, generate, reset } = useRealmAI();

  // Calculated Age details for controls panel
  const [exactAge, setExactAge] = useState(25.0);
  const [birthYear, setBirthYear] = useState<string | number>("—");

  useEffect(() => {
    if (inputType === "age") {
      const parsedAge = parseFloat(ageDirect) || 0;
      setExactAge(parsedAge);
      setBirthYear(new Date().getFullYear() - Math.round(parsedAge));
    } else if (inputType === "birthdate" && birthdate) {
      const birth = new Date(birthdate);
      const diffMs = Date.now() - birth.getTime();
      const ageYrs = diffMs / (1000 * 60 * 60 * 24 * 365.25);
      setExactAge(parseFloat(ageYrs.toFixed(2)));
      setBirthYear(birth.getFullYear());
    }
  }, [inputType, birthdate, ageDirect]);

  const handleGeniusToggle = (name: string) => {
    setSelectedGeniuses((prev) => {
      if (prev.includes(name)) {
        if (prev.length <= 2) return prev; // min 2
        return prev.filter((g) => g !== name);
      } else {
        if (prev.length >= 4) return prev; // max 4
        return [...prev, name];
      }
    });
  };

  const handleCompare = () => {
    const ageString = exactAge.toFixed(2);
    const systemPrompt = `You are a biographical historian with encyclopedic knowledge of history's greatest minds. You provide precise, accurate information about what these figures accomplished at specific ages.

Structure your response as JSON ONLY — no other text before or after. The JSON structure MUST be precisely:
{
  "geniuses": [
    {
      "name": "Albert Einstein",
      "ageAtTime": 26,
      "year": 1905,
      "title": "What they were doing",
      "description": "2-3 sentence description of their exact situation and accomplishments at this age. Be specific — name projects, papers, discoveries, relationships.",
      "significance": "1 sentence on why this age was pivotal for them",
      "quote": "A real attributed quote from this person, ideally from this period",
      "comparison": "1 sentence comparing their situation at this age to what an average person experiences"
    }
  ],
  "overallInsight": "2-3 sentences reflecting on the pattern across all these geniuses at this age — what does it reveal about human potential and timing?",
  "encouragement": "1-2 sentences of genuine, non-cheesy perspective on what this comparison means for the person asking"
}

Use real historical facts. If uncertain about an exact year, use the most historically accurate approximation. Always return valid JSON.`;

    generate({
      systemPrompt,
      userPrompt: `I am exactly ${ageString} years old.
Tell me what these historical geniuses were doing at my exact age (${ageString}):
${selectedGeniuses.join(", ")}

Return the JSON response only.`,
      maxTokens: 1000,
    });
  };

  // Helper to parse JSON output cleanly
  const parseJsonResult = (content: string): AIResultJson | null => {
    try {
      let jsonText = content.trim();
      if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
      }
      return JSON.parse(jsonText) as AIResultJson;
    } catch (e) {
      console.error("Failed to parse JSON result", e);
      return null;
    }
  };

  const parsed = result ? parseJsonResult(result) : null;

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        !result && !isLoading && !error ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 20, width: "100%", boxSizing: "border-box" }}>
            {/* Toggle Input Type */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setInputType("age")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 100,
                  border: "1px solid var(--border)",
                  background: inputType === "age" ? "var(--accent-bio)" : "transparent",
                  color: inputType === "age" ? "#ffffff" : "var(--text-muted)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                Enter Age Directly
              </button>
              <button
                onClick={() => setInputType("birthdate")}
                style={{
                  padding: "6px 14px",
                  borderRadius: 100,
                  border: "1px solid var(--border)",
                  background: inputType === "birthdate" ? "var(--accent-bio)" : "transparent",
                  color: inputType === "birthdate" ? "#ffffff" : "var(--text-muted)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                Enter Birthdate
              </button>
            </div>

            {/* Input Row */}
            <div>
              {inputType === "age" ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                    YOUR AGE
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={ageDirect}
                    onChange={(e) => setAgeDirect(e.target.value)}
                    style={{
                      width: 160,
                      height: 44,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "0 16px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 15,
                      color: "var(--text-primary)",
                      outline: "none",
                    }}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                    YOUR BIRTHDATE
                  </label>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    style={{
                      width: 200,
                      height: 44,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "0 16px",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 14,
                      color: "var(--text-primary)",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Genius selection grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                WHICH GENIUSES? (SELECT 2 TO 4)
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                  gap: 12,
                  marginTop: 8,
                }}
              >
                {GENIUSES_LIST.map((g) => {
                  const selected = selectedGeniuses.includes(g.name);
                  return (
                    <button
                      key={g.name}
                      onClick={() => handleGeniusToggle(g.name)}
                      style={{
                        background: selected ? "color-mix(in srgb, var(--accent-bio) 12%, transparent)" : "var(--bg-surface)",
                        border: selected ? "2px solid var(--accent-bio)" : "1px solid var(--border)",
                        borderRadius: 12,
                        padding: "16px 8px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 10,
                        cursor: "pointer",
                        transition: "all 150ms",
                      }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: selected ? "var(--accent-bio)" : "var(--border)",
                          color: selected ? "#ffffff" : "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "var(--font-display)",
                          fontSize: 18,
                          fontWeight: "bold",
                        }}
                      >
                        {g.initial}
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--font-ui)",
                          fontSize: 11,
                          fontWeight: selected ? 600 : 500,
                          color: selected ? "var(--accent-bio)" : "var(--text-muted)",
                          textAlign: "center",
                        }}
                      >
                        {g.name.split(" ").slice(-1)[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compare Button */}
            <button
              onClick={handleCompare}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 8,
                background: "var(--accent-bio)",
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
              Compare My Age
            </button>
          </div>
        ) : null
      }
      resultsZone={
        result && parsed ? (
          <AIResultReveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
              {/* Genius comparison cards grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
                {parsed.geniuses.map((g, idx) => {
                  const presetData = GENIUSES_LIST.find((item) => item.name === g.name);
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderTop: "3px solid var(--accent-bio)",
                        borderRadius: 10,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      {/* Header row */}
                      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: 16 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "var(--bg-surface)",
                            border: "1px solid var(--accent-bio)",
                            color: "var(--accent-bio)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: "var(--font-display)",
                            fontSize: 16,
                            fontWeight: "bold",
                          }}
                        >
                          {presetData?.initial || "G"}
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                            {g.name}
                          </div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
                            At Age {g.ageAtTime} • Year {g.year}
                          </div>
                        </div>
                      </div>

                      {/* Accomplishment banner */}
                      <div style={{ background: "var(--bg-surface)", padding: "12px 24px", marginTop: 16 }}>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-primary)", margin: 0, fontWeight: 300 }}>
                          {g.title}
                        </p>
                      </div>

                      {/* Detail description */}
                      <div style={{ padding: "16px 24px 8px 24px" }}>
                        <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
                          {g.description}
                        </p>
                      </div>

                      {/* Significance */}
                      {g.significance && (
                        <div style={{ padding: "0 24px 8px 24px", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)", fontStyle: "italic" }}>
                          {g.significance}
                        </div>
                      )}

                      {/* Quote block */}
                      {g.quote && (
                        <div
                          style={{
                            background: "color-mix(in srgb, var(--accent-bio) 6%, transparent)",
                            borderLeft: "3px solid var(--accent-bio)",
                            margin: "8px 24px 16px",
                            padding: "12px 16px",
                          }}
                        >
                          <p style={{ fontFamily: "var(--font-display)", fontSize: 15, fontStyle: "italic", color: "var(--text-primary)", margin: 0, fontWeight: 300, lineHeight: 1.5 }}>
                            "{g.quote}"
                          </p>
                        </div>
                      )}

                      {/* Personal comparison */}
                      {g.comparison && (
                        <div style={{ padding: "8px 24px 20px", borderTop: "1px solid var(--border-subtle)", background: "var(--bg-surface)" }}>
                          <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-bio)", letterSpacing: "0.05em" }}>
                            VS. YOU:
                          </span>{" "}
                          <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>
                            {g.comparison}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Overall insight */}
              {parsed.overallInsight && (
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    padding: "24px 32px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-bio)", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                    ✦ THE PATTERN
                  </span>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontStyle: "italic", color: "var(--text-primary)", margin: 0, fontWeight: 300, lineHeight: 1.6 }}>
                    {parsed.overallInsight}
                  </p>
                  {parsed.encouragement && (
                    <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", fontStyle: "italic", marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>
                      {parsed.encouragement}
                    </p>
                  )}
                </div>
              )}

              {/* Reset button */}
              <button
                onClick={reset}
                style={{
                  width: "100%",
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
                Compare Another Age
              </button>
            </div>
          </AIResultReveal>
        ) : null
      }
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "15vh",
          background: "var(--bg-base)",
          overflow: "hidden",
        }}
      >
        {/* ─── Dot Grid Background ─── */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle, var(--accent-bio) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.08,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {isLoading && <AILoadingShimmer message="Syncing timelines with history's minds..." />}
        {error && <AIErrorState message={error} onRetry={handleCompare} />}
      </div>

      <FloatingPanel id="gm-controls" title="GENIUS SYNC" defaultPosition="top-right">
        <PanelDisplay
          label="YOUR COMPARED AGE"
          value={`${exactAge.toFixed(2)} yrs`}
        />
        <PanelDisplay
          label="YEAR OF BIRTH"
          value={birthYear}
        />
      </FloatingPanel>
    </RealmLayout>
  );
}
