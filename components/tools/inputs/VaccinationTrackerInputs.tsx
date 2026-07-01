"use client";

import React, { useState, useEffect } from "react";
import { BirthDatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { generateVaccinationSchedule } from "@/lib/tools/calculations";

interface VaccinationTrackerInputsProps {
  groupAccent: string;
}

export default function VaccinationTrackerInputs({ groupAccent }: VaccinationTrackerInputsProps) {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    immunizationMilestones: { ageMilestone: string; targetDateFormatted: string; coreVaccinesList: string[] }[];
  }>({
    immunizationMilestones: [],
  });

  useEffect(() => {
    setBirthDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!birthDate) return;
    const dateStr = formatDateToYYYYMMDD(birthDate);
    const res = generateVaccinationSchedule(dateStr);
    setResult(res);
  }, [birthDate]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Total age phases projected: ${result.immunizationMilestones.length}`,
      `Immunization source guidelines: CDC (US) immunization timelines`
    ];
  };

  const getCopyText = () => {
    if (result.immunizationMilestones.length === 0) return "";
    return `Vaccination Timeline: ` +
      result.immunizationMilestones.map(m => `${m.ageMilestone} (${m.targetDateFormatted}): ${m.coreVaccinesList.join(", ")}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={birthDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(birthDate) : "—"}
      resultUnit="BASELINE BIRTH DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Child Birth Date */}
        <div className="flex flex-col">
          <BirthDatePicker
            id="birth-date-vaccine"
            label="Date of Birth"
            value={birthDate}
            onChange={setBirthDate}
            accentColor={groupAccent}
          />
        </div>

        {/* Immunization Timeline Checklist */}
        {result.immunizationMilestones.length > 0 && (
          <div className="space-y-3.5 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Projected Immunization Milestones
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {result.immunizationMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-bg-card border border-border rounded-lg space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm font-bold text-text-primary">
                      {m.ageMilestone}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted uppercase">
                      Target Date: {m.targetDateFormatted}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.coreVaccinesList.map((v, vidx) => (
                      <span
                        key={vidx}
                        className="px-2 py-0.5 rounded text-[10px] font-sans font-medium bg-bg-surface border border-border text-text-primary"
                      >
                        {v}
                      </span>
                    ))}
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
