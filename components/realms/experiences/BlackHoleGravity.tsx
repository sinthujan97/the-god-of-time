"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelSlider, PanelToggle, PanelDisplay, PanelDivider } from "@/components/realms/FloatingPanel";
import {
  Vec2, vec2Add, vec2Sub, vec2Scale, vec2Mag, vec2Norm, vec2Dist,
  clamp, mapRange, prefersReducedMotion, getCSSVar
} from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "black-hole-gravity")!;

// ─── Types ────────────────────────────────────────────────────────────────────
type BlackHole = {
  pos: Vec2;
  mass: number;
  radius: number;
  accretionRadius: number;
  isDragging: boolean;
};

type Particle = {
  pos: Vec2;
  vel: Vec2;
  mass: number;
  radius: number;
  colorType: 0 | 1 | 2;
  opacity: number;
  trail: Vec2[];
  isConsumed: boolean;
  consumeTimer: number;
};

type Star = { x: number; y: number; r: number };

type Toast = {
  id: string;
  message: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function makeParticle(w: number, h: number, cx: number, cy: number): Particle {
  const edge = Math.floor(Math.random() * 4);
  let x = 0, y = 0;
  if (edge === 0) { x = Math.random() * w; y = -20; }
  else if (edge === 1) { x = w + 20; y = Math.random() * h; }
  else if (edge === 2) { x = Math.random() * w; y = h + 20; }
  else { x = -20; y = Math.random() * h; }

  const dx = cx - x; const dy = cy - y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const tangX = -dy / dist; const tangY = dx / dist;
  const speed = 0.5 + Math.random() * 1.5;
  const rng = Math.random();
  const colorType: 0 | 1 | 2 = rng < 0.7 ? 0 : rng < 0.9 ? 1 : 2;

  return {
    pos: { x, y },
    vel: { x: tangX * speed + (Math.random() - 0.5) * 0.5, y: tangY * speed + (Math.random() - 0.5) * 0.5 },
    mass: 1e6 + Math.random() * 9.9e7,
    radius: 1.5 + Math.random() * 2.5,
    colorType,
    opacity: 0.4 + Math.random() * 0.6,
    trail: [],
    isConsumed: false,
    consumeTimer: 0,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlackHoleGravity() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<() => void>(() => {});
  const bhRef = useRef<BlackHole>({ pos: { x: 0, y: 0 }, mass: 5e14, radius: 40, accretionRadius: 120, isDragging: false });
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const mouseRef = useRef<Vec2>({ x: -9999, y: -9999 });
  const accretionAngleRef = useRef(0);
  const consumedRef = useRef(0);
  const dragCountRef = useRef(0);
  const reducedRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  // Achievements State
  const [toasts, setToasts] = useState<Toast[]>([]);
  const unlockedRef = useRef<Set<string>>(new Set());

  // Panel state
  const [massSlider, setMassSlider] = useState(50);
  const [particleCount, setParticleCount] = useState(80);
  const [trailsEnabled, setTrailsEnabled] = useState(true);
  const [consumed, setConsumed] = useState(0);
  const [nearestForce, setNearestForce] = useState("0.00");
  const trailsRef = useRef(true);
  const particleCountRef = useRef(80);

  // Rotating Narrative Captions
  const CAPTIONS = [
    "Time dilation approaches infinity at the event horizon.",
    "Every particle swallowed adds to the gravity well's mass.",
    "Light itself cannot escape the gravitational gradient.",
    "Information is lost, preserved only as quantum holograms.",
    "A gravitational singularity lies at the heart of this collapse.",
    "Space and time swap roles beyond the event horizon."
  ];
  const [captionIndex, setCaptionIndex] = useState(0);

  const showToast = (message: string) => {
    if (unlockedRef.current.has(message)) return;
    unlockedRef.current.add(message);
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Switch captions every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % CAPTIONS.length);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    bhRef.current.pos = { x: w / 2, y: h / 2 };

    // Stars
    starsRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: 0.5 + Math.random() * 0.5
    }));

    // Particles
    particlesRef.current = Array.from({ length: particleCountRef.current }, () =>
      makeParticle(w, h, w / 2, h / 2)
    );
  }, []));

  // Sync refs to avoid re-triggering canvas updates
  useEffect(() => {
    trailsRef.current = trailsEnabled;
  }, [trailsEnabled]);

  useEffect(() => {
    particleCountRef.current = particleCount;
  }, [particleCount]);

  // Radial lens distortion logic
  const applyLensing = (ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, lensRadius: number) => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    try {
      const imgData = ctx.getImageData(
        clamp(cx - lensRadius, 0, w - 1),
        clamp(cy - lensRadius, 0, h - 1),
        clamp(lensRadius * 2, 1, w),
        clamp(lensRadius * 2, 1, h)
      );

      const outData = ctx.createImageData(imgData.width, imgData.height);
      const data = imgData.data;
      const out = outData.data;

      const halfW = imgData.width / 2;
      const halfH = imgData.height / 2;

      for (let y = 0; y < imgData.height; y++) {
        for (let x = 0; x < imgData.width; x++) {
          const dx = x - halfW;
          const dy = y - halfH;
          const r = Math.sqrt(dx * dx + dy * dy);

          if (r < radius) {
            // Under event horizon: pure black
            const idx = (y * imgData.width + x) * 4;
            out[idx] = 0; out[idx+1] = 0; out[idx+2] = 0; out[idx+3] = 255;
            continue;
          }

          if (r < lensRadius) {
            // Gravitational lensing calculation
            const shift = 1.0 - (radius / r);
            const strength = Math.pow(shift, 1.8);
            const srcX = Math.round(halfW + dx * strength);
            const srcY = Math.round(halfH + dy * strength);

            if (srcX >= 0 && srcX < imgData.width && srcY >= 0 && srcY < imgData.height) {
              const sIdx = (srcY * imgData.width + srcX) * 4;
              const dIdx = (y * imgData.width + x) * 4;
              out[dIdx] = data[sIdx];
              out[dIdx+1] = data[sIdx+1];
              out[dIdx+2] = data[sIdx+2];
              out[dIdx+3] = data[sIdx+3];
            }
          } else {
            const idx = (y * imgData.width + x) * 4;
            out[idx] = data[idx];
            out[idx+1] = data[idx+1];
            out[idx+2] = data[idx+2];
            out[idx+3] = data[idx+3];
          }
        }
      }
      ctx.putImageData(outData, clamp(cx - lensRadius, 0, w - 1), clamp(cy - lensRadius, 0, h - 1));
    } catch {
      // Fallback
    }
  };

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

    const isDark = !document.documentElement.classList.contains("light");
    const reduced = reducedRef.current;

    // Background
    ctx.fillStyle = isDark ? "#06060A" : "#F4F3EF";
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(26,26,46,0.08)";
    starsRef.current.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const bh = bhRef.current;
    const G = 6.674e-11;

    // Increment accretion rotation
    if (!reduced) accretionAngleRef.current += 0.015;

    // Accretion disk glow behind event horizon
    ctx.save();
    ctx.translate(bh.pos.x, bh.pos.y);
    ctx.rotate(accretionAngleRef.current);
    const glowGrad = ctx.createRadialGradient(0, 0, bh.radius * 0.9, 0, 0, bh.accretionRadius);
    glowGrad.addColorStop(0, "rgba(255, 115, 0, 0.9)");
    glowGrad.addColorStop(0.3, "rgba(255, 60, 0, 0.5)");
    glowGrad.addColorStop(0.7, "rgba(123, 97, 255, 0.18)");
    glowGrad.addColorStop(1, "rgba(123, 97, 255, 0)");
    ctx.beginPath();
    ctx.ellipse(0, 0, bh.accretionRadius, bh.accretionRadius * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();
    ctx.restore();

    // Physics step
    const particles = particlesRef.current;
    let nearForce = 0;

    particles.forEach((p, idx) => {
      if (p.isConsumed) {
        p.consumeTimer += 0.05;
        if (p.consumeTimer >= 1.0) {
          particles[idx] = makeParticle(w, h, bh.pos.x, bh.pos.y);
          return;
        }

        ctx.beginPath();
        const pSize = p.radius * (1 - p.consumeTimer);
        ctx.arc(p.pos.x, p.pos.y, pSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 115, 0, ${1 - p.consumeTimer})`;
        ctx.fill();
        return;
      }

      // Gravitational force vector
      const toBh = vec2Sub(bh.pos, p.pos);
      const d = vec2Mag(toBh);

      if (d < bh.radius) {
        p.isConsumed = true;
        consumedRef.current++;
        setConsumed(consumedRef.current);
        if (consumedRef.current === 50) showToast("Achievement: Spatially Starved 50 particles!");
        if (consumedRef.current === 200) showToast("Achievement: Devourer of Worlds (200 particles consumed)!");
        return;
      }

      const forceMag = (G * bh.mass * p.mass) / (d * d);
      if (forceMag > nearForce) nearForce = forceMag;

      const fDir = vec2Norm(toBh);
      const accel = vec2Scale(fDir, forceMag / p.mass);

      p.vel = vec2Add(p.vel, accel);
      p.pos = vec2Add(p.pos, p.vel);

      // Orbital boundary wrap
      if (p.pos.x < -100 || p.pos.x > w + 100 || p.pos.y < -100 || p.pos.y > h + 100) {
        particles[idx] = makeParticle(w, h, bh.pos.x, bh.pos.y);
        return;
      }

      // Trail
      if (trailsRef.current && !reduced) {
        p.trail.push({ ...p.pos });
        if (p.trail.length > 10) p.trail.shift();
      } else {
        p.trail = [];
      }

      // Color scheme based on colorType
      const pr = p.colorType === 0 ? 255 : p.colorType === 1 ? 123 : 255;
      const pg = p.colorType === 0 ? 160 : p.colorType === 1 ? 97 : 220;
      const pb = p.colorType === 0 ? 60 : p.colorType === 1 ? 255 : 255;

      // Draw trail
      if (p.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let i = 1; i < p.trail.length; i++) {
          ctx.lineTo(p.trail[i].x, p.trail[i].y);
        }
        ctx.strokeStyle = `rgba(${pr},${pg},${pb},0.15)`;
        ctx.lineWidth = p.radius * 0.6;
        ctx.stroke();
      }

      // Gravitational lensing light rings around horizon boundary
      if (d < bh.radius * 2.5) {
        const ringAlpha = mapRange(d, bh.radius, bh.radius * 2.5, 0.45, 0);
        if (ringAlpha > 0) {
          ctx.beginPath();
          ctx.arc(p.pos.x, p.pos.y, p.radius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 180, 50, ${ringAlpha})`;
          ctx.fill();
        }
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.pos.x, p.pos.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${pr},${pg},${pb},${p.opacity})`;
      ctx.fill();
    });

    if (nearForce > 0) setNearestForce(nearForce.toExponential(2));

    // Apply pixel radial lens distortion buffer around bh (200px radius)
    if (!reduced) {
      applyLensing(ctx, bh.pos.x, bh.pos.y, bh.radius, 200);
    } else {
      // Non-lensed horizon fallback
      ctx.beginPath();
      ctx.arc(bh.pos.x, bh.pos.y, bh.radius, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();
    }

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

  // Pointer interactions
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
    if (vec2Dist(pos, bhRef.current.pos) < bhRef.current.radius * 2) {
      bhRef.current.isDragging = true;
      dragCountRef.current++;
      if (dragCountRef.current === 10) {
        showToast("Achievement Unlocked: Dragged 10 times!");
      }
    } else {
      // Click burst: 12 particles
      showToast("Achievement Unlocked: Created a burst of particles!");
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const speed = 3 + Math.random() * 3;
        const p = makeParticle(sizeRef.current.w, sizeRef.current.h, bhRef.current.pos.x, bhRef.current.pos.y);
        p.pos = { ...pos };
        p.vel = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
        p.trail = [];
        particlesRef.current.push(p);
        if (particlesRef.current.length > particleCountRef.current + 20) {
          particlesRef.current.shift();
        }
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const pos = getCanvasPos(e);
    mouseRef.current = pos;
    if (bhRef.current.isDragging) bhRef.current.pos = pos;
  };

  const handlePointerUp = () => { bhRef.current.isDragging = false; };

  // Panel controls sync
  const handleMassChange = (v: number) => {
    setMassSlider(v);
    bhRef.current.mass = v * 5e12;
  };

  const handleParticleCountChange = (v: number) => {
    setParticleCount(v);
    const { w, h } = sizeRef.current;
    const cx = bhRef.current.pos.x, cy = bhRef.current.pos.y;
    while (particlesRef.current.length < v) particlesRef.current.push(makeParticle(w, h, cx, cy));
    if (particlesRef.current.length > v) particlesRef.current.splice(v);
  };

  const handleTrailsChange = (v: boolean) => {
    setTrailsEnabled(v);
  };

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "55vh", background: "var(--bg-base)" }}>
        {/* 30s Narrative captions display */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 5,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            border: "1px solid var(--border)",
            padding: "8px 18px",
            borderRadius: 20,
            pointerEvents: "none",
            textAlign: "center",
            width: "max-content",
            maxWidth: "90%",
            boxSizing: "border-box"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 13,
              color: "var(--text-primary)",
              letterSpacing: "0.03em",
            }}
          >
            {CAPTIONS[captionIndex]}
          </span>
        </div>

        {/* Achievement Toast Stack */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            pointerEvents: "none",
          }}
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{
                background: "rgba(123, 97, 255, 0.95)",
                border: "1px solid #7b61ff",
                color: "#ffffff",
                padding: "12px 20px",
                borderRadius: 8,
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 500,
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                animation: "toastSlideIn 300ms ease forwards",
              }}
            >
              <style>{`
                @keyframes toastSlideIn {
                  from { transform: translateY(20px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }
              `}</style>
              🏆 {toast.message}
            </div>
          ))}
        </div>

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

        <FloatingPanel id="bh-controls" title="SINGULARITY" defaultPosition="top-right">
          <PanelSlider label="Mass" min={1} max={100} step={1} value={massSlider} onChange={handleMassChange} unit="×10¹²" />
          <PanelSlider label="Particles" min={20} max={150} step={10} value={particleCount} onChange={handleParticleCountChange} />
          <PanelToggle label="Trails" value={trailsEnabled} onChange={handleTrailsChange} />
          <PanelDivider />
          <PanelDisplay label="PARTICLES CONSUMED" value={consumed} large />
          <PanelDisplay label="GRAVITATIONAL FORCE" value={nearestForce} />
        </FloatingPanel>
      </div>
    </RealmLayout>
  );
}
