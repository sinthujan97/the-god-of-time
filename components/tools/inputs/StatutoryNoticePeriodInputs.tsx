"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateNoticePeriod, NoticePeriodResult } from "@/lib/tools/calculations";

interface StatutoryNoticePeriodInputsProps {
  groupAccent: string;
}

export default function StatutoryNoticePeriodInputs({ groupAccent }: StatutoryNoticePeriodInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [period, setPeriod] = useState<number>(30);
  const [periodType, setPeriodType] = useState<"calendar" | "business">("calendar");
  const [includeStart, setIncludeStart] = useState<boolean>(true);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<NoticePeriodResult>({
    noticeEndDate: new Date(),
    noticeEndFormatted: "—",
    calendarDays: 0,
    businessDays: 0,
    lastWorkingDay: new Date(),
    lastWorkingDayFormatted: "—",
  });

  useEffect(() => {
    setStartDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate) return;
    if (isStartInvalid) return;
    if (isNaN(period) || period <= 0) return;

    const calc = calculateNoticePeriod(
      formatDateToYYYYMMDD(startDate),
      period,
      periodType,
      includeStart
    );
    setResult(calc);
  }, [startDate, period, periodType, includeStart, isStartInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!startDate) return "";
    return `Final Employment Date: ${result.noticeEndFormatted}. Last Working Day: ${result.lastWorkingDayFormatted}. Total span: ${result.calendarDays} calendar days (${result.businessDays} business days).`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.noticeEndFormatted !== "—" ? result.noticeEndFormatted : "—"}
      resultUnit="FINAL EMPLOYMENT DATE"
      resultBreakdown={[
        `Last physical working day: ${result.lastWorkingDayFormatted}`,
        `Total notice span: ${result.calendarDays} calendar days`,
        `Transition days: ${result.businessDays} working days`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isStartInvalid ? "Invalid notice start date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Notice Start Date & Period */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="notice-start-date"
              label="Notice Submission Date"
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

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="notice-period-input">
              Notice Duration Length
            </label>
            <input
              id="notice-period-input"
              type="number"
              min="1"
              value={period || ""}
              onChange={(e) => setPeriod(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: Period Type & Include Start Day */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="tool-input-label block mb-1">
              Notice Type Mode
            </span>
            <PillToggle
              value={periodType}
              onChange={(val) => setPeriodType(val as any)}
              options={[
                { value: "calendar", label: "Calendar Days" },
                { value: "business", label: "Business/Work Days" }
              ]}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <span className="tool-input-label block mb-1">
              Include Notice Day
            </span>
            <PillToggle
              value={includeStart ? "true" : "false"}
              onChange={(val) => setIncludeStart(val === "true")}
              options={[
                { value: "true", label: "Yes (Include first day)" },
                { value: "false", label: "No (Start next day)" }
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
