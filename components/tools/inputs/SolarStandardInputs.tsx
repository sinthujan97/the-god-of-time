"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateSolarTimeVariance } from "@/lib/tools/calculations";

interface SolarStandardInputsProps {
  groupAccent: string;
}

export default function SolarStandardInputs({ groupAccent }: SolarStandardInputsProps) {
  const [longitude, setLongitude] = useState<number>(-74.006); // New York
  const [datetimeStr, setDatetimeStr] = useState<string>("2026-06-24T12:00");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    trueSolarTimeFormatted: "12:00",
    equationOfTimeMinutes: 0,
    netDeviationMinutes: 0
  });

  // Default pre-fill date-time
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const localStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T12:00`;
    setDatetimeStr(localStr);
  }, []);

  useEffect(() => {
    if (!datetimeStr) return;
    const res = calculateSolarTimeVariance(longitude, datetimeStr);
    setResult(res);
  }, [longitude, datetimeStr]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    const eot = result.equationOfTimeMinutes;
    const eotLabel = eot >= 0 ? `Seasonal orbit ahead: +${eot} mins` : `Seasonal orbit behind: ${eot} mins`;
    const dev = result.netDeviationMinutes;
    const devLabel = dev >= 0 ? `Net solar shift ahead: +${dev} mins` : `Net solar shift behind: ${dev} mins`;

    return [
      `Longitude Correction (4m per degree): ${(longitude * 4).toFixed(1)} minutes`,
      `Equation of Time (elliptical orbit): ${eotLabel}`,
      `Total Chronological Variance: ${devLabel}`
    ];
  };

  const getCopyText = () => {
    return `Civil Time: ${datetimeStr.split("T")[1]} | True Solar Time: ${result.trueSolarTimeFormatted} | Net Deviation: ${result.netDeviationMinutes} mins`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.trueSolarTimeFormatted}
      resultUnit="TRUE SOLAR TIME (APPARENT SUNDIAL)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Longitude and Time Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="long-val">
              Longitude Coordinate (Decimal Degrees)
            </label>
            <input
              id="long-val"
              type="number"
              min="-180"
              max="180"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(Math.min(180, Math.max(-180, parseFloat(e.target.value) || 0)))}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="civil-time">
              Civil Time (Local Clock)
            </label>
            <input
              id="civil-time"
              type="datetime-local"
              value={datetimeStr}
              onChange={(e) => setDatetimeStr(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        </div>

        {/* Premium visual dials */}
        <div className="p-4 border border-border rounded-lg bg-bg-card space-y-4">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted text-center">
            Standard Civil vs Astronomical Sun Variance
          </h3>
          
          <div className="grid grid-cols-2 gap-4 text-center font-mono">
            {/* Civil Clock */}
            <div className="p-3 bg-bg-surface border border-border rounded shadow-inner">
              <span className="text-[9px] text-text-faint font-bold block uppercase mb-1">CIVIL TIME</span>
              <span className="text-xl font-bold text-text-primary block">
                {datetimeStr.split("T")[1] || "12:00"}
              </span>
              <span className="text-[8px] text-text-muted block mt-0.5 font-sans">Legal Clock</span>
            </div>

            {/* Solar Clock */}
            <div className="p-3 bg-bg-surface border border-border rounded shadow-inner" style={{ borderColor: groupAccent }}>
              <span className="text-[9px] text-text-faint font-bold block uppercase mb-1">SOLAR SUNDIAL</span>
              <span className="text-xl font-bold text-text-primary block" style={{ color: groupAccent }}>
                {result.trueSolarTimeFormatted}
              </span>
              <span className="text-[8px] text-text-muted block mt-0.5 font-sans">Sun Apex Zenith</span>
            </div>
          </div>

          {/* Deviation bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-sans font-semibold uppercase text-text-muted">
              <span>Behind Sun</span>
              <span>In-Sync</span>
              <span>Ahead of Sun</span>
            </div>
            <div className="h-3 w-full bg-bg-surface border border-border rounded relative overflow-hidden">
              <div
                className="h-full bg-accent-utility-a/50 rounded"
                style={{
                  left: "50%",
                  width: `${Math.min(48, Math.max(-48, (result.netDeviationMinutes / 60) * 100))}%`,
                  position: "absolute",
                  transform: result.netDeviationMinutes < 0 ? "translateX(-100%)" : "none"
                }}
              />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1.5px] bg-text-muted/40" />
            </div>
            <div className="text-[9px] font-sans text-text-faint text-center">
              Total Variance Shift: {result.netDeviationMinutes} minutes
            </div>
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
