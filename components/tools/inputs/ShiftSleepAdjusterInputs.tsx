"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { adjustShiftWorkSleep } from "@/lib/tools/calculations";

interface ShiftSleepAdjusterInputsProps {
  groupAccent: string;
}

export default function ShiftSleepAdjusterInputs({ groupAccent }: ShiftSleepAdjusterInputsProps) {
  const [currentWake, setCurrentWake] = useState<string>("07:00");
  const [targetWake, setTargetWake] = useState<string>("23:00");
  const [days, setDays] = useState<number>(3);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    dailyScheduleAdjustments: { dayNumber: number; plannedSleepTime: string; plannedWakeTime: string; lightExposureWindow: string }[];
  }>({
    dailyScheduleAdjustments: [],
  });

  useEffect(() => {
    const res = adjustShiftWorkSleep(currentWake, targetWake, days);
    setResult(res);
  }, [currentWake, targetWake, days]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Total transition duration: ${days} days`,
      `Shift rate: ${((days > 0 ? (24 / days) : 0)).toFixed(1)} hours adjustment per day average`
    ];
  };

  const getCopyText = () => {
    if (result.dailyScheduleAdjustments.length === 0) return "";
    return `Shift Sleep Transition: ` +
      result.dailyScheduleAdjustments.map(a => `Day ${a.dayNumber}: Sleep at ${a.plannedSleepTime}, Wake at ${a.plannedWakeTime}, Light window: ${a.lightExposureWindow}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${days} DAYS`}
      resultUnit="TRANSITION TIMELINE LENGTH"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="current-wake">
              Current Wake-up Time
            </label>
            <input
              id="current-wake"
              type="time"
              value={currentWake}
              onChange={(e) => setCurrentWake(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="target-wake">
              Target Wake-up Time
            </label>
            <input
              id="target-wake"
              type="time"
              value={targetWake}
              onChange={(e) => setTargetWake(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="tool-input-label" htmlFor="days-input">
              Transition Days
            </label>
            <input
              id="days-input"
              type="number"
              min="1"
              max="14"
              value={isNaN(days) ? "" : days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="tool-input-field h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* Schedule adjustments timeline */}
        {result.dailyScheduleAdjustments.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Shift Transition Daily Adjustments Planner
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {result.dailyScheduleAdjustments.map((a) => (
                <div
                  key={a.dayNumber}
                  className="flex flex-col sm:flex-row justify-between p-3.5 bg-bg-card border border-border rounded-lg gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-bg-surface border border-border text-text-primary">
                      {a.dayNumber}
                    </span>
                    <div>
                      <span className="font-sans text-sm font-bold text-text-primary block">
                        Day {a.dayNumber} Schedule
                      </span>
                      <span className="text-[10px] text-text-muted font-mono uppercase">
                        Sleep: {a.plannedSleepTime} • Wake: {a.plannedWakeTime}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[9px] font-sans font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 uppercase inline-block">
                      Light Window
                    </span>
                    <span className="text-[10px] font-mono text-text-muted block mt-1">
                      {a.lightExposureWindow}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
