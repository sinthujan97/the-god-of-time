"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateBillableHours, BillableEntry } from "@/lib/tools/calculations";
import { DatePicker } from "@/components/ui";

interface BillableHoursInputsProps {
  groupAccent: string;
}

interface ReactBillable {
  id: string;
  client: string;
  projectDescription: string;
  date: Date | undefined;
  startTime: string;
  endTime: string;
  hourlyRate: number;
}

export default function BillableHoursInputs({ groupAccent }: BillableHoursInputsProps) {
  const [entries, setEntries] = useState<ReactBillable[]>([
    { id: "1", client: "Acme Corp", projectDescription: "UI Design", date: undefined, startTime: "09:00", endTime: "12:00", hourlyRate: 75 },
    { id: "2", client: "Stark Industries", projectDescription: "Code Review", date: undefined, startTime: "13:00", endTime: "17:00", hourlyRate: 100 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    byClient: [] as any[],
    totalHours: 0,
    totalValue: 0,
    averageRatePerHour: 0,
  });

  // client-side mount date fill
  useEffect(() => {
    setEntries([
      { id: "1", client: "Acme Corp", projectDescription: "UI Design", date: new Date(), startTime: "09:00", endTime: "12:00", hourlyRate: 75 },
      { id: "2", client: "Stark Industries", projectDescription: "Code Review", date: new Date(), startTime: "13:00", endTime: "17:00", hourlyRate: 100 },
    ]);
  }, []);

  useEffect(() => {
    const formatted: BillableEntry[] = entries.map((e) => {
      const year = e.date?.getFullYear() || 0;
      const month = String((e.date?.getMonth() || 0) + 1).padStart(2, "0");
      const day = String(e.date?.getDate() || 0).padStart(2, "0");
      const dateStr = e.date ? `${year}-${month}-${day}` : "";

      return {
        client: e.client,
        projectDescription: e.projectDescription,
        date: dateStr,
        startTime: e.startTime,
        endTime: e.endTime,
        hourlyRate: e.hourlyRate,
      };
    });

    const res = calculateBillableHours(formatted);
    setResult(res);
  }, [entries]);

  const handleAddEntry = () => {
    if (entries.length >= 10) return;
    const newId = String(Date.now() + Math.random());
    setEntries([
      ...entries,
      { id: newId, client: "", projectDescription: "", date: new Date(), startTime: "09:00", endTime: "17:00", hourlyRate: 50 },
    ]);
  };

  const handleRemoveEntry = (id: string) => {
    if (entries.length === 1) {
      setEntries([{ id: "1", client: "", projectDescription: "", date: undefined, startTime: "09:00", endTime: "17:00", hourlyRate: 50 }]);
      return;
    }
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof ReactBillable, value: any) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e))
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
      `Total Billable Time: ${result.totalHours.toFixed(2)} hrs`,
      `Average Rate: ${formatCurrency(result.averageRatePerHour)}/hr`,
    ];
    result.byClient.forEach((c) => {
      rows.push(`Client [${c.client}]: ${c.totalHours.toFixed(1)} hrs = ${formatCurrency(c.totalValue)}`);
    });
    return rows;
  };

  const getCopyText = () => {
    return `Total billable invoice value: ${formatCurrency(result.totalValue)} across ${result.totalHours.toFixed(2)} hours (Average: ${formatCurrency(result.averageRatePerHour)}/hr)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalValue)}
      resultUnit="TOTAL INVOICE VALUE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="space-y-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Billable Sessions Log (max 10)
          </span>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg-surface">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3 font-semibold">Client</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Times</th>
                  <th className="p-3 font-semibold">Rate ($/hr)</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text-primary">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-bg-card-hover/20">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Client name"
                        value={e.client}
                        onChange={(ev) => handleFieldChange(e.id, "client", ev.target.value)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[180px]">
                      <DatePicker
                        id={`billable-date-${e.id}`}
                        value={e.date}
                        onChange={(val) => handleFieldChange(e.id, "date", val)}
                        accentColor={groupAccent}
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-1.5 w-[160px]">
                        <input
                          type="time"
                          value={e.startTime}
                          onChange={(ev) => handleFieldChange(e.id, "startTime", ev.target.value)}
                          className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-1/2"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                        <span className="text-text-muted text-[10px]">to</span>
                        <input
                          type="time"
                          value={e.endTime}
                          onChange={(ev) => handleFieldChange(e.id, "endTime", ev.target.value)}
                          className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-1/2"
                          style={{ "--local-accent": groupAccent } as React.CSSProperties}
                        />
                      </div>
                    </td>
                    <td className="p-2 w-[90px]">
                      <input
                        type="number"
                        min="0"
                        value={e.hourlyRate}
                        onChange={(ev) => handleFieldChange(e.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveEntry(e.id)}
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
            {entries.map((e, idx) => (
              <div key={e.id} className="p-4 border border-border rounded-lg bg-bg-surface space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-xs font-semibold text-text-muted">Session {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEntry(e.id)}
                    className="text-xs text-accent-utility-e hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Client name"
                    value={e.client}
                    onChange={(ev) => handleFieldChange(e.id, "client", ev.target.value)}
                    className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                    style={{ "--local-accent": groupAccent } as React.CSSProperties}
                  />
                  <DatePicker
                    id={`m-billable-date-${e.id}`}
                    value={e.date}
                    onChange={(val) => handleFieldChange(e.id, "date", val)}
                    accentColor={groupAccent}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Start</span>
                      <input
                        type="time"
                        value={e.startTime}
                        onChange={(ev) => handleFieldChange(e.id, "startTime", ev.target.value)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">End</span>
                      <input
                        type="time"
                        value={e.endTime}
                        onChange={(ev) => handleFieldChange(e.id, "endTime", ev.target.value)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Rate ($)</span>
                      <input
                        type="number"
                        min="0"
                        value={e.hourlyRate}
                        onChange={(ev) => handleFieldChange(e.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {entries.length < 10 && (
            <button
              type="button"
              onClick={handleAddEntry}
              className="w-full h-11 border border-dashed border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              + Add Session
            </button>
          )}
        </div>

      </div>
    </CalculatorCard>
  );
}
