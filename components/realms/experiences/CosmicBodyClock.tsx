"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { BirthDatePicker } from "@/components/ui";

// ─── Bio constants ────────────────────────────────────────────────────────────

const BPM          = 72;           // beats per minute
const BREATHS_MIN  = 15;           // breaths per minute
const BLINKS_MIN   = 16;           // blinks per minute
const BLINK_MS     = 150;          // ms per blink
const HAIR_M_YR    = 0.15;         // metres of scalp hair per year
const SKIN_KG_YR   = 4;            // kg of dead skin shed per year
const SLEEP_FRAC   = 1 / 3;        // fraction of life asleep (8h/24h)
const DREAMS_DAY   = 5;            // dreams per night
const REM_FRAC     = 0.22;         // fraction of sleep in REM
const SECS_YR      = 365.25 * 86400;
const SECS_DAY     = 86400;

// ─── Ebbinghaus intervals ─────────────────────────────────────────────────────

const EBBINGHAUS = [
  { label: "20 min",  secs: 20 * 60,     retain: 58 },
  { label: "1 hr",    secs: 3600,         retain: 44 },
  { label: "24 hrs",  secs: 86400,        retain: 33 },
  { label: "1 week",  secs: 7 * 86400,   retain: 23 },
];

// ─── Derived stats ────────────────────────────────────────────────────────────

function derive(totalSeconds: number) {
  const yrs    = totalSeconds / SECS_YR;
  const days   = totalSeconds / SECS_DAY;
  const mins   = totalSeconds / 60;

  const heartbeats     = mins * BPM;
  const breaths        = mins * BREATHS_MIN;
  const blinks         = mins * BLINKS_MIN;
  const blinkYrs       = (blinks * BLINK_MS * 0.001) / SECS_YR;
  const hairMetres     = yrs * HAIR_M_YR;
  const skinKg         = yrs * SKIN_KG_YR;
  const sleepYrs       = yrs * SLEEP_FRAC;
  const dreams         = days * DREAMS_DAY;
  const remYrs         = sleepYrs * REM_FRAC;

  return {
    heartbeats, breaths, blinks, blinkYrs,
    hairMetres, skinKg, sleepYrs, dreams, remYrs,
    yrs,
  };
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtBig(n: number, decimals = 0): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + "B";
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(2) + "M";
  if (n >= 1_000)         return n.toLocaleString(undefined, { maximumFractionDigits: decimals });
  return n.toFixed(decimals);
}

function fmtTime(totalSecs: number): string {
  const h   = Math.floor(totalSecs / 3600);
  const m   = Math.floor((totalSecs % 3600) / 60);
  const s   = Math.floor(totalSecs % 60);
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 p-4 transition-all duration-150"
      style={{
        background: "var(--bg-card)",
        border: "2px solid var(--border)",
        boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
    >
      <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase">
        {label}
      </span>
      <div
        className="font-mono tabular-nums leading-none"
        style={{ fontSize: "1.4rem", fontWeight: 900, color: accent }}
      >
        {value}
      </div>
      <div className="text-[10px] font-sans text-text-faint leading-snug">{sub}</div>
    </div>
  );
}

// ─── Ebbinghaus panel ─────────────────────────────────────────────────────────

function EbbinghausPanel({ sessionStart, accent }: { sessionStart: number; accent: string }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const elapsed = (now - sessionStart) / 1000;

  return (
    <div
      className="mt-4 p-5"
      style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
    >
      <p className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint mb-4">
        Ebbinghaus Forgetting Curve — this session
      </p>

      <div className="flex flex-col gap-3">
        {EBBINGHAUS.map((pt) => {
          const remaining = Math.max(0, pt.secs - elapsed);
          const passed    = remaining === 0;
          return (
            <div key={pt.label} className="flex items-center gap-3">
              {/* Retention bar */}
              <div className="flex-1 h-1.5 bg-bg-base relative overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <div
                  className="absolute inset-y-0 left-0 transition-none"
                  style={{ width: `${pt.retain}%`, background: passed ? "var(--border)" : accent, opacity: passed ? 0.35 : 0.8 }}
                />
              </div>
              <span
                className="font-mono text-[11px] tabular-nums w-[28px] text-right"
                style={{ color: passed ? "var(--text-faint)" : accent }}
              >
                {pt.retain}%
              </span>
              <span className="font-sans text-[10px] text-text-faint w-[40px]">{pt.label}</span>
              <span
                className="font-mono text-[10px] tabular-nums text-right min-w-[64px]"
                style={{ color: passed ? "var(--text-faint)" : "var(--text-muted)" }}
              >
                {passed ? "passed" : `in ${fmtTime(remaining)}`}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[10px] font-sans text-text-faint italic leading-relaxed">
        Without review, you will retain approximately 23% of this session within a week.
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Tab = "body" | "sleep";

export default function CosmicBodyClock() {
  const pathname    = usePathname();
  const slug        = pathname.split("/").pop() ?? "cosmic-body-clock";
  const realm       = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent      = realm.accent;

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [error,     setError]     = useState("");
  const [active,    setActive]    = useState(false);
  const [tab,       setTab]       = useState<Tab>("body");
  const [tick,      setTick]      = useState(0);

  const liveSecs   = useRef(0);
  const sessionRef = useRef(Date.now());

  // Seed liveSecs from birthDate on activation
  const handleCalculate = useCallback(() => {
    if (!birthDate) { setError("Please enter your birth date."); return; }
    if (birthDate > new Date()) { setError("Birth date cannot be in the future."); return; }
    setError("");
    liveSecs.current = (Date.now() - birthDate.getTime()) / 1000;
    sessionRef.current = Date.now();
    setActive(true);
  }, [birthDate]);

  // Tick every second when active
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      liveSecs.current += 1;
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [active]);

  const stats = active ? derive(liveSecs.current) : null;
  void tick; // consumed via liveSecs.current re-read on each render

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <BirthDatePicker
              id="cbc-birth"
              label="Your Birth Date"
              value={birthDate}
              onChange={(val) => { setBirthDate(val); setError(""); }}
            />
            {error && (
              <p className="text-[11px] font-sans text-accent-utility-e mt-0.5">{error}</p>
            )}
          </div>

          <button
            onClick={handleCalculate}
            disabled={!birthDate}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: accent,
              boxShadow: `3px 3px 0 var(--border)`,
            }}
          >
            Start My Body Clock
          </button>

          {stats && (
            <div className="flex flex-col gap-2 border-t border-border pt-5 mt-1">
              <p className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase mb-1">
                Age
              </p>
              {([
                ["Earth years",  stats.yrs.toFixed(4)],
                ["Earth days",   Math.floor(liveSecs.current / 86400).toLocaleString()],
                ["Earth hours",  Math.floor(liveSecs.current / 3600).toLocaleString()],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-sans">{label}</span>
                  <span className="font-mono text-text-primary font-semibold tabular-nums">{value}</span>
                </div>
              ))}
              {/* Tab toggle */}
              <div className="flex gap-2 mt-3">
                {(["body", "sleep"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-1 py-2 text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                    style={{
                      border: "2px solid var(--border)",
                      background: tab === t ? accent : "var(--bg-card)",
                      color: tab === t ? "#0A0A0A" : "var(--text-muted)",
                      boxShadow: tab === t ? "2px 2px 0 var(--shadow-color)" : "none",
                    }}
                  >
                    {t === "body" ? "Body Stats" : "Sleep & Memory"}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {stats ? (
            <div className="p-4 md:p-5 flex flex-col gap-4">
              {tab === "body" ? (
                <>
                  <p
                    className="font-display font-light italic text-text-primary leading-tight"
                    style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
                  >
                    Since the moment you were born…
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatCard
                      label="Heartbeats"
                      value={fmtBig(stats.heartbeats)}
                      sub="at 72 bpm average"
                      accent={accent}
                    />
                    <StatCard
                      label="Breaths taken"
                      value={fmtBig(stats.breaths)}
                      sub="15 per minute"
                      accent={accent}
                    />
                    <StatCard
                      label="Times blinked"
                      value={fmtBig(stats.blinks)}
                      sub="16 blinks per minute"
                      accent={accent}
                    />
                    <StatCard
                      label="Years eyes closed"
                      value={stats.blinkYrs.toFixed(3)}
                      sub="150ms per blink"
                      accent={accent}
                    />
                    <StatCard
                      label="Hair grown"
                      value={`${stats.hairMetres.toFixed(1)} m`}
                      sub="15cm per year"
                      accent={accent}
                    />
                    <StatCard
                      label="Skin shed"
                      value={`${stats.skinKg.toFixed(1)} kg`}
                      sub="~4 kg per year"
                      accent={accent}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p
                    className="font-display font-light italic text-text-primary leading-tight"
                    style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
                  >
                    Your unconscious life
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <StatCard
                      label="Years asleep"
                      value={stats.sleepYrs.toFixed(2)}
                      sub="8 hours out of 24"
                      accent={accent}
                    />
                    <StatCard
                      label="Dreams dreamed"
                      value={fmtBig(stats.dreams)}
                      sub="~5 dreams per night"
                      accent={accent}
                    />
                    <StatCard
                      label="REM paralysis years"
                      value={stats.remYrs.toFixed(3)}
                      sub="22% of sleep in REM"
                      accent={accent}
                    />
                  </div>
                  <EbbinghausPanel sessionStart={sessionRef.current} accent={accent} />
                </>
              )}
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                How many times has your heart beaten?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your birth date to start a live biological clock counting every heartbeat, breath, and blink since the moment you arrived.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
