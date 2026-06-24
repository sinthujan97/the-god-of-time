"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateFractionalExecutive, FractionalClient } from "@/lib/tools/calculations";

interface FractionalExecutiveInputsProps {
  groupAccent: string;
}

interface ReactClient {
  id: string;
  name: string;
  hoursPerWeek: number;
  hourlyRate: number;
}

export default function FractionalExecutiveInputs({ groupAccent }: FractionalExecutiveInputsProps) {
  const [maxCapacity, setMaxCapacity] = useState<number>(40);
  const [clients, setClients] = useState<ReactClient[]>([
    { id: "1", name: "Alpha Corp", hoursPerWeek: 10, hourlyRate: 150 },
    { id: "2", name: "Beta LLC", hoursPerWeek: 15, hourlyRate: 175 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    perClient: [] as any[],
    totalWeeklyHours: 0,
    totalWeeklyRevenue: 0,
    totalMonthlyRevenue: 0,
    capacityUtilization: 0,
    remainingCapacityHours: 0,
    maxCapacityHours: 40,
  });

  useEffect(() => {
    const formatted: FractionalClient[] = clients.map((c) => ({
      name: c.name,
      hoursPerWeek: c.hoursPerWeek,
      hourlyRate: c.hourlyRate,
    }));

    const res = calculateFractionalExecutive(formatted, maxCapacity);
    setResult(res);
  }, [clients, maxCapacity]);

  const handleAddClient = () => {
    if (clients.length >= 10) return;
    const newId = String(Date.now() + Math.random());
    setClients([...clients, { id: newId, name: "", hoursPerWeek: 5, hourlyRate: 150 }]);
  };

  const handleRemoveClient = (id: string) => {
    if (clients.length === 1) {
      setClients([{ id: "1", name: "", hoursPerWeek: 5, hourlyRate: 150 }]);
      return;
    }
    setClients(clients.filter((c) => c.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof ReactClient, value: any) => {
    setClients(
      clients.map((c) => (c.id === id ? { ...c, [field]: value } : c))
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
    const statusText = result.capacityUtilization > 100 
      ? `Over-allocated by ${(result.totalWeeklyHours - maxCapacity).toFixed(1)} hours!`
      : `${result.remainingCapacityHours.toFixed(1)} available hours remaining`;

    return [
      `Total Client Hours: ${result.totalWeeklyHours} hrs/week (${result.capacityUtilization.toFixed(1)}% utilization)`,
      `Status: ${statusText}`,
      `Total Weekly Revenue: ${formatCurrency(result.totalWeeklyRevenue)}/week`,
      `Average Portfolio Yield: ${result.totalWeeklyHours > 0 ? formatCurrency(result.totalWeeklyRevenue / result.totalWeeklyHours) : "$0.00"}/hr`,
    ];
  };

  const getCopyText = () => {
    return `Monthly Fractional Income: ${formatCurrency(result.totalMonthlyRevenue)} (${result.totalWeeklyHours} hrs/wk, ${result.capacityUtilization.toFixed(1)}% capacity used).`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalMonthlyRevenue)}
      resultUnit="ESTIMATED MONTHLY REVENUE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.capacityUtilization > 100 ? "Warning: You are over-committed. Total hours exceed weekly limit." : undefined}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Visual progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-sans font-medium text-text-muted">
            <span>Capacity Utilization</span>
            <span className={result.capacityUtilization > 100 ? "text-accent-utility-e" : "text-text-primary"}>
              {result.capacityUtilization.toFixed(1)}% ({result.totalWeeklyHours} / {maxCapacity} hrs)
            </span>
          </div>
          <div className="w-full bg-bg-card border border-border rounded-full h-4 overflow-hidden relative">
            <div 
              className="h-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, result.capacityUtilization)}%`,
                backgroundColor: result.capacityUtilization > 100 ? "#EF4444" : groupAccent
              }}
            />
          </div>
        </div>

        {/* Max Capacity Limit */}
        <div className="flex flex-col space-y-1 w-[160px]">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="max-capacity">
            Weekly Hours Capacity
          </label>
          <input
            id="max-capacity"
            type="number"
            min="1"
            max="168"
            value={isNaN(maxCapacity) ? "" : maxCapacity}
            onChange={(e) => setMaxCapacity(parseFloat(e.target.value) || 40)}
            className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Portfolio Table */}
        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Portfolio Clients (max 10)
          </span>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg-surface">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3 font-semibold">Client Name</th>
                  <th className="p-3 font-semibold">Weekly Hours</th>
                  <th className="p-3 font-semibold">Hourly Rate ($/hr)</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text-primary">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-card-hover/20">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Client name"
                        value={c.name}
                        onChange={(ev) => handleFieldChange(c.id, "name", ev.target.value)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[120px]">
                      <input
                        type="number"
                        min="0"
                        value={c.hoursPerWeek}
                        onChange={(ev) => handleFieldChange(c.id, "hoursPerWeek", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[120px]">
                      <input
                        type="number"
                        min="0"
                        value={c.hourlyRate}
                        onChange={(ev) => handleFieldChange(c.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveClient(c.id)}
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
            {clients.map((c, idx) => (
              <div key={c.id} className="p-4 border border-border rounded-lg bg-bg-surface space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-xs font-semibold text-text-muted">Client {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveClient(c.id)}
                    className="text-xs text-accent-utility-e hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Client name"
                    value={c.name}
                    onChange={(ev) => handleFieldChange(c.id, "name", ev.target.value)}
                    className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                    style={{ "--local-accent": groupAccent } as React.CSSProperties}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Hours / Wk</span>
                      <input
                        type="number"
                        min="0"
                        value={c.hoursPerWeek}
                        onChange={(ev) => handleFieldChange(c.id, "hoursPerWeek", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Hourly ($)</span>
                      <input
                        type="number"
                        min="0"
                        value={c.hourlyRate}
                        onChange={(ev) => handleFieldChange(c.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {clients.length < 10 && (
            <button
              type="button"
              onClick={handleAddClient}
              className="w-full h-11 border border-dashed border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              + Add Client
            </button>
          )}
        </div>

      </div>
    </CalculatorCard>
  );
}
