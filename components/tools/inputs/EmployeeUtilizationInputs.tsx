"use client";

import React, { useState } from "react";
import CalculatorCard from "../CalculatorCard";

interface Employee {
  name: string;
  billableHours: number;
  availableHours: number;
  rate: number;
}

interface EmployeeUtilizationInputsProps {
  groupAccent: string;
}

export default function EmployeeUtilizationInputs({ groupAccent }: EmployeeUtilizationInputsProps) {
  const [employees, setEmployees] = useState<Employee[]>([
    { name: "Employee 1", billableHours: 128, availableHours: 160, rate: 75 },
    { name: "Employee 2", billableHours: 100, availableHours: 160, rate: 100 },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const calcUtil = (billable: number, available: number) =>
    available > 0 ? (billable / available) * 100 : 0;

  const totalBillable = employees.reduce((sum, e) => sum + (e.billableHours || 0), 0);
  const totalAvailable = employees.reduce((sum, e) => sum + (e.availableHours || 0), 0);
  const teamUtilization = calcUtil(totalBillable, totalAvailable);
  const totalRevenue = employees.reduce((sum, e) => sum + (e.billableHours || 0) * (e.rate || 0), 0);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const addEmployee = () => {
    setEmployees([
      ...employees,
      { name: `Employee ${employees.length + 1}`, billableHours: 120, availableHours: 160, rate: 75 },
    ]);
  };

  const removeEmployee = (idx: number) => {
    if (employees.length > 1) setEmployees(employees.filter((_, i) => i !== idx));
  };

  const update = (idx: number, field: keyof Employee, raw: string) => {
    setEmployees(
      employees.map((e, i) => {
        if (i !== idx) return e;
        if (field === "name") return { ...e, name: raw };
        const num = parseFloat(raw);
        return { ...e, [field]: isNaN(num) ? 0 : num };
      })
    );
  };

  const getBreakdownRows = () =>
    employees.map((e) => {
      const util = calcUtil(e.billableHours, e.availableHours);
      const rev = (e.billableHours || 0) * (e.rate || 0);
      return `${e.name || "—"}: ${util.toFixed(1)}% util — $${rev.toLocaleString()} revenue`;
    });

  const getCopyText = () =>
    `Team Utilization: ${teamUtilization.toFixed(1)}% | Revenue: $${totalRevenue.toLocaleString()} | ${totalBillable}h billable of ${totalAvailable}h available`;

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${teamUtilization.toFixed(1)}%`}
      resultUnit="TEAM UTILIZATION"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-4" style={{ "--group-accent": groupAccent } as React.CSSProperties}>

        <div className="space-y-3">
          {employees.map((emp, idx) => (
            <div
              key={idx}
              className="grid grid-cols-2 gap-2 p-3 bg-bg-surface border border-border rounded-lg"
            >
              {/* Name row */}
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Employee name"
                  value={emp.name}
                  onChange={(e) => update(idx, "name", e.target.value)}
                  className="flex-1 h-8 px-2 bg-transparent border border-border rounded font-sans text-xs text-text-primary focus:outline-none focus:ring-1"
                  style={{ "--local-accent": groupAccent } as React.CSSProperties}
                />
                {employees.length > 1 && (
                  <button
                    onClick={() => removeEmployee(idx)}
                    className="text-text-faint hover:text-red-400 text-xs px-1.5 py-1 rounded transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Billable Hours */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Billable Hours
                </label>
                <input
                  type="number"
                  min="0"
                  value={emp.billableHours === 0 ? "" : emp.billableHours}
                  onChange={(e) => update(idx, "billableHours", e.target.value)}
                  className="h-8 px-2 bg-bg-surface border border-border rounded font-sans text-xs text-text-primary focus:outline-none focus:ring-1"
                  style={{ "--local-accent": groupAccent } as React.CSSProperties}
                />
              </div>

              {/* Available Hours */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Available Hours
                </label>
                <input
                  type="number"
                  min="1"
                  value={emp.availableHours === 0 ? "" : emp.availableHours}
                  onChange={(e) => update(idx, "availableHours", e.target.value)}
                  className="h-8 px-2 bg-bg-surface border border-border rounded font-sans text-xs text-text-primary focus:outline-none focus:ring-1"
                  style={{ "--local-accent": groupAccent } as React.CSSProperties}
                />
              </div>

              {/* Hourly Rate */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Hourly Rate ($)
                </label>
                <input
                  type="number"
                  min="0"
                  value={emp.rate === 0 ? "" : emp.rate}
                  onChange={(e) => update(idx, "rate", e.target.value)}
                  className="h-8 px-2 bg-bg-surface border border-border rounded font-sans text-xs text-text-primary focus:outline-none focus:ring-1"
                  style={{ "--local-accent": groupAccent } as React.CSSProperties}
                />
              </div>

              {/* Utilization readout */}
              <div className="flex flex-col space-y-1">
                <label className="font-sans text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                  Utilization
                </label>
                <div
                  className="h-8 px-2 bg-bg-card border border-border rounded font-mono text-xs flex items-center font-bold"
                  style={{ color: groupAccent }}
                >
                  {calcUtil(emp.billableHours, emp.availableHours).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addEmployee}
          className="w-full h-8 border border-dashed border-border rounded text-xs font-sans text-text-muted hover:border-text-muted hover:text-text-primary transition-colors"
        >
          + Add Employee
        </button>

        <div className="pt-2 border-t border-border flex justify-between items-center text-xs font-mono">
          <span className="text-text-muted">Total Billable Revenue</span>
          <span className="font-bold text-text-primary">${totalRevenue.toLocaleString()}</span>
        </div>

      </div>
    </CalculatorCard>
  );
}
