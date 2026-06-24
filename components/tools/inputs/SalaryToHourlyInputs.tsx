"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { salaryToHourly } from "@/lib/tools/calculations";

interface SalaryToHourlyInputsProps {
  groupAccent: string;
}

export default function SalaryToHourlyInputs({ groupAccent }: SalaryToHourlyInputsProps) {
  const [annualSalary, setAnnualSalary] = useState<number>(52000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);
  const [ptoWeeks, setPtoWeeks] = useState<number>(2);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    grossHourlyRate: 0,
    netHourlyRate: 0,
    effectiveHourlyRate: 0,
    dailyRate: 0,
    weeklyRate: 0,
  });

  useEffect(() => {
    const res = salaryToHourly(annualSalary, hoursPerWeek, weeksPerYear, ptoWeeks);
    setResult(res);
  }, [annualSalary, hoursPerWeek, weeksPerYear, ptoWeeks]);

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
      `Net Hourly Rate (worked hours): ${formatCurrency(result.netHourlyRate)}/hr`,
      `Daily Pay Rate (5-day basis): ${formatCurrency(result.dailyRate)}/day`,
      `Weekly Pay Rate: ${formatCurrency(result.weeklyRate)}/week`,
      `PTO/Holidays: ${ptoWeeks} weeks excluded in Net Hourly calculation`,
    ];
  };

  const getCopyText = () => {
    return `Gross Hourly: ${formatCurrency(result.grossHourlyRate)}/hr, Net Hourly: ${formatCurrency(result.netHourlyRate)}/hr (based on ${annualSalary} annual salary)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${formatCurrency(result.grossHourlyRate)}/hr`}
      resultUnit="GROSS HOURLY RATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1 col-span-2">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="annual-salary">
              Annual Salary ($)
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
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hours-week">
              Hours / Week
            </label>
            <input
              id="hours-week"
              type="number"
              min="0"
              max="168"
              value={isNaN(hoursPerWeek) ? "" : hoursPerWeek}
              onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
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

          <div className="flex flex-col space-y-1 col-span-2 pt-2 border-t border-border-subtle">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="pto-weeks">
              Unworked Paid Time Off (PTO / Vacation Weeks)
            </label>
            <input
              id="pto-weeks"
              type="number"
              min="0"
              max="52"
              value={isNaN(ptoWeeks) ? "" : ptoWeeks}
              onChange={(e) => setPtoWeeks(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
