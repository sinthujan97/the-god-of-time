"use client";

import React from "react";
import { DatePicker, PillToggle } from "@/components/ui";

interface DaysBetweenInputsProps {
  startDate: Date | undefined;
  setStartDate: (v: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (v: Date | undefined) => void;
  includeEndDate: boolean;
  setIncludeEndDate: (v: boolean) => void;
  excludeWeekends: boolean;
  setExcludeWeekends: (v: boolean) => void;
  groupAccent: string;
  isStartInvalid: boolean;
  isEndInvalid: boolean;
}

export default function DaysBetweenInputs({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  includeEndDate,
  setIncludeEndDate,
  excludeWeekends,
  setExcludeWeekends,
  groupAccent,
  isStartInvalid,
  isEndInvalid,
}: DaysBetweenInputsProps) {
  return (
    <div 
      className="space-y-6"
      style={{ "--group-accent": groupAccent } as React.CSSProperties}
    >
      
      {/* 1. DATE PICKERS GRID */}
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
            <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
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
            <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
              Please enter a valid date
            </span>
          )}
        </div>
      </div>

      {/* 2. PILL TOGGLES */}
      <div className="flex flex-col gap-4 mt-5">
        
        {/* Toggle 1: Include End Date */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            End Date
          </span>
          <PillToggle
            value={includeEndDate ? "true" : "false"}
            onChange={(val) => setIncludeEndDate(val === "true")}
            options={[
              { value: "false", label: "Not Included" },
              { value: "true", label: "Included" }
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Toggle 2: Count Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Count Mode
          </span>
          <PillToggle
            value={excludeWeekends ? "true" : "false"}
            onChange={(val) => setExcludeWeekends(val === "true")}
            options={[
              { value: "false", label: "All Days" },
              { value: "true", label: "Business Days Only" }
            ]}
            accentColor={groupAccent}
          />
        </div>

      </div>

    </div>
  );
}
