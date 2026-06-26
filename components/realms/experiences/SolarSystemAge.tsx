"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelSlider, PanelToggle, PanelDisplay, PanelDivider } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion, getCSSVar } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "solar-system-age")!;

// ─── Planet Data ──────────────────────────────────────────────────────────────
const PLANETS = [
  { name: "Mercury", orbitalPeriodDays: 87.97,    color: "#A0A0A0", radius: 4,  orbitRadius: 72,  icon: "☿", isDwarfPlanet: false },
  { name: "Venus",   orbitalPeriodDays: 224.7,    color: "#E8C080", radius: 6,  orbitRadius: 108, icon: "♀", isDwarfPlanet: false },
  { name: "Earth",   orbitalPeriodDays: 365.25,   color: "#4B8EF1", radius: 6,  orbitRadius: 148, icon: "♁", isDwarfPlanet: false },
  { name: "Mars",    orbitalPeriodDays: 686.97,   color: "#C1440E", radius: 5,  orbitRadius: 193, icon: "♂", isDwarfPlanet: false },
  { name: "Jupiter", orbitalPeriodDays: 4332.59,  color: "#C88B3A", radius: 14, orbitRadius: 250, icon: "♃", isDwarfPlanet: false },
  { name: "Saturn",  orbitalPeriodDays: 10759.22, color: "#E4D191", radius: 12, orbitRadius: 303, icon: "♄", isDwarfPlanet: false },
  { name: "Uranus",  orbitalPeriodDays: 30688.5,  color: "#7DE8E8", radius: 9,  orbitRadius: 350, icon: "♅", isDwarfPlanet: false },
  { name: "Neptune", orbitalPeriodDays: 60182.0,  color: "#4060FF", radius: 8,  orbitRadius: 392, icon: "♆", isDwarfPlanet: false },
  { name: "Pluto",   orbitalPeriodDays: 90560.0,  color: "#A0907A", radius: 3,  orbitRadius: 428, icon: "♇", isDwarfPlanet: true  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcPlanetaryAge(birthDate: Date, planet: typeof PLANETS[0]) {
  const msAlive = Date.now() - birthDate.getTime();
  const daysAlive = msAlive / 86400000;
  const age = daysAlive / planet.orbitalPeriodDays;
  const orbitsCompleted = Math.floor(age);
  const fractional = age - orbitsCompleted;
  const daysUntilNext = (1 - fractional) * planet.orbitalPeriodDays;
  return {
    age, ageFormatted: age.toFixed(4),
    nextBirthdayDays: Math.round(daysUntilNext),
    orbitsCompleted,
    currentOrbitalAngle: fractional * Math.PI * 2,
    earthDaysAlive: daysAlive,
  };
}

function unitName(planet: typeof PLANETS[0]) {
  const map: Record<string, string> = {
    Mercury: "MERCURIAN YEARS", Venus: "VENUSIAN YEARS", Earth: "EARTH YEARS",
    Mars: "MARTIAN YEARS", Jupiter: "JOVIAN YEARS", Saturn: "SATURNIAN YEARS",
    Uranus: "URANIAN YEARS", Neptune: "NEPTUNIAN YEARS", Pluto: "PLUTONIAN YEARS",
  };
  return map[planet.name] ?? "YEARS";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SolarSystemAge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<(ts: number) => void>(() => {});
  const sizeRef = useRef({ w: 0, h: 0 });
  const timeRef = useRef(0);
  const orbitSpeedRef = useRef(1);
  const reducedRef = useRef(false);

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPluto, setShowPluto] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [daysAlive, setDaysAlive] = useState(0);
  const [planetData, setPlanetData] = useState<ReturnType<typeof calcPlanetaryAge>[]>([]);
  const [distanceTraveled, setDistanceTraveled] = useState("0.00e0");

  const showOrbitsRef = useRef(true);
  const showPlutoRef = useRef(true);

  // Sync refs to avoid re-triggering canvas updates
  useEffect(() => {
    showOrbitsRef.current = showOrbits;
  }, [showOrbits]);

  useEffect(() => {
    showPlutoRef.current = showPluto;
  }, [showPluto]);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
  }, []));

  const render = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    const reduced = reducedRef.current;

    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(renderRef.current);
      return;
    }

    if (!reduced) timeRef.current = ts * 0.00005 * orbitSpeedRef.current;

    const cx = w / 2;
    const cy = h / 2;

    const isDark = !document.documentElement.classList.contains("light");

    ctx.fillStyle = getCSSVar("--bg-base") || "#06060A";
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.save();
    for (let i = 0; i < 80; i++) {
      const sx = ((i * 137.5) % w);
      const sy = ((i * 97.3) % h);
      ctx.beginPath();
      ctx.arc(sx, sy, 0.5, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(255,255,255,0.18)" : "rgba(26,26,46,0.07)";
      ctx.fill();
    }
    ctx.restore();

    // Sun pulse
    const pulse = Math.sin(ts * 0.001) * 2;
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32 + pulse);
    sunGrad.addColorStop(0, "#FFF5C0");
    sunGrad.addColorStop(0.3, "#FDB813");
    sunGrad.addColorStop(0.7, "#E87020");
    sunGrad.addColorStop(1, "rgba(253,184,19,0)");
    ctx.beginPath();
    ctx.arc(cx, cy, 32 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    const visiblePlanets = showPlutoRef.current ? PLANETS : PLANETS.slice(0, 8);

    visiblePlanets.forEach((planet, idx) => {
      // Scale orbits so they fit within the 60vh container nicely
      const minDimension = Math.min(w, h);
      const scale = (minDimension / 950) * 0.95;
      const orbitRad = planet.orbitRadius * scale;

      // Draw Orbit Path
      if (showOrbitsRef.current) {
        ctx.beginPath();
        ctx.arc(cx, cy, orbitRad, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(26,26,46,0.03)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Orbit math
      const baseSpeed = 1 / (planet.orbitalPeriodDays / 365.25);
      const angle = timeRef.current * baseSpeed;

      const px = cx + Math.cos(angle) * orbitRad;
      const py = cy + Math.sin(angle) * orbitRad;

      // Orbit label
      ctx.font = "9px var(--font-mono)";
      ctx.fillStyle = "var(--text-faint)";
      ctx.textAlign = "center";
      if (showOrbitsRef.current && orbitRad > 40) {
        ctx.fillText(planet.name.toUpperCase(), cx, cy - orbitRad - 4);
      }

      // Planet body
      ctx.beginPath();
      ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();

      // Shadow overlay on planet (simple dark crescent phase)
      ctx.beginPath();
      ctx.arc(px, py, planet.radius, angle - Math.PI / 2, angle + Math.PI / 2);
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.fill();

      // Glow on active/hovered state simulation if birthday completes
      if (birthDate) {
        const birthdayPulse = Math.sin(ts * 0.005 + idx) * 3;
        ctx.beginPath();
        ctx.arc(px, py, planet.radius + 3 + birthdayPulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${hexToRgb(planet.color)}, 0.15)`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    rafRef.current = requestAnimationFrame(renderRef.current);
  }, [birthDate]);

  useEffect(() => {
    renderRef.current = render;
    reducedRef.current = prefersReducedMotion();
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  // Recalculate planet data when birth date changes
  useEffect(() => {
    if (!birthDate) return;
    const update = () => {
      const data = PLANETS.map(p => calcPlanetaryAge(birthDate, p));
      setPlanetData(data);
      setDaysAlive(Math.floor(data[2].earthDaysAlive));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [birthDate]);

  // Real-time live scientific notation space travel counter
  useEffect(() => {
    if (!birthDate) return;
    const interval = setInterval(() => {
      const secAlive = (Date.now() - birthDate.getTime()) / 1000;
      const kmTraveled = secAlive * 29.78;
      setDistanceTraveled(kmTraveled.toExponential(4));
    }, 100);
    return () => clearInterval(interval);
  }, [birthDate]);

  const visiblePlanets = showPluto ? PLANETS : PLANETS.slice(0, 8);

  const upcomingBirthdays = birthDate && planetData.length > 0
    ? PLANETS
        .map((p, idx) => ({ planet: p, data: planetData[idx] }))
        .filter(item => item.data && item.data.nextBirthdayDays <= 30)
    : [];

  const hexToRgb = (hex: string): string => {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            Enter your birthdate to see your age across the solar system
          </p>
          <input
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={birthDate ? birthDate.toISOString().slice(0, 10) : ""}
            onChange={e => setBirthDate(e.target.value ? new Date(e.target.value) : null)}
            style={{
              background: "color-mix(in srgb, var(--bg-card) 90%, transparent)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "8px 16px",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: "var(--text-primary)",
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              outline: "none"
            }}
          />
        </div>
      }
      resultsZone={
        birthDate && planetData.length > 0 ? (
          <div className="solar-results" style={{ display: "flex", flexDirection: "column", gap: 32, width: "100%" }}>
            <style jsx>{`
              .solar-results-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 16px;
                width: 100%;
              }
              .solar-planet-card {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 10px;
                padding: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
              }
              .solar-chart-box {
                background: var(--bg-card);
                border: 1px solid var(--border);
                border-radius: 12px;
                padding: 24px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                width: 100%;
                box-sizing: border-box;
              }
            `}</style>
            
            {/* Comparison Chart */}
            <div className="solar-chart-box">
              <h4 style={{ margin: "0 0 16px 0", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Planetary Age Comparison
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {visiblePlanets.map((p, idx) => {
                  const ageVal = planetData[idx]?.age || 0;
                  const maxAge = Math.max(...planetData.map(d => d?.age || 1));
                  const pct = (ageVal / maxAge) * 100;
                  return (
                    <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontFamily: "var(--font-ui)", color: "var(--text-muted)" }}>
                        <span>{p.name}</span>
                        <span style={{ color: p.color, fontFamily: "var(--font-mono)", fontWeight: 600 }}>{ageVal.toFixed(2)} years</span>
                      </div>
                      <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: p.color,
                            borderRadius: 4,
                            transition: "width 300ms ease"
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Age Cards Grid */}
            <div>
              <h4 style={{ margin: "0 0 16px 0", fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Planetary Age Breakdown
              </h4>
              <div className="solar-results-grid">
                {visiblePlanets.map((planet, i) => (
                  <div key={planet.name} className="solar-planet-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 18, color: planet.color }}>{planet.icon}</span>
                      <span style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{planet.name}</span>
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: "var(--text-primary)", fontWeight: "bold" }}>
                      {planetData[i]?.ageFormatted ?? "—"}
                    </div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", marginTop: 4 }}>
                      {unitName(planet)}
                    </div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>
                      Next Bday: {planetData[i]?.nextBirthdayDays ?? 0} Earth days
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null
      }
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {/* Birthday Alert Banner */}
        {birthDate && upcomingBirthdays.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: 30,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(228, 209, 145, 0.15)",
              border: "1px solid #e4d191",
              borderRadius: 20,
              padding: "8px 20px",
              zIndex: 10,
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "#e4d191",
              backdropFilter: "blur(6px)",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
              animation: "bannerPulse 2s infinite"
            }}
          >
            <style>{`
              @keyframes bannerPulse {
                0%, 100% { border-color: rgba(228, 209, 145, 0.4); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
                50% { border-color: #e4d191; box-shadow: 0 4px 20px rgba(228, 209, 145, 0.25); }
              }
            `}</style>
            🎉 **PLANETARY BIRTHDAY ALERT**: {upcomingBirthdays.map(b => `${b.planet.name} (${b.data.nextBirthdayDays}d)`).join(", ")} approaching!
          </div>
        )}
      </div>

      <FloatingPanel id="solar-controls" title="SOLAR SYSTEM" defaultPosition="top-right">
        <PanelSlider label="Orbit Speed" min={0} max={10} step={0.5} value={orbitSpeed} onChange={v => { setOrbitSpeed(v); orbitSpeedRef.current = v; }} unit="×" />
        <PanelToggle label="Show Pluto" value={showPluto} onChange={v => { setShowPluto(v); showPlutoRef.current = v; }} />
        <PanelToggle label="Show Orbit Paths" value={showOrbits} onChange={v => { setShowOrbits(v); showOrbitsRef.current = v; }} />
        <PanelDivider />
        <PanelDisplay label="EARTH DAYS LIVED" value={birthDate ? daysAlive.toLocaleString() : "—"} large />
        <PanelDisplay label="DISTANCE TRAVELED" value={birthDate ? `${distanceTraveled} km` : "—"} />
      </FloatingPanel>
    </RealmLayout>
  );
}
