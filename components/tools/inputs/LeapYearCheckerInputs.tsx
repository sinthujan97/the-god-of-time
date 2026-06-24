"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { checkLeapYear, LeapYearResult } from "@/lib/tools/calculations";

interface LeapYearCheckerInputsProps {
  groupAccent: string;
}

export default function LeapYearCheckerInputs({ groupAccent }: LeapYearCheckerInputsProps) {
  const [year, setYear] = useState<number>(2024);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<LeapYearResult & { isValid: boolean; errorMessage?: string }>({
    isLeap: false,
    daysInFeb: 28,
    nextLeap: 0,
    prevLeap: 0,
    mathExplanation: "",
    isValid: false,
  });

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (isNaN(year) || year === null) {
      setResult({
        isLeap: false,
        daysInFeb: 28,
        nextLeap: 0,
        prevLeap: 0,
        mathExplanation: "",
        isValid: false,
        errorMessage: "Please enter a year",
      });
      return;
    }

    if (year < 1 || year > 9999) {
      setResult({
        isLeap: false,
        daysInFeb: 28,
        nextLeap: 0,
        prevLeap: 0,
        mathExplanation: "",
        isValid: false,
        errorMessage: "Year must be between 1 and 9999",
      });
      return;
    }

    const calc = checkLeapYear(year);
    setResult({
      ...calc,
      isValid: true,
    });
  }, [year]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    
    // division checks
    const divBy4 = year / 4;
    const divBy100 = year / 100;
    const divBy400 = year / 400;

    return [
      `February has ${result.daysInFeb} days in ${year}`,
      `Next leap year: ${result.nextLeap}`,
      `Previous leap year: ${result.prevLeap > 0 ? result.prevLeap : "N/A"}`,
      `${year} ÷ 4 = ${divBy4.toFixed(divBy4 % 1 === 0 ? 0 : 2)}`,
      `${year} ÷ 100 = ${divBy100.toFixed(divBy100 % 1 === 0 ? 0 : 2)}`,
      `${year} ÷ 400 = ${divBy400.toFixed(divBy400 % 1 === 0 ? 0 : 2)}`,
      result.mathExplanation,
    ];
  };

  const getUpcomingLeapYears = () => {
    const list: number[] = [];
    let start = result.isValid ? result.nextLeap : new Date().getFullYear();
    while (list.length < 5) {
      const isLeap = (start % 4 === 0 && start % 100 !== 0) || (start % 400 === 0);
      if (isLeap) {
        list.push(start);
      }
      start++;
    }
    return list;
  };

  const isLeap = result.isValid && result.isLeap;
  const verdictText = isLeap ? "LEAP YEAR" : "NOT A LEAP YEAR";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? verdictText : "—"}
      resultUnit="VERDICT"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? `${year} is ${verdictText.toLowerCase()}` : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass={`font-display text-[28px] md:text-[44px] font-semibold tracking-wide ${
        isLeap ? "text-[color:var(--group-accent)]" : "text-text-muted"
      }`}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        <div className="flex flex-col">
          <label className="tool-input-label" htmlFor="year-input">
            Enter Year
          </label>
          <input
            id="year-input"
            type="number"
            min="1"
            max="9999"
            value={isNaN(year) ? "" : year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
            className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Next 5 Upcoming Leap Years */}
        {result.isValid && (
          <div className="p-4 rounded-lg border border-border bg-bg-surface mt-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block mb-2">
              Next 5 Upcoming Leap Years
            </span>
            <div className="flex flex-wrap gap-2">
              {getUpcomingLeapYears().map((y) => (
                <span
                  key={y}
                  className="px-3 py-1 font-mono text-xs text-text-primary bg-bg-card border border-border rounded-full"
                >
                  {y}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
