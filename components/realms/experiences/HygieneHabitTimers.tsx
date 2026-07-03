"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Threshold definitions ────────────────────────────────────────────────────

type ThresholdLevel = { maxDays: number; label: string; status: "good" | "warn" | "bad" | "critical" };

const JEANS_THRESHOLDS: ThresholdLevel[] = [
  { maxDays: 3,   label: "Fresh",                     status: "good"     },
  { maxDays: 7,   label: "Acceptable",                status: "warn"     },
  { maxDays: 14,  label: "Approaching limit",         status: "bad"      },
  { maxDays: 9999,label: "The TVA has been notified", status: "critical" },
];

const SHEETS_THRESHOLDS: ThresholdLevel[] = [
  { maxDays: 7,   label: "Normal",               status: "good"     },
  { maxDays: 14,  label: "Dust mites establishing", status: "warn"   },
  { maxDays: 21,  label: "Colony critical mass",  status: "bad"      },
  { maxDays: 9999,label: "Mattress filed a restraining order", status: "critical" },
];

const HAIRCUT_THRESHOLDS: ThresholdLevel[] = [
  { maxDays: 2,   label: "Too fresh (shape settling)", status: "warn"  },
  { maxDays: 7,   label: "Peak window",               status: "good"   },
  { maxDays: 14,  label: "Acceptable",                status: "warn"   },
  { maxDays: 9999,label: "Growing intentionally, we assume", status: "bad" },
];

const BOTTLE_THRESHOLDS: ThresholdLevel[] = [
  { maxDays: 1,   label: "Acceptable",                      status: "good"     },
  { maxDays: 2,   label: "Biofilm forming",                 status: "warn"     },
  { maxDays: 3,   label: "More bacteria than a toilet seat",status: "bad"      },
  { maxDays: 9999,label: "You've built an ecosystem",       status: "critical" },
];

function getThreshold(days: number, thresholds: ThresholdLevel[]): ThresholdLevel {
  return thresholds.find(t => days <= t.maxDays) ?? thresholds[thresholds.length - 1];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: ThresholdLevel["status"]): string {
  switch (status) {
    case "good":     return "var(--accent-utility-a)";
    case "warn":     return "var(--accent-utility-d)";
    case "bad":      return "var(--destructive)";
    case "critical": return "var(--destructive)";
  }
}

function daysSince(date: Date, now: Date): number {
  return Math.floor((now.getTime() - date.getTime()) / 86_400_000);
}

function hoursSince(date: Date, now: Date): number {
  return (now.getTime() - date.getTime()) / 3_600_000;
}

function formatDaysAgo(days: number): string {
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function todayStr(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date(Date.now() - 86_400_000);
  return d.toISOString().slice(0, 10);
}

// Exponential bacteria level for display (0–100 visual scale)
function bacteriaLevel(daysSinceWash: number, doublingHours: number, maxDays: number): number {
  const hours = daysSinceWash * 24;
  const doublings = hours / doublingHours;
  const raw = Math.pow(2, doublings);
  const maxRaw = Math.pow(2, (maxDays * 24) / doublingHours);
  return Math.min(100, (raw / maxRaw) * 100);
}

// ─── Date picker ──────────────────────────────────────────────────────────────

function DatePickerInput({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <input
        type="date"
        value={value}
        max={todayStr()}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 font-mono text-sm rounded"
        style={{
          border: "2px solid var(--border)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
          accentColor: accent,
        }}
      />
    </div>
  );
}

// ─── Hygiene card ─────────────────────────────────────────────────────────────

function HygieneCard({
  emoji,
  title,
  days,
  hours,
  threshold,
  bacteriaPct,
  bacteriaLabel,
  timelineMax,
  peakStart,
  peakEnd,
  accent,
  children,
}: {
  emoji: string;
  title: string;
  days: number;
  hours?: number;
  threshold: ThresholdLevel;
  bacteriaPct?: number;
  bacteriaLabel?: string;
  timelineMax?: number;
  peakStart?: number;
  peakEnd?: number;
  accent: string;
  children?: React.ReactNode;
}) {
  const color = statusColor(threshold.status);
  const displayDays = hours !== undefined ? hours : days;
  const unit = hours !== undefined ? "hrs" : "days";

  return (
    <div
      className="p-4 rounded flex flex-col gap-3"
      style={{
        border: `2px solid ${threshold.status === "critical" ? "var(--destructive)" : "var(--border)"}`,
        boxShadow: "3px 3px 0 var(--shadow-color)",
        background: "var(--bg-card)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
            {emoji} {title}
          </div>
          <div className="font-mono text-2xl font-bold mt-0.5" style={{ color }}>
            {typeof displayDays === "number" ? displayDays.toFixed(hours !== undefined ? 1 : 0) : displayDays}
            <span className="text-sm font-sans text-text-muted ml-1">{unit}</span>
          </div>
        </div>
        <div
          className="px-2 py-1 rounded text-[10px] font-mono font-bold flex-shrink-0"
          style={{ background: `${color}22`, color, border: `1px solid ${color}` }}
        >
          {threshold.label}
        </div>
      </div>

      {/* Haircut peak window timeline */}
      {timelineMax !== undefined && peakStart !== undefined && peakEnd !== undefined && (
        <div className="relative h-4 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
          {/* Peak window highlight */}
          <div
            className="absolute h-full"
            style={{
              left: `${(peakStart / timelineMax) * 100}%`,
              width: `${((peakEnd - peakStart) / timelineMax) * 100}%`,
              background: `${accent}44`,
              borderLeft: `2px solid ${accent}`,
              borderRight: `2px solid ${accent}`,
            }}
          />
          {/* Current position */}
          <div
            className="absolute h-full w-0.5"
            style={{
              left: `${Math.min(100, (days / timelineMax) * 100)}%`,
              background: color,
            }}
          />
        </div>
      )}
      {timelineMax !== undefined && (
        <div className="flex justify-between text-[9px] font-sans text-text-faint">
          <span>Day 0</span>
          <span style={{ color: accent }}>Peak: day {peakStart}–{peakEnd}</span>
          <span>Day {timelineMax}+</span>
        </div>
      )}

      {/* Bacteria bar */}
      {bacteriaPct !== undefined && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[9px] font-sans text-text-faint">
            <span>Bacterial load</span>
            <span style={{ color }}>{bacteriaLabel}</span>
          </div>
          <div className="relative h-2 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
            <div
              className="h-full rounded transition-all"
              style={{ width: `${bacteriaPct}%`, background: color }}
            />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HygieneHabitTimers() {
  const slug   = usePathname().split("/").pop();
  const realm  = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];
  const accent = realm.accent;

  const [jeansDate,   setJeansDate]   = useState(yesterdayStr());
  const [sheetsDate,  setSheetsDate]  = useState(() => {
    const d = new Date(Date.now() - 10 * 86_400_000);
    return d.toISOString().slice(0, 10);
  });
  const [haircutDate, setHaircutDate] = useState(() => {
    const d = new Date(Date.now() - 5 * 86_400_000);
    return d.toISOString().slice(0, 10);
  });
  const [bottleDate,  setBottleDate]  = useState(yesterdayStr());

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const data = useMemo(() => {
    const jeans   = new Date(jeansDate);
    const sheets  = new Date(sheetsDate);
    const haircut = new Date(haircutDate);
    const bottle  = new Date(bottleDate);

    const jeansDays   = daysSince(jeans,   now);
    const sheetsDays  = daysSince(sheets,  now);
    const haircutDays = daysSince(haircut, now);
    const bottleHrs   = hoursSince(bottle, now);

    return {
      jeansDays,
      sheetsDays,
      haircutDays,
      bottleHrs,
      jeansThreshold:   getThreshold(jeansDays, JEANS_THRESHOLDS),
      sheetsThreshold:  getThreshold(sheetsDays, SHEETS_THRESHOLDS),
      haircutThreshold: getThreshold(haircutDays, HAIRCUT_THRESHOLDS),
      bottleThreshold:  getThreshold(bottleHrs / 24, BOTTLE_THRESHOLDS),
      jeansBactPct:     bacteriaLevel(jeansDays, 0.33, 15),   // doubles every 20min
      sheetsBactPct:    bacteriaLevel(sheetsDays, 8, 28),     // slower on sheets
      bottleBactPct:    bacteriaLevel(bottleHrs / 24, 0.5/24, 3), // very fast in bottle
    };
  }, [jeansDate, sheetsDate, haircutDate, bottleDate, now]);

  // ─── Controls ──────────────────────────────────────────────────────────────

  const controls = (
    <div className="flex flex-col gap-5">
      <DatePickerInput label="👖 Last Jeans Wash"      value={jeansDate}   onChange={setJeansDate}   accent={accent} />
      <DatePickerInput label="🛏️ Last Bed Sheet Wash"  value={sheetsDate}  onChange={setSheetsDate}  accent={accent} />
      <DatePickerInput label="✂️ Last Haircut"          value={haircutDate} onChange={setHaircutDate} accent={accent} />
      <DatePickerInput label="🚰 Last Water Bottle Wash" value={bottleDate} onChange={setBottleDate}  accent={accent} />

      <div
        className="p-4 rounded"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted mb-2">
          About the Science
        </div>
        <p className="text-xs font-sans text-text-muted leading-relaxed">
          Bacterial growth estimates are based on published microbiological research. Bacteria on unwashed jeans double approximately every 20 minutes under warm conditions. Water bottle biofilm studies show bacterial counts exceeding toilet seats after ~72 hours. Thresholds are indicative, not medical advice.
        </p>
      </div>
    </div>
  );

  // ─── Canvas section ────────────────────────────────────────────────────────

  const canvas_ = (
    <div className="flex flex-col gap-4">
      <HygieneCard
        emoji="👖"
        title="Jeans Rewear Validity"
        days={data.jeansDays}
        threshold={data.jeansThreshold}
        bacteriaPct={data.jeansBactPct}
        bacteriaLabel={
          data.jeansDays <= 3  ? "~10k/cm² (baseline)" :
          data.jeansDays <= 7  ? "~100k/cm² (elevated)" :
          data.jeansDays <= 14 ? "~1M/cm² (high)" :
          "~10M+/cm² (send help)"
        }
        accent={accent}
      >
        <div className="text-[10px] font-sans text-text-muted">
          {formatDaysAgo(data.jeansDays)} • {data.jeansThreshold.status === "critical"
            ? "Most denim researchers recommend washing every 3–7 days. The TVA has logged this as an unauthorised timeline."
            : "Denim bacteria double approx every 20 minutes in warm, moist conditions."}
        </div>
      </HygieneCard>

      <HygieneCard
        emoji="🛏️"
        title="Bed Sheet Bacteria Clock"
        days={data.sheetsDays}
        threshold={data.sheetsThreshold}
        bacteriaPct={data.sheetsBactPct}
        bacteriaLabel={
          data.sheetsDays <= 7  ? "Normal skin flora" :
          data.sheetsDays <= 14 ? "2× skin cells, dust mites arriving" :
          data.sheetsDays <= 21 ? "~1.5M bacteria per cm²" :
          "Colony achieved. You are sleeping in an ecosystem."
        }
        accent={accent}
      >
        <div className="text-[10px] font-sans text-text-muted">
          {formatDaysAgo(data.sheetsDays)} • The average person sheds ~30,000 dead skin cells per hour in bed. Most sleep hygiene guidelines recommend weekly washing.
        </div>
      </HygieneCard>

      <HygieneCard
        emoji="✂️"
        title="Perfect Haircut Window"
        days={data.haircutDays}
        threshold={data.haircutThreshold}
        timelineMax={21}
        peakStart={3}
        peakEnd={7}
        accent={accent}
      >
        <div className="text-[10px] font-sans text-text-muted">
          {formatDaysAgo(data.haircutDays)} •{" "}
          {data.haircutDays <= 2 ? "Fresh cuts need 2–3 days to settle into their shape." :
           data.haircutDays <= 7 ? "You're in the peak window. This is your moment." :
           data.haircutDays <= 14 ? "Hair is growing but still manageable." :
           "This is a lifestyle choice and we respect that."}
        </div>
      </HygieneCard>

      <HygieneCard
        emoji="🚰"
        title="Water Bottle Bacteria Level"
        days={0}
        hours={data.bottleHrs}
        threshold={data.bottleThreshold}
        bacteriaPct={data.bottleBactPct}
        bacteriaLabel={
          data.bottleHrs <= 24 ? "Minimal — biofilm not yet established" :
          data.bottleHrs <= 48 ? "Biofilm forming on inner surface" :
          data.bottleHrs <= 72 ? "Exceeds average toilet seat count (studies confirmed)" :
          "Scientifically speaking: a terrarium"
        }
        accent={accent}
      >
        <div className="text-[10px] font-sans text-text-muted">
          {data.bottleHrs.toFixed(1)} hours since last wash •{" "}
          {data.bottleHrs <= 48
            ? "Reusable bottle biofilm grows rapidly due to mouth-contact bacteria + warm water."
            : "Multiple studies (including Treadmill Reviews, 2017) found bacteria counts in unwashed bottles exceeding toilet seats after 72h."}
        </div>
      </HygieneCard>
    </div>
  );

  return (
    <RealmLayout realm={realm} controlsSection={controls} canvasSection={canvas_} />
  );
}
