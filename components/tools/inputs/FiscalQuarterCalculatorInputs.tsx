"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateFiscalQuarter, FiscalQuarterResult } from "@/lib/tools/calculations";

interface FiscalQuarterCalculatorInputsProps {
  groupAccent: string;
}

export default function FiscalQuarterCalculatorInputs({ groupAccent }: FiscalQuarterCalculatorInputsProps) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<string>("10"); // Default October (Gov)

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<FiscalQuarterResult>({
    fiscalQuarter: 1,
    fiscalYear: 2026,
    quarterStartDate: new Date(),
    quarterEndDate: new Date(),
    quarterStartFormatted: "",
    quarterEndFormatted: "",
    daysIntoQuarter: 0,
    daysRemainingInQuarter: 0,
    percentageComplete: 0,
    calendarYear: 2026,
    calendarQuarter: 1,
  });

  useEffect(() => {
    setTargetDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isTargetInvalid = isDateInvalid(targetDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!targetDate) return;
    if (isTargetInvalid) return;

    const calc = calculateFiscalQuarter(formatDateToYYYYMMDD(targetDate), parseInt(startMonth, 10));
    setResult(calc);
  }, [targetDate, startMonth, isTargetInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!targetDate) return "";
    return `Fiscal Quarter: Q${result.fiscalQuarter} (FY${result.fiscalYear}). Quarter runs from ${result.quarterStartFormatted} to ${result.quarterEndFormatted}.`;
  };

  const monthsOptions = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`Q${result.fiscalQuarter} (FY${result.fiscalYear})`}
      resultUnit="FISCAL PERIOD"
      resultBreakdown={[
        `Quarter span: ${result.quarterStartFormatted} to ${result.quarterEndFormatted}`,
        `${result.daysIntoQuarter} days elapsed in quarter, ${result.daysRemainingInQuarter} days remaining`,
        `Corresponding calendar quarter: Q${result.calendarQuarter} (${result.calendarYear})`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isTargetInvalid ? "Invalid target date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Target Date & Fiscal Start Month */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="fiscal-target-date"
              label="Evaluation Date"
              value={targetDate}
              onChange={setTargetDate}
              accentColor={groupAccent}
            />
            {isTargetInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label block mb-1">
              Fiscal Year Start Month
            </label>
            <ToolSelect
              value={startMonth}
              onChange={setStartMonth}
              options={monthsOptions}
              placeholder="Select Start Month"
            />
          </div>
        </div>

        {/* Visual Progress Bar (Aesthetic Gauge) */}
        {targetDate && !isTargetInvalid && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-3">
            <div className="flex justify-between items-center text-xs font-sans text-text-muted">
              <span>Quarter Completion Progress</span>
              <span className="font-semibold text-text-primary">{result.percentageComplete}%</span>
            </div>
            
            <div className="w-full h-3 bg-bg-surface border border-border rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${result.percentageComplete}%`,
                  backgroundColor: groupAccent
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-sans text-text-muted pt-2">
              <div className="bg-bg-surface border border-border p-3 rounded-md text-center">
                <span className="block text-[10px] uppercase text-text-faint">Days Elapsed</span>
                <span className="text-base font-bold text-text-primary mt-1 block">
                  {result.daysIntoQuarter}
                </span>
              </div>
              <div className="bg-bg-surface border border-border p-3 rounded-md text-center">
                <span className="block text-[10px] uppercase text-text-faint">Days Remaining</span>
                <span className="text-base font-bold text-text-primary mt-1 block">
                  {result.daysRemainingInQuarter}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
