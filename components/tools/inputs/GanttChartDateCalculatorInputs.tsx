"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle, ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateGanttDates, GanttTask, GanttResult } from "@/lib/tools/calculations";

interface GanttChartDateCalculatorInputsProps {
  groupAccent: string;
}

export default function GanttChartDateCalculatorInputs({ groupAccent }: GanttChartDateCalculatorInputsProps) {
  const [projectStart, setProjectStart] = useState<Date | undefined>(undefined);
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [tasks, setTasks] = useState<GanttTask[]>([
    { id: "t1", name: "Requirements Gathering", durationDays: 5, dependsOnId: null, lagDays: 0 },
    { id: "t2", name: "System Design & Architecture", durationDays: 8, dependsOnId: "t1", lagDays: 0 },
    { id: "t3", name: "Backend Development", durationDays: 14, dependsOnId: "t2", lagDays: 0 },
    { id: "t4", name: "Frontend Development", durationDays: 12, dependsOnId: "t2", lagDays: 2 },
    { id: "t5", name: "QA & Integration Testing", durationDays: 7, dependsOnId: "t3", lagDays: 0 }
  ]);

  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState(5);
  const [newDependsOn, setNewDependsOn] = useState("none");
  const [newLag, setNewLag] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<GanttResult>({
    tasks: [],
    projectEndDate: new Date(),
    projectEndFormatted: "",
    totalDuration: 0,
    criticalPathLength: 0,
    isValid: false,
  });

  useEffect(() => {
    setProjectStart(new Date());
  }, []);

  const isDateInvalid = (date: Date | undefined) => {
    if (!date) return false;
    const year = date.getFullYear();
    return isNaN(year) || year < 1000 || year > 9999;
  };

  const isStartInvalid = isDateInvalid(projectStart);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!projectStart) {
      setResult({
        tasks: [],
        projectEndDate: new Date(),
        projectEndFormatted: "",
        totalDuration: 0,
        criticalPathLength: 0,
        isValid: false,
        errorMessage: "Please select a project start date",
      });
      return;
    }

    if (isStartInvalid) {
      setResult({
        tasks: [],
        projectEndDate: new Date(),
        projectEndFormatted: "",
        totalDuration: 0,
        criticalPathLength: 0,
        isValid: false,
        errorMessage: "Please enter a valid date",
      });
      return;
    }

    if (tasks.length === 0) {
      setResult({
        tasks: [],
        projectEndDate: new Date(),
        projectEndFormatted: "",
        totalDuration: 0,
        criticalPathLength: 0,
        isValid: false,
        errorMessage: "Please add at least one task",
      });
      return;
    }

    const calc = calculateGanttDates(formatDateToYYYYMMDD(projectStart), tasks, excludeWeekends);
    setResult(calc);
  }, [projectStart, tasks, excludeWeekends, isStartInvalid]);

  const handleCalculate = () => {
    if (!result.isValid) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddTask = () => {
    const tid = newId.trim() || `t${tasks.length + 1}`;
    if (tasks.some((t) => t.id === tid)) return; // ID must be unique
    if (!newName.trim()) return;

    setTasks([
      ...tasks,
      {
        id: tid,
        name: newName.trim(),
        durationDays: Number(newDuration) || 1,
        dependsOnId: newDependsOn === "none" ? null : newDependsOn,
        lagDays: Number(newLag) || 0,
      }
    ]);
    setNewId("");
    setNewName("");
    setNewDuration(5);
    setNewDependsOn("none");
    setNewLag(0);
  };

  const handleRemoveTask = (id: string) => {
    const updated = tasks
      .filter((t) => t.id !== id)
      .map((t) => (t.dependsOnId === id ? { ...t, dependsOnId: null } : t));
    setTasks(updated);
  };

  const getCopyText = () => {
    if (!result.isValid) return "";
    return `Project End Date: ${result.projectEndFormatted}. Total Duration: ${result.totalDuration} days.`;
  };

  // Generate dependencies options list
  const depOptions = [
    { value: "none", label: "No Predecessor" },
    ...tasks.map((t) => ({ value: t.id, label: `${t.id}: ${t.name}` }))
  ];

  // Calculate SVG rendering dimensions
  const chartHeight = Math.max(200, result.tasks.length * 40 + 40);
  const rowHeight = 40;
  const leftPadding = 160;

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.isValid ? result.projectEndFormatted : "—"}
      resultUnit="PROJECT FINISH DATE"
      resultBreakdown={[
        `Total project span: ${result.totalDuration} days`,
        excludeWeekends ? "Weekend days excluded from task durations" : "All calendar days included"
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      errorMessage={result.errorMessage}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Row 1: Start Date and Mode */}
        <div className="tool-inputs-grid">
          <div className="flex flex-col">
            <DatePicker
              id="project-start-date"
              label="Project Start Date"
              value={projectStart}
              onChange={setProjectStart}
              accentColor={groupAccent}
            />
            {isStartInvalid && (
              <span className="text-[13px] italic text-accent-utility-e mt-1.5 font-sans block animate-in fade-in duration-200">
                Please enter a valid date
              </span>
            )}
          </div>

          <div className="flex flex-col justify-end">
            <span className="tool-input-label block mb-1">
              Workdays Mode
            </span>
            <PillToggle
              value={excludeWeekends ? "true" : "false"}
              onChange={(val) => setExcludeWeekends(val === "true")}
              options={[
                { value: "true", label: "Exclude Weekends" },
                { value: "false", label: "All Calendar Days" }
              ]}
              accentColor={groupAccent}
            />
          </div>
        </div>

        {/* Task Management Panel */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            Manage Tasks
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {tasks.map((t, idx) => (
              <div 
                key={t.id} 
                className="flex flex-wrap items-center gap-2 bg-bg-surface border border-border p-2 rounded-md animate-in fade-in duration-200 text-xs"
              >
                <span className="font-mono text-text-faint font-semibold w-8 text-center">{t.id}</span>
                <span className="font-sans font-medium text-text-primary flex-1 min-w-[120px]">{t.name}</span>
                <span className="text-text-muted w-14 font-mono">{t.durationDays}d</span>
                <span className="text-text-muted w-32 truncate">
                  {t.dependsOnId ? `After ${t.dependsOnId}` : "Immediate"}
                  {t.lagDays > 0 ? ` (+${t.lagDays}d lag)` : ""}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveTask(t.id)}
                  className="text-accent-utility-e hover:bg-bg-card p-1 rounded transition-colors text-sm"
                  title="Remove task"
                >
                  ✕
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-6 text-text-muted font-sans text-sm italic">
                No tasks. Add tasks below.
              </div>
            )}
          </div>

          {/* Form to add task */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="Task ID (e.g. t1)"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <input
              type="text"
              placeholder="Task Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <input
              type="number"
              min="1"
              placeholder="Duration"
              value={newDuration || ""}
              onChange={(e) => setNewDuration(parseInt(e.target.value, 10) || 0)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <ToolSelect
              value={newDependsOn}
              onChange={setNewDependsOn}
              options={depOptions}
              placeholder="Predecessor"
            />
            <button
              type="button"
              onClick={handleAddTask}
              disabled={!newName.trim()}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Task
            </button>
          </div>
        </div>

        {/* Premium SVG-Based Horizontal Bar Chart */}
        {result.isValid && result.tasks.length > 0 && projectStart && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4 overflow-hidden">
            <h4 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Gantt Chart Timeline
            </h4>
            
            <div className="overflow-x-auto">
              <div className="min-w-[600px] relative">
                <svg width="100%" height={chartHeight} className="overflow-visible font-sans text-[10px] text-text-muted">
                  {/* Grid Lines */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const xPct = `${leftPadding + (i * (100 - (leftPadding / 6))) / 5}%`;
                    const dayLabel = Math.round((result.totalDuration * i) / 5);
                    return (
                      <g key={i}>
                        <line 
                          x1={xPct} 
                          y1={25} 
                          x2={xPct} 
                          y2={chartHeight - 15} 
                          stroke="rgba(255,255,255,0.06)" 
                          strokeDasharray="4 2" 
                        />
                        <text x={xPct} y={15} textAnchor="middle" fill="currentColor">
                          Day {dayLabel}
                        </text>
                      </g>
                    );
                  })}

                  {/* Task Rows */}
                  {result.tasks.map((task: any, index: number) => {
                    // Percentage offset calculations
                    const totalSecs = result.projectEndDate.getTime() - projectStart.getTime();
                    const startSecs = task.startDate.getTime() - projectStart.getTime();
                    const endSecs = task.endDate.getTime() - projectStart.getTime();

                    const startRatio = totalSecs > 0 ? startSecs / totalSecs : 0;
                    const widthRatio = totalSecs > 0 ? (endSecs - startSecs) / totalSecs : 0;

                    const widthPct = `${widthRatio * (100 - (leftPadding / 6))}%`;
                    const leftPct = `${leftPadding + startRatio * (100 - (leftPadding / 6))}%`;
                    const y = 30 + index * rowHeight;

                    return (
                      <g key={task.id} className="group/gantt">
                        {/* Task label */}
                        <text 
                          x={10} 
                          y={y + 15} 
                          fill="currentColor" 
                          className="font-medium text-text-primary text-[11px]"
                        >
                          {task.id}: {task.name.length > 20 ? task.name.slice(0, 18) + "..." : task.name}
                        </text>

                        {/* Background row bar hover helper */}
                        <rect 
                          x={0} 
                          y={y - 5} 
                          width="100%" 
                          height={rowHeight} 
                          fill="transparent" 
                          className="group-hover/gantt:fill-[rgba(255,255,255,0.02)] transition-colors" 
                        />

                        {/* Task Schedule Bar */}
                        <rect
                          x={leftPct}
                          y={y}
                          width={widthPct}
                          height={20}
                          rx={4}
                          fill={groupAccent}
                          opacity={0.85}
                          className="hover:opacity-100 transition-opacity"
                        />

                        {/* Hover utility text inside bar (shows date range) */}
                        <title>
                          {task.name} ({task.durationDays}d)
                          &#10;Start: {task.startDateFormatted}
                          &#10;End: {task.endDateFormatted}
                        </title>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorCard>
  );
}
