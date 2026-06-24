"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateZoneTimes, ZoneConverterResult } from "@/lib/tools/calculations";

interface WorldTimeZoneConverterInputsProps {
  groupAccent: string;
}

export default function WorldTimeZoneConverterInputs({ groupAccent }: WorldTimeZoneConverterInputsProps) {
  const [baseDate, setBaseDate] = useState<Date | undefined>(undefined);
  const [baseTime, setBaseTime] = useState<string>("12:00");
  const [sourceTz, setSourceTz] = useState<string>("UTC");
  const [targetTzs, setTargetTzs] = useState<string[]>([
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo"
  ]);
  const [newTz, setNewTz] = useState<string>("America/Los_Angeles");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<ZoneConverterResult>({
    baseTimeFormatted: "",
    convertedZones: [],
    isValid: false
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
    if (!baseDate) return;
    const dateStr = formatDateToYYYYMMDD(baseDate);
    const res = calculateZoneTimes(dateStr, baseTime, sourceTz, targetTzs);
    setResult(res);
  }, [baseDate, baseTime, sourceTz, targetTzs]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddTz = () => {
    if (targetTzs.includes(newTz)) return;
    setTargetTzs([...targetTzs, newTz]);
  };

  const handleRemoveTz = (tz: string) => {
    setTargetTzs(targetTzs.filter((t) => t !== tz));
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
    if (!result.isValid) return ["Select date and time to convert"];
    return [
      `Source Moment: ${result.baseTimeFormatted} (${sourceTz})`,
      `Target Count: ${result.convertedZones.length} locations converted`
    ];
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `World Conversion for ${result.baseTimeFormatted} (${sourceTz}): ` + 
      result.convertedZones.map((z) => `${z.cityName}: ${z.currentTimeFormatted} (${z.offsetString})`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.convertedZones[0]?.currentTimeFormatted || "—"}
      resultUnit="CONVERTED MOMENT (PRIMARY TARGET)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Source Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <DatePicker
              id="base-date"
              label="Date"
              value={baseDate}
              onChange={setBaseDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="base-time">
              Local Time (HH:MM)
            </label>
            <input
              id="base-time"
              type="time"
              value={baseTime}
              onChange={(e) => setBaseTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col">
            <ToolSelect
              value={sourceTz}
              onChange={setSourceTz}
              options={timezoneOptions}
              label="Source Timezone"
              searchable
            />
          </div>
        </div>

        {/* Target Timezone Creator */}
        <div className="pt-4 border-t border-border/40">
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 w-full">
              <ToolSelect
                value={newTz}
                onChange={setNewTz}
                options={timezoneOptions}
                label="Add Target Timezone"
                searchable
              />
            </div>
            <button
              type="button"
              onClick={handleAddTz}
              className="h-12 px-6 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card transition-colors w-full sm:w-auto"
            >
              Add Zone
            </button>
          </div>
        </div>

        {/* Converted Zones Dashboard */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Conversion Dashboard
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {result.convertedZones.map((z, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-bg-card border border-border rounded-lg animate-in fade-in duration-200"
              >
                <div>
                  <span className="font-sans text-sm font-bold text-text-primary block">{z.cityName}</span>
                  <span className="text-[10px] text-text-muted font-mono uppercase">
                    {z.zoneName} • {z.offsetString}
                  </span>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="font-sans font-semibold text-sm text-text-primary block">
                      {z.currentTimeFormatted.split(",")[2] || z.currentTimeFormatted}
                    </span>
                    <span className="text-[10px] font-sans font-medium uppercase tracking-wider block">
                      {z.currentTimeFormatted.split(",")[0] + ", " + z.currentTimeFormatted.split(",")[1]}
                      {z.isNextDay && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-accent-utility-a/10 text-accent-utility-a text-[8px] font-bold">+1 Day</span>}
                      {z.isPastDay && <span className="ml-1.5 px-1.5 py-0.5 rounded bg-accent-utility-e/10 text-accent-utility-e text-[8px] font-bold">-1 Day</span>}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTz(z.zoneName)}
                    className="text-text-muted hover:text-accent-utility-e p-1 rounded hover:bg-bg-surface transition-colors"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {result.convertedZones.length === 0 && (
              <div className="text-center py-8 text-text-muted font-sans text-sm italic border border-dashed border-border rounded-lg">
                No target timezones added. Select a zone above and click Add Zone.
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
