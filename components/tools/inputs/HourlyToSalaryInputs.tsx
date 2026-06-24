"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { hourlyToSalary } from "@/lib/tools/calculations";

interface HourlyToSalaryInputsProps {
  groupAccent: string;
}

export default function HourlyToSalaryInputs({ groupAccent }: HourlyToSalaryInputsProps) {
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [weeksPerYear, setWeeksPerYear] = useState<number>(52);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    weeklyPay: 0,
    biWeeklyPay: 0,
    semiMonthlyPay: 0,
    monthlyPay: 0,
    annualSalary: 0,
  });

  useEffect(() => {
    const res = hourlyToSalary(hourlyRate, hoursPerWeek, weeksPerYear);
    setResult(res);
  }, [hourlyRate, hoursPerWeek, weeksPerYear]);

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
      `Weekly Pay: ${formatCurrency(result.weeklyPay)}`,
      `Bi-Weekly Pay (26/yr): ${formatCurrency(result.biWeeklyPay)}`,
      `Semi-Monthly Pay (24/yr): ${formatCurrency(result.semiMonthlyPay)}`,
      `Monthly Pay (12/yr): ${formatCurrency(result.monthlyPay)}`,
      `Calculation basis: ${hoursPerWeek} hrs/week × ${weeksPerYear} weeks/year`,
    ];
  };

  const getCopyText = () => {
    return `Annual Salary: ${formatCurrency(result.annualSalary)} (Hourly: ${formatCurrency(hourlyRate)}, Monthly: ${formatCurrency(result.monthlyPay)})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.annualSalary)}
      resultUnit="ANNUAL SALARY EQUIVALENT"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hourly-rate">
              Hourly Wage ($)
            </label>
            <input
              id="hourly-rate"
              type="number"
              min="0"
              step="0.01"
              value={isNaN(hourlyRate) ? "" : hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
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
        </div>

      </div>
    </CalculatorCard>
  );
}
