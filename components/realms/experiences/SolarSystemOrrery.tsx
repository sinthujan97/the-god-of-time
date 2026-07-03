"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Planet data ──────────────────────────────────────────────────────────────

type Planet = {
  name: string;
  emoji: string;
  semiMajor: number;  // AU
  period: number;     // Earth days
  color: string;
  moons: number;
  diameter: number;   // km
  l0: number;         // J2000 mean longitude (degrees)
};

const PLANETS: Planet[] = [
  { name: "Mercury", emoji: "☿", semiMajor: 0.387,  period: 87.97,    color: "#9CA3AF", moons: 0,   diameter: 4_879,   l0: 252.25 },
  { name: "Venus",   emoji: "♀", semiMajor: 0.723,  period: 224.70,   color: "#E8C84A", moons: 0,   diameter: 12_104,  l0: 181.98 },
  { name: "Earth",   emoji: "♁", semiMajor: 1.000,  period: 365.25,   color: "#60A5FA", moons: 1,   diameter: 12_756,  l0: 100.46 },
  { name: "Mars",    emoji: "♂", semiMajor: 1.524,  period: 686.97,   color: "#F87171", moons: 2,   diameter: 6_792,   l0: 355.45 },
  { name: "Jupiter", emoji: "♃", semiMajor: 5.203,  period: 4_332.59, color: "#D97706", moons: 95,  diameter: 142_984, l0: 34.40  },
  { name: "Saturn",  emoji: "♄", semiMajor: 9.537,  period: 10_759.22,color: "#EDE68A", moons: 146, diameter: 120_536, l0: 49.94  },
  { name: "Uranus",  emoji: "♅", semiMajor: 19.19,  period: 30_688.5, color: "#67E8F9", moons: 28,  diameter: 51_118,  l0: 313.23 },
  { name: "Neptune", emoji: "♆", semiMajor: 30.07,  period: 60_182.0, color: "#818CF8", moons: 16,  diameter: 49_528,  l0: 304.88 },
];

const SPEED_OPTIONS = [
  { label: "Real", mult: 1 },
  { label: "10×", mult: 10 },
  { label: "100×", mult: 100 },
  { label: "10k×", mult: 10_000 },
];

const J2000_MS = new Date("2000-01-01T12:00:00Z").getTime();
const SCALE = 130; // visual scale: compressed orbit radii

function daysSinceJ2000(nowMs: number): number {
  return (nowMs - J2000_MS) / 86_400_000;
}

function planetAngleDeg(planet: Planet, d: number): number {
  const meanMotion = 360 / planet.period;
  return ((planet.l0 + meanMotion * d) % 360 + 360) % 360;
}

function visualOrbitR(semiMajor: number): number {
  return Math.pow(semiMajor, 0.45) * SCALE;
}

// ─── Mars Sol clock ───────────────────────────────────────────────────────────

function getMarsTime(nowMs: number): string {
  // Mars sol = 24h 37m 22.663s = 88_642.663 s
  const SOL_MS = 88_642_663;
  // Mars Coordinated Time offset from J2000: Mars Clock epoch at J2000 is midnight
  const elapsed = nowMs - J2000_MS;
  const marsMs   = (elapsed % SOL_MS + SOL_MS) % SOL_MS;
  const marsSec  = Math.floor(marsMs / 1000);
  const h = Math.floor(marsSec / 3600);
  const m = Math.floor((marsSec % 3600) / 60);
  const s = marsSec % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// Solar Cycle 25 started Dec 2019, ~11-year cycle, next peak ~Jul 2025
function getSolarCyclePct(nowMs: number): { pct: number; label: string } {
  const start = new Date("2019-12-01T00:00:00Z").getTime();
  const end   = new Date("2030-12-01T00:00:00Z").getTime();
  const pct   = Math.min(100, Math.max(0, ((nowMs - start) / (end - start)) * 100));
  let label = "Rising";
  if (pct > 80) label = "Declining";
  else if (pct > 45 && pct < 65) label = "Solar Maximum";
  return { pct, label };
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function drawOrrery(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  positions: { x: number; y: number; r: number }[],
  selectedIdx: number | null,
  hoveredIdx: number | null,
  accent: string,
) {
  const cx = width / 2;
  const cy = height / 2;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, width, height);

  // Stars (static seed)
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  for (let i = 0; i < 80; i++) {
    const sx = ((i * 173 + 31) % width);
    const sy = ((i * 97  + 17) % height);
    ctx.fillRect(sx, sy, i % 5 === 0 ? 1.5 : 0.8, i % 5 === 0 ? 1.5 : 0.8);
  }

  // Sun glow
  const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
  sunGlow.addColorStop(0, "rgba(255,220,80,0.95)");
  sunGlow.addColorStop(0.6, "rgba(255,160,30,0.5)");
  sunGlow.addColorStop(1, "rgba(255,100,0,0)");
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(cx, cy, 28, 0, Math.PI * 2);
  ctx.fill();

  // Sun core
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(cx, cy, 10, 0, Math.PI * 2);
  ctx.fill();

  PLANETS.forEach((planet, i) => {
    const orbitR = visualOrbitR(planet.semiMajor);
    const { x, y, r } = positions[i];

    // Orbit ring
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = i === selectedIdx
      ? "rgba(255,255,255,0.25)"
      : "rgba(255,255,255,0.07)";
    ctx.lineWidth = i === selectedIdx ? 1 : 0.5;
    ctx.stroke();

    // Planet glow for selected/hovered
    if (i === selectedIdx || i === hoveredIdx) {
      const glowR = r + 6;
      const glow = ctx.createRadialGradient(x, y, 0, x, y, glowR * 2);
      glow.addColorStop(0, `${planet.color}66`);
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowR * 2, 0, Math.PI * 2);
      ctx.fill();

      // Accent ring
      ctx.beginPath();
      ctx.arc(x, y, r + 4, 0, Math.PI * 2);
      ctx.strokeStyle = i === selectedIdx ? accent : "rgba(255,255,255,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Planet body
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();

    // Saturn ring
    if (planet.name === "Saturn") {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.3);
      ctx.beginPath();
      ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "#EDE68A88";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    // Label for selected or hovered
    if (i === selectedIdx || i === hoveredIdx) {
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.fillText(planet.name, x, y - r - 8);
    }
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SolarSystemOrrery() {
  const slug   = usePathname().split("/").pop();
  const realm  = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];
  const accent = realm.accent;

  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number | null>(null);
  const simTimeRef  = useRef<number>(Date.now()); // accumulated sim-time in ms
  const lastRealRef = useRef<number>(Date.now());

  const [speedIdx, setSpeedIdx]     = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(2); // Earth default
  const [hoveredIdx, setHoveredIdx]  = useState<number | null>(null);
  const [marsTime, setMarsTime]      = useState(() => getMarsTime(Date.now()));
  const [solarCycle, setSolarCycle]  = useState(() => getSolarCyclePct(Date.now()));
  const [tick, setTick]              = useState(0);

  const speedMult = SPEED_OPTIONS[speedIdx].mult;

  // Current planet canvas positions (derived each render from simTimeRef)
  const positionsRef = useRef<{ x: number; y: number; r: number }[]>(
    PLANETS.map(p => ({ x: 0, y: 0, r: 4 }))
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    const cx = width / 2;
    const cy = height / 2;

    const d = daysSinceJ2000(simTimeRef.current);

    positionsRef.current = PLANETS.map(planet => {
      const angleDeg = planetAngleDeg(planet, d);
      const angleRad = (angleDeg - 90) * (Math.PI / 180);
      const orbitR   = visualOrbitR(planet.semiMajor);
      const x = cx + Math.cos(angleRad) * orbitR;
      const y = cy + Math.sin(angleRad) * orbitR;
      const r = Math.max(3, Math.min(9, Math.pow(planet.diameter / 12756, 0.4) * 4.5));
      return { x, y, r };
    });

    drawOrrery(ctx, width, height, positionsRef.current, selectedIdx, hoveredIdx, accent);
  }, [selectedIdx, hoveredIdx, accent]);

  // rAF loop
  useEffect(() => {
    let animFrameId: number;

    function loop() {
      const now     = Date.now();
      const realDt  = now - lastRealRef.current;
      lastRealRef.current = now;
      simTimeRef.current += realDt * speedMult;

      draw();
      animFrameId = requestAnimationFrame(loop);
    }

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [draw, speedMult]);

  // Mars time + solar cycle live update (1s)
  useEffect(() => {
    const id = setInterval(() => {
      setMarsTime(getMarsTime(simTimeRef.current));
      setSolarCycle(getSolarCyclePct(simTimeRef.current));
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width  = parent.clientWidth;
      canvas.height = 340;
      draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    return () => ro.disconnect();
  }, [draw]);

  // Click handler
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let closest: number | null = null;
    let minDist = Infinity;
    positionsRef.current.forEach(({ x, y, r }, i) => {
      const dist = Math.hypot(mx - x, my - y);
      if (dist < r + 10 && dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setSelectedIdx(prev => (prev === closest ? null : closest));
  }, []);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let found: number | null = null;
    positionsRef.current.forEach(({ x, y, r }, i) => {
      if (Math.hypot(mx - x, my - y) < r + 10) found = i;
    });
    setHoveredIdx(found);
  }, []);

  const selected = selectedIdx !== null ? PLANETS[selectedIdx] : null;

  // ─── Controls ──────────────────────────────────────────────────────────────

  const controls = (
    <div className="flex flex-col gap-6">
      {/* Speed */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Simulation Speed
        </label>
        <div className="grid grid-cols-4 gap-2">
          {SPEED_OPTIONS.map((opt, i) => (
            <button
              key={opt.label}
              onClick={() => setSpeedIdx(i)}
              className="py-2 text-xs font-mono font-bold rounded transition-all duration-150"
              style={{
                border: "2px solid var(--border)",
                boxShadow: speedIdx === i ? `2px 2px 0 ${accent}` : "2px 2px 0 var(--shadow-color)",
                background: speedIdx === i ? accent : "var(--bg-card)",
                color: speedIdx === i ? "var(--bg-base)" : "var(--text-primary)",
                transform: speedIdx === i ? "translate(-1px,-1px)" : undefined,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Planet selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Focus Planet
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PLANETS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelectedIdx(prev => prev === i ? null : i)}
              className="py-2 text-xs font-mono rounded transition-all duration-150"
              style={{
                border: "2px solid var(--border)",
                boxShadow: selectedIdx === i ? `2px 2px 0 ${p.color}` : "2px 2px 0 var(--shadow-color)",
                background: selectedIdx === i ? p.color + "22" : "var(--bg-card)",
                color: selectedIdx === i ? p.color : "var(--text-primary)",
              }}
            >
              {p.emoji} {p.name.slice(0, 4)}
            </button>
          ))}
        </div>
      </div>

      {/* Selected planet info */}
      {selected && (
        <div
          className="p-4 rounded flex flex-col gap-3"
          style={{
            border: "2px solid var(--border)",
            boxShadow: `3px 3px 0 ${selected.color}55`,
            background: "var(--bg-card)",
          }}
        >
          <div className="text-sm font-mono font-bold" style={{ color: selected.color }}>
            {selected.emoji} {selected.name}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Period", `${selected.period.toLocaleString()} days`],
              ["Moons", `${selected.moons}`],
              ["Diameter", `${selected.diameter.toLocaleString()} km`],
              ["Orbit", `${selected.semiMajor} AU`],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase tracking-wider text-text-muted font-sans">{k}</span>
                <span className="text-xs font-mono" style={{ color: selected.color }}>{v}</span>
              </div>
            ))}
          </div>
          {selected.name === "Earth" && (
            <div className="text-[10px] text-text-muted font-sans mt-1">
              You are here. Travelling at ~107,000 km/h around the Sun.
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ─── Canvas section ────────────────────────────────────────────────────────

  const d = daysSinceJ2000(simTimeRef.current);

  const canvas_ = (
    <div className="flex flex-col gap-5">
      {/* Canvas */}
      <div
        className="w-full overflow-hidden rounded cursor-crosshair"
        style={{ border: "2px solid var(--border)", boxShadow: `3px 3px 0 var(--shadow-color)`, background: "#0a0a0f" }}
      >
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "340px" }}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredIdx(null)}
        />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Mars Sol Clock */}
        <div
          className="p-4 rounded flex flex-col gap-2"
          style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
        >
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
            ♂ Mars Sol Clock
          </div>
          <div className="font-mono text-2xl font-bold" style={{ color: "#F87171" }}>
            {marsTime}
          </div>
          <div className="text-[10px] text-text-muted font-sans">
            Mars sol = 24h 37m 22s. If you were on Mars right now, this would be local time.
          </div>
        </div>

        {/* Solar Cycle */}
        <div
          className="p-4 rounded flex flex-col gap-2"
          style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
        >
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
            ☀ Solar Cycle 25
          </div>
          <div className="font-mono text-lg font-bold" style={{ color: accent }}>
            {solarCycle.label}
          </div>
          <div className="relative h-3 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
            <div
              className="h-full rounded transition-all"
              style={{ width: `${solarCycle.pct}%`, background: `linear-gradient(90deg, #FCD34D, #FB923C)` }}
            />
          </div>
          <div className="text-[10px] text-text-muted font-sans">
            {solarCycle.pct.toFixed(1)}% through 11-year cycle (Dec 2019 – Dec 2030)
          </div>
        </div>
      </div>

      {/* Planetary notes */}
      <div
        className="p-4 rounded"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted mb-3">
          Current Orbital Positions
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {PLANETS.map((p) => {
            const angleDeg = planetAngleDeg(p, d);
            return (
              <div key={p.name} className="flex items-center gap-2">
                <span className="text-xs">{p.emoji}</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold" style={{ color: p.color }}>
                    {p.name}
                  </span>
                  <span className="text-[9px] font-mono text-text-muted">
                    {angleDeg.toFixed(1)}°
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[9px] text-text-muted font-sans mt-3">
          Ecliptic longitudes from J2000 epoch. Click any planet on the orrery to focus.
        </div>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} controlsSection={controls} canvasSection={canvas_} />
  );
}
