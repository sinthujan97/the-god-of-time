"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateMultiBreakTimeCard, BreakEntry } from "@/lib/tools/calculations";

interface TimeCardWithBreaksInputsProps {
  groupAccent: string;
}

interface ReactBreak {
  id: string;
  startTime: string;
  endTime: string;
}

export default function TimeCardWithBreaksInputs({ groupAccent }: TimeCardWithBreaksInputsProps) {
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("17:30");
  const [breaks, setBreaks] = useState<ReactBreak[]>([
    { id: "1", startTime: "12:00", endTime: "12:30" },
  ]);
  const [paidBreakAllowance, setPaidBreakAllowance] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    grossHours: 0,
    totalBreakMinutes: 0,
    totalBreakHours: 0,
    netHours: 0,
    netHoursFormatted: "0h 0m",
    netDecimalHours: 0,
    paidBreakMinutes: 0,
    unpaidBreakMinutes: 0,
    isValid: false,
    errorMessage: "",
  });

  // Calculate live
  useEffect(() => {
    const formattedBreaks: BreakEntry[] = breaks.map((b) => ({
      startTime: b.startTime,
      endTime: b.endTime,
    }));

    const res = calculateMultiBreakTimeCard(shiftStart, shiftEnd, formattedBreaks, paidBreakAllowance);
    setResult({
      ...res,
      errorMessage: res.errorMessage || "",
    });
  }, [shiftStart, shiftEnd, breaks, paidBreakAllowance]);

  const handleAddBreak = () => {
    if (breaks.length >= 6) return;
    const newId = String(Date.now() + Math.random());
    setBreaks([...breaks, { id: newId, startTime: "", endTime: "" }]);
  };

  const handleRemoveBreak = (id: string) => {
    setBreaks(breaks.filter((b) => b.id !== id));
  };

  const handleBreakChange = (id: string, field: 'startTime' | 'endTime', value: string) => {
    setBreaks(
      breaks.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    return [
      `Gross Shift Duration: ${result.grossHours.toFixed(2)} hrs`,
      `Total Break Time: ${result.totalBreakMinutes} mins (${result.totalBreakHours.toFixed(2)} hrs)`,
      `Paid Break Allowance: ${result.paidBreakMinutes} mins`,
      `Unpaid Break Deduction: ${result.unpaidBreakMinutes} mins`,
      `Net Decimal Hours: ${result.netDecimalHours.toFixed(2)} hrs`,
    ];
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Gross: ${result.grossHours.toFixed(2)} hrs, Breaks: ${result.totalBreakMinutes} mins (${result.unpaidBreakMinutes} mins unpaid), Net: ${result.netHoursFormatted}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.netHoursFormatted}
      resultUnit="NET HOURS WORKED"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Shift times */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="shift-start">
              Shift Start (Clock-In)
            </label>
            <input
              id="shift-start"
              type="time"
              value={shiftStart}
              onChange={(e) => setShiftStart(e.target.value)}
              className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="shift-end">
              Shift End (Clock-Out)
            </label>
            <input
              id="shift-end"
              type="time"
              value={shiftEnd}
              onChange={(e) => setShiftEnd(e.target.value)}
              className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Breaks List */}
        <div className="space-y-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Shift Breaks (max 6)
          </span>

          <div className="space-y-3">
            {breaks.map((b, idx) => (
              <div key={b.id} className="flex items-center gap-3">
                <span className="font-sans text-xs font-medium text-text-muted w-16">
                  Break {idx + 1}
                </span>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={b.startTime}
                    onChange={(e) => handleBreakChange(b.id, "startTime", e.target.value)}
                    className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                    style={{ "--local-accent": groupAccent } as React.CSSProperties}
                  />
                  <input
                    type="time"
                    value={b.endTime}
                    onChange={(e) => handleBreakChange(b.id, "endTime", e.target.value)}
                    className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                    style={{ "--local-accent": groupAccent } as React.CSSProperties}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBreak(b.id)}
                  className="h-10 px-3 border border-border hover:border-accent-utility-e hover:text-accent-utility-e rounded-md font-sans text-xs text-text-muted cursor-pointer transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {breaks.length < 6 && (
            <button
              type="button"
              onClick={handleAddBreak}
              className="w-full h-11 border border-dashed border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              + Add Break
            </button>
          )}
        </div>

        {/* Paid Break Allowance */}
        <div className="pt-4 border-t border-border-subtle flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="paid-allowance">
            Paid Break Allowance (minutes)
          </label>
          <input
            id="paid-allowance"
            type="number"
            min="0"
            max="1440"
            value={isNaN(paidBreakAllowance) ? "" : paidBreakAllowance}
            onChange={(e) => setPaidBreakAllowance(parseInt(e.target.value) || 0)}
            className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-[160px]"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

      </div>
    </CalculatorCard>
  );
}
