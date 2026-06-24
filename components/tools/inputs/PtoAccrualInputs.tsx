"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculatePTOAccrual } from "@/lib/tools/calculations";
import { ToolSelect } from "@/components/ui";

interface PtoAccrualInputsProps {
  groupAccent: string;
}

export default function PtoAccrualInputs({ groupAccent }: PtoAccrualInputsProps) {
  const [accrualRate, setAccrualRate] = useState<number>(4.0);
  const [accrualPeriod, setAccrualPeriod] = useState<'hour' | 'week' | 'pay-period' | 'month'>('pay-period');
  const [hoursWorked, setHoursWorked] = useState<number>(480); // e.g., 3 months of 40h/wk = ~480h
  const [currentBalance, setCurrentBalance] = useState<number>(24);
  const [maxCap, setMaxCap] = useState<number>(120);
  const [plannedUsage, setPlannedUsage] = useState<number>(16);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    accrued: 0,
    newBalance: 0,
    afterPlannedUsage: 0,
    hoursUntilCap: 0,
    daysEquivalent: 0,
    weeksEquivalent: 0,
    isAtCap: false,
  });

  useEffect(() => {
    const res = calculatePTOAccrual(
      accrualRate,
      accrualPeriod,
      hoursWorked,
      currentBalance,
      maxCap,
      plannedUsage
    );
    setResult(res);
  }, [accrualRate, accrualPeriod, hoursWorked, currentBalance, maxCap, plannedUsage]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `PTO Accrued in Period: +${result.accrued.toFixed(2)} hrs`,
      `Accumulated Balance (capped): ${result.newBalance.toFixed(2)} hrs`,
      `Equivalent Vacation Time: ${result.daysEquivalent.toFixed(1)} days (${result.weeksEquivalent.toFixed(1)} weeks)`,
      `Hours Until Cap Limit: ${result.hoursUntilCap.toFixed(2)} hrs`,
      result.isAtCap ? "Accrual Cap reached! Take time off to earn more PTO." : "Within accrual limits.",
    ];
  };

  const getCopyText = () => {
    return `PTO Balance: ${result.afterPlannedUsage.toFixed(2)} hrs after planned usage (Accrued: ${result.accrued.toFixed(2)} hrs, Starting: ${currentBalance} hrs).`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.afterPlannedUsage.toFixed(1)} hrs`}
      resultUnit="NET PROJECTED PTO BALANCE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.isAtCap ? "You have reached your company's PTO accrual cap. Additional working hours will not earn time off." : undefined}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Accrual rate and frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="accrual-rate">
              Accrual Rate (hrs)
            </label>
            <input
              id="accrual-rate"
              type="number"
              min="0"
              step="0.0001"
              value={isNaN(accrualRate) ? "" : accrualRate}
              onChange={(e) => setAccrualRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted mb-1">
              Accrual Frequency
            </span>
            <ToolSelect
              value={accrualPeriod}
              onChange={(val) => setAccrualPeriod(val as any)}
              options={[
                { value: "hour", label: "Per Hour Worked" },
                { value: "week", label: "Per Workweek (40h)" },
                { value: "pay-period", label: "Per Pay Period (80h)" },
                { value: "month", label: "Per Month (173h)" },
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>

        {/* Forecast hours */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hours-worked">
              Total Work Hours to Project
            </label>
            <input
              id="hours-worked"
              type="number"
              min="0"
              value={isNaN(hoursWorked) ? "" : hoursWorked}
              onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="current-bal">
              Current PTO Balance (hrs)
            </label>
            <input
              id="current-bal"
              type="number"
              min="0"
              value={isNaN(currentBalance) ? "" : currentBalance}
              onChange={(e) => setCurrentBalance(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Caps and usages */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="max-cap">
              Maximum Accrual Cap (hrs)
            </label>
            <input
              id="max-cap"
              type="number"
              min="0"
              value={isNaN(maxCap) ? "" : maxCap}
              onChange={(e) => setMaxCap(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="planned-use">
              Planned PTO Usage (hrs)
            </label>
            <input
              id="planned-use"
              type="number"
              min="0"
              value={isNaN(plannedUsage) ? "" : plannedUsage}
              onChange={(e) => setPlannedUsage(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
