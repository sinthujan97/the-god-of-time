"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { getDayProgressPercentage, getYearProgressPercentage } from "@/lib/tools/calculations";

interface TimePercentageCalculatorInputsProps {
  groupAccent: string;
}

export default function TimePercentageCalculatorInputs({ groupAccent }: TimePercentageCalculatorInputsProps) {
  const [activeTab, setActiveTab] = useState<"day" | "year">("day");
  const [customTime, setCustomTime] = useState<string>("12:00");
  const [now, setNow] = useState<Date>(new Date());

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Client-side initialization
  useEffect(() => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    setCustomTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
  }, []);

  // Live clock tick for live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  // Compute percentages
  let percentage = 0;
  let unit = "";
  let breakdown: string[] = [];

  if (activeTab === "day") {
    percentage = getDayProgressPercentage(customTime);
    unit = "% OF DAY ELAPSED";
    breakdown = [
      `${percentage}% of the 24-hour day has passed at ${customTime}`,
      `${(100 - percentage).toFixed(2)}% of the day remains`,
    ];
  } else {
    // Year progress is live
    percentage = getYearProgressPercentage(now);
    unit = "% OF YEAR ELAPSED";
    const year = now.getFullYear();
    breakdown = [
      `${percentage}% of the year ${year} has passed`,
      `${(100 - percentage).toFixed(2)}% of the year remains`,
      `Live updates ticking in real time`,
    ];
  }

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${percentage.toFixed(2)}%`}
      resultUnit={unit}
      resultBreakdown={breakdown}
      copyText={`${percentage.toFixed(2)}%`}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Tabs switcher */}
        <div className="flex border-b border-border mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("day")}
            className={`pb-3 px-4 font-sans text-sm font-medium transition-all cursor-pointer ${
              activeTab === "day"
                ? "border-b-2 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
            style={{ borderBottomColor: activeTab === "day" ? groupAccent : "transparent" }}
          >
            Day Progress
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("year")}
            className={`pb-3 px-4 font-sans text-sm font-medium transition-all cursor-pointer ${
              activeTab === "year"
                ? "border-b-2 text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
            style={{ borderBottomColor: activeTab === "year" ? groupAccent : "transparent" }}
          >
            Year Progress
          </button>
        </div>

        {/* Custom time input for Day Progress */}
        {activeTab === "day" && (
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="custom-time-input">
              Select Time
            </label>
            <input
              id="custom-time-input"
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm bg-bg-surface border border-border rounded-md focus:outline-none focus:ring-2"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        )}

        {/* Visual Progress Bar */}
        <div className="flex flex-col gap-2 pt-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Visual Progress
          </span>
          <div className="w-full bg-border rounded-[4px] h-[8px] overflow-hidden">
            <div
              className="h-full rounded-[4px] transition-all duration-500 ease-out"
              style={{
                width: `${percentage}%`,
                backgroundColor: groupAccent,
              }}
            />
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
