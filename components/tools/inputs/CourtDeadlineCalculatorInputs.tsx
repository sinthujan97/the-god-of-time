"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateCourtDeadline, CourtDeadlineResult } from "@/lib/tools/calculations";

interface CourtDeadlineCalculatorInputsProps {
  groupAccent: string;
}

export default function CourtDeadlineCalculatorInputs({ groupAccent }: CourtDeadlineCalculatorInputsProps) {
  const [triggerDate, setTriggerDate] = useState<Date | undefined>(undefined);
  const [daysCount, setDaysCount] = useState<number>(21);
  const [deadlineType, setDeadlineType] = useState<"calendar" | "business">("calendar");
  const [jurisdiction, setJurisdiction] = useState<string>("federal");
  const [excludeHolidays, setExcludeHolidays] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<CourtDeadlineResult>({
    deadlineDate: new Date(),
    deadlineDateFormatted: "—",
    deadlineDayOfWeek: "",
    adjustedDeadline: new Date(),
    adjustedDeadlineFormatted: "—",
    isAdjusted: false,
    adjustmentReason: "",
    daysUntilDeadline: 0,
  });

  useEffect(() => {
    setTriggerDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isTriggerInvalid = isDateInvalid(triggerDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!triggerDate) return;
    if (isTriggerInvalid) return;

    const calc = calculateCourtDeadline(
      formatDateToYYYYMMDD(triggerDate),
      daysCount,
      deadlineType,
      jurisdiction,
      excludeHolidays
    );
    setResult(calc);
  }, [triggerDate, daysCount, deadlineType, jurisdiction, excludeHolidays, isTriggerInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!triggerDate) return "";
    return `Court Deadline: ${result.adjustedDeadlineFormatted}. Adjusted: ${result.isAdjusted ? "Yes" : "No"}. Reason: ${result.adjustmentReason || "None"}.`;
  };

  const jurisdictionOptions = [
    { value: "federal", label: "US Federal Court" },
    { value: "california", label: "California State Court" },
    { value: "newyork", label: "New York State Court" },
    { value: "texas", label: "Texas State Court" }
  ];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.adjustedDeadlineFormatted !== "—" ? result.adjustedDeadlineFormatted : "—"}
      resultUnit="OFFICIAL COURT FILING DEADLINE"
      resultBreakdown={[
        `Filing day of week: ${result.deadlineDayOfWeek}`,
        `Days remaining to file: ${result.daysUntilDeadline} days`,
        result.isAdjusted 
          ? `Notice: ${result.adjustmentReason}` 
          : "Deadline falls on a business day. No adjustment needed."
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isTriggerInvalid ? "Invalid trigger date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Trigger Date & Days Count */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="court-trigger-date"
              label="Trigger Event Date (e.g. Service)"
              value={triggerDate}
              onChange={setTriggerDate}
              accentColor={groupAccent}
            />
            {isTriggerInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="court-days-count">
              Filing Period (Days)
            </label>
            <input
              id="court-days-count"
              type="number"
              min="1"
              value={daysCount || ""}
              onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: Deadline Type & Jurisdiction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="tool-input-label block mb-1">
              Filing Count Mode
            </span>
            <PillToggle
              value={deadlineType}
              onChange={(val) => setDeadlineType(val as any)}
              options={[
                { value: "calendar", label: "Calendar Days" },
                { value: "business", label: "Court Business Days" }
              ]}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label block mb-1">
              Court Jurisdiction
            </label>
            <ToolSelect
              value={jurisdiction}
              onChange={setJurisdiction}
              options={jurisdictionOptions}
              placeholder="Select Jurisdiction"
            />
          </div>
        </div>

        {/* Exclude Court Holidays Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[140px] flex-shrink-0">
            Exclude Holidays
          </span>
          <PillToggle
            value={excludeHolidays ? "true" : "false"}
            onChange={(val) => setExcludeHolidays(val === "true")}
            options={[
              { value: "true", label: "Exclude Court Holidays" },
              { value: "false", label: "Include Holidays" }
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Adjustments details panel */}
        {result.isAdjusted && (
          <div className="border border-border rounded-lg p-4 bg-bg-card border-l-4 border-l-accent-utility-e">
            <div className="text-xs font-sans text-text-muted">
              <span className="font-bold text-accent-utility-e block uppercase text-[10px] tracking-wide">
                Filing Date Adjusted
              </span>
              <span className="text-text-primary mt-1 block">
                {result.adjustmentReason}
              </span>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
