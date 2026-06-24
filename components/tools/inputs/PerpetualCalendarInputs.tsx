"use client";

import React, { useState, useEffect } from "react";
import { ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { generatePerpetualGrid, CalendarMonthGrid } from "@/lib/tools/calculations";

interface PerpetualCalendarInputsProps {
  groupAccent: string;
}

export default function PerpetualCalendarInputs({ groupAccent }: PerpetualCalendarInputsProps) {
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(5); // June (0-indexed)

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [grid, setGrid] = useState<CalendarMonthGrid>([]);

  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  useEffect(() => {
    const res = generatePerpetualGrid(year, month);
    setGrid(res);
  }, [year, month]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    const totalDays = grid.filter(g => g.dayNumber !== null).length;
    const weekendCount = grid.filter(g => g.dayNumber !== null && g.isWeekend).length;
    return [
      `Total Days in Month: ${totalDays} days`,
      `Weekend Days: ${weekendCount} days`
    ];
  };

  const getCopyText = () => {
    return `Perpetual Calendar for ${months[month].label} ${year}: total days is ${grid.filter(g => g.dayNumber !== null).length}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${months[month].label} ${year}`}
      resultUnit="SELECTED PERPETUAL MONTH"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <ToolSelect
              value={String(month)}
              onChange={(val) => setMonth(parseInt(val, 10))}
              options={months}
              label="Select Month"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="year-input">
              Enter Year (1 - 9999 AD)
            </label>
            <input
              id="year-input"
              type="number"
              min="1"
              max="9999"
              value={isNaN(year) ? "" : year}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) setYear(val);
              }}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>
        </div>

        {/* Perpetual Calendar Wall Grid */}
        {grid.length > 0 && (
          <div className="pt-4 border-t border-border/40 space-y-4">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Calendar Grid Layout
            </h3>
            
            <div className="grid grid-cols-7 gap-1 text-center">
              {/* Day Name Header Row */}
              {["S", "M", "T", "W", "T", "F", "S"].map((d, idx) => (
                <div key={idx} className="font-sans text-[10px] font-bold text-text-muted py-1.5 border-b border-border/40 uppercase">
                  {d}
                </div>
              ))}

              {/* Day numbers grid */}
              {grid.map((cell, idx) => (
                <div
                  key={idx}
                  className={`h-10 flex items-center justify-center rounded text-xs transition-colors font-sans ${
                    cell.dayNumber === null
                      ? "opacity-0 pointer-events-none"
                      : cell.isWeekend
                      ? "bg-bg-surface text-text-muted border border-border/30 hover:bg-bg-card-hover cursor-pointer"
                      : "bg-bg-card border border-border hover:bg-bg-card-hover cursor-pointer"
                  }`}
                  style={{
                    borderColor: cell.dayNumber !== null && cell.isWeekend ? undefined : undefined,
                  }}
                >
                  {cell.dayNumber}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
