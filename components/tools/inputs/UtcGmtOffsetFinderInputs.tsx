"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateUTCOffset } from "@/lib/tools/calculations";

interface UtcGmtOffsetFinderInputsProps {
  groupAccent: string;
}

export default function UtcGmtOffsetFinderInputs({ groupAccent }: UtcGmtOffsetFinderInputsProps) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [targetTz, setTargetTz] = useState<string>("America/New_York");
  
  // Real-time ticking state
  const [liveZuluTime, setLiveZuluTime] = useState<string>("");
  const [liveLocalTime, setLiveLocalTime] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    currentOffsetMinutes: 0,
    offsetStringFormatted: "",
    currentZulutimeFormatted: "",
    localTimeFormatted: "",
    rawEpochSeconds: 0
  });

  useEffect(() => {
    setTargetDate(new Date());
  }, []);

  // Sync calculations
  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const dateStr = formatDateToYYYYMMDD(targetDate);
    const res = calculateUTCOffset(targetTz, dateStr);
    setResult(res);
  }, [targetTz, targetDate]);

  // Live ticking clock effect
  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setLiveZuluTime(`${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} Z`);
      
      try {
        const localFormatted = now.toLocaleTimeString("en-US", {
          timeZone: targetTz,
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        setLiveLocalTime(localFormatted);
      } catch (e) {
        setLiveLocalTime(now.toLocaleTimeString());
      }
    };
    
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [targetTz]);

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
    return [
      `Selected Location: ${targetTz}`,
      `Total Offset Shift: ${result.currentOffsetMinutes} minutes`,
      `Database Unix Epoch: ${result.rawEpochSeconds.toLocaleString()} seconds`
    ];
  };

  const getCopyText = () => {
    return `Location: ${targetTz} | Offset: ${result.offsetStringFormatted} | Evaluated time: ${result.localTimeFormatted}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.offsetStringFormatted}
      resultUnit="RESOLVED GMT/UTC OFFSET"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Date and Timezone Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <DatePicker
              id="offset-date"
              label="Evaluation Date"
              value={targetDate}
              onChange={setTargetDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col">
            <ToolSelect
              value={targetTz}
              onChange={setTargetTz}
              options={timezoneOptions}
              label="Target Location / Timezone"
              searchable
            />
          </div>
        </div>

        {/* Live Terminal Clock Display */}
        <div className="p-5 border border-border rounded-lg bg-bg-card font-mono text-xs space-y-4 shadow-inner relative overflow-hidden">
          <div className="absolute right-3 top-3 w-2 h-2 rounded-full bg-accent-utility-a animate-ping" />
          
          <div className="flex justify-between items-center text-text-muted border-b border-border/40 pb-2">
            <span>TERMINAL MODULE :: TIME_SYNC_NODE_V3</span>
            <span className="text-[10px] text-accent-utility-a uppercase font-bold">● ONLINE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-bg-surface border border-border rounded">
              <span className="text-[10px] text-text-faint uppercase font-bold block mb-1">Coordinated Universal (Zulu)</span>
              <span className="text-xl font-bold text-text-primary block font-mono">{liveZuluTime || "00:00:00 Z"}</span>
            </div>

            <div className="p-3 bg-bg-surface border border-border rounded">
              <span className="text-[10px] text-text-faint uppercase font-bold block mb-1">Target Local Time ({targetTz.split("/")[1]?.replace(/_/g, " ") || targetTz})</span>
              <span className="text-xl font-bold text-text-primary block font-mono" style={{ color: groupAccent }}>{liveLocalTime || "00:00:00"}</span>
            </div>
          </div>

          <div className="text-[10px] text-text-faint leading-relaxed space-y-1">
            <p>&gt; offset_drift_val = {result.currentOffsetMinutes} mins</p>
            <p>&gt; standard_iso_string = {targetDate?.toISOString() || ""}</p>
            <p>&gt; status = calibration_stable</p>
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
