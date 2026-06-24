"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateTeamAvailability, TeamMember, TeamAvailabilityResult } from "@/lib/tools/calculations";

interface RemoteTeamOverlapInputsProps {
  groupAccent: string;
}

export default function RemoteTeamOverlapInputs({ groupAccent }: RemoteTeamOverlapInputsProps) {
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(undefined);
  const [members, setMembers] = useState<TeamMember[]>([
    { name: "Sarah (New York)", timezone: "America/New_York", workStart: 9, workEnd: 17, workDays: [1, 2, 3, 4, 5] },
    { name: "Alex (London)", timezone: "Europe/London", workStart: 9, workEnd: 17, workDays: [1, 2, 3, 4, 5] },
    { name: "Hiro (Tokyo)", timezone: "Asia/Tokyo", workStart: 9, workEnd: 17, workDays: [1, 2, 3, 4, 5] }
  ]);

  const [newName, setNewName] = useState("");
  const [newTimezone, setNewTimezone] = useState("America/New_York");
  const [newStart, setNewStart] = useState(9);
  const [newEnd, setNewEnd] = useState(17);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<TeamAvailabilityResult>({
    memberAvailability: [],
    overlapWindows: [],
    bestMeetingTime: "No overlapping availability",
    hasOverlap: false,
  });

  useEffect(() => {
    setMeetingDate(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isMeetingInvalid = isDateInvalid(meetingDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!meetingDate) return;
    if (isMeetingInvalid) return;

    const calc = calculateTeamAvailability(members, formatDateToYYYYMMDD(meetingDate));
    setResult(calc);
  }, [meetingDate, members, isMeetingInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddMember = () => {
    if (!newName.trim()) return;
    setMembers([
      ...members,
      {
        name: newName.trim(),
        timezone: newTimezone,
        workStart: Number(newStart) || 9,
        workEnd: Number(newEnd) || 17,
        workDays: [1, 2, 3, 4, 5]
      }
    ]);
    setNewName("");
    setNewStart(9);
    setNewEnd(17);
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const getCopyText = () => {
    return `Best Meeting Time: ${result.bestMeetingTime}. Overlaps: ${result.overlapWindows.map((w: any) => `${w.startUTC} - ${w.endUTC}`).join(", ") || "None"}.`;
  };

  const timezoneOptions = [
    { value: "America/Los_Angeles", label: "US Pacific (PT)" },
    { value: "America/Denver", label: "US Mountain (MT)" },
    { value: "America/Chicago", label: "US Central (CT)" },
    { value: "America/New_York", label: "US Eastern (ET)" },
    { value: "UTC", label: "Coordinated Universal (UTC)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris/Berlin (CET/CEST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
    { value: "Australia/Sydney", label: "Sydney (AET)" }
  ];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.bestMeetingTime}
      resultUnit="RECOMMENDED MEETING SLOT"
      resultBreakdown={[
        result.hasOverlap 
          ? `Found ${result.overlapWindows.length} overlapping time windows` 
          : "No standard business hours overlap between all selected zones.",
        `Date evaluated: ${meetingDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(meetingDate) : ""}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isMeetingInvalid ? "Invalid meeting date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Meeting Date */}
        <div className="flex flex-col">
          <DatePicker
            id="meeting-date"
            label="Meeting Date"
            value={meetingDate}
            onChange={setMeetingDate}
            accentColor={groupAccent}
          />
          {isMeetingInvalid && (
            <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
              Please enter a valid date
            </span>
          )}
        </div>

        {/* Team Member Manager */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Global Team Members
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {members.map((m, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-2 bg-bg-surface border border-border p-3 rounded-md text-xs animate-in fade-in duration-200"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-bold text-text-primary block truncate">{m.name}</span>
                  <span className="text-[10px] text-text-muted font-sans uppercase">
                    {m.timezone} • {m.workStart}:00 - {m.workEnd}:00 local
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                    title="Remove team member"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <div className="text-center py-6 text-text-muted font-sans text-sm italic">
                No team members. Add members below.
              </div>
            )}
          </div>

          {/* Form to add team member */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="Name (e.g. John)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <ToolSelect
              value={newTimezone}
              onChange={setNewTimezone}
              options={timezoneOptions}
              placeholder="Select Timezone"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="0"
                max="23"
                placeholder="Start"
                value={newStart}
                onChange={(e) => setNewStart(Math.min(23, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
                title="Work Start Hour"
              />
              <input
                type="number"
                min="0"
                max="24"
                placeholder="End"
                value={newEnd}
                onChange={(e) => setNewEnd(Math.min(24, Math.max(newStart + 1, parseInt(e.target.value, 10) || 0)))}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
                title="Work End Hour"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              disabled={!newName.trim()}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Member
            </button>
          </div>
        </div>

        {/* Premium Visualization: Timezone overlap visual lines */}
        {result.memberAvailability.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4 overflow-hidden">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Working Hour Overlaps (UTC Scale)
            </h3>
            
            <div className="space-y-4 font-sans text-xs">
              {/* UTC scale ruler */}
              <div className="flex justify-between text-[9px] text-text-faint font-mono px-24 border-b border-border/40 pb-1">
                <span>00:00 UTC</span>
                <span>06:00 UTC</span>
                <span>12:00 UTC</span>
                <span>18:00 UTC</span>
                <span>24:00 UTC</span>
              </div>

              {/* Members Bars */}
              {members.map((m, idx) => {
                // Approximate local time conversion offset on visual bar
                // We'll estimate offset for simple representation
                let leftOffset = 30; // default average
                let widthOffset = 40; // default average
                
                // Set offset estimation based on timezones
                if (m.timezone.includes("Tokyo")) { leftOffset = 10; widthOffset = 35; }
                else if (m.timezone.includes("London")) { leftOffset = 40; widthOffset = 35; }
                else if (m.timezone.includes("New_York")) { leftOffset = 55; widthOffset = 35; }
                else if (m.timezone.includes("Los_Angeles")) { leftOffset = 65; widthOffset = 35; }
                
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-24 truncate text-text-primary font-medium text-[11px]">
                      {m.name.split(" ")[0]}
                    </span>
                    <div className="flex-1 h-4 bg-bg-surface border border-border rounded relative overflow-hidden">
                      <div 
                        className="h-full rounded"
                        style={{ 
                          left: `${leftOffset}%`,
                          width: `${widthOffset}%`,
                          backgroundColor: groupAccent,
                          position: "absolute"
                        }}
                      />
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
