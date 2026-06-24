"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateDateDifferenceDetail, DateDifferenceDetail } from "@/lib/tools/calculations";

interface DaysUntilInputsProps {
  groupAccent: string;
}

export default function DaysUntilInputs({ groupAccent }: DaysUntilInputsProps) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [now, setNow] = useState<Date>(new Date());
  
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<DateDifferenceDetail & { isValid: boolean; errorMessage?: string }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    isValid: false,
  });

  // Client-side initialization of target date to Dec 31 of current year
  useEffect(() => {
    const year = new Date().getFullYear();
    setTargetDate(new Date(year, 11, 31));
  }, []);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  useEffect(() => {
    if (!targetDate) {
      setResult({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
        isValid: false,
        errorMessage: "Please select a target date",
      });
      return;
    }

    if (isDateInvalid(targetDate)) {
      setResult({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isPast: false,
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    // Set target date's time to midnight for simple start-of-day calculations,
    // or let it count down precisely to the start of that day.
    const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const detail = calculateDateDifferenceDetail(targetMidnight, now);

    setResult({
      ...detail,
      isValid: true,
    });
  }, [targetDate, now]);

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
    
    const pad = (n: number) => String(n).padStart(2, "0");
    const liveTime = `${pad(result.hours)}h ${pad(result.minutes)}m ${pad(result.seconds)}s`;
    
    return [
      liveTime,
      result.isPast ? "Event has already occurred" : "Time remaining",
    ];
  };

  const unitText = result.isValid && result.isPast ? "DAYS SINCE" : "DAYS UNTIL";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.days : "—"}
      resultUnit={unitText}
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? `${result.days} days` : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        <div className="flex flex-col">
          <DatePicker
            id="target-date"
            label="Target Date"
            value={targetDate}
            onChange={setTargetDate}
            accentColor={groupAccent}
          />
        </div>
      </div>
    </CalculatorCard>
  );
}
