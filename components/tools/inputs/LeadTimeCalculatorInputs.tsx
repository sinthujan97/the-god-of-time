"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateLeadTime, LeadTimeResult } from "@/lib/tools/calculations";

interface LeadTimeCalculatorInputsProps {
  groupAccent: string;
}

export default function LeadTimeCalculatorInputs({ groupAccent }: LeadTimeCalculatorInputsProps) {
  const [orderDate, setOrderDate] = useState<Date | undefined>(undefined);
  const [processingDays, setProcessingDays] = useState<number>(3);
  const [shippingDays, setShippingDays] = useState<number>(5);
  const [customsDays, setCustomsDays] = useState<number>(2);
  const [bufferDays, setBufferDays] = useState<number>(1);
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<LeadTimeResult>({
    processingComplete: new Date(),
    shippingComplete: new Date(),
    customsComplete: new Date(),
    expectedDelivery: new Date(),
    totalLeadTimeDays: 0,
    allDatesFormatted: [],
  });

  useEffect(() => {
    setOrderDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isOrderInvalid = isDateInvalid(orderDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!orderDate) return;
    if (isOrderInvalid) return;

    const calc = calculateLeadTime(
      formatDateToYYYYMMDD(orderDate),
      processingDays,
      shippingDays,
      customsDays,
      bufferDays,
      excludeWeekends
    );
    setResult(calc);
  }, [orderDate, processingDays, shippingDays, customsDays, bufferDays, excludeWeekends, isOrderInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!orderDate || !result.totalLeadTimeDays) return "";
    const formatted = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(result.expectedDelivery);
    return `Expected Delivery: ${formatted}. Total lead time: ${result.totalLeadTimeDays} days.`;
  };

  const formattedDeliveryDate = result.totalLeadTimeDays > 0
    ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(result.expectedDelivery)
    : "—";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formattedDeliveryDate}
      resultUnit="EXPECTED DELIVERY DATE"
      resultBreakdown={[
        `Total lead time: ${result.totalLeadTimeDays} calendar days`,
        excludeWeekends ? "Weekends excluded from phase calculations" : "All calendar days included"
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isOrderInvalid ? "Invalid order date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Order Date & Mode */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="order-date"
              label="Order Date"
              value={orderDate}
              onChange={setOrderDate}
              accentColor={groupAccent}
            />
            {isOrderInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <span className="tool-input-label block mb-1">
              Workdays Mode
            </span>
            <PillToggle
              value={excludeWeekends ? "true" : "false"}
              onChange={(val) => setExcludeWeekends(val === "true")}
              options={[
                { value: "true", label: "Exclude Weekends" },
                { value: "false", label: "Include Weekends" }
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>

        {/* Logistic Phases Durations */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="tool-input-label text-[11px]" htmlFor="processing-days-input">
              Processing (days)
            </label>
            <input
              id="processing-days-input"
              type="number"
              min="0"
              value={processingDays || ""}
              onChange={(e) => setProcessingDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label text-[11px]" htmlFor="shipping-days-input">
              Transit/Shipping
            </label>
            <input
              id="shipping-days-input"
              type="number"
              min="0"
              value={shippingDays || ""}
              onChange={(e) => setShippingDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label text-[11px]" htmlFor="customs-days-input">
              Customs (days)
            </label>
            <input
              id="customs-days-input"
              type="number"
              min="0"
              value={customsDays || ""}
              onChange={(e) => setCustomsDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label text-[11px]" htmlFor="buffer-days-input">
              Safety Buffer
            </label>
            <input
              id="buffer-days-input"
              type="number"
              min="0"
              value={bufferDays || ""}
              onChange={(e) => setBufferDays(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
            />
          </div>
        </div>

        {/* Progressive Timeline Visual flow */}
        {orderDate && !isOrderInvalid && result.allDatesFormatted.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Delivery Stage Flow
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
              {result.allDatesFormatted.map((stageItem: any, index: number) => (
                <div 
                  key={index} 
                  className="bg-bg-surface border border-border p-3 rounded-md text-xs relative flex flex-col justify-between"
                  style={{ borderLeftColor: index === 0 ? "rgba(255,255,255,0.2)" : groupAccent, borderLeftWidth: "3px" }}
                >
                  <div>
                    <span className="font-sans text-[10px] uppercase text-text-faint block">
                      Stage {index + 1}
                    </span>
                    <span className="font-sans font-bold text-text-primary mt-1 block">
                      {stageItem.stage}
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/40 font-sans flex justify-between items-center text-text-muted">
                    <span>{stageItem.date}</span>
                    {stageItem.days > 0 && (
                      <span className="font-mono bg-bg-card px-1 rounded">
                        +{stageItem.days}d
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
