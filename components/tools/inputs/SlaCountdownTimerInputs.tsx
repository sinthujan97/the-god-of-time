"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateSLACountdown, SLAResult } from "@/lib/tools/calculations";

interface SlaCountdownTimerInputsProps {
  groupAccent: string;
}

export default function SlaCountdownTimerInputs({ groupAccent }: SlaCountdownTimerInputsProps) {
  const [createdDate, setCreatedDate] = useState<Date | undefined>(undefined);
  const [createdTime, setCreatedTime] = useState<string>("09:00");
  const [slaHours, setSlaHours] = useState<number>(8);
  const [businessOnly, setBusinessOnly] = useState<boolean>(true);
  const [startHour, setStartHour] = useState<number>(9);
  const [endHour, setEndHour] = useState<number>(17);
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<SLAResult>({
    deadlineDateTime: new Date(),
    deadlineDateFormatted: "—",
    deadlineTimeFormatted: "",
    hoursRemaining: 0,
    minutesRemaining: 0,
    percentageElapsed: 0,
    isBreached: false,
    breachHoursAgo: 0,
    urgencyLevel: 'safe',
  });

  useEffect(() => {
    setCreatedDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isCreatedInvalid = isDateInvalid(createdDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!createdDate) {
      setResult({
        deadlineDateTime: new Date(),
        deadlineDateFormatted: "—",
        deadlineTimeFormatted: "",
        hoursRemaining: 0,
        minutesRemaining: 0,
        percentageElapsed: 0,
        isBreached: false,
        breachHoursAgo: 0,
        urgencyLevel: 'safe',
      });
      return;
    }

    if (isCreatedInvalid) {
      return;
    }

    if (isNaN(slaHours) || slaHours <= 0) {
      return;
    }

    const calc = calculateSLACountdown(
      formatDateToYYYYMMDD(createdDate),
      createdTime || "00:00",
      slaHours,
      businessOnly,
      startHour,
      endHour,
      excludeWeekends
    );
    setResult(calc);
  }, [createdDate, createdTime, slaHours, businessOnly, startHour, endHour, excludeWeekends, isCreatedInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    if (!createdDate) return "";
    return `SLA Deadline: ${result.deadlineDateFormatted} at ${result.deadlineTimeFormatted}. Status: ${result.isBreached ? "BREACHED" : `${result.hoursRemaining}h ${result.minutesRemaining}m remaining`}.`;
  };

  // Color mapping based on urgency
  const urgencyColors = {
    safe: {
      bg: "rgba(16, 185, 129, 0.1)",
      text: "#10B981",
      border: "rgba(16, 185, 129, 0.2)",
      bar: "#10B981"
    },
    warning: {
      bg: "rgba(245, 158, 11, 0.1)",
      text: "#F59E0B",
      border: "rgba(245, 158, 11, 0.2)",
      bar: "#F59E0B"
    },
    critical: {
      bg: "rgba(239, 68, 68, 0.1)",
      text: "#EF4444",
      border: "rgba(239, 68, 68, 0.2)",
      bar: "#EF4444"
    },
    breached: {
      bg: "rgba(239, 68, 68, 0.15)",
      text: "#EF4444",
      border: "rgba(239, 68, 68, 0.3)",
      bar: "#EF4444"
    }
  };

  const currentColors = urgencyColors[result.urgencyLevel];

  const primaryResultValue = result.isBreached
    ? `BREACHED`
    : `${result.hoursRemaining}h ${result.minutesRemaining}m`;

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.deadlineDateFormatted !== "—" ? `${result.deadlineDateFormatted} @ ${result.deadlineTimeFormatted}` : "—"}
      resultUnit="SLA BREACH DEADLINE"
      resultBreakdown={[
        result.isBreached 
          ? `Breached ${result.breachHoursAgo} hours ago` 
          : `${result.hoursRemaining} hours and ${result.minutesRemaining} minutes remaining until breach`,
        businessOnly 
          ? `Calculated using business hours only (${startHour}:00 - ${endHour}:00)` 
          : "Calculated using 24/7 calendar hours",
        excludeWeekends ? "Weekends excluded from elapsed time" : "Weekends included in SLA time"
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isCreatedInvalid ? "Invalid ticket creation date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Ticket Creation Date and Time */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="ticket-created-date"
              label="Ticket Creation Date"
              value={createdDate}
              onChange={setCreatedDate}
              accentColor={groupAccent}
            />
            {isCreatedInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="ticket-created-time">
              Ticket Creation Time
            </label>
            <input
              id="ticket-created-time"
              type="time"
              value={createdTime}
              onChange={(e) => setCreatedTime(e.target.value)}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: SLA Target Hours & Exclude Weekends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="sla-hours-input">
              SLA Limit (Hours)
            </label>
            <input
              id="sla-hours-input"
              type="number"
              min="0.5"
              step="0.5"
              value={slaHours || ""}
              onChange={(e) => setSlaHours(parseFloat(e.target.value) || 0)}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col justify-end">
            <span className="tool-input-label block mb-1">
              Weekend Exclusion
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

        {/* Business Hours Setup */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Business Hours Settings
            </h3>
            <PillToggle
              value={businessOnly ? "true" : "false"}
              onChange={(val) => setBusinessOnly(val === "true")}
              options={[
                { value: "true", label: "Business Hours" },
                { value: "false", label: "24/7 Hours" }
              ]}
              accentColor={groupAccent}
            />
          </div>

          {businessOnly && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border animate-in fade-in duration-200">
              <div className="flex flex-col">
                <label className="tool-input-label text-[11px]" htmlFor="start-hour-input">
                  Start Hour (24h clock)
                </label>
                <input
                  id="start-hour-input"
                  type="number"
                  min="0"
                  max="23"
                  value={startHour}
                  onChange={(e) => setStartHour(Math.min(23, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                  className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <label className="tool-input-label text-[11px]" htmlFor="end-hour-input">
                  End Hour (24h clock)
                </label>
                <input
                  id="end-hour-input"
                  type="number"
                  min="0"
                  max="24"
                  value={endHour}
                  onChange={(e) => setEndHour(Math.min(24, Math.max(startHour + 1, parseInt(e.target.value, 10) || 0)))}
                  className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
                />
              </div>
            </div>
          )}
        </div>

        {/* Visual Progress Bar (Aesthetic Gauge) */}
        {createdDate && !isCreatedInvalid && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-3">
            <div className="flex justify-between items-center text-xs font-sans">
              <span className="text-text-muted font-medium">SLA Time Elapsed</span>
              <span 
                className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded tracking-wide"
                style={{ backgroundColor: currentColors.bg, color: currentColors.text }}
              >
                {result.urgencyLevel}
              </span>
            </div>
            
            <div className="w-full h-3 bg-bg-surface border border-border rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${result.percentageElapsed}%`,
                  backgroundColor: currentColors.bar
                }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-text-faint">
              <span>0% (Created)</span>
              <span className="text-text-muted font-semibold">{result.percentageElapsed}%</span>
              <span>100% (Breach Limit)</span>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
