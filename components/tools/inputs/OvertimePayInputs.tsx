"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateOvertimePayDetailed } from "@/lib/tools/calculations";
import { PillToggle } from "@/components/ui";

interface OvertimePayInputsProps {
  groupAccent: string;
}

export default function OvertimePayInputs({ groupAccent }: OvertimePayInputsProps) {
  const [totalHours, setTotalHours] = useState<number>(45);
  const [hourlyRate, setHourlyRate] = useState<number>(20);
  const [regularThreshold, setRegularThreshold] = useState<number>(40);
  const [overtimeMultiplier, setOvertimeMultiplier] = useState<number>(1.5);
  const [enableDoubleTime, setEnableDoubleTime] = useState<boolean>(false);
  const [doubleTimeThreshold, setDoubleTimeThreshold] = useState<number>(50);
  const [doubleTimeMultiplier, setDoubleTimeMultiplier] = useState<number>(2.0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    regularHours: 0,
    overtimeHours: 0,
    doubleTimeHours: 0,
    regularPay: 0,
    overtimePay: 0,
    doubleTimePay: 0,
    totalGrossPay: 0,
    effectiveHourlyRate: 0,
    isValid: false,
    errorMessage: "",
  });

  useEffect(() => {
    const res = calculateOvertimePayDetailed(
      totalHours,
      hourlyRate,
      regularThreshold,
      overtimeMultiplier,
      doubleTimeThreshold,
      doubleTimeMultiplier,
      enableDoubleTime
    );
    setResult({
      ...res,
      errorMessage: res.errorMessage || "",
    });
  }, [totalHours, hourlyRate, regularThreshold, overtimeMultiplier, doubleTimeThreshold, doubleTimeMultiplier, enableDoubleTime]);

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
    if (!result.isValid) return [];
    const rows = [
      `Regular: ${result.regularHours.toFixed(2)} hrs @ ${formatCurrency(hourlyRate)}/hr = ${formatCurrency(result.regularPay)}`,
      `Overtime (1.5x): ${result.overtimeHours.toFixed(2)} hrs @ ${formatCurrency(hourlyRate * overtimeMultiplier)}/hr = ${formatCurrency(result.overtimePay)}`,
    ];
    if (enableDoubleTime) {
      rows.push(`Double-Time (2x): ${result.doubleTimeHours.toFixed(2)} hrs @ ${formatCurrency(hourlyRate * doubleTimeMultiplier)}/hr = ${formatCurrency(result.doubleTimePay)}`);
    }
    rows.push(`Effective Hourly Rate: ${formatCurrency(result.effectiveHourlyRate)}/hr`);
    return rows;
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Gross Pay: ${formatCurrency(result.totalGrossPay)} (Regular: ${formatCurrency(result.regularPay)}, OT: ${formatCurrency(result.overtimePay)}${enableDoubleTime ? `, Double-Time: ${formatCurrency(result.doubleTimePay)}` : ""})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalGrossPay)}
      resultUnit="GROSS PAY ESTIMATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Core Inputs */}
        <div className="grid grid-cols-2 gap-4">
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
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="total-hours">
              Hours Worked (hrs)
            </label>
            <input
              id="total-hours"
              type="number"
              min="0"
              step="0.1"
              value={isNaN(totalHours) ? "" : totalHours}
              onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Regular Overtime Rule */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="reg-threshold">
              Overtime Threshold (hrs)
            </label>
            <input
              id="reg-threshold"
              type="number"
              min="0"
              value={isNaN(regularThreshold) ? "" : regularThreshold}
              onChange={(e) => setRegularThreshold(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="ot-multiplier">
              Overtime Multiplier
            </label>
            <input
              id="ot-multiplier"
              type="number"
              min="0"
              step="0.1"
              value={isNaN(overtimeMultiplier) ? "" : overtimeMultiplier}
              onChange={(e) => setOvertimeMultiplier(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Double-time toggle */}
        <div className="pt-4 border-t border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
              Double Time
            </span>
            <PillToggle
              value={enableDoubleTime ? "true" : "false"}
              onChange={(val) => setEnableDoubleTime(val === "true")}
              options={[
                { value: "false", label: "Disabled" },
                { value: "true", label: "Enabled" },
              ]}
              accentColor={groupAccent}
            />
          </div>

          {enableDoubleTime && (
            <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="dt-threshold">
                  Double-Time Threshold (hrs)
                </label>
                <input
                  id="dt-threshold"
                  type="number"
                  min="0"
                  value={isNaN(doubleTimeThreshold) ? "" : doubleTimeThreshold}
                  onChange={(e) => setDoubleTimeThreshold(parseFloat(e.target.value) || 0)}
                  className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                  style={{ "--local-accent": groupAccent } as React.CSSProperties}
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="dt-multiplier">
                  Double-Time Multiplier
                </label>
                <input
                  id="dt-multiplier"
                  type="number"
                  min="0"
                  step="0.1"
                  value={isNaN(doubleTimeMultiplier) ? "" : doubleTimeMultiplier}
                  onChange={(e) => setDoubleTimeMultiplier(parseFloat(e.target.value) || 0)}
                  className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                  style={{ "--local-accent": groupAccent } as React.CSSProperties}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </CalculatorCard>
  );
}
