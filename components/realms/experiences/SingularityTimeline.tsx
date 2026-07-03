"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Milestone data ───────────────────────────────────────────────────────────

type Milestone = {
  year: number;
  title: string;
  description: string;
  emoji: string;
  status: "passed" | "upcoming";
  source?: string;
};

const SINGULARITY_YEAR = 2045;
const SINGULARITY_DATE = new Date(SINGULARITY_YEAR, 0, 1);
const TIMELINE_START   = 1950;

const MILESTONES: Milestone[] = [
  {
    year: 1950,
    title: "Turing Test Proposed",
    description: "Alan Turing asks 'Can machines think?' and proposes the imitation game — defining the central question of artificial intelligence.",
    emoji: "🧠",
    status: "passed",
  },
  {
    year: 1956,
    title: "AI Coined at Dartmouth",
    description: "John McCarthy introduces the term 'Artificial Intelligence' at a summer workshop — the formal birth of the field.",
    emoji: "💡",
    status: "passed",
  },
  {
    year: 1997,
    title: "Deep Blue Defeats Kasparov",
    description: "IBM's chess engine defeats the world champion in a 6-game match. The first major cognitive defeat of humanity by a machine.",
    emoji: "♟",
    status: "passed",
  },
  {
    year: 2011,
    title: "Watson Wins Jeopardy",
    description: "IBM Watson defeats all-time Jeopardy champions Ken Jennings and Brad Rutter — mastering natural language and general knowledge.",
    emoji: "📺",
    status: "passed",
  },
  {
    year: 2012,
    title: "AlexNet — Deep Learning Era",
    description: "The ImageNet breakthrough triggers the modern deep learning revolution. Neural networks suddenly work at scale.",
    emoji: "📡",
    status: "passed",
  },
  {
    year: 2016,
    title: "AlphaGo Defeats Lee Sedol",
    description: "DeepMind's AI beats the world Go champion — a game considered computationally intractable, with more positions than atoms in the universe.",
    emoji: "⚫",
    status: "passed",
  },
  {
    year: 2020,
    title: "GPT-3 Released",
    description: "175 billion parameters. The first AI to generate convincingly human text at scale — writing code, essays, poetry, and passing professional exams.",
    emoji: "📝",
    status: "passed",
  },
  {
    year: 2022,
    title: "ChatGPT — 100M Users in 2 Months",
    description: "The fastest product to 100 million users in history. AI reaches the general public. The conversation changes permanently.",
    emoji: "💬",
    status: "passed",
  },
  {
    year: 2023,
    title: "GPT-4 Multimodal",
    description: "Sees and understands images. Scores in the 90th percentile on the Bar exam, 99th on the GRE Verbal. AI surpasses average human performance on most tests.",
    emoji: "👁",
    status: "passed",
  },
  {
    year: 2024,
    title: "AI Exceeds Human Benchmarks",
    description: "AI surpasses humans on most standard cognitive benchmarks for the first time. Reasoning, code, science, language — all crossed in a single year.",
    emoji: "📊",
    status: "passed",
  },
  {
    year: 2027,
    title: "AI Surpasses Top Engineers",
    description: "AI will outperform the best human software engineers across all domains — architecture, debugging, and system design alike.",
    emoji: "⚙️",
    status: "upcoming",
    source: "Multiple predictions, Sam Altman (2024)",
  },
  {
    year: 2029,
    title: "AGI Declared",
    description: "Kurzweil's landmark prediction: AI passes a meaningful Turing Test with genuine general reasoning. Artificial General Intelligence crosses the threshold.",
    emoji: "🤖",
    status: "upcoming",
    source: "Ray Kurzweil, The Age of Spiritual Machines (1999)",
  },
  {
    year: 2033,
    title: "AI Handles Most White-Collar Work",
    description: "AI agents autonomously perform the majority of knowledge work — legal, medical, financial, creative. Human labor shifts to oversight and intent.",
    emoji: "🏢",
    status: "upcoming",
    source: "Various analysts, McKinsey Global Institute",
  },
  {
    year: 2040,
    title: "Recursive Self-Improvement",
    description: "AI begins meaningfully improving its own architecture without human guidance. Each generation is smarter than the last — and the cycle accelerates.",
    emoji: "🔄",
    status: "upcoming",
    source: "Nick Bostrom, Eliezer Yudkowsky",
  },
  {
    year: 2045,
    title: "The Singularity",
    description: "Technological change so rapid and profound it represents a rupture in the fabric of human history. Intelligence explosion. The moment everything changes.",
    emoji: "∞",
    status: "upcoming",
    source: "Ray Kurzweil, The Singularity Is Near (2005)",
  },
  {
    year: 2050,
    title: "Human-AI Merger",
    description: "The distinction between human and artificial intelligence begins to dissolve. Neural interfaces, AI augmentation, and post-human cognition become ordinary.",
    emoji: "🧬",
    status: "upcoming",
    source: "Futurist consensus — Kurzweil, Musk, Harari",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCountdown(to: Date) {
  const totalMs = to.getTime() - Date.now();
  if (totalMs <= 0) return { years: 0, days: 0, hours: 0, mins: 0, secs: 0, past: true };
  const totalSecs  = Math.floor(totalMs / 1000);
  const secs       = totalSecs % 60;
  const totalMins  = Math.floor(totalSecs / 60);
  const mins       = totalMins % 60;
  const totalHrs   = Math.floor(totalMins / 60);
  const hours      = totalHrs % 24;
  const totalDays  = Math.floor(totalHrs / 24);
  const years      = Math.floor(totalDays / 365.25);
  const days       = Math.floor(totalDays - years * 365.25);
  return { years, days, hours, mins, secs, past: false };
}

function pad(n: number, len = 2) {
  return String(n).padStart(len, "0");
}

function milestoneDateYrs(m: Milestone): number | null {
  if (m.status === "upcoming") return m.year - new Date().getFullYear();
  return null;
}

// ─── Countdown display ────────────────────────────────────────────────────────

function CountdownUnit({ value, label, accent }: { value: string; label: string; accent: string }) {
  return (
    <div
      className="flex flex-col items-center px-3 py-3 gap-0.5"
      style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)", minWidth: 64 }}
    >
      <span className="font-mono text-2xl font-black tabular-nums leading-none" style={{ color: accent }}>
        {value}
      </span>
      <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-text-faint">{label}</span>
    </div>
  );
}

// ─── Milestone row ────────────────────────────────────────────────────────────

function MilestoneRow({
  m,
  accent,
  expanded,
  onToggle,
}: {
  m: Milestone;
  accent: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const yrsAway  = milestoneDateYrs(m);
  const isPassed = m.status === "passed";
  const isSing   = m.year === SINGULARITY_YEAR;

  return (
    <div
      className="flex flex-col cursor-pointer transition-all duration-150"
      style={{
        border: `2px solid ${isPassed ? "var(--border)" : isSing ? accent : `${accent}55`}`,
        background: expanded
          ? isPassed ? "var(--bg-surface)" : `${accent}0A`
          : "var(--bg-card)",
        boxShadow: expanded ? `3px 3px 0 ${isPassed ? "var(--shadow-color)" : accent + "44"}` : "none",
      }}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Year */}
        <span
          className="font-mono text-xs font-bold w-10 flex-shrink-0 tabular-nums"
          style={{ color: isPassed ? "var(--text-faint)" : accent }}
        >
          {m.year}
        </span>

        {/* Emoji */}
        <span className="text-base flex-shrink-0" style={{ opacity: isPassed ? 0.5 : 1 }}>
          {m.emoji}
        </span>

        {/* Title */}
        <span
          className="font-sans text-sm font-semibold flex-1 min-w-0"
          style={{
            color: isPassed ? "var(--text-faint)" : "var(--text-primary)",
            textDecoration: isPassed ? "line-through" : "none",
          }}
        >
          {m.title}
        </span>

        {/* Right badge */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isPassed ? (
            <span className="text-[9px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--accent-utility-a)" }}>
              ✓ Done
            </span>
          ) : yrsAway !== null && yrsAway > 0 ? (
            <span
              className="px-2 py-0.5 text-[9px] font-mono font-bold"
              style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
            >
              in ~{yrsAway}yr
            </span>
          ) : null}
          <span
            className="text-[10px] text-text-faint transition-transform duration-150"
            style={{ transform: expanded ? "rotate(90deg)" : "none" }}
          >
            ▶
          </span>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 flex flex-col gap-1.5 border-t border-border">
          <p className="font-sans text-[12px] text-text-muted leading-relaxed mt-2">{m.description}</p>
          {m.source && (
            <p className="text-[10px] font-sans text-text-faint italic">Source: {m.source}</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SingularityTimeline() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "singularity-timeline";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [tick,     setTick]     = useState(0);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [filter,   setFilter]   = useState<"all" | "passed" | "upcoming">("all");

  const intervalRef = useRef(0);

  useEffect(() => {
    intervalRef.current = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  void tick;

  const countdown = getCountdown(SINGULARITY_DATE);
  const now       = new Date();
  const nowYr     = now.getFullYear() + now.getMonth() / 12;
  const progressPct = Math.min(100, Math.max(0, ((nowYr - TIMELINE_START) / (SINGULARITY_YEAR - TIMELINE_START)) * 100));

  const filteredMilestones = MILESTONES.filter((m) =>
    filter === "all" ? true : m.status === filter
  );

  const passedCount   = MILESTONES.filter(m => m.status === "passed").length;
  const upcomingCount = MILESTONES.filter(m => m.status === "upcoming").length;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          {/* About */}
          <div
            className="p-4"
            style={{ border: `2px solid ${accent}44`, background: `${accent}0A` }}
          >
            <p className="font-mono text-xs font-bold mb-1" style={{ color: accent }}>
              The Singularity
            </p>
            <p className="text-[11px] font-sans text-text-muted leading-relaxed">
              Ray Kurzweil predicts that by 2045, AI will surpass all human intelligence combined — triggering recursive self-improvement and an intelligence explosion that changes everything.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              View milestones
            </label>
            <div className="flex gap-1.5">
              {(["all", "passed", "upcoming"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="flex-1 py-2 text-[10px] font-sans font-bold uppercase tracking-wider transition-all capitalize"
                  style={{
                    border: "2px solid var(--border)",
                    background: filter === f ? accent : "var(--bg-card)",
                    color: filter === f ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: filter === f ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Milestone counts */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="p-3"
              style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
            >
              <span className="block font-mono text-xl font-black" style={{ color: "var(--accent-utility-a)" }}>
                {passedCount}
              </span>
              <span className="block text-[9px] font-sans text-text-faint uppercase tracking-wider">
                milestones passed
              </span>
            </div>
            <div
              className="p-3"
              style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
            >
              <span className="block font-mono text-xl font-black" style={{ color: accent }}>
                {upcomingCount}
              </span>
              <span className="block text-[9px] font-sans text-text-faint uppercase tracking-wider">
                yet to come
              </span>
            </div>
          </div>

          {/* Kurzweil quote */}
          <div
            className="p-4"
            style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
          >
            <p className="font-display text-xs italic text-text-muted leading-relaxed">
              "The Singularity will represent the culmination of the merger of our biological thinking and existence with our technology."
            </p>
            <p className="text-[9px] font-sans text-text-faint mt-2">— Ray Kurzweil, 2005</p>
          </div>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {/* Hero countdown */}
          <div
            className="px-5 py-6 flex flex-col gap-4"
            style={{ borderBottom: "2px solid var(--border)", background: "var(--bg-surface)" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">∞</span>
              <p className="font-sans text-xs font-semibold uppercase tracking-wider text-text-faint">
                Time until The Singularity — Jan 1, 2045
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <CountdownUnit value={String(countdown.years)} label="years" accent={accent} />
              <CountdownUnit value={pad(countdown.days, 3)} label="days"  accent={accent} />
              <CountdownUnit value={pad(countdown.hours)} label="hours" accent={accent} />
              <CountdownUnit value={pad(countdown.mins)}  label="mins"  accent={accent} />
              <CountdownUnit value={pad(countdown.secs)}  label="secs"  accent={accent} />
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-[9px] font-mono text-text-faint mb-1.5">
                <span>{TIMELINE_START}</span>
                <span style={{ color: accent }}>{progressPct.toFixed(1)}% of the way</span>
                <span>{SINGULARITY_YEAR}</span>
              </div>
              <div
                className="w-full h-4 relative overflow-hidden"
                style={{ border: "2px solid var(--border)", background: "var(--bg-base)" }}
              >
                <div
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${progressPct}%`, background: `${accent}55` }}
                />
                {/* Pulsing now dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{
                    left: `calc(${progressPct}% - 5px)`,
                    background: accent,
                    boxShadow: `0 0 8px ${accent}`,
                  }}
                />
              </div>
              <p className="text-[9px] font-sans text-text-faint mt-1 text-center">
                {new Date().getFullYear()} — currently {(SINGULARITY_YEAR - new Date().getFullYear())} years away
              </p>
            </div>
          </div>

          {/* Milestone timeline */}
          <div className="px-5 py-4 flex flex-col gap-2">
            <p className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint mb-1">
              {filter === "all" ? "All milestones" : filter === "passed" ? "Achieved milestones" : "Predicted milestones"} — {filteredMilestones.length} total
            </p>
            {filteredMilestones.map((m) => (
              <MilestoneRow
                key={m.year + m.title}
                m={m}
                accent={accent}
                expanded={expanded === m.year}
                onToggle={() => setExpanded(expanded === m.year ? null : m.year)}
              />
            ))}
          </div>

          {/* Closing */}
          <div className="px-5 pb-6">
            <p
              className="font-display font-light italic text-text-faint text-center leading-relaxed"
              style={{ fontSize: "clamp(0.85rem, 1.5vw, 1rem)" }}
            >
              Are you ready for what comes next?
            </p>
          </div>
        </div>
      }
    />
  );
}
