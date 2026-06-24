"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateTimeCard, TimeCardEntry } from "@/lib/tools/calculations";
import { DatePicker } from "@/components/ui";

interface BiweeklyTimesheetInputsProps {
  groupAccent: string;
}

interface ReactEntry {
  id: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  breakMinutes: number;
}

export default function BiweeklyTimesheetInputs({ groupAccent }: BiweeklyTimesheetInputsProps) {
  const [entries, setEntries] = useState<ReactEntry[]>([]);
  const [dailyThreshold, setDailyThreshold] = useState<number>(8);
  const [weeklyThreshold, setWeeklyThreshold] = useState<number>(40);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [week1Result, setWeek1Result] = useState<any>({ totalHours: 0, regularHours: 0, overtimeHours: 0, totalHoursFormatted: "0h 0m" });
  const [week2Result, setWeek2Result] = useState<any>({ totalHours: 0, regularHours: 0, overtimeHours: 0, totalHoursFormatted: "0h 0m" });
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalHoursFormatted, setTotalHoursFormatted] = useState<string>("0h 0m");

  // Client-side initialization: pre-fill 14 days starting from Monday of current week
  useEffect(() => {
    const today = new Date();
    const currentDay = today.getDay();
    const distance = currentDay === 0 ? -6 : 1 - currentDay;
    const baseDate = new Date(today);
    baseDate.setDate(today.getDate() + distance);

    const initialEntries = Array.from({ length: 14 }).map((_, idx) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + idx);
      const isWeekend = idx === 5 || idx === 6 || idx === 12 || idx === 13;
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
    if (entries.length < 14) return;

    const formatted: TimeCardEntry[] = entries.map((e) => {
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

    const w1 = calculateTimeCard(formatted.slice(0, 7), dailyThreshold, weeklyThreshold);
    const w2 = calculateTimeCard(formatted.slice(7, 14), dailyThreshold, weeklyThreshold);

    setWeek1Result(w1);
    setWeek2Result(w2);

    const combHours = w1.totalHours + w2.totalHours;
    setTotalHours(combHours);

    const hrs = Math.floor(combHours);
    const mins = Math.round((combHours - hrs) * 60);
    setTotalHoursFormatted(`${hrs}h ${mins}m`);
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
    const totalReg = (week1Result.regularHours || 0) + (week2Result.regularHours || 0);
    const totalOt = (week1Result.overtimeHours || 0) + (week2Result.overtimeHours || 0);

    return [
      `Week 1 Subtotal: ${week1Result.totalHoursFormatted} (${week1Result.regularHours.toFixed(2)} regular, ${week1Result.overtimeHours.toFixed(2)} OT)`,
      `Week 2 Subtotal: ${week2Result.totalHoursFormatted} (${week2Result.regularHours.toFixed(2)} regular, ${week2Result.overtimeHours.toFixed(2)} OT)`,
      `Total Regular Hours: ${totalReg.toFixed(2)} hrs`,
      `Total Overtime Hours: ${totalOt.toFixed(2)} hrs`,
    ];
  };

  const getCopyText = () => {
    const totalReg = (week1Result.regularHours || 0) + (week2Result.regularHours || 0);
    const totalOt = (week1Result.overtimeHours || 0) + (week2Result.overtimeHours || 0);
    return `Bi-Weekly Total Hours: ${totalHoursFormatted} (${totalReg.toFixed(2)} regular, ${totalOt.toFixed(2)} overtime). Week 1: ${week1Result.totalHoursFormatted}, Week 2: ${week2Result.totalHoursFormatted}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={totalHoursFormatted}
      resultUnit="14-DAY TOTAL HOURS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Weekly sections */}
        <div className="space-y-6">
          {/* Week 1 */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block border-b border-border pb-1">
              Week 1 Logs
            </span>
            <div className="space-y-3">
              {entries.slice(0, 7).map((e, idx) => {
                const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const dayLabel = e.date ? daysOfWeek[e.date.getDay()] : `Day ${idx + 1}`;
                const rowRes = (week1Result.entries || [])[idx] || {};
                return (
                  <div key={e.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border border-border/40 p-3 rounded-lg bg-bg-surface/50">
                    <div className="font-sans text-xs font-medium text-text-muted md:col-span-1">
                      {dayLabel}
                    </div>
                    <div className="md:col-span-1">
                      <DatePicker
                        id={`w1-date-${e.id}`}
                        value={e.date}
                        onChange={(val) => handleFieldChange(e.id, "date", val)}
                        accentColor={groupAccent}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:col-span-2">
                      <input
                        type="time"
                        value={e.startTime}
                        onChange={(ev) => handleFieldChange(e.id, "startTime", ev.target.value)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                      <input
                        type="time"
                        value={e.endTime}
                        onChange={(ev) => handleFieldChange(e.id, "endTime", ev.target.value)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Break"
                        value={e.breakMinutes}
                        onChange={(ev) => handleFieldChange(e.id, "breakMinutes", parseInt(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div className="text-right font-mono font-medium text-text-muted md:col-span-1">
                      {rowRes.hoursWorkedFormatted || "0h 0m"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Week 2 */}
          <div className="space-y-3">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block border-b border-border pb-1">
              Week 2 Logs
            </span>
            <div className="space-y-3">
              {entries.slice(7, 14).map((e, idx) => {
                const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                const dayLabel = e.date ? daysOfWeek[e.date.getDay()] : `Day ${idx + 8}`;
                const rowRes = (week2Result.entries || [])[idx] || {};
                return (
                  <div key={e.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center border border-border/40 p-3 rounded-lg bg-bg-surface/50">
                    <div className="font-sans text-xs font-medium text-text-muted md:col-span-1">
                      {dayLabel}
                    </div>
                    <div className="md:col-span-1">
                      <DatePicker
                        id={`w2-date-${e.id}`}
                        value={e.date}
                        onChange={(val) => handleFieldChange(e.id, "date", val)}
                        accentColor={groupAccent}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 md:col-span-2">
                      <input
                        type="time"
                        value={e.startTime}
                        onChange={(ev) => handleFieldChange(e.id, "startTime", ev.target.value)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                      <input
                        type="time"
                        value={e.endTime}
                        onChange={(ev) => handleFieldChange(e.id, "endTime", ev.target.value)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                      <input
                        type="number"
                        min="0"
                        placeholder="Break"
                        value={e.breakMinutes}
                        onChange={(ev) => handleFieldChange(e.id, "breakMinutes", parseInt(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div className="text-right font-mono font-medium text-text-muted md:col-span-1">
                      {rowRes.hoursWorkedFormatted || "0h 0m"}
                    </div>
                  </div>
                );
              })}
            </div>
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
