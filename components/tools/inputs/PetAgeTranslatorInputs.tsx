"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { translatePetAge } from "@/lib/tools/calculations";

interface PetAgeTranslatorInputsProps {
  groupAccent: string;
}

export default function PetAgeTranslatorInputs({ groupAccent }: PetAgeTranslatorInputsProps) {
  const [animalType, setAnimalType] = useState<"dog-small" | "dog-large" | "cat" | "bird">("dog-small");
  const [calendarAge, setCalendarAge] = useState<number>(3);
  const [weight, setWeight] = useState<number>(65);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    equivalentHumanYears: number;
    lifeStageClassification: "juvenile" | "adult" | "senior" | "geriatric";
    wellnessRecommendation: string;
  }>({
    equivalentHumanYears: 0,
    lifeStageClassification: "adult",
    wellnessRecommendation: "",
  });

  useEffect(() => {
    const res = translatePetAge(calendarAge, animalType, weight);
    setResult(res);
  }, [calendarAge, animalType, weight]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Equivalent Human Age: ${result.equivalentHumanYears} years old`,
      `Life Stage: ${result.lifeStageClassification.toUpperCase()}`,
    ];
  };

  const getCopyText = () => {
    return `Pet Age translation: ${calendarAge} calendar years for a ${animalType} is equivalent to ${result.equivalentHumanYears} human years. Classification: ${result.lifeStageClassification}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.equivalentHumanYears}`}
      resultUnit="EQUIVALENT HUMAN YEARS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Animal Type Selector */}
        <div className="flex flex-col">
          <span className="tool-input-label block mb-1">Pet Type</span>
          <PillToggle
            value={animalType}
            onChange={(val) => setAnimalType(val as any)}
            options={[
              { value: "dog-small", label: "Small Dog (Under 20 lbs)" },
              { value: "dog-large", label: "Large Dog" },
              { value: "cat", label: "Cat" },
              { value: "bird", label: "Bird" },
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Row 2: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="calendar-age-input">
              Pet Calendar Age (Years)
            </label>
            <input
              id="calendar-age-input"
              type="number"
              min="0.1"
              max="100"
              step="any"
              value={isNaN(calendarAge) ? "" : calendarAge}
              onChange={(e) => setCalendarAge(parseFloat(e.target.value))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            />
          </div>

          {animalType === "dog-large" && (
            <div className="flex flex-col">
              <label className="tool-input-label" htmlFor="weight-input">
                Pet Weight (lbs)
              </label>
              <input
                id="weight-input"
                type="number"
                min="20"
                max="250"
                value={isNaN(weight) ? "" : weight}
                onChange={(e) => setWeight(parseInt(e.target.value, 10))}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              />
              <span className="text-[11px] text-text-muted mt-1.5 font-sans">
                Weight above 80 lbs accelerates human age scaling.
              </span>
            </div>
          )}
        </div>

        {/* Life Stage Dashboard & Wellness Recommendation */}
        {result.equivalentHumanYears > 0 && (
          <div className="pt-4 border-t border-border/40 space-y-4">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Pet Wellness & Life Stage
            </h3>

            <div className="p-4 bg-bg-card border border-border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-sans text-sm font-bold text-text-primary capitalize">
                  {result.lifeStageClassification} Stage
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[9px] font-sans font-bold tracking-wider uppercase"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${groupAccent} 15%, transparent)`,
                    color: groupAccent,
                  }}
                >
                  Health Priority
                </span>
              </div>
              <p className="text-xs text-text-muted font-sans font-light leading-relaxed">
                {result.wellnessRecommendation}
              </p>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
