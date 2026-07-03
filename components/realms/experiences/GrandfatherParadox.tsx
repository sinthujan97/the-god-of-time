"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { callRealmAI } from "@/lib/realms/aiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type Classification = "CAUSAL_LOOP" | "SPLINTER_TIMELINE" | "ERASURE_EVENT";
type RiskLevel      = "LOW" | "MODERATE" | "CRITICAL" | "EXTINCTION";

type CaseFile = {
  case_id:              string;
  classification:       Classification;
  risk_level:           RiskLevel;
  paradox_type:         string;
  memo_subject:         string;
  memo_body:            string;
  recommended_action:   string;
  approval_probability: number;
  timeline_note:        string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CLASSIFICATION_COLORS: Record<Classification, string> = {
  CAUSAL_LOOP:       "var(--accent-utility-a)",
  SPLINTER_TIMELINE: "var(--accent-utility-d)",
  ERASURE_EVENT:     "var(--destructive)",
};

const CLASSIFICATION_ICONS: Record<Classification, string> = {
  CAUSAL_LOOP:       "∞",
  SPLINTER_TIMELINE: "⎇",
  ERASURE_EVENT:     "✕",
};

const RISK_BARS: Record<RiskLevel, number> = {
  LOW:        1,
  MODERATE:   2,
  CRITICAL:   3,
  EXTINCTION: 4,
};

const RISK_COLORS: Record<RiskLevel, string> = {
  LOW:        "var(--accent-utility-a)",
  MODERATE:   "var(--accent-utility-d)",
  CRITICAL:   "var(--destructive)",
  EXTINCTION: "var(--accent-scifi)",
};

const EXAMPLES = [
  "Go back and tell myself to buy Bitcoin in 2010",
  "Prevent the assassination of Archduke Franz Ferdinand",
  "Warn myself not to eat that sandwich on June 14, 2019",
];

const PROCESSING_LINES = [
  "Cross-referencing temporal density index…",
  "Calculating paradox probability matrices…",
  "Consulting Sacred Timeline archives…",
  "Evaluating causal dependency graph…",
  "Scanning for self-referential loops…",
  "Assessing Nexus Event potential…",
];

const SYSTEM_PROMPT = `You are TVA-7, the Temporal Variance Authority's automated classification system. Analyze time travel plans with bureaucratic precision.

Respond with ONLY valid JSON (no markdown fences, no commentary):
{
  "case_id": "TVA-2025-XX" (XX = random 2-digit number),
  "classification": "CAUSAL_LOOP" | "SPLINTER_TIMELINE" | "ERASURE_EVENT",
  "risk_level": "LOW" | "MODERATE" | "CRITICAL" | "EXTINCTION",
  "paradox_type": "2-4 word type name",
  "memo_subject": "60 chars max, dry bureaucratic subject line",
  "memo_body": "2-3 sentences of dry bureaucratic language, darkly humorous",
  "recommended_action": "80 chars max, bureaucratic action item",
  "approval_probability": 0-100 (integer),
  "timeline_note": "100 chars max, one darkly funny observation about the plan"
}

Classification rules:
- CAUSAL_LOOP: intervention creates a stable self-fulfilling loop (low risk, philosophically unsettling)
- SPLINTER_TIMELINE: creates a new parallel branch of reality (moderate risk, applicant survives)
- ERASURE_EVENT: retroactively prevents the applicant's own existence (maximum risk)`;

// ─── Canvas — temporal density grid ──────────────────────────────────────────

const DENSITY_DATES: Array<{ label: string; density: number }> = [
  { label: "Apr 14 1912", density: 1.00 },
  { label: "Nov 22 1963", density: 0.90 },
  { label: "Jul 20 1969", density: 0.85 },
  { label: "Sep 11 2001", density: 0.88 },
  { label: "Jun 28 1914", density: 0.80 },
  { label: "Oct 29 1929", density: 0.75 },
  { label: "Aug 6 1945",  density: 0.82 },
  { label: "Jul 4 1776",  density: 0.70 },
  { label: "Jan 1 2000",  density: 0.55 },
  { label: "Nov 9 1989",  density: 0.65 },
];

function DensityCanvas({ accent }: { accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef(0);
  const cols = 12, rows = 8;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = 160;
    const cw = W / cols;
    const ch = H / rows;

    // Assign density values to random cells (deterministic via LCG)
    let seed = 9999;
    const lcg = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };
    const cells = Array.from({ length: cols * rows }, (_, i) => {
      const known = DENSITY_DATES[i % DENSITY_DATES.length];
      return { density: known ? known.density : lcg() * 0.4 };
    });

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#06060A";
      ctx.fillRect(0, 0, W, H);

      cells.forEach((cell, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const pulse = 0.5 + 0.5 * Math.sin(t * 0.001 * cell.density + i * 0.4);
        const alpha = cell.density * pulse * 0.55;
        const x = col * cw + 1, y = row * ch + 1;
        ctx.fillStyle = `rgba(0,180,216,${alpha.toFixed(3)})`;
        ctx.fillRect(x, y, cw - 2, ch - 2);
        // Grid line
        ctx.strokeStyle = "rgba(0,180,216,0.08)";
        ctx.strokeRect(x, y, cw - 2, ch - 2);
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [accent, cols, rows]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 160, display: "block" }}
    />
  );
}

// ─── Case file display ────────────────────────────────────────────────────────

function CaseFileDisplay({ file, accent }: { file: CaseFile; accent: string }) {
  const classColor = CLASSIFICATION_COLORS[file.classification];
  const riskBars   = RISK_BARS[file.risk_level];
  const riskColor  = RISK_COLORS[file.risk_level];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-5">

      {/* Header row: case ID + classification */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div
          className="px-4 py-3 flex-1"
          style={{ border: `2px solid ${accent}`, background: `${accent}11`, boxShadow: `3px 3px 0 ${accent}44` }}
        >
          <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-0.5">Case ID</p>
          <p className="font-mono text-lg font-bold" style={{ color: accent }}>{file.case_id}</p>
        </div>

        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{ border: `2px solid ${classColor}`, background: `${classColor}11`, boxShadow: `3px 3px 0 ${classColor}44` }}
        >
          <span className="font-mono text-3xl font-black" style={{ color: classColor }}>
            {CLASSIFICATION_ICONS[file.classification]}
          </span>
          <div>
            <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-0.5">Classification</p>
            <p className="font-mono text-sm font-bold" style={{ color: classColor }}>
              {file.classification.replace(/_/g, " ")}
            </p>
            <p className="text-[10px] font-sans text-text-faint">{file.paradox_type}</p>
          </div>
        </div>
      </div>

      {/* Risk meter */}
      <div
        className="p-4"
        style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
      >
        <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-2">Risk Level</p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className="w-8 h-4 transition-all"
                style={{
                  background: bar <= riskBars ? riskColor : "var(--bg-base)",
                  border: `2px solid ${bar <= riskBars ? riskColor : "var(--border)"}`,
                }}
              />
            ))}
          </div>
          <span className="font-mono text-sm font-bold ml-2" style={{ color: riskColor }}>
            {file.risk_level}
          </span>
        </div>
      </div>

      {/* Memo */}
      <div
        className="p-4"
        style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
      >
        <div className="flex flex-col gap-0.5 mb-3 text-[10px] font-sans text-text-faint">
          <div className="flex gap-2"><span className="font-bold uppercase w-16">To:</span><span>Temporal Applicant (You)</span></div>
          <div className="flex gap-2"><span className="font-bold uppercase w-16">From:</span><span>TVA-7 Automated Classification Unit</span></div>
          <div className="flex gap-2"><span className="font-bold uppercase w-16">Re:</span><span>{file.memo_subject}</span></div>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-[12px] font-sans text-text-muted leading-relaxed">{file.memo_body}</p>
        </div>
      </div>

      {/* Approval + action */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-4"
          style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
        >
          <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">Approval Probability</p>
          <p className="font-mono text-3xl font-black" style={{ color: file.approval_probability > 50 ? "var(--accent-utility-a)" : "var(--destructive)" }}>
            {file.approval_probability}%
          </p>
          <div className="mt-2 h-1.5 bg-bg-base" style={{ border: "1px solid var(--border)" }}>
            <div
              className="h-full"
              style={{
                width: `${file.approval_probability}%`,
                background: file.approval_probability > 50 ? "var(--accent-utility-a)" : "var(--destructive)",
              }}
            />
          </div>
        </div>

        <div
          className="p-4"
          style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
        >
          <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">Recommended Action</p>
          <p className="text-[11px] font-sans text-text-muted leading-relaxed">{file.recommended_action}</p>
        </div>
      </div>

      {/* Timeline note */}
      <p className="text-[11px] font-sans text-text-faint italic text-center px-2 leading-relaxed">
        ✦ {file.timeline_note}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

type Phase = "idle" | "processing" | "classified" | "error";

export default function GrandfatherParadox() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "grandfather-paradox";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [plan,      setPlan]      = useState("");
  const [phase,     setPhase]     = useState<Phase>("idle");
  const [caseFile,  setCaseFile]  = useState<CaseFile | null>(null);
  const [errMsg,    setErrMsg]    = useState("");
  const [procLine,  setProcLine]  = useState(0);

  // Cycle processing flavor text
  useEffect(() => {
    if (phase !== "processing") return;
    const id = setInterval(() => setProcLine((l) => (l + 1) % PROCESSING_LINES.length), 1800);
    return () => clearInterval(id);
  }, [phase]);

  const submit = useCallback(async (planText: string) => {
    if (!planText.trim()) return;
    setPhase("processing");
    setProcLine(0);
    setCaseFile(null);

    const { content, error } = await callRealmAI({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: `Classify this time travel plan and issue a TVA case file: "${planText.trim()}"`,
      maxTokens: 400,
      expectJSON: true,
    });

    if (error) {
      setErrMsg(error);
      setPhase("error");
      return;
    }

    try {
      const parsed = JSON.parse(content) as CaseFile;
      setCaseFile(parsed);
      setPhase("classified");
    } catch {
      setErrMsg("The TVA's systems are experiencing temporal anomalies. Please try again.");
      setPhase("error");
    }
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setCaseFile(null);
    setErrMsg("");
  }, []);

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          {/* Plan input */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Describe Your Time Travel Plan
            </label>
            <textarea
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              disabled={phase === "processing"}
              placeholder="I want to go back to 1955 and…"
              rows={4}
              className="w-full px-3 py-2.5 font-sans text-sm bg-bg-base text-text-primary resize-none disabled:opacity-50"
              style={{ border: "2px solid var(--border)", outline: "none" }}
            />
          </div>

          {/* Example buttons */}
          <div className="flex flex-col gap-2">
            <p className="text-[9px] font-sans font-semibold uppercase tracking-wider text-text-faint">Try an example</p>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => { setPlan(ex); reset(); }}
                className="text-left px-3 py-2 text-[11px] font-sans text-text-muted transition-all duration-100"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}11`; (e.currentTarget as HTMLButtonElement).style.color = accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>

          <button
            onClick={() => submit(plan)}
            disabled={!plan.trim() || phase === "processing"}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            {phase === "processing" ? "Processing…" : "Submit to the TVA"}
          </button>

          {phase === "classified" && (
            <button
              onClick={reset}
              className="px-4 py-2 text-[11px] font-sans font-bold uppercase tracking-wider transition-all"
              style={{ border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-muted)" }}
            >
              New Case →
            </button>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          <DensityCanvas accent={accent} />

          {phase === "idle" && (
            <div className="px-5 py-14 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                Will you erase yourself from history?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                The TVA classifies all unauthorized temporal interventions. Submit your plan to receive an official case file.
              </p>
            </div>
          )}

          {phase === "processing" && (
            <div className="px-5 py-14 flex flex-col items-center text-center border-t border-border gap-5">
              {/* Rotating stamp */}
              <div
                className="w-20 h-20 flex items-center justify-center font-mono text-[10px] font-black uppercase tracking-wider"
                style={{
                  border: `3px solid ${accent}`,
                  color: accent,
                  animation: "tva-spin 3s linear infinite",
                }}
              >
                TVA-7
              </div>
              <style>{`@keyframes tva-spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }`}</style>
              <p className="font-mono text-[11px] text-text-muted">{PROCESSING_LINES[procLine]}</p>
            </div>
          )}

          {phase === "classified" && caseFile && (
            <CaseFileDisplay file={caseFile} accent={accent} />
          )}

          {phase === "error" && (
            <div className="px-5 py-12 flex flex-col items-center text-center border-t border-border gap-4">
              <p className="font-mono text-sm text-accent-utility-e">{errMsg}</p>
              <button
                onClick={reset}
                className="px-5 py-2 text-xs font-sans font-bold uppercase tracking-wider"
                style={{ border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-muted)" }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      }
    />
  );
}
