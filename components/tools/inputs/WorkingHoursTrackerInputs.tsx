"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateShiftsTotal, Shift } from "@/lib/tools/calculations";

interface WorkingHoursTrackerInputsProps {
  groupAccent: string;
}

interface ReactShift {
  id: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

export default function WorkingHoursTrackerInputs({ groupAccent }: WorkingHoursTrackerInputsProps) {
  const [shifts, setShifts] = useState<ReactShift[]>([
    { id: "1", date: undefined, startTime: "09:00", endTime: "17:00" },
  ]);
  const [otMode, setOtMode] = useState<"daily" | "weekly">("daily");
  const [otThreshold, setOtThreshold] = useState<number>(8); // 8 for daily, 40 for weekly

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [summary, setSummary] = useState({
    totalHours: 0,
    totalDaysLogged: 0,
    averageHoursPerDay: 0,
    overtimeHours: 0,
    regularHours: 0,
  });

  // Client-side initialization: pre-fill the first shift with today's date
  useEffect(() => {
    setShifts([{ id: "1", date: new Date(), startTime: "09:00", endTime: "17:00" }]);
  }, []);

  // Update OT threshold when mode changes
  useEffect(() => {
    setOtThreshold(otMode === "daily" ? 8 : 40);
  }, [otMode]);

  // Recalculate totals live
  useEffect(() => {
    const formattedShifts: Shift[] = shifts.map((s) => {
      const year = s.date?.getFullYear() || 0;
      const month = String((s.date?.getMonth() || 0) + 1).padStart(2, "0");
      const day = String(s.date?.getDate() || 0).padStart(2, "0");
      const dateStr = s.date ? `${year}-${month}-${day}` : "";

      return {
        date: dateStr,
        startTime: s.startTime,
        endTime: s.endTime,
      };
    });

    const results = calculateShiftsTotal(
      formattedShifts,
      otMode === "daily" ? otThreshold : 8,
      otMode === "weekly" ? otThreshold : 40,
      otMode
    );

    setSummary(results);
  }, [shifts, otMode, otThreshold]);

  const handleAddShift = () => {
    if (shifts.length >= 14) return;
    const newId = String(Date.now() + Math.random());
    const lastDate = shifts[shifts.length - 1]?.date || new Date();
    // Default next date to lastDate + 1 day
    const nextDate = new Date(lastDate);
    nextDate.setDate(nextDate.getDate() + 1);

    setShifts([
      ...shifts,
      { id: newId, date: nextDate, startTime: "09:00", endTime: "17:00" },
    ]);
  };

  const handleRemoveShift = (id: string) => {
    if (shifts.length === 1) {
      // Don't remove the last shift, just clear its date
      setShifts([{ id: "1", date: undefined, startTime: "09:00", endTime: "17:00" }]);
      return;
    }
    setShifts(shifts.filter((s) => s.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof ReactShift, value: any) => {
    setShifts(
      shifts.map((s) => {
        if (s.id === id) {
          return { ...s, [field]: value };
        }
        return s;
      })
    );
  };

  const formatHoursMinutes = (decHours: number): string => {
    const hrs = Math.floor(decHours);
    const mins = Math.round((decHours - hrs) * 60);
    return `${hrs}h ${mins}m`;
  };

  const getBreakdownRows = () => {
    return [
      `Total shifts: ${summary.totalDaysLogged}`,
      `Regular work hours: ${summary.regularHours} hrs (${formatHoursMinutes(summary.regularHours)})`,
      `Overtime hours: ${summary.overtimeHours} hrs (${formatHoursMinutes(summary.overtimeHours)})`,
      `Average shift length: ${summary.averageHoursPerDay} hrs/day`,
    ];
  };

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${summary.totalHours.toFixed(2)} hrs`}
      resultUnit="TOTAL HOURS LOGGED"
      resultBreakdown={getBreakdownRows()}
      copyText={`${summary.totalHours.toFixed(2)} total working hours`}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Dynamic shifts table for Desktop, stack layout for Mobile */}
        <div className="space-y-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Work Shifts Log (max 14)
          </span>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg-surface">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Start Time</th>
                  <th className="p-3 font-semibold">End Time</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text-primary">
                {shifts.map((s) => (
                  <tr key={s.id} className="hover:bg-bg-card-hover/20">
                    <td className="p-2 w-[240px]">
                      <DatePicker
                        id={`date-${s.id}`}
                        value={s.date}
                        onChange={(val) => handleFieldChange(s.id, "date", val)}
                        accentColor={groupAccent}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="time"
                        value={s.startTime}
                        onChange={(e) => handleFieldChange(s.id, "startTime", e.target.value)}
                        className="h-12 px-4 bg-bg-card border border-border rounded-[var(--radius-sm)] font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="time"
                        value={s.endTime}
                        onChange={(e) => handleFieldChange(s.id, "endTime", e.target.value)}
                        className="h-12 px-4 bg-bg-card border border-border rounded-[var(--radius-sm)] font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveShift(s.id)}
                        className="h-12 px-4 border border-border hover:border-accent-utility-e hover:text-accent-utility-e rounded-[var(--radius-sm)] font-sans text-xs text-text-muted cursor-pointer transition-all"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked View */}
          <div className="block md:hidden space-y-4">
            {shifts.map((s, idx) => (
              <div key={s.id} className="p-4 border border-border rounded-lg bg-bg-surface space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-xs font-semibold text-text-muted">Shift {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveShift(s.id)}
                    className="text-xs text-accent-utility-e hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <DatePicker
                    id={`m-date-${s.id}`}
                    label="Date"
                    value={s.date}
                    onChange={(val) => handleFieldChange(s.id, "date", val)}
                    accentColor={groupAccent}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-sans font-medium uppercase text-text-muted mb-1">Start Time</span>
                      <input
                        type="time"
                        value={s.startTime}
                        onChange={(e) => handleFieldChange(s.id, "startTime", e.target.value)}
                        className="h-12 px-4 bg-bg-card border border-border rounded-[var(--radius-sm)] font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-sans font-medium uppercase text-text-muted mb-1">End Time</span>
                      <input
                        type="time"
                        value={s.endTime}
                        onChange={(e) => handleFieldChange(s.id, "endTime", e.target.value)}
                        className="h-12 px-4 bg-bg-card border border-border rounded-[var(--radius-sm)] font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Shift Trigger */}
          {shifts.length < 14 && (
            <button
              type="button"
              onClick={handleAddShift}
              className="w-full h-12 border border-dashed border-border hover:border-text-faint rounded-[var(--radius-sm)] font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              + Add Shift
            </button>
          )}
        </div>

        {/* Overtime Policy Selectors */}
        <div className="pt-4 border-t border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
              OT Mode
            </span>
            <PillToggle
              value={otMode}
              onChange={(val) => setOtMode(val as any)}
              options={[
                { value: "daily", label: "Daily Threshold" },
                { value: "weekly", label: "Weekly Threshold" },
              ]}
              accentColor={groupAccent}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0" htmlFor="threshold-input">
              OT Limit (hrs)
            </label>
            <input
              id="threshold-input"
              type="number"
              min="0"
              max="168"
              value={isNaN(otThreshold) ? "" : otThreshold}
              onChange={(e) => setOtThreshold(parseFloat(e.target.value))}
              className="h-12 w-[120px] px-4 bg-bg-surface border border-border rounded-[var(--radius-sm)] font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
