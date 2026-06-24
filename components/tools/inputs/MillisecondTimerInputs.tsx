"use client";

import React, { useState, useEffect, useRef } from "react";
import CalculatorCard from "../CalculatorCard";
import { PillToggle } from "@/components/ui";

interface MillisecondTimerInputsProps {
  groupAccent: string;
}

interface LapItem {
  lapNumber: number;
  lapTime: number; // ms
  totalTime: number; // ms
  delta: number; // ms since previous lap
}

export default function MillisecondTimerInputs({ groupAccent }: MillisecondTimerInputsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapItem[]>([]);
  const [deltaMode, setDeltaMode] = useState<boolean>(false);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforeStartRef = useRef<number>(0);

  // Format milliseconds to HH:MM:SS.mmm
  const formatTime = (totalMs: number): string => {
    const totalSeconds = Math.floor(totalMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const msecs = Math.floor(totalMs % 1000);

    const pad = (n: number, size = 2) => String(n).padStart(size, "0");
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}.${pad(msecs, 3)}`;
  };

  const updateTimer = () => {
    if (isRunning) {
      const now = performance.now();
      const currentElapsed = elapsedBeforeStartRef.current + (now - startTimeRef.current);
      setElapsedTime(currentElapsed);
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now();
      requestRef.current = requestAnimationFrame(updateTimer);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      elapsedBeforeStartRef.current = elapsedTime;
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
    elapsedBeforeStartRef.current = 0;
  };

  const handleLap = () => {
    if (elapsedTime === 0) return;

    const previousTotal = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
    const lapTime = elapsedTime - previousTotal;

    const newLap: LapItem = {
      lapNumber: laps.length + 1,
      lapTime,
      totalTime: elapsedTime,
      delta: lapTime,
    };

    setLaps([...laps, newLap]);
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={false}
      onCalculate={() => {}}
      resultValue="—"
      resultUnit=""
      animationKey={0}
    >
      {/* Hide the default CalculatorCard buttons and result display */}
      <style dangerouslySetInnerHTML={{ __html: `
        #calculate-btn, .ad-slot-inline, #tool-result-zone {
          display: none !important;
        }
      `}} />

      <div 
        className="flex flex-col items-center justify-center space-y-8 py-6"
        style={{ "--group-accent": groupAccent } as React.CSSProperties}
      >
        {/* Large Hero Stopwatch Display */}
        <div className="text-center">
          <span 
            className="font-mono text-4xl sm:text-[64px] font-normal tracking-tight text-text-primary tabular-nums block leading-none filter drop-shadow-[0_0_12px_rgba(82,196,160,0.15)]"
            style={{ textShadow: "0 0 20px var(--group-accent)" } as React.CSSProperties}
          >
            {formatTime(elapsedTime)}
          </span>
          <span className="text-[10px] font-sans font-medium uppercase tracking-[0.15em] text-text-muted mt-2 block">
            HH:MM:SS.mmm
          </span>
        </div>

        {/* Stopwatch Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleStartStop}
            className={`w-[110px] h-11 rounded-md font-sans text-xs font-semibold uppercase tracking-[0.08em] cursor-pointer transition-all border ${
              isRunning
                ? "border-accent-utility-e text-accent-utility-e bg-accent-utility-e/10 hover:bg-accent-utility-e/20"
                : "border-[color:var(--group-accent)] text-[color:var(--group-accent)] bg-transparent hover:bg-[color:var(--group-accent)]/10"
            }`}
          >
            {isRunning ? "Stop" : "Start"}
          </button>
          
          <button
            type="button"
            onClick={handleLap}
            disabled={elapsedTime === 0}
            className="w-[110px] h-11 rounded-md font-sans text-xs font-semibold uppercase tracking-[0.08em] cursor-pointer transition-all border border-border text-text-muted hover:text-text-primary hover:border-text-faint disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Lap
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="w-[110px] h-11 rounded-md font-sans text-xs font-semibold uppercase tracking-[0.08em] cursor-pointer transition-all border border-border text-text-muted hover:text-text-primary hover:border-text-faint"
          >
            Reset
          </button>
        </div>

        {/* Laps List & Delta Toggle */}
        {laps.length > 0 && (
          <div className="w-full max-w-[480px] space-y-4 pt-6 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                Lap Times ({laps.length})
              </span>
              <div className="flex items-center gap-2">
                <span className="font-sans text-[11px] text-text-faint">Delta Mode</span>
                <PillToggle
                  value={deltaMode ? "true" : "false"}
                  onChange={(val) => setDeltaMode(val === "true")}
                  options={[
                    { value: "false", label: "Cumulative" },
                    { value: "true", label: "Split" },
                  ]}
                  accentColor={groupAccent}
                />
              </div>
            </div>

            {/* Lap rows scroll area */}
            <div className="max-h-[220px] overflow-y-auto border border-border rounded-md bg-bg-surface divide-y divide-border/50">
              {laps
                .slice()
                .reverse()
                .map((lap) => (
                  <div key={lap.lapNumber} className="flex items-center justify-between p-3 font-mono text-xs">
                    <span className="text-text-faint">Lap {lap.lapNumber}</span>
                    <span className="text-text-primary font-medium">
                      {deltaMode ? formatTime(lap.lapTime) : formatTime(lap.totalTime)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
