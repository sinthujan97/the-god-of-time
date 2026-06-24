"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { findDayOfWeekDetails, DayOfWeekResult } from "@/lib/tools/calculations";

interface DayOfWeekFinderInputsProps {
  groupAccent: string;
}

export default function DayOfWeekFinderInputs({ groupAccent }: DayOfWeekFinderInputsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<DayOfWeekResult & { isValid: boolean; errorMessage?: string }>({
    dayName: "",
    dayOfWeekISO: 1,
    dayOfYear: 1,
    weekNumber: 1,
    year: 2024,
    daysSinceLast: 7,
    nextDate: new Date(),
    isValid: false,
  });

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  useEffect(() => {
    if (!selectedDate) {
      setResult({
        dayName: "",
        dayOfWeekISO: 1,
        dayOfYear: 1,
        weekNumber: 1,
        year: 2024,
        daysSinceLast: 7,
        nextDate: new Date(),
        isValid: false,
        errorMessage: "Please select a date",
      });
      return;
    }

    if (isDateInvalid(selectedDate)) {
      setResult({
        dayName: "",
        dayOfWeekISO: 1,
        dayOfYear: 1,
        weekNumber: 1,
        year: 2024,
        daysSinceLast: 7,
        nextDate: new Date(),
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    const calc = findDayOfWeekDetails(selectedDate);
    setResult({
      ...calc,
      isValid: true,
    });
  }, [selectedDate]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const fmtDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    return [
      `Day ${result.dayOfWeekISO} of the week (ISO)`,
      `Day ${result.dayOfYear} of the year`,
      `Week ${result.weekNumber} of ${result.year}`,
      `${result.daysSinceLast} days since last ${result.dayName}`,
      `Next ${result.dayName}: ${fmtDate(result.nextDate)}`,
    ];
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.dayName : "—"}
      resultUnit=""
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? result.dayName : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-display italic text-[36px] md:text-[64px] text-[color:var(--group-accent)]"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        <div className="flex flex-col">
          <DatePicker
            id="selected-date"
            label="Select Date"
            value={selectedDate}
            onChange={setSelectedDate}
            accentColor={groupAccent}
          />
        </div>
      </div>
    </CalculatorCard>
  );
}
