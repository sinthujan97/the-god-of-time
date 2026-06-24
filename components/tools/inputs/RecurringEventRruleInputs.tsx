"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { generateRRULE } from "@/lib/tools/calculations";

interface RecurringEventRruleInputsProps {
  groupAccent: string;
}

export default function RecurringEventRruleInputs({ groupAccent }: RecurringEventRruleInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  const [interval, setInterval] = useState<number>(1);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1, 3]); // Mon, Wed
  const [endType, setEndType] = useState<"never" | "count" | "until">("count");
  const [count, setCount] = useState<number>(10);
  const [untilDate, setUntilDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState({
    rrule: "",
    humanReadable: "",
    nextOccurrences: [] as Date[],
    nextOccurrencesFormatted: [] as string[],
  });

  useEffect(() => {
    setStartDate(new Date());
    const tomorrowMonth = new Date();
    tomorrowMonth.setMonth(tomorrowMonth.getMonth() + 1);
    setUntilDate(tomorrowMonth);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);
  const isUntilInvalid = endType === "until" && isDateInvalid(untilDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate) return;
    if (isStartInvalid || isUntilInvalid) return;

    const calc = generateRRULE(
      formatDateToYYYYMMDD(startDate),
      frequency,
      interval,
      daysOfWeek,
      endType,
      count,
      formatDateToYYYYMMDD(untilDate)
    );
    setResult(calc);
  }, [startDate, frequency, interval, daysOfWeek, endType, count, untilDate, isStartInvalid, isUntilInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleDayToggle = (dayNum: number) => {
    if (daysOfWeek.includes(dayNum)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== dayNum));
    } else {
      setDaysOfWeek([...daysOfWeek, dayNum].sort());
    }
  };

  const daysLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.rrule !== "" ? result.rrule : "—"}
      resultUnit="GENERATED RRULE STRING"
      resultBreakdown={[
        `Recurrence description: ${result.humanReadable}`,
        `Pattern code: ${result.rrule}`,
        `Upcoming scheduled occurrences previewed below`
      ]}
      copyText={result.rrule}
      animationKey={animationKey}
      errorMessage={isStartInvalid ? "Invalid start date" : undefined}
      fontClass="font-mono text-xs sm:text-sm text-text-primary bg-bg-surface p-3 border border-border rounded overflow-x-auto select-all max-w-full block"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Start Date & Frequency */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="rrule-start-date"
              label="Event Start Date"
              value={startDate}
              onChange={setStartDate}
              accentColor={groupAccent}
            />
            {isStartInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <span className="tool-input-label block mb-1">
              Frequency
            </span>
            <PillToggle
              value={frequency}
              onChange={(val) => setFrequency(val as any)}
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
                { value: "yearly", label: "Yearly" }
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>

        {/* Row 2: Interval & Weekly Days Option */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="rrule-interval-input">
              Repeat Every (Interval)
            </label>
            <input
              id="rrule-interval-input"
              type="number"
              min="1"
              value={interval || ""}
              onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          {frequency === "weekly" && (
            <div className="flex flex-col">
              <span className="tool-input-label block mb-1">
                Days of the Week
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {daysLabel.map((day, idx) => {
                  const isActive = daysOfWeek.includes(idx);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(idx)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                        isActive 
                          ? "text-bg-card font-bold border-transparent" 
                          : "text-text-muted bg-transparent border-border hover:border-border-hover"
                      }`}
                      style={{ backgroundColor: isActive ? groupAccent : "transparent" }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: End Condition Settings */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            End Condition
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex flex-col justify-end">
              <PillToggle
                value={endType}
                onChange={(val) => setEndType(val as any)}
                options={[
                  { value: "never", label: "Never Ends" },
                  { value: "count", label: "After Count" },
                  { value: "until", label: "Until Date" }
                ]}
                accentColor={groupAccent}
              />
            </div>

            {endType === "count" && (
              <div className="flex flex-col md:col-span-2">
                <input
                  id="rrule-count-input"
                  type="number"
                  min="1"
                  placeholder="Number of times"
                  value={count || ""}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
                />
              </div>
            )}

            {endType === "until" && (
              <div className="flex flex-col md:col-span-2">
                <DatePicker
                  id="rrule-until-date"
                  value={untilDate}
                  onChange={setUntilDate}
                  accentColor={groupAccent}
                />
              </div>
            )}
          </div>
        </div>

        {/* Occurrence Previews list */}
        {result.nextOccurrencesFormatted.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-3">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Next 5 Scheduled Dates Preview
            </h4>
            <div className="divide-y divide-border/40 font-mono text-xs">
              {result.nextOccurrencesFormatted.map((occStr, idx) => (
                <div key={idx} className="py-2 flex justify-between text-text-muted">
                  <span>Occurrence {idx + 1}</span>
                  <span className="text-text-primary font-medium">{occStr}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
