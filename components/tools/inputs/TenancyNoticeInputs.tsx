"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { planTenancyNotice } from "@/lib/tools/calculations";

interface TenancyNoticeInputsProps {
  groupAccent: string;
}

export default function TenancyNoticeInputs({ groupAccent }: TenancyNoticeInputsProps) {
  const [desiredEnd, setDesiredEnd] = useState<Date | undefined>(undefined);
  const [noticeDays, setNoticeDays] = useState<number>(30); // 30-day default

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    latestValidNoticeDate: Date;
    latestNoticeDateFormatted: string;
    noticeBufferDaysRemaining: number;
  }>({
    latestValidNoticeDate: new Date(),
    latestNoticeDateFormatted: "—",
    noticeBufferDaysRemaining: 0,
  });

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 45); // Set desired lease end 45 days in future
    setDesiredEnd(today);
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!desiredEnd) return;
    const dateStr = formatDateToYYYYMMDD(desiredEnd);
    const res = planTenancyNotice(dateStr, noticeDays);
    setResult(res);
  }, [desiredEnd, noticeDays]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!desiredEnd) return [];
    return [
      `Notice period required: ${noticeDays} calendar days`,
      `Days remaining to notify landlord: ${result.noticeBufferDaysRemaining} days`
    ];
  };

  const getCopyText = () => {
    if (!desiredEnd) return "";
    return `Tenancy Notice Plan: Desired lease end is ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(desiredEnd)}. Latest notice date: ${result.latestNoticeDateFormatted}. Days remaining to serve notice: ${result.noticeBufferDaysRemaining}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.latestNoticeDateFormatted}
      resultUnit="LATEST LEGAL NOTICE DEADLINE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="lease-end-date"
              label="Desired Lease End / Move-out Date"
              value={desiredEnd}
              onChange={setDesiredEnd}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="notice-period-input">
              Required Notice Period (Days)
            </label>
            <input
              id="notice-period-input"
              type="number"
              min="1"
              max="365"
              value={isNaN(noticeDays) ? "" : noticeDays}
              onChange={(e) => setNoticeDays(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
            <span className="text-[11px] text-text-muted mt-1.5 font-sans">
              Typically 30, 60, or 90 days.
            </span>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
