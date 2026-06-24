"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateSemiMonthlyPay, PayrollPeriod } from "@/lib/tools/calculations";
import { DatePicker, PillToggle } from "@/components/ui";

interface SemiMonthlyPayInputsProps {
  groupAccent: string;
}

export default function SemiMonthlyPayInputs({ groupAccent }: SemiMonthlyPayInputsProps) {
  const [salaryType, setSalaryType] = useState<'salary' | 'hourly'>('salary');
  const [amount, setAmount] = useState<number>(60000);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [firstPayDate, setFirstPayDate] = useState<Date | undefined>(undefined);
  const [numberOfPeriods, setNumberOfPeriods] = useState<number>(12); // standard count to show in table

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    grossPayPerPeriod: 0,
    annualSalary: 0,
    periods: [] as PayrollPeriod[],
  });

  // Client-side initialization: anchor date to current or upcoming 15th/last day
  useEffect(() => {
    const today = new Date();
    // Default to the next 15th or last day of the month
    const nextPayDate = new Date(today.getFullYear(), today.getMonth(), 15);
    if (today.getDate() > 15) {
      nextPayDate.setMonth(today.getMonth() + 1);
    }
    setFirstPayDate(nextPayDate);
  }, []);

  useEffect(() => {
    if (!firstPayDate) return;

    const year = firstPayDate.getFullYear();
    const month = String(firstPayDate.getMonth() + 1).padStart(2, "0");
    const day = String(firstPayDate.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    const res = calculateSemiMonthlyPay(salaryType, amount, hoursPerWeek, dateStr, numberOfPeriods);
    setResult(res);
  }, [salaryType, amount, hoursPerWeek, firstPayDate, numberOfPeriods]);

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
      `Annual Salary Equivalent: ${formatCurrency(result.annualSalary)}`,
      `Pay Periods per Year: 24`,
      salaryType === 'hourly' ? `Based on ${hoursPerWeek} hrs/week at ${formatCurrency(amount)}/hr` : "Based on annual contract salary",
    ];
  };

  const getCopyText = () => {
    return `Semi-Monthly Pay: ${formatCurrency(result.grossPayPerPeriod)} per period (Annual: ${formatCurrency(result.annualSalary)}, 24 periods)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.grossPayPerPeriod)}
      resultUnit="PERIOD GROSS PAY"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Toggle Type */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Income Basis
          </span>
          <PillToggle
            value={salaryType}
            onChange={(val) => {
              setSalaryType(val as any);
              setAmount(val === 'salary' ? 60000 : 25);
            }}
            options={[
              { value: "salary", label: "Annual Salary" },
              { value: "hourly", label: "Hourly Wage" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Amount */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="income-amount">
              {salaryType === 'salary' ? "Annual Salary ($)" : "Hourly Wage ($/hr)"}
            </label>
            <input
              id="income-amount"
              type="number"
              min="0"
              value={isNaN(amount) ? "" : amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          {salaryType === 'hourly' && (
            <div className="flex flex-col space-y-1 animate-in slide-in-from-left-2 duration-200">
              <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hours-wk">
                Hours / Week
              </label>
              <input
                id="hours-wk"
                type="number"
                min="0"
                max="168"
                value={isNaN(hoursPerWeek) ? "" : hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
                className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
            </div>
          )}
        </div>

        {/* Date and Period length */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <DatePicker
              id="first-pay-date"
              label="First Pay Date"
              value={firstPayDate}
              onChange={setFirstPayDate}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="num-periods">
              Periods to Display
            </label>
            <input
              id="num-periods"
              type="number"
              min="1"
              max="48"
              value={isNaN(numberOfPeriods) ? "" : numberOfPeriods}
              onChange={(e) => setNumberOfPeriods(parseInt(e.target.value) || 12)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Periods Table */}
        {result.periods.length > 0 && (
          <div className="pt-4 border-t border-border-subtle space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
              Pay Date Schedule
            </span>
            <div className="overflow-x-auto border border-border rounded-lg bg-bg-surface max-h-[250px] overflow-y-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px] bg-bg-card">
                    <th className="p-3 font-semibold">Period</th>
                    <th className="p-3 font-semibold">Start Date</th>
                    <th className="p-3 font-semibold">End Date</th>
                    <th className="p-3 font-semibold">Pay Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-text-primary">
                  {result.periods.map((p) => (
                    <tr key={p.periodNumber} className="hover:bg-bg-card-hover/20">
                      <td className="p-3 font-mono">#{p.periodNumber}</td>
                      <td className="p-3">{p.startDateFormatted}</td>
                      <td className="p-3">{p.endDateFormatted}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <span>{p.payDateFormatted}</span>
                          {p.weekendAdjusted && (
                            <span 
                              className="text-[9px] px-1.5 py-0.5 rounded font-sans font-semibold uppercase tracking-wider bg-accent-utility-e/10 text-accent-utility-e"
                              title="Adjusted to Friday because the payday falls on a weekend."
                            >
                              ADJ
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </CalculatorCard>
  );
}
