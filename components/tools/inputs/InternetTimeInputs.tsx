"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { convertToInternetTime } from "@/lib/tools/calculations";

interface InternetTimeInputsProps {
  groupAccent: string;
}

export default function InternetTimeInputs({ groupAccent }: InternetTimeInputsProps) {
  const [hours, setHours] = useState<number>(12);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [liveSync, setLiveSync] = useState(true);

  // Live beats state
  const [liveBeats, setLiveBeats] = useState("@000");
  const [liveBmt, setLiveBmt] = useState("00:00:00 BMT");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    beatValueString: "@000",
    bmtTimeFormatted: "00:00:00 BMT"
  });

  // Prefill
  useEffect(() => {
    const now = new Date();
    setHours(now.getHours());
    setMinutes(now.getMinutes());
    setSeconds(now.getSeconds());
  }, []);

  // Update calculation
  useEffect(() => {
    if (liveSync) return;
    const res = convertToInternetTime(hours, minutes, seconds);
    setResult(res);
  }, [hours, minutes, seconds, liveSync]);

  // Live ticking beats tracker
  useEffect(() => {
    if (!liveSync) return;

    const tick = () => {
      const res = convertToInternetTime(0, 0, 0); // uses live internally in calculation
      setLiveBeats(res.beatValueString);
      setLiveBmt(res.bmtTimeFormatted);
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
      `Internet Standard: Swatch Decimal Time`,
      `Swiss reference meridians (Biel Mean Time): ${liveSync ? liveBmt : result.bmtTimeFormatted}`,
      `Calculation basis: 1000 beats per 24-hour day`
    ];
  };

  const getCopyText = () => {
    return `Internet Time: ${liveSync ? liveBeats : result.beatValueString} (${liveSync ? liveBmt : result.bmtTimeFormatted})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={liveSync ? liveBeats : result.beatValueString}
      resultUnit="SWATCH INTERNET BEATS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Live sync option */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="live-beats-sync"
            checked={liveSync}
            onChange={(e) => setLiveSync(e.target.checked)}
            className="w-4 h-4 rounded text-[color:var(--group-accent)] accent-[color:var(--group-accent)]"
          />
          <label htmlFor="live-beats-sync" className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted cursor-pointer select-none">
            Synchronize Live Beats (Ticking)
          </label>
        </div>

        {/* Manual selection */}
        {!liveSync && (
          <div className="grid grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hours">
                Hours
              </label>
              <input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="minutes">
                Minutes
              </label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="seconds">
                Seconds
              </label>
              <input
                id="seconds"
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
              />
            </div>
          </div>
        )}

        {/* Beats Display */}
        <div className="p-6 border border-border rounded-lg bg-bg-card font-mono text-center space-y-4 shadow relative overflow-hidden">
          <div className="text-[10px] text-text-muted tracking-widest uppercase">
            SWATCH INTERNET TIMING HUD
          </div>

          <div className="text-4xl md:text-[52px] font-bold text-text-primary tracking-widest leading-none py-4 select-all" style={{ color: groupAccent }}>
            {liveSync ? liveBeats : result.beatValueString}
          </div>

          <div className="text-[11px] text-text-muted font-bold">
            {liveSync ? liveBmt : result.bmtTimeFormatted}
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
