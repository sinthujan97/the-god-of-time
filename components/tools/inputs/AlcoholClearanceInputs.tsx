"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateAlcoholClearance } from "@/lib/tools/calculations";

interface AlcoholClearanceInputsProps {
  groupAccent: string;
}

export default function AlcoholClearanceInputs({ groupAccent }: AlcoholClearanceInputsProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [weight, setWeight] = useState<number>(180);
  const [units, setUnits] = useState<number>(3);
  const [hours, setHours] = useState<number>(2);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    estimatedCurrentBAC: number;
    hoursUntilZeroBAC: number;
    clearanceTimeFormatted: string;
    isSafeToDriveBaseline: boolean;
  }>({
    estimatedCurrentBAC: 0,
    hoursUntilZeroBAC: 0,
    clearanceTimeFormatted: "",
    isSafeToDriveBaseline: true,
  });

  useEffect(() => {
    const res = calculateAlcoholClearance(gender, weight, units, hours);
    setResult(res);
  }, [gender, weight, units, hours]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Hours until zero BAC: ${result.hoursUntilZeroBAC} hours`,
      `Estimated sobriety time: ${result.clearanceTimeFormatted || "—"}`
    ];
  };

  const getCopyText = () => {
    return `BAC Clearance: Estimated current BAC is ${result.estimatedCurrentBAC}%. Time until 0.00% BAC: ${result.hoursUntilZeroBAC} hours (${result.clearanceTimeFormatted}). Safe to drive baseline: ${result.isSafeToDriveBaseline ? "Yes" : "No"}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.estimatedCurrentBAC.toFixed(3)}%`}
      resultUnit="ESTIMATED CURRENT BAC"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Gender */}
        <div className="flex flex-col">
          <span className="tool-input-label block mb-1">Biological Gender (Widmark Ratio)</span>
          <PillToggle
            value={gender}
            onChange={(val) => setGender(val as any)}
            options={[
              { value: "male", label: "Male (r = 0.68)" },
              { value: "female", label: "Female (r = 0.55)" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Row 2: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="weight-lbs-input">
              Weight (lbs)
            </label>
            <input
              id="weight-lbs-input"
              type="number"
              min="80"
              max="400"
              value={isNaN(weight) ? "" : weight}
              onChange={(e) => setWeight(parseInt(e.target.value, 10))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="units-consumed-input">
              Standard Drinks Consumed
            </label>
            <input
              id="units-consumed-input"
              type="number"
              min="0.5"
              max="30"
              step="any"
              value={isNaN(units) ? "" : units}
              onChange={(e) => setUnits(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="hours-elapsed-input">
              Hours Since First Drink
            </label>
            <input
              id="hours-elapsed-input"
              type="number"
              min="0"
              max="48"
              step="any"
              value={isNaN(hours) ? "" : hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>
        </div>

        {/* BAC Safety Meter */}
        <div className="pt-4 border-t border-border/40 space-y-4">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Safety Clearance Alert
          </h3>

          <div
            className="p-4 border rounded-lg flex items-center justify-between"
            style={{
              borderColor: result.isSafeToDriveBaseline ? "var(--accent-utility-a)" : "var(--accent-utility-e)",
              backgroundColor: result.isSafeToDriveBaseline
                ? "color-mix(in srgb, var(--accent-utility-a) 8%, transparent)"
                : "color-mix(in srgb, var(--accent-utility-e) 8%, transparent)",
            }}
          >
            <div>
              <span className="font-sans text-sm font-bold text-text-primary block">
                {result.isSafeToDriveBaseline ? "Clearance Below Limit" : "Limit Exceeded"}
              </span>
              <span className="text-[10px] text-text-muted font-mono uppercase">
                Legal driving limit in most jurisdictions is 0.08% or 0.05%
              </span>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[9px] font-sans font-bold tracking-wider uppercase"
              style={{
                backgroundColor: result.isSafeToDriveBaseline ? "var(--accent-utility-a)" : "var(--accent-utility-e)",
                color: "white",
              }}
            >
              {result.isSafeToDriveBaseline ? "BAC < 0.05%" : "DO NOT DRIVE"}
            </span>
          </div>
        </div>
      </div>
    </CalculatorCard>
  );
}
