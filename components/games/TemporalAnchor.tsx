"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LetterEntry = { id: string; char: string; isWord: boolean; eliminated: boolean };
type GamePhase   = "idle" | "playing" | "won" | "lost";

type HistoricalWord = { word: string; clue: string; era: string; emoji: string };

type TAResult = {
  date: string; outcome: "won" | "lost"; word: string; emoji: string;
  finalStability: number; noiseEliminated: number; totalNoise: number;
};
type TASavedData = {
  streak: number; longestStreak: number; playedKey: string;
  todayResult: TAResult | null; history: TAResult[];
};

// ─── Word bank ────────────────────────────────────────────────────────────────

const WORD_BANK: HistoricalWord[] = [
  { word: "CLEOPATRA",    clue: "Queen of the Nile, last pharaoh of Egypt",                 era: "30 BCE",   emoji: "👑" },
  { word: "EINSTEIN",     clue: "Architect of the theory of relativity",                    era: "1905 CE",  emoji: "🧠" },
  { word: "PYRAMIDS",     clue: "Monumental tombs of the ancient pharaohs",                 era: "2560 BCE", emoji: "🔺" },
  { word: "NAPOLEON",     clue: "Emperor who reshaped the map of Europe",                   era: "1804 CE",  emoji: "⚔️" },
  { word: "SOCRATES",     clue: "Athenian philosopher who drank hemlock",                   era: "470 BCE",  emoji: "🏛️" },
  { word: "ARISTOTLE",    clue: "Tutor of Alexander the Great",                             era: "384 BCE",  emoji: "📜" },
  { word: "BEETHOVEN",    clue: "Composer who wrote symphonies while deaf",                 era: "1770 CE",  emoji: "🎼" },
  { word: "DARWIN",       clue: "Naturalist who proposed natural selection",                era: "1859 CE",  emoji: "🦎" },
  { word: "NEWTON",       clue: "Physicist whose insight fell from an apple tree",          era: "1687 CE",  emoji: "🍎" },
  { word: "COLUMBUS",     clue: "Navigator who sailed west and found a new world",          era: "1492 CE",  emoji: "⛵" },
  { word: "GALILEO",      clue: "Astronomer who defended heliocentrism",                    era: "1564 CE",  emoji: "🔭" },
  { word: "TESLA",        clue: "Inventor of alternating current",                          era: "1856 CE",  emoji: "⚡" },
  { word: "IPHONE",       clue: "Device that changed how humans communicate",               era: "2007 CE",  emoji: "📱" },
  { word: "INTERNET",     clue: "Network that connected the world",                         era: "1991 CE",  emoji: "🌐" },
  { word: "APOLLO",       clue: "NASA mission that first landed humans on the Moon",        era: "1969 CE",  emoji: "🚀" },
  { word: "TITANIC",      clue: "The unsinkable ship that sank on its maiden voyage",       era: "1912 CE",  emoji: "🚢" },
  { word: "STONEHENGE",   clue: "Neolithic ring of standing stones in England",             era: "3000 BCE", emoji: "🗿" },
  { word: "BABYLON",      clue: "Ancient city famous for its hanging gardens",              era: "2300 BCE", emoji: "🌿" },
  { word: "CAESAR",       clue: "Roman dictator betrayed on the Ides of March",             era: "100 BCE",  emoji: "🏛️" },
  { word: "ARCHIMEDES",   clue: "Greek inventor who ran naked shouting Eureka",             era: "287 BCE",  emoji: "🛁" },
  { word: "RENAISSANCE",  clue: "European cultural rebirth of arts and science",            era: "1300 CE",  emoji: "🎨" },
  { word: "MARATHON",     clue: "Ancient Greek battle whose name became a race",            era: "490 BCE",  emoji: "🏃" },
  { word: "SHAKESPEARE",  clue: "Bard of Avon, author of Hamlet and Macbeth",              era: "1564 CE",  emoji: "🎭" },
  { word: "COPERNICUS",   clue: "Astronomer who placed the Sun at the center",              era: "1473 CE",  emoji: "☀️" },
  { word: "MICHELANGELO", clue: "Renaissance genius who painted the Sistine Chapel",       era: "1475 CE",  emoji: "🖌️" },
  { word: "ALEXANDER",    clue: "Macedonian king who conquered most of the known world",    era: "356 BCE",  emoji: "🗡️" },
  { word: "SAMURAI",      clue: "Elite Japanese warrior class bound by Bushido",            era: "900 CE",   emoji: "⚔️" },
  { word: "GUTENBERG",    clue: "Inventor of the movable-type printing press",              era: "1440 CE",  emoji: "📰" },
  { word: "MAGELLAN",     clue: "Explorer who led the first circumnavigation of Earth",     era: "1480 CE",  emoji: "🌍" },
  { word: "HANNIBAL",     clue: "Carthaginian general who crossed the Alps with elephants", era: "247 BCE",  emoji: "🐘" },
  { word: "SPARTANS",     clue: "Warriors who held the pass at Thermopylae",               era: "480 BCE",  emoji: "🛡️" },
  { word: "CONFUCIUS",    clue: "Chinese philosopher whose teachings shaped Asia",          era: "551 BCE",  emoji: "☯️" },
  { word: "RAMESSES",     clue: "The greatest of all Egyptian pharaohs",                   era: "1303 BCE", emoji: "👑" },
  { word: "HADRIAN",      clue: "Roman emperor who built a wall across Britain",            era: "76 CE",    emoji: "🧱" },
  { word: "CRUSADES",     clue: "Medieval religious wars for the Holy Land",               era: "1096 CE",  emoji: "✝️" },
  { word: "PHARAOH",      clue: "Divine ruler of ancient Egypt",                           era: "3100 BCE", emoji: "🔱" },
  { word: "LEONIDAS",     clue: "Spartan king at the Battle of Thermopylae",               era: "540 BCE",  emoji: "🛡️" },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT      = "#C5F135";
const GREEN       = "#52C4A0";
const RED         = "#E87C7C";
const LS_KEY      = "temporal-anchor-v1";
const NOISE_COUNT = 7;
const WIN_SIZE    = 9;   // letters visible in track
const HALF        = 4;   // center index in window
const STAB_HIT    = 25;  // % lost per wrong drop

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDailyWord(): HistoricalWord {
  const key = `temporal-${todayKey()}`;
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return WORD_BANK[h % WORD_BANK.length];
}

function buildQueue(word: string): LetterEntry[] {
  const unique = [...new Set(word.split(""))];
  const noise  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    .split("").filter(c => !unique.includes(c))
    .sort(() => Math.random() - 0.5).slice(0, NOISE_COUNT);

  return [
    ...unique.map(c => ({ char: c, isWord: true })),
    ...noise.map(c =>  ({ char: c, isWord: false })),
  ]
    .sort(() => Math.random() - 0.5)
    .map((item, i) => ({ id: `${item.char}-${i}`, char: item.char, isWord: item.isWord, eliminated: false }));
}

function intervalMs(stab: number): number {
  if (stab >= 75) return 950;
  if (stab >= 50) return 650;
  if (stab >= 25) return 400;
  return 240;
}

// ─── LocalStorage ─────────────────────────────────────────────────────────────

const EMPTY: TASavedData = { streak: 0, longestStreak: 0, playedKey: "", todayResult: null, history: [] };
function load(): TASavedData { try { return JSON.parse(localStorage.getItem(LS_KEY) ?? "null") ?? EMPTY; } catch { return EMPTY; } }
function save(d: TASavedData) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch {} }

// ─── Ad slot ─────────────────────────────────────────────────────────────────

function AdSlot({ height = 64, className = "" }: { height?: number; className?: string }) {
  return (
    <div className={`w-full rounded-lg border border-dashed border-border flex items-center justify-center ${className}`}
         style={{ height, background: "var(--bg-surface)" }}>
      <span className="font-sans text-[8px] font-semibold text-text-faint uppercase tracking-[0.22em]">
        Advertisement
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TemporalAnchor() {
  const [hydrated, setHydrated] = useState(false);
  const [saved,    setSaved]    = useState<TASavedData>(EMPTY);

  useEffect(() => { setSaved(load()); setHydrated(true); }, []);

  const daily = useMemo(() => getDailyWord(), []);

  const [phase,        setPhase]        = useState<GamePhase>("idle");
  const [stability,    setStability]    = useState(100);
  const [queue,        setQueue]        = useState<LetterEntry[]>([]);
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [noiseElim,    setNoiseElim]    = useState(0);
  const [flash,        setFlash]        = useState<"good" | "fracture" | null>(null);
  const [copied,       setCopied]       = useState(false);

  const phaseRef     = useRef<GamePhase>("idle");
  const stabRef      = useRef(100);
  const queueRef     = useRef<LetterEntry[]>([]);
  const activeRef    = useRef(0);
  const noiseRef     = useRef(0);
  const intervalRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const alreadyPlayed = hydrated && saved.playedKey === todayKey();
  const uniqueLetters = useMemo(() => [...new Set(daily.word.split(""))], [daily]);

  // ── Interval ──────────────────────────────────────────────────────────────

  const stopInt = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const startInt = useCallback((stab: number) => {
    stopInt();
    intervalRef.current = setInterval(() => {
      if (phaseRef.current !== "playing") return;
      const next = (activeRef.current + 1) % queueRef.current.length;
      activeRef.current = next;
      setActiveIdx(next);
    }, intervalMs(stab));
  }, [stopInt]);

  useEffect(() => () => stopInt(), [stopInt]);

  // ── Save result ───────────────────────────────────────────────────────────

  const saveResult = useCallback((outcome: "won" | "lost", finalStab: number, ne: number) => {
    const result: TAResult = {
      date: todayKey(), outcome, word: daily.word, emoji: daily.emoji,
      finalStability: finalStab, noiseEliminated: ne, totalNoise: NOISE_COUNT,
    };
    const cur = load();
    const newStreak = outcome === "won" ? cur.streak + 1 : 0;
    const nd: TASavedData = {
      streak: newStreak, longestStreak: Math.max(cur.longestStreak, newStreak),
      playedKey: todayKey(), todayResult: result,
      history: [result, ...cur.history].slice(0, 60),
    };
    save(nd); setSaved(nd);
  }, [daily]);

  // ── Start ─────────────────────────────────────────────────────────────────

  const startGame = useCallback(() => {
    if (alreadyPlayed) return;
    const q = buildQueue(daily.word);
    queueRef.current  = q;
    stabRef.current   = 100;
    activeRef.current = 0;
    noiseRef.current  = 0;
    phaseRef.current  = "playing";
    setQueue(q); setActiveIdx(0); setStability(100); setNoiseElim(0);
    setFlash(null); setPhase("playing");
    startInt(100);
  }, [alreadyPlayed, daily, startInt]);

  // ── Drop ──────────────────────────────────────────────────────────────────

  const handleDrop = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const q   = [...queueRef.current];
    const idx = activeRef.current;
    const ltr = q[idx];
    if (!ltr || ltr.eliminated) return;

    if (!ltr.isWord) {
      q[idx] = { ...ltr, eliminated: true };
      queueRef.current = q;
      setQueue([...q]);
      noiseRef.current += 1;
      setNoiseElim(noiseRef.current);
      setFlash("good");
      if (q.filter(l => !l.isWord && !l.eliminated).length === 0) {
        stopInt(); phaseRef.current = "won"; setPhase("won");
        saveResult("won", stabRef.current, noiseRef.current);
      }
    } else {
      const ns = Math.max(0, stabRef.current - STAB_HIT);
      stabRef.current = ns; setStability(ns);
      setFlash("fracture");
      if (ns <= 0) {
        stopInt(); phaseRef.current = "lost"; setPhase("lost");
        saveResult("lost", 0, noiseRef.current);
      } else {
        startInt(ns);
      }
    }
    setTimeout(() => setFlash(null), 700);
  }, [stopInt, startInt, saveResult]);

  // Space bar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) { e.preventDefault(); if (phaseRef.current === "playing") handleDrop(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [handleDrop]);

  // ── Share ─────────────────────────────────────────────────────────────────

  const handleShare = useCallback(() => {
    const r = saved.todayResult; if (!r) return;
    const bars  = `${"🟩".repeat(r.noiseEliminated)}${"⬜".repeat(Math.max(0, r.totalNoise - r.noiseEliminated))}`;
    const stabs = `${"💚".repeat(Math.ceil(r.finalStability / 25))}${"🖤".repeat(4 - Math.ceil(r.finalStability / 25))}`;
    const text  = [
      `⏳ Temporal Anchor | ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
      ``, `${r.emoji} "${daily.clue}"`, ``,
      `Noise dissolved: ${bars}`,
      `Timeline stability: ${stabs} ${r.finalStability}%`, ``,
      r.outcome === "won" ? "✅ Timeline Restored!" : "💀 Grandfather Paradox",
      `🔥 Streak: ${saved.streak}`, ``,
      "thegodoftime.com/games/temporal-anchor",
    ].join("\n");
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [saved, daily]);

  // ── Window ────────────────────────────────────────────────────────────────

  const windowLetters = useMemo(() => {
    if (queue.length === 0) return [];
    return Array.from({ length: WIN_SIZE }, (_, i) => {
      const qIdx = ((activeIdx - HALF + i) % queue.length + queue.length) % queue.length;
      return { ...queue[qIdx], distFromCenter: Math.abs(i - HALF) };
    });
  }, [queue, activeIdx]);

  // ── Derived display ───────────────────────────────────────────────────────

  const pendulumMs = stability >= 75 ? "2.4s" : stability >= 50 ? "1.8s" : stability >= 25 ? "1.3s" : "0.9s";
  const stabColor  = stability > 50 ? GREEN : stability > 25 ? ACCENT : RED;
  const noiseLeft  = useMemo(() => queue.filter(l => !l.isWord && !l.eliminated).length, [queue]);

  const borderColor = flash === "fracture" ? RED : flash === "good" ? GREEN : "var(--border)";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-base)" }}>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <div className="w-full border-b border-border" style={{ background: "var(--bg-surface)" }}>
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
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
          <span className="font-mono text-[10px] text-text-faint tabular-nums">
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
        </div>
      </div>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-20 max-w-xl mx-auto w-full">

        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="font-display font-light italic text-text-primary leading-tight mb-1"
              style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", letterSpacing: "-0.025em" }}>
            Temporal Anchor
          </h1>
          <p className="font-sans text-sm text-text-muted">
            History is dissolving. Fire the anchor. Save the timeline.
          </p>
        </div>

        {/* Clue card */}
        <div className="w-full mb-5 px-5 py-4 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border" style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-offset-md) var(--shadow-color)" }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5 flex-shrink-0">{daily.emoji}</span>
            <div className="min-w-0">
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-text-faint mb-1">
                Historical Artifact · {daily.era}
              </p>
              <p className="font-sans text-sm text-text-primary leading-relaxed">{daily.clue}</p>
            </div>
          </div>
          {phase !== "won" && phase !== "lost" && (
            <p className="mt-3 font-mono text-[10px] text-text-faint">
              {daily.word.length} letters · {uniqueLetters.length} unique · identify the word, eliminate the noise
            </p>
          )}
          {(phase === "won" || phase === "lost") && (
            <p className="mt-3 font-display font-light italic text-lg" style={{ color: phase === "won" ? GREEN : RED }}>
              {daily.word}
            </p>
          )}
        </div>

        {/* ── Ad slot 1 ─────────────────────────────────────────────────── */}
        <AdSlot height={56} className="mb-5" />

        {/* ── Pendulum + letter track (playing/done) ────────────────────── */}
        {phase !== "idle" && (
          <div className="w-full mb-5">

            {/* Pendulum */}
            <div className="relative flex justify-center" style={{ height: 96 }}>
              <div className="absolute" style={{ top: 4, left: "50%" }}>
                <div
                  className="ta-needle flex flex-col items-center"
                  style={{ animationDuration: pendulumMs, transformOrigin: "50% 0%", marginLeft: -10, width: 20 }}
                >
                  <div className="rounded-full border-2 flex-shrink-0"
                       style={{ width: 10, height: 10, borderColor: ACCENT, background: "var(--bg-base)" }} />
                  <div className="flex-1 rounded-full"
                       style={{ width: 2, minHeight: 64, background: `linear-gradient(to bottom, var(--text-faint), ${ACCENT})` }} />
                  <div className="rounded-full flex-shrink-0 -mt-1"
                       style={{ width: 16, height: 16, background: ACCENT, boxShadow: `0 0 14px 6px ${ACCENT}55` }} />
                </div>
              </div>
            </div>

            {/* Fire zone beam */}
            <div className="flex justify-center mb-0.5">
              <div style={{ width: 1, height: 14, background: `${ACCENT}66` }} />
            </div>

            {/* Letter track */}
            <div className="w-full rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] overflow-hidden transition-colors duration-200"
                 style={{ background: "var(--bg-card)", borderColor: borderColor, boxShadow: "var(--shadow-offset-lg) var(--shadow-color)" }}>
              <div className="flex items-center justify-center py-5 gap-0">
                {windowLetters.map((ltr, i) => {
                  const d       = ltr.distFromCenter;
                  const isCenter = d === 0;
                  const opacity = isCenter ? 1 : d === 1 ? 0.6 : d === 2 ? 0.35 : d === 3 ? 0.18 : 0.07;
                  const fSize   = isCenter ? "2rem" : d === 1 ? "1.5rem" : d === 2 ? "1.2rem" : d === 3 ? "1rem" : "0.85rem";
                  const tSize   = isCenter ? 54 : d === 1 ? 44 : d === 2 ? 38 : d === 3 ? 32 : 26;
                  const color   = ltr.eliminated
                    ? "var(--text-faint)"
                    : isCenter
                    ? (flash === "good" ? GREEN : flash === "fracture" ? RED : ACCENT)
                    : "var(--text-primary)";

                  return (
                    <div key={`${ltr.id}-${i}`}
                         className="relative flex items-center justify-center flex-shrink-0 transition-all duration-100"
                         style={{ width: tSize, height: tSize, opacity }}>
                      {isCenter && (
                        <div className="absolute inset-0 rounded-lg transition-all duration-150"
                             style={{
                               border: `1.5px solid ${flash === "fracture" ? RED : flash === "good" ? GREEN : ACCENT}`,
                               background: flash === "fracture"
                                 ? `color-mix(in srgb, ${RED} 10%, transparent)`
                                 : flash === "good"
                                 ? `color-mix(in srgb, ${GREEN} 10%, transparent)`
                                 : `color-mix(in srgb, ${ACCENT} 8%, transparent)`,
                             }} />
                      )}
                      <span className="font-mono font-bold tabular-nums leading-none relative z-10 select-none"
                            style={{ fontSize: fSize, color, textDecoration: ltr.eliminated ? "line-through" : "none", letterSpacing: "0.03em" }}>
                        {ltr.char}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stability meter */}
            <div className="mt-4 flex items-center gap-3">
              <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.15em] text-text-faint flex-shrink-0">
                Timeline
              </span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                <div className="h-full rounded-full transition-all duration-400"
                     style={{ width: `${stability}%`, background: stabColor }} />
              </div>
              <span className="font-mono text-xs font-bold tabular-nums flex-shrink-0"
                    style={{ color: stabColor, minWidth: "2.8rem", textAlign: "right" }}>
                {stability}%
              </span>
            </div>

            {/* Stability fracture pips */}
            <div className="mt-2 flex justify-center gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="rounded-none transition-all duration-300"
                     style={{ width: 28, height: 5, background: stability > i * 25 ? stabColor : "var(--border)" }} />
              ))}
            </div>

            {/* Noise progress */}
            <p className="mt-2 font-sans text-[10px] text-text-faint text-center">
              {phase === "playing" && `${noiseLeft} noise fragment${noiseLeft === 1 ? "" : "s"} remain · ${noiseElim} dissolved`}
              {phase === "won"     && "All temporal noise dissolved — timeline restored!"}
              {phase === "lost"    && "Timeline stability collapsed — Grandfather Paradox triggered."}
            </p>
          </div>
        )}

        {/* ── Drop button ───────────────────────────────────────────────── */}
        {phase === "playing" && (
          <button
            onClick={handleDrop}
            className="w-full h-[72px] rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border font-sans font-black text-xl uppercase tracking-[0.18em] cursor-pointer select-none mb-5"
            style={{ background: ACCENT, color: "#06060A", animation: "ta-pulse 1.8s ease-in-out infinite", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px var(--shadow-color)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
          >
            ⚡ DROP
          </button>
        )}

        {/* ── Idle / already played ─────────────────────────────────────── */}
        {phase === "idle" && !alreadyPlayed && (
          <button
            onClick={startGame}
            className="w-full h-16 rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border font-sans font-bold text-base uppercase tracking-[0.12em] cursor-pointer select-none mb-5"
            style={{ background: ACCENT, color: "#06060A", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
            onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px var(--shadow-color)"; }}
            onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)"; }}
          >
            Fire the Anchor
          </button>
        )}

        {phase === "idle" && alreadyPlayed && saved.todayResult && (
          <div className="w-full rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border p-6 text-center mb-5"
               style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)" }}>
            <div className="text-4xl mb-3">{saved.todayResult.outcome === "won" ? "✅" : "💀"}</div>
            <p className="font-display font-light italic text-xl text-text-primary mb-1">
              {saved.todayResult.outcome === "won"
                ? `Timeline Restored · ${saved.todayResult.finalStability}% stability`
                : "Timeline Collapsed"}
            </p>
            <p className="font-mono text-sm text-text-faint mb-4">{daily.word}</p>
            <button onClick={handleShare}
                    className="h-9 px-5 rounded-[var(--radius-sm)] border-[length:var(--border-width)] border-border font-sans font-semibold text-xs text-text-primary cursor-pointer"
                    style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-offset-sm) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-1px,-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-md) var(--shadow-color)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-sm) var(--shadow-color)"; }}
                    onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(1px,1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px var(--shadow-color)"; }}
                    onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-sm) var(--shadow-color)"; }}>
              {copied ? "Copied ✓" : "Share result →"}
            </button>
          </div>
        )}

        {/* ── Results panel ─────────────────────────────────────────────── */}
        {(phase === "won" || phase === "lost") && (
          <div className="w-full flex flex-col gap-3 mb-5">
            <div className="w-full rounded-[var(--radius-md)] border-[length:var(--border-width-thick)] border-border p-6 text-center"
                 style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-offset-lg) var(--shadow-color)" }}>
              <div className="text-5xl mb-3">{phase === "won" ? "✅" : "💀"}</div>
              <p className="font-display font-light italic text-2xl mb-2"
                 style={{ color: phase === "won" ? GREEN : RED }}>
                {phase === "won" ? "Timeline Restored" : "Grandfather Paradox"}
              </p>
              <p className="font-sans text-sm text-text-muted mb-4">
                {phase === "won"
                  ? `${daily.word} survives history at ${stability}% stability. ${noiseElim} noise fragments dissolved.`
                  : `${daily.word} is erased. ${noiseElim} of ${NOISE_COUNT} noise fragments dissolved before collapse.`}
              </p>
              {/* Stability pips */}
              <div className="flex justify-center gap-1.5 mb-5">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="rounded-none"
                       style={{ width: 32, height: 6, background: stability > i * 25 ? stabColor : "var(--border)" }} />
                ))}
              </div>
              <button onClick={handleShare}
                      className="w-full h-10 rounded-[var(--radius-sm)] border-[length:var(--border-width)] border-border font-sans font-semibold text-sm cursor-pointer"
                      style={{ background: "var(--bg-surface)", boxShadow: "var(--shadow-offset-sm) var(--shadow-color)", transition: "transform 120ms ease, box-shadow 120ms ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-1px,-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-md) var(--shadow-color)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-sm) var(--shadow-color)"; }}
                      onMouseDown={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(1px,1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0px var(--shadow-color)"; }}
                      onMouseUp={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-offset-sm) var(--shadow-color)"; }}>
                {copied ? "Copied to clipboard ✓" : "Share result →"}
              </button>
            </div>
          </div>
        )}

        {/* ── Ad slot 2 ─────────────────────────────────────────────────── */}
        <AdSlot height={80} className="mb-5" />

        {/* ── History ───────────────────────────────────────────────────── */}
        {saved.history.length > 0 && (
          <div className="w-full mb-8">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-text-faint mb-3">
              Collection
            </p>
            <div className="flex flex-wrap gap-2">
              {saved.history.map((r, i) => (
                <div key={i} title={`${r.date} · ${r.word}`}
                     className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-[var(--radius-sm)] border-[length:var(--border-width)] border-border cursor-default"
                     style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-offset-sm) var(--shadow-color)" }}>
                  <span className="text-base leading-none">{r.outcome === "won" ? "✅" : "💀"}</span>
                  <span className="font-mono text-[7px] text-text-faint tabular-nums">{r.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Ad slot 3 ─────────────────────────────────────────────────── */}
        <AdSlot height={100} className="mb-8" />

        {/* ── How to play ───────────────────────────────────────────────── */}
        <div className="w-full border-t border-border pt-8">
          <p className="font-display font-light italic text-text-primary mb-6 leading-tight"
             style={{ fontSize: "clamp(1.25rem, 3vw, 1.7rem)", letterSpacing: "-0.015em" }}>
            How to Play
          </p>
          <div className="flex flex-col gap-4">
            {[
              "A temporal anomaly is erasing a historical figure or artifact from the timeline. Read the clue and identify the word.",
              "Letters loop through the quantum track. The center tile — lit in amber — is your fire zone.",
              "Press DROP (or Space) to fire the Temporal Anchor at the center letter.",
              "If the letter is NOT in the hidden word, it dissolves safely. You filtered timeline noise.",
              "If the letter IS in the word, you triggered a Causal Fracture. Timeline Stability drops by 25%.",
              "Four fractures collapse the timeline — Grandfather Paradox. Game over. Come back tomorrow.",
              "Eliminate all 7 noise fragments and the historical artifact is saved. Timeline restored.",
              "As Stability drops, the Paradox Clock accelerates — the letter loop speeds up. Panic is a mechanic.",
            ].map((text, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="font-mono text-[9px] font-bold text-text-faint mt-0.5 flex-shrink-0 w-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="font-sans text-sm text-text-muted leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Ad slot 4 ─────────────────────────────────────────────────── */}
        <AdSlot height={90} className="mt-10" />
      </div>

      <style>{`
        @keyframes ta-pendulum {
          0%, 100% { transform: rotate(-22deg); }
          50%       { transform: rotate(22deg); }
        }
        .ta-needle { animation: ta-pendulum 2.4s ease-in-out infinite; }
        @keyframes ta-pulse {
          0%, 100% { box-shadow: 4px 4px 0px 0px rgba(240,168,48,0.35); }
          50%       { box-shadow: 4px 4px 0px 0px rgba(240,168,48,0.35), 0 0 28px rgba(240,168,48,0.2); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ta-needle { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
