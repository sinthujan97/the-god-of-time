"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateSprintCalendar, SprintResult } from "@/lib/tools/calculations";

interface SprintDateCalculatorInputsProps {
  groupAccent: string;
}

export default function SprintDateCalculatorInputs({ groupAccent }: SprintDateCalculatorInputsProps) {
  const [projectStart, setProjectStart] = useState<Date | undefined>(undefined);
  const [sprintLengthWeeks, setSprintLengthWeeks] = useState<number>(2);
  const [numSprints, setNumSprints] = useState<number>(6);
  const [sprintGoals, setSprintGoals] = useState<string[]>([
    "MVP core database schema & boilerplate setup",
    "User authentication, onboarding flow, and account profiles",
    "API integration & cloud database syncing engine",
    "UI polishing, dashboard layouts, and responsiveness checks",
    "QA validation, security testing & pre-release dry-runs",
    "Final production launch and monitoring systems setup"
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<SprintResult>({
    sprints: [],
    totalSprints: 0,
    projectEndDate: new Date(),
    projectEndFormatted: "",
    totalWorkingDays: 0,
    isValid: false,
  });

  useEffect(() => {
    setProjectStart(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(projectStart);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!projectStart) {
      setResult({
        sprints: [],
        totalSprints: 0,
        projectEndDate: new Date(),
        projectEndFormatted: "",
        totalWorkingDays: 0,
        isValid: false,
        errorMessage: "Please select a release start date",
      });
      return;
    }

    if (isStartInvalid) {
      setResult({
        sprints: [],
        totalSprints: 0,
        projectEndDate: new Date(),
        projectEndFormatted: "",
        totalWorkingDays: 0,
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    if (numSprints < 1 || numSprints > 50) {
      setResult({
        sprints: [],
        totalSprints: 0,
        projectEndDate: new Date(),
        projectEndFormatted: "",
        totalWorkingDays: 0,
        isValid: false,
        errorMessage: "Please enter between 1 and 50 sprints",
      });
      return;
    }

    const calc = calculateSprintCalendar(
      formatDateToYYYYMMDD(projectStart),
      sprintLengthWeeks,
      numSprints,
      sprintGoals,
      []
    );
    setResult(calc);
  }, [projectStart, sprintLengthWeeks, numSprints, sprintGoals, isStartInvalid]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleGoalChange = (idx: number, val: string) => {
    const updated = [...sprintGoals];
    updated[idx] = val;
    setSprintGoals(updated);
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Sprint Calendar: ${result.totalSprints} sprints of ${sprintLengthWeeks} weeks ending ${result.projectEndFormatted}. Total working days: ${result.totalWorkingDays}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.projectEndFormatted : "—"}
      resultUnit="RELEASE TARGET DATE"
      resultBreakdown={[
        `Total sprint count: ${result.totalSprints}`,
        `Total active working days: ${result.totalWorkingDays} days`,
        `Sprint duration: ${sprintLengthWeeks} weeks (${sprintLengthWeeks * 5} standard working days)`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Start Date & Sprint Length */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="release-start-date"
              label="Release Cycle Start Date"
              value={projectStart}
              onChange={setProjectStart}
              accentColor={groupAccent}
            />
            {isStartInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <span className="tool-input-label block mb-1">
              Sprint Duration
            </span>
            <PillToggle
              value={sprintLengthWeeks.toString()}
              onChange={(val) => setSprintLengthWeeks(parseInt(val, 10))}
              options={[
                { value: "1", label: "1 Week" },
                { value: "2", label: "2 Weeks" },
                { value: "3", label: "3 Weeks" },
                { value: "4", label: "4 Weeks" }
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>

        {/* Row 2: Number of Sprints */}
        <div className="flex flex-col">
          <label className="tool-input-label" htmlFor="num-sprints-input">
            Number of Sprints in Cycle
          </label>
          <input
            id="num-sprints-input"
            type="number"
            min="1"
            max="50"
            value={numSprints || ""}
            onChange={(e) => {
              const val = Math.min(50, Math.max(1, parseInt(e.target.value, 10) || 1));
              setNumSprints(val);
              // Resize goals array to match numSprints
              if (sprintGoals.length < val) {
                const added = Array.from({ length: val - sprintGoals.length }).map(() => "");
                setSprintGoals([...sprintGoals, ...added]);
              }
            }}
            className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Generated Sprint Schedule Grid */}
        {result.isValid && result.sprints.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Agile Scrum Sprint Schedule
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {result.sprints.map((s, idx) => (
                <div 
                  key={s.number} 
                  className="bg-bg-surface border border-border p-3 rounded-md space-y-2 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span 
                      className="font-sans font-bold uppercase tracking-wider text-[11px]"
                      style={{ color: groupAccent }}
                    >
                      Sprint {s.number}
                    </span>
                    <span className="font-mono text-text-muted">
                      {s.workingDays} working days
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-text-muted font-sans border-b border-border/40 pb-2">
                    <div>
                      <span className="block text-[9px] uppercase text-text-faint">Start</span>
                      <span className="font-medium text-text-primary">{s.startFormatted}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] uppercase text-text-faint">End</span>
                      <span className="font-medium text-text-primary">{s.endFormatted}</span>
                    </div>
                  </div>

                  {/* Goal editor inline */}
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase text-text-faint font-sans">Sprint Goal</label>
                    <input
                      type="text"
                      placeholder="Enter sprint objective..."
                      value={sprintGoals[idx] || ""}
                      onChange={(e) => handleGoalChange(idx, e.target.value)}
                      className="bg-transparent border border-border rounded px-2 py-1 font-sans text-xs focus:outline-none focus:border-border-hover"
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
