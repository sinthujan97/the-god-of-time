"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateBackPlan, BackPlanResult, Milestone } from "@/lib/tools/calculations";

interface ProjectBackPlannerInputsProps {
  groupAccent: string;
}

export default function ProjectBackPlannerInputs({ groupAccent }: ProjectBackPlannerInputsProps) {
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "Concept & Planning", durationDays: 5, bufferDays: 1 },
    { name: "Design & UX Prototype", durationDays: 10, bufferDays: 2 },
    { name: "Core Development", durationDays: 20, bufferDays: 4 },
    { name: "QA & Integration Testing", durationDays: 8, bufferDays: 2 },
    { name: "UAT & Deployment Prep", durationDays: 4, bufferDays: 1 }
  ]);

  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDuration, setNewMilestoneDuration] = useState(5);
  const [newMilestoneBuffer, setNewMilestoneBuffer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<BackPlanResult>({
    milestones: [],
    projectStartDate: new Date(),
    projectStartFormatted: "",
    totalProjectDays: 0,
    totalBufferDays: 0,
    isValid: false,
  });

  useEffect(() => {
    // Set default deadline 60 days from now
    const initialDeadline = new Date();
    initialDeadline.setDate(initialDeadline.getDate() + 60);
    setDeadline(initialDeadline);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isDeadlineInvalid = isDateInvalid(deadline);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!deadline) {
      setResult({
        milestones: [],
        projectStartDate: new Date(),
        projectStartFormatted: "",
        totalProjectDays: 0,
        totalBufferDays: 0,
        isValid: false,
        errorMessage: "Please select a launch deadline date",
      });
      return;
    }

    if (isDeadlineInvalid) {
      setResult({
        milestones: [],
        projectStartDate: new Date(),
        projectStartFormatted: "",
        totalProjectDays: 0,
        totalBufferDays: 0,
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    if (milestones.length === 0) {
      setResult({
        milestones: [],
        projectStartDate: new Date(),
        projectStartFormatted: "",
        totalProjectDays: 0,
        totalBufferDays: 0,
        isValid: false,
        errorMessage: "Please add at least one milestone/task",
      });
      return;
    }

    const calc = calculateBackPlan(formatDateToYYYYMMDD(deadline), milestones, excludeWeekends);
    setResult(calc);
  }, [deadline, milestones, excludeWeekends, isDeadlineInvalid]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddMilestone = () => {
    if (!newMilestoneName.trim()) return;
    setMilestones([
      ...milestones,
      {
        name: newMilestoneName.trim(),
        durationDays: Number(newMilestoneDuration) || 1,
        bufferDays: Number(newMilestoneBuffer) || 0
      }
    ]);
    setNewMilestoneName("");
    setNewMilestoneDuration(5);
    setNewMilestoneBuffer(0);
  };

  const handleRemoveMilestone = (idx: number) => {
    const updated = milestones.filter((_, i) => i !== idx);
    setMilestones(updated);
  };

  const handleUpdateMilestone = (idx: number, field: keyof Milestone, val: any) => {
    const updated = [...milestones];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setMilestones(updated);
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Project Start Date: ${result.projectStartFormatted}. Total Duration: ${result.totalProjectDays} days (Buffer: ${result.totalBufferDays} days).`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.projectStartFormatted : "—"}
      resultUnit="REQUIRED START DATE"
      resultBreakdown={[
        `Total project duration: ${result.totalProjectDays} calendar days`,
        `Safety buffer included: ${result.totalBufferDays} days`,
        excludeWeekends ? "Weekend days excluded from phase duration calculations" : "Calendar days mode (including weekends)"
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Target Deadline */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="deadline-date"
              label="Target Launch Deadline"
              value={deadline}
              onChange={setDeadline}
              accentColor={groupAccent}
            />
            {isDeadlineInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <span className="tool-input-label block mb-1">
              Workdays Mode
            </span>
            <PillToggle
              value={excludeWeekends ? "true" : "false"}
              onChange={(val) => setExcludeWeekends(val === "true")}
              options={[
                { value: "true", label: "Exclude Weekends" },
                { value: "false", label: "All Calendar Days" }
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>

        {/* Milestone Creator List */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Project milestones (in chronological order)
          </h3>

          {/* List existing */}
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {milestones.map((m, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 bg-bg-surface border border-border p-2 rounded-md animate-in fade-in slide-in-from-bottom-2 duration-200"
              >
                <span className="font-mono text-xs text-text-faint w-6 text-center">{idx + 1}</span>
                <input
                  type="text"
                  value={m.name}
                  onChange={(e) => handleUpdateMilestone(idx, "name", e.target.value)}
                  className="font-sans text-sm bg-transparent border-b border-transparent focus:border-border outline-none flex-1 min-w-0"
                  placeholder="Phase Name"
                />
                <div className="flex items-center gap-1 w-20">
                  <input
                    type="number"
                    min="1"
                    value={m.durationDays}
                    onChange={(e) => handleUpdateMilestone(idx, "durationDays", parseInt(e.target.value, 10) || 1)}
                    className="font-mono text-sm bg-transparent border border-border rounded text-center w-12 py-0.5"
                    title="Duration (Days)"
                  />
                  <span className="text-[11px] font-sans text-text-muted">d</span>
                </div>
                <div className="flex items-center gap-1 w-20">
                  <input
                    type="number"
                    min="0"
                    value={m.bufferDays}
                    onChange={(e) => handleUpdateMilestone(idx, "bufferDays", parseInt(e.target.value, 10) || 0)}
                    className="font-mono text-sm bg-transparent border border-border rounded text-center w-12 py-0.5"
                    title="Buffer (Days)"
                  />
                  <span className="text-[11px] font-sans text-text-muted">b</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMilestone(idx)}
                  className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                  title="Remove milestone"
                >
                  ✕
                </button>
              </div>
            ))}
            {milestones.length === 0 && (
              <div className="text-center py-6 text-text-muted font-sans text-sm italic">
                No milestones added. Add a milestone below.
              </div>
            )}
          </div>

          {/* Form to add new */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="e.g. Review & Adjustments"
              value={newMilestoneName}
              onChange={(e) => setNewMilestoneName(e.target.value)}
              className="sm:col-span-2 tool-input-field h-9 px-3 font-sans text-sm bg-bg-surface border border-border rounded-md"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Days"
                value={newMilestoneDuration || ""}
                onChange={(e) => setNewMilestoneDuration(parseInt(e.target.value, 10) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-sm bg-bg-surface border border-border rounded-md w-full"
                title="Duration Days"
              />
              <input
                type="number"
                min="0"
                placeholder="Buffer"
                value={newMilestoneBuffer || ""}
                onChange={(e) => setNewMilestoneBuffer(parseInt(e.target.value, 10) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-sm bg-bg-surface border border-border rounded-md w-full"
                title="Buffer Days"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMilestone}
              disabled={!newMilestoneName.trim()}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Milestone
            </button>
          </div>
        </div>

        {/* Premium Visualization: Vertical Timeline */}
        {result.isValid && result.milestones.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Chronological Back-Schedule Timeline
            </h4>
            <div className="relative pl-6 border-l-2 border-border space-y-6 ml-2">
              {/* Project Start Pin */}
              <div className="relative">
                <div 
                  className="absolute -left-[31px] top-1.5 w-[8px] h-[8px] rounded-full border border-border bg-bg-card"
                  style={{ borderColor: groupAccent, backgroundColor: groupAccent }}
                />
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-text-muted uppercase tracking-wider">Project kickoff</span>
                  <span className="font-sans text-sm font-semibold text-text-primary">
                    {result.projectStartFormatted}
                  </span>
                </div>
              </div>

              {/* Milestones in order */}
              {result.milestones.map((m: any, index: number) => (
                <div key={index} className="relative">
                  <div 
                    className="absolute -left-[32px] top-1.5 w-[10px] h-[10px] rounded-full border-2 bg-bg-card"
                    style={{ 
                      borderColor: m.isCritical ? "var(--accent-utility-e, #EF4444)" : groupAccent,
                      backgroundColor: m.isCritical ? "var(--accent-utility-e, #EF4444)" : "transparent"
                    }}
                  />
                  <div className="bg-bg-surface border border-border rounded-md p-3">
                    <div className="flex flex-wrap justify-between items-start gap-1">
                      <span className="font-sans text-sm font-bold text-text-primary">
                        {m.name}
                      </span>
                      <span 
                        className="font-sans text-[11px] font-semibold px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: m.isCritical ? "rgba(239, 68, 68, 0.1)" : "rgba(155, 142, 245, 0.1)",
                          color: m.isCritical ? "var(--accent-utility-e, #EF4444)" : groupAccent
                        }}
                      >
                        {m.isCritical ? "Critical (0d buffer)" : "Buffered"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/40 text-xs text-text-muted font-sans">
                      <div>
                        <span className="block text-[10px] uppercase text-text-faint">Start Date</span>
                        <span className="font-semibold text-text-primary">{m.startDateFormatted}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase text-text-faint">Completion Target</span>
                        <span className="font-semibold text-text-primary">{m.endDateFormatted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Final Deadline Pin */}
              <div className="relative">
                <div 
                  className="absolute -left-[31px] top-1.5 w-[8px] h-[8px] rounded-full border border-border bg-bg-card"
                  style={{ borderColor: "var(--accent-utility-e, #EF4444)", backgroundColor: "var(--accent-utility-e, #EF4444)" }}
                />
                <div className="flex flex-col">
                  <span className="font-sans text-xs text-text-muted uppercase tracking-wider">Final Launch Target</span>
                  <span className="font-sans text-sm font-semibold text-text-primary">
                    {deadline ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(deadline) : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
