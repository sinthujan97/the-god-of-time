"use client";

import { useState, useEffect } from "react";
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

export default function SpeedReadingMetronome() {
  const [wpm, setWpm] = useState(500); // Default 500 WPM
  const [passageIndex, setPassageIndex] = useState(0);
  const [customText, setCustomText] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  
  // Timer state
  const [elapsedTime, setElapsedTime] = useState(0);

  // Extract array of words
  const textToRead = isCustomMode ? customText : PASSAGES[passageIndex].text;
  const words = textToRead.trim().split(/\s+/).filter(Boolean);

  const wordCount = words.length;
  const wordsRemaining = Math.max(0, wordCount - wordIndex);
  const msPerWord = (60 / wpm) * 1000;

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

  // Flash words loop
  useEffect(() => {
    let wordTimer: NodeJS.Timeout | null = null;
    if (isPlaying && wordIndex < wordCount) {
      wordTimer = setTimeout(() => {
        setWordIndex((prev) => {
          if (prev >= wordCount - 1) {
            setIsPlaying(false);
            return wordCount;
          }
          return prev + 1;
        });
      }, msPerWord);
    }
    return () => {
      if (wordTimer) clearTimeout(wordTimer);
    };
  }, [isPlaying, wordIndex, wpm, wordCount]);

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
  // When not playing, rotation is static
  const needleAngle = isPlaying 
    ? (elapsedTime * 10 * (360 / (msPerWord / 100))) % 360 
    : 0;

  const controlsSection = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {/* Pacer Metrics */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Pacer Metrics</span>
        <div>
          <label className="text-xs text-text-muted flex justify-between font-mono">
            <span>Target Speed (WPM)</span>
            <span className="text-text-primary font-bold">{wpm} WPM</span>
          </label>
          <input type="range" min="200" max="1000" step="25" value={wpm} onChange={(e) => setWpm(Number(e.target.value))} className="w-full accent-amber-500 bg-bg-surface border border-border h-1 rounded mt-1.5" />
          <div className="flex justify-between text-[10px] text-text-faint font-mono mt-1">
            <span>200 (Beginner)</span>
            <span>1000 (Extreme)</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Completed</div>
            <div className="text-lg font-mono font-bold text-text-primary mt-0.5">{wordIndex} <span className="text-xs text-text-muted font-sans font-normal">/ {wordCount} words</span></div>
          </div>
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Est. Remaining</div>
            <div className="text-lg font-mono font-bold text-text-primary mt-0.5">{estRemainingSecs}s</div>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-text-faint font-mono uppercase">Avg. Focus Duration</div>
          <div className="text-sm font-mono font-bold text-text-primary mt-0.5">{elapsedTime.toFixed(1)}s elapsed</div>
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
          <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} placeholder="Paste your text here to speed-read it..." rows={3} className="w-full p-2 bg-bg-surface border border-border rounded text-xs font-sans text-text-primary focus:outline-none focus:border-amber-500 transition-colors" />
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
        <div className="w-full max-w-[400px] bg-bg-card/30 border border-border/50 rounded-2xl p-8 shadow-2xl flex flex-col items-center relative overflow-hidden">
          
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

          {/* Core Words Viewport */}
          <div className="h-24 w-full flex items-center justify-center border-y border-border/30 bg-bg-surface/50 rounded-md">
            <span
              style={{
                fontFamily: "var(--font-headline), sans-serif",
                fontSize: "clamp(24px, 5vw, 40px)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: words[wordIndex] ? "var(--text-primary)" : "var(--text-faint)",
                textAlign: "center",
              }}
            >
              {words[wordIndex] || (wordIndex >= wordCount ? "FINISHED" : "PAUSED")}
            </span>
          </div>

          {/* Reading Progress Bar */}
          <div className="w-full bg-bg-surface border border-border h-1.5 rounded-full overflow-hidden mt-6">
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
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all border ${
              isPlaying
                ? "bg-bg-surface text-text-primary border-border hover:bg-bg-card"
                : "bg-amber-600 text-white border-amber-700 hover:bg-amber-500 shadow-md shadow-amber-600/10"
            }`}
          >
            {isPlaying ? "Pause" : wordIndex >= wordCount ? "Restart Pacer" : "Start Reading"}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-bg-surface hover:bg-bg-card border border-border text-text-muted hover:text-text-primary rounded-lg font-semibold text-sm transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </ClockLayout>
  );
}
