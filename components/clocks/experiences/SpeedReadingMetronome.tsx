"use client";

import { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "speed-reading-metronome")!;

// Sample text passages
const PASSAGES = [
  {
    title: "The Time Machine (H.G. Wells)",
    text: "The Time Traveller (for so it will be convenient to speak of him) was expounding a recondite matter to us. His grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burned brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses. Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere when thought runs gracefully free of the trammels of precision.",
  },
  {
    title: "Meditations (Marcus Aurelius)",
    text: "Time is a river, a fierce torrent of things that come into being; no sooner is a thing brought to sight than it is swept away and another takes its place, and this too will be swept away. Out of the cosmos, all things are woven together in a single sacred bond, and there is nothing alien to anything else. Keep this constantly in mind: that all things that exist are already in a state of decay and transition, fading away to make room for the new.",
  },
  {
    title: "The Theory of Relativity (Albert Einstein)",
    text: "When a man sits with a pretty girl for an hour, it seems like a minute. But let him sit on a hot stove for a minute—and it's longer than any hour. That's relativity. Our sense of time is a subjective experience, built on the density of events and the emotional resonance of the present. A clock measures objective duration, but our minds measure meaning, processing the flow of existence at its own fluid speed.",
  },
];

// Synthesizer Metronome Click
function playClickSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.008);
    osc.start();
    osc.stop(ctx.currentTime + 0.012);
  } catch {}
}

export default function SpeedReadingMetronome() {
  const [wpm, setWpm] = useState(500); // Default 500 WPM
  const [passageIndex, setPassageIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Customized options
  const [highlightMode, setHighlightMode] = useState<"spritz" | "normal">("spritz");
  const [wordsPerStep, setWordsPerStep] = useState<number>(1);
  const [fontStyle, setFontStyle] = useState<"sans" | "mono" | "serif">("sans");
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Extract array of words
  const textToRead = isCustomMode ? customText : PASSAGES[passageIndex].text;
  const words = textToRead.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  
  const wordsRemaining = Math.max(0, wordCount - wordIndex);

  // Calculate timing interval per step based on WPM and chunk count
  const stepsPerMin = wpm / wordsPerStep;
  const msPerStep = (60 / stepsPerMin) * 1000;

  // Sync ref values to prevent interval closure capture issues
  const isPlayingRef = useRef(isPlaying);
  const wordIndexRef = useRef(wordIndex);
  const wordCountRef = useRef(wordCount);
  const msPerStepRef = useRef(msPerStep);
  const wordsPerStepRef = useRef(wordsPerStep);
  const soundEnabledRef = useRef(soundEnabled);

  isPlayingRef.current = isPlaying;
  wordIndexRef.current = wordIndex;
  wordCountRef.current = wordCount;
  msPerStepRef.current = msPerStep;
  wordsPerStepRef.current = wordsPerStep;
  soundEnabledRef.current = soundEnabled;

  // Track elapsed time when playing
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying]);

  // Flash words loop using setTimeout chain to respond dynamically to changes
  useEffect(() => {
    let wordTimer: NodeJS.Timeout | null = null;

    const tick = () => {
      if (!isPlayingRef.current || wordIndexRef.current >= wordCountRef.current) {
        setIsPlaying(false);
        return;
      }

      if (soundEnabledRef.current) {
        playClickSound();
      }

      setWordIndex((prev) => {
        const next = Math.min(wordCountRef.current, prev + wordsPerStepRef.current);
        if (next >= wordCountRef.current) {
          setIsPlaying(false);
        }
        return next;
      });

      wordTimer = setTimeout(tick, msPerStepRef.current);
    };

    if (isPlaying) {
      wordTimer = setTimeout(tick, msPerStep);
    }

    return () => {
      if (wordTimer) clearTimeout(wordTimer);
    };
  }, [isPlaying, msPerStep]);

  const handlePlayPause = () => {
    if (wordIndex >= wordCount) {
      setWordIndex(0);
      setElapsedTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setWordIndex(0);
    setElapsedTime(0);
  };

  const handlePassageChange = (idx: number) => {
    setIsPlaying(false);
    setIsCustomMode(false);
    setPassageIndex(idx);
    setWordIndex(0);
    setElapsedTime(0);
  };

  const handleCustomTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPlaying(false);
    setIsCustomMode(true);
    setWordIndex(0);
    setElapsedTime(0);
  };

  // Completion calculation
  const estRemainingSecs = Math.ceil((wordsRemaining * 60) / wpm);

  // Metronome needle rotation (angle completes full rotation per word tick)
  const needleAngle = isPlaying 
    ? (elapsedTime * 10 * (360 / (msPerStep / 100))) % 360 
    : 0;

  // Split word helper for Optimal Recognition Point (ORP) display
  const renderSpritzWord = (wordStr: string) => {
    if (!wordStr) return null;
    
    // ORP Index calculation
    const len = wordStr.length;
    let orpIdx = 0;
    if (len > 1) {
      if (len <= 5) orpIdx = 1;
      else if (len <= 9) orpIdx = 2;
      else if (len <= 13) orpIdx = 3;
      else orpIdx = 4;
    }

    const prefix = wordStr.substring(0, orpIdx);
    const orpLetter = wordStr.charAt(orpIdx);
    const suffix = wordStr.substring(orpIdx + 1);

    const fontClass = fontStyle === "mono" ? "font-mono" : fontStyle === "serif" ? "font-serif" : "font-sans";

    return (
      <div 
        className={`flex w-full justify-center ${fontClass} font-bold leading-none`}
        style={{ fontSize: "clamp(26px, 6vw, 42px)", letterSpacing: "0.02em" }}
      >
        {/* Align prefix to right, orp exactly in middle, suffix to left */}
        <div style={{ flex: 1, textAlign: "right", color: "var(--text-primary)", whiteSpace: "pre" }}>
          {prefix || " "}
        </div>
        <div style={{ color: "var(--destructive)", padding: "0 1px", flexShrink: 0 }}>
          {orpLetter}
        </div>
        <div style={{ flex: 1, textAlign: "left", color: "var(--text-primary)", whiteSpace: "pre" }}>
          {suffix || " "}
        </div>
      </div>
    );
  };

  const currentDisplay = () => {
    if (wordIndex >= wordCount) return <span style={{ color: "var(--accent-utility-a)" }}>FINISHED</span>;
    if (!isPlaying && wordIndex === 0) return <span style={{ color: "var(--text-faint)" }}>READY</span>;
    
    const chunk = words.slice(wordIndex, wordIndex + wordsPerStep).join(" ");
    
    // Spritz mode is only relevant for 1 word per step
    if (highlightMode === "spritz" && wordsPerStep === 1) {
      return renderSpritzWord(chunk);
    }

    const fontClass = fontStyle === "mono" ? "font-mono" : fontStyle === "serif" ? "font-serif" : "font-sans";
    return (
      <span className={`${fontClass} font-bold text-text-primary text-center`} style={{ fontSize: "clamp(22px, 5vw, 36px)" }}>
        {chunk}
      </span>
    );
  };

  const controlsSection = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      
      {/* Pacer Metrics & Visual Options */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Pacer Metrics & Options</span>
        
        <div>
          <label className="text-xs text-text-muted flex justify-between font-mono">
            <span>Target Speed (WPM)</span>
            <span className="text-text-primary font-bold">{wpm} WPM</span>
          </label>
          <input type="range" min="150" max="1000" step="25" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full accent-amber-500 bg-bg-surface border border-border h-1.5 rounded mt-1.5 cursor-pointer" />
          <div className="flex justify-between text-[10px] text-text-faint font-mono mt-1">
            <span>150 (Starter)</span>
            <span>1000 (Extreme)</span>
          </div>
        </div>

        {/* Custom selectors */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle">
          <div>
            <label className="text-[10px] text-text-faint font-mono uppercase block mb-1">Words per Step</label>
            <select
              value={wordsPerStep}
              onChange={(e) => setWordsPerStep(Number(e.target.value))}
              className="w-full bg-bg-surface border border-border text-xs rounded p-1 font-sans text-text-primary cursor-pointer"
            >
              <option value={1}>1 Word (Focus)</option>
              <option value={2}>2 Words</option>
              <option value={3}>3 Words (Chunk)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-text-faint font-mono uppercase block mb-1">Highlight Mode</label>
            <select
              value={highlightMode}
              onChange={(e) => setHighlightMode(e.target.value as any)}
              className="w-full bg-bg-surface border border-border text-xs rounded p-1 font-sans text-text-primary cursor-pointer"
            >
              <option value="spritz">Optimal Focus (ORP)</option>
              <option value="normal">Standard Block</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] text-text-faint font-mono uppercase block mb-1">Font Family</label>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value as any)}
              className="w-full bg-bg-surface border border-border text-xs rounded p-1 font-sans text-text-primary cursor-pointer"
            >
              <option value="sans">Clean Sans-Serif</option>
              <option value="mono">Rhythmic Monospace</option>
              <option value="serif">Editorial Serif</option>
            </select>
          </div>
          <div className="flex flex-col justify-end gap-1.5 pb-1">
            <label className="text-xs text-text-primary font-sans flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={showGuidelines}
                onChange={(e) => setShowGuidelines(e.target.checked)}
                className="accent-amber-500"
              />
              ORP Guides
            </label>
            <label className="text-xs text-text-primary font-sans flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="accent-amber-500"
              />
              Metronome Click 🔊
            </label>
          </div>
        </div>

        {/* Statistics info */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-subtle">
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Progress</div>
            <div className="text-sm font-mono font-bold text-text-primary mt-0.5">{wordIndex} / {wordCount} <span className="text-[10px] text-text-muted font-normal">w</span></div>
          </div>
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Remaining</div>
            <div className="text-sm font-mono font-bold text-text-primary mt-0.5">{estRemainingSecs}s est</div>
          </div>
        </div>
        
        <div>
          <div className="text-[10px] text-text-faint font-mono uppercase">Active Pacing Timer</div>
          <div className="text-xs font-mono font-bold text-text-primary mt-0.5">{elapsedTime.toFixed(1)} seconds elapsed</div>
        </div>
      </div>

      {/* Select Passage + Custom Text */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Select Passage</span>
        <div className="flex flex-col gap-2">
          {PASSAGES.map((p, i) => (
            <button key={i} onClick={() => handlePassageChange(i)} className={`w-full text-left font-sans text-xs p-2 rounded border transition-colors ${!isCustomMode && passageIndex === i ? "bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold" : "bg-bg-surface text-text-muted border-border hover:bg-bg-card"}`}>
              {p.title}
            </button>
          ))}
        </div>
        <div className="space-y-2 pt-2 border-t border-border-subtle">
          <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Paste Custom Text</span>
          <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Paste your article or story here to speed-read it..." rows={3} className="w-full p-2 bg-bg-surface border border-border rounded text-xs font-sans text-text-primary focus:outline-none focus:border-amber-500 transition-colors" />
          <button onClick={(e) => handleCustomTextSubmit(e)} disabled={!customText.trim()} className="w-full py-1.5 bg-bg-surface hover:bg-bg-card disabled:opacity-50 text-text-primary border border-border rounded text-xs font-semibold transition-colors">
            Load Custom Text
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} controlsSection={controlsSection}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] select-none text-text-primary">
        
        {/* Tachistoscope Word Focus Viewport */}
        <div className="w-full max-w-[420px] bg-bg-card/30 border border-border/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
          
          {/* Subtle focus crosshair lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div className="w-full h-[1px] bg-text-primary" />
            <div className="h-full w-[1px] bg-text-primary absolute" />
          </div>

          {/* Visual Metronome Needle SVG */}
          <div className="w-24 h-24 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--border)"
                strokeWidth="2"
                strokeOpacity="0.4"
              />
              {/* Dial tick marks */}
              {[...Array(4)].map((_, i) => {
                const angle = i * 90;
                const rad = (angle * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={50 + 35 * Math.cos(rad)}
                    y1={50 + 35 * Math.sin(rad)}
                    x2={50 + 40 * Math.cos(rad)}
                    y2={50 + 40 * Math.sin(rad)}
                    stroke="var(--section-clocks-accent)"
                    strokeWidth="2"
                  />
                );
              })}

              {/* Sweeping Metronome Needle */}
              {(() => {
                const rad = ((needleAngle - 90) * Math.PI) / 180;
                const nx = 50 + 36 * Math.cos(rad);
                const ny = 50 + 36 * Math.sin(rad);
                return (
                  <g>
                    <line
                      x1="50"
                      y1="50"
                      x2={nx}
                      y2={ny}
                      stroke="var(--text-primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="50" cy="50" r="4" fill="var(--text-primary)" />
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Guidelines and Core Words Viewport */}
          <div className="h-28 w-full flex flex-col items-center justify-center border-y border-border/30 bg-bg-surface/50 rounded-md relative">
            
            {/* Visual Guidelines (ORP alignment marks) */}
            {showGuidelines && highlightMode === "spritz" && wordsPerStep === 1 && wordIndex < wordCount && words[wordIndex] && (
              <>
                <div style={{ position: "absolute", left: "50%", top: 2, transform: "translateX(-50%)", fontSize: 10, color: "var(--destructive)", lineHeight: 1, pointerEvents: "none" }}>▼</div>
                <div style={{ position: "absolute", left: "50%", bottom: 2, transform: "translateX(-50%)", fontSize: 10, color: "var(--destructive)", lineHeight: 1, pointerEvents: "none" }}>▲</div>
              </>
            )}

            {currentDisplay()}
          </div>

          {/* Reading Progress Bar */}
          <div className="w-full bg-bg-surface border border-border h-2 rounded-full overflow-hidden mt-6">
            <div
              className="bg-amber-500 h-full transition-all duration-150"
              style={{ width: `${(wordIndex / Math.max(1, wordCount)) * 100}%` }}
            />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all border cursor-pointer ${
              isPlaying
                ? "bg-bg-surface text-text-primary border-border hover:bg-bg-card"
                : "bg-amber-600 text-white border-amber-700 hover:bg-amber-500 shadow-md shadow-amber-600/10"
            }`}
          >
            {isPlaying ? "Pause" : wordIndex >= wordCount ? "Restart Pacer" : "Start Reading"}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-bg-surface hover:bg-bg-card border border-border text-text-muted hover:text-text-primary rounded-lg font-semibold text-sm transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </ClockLayout>
  );
}
