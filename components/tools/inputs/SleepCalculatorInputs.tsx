"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateSleepCycles } from "@/lib/tools/calculations";

interface SleepCalculatorInputsProps {
  groupAccent: string;
}

export default function SleepCalculatorInputs({ groupAccent }: SleepCalculatorInputsProps) {
  const [time, setTime] = useState<string>("07:00");
  const [mode, setMode] = useState<"wakeUpAt" | "goToBedAt">("wakeUpAt");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    optimalTimes: { cycleNumber: number; timeFormatted: string; score: "good" | "optimal" }[];
    averageFallAsleepBufferMinutes: number;
  }>({
    optimalTimes: [],
    averageFallAsleepBufferMinutes: 14,
  });

  useEffect(() => {
    const res = calculateSleepCycles(time, mode);
    setResult(res);
  }, [time, mode]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Assumes ${result.averageFallAsleepBufferMinutes} minutes average sleep latency`,
      `REM cycle intervals: 90 minutes each`
    ];
  };

  const getCopyText = () => {
    if (result.optimalTimes.length === 0) return "";
    const phrase = mode === "wakeUpAt" ? "If waking up at" : "If sleeping at";
    const subphrase = mode === "wakeUpAt" ? "go to bed at" : "wake up at";
    return `${phrase} ${time}, optimal times to ${subphrase}: ` +
      result.optimalTimes.map(t => `${t.timeFormatted} (${t.cycleNumber} cycles - ${t.score})`).join(", ");
  };

  const primaryRec = result.optimalTimes.find(t => t.score === "optimal")?.timeFormatted || "—";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={primaryRec}
      resultUnit={mode === "wakeUpAt" ? "OPTIMAL BEDTIME (5-6 CYCLES)" : "OPTIMAL WAKE TIME (5-6 CYCLES)"}
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Toggle Mode */}
        <div className="flex flex-col">
          <span className="tool-input-label block mb-1">Select Goal</span>
          <PillToggle
            value={mode}
            onChange={(val) => setMode(val as "wakeUpAt" | "goToBedAt")}
            options={[
              { value: "wakeUpAt", label: "I want to wake up at..." },
              { value: "goToBedAt", label: "I go to bed at..." },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Time Selector */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="target-time">
            {mode === "wakeUpAt" ? "Wake-up Time" : "Bedtime"} (HH:MM)
          </label>
          <input
            id="target-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
          />
        </div>

        {/* Cycles Recommendations Dashboard */}
        {result.optimalTimes.length > 0 && (
          <div className="space-y-3.5 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Sleep Cycles Table (90 min periods)
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {result.optimalTimes.map((t, idx) => {
                const isOptimal = t.score === "optimal";
                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-bg-card border border-border rounded-lg flex items-center justify-between transition-all duration-300"
                    style={{
                      borderColor: isOptimal ? groupAccent : "var(--border)",
                      backgroundColor: isOptimal
                        ? `color-mix(in srgb, ${groupAccent} 8%, transparent)`
                        : undefined
                    }}
                  >
                    <div>
                      <span className="font-sans text-sm font-bold text-text-primary">
                        {t.timeFormatted}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted uppercase ml-3">
                        {t.cycleNumber * 1.5} Hours Sleep • {t.cycleNumber} Cycles
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-[8px] font-sans font-bold tracking-wider"
                      style={{
                        backgroundColor: isOptimal
                          ? `color-mix(in srgb, ${groupAccent} 15%, transparent)`
                          : "color-mix(in srgb, var(--text-muted) 10%, transparent)",
                        color: isOptimal ? groupAccent : "var(--text-muted)",
                      }}
                    >
                      {isOptimal ? "OPTIMAL REM" : "GOOD"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
