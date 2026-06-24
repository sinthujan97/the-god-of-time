"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateFreelanceCapacity } from "@/lib/tools/calculations";

interface FreelanceCapacityInputsProps {
  groupAccent: string;
}

export default function FreelanceCapacityInputs({ groupAccent }: FreelanceCapacityInputsProps) {
  const [targetRevenue, setTargetRevenue] = useState<number>(5000);
  const [hourlyRate, setHourlyRate] = useState<number>(75);
  const [availableHours, setAvailableHours] = useState<number>(8);
  const [workDays, setWorkDays] = useState<number>(5);
  const [adminPercent, setAdminPercent] = useState<number>(20);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    billableHoursNeeded: 0,
    totalHoursNeeded: 0,
    daysNeeded: 0,
    weeksNeeded: 0,
    maxMonthlyRevenue: 0,
    utilizationRate: 0,
    isAchievable: false,
  });

  useEffect(() => {
    const res = calculateFreelanceCapacity(
      targetRevenue,
      hourlyRate,
      availableHours,
      workDays,
      adminPercent
    );
    setResult(res);
  }, [targetRevenue, hourlyRate, availableHours, workDays, adminPercent]);

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
    const statusText = result.isAchievable 
      ? "Achievable under current schedule" 
      : "Not achievable: exceeds available hours limit!";
    
    return [
      `Total Hours Needed (with admin): ${result.totalHoursNeeded.toFixed(1)} hrs/month`,
      `Days Needed: ${result.daysNeeded.toFixed(1)} days/month`,
      `Weeks Needed: ${result.weeksNeeded.toFixed(1)} weeks/month`,
      `Capacity Utilization: ${result.utilizationRate.toFixed(1)}%`,
      `Max Monthly Revenue Potential: ${formatCurrency(result.maxMonthlyRevenue)}`,
      `Status: ${statusText}`,
    ];
  };

  const getCopyText = () => {
    return `Target: ${formatCurrency(targetRevenue)} needs ${result.billableHoursNeeded} billable hours (${result.totalHoursNeeded.toFixed(1)} total hours) at ${result.utilizationRate.toFixed(1)}% capacity.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.billableHoursNeeded.toFixed(1)} hrs`}
      resultUnit="BILLABLE HOURS NEEDED / MONTH"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={!result.isAchievable ? "Warning: Your income goal exceeds your available work capacity. Consider raising rates or adding hours." : undefined}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="target-rev">
              Target Monthly Revenue ($)
            </label>
            <input
              id="target-rev"
              type="number"
              min="0"
              step="100"
              value={isNaN(targetRevenue) ? "" : targetRevenue}
              onChange={(e) => setTargetRevenue(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="hourly-rate">
              Hourly Billing Rate ($)
            </label>
            <input
              id="hourly-rate"
              type="number"
              min="0"
              step="1"
              value={isNaN(hourlyRate) ? "" : hourlyRate}
              onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Capacity bounds */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted" htmlFor="hours-day">
              Max Hours / Day
            </label>
            <input
              id="hours-day"
              type="number"
              min="0"
              max="24"
              value={isNaN(availableHours) ? "" : availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted" htmlFor="work-days">
              Days / Week
            </label>
            <input
              id="work-days"
              type="number"
              min="0"
              max="7"
              value={isNaN(workDays) ? "" : workDays}
              onChange={(e) => setWorkDays(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted" htmlFor="admin-percent">
              Admin Overhead (%)
            </label>
            <input
              id="admin-percent"
              type="number"
              min="0"
              max="99"
              value={isNaN(adminPercent) ? "" : adminPercent}
              onChange={(e) => setAdminPercent(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
