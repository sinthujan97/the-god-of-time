"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateMilestoneBuffer, MilestoneBufferResult } from "@/lib/tools/calculations";

interface MilestoneBufferCalculatorInputsProps {
  groupAccent: string;
}

export default function MilestoneBufferCalculatorInputs({ groupAccent }: MilestoneBufferCalculatorInputsProps) {
  const [baseDuration, setBaseDuration] = useState<number>(30);
  const [bufferPct, setBufferPct] = useState<number>(15);
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [customBuffer, setCustomBuffer] = useState<number>(2);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<MilestoneBufferResult>({
    baseDuration: 0,
    bufferDays: 0,
    totalDuration: 0,
    bufferPercentage: 0,
    riskAdjustedBuffer: 0,
    recommendation: "",
  });

  useEffect(() => {
    if (isNaN(baseDuration) || baseDuration <= 0) return;
    const calc = calculateMilestoneBuffer(
      baseDuration,
      bufferPct,
      riskLevel,
      customBuffer
    );
    setResult(calc);
  }, [baseDuration, bufferPct, riskLevel, customBuffer]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    return `Base Duration: ${result.baseDuration} days. Added Buffer: ${result.bufferDays} days. Risk-adjusted total milestone duration: ${result.totalDuration} days.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.totalDuration} days`}
      resultUnit="ADJUSTED MILESTONE DURATION"
      resultBreakdown={[
        `Base work duration: ${result.baseDuration} days`,
        `Safety buffer added: ${result.bufferDays} days`,
        `Calculated risk profile recommendation: ${result.recommendation}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Base Duration & Buffer Pct */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="base-duration-input">
              Base Duration (Days)
            </label>
            <input
              id="base-duration-input"
              type="number"
              min="1"
              value={baseDuration || ""}
              onChange={(e) => setBaseDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="buffer-pct-input">
              Target Buffer Percentage (%)
            </label>
            <input
              id="buffer-pct-input"
              type="number"
              min="0"
              max="100"
              value={bufferPct || ""}
              onChange={(e) => setBufferPct(Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: Risk Profile Level & Custom Buffer Override */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <span className="tool-input-label block mb-1">
              Project Risk Profile
            </span>
            <PillToggle
              value={riskLevel}
              onChange={(val) => setRiskLevel(val as any)}
              options={[
                { value: "low", label: "Low (0.75x)" },
                { value: "medium", label: "Medium (1.0x)" },
                { value: "high", label: "High (1.5x)" },
                { value: "critical", label: "Critical (2.0x)" }
              ]}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="custom-buffer-input">
              Additional Buffer Days
            </label>
            <input
              id="custom-buffer-input"
              type="number"
              min="0"
              value={customBuffer || ""}
              onChange={(e) => setCustomBuffer(Math.max(0, parseInt(e.target.value, 10) || 0))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Visual Comparison Chart */}
        {result.totalDuration > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Milestone Sizing Comparison
            </h4>
            
            <div className="space-y-3 font-sans text-xs">
              {/* Base Duration Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Base Work Duration</span>
                  <span className="font-semibold text-text-primary">{result.baseDuration} days</span>
                </div>
                <div className="w-full h-3 bg-bg-surface border border-border rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-border"
                    style={{ width: `${(result.baseDuration / result.totalDuration) * 100}%` }}
                  />
                </div>
              </div>

              {/* Buffer Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-text-muted">
                  <span>Contingency Buffer</span>
                  <span className="font-semibold text-text-primary">+{result.bufferDays} days</span>
                </div>
                <div className="w-full h-3 bg-bg-surface border border-border rounded-full overflow-hidden">
                  <div 
                    className="h-full"
                    style={{ 
                      width: `${(result.bufferDays / result.totalDuration) * 100}%`,
                      backgroundColor: groupAccent
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
