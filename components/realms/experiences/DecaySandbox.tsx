"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Isotope definitions ──────────────────────────────────────────────────────

type Isotope = {
  name: string;
  symbol: string;
  halfLifeYrs: number;
  use: string;
  color: string;
};

const ISOTOPES: Isotope[] = [
  { name: "Iodine-131",    symbol: "I-131",   halfLifeYrs: 8.02 / 365,         use: "Medical imaging & thyroid therapy",  color: "#A855F7" },
  { name: "Polonium-210",  symbol: "Po-210",  halfLifeYrs: 138 / 365,          use: "Famous poisoning, static eliminators", color: "#EF4444" },
  { name: "Cesium-137",    symbol: "Cs-137",  halfLifeYrs: 30.17,               use: "Nuclear fallout, medical devices",    color: "#F59E0B" },
  { name: "Carbon-14",     symbol: "C-14",    halfLifeYrs: 5_730,               use: "Radiocarbon dating of organic matter", color: "#22D3EE" },
  { name: "Radium-226",    symbol: "Ra-226",  halfLifeYrs: 1_600,               use: "Marie Curie's element, early medicine", color: "#FB7185" },
  { name: "Plutonium-239", symbol: "Pu-239",  halfLifeYrs: 24_100,              use: "Nuclear weapons & reactors",          color: "#84CC16" },
  { name: "Uranium-235",   symbol: "U-235",   halfLifeYrs: 703_800_000,         use: "Nuclear fission, power plants",       color: "#34D399" },
];

// ─── Speed presets (sim-seconds per rAF frame at 60fps) ──────────────────────
// We want to see ~3 half-lives play out in ~10s of wall-clock time.
// dt_per_frame = (3 * halfLifeSecs) / (10 * 60 frames)
// We apply this as a multiplier on top of that base.

const SPEED_MULT: Record<string, number> = { Slow: 0.4, Normal: 1, Fast: 3 };

// ─── Canvas dimensions ────────────────────────────────────────────────────────

const CANVAS_W = 560;
const CANVAS_H = 260;
const ATOM_R   = 6;
const GAP      = 3;

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtRealTime(simYrs: number, halfLifeYrs: number): string {
  if (simYrs < 1 / 365 / 24) return `${(simYrs * 365 * 24 * 60).toFixed(1)} min`;
  if (simYrs < 1 / 365)      return `${(simYrs * 365 * 24).toFixed(1)} hrs`;
  if (simYrs < 1)             return `${(simYrs * 365).toFixed(1)} days`;
  if (simYrs < 1_000)         return `${simYrs.toFixed(1)} yrs`;
  if (simYrs < 1_000_000)     return `${(simYrs / 1000).toFixed(2)}k yrs`;
  if (simYrs < 1_000_000_000) return `${(simYrs / 1_000_000).toFixed(2)}M yrs`;
  return `${(simYrs / 1_000_000_000).toFixed(2)}B yrs`;
}

function fmtActivity(lambda: number, n: number): string {
  // Bq = decays per second; lambda is per-second
  const bq = lambda * n;
  if (bq < 1e3)  return `${bq.toFixed(1)} Bq`;
  if (bq < 1e6)  return `${(bq / 1e3).toFixed(2)} kBq`;
  if (bq < 1e9)  return `${(bq / 1e6).toFixed(2)} MBq`;
  return `${(bq / 1e9).toFixed(2)} GBq`;
}

// ─── Particle canvas ──────────────────────────────────────────────────────────

type Flash = { x: number; y: number; born: number };

function AtomCanvas({
  atoms,
  cols,
  rows,
  color,
  accent,
  flashes,
  now,
}: {
  atoms: boolean[];
  cols: number;
  rows: number;
  color: string;
  accent: string;
  flashes: Flash[];
  now: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = "#06060A";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    const startX = (CANVAS_W - cols * (ATOM_R * 2 + GAP) + GAP) / 2;
    const startY = (CANVAS_H - rows * (ATOM_R * 2 + GAP) + GAP) / 2;

    atoms.forEach((alive, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx  = startX + col * (ATOM_R * 2 + GAP) + ATOM_R;
      const cy  = startY + row * (ATOM_R * 2 + GAP) + ATOM_R;

      if (alive) {
        // Glow
        ctx.beginPath();
        ctx.arc(cx, cy, ATOM_R + 3, 0, Math.PI * 2);
        ctx.fillStyle = `${color}22`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(cx, cy, ATOM_R, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Decayed — dim dot
        ctx.beginPath();
        ctx.arc(cx, cy, ATOM_R * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fill();
      }
    });

    // Draw flash rings
    const FLASH_DURATION = 400; // ms
    for (const f of flashes) {
      const age = now - f.born;
      if (age > FLASH_DURATION) continue;
      const progress = age / FLASH_DURATION;
      const radius   = ATOM_R + progress * 20;
      const alpha    = (1 - progress) * 0.8;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Count labels
    const alive = atoms.filter(Boolean).length;
    ctx.font = `700 10px var(--font-ui, sans-serif)`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "right";
    ctx.fillText(`${alive} / ${atoms.length}`, CANVAS_W - 10, CANVAS_H - 10);

  }, [atoms, color, accent, flashes, now, cols, rows]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_W}
      height={CANVAS_H}
      className="w-full"
      style={{ display: "block", height: CANVAS_H }}
    />
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent: string }) {
  return (
    <div
      className="flex flex-col gap-1 p-4"
      style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
    >
      <span className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint">{label}</span>
      <span className="font-mono text-lg font-black tabular-nums" style={{ color: accent }}>{value}</span>
      <span className="text-[10px] font-sans text-text-faint">{sub}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type SimState = "idle" | "running" | "paused" | "done";

export default function DecaySandbox() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "decay-sandbox";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [isotope,    setIsotope]    = useState<Isotope>(ISOTOPES[0]);
  const [atomCount,  setAtomCount]  = useState(80);
  const [speed,      setSpeed]      = useState<keyof typeof SPEED_MULT>("Normal");
  const [simState,   setSimState]   = useState<SimState>("idle");

  // Simulation state in refs (mutated each frame, not state)
  const atomsRef     = useRef<boolean[]>([]);
  const simYrsRef    = useRef(0);
  const flashesRef   = useRef<Flash[]>([]);
  const rafRef       = useRef(0);
  const lastTsRef    = useRef(0);

  // Render trigger — updated ~10 per second
  const [renderTick, setRenderTick] = useState(0);
  const renderRef    = useRef(0);

  // Derived layout
  const cols = Math.ceil(Math.sqrt(atomCount * (CANVAS_W / CANVAS_H)));
  const rows = Math.ceil(atomCount / cols);

  // Position lookup for flashes
  const startX = (CANVAS_W - cols * (ATOM_R * 2 + GAP) + GAP) / 2;
  const startY = (CANVAS_H - rows * (ATOM_R * 2 + GAP) + GAP) / 2;

  const initSim = useCallback(() => {
    atomsRef.current  = Array(atomCount).fill(true);
    simYrsRef.current = 0;
    flashesRef.current = [];
    lastTsRef.current  = 0;
    setRenderTick(0);
  }, [atomCount]);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
  }, []);

  const startLoop = useCallback(() => {
    const halfLifeSecs = isotope.halfLifeYrs * 365.25 * 86400;
    const lambda       = Math.LN2 / halfLifeSecs; // per sim-second
    // dt_per_frame to see ~3 half-lives in ~8s wall time
    const baseDtSecs   = (3 * halfLifeSecs) / (8 * 60);
    const mult         = SPEED_MULT[speed];

    const tick = (ts: number) => {
      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const wallDt  = Math.min((ts - lastTsRef.current) / 1000, 0.1); // cap at 100ms
      lastTsRef.current = ts;

      const simDt = baseDtSecs * mult * wallDt * 60; // scale by actual wall frame time

      simYrsRef.current += simDt / (365.25 * 86400);

      // Decay each atom
      const P = 1 - Math.exp(-lambda * simDt);
      const atoms = atomsRef.current;
      const nowMs = Date.now();
      for (let i = 0; i < atoms.length; i++) {
        if (atoms[i] && Math.random() < P) {
          atoms[i] = false;
          // Record flash position
          const col = i % cols;
          const row = Math.floor(i / cols);
          flashesRef.current.push({
            x: startX + col * (ATOM_R * 2 + GAP) + ATOM_R,
            y: startY + row * (ATOM_R * 2 + GAP) + ATOM_R,
            born: nowMs,
          });
        }
      }
      // Prune old flashes
      flashesRef.current = flashesRef.current.filter(f => nowMs - f.born < 500);

      // Trigger render ~10fps
      renderRef.current += wallDt;
      if (renderRef.current > 0.08) {
        renderRef.current = 0;
        setRenderTick((t) => t + 1);
      }

      const aliveCount = atoms.filter(Boolean).length;
      if (aliveCount === 0) {
        setSimState("done");
        setRenderTick((t) => t + 1);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
  }, [isotope, speed, cols, startX, startY]);

  const handleStart = useCallback(() => {
    initSim();
    setSimState("running");
  }, [initSim]);

  const handlePause = useCallback(() => {
    stopLoop();
    setSimState("paused");
  }, [stopLoop]);

  const handleResume = useCallback(() => {
    lastTsRef.current = 0;
    setSimState("running");
  }, []);

  const handleReset = useCallback(() => {
    stopLoop();
    initSim();
    setSimState("idle");
  }, [stopLoop, initSim]);

  // Start/stop loop based on simState
  useEffect(() => {
    if (simState === "running") {
      startLoop();
      return () => stopLoop();
    }
  }, [simState, startLoop, stopLoop]);

  // Cleanup on unmount
  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const atoms    = atomsRef.current;
  const simYrs   = simYrsRef.current;
  const flashes  = flashesRef.current;
  const aliveN   = atoms.filter(Boolean).length;
  const halfLifeSecs = isotope.halfLifeYrs * 365.25 * 86400;
  const lambdaPerSec = Math.LN2 / halfLifeSecs;
  const halfLivesEl  = simYrs > 0 ? simYrs / isotope.halfLifeYrs : 0;
  const safeYrs      = isotope.halfLifeYrs * 10;
  void renderTick;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          {/* Isotope selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Isotope
            </label>
            <div className="flex flex-col gap-1.5">
              {ISOTOPES.map((iso) => (
                <button
                  key={iso.symbol}
                  onClick={() => { setIsotope(iso); handleReset(); }}
                  className="flex items-center gap-2 px-3 py-2.5 text-left transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: isotope.symbol === iso.symbol ? `${iso.color}18` : "var(--bg-card)",
                    boxShadow: isotope.symbol === iso.symbol ? `2px 2px 0 ${iso.color}55` : "none",
                  }}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: iso.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className="block font-mono text-xs font-bold"
                      style={{ color: isotope.symbol === iso.symbol ? iso.color : "var(--text-muted)" }}
                    >
                      {iso.symbol}
                    </span>
                    <span className="block text-[9px] font-sans text-text-faint truncate">{iso.use}</span>
                  </div>
                  <span className="text-[9px] font-mono text-text-faint flex-shrink-0">
                    {fmtRealTime(isotope.halfLifeYrs, isotope.halfLifeYrs)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Atom count */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
                Atoms
              </label>
              <span className="font-mono text-xs" style={{ color: accent }}>{atomCount}</span>
            </div>
            <input
              type="range"
              min={10}
              max={200}
              step={10}
              value={atomCount}
              onChange={(e) => { setAtomCount(Number(e.target.value)); handleReset(); }}
              className="w-full accent-current"
              style={{ accentColor: accent }}
            />
            <div className="flex justify-between text-[9px] font-sans text-text-faint">
              <span>10</span><span>200</span>
            </div>
          </div>

          {/* Speed */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Simulation speed
            </label>
            <div className="flex gap-1.5">
              {(["Slow", "Normal", "Fast"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className="flex-1 py-2 text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: speed === s ? accent : "var(--bg-card)",
                    color: speed === s ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: speed === s ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {simState === "idle" || simState === "done" ? (
              <button
                onClick={handleStart}
                className="flex-1 calculate-btn"
                style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
              >
                {simState === "done" ? "Restart" : "Start Simulation"}
              </button>
            ) : simState === "running" ? (
              <button
                onClick={handlePause}
                className="flex-1 calculate-btn"
                style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)", boxShadow: "3px 3px 0 var(--border)" }}
              >
                Pause
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex-1 calculate-btn"
                style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
              >
                Resume
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 text-[11px] font-sans font-bold uppercase tracking-wider transition-all"
              style={{ border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-muted)" }}
            >
              Reset
            </button>
          </div>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {/* Particle canvas */}
          <div style={{ background: "#06060A", borderBottom: "2px solid var(--border)" }}>
            {simState !== "idle" ? (
              <AtomCanvas
                atoms={atomsRef.current.slice()}
                cols={cols}
                rows={rows}
                color={isotope.color}
                accent={accent}
                flashes={flashes}
                now={Date.now()}
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center"
                style={{ height: CANVAS_H, background: "#06060A" }}
              >
                <div
                  className="w-12 h-12 rounded-full mb-4"
                  style={{ background: `${isotope.color}33`, border: `2px solid ${isotope.color}66` }}
                />
                <p className="font-mono text-xs text-text-faint">Select an isotope and start the simulation</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="p-4 md:p-5 flex flex-col gap-4">
            {/* Isotope info */}
            <div
              className="p-4"
              style={{ border: `2px solid ${isotope.color}44`, background: `${isotope.color}0A`, boxShadow: `2px 2px 0 ${isotope.color}22` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ background: isotope.color }} />
                <span className="font-mono text-sm font-bold" style={{ color: isotope.color }}>{isotope.name}</span>
              </div>
              <p className="text-[11px] font-sans text-text-muted">{isotope.use}</p>
              <p className="text-[10px] font-sans text-text-faint mt-1">
                Half-life: <span className="font-mono">{fmtRealTime(isotope.halfLifeYrs, isotope.halfLifeYrs)}</span>
              </p>
            </div>

            {/* Live stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                label="Atoms remaining"
                value={`${aliveN} / ${atomCount}`}
                sub={simState !== "idle" ? `${((aliveN / atomCount) * 100).toFixed(1)}% intact` : "—"}
                accent={accent}
              />
              <StatCard
                label="Half-lives elapsed"
                value={simState !== "idle" ? halfLivesEl.toFixed(2) : "—"}
                sub="since simulation start"
                accent={accent}
              />
              <StatCard
                label="Simulated time"
                value={simState !== "idle" ? fmtRealTime(simYrs, isotope.halfLifeYrs) : "—"}
                sub="real-world equivalent"
                accent={accent}
              />
              <StatCard
                label="Activity"
                value={simState !== "idle" && aliveN > 0 ? fmtActivity(lambdaPerSec, aliveN) : "—"}
                sub="decays per second"
                accent={accent}
              />
              <StatCard
                label="Safe in (10 half-lives)"
                value={fmtRealTime(safeYrs, isotope.halfLifeYrs)}
                sub="effectively inert at ~1/1024"
                accent={accent}
              />
              <StatCard
                label="Status"
                value={simState === "done" ? "Complete" : simState === "running" ? "Decaying" : simState === "paused" ? "Paused" : "Ready"}
                sub={simState === "done" ? "all atoms decayed" : `${atomCount} atoms loaded`}
                accent={simState === "done" ? "var(--accent-utility-a)" : accent}
              />
            </div>
          </div>
        </div>
      }
    />
  );
}
