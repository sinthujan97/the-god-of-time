"use client";

import React, { useState, useEffect } from "react";
import { ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { matchGlobalDeadlines } from "@/lib/tools/calculations";

interface DeadlineMatcherInputsProps {
  groupAccent: string;
}

export default function DeadlineMatcherInputs({ groupAccent }: DeadlineMatcherInputsProps) {
  const [deadlineTime, setDeadlineTime] = useState<string>("2026-06-24T17:00");
  const [sourceTz, setSourceTz] = useState<string>("America/New_York");
  const [targetTzs, setTargetTzs] = useState<string[]>([
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney"
  ]);
  const [newTz, setNewTz] = useState<string>("Europe/Paris");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    sourceDeadlineFormatted: "",
    convertedTargetDeadlines: [] as { zone: string; absoluteTimeFormatted: string; relativeDayShift: string }[]
  });

  // Default pre-fill date-time
  useEffect(() => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const localStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T17:00`;
    setDeadlineTime(localStr);
  }, []);

  useEffect(() => {
    if (!deadlineTime) return;
    const res = matchGlobalDeadlines(deadlineTime, sourceTz, targetTzs);
    setResult(res);
  }, [deadlineTime, sourceTz, targetTzs]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddTz = () => {
    if (targetTzs.includes(newTz)) return;
    setTargetTzs([...targetTzs, newTz]);
  };

  const handleRemoveTz = (tz: string) => {
    setTargetTzs(targetTzs.filter((t) => t !== tz));
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
    return [
      `Source Cut-Off Time: ${result.sourceDeadlineFormatted} (${sourceTz})`,
      `Target Nodes: ${targetTzs.length} branches compared`
    ];
  };

  const getCopyText = () => {
    return `Deadline at ${result.sourceDeadlineFormatted} (${sourceTz}) corresponds to: ` + 
      result.convertedTargetDeadlines.map((c) => `${c.zone.split("/")[1] || c.zone}: ${c.absoluteTimeFormatted} (${c.relativeDayShift})`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.sourceDeadlineFormatted || "—"}
      resultUnit="SOURCE CUT-OFF DEADLINE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Source values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="deadline-time">
              Target Deadline Local Time
            </label>
            <input
              id="deadline-time"
              type="datetime-local"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col">
            <ToolSelect
              value={sourceTz}
              onChange={setSourceTz}
              options={timezoneOptions}
              label="Source Branch Timezone"
              searchable
            />
          </div>
        </div>

        {/* Target branch selector */}
        <div className="flex flex-col sm:flex-row gap-3 items-end pt-4 border-t border-border/40">
          <div className="flex-1 w-full">
            <ToolSelect
              value={newTz}
              onChange={setNewTz}
              options={timezoneOptions}
              label="Add Target Branch"
              searchable
            />
          </div>
          <button
            type="button"
            onClick={handleAddTz}
            className="h-12 px-6 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card transition-colors w-full sm:w-auto"
          >
            Add Branch
          </button>
        </div>

        {/* Matcher matrix grid */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Deadline Synchronization Matrix
          </h3>
          <div className="overflow-x-auto border border-border rounded-lg bg-bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-bg-surface/50 font-sans text-[10px] uppercase font-semibold text-text-muted">
                  <th className="p-3">Branch Location</th>
                  <th className="p-3">Equivalent Local Deadline</th>
                  <th className="p-3 text-center">Day Shift Status</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-sans">
                {result.convertedTargetDeadlines.map((c, idx) => {
                  let badgeColor = "bg-bg-surface text-text-muted";
                  if (c.relativeDayShift.includes("+")) {
                    badgeColor = "bg-accent-utility-a/10 text-accent-utility-a font-bold";
                  } else if (c.relativeDayShift.includes("-")) {
                    badgeColor = "bg-accent-utility-e/10 text-accent-utility-e font-bold";
                  }
                  
                  return (
                    <tr key={idx} className="hover:bg-bg-surface/30">
                      <td className="p-3 font-semibold text-text-primary">
                        {c.zone.split("/")[1]?.replace(/_/g, " ") || c.zone}
                        <span className="block text-[9px] text-text-muted font-normal">{c.zone}</span>
                      </td>
                      <td className="p-3 font-mono font-semibold">{c.absoluteTimeFormatted}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider ${badgeColor}`}>
                          {c.relativeDayShift}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveTz(c.zone)}
                          className="text-text-muted hover:text-accent-utility-e text-xs"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {result.convertedTargetDeadlines.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-text-muted italic">
                      No target branches added. Add branches above to build matrix.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
