"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { BirthDatePicker } from "@/components/ui";

// ─── Planet definitions ───────────────────────────────────────────────────────

type Planet = {
  name: string;
  period: number;    // Earth years per orbit (J2000 mean values)
  orbitR: number;    // SVG orbit radius — visual only, not to scale
  size: number;      // SVG planet circle radius
  color: string;
  hasRings: boolean;
  fact: string;
};

const PLANETS: Planet[] = [
  { name: "Mercury", period: 0.2408467,   orbitR: 42,  size: 3.5,  color: "#9E9E9E", hasRings: false, fact: "One orbit every 88 Earth days — the fastest planet." },
  { name: "Venus",   period: 0.61519726,  orbitR: 64,  size: 5.5,  color: "#E8C97F", hasRings: false, fact: "A Venusian day is longer than its year." },
  { name: "Earth",   period: 1.0,          orbitR: 88,  size: 6.0,  color: "#4B8EF1", hasRings: false, fact: "Your home planet. The reference for all measurement." },
  { name: "Mars",    period: 1.8808476,   orbitR: 114, size: 4.5,  color: "#C1440E", hasRings: false, fact: "One Mars year is 687 Earth days — nearly two of ours." },
  { name: "Jupiter", period: 11.862615,   orbitR: 149, size: 10.5, color: "#C9A06B", hasRings: false, fact: "The largest planet. Almost 12 Earth years per orbit." },
  { name: "Saturn",  period: 29.457159,   orbitR: 182, size: 8.5,  color: "#E8D191", hasRings: true,  fact: "The ringed giant. Nearly 30 Earth years per orbit." },
  { name: "Uranus",  period: 84.016846,   orbitR: 212, size: 7.0,  color: "#7DE8E8", hasRings: false, fact: "Ice giant. 84 Earth years to complete one orbit." },
  { name: "Neptune", period: 164.79132,   orbitR: 241, size: 7.0,  color: "#3F54BA", hasRings: false, fact: "The farthest planet. One orbit takes 165 Earth years." },
];

// Visual animation — seconds per full screen orbit (not physically accurate)
const VISUAL_SPEEDS: Record<string, number> = {
  Mercury: 5, Venus: 9, Earth: 14, Mars: 22,
  Jupiter: 35, Saturn: 52, Uranus: 72, Neptune: 98,
};

// ─── SVG constants ────────────────────────────────────────────────────────────

const SVG_W  = 580;
const SVG_H  = 296;
const CX     = SVG_W / 2;
const CY     = SVG_H / 2;
const TILT   = 0.38; // Y-axis compression for perspective ellipses

// Deterministic star field using LCG hash — never regenerates
const STAR_FIELD = Array.from({ length: 68 }, (_, i) => {
  const h  = ((i + 1) * 2654435761) >>> 0;
  const h2 = (h  * 1664525 + 1013904223) >>> 0;
  const h3 = (h2 * 1664525 + 1013904223) >>> 0;
  return {
    x: ((h  % 10000) / 10000) * SVG_W,
    y: ((h2 % 10000) / 10000) * SVG_H,
    r: 0.4 + ((h3 % 100) / 100) * 0.7,
    o: 0.1 + ((h  % 100) / 100) * 0.42,
  };
});


// ─── Calculations ─────────────────────────────────────────────────────────────

function calcAges(birth: Date) {
  const now   = new Date();
  const ms    = Math.max(0, now.getTime() - birth.getTime());
  const secs  = ms / 1000;
  const days  = ms / 86_400_000;
  const years = days / 365.25;

  return {
    years,
    days:         Math.floor(days),
    hours:        Math.floor(secs / 3600),
    planetary:    PLANETS.map(p => ({ ...p, ageOnPlanet: years / p.period })),
    galacticFrac: years / 225_000_000,
    universePerc: (years / 13_800_000_000) * 100,
    lightYears:   (secs * 251) / 9_460_730_472_580.8,
    birthPhotons: years,
    moonOrbits:   Math.floor(days / 27.32166),
    heartbeats:   Math.floor(days * 24 * 60 * 80),
  };
}

type Ages = ReturnType<typeof calcAges>;

function fmtPlanetAge(n: number): string {
  if (n < 0.001) return "<0.001";
  if (n < 1)     return n.toFixed(3);
  if (n < 10)    return n.toFixed(2);
  if (n < 1000)  return n.toFixed(1);
  return n.toFixed(0);
}

function fmtBig(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(2) + "M";
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// ─── Component ────────────────────────────────────────────────────────────────

type PlanetRefs = { planet: SVGCircleElement | null; ring: SVGEllipseElement | null };

export default function SolarSystemAge() {
  const pathname = usePathname();
  const slug  = pathname.split("/").pop() ?? "solar-system-age";
  const realm = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [ages,      setAges]      = useState<Ages | null>(null);
  const [error,     setError]     = useState("");

  // Direct DOM refs for animation — zero re-renders per frame
  const domRefs = useRef<Record<string, PlanetRefs>>({});
  const animRef = useRef<number>(0);
  const t0Ref   = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    t0Ref.current = Date.now();

    const tick = () => {
      const t = (Date.now() - t0Ref.current) / 1000;
      for (const p of PLANETS) {
        const refs = domRefs.current[p.name];
        if (!refs) continue;
        const angle = (t / VISUAL_SPEEDS[p.name]) * Math.PI * 2;
        const px    = (CX + Math.cos(angle) * p.orbitR).toFixed(2);
        const py    = (CY + Math.sin(angle) * p.orbitR * TILT).toFixed(2);
        refs.planet?.setAttribute("cx", px);
        refs.planet?.setAttribute("cy", py);
        refs.ring?.setAttribute("cx", px);
        refs.ring?.setAttribute("cy", py);
      }
      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleCalculate = () => {
    if (!birthDate) { setError("Please enter your birth date."); return; }
    const today = new Date();
    if (birthDate > today) { setError("Birth date cannot be in the future."); return; }
    setError("");
    setAges(calcAges(birthDate));
  };

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">

          {/* Date input */}
          <div className="flex flex-col gap-2">
            <BirthDatePicker
              id="ssa-birth"
              label="Your Birth Date"
              value={birthDate}
              onChange={val => { setBirthDate(val); setError(""); }}
            />
            {error && (
              <p className="text-[11px] font-sans text-accent-utility-e mt-0.5">{error}</p>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleCalculate}
            disabled={!birthDate}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_var(--border)] hover:shadow-[3px_3px_0px_0px_var(--accent-cosmos)] active:translate-y-px"
            style={{ backgroundColor: "var(--accent-cosmos)" }}
          >
            Reveal My Cosmic Age
          </button>

          {/* Baseline stats (post-calculation) */}
          {ages && (
            <div className="flex flex-col gap-2 border-t border-border pt-5 mt-1">
              <p className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase mb-1">
                Baseline
              </p>
              {(
                [
                  ["Earth years",   ages.years.toFixed(4)],
                  ["Earth days",    ages.days.toLocaleString()],
                  ["Earth hours",   ages.hours.toLocaleString()],
                  ["Moon orbits",   ages.moonOrbits.toLocaleString()],
                  ["Heartbeats",    fmtBig(ages.heartbeats)],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-sans">{label}</span>
                  <span className="font-mono text-text-primary font-semibold tabular-nums">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">

          {/* ── Solar System Visualization ──────────────────────────────── */}
          <div
            className="relative w-full overflow-hidden"
            style={{ background: "#06060A", aspectRatio: `${SVG_W} / ${SVG_H}` }}
          >
            <svg
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              className="w-full h-full"
              aria-label="Animated top-down diagram of the solar system"
              role="img"
            >
              <defs>
                <radialGradient id="ssa-sun" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#FFFDE7" />
                  <stop offset="40%"  stopColor="#FFD740" />
                  <stop offset="100%" stopColor="#FF8F00" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Void background */}
              <rect width={SVG_W} height={SVG_H} fill="#06060A" />

              {/* Stars */}
              {STAR_FIELD.map((s, i) => (
                <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.o} />
              ))}

              {/* Orbital ellipses */}
              {PLANETS.map(p => (
                <ellipse
                  key={`orb-${p.name}`}
                  cx={CX} cy={CY}
                  rx={p.orbitR} ry={p.orbitR * TILT}
                  fill="none"
                  stroke="rgba(255,255,255,0.055)"
                  strokeWidth="1"
                />
              ))}

              {/* Sun — glow halo + core */}
              <circle cx={CX} cy={CY} r={30} fill="url(#ssa-sun)" />
              <circle cx={CX} cy={CY} r={11} fill="#FFD740" />
              <text
                x={CX} y={CY + 24}
                textAnchor="middle"
                fontSize="7"
                fill="rgba(255,215,64,0.4)"
                fontFamily="var(--font-ui)"
              >
                Sol
              </text>

              {/* Planets — initial positions at angle 0 (right side of orbit) */}
              {PLANETS.map(p => {
                const initX = CX + p.orbitR;
                const initY = CY;
                return (
                  <g key={p.name}>
                    {/* Saturn's rings drawn behind the planet body */}
                    {p.hasRings && (
                      <ellipse
                        ref={el => {
                          if (!domRefs.current[p.name])
                            domRefs.current[p.name] = { planet: null, ring: null };
                          domRefs.current[p.name].ring = el;
                        }}
                        cx={initX} cy={initY}
                        rx={p.size * 2.3} ry={p.size * 0.55}
                        fill="none"
                        stroke="#C9B87A"
                        strokeWidth="2.5"
                        opacity="0.72"
                      />
                    )}
                    {/* Planet body */}
                    <circle
                      ref={el => {
                        if (!domRefs.current[p.name])
                          domRefs.current[p.name] = { planet: null, ring: null };
                        domRefs.current[p.name].planet = el;
                      }}
                      cx={initX} cy={initY}
                      r={p.size}
                      fill={p.color}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* ── Results ─────────────────────────────────────────────────── */}
          {ages ? (
            <>
              {/* Planet ages — 3D neubrutalist cards */}
              <div className="p-4 md:p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ages.planetary.map((p) => (
                    <div
                      key={p.name}
                      className="flex flex-col gap-1.5 p-4 transition-all duration-150 cursor-default"
                      style={{
                        background: "var(--bg-card)",
                        border: "2px solid var(--border)",
                        boxShadow: "3px 3px 0 var(--shadow-color)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px, -2px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "5px 5px 0 var(--shadow-color)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translate(0, 0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "3px 3px 0 var(--shadow-color)";
                      }}
                    >
                      <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase">
                        {p.name}
                      </span>
                      <div
                        className="font-mono tabular-nums leading-none"
                        style={{ fontSize: "1.5rem", fontWeight: 900, color: p.color }}
                      >
                        {fmtPlanetAge(p.ageOnPlanet)}
                      </div>
                      <div className="text-[10px] font-sans text-text-faint leading-snug">
                        {p.ageOnPlanet < 1
                          ? "of a year old"
                          : p.ageOnPlanet < 2
                          ? "year old"
                          : "years old"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Planet facts strip */}
              <div className="border-b border-border bg-bg-surface/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {ages.planetary.slice(0, 4).map((p, i) => (
                    <div
                      key={`fact-${p.name}`}
                      className={`px-4 py-3 ${i < 3 ? "sm:border-r border-border" : ""}`}
                    >
                      <p className="text-[10px] font-sans text-text-faint italic leading-snug">
                        {p.fact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cosmic perspectives */}
              <div className="px-4 md:px-5 pt-8 pb-8">
                <p
                  className="font-display font-light italic text-text-primary leading-[1.1] mb-6 text-balance"
                  style={{
                    fontSize: "clamp(1.35rem, 3vw, 2rem)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Your Position in the Cosmos
                </p>

                <div className="flex flex-col">
                  {(
                    [
                      {
                        label: "Fraction of a galactic year",
                        value: ages.galacticFrac.toExponential(3),
                        note:  "The Sun orbits the Milky Way centre once every ~225 million Earth years. This is called a cosmic year.",
                      },
                      {
                        label: "Percentage of the universe's age",
                        value: `${ages.universePerc.toExponential(3)}%`,
                        note:  "The universe is approximately 13.8 billion years old. You arrived very recently.",
                      },
                      {
                        label: "Light-years traveled with the Sun",
                        value: `${ages.lightYears.toFixed(2)} ly`,
                        note:  "The Sun moves at ~251 km/s through the galaxy. Everything on Earth — including you — travels that distance too.",
                      },
                      {
                        label: "Light-years your birth photons have escaped",
                        value: `${ages.birthPhotons.toFixed(2)} ly`,
                        note:  "Light emitted the moment you were born has now traveled this far from your birthplace into the universe.",
                      },
                      {
                        label: "Moon orbits you have witnessed",
                        value: ages.moonOrbits.toLocaleString(),
                        note:  "The Moon completes one sidereal orbit every 27.32 Earth days.",
                      },
                      {
                        label: "Approximate heartbeats lived",
                        value: fmtBig(ages.heartbeats),
                        note:  "Estimated at an average of 80 beats per minute across a human lifetime.",
                      },
                    ] as { label: string; value: string; note: string }[]
                  ).map(({ label, value, note }) => (
                    <div key={label} className="py-4 border-b border-border-subtle last:border-b-0">
                      <div className="flex justify-between items-baseline gap-4 mb-1">
                        <span className="font-sans text-xs text-text-muted">{label}</span>
                        <span className="font-mono text-sm text-text-primary font-semibold tabular-nums flex-shrink-0">
                          {value}
                        </span>
                      </div>
                      <p className="text-[10px] font-sans text-text-faint italic leading-relaxed">
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Empty state */
            <div className="px-5 py-14 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{
                  fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)",
                  letterSpacing: "-0.01em",
                }}
              >
                How old are you on Neptune?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your birth date to discover your age across every planet in the solar system — then see just how small your existence looks from a galactic scale.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
