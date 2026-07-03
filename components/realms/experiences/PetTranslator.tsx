"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Age conversion formulas ──────────────────────────────────────────────────

function dogToHuman(years: number): number {
  if (years <= 0) return 0;
  if (years <= 1) return years * 15;
  if (years <= 2) return 15 + (years - 1) * 9;
  return 24 + (years - 2) * 4;
}

function catToHuman(years: number): number {
  if (years <= 0) return 0;
  if (years <= 1) return years * 15;
  if (years <= 2) return 15 + (years - 1) * 9;
  return 24 + (years - 2) * 4;
}

// Pet clock speed multipliers (human life expectancy 79 / pet life expectancy)
const PET_SPEED: Record<"dog" | "cat", number> = {
  dog: 79 / 12,  // ≈ 6.58×
  cat: 79 / 15,  // ≈ 5.27×
};

const LIFE_EXPECTANCY: Record<"dog" | "cat", number> = {
  dog: 12,
  cat: 15,
};

// ─── Species translations (for the human) ────────────────────────────────────

function toElf(humanAge: number) { return humanAge / 7; }
function toVulcan(humanAge: number) { return humanAge * (200 / 79); }
function toAsgardian(humanAge: number) { return humanAge / (5000 / 79); }
function toMayfly(humanAge: number) {
  // Average mayfly adult lifespan ~24 hours = 1/365.25 years
  return humanAge / (1 / 365.25);
}

// ─── Rotating behavior cards ──────────────────────────────────────────────────

const DOG_BEHAVIORS = [
  { emoji: "⏱", text: "Time until your dog notices you left: ~45 seconds" },
  { emoji: "🐾", text: "Dog attention span for a single trick: 2–3 minutes" },
  { emoji: "💤", text: "Hours your dog has slept today: probably more than you" },
  { emoji: "🎾", text: "Frequency of 'let's play' requests: every 20 minutes, approximately" },
  { emoji: "🔔", text: "Dog's internal dinner-time clock accuracy: ±30 seconds" },
];

const CAT_BEHAVIORS = [
  { emoji: "📦", text: "New expensive toy → cardboard box preference: 2–4 business days" },
  { emoji: "💤", text: "3am sprint prediction: unknown. Soon. Always soon." },
  { emoji: "🍽", text: "Next cat food demand: ~3 hours (they just finished eating)" },
  { emoji: "🐾", text: "Time before cat ignores its name: immediately" },
  { emoji: "👁", text: "Hours your cat has observed you today, silently judging: all of them" },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmt(n: number, dec = 1) {
  return n.toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function fmtPetClock(totalPetSecs: number) {
  const s = Math.floor(totalPetSecs % 60);
  const m = Math.floor((totalPetSecs / 60) % 60);
  const h = Math.floor(totalPetSecs / 3600);
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
  };
}

function yearsToHumanMd(yrs: number): string {
  const y = Math.floor(yrs);
  const m = Math.floor((yrs - y) * 12);
  const w = Math.floor(((yrs - y) * 12 - m) * 4.33);
  return `${y}y ${m}m ${w}w`;
}

// ─── Main component ───────────────────────────────────────────────────────────

type PetType = "dog" | "cat";

export default function PetTranslator() {
  const pathname  = usePathname();
  const slug      = pathname.split("/").pop() ?? "pet-translator";
  const realm     = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent    = realm.accent;

  const [petType,    setPetType]    = useState<PetType>("dog");
  const [petName,    setPetName]    = useState("");
  const [petYears,   setPetYears]   = useState("");
  const [petMonths,  setPetMonths]  = useState("");
  const [humanAge,   setHumanAge]   = useState("");
  const [active,     setActive]     = useState(false);
  const [tick,       setTick]       = useState(0);
  const [behavior,   setBehavior]   = useState(0);

  const petSecsRef = useRef(0);
  const humanSecsRef = useRef(0);

  const petAgeYears = parseFloat(petYears || "0") + parseFloat(petMonths || "0") / 12;
  const humanAgeNum = parseFloat(humanAge || "0");

  const handleStart = useCallback(() => {
    if (!petYears && !petMonths) return;
    // Initialize pet-seconds from pet age in human-seconds × speed multiplier
    const humanSecs = petAgeYears * 365.25 * 86400;
    petSecsRef.current   = humanSecs * PET_SPEED[petType];
    humanSecsRef.current = humanSecs;
    setActive(true);
  }, [petAgeYears, petType, petYears, petMonths]);

  // Tick every 100ms for smooth pet clock
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      petSecsRef.current   += 0.1 * PET_SPEED[petType];
      humanSecsRef.current += 0.1;
      setTick((t) => t + 1);
    }, 100);
    return () => clearInterval(id);
  }, [active, petType]);

  // Rotate behavior cards every 5s
  useEffect(() => {
    if (!active) return;
    const behaviors = petType === "dog" ? DOG_BEHAVIORS : CAT_BEHAVIORS;
    const id = setInterval(() => setBehavior((b) => (b + 1) % behaviors.length), 5000);
    return () => clearInterval(id);
  }, [active, petType]);

  void tick; // drives re-render

  const petAgeNow    = petSecsRef.current / (365.25 * 86400 * PET_SPEED[petType]);
  const humanEq      = petType === "dog" ? dogToHuman(petAgeNow) : catToHuman(petAgeNow);
  const lifeExp      = LIFE_EXPECTANCY[petType];
  const remainingYrs = Math.max(0, lifeExp - petAgeNow);
  const clock        = fmtPetClock(petSecsRef.current);
  const behaviors    = petType === "dog" ? DOG_BEHAVIORS : CAT_BEHAVIORS;
  const displayName  = petName.trim() || (petType === "dog" ? "Your dog" : "Your cat");

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">

          {/* Pet type pills */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Pet Type
            </label>
            <div className="flex gap-2">
              {(["dog", "cat"] as PetType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setPetType(t); setActive(false); setBehavior(0); }}
                  className="flex-1 py-2.5 text-[11px] font-sans font-bold uppercase tracking-wider transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: petType === t ? accent : "var(--bg-card)",
                    color: petType === t ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: petType === t ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  {t === "dog" ? "🐶 Dog" : "🐱 Cat"}
                </button>
              ))}
            </div>
          </div>

          {/* Pet name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Pet Name (optional)
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder={petType === "dog" ? "e.g. Biscuit" : "e.g. Luna"}
              className="px-3 py-2 font-sans text-sm bg-bg-base text-text-primary"
              style={{ border: "2px solid var(--border)", outline: "none" }}
            />
          </div>

          {/* Pet age */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Pet Age
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="number"
                  value={petYears}
                  onChange={(e) => { setPetYears(e.target.value); setActive(false); }}
                  placeholder="0"
                  min={0}
                  max={30}
                  className="w-full px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
                  style={{ border: "2px solid var(--border)", outline: "none" }}
                />
                <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider text-center">years</span>
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <input
                  type="number"
                  value={petMonths}
                  onChange={(e) => { setPetMonths(e.target.value); setActive(false); }}
                  placeholder="0"
                  min={0}
                  max={11}
                  className="w-full px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
                  style={{ border: "2px solid var(--border)", outline: "none" }}
                />
                <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider text-center">months</span>
              </div>
            </div>
          </div>

          {/* Human age (optional) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Your Age (optional — for species translation)
            </label>
            <input
              type="number"
              value={humanAge}
              onChange={(e) => setHumanAge(e.target.value)}
              placeholder="e.g. 28"
              min={1}
              max={120}
              className="px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
              style={{ border: "2px solid var(--border)", outline: "none" }}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!petYears && !petMonths}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            {active ? "Reset Clock" : "Start Pet Clock"}
          </button>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {active ? (
            <div className="p-4 md:p-5 flex flex-col gap-5">

              {/* Live pet clock */}
              <div
                className="p-5 text-center"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
              >
                <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-3">
                  {displayName}&apos;s Clock — running at {fmt(PET_SPEED[petType], 2)}× human speed
                </p>
                <div className="flex items-center justify-center gap-1 font-mono font-black tabular-nums" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", color: accent }}>
                  <span>{clock.h}</span>
                  <span className="opacity-50 text-[0.7em]">:</span>
                  <span>{clock.m}</span>
                  <span className="opacity-50 text-[0.7em]">:</span>
                  <span>{clock.s}</span>
                </div>
                <p className="text-[9px] font-sans text-text-faint mt-2 uppercase tracking-wider">
                  pet-hours : pet-minutes : pet-seconds
                </p>
              </div>

              {/* Pet stats row */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="p-4"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                >
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                    Human equivalent age
                  </p>
                  <p className="font-mono text-2xl font-black tabular-nums" style={{ color: accent }}>
                    {fmt(humanEq, 1)}
                  </p>
                  <p className="text-[10px] font-sans text-text-faint mt-0.5">human years</p>
                </div>
                <div
                  className="p-4"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                >
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                    Estimated time remaining
                  </p>
                  <p className="font-mono text-lg font-black tabular-nums leading-tight" style={{ color: remainingYrs < 2 ? "var(--accent-utility-e)" : accent }}>
                    {yearsToHumanMd(remainingYrs)}
                  </p>
                  <p className="text-[10px] font-sans text-text-faint mt-0.5">
                    avg. {lifeExp}yr lifespan
                  </p>
                </div>
              </div>

              {/* Species translation */}
              {humanAgeNum > 0 && (
                <div
                  className="p-4"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                >
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-3">
                    You ({humanAgeNum}yrs) in other lifespan systems
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Tolkien Elf",  value: fmt(toElf(humanAgeNum), 1),        sub: "elves mature at 50" },
                      { label: "Vulcan",        value: fmt(toVulcan(humanAgeNum), 1),     sub: "200yr lifespan" },
                      { label: "Asgardian",     value: fmt(toAsgardian(humanAgeNum), 2),  sub: "5000yr lifespan" },
                      { label: "Mayfly",        value: fmt(toMayfly(humanAgeNum), 0) + "×", sub: "24hr adult life" },
                    ].map(({ label, value, sub }) => (
                      <div key={label} className="flex flex-col gap-0.5 py-2 border-b border-border last:border-b-0">
                        <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider">{label}</span>
                        <span className="font-mono text-sm font-bold" style={{ color: accent }}>{value}</span>
                        <span className="text-[9px] font-sans text-text-faint">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rotating behavior card */}
              <div
                className="p-4 transition-all duration-500"
                style={{
                  border: `2px solid ${accent}44`,
                  background: `${accent}0A`,
                  boxShadow: `2px 2px 0 ${accent}22`,
                }}
              >
                <p className="text-[9px] font-sans font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                  {petType === "dog" ? "Dog Behavior Intel" : "Cat Behavior Intel"}
                </p>
                <p className="font-sans text-sm text-text-muted leading-relaxed">
                  {behaviors[behavior].emoji} {behaviors[behavior].text}
                </p>
              </div>

            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                Your dog&apos;s clock runs 6.6× faster than yours.
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your pet&apos;s age and watch time pass at their speed — plus how old you&apos;d be as a Tolkien elf.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
