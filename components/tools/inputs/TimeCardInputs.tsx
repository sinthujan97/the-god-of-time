"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateTimeCard, TimeCardEntry, parseTimeToSeconds } from "@/lib/tools/calculations";
import { DatePicker } from "@/components/ui";

interface TimeCardInputsProps {
  groupAccent: string;
}

interface ReactEntry {
  id: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  breakMinutes: number;
}

export default function TimeCardInputs({ groupAccent }: TimeCardInputsProps) {
  const [entries, setEntries] = useState<ReactEntry[]>([]);
  const [dailyThreshold, setDailyThreshold] = useState<number>(8);
  const [weeklyThreshold, setWeeklyThreshold] = useState<number>(40);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    entries: [] as any[],
    totalHours: 0,
    totalHoursFormatted: "0h 0m",
    totalDecimalHours: 0,
    regularHours: 0,
    overtimeHours: 0,
    totalDays: 0,
    averageHoursPerDay: 0,
    isValid: false,
  });

  // Client-side initialization: pre-fill standard 5-day week
  useEffect(() => {
    const today = new Date();
    // Start of current week (Monday)
    const currentDay = today.getDay();
    const distance = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + distance);

    const initialEntries = Array.from({ length: 7 }).map((_, idx) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + idx);
      // Default standard hours for Mon-Fri, weekend empty
      const isWeekend = idx >= 5;
      return {
        id: String(idx + 1),
        date: d,
        startTime: isWeekend ? "" : "09:00",
        endTime: isWeekend ? "" : "17:00",
        breakMinutes: isWeekend ? 0 : 30,
      };
    });
    setEntries(initialEntries);
  }, []);

  // Calculate live
  useEffect(() => {
    if (entries.length === 0) return;

    const formattedEntries: TimeCardEntry[] = entries.map((e) => {
      const year = e.date?.getFullYear() || 0;
      const month = String((e.date?.getMonth() || 0) + 1).padStart(2, "0");
      const day = String(e.date?.getDate() || 0).padStart(2, "0");
      const dateStr = e.date ? `${year}-${month}-${day}` : "";

      return {
        date: dateStr,
        startTime: e.startTime,
        endTime: e.endTime,
        breakMinutes: e.breakMinutes,
      };
    });

    const res = calculateTimeCard(formattedEntries, dailyThreshold, weeklyThreshold);
    setResult({
      ...res,
      entries: res.entries || [],
    });
  }, [entries, dailyThreshold, weeklyThreshold]);

  const handleFieldChange = (id: string, field: keyof ReactEntry, value: any) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return [];
    return [
      `Total Decimal Hours: ${result.totalDecimalHours.toFixed(2)} hrs`,
      `Regular Hours: ${result.regularHours.toFixed(2)} hrs`,
      `Overtime Hours: ${result.overtimeHours.toFixed(2)} hrs`,
      `Average shift: ${result.averageHoursPerDay.toFixed(2)} hrs/day (${result.totalDays} active days)`,
    ];
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Total hours: ${result.totalHoursFormatted} (${result.regularHours.toFixed(2)} regular, ${result.overtimeHours.toFixed(2)} overtime)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.totalHoursFormatted}
      resultUnit="TOTAL HOURS WORKED"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Table representation for entries */}
        <div className="space-y-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Weekly Hours Log
          </span>

          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg-surface">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Start</th>
                  <th className="p-3 font-semibold">End</th>
                  <th className="p-3 font-semibold">Break (mins)</th>
                  <th className="p-3 font-semibold text-right">Net Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text-primary">
                {entries.map((e, idx) => {
                  const rowRes = result.entries[idx] || {};
                  return (
                    <tr key={e.id} className="hover:bg-bg-card-hover/20">
                      <td className="p-2 w-[200px]">
                        <DatePicker
                          id={`timecard-date-${e.id}`}
                          value={e.date}
                          onChange={(val) => handleFieldChange(e.id, "date", val)}
                          accentColor={groupAccent}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="time"
                          value={e.startTime}
                          onChange={(ev) => handleFieldChange(e.id, "startTime", ev.target.value)}
                          className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="time"
                          value={e.endTime}
                          onChange={(ev) => handleFieldChange(e.id, "endTime", ev.target.value)}
                          className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </td>
                      <td className="p-2 w-[100px]">
                        <input
                          type="number"
                          min="0"
                          max="1440"
                          value={e.breakMinutes}
                          onChange={(ev) => handleFieldChange(e.id, "breakMinutes", parseInt(ev.target.value) || 0)}
                          className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-medium text-text-muted">
                        {rowRes.hoursWorkedFormatted || "0h 0m"}
                        {rowRes.isOvertime && (
                          <span className="text-[10px] text-accent-utility-e font-sans uppercase font-semibold block tracking-[0.05em] mt-0.5">
                            Daily OT
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Layout */}
          <div className="block md:hidden space-y-4">
            {entries.map((e, idx) => {
              const rowRes = result.entries[idx] || {};
              const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
              const dayLabel = e.date ? daysOfWeek[e.date.getDay()] : `Day ${idx + 1}`;
              return (
                <div key={e.id} className="p-4 border border-border rounded-lg bg-bg-surface space-y-3">
                  <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                    <span className="text-xs font-semibold text-text-muted">{dayLabel}</span>
                    <span className="text-xs font-mono font-semibold text-text-primary">
                      {rowRes.hoursWorkedFormatted || "0h 0m"}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <DatePicker
                      id={`m-timecard-date-${e.id}`}
                      value={e.date}
                      onChange={(val) => handleFieldChange(e.id, "date", val)}
                      accentColor={groupAccent}
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1">Start</span>
                        <input
                          type="time"
                          value={e.startTime}
                          onChange={(ev) => handleFieldChange(e.id, "startTime", ev.target.value)}
                          className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1">End</span>
                        <input
                          type="time"
                          value={e.endTime}
                          onChange={(ev) => handleFieldChange(e.id, "endTime", ev.target.value)}
                          className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1">Break</span>
                        <input
                          type="number"
                          min="0"
                          max="1440"
                          value={e.breakMinutes}
                          onChange={(ev) => handleFieldChange(e.id, "breakMinutes", parseInt(ev.target.value) || 0)}
                          className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overtime Policy Settings */}
        <div className="pt-4 border-t border-border-subtle grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="daily-ot">
              Daily OT Limit (hrs)
            </label>
            <input
              id="daily-ot"
              type="number"
              min="0"
              max="24"
              value={isNaN(dailyThreshold) ? "" : dailyThreshold}
              onChange={(e) => setDailyThreshold(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="weekly-ot">
              Weekly OT Limit (hrs)
            </label>
            <input
              id="weekly-ot"
              type="number"
              min="0"
              max="168"
              value={isNaN(weeklyThreshold) ? "" : weeklyThreshold}
              onChange={(e) => setWeeklyThreshold(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
