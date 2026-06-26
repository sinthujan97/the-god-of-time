"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "cosmic-personal-stats")!;

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

export default function CosmicPersonalStats() {
  const [birthdate, setBirthdate] = useState("");
  const [birthDateObj, setBirthDateObj] = useState<Date | null>(null);

  // Live ticking counters
  const [ticks, setTicks] = useState({
    heartbeats: 0,
    breaths: 0,
    dreams: 0,
    bloodCells: 0,
    earthRotationKm: 0,
    earthOrbitKm: 0,
    solarOrbitKm: 0,
    milkyWayKm: 0,
    supernovas: 0,
    universeExpansionKm: 0,
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthdate) {
      setBirthDateObj(new Date(birthdate));
    }
  };

  const handleReset = () => {
    setBirthDateObj(null);
    setBirthdate("");
  };

  useEffect(() => {
    if (!birthDateObj) return;

    const interval = setInterval(() => {
      const msAlive = Date.now() - birthDateObj.getTime();
      const secAlive = msAlive / 1000;
      const minAlive = secAlive / 60;
      const hoursAlive = minAlive / 60;
      const daysAlive = hoursAlive / 24;

      // Stats calculations based on scientific averages
      setTicks({
        heartbeats: Math.floor(minAlive * 75), // avg 75 bpm
        breaths: Math.floor(minAlive * 15),     // avg 15 breaths per minute
        dreams: Math.floor(daysAlive * 4),      // avg 4 dreams per night
        bloodCells: Math.floor(secAlive * 2.4e6), // 2.4 million RBCs recycled per second
        earthRotationKm: secAlive * 0.35,      // avg rotational speed component
        earthOrbitKm: secAlive * 29.78,        // Earth orbital speed (29.78 km/s)
        solarOrbitKm: secAlive * 230,          // Sun speed around Milky Way barycenter (230 km/s)
        milkyWayKm: secAlive * 370,            // Milky Way speed relative to CMB (370 km/s)
        supernovas: Math.floor(secAlive * 30),  // ~30 supernovas in observable universe per second
        universeExpansionKm: secAlive * 299792.458, // Universe radius expands at speed of light
      });
    }, 200);

    return () => clearInterval(interval);
  }, [birthDateObj]);

  const planetYears = (days: number) => {
    if (!birthDateObj) return "0.00";
    const ms = Date.now() - birthDateObj.getTime();
    const EarthDays = ms / 86400000;
    return (EarthDays / days).toFixed(2);
  };

  const getDaysAlive = () => {
    if (!birthDateObj) return 0;
    return Math.floor((Date.now() - birthDateObj.getTime()) / 86400000);
  };

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        !birthDateObj ? (
          <form
            onSubmit={handleCalculate}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              maxWidth: 480,
              width: "100%",
              margin: "0 auto",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>
                SELECT YOUR BIRTHDATE
              </label>
              <input
                type="date"
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
            <button
              type="submit"
              disabled={!birthdate}
              style={{
                height: 48,
                borderRadius: 8,
                background: birthdate ? "var(--accent-cosmos)" : "var(--border)",
                border: "none",
                color: birthdate ? "#ffffff" : "var(--text-faint)",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 600,
                cursor: birthdate ? "pointer" : "not-allowed",
                textTransform: "uppercase",
                transition: "all 150ms"
              }}
            >
              Analyze Coordinates
            </button>
          </form>
        ) : null
      }
      resultsZone={
        birthDateObj ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
            {/* Row 1: Biological Tickers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
              <div style={{ background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 24 }}>🫀</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", margin: "12px 0 4px" }}>Heartbeats Expended</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-primary)", fontWeight: "bold" }}>{ticks.heartbeats.toLocaleString()}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", marginTop: 4 }}>Based on 75bpm average</div>
              </div>
              <div style={{ background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 24 }}>🫁</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", margin: "12px 0 4px" }}>Breaths Taken</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-primary)", fontWeight: "bold" }}>{ticks.breaths.toLocaleString()}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", marginTop: 4 }}>Based on 15 breaths/min</div>
              </div>
              <div style={{ background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 24 }}>🧠</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", margin: "12px 0 4px" }}>Dreamscapes Experienced</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-primary)", fontWeight: "bold" }}>{ticks.dreams.toLocaleString()}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", marginTop: 4 }}>Based on 4 dreams/night</div>
              </div>
            </div>

            {/* Row 2: Space Odyssey Velocities */}
            <div style={{ background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: 12, padding: 28, boxShadow: "0 6px 25px rgba(0,0,0,0.2)" }}>
              <h3 style={{ margin: "0 0 16px 0", fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", fontWeight: 400 }}>
                Cumulative Celestial Distance Traveled
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>
                    <span>EARTH AXIS ROTATION</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{ticks.earthRotationKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km</span>
                  </div>
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: "100%", width: "25%", background: "var(--accent-bio)", borderRadius: 2 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>
                    <span>SOLAR SYSTEM ORBIT</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{ticks.earthOrbitKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km</span>
                  </div>
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: "100%", width: "50%", background: "var(--accent-cosmos)", borderRadius: 2 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>
                    <span>GALACTIC ORBIT SPEED</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>{ticks.solarOrbitKm.toLocaleString(undefined, { maximumFractionDigits: 1 })} km</span>
                  </div>
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: "100%", width: "75%", background: "var(--accent-scifi)", borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 3: Deep Time & Cosmic Expansion */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
              <div style={{ background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 24 }}>✨</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", margin: "12px 0 4px" }}>Universe Expanded Since Birth</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-primary)", fontWeight: "bold" }}>{ticks.universeExpansionKm.toExponential(4)} km</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", marginTop: 4 }}>Estimated expansion volume rate</div>
              </div>

              <div style={{ background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                <span style={{ fontSize: 24 }}>💥</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", margin: "12px 0 4px" }}>Observable Supernovas Exploded</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-primary)", fontWeight: "bold" }}>{ticks.supernovas.toLocaleString()}</div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", marginTop: 4 }}>Based on ~30 stellar collapses per second</div>
              </div>
            </div>

            {/* Restart Button */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={handleReset}
                style={{
                  height: 48,
                  padding: "0 30px",
                  borderRadius: 8,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  textTransform: "uppercase"
                }}
              >
                Reset Coordinates
              </button>
            </div>
          </div>
        ) : null
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "40vh", background: "var(--bg-base)" }}>
        <StarfieldBg />
      </div>

      {birthDateObj && (
        <FloatingPanel id="cosmic-stats-panel" title="TEMPORAL REGISTRY" defaultPosition="top-right">
          <PanelDisplay label="EARTH DAYS ALIVE" value={getDaysAlive().toLocaleString()} />
          <PanelDisplay label="MERCURIAN YEARS" value={planetYears(87.97)} />
          <PanelDisplay label="VENUSIAN YEARS" value={planetYears(224.7)} />
          <PanelDisplay label="MARTIAN YEARS" value={planetYears(686.97)} />
          <PanelDisplay label="JOVIAN YEARS" value={planetYears(4332.59)} />
          <PanelDisplay label="PLUTONIAN YEARS" value={planetYears(90560.0)} />
        </FloatingPanel>
      )}
    </RealmLayout>
  );
}
