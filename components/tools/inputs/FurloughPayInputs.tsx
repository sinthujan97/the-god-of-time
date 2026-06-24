"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateFurloughImpact } from "@/lib/tools/calculations";

interface FurloughPayInputsProps {
  groupAccent: string;
}

export default function FurloughPayInputs({ groupAccent }: FurloughPayInputsProps) {
  const [annualSalary, setAnnualSalary] = useState<number>(60000);
  const [furloughDays, setFurloughDays] = useState<number>(2);
  const [furloughDuration, setFurloughDuration] = useState<number>(3);
  const [workDays, setWorkDays] = useState<number>(21.67);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    dailyRate: 0,
    monthlyLoss: 0,
    totalLoss: 0,
    reducedMonthlyPay: 0,
    reducedAnnualEquivalent: 0,
    percentageReduction: 0,
  });

  useEffect(() => {
    const res = calculateFurloughImpact(annualSalary, furloughDays, furloughDuration, workDays);
    setResult(res);
  }, [annualSalary, furloughDays, furloughDuration, workDays]);

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
      `Daily Rate: ${formatCurrency(result.dailyRate)}/day`,
      `Loss per Month: ${formatCurrency(result.monthlyLoss)}`,
      `Percentage Monthly Reduction: ${result.percentageReduction.toFixed(1)}%`,
      `Adjusted Monthly Income: ${formatCurrency(result.reducedMonthlyPay)}`,
      `Adjusted Annual Rate: ${formatCurrency(result.reducedAnnualEquivalent)}`,
    ];
  };

  const getCopyText = () => {
    return `Furlough Loss: ${formatCurrency(result.totalLoss)} over ${furloughDuration} months (Monthly: ${formatCurrency(result.reducedMonthlyPay)}, Adjusted Annual: ${formatCurrency(result.reducedAnnualEquivalent)})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalLoss)}
      resultUnit="TOTAL INCOME LOST"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1 col-span-2">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="annual-salary">
              Current Base Annual Salary ($)
            </label>
            <input
              id="annual-salary"
              type="number"
              min="0"
              step="100"
              value={isNaN(annualSalary) ? "" : annualSalary}
              onChange={(e) => setAnnualSalary(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="furlough-days">
              Furlough Days / Month
            </label>
            <input
              id="furlough-days"
              type="number"
              min="0"
              max="31"
              value={isNaN(furloughDays) ? "" : furloughDays}
              onChange={(e) => setFurloughDays(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="furlough-dur">
              Duration (Months)
            </label>
            <input
              id="furlough-dur"
              type="number"
              min="0"
              value={isNaN(furloughDuration) ? "" : furloughDuration}
              onChange={(e) => setFurloughDuration(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1 col-span-2 pt-2 border-t border-border-subtle">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="work-days">
              Average Working Days per Month
            </label>
            <input
              id="work-days"
              type="number"
              min="0"
              step="0.01"
              value={isNaN(workDays) ? "" : workDays}
              onChange={(e) => setWorkDays(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
