"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculatePregnancyDates, DueDateResult } from "@/lib/tools/calculations";

interface PregnancyDueInputsProps {
  groupAccent: string;
}

export default function PregnancyDueInputs({ groupAccent }: PregnancyDueInputsProps) {
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [method, setMethod] = useState<"lmp" | "conception">("lmp");
  const [cycleLength, setCycleLength] = useState<number>(28);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<DueDateResult>({
    estimatedDueDate: new Date(),
    dueDateFormatted: "—",
    conceptionDateFormatted: "",
    currentWeek: 0,
    currentDay: 0,
    daysRemaining: 0,
    progressPercentage: 0,
    isValid: false,
  });

  useEffect(() => {
    setInputDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!inputDate) return;
    const dateStr = formatDateToYYYYMMDD(inputDate);
    const res = calculatePregnancyDates(dateStr, method, cycleLength);
    setResult(res);
  }, [inputDate, method, cycleLength]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return ["Select date to view progress"];
    return [
      `Conception Date (Est.): ${result.conceptionDateFormatted || "—"}`,
      `${result.daysRemaining} days remaining until delivery`
    ];
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Estimated Due Date: ${result.dueDateFormatted}. Gestational Age: ${result.currentWeek} Weeks, ${result.currentDay} Days. Progress: ${result.progressPercentage}%.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.dueDateFormatted : "—"}
      resultUnit="ESTIMATED DUE DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Calculation Method & Cycle Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="tool-input-label block mb-1">Calculation Method</span>
            <PillToggle
              value={method}
              onChange={(val) => setMethod(val as "lmp" | "conception")}
              options={[
                { value: "lmp", label: "Last Period (LMP)" },
                { value: "conception", label: "Conception Date" },
              ]}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="cycle-length-input">
              Average Cycle Length (Days)
            </label>
            <input
              id="cycle-length-input"
              type="number"
              min="20"
              max="45"
              value={isNaN(cycleLength) ? "" : cycleLength}
              disabled={method === "conception"}
              onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md disabled:opacity-50"
            />
            {method === "lmp" && (
              <span className="text-[11px] text-text-muted mt-1.5 font-sans">
                Typically 28 days. Adjusts ovulation estimate.
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Input Date */}
        <div className="flex flex-col">
          <DatePicker
            id="input-date"
            label={method === "lmp" ? "First Day of Last Menstrual Period" : "Date of Conception"}
            value={inputDate}
            onChange={setInputDate}
            accentColor={groupAccent}
          />
        </div>

        {/* Gestational Age Display (Visual Progress Arc/Blocks) */}
        {result.isValid && (
          <div className="pt-4 border-t border-border/40 space-y-4">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Current Gestational Progress
            </h3>

            {/* Weeks & Days display */}
            <div className="flex items-baseline gap-2">
              <span className="font-display italic text-4xl text-text-primary">
                {result.currentWeek}
              </span>
              <span className="text-sm font-sans font-medium text-text-muted uppercase">
                Weeks
              </span>
              <span className="font-display italic text-3xl text-text-primary ml-4">
                {result.currentDay}
              </span>
              <span className="text-sm font-sans font-medium text-text-muted uppercase">
                Days
              </span>
            </div>

            {/* Progress bar container */}
            <div className="space-y-2">
              <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${result.progressPercentage}%`,
                    backgroundColor: groupAccent,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-text-muted">
                <span>Week 0</span>
                <span className="font-sans font-bold" style={{ color: groupAccent }}>{result.progressPercentage}% Completed</span>
                <span>Week 40</span>
              </div>
            </div>

            {/* Trimester visual indicator blocks */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              {[1, 2, 3].map((tri) => {
                const isActive =
                  (tri === 1 && result.currentWeek < 14) ||
                  (tri === 2 && result.currentWeek >= 14 && result.currentWeek < 28) ||
                  (tri === 3 && result.currentWeek >= 28);
                const isCompleted =
                  (tri === 1 && result.currentWeek >= 14) ||
                  (tri === 2 && result.currentWeek >= 28);

                return (
                  <div
                    key={tri}
                    className="p-3 border rounded-lg flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: isActive ? groupAccent : "var(--border)",
                      backgroundColor: isActive
                        ? `color-mix(in srgb, ${groupAccent} 10%, transparent)`
                        : isCompleted
                        ? "color-mix(in srgb, var(--text-muted) 5%, transparent)"
                        : "transparent",
                    }}
                  >
                    <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-text-primary">
                      Trimester {tri}
                    </span>
                    <span
                      className="text-[9px] font-mono mt-1 font-bold"
                      style={{
                        color: isActive ? groupAccent : "var(--text-muted)",
                      }}
                    >
                      {isActive ? "ACTIVE" : isCompleted ? "COMPLETED" : "PENDING"}
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
