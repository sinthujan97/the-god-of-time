"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateBusinessDaysWithHolidays, BusinessDaysResult } from "@/lib/tools/calculations";

interface BusinessDaysWithHolidaysInputsProps {
  groupAccent: string;
}

export default function BusinessDaysWithHolidaysInputs({ groupAccent }: BusinessDaysWithHolidaysInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [holidays, setHolidays] = useState<(Date | undefined)[]>([undefined, undefined, undefined]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<BusinessDaysResult & { holidaysExcluded: number }>({
    businessDays: 0,
    calendarDays: 0,
    weekendDays: 0,
    holidaysExcluded: 0,
    isValid: false,
  });

  useEffect(() => {
    setStartDate(new Date());
    const future = new Date();
    future.setDate(future.getDate() + 30);
    setEndDate(future);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);
  const isEndInvalid = isDateInvalid(endDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate || !endDate) {
      setResult({
        businessDays: 0,
        calendarDays: 0,
        weekendDays: 0,
        holidaysExcluded: 0,
        isValid: false,
        errorMessage: "Please select both dates",
      });
      return;
    }

    if (isStartInvalid || isEndInvalid) {
      setResult({
        businessDays: 0,
        calendarDays: 0,
        weekendDays: 0,
        holidaysExcluded: 0,
        isValid: false,
        errorMessage: "Please enter valid dates",
      });
      return;
    }

    // Format holidays
    const holidayStrings = holidays
      .filter((h): h is Date => !!h && !isDateInvalid(h))
      .map((h) => formatDateToYYYYMMDD(h));

    const calc = calculateBusinessDaysWithHolidays(
      formatDateToYYYYMMDD(startDate),
      formatDateToYYYYMMDD(endDate),
      holidayStrings
    );
    setResult(calc);
  }, [startDate, endDate, holidays, isStartInvalid, isEndInvalid]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddHoliday = () => {
    setHolidays([...holidays, undefined]);
  };

  const handleHolidayChange = (idx: number, val: Date | undefined) => {
    const updated = [...holidays];
    updated[idx] = val;
    setHolidays(updated);
  };

  const handleRemoveHoliday = (idx: number) => {
    const updated = holidays.filter((_, i) => i !== idx);
    setHolidays(updated);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    const rows = [
      `${result.calendarDays} total calendar days`,
      `${result.weekendDays} weekend days excluded`,
      `${result.holidaysExcluded} holiday${result.holidaysExcluded === 1 ? "" : "s"} excluded`,
    ];
    if (startDate && endDate && startDate > endDate) {
      rows.push("End date is before start date");
    }
    return rows;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.businessDays : "—"}
      resultUnit="BUSINESS DAYS"
      resultBreakdown={getBreakdownRows()}
      copyText={result.isValid ? `${result.businessDays} business days` : ""}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Date Pickers Grid */}
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
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block">
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
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block">
                Please enter a valid date
              </span>
            )}
          </div>
        </div>

        {/* Holidays List */}
        <div className="space-y-3 pt-4 border-t border-border-subtle">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Custom Holidays
          </span>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {holidays.map((holiday, idx) => (
              <div key={idx} className="flex items-end gap-3">
                <div className="flex-1">
                  <DatePicker
                    id={`holiday-${idx}`}
                    label={`Holiday ${idx + 1}`}
                    value={holiday}
                    onChange={(val) => handleHolidayChange(idx, val)}
                    accentColor={groupAccent}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHoliday(idx)}
                  className="h-12 px-4 bg-transparent border border-border hover:border-accent-utility-e hover:text-accent-utility-e rounded-md font-sans text-sm text-text-muted cursor-pointer transition-all flex items-center justify-center"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddHoliday}
            className="w-full h-11 border border-dashed border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            + Add Holiday
          </button>
        </div>
      </div>
    </CalculatorCard>
  );
}
