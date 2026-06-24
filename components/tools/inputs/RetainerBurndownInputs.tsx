"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateRetainerBurndown } from "@/lib/tools/calculations";
import { DatePicker } from "@/components/ui";

interface RetainerBurndownInputsProps {
  groupAccent: string;
}

export default function RetainerBurndownInputs({ groupAccent }: RetainerBurndownInputsProps) {
  const [totalHours, setTotalHours] = useState<number>(40);
  const [hourlyRate, setHourlyRate] = useState<number>(100);
  const [usedHours, setUsedHours] = useState<number>(15);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    remainingHours: 0,
    remainingValue: 0,
    usedValue: 0,
    burnRate: 0,
    projectedEndDate: null as Date | null,
    percentageUsed: 0,
    daysRemaining: 0,
    hoursPerDayNeeded: 0,
  });

  // Client-side initialization: set start date to 1st of current month, end date to last day
  useEffect(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) return;

    const format = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const res = calculateRetainerBurndown(totalHours, hourlyRate, usedHours, format(startDate), format(endDate));
    setResult(res);
  }, [totalHours, hourlyRate, usedHours, startDate, endDate]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const getBreakdownRows = () => {
    const projectedStr = result.projectedEndDate 
      ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(result.projectedEndDate)
      : "N/A (no burn)";

    return [
      `Used Value: ${formatCurrency(result.usedValue)} (${result.percentageUsed.toFixed(1)}% consumed)`,
      `Remaining Value: ${formatCurrency(result.remainingValue)}`,
      `Days Remaining in Period: ${result.daysRemaining} days`,
      `Current Burn Rate: ${result.burnRate.toFixed(2)} hrs/day`,
      `Estimated Depletion Date: ${projectedStr}`,
      `Daily hours allowance to pace: ${result.hoursPerDayNeeded.toFixed(2)} hrs/day`,
    ];
  };

  const getCopyText = () => {
    const projectedStr = result.projectedEndDate 
      ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(result.projectedEndDate)
      : "N/A";
    return `Retainer hours: ${result.remainingHours.toFixed(1)} remaining of ${totalHours} total. Burn rate: ${result.burnRate.toFixed(2)} hrs/day, Projected Depletion: ${projectedStr}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.remainingHours.toFixed(1)} hrs`}
      resultUnit="REMAINING RETAINER HOURS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={usedHours > totalHours ? "Warning: You have exceeded the retainer hours allocation." : undefined}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Visual progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-sans font-medium text-text-muted">
            <span>Capacity Consumed</span>
            <span className={usedHours > totalHours ? "text-accent-utility-e" : "text-text-primary"}>
              {result.percentageUsed.toFixed(1)}% ({usedHours} / {totalHours} hrs)
            </span>
          </div>
          <div className="w-full bg-bg-card border border-border rounded-full h-4 overflow-hidden relative">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, result.percentageUsed)}%`,
                backgroundColor: usedHours > totalHours ? "#EF4444" : groupAccent
              }}
            />
          </div>
        </div>

        {/* Retainer Specs */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="total-hours">
              Retainer Hours
            </label>
            <input
              id="total-hours"
              type="number"
              min="0"
              value={isNaN(totalHours) ? "" : totalHours}
              onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="used-hours">
              Hours Used
            </label>
            <input
              id="used-hours"
              type="number"
              min="0"
              value={isNaN(usedHours) ? "" : usedHours}
              onChange={(e) => setUsedHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hourly-rate">
              Hourly Rate ($)
            </label>
            <input
              id="hourly-rate"
              type="number"
              min="0"
              value={isNaN(hourlyRate) ? "" : hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <DatePicker
            id="start-date"
            label="Period Start Date"
            value={startDate}
            onChange={setStartDate}
            accentColor={groupAccent}
          />

          <DatePicker
            id="end-date"
            label="Period End Date"
            value={endDate}
            onChange={setEndDate}
            accentColor={groupAccent}
          />
        </div>

      </div>
    </CalculatorCard>
  );
}
