"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Types ────────────────────────────────────────────────────────────────────

type PetType = "dog" | "cat" | "both";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDuration(totalSecs: number): string {
  const abs = Math.abs(totalSecs);
  if (abs < 60)  return `${abs}s`;
  if (abs < 3600) return `${Math.floor(abs / 60)}m ${abs % 60}s`;
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  return `${h}h ${m}m`;
}

function fmtCountdown(secsUntil: number): string {
  if (secsUntil <= 0) return "NOW";
  return fmtDuration(secsUntil);
}

function timePicker(label: string, value: string, onChange: (v: string) => void) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <input
        type="time"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-3 py-2 font-mono text-sm rounded"
        style={{
          border: "2px solid var(--border)",
          background: "var(--bg-card)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}

// ─── Timer card ───────────────────────────────────────────────────────────────

function TimerCard({
  emoji,
  label,
  value,
  description,
  status,
  accent,
  pct,
}: {
  emoji: string;
  label: string;
  value: string;
  description: string;
  status: "normal" | "warning" | "alert";
  accent: string;
  pct?: number;
}) {
  const statusColor =
    status === "alert"   ? "var(--destructive)" :
    status === "warning" ? "var(--accent-utility-d)" :
    accent;

  return (
    <div
      className="p-4 rounded flex flex-col gap-2 transition-all duration-150"
      style={{
        border: "2px solid var(--border)",
        boxShadow: `3px 3px 0 var(--shadow-color)`,
        background: "var(--bg-card)",
      }}
    >
      <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
        {emoji} {label}
      </div>
      <div className="font-mono text-2xl font-bold" style={{ color: statusColor }}>
        {value}
      </div>
      {pct !== undefined && (
        <div className="relative h-2 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
          <div
            className="h-full rounded transition-all"
            style={{ width: `${Math.min(100, pct)}%`, background: statusColor }}
          />
        </div>
      )}
      <div className="text-[10px] font-sans text-text-muted leading-relaxed">
        {description}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PetBehaviorTimers() {
  const slug   = usePathname().split("/").pop();
  const realm  = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];
  const accent = realm.accent;

  const [petType, setPetType]     = useState<PetType>("both");
  const [lastFed, setLastFed]     = useState<string>(() => {
    const d = new Date(Date.now() - 2 * 3600_000);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  });
  const [lastSeen, setLastSeen]   = useState<string>(() => {
    const d = new Date(Date.now() - 30 * 60_000);
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  });

  const [now, setNow] = useState(() => new Date());
  const napStartRef   = useRef<number>(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Parse HH:MM time string to today's Date
  function parseTime(hhmm: string): Date {
    const [h, m] = hhmm.split(":").map(Number);
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  }

  const nowSec  = now.getTime() / 1000;
  const nowHour = now.getHours() + now.getMinutes() / 60;

  // ── Dog calculations ───────────────────────────────────────────────────────

  const lastFedTime   = parseTime(lastFed);
  const lastSeenTime  = parseTime(lastSeen);

  // Dog food demand: every 12h, starts nagging ~30min before next meal
  const dogFedElapsedSec    = (now.getTime() - lastFedTime.getTime()) / 1000;
  const dogNextFeedSec      = 12 * 3600 - dogFedElapsedSec;
  const dogFoodNagSec       = dogNextFeedSec - 30 * 60; // starts nagging 30min early
  const dogFoodStatus =
    dogFoodNagSec <= 0 ? "alert" :
    dogFoodNagSec < 60 * 60 ? "warning" : "normal";

  // Separation anxiety: dogs notice at 14-20 min; use 17 min
  const separationSec   = (now.getTime() - lastSeenTime.getTime()) / 1000;
  const separationSatus: "normal" | "warning" | "alert" =
    separationSec > 17 * 60 ? "alert" :
    separationSec > 10 * 60 ? "warning" : "normal";
  const separationPct = Math.min(100, (separationSec / (17 * 60)) * 100);

  // Zoomie probability: peaks at 7AM and 7PM using gaussian approximation
  function zoomieProb(h: number): number {
    const g1 = Math.exp(-Math.pow(h - 7,  2) / 2);
    const g2 = Math.exp(-Math.pow(h - 19, 2) / 2);
    return Math.round(Math.min(99, (g1 + g2) * 65));
  }
  const dogZoomiePct = zoomieProb(nowHour);
  const dogZoomieStatus: "normal" | "warning" | "alert" =
    dogZoomiePct > 60 ? "alert" : dogZoomiePct > 30 ? "warning" : "normal";

  // ── Cat calculations ───────────────────────────────────────────────────────

  // Cat food: every 4-6 hrs, use 5h
  const catFedElapsedSec = dogFedElapsedSec; // same last-fed input
  const catNextFeedSec   = 5 * 3600 - catFedElapsedSec;
  const catFoodStatus: "normal" | "warning" | "alert" =
    catNextFeedSec <= 0 ? "alert" : catNextFeedSec < 30 * 60 ? "warning" : "normal";

  // 3AM zoomie: countdown to next 2:30 AM
  const next230 = new Date(now);
  next230.setHours(2, 30, 0, 0);
  if (next230 <= now) next230.setDate(next230.getDate() + 1);
  const zoomieCountdownSec = Math.round((next230.getTime() - now.getTime()) / 1000);

  // Nap cycle: cats ~90min cycles, estimate from wall time
  const NAP_CYCLE_MS  = 90 * 60_000;
  const napElapsedMs  = (now.getTime() - napStartRef.current) % NAP_CYCLE_MS;
  const napElapsedSec = Math.round(napElapsedMs / 1000);
  const napPct        = (napElapsedMs / NAP_CYCLE_MS) * 100;
  const napPhase      = napPct < 30 ? "Deep sleep" : napPct < 70 ? "REM dreaming" : "About to wake";

  // Attention span: 7-min rolling cycle
  const ATTENTION_MS  = 7 * 60_000;
  const attElapsedMs  = (now.getTime() - napStartRef.current) % ATTENTION_MS;
  const attRemainSec  = Math.round((ATTENTION_MS - attElapsedMs) / 1000);
  const attPct        = (attElapsedMs / ATTENTION_MS) * 100;

  // ── Controls ───────────────────────────────────────────────────────────────

  const controls = (
    <div className="flex flex-col gap-5">
      {/* Pet selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Pet Type
        </label>
        <div className="grid grid-cols-3 gap-2">
          {([["dog","🐶 Dog"],["cat","🐱 Cat"],["both","🐶🐱 Both"]] as [PetType,string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setPetType(t)}
              className="py-2 text-xs font-mono rounded transition-all duration-150"
              style={{
                border: "2px solid var(--border)",
                boxShadow: petType === t ? `2px 2px 0 ${accent}` : "2px 2px 0 var(--shadow-color)",
                background: petType === t ? accent : "var(--bg-card)",
                color: petType === t ? "var(--bg-base)" : "var(--text-primary)",
                transform: petType === t ? "translate(-1px,-1px)" : undefined,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {timePicker("🍖 Last Fed (both pets)", lastFed, setLastFed)}

      {(petType === "dog" || petType === "both") &&
        timePicker("👋 Dog Last Saw Owner", lastSeen, setLastSeen)
      }

      {/* Science note */}
      <div
        className="p-4 rounded"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted mb-2">
          About These Timers
        </div>
        <p className="text-xs font-sans text-text-muted leading-relaxed">
          Based on ethological research on canine and feline behavioral cycles. Zoomie probability uses a Gaussian peak around typical activity windows. Nap cycles approximate real ultradian rhythms. Scientifically approximate — your pet may vary.
        </p>
      </div>
    </div>
  );

  // ── Canvas section ──────────────────────────────────────────────────────────

  const showDog = petType === "dog" || petType === "both";
  const showCat = petType === "cat" || petType === "both";

  const canvas_ = (
    <div className="flex flex-col gap-5">
      {showDog && (
        <div className="flex flex-col gap-3">
          <div
            className="px-4 py-2 rounded-t font-mono text-xs font-bold"
            style={{ background: "var(--accent-utility-d)", color: "var(--bg-base)", border: "2px solid var(--border)", borderBottom: "none" }}
          >
            🐶 Dog Behavior Timers
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TimerCard
              emoji="🍖"
              label="Food Demand"
              value={dogFoodNagSec > 0 ? fmtCountdown(dogFoodNagSec) : "FEEDING TIME"}
              description={
                dogFoodNagSec > 0
                  ? `Next meal in ${fmtCountdown(dogNextFeedSec)} — nagging starts in ${fmtCountdown(dogFoodNagSec)}.`
                  : "Your dog is doing the stare. You know the stare."
              }
              status={dogFoodStatus}
              accent={accent}
              pct={Math.min(100, (dogFedElapsedSec / (12 * 3600)) * 100)}
            />
            <TimerCard
              emoji="😰"
              label="Separation Anxiety"
              value={fmtDuration(Math.round(separationSec)) + " elapsed"}
              description={
                separationSec > 17 * 60
                  ? "Your dog has decided you are gone forever and will never return."
                  : `Dogs notice absence at ~17 min. ${Math.round(Math.max(0, 17 * 60 - separationSec) / 60)}m ${Math.round(Math.max(0, 17 * 60 - separationSec) % 60)}s until anxiety onset.`
              }
              status={separationSatus}
              accent={accent}
              pct={separationPct}
            />
            <TimerCard
              emoji="⚡"
              label="Zoomie Probability"
              value={`${dogZoomiePct}%`}
              description={`Peak windows: 6–8 AM and 6–8 PM. Current hour: ${Math.floor(nowHour)}:${String(now.getMinutes()).padStart(2,"0")}. ${dogZoomiePct > 60 ? "Brace yourself." : "Relatively safe."}`}
              status={dogZoomieStatus}
              accent={accent}
              pct={dogZoomiePct}
            />
          </div>
        </div>
      )}

      {showCat && (
        <div className="flex flex-col gap-3">
          <div
            className="px-4 py-2 rounded-t font-mono text-xs font-bold"
            style={{ background: accent, color: "var(--bg-base)", border: "2px solid var(--border)", borderBottom: "none" }}
          >
            🐱 Cat Behavior Timers
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TimerCard
              emoji="🍽️"
              label="Food Demand Loop"
              value={catNextFeedSec > 0 ? fmtCountdown(catNextFeedSec) : "DEMANDING LOUDLY"}
              description={
                catNextFeedSec > 0
                  ? `Cats eat every ~5 hours. ${fmtCountdown(catNextFeedSec)} until next demand cycle.`
                  : "Your cat is making the sound. You know the sound."
              }
              status={catFoodStatus}
              accent={accent}
              pct={Math.min(100, (catFedElapsedSec / (5 * 3600)) * 100)}
            />
            <TimerCard
              emoji="🌙"
              label="3AM Zoomie Countdown"
              value={fmtCountdown(zoomieCountdownSec)}
              description="Cats peak in nocturnal activity around 2:30–3:00 AM. This is not personal. This is biology."
              status={zoomieCountdownSec < 3600 ? "warning" : "normal"}
              accent={accent}
            />
            <TimerCard
              emoji="😴"
              label="Current Nap Phase"
              value={napPhase}
              description={`Nap cycle: ${fmtDuration(napElapsedSec)} / ~90 min elapsed. Cats sleep 12–16 hrs/day in ~90-min ultradian cycles.`}
              status="normal"
              accent={accent}
              pct={napPct}
            />
            <TimerCard
              emoji="🎯"
              label="Attention Span Timer"
              value={fmtCountdown(attRemainSec) + " left"}
              description={`Average cat engages for ~7 minutes before losing interest. ${attPct > 80 ? "Distraction imminent." : "Still engaged."}`}
              status={attPct > 80 ? "warning" : "normal"}
              accent={accent}
              pct={attPct}
            />
          </div>
        </div>
      )}

      <div
        className="p-3 rounded text-center"
        style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}
      >
        <div className="text-[9px] font-sans text-text-faint">
          All timers update every second. Behavioral windows are population averages — individual pets differ. Consult your specific cat's therapist.
        </div>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} controlsSection={controls} canvasSection={canvas_} />
  );
}
