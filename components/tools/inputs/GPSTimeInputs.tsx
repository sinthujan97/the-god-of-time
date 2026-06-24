"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateGPSTimeCorrection } from "@/lib/tools/calculations";

interface GPSTimeInputsProps {
  groupAccent: string;
}

export default function GPSTimeInputs({ groupAccent }: GPSTimeInputsProps) {
  const [currentUtcStr, setCurrentUtcStr] = useState<string>("");
  const [liveSync, setLiveSync] = useState(true);

  // Live clocks state
  const [clocks, setClocks] = useState({
    gpsTime: "00:00:00 GPS",
    taiTime: "00:00:00 TAI",
    utcTime: "00:00:00 UTC",
    gpsSeconds: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    gpsSecondsValue: 0,
    totalAccumulatedLeapSeconds: 18,
    gpsTimeFormatted: "",
    taiTimeFormatted: ""
  });

  // Default prefill
  useEffect(() => {
    const now = new Date();
    setCurrentUtcStr(now.toISOString().slice(0, 16));
  }, []);

  // Update calculations
  useEffect(() => {
    if (liveSync) return;
    const res = calculateGPSTimeCorrection(currentUtcStr);
    setResult(res);
  }, [currentUtcStr, liveSync]);

  // Live ticking clocks loop
  useEffect(() => {
    if (!liveSync) return;

    const tick = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const utcTime = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} UTC`;
      
      const res = calculateGPSTimeCorrection(now.toISOString());
      setClocks({
        gpsTime: res.gpsTimeFormatted,
        taiTime: res.taiTimeFormatted,
        utcTime,
        gpsSeconds: res.gpsSecondsValue
      });
      setResult(res);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [liveSync]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Leap Seconds Correction Offset: +${result.totalAccumulatedLeapSeconds} seconds (GPS ahead of UTC)`,
      `TAI Drift Offset: +37 seconds (TAI ahead of UTC)`,
      `GPS atomic seconds since epoch: ${liveSync ? clocks.gpsSeconds.toLocaleString() : result.gpsSecondsValue.toLocaleString()} s`
    ];
  };

  const getCopyText = () => {
    return `TAI: ${liveSync ? clocks.taiTime : result.taiTimeFormatted} | GPS: ${liveSync ? clocks.gpsTime : result.gpsTimeFormatted} | UTC Offset: ${result.totalAccumulatedLeapSeconds}s`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={liveSync ? clocks.gpsTime : result.gpsTimeFormatted}
      resultUnit="CALIBRATED GPS TIME (SATELLITE FRAME)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Live sync checkbox */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="live-gps-sync"
            checked={liveSync}
            onChange={(e) => setLiveSync(e.target.checked)}
            className="w-4 h-4 rounded text-[color:var(--group-accent)] accent-[color:var(--group-accent)]"
          />
          <label htmlFor="live-gps-sync" className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted cursor-pointer select-none">
            Synchronize Real-Time Calibration (Live Ticking)
          </label>
        </div>

        {/* Manual inputs when live calibration is off */}
        {!liveSync && (
          <div className="flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-200">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="ref-utc">
              UTC Reference Time
            </label>
            <input
              id="ref-utc"
              type="datetime-local"
              value={currentUtcStr}
              onChange={(e) => setCurrentUtcStr(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        )}

        {/* Dashboard Grid Displays */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Atomic Calibration Grid
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
            
            {/* UTC Box */}
            <div className="p-4 bg-bg-card border border-border rounded-lg shadow">
              <span className="text-[9px] text-text-faint font-bold block uppercase mb-2">CIVILIAN UTC</span>
              <span className="text-lg font-bold text-text-primary block">
                {liveSync ? clocks.utcTime : new Date(currentUtcStr).toUTCString().split(" ")[4] || "00:00:00 UTC"}
              </span>
              <span className="text-[8px] text-text-muted block mt-1">Ground Standard</span>
            </div>

            {/* GPS Box */}
            <div className="p-4 bg-bg-card border border-border rounded-lg shadow" style={{ borderColor: groupAccent }}>
              <span className="text-[9px] text-text-faint font-bold block uppercase mb-2">SATELLITE GPS</span>
              <span className="text-lg font-bold text-text-primary block" style={{ color: groupAccent }}>
                {liveSync ? clocks.gpsTime : result.gpsTimeFormatted}
              </span>
              <span className="text-[8px] text-text-muted block mt-1">Constant Atomic (no leaps)</span>
            </div>

            {/* TAI Box */}
            <div className="p-4 bg-bg-card border border-border rounded-lg shadow">
              <span className="text-[9px] text-text-faint font-bold block uppercase mb-2">ATOMIC TAI</span>
              <span className="text-lg font-bold text-text-primary block">
                {liveSync ? clocks.taiTime : result.taiTimeFormatted}
              </span>
              <span className="text-[8px] text-text-muted block mt-1">Universal Drift Datum</span>
            </div>

          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
