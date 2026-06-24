"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateLightingWindows } from "@/lib/tools/calculations";

interface GoldenHourTrackerInputsProps {
  groupAccent: string;
}

export default function GoldenHourTrackerInputs({ groupAccent }: GoldenHourTrackerInputsProps) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [lat, setLat] = useState<number>(40.7128); // NYC
  const [lng, setLng] = useState<number>(-74.0060); // NYC

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    morningBlueHourStart: string;
    morningGoldenHourStart: string;
    eveningGoldenHourStart: string;
    eveningBlueHourStart: string;
  }>({
    morningBlueHourStart: "",
    morningGoldenHourStart: "",
    eveningGoldenHourStart: "",
    eveningBlueHourStart: "",
  });

  useEffect(() => {
    setTargetDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!targetDate) return;
    const dateStr = formatDateToYYYYMMDD(targetDate);
    const res = calculateLightingWindows(dateStr, lat, lng);
    setResult(res);
  }, [targetDate, lat, lng]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const setPreset = (name: string, presetLat: number, presetLng: number) => {
    setLat(presetLat);
    setLng(presetLng);
  };

  const getBreakdownRows = () => {
    return [
      `Morning Golden Hour: ${result.morningGoldenHourStart} onwards`,
      `Evening Blue Hour: ${result.eveningBlueHourStart} onwards`
    ];
  };

  const getCopyText = () => {
    return `Photography Lighting Windows for Lat ${lat}, Lng ${lng}: Morning Blue: ${result.morningBlueHourStart} | Morning Golden: ${result.morningGoldenHourStart} | Evening Golden: ${result.eveningGoldenHourStart} | Evening Blue: ${result.eveningBlueHourStart}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.eveningGoldenHourStart}
      resultUnit="EVENING GOLDEN HOUR START (ESTIMATE)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Date & Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <DatePicker
              id="lighting-date"
              label="Target Date"
              value={targetDate}
              onChange={setTargetDate}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="lat-input">
              Latitude
            </label>
            <input
              id="lat-input"
              type="number"
              min="-90"
              max="90"
              step="any"
              value={isNaN(lat) ? "" : lat}
              onChange={(e) => setLat(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="lng-input">
              Longitude
            </label>
            <input
              id="lng-input"
              type="number"
              min="-180"
              max="180"
              step="any"
              value={isNaN(lng) ? "" : lng}
              onChange={(e) => setLng(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>
        </div>

        {/* Location Presets */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-sans text-text-muted mr-1">Quick Presets:</span>
          {[
            { name: "New York", lat: 40.7128, lng: -74.0060 },
            { name: "London", lat: 51.5074, lng: -0.1278 },
            { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
            { name: "Sydney", lat: -33.8688, lng: 151.2093 }
          ].map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => setPreset(preset.name, preset.lat, preset.lng)}
              className="px-3 h-8 font-sans text-[11px] font-semibold border border-border rounded bg-bg-surface hover:bg-bg-card transition-colors text-text-primary"
            >
              {preset.name}
            </button>
          ))}
        </div>

        {/* Lighting Windows Timeline Display */}
        {result.morningBlueHourStart && (
          <div className="pt-4 border-t border-border/40 space-y-4">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Daily Photography Lighting Schedule
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: "🌅 Morning Blue Hour", time: result.morningBlueHourStart, desc: "Cool, diffused atmospheric lighting" },
                { title: "🌞 Morning Golden Hour", time: result.morningGoldenHourStart, desc: "Warm, soft, low-angle shadows" },
                { title: "🌇 Evening Golden Hour", time: result.eveningGoldenHourStart, desc: "Warm, long shadow photography" },
                { title: "🌃 Evening Blue Hour", time: result.eveningBlueHourStart, desc: "Deep twilight, high-contrast city skylines" }
              ].map((w, idx) => (
                <div key={idx} className="p-3.5 bg-bg-card border border-border rounded-lg space-y-1">
                  <span className="font-sans text-xs font-bold text-text-primary block">
                    {w.title}
                  </span>
                  <span className="font-display italic text-lg text-text-primary block">
                    {w.time}
                  </span>
                  <span className="text-[10px] text-text-muted font-sans font-light">
                    {w.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
