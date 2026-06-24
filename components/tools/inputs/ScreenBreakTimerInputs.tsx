"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { configureScreenTimePomodoro } from "@/lib/tools/calculations";

interface ScreenBreakTimerInputsProps {
  groupAccent: string;
}

export default function ScreenBreakTimerInputs({ groupAccent }: ScreenBreakTimerInputsProps) {
  const [screenHours, setScreenHours] = useState<number>(8);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Active Timer state
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(20);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  const [result, setResult] = useState<{
    recommendedBreakIntervalMinutes: number;
    totalBreakIntervalsRequiredDaily: number;
    estimatedEyeStrainReductionPercentage: number;
  }>({
    recommendedBreakIntervalMinutes: 20,
    totalBreakIntervalsRequiredDaily: 0,
    estimatedEyeStrainReductionPercentage: 0,
  });

  useEffect(() => {
    const res = configureScreenTimePomodoro(screenHours);
    setResult(res);
  }, [screenHours]);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSecondsLeft]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const startTimer = () => {
    setTimerSecondsLeft(20);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerSecondsLeft(20);
    setTimerActive(false);
  };

  const getBreakdownRows = () => {
    return [
      `Break interval: Every ${result.recommendedBreakIntervalMinutes} minutes`,
      `Required daily break segments: ${result.totalBreakIntervalsRequiredDaily} times`
    ];
  };

  const getCopyText = () => {
    return `Screen Break Recommendation: For ${screenHours} hours of screen usage, take a break every ${result.recommendedBreakIntervalMinutes} minutes (${result.totalBreakIntervalsRequiredDaily} times daily). Estimated eye strain reduction: ${result.estimatedEyeStrainReductionPercentage}%.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.estimatedEyeStrainReductionPercentage}%`}
      resultUnit="ESTIMATED EYE STRAIN REDUCTION"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Screen Hours Input */}
        <div className="flex flex-col">
          <label className="tool-input-label" htmlFor="screen-hours-input">
            Average Daily Screen Time (Hours)
          </label>
          <input
            id="screen-hours-input"
            type="number"
            min="1"
            max="24"
            value={isNaN(screenHours) ? "" : screenHours}
            onChange={(e) => setScreenHours(parseFloat(e.target.value))}
            className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
          />
        </div>

        {/* 20-20-20 Rule Active Timer Widget */}
        <div className="pt-4 border-t border-border/40 space-y-4">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Interactive 20-20-20 Rule Practice Timer
          </h3>
          
          <div className="p-4 bg-bg-card border border-border rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="font-sans text-sm font-bold text-text-primary block">
                Take a 20-Second Break
              </span>
              <span className="text-[10px] text-text-muted font-sans block mt-0.5">
                Look at something 20 feet away to relax eye ciliary muscles
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="font-display italic text-2xl text-text-primary tabular-nums">
                  {timerSecondsLeft}s
                </span>
                <span className="text-[9px] font-sans font-semibold text-text-muted uppercase">
                  Remaining
                </span>
              </div>
              
              <div className="flex gap-2">
                {!timerActive ? (
                  <button
                    type="button"
                    onClick={startTimer}
                    className="px-3.5 h-9 font-sans text-xs font-semibold rounded-md text-white transition-colors"
                    style={{ backgroundColor: groupAccent }}
                  >
                    {timerSecondsLeft === 20 ? "Start" : "Resume"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimerActive(false)}
                    className="px-3.5 h-9 font-sans text-xs font-semibold rounded-md border border-border text-text-primary bg-bg-surface hover:bg-bg-card transition-colors"
                  >
                    Pause
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={resetTimer}
                  className="px-3.5 h-9 font-sans text-xs font-semibold rounded-md border border-border text-text-primary bg-bg-surface hover:bg-bg-card transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
