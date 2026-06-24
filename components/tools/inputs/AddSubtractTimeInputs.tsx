"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { addSubtractTime, AddSubtractTimeResult } from "@/lib/tools/calculations";

interface AddSubtractTimeInputsProps {
  groupAccent: string;
}

export default function AddSubtractTimeInputs({ groupAccent }: AddSubtractTimeInputsProps) {
  const [baseTime, setBaseTime] = useState<string>("12:00");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [hours, setHours] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(30);
  const [seconds, setSeconds] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<AddSubtractTimeResult>({
    resultTime: "",
    resultTime12h: "",
    totalMinutesAdded: 0,
    crossedMidnight: false,
    daysOffset: 0,
    isValid: false,
  });

  useEffect(() => {
    const calc = addSubtractTime(
      baseTime,
      isNaN(hours) ? 0 : hours,
      isNaN(minutes) ? 0 : minutes,
      isNaN(seconds) ? 0 : seconds,
      operation
    );
    setResult(calc);
  }, [baseTime, operation, hours, minutes, seconds]);

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
    const rows = [result.resultTime12h];

    if (result.daysOffset > 0) {
      rows.push(result.daysOffset === 1 ? "Next day" : `${result.daysOffset} days later`);
    } else if (result.daysOffset < 0) {
      rows.push(result.daysOffset === -1 ? "Previous day" : `${Math.abs(result.daysOffset)} days earlier`);
    }

    const action = operation === "add" ? "added" : "subtracted";
    rows.push(`${result.totalMinutesAdded} total minutes ${action}`);

    return rows;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.resultTime : "—"}
      resultUnit="RESULT TIME"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? result.resultTime : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-display italic text-[28px] md:text-[36px]"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Base Time */}
        <div className="flex flex-col">
          <label className="tool-input-label" htmlFor="base-time-input">
            Start Time
          </label>
          <input
            id="base-time-input"
            type="time"
            value={baseTime}
            onChange={(e) => setBaseTime(e.target.value)}
            className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Row 2: Operation */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Operation
          </span>
          <PillToggle
            value={operation}
            onChange={(val) => setOperation(val as any)}
            options={[
              { value: "add", label: "Add" },
              { value: "subtract", label: "Subtract" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Row 3: Hours, Minutes, Seconds */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="hours-input">
              Hours
            </label>
            <input
              id="hours-input"
              type="number"
              min="0"
              max="999"
              value={isNaN(hours) ? "" : hours}
              onChange={(e) => setHours(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-3 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="minutes-input">
              Minutes
            </label>
            <input
              id="minutes-input"
              type="number"
              min="0"
              max="59"
              value={isNaN(minutes) ? "" : minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-3 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="seconds-input">
              Seconds
            </label>
            <input
              id="seconds-input"
              type="number"
              min="0"
              max="59"
              value={isNaN(seconds) ? "" : seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-3 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
