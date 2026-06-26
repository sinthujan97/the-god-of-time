"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

type Star = { x: number; y: number; r: number; alpha: number; flash: boolean };

const QUOTES = [
  "The universe will end in cold, silent darkness.",
  "Space is expanding, pulling the stars forever out of reach.",
  "You are a brief, flickering spark between two infinities of darkness.",
  "The black holes will inherit the cosmos.",
  "All atoms will eventually decay into nothingness.",
  "Time does not build. It merely sweeps away.",
];

const realm = realmsRegistry.find((r) => r.slug === "cosmic-horror")!;

export default function CosmicHorror() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeActive, setFadeActive] = useState(true);

  // Live ticking countdown metrics (in years remaining)
  const [sunLifeYears, setSunLifeYears] = useState(5000000000);
  const [andromedaCollisionYears, setAndromedaCollisionYears] = useState(4500000000);
  const [heatDeathString, setHeatDeathString] = useState("");

  const starsRef = useRef<Star[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  // Shift quotes
  useEffect(() => {
    const timer = setInterval(() => {
      setFadeActive(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
        setFadeActive(true);
      }, 1000);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Update doomsday clocks
  useEffect(() => {
    const interval = setInterval(() => {
      setSunLifeYears((prev) => prev - 0.00000001);
      setAndromedaCollisionYears((prev) => prev - 0.00000001);

      const exponent = 100;
      const baseNum = 1.0 - Math.random() * 1e-12;
      setHeatDeathString(`${baseNum.toFixed(12)}e+${exponent}`);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Hook canvas wrapper resizing
  useCanvasSize(
    canvasRef,
    useCallback((w: number, h: number) => {
      sizeRef.current = { w, h };
      // Regenerate stars on resize
      const list: Star[] = [];
      for (let i = 0; i < 40; i++) {
        list.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.5 + Math.random() * 1.0,
          alpha: Math.random(),
          flash: false,
        });
      }
      starsRef.current = list;
    }, [])
  );

  // Star flashing and background render
  const drawBackground = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(drawBackground);
      return;
    }

    // Pitch black background
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    // Draw starlight flashes
    const reduced = prefersReducedMotion();
    starsRef.current.forEach((s) => {
      if (!reduced) {
        if (Math.random() < 0.005) {
          s.flash = true;
        }

        if (s.flash) {
          s.alpha += 0.05;
          if (s.alpha >= 1.0) {
            s.flash = false;
          }
        } else {
          s.alpha -= 0.01;
          if (s.alpha < 0.05) s.alpha = 0.05;
        }
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.flash ? s.r * 2.5 : s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
      ctx.fill();

      // Draw faint crosshair lines for flashing stars
      if (s.flash) {
        ctx.beginPath();
        ctx.moveTo(s.x - 6, s.y);
        ctx.lineTo(s.x + 6, s.y);
        ctx.moveTo(s.x, s.y - 6);
        ctx.lineTo(s.x, s.y + 6);
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.alpha * 0.4})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });

    rafRef.current = requestAnimationFrame(drawBackground);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawBackground);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawBackground]);

  const resultsZone = (
    <div style={{ display: "flex", flexDirection: "column", gap: 40, width: "100%" }}>
      {/* Event 1 */}
      <div style={{ borderBottom: "1px solid rgba(255, 50, 50, 0.2)", paddingBottom: 24 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#ff3333",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8
          }}
        >
          ✦ EVENT: SOLAR CORE COLLAPSE (RED GIANT TRANSITION)
        </span>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(26px, 5vw, 36px)",
            color: "#ff3333",
            margin: 0,
            fontWeight: 300,
            letterSpacing: "-0.02em"
          }}
        >
          {sunLifeYears.toFixed(8)}
        </h2>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4, display: "block" }}>
          Estimated Earth Years Remaining
        </span>
      </div>

      {/* Event 2 */}
      <div style={{ borderBottom: "1px solid rgba(255, 50, 50, 0.2)", paddingBottom: 24 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#ff3333",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8
          }}
        >
          ✦ EVENT: GALACTIC COLLISION (ANDROMEDA IMPACT)
        </span>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(26px, 5vw, 36px)",
            color: "#ff3333",
            margin: 0,
            fontWeight: 300,
            letterSpacing: "-0.02em"
          }}
        >
          {andromedaCollisionYears.toFixed(8)}
        </h2>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4, display: "block" }}>
          Estimated Earth Years Remaining
        </span>
      </div>

      {/* Event 3 */}
      <div style={{ borderBottom: "1px solid rgba(255, 50, 50, 0.2)", paddingBottom: 24 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "#ff3333",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8
          }}
        >
          ✦ EVENT: THERMODYNAMIC EQUILIBRIUM (HEAT DEATH)
        </span>
        <h2
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(24px, 5vw, 34px)",
            color: "#ff3333",
            margin: 0,
            fontWeight: 300,
            letterSpacing: "-0.02em"
          }}
        >
          {heatDeathString || "1.000000000000e+100"}
        </h2>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 4, display: "block" }}>
          Estimated Universe Years Remaining
        </span>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} hasInputZone={false} resultsZone={resultsZone}>
      <div style={{ position: "relative", width: "100%", height: "450px", background: "#000000", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        {/* Creepy existential quote overlay */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            width: "90%",
            maxWidth: 500,
            textAlign: "center",
            opacity: fadeActive ? 0.8 : 0.0,
            transition: "opacity 1000ms ease",
            pointerEvents: "none"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(16px, 4vw, 22px)",
              color: "#ffffff",
              fontStyle: "italic",
              textShadow: "0 0 10px rgba(0,0,0,0.9)",
              letterSpacing: "0.03em"
            }}
          >
            &ldquo;{QUOTES[quoteIndex]}&rdquo;
          </span>
        </div>
      </div>
    </RealmLayout>
  );
}
