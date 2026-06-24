"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { fetchLeapSecondLog } from "@/lib/tools/calculations";

interface LeapSecondLogInputsProps {
  groupAccent: string;
}

export default function LeapSecondLogInputs({ groupAccent }: LeapSecondLogInputsProps) {
  const [yearFilter, setYearFilter] = useState<number>(0);
  const [events, setEvents] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const res = fetchLeapSecondLog(yearFilter);
    setEvents(res);
  }, [yearFilter]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Total events logged: ${events.length}`,
      `Filter condition: ${yearFilter > 0 ? `Year ${yearFilter}` : "All historic logs"}`
    ];
  };

  const getCopyText = () => {
    return `Leap seconds event logs: ` + events.map(e => `${e.historicalEventDate}: Correction = ${e.totalCorrectionSecondsAtTime}s`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${events.length} events`}
      resultUnit="MATCHED LEAP RECORDS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Year Filter input */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="year-filter">
            Filter Log by Year (0 for All History)
          </label>
          <input
            id="year-filter"
            type="number"
            min="0"
            max="2100"
            value={yearFilter === 0 ? "" : yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value, 10) || 0)}
            className="h-11 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            placeholder="e.g. 2016"
          />
        </div>

        {/* Chronological adjustment list */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Chronological Shift Adjustment Log
          </h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {events.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-bg-card border border-border rounded-lg text-xs font-sans animate-in fade-in duration-200"
              >
                <div>
                  <span className="font-bold text-text-primary block">{e.historicalEventDate}</span>
                  <span className="text-[10px] text-text-muted font-mono uppercase">
                    Rotational Deviation: {e.rotationalDeviationValue}s
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono" style={{ backgroundColor: `${groupAccent}20`, color: groupAccent }}>
                    +{e.totalCorrectionSecondsAtTime}s TAI Offset
                  </span>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <div className="text-center py-8 text-text-muted font-sans text-sm italic border border-dashed border-border rounded-lg">
                No events matched that year filter.
              </div>
            )}
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
