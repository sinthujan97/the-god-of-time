/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { calculateDaysBetween, DaysBetweenResult } from "@/lib/tools/calculations";
import CalculatorCard from "./CalculatorCard";
import DaysBetweenInputs from "./inputs/DaysBetweenInputs";

interface DaysBetweenCalculatorProps {
  groupAccent: string;
}

export default function DaysBetweenCalculator({ groupAccent }: DaysBetweenCalculatorProps) {
  const searchParams = useSearchParams();

  // 1. STATE INITIALIZATION (Use Date objects or undefined)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [excludeWeekends, setExcludeWeekends] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<DaysBetweenResult>({
    totalDays: 0,
    totalWeeks: 0,
    remainderDays: 0,
    totalMonths: 0,
    remainderDaysAfterMonths: 0,
    businessDays: 0,
    weekendDays: 0,
    leapDaysIncluded: 0,
    isValid: false,
  });

  // Default pre-fill to today's date on client mount
  useEffect(() => {
    setStartDate(new Date());
  }, []);

  // Pre-fill parameters from URL searchParams
  useEffect(() => {
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    
    if (startParam) {
      const parts = startParam.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          setStartDate(new Date(y, m - 1, d));
        }
      }
    }
    if (endParam) {
      const parts = endParam.split("-");
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          setEndDate(new Date(y, m - 1, d));
        }
      }
    }
  }, [searchParams]);

  // Helper validation checks
  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);
  const isEndInvalid = isDateInvalid(endDate);

  // Helper to format Date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 2. AUTOMATIC CALCULATION EFFECT (Runs live on state modifications)
  useEffect(() => {
    if (!startDate || !endDate) {
      setResult({
        totalDays: 0,
        totalWeeks: 0,
        remainderDays: 0,
        totalMonths: 0,
        remainderDaysAfterMonths: 0,
        businessDays: 0,
        weekendDays: 0,
        leapDaysIncluded: 0,
        isValid: false,
        errorMessage: "Please select both dates",
      });
      return;
    }

    if (isStartInvalid || isEndInvalid) {
      setResult({
        totalDays: 0,
        totalWeeks: 0,
        remainderDays: 0,
        totalMonths: 0,
        remainderDaysAfterMonths: 0,
        businessDays: 0,
        weekendDays: 0,
        leapDaysIncluded: 0,
        isValid: false,
        errorMessage: "Please enter valid dates",
      });
      return;
    }

    const calcResult = calculateDaysBetween(
      formatDateToYYYYMMDD(startDate),
      formatDateToYYYYMMDD(endDate),
      includeEndDate,
      excludeWeekends
    );
    setResult(calcResult);
  }, [startDate, endDate, includeEndDate, excludeWeekends, isStartInvalid, isEndInvalid]);

  // 3. ANIMATED CALCULATE TRIGGER
  const handleCalculate = () => {
    if (!result.isValid) return;

    setIsLoading(true);
    // Button enters loading state for 200ms, then triggers output animations
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  // 4. COPY STRING FORMATTING
  const formatDateLabel = (d: Date | undefined) => {
    if (!d) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const getCopyText = () => {
    if (!result.isValid || !startDate || !endDate) return "";
    const label = excludeWeekends ? "business days" : "days";
    return `${result.totalDays} ${label} between ${formatDateLabel(startDate)} and ${formatDateLabel(endDate)}`;
  };

  // 5. RESULT PREPARATION
  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    const rows = [
      `${result.totalWeeks} weeks, ${result.remainderDays} days`,
      `${result.totalMonths} months, ${result.remainderDaysAfterMonths} days`,
    ];

    if (result.leapDaysIncluded > 0) {
      rows.push(`Includes ${result.leapDaysIncluded} leap day${result.leapDaysIncluded > 1 ? "s" : ""}`);
    }

    if (excludeWeekends) {
      rows.push(`${result.weekendDays} weekend days excluded`);
    }

    // Swapped order check note
    if (startDate && endDate) {
      if (startDate > endDate) {
        rows.push("End date is before start date");
      }
    }

    return rows;
  };

  const primaryResultValue = result.isValid ? result.totalDays : "—";
  const primaryResultUnit = excludeWeekends ? "BUSINESS DAYS" : "CALENDAR DAYS";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={primaryResultValue}
      resultUnit={primaryResultUnit}
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
    >
      <DaysBetweenInputs
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        includeEndDate={includeEndDate}
        setIncludeEndDate={setIncludeEndDate}
        excludeWeekends={excludeWeekends}
        setExcludeWeekends={setExcludeWeekends}
        groupAccent={groupAccent}
        isStartInvalid={isStartInvalid}
        isEndInvalid={isEndInvalid}
      />
    </CalculatorCard>
  );
}
