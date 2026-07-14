"use client";

import React, { useState, useEffect, useRef } from "react";
import { BirthDatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateExactAge } from "@/lib/tools/calculations";

interface AgeCalculatorInputsProps {
  groupAccent: string;
}

// Fixed placeholder seed (not new Date()) so the "Live Age Chronometer" block
// renders on the very first paint instead of popping in after a mount effect —
// that pop-in was causing both a measurable layout shift and a delayed LCP.
// The mount effect below replaces it with a real "30 years ago" date.
const DEFAULT_BIRTH_DATE_SEED = new Date(1996, 0, 1, 12, 0, 0);

export default function AgeCalculatorInputs({ groupAccent }: AgeCalculatorInputsProps) {
  const [birthDate, setBirthDate] = useState<Date | undefined>(DEFAULT_BIRTH_DATE_SEED);
  const [birthTime, setBirthTime] = useState<string>("12:00");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [exactAge, setExactAge] = useState<{
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalDaysAlive: number;
    nextBirthdayCountdownFormatted: string;
  }>({
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDaysAlive: 0,
    nextBirthdayCountdownFormatted: "",
  });

  useEffect(() => {
    // Default birth date: 30 years ago
    const d = new Date();
    d.setFullYear(d.getFullYear() - 30);
    setBirthDate(d);
  }, []);

  // Update effect running every second
  useEffect(() => {
    if (!birthDate) return;

    const interval = setInterval(() => {
      const year = birthDate.getFullYear();
      const month = String(birthDate.getMonth() + 1).padStart(2, "0");
      const day = String(birthDate.getDate()).padStart(2, "0");
      const dtStr = `${year}-${month}-${day}T${birthTime || "00:00"}:00`;
      
      const res = calculateExactAge(dtStr);
      setExactAge(res);
    }, 1000);

    // Initial trigger
    const initialYear = birthDate.getFullYear();
    const initialMonth = String(birthDate.getMonth() + 1).padStart(2, "0");
    const initialDay = String(birthDate.getDate()).padStart(2, "0");
    const initialDtStr = `${initialYear}-${initialMonth}-${initialDay}T${birthTime || "00:00"}:00`;
    setExactAge(calculateExactAge(initialDtStr));

    return () => clearInterval(interval);
  }, [birthDate, birthTime]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!birthDate) return ["Select birth date"];
    return [
      `Total Days Alive: ${exactAge.totalDaysAlive.toLocaleString()} days`,
      `Total Weeks Alive: ${exactAge.weeks.toLocaleString()} weeks`,
      `Next birthday: ${exactAge.nextBirthdayCountdownFormatted}`
    ];
  };

  const getCopyText = () => {
    if (!birthDate) return "";
    return `Age: ${exactAge.years}y ${exactAge.months}m ${exactAge.days}d ${exactAge.hours}h ${exactAge.minutes}m ${exactAge.seconds}s. Total days: ${exactAge.totalDaysAlive}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${exactAge.years}`}
      resultUnit="YEARS OLD"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Date & Time of Birth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <BirthDatePicker
              id="birth-date"
              label="Date of Birth"
              value={birthDate}
              onChange={setBirthDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="birth-time">
              Time of Birth (Optional)
            </label>
            <input
              id="birth-time"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        </div>

        {/* Live-Ticking Odometer Clock */}
        {birthDate && (
          <div className="pt-4 border-t border-border/40 space-y-4">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Live Age Chronometer
            </h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
              {[
                { val: exactAge.months, label: "Months" },
                { val: exactAge.days, label: "Days" },
                { val: exactAge.hours, label: "Hours" },
                { val: exactAge.minutes, label: "Mins" },
                { val: exactAge.seconds, label: "Secs" }
              ].map((item, idx) => (
                <div key={idx} className="bg-bg-surface border border-border rounded-lg p-3 flex flex-col justify-center items-center">
                  <span className="font-display text-2xl text-text-primary tabular-nums tracking-tighter">
                    {String(item.val).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] font-sans font-medium uppercase tracking-wider text-text-muted mt-1 block">
                    {item.label}
                  </span>
                </div>
              ))}
              <div className="bg-bg-surface border border-border rounded-lg p-3 flex flex-col justify-center items-center col-span-3 sm:col-span-1">
                <span className="font-display text-base text-text-primary truncate max-w-full">
                  {exactAge.weeks}
                </span>
                <span className="text-[9px] font-sans font-medium uppercase tracking-wider text-text-muted mt-1 block">
                  Weeks
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
