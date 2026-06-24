"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateDeliverySlipRisk, DeliverySlipRiskResult } from "@/lib/tools/calculations";

interface DeliverySlipRiskInputsProps {
  groupAccent: string;
}

export default function DeliverySlipRiskInputs({ groupAccent }: DeliverySlipRiskInputsProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [plannedDate, setPlannedDate] = useState<Date | undefined>(undefined);
  const [evalDate, setEvalDate] = useState<Date | undefined>(undefined);
  const [completionPct, setCompletionPct] = useState<number>(50);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<DeliverySlipRiskResult>({
    daysRemaining: 0,
    daysElapsed: 0,
    totalProjectDays: 0,
    expectedCompletionAtCurrentRate: new Date(),
    expectedCompletionFormatted: "—",
    slipDays: 0,
    riskScore: 0,
    riskLevel: 'on-track',
    velocityRatio: 1.0,
  });

  useEffect(() => {
    const today = new Date();
    setEvalDate(today);

    const initialStart = new Date();
    initialStart.setDate(today.getDate() - 30);
    setStartDate(initialStart);

    const initialPlanned = new Date();
    initialPlanned.setDate(today.getDate() + 15);
    setPlannedDate(initialPlanned);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(startDate);
  const isPlannedInvalid = isDateInvalid(plannedDate);
  const isEvalInvalid = isDateInvalid(evalDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!startDate || !plannedDate || !evalDate) return;
    if (isStartInvalid || isPlannedInvalid || isEvalInvalid) return;

    const calc = calculateDeliverySlipRisk(
      formatDateToYYYYMMDD(plannedDate),
      formatDateToYYYYMMDD(evalDate),
      completionPct,
      formatDateToYYYYMMDD(startDate)
    );
    setResult(calc);
  }, [startDate, plannedDate, evalDate, completionPct, isStartInvalid, isPlannedInvalid, isEvalInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!startDate) return "";
    return `Project Risk Level: ${result.riskLevel.toUpperCase()} (Score: ${result.riskScore}/100). Projected Completion: ${result.expectedCompletionFormatted}. Slip: ${result.slipDays} days.`;
  };

  const getBreakdownRows = () => {
    return [
      `Original plan duration: ${result.totalProjectDays} days`,
      `Days elapsed: ${result.daysElapsed} days (${result.daysRemaining} remaining)`,
      `Team velocity ratio: ${result.velocityRatio}x`,
      `Estimated project slippage: ${result.slipDays} days`
    ];
  };

  // Color mapping based on risk level
  const riskColorMap = {
    "on-track": { text: "#10B981", bg: "rgba(16, 185, 129, 0.1)", stroke: "#10B981" },
    "at-risk": { text: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", stroke: "#F59E0B" },
    "high-risk": { text: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", stroke: "#EF4444" },
    "critical": { text: "#EF4444", bg: "rgba(239, 68, 68, 0.2)", stroke: "#B91C1C" },
  };

  const activeColors = riskColorMap[result.riskLevel];

  // SVG circular dial parameters
  const radius = 50;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Semicircle meter: only draw half (180deg)
  const semiCircumference = circumference / 2;
  const strokeDashoffset = semiCircumference - (result.riskScore / 100) * semiCircumference;

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.expectedCompletionFormatted !== "—" ? result.expectedCompletionFormatted : "—"}
      resultUnit="PROJECTED COMPLETION DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isStartInvalid || isPlannedInvalid || isEvalInvalid ? "Please check your start, planned, and evaluation dates." : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Original Start & Target Delivery */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="original-start-date"
              label="Original Start Date"
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
            <DatePicker
              id="planned-delivery-date"
              label="Planned Delivery Date"
              value={plannedDate}
              onChange={setPlannedDate}
              accentColor={groupAccent}
            />
            {isPlannedInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Evaluation Date & Completion Percentage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="evaluation-date"
              label="Current Progress Date"
              value={evalDate}
              onChange={setEvalDate}
              accentColor={groupAccent}
            />
            {isEvalInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="completion-pct-input">
              Current Completion Progress: {completionPct}%
            </label>
            <div className="flex items-center gap-4 mt-2">
              <input
                id="completion-pct-input"
                type="range"
                min="0"
                max="100"
                value={completionPct}
                onChange={(e) => setCompletionPct(parseInt(e.target.value, 10))}
                className="w-full h-2 rounded-full cursor-pointer focus:outline-none accent-[var(--group-accent)] bg-bg-surface border border-border"
                style={{ "--group-accent": groupAccent } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* Premium Risk Dial Widget */}
        {startDate && !isStartInvalid && !isPlannedInvalid && !isEvalInvalid && (
          <div className="border border-border rounded-lg p-4 bg-bg-card flex flex-col md:flex-row items-center justify-around gap-6">
            
            {/* Risk Gauge Dial */}
            <div className="relative w-36 h-20 flex justify-center items-end overflow-hidden">
              <svg width="140" height="80" className="rotate-[180deg]">
                {/* Background Semicircle */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${semiCircumference} ${semiCircumference}`}
                />
                {/* Colored Semicircle */}
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={activeColors.stroke}
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${semiCircumference} ${semiCircumference}`}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              {/* Score text overlay */}
              <div className="absolute inset-x-0 bottom-0 text-center font-sans">
                <span className="text-xl font-bold text-text-primary block">
                  {result.riskScore}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-text-faint">
                  Risk Score
                </span>
              </div>
            </div>

            {/* Risk Level Explanation */}
            <div className="text-center md:text-left space-y-1">
              <span className="font-sans text-xs text-text-muted font-medium">Risk Status</span>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span 
                  className="font-sans font-bold text-base uppercase tracking-wider px-2 py-0.5 rounded border"
                  style={{ backgroundColor: activeColors.bg, color: activeColors.text, borderColor: activeColors.text }}
                >
                  {result.riskLevel}
                </span>
              </div>
              <p className="font-sans text-xs text-text-muted max-w-[280px] pt-1">
                {result.riskLevel === "on-track" 
                  ? "Sufficient velocity ratio to meet planned dates." 
                  : `Project is pacing slow (velocity ${result.velocityRatio}x). Expecting ${result.slipDays} days of slippage.`}
              </p>
            </div>

          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
