"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtHrs(hrs: number): string {
  if (hrs >= 8_760) return `${(hrs / 8_760).toFixed(1)} years`;
  if (hrs >= 730)   return `${(hrs / 730).toFixed(1)} months`;
  if (hrs >= 168)   return `${(hrs / 168).toFixed(1)} weeks`;
  if (hrs >= 24)    return `${(hrs / 24).toFixed(0)} days`;
  return `${hrs.toFixed(0)} hours`;
}

function fmtYears(hrs: number): string {
  return `${(hrs / 8_760).toFixed(2)} years`;
}

// ─── Slider input ─────────────────────────────────────────────────────────────

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  accent,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between">
        <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          {label}
        </label>
        <span className="font-mono text-xs" style={{ color: accent }}>
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
        style={{ accentColor: accent }}
      />
      <div className="flex justify-between text-[9px] font-sans text-text-faint">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Audit row ────────────────────────────────────────────────────────────────

function AuditRow({
  emoji,
  label,
  hours,
  equivalent,
  accent,
}: {
  emoji: string;
  label: string;
  hours: number;
  equivalent: string;
  accent: string;
}) {
  return (
    <div
      className="grid gap-3 p-4 transition-all duration-150"
      style={{
        border: "2px solid var(--border)",
        background: "var(--bg-card)",
        boxShadow: "3px 3px 0 var(--shadow-color)",
        gridTemplateColumns: "1fr 1fr",
      }}
    >
      {/* Left: what it is */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="text-base leading-none">{emoji}</span>
          <span className="text-[10px] font-sans font-bold text-text-muted uppercase tracking-wider">{label}</span>
        </div>
        <p className="font-mono text-lg font-black leading-tight" style={{ color: accent }}>
          {fmtHrs(hours)}
        </p>
        <p className="text-[9px] font-sans text-text-faint">{fmtYears(hours)}</p>
      </div>

      {/* Right: what it could be */}
      <div
        className="flex flex-col justify-center pl-3"
        style={{ borderLeft: "2px solid var(--border)" }}
      >
        <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
          Could have been
        </p>
        <p className="text-[11px] font-sans text-text-muted leading-snug">{equivalent}</p>
      </div>
    </div>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────

function NumberInput({
  label,
  value,
  onChange,
  min,
  max,
  accent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="px-3 py-2 font-mono text-sm bg-bg-base text-text-primary outline-none"
        style={{ border: "2px solid var(--border)" }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WorkTimeAudit() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "work-time-audit";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [currentAge,     setCurrentAge]     = useState("30");
  const [retireAge,      setRetireAge]      = useState(65);
  const [weeklyWork,     setWeeklyWork]     = useState(40);
  const [dailyCommute,   setDailyCommute]   = useState(30);
  const [weeklyLaundry,  setWeeklyLaundry]  = useState(2);
  const [weeklyDishes,   setWeeklyDishes]   = useState(3);
  const [calculated,     setCalculated]     = useState(false);
  const [error,          setError]          = useState("");

  const results = useMemo(() => {
    const age = parseFloat(currentAge) || 0;
    if (!calculated || age <= 0 || retireAge <= age) return null;

    const yearsWorking = retireAge - age;
    const workWeeks    = yearsWorking * 50;          // 2 weeks PTO/holidays
    const workHrs      = workWeeks * weeklyWork;
    const meetingHrs   = workHrs * 0.23;
    const commuteHrs   = (dailyCommute / 60) * 2 * 250 * yearsWorking;
    const laundryHrs   = weeklyLaundry * 52 * yearsWorking;
    const dishesHrs    = weeklyDishes * 52 * yearsWorking;
    const shoeHrs      = (2.5 / 60) * 2 * 365 * yearsWorking;
    const totalHrs     = workHrs + commuteHrs + laundryHrs + dishesHrs + shoeHrs;
    const wakingHrsRemaining = yearsWorking * 365 * 16; // 16 waking hrs/day

    // Equivalents
    const booksFromCommute  = Math.floor(commuteHrs / 7);
    const tripsFromCommute  = Math.floor(commuteHrs / 40);
    const booksFromMeetings = Math.floor(meetingHrs / 7);
    const sleepNightsChores = Math.floor((laundryHrs + dishesHrs) / 8);
    const pctWakingLife     = ((totalHrs / wakingHrsRemaining) * 100).toFixed(1);

    // Commute-cut saving
    const zeroCommuteSaving = commuteHrs;

    return {
      yearsWorking: yearsWorking.toFixed(1),
      workHrs,
      meetingHrs,
      commuteHrs,
      laundryHrs,
      dishesHrs,
      shoeHrs,
      totalHrs,
      booksFromCommute,
      tripsFromCommute,
      booksFromMeetings,
      sleepNightsChores,
      pctWakingLife,
      zeroCommuteSaving,
      wakingHrsRemaining,
    };
  }, [calculated, currentAge, retireAge, weeklyWork, dailyCommute, weeklyLaundry, weeklyDishes]);

  const handleCalculate = () => {
    const age = parseFloat(currentAge) || 0;
    if (age <= 0 || age >= 100) { setError("Enter a valid current age."); return; }
    if (retireAge <= age) { setError("Retirement age must be greater than your current age."); return; }
    setError("");
    setCalculated(true);
  };

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-4">
          <NumberInput
            label="Current age"
            value={currentAge}
            onChange={(v) => { setCurrentAge(v); setCalculated(false); }}
            min={16}
            max={99}
            accent={accent}
          />

          <SliderInput
            label="Retirement age"
            value={retireAge}
            onChange={(v) => { setRetireAge(v); setCalculated(false); }}
            min={55}
            max={75}
            step={1}
            unit=" yrs"
            accent={accent}
          />

          <SliderInput
            label="Weekly work hours"
            value={weeklyWork}
            onChange={(v) => { setWeeklyWork(v); setCalculated(false); }}
            min={20}
            max={60}
            step={5}
            unit="h"
            accent={accent}
          />

          <SliderInput
            label="Daily commute (one way)"
            value={dailyCommute}
            onChange={(v) => { setDailyCommute(v); setCalculated(false); }}
            min={0}
            max={90}
            step={5}
            unit="min"
            accent={accent}
          />

          <SliderInput
            label="Weekly laundry time"
            value={weeklyLaundry}
            onChange={(v) => { setWeeklyLaundry(v); setCalculated(false); }}
            min={0}
            max={5}
            step={0.5}
            unit="h"
            accent={accent}
          />

          <SliderInput
            label="Weekly dishes & cleaning"
            value={weeklyDishes}
            onChange={(v) => { setWeeklyDishes(v); setCalculated(false); }}
            min={0}
            max={10}
            step={0.5}
            unit="h"
            accent={accent}
          />

          {error && <p className="text-[11px] font-sans" style={{ color: "var(--destructive)" }}>{error}</p>}

          <button
            onClick={handleCalculate}
            className="calculate-btn"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            Run My Work Time Audit
          </button>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {calculated && results ? (
            <div className="p-4 md:p-5 flex flex-col gap-5">
              {/* Headline */}
              <div>
                <p
                  className="font-display font-light italic text-text-primary leading-tight mb-1"
                  style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
                >
                  You will spend{" "}
                  <span style={{ color: accent, fontStyle: "normal", fontWeight: 700 }}>
                    {fmtHrs(results.totalHrs)}
                  </span>{" "}
                  on work and necessary tasks.
                </p>
                <p className="text-[11px] font-sans text-text-faint">
                  That is{" "}
                  <span className="font-mono font-bold" style={{ color: accent }}>{results.pctWakingLife}%</span>{" "}
                  of your remaining waking hours across a {results.yearsWorking}-year career.
                </p>
              </div>

              {/* Audit rows */}
              <div className="flex flex-col gap-3">
                <AuditRow
                  emoji="🚗"
                  label="Commuting"
                  hours={results.commuteHrs}
                  equivalent={`${results.booksFromCommute.toLocaleString()} books read, or ${results.tripsFromCommute.toLocaleString()} international trips taken`}
                  accent={accent}
                />
                <AuditRow
                  emoji="📊"
                  label="In meetings"
                  hours={results.meetingHrs}
                  equivalent={`${results.booksFromMeetings.toLocaleString()} books read — 23% of all your working hours`}
                  accent={accent}
                />
                <AuditRow
                  emoji="👕"
                  label="Laundry"
                  hours={results.laundryHrs}
                  equivalent={`${(results.laundryHrs / 730).toFixed(1)} extra months of evenings freed`}
                  accent={accent}
                />
                <AuditRow
                  emoji="🍽"
                  label="Dishes & cleaning"
                  hours={results.dishesHrs}
                  equivalent={`${results.sleepNightsChores.toLocaleString()} extra full nights of sleep`}
                  accent={accent}
                />
                <AuditRow
                  emoji="👟"
                  label="Tying shoes"
                  hours={results.shoeHrs}
                  equivalent={`${(results.shoeHrs).toFixed(0)} hours — approximately ${(results.shoeHrs / 168).toFixed(1)} full weeks of your life`}
                  accent={accent}
                />
              </div>

              {/* Commute decision highlight */}
              {results.commuteHrs > 0 && (
                <div
                  className="p-4"
                  style={{ border: `2px solid ${accent}55`, background: `${accent}08`, boxShadow: "2px 2px 0 var(--shadow-color)" }}
                >
                  <p className="text-[10px] font-sans font-bold uppercase tracking-wider mb-1.5" style={{ color: accent }}>
                    The commute decision
                  </p>
                  <p className="text-[11px] font-sans text-text-muted leading-relaxed">
                    Cutting your commute from {dailyCommute} min/day to zero gives back{" "}
                    <span className="font-mono font-bold" style={{ color: accent }}>{fmtHrs(results.zeroCommuteSaving)}</span>{" "}
                    of your life over your career. That is{" "}
                    <span className="font-mono font-bold" style={{ color: accent }}>{results.booksFromCommute.toLocaleString()} books</span>{" "}
                    or {results.tripsFromCommute.toLocaleString()} international trips.
                    {" "}Location is a time decision as much as a financial one.
                  </p>
                </div>
              )}

              {/* Closing note */}
              <p className="text-[10px] font-sans text-text-faint italic text-center leading-relaxed">
                None of this means you should work less — it means every choice about where to work and how to live compounds over decades in ways the daily math hides.
              </p>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                How many years of your life go to work?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Your commute is 1–2 years. Meetings are 3–4. Shoe-tying is 2 weeks. Enter your routine to see the full audit — and what those hours could have been instead.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
