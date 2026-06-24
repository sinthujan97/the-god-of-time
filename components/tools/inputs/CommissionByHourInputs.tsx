"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateCommissionPerHour } from "@/lib/tools/calculations";

interface CommissionByHourInputsProps {
  groupAccent: string;
}

export default function CommissionByHourInputs({ groupAccent }: CommissionByHourInputsProps) {
  const [commission, setCommission] = useState<number>(1200);
  const [hoursWorked, setHoursWorked] = useState<number>(40);
  const [baseSalary, setBaseSalary] = useState<number>(1000);
  const [baseHours, setBaseHours] = useState<number>(40);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    commissionPerHour: 0,
    baseHourlyRate: 0,
    combinedHourlyRate: 0,
    commissionAsPercent: 0,
    breakEvenHours: 0,
  });

  useEffect(() => {
    const res = calculateCommissionPerHour(commission, hoursWorked, baseSalary, baseHours);
    setResult(res);
  }, [commission, hoursWorked, baseSalary, baseHours]);

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
    return [
      `Base Hourly Pay Rate: ${formatCurrency(result.baseHourlyRate)}/hr`,
      `Combined Hourly Pay Rate: ${formatCurrency(result.combinedHourlyRate)}/hr`,
      `Commission as % of Earnings: ${result.commissionAsPercent.toFixed(1)}%`,
      `Break-even hours needed: ${result.breakEvenHours.toFixed(1)} hrs`,
    ];
  };

  const getCopyText = () => {
    return `Commission: ${formatCurrency(result.commissionPerHour)}/hr (Combined: ${formatCurrency(result.combinedHourlyRate)}/hr, Base: ${formatCurrency(result.baseHourlyRate)}/hr)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${formatCurrency(result.commissionPerHour)}/hr`}
      resultUnit="COMMISSION HOURLY RATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Commission */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="commission">
              Commission Earned ($)
            </label>
            <input
              id="commission"
              type="number"
              min="0"
              value={isNaN(commission) ? "" : commission}
              onChange={(e) => setCommission(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="commission-hours">
              Hours Worked (to earn commission)
            </label>
            <input
              id="commission-hours"
              type="number"
              min="0"
              value={isNaN(hoursWorked) ? "" : hoursWorked}
              onChange={(e) => setHoursWorked(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Base pay info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="base-salary">
              Base Salary for Period ($)
            </label>
            <input
              id="base-salary"
              type="number"
              min="0"
              value={isNaN(baseSalary) ? "" : baseSalary}
              onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="base-hours">
              Standard Base Hours
            </label>
            <input
              id="base-hours"
              type="number"
              min="0"
              value={isNaN(baseHours) ? "" : baseHours}
              onChange={(e) => setBaseHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
