"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { callRealmAI } from "@/lib/realms/aiClient";

// ─── Questions ────────────────────────────────────────────────────────────────

type Question = {
  id: string;
  text: string;
  options: string[];
};

const QUESTIONS: Question[] = [
  {
    id: "career_pivots",
    text: "How many career pivots since 2015?",
    options: ["0 — I have stayed the course", "1–2 — Minor recalibrations", "3–5 — Dynamic re-routing", "I call them pivots. The TVA calls them violations."],
  },
  {
    id: "relationships_ended",
    text: "How many romantic relationships have you ended?",
    options: ["0 — Still on the first", "1 — It was mutual, technically", "2–3 — Patterns are emerging", "The TVA has a file on me"],
  },
  {
    id: "unread_emails",
    text: "Current unread email count?",
    options: ["Under 50 — Inbox zero adjacent", "50–500 — Manageable chaos", "500–5,000 — I have a system", "Unknowable. A Nexus event."],
  },
  {
    id: "skip_plans",
    text: "How often do you cancel plans last-minute?",
    options: ["Never — I am reliable", "Occasionally — Force majeure only", "Regularly — They understand", "Chaos is my brand"],
  },
  {
    id: "cities_lived",
    text: "How many cities have you lived in?",
    options: ["1 — Stability is a virtue", "2–3 — Geographic flexibility", "4–6 — Restless but intentional", "The Sacred Timeline had 1 city for me"],
  },
  {
    id: "called_parent",
    text: "When did you last call a parent?",
    options: ["This week", "This month", "Longer ago than I will admit", "Define 'called'"],
  },
  {
    id: "unused_subscriptions",
    text: "How many subscriptions are you paying for but not using?",
    options: ["0 — I am disciplined", "1–2 — I will cancel them", "3–5 — They are basically donations", "This is fine."],
  },
  {
    id: "sleep_schedule",
    text: "Do you regularly sleep before midnight?",
    options: ["Always — Circadian discipline", "Usually — Most nights", "Never — Midnight is when I become productive", "Time is a construct"],
  },
];

// ─── AI response shape ────────────────────────────────────────────────────────

type TVAReport = {
  caseId: string;
  complianceScore: number;
  classification: "COMPLIANT" | "MINOR_VARIANCE" | "SIGNIFICANT_DEVIATION" | "NEXUS_EVENT";
  unauthorizedVariants: string[];
  pruningRisk: "LOW" | "MODERATE" | "HIGH" | "IMMEDIATE";
  preCrimeDate: string;
  bureaucraticMemo: string;
  reportingDepartment: string;
};

// ─── Classification colors ────────────────────────────────────────────────────

const CLASS_COLOR: Record<TVAReport["classification"], string> = {
  COMPLIANT:              "var(--accent-utility-a)",
  MINOR_VARIANCE:         "var(--accent-utility-d)",
  SIGNIFICANT_DEVIATION:  "var(--destructive)",
  NEXUS_EVENT:            "var(--destructive)",
};

const RISK_COLOR: Record<TVAReport["pruningRisk"], string> = {
  LOW:       "var(--accent-utility-a)",
  MODERATE:  "var(--accent-utility-d)",
  HIGH:      "var(--destructive)",
  IMMEDIATE: "var(--destructive)",
};

const RISK_WIDTH: Record<TVAReport["pruningRisk"], string> = {
  LOW: "20%", MODERATE: "50%", HIGH: "75%", IMMEDIATE: "100%",
};

// ─── Report card ──────────────────────────────────────────────────────────────

function TVAReportCard({ report, accent }: { report: TVAReport; accent: string }) {
  const classColor = CLASS_COLOR[report.classification];
  const riskColor  = RISK_COLOR[report.pruningRisk];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6" style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: "2px solid var(--border)" }}>
        <div>
          <p className="text-[9px] font-sans font-bold uppercase tracking-[0.15em] text-text-faint">
            TIME VARIANCE AUTHORITY
          </p>
          <p className="font-mono text-xs font-bold text-text-muted mt-0.5">CASE FILE</p>
          <p className="font-mono text-lg font-black mt-1" style={{ color: accent }}>{report.caseId}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-sans text-text-faint uppercase tracking-wider">Generated</p>
          <p className="font-mono text-[10px] text-text-muted">{new Date().toISOString().slice(0, 10)}</p>
          <p className="text-[9px] font-sans font-bold uppercase tracking-wider mt-2" style={{ color: "var(--destructive)" }}>
            CLASSIFIED
          </p>
        </div>
      </div>

      {/* Banner */}
      <div
        className="px-4 py-2 text-center"
        style={{ background: `${accent}15`, border: `1px solid ${accent}44` }}
      >
        <p className="text-[9px] font-sans font-bold uppercase tracking-[0.2em] text-text-faint">
          TEMPORAL COMPLIANCE ASSESSMENT
        </p>
      </div>

      {/* Score + classification */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-4 flex flex-col gap-1"
          style={{ border: "2px solid var(--border)", background: "var(--bg-surface)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
        >
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint">Compliance Score</span>
          <span className="font-mono text-3xl font-black tabular-nums" style={{ color: accent }}>
            {report.complianceScore}
          </span>
          <span className="text-[9px] font-sans text-text-faint">/ 100</span>
        </div>
        <div
          className="p-4 flex flex-col gap-1"
          style={{ border: `2px solid ${classColor}55`, background: `${classColor}0A`, boxShadow: "2px 2px 0 var(--shadow-color)" }}
        >
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint">Classification</span>
          <span className="font-mono text-xs font-black leading-tight" style={{ color: classColor }}>
            {report.classification.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Unauthorized variants */}
      <div
        className="p-4"
        style={{ border: "2px solid var(--border)", background: "var(--bg-surface)" }}
      >
        <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-2">
          Unauthorized Variants Detected
        </p>
        <div className="flex flex-col gap-1.5">
          {report.unauthorizedVariants.map((v, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-[10px] font-mono font-bold flex-shrink-0" style={{ color: "var(--destructive)" }}>▸</span>
              <span className="text-[11px] font-sans text-text-muted">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pruning risk */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint">Pruning Risk</span>
          <span className="font-mono text-[10px] font-bold" style={{ color: riskColor }}>{report.pruningRisk}</span>
        </div>
        <div
          className="w-full h-3 relative overflow-hidden"
          style={{ border: "2px solid var(--border)", background: "var(--bg-base)" }}
        >
          <div
            className="absolute inset-y-0 left-0 transition-all duration-700"
            style={{ width: RISK_WIDTH[report.pruningRisk], background: riskColor }}
          />
        </div>
        <div className="flex justify-between text-[8px] font-sans text-text-faint">
          <span>LOW</span><span>MODERATE</span><span>HIGH</span><span>IMMEDIATE</span>
        </div>
      </div>

      {/* Memo */}
      <div
        className="p-4"
        style={{ border: "2px solid var(--border)", background: "var(--bg-base)" }}
      >
        <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-2">
          Internal Memo
        </p>
        <p className="text-[11px] font-sans text-text-muted leading-relaxed italic">
          {report.bureaucraticMemo}
        </p>
        <p className="text-[9px] font-sans text-text-faint mt-2">
          Department: {report.reportingDepartment}
        </p>
      </div>

      {/* Pre-crime date */}
      <div
        className="p-4"
        style={{ border: `2px solid var(--destructive)44`, background: "var(--destructive)0A" }}
      >
        <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
          Minority Report — Pre-Crime Arrest Date
        </p>
        <p className="font-mono text-xl font-black" style={{ color: "var(--destructive)" }}>
          {report.preCrimeDate}
        </p>
        <p className="text-[9px] font-sans text-text-faint mt-1">
          Arrest order issued under Precognitive Protocol 7B. No further action required from your end.
        </p>
      </div>

      {/* Footer */}
      <p className="text-[9px] font-sans text-text-faint italic text-center leading-relaxed">
        This report was generated by the TVA Automated Processing Division. You may appeal this ruling. Appeals are not reviewed.
      </p>
    </div>
  );
}

// ─── Question card ────────────────────────────────────────────────────────────

function QuestionCard({
  q,
  index,
  selected,
  onSelect,
  accent,
}: {
  q: Question;
  index: number;
  selected: string | undefined;
  onSelect: (val: string) => void;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-sans text-xs font-semibold text-text-primary leading-snug">
        <span className="font-mono text-[10px] text-text-faint mr-1.5">Q{index + 1}.</span>
        {q.text}
      </p>
      <div className="flex flex-col gap-1">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="px-3 py-2 text-left text-[11px] font-sans transition-all"
            style={{
              border: "2px solid var(--border)",
              background: selected === opt ? `${accent}18` : "var(--bg-card)",
              color: selected === opt ? "var(--text-primary)" : "var(--text-muted)",
              boxShadow: selected === opt ? `2px 2px 0 ${accent}55` : "none",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SacredTimelineAudit() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "sacred-timeline-audit";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [answers,  setAnswers]  = useState<Record<string, string>>({});
  const [loading,  setLoading]  = useState(false);
  const [report,   setReport]   = useState<TVAReport | null>(null);
  const [error,    setError]    = useState("");

  const answered   = Object.keys(answers).length;
  const allAnswered = answered === QUESTIONS.length;

  const handleSubmit = async () => {
    if (!allAnswered) { setError("All 8 questions must be answered before submission."); return; }
    setError("");
    setLoading(true);
    setReport(null);

    const answerList = QUESTIONS.map(q => `${q.text}: ${answers[q.id]}`).join("\n");

    const { content, error: aiError } = await callRealmAI({
      systemPrompt: `You are an automated TVA (Time Variance Authority) compliance system from the Marvel Loki universe. Analyse the subject's life data and generate an official case file. Return ONLY valid JSON with this exact shape, no markdown, no explanation:
{
  "caseId": "TVA-XXXXXXX-XX",
  "complianceScore": <integer 0-100>,
  "classification": <"COMPLIANT"|"MINOR_VARIANCE"|"SIGNIFICANT_DEVIATION"|"NEXUS_EVENT">,
  "unauthorizedVariants": [<2-4 strings: specific flagged items in dry bureaucratic tone>],
  "pruningRisk": <"LOW"|"MODERATE"|"HIGH"|"IMMEDIATE">,
  "preCrimeDate": <"YYYY-MM-DD" within 5 years of today>,
  "bureaucraticMemo": <"2-3 sentences of dry TVA bureaucratic humor about the subject's life">,
  "reportingDepartment": <"string, e.g. Department of Unauthorized Career Pivots, Sub-Division 7">
}`,
      userPrompt: `Subject life data:\n${answerList}`,
      maxTokens: 600,
      expectJSON: true,
    });

    setLoading(false);

    if (aiError || !content) {
      setError("TVA systems are temporarily offline. Please try again.");
      return;
    }

    try {
      const parsed = JSON.parse(content) as TVAReport;
      setReport(parsed);
    } catch {
      setError("TVA data corrupted in transit. Please resubmit.");
    }
  };

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-4">
          {/* Questions */}
          {QUESTIONS.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={i}
              selected={answers[q.id]}
              onSelect={(val) => {
                setAnswers((prev) => ({ ...prev, [q.id]: val }));
                setError("");
                setReport(null);
              }}
              accent={accent}
            />
          ))}

          {/* Progress */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between text-[9px] font-mono text-text-faint">
              <span>{answered} / {QUESTIONS.length} answered</span>
              {allAnswered && <span style={{ color: "var(--accent-utility-a)" }}>Ready for submission</span>}
            </div>
            <div className="w-full h-1.5 overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${(answered / QUESTIONS.length) * 100}%`, background: accent }}
              />
            </div>
          </div>

          {error && (
            <p className="text-[11px] font-sans leading-snug" style={{ color: "var(--destructive)" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            {loading ? "Transmitting to TVA…" : "Submit to TVA"}
          </button>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {report ? (
            <div className="p-4 md:p-5">
              <TVAReportCard report={report} accent={accent} />
            </div>
          ) : loading ? (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <div
                className="w-10 h-10 border-2 rounded-full animate-spin mb-4"
                style={{ borderColor: `${accent}33`, borderTopColor: accent }}
              />
              <p className="font-mono text-xs text-text-faint">Cross-referencing Sacred Timeline…</p>
              <p className="font-sans text-[10px] text-text-faint mt-1">Scanning for Nexus Events</p>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                Are you living on the Sacred Timeline?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[50ch] leading-relaxed">
                Answer all 8 questions and submit your life data to the TVA. Unauthorized variants will be identified. Pruning risk will be assessed.
              </p>
              <p className="font-sans text-[10px] text-text-faint mt-4 italic">
                The TVA is watching. It always has been.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
