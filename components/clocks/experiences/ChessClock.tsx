"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "chess-clock")!;

const PRESETS = [
  { label: "Bullet",    secs: 60 },
  { label: "Blitz",     secs: 5 * 60 },
  { label: "Rapid",     secs: 10 * 60 },
  { label: "Classical", secs: 30 * 60 },
];

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtSecs(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${pad2(h)}:${pad2(m)}:${pad2(sec)}` : `${pad2(m)}:${pad2(sec)}`;
}

export default function ChessClock() {
  const [baseTime, setBaseTime] = useState(5 * 60);
  const [times, setTimes] = useState<[number, number]>([5 * 60, 5 * 60]);
  const [active, setActive] = useState<0 | 1 | null>(null);
  const [flagged, setFlagged] = useState<0 | 1 | null>(null);
  const [started, setStarted] = useState(false);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef<0 | 1 | null>(null);
  activeRef.current = active;

  function clearIv() { if (ivRef.current) { clearInterval(ivRef.current); ivRef.current = null; } }

  function startTicking() {
    clearIv();
    ivRef.current = setInterval(() => {
      const p = activeRef.current;
      if (p === null) return;
      setTimes((prev) => {
        const next: [number, number] = [prev[0], prev[1]];
        next[p] = Math.max(0, next[p] - 1);
        if (next[p] === 0) {
          clearIv();
          setFlagged(p);
          setActive(null);
        }
        return next;
      });
    }, 1000);
  }

  function press(player: 0 | 1) {
    if (flagged !== null) return;
    const opp = (1 - player) as 0 | 1;
    if (!started) {
      setStarted(true);
      setActive(opp);
      activeRef.current = opp;
      startTicking();
      return;
    }
    if (active !== player) return;
    setActive(opp);
    activeRef.current = opp;
    startTicking();
  }

  function pause() { clearIv(); setActive(null); }

  function applyPreset(secs: number) {
    clearIv();
    setBaseTime(secs);
    setTimes([secs, secs]);
    setActive(null);
    setFlagged(null);
    setStarted(false);
  }

  function reset() {
    clearIv();
    setTimes([baseTime, baseTime]);
    setActive(null);
    setFlagged(null);
    setStarted(false);
  }

  useEffect(() => () => clearIv(), []);

  function Panel({ player }: { player: 0 | 1 }) {
    const isActive = active === player;
    const isFlagged = flagged === player;
    const t = times[player];
    const isLow = t <= 30 && t > 0 && started;
    const canPress = !isFlagged && ((!started) || active === player);

    const bgColor = isFlagged
      ? "var(--destructive)"
      : isActive
        ? "var(--section-clocks-accent)"
        : "var(--bg-surface)";

    const timeColor = isFlagged
      ? "#000000"
      : isLow
        ? "var(--accent-utility-d)"
        : isActive
          ? "#000000"
          : "var(--text-primary)";

    return (
      <button
        onClick={() => press(player)}
        disabled={!canPress}
        style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
          padding: "44px 24px", border: "none", borderRadius: 0,
          transform: player === 0 ? "rotate(180deg)" : "none",
          background: bgColor,
          cursor: canPress ? "pointer" : "default",
          transition: "background 0.3s",
          userSelect: "none",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(42px, 8vw, 72px)", fontWeight: 700, lineHeight: 1, color: timeColor, transition: "color 0.3s" }}>
          {isFlagged ? "FLAG" : fmtSecs(t)}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: isActive || isFlagged ? "#000000" : "var(--text-muted)", opacity: isActive || isFlagged ? 0.75 : 1 }}>
          {isFlagged ? "Time expired" : isActive ? "Tap after your move" : `Player ${player + 1}`}
        </span>
      </button>
    );
  }

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.secs)}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "7px 16px", border: "2px solid var(--border)", background: baseTime === p.secs ? "var(--text-primary)" : "var(--bg-surface)", color: baseTime === p.secs ? "var(--bg-base)" : "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {started && active !== null && (
              <button onClick={pause} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 20px", border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
                PAUSE
              </button>
            )}
            <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 20px", border: "2px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
              RESET
            </button>
          </div>
          {!started && (
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)" }}>
              Press your panel after each move to switch the clock.
            </p>
          )}
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", minHeight: 380 }}>
        <Panel player={0} />
        <div style={{ height: 3, flexShrink: 0, background: "var(--border)" }} />
        <Panel player={1} />
      </div>
    </ClockLayout>
  );
}
