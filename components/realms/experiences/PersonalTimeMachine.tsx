"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { callRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "personal-time-machine")!;

export default function PersonalTimeMachine() {
  const [birthdate, setBirthdate] = useState("");
  const [passion, setPassion] = useState("");
  const [location, setLocation] = useState("");
  const [totalAlignments, setTotalAlignments] = useState(0);

  // AI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Canvas visualizer states
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const angleRef = useRef(0);

  useCanvasSize(
    canvasRef,
    useCallback((w: number, h: number) => {
      sizeRef.current = { w, h };
    }, [])
  );

  const drawScanner = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(drawScanner);
      return;
    }

    const isDark = !document.documentElement.classList.contains("light");
    ctx.clearRect(0, 0, w, h);

    // Draw grid background
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)";
    ctx.lineWidth = 1;
    const gridSize = 40;
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

    // Draw radar circles in center
    const cx = w / 2;
    const cy = h / 2;
    const maxRadius = Math.min(w, h) * 0.4;

    ctx.strokeStyle = isDark ? "rgba(0, 238, 255, 0.15)" : "rgba(0, 150, 200, 0.1)";
    for (let r = maxRadius * 0.25; r <= maxRadius; r += maxRadius * 0.25) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw rotating sweep line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const sweepX = cx + Math.cos(angleRef.current) * maxRadius;
    const sweepY = cy + Math.sin(angleRef.current) * maxRadius;
    ctx.lineTo(sweepX, sweepY);
    ctx.strokeStyle = isDark ? "rgba(0, 238, 255, 0.4)" : "rgba(0, 150, 200, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Increment rotation angle (spin faster when loading)
    const speed = isLoading ? 0.08 : 0.015;
    angleRef.current += speed;

    rafRef.current = requestAnimationFrame(drawScanner);
  }, [isLoading]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawScanner);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawScanner]);

  const handleAlignTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthdate || !passion.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    const systemPrompt = `You are a chronological alignment poet and historian. Given a birthdate, current location, and core passion, you map their lifetime milestones side-by-side with major scientific/cultural history, and then summarize their timeline in a customized 4-line rhyming poem.

Structure your response EXACTLY as follows with these exact headers:

MILESTONE 1: [Year — milestone description linking their age to a major world event]
MILESTONE 2: [Year — second milestone description linking their age to a major world event]
MILESTONE 3: [Year — third milestone description linking their age to a major world event]
MILESTONE 4: [Year — fourth milestone description linking their age to a major world event]
POEM:
[Custom 4-line rhyming poem explaining their place in space-time]

Keep under 250 words total. Make it feel personal, epic, and cinematic.`;

    const userPrompt = `Calculate the spacetime alignment for:
Birthdate: ${birthdate}
Location: ${location || "Earth"}
Core Passion: ${passion}

Map my timeline milestones and write my 4-line spacetime poem.`;

    try {
      const { content, error: apiError } = await callRealmAI({
        systemPrompt,
        userPrompt,
        maxTokens: 1000,
      });

      if (apiError) {
        setError(apiError);
      } else {
        setResult(content);
        setTotalAlignments((prev) => prev + 1);
      }
    } catch (err) {
      setError("The timeline is unclear. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseResult = (text: string) => {
    const getSection = (header: string) => {
      const regex = new RegExp(
        `${header}\\s*:\\s*([\\s\\S]*?)(?=\\n(?:MILESTONE 1|MILESTONE 2|MILESTONE 3|MILESTONE 4|POEM)\\s*:|$)`,
        "i"
      );
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    const poemRegex = /POEM\s*:\s*([\s\S]*)$/i;
    const poemMatch = text.match(poemRegex);
    const poem = poemMatch ? poemMatch[1].trim() : "";

    return {
      m1: getSection("MILESTONE 1"),
      m2: getSection("MILESTONE 2"),
      m3: getSection("MILESTONE 3"),
      m4: getSection("MILESTONE 4"),
      poem,
    };
  };

  const parsed = result ? parseResult(result) : null;

  const inputZone = !result && !isLoading && !error ? (
    <form
      onSubmit={handleAlignTimeline}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
      }}
    >
      {/* Birthdate */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
          YOUR DATE OF BIRTH (REQUIRED)
        </label>
        <input
          type="date"
          required
          value={birthdate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setBirthdate(e.target.value)}
          style={{
            height: 48,
            padding: "0 16px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            color: "var(--text-primary)",
            cursor: "pointer",
            outline: "none"
          }}
        />
      </div>

      {/* Passion */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
          WHAT IS YOUR CORE PASSION OR PROFESSION? (REQUIRED)
        </label>
        <input
          type="text"
          required
          value={passion}
          onChange={(e) => setPassion(e.target.value)}
          placeholder="e.g. painting, coding, teaching, philosophy, stargazing..."
          style={{
            height: 48,
            padding: "0 16px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "var(--font-ui)",
            color: "var(--text-primary)",
            outline: "none"
          }}
        />
      </div>

      {/* Location */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.05em" }}>
          CURRENT LOCATION (OPTIONAL)
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. London, Tokyo, San Francisco, Earth..."
          style={{
            height: 48,
            padding: "0 16px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "var(--font-ui)",
            color: "var(--text-primary)",
            outline: "none"
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!birthdate || !passion.trim()}
        style={{
          height: 52,
          borderRadius: 8,
          background: birthdate && passion.trim() ? "var(--accent-cosmos)" : "var(--border)",
          border: "none",
          color: birthdate && passion.trim() ? "#ffffff" : "var(--text-faint)",
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          fontWeight: 600,
          cursor: birthdate && passion.trim() ? "pointer" : "not-allowed",
          textTransform: "uppercase",
          transition: "all 200ms",
          marginTop: 10
        }}
      >
        Align Spacetime Timeline
      </button>
    </form>
  ) : null;

  const resultsZone = result && parsed && !isLoading && !error ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)"
        }}
      >
        {/* Header Hero banner */}
        <div
          style={{
            background: "linear-gradient(135deg, #1C2833 0%, #34495E 100%)",
            padding: "36px 32px",
            color: "#ffffff",
            boxShadow: "inset 0 -20px 40px rgba(0,0,0,0.5)"
          }}
        >
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.7)" }}>
            TIMELINE SYNC COMPLETE
          </span>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 300, margin: "6px 0 0 0" }}>
            Chronal Alignment Profile
          </h3>
        </div>

        {/* Milestones list */}
        <div style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24, borderBottom: "1px solid var(--border-subtle)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-cosmos)", letterSpacing: "0.08em", display: "block" }}>
            HISTORICAL LIFEPATH MILESTONES
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[parsed.m1, parsed.m2, parsed.m3, parsed.m4].map((milestone, idx) => {
              if (!milestone) return null;
              return (
                <div key={idx} style={{ display: "flex", gap: 12 }}>
                  <span style={{ color: "var(--accent-cosmos)", fontSize: 16, flexShrink: 0 }}>✦</span>
                  <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.6 }}>
                    {milestone}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Spacetime Poem card */}
        {parsed.poem && (
          <div style={{ padding: "32px", background: "rgba(255,255,255,0.02)", textAlign: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>
              ✦ Spacetime Summary Poem
            </span>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                fontStyle: "italic",
                color: "var(--text-primary)",
                lineHeight: 1.8,
                margin: 0,
                fontWeight: 300,
                whiteSpace: "pre-line"
              }}
            >
              {parsed.poem}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => {
            setResult(null);
            setBirthdate("");
            setPassion("");
            setLocation("");
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
            cursor: "pointer"
          }}
        >
          Reset Machine
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(result || "");
            alert("Timeline logs copied!");
          }}
          style={{
            flex: 1,
            height: 48,
            borderRadius: 8,
            background: "var(--accent-cosmos)",
            border: "none",
            color: "#ffffff",
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Log Alignment Data
        </button>
      </div>
    </div>
  ) : null;

  return (
    <RealmLayout realm={realm} hasInputZone={!result && !isLoading && !error} inputZone={inputZone} resultsZone={resultsZone}>
      <div style={{ position: "relative", width: "100%", height: "300px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        {/* Canvas Scanner background */}
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        {/* Loading overlay inside canvas zone */}
        {isLoading && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ maxWidth: 500, width: "100%" }}>
              <AILoadingShimmer message="Synthesizing chronological alignments..." />
            </div>
          </div>
        )}

        {/* Error overlay inside canvas zone */}
        {error && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "var(--bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <AIErrorState
              message={error}
              onRetry={() => {
                setError(null);
                handleAlignTimeline({ preventDefault: () => {} } as React.FormEvent);
              }}
            />
          </div>
        )}
      </div>

      {/* Floating Diagnostics Panel */}
      {result && (
        <FloatingPanel id="tm-diagnostics" title="CHRONAL PROFILE" defaultPosition="top-right">
          <PanelDisplay label="ALIGNMENTS RUN" value={totalAlignments} />
          <PanelDisplay label="PASSION LOCK" value={passion.toUpperCase()} />
        </FloatingPanel>
      )}
    </RealmLayout>
  );
}
