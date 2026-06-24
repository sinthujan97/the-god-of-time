"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { findMeetingSweetSpot, MeetingPlannerResult, HourOverlapGrid } from "@/lib/tools/calculations";

interface MeetingPlannerSweetSpotInputsProps {
  groupAccent: string;
}

export default function MeetingPlannerSweetSpotInputs({ groupAccent }: MeetingPlannerSweetSpotInputsProps) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [participants, setParticipants] = useState<string[]>([
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo"
  ]);
  const [newParticipant, setNewParticipant] = useState<string>("America/Los_Angeles");
  const [workStart, setWorkStart] = useState<number>(9);
  const [workEnd, setWorkEnd] = useState<number>(17);
  const [selectedHourDetails, setSelectedHourDetails] = useState<HourOverlapGrid | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<MeetingPlannerResult>({
    overlapMatrix: [],
    bestSuggestedHourUTC: null,
    hasValidOverlap: false
  });

  useEffect(() => {
    setTargetDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!targetDate) return;
    const dateStr = formatDateToYYYYMMDD(targetDate);
    const res = findMeetingSweetSpot(dateStr, participants, workStart, workEnd);
    setResult(res);
    // Default to the first optimal hour or best suggested hour details
    if (res.overlapMatrix.length > 0) {
      const best = res.overlapMatrix.find((h) => h.hourUTC === res.bestSuggestedHourUTC) || res.overlapMatrix[12];
      setSelectedHourDetails(best);
    }
  }, [targetDate, participants, workStart, workEnd]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddParticipant = () => {
    if (participants.includes(newParticipant)) return;
    setParticipants([...participants, newParticipant]);
  };

  const handleRemoveParticipant = (tz: string) => {
    setParticipants(participants.filter((p) => p !== tz));
  };

  const timezoneOptions = [
    { value: "America/Los_Angeles", label: "US Pacific (PT)" },
    { value: "America/Denver", label: "US Mountain (MT)" },
    { value: "America/Chicago", label: "US Central (CT)" },
    { value: "America/New_York", label: "US Eastern (ET)" },
    { value: "America/Sao_Paulo", label: "Sao Paulo (BRT)" },
    { value: "UTC", label: "Coordinated Universal (UTC)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris/Berlin (CET)" },
    { value: "Europe/Moscow", label: "Moscow (MSK)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
    { value: "Australia/Perth", label: "Perth (AWST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST)" }
  ];

  const getBreakdownRows = () => {
    if (!result.hasValidOverlap) return ["No overlapping work slot found."];
    return [
      `Optimal overlap detected: ${result.overlapMatrix.filter(h => h.isOptimalAcrossAllZones).length} hours.`,
      `Best slot suggested at ${result.bestSuggestedHourUTC}:00 UTC.`
    ];
  };

  const getCopyText = () => {
    if (!targetDate) return "";
    const bestHour = result.bestSuggestedHourUTC;
    return `Suggested meeting window: ${bestHour !== null ? `${bestHour}:00 UTC` : "compromise required"} on ${formatDateToYYYYMMDD(targetDate)}. Participating: ${participants.join(", ")}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.bestSuggestedHourUTC !== null ? `${String(result.bestSuggestedHourUTC).padStart(2, "0")}:00 UTC` : "—"}
      resultUnit="BEST SUGGESTED MEETING HOUR (UTC)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Setup Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <DatePicker
              id="meeting-date"
              label="Meeting Date"
              value={targetDate}
              onChange={setTargetDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="work-start">
              Business Hours Start
            </label>
            <select
              id="work-start"
              value={workStart}
              onChange={(e) => setWorkStart(parseInt(e.target.value, 10))}
              className="h-12 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none text-text-primary"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="work-end">
              Business Hours End
            </label>
            <select
              id="work-end"
              value={workEnd}
              onChange={(e) => setWorkEnd(parseInt(e.target.value, 10))}
              className="h-12 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none text-text-primary"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
              ))}
            </select>
          </div>
        </div>

        {/* Participants Manager */}
        <div className="p-4 border border-border rounded-lg bg-bg-card space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Meeting Participants
          </h3>
          <div className="flex flex-wrap gap-2">
            {participants.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-bg-surface border border-border rounded-full text-xs text-text-primary"
              >
                {p.split("/")[1]?.replace(/_/g, " ") || p}
                <button
                  type="button"
                  onClick={() => handleRemoveParticipant(p)}
                  className="text-text-muted hover:text-accent-utility-e"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 items-end pt-1">
            <div className="flex-1">
              <ToolSelect
                value={newParticipant}
                onChange={setNewParticipant}
                options={timezoneOptions}
                placeholder="Add participant location"
                searchable
              />
            </div>
            <button
              type="button"
              onClick={handleAddParticipant}
              className="h-12 px-4 bg-bg-surface hover:bg-bg-card-hover border border-border rounded-md text-xs font-semibold font-sans text-text-primary transition-all"
            >
              + Add
            </button>
          </div>
        </div>

        {/* 24h Sweet Spot Matrix */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted flex justify-between">
            <span>24-Hour Availability Grid (UTC scale)</span>
            <span className="font-normal italic">Click hour block to see local details</span>
          </h3>

          {/* Color Indicators */}
          <div className="flex gap-4 text-[10px] font-sans pb-1 justify-center">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent-utility-a rounded" /> Working</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#E4B555] rounded" /> Personal</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-accent-utility-e rounded" /> Sleeping</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {result.overlapMatrix.map((hour, idx) => {
              // Determine color profile based on states
              let score = 0;
              hour.zoneBreakdowns.forEach((zb) => {
                if (zb.status === "working") score += 2;
                else if (zb.status === "personal") score += 1;
                else score -= 3;
              });

              let color = "bg-accent-utility-e/30 hover:bg-accent-utility-e/50";
              if (hour.isOptimalAcrossAllZones) {
                color = "bg-accent-utility-a/80 hover:bg-accent-utility-a";
              } else if (score >= 0) {
                color = "bg-[#E4B555]/60 hover:bg-[#E4B555]";
              }

              const isSelected = selectedHourDetails?.hourUTC === hour.hourUTC;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedHourDetails(hour)}
                  className={`h-11 rounded flex flex-col items-center justify-center border font-mono transition-all text-xs font-semibold cursor-pointer select-none ${color} ${
                    isSelected ? "ring-2 ring-white border-white scale-105" : "border-transparent"
                  }`}
                >
                  <span className="text-[10px] text-white">{String(hour.hourUTC).padStart(2, "0")}</span>
                  <span className="text-[8px] text-white/70">UTC</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Hour Breakdown */}
        {selectedHourDetails && (
          <div className="p-4 border border-border rounded-lg bg-bg-card animate-in fade-in duration-200">
            <h4 className="font-sans font-bold text-xs text-text-primary uppercase tracking-[0.06em] mb-2 border-b border-border/40 pb-1.5 flex justify-between">
              <span>Local Times at {selectedHourDetails.timeStringUTC}</span>
              {selectedHourDetails.isOptimalAcrossAllZones && (
                <span className="text-[10px] text-accent-utility-a font-bold">✓ PERFECT OVERLAP</span>
              )}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {selectedHourDetails.zoneBreakdowns.map((zb, idx) => {
                let statusColor = "text-accent-utility-e";
                let statusLabel = "Sleeping";
                if (zb.status === "working") {
                  statusColor = "text-accent-utility-a";
                  statusLabel = "Working";
                } else if (zb.status === "personal") {
                  statusColor = "text-[#E4B555]";
                  statusLabel = "Personal";
                }

                return (
                  <div key={idx} className="flex justify-between items-center p-2 bg-bg-surface border border-border rounded">
                    <div>
                      <span className="font-sans font-medium text-text-primary block truncate max-w-[160px]">
                        {zb.zoneName.split("/")[1]?.replace(/_/g, " ") || zb.zoneName}
                      </span>
                      <span className="text-[10px] text-text-muted">{zb.zoneName}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold block">{zb.localTimeFormatted}</span>
                      <span className={`text-[9px] font-sans font-bold uppercase ${statusColor}`}>{statusLabel}</span>
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
