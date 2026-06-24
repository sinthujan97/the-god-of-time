"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateCaffeineDecay } from "@/lib/tools/calculations";

interface CaffeineHalfLifeInputsProps {
  groupAccent: string;
}

export default function CaffeineHalfLifeInputs({ groupAccent }: CaffeineHalfLifeInputsProps) {
  const [beverage, setBeverage] = useState<"espresso" | "coffee" | "energy" | "tea">("coffee");
  const [consumptionTime, setConsumptionTime] = useState<string>("09:00");
  const [bedtime, setBedtime] = useState<string>("22:00");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    initialMg: number;
    bedtimeRemainingMg: number;
    sleepDisruptionRiskScore: number;
    hourlyDecayMatrix: { timeStr: string; remainingMg: number }[];
  }>({
    initialMg: 0,
    bedtimeRemainingMg: 0,
    sleepDisruptionRiskScore: 0,
    hourlyDecayMatrix: [],
  });

  useEffect(() => {
    const res = calculateCaffeineDecay(consumptionTime, beverage, bedtime);
    setResult(res);
  }, [consumptionTime, beverage, bedtime]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Initial dosage: ${result.initialMg} mg`,
      `Sleep disruption risk: ${result.sleepDisruptionRiskScore}%`
    ];
  };

  const getCopyText = () => {
    return `Caffeine Decay: Drink consumed at ${consumptionTime} (${result.initialMg} mg). At bedtime (${bedtime}), remaining caffeine is ${result.bedtimeRemainingMg} mg. Sleep disruption risk: ${result.sleepDisruptionRiskScore}%.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.bedtimeRemainingMg} mg`}
      resultUnit="REMAINING CAFFEINE AT BEDTIME"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Beverage Selection */}
        <div className="flex flex-col">
          <span className="tool-input-label block mb-1">Beverage Type</span>
          <PillToggle
            value={beverage}
            onChange={(val) => setBeverage(val as any)}
            options={[
              { value: "coffee", label: "Brewed Coffee (120mg)" },
              { value: "espresso", label: "Espresso Shot (80mg)" },
              { value: "energy", label: "Energy Drink (160mg)" },
              { value: "tea", label: "Black/Green Tea (40mg)" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Row 2: Intake & Bedtime */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="intake-time">
              Consumption Time
            </label>
            <input
              id="intake-time"
              type="time"
              value={consumptionTime}
              onChange={(e) => setConsumptionTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="bedtime-time">
              Target Bedtime
            </label>
            <input
              id="bedtime-time"
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        </div>

        {/* Decay Timeline */}
        {result.hourlyDecayMatrix.length > 0 && (
          <div className="space-y-3.5 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Bloodstream Clearance Curve (Half-Life: 5h)
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.hourlyDecayMatrix.filter((_, idx) => idx % 2 === 0).map((pt, idx) => (
                <div key={idx} className="bg-bg-surface border border-border rounded-lg p-3 text-center">
                  <span className="font-sans text-xs font-bold text-text-primary block">
                    {pt.timeStr}
                  </span>
                  <span className="text-sm font-display italic text-text-primary mt-1 block">
                    {pt.remainingMg} mg
                  </span>
                  <div className="w-full bg-border/40 h-1 mt-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, (pt.remainingMg / result.initialMg) * 100)}%`,
                        backgroundColor: groupAccent,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
