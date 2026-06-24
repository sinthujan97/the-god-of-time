"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateFertilityWindows } from "@/lib/tools/calculations";

interface OvulationCalculatorInputsProps {
  groupAccent: string;
}

export default function OvulationCalculatorInputs({ groupAccent }: OvulationCalculatorInputsProps) {
  const [lastPeriod, setLastPeriod] = useState<Date | undefined>(undefined);
  const [cycleLength, setCycleLength] = useState<number>(28);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    ovulationDateFormatted: string;
    peakFertilityStartFormatted: string;
    peakFertilityEndFormatted: string;
    nextExpectedPeriodFormatted: string;
    rollingSixMonthWindows: { start: string; end: string; ovulation: string }[];
  }>({
    ovulationDateFormatted: "—",
    peakFertilityStartFormatted: "",
    peakFertilityEndFormatted: "",
    nextExpectedPeriodFormatted: "",
    rollingSixMonthWindows: [],
  });

  useEffect(() => {
    setLastPeriod(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!lastPeriod) return;
    const dateStr = formatDateToYYYYMMDD(lastPeriod);
    const res = calculateFertilityWindows(dateStr, cycleLength);
    setResult(res);
  }, [lastPeriod, cycleLength]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!lastPeriod) return [];
    return [
      `Peak Fertile Window: ${result.peakFertilityStartFormatted} to ${result.peakFertilityEndFormatted}`,
      `Next Expected Period: ${result.nextExpectedPeriodFormatted}`,
    ];
  };

  const getCopyText = () => {
    if (!lastPeriod) return "";
    return `Ovulation: ${result.ovulationDateFormatted}. Peak fertility window: ${result.peakFertilityStartFormatted} - ${result.peakFertilityEndFormatted}. Next expected period: ${result.nextExpectedPeriodFormatted}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={lastPeriod ? result.ovulationDateFormatted : "—"}
      resultUnit="ESTIMATED OVULATION DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="last-period-date"
              label="Start Date of Last Period"
              value={lastPeriod}
              onChange={setLastPeriod}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="cycle-days-input">
              Average Cycle Length (Days)
            </label>
            <input
              id="cycle-days-input"
              type="number"
              min="21"
              max="40"
              value={isNaN(cycleLength) ? "" : cycleLength}
              onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
            <span className="text-[11px] text-text-muted mt-1.5 font-sans">
              Typically between 21 and 35 days. Default is 28.
            </span>
          </div>
        </div>

        {/* 6-Month Projected Fertile Calendar */}
        {result.rollingSixMonthWindows.length > 0 && (
          <div className="space-y-3.5 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              6-Month Fertile Window Planner
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {result.rollingSixMonthWindows.map((win, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-bg-card border border-border rounded-lg gap-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: groupAccent }}
                    />
                    <span className="font-sans text-sm font-bold text-text-primary">
                      Cycle {idx + 1} Ovulation: {win.ovulation}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-text-muted uppercase block">
                      Fertility: {win.start} – {win.end}
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
