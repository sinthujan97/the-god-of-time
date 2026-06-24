"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateISOWeekDetails, ISOWeekResult } from "@/lib/tools/calculations";

interface IsoWeekNumberInputsProps {
  groupAccent: string;
}

export default function IsoWeekNumberInputs({ groupAccent }: IsoWeekNumberInputsProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<ISOWeekResult & { isValid: boolean; errorMessage?: string }>({
    weekNumber: 1,
    year: 2024,
    weekStart: new Date(),
    weekEnd: new Date(),
    dayOfYear: 1,
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
        weekNumber: 1,
        year: 2024,
        weekStart: new Date(),
        weekEnd: new Date(),
        dayOfYear: 1,
        isValid: false,
        errorMessage: "Please select a date",
      });
      return;
    }

    if (isDateInvalid(selectedDate)) {
      setResult({
        weekNumber: 1,
        year: 2024,
        weekStart: new Date(),
        weekEnd: new Date(),
        dayOfYear: 1,
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    const calc = calculateISOWeekDetails(selectedDate);
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
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    return [
      `Week ${result.weekNumber} of ${result.year}`,
      `Week starts: ${fmtDate(result.weekStart)} (Monday)`,
      `Week ends: ${fmtDate(result.weekEnd)} (Sunday)`,
      `Day ${result.dayOfYear} of the year`,
    ];
  };

  const getWeekDates = () => {
    if (!result.isValid) return [];
    const list = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(result.weekStart);
      d.setDate(result.weekStart.getDate() + i);
      list.push(d);
    }
    return list;
  };

  const isSameDay = (d1: Date, d2: Date | undefined) => {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.weekNumber : "—"}
      resultUnit="ISO WEEK"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? `ISO Week ${result.weekNumber}` : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
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

        {/* Mini Calendar Strip */}
        {result.isValid && (
          <div className="p-4 rounded-lg border border-border bg-bg-surface mt-4">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block mb-3 text-center">
              Week Calendar Strip
            </span>
            <div className="grid grid-cols-7 gap-2">
              {getWeekDates().map((d, index) => {
                const active = isSameDay(d, selectedDate);
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-2 rounded-md border text-center transition-all ${
                      active
                        ? "border-[color:var(--group-accent)] bg-bg-card shadow-sm"
                        : "border-border bg-transparent"
                    }`}
                  >
                    <span className={`text-[10px] font-sans font-medium uppercase ${
                      active ? "text-[color:var(--group-accent)]" : "text-text-faint"
                    }`}>
                      {weekdays[index]}
                    </span>
                    <span className={`text-sm font-mono mt-1 ${
                      active ? "text-text-primary font-semibold" : "text-text-muted"
                    }`}>
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
