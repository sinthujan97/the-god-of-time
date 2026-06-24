"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateTimeDuration, TimeDurationResult } from "@/lib/tools/calculations";

interface TimeDurationInputsProps {
  groupAccent: string;
}

export default function TimeDurationInputs({ groupAccent }: TimeDurationInputsProps) {
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");
  const [precision, setPrecision] = useState<"minutes" | "seconds">("minutes");
  const [format, setFormat] = useState<"24h" | "12h">("24h");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<TimeDurationResult>({
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    decimalHours: 0,
    isOvernight: false,
    isValid: false,
  });

  const getAmPm = (timeStr: string) => {
    if (!timeStr) return "AM";
    const hr = parseInt(timeStr.split(":")[0], 10);
    return hr >= 12 ? "PM" : "AM";
  };

  const handleAmPmChange = (timeStr: string, setFn: (v: string) => void, ampm: "AM" | "PM") => {
    if (!timeStr) return;
    const parts = timeStr.split(":");
    let hr = parseInt(parts[0], 10);
    if (ampm === "PM" && hr < 12) hr += 12;
    if (ampm === "AM" && hr >= 12) hr -= 12;
    parts[0] = String(hr).padStart(2, "0");
    setFn(parts.join(":"));
  };

  useEffect(() => {
    const calc = calculateTimeDuration(startTime, endTime, precision === "seconds");
    setResult(calc);
  }, [startTime, endTime, precision]);

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
    const rows = [];
    if (precision === "seconds") {
      rows.push(`${result.hours}h ${result.minutes}m ${result.seconds}s`);
    } else {
      rows.push(`${result.hours}h ${result.minutes}m`);
    }
    rows.push(`${result.totalMinutes} total minutes`);
    rows.push(`${result.decimalHours} decimal hours`);
    if (result.isOvernight) {
      rows.push("Overnight duration");
    }
    if (startTime === endTime) {
      rows.push("Start and end times are the same");
    }
    return rows;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.decimalHours : "—"}
      resultUnit="HOURS ELAPSED"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? `${result.decimalHours} hours` : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Start and End Time inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="start-time-input">
              Start Time
            </label>
            <div className="flex items-center gap-2">
              <input
                id="start-time-input"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                step={precision === "seconds" ? "1" : undefined}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
              {format === "12h" && (
                <div className="flex-shrink-0 pt-0.5">
                  <PillToggle
                    value={getAmPm(startTime)}
                    onChange={(val) => handleAmPmChange(startTime, setStartTime, val as any)}
                    options={[
                      { value: "AM", label: "AM" },
                      { value: "PM", label: "PM" },
                    ]}
                    accentColor={groupAccent}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="end-time-input">
              End Time
            </label>
            <div className="flex items-center gap-2">
              <input
                id="end-time-input"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                step={precision === "seconds" ? "1" : undefined}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
              {format === "12h" && (
                <div className="flex-shrink-0 pt-0.5">
                  <PillToggle
                    value={getAmPm(endTime)}
                    onChange={(val) => handleAmPmChange(endTime, setEndTime, val as any)}
                    options={[
                      { value: "AM", label: "AM" },
                      { value: "PM", label: "PM" },
                    ]}
                    accentColor={groupAccent}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Precision Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Precision
          </span>
          <PillToggle
            value={precision}
            onChange={(val) => setPrecision(val as any)}
            options={[
              { value: "minutes", label: "Hours & Minutes" },
              { value: "seconds", label: "Include Seconds" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Row 3: Format Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Format
          </span>
          <PillToggle
            value={format}
            onChange={(val) => setFormat(val as any)}
            options={[
              { value: "24h", label: "24-Hour" },
              { value: "12h", label: "12-Hour" },
            ]}
            accentColor={groupAccent}
          />
        </div>
      </div>
    </CalculatorCard>
  );
}
