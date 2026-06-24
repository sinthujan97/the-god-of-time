"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateCampaignDeployment, CampaignPhase, CampaignDeploymentResult } from "@/lib/tools/calculations";

interface CampaignDeploymentTimelineInputsProps {
  groupAccent: string;
}

export default function CampaignDeploymentTimelineInputs({ groupAccent }: CampaignDeploymentTimelineInputsProps) {
  const [launchDate, setLaunchDate] = useState<Date | undefined>(undefined);
  const [phases, setPhases] = useState<CampaignPhase[]>([
    { name: "Market Research & Creative Strategy", durationDays: 5, bufferDays: 1, channel: "Strategy", owner: "Strategy Lead" },
    { name: "Content Copywriting & Asset Writing", durationDays: 8, bufferDays: 2, channel: "Content", owner: "Copywriter" },
    { name: "Visual Asset Design & Layouts", durationDays: 6, bufferDays: 1, channel: "Design", owner: "Graphic Designer" },
    { name: "Ad Platform Config & Launch Setup", durationDays: 3, bufferDays: 1, channel: "Paid Ads", owner: "Ad Manager" },
    { name: "Email List & Newsletter Staging", durationDays: 4, bufferDays: 0, channel: "Email", owner: "Email Lead" }
  ]);

  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState(5);
  const [newBuffer, setNewBuffer] = useState(0);
  const [newChannel, setNewChannel] = useState("Social");
  const [newOwner, setNewOwner] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<CampaignDeploymentResult>({
    phases: [],
    campaignStartDate: new Date(),
    campaignStartFormatted: "",
    totalPhaseDays: 0,
  });

  useEffect(() => {
    const tomorrowMonth = new Date();
    tomorrowMonth.setMonth(tomorrowMonth.getMonth() + 1);
    setLaunchDate(tomorrowMonth);
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isLaunchInvalid = isDateInvalid(launchDate);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!launchDate) return;
    if (isLaunchInvalid) return;
    if (phases.length === 0) return;

    const calc = calculateCampaignDeployment(formatDateToYYYYMMDD(launchDate), phases);
    setResult(calc);
  }, [launchDate, phases, isLaunchInvalid]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddPhase = () => {
    if (!newName.trim()) return;
    setPhases([
      ...phases,
      {
        name: newName.trim(),
        durationDays: Number(newDuration) || 1,
        bufferDays: Number(newBuffer) || 0,
        channel: newChannel,
        owner: newOwner.trim() || "Marketing Team"
      }
    ]);
    setNewName("");
    setNewDuration(5);
    setNewBuffer(0);
    setNewOwner("");
  };

  const handleRemovePhase = (idx: number) => {
    setPhases(phases.filter((_, i) => i !== idx));
  };

  const handleUpdatePhase = (idx: number, field: keyof CampaignPhase, val: any) => {
    const updated = [...phases];
    updated[idx] = {
      ...updated[idx],
      [field]: val
    };
    setPhases(updated);
  };

  const getCopyText = () => {
    if (!launchDate) return "";
    return `Campaign Kickoff Date: ${result.campaignStartFormatted}. Total prep span: ${result.totalPhaseDays} days across ${result.phases.length} phases.`;
  };

  const channelOptions = [
    { value: "Strategy", label: "Strategy & Pitch" },
    { value: "Content", label: "Content & Copy" },
    { value: "Design", label: "Asset & Design" },
    { value: "Paid Ads", label: "Paid Advertising" },
    { value: "Email", label: "Email Sequences" },
    { value: "Social", label: "Organic Social" }
  ];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.campaignStartFormatted !== "" ? result.campaignStartFormatted : "—"}
      resultUnit="REQUIRED CAMPAIGN START DATE"
      resultBreakdown={[
        `Total prep span duration: ${result.totalPhaseDays} days`,
        `Preceding deployment phases: ${result.phases.length}`,
        `Launch kickoff target: ${launchDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(launchDate) : ""}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={isLaunchInvalid ? "Invalid target launch date" : undefined}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Target Launch Date */}
        <div className="flex flex-col">
          <DatePicker
            id="campaign-launch-date"
            label="Campaign Target Launch Date"
            value={launchDate}
            onChange={setLaunchDate}
            accentColor={groupAccent}
          />
          {isLaunchInvalid && (
            <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
              Please enter a valid date
            </span>
          )}
        </div>

        {/* Campaign Phases Manager */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Configure Pre-Launch Marketing Phases
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {phases.map((p, idx) => (
              <div 
                key={idx} 
                className="flex flex-wrap items-center gap-2 bg-bg-surface border border-border p-2 rounded-md animate-in fade-in duration-200 text-xs"
              >
                <span className="font-mono text-text-faint w-6 text-center">{idx + 1}</span>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => handleUpdatePhase(idx, "name", e.target.value)}
                  className="font-sans font-medium text-text-primary bg-transparent border-b border-transparent focus:border-border outline-none flex-1 min-w-[120px]"
                />
                <div className="flex items-center gap-1 w-16">
                  <input
                    type="number"
                    min="1"
                    value={p.durationDays}
                    onChange={(e) => handleUpdatePhase(idx, "durationDays", parseInt(e.target.value, 10) || 1)}
                    className="font-mono text-center w-10 py-0.5 bg-transparent border border-border rounded"
                    title="Duration days"
                  />
                  <span className="text-[10px] text-text-muted font-sans">d</span>
                </div>
                <div className="flex items-center gap-1 w-16">
                  <input
                    type="number"
                    min="0"
                    value={p.bufferDays}
                    onChange={(e) => handleUpdatePhase(idx, "bufferDays", parseInt(e.target.value, 10) || 0)}
                    className="font-mono text-center w-10 py-0.5 bg-transparent border border-border rounded"
                    title="Buffer days"
                  />
                  <span className="text-[10px] text-text-muted font-sans">b</span>
                </div>
                <span 
                  className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] w-20 text-center truncate"
                  style={{ backgroundColor: "rgba(155,142,245,0.1)", color: groupAccent }}
                >
                  {p.channel}
                </span>
                <input
                  type="text"
                  value={p.owner}
                  onChange={(e) => handleUpdatePhase(idx, "owner", e.target.value)}
                  className="font-sans text-text-muted w-20 bg-transparent border-b border-transparent focus:border-border outline-none truncate"
                  placeholder="Owner"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhase(idx)}
                  className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                  title="Remove phase"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Form to add campaign phase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="Phase description"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                placeholder="Days"
                value={newDuration || ""}
                onChange={(e) => setNewDuration(parseInt(e.target.value, 10) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
                title="Duration Days"
              />
              <input
                type="number"
                min="0"
                placeholder="Buffer"
                value={newBuffer || ""}
                onChange={(e) => setNewBuffer(parseInt(e.target.value, 10) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
                title="Buffer Days"
              />
            </div>
            <ToolSelect
              value={newChannel}
              onChange={setNewChannel}
              options={channelOptions}
              placeholder="Channel"
            />
            <input
              type="text"
              placeholder="Owner (e.g. Media Buyer)"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <button
              type="button"
              onClick={handleAddPhase}
              disabled={!newName.trim()}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Phase
            </button>
          </div>
        </div>

        {/* Premium Visualization: Channels Timeline */}
        {result.phases.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Chronological Deployment Timeline
            </h3>

            <div className="relative pl-6 border-l-2 border-border space-y-4 ml-2">
              {/* Campaign start */}
              <div className="relative">
                <div 
                  className="absolute -left-[31px] top-1.5 w-[8px] h-[8px] rounded-full border border-border bg-bg-card"
                  style={{ borderColor: groupAccent, backgroundColor: groupAccent }}
                />
                <div className="flex flex-col text-xs font-sans">
                  <span className="text-text-faint uppercase text-[10px]">Campaign Kickoff</span>
                  <span className="font-bold text-text-primary mt-0.5">{result.campaignStartFormatted}</span>
                </div>
              </div>

              {/* Phases */}
              {result.phases.map((phase: any, index: number) => (
                <div key={index} className="relative">
                  <div 
                    className="absolute -left-[30px] top-2 w-[6px] h-[6px] rounded-full bg-border"
                  />
                  <div className="bg-bg-surface border border-border p-3 rounded-md text-xs font-sans">
                    <div className="flex flex-wrap justify-between items-center gap-1">
                      <span className="font-bold text-text-primary">{phase.name}</span>
                      <span 
                        className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px]"
                        style={{ backgroundColor: "rgba(155,142,245,0.1)", color: groupAccent }}
                      >
                        {phase.channel} • {phase.owner}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-text-muted mt-2 pt-2 border-t border-border/40">
                      <span>Start: {phase.startFormatted}</span>
                      <span>Finish: {phase.endFormatted}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Launch target */}
              <div className="relative">
                <div 
                  className="absolute -left-[31px] top-1.5 w-[8px] h-[8px] rounded-full border border-border bg-bg-card"
                  style={{ borderColor: "var(--accent-utility-e, #EF4444)", backgroundColor: "var(--accent-utility-e, #EF4444)" }}
                />
                <div className="flex flex-col text-xs font-sans">
                  <span className="text-text-faint uppercase text-[10px]">Launch Live Date</span>
                  <span className="font-bold text-text-primary mt-0.5">
                    {launchDate ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(launchDate) : ""}
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
