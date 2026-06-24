"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { hoursMinutesToDecimal, decimalToHoursMinutes } from "@/lib/tools/calculations";

interface DecimalTimeConverterInputsProps {
  groupAccent: string;
}

export default function DecimalTimeConverterInputs({ groupAccent }: DecimalTimeConverterInputsProps) {
  const [activeTab, setActiveTab] = useState<"toDecimal" | "fromDecimal">("toDecimal");

  // Tab 1 state
  const [hours, setHours] = useState<number>(7);
  const [minutes, setMinutes] = useState<number>(30);

  // Tab 2 state
  const [decimal, setDecimal] = useState<number>(7.5);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    value: string | number;
    unit: string;
    breakdown: string[];
    isValid: boolean;
    errorMessage?: string;
  }>({
    value: "—",
    unit: "DECIMAL HOURS",
    breakdown: [],
    isValid: false,
  });

  useEffect(() => {
    if (activeTab === "toDecimal") {
      const h = isNaN(hours) ? 0 : hours;
      const m = isNaN(minutes) ? 0 : minutes;
      if (h < 0 || m < 0 || m > 59) {
        setResult({
          value: "—",
          unit: "DECIMAL HOURS",
          breakdown: [],
          isValid: false,
          errorMessage: "Please enter non-negative numbers. Minutes must be 0-59.",
        });
        return;
      }
      const dec = hoursMinutesToDecimal(h, m);
      setResult({
        value: dec,
        unit: "DECIMAL HOURS",
        breakdown: [`${h} hours and ${m} minutes = ${dec} hours`],
        isValid: true,
      });
    } else {
      const d = isNaN(decimal) ? 0 : decimal;
      if (d < 0) {
        setResult({
          value: "—",
          unit: "STANDARD TIME",
          breakdown: [],
          isValid: false,
          errorMessage: "Please enter a non-negative decimal value.",
        });
        return;
      }
      const { hours: h, minutes: m } = decimalToHoursMinutes(d);
      setResult({
        value: `${h}h ${m}m`,
        unit: "STANDARD TIME",
        breakdown: [`${d} decimal hours = ${h} hours, ${m} minutes`],
        isValid: true,
      });
    }
  }, [activeTab, hours, minutes, decimal]);

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
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Tab selection */}
        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("toDecimal")}
            className={`pb-3 px-4 font-sans text-sm font-medium transition-all cursor-pointer ${
              activeTab === "toDecimal"
                ? "border-b-2 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
            style={{ borderBottomColor: activeTab === "toDecimal" ? groupAccent : "transparent" }}
          >
            To Decimal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fromDecimal")}
            className={`pb-3 px-4 font-sans text-sm font-medium transition-all cursor-pointer ${
              activeTab === "fromDecimal"
                ? "border-b-2 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
            style={{ borderBottomColor: activeTab === "fromDecimal" ? groupAccent : "transparent" }}
          >
            From Decimal
          </button>
        </div>

        {/* Tab content */}
        {activeTab === "toDecimal" ? (
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="tool-input-label" htmlFor="hours-input">
                Hours
              </label>
              <input
                id="hours-input"
                type="number"
                min="0"
                value={isNaN(hours) ? "" : hours}
                onChange={(e) => setHours(parseInt(e.target.value, 10))}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
            </div>
            <div className="flex flex-col">
              <label className="tool-input-label" htmlFor="minutes-input">
                Minutes
              </label>
              <input
                id="minutes-input"
                type="number"
                min="0"
                max="59"
                value={isNaN(minutes) ? "" : minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
                style={{ "--local-accent": groupAccent } as React.CSSProperties}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="decimal-input">
              Decimal Hours
            </label>
            <input
              id="decimal-input"
              type="number"
              step="any"
              min="0"
              value={isNaN(decimal) ? "" : decimal}
              onChange={(e) => setDecimal(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        )}

        {/* Conversion Reference Table */}
        <div className="mt-8 overflow-hidden rounded-lg border border-border bg-bg-surface p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 font-sans">
            Common Minute-to-Decimal Conversions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-xs font-mono text-text-muted">
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>15 Minutes</span>
              <span className="text-text-primary">0.25 hours</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>30 Minutes</span>
              <span className="text-text-primary">0.50 hours</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>45 Minutes</span>
              <span className="text-text-primary">0.75 hours</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>60 Minutes</span>
              <span className="text-text-primary">1.00 hour</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>5 Minutes</span>
              <span className="text-text-primary">0.083 hours</span>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-1">
              <span>10 Minutes</span>
              <span className="text-text-primary">0.167 hours</span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
