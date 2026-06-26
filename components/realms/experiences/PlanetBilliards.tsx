"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelSlider, PanelToggle, PanelDisplay, PanelDivider } from "@/components/realms/FloatingPanel";
import { Vec2, vec2Add, vec2Sub, vec2Scale, vec2Norm, vec2Dist, clamp, prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "planet-billiards")!;

// ─── Planet Presets ───────────────────────────────────────────────────────────
const PLANET_PRESETS = [
  { name: "Mercury",    mass: 3.3e23,  color: "#A0A0A0", radius: 8,  icon: "☿" },
  { name: "Venus",      mass: 4.87e24, color: "#E8C080", radius: 12, icon: "♀" },
  { name: "Earth",      mass: 5.97e24, color: "#4B8EF1", radius: 13, icon: "♁" },
  { name: "Mars",       mass: 6.39e23, color: "#C1440E", radius: 10, icon: "♂" },
  { name: "Jupiter",    mass: 1.90e27, color: "#C88B3A", radius: 30, icon: "♃" },
  { name: "Saturn",     mass: 5.68e26, color: "#E4D191", radius: 25, icon: "♄" },
  { name: "Star",       mass: 2.0e30,  color: "#FDB813", radius: 40, icon: "★" },
  { name: "Black Hole", mass: 1.0e32,  color: "#2A2A3A", radius: 20, icon: "●" },
];

type Body = {
  id: string;
  name: string;
  pos: Vec2;
  vel: Vec2;
  mass: number;
  radius: number;
  color: string;
  icon: string;
  trail: Vec2[];
  isDestroyed: boolean;
};

type Flash = { pos: Vec2; t: number; maxT: number };
type CollisionLabel = { pos: Vec2; t: number; maxT: number; text: string };

const G_SCALED = 6.674e-3;
const SOFTENING = 100;
const TRAIL_LEN = 80;

// ─── Component ────────────────────────────────────────────────────────────────
export default function PlanetBilliards() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<() => void>(() => {});
  const sizeRef = useRef({ w: 0, h: 0 });
  const bodiesRef = useRef<Body[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const labelsRef = useRef<CollisionLabel[]>([]);
  const reducedRef = useRef(false);
  const timeStepRef = useRef(1);
  const showTrailsRef = useRef(true);
  const showLabelsRef = useRef(true);
  const selectedPresetRef = useRef(0);
  const totalCollisionsRef = useRef(0);

  // Zoom & Predictions
  const zoomRef = useRef(1.0);
  const [zoom, setZoom] = useState(1.0);
  const frameCountRef = useRef(0);
  const predictedTrailsRef = useRef<Vec2[][]>([]);
  const [showPrediction, setShowPrediction] = useState(true);
  const showPredictionRef = useRef(true);

  // Drag-to-place state
  const placingRef = useRef<{ start: Vec2; current: Vec2 } | null>(null);

  const [selectedPreset, setSelectedPreset] = useState(0);
  const [timeStep, setTimeStep] = useState(1);
  const [showTrails, setShowTrails] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [bodyCount, setBodyCount] = useState(0);
  const [collisions, setCollisions] = useState(0);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    canvas.width = w;
    canvas.height = h;
    sizeRef.current = { w, h };
  }, []);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
  }, []));

  const addBody = useCallback((pos: Vec2, vel: Vec2) => {
    const preset = PLANET_PRESETS[selectedPresetRef.current];
    bodiesRef.current.push({
      id: `body_${Date.now()}_${Math.random()}`,
      name: preset.name, pos: { ...pos }, vel: { ...vel },
      mass: preset.mass, radius: preset.radius,
      color: preset.color, icon: preset.icon,
      trail: [], isDestroyed: false,
    });
    setBodyCount(bodiesRef.current.filter(b => !b.isDestroyed).length);
  }, []);

  // Compute 180 frame forward orbital projection
  const computePathPrediction = (currentBodies: Body[]): Vec2[][] => {
    const temp = currentBodies.map(b => ({
      pos: { ...b.pos },
      vel: { ...b.vel },
      mass: b.mass,
      radius: b.radius,
      isDestroyed: false
    }));

    const trails: Vec2[][] = temp.map(() => []);
    const dt = timeStepRef.current * 0.1;
    const steps = 150;

    for (let step = 0; step < steps; step++) {
      const acc: Vec2[] = temp.map(() => ({ x: 0, y: 0 }));
      for (let i = 0; i < temp.length; i++) {
        for (let j = i + 1; j < temp.length; j++) {
          const a = temp[i], b = temp[j];
          if (a.isDestroyed || b.isDestroyed) continue;
          const dist = vec2Dist(a.pos, b.pos);
          if (dist < a.radius + b.radius) {
            if (a.mass >= b.mass) {
              b.isDestroyed = true;
              a.radius = clamp(Math.cbrt(Math.pow(a.radius, 3) + Math.pow(b.radius, 3)), 6, 55);
            } else {
              a.isDestroyed = true;
              b.radius = clamp(Math.cbrt(Math.pow(a.radius, 3) + Math.pow(b.radius, 3)), 6, 55);
            }
            continue;
          }

          const forceMag = (G_SCALED * a.mass * b.mass) / (dist * dist + SOFTENING);
          const dir = vec2Norm(vec2Sub(b.pos, a.pos));
          acc[i] = vec2Add(acc[i], vec2Scale(dir, forceMag / a.mass));
          acc[j] = vec2Add(acc[j], vec2Scale(dir, -forceMag / b.mass));
        }
      }

      temp.forEach((body, i) => {
        if (body.isDestroyed) return;
        body.vel = vec2Add(body.vel, vec2Scale(acc[i], dt));
        body.pos = vec2Add(body.pos, vec2Scale(body.vel, dt));

        if (step % 3 === 0) {
          trails[i].push({ ...body.pos });
        }
      });
    }

    return trails;
  };

  // Preset Scenario loader
  const loadScenario = (scenario: "solar" | "binary" | "billiards") => {
    init();
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    bodiesRef.current = [];
    flashesRef.current = [];
    labelsRef.current = [];
    totalCollisionsRef.current = 0;
    setCollisions(0);

    const cx = w / 2;
    const cy = h / 2;

    if (scenario === "solar") {
      // Massive sun in center
      bodiesRef.current.push({
        id: "sun", name: "Sun", pos: { x: cx, y: cy }, vel: { x: 0, y: 0 },
        mass: 1.9e30, radius: 26, color: "#FDB813", icon: "★", trail: [], isDestroyed: false
      });
      // Earth
      bodiesRef.current.push({
        id: "earth", name: "Earth", pos: { x: cx, y: cy - 140 }, vel: { x: 9.5, y: 0 },
        mass: 5.97e24, radius: 10, color: "#4B8EF1", icon: "♁", trail: [], isDestroyed: false
      });
      // Mars
      bodiesRef.current.push({
        id: "mars", name: "Mars", pos: { x: cx, y: cy + 220 }, vel: { x: -7.2, y: 0 },
        mass: 6.39e23, radius: 8, color: "#C1440E", icon: "♂", trail: [], isDestroyed: false
      });
    } else if (scenario === "binary") {
      // Two massive stars orbiting each other
      bodiesRef.current.push({
        id: "star1", name: "Star A", pos: { x: cx - 100, y: cy }, vel: { x: 0, y: 5.8 },
        mass: 1.0e30, radius: 18, color: "#7B61FF", icon: "★", trail: [], isDestroyed: false
      });
      bodiesRef.current.push({
        id: "star2", name: "Star B", pos: { x: cx + 100, y: cy }, vel: { x: 0, y: -5.8 },
        mass: 1.0e30, radius: 18, color: "#FDB813", icon: "★", trail: [], isDestroyed: false
      });
    } else if (scenario === "billiards") {
      // Chaotic grid setup
      for (let i = 0; i < 5; i++) {
        const x = cx - 120 + i * 60;
        for (let j = 0; j < 3; j++) {
          const y = cy - 60 + j * 60;
          const preset = PLANET_PRESETS[(i * 3 + j) % 6];
          bodiesRef.current.push({
            id: `billiards_${i}_${j}`, name: preset.name, pos: { x, y }, vel: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
            mass: preset.mass, radius: preset.radius, color: preset.color, icon: preset.icon, trail: [], isDestroyed: false
          });
        }
      }
    }
    setBodyCount(bodiesRef.current.filter(b => !b.isDestroyed).length);
  };

  // Sync refs to avoid re-renders
  useEffect(() => {
    timeStepRef.current = timeStep;
  }, [timeStep]);

  useEffect(() => {
    showTrailsRef.current = showTrails;
  }, [showTrails]);

  useEffect(() => {
    showLabelsRef.current = showLabels;
  }, [showLabels]);

  useEffect(() => {
    selectedPresetRef.current = selectedPreset;
  }, [selectedPreset]);

  useEffect(() => {
    showPredictionRef.current = showPrediction;
  }, [showPrediction]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const reduced = reducedRef.current;
    const dt = timeStepRef.current * 0.1;
    const isDark = !document.documentElement.classList.contains("light");

    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(renderRef.current);
      return;
    }

    // Physics ticks (multiple steps per frame for integration accuracy)
    const substeps = 4;
    const activeBodies = bodiesRef.current.filter(b => !b.isDestroyed);

    for (let sub = 0; sub < substeps; sub++) {
      const accs: Vec2[] = activeBodies.map(() => ({ x: 0, y: 0 }));

      // Gravity accumulation
      for (let i = 0; i < activeBodies.length; i++) {
        for (let j = i + 1; j < activeBodies.length; j++) {
          const a = activeBodies[i];
          const b = activeBodies[j];
          const dist = vec2Dist(a.pos, b.pos);

          // Elastic/Absorb Collision
          if (dist < a.radius + b.radius) {
            const merger = a.mass >= b.mass ? a : b;
            const swallowed = a.mass >= b.mass ? b : a;

            swallowed.isDestroyed = true;
            // Momentum conservation formula: v_new = (m1*v1 + m2*v2) / (m1 + m2)
            const totalMass = merger.mass + swallowed.mass;
            merger.vel.x = (merger.mass * merger.vel.x + swallowed.mass * swallowed.vel.x) / totalMass;
            merger.vel.y = (merger.mass * merger.vel.y + swallowed.mass * swallowed.vel.y) / totalMass;
            merger.mass = totalMass;
            merger.radius = clamp(Math.cbrt(Math.pow(merger.radius, 3) + Math.pow(swallowed.radius, 3)), 6, 55);

            // Trigger flash explosion
            flashesRef.current.push({ pos: { ...swallowed.pos }, t: 0, maxT: 35 });
            labelsRef.current.push({ pos: { ...swallowed.pos }, t: 0, maxT: 60, text: `MERGE! +${merger.name.toUpperCase()}` });
            totalCollisionsRef.current++;
            setCollisions(totalCollisionsRef.current);
            continue;
          }

          const forceMag = (G_SCALED * a.mass * b.mass) / (dist * dist + SOFTENING);
          const dir = vec2Norm(vec2Sub(b.pos, a.pos));

          accs[i] = vec2Add(accs[i], vec2Scale(dir, forceMag / a.mass));
          accs[j] = vec2Add(accs[j], vec2Scale(dir, -forceMag / b.mass));
        }
      }

      // Euler integration
      activeBodies.forEach((body, i) => {
        body.vel = vec2Add(body.vel, vec2Scale(accs[i], dt / substeps));
        body.pos = vec2Add(body.pos, vec2Scale(body.vel, dt / substeps));
      });
    }

    // Clear background
    ctx.fillStyle = isDark ? "#06060A" : "#F4F3EF";
    ctx.fillRect(0, 0, w, h);

    // Zoom transform
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoomRef.current, zoomRef.current);
    ctx.translate(-w / 2, -h / 2);

    // Draw grid mesh lines relative to zoom
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.03)" : "rgba(26,26,46,0.02)";
    ctx.lineWidth = 1;
    const gridSpacing = 80;
    for (let gx = 0; gx < w; gx += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += gridSpacing) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // Predictive orbital path tracer
    frameCountRef.current++;
    if (showPredictionRef.current && frameCountRef.current % 3 === 0) {
      predictedTrailsRef.current = computePathPrediction(activeBodies);
    }
    if (showPredictionRef.current) {
      ctx.lineWidth = 1.0;
      predictedTrailsRef.current.forEach((trail, idx) => {
        const body = activeBodies[idx];
        if (!body || body.isDestroyed || trail.length < 2) return;
        ctx.strokeStyle = `rgba(255,255,255,0.14)`;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
          ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Render Collision flashes
    flashesRef.current.forEach((f, idx) => {
      f.t += 1.2;
      ctx.beginPath();
      ctx.arc(f.pos.x, f.pos.y, f.t * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 100, 0, ${clamp(1.0 - f.t / f.maxT, 0, 1.0)})`;
      ctx.fill();
    });
    flashesRef.current = flashesRef.current.filter(f => f.t < f.maxT);

    // Render text warnings
    labelsRef.current.forEach((lbl, idx) => {
      lbl.t += 1;
      ctx.font = "bold 10px var(--font-mono)";
      ctx.fillStyle = `rgba(255, 230, 220, ${clamp(1.0 - lbl.t / lbl.maxT, 0, 1.0)})`;
      ctx.textAlign = "center";
      ctx.fillText(lbl.text, lbl.pos.x, lbl.pos.y - lbl.t * 0.4);
    });
    labelsRef.current = labelsRef.current.filter(lbl => lbl.t < lbl.maxT);

    // Render Bodies
    activeBodies.forEach((body) => {
      // Trail updates
      if (showTrailsRef.current && !reduced) {
        body.trail.push({ ...body.pos });
        if (body.trail.length > TRAIL_LEN) body.trail.shift();
      } else {
        body.trail = [];
      }

      // Draw trail line
      if (body.trail.length > 2) {
        ctx.beginPath();
        ctx.moveTo(body.trail[0].x, body.trail[0].y);
        for (let i = 1; i < body.trail.length; i++) {
          ctx.lineTo(body.trail[i].x, body.trail[i].y);
        }
        ctx.strokeStyle = body.color;
        ctx.lineWidth = clamp(body.radius * 0.22, 1, 4);
        ctx.globalAlpha = 0.22;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // Draw Glow
      const hex = body.color.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16) || 120;
      const g = parseInt(hex.slice(2, 4), 16) || 120;
      const b = parseInt(hex.slice(4, 6), 16) || 240;
      const grad = ctx.createRadialGradient(body.pos.x, body.pos.y, 0, body.pos.x, body.pos.y, body.radius * 2);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(body.pos.x, body.pos.y, body.radius * 2, 0, Math.PI * 2);
      ctx.fill();

      // Sphere body
      ctx.beginPath();
      ctx.arc(body.pos.x, body.pos.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();

      // Draw Icon label
      if (showLabelsRef.current) {
        ctx.font = `${Math.max(10, body.radius * 0.7)}px serif`;
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(body.icon, body.pos.x, body.pos.y);
      }
    });

    // Drag launcher preview
    if (placingRef.current) {
      const { start, current } = placingRef.current;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(current.x, current.y);
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      const angle = Math.atan2(current.y - start.y, current.x - start.x);
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(current.x - 10 * Math.cos(angle - 0.4), current.y - 10 * Math.sin(angle - 0.4));
      ctx.lineTo(current.x - 10 * Math.cos(angle + 0.4), current.y - 10 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fill();

      const preset = PLANET_PRESETS[selectedPresetRef.current];
      ctx.beginPath();
      ctx.arc(start.x, start.y, preset.radius, 0, Math.PI * 2);
      ctx.strokeStyle = preset.color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
    rafRef.current = requestAnimationFrame(renderRef.current);
  }, []);

  useEffect(() => {
    renderRef.current = render;
    reducedRef.current = prefersReducedMotion();
    init();
    rafRef.current = requestAnimationFrame(render);

    // Mouse scroll zooming event listener
    const canvas = canvasRef.current;
    if (canvas) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        const nextZoom = zoomRef.current + e.deltaY * -0.0015;
        zoomRef.current = clamp(nextZoom, 0.25, 4.0);
        setZoom(zoomRef.current);
      };
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener("wheel", handleWheel);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [init, render]);

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): Vec2 => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    placingRef.current = { start: getCanvasPos(e), current: getCanvasPos(e) };
  };
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!placingRef.current) return;
    placingRef.current.current = getCanvasPos(e);
  };
  const handleUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (!placingRef.current) return;
    const { start, current } = placingRef.current;
    // Map vector velocity relative to current scale
    const vel = vec2Scale(vec2Sub(current, start), 0.04 / zoomRef.current);
    // Project position through screen space back to virtual scaled space coords
    addBody(start, vel);
    placingRef.current = null;
    setBodyCount(bodiesRef.current.filter(b => !b.isDestroyed).length);
  };

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "55vh", background: "var(--bg-base)" }}>
        {/* Zoom HUD */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 5,
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid var(--border)",
            padding: "4px 10px",
            borderRadius: 4,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-muted)",
            pointerEvents: "none"
          }}
        >
          ZOOM: {zoom.toFixed(2)}x (use scrollwheel)
        </div>

        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block", touchAction: "none", cursor: "crosshair" }}
          onMouseDown={handleDown} onMouseMove={handleMove} onMouseUp={handleUp}
          onTouchStart={handleDown} onTouchMove={handleMove} onTouchEnd={handleUp} />

        <FloatingPanel id="pb-controls" title="GRAVITY SANDBOX" defaultPosition="top-right">
          {/* Scenario preset loaders */}
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: 6 }}>Load Scenario</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            <button onClick={() => loadScenario("solar")} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-primary)" }}>Solar</button>
            <button onClick={() => loadScenario("binary")} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-primary)" }}>Binary</button>
            <button onClick={() => loadScenario("billiards")} style={{ flex: 1, padding: "6px 0", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-primary)" }}>Billiards</button>
          </div>

          <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: 6 }}>Selected Planet</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
            {PLANET_PRESETS.map((p, i) => (
              <button key={p.name} onClick={() => { setSelectedPreset(i); }}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 6, border: `1px solid ${selectedPreset === i ? "var(--accent-cosmos)" : "var(--border)"}`, background: selectedPreset === i ? "var(--bg-card-hover)" : "transparent", cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                {p.name}
              </button>
            ))}
          </div>
          <PanelSlider label="Time Speed" min={0.1} max={5} step={0.1} value={timeStep} onChange={setTimeStep} unit="×" />
          <PanelToggle label="Show Trails" value={showTrails} onChange={setShowTrails} />
          <PanelToggle label="Show Labels" value={showLabels} onChange={setShowLabels} />
          <PanelToggle label="Orbital Prediction" value={showPrediction} onChange={setShowPrediction} />
          <PanelDivider />
          <button onClick={() => { bodiesRef.current = []; flashesRef.current = []; labelsRef.current = []; setBodyCount(0); }}
            style={{ width: "100%", height: 32, background: "transparent", border: "1px solid var(--border)", borderRadius: 6, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
            CLEAR ALL
          </button>
          <PanelDisplay label="BODIES IN SYSTEM" value={bodyCount} />
          <PanelDisplay label="COLLISIONS" value={collisions} />
        </FloatingPanel>
      </div>
    </RealmLayout>
  );
}
