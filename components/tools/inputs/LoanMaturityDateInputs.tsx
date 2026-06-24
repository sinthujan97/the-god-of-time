"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateLoanMaturity } from "@/lib/tools/calculations";

interface LoanMaturityDateInputsProps {
  groupAccent: string;
}

export default function LoanMaturityDateInputs({ groupAccent }: LoanMaturityDateInputsProps) {
  const [originationDate, setOriginationDate] = useState<Date | undefined>(undefined);
  const [termMonths, setTermMonths] = useState<number>(360); // 30-year default

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    finalMaturityDate: Date;
    maturityDateFormatted: string;
    totalDaysInTerm: number;
    remainingDaysUntilMaturity: number;
  }>({
    finalMaturityDate: new Date(),
    maturityDateFormatted: "—",
    totalDaysInTerm: 0,
    remainingDaysUntilMaturity: 0,
  });

  useEffect(() => {
    setOriginationDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!originationDate) return;
    const dateStr = formatDateToYYYYMMDD(originationDate);
    const res = calculateLoanMaturity(dateStr, termMonths);
    setResult(res);
  }, [originationDate, termMonths]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!originationDate) return [];
    return [
      `Total term length: ${result.totalDaysInTerm.toLocaleString()} days`,
      `Days remaining until payoff: ${result.remainingDaysUntilMaturity.toLocaleString()} days`
    ];
  };

  const getCopyText = () => {
    if (!originationDate) return "";
    return `Loan Maturity Date: pay-off date is ${result.maturityDateFormatted} (${termMonths} months). Total term days: ${result.totalDaysInTerm}. Days remaining: ${result.remainingDaysUntilMaturity}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.maturityDateFormatted}
      resultUnit="FINAL PAYOFF/MATURITY DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="origination-date"
              label="Loan Origination Date"
              value={originationDate}
              onChange={setOriginationDate}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="term-months-input">
              Loan Term (Months)
            </label>
            <input
              id="term-months-input"
              type="number"
              min="1"
              max="1200"
              value={isNaN(termMonths) ? "" : termMonths}
              onChange={(e) => setTermMonths(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
            <span className="text-[11px] text-text-muted mt-1.5 font-sans">
              e.g., 360 months for 30 years, 180 months for 15 years.
            </span>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
