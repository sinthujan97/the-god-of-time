"use client";

import { useState, useRef, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "chess-clock")!;

const PRESETS = [
  { label: "1+0 Bullet", secs: 60, inc: 0, mode: "sudden" },
  { label: "2+1 Bullet", secs: 120, inc: 1, mode: "increment" },
  { label: "3+0 Blitz", secs: 180, inc: 0, mode: "sudden" },
  { label: "3+2 Blitz", secs: 180, inc: 2, mode: "increment" },
  { label: "5+0 Blitz", secs: 300, inc: 0, mode: "sudden" },
  { label: "5+3 Blitz", secs: 300, inc: 3, mode: "increment" },
  { label: "10+0 Rapid", secs: 600, inc: 0, mode: "sudden" },
  { label: "15+10 Rapid", secs: 900, inc: 10, mode: "increment" },
  { label: "30+0 Classical", secs: 1800, inc: 0, mode: "sudden" },
];

function pad2(n: number) { return String(n).padStart(2, "0"); }
function fmtSecs(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0 ? `${pad2(h)}:${pad2(m)}:${pad2(sec)}` : `${pad2(m)}:${pad2(sec)}`;
}

export default function ChessClock() {
  const [baseTime, setBaseTime] = useState(300); // 5 min default
  const [timingMode, setTimingMode] = useState<"sudden" | "increment" | "delay">("sudden");
  const [incrementSecs, setIncrementSecs] = useState(0);

  const [times, setTimes] = useState<[number, number]>([300, 300]);
  const [active, setActive] = useState<0 | 1 | null>(null);
  const [lastActive, setLastActive] = useState<0 | 1>(0);
  const [flagged, setFlagged] = useState<0 | 1 | null>(null);
  const [started, setStarted] = useState(false);
  const [delayRemaining, setDelayRemaining] = useState(0);

  // Layout states
  const [layoutOrientation, setLayoutOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [rotateText, setRotateText] = useState(true);

  // Landscape fullscreen detection
  const [isLandscape, setIsLandscape] = useState(false);
  const [forcePortrait, setForcePortrait] = useState(false);

  useEffect(() => {
    function handleResize() {
      // Detect if width > height and it's a mobile/tablet viewport (width < 1024px)
      const landscape = window.innerWidth > window.innerHeight && window.innerWidth < 1024;
      setIsLandscape(landscape);
      if (!landscape) {
        setForcePortrait(false); // Reset forced toggle when turning back to portrait
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef<0 | 1 | null>(null);
  activeRef.current = active;

  const timingModeRef = useRef(timingMode);
  timingModeRef.current = timingMode;

  const delayRef = useRef(delayRemaining);
  delayRef.current = delayRemaining;

  const isLandscapeMode = isLandscape && !forcePortrait;

  function clearIv() {
    if (ivRef.current) {
      clearInterval(ivRef.current);
      ivRef.current = null;
    }
  }

  function startTicking() {
    clearIv();
    ivRef.current = setInterval(() => {
      const p = activeRef.current;
      if (p === null) return;

      // Handle Delay mode countdown first
      if (timingModeRef.current === "delay" && delayRef.current > 0) {
        setDelayRemaining((prev) => {
          const next = prev - 1;
          delayRef.current = next;
          return next;
        });
        return;
      }

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

    // If game is paused, let the active player resume by tapping their side
    if (started && active === null) {
      if (lastActive === player) {
        setActive(player);
        activeRef.current = player;
        startTicking();
      }
      return;
    }

    if (!started) {
      setStarted(true);
      setActive(opp);
      activeRef.current = opp;
      setLastActive(opp);
      if (timingMode === "delay") {
        setDelayRemaining(incrementSecs);
        delayRef.current = incrementSecs;
      }
      startTicking();
      return;
    }

    if (active !== player) return;

    // Apply Fischer increment on move completion
    let nextTimes = [...times] as [number, number];
    if (timingMode === "increment") {
      nextTimes[player] += incrementSecs;
    }

    setTimes(nextTimes);
    setActive(opp);
    activeRef.current = opp;
    setLastActive(opp);

    if (timingMode === "delay") {
      setDelayRemaining(incrementSecs);
      delayRef.current = incrementSecs;
    } else {
      setDelayRemaining(0);
      delayRef.current = 0;
    }

    startTicking();
  }

  function pause() {
    if (active !== null) {
      setLastActive(active);
    }
    clearIv();
    setActive(null);
  }

  function resume() {
    setActive(lastActive);
    activeRef.current = lastActive;
    startTicking();
  }

  function applyPreset(secs: number, inc: number, mode: string) {
    clearIv();
    setBaseTime(secs);
    setIncrementSecs(inc);
    setTimingMode(mode as any);
    setTimes([secs, secs]);
    setActive(null);
    setFlagged(null);
    setStarted(false);
    setDelayRemaining(0);
    delayRef.current = 0;
  }

  function applyCustomTime(mins: number, inc: number, mode: string) {
    const secs = mins * 60;
    clearIv();
    setBaseTime(secs);
    setIncrementSecs(inc);
    setTimingMode(mode as any);
    setTimes([secs, secs]);
    setActive(null);
    setFlagged(null);
    setStarted(false);
    setDelayRemaining(0);
    delayRef.current = 0;
  }

  function reset() {
    clearIv();
    setTimes([baseTime, baseTime]);
    setActive(null);
    setFlagged(null);
    setStarted(false);
    setDelayRemaining(0);
    delayRef.current = 0;
  }

  useEffect(() => () => clearIv(), []);

  function Panel({ player }: { player: 0 | 1 }) {
    const isActive = active === player;
    const isFlagged = flagged === player;
    const t = times[player];
    const isLow = t <= 10 && t > 0 && started;

    // Resuming is allowed if paused and this player is the one whose turn it is
    const canPress = !isFlagged && (!started || active === player || (active === null && lastActive === player));

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

    // Rotations based on layout and rotateText toggle
    let rotation = "none";
    if (rotateText || isLandscapeMode) {
      if (isLandscapeMode || layoutOrientation === "horizontal") {
        rotation = player === 0 ? "rotate(90deg)" : "rotate(-90deg)";
      } else {
        rotation = player === 0 ? "rotate(180deg)" : "none";
      }
    }

    const fs = isLandscapeMode ? "clamp(44px, 15vh, 88px)" : "clamp(38px, 8vw, 72px)";

    return (
      <button
        onClick={() => press(player)}
        disabled={!canPress}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: isLandscapeMode ? "12px" : "44px 24px",
          border: "none",
          borderRadius: 0,
          transform: rotation,
          background: bgColor,
          cursor: canPress ? "pointer" : "default",
          transition: "background 0.3s, transform 0.3s",
          userSelect: "none",
          height: isLandscapeMode ? "100%" : "auto",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: fs, fontWeight: 700, lineHeight: 1, color: timeColor, transition: "color 0.3s" }}>
          {isFlagged ? "FLAG" : fmtSecs(t)}
        </span>
        {isActive && timingMode === "delay" && delayRemaining > 0 && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: isLandscapeMode ? 14 : 13, fontWeight: 700, color: "#000000" }}>
            Delay: {delayRemaining}s
          </span>
        )}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: isLandscapeMode ? 12 : 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: isActive || isFlagged ? "#000000" : "var(--text-muted)", opacity: isActive || isFlagged ? 0.75 : 1 }}>
          {isFlagged ? "Time expired" : isActive ? "Tap after your move" : `Player ${player + 1}`}
        </span>
      </button>
    );
  }

  const clockRender = (
    <div style={
      isLandscapeMode
        ? {
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            width: "100vw",
            height: "100vh",
            background: "var(--border)",
            display: "flex",
            flexDirection: "row",
            gap: 4,
            overflow: "hidden"
          }
        : {
            display: "flex",
            flexDirection: layoutOrientation === "horizontal" ? "row" : "column",
            minHeight: 380,
            background: "var(--border)",
            gap: 3,
            overflow: "hidden"
          }
    }>
      <Panel player={0} />
      <Panel player={1} />

      {/* Floating Center Pause/Resume trigger in Landscape Fullscreen */}
      {isLandscapeMode && (
        <button
          onClick={active !== null ? pause : resume}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 100000,
            background: "var(--bg-card)",
            border: "2px solid var(--border)",
            borderRadius: "50%",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            color: "var(--text-primary)"
          }}
        >
          {active !== null ? (
            <span style={{ fontSize: 18 }}>⏸</span>
          ) : (
            <span style={{ fontSize: 18 }}>▶</span>
          )}
        </button>
      )}

      {/* Fullscreen Settings/Menu Overlay when Paused or Finished in Landscape */}
      {isLandscapeMode && (active === null || flagged !== null) && (
        <div style={{
          position: "fixed",
          inset: 0,
          zIndex: 100001,
          background: "rgba(10, 10, 10, 0.94)",
          backdropFilter: "blur(4px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          overflowY: "auto"
        }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
            {flagged !== null ? "Time Expired" : "Game Paused"}
          </h3>
          
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", maxWidth: "90%", marginBottom: 16 }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.secs, p.inc, p.mode)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, padding: "5px 10px",
                  border: "2px solid var(--border)", borderRadius: 4,
                  background: (baseTime === p.secs && incrementSecs === p.inc && timingMode === p.mode) ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                  color: (baseTime === p.secs && incrementSecs === p.inc && timingMode === p.mode) ? "#000000" : "var(--text-primary)",
                  cursor: "pointer"
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            {flagged === null && (
              <button
                onClick={resume}
                style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 24px", border: "none", borderRadius: 6, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer" }}
              >
                RESUME
              </button>
            )}
            <button
              onClick={reset}
              style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 24px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer" }}
            >
              RESET
            </button>
            <button
              onClick={() => setForcePortrait(true)}
              style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "8px 16px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--bg-surface)", color: "var(--text-muted)", cursor: "pointer" }}
            >
              EXIT FULLSCREEN
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ClockLayout
      clock={clock}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Preset Buttons */}
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Presets</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p.secs, p.inc, p.mode)}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "7px 16px",
                    border: "2px solid var(--border)",
                    background: (baseTime === p.secs && incrementSecs === p.inc && timingMode === p.mode) ? "var(--text-primary)" : "var(--bg-surface)",
                    color: (baseTime === p.secs && incrementSecs === p.inc && timingMode === p.mode) ? "var(--bg-base)" : "var(--text-primary)",
                    cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)"
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Settings row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Base Mins</span>
              <input
                type="number" min={1} max={180} value={Math.floor(baseTime / 60)}
                onChange={(e) => applyCustomTime(Number(e.target.value) || 5, incrementSecs, timingMode)}
                style={{ width: 70, height: 36, fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4 }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Mode</span>
              <select
                value={timingMode}
                onChange={(e) => applyCustomTime(baseTime / 60, incrementSecs, e.target.value)}
                style={{ height: 36, fontFamily: "var(--font-ui)", fontSize: 13, border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4, padding: "0 8px" }}
              >
                <option value="sudden">Sudden Death</option>
                <option value="increment">Fischer Increment</option>
                <option value="delay">Simple Delay</option>
              </select>
            </div>
            {timingMode !== "sudden" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Secs</span>
                <input
                  type="number" min={0} max={60} value={incrementSecs}
                  onChange={(e) => applyCustomTime(baseTime / 60, Number(e.target.value) || 0, timingMode)}
                  style={{ width: 60, height: 36, fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700, textAlign: "center", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4 }}
                />
              </div>
            )}
          </div>

          {/* Display & Layout Controls */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Split Layout</span>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { value: "vertical", label: "Top/Bottom" },
                  { value: "horizontal", label: "Left/Right" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLayoutOrientation(opt.value as any)}
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "5px 12px",
                      border: "2px solid var(--border)", borderRadius: 4,
                      background: layoutOrientation === opt.value ? "var(--text-primary)" : "var(--bg-surface)",
                      color: layoutOrientation === opt.value ? "var(--bg-base)" : "var(--text-primary)",
                      cursor: "pointer"
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>Text Direction</span>
              <label style={{ display: "flex", alignItems: "center", gap: 6, height: 28, cursor: "pointer", fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)" }}>
                <input
                  type="checkbox" checked={rotateText}
                  onChange={(e) => setRotateText(e.target.checked)}
                  style={{ accentColor: "var(--section-clocks-accent)" }}
                />
                Opposite Facing (180° / 90°)
              </label>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: "flex", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
            {started && active !== null ? (
              <button onClick={pause} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 20px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
                PAUSE
              </button>
            ) : started && active === null && flagged === null ? (
              <button onClick={resume} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 20px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--section-clocks-accent)", color: "#000000", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
                RESUME
              </button>
            ) : null}
            <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, padding: "8px 20px", border: "2px solid var(--border)", borderRadius: 4, background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", boxShadow: "2px 2px 0 var(--shadow-color)" }}>
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
      {clockRender}
    </ClockLayout>
  );
}
