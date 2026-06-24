"use client";

import React, { useState, useEffect } from "react";
import { ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateRelativeDifferences } from "@/lib/tools/calculations";

interface RelativeDiffInputsProps {
  groupAccent: string;
}

export default function RelativeDiffInputs({ groupAccent }: RelativeDiffInputsProps) {
  const [sourceZone, setSourceZone] = useState<string>("America/New_York");
  const [targetTzs, setTargetTzs] = useState<string[]>([
    "America/Los_Angeles",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney"
  ]);
  const [newTz, setNewTz] = useState<string>("Europe/Paris");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState<any[]>([]);

  useEffect(() => {
    const res = calculateRelativeDifferences(sourceZone, targetTzs);
    setResult(res);
  }, [sourceZone, targetTzs]);

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
      `Base Timezone: ${sourceZone}`,
      `Locations Compared: ${targetTzs.length} zones`
    ];
  };

  const getCopyText = () => {
    return `Offsets relative to ${sourceZone}: ` + 
      result.map((r) => `${r.zoneName.split("/")[1] || r.zoneName}: ${r.differenceLabel}`).join(" | ");
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${targetTzs.length} zones`}
      resultUnit="COMPARED TIMEOFFSETS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Source selector */}
        <div className="flex flex-col">
          <ToolSelect
            value={sourceZone}
            onChange={setSourceZone}
            options={timezoneOptions}
            label="Baseline Reference Timezone"
            searchable
          />
        </div>

        {/* Target creator */}
        <div className="flex flex-col sm:flex-row gap-3 items-end pt-4 border-t border-border/40">
          <div className="flex-1 w-full">
            <ToolSelect
              value={newTz}
              onChange={setNewTz}
              options={timezoneOptions}
              label="Add Comparison Timezone"
              searchable
            />
          </div>
          <button
            type="button"
            onClick={handleAddTz}
            className="h-12 px-6 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card transition-colors w-full sm:w-auto"
          >
            Compare Zone
          </button>
        </div>

        {/* Comparison grid */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Relative Offset Comparison Grid
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.map((r, idx) => {
              const isAhead = r.numericHourDifference > 0;
              const isBehind = r.numericHourDifference < 0;
              let badgeColor = "bg-bg-surface text-text-muted border-border";
              if (isAhead) badgeColor = "bg-accent-utility-a/10 text-accent-utility-a border-accent-utility-a/20";
              else if (isBehind) badgeColor = "bg-accent-utility-e/10 text-accent-utility-e border-accent-utility-e/20";

              return (
                <div
                  key={idx}
                  className="p-4 border border-border rounded-lg bg-bg-card flex justify-between items-center animate-in fade-in duration-200"
                >
                  <div className="min-w-0">
                    <span className="font-sans font-bold text-text-primary block truncate">
                      {r.zoneName.split("/")[1]?.replace(/_/g, " ") || r.zoneName}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{r.zoneName}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-1 rounded border font-mono text-xs font-bold text-center ${badgeColor}`}>
                      {isAhead ? `+${r.numericHourDifference}` : r.numericHourDifference}h
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTz(r.zoneName)}
                      className="text-text-muted hover:text-accent-utility-e text-xs"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
            {result.length === 0 && (
              <div className="col-span-full py-8 text-center text-xs text-text-muted italic border border-dashed border-border rounded-lg">
                No target zones added. Pick a zone above to compare offsets.
              </div>
            )}
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
