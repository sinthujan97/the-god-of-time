"use client";

import { useRef, useState, useEffect, type CSSProperties } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "stopwatch")!;

function pad2(n: number) { return String(Math.floor(n)).padStart(2, "0"); }
function formatMs(ms: number) {
  const cs = Math.floor((ms % 1000) / 10);
  const s = Math.floor(ms / 1000) % 60;
  const m = Math.floor(ms / 60000) % 60;
  const h = Math.floor(ms / 3600000);
  return h > 0
    ? `${pad2(h)}:${pad2(m)}:${pad2(s)}.${pad2(cs)}`
    : `${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
}

interface Lap { n: number; elapsed: number; lapTime: number; }

function Btn({ children, onClick, accent, outline }: { children: React.ReactNode; onClick: () => void; accent?: string; outline?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
        padding: "10px 22px", border: "2px solid var(--border)", borderRadius: 6,
        background: outline ? "var(--bg-card)" : (accent ?? "var(--section-clocks-accent)"),
        color: outline ? "var(--text-primary)" : "#000000",
        cursor: "pointer", boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
    >
      {children}
    </button>
  );
}

export default function Stopwatch() {
  const [, setTick] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);

  const running = useRef(false);
  const startWall = useRef(0);
  const accumulated = useRef(0);
  const rafId = useRef(0);
  const lapCount = useRef(0);

  function now() {
    return accumulated.current + (running.current ? Date.now() - startWall.current : 0);
  }

  function doStart() {
    startWall.current = Date.now();
    running.current = true;
    function frame() { setTick((t) => t + 1); rafId.current = requestAnimationFrame(frame); }
    rafId.current = requestAnimationFrame(frame);
    setTick((t) => t + 1);
  }

  function doStop() {
    accumulated.current += Date.now() - startWall.current;
    running.current = false;
    cancelAnimationFrame(rafId.current);
    setTick((t) => t + 1);
  }

  function doLap() {
    if (!running.current) return;
    const e = now();
    const prevEnd = laps[0]?.elapsed ?? 0;
    lapCount.current += 1;
    setLaps((prev) => [{ n: lapCount.current, elapsed: e, lapTime: e - prevEnd }, ...prev]);
  }

  function doReset() {
    cancelAnimationFrame(rafId.current);
    running.current = false;
    accumulated.current = 0;
    lapCount.current = 0;
    setLaps([]);
    setTick(0);
  }

  // Stable-ref keyboard shortcuts
  const fns = useRef({ doStart, doStop, doLap, doReset });
  fns.current = { doStart, doStop, doLap, doReset };
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " ") { e.preventDefault(); running.current ? fns.current.doStop() : fns.current.doStart(); }
      if (e.key === "l" || e.key === "L") fns.current.doLap();
      if (e.key === "r" || e.key === "R") fns.current.doReset();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  const e = now();
  const fastest = laps.length > 1 ? Math.min(...laps.map((l) => l.lapTime)) : -1;
  const slowest = laps.length > 1 ? Math.max(...laps.map((l) => l.lapTime)) : -1;

  function exportCSV() {
    const rows = [...laps].reverse().map((l) => `${l.n},${formatMs(l.lapTime)},${formatMs(l.elapsed)}`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([`Lap,Lap Time,Elapsed\n${rows.join("\n")}`], { type: "text/csv" }));
    a.download = "stopwatch-laps.csv";
    a.click();
  }

  return (
    <ClockLayout clock={clock}>
      <div style={{ padding: "48px 32px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>

        <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(52px, 9vw, 88px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em", lineHeight: 1 }}>
          {formatMs(e)}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={running.current ? doStop : doStart} accent={running.current ? "var(--destructive)" : "var(--section-clocks-accent)"}>
            {running.current ? "STOP" : e === 0 ? "START" : "RESUME"}
          </Btn>
          {running.current && <Btn onClick={doLap} outline>LAP</Btn>}
          {!running.current && e > 0 && <Btn onClick={doReset} outline>RESET</Btn>}
        </div>

        {laps.length > 0 && (
          <div style={{ width: "100%", maxHeight: 240, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-mono)", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)" }}>
                  {["#", "Lap Time", "Total"].map((h) => (
                    <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {laps.map((l) => {
                  const isFast = laps.length > 1 && l.lapTime === fastest;
                  const isSlow = laps.length > 1 && l.lapTime === slowest;
                  return (
                    <tr key={l.n} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                      <td style={{ padding: "6px 10px", color: "var(--text-muted)" }}>{l.n}</td>
                      <td style={{ padding: "6px 10px", color: isFast ? "var(--accent-utility-a)" : isSlow ? "var(--destructive)" : "var(--text-primary)", fontWeight: isFast || isSlow ? 700 : 400 }}>
                        {formatMs(l.lapTime)}{isFast ? " ▲" : isSlow ? " ▼" : ""}
                      </td>
                      <td style={{ padding: "6px 10px", color: "var(--text-muted)" }}>{formatMs(l.elapsed)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {laps.length >= 2 && (
              <button onClick={exportCSV} style={{ marginTop: 10, fontFamily: "var(--font-mono)", fontSize: 11, padding: "4px 12px", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
                Export CSV
              </button>
            )}
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.05em" }}>
          Space: start/stop · L: lap · R: reset
        </p>
      </div>
    </ClockLayout>
  );
}
