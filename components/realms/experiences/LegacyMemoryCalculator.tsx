"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { BirthDatePicker } from "@/components/ui";

// ─── Impact levels ────────────────────────────────────────────────────────────

type Impact = "personal" | "local" | "notable" | "historical";

const IMPACT_OPTIONS: { value: Impact; label: string; note: string }[] = [
  { value: "personal",   label: "Personal",   note: "Remembered by family only" },
  { value: "local",      label: "Local",      note: "Community figure, local legacy" },
  { value: "notable",    label: "Notable",    note: "Field-recognized, Wikipedia likely" },
  { value: "historical", label: "Historical", note: "Changes the course of events" },
];

const PROFESSIONAL_LEGACY_YRS: Record<Impact, number> = {
  personal:   20,
  local:      50,
  notable:    150,
  historical: 1000,
};

// ─── Timeline event ───────────────────────────────────────────────────────────

type TimelineEvent = {
  yearsAfterDeath: number;
  emoji: string;
  title: string;
  description: string;
  color: string;
};

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtYear(y: number): string {
  return y.toLocaleString("en-US", { useGrouping: false });
}

function fmtYrs(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k years`;
  return `${n} year${n !== 1 ? "s" : ""}`;
}

// ─── Timeline node ────────────────────────────────────────────────────────────

function TimelineNode({
  event,
  deathYear,
  isFirst,
  accent,
}: {
  event: TimelineEvent;
  deathYear: number;
  isFirst: boolean;
  accent: string;
}) {
  const absoluteYear = deathYear + event.yearsAfterDeath;

  return (
    <div className="flex gap-3">
      {/* Left: line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-8">
        {!isFirst && <div className="w-0.5 flex-1" style={{ background: "var(--border)", minHeight: 16 }} />}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
          style={{
            background: `${event.color}18`,
            border: `2px solid ${event.color}55`,
          }}
        >
          {event.emoji}
        </div>
        <div className="w-0.5 flex-1" style={{ background: "var(--border)", minHeight: 16 }} />
      </div>

      {/* Right: content */}
      <div className="flex-1 pb-5 pt-1">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="font-mono text-sm font-black" style={{ color: event.color }}>
            {event.yearsAfterDeath === 0 ? fmtYear(deathYear) : fmtYear(absoluteYear)}
          </span>
          {event.yearsAfterDeath > 0 && (
            <span className="text-[9px] font-mono text-text-faint">
              (+{fmtYrs(event.yearsAfterDeath)})
            </span>
          )}
        </div>
        <p className="font-sans text-xs font-bold text-text-primary mb-0.5">{event.title}</p>
        <p className="text-[10px] font-sans text-text-muted leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LegacyMemoryCalculator() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "legacy-memory-calculator";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [birthDate,   setBirthDate]   = useState<Date | undefined>(undefined);
  const [lifeExp,     setLifeExp]     = useState(80);
  const [children,    setChildren]    = useState(0);
  const [impact,      setImpact]      = useState<Impact>("personal");
  const [revealed,    setRevealed]    = useState(false);
  const [error,       setError]       = useState("");

  const birthYear = useMemo(() => {
    if (!birthDate) return null;
    return birthDate.getFullYear();
  }, [birthDate]);

  const currentAge = useMemo(() => {
    if (!birthDate) return null;
    return (Date.now() - birthDate.getTime()) / (365.25 * 86_400_000);
  }, [birthDate]);

  const deathYear = birthYear !== null ? birthYear + lifeExp : null;

  const timelineEvents = useMemo((): TimelineEvent[] => {
    if (deathYear === null) return [];

    const profLegacyYrs = PROFESSIONAL_LEGACY_YRS[impact];
    const nameSpokenYrs = children > 0 ? 75 : 30;

    return [
      {
        yearsAfterDeath: 0,
        emoji: "🕯",
        title: "Physical presence ends",
        description: "Your body ceases. The people who knew you carry the first and sharpest memories.",
        color: accent,
      },
      {
        yearsAfterDeath: 5,
        emoji: "📱",
        title: "Digital accounts become ghost profiles",
        description: "Social media platforms retain inactive accounts indefinitely. Your posts, photos, and messages remain — unmaintained, but visible. A digital ghost.",
        color: "var(--text-muted)",
      },
      {
        yearsAfterDeath: profLegacyYrs,
        emoji: "💼",
        title: `Professional legacy fades (${impact})`,
        description:
          impact === "personal"   ? "Colleagues and professional contacts lose touch. Your work contributions are absorbed into the broader record without attribution." :
          impact === "local"      ? "Local publications and community memory fade. Your contributions may be listed in records but are no longer actively discussed." :
          impact === "notable"    ? "Academic and professional citation peaks and then fades. Future specialists may still reference your work in historical context." :
                                    "Your influence on history remains legible for centuries — in textbooks, monuments, cultural reference, and scholarly study.",
        color: "var(--text-muted)",
      },
      {
        yearsAfterDeath: 40,
        emoji: "📷",
        title: "Living memory fades",
        description: "The last people who knew you personally are gone. Your name may still be spoken, but direct sensory memory — your voice, your laugh, the way you moved — no longer exists in anyone living.",
        color: "var(--text-muted)",
      },
      {
        yearsAfterDeath: nameSpokenYrs,
        emoji: "🔇",
        title: "Your name is spoken for the last time",
        description: children > 0
          ? "A great-grandchild mentions you at a family gathering — possibly the last time your name crosses living lips. After this, you exist only in records."
          : "Without direct descendants to pass your name forward, active mention of you in living conversation ends within a generation.",
        color: "var(--destructive)",
      },
      {
        yearsAfterDeath: 175,
        emoji: "📜",
        title: "Genealogy records become the last trace",
        description: "Family trees and historical records may still list your name, birth year, and death year. You exist as data — accurate but inert. Archivists may find you; no one will feel you.",
        color: "var(--text-faint)",
      },
      {
        yearsAfterDeath: 250,
        emoji: "🧬",
        title: "Your DNA dissolves into the human pool",
        description: "After approximately 10 generations, your unique genetic combination has been halved so many times that no single living person carries a statistically meaningful portion of your genome. You become part of the general human background.",
        color: "var(--text-faint)",
      },
    ]
      // Sort by yearsAfterDeath, deduplicate overlaps by keeping the one with the most specific message
      .sort((a, b) => a.yearsAfterDeath - b.yearsAfterDeath)
      // Remove entries where professional legacy and name-spoken overlap with adjacent events in a confusing way
      .filter((e, i, arr) => {
        if (i === 0) return true;
        return e.yearsAfterDeath !== arr[i - 1].yearsAfterDeath;
      });
  }, [deathYear, children, impact, accent]);

  const handleReveal = () => {
    if (!birthDate) { setError("Please enter your birth date."); return; }
    if (birthDate > new Date()) { setError("Birth date cannot be in the future."); return; }
    setError("");
    setRevealed(true);
  };

  const yrsRemaining = currentAge !== null ? Math.max(0, lifeExp - currentAge) : null;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          <BirthDatePicker
            id="lmc-birth"
            label="Your Birth Date"
            value={birthDate}
            onChange={(v) => { setBirthDate(v); setError(""); setRevealed(false); }}
          />

          {/* Life expectancy */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
                Life expectancy
              </label>
              <span className="font-mono text-xs" style={{ color: accent }}>{lifeExp} years</span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              step={1}
              value={lifeExp}
              onChange={(e) => { setLifeExp(Number(e.target.value)); setRevealed(false); }}
              className="w-full"
              style={{ accentColor: accent }}
            />
            <div className="flex justify-between text-[9px] font-sans text-text-faint">
              <span>70</span><span>80 (avg)</span><span>100</span>
            </div>
          </div>

          {/* Children */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Number of children
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => { setChildren(n); setRevealed(false); }}
                  className="w-9 h-9 font-mono text-sm font-bold transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: children === n ? accent : "var(--bg-card)",
                    color: children === n ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: children === n ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Impact level */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Impact level
            </label>
            <div className="flex flex-col gap-1.5">
              {IMPACT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setImpact(opt.value); setRevealed(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-left transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: impact === opt.value ? `${accent}18` : "var(--bg-card)",
                    boxShadow: impact === opt.value ? `2px 2px 0 ${accent}44` : "none",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: impact === opt.value ? accent : "var(--text-faint)" }}
                  />
                  <div>
                    <span className="block text-[11px] font-sans font-bold" style={{ color: impact === opt.value ? accent : "var(--text-muted)" }}>
                      {opt.label}
                    </span>
                    <span className="block text-[9px] font-sans text-text-faint">{opt.note}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-[11px] font-sans" style={{ color: "var(--destructive)" }}>{error}</p>}

          <button
            onClick={handleReveal}
            disabled={!birthDate}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            Calculate My Legacy
          </button>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {revealed && deathYear !== null ? (
            <div className="p-4 md:p-5 flex flex-col gap-5">
              {/* Death year + years remaining */}
              <div
                className="p-4 flex items-center justify-between gap-4"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
              >
                <div>
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                    Projected death year
                  </p>
                  <p className="font-mono text-2xl font-black" style={{ color: accent }}>
                    {fmtYear(deathYear)}
                  </p>
                </div>
                {yrsRemaining !== null && (
                  <div className="text-right">
                    <p className="text-[9px] font-sans text-text-faint uppercase tracking-wider mb-1">Years remaining</p>
                    <p className="font-mono text-xl font-black text-text-muted">
                      {yrsRemaining.toFixed(1)}
                    </p>
                  </div>
                )}
              </div>

              <p
                className="font-display font-light italic text-text-muted leading-snug"
                style={{ fontSize: "clamp(0.95rem, 2vw, 1.15rem)" }}
              >
                Here is what happens after.
              </p>

              {/* Dissolution timeline */}
              <div
                className="p-4"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
              >
                <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-4">
                  Dissolution timeline
                </p>
                {timelineEvents.map((ev, i) => (
                  <TimelineNode
                    key={ev.title}
                    event={ev}
                    deathYear={deathYear}
                    isFirst={i === 0}
                    accent={accent}
                  />
                ))}
              </div>

              {/* Good news panel */}
              <div
                className="p-4"
                style={{ border: `2px solid ${accent}44`, background: `${accent}08` }}
              >
                <p className="text-[10px] font-sans font-bold mb-1" style={{ color: accent }}>A note</p>
                <p className="text-[11px] font-sans text-text-muted leading-relaxed">
                  Delete your accounts now and you outlive your digital ghost. Have children and they carry your name an extra generation or two. Produce genuine work and it outlives your social circle by centuries. Memory — real, lived memory — is the only thing you can genuinely leave behind. Everything else is a record.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                After you die, how long do you exist?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                A timeline from your last breath through your last spoken name, your digital ghost, your family memory, and the final dissolution of your DNA into the human gene pool — roughly 250 years out.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
