"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateHabitMilestones } from "@/lib/tools/calculations";

interface HabitStreakPlannerInputsProps {
  groupAccent: string;
}

export default function HabitStreakPlannerInputs({ groupAccent }: HabitStreakPlannerInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    milestones: { targetDayCount: number; targetCalendarDateFormatted: string; psychologyPhase: string }[];
    daysElapsedSinceStart: number;
  }>({
    milestones: [],
    daysElapsedSinceStart: 0,
  });

  useEffect(() => {
    setStartDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate) return;
    const dateStr = formatDateToYYYYMMDD(startDate);
    const res = calculateHabitMilestones(dateStr);
    setResult(res);
  }, [startDate]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Days elapsed since kick-off: ${result.daysElapsedSinceStart} days`,
    ];
  };

  const getCopyText = () => {
    if (result.milestones.length === 0) return "";
    return `Habit Formation Milestone Plan: ` +
      result.milestones.map(m => `Day ${m.targetDayCount} (${m.targetCalendarDateFormatted}): ${m.psychologyPhase}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.daysElapsedSinceStart}`}
      resultUnit="DAYS ELAPSED"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Habit Start Date */}
        <div className="flex flex-col">
          <DatePicker
            id="habit-start-date"
            label="Habit Kick-off Date"
            value={startDate}
            onChange={setStartDate}
            accentColor={groupAccent}
          />
        </div>

        {/* Milestone Pathway Map */}
        {result.milestones.length > 0 && (
          <div className="space-y-3.5 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Neurological Habit Pathway Map
            </h3>
            <div className="flex flex-col gap-4 relative pl-4 border-l border-border/60 ml-2">
              {result.milestones.map((m, idx) => {
                const isAchieved = result.daysElapsedSinceStart >= m.targetDayCount;
                return (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div
                      className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-bg-card transition-all duration-300"
                      style={{
                        backgroundColor: isAchieved ? groupAccent : "var(--border)",
                        boxShadow: isAchieved
                          ? `0 0 8px color-mix(in srgb, ${groupAccent} 50%, transparent)`
                          : undefined,
                      }}
                    />
                    <div className="pl-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-sm font-bold text-text-primary">
                          Day {m.targetDayCount} Milestone
                        </span>
                        <span
                          className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: isAchieved
                              ? `color-mix(in srgb, ${groupAccent} 15%, transparent)`
                              : "color-mix(in srgb, var(--text-muted) 10%, transparent)",
                            color: isAchieved ? groupAccent : "var(--text-muted)",
                          }}
                        >
                          {isAchieved ? "ACHIEVED" : "IN PROGRESS"}
                        </span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono uppercase block mt-0.5">
                        Target Date: {m.targetCalendarDateFormatted}
                      </span>
                      <p className="text-xs text-text-muted font-sans font-light mt-1.5 leading-relaxed">
                        <strong className="text-text-primary font-medium">Phase:</strong> {m.psychologyPhase}
                      </p>
                    </div>
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
