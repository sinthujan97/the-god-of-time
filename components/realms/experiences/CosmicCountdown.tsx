"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelToggle, PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "cosmic-countdown")!;

// ─── Events ───────────────────────────────────────────────────────────────────
const COSMIC_EVENTS = [
  { id: "andromeda", name: "Andromeda Collision", yearsFromNow: 4.5e9, description: "The Andromeda galaxy — 2.5 million light-years away — is on a direct collision course with the Milky Way. The two galaxies will merge over billions of years, their stars passing through each other like ghosts. The night sky will be unrecognizable.", category: "galactic", color: "#7B61FF", icon: "🌌" },
  { id: "sun-death", name: "Sun Becomes Red Giant", yearsFromNow: 5.0e9, description: "Our star exhausts its hydrogen fuel and expands to engulf Mercury, Venus, and possibly Earth. The inner solar system is incinerated. Human civilization, if it exists, will have had 5 billion years to find a new home.", category: "solar", color: "#FDB813", icon: "☀" },
  { id: "moon-drift", name: "Moon Reaches Roche Limit", yearsFromNow: 6.5e10, description: "Tidal friction continues pushing the Moon away from Earth at 3.8cm per year. Gravitational forces will eventually tear it apart, creating a ring system around a dead Earth orbiting a white dwarf star.", category: "solar", color: "#A0A0A0", icon: "◑" },
  { id: "last-star", name: "Last Star Burns Out", yearsFromNow: 1.0e14, description: "The final red dwarf star exhausts its fuel. After this point no new light will ever be generated in the universe. An era of total darkness begins — the Degenerate Era — where only black holes and cold stellar remnants remain.", category: "stellar", color: "#E87C7C", icon: "✦" },
  { id: "black-hole-evap", name: "Last Black Hole Evaporates", yearsFromNow: 1.0e100, description: "Through Hawking radiation, the final supermassive black hole slowly radiates away into nothing. After this moment, only low-energy photons and leptons exist, spread across infinite space.", category: "black-hole", color: "#4B8EF1", icon: "●" },
  { id: "heat-death", name: "Heat Death of the Universe", yearsFromNow: 1.0e100, description: "Maximum entropy is reached across the entire universe. No more energy can flow from one place to another. No work can be done. The universe reaches a state of perfect, eternal stillness.", category: "universe", color: "#3ABFBF", icon: "∞" },
];

const UNIVERSE_AGE_YEARS = 13.8e9;
const SEC_PER_YEAR = 365.25 * 24 * 3600;

function formatCountdown(yearsFromNow: number) {
  if (yearsFromNow >= 1e12) {
    const exp = Math.floor(Math.log10(yearsFromNow));
    const base = (yearsFromNow / Math.pow(10, exp)).toFixed(1);
    return `${base} × 10^${exp} YEARS`;
  }
  return `${yearsFromNow.toLocaleString(undefined, { maximumFractionDigits: 0 })} YEARS`;
}

function formatSciSeconds(seconds: number) {
  const exp = Math.floor(Math.log10(seconds));
  const base = (seconds / Math.pow(10, exp)).toFixed(2);
  return `${base} × 10^${exp}`;
}

// ─── Starfield canvas background ──────────────────────────────────────────────
function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const starsRef = useRef<{ x: number; y: number; r: number; vx: number }[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    starsRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.4 + Math.random() * 0.8,
      vx: 0.02 + Math.random() * 0.04
    }));
  }, []));

  useEffect(() => {
    const reduced = prefersReducedMotion();

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const { w, h } = sizeRef.current;

      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const isDark = !document.documentElement.classList.contains("light");
      ctx.clearRect(0, 0, w, h);
      starsRef.current.forEach(s => {
        if (!reduced) {
          s.x -= s.vx;
          if (s.x < 0) s.x = w;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.18)" : "rgba(26,26,46,0.07)";
        ctx.fill();
      });
      if (!reduced) rafRef.current = requestAnimationFrame(render);
      else rafRef.current = null;
    };
    render();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, width: "100%", height: "100%" }} />;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CosmicCountdown() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [bigBangSeconds, setBigBangSeconds] = useState(UNIVERSE_AGE_YEARS * SEC_PER_YEAR);
  const [showSciNotation, setShowSciNotation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setBigBangSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "60vh", background: "var(--bg-base)" }}>
        {/* Stars Canvas stays fixed in background */}
        <StarfieldBg />

        {/* DOM content inside experience container */}
        <div style={{ position: "relative", zIndex: 1, padding: "24px 16px" }}>
          {/* Cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {COSMIC_EVENTS.map(ev => {
              const isExpanded = expanded === ev.id;
              const percent = ((UNIVERSE_AGE_YEARS / (ev.yearsFromNow + UNIVERSE_AGE_YEARS)) * 100).toFixed(8);

              return (
                <div
                  key={ev.id}
                  onClick={() => setExpanded(isExpanded ? null : ev.id)}
                  style={{
                    background: "color-mix(in srgb, var(--bg-card) 88%, transparent)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${ev.color}`,
                    borderRadius: 10,
                    padding: 20,
                    cursor: "pointer",
                    transition: "transform 200ms, border-left-width 200ms",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)"; }}
                >
                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 22, color: ev.color }}>{ev.icon}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "var(--text-primary)" }}>{ev.name}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.1em" }}>{ev.category}</span>
                  </div>

                  {/* Countdown */}
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ev.yearsFromNow >= 1e12 ? 18 : 24, color: ev.color, marginBottom: 10, lineHeight: 1.3 }}>
                    {showSciNotation || ev.yearsFromNow >= 1e12 ? formatCountdown(ev.yearsFromNow) : `${formatCountdown(ev.yearsFromNow)} REMAINING`}
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ height: 3, background: "var(--border)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                      <div style={{ height: "100%", width: `${Math.min(parseFloat(percent) * 1e8, 100)}%`, background: ev.color, borderRadius: 2 }} />
                    </div>
                    <p style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>
                      Universe is {(UNIVERSE_AGE_YEARS / ev.yearsFromNow * 100).toExponential(3)}% of the way to this event
                    </p>
                  </div>

                  {/* Expanded description */}
                  {isExpanded && (
                    <div style={{ marginTop: 16, borderTop: "1px solid var(--border-subtle)", paddingTop: 16 }}>
                      <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7 }}>{ev.description}</p>
                      <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                        <div>
                          <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, textTransform: "uppercase", color: "var(--text-faint)" }}>Current universe age</span>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>13.8 billion years</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <FloatingPanel id="cosmic-controls" title="TIMELINE" defaultPosition="bottom-right">
        <PanelDisplay label="UNIVERSE AGE" value="13,800,000,000 yrs" />
        <PanelDisplay label="SECONDS SINCE BIG BANG" value={formatSciSeconds(bigBangSeconds)} />
        <PanelToggle label="Show Sci. Notation" value={showSciNotation} onChange={setShowSciNotation} />
      </FloatingPanel>
    </RealmLayout>
  );
}
