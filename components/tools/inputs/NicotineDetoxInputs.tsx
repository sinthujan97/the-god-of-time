"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateNicotineDetoxTimeline } from "@/lib/tools/calculations";

interface NicotineDetoxInputsProps {
  groupAccent: string;
}

export default function NicotineDetoxInputs({ groupAccent }: NicotineDetoxInputsProps) {
  const [quitDate, setQuitDate] = useState<Date | undefined>(undefined);
  const [quitTime, setQuitTime] = useState<string>("12:00");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<{
    hoursSinceQuit: number;
    completedMilestones: { benefitLabel: string; timelineMarker: string; isAchieved: boolean; statusPercentage: number }[];
  }>({
    hoursSinceQuit: 0,
    completedMilestones: [],
  });

  useEffect(() => {
    setQuitDate(new Date());
  }, []);

  useEffect(() => {
    if (!quitDate) return;
    const year = quitDate.getFullYear();
    const month = String(quitDate.getMonth() + 1).padStart(2, "0");
    const day = String(quitDate.getDate()).padStart(2, "0");
    const dtStr = `${year}-${month}-${day}T${quitTime || "00:00"}:00`;
    const res = calculateNicotineDetoxTimeline(dtStr);
    setResult(res);
  }, [quitDate, quitTime]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!quitDate) return ["Select quit date"];
    const completedCount = result.completedMilestones.filter(m => m.isAchieved).length;
    return [
      `Completed stages: ${completedCount} of ${result.completedMilestones.length}`,
      `Total hours nicotine free: ${result.hoursSinceQuit.toLocaleString()} hours`
    ];
  };

  const getCopyText = () => {
    if (!quitDate) return "";
    return `Nicotine Quit Timeline: ${result.hoursSinceQuit} hours since quit. Achievements: ` +
      result.completedMilestones.map(m => `${m.timelineMarker} (${m.isAchieved ? "Achieved" : m.statusPercentage + "%"}): ${m.benefitLabel}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${Math.floor(result.hoursSinceQuit / 24)}d ${Math.round(result.hoursSinceQuit % 24)}h`}
      resultUnit="ELAPSED TIME SINCE CESSATION"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="quit-date"
              label="Quit Date"
              value={quitDate}
              onChange={setQuitDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="quit-time">
              Quit Time (HH:MM)
            </label>
            <input
              id="quit-time"
              type="time"
              value={quitTime}
              onChange={(e) => setQuitTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        </div>

        {/* Benefits Checklist */}
        {result.completedMilestones.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
              Cardiovascular & Cellular Restoration Milestones
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {result.completedMilestones.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 bg-bg-card border border-border rounded-lg"
                  style={{
                    borderColor: m.isAchieved ? groupAccent : "var(--border)",
                    backgroundColor: m.isAchieved ? `color-mix(in srgb, ${groupAccent} 6%, transparent)` : undefined,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {m.isAchieved ? "✅" : "⏳"}
                    </span>
                    <div>
                      <span className="font-sans text-sm font-bold text-text-primary block">
                        {m.benefitLabel}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono uppercase">
                        Marker: {m.timelineMarker}
                      </span>
                    </div>
                  </div>
                  {!m.isAchieved && (
                    <span className="text-[10px] font-mono text-text-muted font-bold">
                      {m.statusPercentage}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
