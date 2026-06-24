"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { addDaysToDate, AddDaysResult } from "@/lib/tools/calculations";

interface AddDaysToDateInputsProps {
  groupAccent: string;
}

export default function AddDaysToDateInputs({ groupAccent }: AddDaysToDateInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [amount, setAmount] = useState<number>(30);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<AddDaysResult>({
    resultDate: new Date(),
    resultDateFormatted: "—",
    dayOfWeek: "",
    weekNumber: 0,
    dayOfYear: 0,
    isLeapYear: false,
    isValid: false,
  });

  useEffect(() => {
    setStartDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate) {
      setResult({
        resultDate: new Date(),
        resultDateFormatted: "—",
        dayOfWeek: "",
        weekNumber: 0,
        dayOfYear: 0,
        isLeapYear: false,
        isValid: false,
        errorMessage: "Please select a start date",
      });
      return;
    }

    if (isStartInvalid) {
      setResult({
        resultDate: new Date(),
        resultDateFormatted: "—",
        dayOfWeek: "",
        weekNumber: 0,
        dayOfYear: 0,
        isLeapYear: false,
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    if (isNaN(amount) || amount === null || amount < -999999 || amount > 999999) {
      setResult({
        resultDate: new Date(),
        resultDateFormatted: "—",
        dayOfWeek: "",
        weekNumber: 0,
        dayOfYear: 0,
        isLeapYear: false,
        isValid: false,
        errorMessage: "Please enter a number between -999999 and 999999",
      });
      return;
    }

    const calc = addDaysToDate(formatDateToYYYYMMDD(startDate), amount, unit);
    setResult(calc);
  }, [startDate, amount, unit, isStartInvalid]);

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
    const year = result.resultDate.getFullYear();
    return [
      `Day ${result.dayOfYear} of ${year}`,
      `Week ${result.weekNumber} of the year`,
      result.dayOfWeek,
      result.isLeapYear ? "Leap year" : "Not a leap year",
    ];
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Result: ${result.resultDateFormatted}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.resultDateFormatted : "—"}
      resultUnit="RESULT DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-display italic text-[24px] md:text-[36px]"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Start Date */}
        <div className="flex flex-col">
          <DatePicker
            id="start-date"
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            accentColor={groupAccent}
          />
          {isStartInvalid && (
            <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block">
              Please enter a valid date
            </span>
          )}
        </div>

        {/* Row 2: Amount & Unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="amount-input">
              Amount
            </label>
            <input
              id="amount-input"
              type="number"
              min="-999999"
              max="999999"
              value={isNaN(amount) ? "" : amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col">
            <span className="tool-input-label block mb-1">
              Unit
            </span>
            <PillToggle
              value={unit}
              onChange={(val) => setUnit(val as any)}
              options={[
                { value: "days", label: "Days" },
                { value: "weeks", label: "Weeks" },
                { value: "months", label: "Months" },
                { value: "years", label: "Years" },
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
