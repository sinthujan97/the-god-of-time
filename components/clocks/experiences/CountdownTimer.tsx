"use client";

import { useState, useEffect, useRef } from "react";
import { Share2, Check } from "lucide-react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "countdown")!;

interface Timer {
  id: string;
  label: string;
  mode: "duration" | "target";
  totalMs: number;
  remainingMs: number;
  isRunning: boolean;
  isComplete: boolean;
  targetTimestamp?: number;
}

function pad2(n: number) { return String(Math.floor(n)).padStart(2, "0"); }
function formatMs(ms: number) {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  return h > 0 ? `${pad2(h)}:${pad2(m % 60)}:${pad2(s % 60)}` : `${pad2(m % 60)}:${pad2(s % 60)}`;
}

type CountdownSoundKey = "classic" | "chime" | "gong" | "silent";
const SOUND_OPTIONS: { key: CountdownSoundKey; label: string }[] = [
  { key: "classic", label: "Classic" },
  { key: "chime", label: "Chime" },
  { key: "gong", label: "Gong" },
  { key: "silent", label: "Silent" },
];

let audioCtx: AudioContext | null = null;
function getAudio() { if (!audioCtx) audioCtx = new AudioContext(); return audioCtx; }

function playClassicBell() {
  try {
    const ctx = getAudio();
    [0, 0.4, 0.8].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = [880, 1046, 1318][i];
      gain.gain.setValueAtTime(0.35, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.2);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 1.2);
    });
  } catch {}
}

function playHarmonicTone(type: OscillatorType) {
  try {
    const ctx = getAudio();
    if (ctx.state === "suspended") ctx.resume();
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

function playSelectedSound(key: CountdownSoundKey) {
  if (key === "silent") return;
  if (key === "classic") return playClassicBell();
  if (key === "chime") return playHarmonicTone("triangle");
  if (key === "gong") return playHarmonicTone("sawtooth");
}

const RADIUS = 52;
const CIRC = 2 * Math.PI * RADIUS;

export default function CountdownTimer() {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(5);
  const [secs, setSecs] = useState(0);
  const [label, setLabel] = useState("");
  const [mode, setMode] = useState<"duration" | "target">("duration");
  const [targetDateTimeStr, setTargetDateTimeStr] = useState("");
  const [soundKey, setSoundKey] = useState<CountdownSoundKey>("classic");
  const [shareCopiedId, setShareCopiedId] = useState<string | null>(null);
  const idRef = useRef(0);
  const soundKeyRef = useRef(soundKey);
  soundKeyRef.current = soundKey;
  const shareCopyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      setTimers((prev) => {
        if (prev.every((t) => !t.isRunning)) return prev;
        let titleTimer: Timer | null = null;
        const next = prev.map((t) => {
          if (!t.isRunning || t.isComplete) return t;
          const rem = t.mode === "target" && t.targetTimestamp
            ? Math.max(0, t.targetTimestamp - Date.now())
            : Math.max(0, t.remainingMs - 100);
          const done = rem === 0;
          if (done) playSelectedSound(soundKeyRef.current);
          if (!titleTimer) titleTimer = { ...t, remainingMs: rem };
          return { ...t, remainingMs: rem, isComplete: done, isRunning: !done };
        });
        if (titleTimer) {
          document.title = `${formatMs((titleTimer as Timer).remainingMs)} — ${(titleTimer as Timer).label} | God of Time`;
        }
        return next;
      });
    }, 100);
    return () => {
      clearInterval(iv);
    };
  }, []);

  // Load sound preference, then restore a shared timer from the URL if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem("countdown_timer_sound");
      if (saved === "classic" || saved === "chime" || saved === "gong" || saved === "silent") {
        setSoundKey(saved);
      }
    } catch {}

    try {
      const params = new URLSearchParams(window.location.search);
      const sharedMode = params.get("mode");
      const sharedLabel = params.get("label");
      if (sharedMode === "duration") {
        const h = parseInt(params.get("h") ?? "", 10);
        const m = parseInt(params.get("m") ?? "", 10);
        const s = parseInt(params.get("s") ?? "", 10);
        const totalMs = ((isNaN(h) ? 0 : h) * 3600 + (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s)) * 1000;
        if (totalMs > 0) {
          idRef.current += 1;
          const id = String(idRef.current);
          setTimers((prev) => [...prev, {
            id, label: sharedLabel?.trim() || `Timer ${id}`, mode: "duration",
            totalMs, remainingMs: totalMs, isRunning: false, isComplete: false,
          }]);
        }
      } else if (sharedMode === "target") {
        const target = Number(params.get("target"));
        if (!isNaN(target) && target > Date.now()) {
          idRef.current += 1;
          const id = String(idRef.current);
          setTimers((prev) => [...prev, {
            id, label: sharedLabel?.trim() || `Timer ${id}`, mode: "target",
            totalMs: target - Date.now(), remainingMs: target - Date.now(),
            isRunning: false, isComplete: false, targetTimestamp: target,
          }]);
        }
      }
      if (sharedMode) window.history.replaceState({}, "", window.location.pathname);
    } catch {}
  }, []);

  function selectSound(key: CountdownSoundKey) {
    setSoundKey(key);
    try { localStorage.setItem("countdown_timer_sound", key); } catch {}
  }

  function addTimer() {
    if (mode === "duration") {
      const totalMs = (hrs * 3600 + mins * 60 + secs) * 1000;
      if (totalMs === 0) return;
      idRef.current += 1;
      const id = String(idRef.current);
      setTimers((prev) => [...prev, {
        id, label: label.trim() || `Timer ${id}`, mode: "duration",
        totalMs, remainingMs: totalMs,
        isRunning: false, isComplete: false,
      }]);
    } else {
      if (!targetDateTimeStr) return;
      const target = new Date(targetDateTimeStr).getTime();
      if (isNaN(target) || target <= Date.now()) return;
      idRef.current += 1;
      const id = String(idRef.current);
      const totalMs = target - Date.now();
      setTimers((prev) => [...prev, {
        id, label: label.trim() || `Timer ${id}`, mode: "target",
        totalMs, remainingMs: totalMs,
        isRunning: false, isComplete: false, targetTimestamp: target,
      }]);
    }
    setLabel("");
  }

  function toggle(id: string) {
    setTimers((prev) => prev.map((t) => t.id === id && !t.isComplete ? { ...t, isRunning: !t.isRunning } : t));
  }

  function resetTimer(id: string) {
    setTimers((prev) => prev.map((t) => {
      if (t.id !== id) return t;
      const remainingMs = t.mode === "target" && t.targetTimestamp
        ? Math.max(0, t.targetTimestamp - Date.now())
        : t.totalMs;
      return { ...t, remainingMs, isRunning: false, isComplete: false };
    }));
  }

  function removeTimer(id: string) {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }

  function buildShareUrl(t: Timer): string {
    const params = new URLSearchParams();
    params.set("label", t.label);
    if (t.mode === "target" && t.targetTimestamp) {
      params.set("mode", "target");
      params.set("target", String(t.targetTimestamp));
    } else {
      params.set("mode", "duration");
      const totalSec = Math.round(t.totalMs / 1000);
      params.set("h", String(Math.floor(totalSec / 3600)));
      params.set("m", String(Math.floor((totalSec % 3600) / 60)));
      params.set("s", String(totalSec % 60));
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function handleShare(t: Timer) {
    const url = buildShareUrl(t);
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: t.label, url }).catch(() => {});
      return;
    }
    navigator.clipboard.writeText(url).then(() => {
      setShareCopiedId(t.id);
      if (shareCopyTimerRef.current) clearTimeout(shareCopyTimerRef.current);
      shareCopyTimerRef.current = setTimeout(() => setShareCopiedId(null), 1500);
    }).catch(() => {});
  }

  return (
    <ClockLayout clock={clock} controlsSection={
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Mode toggle */}
        <div style={{ display: "flex", gap: 8 }}>
          {(["duration", "target"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "6px 16px", border: "2px solid var(--border)", borderRadius: 4, background: mode === m ? "var(--section-clocks-accent)" : "var(--bg-surface)", color: mode === m ? "#000000" : "var(--text-primary)", cursor: "pointer" }}
            >
              {m === "duration" ? "Duration" : "Specific Date & Time"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          {mode === "duration" ? (
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { val: hrs, set: setHrs, lbl: "h", max: 23 },
                { val: mins, set: setMins, lbl: "m", max: 59 },
                { val: secs, set: setSecs, lbl: "s", max: 59 },
              ].map(({ val, set, lbl, max }) => (
                <div key={lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <input
                    type="number" min={0} max={max} value={val}
                    onChange={(e) => set(Math.min(max, Math.max(0, Number(e.target.value))))}
                    style={{ width: 56, height: 40, fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", padding: 0, borderRadius: 4 }}
                  />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--text-muted)" }}>{lbl}</span>
                </div>
              ))}
            </div>
          ) : (
            <input
              type="datetime-local"
              value={targetDateTimeStr}
              onChange={(e) => setTargetDateTimeStr(e.target.value)}
              style={{ height: 40, fontFamily: "var(--font-mono)", fontSize: 14, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4, padding: "0 10px" }}
            />
          )}
          <div style={{ display: "flex", flexDirection: "column", flex: "1 1 180px", gap: 4 }}>
            <input
              type="text" placeholder="Label (optional)" value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTimer()}
              style={{ height: 40, fontFamily: "var(--font-ui)", fontSize: 13, padding: "0 12px", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4, width: "100%", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={addTimer}
            style={{ height: 40, fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "0 20px", border: "2px solid var(--border)", borderRadius: 6, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            + ADD
          </button>
        </div>

        {/* Sound picker */}
        <div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Alert sound</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {SOUND_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => selectSound(opt.key)}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "6px 16px", border: "2px solid var(--border)", borderRadius: 4, background: soundKey === opt.key ? "var(--section-clocks-accent)" : "var(--bg-surface)", color: soundKey === opt.key ? "#000000" : "var(--text-primary)", cursor: "pointer" }}
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={() => playSelectedSound(soundKey)}
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "6px 14px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-muted)", cursor: "pointer" }}
            >
              ▶ Preview
            </button>
          </div>
        </div>
      </div>
    }>
      <div style={{ padding: "40px 32px 32px", minHeight: 300 }}>
        {timers.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220 }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center" }}>
              Set a time above and press + ADD to start.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
            {timers.map((t) => {
              const progress = t.totalMs > 0 ? t.remainingMs / t.totalMs : 0;
              const dashOffset = CIRC * (1 - progress);
              return (
                <div key={t.id} style={{ flex: "1 1 190px", minWidth: 170, maxWidth: 240, background: "var(--bg-surface)", border: "2px solid var(--border)", borderRadius: 10, padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
                  <div style={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 4 }}>
                    <button
                      onClick={() => handleShare(t)}
                      title="Share this timer"
                      style={{ fontFamily: "var(--font-mono)", fontSize: 11, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", color: "var(--text-faint)" }}
                    >
                      {shareCopiedId === t.id ? <Check size={12} /> : <Share2 size={12} />}
                    </button>
                    <button
                      onClick={() => removeTimer(t.id)}
                      style={{ fontFamily: "var(--font-mono)", fontSize: 11, padding: "2px 6px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", color: "var(--text-faint)", lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* SVG ring */}
                  <div style={{ position: "relative", width: 126, height: 126 }}>
                    <svg width={126} height={126} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={63} cy={63} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={8} />
                      <circle
                        cx={63} cy={63} r={RADIUS} fill="none"
                        stroke={t.isComplete ? "var(--accent-utility-a)" : "var(--section-clocks-accent)"}
                        strokeWidth={8}
                        strokeDasharray={CIRC}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        style={{ transition: "stroke-dashoffset 0.08s linear" }}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: t.totalMs > 3_600_000 ? 18 : 24, fontWeight: 700, color: t.isComplete ? "var(--accent-utility-a)" : "var(--text-primary)" }}>
                        {t.isComplete ? "✓" : formatMs(t.remainingMs)}
                      </span>
                    </div>
                  </div>

                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textAlign: "center", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.label}
                  </span>

                  <div style={{ display: "flex", gap: 6 }}>
                    {!t.isComplete && (
                      <button onClick={() => toggle(t.id)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "5px 12px", border: "2px solid var(--border)", borderRadius: 4, background: t.isRunning ? "var(--destructive)" : "var(--section-clocks-accent)", color: "#000000", cursor: "pointer" }}>
                        {t.isRunning ? "PAUSE" : "START"}
                      </button>
                    )}
                    <button onClick={() => resetTimer(t.id)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "5px 12px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer" }}>
                      RST
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
