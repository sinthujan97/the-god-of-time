"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculatePomodoroSchedule, PomodoroScheduleResult } from "@/lib/tools/calculations";

interface PomodoroTimeSegmenterInputsProps {
  groupAccent: string;
}

export default function PomodoroTimeSegmenterInputs({ groupAccent }: PomodoroTimeSegmenterInputsProps) {
  const [startTime, setStartTime] = useState<string>("09:00");
  const [totalWork, setTotalWork] = useState<number>(240); // 4 hours
  const [focusLength, setFocusLength] = useState<number>(25);
  const [shortBreak, setShortBreak] = useState<number>(5);
  const [longBreak, setLongBreak] = useState<number>(15);
  const [sessionsLimit, setSessionsLimit] = useState<number>(4);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<PomodoroScheduleResult>({
    segments: [],
    totalFocusMinutes: 0,
    totalBreakMinutes: 0,
    completionTime: "",
    totalSessions: 0,
  });

  useEffect(() => {
    if (isNaN(totalWork) || totalWork <= 0) return;
    const calc = calculatePomodoroSchedule(
      startTime,
      totalWork,
      focusLength,
      shortBreak,
      longBreak,
      sessionsLimit
    );
    setResult(calc);
  }, [startTime, totalWork, focusLength, shortBreak, longBreak, sessionsLimit]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getCopyText = () => {
    return `Pomodoro Schedule: Completion at ${result.completionTime}. ${result.totalSessions} focus blocks (${result.totalFocusMinutes} mins focus, ${result.totalBreakMinutes} mins break).`;
  };

  const formatMinsToHrs = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return hrs > 0 ? `${hrs}h ${m}m` : `${m} mins`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.completionTime !== "" ? result.completionTime : "—"}
      resultUnit="PROJECTED WORKDAY END TIME"
      resultBreakdown={[
        `Total focus sessions planned: ${result.totalSessions}`,
        `Total active work time: ${formatMinsToHrs(result.totalFocusMinutes)}`,
        `Total break allocation: ${formatMinsToHrs(result.totalBreakMinutes)}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Start Time & Total Work Time */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="pomo-start-time">
              Workday Start Time
            </label>
            <input
              id="pomo-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="pomo-total-work">
              Target Work Duration (Minutes)
            </label>
            <input
              id="pomo-total-work"
              type="number"
              min="10"
              value={totalWork || ""}
              onChange={(e) => setTotalWork(Math.max(10, parseInt(e.target.value, 10) || 0))}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Row 2: Pomodoro Sizing */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Pomodoro Interval Settings
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="focus-len-input">
                Focus (mins)
              </label>
              <input
                id="focus-len-input"
                type="number"
                min="5"
                value={focusLength}
                onChange={(e) => setFocusLength(Math.max(5, parseInt(e.target.value, 10) || 0))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="short-break-input">
                Short Break (mins)
              </label>
              <input
                id="short-break-input"
                type="number"
                min="1"
                value={shortBreak}
                onChange={(e) => setShortBreak(Math.max(1, parseInt(e.target.value, 10) || 0))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="long-break-input">
                Long Break (mins)
              </label>
              <input
                id="long-break-input"
                type="number"
                min="5"
                value={longBreak}
                onChange={(e) => setLongBreak(Math.max(5, parseInt(e.target.value, 10) || 0))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
              />
            </div>

            <div className="flex flex-col">
              <label className="tool-input-label text-[11px]" htmlFor="sessions-limit-input">
                Cycles before Long Break
              </label>
              <input
                id="sessions-limit-input"
                type="number"
                min="1"
                value={sessionsLimit}
                onChange={(e) => setSessionsLimit(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="tool-input-field w-full h-[40px] px-3 font-sans text-sm focus:outline-none bg-bg-surface border border-border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Chronological Schedule Preview */}
        {result.segments.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Scheduled Blocks Sequence
            </h3>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {result.segments.map((s, idx) => {
                const isFocus = s.type === "focus";
                const isLong = s.type === "long-break";
                return (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center bg-bg-surface border border-border p-3 rounded-md text-xs font-sans"
                    style={{ borderLeftColor: isFocus ? groupAccent : isLong ? "#EF4444" : "#F59E0B", borderLeftWidth: "3px" }}
                  >
                    <div>
                      <span className="font-bold text-text-primary capitalize block">
                        {s.type.replace("-", " ")}
                      </span>
                      <span className="text-[10px] text-text-faint uppercase font-medium">
                        {isFocus ? `Focus session #${s.sessionNumber}` : "Break Interval"}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-mono text-text-primary font-bold block">
                        {s.startTime} - {s.endTime}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
