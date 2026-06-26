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
  vec2Add,
  vec2Scale,
  vec2Dist,
  clamp,
  prefersReducedMotion,
  getCSSVar,
} from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "time-dilation-slider")!;

type Atom = {
  pos: Vec2;
  status: "stable" | "decayed";
  decayTime: number;
};

type Ball = {
  pos: Vec2;
  vel: Vec2;
  radius: number;
};

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const ms = Math.floor((totalSeconds % 1) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export default function TimeDilationSlider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const renderRef = useRef<(ts: number) => void>(() => {});
  const sizeRef = useRef({ w: 0, h: 0 });

  // Relativistic States
  const [beta, setBetaState] = useState<number>(0.0); // v/c
  const betaRef = useRef<number>(0.0);
  const observerTimeRef = useRef<number>(0.0);
  const travelerTimeRef = useRef<number>(0.0);
  const lastTsRef = useRef<number | null>(null);
  const reducedRef = useRef<boolean>(false);

  // Twin Age parameters: 30 Earth years initial age.
  // We speed up time: 1 year (31,536,000s) passes every 15 seconds.
  const TIME_SPEEDUP = 31536000 / 15;
  const [observerAge, setObserverAge] = useState<number>(30.0);
  const [travelerAge, setTravelerAge] = useState<number>(30.0);

  // Ball & Atoms
  const ballRef = useRef<Ball>({ pos: { x: 0, y: 0 }, vel: { x: 2.0, y: 1.5 }, radius: 7 });
  const atomsRef = useRef<Atom[]>([]);
  const decayCountRef = useRef<number>(0);

  // Telemetry React states
  const [observerDisplay, setObserverDisplay] = useState<string>("00:00:00.000");
  const [travelerDisplay, setTravelerDisplay] = useState<string>("00:00:00.000");
  const [decayedCount, setDecayedCount] = useState<number>(0);
  const [gammaVal, setGammaVal] = useState<number>(1.0);

  const setBeta = (v: number) => {
    betaRef.current = v;
    setBetaState(v);
  };

  const calculateGamma = (v: number) => {
    if (v >= 1.0) return 100.0; // clamp near infinity
    return 1.0 / Math.sqrt(1.0 - v * v);
  };

  const init = useCallback(() => {
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) return;

    const isMobile = w < 768;

    let ballBoxX = w / 2 + 40;
    let ballBoxY = h / 2 - 140;
    let ballBoxW = w / 2 - 80;
    let ballBoxH = 120;

    if (isMobile) {
      ballBoxX = 20;
      ballBoxY = 220;
      ballBoxW = w - 40;
      ballBoxH = 100;
    }

    ballRef.current.pos = {
      x: ballBoxX + ballBoxW / 2,
      y: ballBoxY + 24 + (ballBoxH - 24) / 2,
    };

    let decayBoxX = w / 2 + 40;
    let decayBoxY = h / 2 + 20;
    let decayBoxW = w / 2 - 80;
    let decayBoxH = 120;

    if (isMobile) {
      decayBoxX = 20;
      decayBoxY = 340;
      decayBoxW = w - 40;
      decayBoxH = 100;
    }

    const columns = 10;
    const rows = 5;
    const atomsList: Atom[] = [];
    const spacingX = decayBoxW / (columns + 1);
    const spacingY = (decayBoxH - 24) / (rows + 1);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        atomsList.push({
          pos: {
            x: decayBoxX + (c + 1) * spacingX,
            y: decayBoxY + 24 + (r + 1) * spacingY,
          },
          status: "stable",
          decayTime: 0,
        });
      }
    }
    atomsRef.current = atomsList;
    decayCountRef.current = 0;
    setDecayedCount(0);
  }, []);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    init();
  }, [init]));

  const handleReset = useCallback(() => {
    observerTimeRef.current = 0;
    travelerTimeRef.current = 0;
    setObserverAge(30.0);
    setTravelerAge(30.0);
    init();
  }, [init]);

  const drawSectionPanel = useCallback(
    (ctx: CanvasRenderingContext2D, title: string, x: number, y: number, w: number, h: number) => {
      const isDark = !document.documentElement.classList.contains("light");
      ctx.save();
      // Panel outline box
      ctx.fillStyle = isDark ? "rgba(10, 10, 15, 0.45)" : "rgba(255, 255, 255, 0.55)";
      ctx.strokeStyle = "var(--border)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();
      ctx.stroke();

      // Heading banner overlay
      ctx.fillStyle = isDark ? "rgba(75, 142, 241, 0.08)" : "rgba(26,26,46,0.03)";
      ctx.beginPath();
      ctx.roundRect(x, y, w, 24, [8, 8, 0, 0]);
      ctx.fill();

      // Heading Text label
      ctx.font = "bold 9px var(--font-ui)";
      ctx.fillStyle = "var(--text-muted)";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(title.toUpperCase(), x + 10, y + 12);
      ctx.restore();
    },
    []
  );

  const drawAnalogClock = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      time: number,
      color: string,
      title: string
    ) => {
      const isDark = !document.documentElement.classList.contains("light");

      // Dial circle
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(26,26,46,0.05)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      // Tick markers (every 30 degrees)
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.18)" : "rgba(26,26,46,0.15)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 12; i++) {
        const theta = (i / 12) * Math.PI * 2;
        const tickLen = i % 3 === 0 ? 8 : 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(theta) * (r - tickLen), cy + Math.sin(theta) * (r - tickLen));
        ctx.lineTo(cx + Math.cos(theta) * r, cy + Math.sin(theta) * r);
        ctx.stroke();
      }

      // Hands angles
      const secAngle = ((time % 60) / 60) * Math.PI * 2 - Math.PI / 2;
      const minAngle = (((time / 60) % 60) / 60) * Math.PI * 2 - Math.PI / 2;
      const hourAngle = (((time / 3600) % 12) / 12) * Math.PI * 2 - Math.PI / 2;

      // Draw Hour Hand
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.7)" : "rgba(26,26,46,0.85)";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(hourAngle) * (r * 0.5), cy + Math.sin(hourAngle) * (r * 0.5));
      ctx.stroke();

      // Draw Minute Hand
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(26,26,46,0.55)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(minAngle) * (r * 0.75), cy + Math.sin(minAngle) * (r * 0.75));
      ctx.stroke();

      // Draw Second Hand (Coloured)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(secAngle) * (r * 0.85), cy + Math.sin(secAngle) * (r * 0.85));
      ctx.stroke();

      // Center pivot point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Display Label below
      ctx.font = "bold 9px var(--font-ui)";
      ctx.fillStyle = "var(--text-muted)";
      ctx.textAlign = "center";
      ctx.fillText(title.toUpperCase(), cx, cy + r + 15);
    },
    []
  );

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

      const v = betaRef.current;
      const gamma = calculateGamma(v);

      if (!reduced) {
        observerTimeRef.current += dt;
        travelerTimeRef.current += dt / gamma;
      }

      const obsTime = observerTimeRef.current;
      const travTime = travelerTimeRef.current;

      // Background reset
      ctx.fillStyle = getCSSVar("--bg-base") || (isDark ? "#06060A" : "#F4F3EF");
      ctx.fillRect(0, 0, w, h);

      const isMobile = w < 768;

      // Layout coordinate metrics inside left column
      let clockBoxX = 24;
      let clockBoxY = h / 2 - 140;
      let clockBoxW = w / 2 - 48;
      let clockBoxH = 280;

      if (isMobile) {
        clockBoxX = 20;
        clockBoxY = 20;
        clockBoxW = w - 40;
        clockBoxH = 180;
      }

      let ballBoxX = w / 2 + 24;
      let ballBoxY = h / 2 - 140;
      let ballBoxW = w / 2 - 48;
      let ballBoxH = 130;

      if (isMobile) {
        ballBoxX = 20;
        ballBoxY = 220;
        ballBoxW = w - 40;
        ballBoxH = 100;
      }

      let decayBoxX = w / 2 + 24;
      let decayBoxY = h / 2 + 10;
      let decayBoxW = w / 2 - 48;
      let decayBoxH = 130;

      if (isMobile) {
        decayBoxX = 20;
        decayBoxY = 340;
        decayBoxW = w - 40;
        decayBoxH = 100;
      }

      if (w === 0 || h === 0) {
        rafRef.current = requestAnimationFrame(renderRef.current);
        return;
      }

      // Render Layout section panels outline
      drawSectionPanel(ctx, "Time Flow comparison", clockBoxX, clockBoxY, clockBoxW, clockBoxH);
      drawSectionPanel(ctx, `Kinetic Motion (Dilation: 1/γ)`, ballBoxX, ballBoxY, ballBoxW, ballBoxH);
      drawSectionPanel(ctx, `Temporal Decay (Half-Life: 1/γ)`, decayBoxX, decayBoxY, decayBoxW, decayBoxH);

      // Render Analog Clocks
      const r = isMobile ? 40 : Math.min(60, clockBoxW / 4 - 24);
      const clockCenterY = clockBoxY + 24 + (clockBoxH - 24) / 2;
      const observerCX = clockBoxX + clockBoxW / 4;
      const travelerCX = clockBoxX + (clockBoxW * 3) / 4;

      drawAnalogClock(ctx, observerCX, clockCenterY - 10, r, obsTime, "var(--accent-cosmos)", "OBSERVER TIME (Earth)");
      drawAnalogClock(ctx, travelerCX, clockCenterY - 10, r, travTime, "var(--accent-scifi)", `TRAVELER TIME (Ship)`);

      // Bouncing ball velocity is dilated
      const ball = ballRef.current;
      if (!reduced) {
        ball.pos.x += (ball.vel.x * dt * 40) / gamma;
        ball.pos.y += (ball.vel.y * dt * 40) / gamma;

        const minX = ballBoxX + ball.radius;
        const maxX = ballBoxX + ballBoxW - ball.radius;
        const minY = ballBoxY + 24 + ball.radius;
        const maxY = ballBoxY + ballBoxH - ball.radius;

        if (ball.pos.x < minX) { ball.pos.x = minX; ball.vel.x *= -1; }
        else if (ball.pos.x > maxX) { ball.pos.x = maxX; ball.vel.x *= -1; }

        if (ball.pos.y < minY) { ball.pos.y = minY; ball.vel.y *= -1; }
        else if (ball.pos.y > maxY) { ball.pos.y = maxY; ball.vel.y *= -1; }
      }

      ctx.beginPath();
      ctx.arc(ball.pos.x, ball.pos.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "var(--accent-bio)";
      ctx.fill();

      // Isotopes decay chance decreases by 1/gamma
      const decayChancePerSec = 0.08;
      atomsRef.current.forEach((atom) => {
        if (!reduced && atom.status === "stable") {
          if (Math.random() < (decayChancePerSec * dt) / gamma) {
            atom.status = "decayed";
            atom.decayTime = 1.0;
            decayCountRef.current++;
          }
        } else if (!reduced && atom.status === "decayed" && atom.decayTime > 0) {
          atom.decayTime -= dt * 2.0;
          if (atom.decayTime < 0) atom.decayTime = 0;
        }

        ctx.beginPath();
        ctx.arc(atom.pos.x, atom.pos.y, 4, 0, Math.PI * 2);
        if (atom.status === "stable") {
          ctx.fillStyle = "var(--accent-utility-a)";
        } else {
          ctx.fillStyle = `rgba(232, 124, 124, ${atom.decayTime * 0.5})`;
        }
        ctx.fill();
      });

      // Synchronise Display times
      setObserverDisplay(formatTime(obsTime));
      setTravelerDisplay(formatTime(travTime));
      setDecayedCount(decayCountRef.current);
      setGammaVal(gamma);

      // Sync Twin Ages: 1 year (31,536,000 Earth seconds) passes in 15 observer seconds
      const obsYears = (obsTime * TIME_SPEEDUP) / 31536000;
      const travYears = (travTime * TIME_SPEEDUP) / 31536000;
      setObserverAge(30.0 + obsYears);
      setTravelerAge(30.0 + travYears);

      rafRef.current = requestAnimationFrame(renderRef.current);
    },
    [drawAnalogClock, drawSectionPanel]
  );

  useEffect(() => {
    renderRef.current = render;
    reducedRef.current = prefersReducedMotion();
    rafRef.current = requestAnimationFrame(render);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [render]);

  // Mission Velocity Presets
  const presets = [
    { label: "ISS (7.7 km/s)", val: 0.0000256 },
    { label: "Voyager 1 (17 km/s)", val: 0.000057 },
    { label: "Mars Mission (20 km/s)", val: 0.000067 },
    { label: "Lorentz Loop (86.6% c)", val: 0.866 },
    { label: "Lightspeed (99.9% c)", val: 0.999 },
  ];

  const ageDiffYears = observerAge - travelerAge;
  const ageDiffDays = ageDiffYears * 365.25;

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 20px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, width: "100%", boxSizing: "border-box" }}>
          {/* Mission presets pills */}
          <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-faint)" }}>
            Mission Speed Presets
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setBeta(p.val)}
                style={{
                  fontFamily: "var(--font-ui), sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "1px solid var(--border)",
                  background: Math.abs(beta - p.val) < 0.00001 ? "var(--accent-cosmos)" : "transparent",
                  color: Math.abs(beta - p.val) < 0.00001 ? "#ffffff" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 150ms",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Master Slider */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>
              <span>TRAVELER VELOCITY (v/c)</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-cosmos)", fontSize: 13, fontWeight: "bold" }}>
                {beta.toFixed(5)} c
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={0.9999}
              step={0.0001}
              value={beta}
              onChange={(e) => setBeta(Number(e.target.value))}
              style={{ width: "100%", height: 6, cursor: "pointer", accentColor: "var(--accent-cosmos)" }}
            />
          </div>
        </div>
      }
      resultsZone={
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, width: "100%" }}>
          {/* Twin Paradox Aging Tracker */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
            <h4 style={{ margin: "0 0 16px 0", fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Twin Paradox Aging Tracker
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Twin 1: Observer on Earth */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🌍</span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>Earth Twin</span>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, color: "var(--text-faint)" }}>Stationary Observer</span>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--accent-cosmos)", fontWeight: 600 }}>
                  {observerAge.toFixed(7)}
                </div>
              </div>

              {/* Twin 2: Traveler in Space */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>🚀</span>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-primary)" }}>Traveler Twin</span>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, color: "var(--text-faint)" }}>Dilated Astronaut</span>
                  </div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--accent-scifi)", fontWeight: 600 }}>
                  {travelerAge.toFixed(7)}
                </div>
              </div>

              <PanelDivider />

              {/* Age difference description */}
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Age Divergence Gap
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--text-primary)", fontWeight: 500, margin: "4px 0" }}>
                  +{ageDiffDays.toFixed(4)} Days
                </div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-muted)" }}>
                  ({(ageDiffYears * 365 * 24).toFixed(2)} hours elapsed difference)
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "340px", background: "var(--bg-base)" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      <FloatingPanel id="td-controls" title="RELATIVISTIC TELEMETRY" defaultPosition="top-right">
        <PanelDisplay label="OBSERVER TIME (EARTH)" value={observerDisplay} />
        <PanelDisplay label="TRAVELER TIME (SHIP)" value={travelerDisplay} />
        <PanelDivider />
        <PanelDisplay label="LORENTZ FACTOR (γ)" value={gammaVal.toFixed(6)} />
        <PanelDisplay label="ISOTOPES DECAYED" value={`${decayedCount} / 50`} />
        <button
          onClick={handleReset}
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
          Reset Simulation
        </button>
      </FloatingPanel>
    </RealmLayout>
  );
}
