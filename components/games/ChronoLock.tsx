"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT      = "#F0A830";
const ACCENT_GLOW = "rgba(240,168,48,0.35)";
const BLUE        = "#4B8EF1";
const RED         = "#E87C7C";
const GREEN       = "#52C4A0";
const LS_KEY      = "chrono-lock-v2";
const LS_MODE_KEY = "chrono-lock-mode";

const PHASES = [
  { key: "hour",   label: "HOUR",        max: 23,  intervalMs: 680,  pad: 2 },
  { key: "minute", label: "MINUTE",      max: 59,  intervalMs: 112,  pad: 2 },
  { key: "second", label: "SECOND",      max: 59,  intervalMs: 56,   pad: 2 },
  { key: "ms",     label: "MILLISECOND", max: 999, intervalMs: null, pad: 3 },
] as const;

type Badge = "bronze" | "silver" | "gold" | "platinum";

const BADGE_META: Record<Badge, { emoji: string; label: string; color: string; desc: string }> = {
  bronze:   { emoji: "🥉", label: "Bronze",   color: "#CD7F32", desc: "Hour frozen. Build on this tomorrow." },
  silver:   { emoji: "🥈", label: "Silver",   color: "#B8B8C8", desc: "Hour and minute locked. Half the clock is yours." },
  gold:     { emoji: "🥇", label: "Gold",     color: "#FFD700", desc: "Three units down. Platinum is one press away." },
  platinum: { emoji: "💎", label: "Platinum", color: "#C8D8FF", desc: "Perfect. Every unit frozen at exactly the right moment." },
};

// ─── Target helpers ───────────────────────────────────────────────────────────

type Target = { hour: number; minute: number; second: number; ms: number };

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDailyTarget(): Target {
  const key = `chrono-${todayKey()}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h  = Math.imul(h, 16777619) >>> 0;
  }
  const r1 = (h  * 1664525 + 1013904223) >>> 0;
  const r2 = (r1 * 1664525 + 1013904223) >>> 0;
  const r3 = (r2 * 1664525 + 1013904223) >>> 0;
  const r4 = (r3 * 1664525 + 1013904223) >>> 0;
  return { hour: r1 % 24, minute: r2 % 60, second: r3 % 60, ms: r4 % 1000 };
}

function getRandomTarget(): Target {
  return {
    hour:   Math.floor(Math.random() * 24),
    minute: Math.floor(Math.random() * 60),
    second: Math.floor(Math.random() * 60),
    ms:     Math.floor(Math.random() * 1000),
  };
}

// ─── LocalStorage ─────────────────────────────────────────────────────────────

type DayResult = {
  date:   string;
  badge:  Badge | "failed";
  frozen: (number | null)[];
  target: Target;
};

type SavedData = {
  streak:        number;
  longestStreak: number;
  playedKey:     string;
  todayResult:   DayResult | null;
  history:       DayResult[];
};

const EMPTY: SavedData = {
  streak: 0, longestStreak: 0, playedKey: "", todayResult: null, history: [],
};

function loadData(): SavedData {
  try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "null") ?? EMPTY; }
  catch { return EMPTY; }
}
function saveData(d: SavedData) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {}
}
function loadMode(): "daily" | "training" {
  try {
    const m = localStorage.getItem(LS_MODE_KEY);
    return m === "training" ? "training" : "daily";
  } catch { return "daily"; }
}
function saveMode(m: "daily" | "training") {
  try { localStorage.setItem(LS_MODE_KEY, m); } catch {}
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function p(n: number, digits: number) { return String(n).padStart(digits, "0"); }

function msCircularDiff(a: number, b: number) {
  const d = Math.abs(a - b);
  return Math.min(d, 1000 - d);
}

function isCorrect(phaseIdx: number, frozen: number, tgt: number): boolean {
  return phaseIdx === 3 ? msCircularDiff(frozen, tgt) <= 20 : frozen === tgt;
}

// ─── Ad slot ─────────────────────────────────────────────────────────────────

function AdSlot({ height = 64, className = "" }: { height?: number; className?: string }) {
  return (
    <div
      className={`w-full rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-0.5 ${className}`}
      style={{ height, background: "var(--bg-surface)" }}
    >
      <span className="font-sans text-[8px] font-semibold text-text-faint uppercase tracking-[0.22em]">
        Advertisement
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

type GameState = "idle" | "playing" | "done" | "failed";
type Mode      = "daily" | "training";

export default function ChronoLock() {
  // ── Mode + hydration ──────────────────────────────────────────────────────
  const [mode,      setModeState] = useState<Mode>("daily");
  const [saved,     setSaved]     = useState<SavedData>(EMPTY);
  const [hydrated,  setHydrated]  = useState(false);

  useEffect(() => {
    setSaved(loadData());
    setModeState(loadMode());
    setHydrated(true);
  }, []);

  const switchMode = (m: Mode) => {
    saveMode(m);
    setModeState(m);
    resetGame(m);
  };

  // ── Target — mutable ref for animation-closure correctness ───────────────
  const currentTargetRef = useRef<Target>(getDailyTarget());
  const [targetDisplay, setTargetDisplay] = useState<Target>(() => currentTargetRef.current);

  // ── Game state ────────────────────────────────────────────────────────────
  const [gameState,   setGameState]   = useState<GameState>("idle");
  const [phaseIdx,    setPhaseIdx]    = useState(0);
  const [displayVals, setDisplayVals] = useState([0, 0, 0, 0]);
  const [frozenVals,  setFrozenVals]  = useState<(number | null)[]>([null, null, null, null]);
  const [flashResult, setFlashResult] = useState<"correct" | "wrong" | null>(null);
  const [copied,      setCopied]      = useState(false);

  // In-session training result (not persisted)
  const [trainingResult, setTrainingResult] = useState<{
    badge: Badge | "failed";
    frozen: (number | null)[];
  } | null>(null);

  // Refs for animation closures (never go stale)
  const gameStateRef  = useRef<GameState>("idle");
  const phaseIdxRef   = useRef(0);
  const displayRef    = useRef([0, 0, 0, 0]);
  const frozenRef     = useRef<(number | null)[]>([null, null, null, null]);
  const intervalRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef        = useRef(0);
  const msOriginRef   = useRef(0);

  // ── Derived ───────────────────────────────────────────────────────────────
  const alreadyPlayed = hydrated && mode === "daily" && saved.playedKey === todayKey();
  const todayResult   = saved.todayResult;
  const showResults   = gameState === "done" || gameState === "failed";

  const tgt = currentTargetRef.current;
  const tgtArr = [tgt.hour, tgt.minute, tgt.second, tgt.ms];

  // ── Animation ─────────────────────────────────────────────────────────────

  const stopAnim = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    cancelAnimationFrame(rafRef.current);
  }, []);

  const startPhase = useCallback((idx: number) => {
    stopAnim();
    phaseIdxRef.current = idx;
    setPhaseIdx(idx);

    if (idx < 3) {
      const phase = PHASES[idx];
      let cur = 0;
      intervalRef.current = setInterval(() => {
        cur = (cur + 1) % (phase.max + 1);
        displayRef.current = displayRef.current.map((v, i) => (i === idx ? cur : v));
        setDisplayVals([...displayRef.current]);
      }, phase.intervalMs!);
    } else {
      msOriginRef.current = performance.now();
      const tick = () => {
        if (gameStateRef.current !== "playing") return;
        const ms = Math.floor((performance.now() - msOriginRef.current) % 1000);
        displayRef.current = [...displayRef.current.slice(0, 3), ms];
        setDisplayVals([...displayRef.current]);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [stopAnim]);

  useEffect(() => () => stopAnim(), [stopAnim]);

  // ── Game reset ────────────────────────────────────────────────────────────

  const resetGame = useCallback((nextMode?: Mode) => {
    stopAnim();
    const m = nextMode ?? mode;

    // Update target based on mode
    if (m === "training") {
      const t = getRandomTarget();
      currentTargetRef.current = t;
      setTargetDisplay(t);
    } else {
      const t = getDailyTarget();
      currentTargetRef.current = t;
      setTargetDisplay(t);
    }

    const fresh: (number | null)[] = [null, null, null, null];
    frozenRef.current  = fresh;
    displayRef.current = [0, 0, 0, 0];
    setFrozenVals(fresh);
    setDisplayVals([0, 0, 0, 0]);
    setFlashResult(null);
    setPhaseIdx(0);
    phaseIdxRef.current = 0;
    gameStateRef.current = "idle";
    setGameState("idle");
    setTrainingResult(null);
  }, [stopAnim, mode]);

  // ── Start / finish game ───────────────────────────────────────────────────

  const startGame = () => {
    if (alreadyPlayed) return;

    // If training, generate a fresh random target for this run
    if (mode === "training") {
      const t = getRandomTarget();
      currentTargetRef.current = t;
      setTargetDisplay(t);
    }

    const fresh: (number | null)[] = [null, null, null, null];
    frozenRef.current  = fresh;
    displayRef.current = [0, 0, 0, 0];
    setFrozenVals(fresh);
    setDisplayVals([0, 0, 0, 0]);
    setFlashResult(null);
    setTrainingResult(null);
    gameStateRef.current = "playing";
    setGameState("playing");
    startPhase(0);
  };

  const finishGame = useCallback((result: "done" | "failed", frozen: (number | null)[]) => {
    stopAnim();
    gameStateRef.current = result;
    setGameState(result);

    // Tally consecutive correct freezes
    let correctCount = 0;
    for (let i = 0; i < 4; i++) {
      const fv = frozen[i];
      if (fv === null) break;
      if (isCorrect(i, fv, currentTargetRef.current && [
        currentTargetRef.current.hour,
        currentTargetRef.current.minute,
        currentTargetRef.current.second,
        currentTargetRef.current.ms,
      ][i])) correctCount++;
      else break;
    }

    const badgeMap: Badge[] = ["bronze", "silver", "gold", "platinum"];
    const badge: Badge | "failed" = correctCount > 0 ? badgeMap[correctCount - 1] : "failed";
    const missedHour = correctCount === 0;

    if (mode === "training") {
      // Training: show result in-session only, no localStorage
      setTrainingResult({ badge, frozen });
      return;
    }

    // Daily: persist
    const dayResult: DayResult = {
      date:   todayKey(),
      badge,
      frozen,
      target: currentTargetRef.current,
    };

    const current = loadData();
    const newStreak  = missedHour ? 0 : current.streak + 1;
    const newHistory = missedHour ? [] : [dayResult, ...current.history].slice(0, 60);

    const newData: SavedData = {
      streak:        newStreak,
      longestStreak: Math.max(current.longestStreak, newStreak),
      playedKey:     todayKey(),
      todayResult:   dayResult,
      history:       newHistory,
    };
    saveData(newData);
    setSaved(newData);
  }, [stopAnim, mode]);

  const handleFreeze = useCallback(() => {
    if (gameStateRef.current !== "playing") return;

    const idx    = phaseIdxRef.current;
    const frozen = displayRef.current[idx];
    const tgtVal = [
      currentTargetRef.current.hour,
      currentTargetRef.current.minute,
      currentTargetRef.current.second,
      currentTargetRef.current.ms,
    ][idx];
    const ok = isCorrect(idx, frozen, tgtVal);

    const newFrozen = [...frozenRef.current];
    newFrozen[idx]  = frozen;
    frozenRef.current = newFrozen;
    setFrozenVals([...newFrozen]);
    stopAnim();
    setFlashResult(ok ? "correct" : "wrong");

    setTimeout(() => {
      setFlashResult(null);
      if (!ok) {
        finishGame("failed", newFrozen);
      } else if (idx === 3) {
        finishGame("done", newFrozen);
      } else {
        gameStateRef.current = "playing";
        startPhase(idx + 1);
      }
    }, 820);
  }, [stopAnim, finishGame, startPhase]);

  // Space-bar shortcut
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (gameStateRef.current === "playing" && !flashResult) handleFreeze();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleFreeze, flashResult]);

  // ── Share ─────────────────────────────────────────────────────────────────

  const handleShare = (isTrainingShare = false) => {
    const r = isTrainingShare ? trainingResult : saved.todayResult;
    if (!r) return;
    const activeTarget = currentTargetRef.current;
    const badgeLine = r.badge !== "failed"
      ? `${BADGE_META[r.badge].emoji} ${BADGE_META[r.badge].label} Freeze${isTrainingShare ? " (Training)" : ""}`
      : "💀 Collection Lost";
    const phaseLines = PHASES.map((ph, i) => {
      const fv = r.frozen[i];
      if (fv === null) return `⬜ ${ph.key}`;
      const tgtVal = [activeTarget.hour, activeTarget.minute, activeTarget.second, activeTarget.ms][i];
      const ok = isCorrect(i, fv, tgtVal);
      return `${ok ? "🟩" : "🟥"} ${ph.key}: ${p(fv, ph.pad)} (target ${p(tgtVal, ph.pad)})`;
    });
    const text = [
      `⏱️ Chrono Lock${isTrainingShare ? " [Training]" : ""} | ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      "",
      ...phaseLines,
      "",
      badgeLine,
      ...(!isTrainingShare ? [`🔥 Streak: ${saved.streak}`] : []),
      "",
      "thegodoftime.com/games/chrono-lock",
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  const getPhaseStatus = (i: number): "pending" | "active" | "correct" | "wrong" => {
    if (gameState === "idle") return "pending";
    const fv = frozenVals[i];
    if (fv !== null) return isCorrect(i, fv, tgtArr[i]) ? "correct" : "wrong";
    if (i === phaseIdx && gameState === "playing") return "active";
    return "pending";
  };

  const getDisplay = (i: number): string => {
    const fv = frozenVals[i];
    if (fv !== null) return p(fv, PHASES[i].pad);
    if (i === phaseIdx && gameState === "playing") return p(displayVals[i], PHASES[i].pad);
    return PHASES[i].pad === 2 ? "--" : "---";
  };

  // Active result for showing results panel (daily or training)
  const activeResult = mode === "training" ? trainingResult : todayResult;
  const isTrainingMode = mode === "training";

  // Status message
  let statusMsg = "";
  if (gameState === "idle") {
    if (alreadyPlayed) statusMsg = "Today's freeze is done. Try Training to keep practicing.";
    else if (isTrainingMode) statusMsg = "Training mode — no streak impact. Press Play to begin.";
    else statusMsg = "One shot per day. Miss the hour and you lose everything.";
  } else if (gameState === "playing") {
    if (flashResult === "correct") statusMsg = "Locked. Next unit...";
    else if (flashResult === "wrong") statusMsg = `Missed. Target was ${p(tgtArr[phaseIdx], PHASES[phaseIdx].pad)}.`;
    else statusMsg = `Press FREEZE when ${PHASES[phaseIdx].key} shows ${p(tgtArr[phaseIdx], PHASES[phaseIdx].pad)}`;
  } else if (gameState === "done") {
    statusMsg = isTrainingMode ? "Perfect training run! All four units frozen." : "Perfect freeze. Platinum achieved.";
  } else if (gameState === "failed") {
    const missedHour = !frozenVals[0] || !isCorrect(0, frozenVals[0]!, tgtArr[0]);
    if (missedHour && !isTrainingMode) statusMsg = "Missed the hour. Streak gone. Collection wiped.";
    else if (missedHour) statusMsg = "Missed the hour. No penalty in training — press Play Again.";
    else statusMsg = isTrainingMode ? "Good effort. Press Play Again to try a new target." : "So close. Come back tomorrow.";
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-border" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          {isTrainingMode ? (
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full font-sans text-[10px] font-bold uppercase tracking-wider border"
                style={{
                  background: `color-mix(in srgb, ${GREEN} 12%, transparent)`,
                  borderColor: `color-mix(in srgb, ${GREEN} 30%, transparent)`,
                  color: GREEN,
                }}
              >
                Training Mode
              </span>
              <span className="font-sans text-[10px] text-text-faint">
                Unlimited practice — no streak impact
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-text-faint">Streak</span>
                <span className="font-mono text-xl font-bold tabular-nums text-text-primary">{saved.streak}</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2">
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-text-faint">Best</span>
                <span className="font-mono text-sm font-bold tabular-nums" style={{ color: ACCENT }}>{saved.longestStreak}</span>
              </div>
            </div>
          )}
          <span className="font-mono text-[10px] text-text-faint tabular-nums">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-20 max-w-xl mx-auto w-full">

        {/* Mode toggle */}
        <div className="w-full mb-6 flex items-center gap-1 p-1 rounded-xl border border-border" style={{ background: "var(--bg-card)" }}>
          {(["daily", "training"] as const).map(m => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 h-9 rounded-lg font-sans font-semibold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer select-none"
              style={
                mode === m
                  ? {
                      background: m === "training" ? GREEN : ACCENT,
                      color: "#06060A",
                      boxShadow: m === "training"
                        ? "2px 2px 0px 0px rgba(82,196,160,0.3)"
                        : `2px 2px 0px 0px ${ACCENT_GLOW}`,
                    }
                  : {
                      background: "transparent",
                      color: "var(--text-faint)",
                    }
              }
            >
              {m === "daily" ? "Daily Challenge" : "Training Mode"}
            </button>
          ))}
        </div>

        {/* Title */}
        <div className="mb-5 text-center">
          <h1
            className="font-display font-light italic text-text-primary leading-tight mb-1"
            style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", letterSpacing: "-0.025em" }}
          >
            Chrono Lock
          </h1>
          <p className="font-sans text-sm text-text-muted">
            {isTrainingMode
              ? "Practice freezing — new random target each run."
              : "Freeze the clock at today's target — unit by unit."}
          </p>
        </div>

        {/* Target display */}
        <div
          className="w-full mb-3 px-5 py-3 rounded-lg border flex items-center justify-between gap-4"
          style={{
            background: "var(--bg-card)",
            borderColor: isTrainingMode
              ? `color-mix(in srgb, ${GREEN} 28%, var(--border))`
              : "var(--border)",
          }}
        >
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-text-faint">
            {isTrainingMode ? "This run's target" : "Today's target"}
          </span>
          <span
            className="font-mono text-[1.05rem] font-bold tabular-nums tracking-wider"
            style={{ color: isTrainingMode ? GREEN : ACCENT }}
          >
            {p(targetDisplay.hour, 2)} : {p(targetDisplay.minute, 2)} : {p(targetDisplay.second, 2)} : {p(targetDisplay.ms, 3)}
          </span>
        </div>

        {/* ── Ad slot 1 — between target and clock ─────────────────────── */}
        <AdSlot height={56} className="mb-3" />

        {/* ── Clock display ────────────────────────────────────────────── */}
        <div
          className="w-full mb-3 rounded-xl border border-border overflow-hidden"
          style={{ background: "var(--bg-card)" }}
        >
          <div className="grid grid-cols-4 divide-x divide-border">
            {PHASES.map((ph, i) => {
              const status         = getPhaseStatus(i);
              const val            = getDisplay(i);
              const isActive       = status === "active";
              const isFlashCorrect = isActive && flashResult === "correct";
              const isFlashWrong   = isActive && flashResult === "wrong";
              const modeAccent     = isTrainingMode ? GREEN : ACCENT;

              const digitColor =
                status === "correct" ? BLUE   :
                status === "wrong"   ? RED    :
                isFlashCorrect       ? BLUE   :
                isFlashWrong         ? RED    :
                isActive             ? modeAccent :
                                       "var(--text-faint)";

              const cellBg = isActive
                ? `color-mix(in srgb, ${modeAccent} 6%, var(--bg-card))`
                : "var(--bg-card)";

              return (
                <div
                  key={ph.key}
                  className="flex flex-col items-center justify-center py-7 transition-colors duration-150"
                  style={{ background: cellBg }}
                >
                  <span
                    className="font-mono font-bold tabular-nums leading-none transition-colors duration-100"
                    style={{
                      fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
                      color: digitColor,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {val}
                  </span>
                  <span className="mt-2 font-sans text-[8px] font-semibold uppercase tracking-[0.18em] text-text-faint">
                    {ph.key}
                  </span>
                  <span
                    className="mt-2.5 block w-1.5 h-1.5 rounded-full transition-all duration-200"
                    style={{
                      background:
                        isActive             ? modeAccent :
                        status === "correct" ? BLUE :
                        status === "wrong"   ? RED :
                                              "transparent",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Status text */}
        <p className="font-sans text-xs text-text-muted text-center min-h-[18px] mb-5">
          {statusMsg}
        </p>

        {/* ── Action buttons ────────────────────────────────────────────── */}
        {gameState === "playing" && !flashResult && (
          <button
            onClick={handleFreeze}
            className="w-full h-[72px] rounded-xl font-sans font-black text-xl uppercase tracking-[0.18em] cursor-pointer transition-transform active:scale-[0.97] active:translate-y-0.5 select-none"
            style={{
              background: isTrainingMode ? GREEN : ACCENT,
              color: "#06060A",
              boxShadow: isTrainingMode
                ? "4px 4px 0px 0px rgba(82,196,160,0.35)"
                : `4px 4px 0px 0px ${ACCENT_GLOW}`,
              animation: isTrainingMode ? "cl-pulse-green 1.8s ease-in-out infinite" : "cl-pulse 1.8s ease-in-out infinite",
            }}
            aria-label="Freeze current clock unit"
          >
            ⏸ FREEZE
          </button>
        )}

        {gameState === "playing" && flashResult && (
          <div
            className="w-full h-[72px] rounded-xl font-sans font-bold text-xl uppercase tracking-[0.12em] flex items-center justify-center select-none"
            style={{
              background: flashResult === "correct"
                ? `color-mix(in srgb, ${BLUE} 12%, var(--bg-card))`
                : `color-mix(in srgb, ${RED} 12%, var(--bg-card))`,
              border: `2px solid ${flashResult === "correct" ? BLUE : RED}`,
              color:  flashResult === "correct" ? BLUE : RED,
            }}
          >
            {flashResult === "correct" ? "✓ LOCKED" : "✗ MISSED"}
          </div>
        )}

        {gameState === "idle" && !alreadyPlayed && (
          <button
            onClick={startGame}
            className="w-full h-16 rounded-xl font-sans font-bold text-base uppercase tracking-[0.12em] cursor-pointer select-none transition-all active:scale-[0.98]"
            style={{
              background:  isTrainingMode ? GREEN : ACCENT,
              color:       "#06060A",
              boxShadow:   isTrainingMode
                ? "4px 4px 0px 0px rgba(82,196,160,0.35)"
                : `4px 4px 0px 0px ${ACCENT_GLOW}`,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isTrainingMode
                ? "6px 6px 0px 0px rgba(82,196,160,0.5)"
                : `6px 6px 0px 0px ${ACCENT_GLOW}`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = isTrainingMode
                ? "4px 4px 0px 0px rgba(82,196,160,0.35)"
                : `4px 4px 0px 0px ${ACCENT_GLOW}`;
            }}
          >
            {isTrainingMode ? "Start Training" : "Start Freeze"}
          </button>
        )}

        {/* Already played — daily only */}
        {gameState === "idle" && alreadyPlayed && todayResult && (
          <div
            className="w-full rounded-xl border border-border p-6 text-center"
            style={{ background: "var(--bg-card)" }}
          >
            {todayResult.badge !== "failed" ? (
              <>
                <div className="text-4xl mb-2">{BADGE_META[todayResult.badge].emoji}</div>
                <p className="font-display font-light italic text-xl text-text-primary mb-1">
                  {BADGE_META[todayResult.badge].label} — today's freeze locked in.
                </p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">💀</div>
                <p className="font-display font-light italic text-xl text-text-muted mb-1">
                  Missed the hour today.
                </p>
              </>
            )}
            <p className="font-sans text-xs text-text-faint mb-4">
              New target unlocks at midnight.
            </p>
            <div className="flex gap-2 justify-center">
              {todayResult.badge !== "failed" && (
                <button
                  onClick={() => handleShare(false)}
                  className="h-9 px-5 rounded-lg border border-border font-sans font-semibold text-xs text-text-primary cursor-pointer transition-all hover:border-text-muted"
                  style={{ background: "var(--bg-surface)", boxShadow: "2px 2px 0px 0px var(--border)" }}
                >
                  {copied ? "Copied ✓" : "Share result →"}
                </button>
              )}
              <button
                onClick={() => switchMode("training")}
                className="h-9 px-5 rounded-lg border border-border font-sans font-semibold text-xs cursor-pointer transition-all hover:border-text-muted"
                style={{ background: "var(--bg-surface)", color: GREEN, boxShadow: "2px 2px 0px 0px var(--border)" }}
              >
                Switch to Training →
              </button>
            </div>
          </div>
        )}

        {/* ── Results panel ─────────────────────────────────────────────── */}
        {showResults && (
          <div className="w-full mt-2 flex flex-col gap-3">

            {/* Badge card */}
            <div
              className="w-full rounded-xl border border-border p-6 text-center"
              style={{ background: "var(--bg-card)" }}
            >
              {activeResult && activeResult.badge !== "failed" ? (
                <>
                  <div className="text-5xl mb-3">{BADGE_META[activeResult.badge].emoji}</div>
                  <p
                    className="font-display font-light italic text-2xl mb-1"
                    style={{ color: BADGE_META[activeResult.badge].color }}
                  >
                    {BADGE_META[activeResult.badge].label} Freeze
                    {isTrainingMode && (
                      <span className="font-sans font-normal text-base text-text-faint ml-2">(Training)</span>
                    )}
                  </p>
                  <p className="font-sans text-xs text-text-muted">
                    {BADGE_META[activeResult.badge].desc}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-3">💀</div>
                  <p className="font-display font-light italic text-2xl text-text-muted mb-1">
                    {isTrainingMode ? "Missed. Try Again." : "Collection Lost"}
                  </p>
                  <p className="font-sans text-xs text-text-faint">
                    {isTrainingMode
                      ? "No penalty in training mode. Press Play Again for a new target."
                      : "Missed the hour. Streak reset. History wiped. Start fresh tomorrow."}
                  </p>
                </>
              )}

              {/* Phase breakdown */}
              <div className="mt-5 grid grid-cols-4 gap-2">
                {PHASES.map((ph, i) => {
                  const fv  = frozenVals[i];
                  const tgtV = tgtArr[i];
                  const ok  = fv !== null && isCorrect(i, fv, tgtV);
                  return (
                    <div
                      key={ph.key}
                      className="flex flex-col items-center gap-1 py-3 rounded-lg"
                      style={{
                        background: fv === null
                          ? "var(--bg-surface)"
                          : ok
                          ? `color-mix(in srgb, ${BLUE} 10%, var(--bg-surface))`
                          : `color-mix(in srgb, ${RED} 10%, var(--bg-surface))`,
                      }}
                    >
                      <span className="font-sans text-[8px] font-semibold uppercase tracking-widest text-text-faint">
                        {ph.key}
                      </span>
                      <span
                        className="font-mono text-sm font-bold tabular-nums leading-none"
                        style={{ color: fv === null ? "var(--text-faint)" : ok ? BLUE : RED }}
                      >
                        {fv !== null ? p(fv, ph.pad) : "—"}
                      </span>
                      <span className="font-mono text-[8px] text-text-faint tabular-nums">
                        /{p(tgtV, ph.pad)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Ad slot 2 — between badge card and actions ───────────── */}
            <AdSlot height={80} />

            {/* Action buttons after result */}
            {isTrainingMode ? (
              <button
                onClick={() => {
                  const t = getRandomTarget();
                  currentTargetRef.current = t;
                  setTargetDisplay(t);
                  const fresh: (number | null)[] = [null, null, null, null];
                  frozenRef.current  = fresh;
                  displayRef.current = [0, 0, 0, 0];
                  setFrozenVals(fresh);
                  setDisplayVals([0, 0, 0, 0]);
                  setFlashResult(null);
                  setTrainingResult(null);
                  setPhaseIdx(0);
                  phaseIdxRef.current = 0;
                  gameStateRef.current = "playing";
                  setGameState("playing");
                  startPhase(0);
                }}
                className="w-full h-12 rounded-xl font-sans font-bold text-sm uppercase tracking-wider cursor-pointer select-none transition-all active:scale-[0.98]"
                style={{
                  background:  GREEN,
                  color:       "#06060A",
                  boxShadow:   "3px 3px 0px 0px rgba(82,196,160,0.3)",
                }}
              >
                Play Again — New Target
              </button>
            ) : (
              activeResult && activeResult.badge !== "failed" && (
                <button
                  onClick={() => handleShare(false)}
                  className="w-full h-11 rounded-lg border border-border font-sans font-semibold text-sm text-text-primary cursor-pointer transition-all hover:border-text-muted"
                  style={{ background: "var(--bg-card)", boxShadow: "3px 3px 0px 0px var(--border)" }}
                >
                  {copied ? "Copied to clipboard ✓" : "Share your result →"}
                </button>
              )
            )}

            {/* Training: share result even in training */}
            {isTrainingMode && activeResult && activeResult.badge !== "failed" && (
              <button
                onClick={() => handleShare(true)}
                className="w-full h-10 rounded-lg border border-border font-sans text-xs font-semibold text-text-muted cursor-pointer transition-all hover:border-text-muted"
                style={{ background: "var(--bg-surface)" }}
              >
                {copied ? "Copied ✓" : "Share training result →"}
              </button>
            )}
          </div>
        )}

        {/* ── Daily collection history ──────────────────────────────────── */}
        {!isTrainingMode && saved.history.length > 0 && (
          <div className="w-full mt-8">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-text-faint mb-3">
              Collection
            </p>
            <div className="flex flex-wrap gap-2">
              {saved.history.map((d, i) => {
                const b = d.badge;
                return (
                  <div
                    key={i}
                    title={`${d.date} — ${b !== "failed" ? BADGE_META[b].label : "Failed"}`}
                    className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-lg border border-border cursor-default"
                    style={{ background: "var(--bg-card)" }}
                  >
                    <span className="text-lg leading-none">
                      {b !== "failed" ? BADGE_META[b].emoji : "💀"}
                    </span>
                    <span className="font-mono text-[7px] text-text-faint tabular-nums">
                      {d.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Ad slot 3 — below collection, above How to Play ──────────── */}
        <AdSlot height={100} className="mt-8" />

        {/* ── How to Play ──────────────────────────────────────────────── */}
        {(gameState === "idle" || showResults) && (
          <div className="w-full mt-8 border-t border-border pt-8">
            <p
              className="font-display font-light italic text-text-primary mb-6 leading-tight"
              style={{ fontSize: "clamp(1.25rem, 3vw, 1.7rem)", letterSpacing: "-0.015em" }}
            >
              {isTrainingMode ? "Training Tips" : "How to Play"}
            </p>

            {isTrainingMode ? (
              <div className="flex flex-col gap-4">
                {[
                  "Each training run uses a random target — different every time you press Play Again.",
                  "Use training to learn the timing for each phase. Hour is slow (680ms per value). Minute is fast (112ms). Second is very fast (56ms).",
                  "Milliseconds use real elapsed time — it cycles 0-999 continuously. You have a ±20ms window. Press by feel, not by sight.",
                  "Training results don't affect your streak or badge collection. Use it to build reflexes for the daily challenge.",
                  "Switch to Daily Challenge to put your streak on the line. One shot. Same target as every other player.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-[9px] font-bold text-text-faint mt-0.5 flex-shrink-0 w-4">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-sans text-sm text-text-muted leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {[
                  "The target time is shown before you start. Every player gets the same target today.",
                  "Press Start. The hour cycles slowly. Press FREEZE the moment it shows your target hour.",
                  "Get it right and the minute starts — faster. Then second (faster still). Then milliseconds.",
                  "Miss the hour? Streak resets and your entire badge collection is wiped. Any other miss earns you the badge you've earned so far.",
                  "Badges: 🥉 hour · 🥈 +minute · 🥇 +second · 💎 all four. Space bar also triggers FREEZE.",
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <span className="font-mono text-[9px] font-bold text-text-faint mt-0.5 flex-shrink-0 w-4">{String(i + 1).padStart(2, "0")}</span>
                    <p className="font-sans text-sm text-text-muted leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Ad slot 4 — below How to Play ────────────────────────────── */}
        <AdSlot height={90} className="mt-10" />

      </div>

      <style>{`
        @keyframes cl-pulse {
          0%, 100% { box-shadow: 4px 4px 0px 0px ${ACCENT_GLOW}; }
          50%       { box-shadow: 4px 4px 0px 0px ${ACCENT_GLOW}, 0 0 24px rgba(240,168,48,0.18); }
        }
        @keyframes cl-pulse-green {
          0%, 100% { box-shadow: 4px 4px 0px 0px rgba(82,196,160,0.35); }
          50%       { box-shadow: 4px 4px 0px 0px rgba(82,196,160,0.35), 0 0 24px rgba(82,196,160,0.18); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="cl-pulse"], [style*="cl-pulse-green"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
