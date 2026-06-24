"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateSubscriptionRenewal, SubscriptionEntry, SubscriptionRenewalResult } from "@/lib/tools/calculations";

interface SubscriptionRenewalScheduleInputsProps {
  groupAccent: string;
}

export default function SubscriptionRenewalScheduleInputs({ groupAccent }: SubscriptionRenewalScheduleInputsProps) {
  const [subs, setSubs] = useState<SubscriptionEntry[]>([
    { name: "Google Workspace", startDate: "2025-01-01", billingCycle: "monthly", amount: 14.40, currency: "USD", autoRenews: true },
    { name: "AWS Cloud Infrastructure", startDate: "2025-02-15", billingCycle: "monthly", amount: 240.00, currency: "USD", autoRenews: true },
    { name: "GitHub Copilot Team", startDate: "2025-03-10", billingCycle: "monthly", amount: 57.00, currency: "USD", autoRenews: true },
    { name: "Adobe Creative Cloud", startDate: "2025-01-10", billingCycle: "annual", amount: 659.88, currency: "USD", autoRenews: true },
    { name: "Zoom Pro Sync", startDate: "2025-06-01", billingCycle: "quarterly", amount: 45.00, currency: "USD", autoRenews: true }
  ]);

  const [newName, setNewName] = useState("");
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);
  const [newCycle, setNewCycle] = useState<"monthly" | "quarterly" | "biannual" | "annual">("monthly");
  const [newAmount, setNewAmount] = useState(15);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<SubscriptionRenewalResult>({
    subscriptions: [],
    totalMonthlyEstimate: 0,
    totalAnnualEstimate: 0,
    nextRenewal: null,
  });

  useEffect(() => {
    setNewStartDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const calc = calculateSubscriptionRenewal(subs);
    setResult(calc);
  }, [subs]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddSubscription = () => {
    if (!newName.trim() || !newStartDate) return;
    setSubs([
      ...subs,
      {
        name: newName.trim(),
        startDate: formatDateToYYYYMMDD(newStartDate),
        billingCycle: newCycle,
        amount: Number(newAmount) || 0,
        currency: "USD",
        autoRenews: true,
      }
    ]);
    setNewName("");
    setNewStartDate(new Date());
    setNewAmount(15);
  };

  const handleRemoveSub = (idx: number) => {
    setSubs(subs.filter((_, i) => i !== idx));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const getCopyText = () => {
    return `Monthly Recurring cost: ${formatCurrency(result.totalMonthlyEstimate)}. Annual cost: ${formatCurrency(result.totalAnnualEstimate)}. Next renewal: ${result.nextRenewal ? `${result.nextRenewal.name} (${formatCurrency(result.nextRenewal.amount)})` : "None"}.`;
  };

  const getBreakdownRows = () => {
    return [
      `Total Annual Expense: ${formatCurrency(result.totalAnnualEstimate)}`,
      result.nextRenewal 
        ? `Upcoming Renewal: ${result.nextRenewal.name} (${formatCurrency(result.nextRenewal.amount)})`
        : "No upcoming renewals found"
    ];
  };

  const urgencyBadge = (level: 'upcoming' | 'soon' | 'imminent') => {
    const colors = {
      imminent: "bg-red-500/10 text-red-500 border-red-500/20",
      soon: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      upcoming: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    };
    return (
      <span className={`text-[10px] uppercase font-bold border px-1.5 py-0.5 rounded tracking-wide ${colors[level]}`}>
        {level}
      </span>
    );
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalMonthlyEstimate)}
      resultUnit="ESTIMATED MONTHLY COST"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Subscriptions List Table */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Tracked SaaS & Subscriptions
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {subs.map((s, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between gap-2 bg-bg-surface border border-border p-3 rounded-md text-xs animate-in fade-in duration-200"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-sans font-bold text-text-primary block truncate">{s.name}</span>
                  <span className="text-[10px] text-text-muted font-sans uppercase">
                    Started {s.startDate} • {s.billingCycle}
                  </span>
                </div>
                <div className="text-right flex items-center gap-4">
                  <span className="font-mono font-semibold text-text-primary">
                    {formatCurrency(s.amount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSub(idx)}
                    className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                    title="Remove subscription"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {subs.length === 0 && (
              <div className="text-center py-6 text-text-muted font-sans text-sm italic">
                No active subscriptions added.
              </div>
            )}
          </div>

          {/* Form to add subscription */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="e.g. Photoshop CC"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <DatePicker
              id="new-sub-start"
              value={newStartDate}
              onChange={setNewStartDate}
              accentColor={groupAccent}
            />
            <div className="flex gap-2">
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Amount"
                value={newAmount || ""}
                onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md w-full"
              />
              <ToolSelect
                value={newCycle}
                onChange={(val) => setNewCycle(val as any)}
                options={[
                  { value: "monthly", label: "Monthly" },
                  { value: "quarterly", label: "Quarterly" },
                  { value: "biannual", label: "Biannual" },
                  { value: "annual", label: "Annual" }
                ]}
              />
            </div>
            <button
              type="button"
              onClick={handleAddSubscription}
              disabled={!newName.trim() || !newStartDate}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Sub
            </button>
          </div>
        </div>

        {/* Chronological Renewal Timeline */}
        {result.subscriptions.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Upcoming Renewal Schedule
            </h3>
            
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {result.subscriptions.map((s, idx) => (
                <div 
                  key={idx} 
                  className="bg-bg-surface border border-border p-3 rounded-md flex justify-between items-center text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-semibold text-text-primary">{s.name}</span>
                      {urgencyBadge(s.urgencyLevel)}
                    </div>
                    <div className="font-sans text-text-muted text-[11px]">
                      Renews on <span className="text-text-primary font-medium">{s.nextRenewalFormatted}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-text-primary font-bold block">
                      {formatCurrency(s.amount)}
                    </span>
                    <span className="font-sans text-[10px] text-text-faint block">
                      in {s.daysUntilRenewal} days
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </CalculatorCard>
  );
}
