"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "interval-sounds")!;

type ToneType = "sine" | "triangle" | "sawtooth";

const INTERVALS = [1, 2, 5, 10, 15, 20, 30];

const TONES: { type: ToneType; label: string; desc: string }[] = [
  { type: "sine",     label: "Soft",   desc: "Pure sine wave — gentle and warm" },
  { type: "triangle", label: "Bell",   desc: "Triangle wave — clear bell-like tone" },
  { type: "sawtooth", label: "Gong",   desc: "Sawtooth wave — rich harmonic gong" },
];

let audioCtx: AudioContext | null = null;
function getAudio() { if (!audioCtx) audioCtx = new AudioContext(); return audioCtx; }

function playTone(type: ToneType) {
  try {
    const ctx = getAudio();
    if (ctx.state === "suspended") ctx.resume();
    // Three harmonics for richness
    [440, 880, 1320].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      const vol = [0.35, 0.15, 0.06][i];
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (type === "sawtooth" ? 3 : 2));
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + (type === "sawtooth" ? 3 : 2));
    });
  } catch {}
}

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtSecs(s: number) { return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`; }

export default function IntervalSounds() {
  const [intervalMins, setIntervalMins] = useState(5);
  const [tone, setTone] = useState<ToneType>("triangle");
  const [running, setRunning] = useState(false);
  const [secsLeft, setSecsLeft] = useState(5 * 60);
  const [bellCount, setBellCount] = useState(0);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secsRef = useRef(secsLeft);
  const intervalRef = useRef(intervalMins);
  const toneRef = useRef(tone);
  secsRef.current = secsLeft;
  intervalRef.current = intervalMins;
  toneRef.current = tone;

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

  function start() {
    playTone(toneRef.current); // preview bell on start
    const secs = intervalRef.current * 60;
    setSecsLeft(secs); secsRef.current = secs;
    setRunning(true);
    ivRef.current = setInterval(() => {
      const next = secsRef.current - 1;
      if (next <= 0) {
        playTone(toneRef.current);
        setBellCount((c) => c + 1);
        const reset = intervalRef.current * 60;
        setSecsLeft(reset); secsRef.current = reset;
      } else {
        setSecsLeft(next);
      }
    }, 1000);
  }

  function stop() { clearIv(); setRunning(false); }

  function preview() { playTone(tone); }

  useEffect(() => {
    if (!running) { setSecsLeft(intervalMins * 60); secsRef.current = intervalMins * 60; }
  }, [intervalMins, running]);

  useEffect(() => () => clearIv(), []);

  const totalSecs = intervalMins * 60;
  const ratio = totalSecs > 0 ? secsLeft / totalSecs : 1;

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Interval */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Bell interval</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {INTERVALS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setIntervalMins(m); if (!running) { setSecsLeft(m * 60); } }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "6px 14px", border: "2px solid var(--border)", borderRadius: 4, background: intervalMins === m ? "var(--text-primary)" : "var(--bg-surface)", color: intervalMins === m ? "var(--bg-base)" : "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Tone</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {TONES.map((t) => (
                <button
                  key={t.type}
                  onClick={() => setTone(t.type)}
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "6px 16px", border: "2px solid var(--border)", borderRadius: 4, background: tone === t.type ? "var(--section-clocks-accent)" : "var(--bg-surface)", color: tone === t.type ? "var(--bg-base)" : "var(--text-primary)", cursor: "pointer" }}
                >
                  {t.label}
                </button>
              ))}
              <button
                onClick={preview}
                style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "6px 14px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-muted)", cursor: "pointer" }}
              >
                ▶ Preview
              </button>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
              {TONES.find((t) => t.type === tone)?.desc}
            </p>
          </div>
        </div>
      }
    >
      <div style={{ minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "48px 32px" }}>

        {/* Countdown ring */}
        <div style={{ position: "relative", width: 200, height: 200 }}>
          <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={100} cy={100} r={86} fill="none" stroke="var(--border)" strokeWidth={8} />
            <circle
              cx={100} cy={100} r={86}
              fill="none" stroke={running ? "var(--section-clocks-accent)" : "var(--border)"}
              strokeWidth={8}
              strokeDasharray={2 * Math.PI * 86}
              strokeDashoffset={2 * Math.PI * 86 * (1 - ratio)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 40, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1 }}>
              {fmtSecs(secsLeft)}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              until bell
            </span>
          </div>
        </div>

        {/* Bell count */}
        {bellCount > 0 && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--section-clocks-accent)", fontWeight: 700 }}>
            🔔 {bellCount} bell{bellCount !== 1 ? "s" : ""} rung
          </p>
        )}

        {/* Controls */}
        <div style={{ display: "flex", gap: 10 }}>
          {!running ? (
            <button onClick={start} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 28px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              START
            </button>
          ) : (
            <button onClick={stop} style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, padding: "11px 28px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--destructive)", color: "#000000", cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              STOP
            </button>
          )}
        </div>

        {!running && bellCount === 0 && (
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
            Choose an interval and tone above, then press START.
          </p>
        )}
      </div>
    </ClockLayout>
  );
}
