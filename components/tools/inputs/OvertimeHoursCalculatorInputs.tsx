"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateOvertimePay, OvertimeCalculatorResult } from "@/lib/tools/calculations";

interface OvertimeHoursCalculatorInputsProps {
  groupAccent: string;
}

export default function OvertimeHoursCalculatorInputs({ groupAccent }: OvertimeHoursCalculatorInputsProps) {
  const [totalHours, setTotalHours] = useState<number>(45);
  const [threshold, setThreshold] = useState<number>(40);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [multiplierType, setMultiplierType] = useState<"1.5" | "2" | "custom">("1.5");
  const [customMultiplier, setCustomMultiplier] = useState<number>(1.5);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState<OvertimeCalculatorResult & { isValid: boolean; errorMessage?: string }>({
    regularHours: 0,
    overtimeHours: 0,
    regularPay: 0,
    overtimePay: 0,
    grossPay: 0,
    isValid: false,
  });

  const getActiveMultiplier = () => {
    if (multiplierType === "1.5") return 1.5;
    if (multiplierType === "2") return 2.0;
    return isNaN(customMultiplier) ? 1.5 : customMultiplier;
  };

  useEffect(() => {
    if (isNaN(totalHours) || totalHours === null || totalHours < 0) {
      setResult({
        regularHours: 0,
        overtimeHours: 0,
        regularPay: 0,
        overtimePay: 0,
        grossPay: 0,
        isValid: false,
        errorMessage: "Please enter valid total hours",
      });
      return;
    }

    if (isNaN(threshold) || threshold === null || threshold < 0) {
      setResult({
        regularHours: 0,
        overtimeHours: 0,
        regularPay: 0,
        overtimePay: 0,
        grossPay: 0,
        isValid: false,
        errorMessage: "Please enter a valid regular hours threshold",
      });
      return;
    }

    const rate = isNaN(hourlyRate) || hourlyRate === null ? 0 : hourlyRate;
    const mult = getActiveMultiplier();

    const calc = calculateOvertimePay(totalHours, threshold, rate, mult);
    setResult({
      ...calc,
      isValid: true,
    });
  }, [totalHours, threshold, hourlyRate, multiplierType, customMultiplier]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const fmtCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    const rows = [
      `Regular hours: ${result.regularHours} hrs`,
      `Overtime hours: ${result.overtimeHours} hrs`,
    ];

    if (hourlyRate && hourlyRate > 0) {
      rows.push(`Regular pay: ${fmtCurrency(result.regularPay)}`);
      rows.push(`Overtime pay: ${fmtCurrency(result.overtimePay)} (at ${getActiveMultiplier()}x)`);
    }

    return rows;
  };

  const primaryValue = result.isValid
    ? hourlyRate && hourlyRate > 0
      ? fmtCurrency(result.grossPay)
      : `${result.overtimeHours} OT hrs`
    : "—";

  const primaryUnit = hourlyRate && hourlyRate > 0 ? "ESTIMATED GROSS PAY" : "OVERTIME HOURS";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={primaryValue}
      resultUnit={primaryUnit}
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? (hourlyRate > 0 ? `Gross Pay: ${fmtCurrency(result.grossPay)}` : `${result.overtimeHours} OT hours`) : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Total Hours & Regular Threshold */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="total-hours-input">
              Total Hours Worked
            </label>
            <input
              id="total-hours-input"
              type="number"
              min="0"
              step="any"
              value={isNaN(totalHours) ? "" : totalHours}
              onChange={(e) => setTotalHours(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="threshold-input">
              Regular Hours Limit
            </label>
            <input
              id="threshold-input"
              type="number"
              min="0"
              step="any"
              value={isNaN(threshold) ? "" : threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: Hourly Rate */}
        <div className="flex flex-col">
          <label className="tool-input-label" htmlFor="hourly-rate-input">
            Hourly Rate ($) <span className="text-text-faint font-light">(optional)</span>
          </label>
          <input
            id="hourly-rate-input"
            type="number"
            min="0"
            step="any"
            value={isNaN(hourlyRate) ? "" : hourlyRate}
            onChange={(e) => setHourlyRate(parseFloat(e.target.value))}
            className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Row 3: Overtime Multiplier */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
              OT Multiplier
            </span>
            <PillToggle
              value={multiplierType}
              onChange={(val) => setMultiplierType(val as any)}
              options={[
                { value: "1.5", label: "1.5x" },
                { value: "2", label: "2.0x" },
                { value: "custom", label: "Custom" },
              ]}
              accentColor={groupAccent}
            />
          </div>

          {multiplierType === "custom" && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pl-0 sm:pl-[144px]">
              <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0" htmlFor="custom-mult-input">
                Custom Rate
              </label>
              <input
                id="custom-mult-input"
                type="number"
                min="0"
                step="any"
                value={isNaN(customMultiplier) ? "" : customMultiplier}
                onChange={(e) => setCustomMultiplier(parseFloat(e.target.value))}
                className="h-10 w-[120px] px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
            </div>
          )}
        </div>
      </div>
    </CalculatorCard>
  );
}
