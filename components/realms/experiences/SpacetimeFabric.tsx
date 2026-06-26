"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelSlider, PanelToggle, PanelDisplay, PanelDivider } from "@/components/realms/FloatingPanel";
import { Vec2, vec2Sub, vec2Norm, vec2Add, vec2Scale, vec2Dist, clamp, prefersReducedMotion, getCSSVar } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "spacetime-fabric")!;

// ─── Types ────────────────────────────────────────────────────────────────────
type MassObject = {
  id: string;
  pos: Vec2;
  vel: Vec2;
  value: number;
  radius: number;
  color: string;
  label: string;
  isDragging: boolean;
};

const ACCENT_COLORS = ["#4B8EF1", "#7B61FF", "#E09A3A", "#3ABFBF", "#C9A84C"];
const LABELS = ["Star", "Planet", "Moon", "Asteroid", "Pulsar"];

function makeMass(id: string, pos: Vec2, value: number, colorIdx: number): MassObject {
  return {
    id, pos, vel: { x: 0, y: 0 }, value,
    radius: clamp(Math.sqrt(value) * 0.25, 8, 42),
    color: ACCENT_COLORS[colorIdx % ACCENT_COLORS.length],
    label: LABELS[colorIdx % LABELS.length],
    isDragging: false,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SpacetimeFabric() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<() => void>(() => {});
  const massesRef = useRef<MassObject[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const reducedRef = useRef(false);
  const orbitModeRef = useRef(false);
  const colsRef = useRef(32);
  const pendingAddRef = useRef<Vec2 | null>(null);

  const [orbitMode, setOrbitMode] = useState(false);
  const [cols, setCols] = useState(32);
  const [objectCount, setObjectCount] = useState(2);
  const [maxDeform, setMaxDeform] = useState("0.0");

  const initMasses = useCallback((w: number, h: number) => {
    massesRef.current = [
      makeMass("m0", { x: w * 0.35, y: h * 0.5 }, 5000, 0),
      makeMass("m1", { x: w * 0.65, y: h * 0.5 }, 1500, 1),
    ];
    massesRef.current[0].vel = { x: 0, y: 0.3 };
    massesRef.current[1].vel = { x: 0, y: -0.3 };
  }, []);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    if (massesRef.current.length === 0) {
      initMasses(w, h);
    }
  }, [initMasses]));

  // Sync refs to avoid unnecessary re-renders
  useEffect(() => {
    orbitModeRef.current = orbitMode;
  }, [orbitMode]);

  useEffect(() => {
    colsRef.current = cols;
  }, [cols]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(renderRef.current);
      return;
    }

    const reduced = reducedRef.current;
    const COLS = colsRef.current;
    const ROWS = Math.round(COLS * (h / w));
    const cellW = w / COLS;
    const cellH = h / ROWS;

    // Add pending mass from panel button
    if (pendingAddRef.current) {
      const pos = pendingAddRef.current;
      pendingAddRef.current = null;
      const newIdx = massesRef.current.length;
      if (newIdx < 5) {
        massesRef.current.push(makeMass(`m${Date.now()}`, pos, 800, newIdx));
        setObjectCount(massesRef.current.length);
      }
    }

    // Orbital physics
    if (!reduced && orbitModeRef.current) {
      const G = 0.001;
      for (let i = 0; i < massesRef.current.length; i++) {
        for (let j = i + 1; j < massesRef.current.length; j++) {
          const a = massesRef.current[i];
          const b = massesRef.current[j];
          const dist = Math.max(vec2Dist(a.pos, b.pos), 10);
          const forceMag = G * a.value * b.value / (dist * dist);
          const dir = vec2Norm(vec2Sub(b.pos, a.pos));
          const accA = vec2Scale(dir, forceMag / a.value);
          const accB = vec2Scale(dir, -forceMag / b.value);
          a.vel = vec2Add(a.vel, accA);
          b.vel = vec2Add(b.vel, accB);
        }
      }
      massesRef.current.forEach(m => {
        if (!m.isDragging) {
          m.pos = vec2Add(m.pos, m.vel);
          m.pos.x = clamp(m.pos.x, m.radius, w - m.radius);
          m.pos.y = clamp(m.pos.y, m.radius, h - m.radius);
          if (m.pos.x <= m.radius || m.pos.x >= w - m.radius) m.vel.x *= -0.8;
          if (m.pos.y <= m.radius || m.pos.y >= h - m.radius) m.vel.y *= -0.8;
        }
      });
    }

    // Background
    ctx.fillStyle = getCSSVar("--bg-base") || "#06060A";
    ctx.fillRect(0, 0, w, h);

    const isDark = !document.documentElement.classList.contains("light");

    // ── Grid displacement ──
    let globalMaxDisp = 0;
    const gridPts: { bx: number; by: number; cx: number; cy: number }[][] = [];
    for (let row = 0; row <= ROWS; row++) {
      gridPts[row] = [];
      for (let col = 0; col <= COLS; col++) {
        const bx = col * cellW;
        const by = row * cellH;
        let dispX = 0, dispY = 0;
        massesRef.current.forEach(m => {
          const dx = bx - m.pos.x;
          const dy = by - m.pos.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const strength = clamp(m.value / (dist * dist + 1), 0, 80);
          if (dist > 0.01) {
            dispX -= (dx / dist) * strength;
            dispY -= (dy / dist) * strength;
          }
        });
        const disp = Math.sqrt(dispX * dispX + dispY * dispY);
        if (disp > globalMaxDisp) globalMaxDisp = disp;
        gridPts[row][col] = { bx, by, cx: bx + dispX, cy: by + dispY };
      }
    }
    setMaxDeform(globalMaxDisp.toFixed(1));

    // Draw grid lines
    const baseOpacity = isDark ? 0.22 : 0.15;
    for (let row = 0; row <= ROWS; row++) {
      ctx.beginPath();
      ctx.moveTo(gridPts[row][0].cx, gridPts[row][0].cy);
      for (let col = 1; col <= COLS; col++) {
        ctx.lineTo(gridPts[row][col].cx, gridPts[row][col].cy);
      }
      ctx.strokeStyle = isDark ? `rgba(75,142,241,${baseOpacity})` : `rgba(26,26,46,${baseOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let col = 0; col <= COLS; col++) {
      ctx.beginPath();
      ctx.moveTo(gridPts[0][col].cx, gridPts[0][col].cy);
      for (let row = 1; row <= ROWS; row++) {
        ctx.lineTo(gridPts[row][col].cx, gridPts[row][col].cy);
      }
      ctx.strokeStyle = isDark ? `rgba(75,142,241,${baseOpacity})` : `rgba(26,26,46,${baseOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw mass objects
    massesRef.current.forEach(m => {
      const c = m.color;
      // Glow
      const hex = c.replace("#", "");
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const grad = ctx.createRadialGradient(m.pos.x, m.pos.y, 0, m.pos.x, m.pos.y, m.radius * 3);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.4)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(m.pos.x, m.pos.y, m.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(m.pos.x, m.pos.y, m.radius, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.fill();

      // Label
      ctx.font = "11px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.textAlign = "center";
      ctx.fillText(m.label, m.pos.x, m.pos.y + m.radius + 16);
    });

    rafRef.current = requestAnimationFrame(renderRef.current);
  }, []);

  useEffect(() => {
    renderRef.current = render;
    reducedRef.current = prefersReducedMotion();
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  // Pointer drag
  const getPos = (e: React.MouseEvent | React.TouchEvent): Vec2 => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    massesRef.current.forEach(m => {
      if (vec2Dist(pos, m.pos) < m.radius * 1.5) m.isDragging = true;
    });
  };
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    massesRef.current.forEach(m => { if (m.isDragging) m.pos = pos; });
  };
  const handleUp = () => massesRef.current.forEach(m => { m.isDragging = false; });

  const handleDblClick = (e: React.MouseEvent) => {
    const pos = getPos(e);
    const idx = massesRef.current.length;
    if (idx < 5) {
      massesRef.current.push(makeMass(`m${Date.now()}`, pos, 800, idx));
      setObjectCount(massesRef.current.length);
    }
  };

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "55vh", background: "var(--bg-base)" }}>
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
          onMouseDown={handleDown} onMouseMove={handleMove} onMouseUp={handleUp} onMouseLeave={handleUp}
          onTouchStart={handleDown} onTouchMove={handleMove} onTouchEnd={handleUp}
          onDoubleClick={handleDblClick}
        />
        <FloatingPanel id="st-controls" title="SPACETIME" defaultPosition="top-left">
          <PanelSlider label="Grid Density" min={12} max={48} step={4} value={cols} onChange={v => { setCols(v); }} />
          <PanelToggle label="Orbit Mode" value={orbitMode} onChange={v => { setOrbitMode(v); }} />
          <PanelDivider />
          <button onClick={() => { pendingAddRef.current = { x: sizeRef.current.w / 2 + (Math.random() - 0.5) * 200, y: sizeRef.current.h / 2 + (Math.random() - 0.5) * 200 }; }} style={{ width: "100%", height: 32, background: "transparent", border: "1px solid var(--border)", borderRadius: 6, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", cursor: "pointer" }}>
            ADD MASS OBJECT
          </button>
          <PanelDisplay label="OBJECTS" value={objectCount} />
          <PanelDisplay label="MAX DEFORMATION" value={`${maxDeform}px`} />
        </FloatingPanel>
      </div>
    </RealmLayout>
  );
}
