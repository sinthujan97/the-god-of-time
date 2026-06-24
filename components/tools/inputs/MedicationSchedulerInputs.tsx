"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { scheduleMedicationIntervals } from "@/lib/tools/calculations";

interface MedicationSchedulerInputsProps {
  groupAccent: string;
}

export default function MedicationSchedulerInputs({ groupAccent }: MedicationSchedulerInputsProps) {
  const [firstDoseTime, setFirstDoseTime] = useState<string>("08:00");
  const [frequency, setFrequency] = useState<number>(6);
  const [totalDoses, setTotalDoses] = useState<number>(4);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    doseTimeline: { doseNumber: number; plannedTimeStr: string; requireFoodNotice: boolean }[];
    completionTimeStr: string;
  }>({
    doseTimeline: [],
    completionTimeStr: "",
  });

  useEffect(() => {
    const res = scheduleMedicationIntervals(firstDoseTime, frequency, totalDoses);
    setResult(res);
  }, [firstDoseTime, frequency, totalDoses]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Total treatment period: ${(totalDoses - 1) * frequency} hours`,
      `Final dose completion time: ${result.completionTimeStr}`
    ];
  };

  const getCopyText = () => {
    if (result.doseTimeline.length === 0) return "";
    return `Medication Intake Schedule: ` +
      result.doseTimeline.map(d => `Dose ${d.doseNumber} at ${d.plannedTimeStr}${d.requireFoodNotice ? " (With Food)" : ""}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.completionTimeStr}
      resultUnit="COMPLETION TIME (FINAL DOSE)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="first-dose-time">
              First Dose Time
            </label>
            <input
              id="first-dose-time"
              type="time"
              value={firstDoseTime}
              onChange={(e) => setFirstDoseTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="tool-input-label" htmlFor="frequency-input">
              Interval (Every X Hours)
            </label>
            <input
              id="frequency-input"
              type="number"
              min="1"
              max="24"
              value={isNaN(frequency) ? "" : frequency}
              onChange={(e) => setFrequency(parseInt(e.target.value, 10))}
              className="tool-input-field h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="tool-input-label" htmlFor="total-doses-input">
              Total Doses Daily
            </label>
            <input
              id="total-doses-input"
              type="number"
              min="1"
              max="12"
              value={isNaN(totalDoses) ? "" : totalDoses}
              onChange={(e) => setTotalDoses(parseInt(e.target.value, 10))}
              className="tool-input-field h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        {/* Dose Timeline List */}
        {result.doseTimeline.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Scheduled Dose Intake Timetable
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {result.doseTimeline.map((d) => (
                <div
                  key={d.doseNumber}
                  className="flex items-center justify-between p-3.5 bg-bg-card border border-border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-bg-surface border border-border text-text-primary">
                      {d.doseNumber}
                    </span>
                    <div>
                      <span className="font-sans text-sm font-bold text-text-primary block">
                        Dose {d.doseNumber} • {d.plannedTimeStr}
                      </span>
                    </div>
                  </div>
                  {d.requireFoodNotice ? (
                    <span className="px-2 py-0.5 rounded text-[8px] font-sans font-bold tracking-wider bg-accent-utility-c/10 text-accent-utility-c uppercase">
                      Take With Food
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[8px] font-sans font-bold tracking-wider bg-bg-surface text-text-muted border border-border uppercase">
                      Empty Stomach Ok
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
