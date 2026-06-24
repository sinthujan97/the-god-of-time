"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateBusinessDays, BusinessDaysResult } from "@/lib/tools/calculations";

interface BusinessDaysInputsProps {
  groupAccent: string;
}

export default function BusinessDaysInputs({ groupAccent }: BusinessDaysInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<BusinessDaysResult>({
    businessDays: 0,
    calendarDays: 0,
    weekendDays: 0,
    isValid: false,
  });

  useEffect(() => {
    setStartDate(new Date());
    // End date defaults to today + 30 days
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
        isValid: false,
        errorMessage: "Please enter valid dates",
      });
      return;
    }

    const calc = calculateBusinessDays(
      formatDateToYYYYMMDD(startDate),
      formatDateToYYYYMMDD(endDate)
    );
    setResult(calc);
  }, [startDate, endDate, isStartInvalid, isEndInvalid]);

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
    const rows = [
      `${result.calendarDays} total calendar days`,
      `${result.weekendDays} weekend days excluded`,
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
      </div>
    </CalculatorCard>
  );
}
