"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Dataset ──────────────────────────────────────────────────────────────────

type Experience = {
  label: string;
  emoji: string;
  perYear: number;
  note: string;
  featured?: boolean;
};

const EXPERIENCES: Experience[] = [
  { label: "Christmases",       emoji: "🎄", perYear: 1,      note: "one per year",                 featured: true },
  { label: "Birthdays",         emoji: "🎂", perYear: 1,      note: "yours" },
  { label: "Summers",           emoji: "☀️", perYear: 1,      note: "June–August" },
  { label: "Full moons",        emoji: "🌕", perYear: 12.37,  note: "13 per year" },
  { label: "Sunsets",           emoji: "🌅", perYear: 365,    note: "weather permitting",           featured: true },
  { label: "Monday mornings",   emoji: "😐", perYear: 52,     note: "non-negotiable" },
  { label: "New Year's Eves",   emoji: "🥂", perYear: 1,      note: "one per year" },
  { label: "Olympic Games",     emoji: "🏅", perYear: 0.5,    note: "summer + winter every 4 yrs" },
  { label: "World Cups",        emoji: "⚽", perYear: 0.25,   note: "one every 4 years" },
  { label: "Leap years",        emoji: "📅", perYear: 0.25,   note: "every 4 years" },
  { label: "Haircuts",          emoji: "✂️", perYear: 10,     note: "avg. one per 5 weeks" },
  { label: "Meals",             emoji: "🍽", perYear: 1095,   note: "3 per day" },
  { label: "Sleeps",            emoji: "💤", perYear: 365,    note: "one per night, probably" },
  { label: "First snowfalls",   emoji: "❄️", perYear: 1,      note: "if you live somewhere cold" },
  { label: "April Fool's Days", emoji: "🤡", perYear: 1,      note: "one per year, mercifully" },
];

// ─── Life expectancy options ──────────────────────────────────────────────────

type Outlook = { label: string; years: number };

const OUTLOOKS: Outlook[] = [
  { label: "Optimistic",   years: 90 },
  { label: "Average",      years: 80 },
  { label: "Pessimistic",  years: 70 },
];

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  return String(Math.max(0, n));
}

// ─── Experience card ──────────────────────────────────────────────────────────

function ExpCard({
  exp,
  count,
  accent,
  featured,
}: {
  exp: Experience;
  count: number;
  accent: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-1 p-4 transition-all duration-150 ${featured ? "md:col-span-1" : ""}`}
      style={{
        border: "2px solid var(--border)",
        background: "var(--bg-card)",
        boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px, -2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "5px 5px 0 var(--shadow-color)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "3px 3px 0 var(--shadow-color)";
      }}
    >
      <span className={featured ? "text-2xl" : "text-xl"}>{exp.emoji}</span>
      <div
        className="font-mono tabular-nums leading-none"
        style={{
          fontSize: featured ? "2rem" : "1.5rem",
          fontWeight: 900,
          color: count > 0 ? accent : "var(--text-faint)",
        }}
      >
        {count > 0 ? fmtCount(count) : "0"}
      </div>
      <span className="font-sans text-xs font-semibold text-text-muted">{exp.label}</span>
      <span className="text-[9px] font-sans text-text-faint">{exp.note}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function RemainingExperiences() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "remaining-experiences";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [age,     setAge]     = useState("");
  const [outlook, setOutlook] = useState<Outlook>(OUTLOOKS[1]);
  const [error,   setError]   = useState("");
  const [shown,   setShown]   = useState(false);

  const ageNum = parseFloat(age);
  const valid  = !isNaN(ageNum) && ageNum >= 0 && ageNum < outlook.years;

  const remaining = useMemo(() => {
    if (!valid) return null;
    const yrsLeft = Math.max(0, outlook.years - ageNum);
    return EXPERIENCES.map((exp) => ({
      ...exp,
      count: Math.floor(yrsLeft * exp.perYear),
    }));
  }, [ageNum, outlook, valid]);

  const handleReveal = () => {
    if (!age)    { setError("Please enter your age."); return; }
    if (!valid)  { setError(`Age must be between 0 and ${outlook.years}.`); return; }
    setError("");
    setShown(true);
  };

  const yrsLeft = valid ? Math.max(0, outlook.years - ageNum) : 0;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          {/* Age input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Your Current Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => { setAge(e.target.value); setError(""); setShown(false); }}
              placeholder="e.g. 32"
              min={0}
              max={120}
              className="px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
              style={{ border: "2px solid var(--border)", outline: "none" }}
            />
            {error && (
              <p className="text-[11px] font-sans text-accent-utility-e">{error}</p>
            )}
          </div>

          {/* Outlook toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Life expectancy view
            </label>
            <div className="flex gap-1.5">
              {OUTLOOKS.map((o) => (
                <button
                  key={o.label}
                  onClick={() => { setOutlook(o); setShown(false); }}
                  className="flex-1 py-2 text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: outlook.label === o.label ? accent : "var(--bg-card)",
                    color: outlook.label === o.label ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: outlook.label === o.label ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleReveal}
            disabled={!age}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            Count My Remaining Experiences
          </button>

          {/* Quick stats after reveal */}
          {shown && valid && (
            <div className="flex flex-col gap-2 border-t border-border pt-5 mt-1">
              <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted mb-1">
                Summary ({outlook.label})
              </p>
              {([
                ["Years remaining",  Math.floor(yrsLeft).toLocaleString()],
                ["Days remaining",   Math.floor(yrsLeft * 365.25).toLocaleString()],
                ["Weeks remaining",  Math.floor(yrsLeft * 52.18).toLocaleString()],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-sans">{label}</span>
                  <span className="font-mono font-semibold" style={{ color: accent }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {shown && remaining ? (
            <div className="p-4 md:p-5 flex flex-col gap-4">
              <p
                className="font-display font-light italic text-text-primary leading-tight"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
              >
                {Math.floor(yrsLeft)} years. Here is what they contain.
              </p>

              {/* Outlook change note */}
              <div className="flex gap-1.5">
                {OUTLOOKS.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => setOutlook(o)}
                    className="px-2.5 py-1 text-[9px] font-sans font-bold uppercase tracking-wider transition-all"
                    style={{
                      border: "2px solid var(--border)",
                      background: outlook.label === o.label ? accent : "var(--bg-card)",
                      color: outlook.label === o.label ? "#0A0A0A" : "var(--text-muted)",
                      boxShadow: outlook.label === o.label ? "2px 2px 0 var(--shadow-color)" : "none",
                    }}
                  >
                    {o.label} ({o.years}yr)
                  </button>
                ))}
              </div>

              {/* Experience grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {remaining.map((exp) => (
                  <ExpCard
                    key={exp.label}
                    exp={exp}
                    count={exp.count}
                    accent={accent}
                    featured={exp.featured}
                  />
                ))}
              </div>

              {/* Closing note */}
              <p className="text-[10px] font-sans text-text-faint italic text-center mt-1 leading-relaxed">
                These numbers assume you reach exactly {outlook.years}. Each experience assumes average attendance and fair weather. Reality may vary. Live accordingly.
              </p>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                How many Christmases do you have left?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your age to count every remaining experience — Christmases, full moons, sunsets, Olympic Games, and more.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
