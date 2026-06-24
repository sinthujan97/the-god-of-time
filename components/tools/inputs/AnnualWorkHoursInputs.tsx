"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateAnnualWorkHours } from "@/lib/tools/calculations";

interface AnnualWorkHoursInputsProps {
  groupAccent: string;
}

export default function AnnualWorkHoursInputs({ groupAccent }: AnnualWorkHoursInputsProps) {
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);
  const [ptoWeeks, setPtoWeeks] = useState<number>(2);
  const [holidays, setHolidays] = useState<number>(10);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    grossAnnualHours: 0,
    ptoHours: 0,
    holidayHours: 0,
    netWorkingHours: 0,
    netWorkingDays: 0,
    percentageOfYear: 0,
  });

  useEffect(() => {
    const res = calculateAnnualWorkHours(hoursPerDay, daysPerWeek, weeksPerYear, ptoWeeks, holidays);
    setResult(res);
  }, [hoursPerDay, daysPerWeek, weeksPerYear, ptoWeeks, holidays]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Gross Annual Hours: ${result.grossAnnualHours.toLocaleString()} hrs`,
      `Vacation/PTO Deduction: -${result.ptoHours.toLocaleString()} hrs (${ptoWeeks} weeks)`,
      `Holiday Deduction: -${result.holidayHours.toLocaleString()} hrs (${holidays} days)`,
      `Net Working Days: ${result.netWorkingDays.toFixed(1)} days`,
      `Percentage of Year Spent Working: ${result.percentageOfYear.toFixed(1)}%`,
    ];
  };

  const getCopyText = () => {
    return `Net Annual Hours: ${result.netWorkingHours.toLocaleString()} hrs (${result.netWorkingDays.toFixed(1)} days, Gross: ${result.grossAnnualHours.toLocaleString()} hrs)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.netWorkingHours.toLocaleString()} hrs`}
      resultUnit="NET ANNUAL WORKING HOURS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Core Schedule */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hours-day">
              Hours / Day
            </label>
            <input
              id="hours-day"
              type="number"
              min="0"
              max="24"
              value={isNaN(hoursPerDay) ? "" : hoursPerDay}
              onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="days-week">
              Days / Week
            </label>
            <input
              id="days-week"
              type="number"
              min="0"
              max="7"
              value={isNaN(daysPerWeek) ? "" : daysPerWeek}
              onChange={(e) => setDaysPerWeek(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="weeks-year">
              Weeks / Year
            </label>
            <input
              id="weeks-year"
              type="number"
              min="0"
              max="52"
              value={isNaN(weeksPerYear) ? "" : weeksPerYear}
              onChange={(e) => setWeeksPerYear(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Deductions */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="vacation-weeks">
              Vacation / PTO Weeks
            </label>
            <input
              id="vacation-weeks"
              type="number"
              min="0"
              max="52"
              value={isNaN(ptoWeeks) ? "" : ptoWeeks}
              onChange={(e) => setPtoWeeks(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="holidays-count">
              Observed Holidays (days)
            </label>
            <input
              id="holidays-count"
              type="number"
              min="0"
              max="365"
              value={isNaN(holidays) ? "" : holidays}
              onChange={(e) => setHolidays(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
