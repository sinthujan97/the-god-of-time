"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "interval-timer")!;

type Phase = "idle" | "work" | "rest" | "done";

interface Config { workSecs: number; restSecs: number; rounds: number; }

const PRESETS: { label: string; config: Config }[] = [
  { label: "Tabata",   config: { workSecs: 20,  restSecs: 10, rounds: 8  } },
  { label: "HIIT",     config: { workSecs: 40,  restSecs: 20, rounds: 8  } },
  { label: "Boxing",   config: { workSecs: 180, restSecs: 60, rounds: 12 } },
  { label: "Stretch",  config: { workSecs: 45,  restSecs: 15, rounds: 10 } },
];

let audioCtx: AudioContext | null = null;
function getAudio() { if (!audioCtx) audioCtx = new AudioContext(); return audioCtx; }
function beep(freq: number, dur: number) {
  try {
    const ctx = getAudio();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + dur);
  } catch {}
}

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtSecs(s: number) { const m = Math.floor(s / 60); return `${pad2(m)}:${pad2(s % 60)}`; }

export default function IntervalTimer() {
  const [config, setConfig] = useState<Config>({ workSecs: 20, restSecs: 10, rounds: 8 });
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(1);
  const [secsLeft, setSecsLeft] = useState(0);

  const phaseRef = useRef<Phase>("idle");
  const roundRef = useRef(1);
  const secsRef = useRef(0);
  const configRef = useRef(config);
  configRef.current = config;
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

  function applyPhase(p: Phase, r: number, s: number) {
    phaseRef.current = p; roundRef.current = r; secsRef.current = s;
    setPhase(p); setRound(r); setSecsLeft(s);
  }

  function tick() {
    secsRef.current -= 1;
    const cfg = configRef.current;
    if (secsRef.current <= 3 && secsRef.current > 0) beep(660, 0.15);
    if (secsRef.current <= 0) {
      if (phaseRef.current === "work") {
        if (roundRef.current >= cfg.rounds) {
          applyPhase("done", roundRef.current, 0);
          clearIv();
          beep(1046, 1.2);
        } else {
          applyPhase("rest", roundRef.current, cfg.restSecs);
          beep(440, 0.4);
        }
      } else if (phaseRef.current === "rest") {
        applyPhase("work", roundRef.current + 1, cfg.workSecs);
        beep(880, 0.4);
      }
    } else {
      setSecsLeft(secsRef.current);
    }
  }

  function start() {
    clearIv();
    applyPhase("work", 1, config.workSecs);
    beep(880, 0.4);
    ivRef.current = setInterval(tick, 1000);
  }

  function stop() {
    clearIv();
    applyPhase("idle", 1, 0);
  }

  useEffect(() => () => clearIv(), []);

  const total = phase === "work" ? config.workSecs : phase === "rest" ? config.restSecs : 0;
  const pct = total > 0 ? (secsLeft / total) * 100 : 0;

  const PHASE_BG: Record<Phase, string> = {
    idle: "transparent",
    work: "rgba(255,159,0,0.08)",
    rest: "rgba(34,197,94,0.08)",
    done: "transparent",
  };
  const PHASE_COLOR: Record<Phase, string> = {
    idle: "var(--text-muted)",
    work: "var(--section-clocks-accent)",
    rest: "var(--accent-utility-a)",
    done: "var(--section-clocks-accent)",
  };

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Presets */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Preset</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setConfig(p.config); stop(); }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "7px 16px", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Config inputs */}
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {([ ["Work (s)", "workSecs", 5, 600], ["Rest (s)", "restSecs", 0, 300], ["Rounds", "rounds", 1, 99] ] as [string, keyof Config, number, number][]).map(([lbl, key, min, max]) => (
              <label key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>{lbl}</span>
                <input
                  type="number" min={min} max={max} value={config[key]}
                  onChange={(e) => setConfig((c) => ({ ...c, [key]: Math.min(max, Math.max(min, Number(e.target.value))) }))}
                  style={{ width: 76, fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: "6px 4px", borderRadius: 4 }}
                />
              </label>
            ))}
          </div>
        </div>
      }
    >
      <div style={{ minHeight: 340, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "48px 32px", background: PHASE_BG[phase], transition: "background 0.5s ease" }}>

        {phase === "idle" && (
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-muted)" }}>
            Configure below, then press START.
          </p>
        )}

        {(phase === "work" || phase === "rest") && (
          <>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: PHASE_COLOR[phase] }}>
              {phase === "work" ? "WORK" : "REST"} — Round {round} / {config.rounds}
            </span>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(56px, 10vw, 96px)", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
              {fmtSecs(secsLeft)}
            </div>
            <div style={{ width: "100%", maxWidth: 400, height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "100%", background: PHASE_COLOR[phase], borderRadius: 4, transform: `scaleX(${pct / 100})`, transformOrigin: "left", transition: "transform 0.9s linear" }} />
            </div>
          </>
        )}

        {phase === "done" && (
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 48 }}>🎉</span>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: "var(--text-primary)" }}>Done!</p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)" }}>{config.rounds} rounds completed</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {(phase === "idle" || phase === "done") && (
            <button onClick={start} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 28px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              {phase === "done" ? "AGAIN" : "START"}
            </button>
          )}
          {(phase === "work" || phase === "rest") && (
            <button onClick={stop} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 28px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--destructive)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              STOP
            </button>
          )}
        </div>
      </div>
    </ClockLayout>
  );
}
