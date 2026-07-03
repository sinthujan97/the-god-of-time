"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Constants ────────────────────────────────────────────────────────────────

const MEETING_TYPES = [
  { label: "Status Update",           dilation: 1.55 },
  { label: "Brainstorming",           dilation: 0.95 },
  { label: "1:1",                     dilation: 0.90 },
  { label: "Could've Been an Email",  dilation: 1.70 },
  { label: "All-Hands",              dilation: 1.45 },
];

const MEETING_LENGTHS = [15, 30, 45, 60, 90, 120];

const DAYDREAM_TOPICS = [
  "what you'll have for dinner tonight",
  "a conversation you should've had in 2019",
  "whether penguins have knees (they do)",
  "that one thing you said in 2011",
  "a faster route home you've never tried",
  "what dogs dream about",
  "whether you left the oven on",
  "the ideal number of pillows",
  "a business idea you'll never pursue",
  "how escalators work, actually",
  "the last person you accidentally made eye contact with for too long",
  "a song you haven't thought about in six years",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtMSS(totalMs: number): string {
  const s = Math.floor(Math.abs(totalMs) / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

function fmtHMM(totalSec: number): string {
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BoredomPhysics() {
  const slug   = usePathname().split("/").pop();
  const realm  = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];
  const accent = realm.accent;

  // Module 1 — Meeting Time Dilation
  const [meetingLengthIdx, setMeetingLengthIdx] = useState(1); // 30 min default
  const [meetingTypeIdx,   setMeetingTypeIdx]   = useState(0);
  const [meetingStarted,   setMeetingStarted]   = useState(false);
  const meetingStartRef = useRef<number | null>(null);

  // Module 3 — Task Abandonment (starts from page load)
  const pageLoadRef = useRef<number>(Date.now());

  // Module 4 — Daydream Velocity
  const [boredom,        setBoredom]        = useState(5);
  const [hoursSinceCoffee, setHoursSinceCoffee] = useState(2);
  const [daydreamTopicIdx, setDaydreamTopicIdx] = useState(0);

  // Live tick
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Cycle daydream topic every ~15 seconds
  useEffect(() => {
    const id = setInterval(() => {
      setDaydreamTopicIdx(i => (i + 1) % DAYDREAM_TOPICS.length);
    }, 15_000);
    return () => clearInterval(id);
  }, []);

  // Module 1 calculations
  const scheduledMins  = MEETING_LENGTHS[meetingLengthIdx];
  const meetingType    = MEETING_TYPES[meetingTypeIdx];
  const subjectiveMins = Math.round(scheduledMins * meetingType.dilation);
  const extraMins      = subjectiveMins - scheduledMins;
  const meetingEndMs   = meetingStartRef.current
    ? meetingStartRef.current + scheduledMins * 60_000
    : null;
  const meetingElapsedMs = meetingStartRef.current ? now - meetingStartRef.current : 0;
  const meetingRemainMs  = meetingEndMs ? Math.max(0, meetingEndMs - now) : 0;
  const meetingPct       = meetingEndMs
    ? Math.min(100, (meetingElapsedMs / (scheduledMins * 60_000)) * 100)
    : 0;

  function toggleMeeting() {
    if (meetingStarted) {
      meetingStartRef.current = null;
      setMeetingStarted(false);
    } else {
      meetingStartRef.current = now;
      setMeetingStarted(true);
    }
  }

  // Module 3 — Task Abandonment
  const FOCUS_THRESHOLD_SEC = 23 * 60; // 23 minutes
  const taskElapsedSec      = Math.floor((now - pageLoadRef.current) / 1000);
  const taskPct             = Math.min(100, (taskElapsedSec / FOCUS_THRESHOLD_SEC) * 100);
  const taskStatus: "normal" | "warn" | "done" =
    taskElapsedSec >= FOCUS_THRESHOLD_SEC ? "done" :
    taskElapsedSec > FOCUS_THRESHOLD_SEC * 0.7 ? "warn" : "normal";

  // Module 4 — Daydream Velocity
  const secsUntilDaydream = useMemo(
    () => Math.max(5, Math.round(180 - boredom * 15 - hoursSinceCoffee * 8)),
    [boredom, hoursSinceCoffee]
  );

  // ─── Controls ──────────────────────────────────────────────────────────────

  const controls = (
    <div className="flex flex-col gap-6">
      {/* Meeting controls */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Module 1 — Meeting Dilation
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-sans uppercase tracking-wider text-text-faint">Duration</label>
          <div className="grid grid-cols-3 gap-1.5">
            {MEETING_LENGTHS.map((len, i) => (
              <button
                key={len}
                onClick={() => setMeetingLengthIdx(i)}
                className="py-1.5 text-xs font-mono rounded transition-all duration-150"
                style={{
                  border: "2px solid var(--border)",
                  boxShadow: meetingLengthIdx === i ? `2px 2px 0 ${accent}` : "2px 2px 0 var(--shadow-color)",
                  background: meetingLengthIdx === i ? accent : "var(--bg-card)",
                  color: meetingLengthIdx === i ? "var(--bg-base)" : "var(--text-primary)",
                  transform: meetingLengthIdx === i ? "translate(-1px,-1px)" : undefined,
                }}
              >
                {len}m
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] font-sans uppercase tracking-wider text-text-faint">Meeting Type</label>
          <div className="flex flex-col gap-1.5">
            {MEETING_TYPES.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setMeetingTypeIdx(i)}
                className="w-full text-left px-3 py-2 text-xs font-mono rounded transition-all duration-150"
                style={{
                  border: "2px solid var(--border)",
                  boxShadow: meetingTypeIdx === i ? `2px 2px 0 ${accent}` : "1px 1px 0 var(--shadow-color)",
                  background: meetingTypeIdx === i ? `${accent}22` : "var(--bg-card)",
                  color: meetingTypeIdx === i ? accent : "var(--text-primary)",
                }}
              >
                {t.label}
                <span className="ml-2 text-[10px] opacity-60">×{t.dilation.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Daydream controls */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Module 4 — Daydream Velocity
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-[9px] font-sans uppercase tracking-wider text-text-faint">Task Boredom Level</label>
            <span className="font-mono text-xs font-bold" style={{ color: accent }}>{boredom}/10</span>
          </div>
          <input type="range" min={1} max={10} step={1} value={boredom}
            onChange={e => setBoredom(Number(e.target.value))}
            className="w-full" style={{ accentColor: accent }} />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between">
            <label className="text-[9px] font-sans uppercase tracking-wider text-text-faint">Hours Since Coffee</label>
            <span className="font-mono text-xs font-bold" style={{ color: accent }}>{hoursSinceCoffee}h</span>
          </div>
          <input type="range" min={0} max={12} step={0.5} value={hoursSinceCoffee}
            onChange={e => setHoursSinceCoffee(Number(e.target.value))}
            className="w-full" style={{ accentColor: accent }} />
        </div>
      </div>
    </div>
  );

  // ─── Canvas section ────────────────────────────────────────────────────────

  const canvas_ = (
    <div className="flex flex-col gap-5">

      {/* Module 1 — Meeting Dilation */}
      <div
        className="p-4 rounded flex flex-col gap-4"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          ⏱ Module 1 — Meeting Time Dilation
        </div>

        <div className="flex flex-col gap-1">
          <div className="font-mono text-xs text-text-muted">
            Your {scheduledMins}-min <span style={{ color: accent }}>{meetingType.label}</span> will feel like:
          </div>
          <div className="font-mono text-3xl font-bold" style={{ color: accent }}>
            {subjectiveMins} minutes
          </div>
          <div className="text-xs font-sans text-text-muted">
            {extraMins > 0
              ? `That's ${extraMins} extra minutes of your life, perceived but not real. Gone.`
              : `This meeting type actually compresses time — it's ${Math.abs(extraMins)}min shorter subjectively.`}
          </div>
        </div>

        {/* Escape countdown */}
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleMeeting}
            className="calculate-btn text-xs font-mono py-2 px-4 rounded"
            style={{ backgroundColor: accent }}
          >
            {meetingStarted ? "⏹ End Meeting" : "▶ Start Meeting Timer"}
          </button>
          {meetingStarted && (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">Elapsed: {fmtMSS(meetingElapsedMs)}</span>
                <span style={{ color: meetingRemainMs < 60_000 ? "var(--destructive)" : accent }}>
                  {meetingRemainMs > 0 ? `${fmtMSS(meetingRemainMs)} remaining` : "OVERDUE"}
                </span>
              </div>
              <div className="relative h-3 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
                <div
                  className="h-full rounded transition-all"
                  style={{
                    width: `${meetingPct}%`,
                    background: meetingPct >= 100 ? "var(--destructive)" : accent,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Module 2 — Watchpot Effect */}
      <WatchpotModule accent={accent} now={now} />

      {/* Module 3 — Task Abandonment Clock */}
      <div
        className="p-4 rounded flex flex-col gap-3"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          🧠 Module 3 — Task Abandonment Clock
        </div>
        <div className="font-mono text-2xl font-bold" style={{ color: accent }}>
          {fmtHMM(taskElapsedSec)} on task
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-[10px] font-sans text-text-muted">
            <span>Page load</span>
            <span style={{ color: taskStatus === "done" ? "var(--accent-utility-a)" : accent }}>
              {taskStatus === "done" ? "✓ Top 15% focus session" : `${FOCUS_THRESHOLD_SEC - taskElapsedSec}s until statistical abandonment`}
            </span>
          </div>
          <div className="relative h-3 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
            <div
              className="h-full rounded transition-all"
              style={{
                width: `${taskPct}%`,
                background: taskStatus === "done" ? "var(--accent-utility-a)" :
                            taskStatus === "warn"  ? "var(--accent-utility-d)" : accent,
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-sans text-text-faint">
            <span>0</span>
            <span>23 min — median focus limit</span>
          </div>
        </div>
        <div className="text-[10px] font-sans text-text-muted">
          {taskStatus === "done"
            ? "Congratulations. You are in the top 15% of focused sessions. Cal Newport would be proud."
            : "Research: average knowledge worker loses focus after 20–47 minutes (median 23). Every check of Slack resets the clock."}
        </div>
      </div>

      {/* Module 4 — Daydream Velocity */}
      <div
        className="p-4 rounded flex flex-col gap-3"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          💭 Module 4 — Daydream Velocity
        </div>
        <div>
          <div className="text-xs font-sans text-text-muted mb-1">
            At boredom level <span style={{ color: accent }}>{boredom}</span> and{" "}
            <span style={{ color: accent }}>{hoursSinceCoffee}h</span> since coffee:
          </div>
          <div className="font-mono text-2xl font-bold" style={{ color: accent }}>
            {secsUntilDaydream}s
          </div>
          <div className="text-xs font-sans text-text-muted">
            until your mind wanders
          </div>
        </div>
        <div
          className="p-3 rounded"
          style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}
        >
          <div className="text-[9px] font-sans text-text-muted uppercase tracking-wider mb-1">
            Estimated daydream topic:
          </div>
          <div className="text-sm font-sans text-text-primary italic">
            "{DAYDREAM_TOPICS[daydreamTopicIdx]}"
          </div>
          <div className="text-[9px] text-text-faint font-sans mt-1">
            Rotates every 15 seconds
          </div>
        </div>
        <div className="text-[10px] font-sans text-text-muted">
          Formula: max(5, 180 − boredom×15 − coffeeHrs×8). Based on attention research showing caffeine and novelty extend focus windows.
        </div>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} controlsSection={controls} canvasSection={canvas_} />
  );
}

// ─── Watchpot subcomponent (Module 2) ─────────────────────────────────────────

function WatchpotModule({ accent, now }: { accent: string; now: number }) {
  const [running, setRunning]       = useState(false);
  const [startMs, setStartMs]       = useState<number | null>(null);
  const TARGET_MS = 60_000;

  function start() {
    setStartMs(Date.now());
    setRunning(true);
  }
  function reset() {
    setStartMs(null);
    setRunning(false);
  }

  const elapsed  = startMs ? now - startMs : 0;
  const done     = elapsed >= TARGET_MS;
  const pct      = Math.min(100, (elapsed / TARGET_MS) * 100);

  return (
    <div
      className="p-4 rounded flex flex-col gap-4"
      style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
    >
      <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
        👁 Module 2 — The Watchpot Effect
      </div>
      <p className="text-xs font-sans text-text-muted leading-relaxed">
        Actively watching a timer makes it feel slower — by up to 20%. Two identical 60-second clocks below. One is designed to be watched. The other is hidden away.
      </p>

      {!running ? (
        <button
          onClick={start}
          className="calculate-btn text-xs font-mono py-2 px-4 rounded"
          style={{ backgroundColor: accent }}
        >
          ▶ Start Both Clocks
        </button>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {/* WATCHED clock */}
            <div
              className="p-4 rounded flex flex-col items-center gap-2"
              style={{ border: `2px solid ${accent}`, background: "var(--bg-base)" }}
            >
              <div className="text-[9px] font-mono uppercase tracking-widest" style={{ color: accent }}>
                WATCHED
              </div>
              <div
                className="font-mono font-black leading-none"
                style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)", color: accent, letterSpacing: "0.05em" }}
              >
                {done ? "60" : Math.floor(elapsed / 1000).toString().padStart(2,"0")}
              </div>
              <div className="text-[9px] font-mono text-text-muted">seconds</div>
              <div className="relative w-full h-2 rounded overflow-hidden" style={{ background: "var(--bg-card)" }}>
                <div className="h-full rounded" style={{ width: `${pct}%`, background: accent }} />
              </div>
            </div>

            {/* IGNORED clock */}
            <div
              className="p-4 rounded flex flex-col items-center gap-2 opacity-40"
              style={{ border: "1px solid var(--border)", background: "var(--bg-base)" }}
            >
              <div className="text-[8px] font-mono uppercase tracking-widest text-text-faint">
                ignored
              </div>
              <div className="font-mono text-sm text-text-faint leading-none">
                {done ? "60" : Math.floor(elapsed / 1000).toString()}
              </div>
              <div className="text-[8px] font-mono text-text-faint">s</div>
            </div>
          </div>

          {done ? (
            <div className="flex flex-col gap-2">
              <div className="text-xs font-sans text-text-primary text-center">
                Both clocks ran for exactly 60 seconds. Which felt longer?
              </div>
              <button
                onClick={reset}
                className="calculate-btn text-xs font-mono py-2 px-4 rounded"
                style={{ backgroundColor: accent }}
              >
                ↺ Reset
              </button>
            </div>
          ) : null}
        </div>
      )}

      <div className="text-[10px] font-sans text-text-muted">
        The Watchpot Effect is real — actively monitoring duration lengthens perceived time by 15–20% (Zakay & Block, 1995; Brown, 1985).
      </div>
    </div>
  );
}
