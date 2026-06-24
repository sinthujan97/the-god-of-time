"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateRetentionExpiry, RetentionExpiryResult } from "@/lib/tools/calculations";

interface DocumentRetentionExpiryInputsProps {
  groupAccent: string;
}

export default function DocumentRetentionExpiryInputs({ groupAccent }: DocumentRetentionExpiryInputsProps) {
  const [recordDate, setRecordDate] = useState<Date | undefined>(undefined);
  const [docType, setDocType] = useState<string>("tax");
  const [years, setYears] = useState<number>(7);
  const [months, setMonths] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [extension, setExtension] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<RetentionExpiryResult>({
    expiryDate: new Date(),
    expiryFormatted: "—",
    daysUntilExpiry: 0,
    isExpired: false,
    expiredDaysAgo: 0,
    totalRetentionDays: 0,
  });

  useEffect(() => {
    setRecordDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isRecordInvalid = isDateInvalid(recordDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Adjust years/months/days based on template selection
  useEffect(() => {
    if (docType === "tax") {
      setYears(7);
      setMonths(0);
      setDays(0);
    } else if (docType === "personnel") {
      setYears(3);
      setMonths(0);
      setDays(0);
    } else if (docType === "medical") {
      setYears(6);
      setMonths(0);
      setDays(0);
    } else if (docType === "contract") {
      setYears(10);
      setMonths(0);
      setDays(0);
    }
  }, [docType]);

  useEffect(() => {
    if (!recordDate) return;
    if (isRecordInvalid) return;

    const calc = calculateRetentionExpiry(
      formatDateToYYYYMMDD(recordDate),
      years,
      months,
      days,
      extension
    );
    setResult(calc);
  }, [recordDate, docType, years, months, days, extension, isRecordInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!recordDate) return "";
    return `Retention Expiry Date: ${result.expiryFormatted}. Status: ${result.isExpired ? "EXPIRED" : `${result.daysUntilExpiry} days remaining`}.`;
  };

  const docTypeOptions = [
    { value: "tax", label: "Tax Records & Receipts (IRS 7 yr)" },
    { value: "personnel", label: "Employee Personnel Files (3 yr)" },
    { value: "medical", label: "Medical & Health Records (HIPAA 6 yr)" },
    { value: "contract", label: "Legal & Customer Contracts (10 yr)" },
    { value: "custom", label: "Custom Retention Period" }
  ];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.expiryFormatted !== "—" ? result.expiryFormatted : "—"}
      resultUnit="COMPLIANCE DESTRUCTION DATE"
      resultBreakdown={[
        result.isExpired 
          ? `Disposal allowed: expired ${result.expiredDaysAgo} days ago` 
          : `Active retention required: ${result.daysUntilExpiry} days remaining`,
        `Total retention duration: ${result.totalRetentionDays} days`,
        extension > 0 ? `Includes local jurisdiction extension: ${extension} days` : "No jurisdiction extension applied"
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isRecordInvalid ? "Invalid record date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Record Date & Policy Template */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="record-date"
              label="Record Date (Creation/Closing)"
              value={recordDate}
              onChange={setRecordDate}
              accentColor={groupAccent}
            />
            {isRecordInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label block mb-1">
              Retention Regulation Template
            </label>
            <ToolSelect
              value={docType}
              onChange={setDocType}
              options={docTypeOptions}
              placeholder="Select Policy Rule"
            />
          </div>
        </div>

        {/* Custom Duration Fields */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Retention Duration Settings
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="years-input">
                Years
              </label>
              <input
                id="years-input"
                type="number"
                min="0"
                disabled={docType !== "custom"}
                value={years}
                onChange={(e) => setYears(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="months-input">
                Months
              </label>
              <input
                id="months-input"
                type="number"
                min="0"
                max="11"
                disabled={docType !== "custom"}
                value={months}
                onChange={(e) => setMonths(Math.min(11, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="days-input">
                Days
              </label>
              <input
                id="days-input"
                type="number"
                min="0"
                disabled={docType !== "custom"}
                value={days}
                onChange={(e) => setDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md disabled:opacity-50"
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="extension-input">
                State Override (Days)
              </label>
              <input
                id="extension-input"
                type="number"
                min="0"
                value={extension}
                onChange={(e) => setExtension(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Expiry Badge and Health Check */}
        {recordDate && !isRecordInvalid && (
          <div className="border border-border rounded-lg p-4 bg-bg-card flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-sans text-xs text-text-muted">Current Compliance Status</span>
              <span className="font-sans font-bold text-text-primary text-sm block">
                {result.isExpired 
                  ? "Record retention expired. Disposal is legally permitted." 
                  : `Active. Retain securely for another ${result.daysUntilExpiry} days.`}
              </span>
            </div>

            <span 
              className={`font-sans text-xs font-bold px-3 py-1 border rounded-md uppercase tracking-wider ${
                result.isExpired 
                  ? "bg-red-500/10 text-red-500 border-red-500/20" 
                  : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}
            >
              {result.isExpired ? "EXPIRED / DISPOSE" : "RETAIN / ACTIVE"}
            </span>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
