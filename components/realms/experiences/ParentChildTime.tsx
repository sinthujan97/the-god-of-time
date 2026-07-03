"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { BirthDatePicker } from "@/components/ui";

// ─── Constants ────────────────────────────────────────────────────────────────

const LIFE_EXPECTANCY = 79;
const SECS_YR         = 365.25 * 86400;

// ─── Contact presets ──────────────────────────────────────────────────────────

type ContactPreset = { label: string; hrsPerWeek: number };

const PRESETS: ContactPreset[] = [
  { label: "Live together",   hrsPerWeek: 40 },
  { label: "Weekly visits",   hrsPerWeek: 6 },
  { label: "Monthly visits",  hrsPerWeek: 2 },
  { label: "Holidays only",   hrsPerWeek: 0.5 },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtHrs(hrs: number): string {
  if (hrs >= 8760) return `${(hrs / 8760).toFixed(1)} yrs`;
  if (hrs >= 24)   return `${Math.round(hrs / 24).toLocaleString()} days`;
  return `${Math.round(hrs)} hrs`;
}

function fmtNum(n: number): string {
  return Math.floor(n).toLocaleString();
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ParentChildTime() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "parent-child-time";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [userBirth,   setUserBirth]   = useState<Date | undefined>(undefined);
  const [parentBirth, setParentBirth] = useState<Date | undefined>(undefined);
  const [preset,      setPreset]      = useState<ContactPreset>(PRESETS[1]);
  const [customHrs,   setCustomHrs]   = useState("");
  const [error,       setError]       = useState("");
  const [revealed,    setRevealed]    = useState(false);

  const weeklyHrs = customHrs !== "" ? parseFloat(customHrs) || 0 : preset.hrsPerWeek;

  const stats = useMemo(() => {
    if (!userBirth || !parentBirth) return null;
    const now        = Date.now();
    const userAgeYrs   = (now - userBirth.getTime())   / (SECS_YR * 1000);
    const parentAgeYrs = (now - parentBirth.getTime()) / (SECS_YR * 1000);
    const parentRemainingYrs = Math.max(0, LIFE_EXPECTANCY - parentAgeYrs);

    const pastHrs    = userAgeYrs          * 52 * weeklyHrs;
    const futureHrs  = parentRemainingYrs  * 52 * weeklyHrs;
    const totalHrs   = pastHrs + futureHrs;
    const pctSpent   = totalHrs > 0 ? (pastHrs / totalHrs) * 100 : 0;

    // Milestones remaining
    const christmasesLeft = Math.max(0, Math.floor(parentRemainingYrs));
    const birthdaysTogether = Math.max(0, Math.floor(parentRemainingYrs));
    const familyHolidayWksLeft = Math.max(0, Math.floor(parentRemainingYrs * 2));

    return {
      userAgeYrs,
      parentAgeYrs,
      parentRemainingYrs,
      pastHrs,
      futureHrs,
      totalHrs,
      pctSpent,
      christmasesLeft,
      birthdaysTogether,
      familyHolidayWksLeft,
    };
  }, [userBirth, parentBirth, weeklyHrs]);

  const handleCalculate = () => {
    if (!userBirth)   { setError("Please enter your birth date.");    return; }
    if (!parentBirth) { setError("Please enter your parent's birth date."); return; }
    if (userBirth > new Date())   { setError("Your birth date cannot be in the future."); return; }
    if (parentBirth > new Date()) { setError("Parent's birth date cannot be in the future."); return; }
    setError("");
    setRevealed(true);
  };

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <BirthDatePicker
              id="pct-user"
              label="Your Birth Date"
              value={userBirth}
              onChange={(v) => { setUserBirth(v); setError(""); setRevealed(false); }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <BirthDatePicker
              id="pct-parent"
              label="Parent's Birth Date"
              value={parentBirth}
              onChange={(v) => { setParentBirth(v); setError(""); setRevealed(false); }}
            />
          </div>

          {/* Contact frequency */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              How often do you see each other?
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setPreset(p); setCustomHrs(""); setRevealed(false); }}
                  className="px-2 py-2 text-left transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: preset.label === p.label && customHrs === "" ? accent : "var(--bg-card)",
                    color: preset.label === p.label && customHrs === "" ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: preset.label === p.label && customHrs === "" ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  <span className="block text-[11px] font-sans font-bold">{p.label}</span>
                  <span className="block text-[9px] font-sans opacity-70">{p.hrsPerWeek}h/week</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={customHrs}
                onChange={(e) => { setCustomHrs(e.target.value); setRevealed(false); }}
                placeholder="Custom hrs/week…"
                min={0}
                max={168}
                className="flex-1 px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
                style={{ border: "2px solid var(--border)", outline: "none" }}
              />
            </div>
          </div>

          {error && (
            <p className="text-[11px] font-sans text-accent-utility-e">{error}</p>
          )}

          <button
            onClick={handleCalculate}
            disabled={!userBirth || !parentBirth}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            Calculate My Parent Time
          </button>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {revealed && stats ? (
            <div className="p-4 md:p-5 flex flex-col gap-5">

              {/* Main headline */}
              <div>
                <p
                  className="font-display font-light italic text-text-primary leading-tight mb-4"
                  style={{ fontSize: "clamp(1.3rem, 3vw, 2rem)" }}
                >
                  You have spent{" "}
                  <span style={{ color: accent, fontStyle: "normal", fontWeight: 700 }}>
                    {stats.pctSpent.toFixed(1)}%
                  </span>{" "}
                  of your total parent time.
                </p>

                {/* Progress bar */}
                <div
                  className="w-full h-5 relative overflow-hidden"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-base)" }}
                >
                  <div
                    className="absolute inset-y-0 left-0 transition-all duration-700"
                    style={{ width: `${Math.min(100, stats.pctSpent)}%`, background: accent }}
                  />
                  <div
                    className="absolute inset-y-0 right-0 transition-all duration-700"
                    style={{ width: `${Math.max(0, 100 - stats.pctSpent)}%`, background: "var(--bg-surface)" }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider">past</span>
                  <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider">future</span>
                </div>
              </div>

              {/* Two-column stats */}
              <div className="grid grid-cols-2 gap-3">
                {/* Past */}
                <div
                  className="p-4"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
                >
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-2">
                    Already spent
                  </p>
                  <p className="font-mono text-xl font-black" style={{ color: accent }}>
                    {fmtHrs(stats.pastHrs)}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-text-faint font-sans">Days</span>
                      <span className="font-mono text-text-muted">{fmtNum(stats.pastHrs / 24)}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-text-faint font-sans">Years</span>
                      <span className="font-mono text-text-muted">{(stats.pastHrs / 8760).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Future */}
                <div
                  className="p-4"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
                >
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-2">
                    Remaining
                  </p>
                  <p className="font-mono text-xl font-black" style={{ color: accent }}>
                    {fmtHrs(stats.futureHrs)}
                  </p>
                  <div className="mt-2 flex flex-col gap-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-text-faint font-sans">Days</span>
                      <span className="font-mono text-text-muted">{fmtNum(stats.futureHrs / 24)}</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-text-faint font-sans">Years</span>
                      <span className="font-mono text-text-muted">{(stats.futureHrs / 8760).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div
                className="p-4"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
              >
                <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-3">
                  Milestones remaining
                </p>
                {([
                  ["🎄", "Christmases together",    stats.christmasesLeft],
                  ["🎂", "Birthdays celebrated",    stats.birthdaysTogether],
                  ["🏖", "Family holiday weeks",    stats.familyHolidayWksLeft],
                  ["📞", "Weekly calls remaining",  Math.max(0, Math.floor(stats.parentRemainingYrs * 52))],
                ] as [string, string, number][]).map(([emoji, label, count]) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
                  >
                    <span className="font-sans text-xs text-text-muted">{emoji} {label}</span>
                    <span className="font-mono text-sm font-bold" style={{ color: accent }}>
                      {fmtNum(count)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Context note */}
              <div
                className="p-4"
                style={{ border: `2px solid ${accent}33`, background: `${accent}09` }}
              >
                <p className="text-[11px] font-sans text-text-muted leading-relaxed">
                  The average person completes approximately{" "}
                  <span style={{ color: accent }} className="font-semibold">85%</span>{" "}
                  of their total parent time by the time they leave home at 18 — long before either party realises the clock has been running.
                </p>
                <p className="text-[10px] font-sans text-text-faint italic mt-2">
                  Time is the one thing you cannot give more of. Spend it accordingly.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                How much parent time have you already spent?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Most people have used more than 85% of their total in-person parent time before they&apos;ve noticed it passing. Enter your dates to see where you stand.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
