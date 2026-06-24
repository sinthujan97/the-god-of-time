"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateDateMidpoint } from "@/lib/tools/calculations";

interface DateMidpointCalculatorInputsProps {
  groupAccent: string;
}

export default function DateMidpointCalculatorInputs({ groupAccent }: DateMidpointCalculatorInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    midpointDate: Date;
    midpointFormatted: string;
    daysFromStart: number;
    daysToEnd: number;
    dayOfWeek: string;
    isValid: boolean;
    errorMessage?: string;
  }>({
    midpointDate: new Date(),
    midpointFormatted: "—",
    daysFromStart: 0,
    daysToEnd: 0,
    dayOfWeek: "",
    isValid: false,
  });

  useEffect(() => {
    setStartDate(new Date());
    const future = new Date();
    future.setDate(future.getDate() + 30);
    setEndDate(future);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);
  const isEndInvalid = isDateInvalid(endDate);

  useEffect(() => {
    if (!startDate || !endDate) {
      setResult({
        midpointDate: new Date(),
        midpointFormatted: "—",
        daysFromStart: 0,
        daysToEnd: 0,
        dayOfWeek: "",
        isValid: false,
        errorMessage: "Please select both dates",
      });
      return;
    }

    if (isStartInvalid || isEndInvalid) {
      setResult({
        midpointDate: new Date(),
        midpointFormatted: "—",
        daysFromStart: 0,
        daysToEnd: 0,
        dayOfWeek: "",
        isValid: false,
        errorMessage: "Please enter valid dates",
      });
      return;
    }

    // Set both dates to midnight for standard calculations
    const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const { midpointDate, daysFromStart, daysToEnd } = calculateDateMidpoint(startMidnight, endMidnight);

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = weekdays[midpointDate.getDay()];

    const midpointFormatted = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(midpointDate);

    setResult({
      midpointDate,
      midpointFormatted,
      daysFromStart,
      daysToEnd,
      dayOfWeek,
      isValid: true,
    });
  }, [startDate, endDate, isStartInvalid, isEndInvalid]);

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
    return [
      `${result.daysFromStart} days from start date to midpoint`,
      `${result.daysToEnd} days from midpoint to end date`,
      `Day of week: ${result.dayOfWeek}`,
    ];
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.midpointFormatted : "—"}
      resultUnit="MIDPOINT DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? result.midpointFormatted : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-display italic text-[24px] md:text-[36px]"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        <div className="tool-inputs-grid">
          {/* Start Date */}
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

          {/* End Date */}
          <div className="flex flex-col">
            <DatePicker
              id="end-date"
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              accentColor={groupAccent}
            />
            {isEndInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block">
                Please enter a valid date
              </span>
            )}
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
