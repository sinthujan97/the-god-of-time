"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateShiftDifferential } from "@/lib/tools/calculations";
import { PillToggle } from "@/components/ui";

interface ShiftDifferentialInputsProps {
  groupAccent: string;
}

export default function ShiftDifferentialInputs({ groupAccent }: ShiftDifferentialInputsProps) {
  const [baseRate, setBaseRate] = useState<number>(18.00);
  const [shiftHours, setShiftHours] = useState<number>(8.0);
  const [diffType, setDiffType] = useState<'flat' | 'percentage'>('flat');
  const [diffValue, setDiffValue] = useState<number>(2.50);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    baseEarnings: 0,
    differentialEarnings: 0,
    totalEarnings: 0,
    effectiveHourlyRate: 0,
    differentialPercentage: 0,
  });

  useEffect(() => {
    const res = calculateShiftDifferential(baseRate, shiftHours, diffType, diffValue);
    setResult(res);
  }, [baseRate, shiftHours, diffType, diffValue]);

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
      `Base Earnings: ${formatCurrency(result.baseEarnings)}`,
      `Shift Differential Premium: +${formatCurrency(result.differentialEarnings)}`,
      `Premium Rate: ${diffType === 'flat' ? `${formatCurrency(diffValue)}/hr` : `${diffValue}%`} (${result.differentialPercentage.toFixed(1)}% base increase)`,
      `Effective Hourly Rate: ${formatCurrency(result.effectiveHourlyRate)}/hr`,
    ];
  };

  const getCopyText = () => {
    return `Total earnings: ${formatCurrency(result.totalEarnings)} (Base: ${formatCurrency(result.baseEarnings)}, Premium: ${formatCurrency(result.differentialEarnings)}, Effective: ${formatCurrency(result.effectiveHourlyRate)}/hr)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalEarnings)}
      resultUnit="COMBINED GROSS EARNINGS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="base-rate">
              Base Hourly Rate ($)
            </label>
            <input
              id="base-rate"
              type="number"
              min="0"
              step="0.01"
              value={isNaN(baseRate) ? "" : baseRate}
              onChange={(e) => setBaseRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="shift-hours">
              Shift Hours (hrs)
            </label>
            <input
              id="shift-hours"
              type="number"
              min="0"
              step="0.1"
              value={isNaN(shiftHours) ? "" : shiftHours}
              onChange={(e) => setShiftHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Premium Settings */}
        <div className="pt-4 border-t border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
              Premium Type
            </span>
            <PillToggle
              value={diffType}
              onChange={(val) => setDiffType(val as any)}
              options={[
                { value: "flat", label: "Flat Rate ($ / hr)" },
                { value: "percentage", label: "Percentage (%)" },
              ]}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col space-y-1 w-[160px]">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="diff-value">
              Premium Value
            </label>
            <input
              id="diff-value"
              type="number"
              min="0"
              step="0.01"
              value={isNaN(diffValue) ? "" : diffValue}
              onChange={(e) => setDiffValue(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
