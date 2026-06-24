"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { calculateLaborCost, LaborEmployee } from "@/lib/tools/calculations";

interface LaborCostInputsProps {
  groupAccent: string;
}

interface ReactEmployee {
  id: string;
  name: string;
  hourlyRate: number;
  hoursWorked: number;
  overheadMultiplier: number;
}

export default function LaborCostInputs({ groupAccent }: LaborCostInputsProps) {
  const [employees, setEmployees] = useState<ReactEmployee[]>([
    { id: "1", name: "Alice Smith", hourlyRate: 40, hoursWorked: 40, overheadMultiplier: 1.25 },
    { id: "2", name: "Bob Johnson", hourlyRate: 30, hoursWorked: 35, overheadMultiplier: 1.2 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    perEmployee: [] as any[],
    totalLaborCost: 0,
    totalWithOverhead: 0,
    averageCostPerHour: 0,
  });

  useEffect(() => {
    const formatted: LaborEmployee[] = employees.map((e) => ({
      name: e.name,
      hourlyRate: e.hourlyRate,
      hoursWorked: e.hoursWorked,
      overheadMultiplier: e.overheadMultiplier,
    }));

    const res = calculateLaborCost(formatted);
    setResult(res);
  }, [employees]);

  const handleAddEmployee = () => {
    if (employees.length >= 10) return;
    const newId = String(Date.now() + Math.random());
    setEmployees([...employees, { id: newId, name: "", hourlyRate: 25, hoursWorked: 40, overheadMultiplier: 1.25 }]);
  };

  const handleRemoveEmployee = (id: string) => {
    if (employees.length === 1) {
      setEmployees([{ id: "1", name: "", hourlyRate: 25, hoursWorked: 40, overheadMultiplier: 1.25 }]);
      return;
    }
    setEmployees(employees.filter((e) => e.id !== id));
  };

  const handleFieldChange = (id: string, field: keyof ReactEmployee, value: any) => {
    setEmployees(
      employees.map((e) => (e.id === id ? { ...e, [field]: value } : e))
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
      `Base Wages (no burden): ${formatCurrency(result.totalLaborCost)}`,
      `Average Fully-Burdened Rate: ${formatCurrency(result.averageCostPerHour)}/hr`,
    ];
    result.perEmployee.forEach((pe) => {
      rows.push(`${pe.name || "Employee"}: Wages: ${formatCurrency(pe.laborCost)} | Burdened: ${formatCurrency(pe.totalCostWithOverhead)} (Effective: ${formatCurrency(pe.effectiveRate)}/hr)`);
    });
    return rows;
  };

  const getCopyText = () => {
    return `Total burdened labor cost: ${formatCurrency(result.totalWithOverhead)} (Base wages: ${formatCurrency(result.totalLaborCost)}, average rate: ${formatCurrency(result.averageCostPerHour)}/hr)`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.totalWithOverhead)}
      resultUnit="FULLY-BURDENED LABOR COST"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        <div className="space-y-4">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Employee Labor Roster (max 10)
          </span>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border border-border rounded-lg bg-bg-surface">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/80 text-text-muted uppercase tracking-wider text-[10px]">
                  <th className="p-3 font-semibold">Employee Name</th>
                  <th className="p-3 font-semibold">Hourly Rate ($/hr)</th>
                  <th className="p-3 font-semibold">Hours Worked</th>
                  <th className="p-3 font-semibold">Burden Multiplier</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-text-primary">
                {employees.map((e) => (
                  <tr key={e.id} className="hover:bg-bg-card-hover/20">
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="Employee name"
                        value={e.name}
                        onChange={(ev) => handleFieldChange(e.id, "name", ev.target.value)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[100px]">
                      <input
                        type="number"
                        min="0"
                        value={e.hourlyRate}
                        onChange={(ev) => handleFieldChange(e.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[100px]">
                      <input
                        type="number"
                        min="0"
                        value={e.hoursWorked}
                        onChange={(ev) => handleFieldChange(e.id, "hoursWorked", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 w-[120px]">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={e.overheadMultiplier}
                        onChange={(ev) => handleFieldChange(e.id, "overheadMultiplier", parseFloat(ev.target.value) || 1.0)}
                        className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveEmployee(e.id)}
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
            {employees.map((e, idx) => (
              <div key={e.id} className="p-4 border border-border rounded-lg bg-bg-surface space-y-3">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                  <span className="text-xs font-semibold text-text-muted">Employee {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveEmployee(e.id)}
                    className="text-xs text-accent-utility-e hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Employee name"
                    value={e.name}
                    onChange={(ev) => handleFieldChange(e.id, "name", ev.target.value)}
                    className="h-10 px-3 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 w-full text-text-primary"
                    style={{ "--local-accent": groupAccent } as React.CSSProperties}
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Hourly ($)</span>
                      <input
                        type="number"
                        min="0"
                        value={e.hourlyRate}
                        onChange={(ev) => handleFieldChange(e.id, "hourlyRate", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Hours</span>
                      <input
                        type="number"
                        min="0"
                        value={e.hoursWorked}
                        onChange={(ev) => handleFieldChange(e.id, "hoursWorked", parseFloat(ev.target.value) || 0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans font-medium uppercase text-text-muted mb-1 block">Burden Multi</span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={e.overheadMultiplier}
                        onChange={(ev) => handleFieldChange(e.id, "overheadMultiplier", parseFloat(ev.target.value) || 1.0)}
                        className="h-10 px-2 bg-bg-card border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-full"
                        style={{ "--local-accent": groupAccent } as React.CSSProperties}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {employees.length < 10 && (
            <button
              type="button"
              onClick={handleAddEmployee}
              className="w-full h-11 border border-dashed border-border hover:border-text-faint rounded-md font-sans text-xs text-text-muted hover:text-text-primary cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              + Add Employee
            </button>
          )}
        </div>

      </div>
    </CalculatorCard>
  );
}
