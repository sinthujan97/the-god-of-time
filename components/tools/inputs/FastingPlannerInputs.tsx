"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { planFastingSchedule } from "@/lib/tools/calculations";

interface FastingPlannerInputsProps {
  groupAccent: string;
}

export default function FastingPlannerInputs({ groupAccent }: FastingPlannerInputsProps) {
  const [firstMeal, setFirstMeal] = useState<string>("12:00");
  const [protocol, setProtocol] = useState<"16:8" | "18:6" | "20:4" | "12:12">("16:8");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    eatingWindowStart: string;
    eatingWindowEnd: string;
    fastingWindowStart: string;
    fastingWindowEnd: string;
    autophagyActivationEstimateHours: number;
  }>({
    eatingWindowStart: "",
    eatingWindowEnd: "",
    fastingWindowStart: "",
    fastingWindowEnd: "",
    autophagyActivationEstimateHours: 0,
  });

  useEffect(() => {
    const res = planFastingSchedule(firstMeal, protocol);
    setResult(res);
  }, [firstMeal, protocol]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Autophagy Estimate: Starts around Hour ${result.autophagyActivationEstimateHours} of fasting`,
      `Protocol: Eating window is ${protocol.split(":")[1]}h / Fasting is ${protocol.split(":")[0]}h`
    ];
  };

  const getCopyText = () => {
    return `Intermittent Fasting Plan (${protocol}): Eating window from ${result.eatingWindowStart} to ${result.eatingWindowEnd}. Fasting window from ${result.fastingWindowStart} to ${result.fastingWindowEnd}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.eatingWindowStart} - ${result.eatingWindowEnd}`}
      resultUnit="EATING WINDOW"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Protocol Selector */}
        <div className="flex flex-col">
          <span className="tool-input-label block mb-1">Intermittent Protocol</span>
          <PillToggle
            value={protocol}
            onChange={(val) => setProtocol(val as any)}
            options={[
              { value: "16:8", label: "Leangains (16:8)" },
              { value: "18:6", label: "Fast-5 (18:6)" },
              { value: "20:4", label: "Warrior (20:4)" },
              { value: "12:12", label: "Balanced (12:12)" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* First Meal Time Input */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="first-meal-time">
            Time of First Meal (Break Fast)
          </label>
          <input
            id="first-meal-time"
            type="time"
            value={firstMeal}
            onChange={(e) => setFirstMeal(e.target.value)}
            className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
          />
        </div>

        {/* Schedule Visualizer */}
        <div className="pt-4 border-t border-border/40 space-y-4">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Daily Fasting & Eating Timeline
          </h3>

          <div className="space-y-3">
            {/* Eating block */}
            <div className="p-4 bg-bg-card border rounded-lg flex items-center justify-between" style={{ borderColor: `color-mix(in srgb, ${groupAccent} 40%, transparent)` }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🥗</span>
                <div>
                  <span className="font-sans text-sm font-bold text-text-primary block">Eating Window</span>
                  <span className="text-[10px] text-text-muted font-mono uppercase">
                    {result.eatingWindowStart} to {result.eatingWindowEnd}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold tracking-wider bg-accent-utility-a/10 text-accent-utility-a uppercase">
                Active Digest
              </span>
            </div>

            {/* Fasting block */}
            <div className="p-4 bg-bg-card border border-border rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">💧</span>
                <div>
                  <span className="font-sans text-sm font-bold text-text-primary block">Fasting Window</span>
                  <span className="text-[10px] text-text-muted font-mono uppercase">
                    {result.fastingWindowStart} to {result.fastingWindowEnd}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold tracking-wider uppercase" style={{ backgroundColor: `color-mix(in srgb, ${groupAccent} 15%, transparent)`, color: groupAccent }}>
                Autophagy Phase
              </span>
            </div>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
