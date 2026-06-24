"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateTrimesterMilestones, MilestoneTrimester } from "@/lib/tools/calculations";

interface TrimesterCalendarInputsProps {
  groupAccent: string;
}

export default function TrimesterCalendarInputs({ groupAccent }: TrimesterCalendarInputsProps) {
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    trimesters: MilestoneTrimester[];
    countdownDays: number;
  }>({
    trimesters: [],
    countdownDays: 0,
  });

  useEffect(() => {
    // Default: due date roughly 280 days from now
    const d = new Date();
    d.setDate(d.getDate() + 280);
    setDueDate(d);
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!dueDate) return;
    const dateStr = formatDateToYYYYMMDD(dueDate);
    const res = calculateTrimesterMilestones(dateStr);
    setResult(res);
  }, [dueDate]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!dueDate || result.trimesters.length === 0) return [];
    return [
      `Countdown: ${result.countdownDays} days left to estimated delivery`,
    ];
  };

  const getCopyText = () => {
    if (!dueDate || result.trimesters.length === 0) return "";
    return `Trimester Timeline: ` + result.trimesters.map(t => `${t.name} (${t.weeksRange}): ${t.startDateFormatted} to ${t.endDateFormatted}`).join(" | ");
  };

  const activeTrimesterIndex = React.useMemo(() => {
    if (!dueDate || result.trimesters.length === 0) return -1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lmp = new Date(dueDate);
    lmp.setDate(dueDate.getDate() - 280);

    const elapsedDays = Math.max(0, Math.round((today.getTime() - lmp.getTime()) / 86400000));
    const currentWeek = Math.floor(elapsedDays / 7);

    if (currentWeek < 14) return 0;
    if (currentWeek < 28) return 1;
    return 2;
  }, [dueDate, result.trimesters]);

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={dueDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(dueDate) : "—"}
      resultUnit="ESTIMATED DUE DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Due Date Picker */}
        <div className="flex flex-col">
          <DatePicker
            id="due-date"
            label="Estimated Due Date (EDD)"
            value={dueDate}
            onChange={setDueDate}
            accentColor={groupAccent}
          />
        </div>

        {/* Trimester Cards */}
        {result.trimesters.length > 0 && (
          <div className="space-y-3.5 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Milestone Trimester Calendar
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {result.trimesters.map((t, idx) => {
                const isActive = idx === activeTrimesterIndex;
                return (
                  <div
                    key={idx}
                    className="p-4 bg-bg-card border border-border rounded-lg transition-all duration-300 relative overflow-hidden"
                    style={{
                      borderColor: isActive ? groupAccent : "var(--border)",
                      boxShadow: isActive
                        ? `0 0 12px color-mix(in srgb, ${groupAccent} 15%, transparent)`
                        : undefined,
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-[4px]"
                        style={{ backgroundColor: groupAccent }}
                      />
                    )}
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-sans text-sm font-bold text-text-primary">
                          {t.name}
                        </h4>
                        <span className="text-[10px] font-mono text-text-muted uppercase">
                          {t.weeksRange} • {t.startDateFormatted} to {t.endDateFormatted}
                        </span>
                      </div>
                      {isActive && (
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-sans font-bold tracking-wider"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${groupAccent} 15%, transparent)`,
                            color: groupAccent,
                          }}
                        >
                          ACTIVE PHASE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted mt-2 font-sans font-light leading-relaxed">
                      <strong className="text-text-primary font-medium">Marker:</strong> {t.keyDevelopmentalMarker}
                    </p>
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
