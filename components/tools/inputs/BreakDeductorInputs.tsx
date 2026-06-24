"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { deductBreaks } from "@/lib/tools/calculations";

interface BreakDeductorInputsProps {
  groupAccent: string;
}

export default function BreakDeductorInputs({ groupAccent }: BreakDeductorInputsProps) {
  const [totalHours, setTotalHours] = useState<number>(8.5);
  const [numBreaks, setNumBreaks] = useState<number>(1);
  const [breakDuration, setBreakDuration] = useState<number>(30);
  const [paidAllowance, setPaidAllowance] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    totalBreakMinutes: 0,
    unpaidBreakMinutes: 0,
    netHours: 0,
    netDecimalHours: 0,
  });

  useEffect(() => {
    const res = deductBreaks(totalHours, numBreaks, breakDuration, paidAllowance);
    setResult(res);
  }, [totalHours, numBreaks, breakDuration, paidAllowance]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    const hrs = Math.floor(result.netHours);
    const mins = Math.round((result.netHours - hrs) * 60);

    return [
      `Gross Hours: ${totalHours.toFixed(2)} hrs`,
      `Total Break Duration: ${result.totalBreakMinutes} mins`,
      `Paid Allowance Applied: ${paidAllowance} mins`,
      `Unpaid Break Time (deducted): ${result.unpaidBreakMinutes} mins`,
      `Net Hours (formatted): ${hrs}h ${mins}m`,
    ];
  };

  const getCopyText = () => {
    return `Net Hours: ${result.netDecimalHours.toFixed(2)} hrs (Gross: ${totalHours} hrs, Break deduction: ${result.unpaidBreakMinutes} mins)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.netDecimalHours.toFixed(2)} hrs`}
      resultUnit="NET PAID HOURS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Core Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="total-hours">
              Gross Scheduled Hours
            </label>
            <input
              id="total-hours"
              type="number"
              min="0"
              step="0.1"
              value={isNaN(totalHours) ? "" : totalHours}
              onChange={(e) => setTotalHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="num-breaks">
              Number of Breaks
            </label>
            <input
              id="num-breaks"
              type="number"
              min="0"
              value={isNaN(numBreaks) ? "" : numBreaks}
              onChange={(e) => setNumBreaks(parseInt(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Break lengths */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="break-dur">
              Break Duration (minutes)
            </label>
            <input
              id="break-dur"
              type="number"
              min="0"
              value={isNaN(breakDuration) ? "" : breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="paid-allowance">
              Paid Break Allowance (mins)
            </label>
            <input
              id="paid-allowance"
              type="number"
              min="0"
              value={isNaN(paidAllowance) ? "" : paidAllowance}
              onChange={(e) => setPaidAllowance(parseInt(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
