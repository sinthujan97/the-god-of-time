"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateEventBackTimer, EventStage, EventBackTimerResult } from "@/lib/tools/calculations";

interface EventCountdownBackTimerInputsProps {
  groupAccent: string;
}

export default function EventCountdownBackTimerInputs({ groupAccent }: EventCountdownBackTimerInputsProps) {
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState<string>("18:00");
  const [stages, setStages] = useState<EventStage[]>([
    { name: "Vendor Arrival & Stage Load-In", durationMinutes: 90, bufferMinutes: 15 },
    { name: "AV/Lighting Install & Soundcheck", durationMinutes: 60, bufferMinutes: 10 },
    { name: "Catering & Table Setup", durationMinutes: 120, bufferMinutes: 30 },
    { name: "Staff & Volunteer Briefing", durationMinutes: 30, bufferMinutes: 5 },
    { name: "Doors Open & Check-In", durationMinutes: 45, bufferMinutes: 10 }
  ]);

  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [newBuffer, setNewBuffer] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<EventBackTimerResult>({
    stages: [],
    setupStartTime: new Date(),
    setupStartFormatted: "",
    totalSetupMinutes: 0,
  });

  useEffect(() => {
    setEventDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isEventInvalid = isDateInvalid(eventDate);

  const formatToISOString = (d: Date | undefined, t: string) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}T${t || "00:00"}:00`;
  };

  useEffect(() => {
    if (!eventDate) return;
    if (isEventInvalid) return;

    const dtStr = formatToISOString(eventDate, eventTime);
    const calc = calculateEventBackTimer(dtStr, stages);
    setResult(calc);
  }, [eventDate, eventTime, stages, isEventInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddStage = () => {
    if (!newName.trim()) return;
    setStages([
      ...stages,
      {
        name: newName.trim(),
        durationMinutes: Number(newDuration) || 15,
        bufferMinutes: Number(newBuffer) || 0
      }
    ]);
    setNewName("");
    setNewDuration(30);
    setNewBuffer(0);
  };

  const handleRemoveStage = (idx: number) => {
    setStages(stages.filter((_, i) => i !== idx));
  };

  const handleUpdateStage = (idx: number, field: keyof EventStage, val: any) => {
    const updated = [...stages];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setStages(updated);
  };

  const formatHoursMinutes = (totalMins: number) => {
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} mins`;
  };

  const getCopyText = () => {
    if (!eventDate || result.stages.length === 0) return "";
    return `Setup Start Time: ${result.setupStartFormatted}. Total setup duration: ${formatHoursMinutes(result.totalSetupMinutes)}.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.setupStartFormatted !== "" ? result.setupStartFormatted : "—"}
      resultUnit="REQUIRED SETUP START TIME"
      resultBreakdown={[
        `Total prep time required: ${formatHoursMinutes(result.totalSetupMinutes)}`,
        `Preceding setup stages managed: ${result.stages.length}`,
        `Event start target: ${eventDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(eventDate) : ""} at ${eventTime}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isEventInvalid ? "Invalid event start date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Event Date & Time */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="event-start-date"
              label="Event Start Date"
              value={eventDate}
              onChange={setEventDate}
              accentColor={groupAccent}
            />
            {isEventInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="tool-input-label" htmlFor="event-start-time">
              Event Kickoff Time
            </label>
            <input
              id="event-start-time"
              type="time"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Setup Stages Manager */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Add Setup & Operational Phases
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {stages.map((s, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 bg-bg-surface border border-border p-2 rounded-md animate-in fade-in duration-200 text-xs"
              >
                <span className="font-mono text-text-faint w-6 text-center">{idx + 1}</span>
                <input
                  type="text"
                  value={s.name}
                  onChange={(e) => handleUpdateStage(idx, "name", e.target.value)}
                  className="font-sans bg-transparent border-b border-transparent focus:border-border outline-none flex-1 min-w-0"
                  placeholder="Stage Name"
                />
                <div className="flex items-center gap-1 w-20">
                  <input
                    type="number"
                    min="1"
                    value={s.durationMinutes}
                    onChange={(e) => handleUpdateStage(idx, "durationMinutes", parseInt(e.target.value, 10) || 1)}
                    className="font-mono text-center w-12 py-0.5 bg-transparent border border-border rounded"
                    title="Duration (Minutes)"
                  />
                  <span className="text-[10px] text-text-muted font-sans">m</span>
                </div>
                <div className="flex items-center gap-1 w-20">
                  <input
                    type="number"
                    min="0"
                    value={s.bufferMinutes}
                    onChange={(e) => handleUpdateStage(idx, "bufferMinutes", parseInt(e.target.value, 10) || 0)}
                    className="font-mono text-center w-12 py-0.5 bg-transparent border border-border rounded"
                    title="Buffer (Minutes)"
                  />
                  <span className="text-[10px] text-text-muted font-sans">buf</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStage(idx)}
                  className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                  title="Remove stage"
                >
                  ✕
                </button>
              </div>
            ))}
            {stages.length === 0 && (
              <div className="text-center py-6 text-text-muted font-sans text-sm italic">
                No stages added.
              </div>
            )}
          </div>

          {/* Form to add new stage */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="e.g. Soundcheck"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="sm:col-span-2 tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Mins"
                value={newDuration || ""}
                onChange={(e) => setNewDuration(parseInt(e.target.value, 10) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
                title="Duration Minutes"
              />
              <input
                type="number"
                min="0"
                placeholder="Buffer"
                value={newBuffer || ""}
                onChange={(e) => setNewBuffer(parseInt(e.target.value, 10) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
                title="Buffer Minutes"
              />
            </div>
            <button
              type="button"
              onClick={handleAddStage}
              disabled={!newName.trim()}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Stage
            </button>
          </div>
        </div>

        {/* Premium Visualization: Chronological Run-of-Show Timeline */}
        {result.stages.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Chronological Run-of-Show Schedule
            </h3>
            
            <div className="relative pl-6 border-l-2 border-border space-y-4 ml-2">
              {/* Kickoff Setup */}
              <div className="relative">
                <div 
                  className="absolute -left-[31px] top-1.5 w-[8px] h-[8px] rounded-full border border-border bg-bg-card animate-pulse"
                  style={{ borderColor: groupAccent, backgroundColor: groupAccent }}
                />
                <div className="flex flex-col text-xs font-sans">
                  <span className="text-text-faint uppercase text-[10px]">Setup Begins</span>
                  <span className="font-bold text-text-primary mt-0.5">{result.setupStartFormatted}</span>
                </div>
              </div>

              {/* Steps */}
              {result.stages.map((stage: any, index: number) => (
                <div key={index} className="relative">
                  <div 
                    className="absolute -left-[30px] top-2 w-[6px] h-[6px] rounded-full bg-border"
                  />
                  <div className="bg-bg-surface border border-border p-3 rounded-md text-xs font-sans">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-text-primary">{stage.name}</span>
                      <span className="font-mono text-text-muted">
                        {stage.durationMinutes}m {stage.bufferMinutes > 0 ? `(+${stage.bufferMinutes}m buffer)` : ""}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted mt-2 pt-2 border-t border-border/40">
                      <span>Start: {stage.startFormatted.split(", ")[2]}</span>
                      <span>Finish: {stage.endFormatted.split(", ")[2]}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Event start time */}
              <div className="relative">
                <div 
                  className="absolute -left-[31px] top-1.5 w-[8px] h-[8px] rounded-full border border-border bg-bg-card"
                  style={{ borderColor: "var(--accent-utility-e, #EF4444)", backgroundColor: "var(--accent-utility-e, #EF4444)" }}
                />
                <div className="flex flex-col text-xs font-sans">
                  <span className="text-text-faint uppercase text-[10px]">Event Kickoff (Target)</span>
                  <span className="font-bold text-text-primary mt-0.5">
                    {eventDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(eventDate) : ""} at {eventTime}
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
