"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateNextDSTTransition } from "@/lib/tools/calculations";

interface DSTTrackerInputsProps {
  groupAccent: string;
}

export default function DSTTrackerInputs({ groupAccent }: DSTTrackerInputsProps) {
  const [baseDate, setBaseDate] = useState<Date | undefined>(undefined);
  const [targetTz, setTargetTz] = useState<string>("America/New_York");
  
  // Detailed countdown state
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isValid: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState<any>({
    hasDSTSystem: false,
    activeTransition: null,
    currentStatusLabel: "Standard time region (no DST transitions scheduled)."
  });

  useEffect(() => {
    setBaseDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const dateStr = formatDateToYYYYMMDD(baseDate);
    const res = calculateNextDSTTransition(targetTz, dateStr);
    setResult(res);
  }, [targetTz, baseDate]);

  // Live ticking countdown logic
  useEffect(() => {
    if (!result.hasDSTSystem || !result.activeTransition) {
      setCountdown((prev) => ({ ...prev, isValid: false }));
      return;
    }

    const transitionDate = new Date(result.activeTransition.nextTransitionDate);

    const updateCountdown = () => {
      const now = new Date();
      const diffMs = transitionDate.getTime() - now.getTime();

      if (diffMs <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isValid: false });
        return;
      }

      const days = Math.floor(diffMs / 86400000);
      const hours = Math.floor((diffMs % 86400000) / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);

      setCountdown({ days, hours, minutes, seconds, isValid: true });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [result]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const timezoneOptions = [
    { value: "America/Los_Angeles", label: "US Pacific (PT)" },
    { value: "America/Denver", label: "US Mountain (MT)" },
    { value: "America/Chicago", label: "US Central (CT)" },
    { value: "America/New_York", label: "US Eastern (ET)" },
    { value: "America/Sao_Paulo", label: "Sao Paulo (BRT)" },
    { value: "UTC", label: "Coordinated Universal (UTC)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris/Berlin (CET)" },
    { value: "Europe/Moscow", label: "Moscow (MSK)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
    { value: "Australia/Perth", label: "Perth (AWST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST)" }
  ];

  const getBreakdownRows = () => {
    if (!result.hasDSTSystem || !result.activeTransition) {
      return [
        "DST Status: Standard Time zone",
        "Transitions Scheduled: None"
      ];
    }
    return [
      `DST Shift Shift direction: Clocks shift ${result.activeTransition.typeOfShift}`,
      `Adjustment Amount: ${result.activeTransition.shiftAmountMinutes} minutes`,
      `Timezone Abbreviation Target: ${result.activeTransition.timezoneLabelAbbreviation}`
    ];
  };

  const getCopyText = () => {
    if (!result.activeTransition) return "No DST transition scheduled.";
    return `Next transition for ${targetTz}: Clocks shift ${result.activeTransition.typeOfShift} by ${result.activeTransition.shiftAmountMinutes} mins on ${result.activeTransition.nextTransitionFormatted}.`;
  };

  const resultValStr = result.activeTransition 
    ? `${result.activeTransition.nextTransitionFormatted} (${result.activeTransition.typeOfShift === "forward" ? "+1h" : "-1h"})`
    : "No transitions";

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={resultValStr}
      resultUnit="NEXT CLOCK TRANSITION DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <DatePicker
              id="base-date"
              label="Evaluation Start Date"
              value={baseDate}
              onChange={setBaseDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col">
            <ToolSelect
              value={targetTz}
              onChange={setTargetTz}
              options={timezoneOptions}
              label="Target Location"
              searchable
            />
          </div>
        </div>

        {/* Live Countdown Panel */}
        <div className="p-5 border border-border rounded-lg bg-bg-card text-center space-y-4 shadow-inner relative overflow-hidden">
          <h4 className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            Countdown until active shift
          </h4>

          {countdown.isValid ? (
            <div className="flex justify-center gap-3 font-mono">
              <div className="bg-bg-surface border border-border px-3 py-2.5 rounded-md min-w-[64px]">
                <span className="text-xl font-bold text-text-primary block">{countdown.days}</span>
                <span className="text-[9px] uppercase tracking-wider text-text-faint">DAYS</span>
              </div>
              <div className="bg-bg-surface border border-border px-3 py-2.5 rounded-md min-w-[64px]">
                <span className="text-xl font-bold text-text-primary block">{String(countdown.hours).padStart(2, "0")}</span>
                <span className="text-[9px] uppercase tracking-wider text-text-faint">HRS</span>
              </div>
              <div className="bg-bg-surface border border-border px-3 py-2.5 rounded-md min-w-[64px]">
                <span className="text-xl font-bold text-text-primary block">{String(countdown.minutes).padStart(2, "0")}</span>
                <span className="text-[9px] uppercase tracking-wider text-text-faint">MINS</span>
              </div>
              <div className="bg-bg-surface border border-border px-3 py-2.5 rounded-md min-w-[64px]">
                <span className="text-xl font-bold text-text-primary block" style={{ color: groupAccent }}>
                  {String(countdown.seconds).padStart(2, "0")}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-text-faint">SECS</span>
              </div>
            </div>
          ) : (
            <div className="py-4 text-xs font-sans text-text-faint italic leading-relaxed">
              {result.currentStatusLabel}
            </div>
          )}

          <div className="text-[10px] text-text-faint font-sans">
            Timezone Database calibration: Resolved standard IANA schedules.
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
