"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelDisplay, PanelDivider } from "@/components/realms/FloatingPanel";
import { clamp, prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "relativistic-travel")!;

function calcDilation(velocityPct: number) {
  const v = clamp(velocityPct / 100, 0, 0.99999);
  const gamma = 1 / Math.sqrt(1 - v * v);
  const rocketTimeRatio = 1 / gamma;
  return { gamma, rocketTimeRatio, earthYearsPerRocketYear: gamma };
}

function padTime(n: number) { return String(Math.floor(n)).padStart(2, "0"); }

export default function RelativisticTravel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<(ts: number) => void>(() => {});
  const sizeRef = useRef({ w: 0, h: 0 });

  const [velocity, setVelocity] = useState(50);
  const velocityRef = useRef(50);
  const earthTimeRef = useRef(0);
  const rocketTimeRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const reducedRef = useRef(false);

  const [dilation, setDilation] = useState(() => calcDilation(50));
  const [earthDisplay, setEarthDisplay] = useState("00:00:00");
  const [rocketDisplay, setRocketDisplay] = useState("00:00:00");

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
  }, []));

  // Sync refs to avoid unnecessary re-triggers
  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  const drawClock = useCallback((
    ctx: CanvasRenderingContext2D,
    cx: number, cy: number,
    r: number,
    angleRad: number,
    color: string,
    label: string,
    isDark: boolean
  ) => {
    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.1)" : "rgba(26,26,46,0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hour/minute ticks
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8));
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.25)" : "rgba(26,26,46,0.15)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Second hand
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angleRad - Math.PI / 2) * (r - 10), cy + Math.sin(angleRad - Math.PI / 2) * (r - 10));
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // Label
    ctx.font = "12px var(--font-ui)";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.5)" : "rgba(26,26,46,0.6)";
    ctx.textAlign = "center";
    ctx.fillText(label, cx, cy + r + 22);
  }, []);

  const render = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    const reduced = reducedRef.current;
    const isDark = !document.documentElement.classList.contains("light");

    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(renderRef.current);
      return;
    }

    // Delta time in seconds
    const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
    lastTsRef.current = ts;

    const vel = velocityRef.current;
    const { rocketTimeRatio } = calcDilation(vel);

    if (!reduced) {
      earthTimeRef.current += dt;
      rocketTimeRef.current += dt * rocketTimeRatio;
    }

    const eT = earthTimeRef.current;
    const rT = rocketTimeRef.current;

    // Background
    ctx.fillStyle = isDark ? "#06060A" : "#F4F3EF";
    ctx.fillRect(0, 0, w, h);

    // Divider
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(w / 2, 0);
    ctx.lineTo(w / 2, h);
    ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(26,26,46,0.12)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);

    // Section labels
    ctx.font = "11px var(--font-ui)";
    ctx.textAlign = "center";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.3)" : "rgba(26,26,46,0.4)";
    ctx.fillText("EARTH", w / 4, 30);
    ctx.fillText("ROCKET", w * 3 / 4, 30);

    // Stars (left: static, right: streaks at high vel)
    for (let i = 0; i < 60; i++) {
      const sx = (i * 73.1 + 10) % (w / 2 - 20);
      const sy = (i * 51.7 + 30) % (h - 100) + 50;
      const highVel = vel > 90;
      if (highVel) {
        const streakLen = (vel - 90) * 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - streakLen, sy);
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(26,26,46,0.1)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, 0.7, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.18)" : "rgba(26,26,46,0.07)";
        ctx.fill();
      }
      // Right stars with blueshift
      const rsx = w / 2 + (i * 93.7 + 15) % (w / 2 - 20);
      ctx.beginPath();
      ctx.arc(rsx, sy, 0.7, 0, Math.PI * 2);
      const blueShift = vel / 100;
      ctx.fillStyle = isDark
        ? `rgba(${Math.round(100 - blueShift * 80)},${Math.round(150 + blueShift * 50)},255,0.25)`
        : `rgba(${Math.round(40 + blueShift * 30)},${Math.round(100 + blueShift * 80)},230,0.25)`;
      ctx.fill();
    }

    // Velocity indicator between clocks
    const vText = `${vel.toFixed(2)}% c`;
    ctx.font = "bold 14px var(--font-mono)";
    ctx.textAlign = "center";
    ctx.fillStyle = "#4B8EF1";
    ctx.fillText(vText, w / 2, h / 2 - 80);
    ctx.font = "12px var(--font-mono)";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(26,26,46,0.5)";
    ctx.fillText(`γ = ${calcDilation(vel).gamma.toFixed(4)}`, w / 2, h / 2 - 60);

    // Clocks
    const clockR = Math.min(80, w / 8, h / 4);
    const earthAngle = (eT / 60) * Math.PI * 2;
    const rocketAngle = (rT / 60) * Math.PI * 2;
    drawClock(ctx, w / 4, h / 2, clockR, earthAngle, "#4B8EF1", "EARTH TIME", isDark);
    drawClock(ctx, w * 3 / 4, h / 2, clockR, rocketAngle, "#7B61FF", "ROCKET TIME", isDark);

    // Digital readout
    const eH = padTime(eT / 3600); const eM = padTime((eT % 3600) / 60); const eS = padTime(eT % 60);
    const rH = padTime(rT / 3600); const rM = padTime((rT % 3600) / 60); const rS = padTime(rT % 60);
    setEarthDisplay(`${eH}:${eM}:${eS}`);
    setRocketDisplay(`${rH}:${rM}:${rS}`);

    ctx.font = "18px var(--font-mono)";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.75)" : "rgba(26,26,46,0.8)";
    ctx.textAlign = "center";
    ctx.fillText(`${eH}:${eM}:${eS}`, w / 4, h / 2 + clockR + 50);
    ctx.fillText(`${rH}:${rM}:${rS}`, w * 3 / 4, h / 2 + clockR + 50);

    // After 1 year comparison
    const rocketYr = (1 / calcDilation(vel).gamma).toFixed(4);
    ctx.font = "13px var(--font-ui)";
    ctx.fillStyle = isDark ? "rgba(255,255,255,0.35)" : "rgba(26,26,46,0.5)";
    ctx.textAlign = "center";
    ctx.fillText(`After 1 Earth year at this speed: the rocket crew ages ${rocketYr} years`, w / 2, h - 30);

    rafRef.current = requestAnimationFrame(renderRef.current);
  }, [drawClock]);

  useEffect(() => {
    renderRef.current = render;
    reducedRef.current = prefersReducedMotion();
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  const PRESETS = [10, 50, 90, 99, 99.9];

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, width: "100%", boxSizing: "border-box" }}>
          {/* Presets */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { setVelocity(p); setDilation(calcDilation(p)); }}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  padding: "4px 12px",
                  borderRadius: 100,
                  border: "1px solid var(--border)",
                  background: Math.abs(velocity - p) < 0.01 ? "color-mix(in srgb, var(--accent-cosmos) 20%, transparent)" : "transparent",
                  color: "var(--text-primary)",
                  cursor: "pointer"
                }}
              >
                {p}% c
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>VELOCITY (% OF LIGHT SPEED)</div>
          <input
            type="range"
            min={0}
            max={99.99}
            step={0.01}
            value={velocity}
            onChange={e => { const v = Number(e.target.value); setVelocity(v); setDilation(calcDilation(v)); }}
            style={{ width: "100%", height: 8, cursor: "pointer", accentColor: "var(--accent-cosmos)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)" }}>
            <span>0% c (Stationary)</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--text-primary)", fontWeight: "bold" }}>{velocity.toFixed(2)}% c</span>
            <span>99.99% c (Near Light)</span>
          </div>
        </div>
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "50vh", background: "var(--bg-base)" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      <FloatingPanel id="rt-controls" title="RELATIVITY" defaultPosition="top-right">
        <PanelDisplay label="LORENTZ FACTOR (γ)" value={dilation.gamma.toFixed(6)} large />
        <PanelDisplay label="ROCKET TIME RATIO" value={`${dilation.rocketTimeRatio.toFixed(6)}×`} />
        <PanelDisplay label="EARTH YRS / ROCKET YR" value={dilation.earthYearsPerRocketYear.toFixed(2)} />
        <PanelDivider />
        <PanelDisplay label="APPROACHING C" value={velocity >= 99 ? "YES ⚠" : "NO"} />
      </FloatingPanel>
    </RealmLayout>
  );
}
