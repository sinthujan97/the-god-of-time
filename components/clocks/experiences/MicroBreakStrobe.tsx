"use client";

import React, { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "micro-break-strobe")!;

const FOCUS_DURATION = 1200; // 20 minutes in seconds
const BREAK_DURATION = 20;   // 20 seconds in seconds

export default function MicroBreakStrobe() {
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [inBreak, setInBreak] = useState(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState(BREAK_DURATION);
  
  // Stats state
  const [breaksToday, setBreaksToday] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Breathing pacer phase (for 20s break)
  const [breathPhase, setBreathPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breathProgress, setBreathProgress] = useState(0); // 0 to 1

  // Web Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Load stats on mount
  useEffect(() => {
    try {
      const storedCount = localStorage.getItem("microbreak_breaks_today");
      const storedStreak = localStorage.getItem("microbreak_streak");
      const storedDate = localStorage.getItem("microbreak_last_date");

      const today = new Date().toDateString();
      if (storedDate === today) {
        if (storedCount) setBreaksToday(Number(storedCount));
      } else {
        // Reset count for a new day
        localStorage.setItem("microbreak_breaks_today", "0");
        setBreaksToday(0);
        
        // Check if streak was broken (last break was yesterday)
        if (storedDate) {
          const lastDate = new Date(storedDate);
          const diffTime = Math.abs(new Date(today).getTime() - lastDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 1) {
            localStorage.setItem("microbreak_streak", "0");
            setStreak(0);
          } else if (storedStreak) {
            setStreak(Number(storedStreak));
          }
        }
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }
  }, []);

  // Timer Tick Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && !inBreak) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            triggerBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, inBreak]);

  // Break countdown & Breathing pacer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (inBreak) {
      interval = setInterval(() => {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval!);
            endBreak();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [inBreak]);

  // Breathing pacer animation loop
  useEffect(() => {
    let animFrame: number;
    const start = Date.now();
    const updateBreathing = () => {
      if (!inBreak) return;
      const elapsed = (Date.now() - start) / 1000;
      
      // 20s break: 4s inhale, 2s hold, 4s exhale, 4s inhale, 2s hold, 4s exhale
      const cycle = elapsed % 10;
      if (cycle < 4) {
        setBreathPhase("inhale");
        setBreathProgress(cycle / 4); // 0 to 1
      } else if (cycle < 6) {
        setBreathPhase("hold");
        setBreathProgress(1);
      } else {
        setBreathPhase("exhale");
        setBreathProgress(1 - (cycle - 6) / 4); // 1 to 0
      }
      animFrame = requestAnimationFrame(updateBreathing);
    };

    if (inBreak) {
      animFrame = requestAnimationFrame(updateBreathing);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [inBreak]);

  // Sound Synth Generator (Chime / Meditation bell using Web Audio API)
  const playSound = (freq1: number, freq2: number, type: OscillatorType = "sine", duration = 1.5) => {
    if (!isAudioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = type;
      osc1.frequency.setValueAtTime(freq1, ctx.currentTime);
      
      osc2.type = type;
      osc2.frequency.setValueAtTime(freq2, ctx.currentTime);

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      
      osc1.stop(ctx.currentTime + duration);
      osc2.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  const triggerBreak = () => {
    setIsRunning(false);
    setInBreak(true);
    setBreakTimeLeft(BREAK_DURATION);
    // Relaxing dual sine chord
    playSound(440, 554.37, "sine", 2.5); 
  };

  const endBreak = () => {
    setInBreak(false);
    setTimeLeft(FOCUS_DURATION);
    
    // Play celebratory bell
    playSound(523.25, 659.25, "sine", 1.8);

    // Save breaks stats
    try {
      const today = new Date().toDateString();
      const newCount = breaksToday + 1;
      setBreaksToday(newCount);
      localStorage.setItem("microbreak_breaks_today", String(newCount));
      localStorage.setItem("microbreak_last_date", today);

      // Streak logic (update streak if breaks today reaches 5)
      if (newCount === 5) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem("microbreak_streak", String(newStreak));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    // Unsuspend audio context if needed on click
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
  };

  const handleForceBreak = () => {
    triggerBreak();
  };

  // String formatting helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Circular progress math
  const progressRatio = timeLeft / FOCUS_DURATION;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  // Custom Sidebar definition
  const sidebar = (
    <div className="space-y-6">
      {/* Stats Widget */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">
          Compliance Tracking
        </span>

        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Completed Today</div>
          <div className="text-3xl font-mono font-bold text-text-primary mt-1">
            {breaksToday} <span className="text-xs text-text-muted font-sans font-normal">/ 5 goal</span>
          </div>
          {/* Simple progress dots */}
          <div className="flex gap-1.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full border transition-all ${
                  i < breaksToday
                    ? "bg-amber-500 border-amber-500 shadow-sm shadow-amber-500/20"
                    : "bg-bg-surface border-border"
                }`}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Break Streak</div>
          <div className="text-xl font-mono font-bold text-text-primary mt-1">
            🔥 {streak} {streak === 1 ? "Day" : "Days"}
          </div>
          <p className="text-[10px] text-text-muted mt-1 leading-snug">
            Complete at least 5 focus micro-breaks every day to sustain your focus streak.
          </p>
        </div>

        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Audio Alert Chime</div>
          <button
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className={`w-full text-left font-mono font-bold text-xs mt-1.5 py-1.5 px-3 rounded border transition-colors ${
              isAudioEnabled
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-bg-surface text-text-muted border-border"
            }`}
          >
            {isAudioEnabled ? "🔔 Chimes Enabled" : "🔕 Muted"}
          </button>
        </div>
      </div>

      {/* Premium Sponsor Ad */}
      <div className="sidebar-ad-slot">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          SPONSOR
        </span>
        <div className="sidebar-ad-container p-5 bg-gradient-to-br from-amber-950/20 to-orange-950/20 border border-amber-500/20 rounded-xl flex flex-col justify-between text-center min-h-[220px]">
          <div>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-mono uppercase">
              Eye Care Tech
            </span>
            <h4 className="text-sm font-bold text-text-primary mt-3 font-sans leading-snug">
              Lumina: Anti-Reflective Lenses
            </h4>
            <p className="text-xs text-text-muted mt-2">
              Block up to 98% of high-energy visible blue light. Protect your vision during deep work.
            </p>
          </div>
          <a
            href="https://thegodoftime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-amber-600 hover:bg-amber-500 transition-colors text-white font-semibold rounded text-xs mt-4 block text-center"
          >
            Get 20% Off Lenses
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} customSidebar={sidebar}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] relative overflow-hidden select-none text-text-primary">
        
        {/* Countdown Ring view */}
        <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center bg-bg-card/25 border border-border/40 rounded-full p-6 shadow-2xl">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
              strokeOpacity="0.3"
            />
            {/* Active Countdown Ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="var(--section-clocks-accent)"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute text-center">
            <span className="text-[11px] font-mono text-text-faint uppercase tracking-widest block mb-1">
              Focus Interval
            </span>
            <span className="text-4xl font-mono font-bold text-text-primary tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-mono text-text-muted block mt-1">
              {isRunning ? "TIMER TICKING" : "TIMER PAUSED"}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center gap-3">
          <button
            onClick={handleStartPause}
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all border ${
              isRunning
                ? "bg-bg-surface text-text-primary border-border hover:bg-bg-card"
                : "bg-amber-600 text-white border-amber-700 hover:bg-amber-500 shadow-md shadow-amber-600/10"
            }`}
          >
            {isRunning ? "Pause" : "Start Focus"}
          </button>
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-bg-surface hover:bg-bg-card border border-border text-text-muted hover:text-text-primary rounded-lg font-semibold text-sm transition-colors"
          >
            Reset
          </button>

          <button
            onClick={handleForceBreak}
            className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg font-semibold text-sm transition-colors"
          >
            Trigger Break
          </button>
        </div>

        {/* Breathing Strobe compliance overlay */}
        {inBreak && (
          <div className="absolute inset-0 bg-amber-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-50">
            {/* Visual breathing expanding circle */}
            <div className="relative w-48 h-48 flex items-center justify-center mb-8">
              {/* Pulse waves */}
              <div
                className="absolute rounded-full bg-amber-500 opacity-20 transition-all duration-300 ease-out"
                style={{
                  width: `${60 + breathProgress * 100}%`,
                  height: `${60 + breathProgress * 100}%`,
                }}
              />
              <div className="absolute w-32 h-32 rounded-full border-2 border-amber-500/40" />
              
              {/* Inner core circle */}
              <div
                className="absolute w-24 h-24 rounded-full bg-amber-500 transition-all duration-300 flex items-center justify-center shadow-lg shadow-amber-500/20"
                style={{
                  transform: `scale(${0.85 + breathProgress * 0.3})`,
                }}
              >
                <span className="text-black font-mono font-bold text-2xl">
                  {breakTimeLeft}s
                </span>
              </div>
            </div>

            {/* Instruction Labels */}
            <div className="space-y-3 max-w-[280px]">
              <h3 className="text-xl font-bold font-sans text-amber-100 uppercase tracking-wide">
                {breathPhase === "inhale" && "🌬️ Inhale"}
                {breathPhase === "hold" && "🛑 Hold"}
                {breathPhase === "exhale" && "💨 Exhale"}
              </h3>
              <p className="text-xs text-amber-200/75 leading-relaxed font-mono">
                Look at something 20 feet away to relax your eyes.
              </p>
            </div>
            
            {/* Skip break option */}
            <button
              onClick={endBreak}
              className="mt-8 text-[11px] font-mono text-amber-400/50 hover:text-amber-400 transition-colors uppercase tracking-widest"
            >
              [ Skip Break Intervention ]
            </button>
          </div>
        )}

      </div>
    </ClockLayout>
  );
}
