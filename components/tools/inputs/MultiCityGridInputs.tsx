"use client";

import React, { useState, useEffect } from "react";
import { ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { updateClockGrid, LiveClockNode } from "@/lib/tools/calculations";

interface MultiCityGridInputsProps {
  groupAccent: string;
}

export default function MultiCityGridInputs({ groupAccent }: MultiCityGridInputsProps) {
  const [pinnedZones, setPinnedZones] = useState<{ id: string; name: string; zone: string }[]>([
    { id: "1", name: "New York", zone: "America/New_York" },
    { id: "2", name: "London", zone: "Europe/London" },
    { id: "3", name: "Tokyo", zone: "Asia/Tokyo" }
  ]);
  const [newZone, setNewZone] = useState<string>("Europe/Paris");

  // Clocks list state
  const [clocks, setClocks] = useState<LiveClockNode[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Live ticking clocks logic
  useEffect(() => {
    const tick = () => {
      const res = updateClockGrid(pinnedZones);
      setClocks(res);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [pinnedZones]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handlePinZone = () => {
    if (pinnedZones.length >= 6) return; // Limit to 6 clocks
    if (pinnedZones.some((z) => z.zone === newZone)) return;

    const cityName = newZone.split("/")[1]?.replace(/_/g, " ") || newZone;
    setPinnedZones([
      ...pinnedZones,
      { id: String(Date.now()), name: cityName, zone: newZone }
    ]);
  };

  const handleUnpinZone = (id: string) => {
    setPinnedZones(pinnedZones.filter((z) => z.id !== id));
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
      `Total clocks pinned: ${pinnedZones.length} / 6 maximum`,
      `Grid Layout: Multi-City Desktop Grid`
    ];
  };

  const getCopyText = () => {
    return "Pinned Clocks: " + clocks.map((c) => `${c.cityName}: ${c.currentTimeStr}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${pinnedZones.length} pinned`}
      resultUnit="ACTIVE DESKTOP CLOCK NODES"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Adder panel */}
        {pinnedZones.length < 6 ? (
          <div className="flex flex-col sm:flex-row gap-3 items-end p-4 border border-border rounded-lg bg-bg-card">
            <div className="flex-1 w-full">
              <ToolSelect
                value={newZone}
                onChange={setNewZone}
                options={timezoneOptions}
                label="Pin New City Clock"
                searchable
              />
            </div>
            <button
              type="button"
              onClick={handlePinZone}
              className="h-12 px-6 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card transition-colors w-full sm:w-auto"
            >
              Pin Clock
            </button>
          </div>
        ) : (
          <div className="p-3 text-center border border-dashed border-border rounded-lg text-xs text-text-muted italic">
            Dashboard limit of 6 clocks reached. Unpin a clock to add another.
          </div>
        )}

        {/* Live Grid of Clocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {clocks.map((c) => (
            <div
              key={c.id}
              className="p-5 border border-border rounded-lg bg-bg-card font-mono text-center space-y-2 shadow relative hover:border-text-faint transition-all"
            >
              <button
                type="button"
                onClick={() => handleUnpinZone(c.id)}
                className="absolute top-2 right-2 text-text-muted hover:text-accent-utility-e text-xs cursor-pointer"
                title="Unpin"
              >
                ✕
              </button>
              
              <span className="text-[10px] text-text-faint uppercase font-bold block truncate tracking-wider px-2">
                {c.cityName}
              </span>
              
              <span className="text-2xl font-bold text-text-primary block font-mono" style={{ color: groupAccent }}>
                {c.currentTimeStr}
              </span>

              <span className="text-[8px] text-text-muted block truncate font-sans uppercase">
                {c.timezoneIANA}
              </span>
            </div>
          ))}
          {pinnedZones.length === 0 && (
            <div className="col-span-full py-10 text-center text-xs text-text-muted italic border border-dashed border-border rounded-lg">
              No clocks pinned. Pick a zone above to pin clocks.
            </div>
          )}
        </div>

      </div>
    </CalculatorCard>
  );
}
