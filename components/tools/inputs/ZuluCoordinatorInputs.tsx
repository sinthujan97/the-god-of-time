"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { syncZuluTime } from "@/lib/tools/calculations";

interface ZuluCoordinatorInputsProps {
  groupAccent: string;
}

export default function ZuluCoordinatorInputs({ groupAccent }: ZuluCoordinatorInputsProps) {
  const [deviceTime, setDeviceTime] = useState<string>("");
  const [liveTicking, setLiveTicking] = useState(true);

  // Real-time ticking time state
  const [zuluClock, setZuluClock] = useState("00:00:00 Z");
  const [zuluDate, setZuluDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    zuluTimeFormatted: "",
    zuluDateFormatted: "",
    localTimeDifferenceMinutes: 0,
    isoStringNotation: ""
  });

  // Default pre-fill
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const localStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    setDeviceTime(localStr);
  }, []);

  // Update calculation
  useEffect(() => {
    if (liveTicking) return;
    const res = syncZuluTime(deviceTime);
    setResult(res);
  }, [deviceTime, liveTicking]);

  // Live ticking zulu tracker
  useEffect(() => {
    if (!liveTicking) return;

    const tick = () => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setZuluClock(`${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())} Z`);
      
      const dateStr = new Intl.DateTimeFormat("en-US", {
        timeZone: "UTC",
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(now);
      setZuluDate(dateStr);

      const res = syncZuluTime(now.toISOString());
      setResult(res);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [liveTicking]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    const diffMin = result.localTimeDifferenceMinutes;
    const diffHrs = parseFloat((diffMin / 60).toFixed(1));
    const label = diffMin === 0 
      ? "Identical to Local Time"
      : diffMin > 0 
        ? `${diffHrs} hours behind Local Time` 
        : `${Math.abs(diffHrs)} hours ahead of Local Time`;

    return [
      `Zulu Date: ${liveTicking ? zuluDate : result.zuluDateFormatted}`,
      `Local Offset Delta: ${label}`,
      `ISO Index Standard: ${result.isoStringNotation}`
    ];
  };

  const getCopyText = () => {
    return `ZULU TIME: ${liveTicking ? zuluClock : result.zuluTimeFormatted} | Date: ${liveTicking ? zuluDate : result.zuluDateFormatted}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={liveTicking ? zuluClock : result.zuluTimeFormatted}
      resultUnit="COORDINATED ZULU TIMESTAMPS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Toggle Live Ticking */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="live-sync"
            checked={liveTicking}
            onChange={(e) => setLiveTicking(e.target.checked)}
            className="w-4 h-4 rounded text-[color:var(--group-accent)] accent-[color:var(--group-accent)]"
          />
          <label htmlFor="live-sync" className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted cursor-pointer select-none">
            Synchronize Real-Time Ticking (Device Clock)
          </label>
        </div>

        {/* Manual date time inputs (when live sync is inactive) */}
        {!liveTicking && (
          <div className="flex flex-col space-y-1 animate-in slide-in-from-top-2 duration-200">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="device-time">
              Target Reference Time
            </label>
            <input
              id="device-time"
              type="datetime-local"
              value={deviceTime}
              onChange={(e) => setDeviceTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        )}

        {/* Tactical Aviation HUD Display Panel */}
        <div className="p-6 border border-border rounded-lg bg-bg-card font-mono text-center space-y-4 shadow relative overflow-hidden">
          <div className="absolute left-4 top-4 border-l border-t w-4 h-4 border-text-muted/40" />
          <div className="absolute right-4 top-4 border-r border-t w-4 h-4 border-text-muted/40" />
          <div className="absolute left-4 bottom-4 border-l border-b w-4 h-4 border-text-muted/40" />
          <div className="absolute right-4 bottom-4 border-r border-b w-4 h-4 border-text-muted/40" />

          <div className="text-[10px] text-text-muted tracking-widest uppercase">
            FLIGHT COMMAND :: ZULU TIME ZONE DATA
          </div>

          <div className="text-4xl md:text-[50px] font-bold text-text-primary tracking-wider leading-none py-4 select-all" style={{ color: groupAccent }}>
            {liveTicking ? zuluClock : result.zuluTimeFormatted}
          </div>

          <div className="text-[11px] text-text-muted font-bold">
            {liveTicking ? zuluDate : result.zuluDateFormatted}
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
