"use client";

import React, { useState, useEffect } from "react";
import { PillToggle, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateDowntime, IncidentEntry, DowntimeResult } from "@/lib/tools/calculations";

interface DowntimeUptimeCalculatorInputsProps {
  groupAccent: string;
}

export default function DowntimeUptimeCalculatorInputs({ groupAccent }: DowntimeUptimeCalculatorInputsProps) {
  const [slaTarget, setSlaTarget] = useState<number>(99.9);
  const [incidents, setIncidents] = useState<IncidentEntry[]>([
    { startDateTime: "2025-06-01T02:00", endDateTime: "2025-06-01T03:30", category: "Network" },
    { startDateTime: "2025-06-10T14:15", endDateTime: "2025-06-10T14:45", category: "Database" },
    { startDateTime: "2025-06-20T22:00", endDateTime: "2025-06-20T22:15", category: "Hardware" }
  ]);

  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newCategory, setNewCategory] = useState("Network");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<DowntimeResult>({
    totalDowntimeMinutes: 0,
    totalDowntimeFormatted: "0m",
    uptimePercentage: 100,
    downtimePercentage: 0,
    longestIncident: { duration: 0, category: "N/A" },
    byCategory: [],
    averageIncidentDuration: 0,
    totalIncidents: 0,
    measuredPeriodDays: 1,
  });

  useEffect(() => {
    // Default form to today
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T12:00`;
    setNewStart(dateStr);
    setNewEnd(dateStr);
  }, []);

  useEffect(() => {
    const calc = calculateDowntime(incidents);
    setResult(calc);
  }, [incidents]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddIncident = () => {
    if (!newStart || !newEnd) return;
    setIncidents([
      ...incidents,
      {
        startDateTime: newStart,
        endDateTime: newEnd,
        category: newCategory,
      }
    ]);
  };

  const handleRemoveIncident = (idx: number) => {
    setIncidents(incidents.filter((_, i) => i !== idx));
  };

  const getCopyText = () => {
    return `Uptime: ${result.uptimePercentage}%. Total Downtime: ${result.totalDowntimeFormatted} (${result.totalIncidents} incidents over ${result.measuredPeriodDays} days).`;
  };

  const isSlaMet = result.uptimePercentage >= slaTarget;

  const categoryOptions = [
    { value: "Network", label: "Network Outage" },
    { value: "Database", label: "Database Failure" },
    { value: "Application", label: "Application Crash" },
    { value: "Hardware", label: "Hardware Fault" },
    { value: "Maintenance", label: "Scheduled Maintenance" }
  ];

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.uptimePercentage}%`}
      resultUnit="CALCULATED SERVICE UPTIME"
      resultBreakdown={[
        `Total downtime recorded: ${result.totalDowntimeFormatted} (${result.totalDowntimeMinutes} mins)`,
        `Service status: ${isSlaMet ? "SLA Target MET" : "SLA Target BREACHED"} (Target: ${slaTarget}%)`,
        `Outages evaluated over a span of ${result.measuredPeriodDays} days`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: SLA Target */}
        <div className="flex flex-col">
          <label className="tool-input-label" htmlFor="sla-target-input">
            Target SLA Uptime (%)
          </label>
          <input
            id="sla-target-input"
            type="number"
            min="90"
            max="100"
            step="0.001"
            value={slaTarget || ""}
            onChange={(e) => setSlaTarget(parseFloat(e.target.value) || 99.9)}
            className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Incident Logs Manager */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Incident Outage Log
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {incidents.map((inc, idx) => {
              const startF = inc.startDateTime.replace("T", " ");
              const endF = inc.endDateTime.replace("T", " ");
              return (
                <div 
                  key={idx} 
                  className="flex flex-wrap items-center justify-between gap-2 bg-bg-surface border border-border p-3 rounded-md text-xs animate-in fade-in duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <span 
                      className="font-sans font-semibold uppercase tracking-wider block text-[10px]"
                      style={{ color: groupAccent }}
                    >
                      {inc.category} Incident
                    </span>
                    <span className="font-sans text-text-primary block mt-0.5">
                      From: {startF} to {endF}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-text-muted">
                      {Math.round((new Date(inc.endDateTime).getTime() - new Date(inc.startDateTime).getTime()) / 60000)}m
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIncident(idx)}
                      className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                      title="Remove incident"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
            {incidents.length === 0 && (
              <div className="text-center py-6 text-text-muted font-sans text-sm italic">
                No incidents logged. System is operating at 100% availability.
              </div>
            )}
          </div>

          {/* Form to log incident */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
            <div className="flex flex-col">
              <label className="text-[10px] uppercase text-text-faint font-sans mb-1" htmlFor="new-start-incident">Start</label>
              <input
                id="new-start-incident"
                type="datetime-local"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className="tool-input-field h-9 px-2 font-sans text-[11px] bg-bg-surface border border-border rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] uppercase text-text-faint font-sans mb-1" htmlFor="new-end-incident">End</label>
              <input
                id="new-end-incident"
                type="datetime-local"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className="tool-input-field h-9 px-2 font-sans text-[11px] bg-bg-surface border border-border rounded-md"
              />
            </div>
            <div className="flex flex-col justify-end">
              <ToolSelect
                value={newCategory}
                onChange={setNewCategory}
                options={categoryOptions}
                placeholder="Category"
              />
            </div>
            <button
              type="button"
              onClick={handleAddIncident}
              disabled={!newStart || !newEnd}
              className="h-9 self-end font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Log Outage
            </button>
          </div>
        </div>

        {/* Dashboard visual stats */}
        {incidents.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Outage Analysis & SLA Metric
            </h4>

            {/* SLA Status Card */}
            <div className="flex justify-between items-center bg-bg-surface border border-border p-3 rounded-md">
              <div className="text-xs font-sans text-text-muted">
                <span>SLA Status</span>
                <span className="block text-sm font-bold text-text-primary mt-1">
                  {isSlaMet 
                    ? "Target met. Services comply with contract guidelines." 
                    : "Target breached. Outages exceed allowance limits."}
                </span>
              </div>
              <span 
                className={`font-sans text-xs font-bold px-3 py-1 border rounded-md uppercase tracking-wider ${
                  isSlaMet 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                }`}
              >
                {isSlaMet ? "SLA MET" : "BREACHED"}
              </span>
            </div>

            {/* Category Breakdown list */}
            {result.byCategory.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-text-faint font-sans tracking-wide">Category Breakdown</span>
                {result.byCategory.map((cat: any) => (
                  <div key={cat.category} className="space-y-1 font-sans text-xs text-text-muted">
                    <div className="flex justify-between font-medium">
                      <span>{cat.category} ({cat.incidents} inc)</span>
                      <span>{cat.totalMinutes} mins ({cat.percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-border"
                        style={{ 
                          width: `${cat.percentage}%`,
                          backgroundColor: groupAccent
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
