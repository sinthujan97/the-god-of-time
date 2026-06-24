"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { generatePayrollPeriods, PayrollPeriod } from "@/lib/tools/calculations";

interface PayrollPeriodPlannerInputsProps {
  groupAccent: string;
}

export default function PayrollPeriodPlannerInputs({ groupAccent }: PayrollPeriodPlannerInputsProps) {
  const [frequency, setFrequency] = useState<"weekly" | "bi-weekly" | "semi-monthly" | "monthly">("bi-weekly");
  const [firstPayDate, setFirstPayDate] = useState<Date | undefined>(undefined);
  const [periodsCount, setPeriodsCount] = useState<number>(6);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    periods: PayrollPeriod[];
    isValid: boolean;
    errorMessage?: string;
  }>({
    periods: [],
    isValid: false,
  });

  useEffect(() => {
    setFirstPayDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!firstPayDate) {
      setResult({
        periods: [],
        isValid: false,
        errorMessage: "Please select the first pay date",
      });
      return;
    }

    if (isDateInvalid(firstPayDate)) {
      setResult({
        periods: [],
        isValid: false,
        errorMessage: "Please enter a valid start date",
      });
      return;
    }

    if (isNaN(periodsCount) || periodsCount === null || periodsCount < 1 || periodsCount > 26) {
      setResult({
        periods: [],
        isValid: false,
        errorMessage: "Number of periods must be between 1 and 26",
      });
      return;
    }

    const periods = generatePayrollPeriods(frequency, formatDateToYYYYMMDD(firstPayDate), periodsCount);
    setResult({
      periods,
      isValid: true,
    });
  }, [frequency, firstPayDate, periodsCount]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleCopyTable = () => {
    if (!result.isValid) return;
    const header = "Period\tStart Date\tEnd Date\tPay Date\tWeekend Adjusted?\n";
    const body = result.periods
      .map(
        (p) =>
          `${p.periodNumber}\t${p.startDateFormatted}\t${p.endDateFormatted}\t${p.payDateFormatted}\t${
            p.weekendAdjusted ? "Yes (Friday)" : "No"
          }`
      )
      .join("\n");

    navigator.clipboard.writeText(header + body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const adjustedCount = result.periods.filter((p) => p.weekendAdjusted).length;

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    return [
      `Pay frequency: ${frequency.toUpperCase()}`,
      `Generated periods: ${periodsCount}`,
      `Weekend adjustments: ${adjustedCount} date${adjustedCount === 1 ? "" : "s"} moved to Friday`,
    ];
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${periodsCount} periods`}
      resultUnit="SCHEDULE READY"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? `${periodsCount} payroll periods generated` : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Input 1: Pay Frequency */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Pay Frequency
          </span>
          <PillToggle
            value={frequency}
            onChange={(val) => setFrequency(val as any)}
            options={[
              { value: "weekly", label: "Weekly" },
              { value: "bi-weekly", label: "Bi-Weekly" },
              { value: "semi-monthly", label: "Semi-Monthly" },
              { value: "monthly", label: "Monthly" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Input 2: First Pay Date & Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="first-pay-date"
              label="First Pay Date"
              value={firstPayDate}
              onChange={setFirstPayDate}
              accentColor={groupAccent}
            />
            {isDateInvalid(firstPayDate) && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="periods-count-input">
              Periods to Generate
            </label>
            <input
              id="periods-count-input"
              type="number"
              min="1"
              max="26"
              value={isNaN(periodsCount) ? "" : periodsCount}
              onChange={(e) => setPeriodsCount(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Generated Table */}
        {result.isValid && result.periods.length > 0 && (
          <div className="pt-4 border-t border-border-subtle space-y-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
              Pay Schedule Calendar
            </span>
            <div className="overflow-x-auto border border-border rounded-lg bg-bg-surface">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px] bg-bg-card-hover/10">
                    <th className="p-3 font-semibold">Period</th>
                    <th className="p-3 font-semibold">Start Date</th>
                    <th className="p-3 font-semibold">End Date</th>
                    <th className="p-3 font-semibold">Pay Date</th>
                    <th className="p-3 font-semibold text-right">Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-text-primary">
                  {result.periods.map((p) => (
                    <tr
                      key={p.periodNumber}
                      className={p.periodNumber % 2 === 0 ? "bg-bg-surface-alternate" : "bg-bg-surface"}
                    >
                      <td className="p-3 font-mono">#{p.periodNumber}</td>
                      <td className="p-3">{p.startDateFormatted}</td>
                      <td className="p-3">{p.endDateFormatted}</td>
                      <td className="p-3 font-medium text-text-primary">{p.payDateFormatted}</td>
                      <td className="p-3 text-right">
                        {p.weekendAdjusted ? (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded bg-accent-utility-d/15 text-accent-utility-d border border-accent-utility-d/25"
                          >
                            Moved to Fri
                          </span>
                        ) : (
                          <span className="text-text-faint">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              onClick={handleCopyTable}
              className="w-full h-10 border border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
              style={{ borderColor: copied ? groupAccent : undefined, color: copied ? groupAccent : undefined } as React.CSSProperties}
            >
              {copied ? "Table Copied!" : "Copy Table to Clipboard (TSV)"}
            </button>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
