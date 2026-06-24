"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { convertMilitaryTime } from "@/lib/tools/calculations";

interface MilitaryTimeInputsProps {
  groupAccent: string;
}

export default function MilitaryTimeInputs({ groupAccent }: MilitaryTimeInputsProps) {
  const [direction, setDirection] = useState<'toMilitary' | 'toStandard'>("toMilitary");
  const [inputTime, setInputTime] = useState<string>("08:30 PM");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    convertedTime: "2030",
    hoursValue: 20,
    minutesValue: 30,
    phoneticPronunciation: "Twenty Thirty Hours"
  });

  // Automatically update input examples when changing directions
  const handleDirectionChange = (val: string) => {
    const dir = val as 'toMilitary' | 'toStandard';
    setDirection(dir);
    if (dir === "toMilitary") {
      setInputTime("08:30 PM");
    } else {
      setInputTime("2030");
    }
  };

  useEffect(() => {
    const res = convertMilitaryTime(inputTime, direction);
    if (res.convertedTime) {
      setResult(res);
    }
  }, [inputTime, direction]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Hour value: ${result.hoursValue}`,
      `Minute value: ${result.minutesValue}`,
      `NATO phonetic readout: "${result.phoneticPronunciation}"`
    ];
  };

  const getCopyText = () => {
    return `Time converted: ${inputTime} -> ${result.convertedTime} (${result.phoneticPronunciation})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.convertedTime}
      resultUnit="CONVERTED CLOCK VAL"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Toggle Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Conversion Mode
          </span>
          <PillToggle
            value={direction}
            onChange={handleDirectionChange}
            options={[
              { value: "toMilitary", label: "Standard ➔ 24-Hour" },
              { value: "toStandard", label: "24-Hour ➔ Standard" }
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Input Block */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="time-input">
            {direction === "toMilitary" ? "Standard Time (e.g. 08:30 PM or 9:15 AM)" : "Military Time Code (4 digits, e.g. 2030 or 0915)"}
          </label>
          <input
            id="time-input"
            type="text"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            placeholder={direction === "toMilitary" ? "08:30 PM" : "2030"}
          />
        </div>

        {/* Monospace Phonetic Display HUD */}
        <div className="p-5 border border-border rounded-lg bg-bg-card font-mono text-center space-y-3 relative overflow-hidden">
          <div className="text-[10px] text-text-muted tracking-widest uppercase">
            RADIO RADIO SOUND-OUT PHRASE
          </div>
          
          <div className="text-3xl md:text-[36px] font-bold text-text-primary uppercase tracking-normal p-2 select-all leading-tight" style={{ color: groupAccent }}>
            {result.phoneticPronunciation}
          </div>

          <div className="text-[10px] text-text-faint italic">
            NATO/Civil Aviation standard transmission phonetics.
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
