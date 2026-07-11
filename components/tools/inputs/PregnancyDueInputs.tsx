"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";

interface PregnancyDueInputsProps {
  groupAccent: string;
}

type MethodType = "lmp" | "conception" | "ivf3" | "ivf5" | "scan";

interface DueDateResult {
  estimatedDueDate: Date;
  dueDateFormatted: string;
  conceptionDateFormatted: string;
  currentWeek: number;
  currentDay: number;
  daysRemaining: number;
  progressPercentage: number;
  isValid: boolean;
}

// Baby Size details by week
const getBabySizeInfo = (week: number) => {
  if (week < 4) return { name: "Poppy Seed 🌱", size: "< 1 mm", weight: "< 0.01 g", fact: "Implantation is just completing. The amniotic sac and placenta are forming!" };
  if (week < 8) return { name: "Raspberry 🍓", size: "1.6 cm", weight: "1 g", fact: "The heart has begun beating and tiny buds that will become limbs are growing." };
  if (week < 12) return { name: "Lime 🍋", size: "5.4 cm", weight: "14 g", fact: "Vocal cords are forming and baby is starting to wiggle and kick (though you can't feel it yet)." };
  if (week < 16) return { name: "Peach 🍑", size: "11.6 cm", weight: "100 g", fact: "Fine lanugo hair is covering the body, and the skeletal system continues to harden." };
  if (week < 20) return { name: "Avocado 🥑", size: "16.4 cm", weight: "300 g", fact: "Baby can now swallow amniotic fluid and the ears are fully developed to hear your voice!" };
  if (week < 24) return { name: "Banana 🍌", size: "30 cm", weight: "600 g", fact: "The lungs are starting to produce surfactant, and baby is sleeping and waking on a regular cycle." };
  if (week < 28) return { name: "Cantaloupe 🍈", size: "37 cm", weight: "1.0 kg", fact: "Eyes are beginning to open and blink, and brain wave activity is starting to show sleep patterns." };
  if (week < 32) return { name: "Eggplant 🍆", size: "42 cm", weight: "1.7 kg", fact: "Baby's taste buds are developed, and the skin is becoming smoother as fat accumulates." };
  if (week < 36) return { name: "Squash 🥬", size: "47 cm", weight: "2.6 kg", fact: "The immune system is developing, and baby is starting to turn head-down to prepare for birth." };
  return { name: "Watermelon 🍉", size: "51 cm", weight: "3.5 kg", fact: "Baby is fully term and ready to meet you! Spontaneous labor is safe at any time now." };
};

// Milestone list calculator
const getMilestones = (edd: Date) => {
  const start = new Date(edd);
  start.setDate(edd.getDate() - 280);

  const addWeeks = (w: number) => {
    const d = new Date(start);
    d.setDate(start.getDate() + w * 7);
    return d;
  };

  const formatDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
  };

  const milestonesList = [
    { title: "Implantation", desc: "First positive home test window.", date: addWeeks(4), week: 4 },
    { title: "Heartbeat audible", desc: "Early scan detection zone.", date: addWeeks(6), week: 6 },
    { title: "First Trimester completed", desc: "Miscarriage risk drops 95%.", date: addWeeks(13), week: 13 },
    { title: "First Kicks (Quickening)", desc: "Active movement felt by mother.", date: addWeeks(18), week: 18 },
    { title: "Halfway point (20 Weeks)", desc: "Mid-pregnancy anatomy scan window.", date: addWeeks(20), week: 20 },
    { title: "Viability Milestone", desc: "Survival outside womb is possible.", date: addWeeks(24), week: 24 },
    { title: "Second Trimester completed", desc: "Third trimester start line.", date: addWeeks(27), week: 27 },
    { title: "Early Term Boundary", desc: "Lungs near full maturation.", date: addWeeks(37), week: 37 },
    { title: "Estimated Due Date", desc: "Delivery target day!", date: edd, week: 40 },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return milestonesList.map((m) => {
    const daysDiff = Math.round((m.date.getTime() - today.getTime()) / 86400000);
    return {
      ...m,
      dateFormatted: formatDate(m.date),
      isCompleted: daysDiff <= 0,
      daysText: daysDiff === 0 ? "Today" : daysDiff > 0 ? `${daysDiff} days left` : `${Math.abs(daysDiff)} days ago`,
    };
  });
};

export default function PregnancyDueInputs({ groupAccent }: PregnancyDueInputsProps) {
  const [method, setMethod] = useState<MethodType>("lmp");
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Ultrasound dating scan parameters
  const [scanWeeks, setScanWeeks] = useState<number>(8);
  const [scanDays, setScanDays] = useState<number>(0);

  // Relatives Tracker list (persisted locally)
  const [relatives, setRelatives] = useState<{ id: string; name: string; relation: string; checkedMilestones: string[] }[]>([]);
  const [newRelName, setNewRelName] = useState("");
  const [newRelRole, setNewRelRole] = useState("Grandmother");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState<DueDateResult>({
    estimatedDueDate: new Date(),
    dueDateFormatted: "—",
    conceptionDateFormatted: "",
    currentWeek: 0,
    currentDay: 0,
    daysRemaining: 0,
    progressPercentage: 0,
    isValid: false,
  });

  useEffect(() => {
    setInputDate(new Date());
    // Load relatives list from localStorage
    try {
      const stored = localStorage.getItem("pregnancy_relatives_tracker");
      if (stored) {
        setRelatives(JSON.parse(stored));
      } else {
        setRelatives([
          { id: "1", name: "Grandma", relation: "Grandmother", checkedMilestones: ["Announced"] },
          { id: "2", name: "Dad", relation: "Partner / Father", checkedMilestones: ["Announced", "Heartbeat"] },
        ]);
      }
    } catch {}
  }, []);

  const saveRelatives = (newList: typeof relatives) => {
    setRelatives(newList);
    try {
      localStorage.setItem("pregnancy_relatives_tracker", JSON.stringify(newList));
    } catch {}
  };

  const calculateDates = (): DueDateResult => {
    let edd = new Date();
    let conception = new Date();
    let start = new Date();
    let isValid = false;

    if (method === "lmp" && inputDate) {
      const base = new Date(inputDate);
      base.setHours(0, 0, 0, 0);
      edd = new Date(base);
      edd.setDate(base.getDate() + 280 + (cycleLength - 28));
      conception = new Date(base);
      conception.setDate(base.getDate() + 14 + (cycleLength - 28));
      start = new Date(edd);
      start.setDate(edd.getDate() - 280);
      isValid = true;
    } else if (method === "conception" && inputDate) {
      const base = new Date(inputDate);
      base.setHours(0, 0, 0, 0);
      edd = new Date(base);
      edd.setDate(base.getDate() + 266);
      start = new Date(edd);
      start.setDate(edd.getDate() - 280);
      conception = new Date(base);
      isValid = true;
    } else if (method === "ivf3" && inputDate) {
      const base = new Date(inputDate);
      base.setHours(0, 0, 0, 0);
      edd = new Date(base);
      edd.setDate(base.getDate() + 263); // 266 - 3 days embryo age
      start = new Date(edd);
      start.setDate(edd.getDate() - 280);
      conception = new Date(base);
      conception.setDate(base.getDate() - 3);
      isValid = true;
    } else if (method === "ivf5" && inputDate) {
      const base = new Date(inputDate);
      base.setHours(0, 0, 0, 0);
      edd = new Date(base);
      edd.setDate(base.getDate() + 261); // 266 - 5 days embryo age
      start = new Date(edd);
      start.setDate(edd.getDate() - 280);
      conception = new Date(base);
      conception.setDate(base.getDate() - 5);
      isValid = true;
    } else if (method === "scan" && inputDate) {
      const base = new Date(inputDate);
      base.setHours(0, 0, 0, 0);
      const totalScanDays = scanWeeks * 7 + scanDays;
      start = new Date(base);
      start.setDate(base.getDate() - totalScanDays);
      edd = new Date(start);
      edd.setDate(start.getDate() + 280);
      conception = new Date(start);
      conception.setDate(start.getDate() + 14);
      isValid = true;
    }

    if (!isValid) {
      return {
        estimatedDueDate: new Date(),
        dueDateFormatted: "—",
        conceptionDateFormatted: "",
        currentWeek: 0,
        currentDay: 0,
        daysRemaining: 0,
        progressPercentage: 0,
        isValid: false,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const elapsedMs = today.getTime() - start.getTime();
    const elapsedDays = Math.max(0, Math.round(elapsedMs / 86400000));
    const totalGestationDays = 280;

    const currentWeek = Math.min(42, Math.floor(elapsedDays / 7));
    const currentDay = elapsedDays % 7;
    const daysRemaining = Math.max(0, Math.round((edd.getTime() - today.getTime()) / 86400000));
    const progressPercentage = parseFloat(Math.min(100, Math.max(0, (elapsedDays / totalGestationDays) * 100)).toFixed(1));

    const formatDate = (d: Date) => {
      return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(d);
    };

    return {
      estimatedDueDate: edd,
      dueDateFormatted: formatDate(edd),
      conceptionDateFormatted: formatDate(conception),
      currentWeek,
      currentDay,
      daysRemaining,
      progressPercentage,
      isValid: true,
    };
  };

  useEffect(() => {
    const res = calculateDates();
    setResult(res);
  }, [inputDate, method, cycleLength, scanWeeks, scanDays]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    if (!result.isValid) return ["Select parameters to view details"];
    return [
      `Conception Date: ${result.conceptionDateFormatted || "—"}`,
      `${result.daysRemaining} Days remaining to estimated delivery`,
    ];
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Estimated Due Date: ${result.dueDateFormatted}. Gestational Age: ${result.currentWeek} Weeks, ${result.currentDay} Days. Size: ${getBabySizeInfo(result.currentWeek).name}. Days Left: ${result.daysRemaining}.`;
  };

  // Pre-configured relative update text template
  const getRelativeShareText = (relationName: string) => {
    if (!result.isValid) return "";
    const size = getBabySizeInfo(result.currentWeek);
    return `Hi ${relationName}! Quick pregnancy update ✨ We are at Week ${result.currentWeek} and ${result.currentDay} Days. Baby is now the size of a ${size.name} (${size.size}, ${size.weight}). Estimated due date is ${result.dueDateFormatted} — only ${result.daysRemaining} days left! 🍼❤️`;
  };

  const handleAddRelative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelName.trim()) return;
    const item = {
      id: Date.now().toString(),
      name: newRelName,
      relation: newRelRole,
      checkedMilestones: ["Announced"],
    };
    saveRelatives([...relatives, item]);
    setNewRelName("");
  };

  const handleDeleteRelative = (id: string) => {
    saveRelatives(relatives.filter((r) => r.id !== id));
  };

  const toggleRelativeMilestone = (relId: string, milestone: string) => {
    const updated = relatives.map((r) => {
      if (r.id === relId) {
        const index = r.checkedMilestones.indexOf(milestone);
        const newChecked = [...r.checkedMilestones];
        if (index > -1) {
          newChecked.splice(index, 1);
        } else {
          newChecked.push(milestone);
        }
        return { ...r, checkedMilestones: newChecked };
      }
      return r;
    });
    saveRelatives(updated);
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.dueDateFormatted : "—"}
      resultUnit="ESTIMATED DUE DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Method Picker Tab strip */}
        <div className="flex flex-col gap-1.5">
          <span className="tool-input-label block">Dating Method</span>
          <div className="flex flex-wrap gap-1.5 p-1 bg-bg-surface border border-border rounded-lg">
            {[
              { id: "lmp", label: "Period (LMP)" },
              { id: "conception", label: "Conception" },
              { id: "ivf3", label: "IVF 3-Day" },
              { id: "ivf5", label: "IVF 5-Day" },
              { id: "scan", label: "Dating Scan" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id as any)}
                style={{
                  flex: "1 1 auto",
                  padding: "6px 12px",
                  fontSize: 11,
                  fontFamily: "var(--font-ui)",
                  fontWeight: 600,
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  background: method === m.id ? groupAccent : "transparent",
                  color: method === m.id ? "#000000" : "var(--text-muted)",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Inputs grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <DatePicker
              id="input-date"
              label={
                method === "lmp"
                  ? "First Day of Last Period"
                  : method === "conception"
                  ? "Conception Date"
                  : method === "scan"
                  ? "Date of Ultrasound Scan"
                  : "IVF Embryo Transfer Date"
              }
              value={inputDate}
              onChange={setInputDate}
              accentColor={groupAccent}
            />
          </div>

          {method === "lmp" && (
            <div className="flex flex-col">
              <label className="tool-input-label" htmlFor="cycle-length-input">
                Average Cycle Length (Days)
              </label>
              <input
                id="cycle-length-input"
                type="number"
                min="20"
                max="45"
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value, 10))}
                className="tool-input-field w-full h-[48px] px-4 font-sans text-sm focus:outline-none focus:ring-2 bg-bg-surface border border-border rounded-md"
              />
              <span className="text-[10px] text-text-muted mt-1 font-sans">
                Adjusts ovulation window (default: 28 days).
              </span>
            </div>
          )}

          {method === "scan" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="tool-input-label" htmlFor="scan-weeks-input">
                  Scan Weeks
                </label>
                <input
                  id="scan-weeks-input"
                  type="number"
                  min="3"
                  max="35"
                  value={scanWeeks}
                  onChange={(e) => setScanWeeks(parseInt(e.target.value, 10) || 8)}
                  className="tool-input-field w-full h-[48px] px-3 font-mono text-sm focus:outline-none bg-bg-surface border border-border rounded-md text-center"
                />
              </div>
              <div className="flex flex-col">
                <label className="tool-input-label" htmlFor="scan-days-input">
                  Scan Days
                </label>
                <input
                  id="scan-days-input"
                  type="number"
                  min="0"
                  max="6"
                  value={scanDays}
                  onChange={(e) => setScanDays(parseInt(e.target.value, 10) || 0)}
                  className="tool-input-field w-full h-[48px] px-3 font-mono text-sm focus:outline-none bg-bg-surface border border-border rounded-md text-center"
                />
              </div>
            </div>
          )}
        </div>

        {/* Gestational Age Display (Visual Progress Arc/Blocks) */}
        {result.isValid && (
          <div className="pt-4 border-t border-border/40 space-y-6">
            
            {/* Core Gestational Age Stats */}
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div>
                <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                  Gestational Age
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-display italic text-4xl text-text-primary">{result.currentWeek}</span>
                  <span className="text-xs font-sans font-medium text-text-muted uppercase mr-3">Weeks</span>
                  <span className="font-display italic text-3xl text-text-primary">{result.currentDay}</span>
                  <span className="text-xs font-sans font-medium text-text-muted uppercase">Days</span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="w-[180px] text-right">
                <span className="text-xs font-mono font-bold" style={{ color: groupAccent }}>{result.progressPercentage}% Completed</span>
                <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden border border-border mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${result.progressPercentage}%`,
                      backgroundColor: groupAccent,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Trimesters block */}
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 3].map((tri) => {
                const isActive =
                  (tri === 1 && result.currentWeek < 14) ||
                  (tri === 2 && result.currentWeek >= 14 && result.currentWeek < 28) ||
                  (tri === 3 && result.currentWeek >= 28);
                const isCompleted =
                  (tri === 1 && result.currentWeek >= 14) ||
                  (tri === 2 && result.currentWeek >= 28);

                return (
                  <div
                    key={tri}
                    className="p-3 border rounded-lg flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: isActive ? groupAccent : "var(--border)",
                      backgroundColor: isActive
                        ? `color-mix(in srgb, ${groupAccent} 10%, transparent)`
                        : isCompleted
                        ? "color-mix(in srgb, var(--text-muted) 5%, transparent)"
                        : "transparent",
                    }}
                  >
                    <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-text-primary">
                      Trimester {tri}
                    </span>
                    <span
                      className="text-[8px] font-mono mt-0.5 font-bold"
                      style={{
                        color: isActive ? groupAccent : "var(--text-muted)",
                      }}
                    >
                      {isActive ? "ACTIVE" : isCompleted ? "COMPLETED" : "PENDING"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Visual Baby Size Card comparison */}
            {(() => {
              const size = getBabySizeInfo(result.currentWeek);
              return (
                <div style={{ background: "var(--bg-surface)", border: "1.5px solid var(--border)", borderRadius: 10, padding: 14, display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ fontSize: 36 }}>
                    {size.name.slice(-2)}
                  </div>
                  <div>
                    <h4 style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase", margin: 0 }}>
                      Baby Size Comparison
                    </h4>
                    <span style={{ fontSize: 14, fontFamily: "var(--font-ui)", fontWeight: 800, color: groupAccent, display: "block" }}>
                      {size.name}
                    </span>
                    <p style={{ fontSize: 11, color: "var(--text-primary)", margin: "4px 0 0", lineHeight: 1.4 }}>
                      {size.fact} <strong className="font-mono text-text-muted">({size.size} | {size.weight})</strong>
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Milestones Timeline checklist */}
            <div className="space-y-3 pt-2">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                Key Pregnancy Milestones
              </h3>
              <div style={{ borderLeft: "2px solid var(--border)", paddingLeft: 12, marginLeft: 6, display: "flex", flexDirection: "column", gap: 12 }}>
                {getMilestones(result.estimatedDueDate).map((m, idx) => (
                  <div key={idx} style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                    {/* Tick Node */}
                    <div
                      style={{
                        position: "absolute",
                        left: -19,
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: m.isCompleted ? groupAccent : "var(--bg-card)",
                        border: `2px solid ${m.isCompleted ? groupAccent : "var(--border)"}`,
                      }}
                    />
                    <div>
                      <span style={{ fontSize: 12, fontFamily: "var(--font-ui)", fontWeight: 700, color: m.isCompleted ? "var(--text-primary)" : "var(--text-muted)" }}>
                        {m.title} <span className="text-[10px] font-mono font-normal">({m.dateFormatted})</span>
                      </span>
                      <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "2px 0 0" }}>{m.desc}</p>
                    </div>
                    <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: m.isCompleted ? groupAccent : "var(--text-faint)", fontWeight: "bold" }}>
                      {m.daysText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share & Relative Tracker Container */}
            <div className="pt-6 border-t border-border/40 space-y-4">
              <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
                Relatives Tracking Dashboard
              </h3>

              {/* Add Relative Form */}
              <form onSubmit={handleAddRelative} style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <label style={{ flex: 2, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase" }}>Relative Name</span>
                  <input
                    type="text"
                    value={newRelName}
                    onChange={(e) => setNewRelName(e.target.value)}
                    placeholder="e.g. Aunt Sarah..."
                    style={{
                      height: 38,
                      width: "100%",
                      fontSize: 12,
                      fontFamily: "var(--font-ui)",
                      padding: "4px 10px",
                      background: "var(--bg-surface)",
                      border: "1.5px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text-primary)"
                    }}
                  />
                </label>
                
                <label style={{ flex: 1.5, display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-muted)", textTransform: "uppercase" }}>Relation</span>
                  <select
                    value={newRelRole}
                    onChange={(e) => setNewRelRole(e.target.value)}
                    style={{
                      height: 38,
                      width: "100%",
                      fontSize: 12,
                      fontFamily: "var(--font-ui)",
                      padding: "4px 8px",
                      background: "var(--bg-surface)",
                      border: "1.5px solid var(--border)",
                      borderRadius: 6,
                      color: "var(--text-primary)",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Grandmother">Grandmother</option>
                    <option value="Grandfather">Grandfather</option>
                    <option value="Partner / Father">Partner / Father</option>
                    <option value="Aunt">Aunt</option>
                    <option value="Uncle">Uncle</option>
                    <option value="Friend">Friend</option>
                  </select>
                </label>

                <button
                  type="submit"
                  style={{
                    height: 38,
                    padding: "0 16px",
                    background: "var(--text-primary)",
                    color: "var(--bg-base)",
                    border: "none",
                    borderRadius: 6,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  ADD +
                </button>
              </form>

              {/* Relatives List & Share Templates */}
              {relatives.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {relatives.map((rel) => (
                    <div
                      key={rel.id}
                      style={{
                        background: "var(--bg-surface)",
                        border: "1.5px solid var(--border)",
                        borderRadius: 8,
                        padding: "12px 14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <strong style={{ fontSize: 12, color: "var(--text-primary)" }}>{rel.name}</strong>
                          <span style={{ fontSize: 10, color: "var(--text-faint)", marginLeft: 6 }}>({rel.relation})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteRelative(rel.id)}
                          style={{
                            fontSize: 10,
                            fontFamily: "var(--font-mono)",
                            color: "var(--destructive)",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      {/* Milestones checklist completed with relative */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {["Announced", "Heartbeat Scan", "Gender Reveal", "Shower Invite"].map((mil) => {
                          const isChecked = rel.checkedMilestones.includes(mil);
                          return (
                            <button
                              key={mil}
                              type="button"
                              onClick={() => toggleRelativeMilestone(rel.id, mil)}
                              style={{
                                padding: "2px 8px",
                                fontSize: 9,
                                fontFamily: "var(--font-mono)",
                                borderRadius: 4,
                                border: "1px solid var(--border)",
                                cursor: "pointer",
                                background: isChecked ? groupAccent : "transparent",
                                color: isChecked ? "#000000" : "var(--text-faint)",
                                fontWeight: "bold"
                              }}
                            >
                              {mil} {isChecked ? "✓" : "+"}
                            </button>
                          );
                        })}
                      </div>

                      {/* Instant Copy Share Text Button */}
                      <div style={{ display: "flex", gap: 8, width: "100%" }}>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(getRelativeShareText(rel.name));
                            alert(`Share message copied for ${rel.name}!`);
                          }}
                          style={{
                            width: "100%",
                            padding: "6px 12px",
                            fontSize: 10,
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            border: `1px solid var(--border)`,
                            borderRadius: 4,
                            background: "var(--bg-card)",
                            color: "var(--text-primary)",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          📋 COPY UPDATE FOR {rel.name.toUpperCase()}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: 11, color: "var(--text-faint)", fontStyle: "italic", margin: 0 }}>
                  No relatives added to track yet.
                </p>
              )}

            </div>

          </div>
        )}

      </div>
    </CalculatorCard>
  );
}
