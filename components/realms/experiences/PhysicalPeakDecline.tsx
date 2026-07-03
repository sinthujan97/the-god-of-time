"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { BirthDatePicker } from "@/components/ui";

// ─── Discipline dataset ───────────────────────────────────────────────────────

type Category = "physical" | "cognitive" | "wisdom";

type Discipline = {
  id: string;
  label: string;
  emoji: string;
  peakStart: number;
  peakEnd: number;
  note: string;
  category: Category;
};

const DISCIPLINES: Discipline[] = [
  // Physical
  { id: "sprint",     label: "Sprinting",         emoji: "💨", peakStart: 22, peakEnd: 26, note: "Fast-twitch fiber density + reaction speed",     category: "physical" },
  { id: "marathon",   label: "Marathon",           emoji: "🏃", peakStart: 27, peakEnd: 30, note: "Aerobic endurance + pain tolerance sweet spot",  category: "physical" },
  { id: "swimming",   label: "Swimming",           emoji: "🏊", peakStart: 21, peakEnd: 24, note: "Power-to-drag ratio at peak",                    category: "physical" },
  { id: "cycling",    label: "Cycling",            emoji: "🚴", peakStart: 26, peakEnd: 32, note: "VO2 max + sustained endurance combined",         category: "physical" },
  { id: "tennis",     label: "Tennis",             emoji: "🎾", peakStart: 24, peakEnd: 28, note: "Explosive speed + tactical maturity",            category: "physical" },
  { id: "golf",       label: "Golf",               emoji: "⛳", peakStart: 30, peakEnd: 35, note: "Technique and course management outlast speed",  category: "physical" },
  // Cognitive
  { id: "chess",      label: "Chess",              emoji: "♟", peakStart: 28, peakEnd: 35, note: "Pattern recognition + calculating speed",        category: "cognitive" },
  { id: "maths",      label: "Mathematics",        emoji: "∑",  peakStart: 25, peakEnd: 35, note: "Novel problem-solving and creative leaps",       category: "cognitive" },
  { id: "processing", label: "Processing Speed",   emoji: "⚡", peakStart: 18, peakEnd: 24, note: "Raw cognitive throughput — peaks early",        category: "cognitive" },
  // Wisdom
  { id: "vocabulary", label: "Vocabulary",         emoji: "📖", peakStart: 65, peakEnd: 72, note: "Continues growing your entire life",             category: "wisdom" },
  { id: "emotional",  label: "Emotional IQ",       emoji: "❤️", peakStart: 55, peakEnd: 65, note: "Empathy, regulation, and reading people matures late", category: "wisdom" },
  { id: "wisdom",     label: "Wisdom",             emoji: "🦉", peakStart: 70, peakEnd: 80, note: "Life experience crystallises into judgment",     category: "wisdom" },
];

const CATEGORY_LABELS: Record<Category, string> = {
  physical:  "Physical",
  cognitive: "Cognitive",
  wisdom:    "Wisdom & Emotional",
};

const TIMELINE_MIN = 18;
const TIMELINE_MAX = 82;

// ─── Status helpers ───────────────────────────────────────────────────────────

type PeakStatus = "past" | "in_window" | "ahead";

function getPeakStatus(age: number, d: Discipline): PeakStatus {
  if (age > d.peakEnd)    return "past";
  if (age >= d.peakStart) return "in_window";
  return "ahead";
}

const STATUS_LABEL: Record<PeakStatus, string>  = { past: "PAST PEAK", in_window: "IN PEAK WINDOW", ahead: "PEAK AHEAD" };
const STATUS_COLOR_KEY: Record<PeakStatus, string> = {
  past:      "var(--text-faint)",
  in_window: "var(--accent-utility-a)",
  ahead:     "var(--accent-utility-d)",
};

// ─── Peak map row ─────────────────────────────────────────────────────────────

function PeakRow({
  d,
  age,
  accent,
  selected,
  onSelect,
}: {
  d: Discipline;
  age: number;
  accent: string;
  selected: boolean;
  onSelect: () => void;
}) {
  const status    = getPeakStatus(age, d);
  const range     = TIMELINE_MAX - TIMELINE_MIN;
  const leftPct   = ((d.peakStart - TIMELINE_MIN) / range) * 100;
  const widthPct  = ((d.peakEnd - d.peakStart) / range) * 100;
  const nowPct    = Math.min(100, Math.max(0, ((age - TIMELINE_MIN) / range) * 100));

  const barColor =
    status === "past"      ? "var(--text-faint)" :
    status === "in_window" ? "var(--accent-utility-a)" :
    accent;

  return (
    <button
      className="flex items-center gap-2 w-full py-1.5 text-left group"
      onClick={onSelect}
    >
      {/* Label */}
      <span className="text-sm flex-shrink-0 w-5 text-center">{d.emoji}</span>
      <span
        className="text-[10px] font-sans w-[88px] flex-shrink-0 truncate"
        style={{ color: selected ? accent : "var(--text-muted)", fontWeight: selected ? 700 : 500 }}
      >
        {d.label}
      </span>

      {/* Bar */}
      <div className="flex-1 relative h-4" style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
        {/* Peak window */}
        <div
          className="absolute inset-y-0"
          style={{ left: `${leftPct}%`, width: `${widthPct}%`, background: barColor, opacity: status === "past" ? 0.25 : 0.7 }}
        />
        {/* Now line */}
        <div
          className="absolute inset-y-0 w-0.5"
          style={{ left: `${nowPct}%`, background: accent, opacity: 1 }}
        />
      </div>

      {/* Status badge */}
      <span
        className="text-[8px] font-mono font-bold flex-shrink-0 w-14 text-right"
        style={{ color: STATUS_COLOR_KEY[status] }}
      >
        {status === "past" ? "PAST" : status === "in_window" ? "NOW" : "AHEAD"}
      </span>
    </button>
  );
}

// ─── Selected discipline detail ───────────────────────────────────────────────

function DisciplineDetail({
  d,
  age,
  accent,
}: {
  d: Discipline;
  age: number;
  accent: string;
}) {
  const status     = getPeakStatus(age, d);
  const statusColor = STATUS_COLOR_KEY[status];
  const yearsFromPeak =
    status === "past"      ? `${(age - d.peakEnd).toFixed(0)} years past your peak`       :
    status === "in_window" ? `You are inside the peak window right now`                   :
                             `${(d.peakStart - age).toFixed(0)} years until your peak begins`;

  return (
    <div
      className="p-4 flex flex-col gap-3"
      style={{
        border: `2px solid ${statusColor}55`,
        background: `${statusColor}08`,
        boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{d.emoji}</span>
        <div>
          <p className="font-sans text-sm font-bold text-text-primary">{d.label}</p>
          <p className="text-[9px] font-sans text-text-faint">{d.note}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider">Status</span>
          <span className="font-mono text-xs font-black" style={{ color: statusColor }}>
            {STATUS_LABEL[status]}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] font-sans text-text-faint uppercase tracking-wider">Peak window</span>
          <span className="font-mono text-xs font-bold text-text-muted">
            Age {d.peakStart}–{d.peakEnd}
          </span>
        </div>
      </div>

      <p className="text-[11px] font-sans text-text-muted italic leading-snug">{yearsFromPeak}</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function PhysicalPeakDecline() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "physical-peak-decline";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [birthDate,   setBirthDate]   = useState<Date | undefined>(undefined);
  const [selected,    setSelected]    = useState<string>("sprint");
  const [booksPerYear,setBooksPerYear]= useState(12);
  const [error,       setError]       = useState("");

  const age = useMemo(() => {
    if (!birthDate) return null;
    const now = Date.now();
    return (now - birthDate.getTime()) / (365.25 * 86_400_000);
  }, [birthDate]);

  const selectedDiscipline = DISCIPLINES.find(d => d.id === selected) ?? DISCIPLINES[0];

  const booksRemaining = useMemo(() => {
    if (age === null) return null;
    const yrsLeft = Math.max(0, 80 - age);
    return Math.floor(yrsLeft * booksPerYear);
  }, [age, booksPerYear]);

  const categories: Category[] = ["physical", "cognitive", "wisdom"];

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          {/* Birthdate */}
          <BirthDatePicker
            id="ppd-birth"
            label="Your Birth Date"
            value={birthDate}
            onChange={(v) => { setBirthDate(v); setError(""); }}
          />

          {error && <p className="text-[11px] font-sans" style={{ color: "var(--destructive)" }}>{error}</p>}

          {/* Discipline selector */}
          {age !== null && (
            <div className="flex flex-col gap-3">
              {categories.map((cat) => (
                <div key={cat} className="flex flex-col gap-1">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint">
                    {CATEGORY_LABELS[cat]}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {DISCIPLINES.filter(d => d.category === cat).map((d) => {
                      const status = getPeakStatus(age, d);
                      const isSelected = selected === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelected(d.id)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-sans font-bold transition-all"
                          style={{
                            border: "2px solid var(--border)",
                            background: isSelected ? accent : "var(--bg-card)",
                            color: isSelected ? "#0A0A0A" : STATUS_COLOR_KEY[status],
                            boxShadow: isSelected ? "2px 2px 0 var(--shadow-color)" : "none",
                          }}
                        >
                          <span>{d.emoji}</span>
                          <span>{d.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Books remaining */}
          {age !== null && (
            <div
              className="p-4 flex flex-col gap-3"
              style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">Books per year</span>
                <span className="font-mono text-xs font-bold" style={{ color: accent }}>{booksPerYear}</span>
              </div>
              <input
                type="range"
                min={1}
                max={52}
                step={1}
                value={booksPerYear}
                onChange={(e) => setBooksPerYear(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: accent }}
              />
              <p className="text-[11px] font-sans text-text-muted leading-snug">
                At {booksPerYear} book{booksPerYear !== 1 ? "s" : ""}/year, you have approximately{" "}
                <span className="font-mono font-bold" style={{ color: accent }}>{booksRemaining?.toLocaleString() ?? "—"}</span>{" "}
                books remaining in your reading life.
              </p>
            </div>
          )}

          {/* Instruction when no birth date */}
          {age === null && (
            <p className="text-[11px] font-sans text-text-faint italic text-center leading-relaxed">
              Enter your birth date to see where you stand on every peak.
            </p>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {age !== null ? (
            <div className="p-4 md:p-5 flex flex-col gap-5">
              {/* Age display */}
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-3xl font-black" style={{ color: accent }}>
                  {age.toFixed(1)}
                </span>
                <span className="font-sans text-sm text-text-muted">years old</span>
              </div>

              {/* Selected discipline detail */}
              <DisciplineDetail d={selectedDiscipline} age={age} accent={accent} />

              {/* Full peak map */}
              <div
                className="p-4 flex flex-col gap-1"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint">
                    Full peak map — age {TIMELINE_MIN} to {TIMELINE_MAX}
                  </p>
                  <div className="flex items-center gap-3 text-[8px] font-sans text-text-faint">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block opacity-25" style={{ background: "var(--text-faint)" }} /> past</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block" style={{ background: "var(--accent-utility-a)" }} /> now</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 inline-block opacity-70" style={{ background: accent }} /> ahead</span>
                  </div>
                </div>

                {/* Category groups */}
                {categories.map((cat) => (
                  <div key={cat} className="flex flex-col gap-0.5 mb-2">
                    <p className="text-[8px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                      {CATEGORY_LABELS[cat]}
                    </p>
                    {DISCIPLINES.filter(d => d.category === cat).map((d) => (
                      <PeakRow
                        key={d.id}
                        d={d}
                        age={age}
                        accent={accent}
                        selected={selected === d.id}
                        onSelect={() => setSelected(d.id)}
                      />
                    ))}
                  </div>
                ))}

                {/* X axis labels */}
                <div className="flex justify-between text-[8px] font-mono text-text-faint mt-1 pl-[116px]">
                  <span>{TIMELINE_MIN}</span>
                  <span>30</span>
                  <span>45</span>
                  <span>60</span>
                  <span>75</span>
                  <span>{TIMELINE_MAX}</span>
                </div>
              </div>

              {/* Good news panel */}
              <div
                className="p-4"
                style={{ border: `2px solid ${accent}44`, background: `${accent}08` }}
              >
                <p className="text-[10px] font-sans font-bold uppercase tracking-wider mb-1" style={{ color: accent }}>
                  The good news
                </p>
                <p className="text-[11px] font-sans text-text-muted leading-relaxed">
                  Vocabulary peaks at 67. Emotional intelligence in your late 50s. Wisdom in your 70s. Most of the peaks that actually determine the quality of your relationships, decisions, and inner life are still ahead for most people.
                </p>
              </div>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                Which peaks have you already passed?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your birth date to see where you are on 12 different human performance curves — from sprinting to wisdom.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
