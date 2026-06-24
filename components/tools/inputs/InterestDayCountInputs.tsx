"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateInterestDays } from "@/lib/tools/calculations";

interface InterestDayCountInputsProps {
  groupAccent: string;
}

export default function InterestDayCountInputs({ groupAccent }: InterestDayCountInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [convention, setConvention] = useState<"ACT/360" | "ACT/365" | "30/360">("ACT/360");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    exactDayCount: number;
    calculatedYearFraction: number;
  }>({
    exactDayCount: 0,
    calculatedYearFraction: 0.0,
  });

  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    
    const future = new Date();
    future.setDate(today.getDate() + 90); // 90 days default
    setEndDate(future);
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate || !endDate) return;
    const sStr = formatDateToYYYYMMDD(startDate);
    const eStr = formatDateToYYYYMMDD(endDate);
    const res = calculateInterestDays(sStr, eStr, convention);
    setResult(res);
  }, [startDate, endDate, convention]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!startDate || !endDate) return [];
    return [
      `Accrual Days (Standard Actual): ${result.exactDayCount} days`,
      `Convention applied: ${convention} day-count rule`
    ];
  };

  const getCopyText = () => {
    if (!startDate || !endDate) return "";
    return `Interest Day Count: ${result.exactDayCount} days under ${convention}. Calculated year fraction: ${result.calculatedYearFraction}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.calculatedYearFraction}`}
      resultUnit="CALCULATED YEAR FRACTION"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Convention Toggle */}
        <div className="flex flex-col">
          <span className="tool-input-label block mb-1">Day-Count Convention</span>
          <PillToggle
            value={convention}
            onChange={(val) => setConvention(val as any)}
            options={[
              { value: "ACT/360", label: "Actual/360 (Money Market)" },
              { value: "ACT/365", label: "Actual/365 (Treasuries)" },
              { value: "30/360", label: "30/360 NASD (Corporate)" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Row 2: Date Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="accrual-start"
              label="Accrual Start Date"
              value={startDate}
              onChange={setStartDate}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <DatePicker
              id="accrual-end"
              label="Accrual End Date"
              value={endDate}
              onChange={setEndDate}
              accentColor={groupAccent}
            />
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
