"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Dataset ──────────────────────────────────────────────────────────────────

type FictionalYear = {
  year: number;
  title: string;
  emoji: string;
  prediction: string;
  reality: string;
};

const FICTIONAL_YEARS: FictionalYear[] = [
  {
    year: 1984,
    title: "Nineteen Eighty-Four",
    emoji: "📡",
    prediction: "Total state surveillance, Thought Police, and perpetual war between superpowers.",
    reality: "Surveillance capitalism, algorithmic feeds, and geopolitical blocs. Orwell was early, not wrong.",
  },
  {
    year: 1992,
    title: "2001: A Space Odyssey — HAL 9000",
    emoji: "🔴",
    prediction: "HAL 9000 activated January 12, 1992. Manned Jupiter mission underway.",
    reality: "No HAL. No Jupiter mission. We did get Siri in 2011 — a much more apologetic intelligence.",
  },
  {
    year: 1997,
    title: "Terminator — Skynet",
    emoji: "💀",
    prediction: "Skynet becomes self-aware on August 29, 1997 and launches global nuclear war.",
    reality: "The internet did become self-aware in 1997, mostly for sharing animated GIFs.",
  },
  {
    year: 1999,
    title: "The Matrix",
    emoji: "💊",
    prediction: "Humanity enslaved inside a simulated reality. Machines harvest human bioelectricity.",
    reality: "We voluntarily entered a simulated social reality and handed over our data for free.",
  },
  {
    year: 2001,
    title: "2001: A Space Odyssey",
    emoji: "🛸",
    prediction: "Commercial space travel, a permanent Moon base, and a manned mission to Jupiter.",
    reality: "Commercial space travel began in 2021 — 20 years late. No Moon base yet.",
  },
  {
    year: 2010,
    title: "2010: The Year We Make Contact",
    emoji: "🪐",
    prediction: "Joint US-Soviet mission to Jupiter to recover Discovery One. First contact with extraterrestrials.",
    reality: "The USSR dissolved 19 years before this. No contact. Jupiter remains uncontacted.",
  },
  {
    year: 2015,
    title: "Back to the Future Part II",
    emoji: "⚡",
    prediction: "Hoverboards, self-lacing shoes, flying cars, and fax machines everywhere.",
    reality: "Self-lacing Nike MAGs were made in 2016 — one year late. Still no hoverboards.",
  },
  {
    year: 2018,
    title: "Ready Player One — OASIS",
    emoji: "🥽",
    prediction: "Global virtual reality metaverse called OASIS where most of humanity spends their time.",
    reality: "Meta spent $36 billion trying to build this. The avatars had no legs.",
  },
  {
    year: 2019,
    title: "Blade Runner",
    emoji: "🌆",
    prediction: "Off-world colonies, replicant slave labour, flying cars over a rain-soaked dystopian LA.",
    reality: "LA is still rain-starved. No replicants — but we do have convincing AI voices now.",
  },
  {
    year: 2022,
    title: "Soylent Green",
    emoji: "🌿",
    prediction: "Catastrophic overpopulation, food made from humans, and a world without nature.",
    reality: "Soylent is a real meal replacement drink. It does not contain humans (probably).",
  },
  {
    year: 2025,
    title: "Elysium",
    emoji: "🛰",
    prediction: "Wealthy elite living on a luxury space station while Earth becomes an overcrowded slum.",
    reality: "The wealthy elites have started building bunkers instead of space stations. Close enough.",
  },
  {
    year: 2029,
    title: "Terminator 2 — Future War",
    emoji: "🤖",
    prediction: "Skynet's machines wage open war against surviving humans after nuclear Judgment Day.",
    reality: "Still 4 years away. Drone warfare is accelerating. No comment.",
  },
  {
    year: 2035,
    title: "I, Robot",
    emoji: "🦾",
    prediction: "Humanoid robots are common household assistants, policed by the Three Laws.",
    reality: "Boston Dynamics exists. No Three Laws. Roomba counts.",
  },
  {
    year: 2049,
    title: "Blade Runner 2049",
    emoji: "🌫",
    prediction: "Environmental collapse, synthetic humans, and a LAPD replicant hunting down rogue androids.",
    reality: "24 years away. The environmental collapse part is on track.",
  },
  {
    year: 2054,
    title: "Minority Report",
    emoji: "👁",
    prediction: "Pre-crime division arrests people before they commit crimes using psychic precogs.",
    reality: "Predictive policing algorithms already exist. They have the same bias problems.",
  },
  {
    year: 2063,
    title: "Star Trek — First Contact",
    emoji: "🖖",
    prediction: "Zefram Cochrane makes humanity's first warp flight on April 5, triggering Vulcan first contact.",
    reality: "37 years away. We are still arguing about whether to go back to the Moon.",
  },
  {
    year: 2075,
    title: "Interstellar",
    emoji: "🌽",
    prediction: "Global blight has destroyed most crops. Earth is becoming uninhabitable. NASA operates in secret.",
    reality: "Crop scientists are working overtime. NASA is public. Tense.",
  },
  {
    year: 2154,
    title: "Avatar — Pandora",
    emoji: "🌿",
    prediction: "Humans are mining a rare mineral called unobtanium on the moon Pandora, 4.4 light-years away.",
    reality: "128 years away. We haven't left the solar system yet.",
  },
];

const NOW_YEAR = new Date().getFullYear();
const NOW_MS   = Date.now();

function msToYear(year: number) {
  return new Date(year, 0, 1).getTime();
}

function yearsUntil(year: number) {
  const diff = msToYear(year) - NOW_MS;
  if (diff <= 0) return null;
  return diff / (1000 * 60 * 60 * 24 * 365.25);
}

function fmtCountdown(year: number): string {
  const yrs = yearsUntil(year);
  if (yrs === null) return "passed";
  const y = Math.floor(yrs);
  const d = Math.floor((yrs - y) * 365.25);
  return `${y}y ${d}d`;
}

// ─── Flux calculator ──────────────────────────────────────────────────────────

function FluxCalc({ accent }: { accent: string }) {
  const [target, setTarget] = useState("");
  const watts = useMemo(() => {
    const yr = parseInt(target, 10);
    if (isNaN(yr) || yr <= 1885 || yr > 9999) return null;
    return ((yr - NOW_YEAR) * 0.88 + 1.21).toFixed(3);
  }, [target]);

  return (
    <div
      className="mt-6 p-5"
      style={{
        border: "2px solid var(--border)",
        background: "var(--bg-card)",
        boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
    >
      <p className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint mb-3">
        ⚡ Flux Capacitor Calculator
      </p>
      <p className="text-[11px] font-sans text-text-muted mb-3 leading-relaxed">
        Enter a target year to calculate the exact gigawatts required for temporal displacement.
      </p>
      <div className="flex gap-2 items-stretch">
        <input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target year…"
          className="flex-1 px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
          style={{ border: "2px solid var(--border)", outline: "none" }}
          min={1886}
          max={9999}
        />
        <div
          className="flex items-center px-4 font-mono text-sm font-bold"
          style={{
            border: "2px solid var(--border)",
            background: watts ? accent : "var(--bg-surface)",
            color: watts ? "#0A0A0A" : "var(--text-faint)",
            minWidth: 110,
          }}
        >
          {watts ? `${watts} GW` : "— GW"}
        </div>
      </div>
      {watts && (
        <p className="text-[10px] font-sans text-text-faint mt-2 italic">
          You need {watts} gigawatts and a DeLorean capable of reaching 88 mph.
        </p>
      )}
    </div>
  );
}

// ─── Canvas starfield ─────────────────────────────────────────────────────────

function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = 120;

    // LCG star gen
    let seed = 1234567;
    const lcg = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    const stars = Array.from({ length: 80 }, () => ({
      x: lcg() * W, y: lcg() * H,
      r: 0.3 + lcg() * 0.9,
      o: 0.1 + lcg() * 0.5,
      phase: lcg() * Math.PI * 2,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#06060A";
      ctx.fillRect(0, 0, W, H);
      for (const s of stars) {
        const brightness = s.o * (0.6 + 0.4 * Math.sin(t * 0.001 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${brightness.toFixed(3)})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 120, display: "block", background: "#06060A" }}
    />
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FictionalFutures() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "fictional-futures";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const passed   = FICTIONAL_YEARS.filter((f) => f.year <= NOW_YEAR);
  const upcoming = FICTIONAL_YEARS.filter((f) => f.year  > NOW_YEAR);

  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-4">
          <div
            className="p-4"
            style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
          >
            <p className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint mb-3">
              Timeline Status
            </p>
            {([
              ["Futures passed",    passed.length.toString()],
              ["Futures ahead",     upcoming.length.toString()],
              ["Earliest passed",   passed[0]?.year.toString() ?? "—"],
              ["Next arrival",      upcoming[0] ? `${upcoming[0].year}` : "—"],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex justify-between items-center text-xs py-1.5 border-b border-border last:border-b-0">
                <span className="text-text-muted font-sans">{label}</span>
                <span className="font-mono font-semibold" style={{ color: accent }}>{value}</span>
              </div>
            ))}
          </div>

          <FluxCalc accent={accent} />
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          <StarCanvas />

          <div className="p-4 md:p-5 flex flex-col gap-6">

            {/* Passed section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint">
                  Futures We&apos;ve Already Lived Through
                </span>
                <span
                  className="px-2 py-0.5 text-[9px] font-sans font-bold uppercase"
                  style={{ background: "var(--border)", color: "var(--text-faint)", border: "1px solid var(--border)" }}
                >
                  {passed.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {passed.map((f) => {
                  const isOpen = expanded === f.year;
                  return (
                    <button
                      key={f.year}
                      onClick={() => setExpanded(isOpen ? null : f.year)}
                      className="w-full text-left transition-all duration-150"
                      style={{
                        border: "2px solid var(--border)",
                        background: "var(--bg-card)",
                        boxShadow: "2px 2px 0 var(--shadow-color)",
                        opacity: 0.72,
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <span className="text-lg flex-shrink-0">{f.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span
                              className="font-mono text-[11px] font-bold line-through"
                              style={{ color: "var(--text-faint)" }}
                            >
                              {f.year}
                            </span>
                            <span className="font-sans text-sm font-semibold text-text-muted truncate">{f.title}</span>
                          </div>
                        </div>
                        <span
                          className="px-2 py-0.5 text-[9px] font-sans font-bold uppercase flex-shrink-0"
                          style={{ background: "var(--border)", color: "var(--text-faint)", border: "1px solid var(--border)" }}
                        >
                          PASSED
                        </span>
                        <span className="text-text-faint text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                      </div>
                      {isOpen && (
                        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-border mt-0 pt-3">
                          <div>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">Prediction</p>
                            <p className="text-[12px] font-sans text-text-muted leading-relaxed">{f.prediction}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">Reality</p>
                            <p className="text-[12px] font-sans text-text-muted leading-relaxed italic">{f.reality}</p>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint">
                  Futures Still Coming
                </span>
                <span
                  className="px-2 py-0.5 text-[9px] font-sans font-bold uppercase"
                  style={{ background: accent, color: "#0A0A0A", border: `1px solid ${accent}` }}
                >
                  {upcoming.length}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                {upcoming.map((f) => {
                  const isOpen = expanded === f.year;
                  return (
                    <button
                      key={f.year}
                      onClick={() => setExpanded(isOpen ? null : f.year)}
                      className="w-full text-left transition-all duration-150"
                      style={{
                        border: `2px solid ${accent}44`,
                        background: "var(--bg-card)",
                        boxShadow: `3px 3px 0 ${accent}33`,
                      }}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <span className="text-lg flex-shrink-0">{f.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="font-mono text-[11px] font-bold" style={{ color: accent }}>{f.year}</span>
                            <span className="font-sans text-sm font-semibold text-text-primary truncate">{f.title}</span>
                          </div>
                        </div>
                        <span
                          className="font-mono text-[10px] font-bold flex-shrink-0 tabular-nums"
                          style={{ color: accent }}
                        >
                          {fmtCountdown(f.year)}
                        </span>
                        <span className="text-text-faint text-xs flex-shrink-0">{isOpen ? "▲" : "▼"}</span>
                      </div>
                      {isOpen && (
                        <div className="px-4 pb-4 flex flex-col gap-2 border-t mt-0 pt-3" style={{ borderColor: `${accent}33` }}>
                          <div>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">Prediction</p>
                            <p className="text-[12px] font-sans text-text-muted leading-relaxed">{f.prediction}</p>
                          </div>
                          <div>
                            <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">Reality (so far)</p>
                            <p className="text-[12px] font-sans text-text-muted leading-relaxed italic">{f.reality}</p>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      }
    />
  );
}
