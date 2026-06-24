"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateMultiJobIncome, JobEntry } from "@/lib/tools/calculations";

interface MultiJobIncomeInputsProps {
  groupAccent: string;
}

interface ReactJob {
  id: string;
  name: string;
  hourlyRate: number;
  hoursPerWeek: number;
}

export default function MultiJobIncomeInputs({ groupAccent }: MultiJobIncomeInputsProps) {
  const [jobs, setJobs] = useState<ReactJob[]>([
    { id: "1", name: "Main Job", hourlyRate: 30, hoursPerWeek: 40 },
    { id: "2", name: "Consulting Gig", hourlyRate: 50, hoursPerWeek: 10 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    perJob: [] as any[],
    totalWeekly: 0,
    totalMonthly: 0,
    totalAnnual: 0,
    totalHoursPerWeek: 0,
  });

  useEffect(() => {
    const formatted: JobEntry[] = jobs.map((j) => ({
      name: j.name,
      hourlyRate: j.hourlyRate,
      hoursPerWeek: j.hoursPerWeek,
    }));

    const res = calculateMultiJobIncome(formatted);
    setResult(res);
  }, [jobs]);

  const handleAddJob = () => {
    if (jobs.length >= 5) return;
    const newId = String(Date.now() + Math.random());
    setJobs([...jobs, { id: newId, name: "", hourlyRate: 20, hoursPerWeek: 20 }]);
  };

  const handleRemoveJob = (id: string) => {
    if (jobs.length === 1) {
      setJobs([{ id: "1", name: "", hourlyRate: 20, hoursPerWeek: 20 }]);
      return;
    }
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof ReactJob, value: any) => {
    setJobs(
      jobs.map((j) => (j.id === id ? { ...j, [field]: value } : j))
    );
  };

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const getBreakdownRows = () => {
    const rows = [
      `Total Hours: ${result.totalHoursPerWeek} hrs/week`,
      `Weekly Combined: ${formatCurrency(result.totalWeekly)}`,
      `Monthly Combined: ${formatCurrency(result.totalMonthly)}`,
    ];
    result.perJob.forEach((pj) => {
      rows.push(`${pj.name || "Job"}: ${formatCurrency(pj.weeklyIncome)}/wk (${formatCurrency(pj.annualIncome)}/yr)`);
    });
    return rows;
  };

  const getCopyText = () => {
    return `Combined Annual Income: ${formatCurrency(result.totalAnnual)} (Weekly: ${formatCurrency(result.totalWeekly)}, Hours: ${result.totalHoursPerWeek} hrs/wk)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalAnnual)}
      resultUnit="COMBINED ANNUAL EARNINGS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="space-y-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Jobs & Income Sync (max 5)
          </span>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg-surface">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3 font-semibold">Job / Contract Name</th>
                  <th className="p-3 font-semibold">Hourly Rate ($/hr)</th>
                  <th className="p-3 font-semibold">Hours / Week</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text-primary">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-bg-card-hover/20">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Job name"
                        value={j.name}
                        onChange={(ev) => handleFieldChange(j.id, "name", ev.target.value)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[120px]">
                      <input
                        type="number"
                        min="0"
                        value={j.hourlyRate}
                        onChange={(ev) => handleFieldChange(j.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[120px]">
                      <input
                        type="number"
                        min="0"
                        value={j.hoursPerWeek}
                        onChange={(ev) => handleFieldChange(j.id, "hoursPerWeek", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveJob(j.id)}
                        className="h-9 px-3 border border-border hover:border-accent-utility-e hover:text-accent-utility-e rounded-md font-sans text-xs text-text-muted cursor-pointer transition-all"
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
            {jobs.map((j, idx) => (
              <div key={j.id} className="p-4 border border-border rounded-lg bg-bg-surface space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-xs font-semibold text-text-muted">Job {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveJob(j.id)}
                    className="text-xs text-accent-utility-e hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Job name"
                    value={j.name}
                    onChange={(ev) => handleFieldChange(j.id, "name", ev.target.value)}
                    className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                    style={{ "--local-accent": groupAccent } as React.CSSProperties}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Hourly Rate ($)</span>
                      <input
                        type="number"
                        min="0"
                        value={j.hourlyRate}
                        onChange={(ev) => handleFieldChange(j.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Hours / Week</span>
                      <input
                        type="number"
                        min="0"
                        value={j.hoursPerWeek}
                        onChange={(ev) => handleFieldChange(j.id, "hoursPerWeek", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {jobs.length < 5 && (
            <button
              type="button"
              onClick={handleAddJob}
              className="w-full h-11 border border-dashed border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              + Add Job / Contract
            </button>
          )}
        </div>

      </div>
    </CalculatorCard>
  );
}
