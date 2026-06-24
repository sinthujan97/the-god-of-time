"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { dateToOrdinal, ordinalToDate, isLeapYearVal } from "@/lib/tools/calculations";

interface DayOfYearConverterInputsProps {
  groupAccent: string;
}

export default function DayOfYearConverterInputs({ groupAccent }: DayOfYearConverterInputsProps) {
  const [activeTab, setActiveTab] = useState<"dateToOrdinal" | "ordinalToDate">("dateToOrdinal");

  // Tab 1: Date to Ordinal
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Tab 2: Ordinal to Date
  const [ordinalDay, setOrdinalDay] = useState<number>(47);
  const [targetYear, setTargetYear] = useState<number>(2024);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    value: string | number;
    unit: string;
    breakdown: string[];
    isValid: boolean;
    errorMessage?: string;
    fontClass?: string;
  }>({
    value: "—",
    unit: "ORDINAL DAY",
    breakdown: [],
    isValid: false,
  });

  useEffect(() => {
    setSelectedDate(new Date());
    setTargetYear(new Date().getFullYear());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  useEffect(() => {
    if (activeTab === "dateToOrdinal") {
      if (!selectedDate) {
        setResult({
          value: "—",
          unit: "ORDINAL DAY",
          breakdown: [],
          isValid: false,
          errorMessage: "Please select a date",
        });
        return;
      }
      if (isDateInvalid(selectedDate)) {
        setResult({
          value: "—",
          unit: "ORDINAL DAY",
          breakdown: [],
          isValid: false,
          errorMessage: "Please enter a valid date",
        });
        return;
      }

      const doy = dateToOrdinal(selectedDate);
      const year = selectedDate.getFullYear();
      const totalDays = isLeapYearVal(year) ? 366 : 365;
      const pct = (doy / totalDays) * 100;
      const remaining = totalDays - doy;

      setResult({
        value: doy,
        unit: `DAY OF ${year}`,
        breakdown: [
          `Day ${doy} of ${totalDays}`,
          `${remaining} days remaining in the year`,
          `${pct.toFixed(2)}% of the year completed`,
        ],
        isValid: true,
      });
    } else {
      if (isNaN(ordinalDay) || ordinalDay === null || ordinalDay < 1 || ordinalDay > 366) {
        setResult({
          value: "—",
          unit: "RESULT DATE",
          breakdown: [],
          isValid: false,
          errorMessage: "Ordinal day must be between 1 and 366",
        });
        return;
      }

      if (isNaN(targetYear) || targetYear === null || targetYear < 1000 || targetYear > 9999) {
        setResult({
          value: "—",
          unit: "RESULT DATE",
          breakdown: [],
          isValid: false,
          errorMessage: "Year must be between 1000 and 9999",
        });
        return;
      }

      const isLeap = isLeapYearVal(targetYear);
      const maxDays = isLeap ? 366 : 365;
      if (ordinalDay > maxDays) {
        setResult({
          value: "—",
          unit: "RESULT DATE",
          breakdown: [],
          isValid: false,
          errorMessage: `Year ${targetYear} only has ${maxDays} days`,
        });
        return;
      }

      const date = ordinalToDate(ordinalDay, targetYear);
      const fmt = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);

      const remaining = maxDays - ordinalDay;
      const pct = (ordinalDay / maxDays) * 100;

      setResult({
        value: fmt,
        unit: "RESULT DATE",
        breakdown: [
          `Day ${ordinalDay} of ${maxDays}`,
          `${remaining} days remaining in the year`,
          `${pct.toFixed(2)}% of the year completed`,
        ],
        isValid: true,
        fontClass: "font-display italic text-[24px] md:text-[36px]",
      });
    }
  }, [activeTab, selectedDate, ordinalDay, targetYear]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.value : "—"}
      resultUnit={result.unit}
      resultBreakdown={result.breakdown}
      copyText={result.isValid ? String(result.value) : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass={result.fontClass}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Tabs switcher */}
        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("dateToOrdinal")}
            className={`pb-3 px-4 font-sans text-sm font-medium transition-all cursor-pointer ${
              activeTab === "dateToOrdinal"
                ? "border-b-2 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
            style={{ borderBottomColor: activeTab === "dateToOrdinal" ? groupAccent : "transparent" }}
          >
            Date to Ordinal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ordinalToDate")}
            className={`pb-3 px-4 font-sans text-sm font-medium transition-all cursor-pointer ${
              activeTab === "ordinalToDate"
                ? "border-b-2 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
            style={{ borderBottomColor: activeTab === "ordinalToDate" ? groupAccent : "transparent" }}
          >
            Ordinal to Date
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "dateToOrdinal" ? (
          <div className="flex flex-col">
            <DatePicker
              id="selected-date"
              label="Select Date"
              value={selectedDate}
              onChange={setSelectedDate}
              accentColor={groupAccent}
            />
            {isDateInvalid(selectedDate) && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block">
                Please enter a valid date
              </span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="tool-input-label" htmlFor="ordinal-day-input">
                Ordinal Day (1–366)
              </label>
              <input
                id="ordinal-day-input"
                type="number"
                min="1"
                max="366"
                value={isNaN(ordinalDay) ? "" : ordinalDay}
                onChange={(e) => setOrdinalDay(parseInt(e.target.value, 10))}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label" htmlFor="target-year-input">
                Year
              </label>
              <input
                id="target-year-input"
                type="number"
                min="1000"
                max="9999"
                value={isNaN(targetYear) ? "" : targetYear}
                onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
