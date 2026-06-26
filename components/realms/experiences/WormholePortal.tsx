"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, {
  PanelSlider,
  PanelToggle,
  PanelDisplay,
  PanelDivider,
} from "@/components/realms/FloatingPanel";
import {
  Vec2,
  vec2Dist,
  clamp,
  prefersReducedMotion,
  getCSSVar,
} from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "wormhole-portal")!;

// ─── Types ────────────────────────────────────────────────────────────────────
type Portal = {
  pos: Vec2;
  radius: number;
  isDragging: boolean;
};

type Particle = {
  id: number;
  state: "entry" | "tunnel" | "exit";
  pos: Vec2;
  angle: number;
  radius: number;
  t: number;          // Tunnel progress (0.0 to 1.0)
  phase: number;      // Spiraling phase shift
  speed: number;      // Dynamic speed multiplier
  opacity: number;
  color: string;
};

// ─── Bezier Math ─────────────────────────────────────────────────────────────
function bezierPoint(p0: Vec2, p1: Vec2, p2: Vec2, p3: Vec2, t: number): Vec2 {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  return {
    x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
    y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y,
  };
}

export default function WormholePortal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<(ts: number) => void>(() => {});
  const sizeRef = useRef({ w: 0, h: 0 });

  // Refs for animation loop
  const portalARef = useRef<Portal>({ pos: { x: 0, y: 0 }, radius: 35, isDragging: false });
  const portalBRef = useRef<Portal>({ pos: { x: 0, y: 0 }, radius: 35, isDragging: false });
  const particlesRef = useRef<Particle[]>([]);
  const lastTsRef = useRef<number | null>(null);
  const nextParticleIdRef = useRef<number>(0);
  const reducedRef = useRef<boolean>(false);
  const portalRotationRef = useRef<number>(0);

  // Floating Panel Settings
  const [maxParticles, setMaxParticles] = useState<number>(80);
  const maxParticlesRef = useRef<number>(80);

  const [warpFactor, setWarpFactor] = useState<number>(2.0);
  const warpFactorRef = useRef<number>(2.0);

  const [portalSize, setPortalSize] = useState<number>(35);

  const [showBridge, setShowBridge] = useState<boolean>(true);
  const showBridgeRef = useRef<boolean>(true);

  const [gravityPull, setGravityPull] = useState<boolean>(true);
  const gravityPullRef = useRef<boolean>(true);

  // Floating Panel Telemetry
  const [tunnelingCount, setTunnelingCount] = useState<number>(0);
  const [transitTimeEst, setTransitTimeEst] = useState<string>("0.0s");

  const init = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    const isMobile = w < 768;

    if (isMobile) {
      portalARef.current.pos = { x: w / 2, y: h / 4 };
      portalBRef.current.pos = { x: w / 2, y: (3 * h) / 4 - 30 };
    } else {
      portalARef.current.pos = { x: w / 3, y: h / 2 };
      portalBRef.current.pos = { x: (2 * w) / 3, y: h / 2 };
    }
  }, []);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    init();
  }, [init]));

  const handleResetPortals = useCallback(() => {
    init();
  }, [init]);

  // Particle Factory
  const createParticle = useCallback((entryPos: Vec2, startPos?: Vec2): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const startRadius = startPos ? vec2Dist(startPos, entryPos) : 70 + Math.random() * 50;
    const initialPos = startPos || {
      x: entryPos.x + Math.cos(angle) * startRadius,
      y: entryPos.y + Math.sin(angle) * startRadius,
    };

    return {
      id: nextParticleIdRef.current++,
      state: "entry",
      pos: initialPos,
      angle: startPos ? Math.atan2(startPos.y - entryPos.y, startPos.x - entryPos.x) : angle,
      radius: startRadius,
      t: 0,
      phase: Math.random() * Math.PI * 2,
      speed: 0.8 + Math.random() * 0.8,
      opacity: 0.8 + Math.random() * 0.2,
      color: Math.random() < 0.5 ? "var(--accent-cosmos)" : "var(--accent-scifi)",
    };
  }, []);

  // Sync state variables to refs
  useEffect(() => {
    maxParticlesRef.current = maxParticles;
  }, [maxParticles]);

  useEffect(() => {
    warpFactorRef.current = warpFactor;
  }, [warpFactor]);

  useEffect(() => {
    showBridgeRef.current = showBridge;
  }, [showBridge]);

  useEffect(() => {
    gravityPullRef.current = gravityPull;
  }, [gravityPull]);

  // Main Render/Animation Loop
  const render = useCallback(
    (ts: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { w, h } = sizeRef.current;
      const reduced = reducedRef.current;
      const isDark = !document.documentElement.classList.contains("light");

      const dt = lastTsRef.current ? clamp((ts - lastTsRef.current) / 1000, 0, 0.1) : 0;
      lastTsRef.current = ts;

      // Update rotation
      if (!reduced) {
        portalRotationRef.current += dt * 1.5;
      }

      // Background clear
      ctx.fillStyle = getCSSVar("--bg-base") || (isDark ? "#06060A" : "#F4F3EF");
      ctx.fillRect(0, 0, w, h);

      // Portals positions
      const pA = portalARef.current.pos;
      const pB = portalBRef.current.pos;
      const rA = portalARef.current.radius;
      const rB = portalBRef.current.radius;

      if (pA.x === 0 && pA.y === 0 && w > 0) {
        // Fallback init if size just became available
        init();
        rafRef.current = requestAnimationFrame(renderRef.current);
        return;
      }

      // Bezier Control points for Einstein-Rosen Bridge tunnel shape
      const dx = pB.x - pA.x;
      const dy = pB.y - pA.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;
      const controlOffset = clamp(dist * 0.35, 40, 160);

      const c1 = {
        x: pA.x + dx / 3 + nx * controlOffset,
        y: pA.y + dy / 3 + ny * controlOffset,
      };
      const c2 = {
        x: pA.x + (2 * dx) / 3 - nx * controlOffset,
        y: pA.y + (2 * dy) / 3 - ny * controlOffset,
      };

      // ─── Render Einstein-Rosen Bridge Tunnel (Causality curves) ───
      if (showBridgeRef.current) {
        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, pB.x, pB.y);
        ctx.strokeStyle = isDark ? "rgba(123, 97, 255, 0.15)" : "rgba(102, 77, 229, 0.1)";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Pulsing / flowing energy lines inside bridge
        if (!reduced) {
          ctx.lineWidth = 1.2;
          for (let offset = 0; offset < 3; offset++) {
            ctx.strokeStyle =
              offset === 0
                ? "rgba(75, 142, 241, 0.3)"
                : offset === 1
                ? "rgba(123, 97, 255, 0.25)"
                : "rgba(58, 191, 191, 0.2)";

            ctx.beginPath();
            const phase = (ts / 1000) * 3 + offset * 1.5;
            for (let t = 0; t <= 1; t += 0.02) {
              const basePos = bezierPoint(pA, c1, c2, pB, t);
              // Calculate perpendicular offset for sinusoidal waves
              const nextT = Math.min(1.0, t + 0.01);
              const nextPos = bezierPoint(pA, c1, c2, pB, nextT);
              const wx = nextPos.x - basePos.x;
              const wy = nextPos.y - basePos.y;
              const wlen = Math.sqrt(wx * wx + wy * wy) || 1;
              const perpX = -wy / wlen;
              const perpY = wx / wlen;

              const waveAmp = Math.sin(t * Math.PI * 4 - phase) * (6 - Math.sin(t * Math.PI) * 4);
              const waveX = basePos.x + perpX * waveAmp;
              const waveY = basePos.y + perpY * waveAmp;

              if (t === 0) {
                ctx.moveTo(waveX, waveY);
              } else {
                ctx.lineTo(waveX, waveY);
              }
            }
            ctx.stroke();
          }
        }
      }

      // ─── Update & Render Particles ───
      const warp = warpFactorRef.current;
      const activeParticles: Particle[] = [];
      let tunnelCount = 0;

      // Particle spawn controller
      if (
        !reduced &&
        particlesRef.current.length < maxParticlesRef.current &&
        Math.random() < 0.4
      ) {
        particlesRef.current.push(createParticle(pA));
      }

      particlesRef.current.forEach((p) => {
        let keep = true;

        if (p.state === "entry") {
          // Spiraling inwards to Portal A (Entry)
          const pullSpeed = gravityPullRef.current ? 1.6 : 1.0;
          p.angle -= 0.03 * p.speed;
          p.radius -= 1.0 * p.speed * pullSpeed;

          p.pos.x = pA.x + Math.cos(p.angle) * p.radius;
          p.pos.y = pA.y + Math.sin(p.angle) * p.radius;

          if (p.radius <= 6) {
            p.state = "tunnel";
            p.t = 0;
          }
        } else if (p.state === "tunnel") {
          // Traveling along Einstein-Rosen S-curve
          tunnelCount++;
          // Approximate speed to traverse based on separation distance
          const speedMultiplier = 140 / dist;
          p.t += dt * 0.25 * warp * p.speed * speedMultiplier;

          if (p.t >= 1.0) {
            p.state = "exit";
            p.radius = 6;
            p.angle = Math.random() * Math.PI * 2;
          } else {
            const basePos = bezierPoint(pA, c1, c2, pB, p.t);
            // 3D double-helix spiraling effect inside the wormhole tube
            const spiralAngle = p.t * 10 * Math.PI + p.phase;
            const spiralRadius = (1.0 - Math.sin(p.t * Math.PI)) * 12 + 2;

            p.pos.x = basePos.x + Math.cos(spiralAngle) * spiralRadius;
            p.pos.y = basePos.y + Math.sin(spiralAngle) * spiralRadius;
          }
        } else if (p.state === "exit") {
          // Spiraling outwards from Portal B (Exit)
          p.angle += 0.03 * p.speed;
          p.radius += 1.0 * p.speed;

          p.pos.x = pB.x + Math.cos(p.angle) * p.radius;
          p.pos.y = pB.y + Math.sin(p.angle) * p.radius;

          p.opacity -= dt * 0.6;
          if (p.radius > 80 || p.opacity <= 0) {
            keep = false;
          }
        }

        if (keep) {
          activeParticles.push(p);

          // Draw Particle
          ctx.beginPath();
          ctx.arc(p.pos.x, p.pos.y, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });
      particlesRef.current = activeParticles;

      // Update telemetry
      setTunnelingCount(tunnelCount);
      const estTime = (dist / (0.25 * warp * 1.0 * 140)).toFixed(1);
      setTransitTimeEst(`${estTime}s`);

      // ─── Render Portals ───

      // 1. Entry Portal (A) SWIRLING INWARDS
      ctx.save();
      ctx.translate(pA.x, pA.y);
      ctx.rotate(-portalRotationRef.current);

      const gradA = ctx.createRadialGradient(0, 0, 2, 0, 0, rA);
      gradA.addColorStop(0, "#ffffff");
      gradA.addColorStop(0.3, "rgba(75, 142, 241, 0.8)"); // accent-cosmos
      gradA.addColorStop(0.7, "rgba(123, 97, 255, 0.4)"); // accent-scifi
      gradA.addColorStop(1, "rgba(75, 142, 241, 0)");
      ctx.fillStyle = gradA;
      ctx.beginPath();
      ctx.arc(0, 0, rA, 0, Math.PI * 2);
      ctx.fill();

      // Swirl Lines for Entry
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let rad = 2; rad < rA; rad += 2) {
          const theta = rad * 0.15;
          ctx.lineTo(Math.cos(theta) * rad, Math.sin(theta) * rad);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 2. Exit Portal (B) SWIRLING OUTWARDS
      ctx.save();
      ctx.translate(pB.x, pB.y);
      ctx.rotate(portalRotationRef.current);

      const gradB = ctx.createRadialGradient(0, 0, 2, 0, 0, rB);
      gradB.addColorStop(0, "#ffffff");
      gradB.addColorStop(0.3, "rgba(123, 97, 255, 0.8)"); // accent-scifi
      gradB.addColorStop(0.7, "rgba(58, 191, 191, 0.4)"); // accent-whim
      gradB.addColorStop(1, "rgba(123, 97, 255, 0)");
      ctx.fillStyle = gradB;
      ctx.beginPath();
      ctx.arc(0, 0, rB, 0, Math.PI * 2);
      ctx.fill();

      // Swirl Lines for Exit
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let rad = 2; rad < rB; rad += 2) {
          const theta = -rad * 0.15; // Swirl in opposite direction
          ctx.lineTo(Math.cos(theta) * rad, Math.sin(theta) * rad);
        }
        ctx.stroke();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(renderRef.current);
    },
    [createParticle, init, maxParticles, warpFactor, portalSize]
  );

  useEffect(() => {
    renderRef.current = render;
    reducedRef.current = prefersReducedMotion();
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  // Pointer position helper
  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent): Vec2 => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);
    const distA = vec2Dist(pos, portalARef.current.pos);
    const distB = vec2Dist(pos, portalBRef.current.pos);

    if (distA < portalARef.current.radius + 10) {
      portalARef.current.isDragging = true;
    } else if (distB < portalBRef.current.radius + 10) {
      portalBRef.current.isDragging = true;
    } else {
      // Tap outside portals: emit particle burst that gets sucked into Portal A
      for (let i = 0; i < 12; i++) {
        particlesRef.current.push(createParticle(portalARef.current.pos, pos));
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);
    if (portalARef.current.isDragging) {
      portalARef.current.pos = pos;
    } else if (portalBRef.current.isDragging) {
      portalBRef.current.pos = pos;
    }
  };

  const handlePointerUp = () => {
    portalARef.current.isDragging = false;
    portalBRef.current.isDragging = false;
  };

  // Adjust Panel Slider controls
  const handleMaxParticlesChange = (v: number) => {
    setMaxParticles(v);
  };

  const handleWarpFactorChange = (v: number) => {
    setWarpFactor(v);
  };

  const handlePortalSizeChange = (v: number) => {
    setPortalSize(v);
    portalARef.current.radius = v;
    portalBRef.current.radius = v;
  };

  const handleShowBridgeChange = (v: boolean) => {
    setShowBridge(v);
  };

  const handleGravityPullChange = (v: boolean) => {
    setGravityPull(v);
  };

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          minHeight: "55vh",
          background: "var(--bg-base)",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "100%", display: "block", touchAction: "none" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        />

        {/* Floating Panel Controls */}
        <FloatingPanel id="wh-controls" title="WORMHOLE CONTROL" defaultPosition="top-right">
          <PanelSlider
            label="Portal Diameter"
            min={20}
            max={60}
            step={5}
            value={portalSize}
            onChange={handlePortalSizeChange}
            unit="px"
          />
          <PanelSlider
            label="Warp Intensity"
            min={0.5}
            max={5.0}
            step={0.1}
            value={warpFactor}
            onChange={handleWarpFactorChange}
            unit="c"
          />
          <PanelSlider
            label="Particle Flow"
            min={20}
            max={150}
            step={10}
            value={maxParticles}
            onChange={handleMaxParticlesChange}
          />
          <PanelToggle
            label="Causality Curves"
            value={showBridge}
            onChange={handleShowBridgeChange}
          />
          <PanelToggle
            label="Gravity Spiral"
            value={gravityPull}
            onChange={handleGravityPullChange}
          />
          <PanelDivider />
          <PanelDisplay
            label="BRIDGE TRANSIT TIME"
            value={transitTimeEst}
          />
          <PanelDisplay
            label="IN-TRANSIT PARTICLES"
            value={tunnelingCount}
          />
          <button
            onClick={handleResetPortals}
            style={{
              width: "100%",
              padding: "8px",
              fontFamily: "var(--font-ui)",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              borderRadius: 6,
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              cursor: "pointer",
              transition: "all 150ms",
              marginTop: 4,
            }}
          >
            Reset Portals
          </button>
        </FloatingPanel>
      </div>
    </RealmLayout>
  );
}
