"use client";

import React, { useState, useEffect } from "react";
import { ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateCriticalPathFloat, FloatTask, CriticalPathFloatResult } from "@/lib/tools/calculations";

interface CpmCriticalPathFloatInputsProps {
  groupAccent: string;
}

export default function CpmCriticalPathFloatInputs({ groupAccent }: CpmCriticalPathFloatInputsProps) {
  const [tasks, setTasks] = useState<FloatTask[]>([
    { id: "A", name: "Design Concept", duration: 5, dependencies: [] },
    { id: "B", name: "Draft Architecture", duration: 4, dependencies: ["A"] },
    { id: "C", name: "Mockup UI Design", duration: 3, dependencies: ["A"] },
    { id: "D", name: "Develop Backend API", duration: 10, dependencies: ["B"] },
    { id: "E", name: "Develop Frontend Interface", duration: 8, dependencies: ["C"] },
    { id: "F", name: "Integration & Testing", duration: 5, dependencies: ["D", "E"] }
  ]);

  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState(5);
  const [newDependsOn, setNewDependsOn] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [result, setResult] = useState<CriticalPathFloatResult>({
    tasks: [],
    criticalPath: [],
    projectDuration: 0,
  });

  useEffect(() => {
    const calc = calculateCriticalPathFloat(tasks);
    setResult(calc);
  }, [tasks]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const handleAddTask = () => {
    const tid = newId.trim().toUpperCase();
    if (!tid) return;
    if (tasks.some((t) => t.id === tid)) return; // ID must be unique
    if (!newName.trim()) return;

    setTasks([
      ...tasks,
      {
        id: tid,
        name: newName.trim(),
        duration: Number(newDuration) || 1,
        dependencies: newDependsOn,
      }
    ]);
    setNewId("");
    setNewName("");
    setNewDuration(5);
    setNewDependsOn([]);
  };

  const handleRemoveTask = (id: string) => {
    const updated = tasks
      .filter((t) => t.id !== id)
      .map((t) => ({ ...t, dependencies: t.dependencies.filter((dep) => dep !== id) }));
    setTasks(updated);
  };

  const handleDependencyToggle = (depId: string) => {
    if (newDependsOn.includes(depId)) {
      setNewDependsOn(newDependsOn.filter((id) => id !== depId));
    } else {
      setNewDependsOn([...newDependsOn, depId]);
    }
  };

  const getCopyText = () => {
    return `Critical Path: ${result.criticalPath.join(" -> ")}. Project Duration: ${result.projectDuration} days.`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.projectDuration} days`}
      resultUnit="MINIMUM PROJECT DURATION"
      resultBreakdown={[
        `Critical Path Sequence: ${result.criticalPath.join(" → ")}`,
        `Tasks on critical path: ${result.criticalPath.length} (zero float)`,
        `Total tasks evaluated in schedule: ${result.tasks.length}`
      ]}
      copyText={getCopyText()}
      animationKey={animationKey}
      fontClass="font-sans font-semibold text-lg sm:text-xl md:text-2xl text-text-primary"
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        {/* Task Manager List */}
        <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
          <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
            CPM Task Network Configuration
          </h3>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {tasks.map((t) => (
              <div 
                key={t.id} 
                className="flex flex-wrap items-center justify-between gap-2 bg-bg-surface border border-border p-3 rounded-md text-xs animate-in fade-in duration-200"
              >
                <div className="flex-1 min-w-[120px]">
                  <div className="flex items-center gap-2">
                    <span 
                      className="font-mono font-bold text-[11px] px-1.5 py-0.5 rounded border border-border bg-bg-card"
                      style={{ color: groupAccent }}
                    >
                      ID: {t.id}
                    </span>
                    <span className="font-sans font-semibold text-text-primary">{t.name}</span>
                  </div>
                  <span className="text-[10px] text-text-faint font-mono block mt-1 uppercase">
                    Duration: {t.duration}d • Depends on: {t.dependencies.join(", ") || "None"}
                  </span>
                </div>
                
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
          </div>

          {/* Form to add task */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="ID (e.g. G)"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <input
              type="text"
              placeholder="Task Description"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <input
              type="number"
              min="1"
              placeholder="Duration Days"
              value={newDuration || ""}
              onChange={(e) => setNewDuration(parseInt(e.target.value, 10) || 0)}
              className="tool-input-field h-9 px-3 font-sans text-xs bg-bg-surface border border-border rounded-md"
            />
            <button
              type="button"
              onClick={handleAddTask}
              disabled={!newId.trim() || !newName.trim()}
              className="h-9 font-sans text-xs font-semibold rounded-md border text-text-primary bg-bg-surface hover:bg-bg-card disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              + Add Task
            </button>
          </div>

          {/* Predecessor picker checkboxes */}
          {tasks.length > 0 && (
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[10px] uppercase text-text-faint font-sans font-semibold">Select Dependencies (Predecessors)</span>
              <div className="flex flex-wrap gap-1.5">
                {tasks.map((t) => {
                  const isActive = newDependsOn.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleDependencyToggle(t.id)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                        isActive 
                          ? "text-bg-card font-bold border-transparent" 
                          : "text-text-muted bg-transparent border-border hover:border-border-hover"
                      }`}
                      style={{ backgroundColor: isActive ? groupAccent : "transparent" }}
                    >
                      {t.id}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CPM schedule calculations analysis and results list */}
        {result.tasks.length > 0 && (
          <div className="border border-border rounded-lg p-4 bg-bg-card space-y-4">
            <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-text-muted">
              Critical Path & Float Schedule Output
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {result.tasks.map((task: any) => (
                <div 
                  key={task.id} 
                  className="bg-bg-surface border border-border p-3 rounded-md text-xs font-sans space-y-2"
                  style={{ borderLeftColor: task.isCritical ? "var(--accent-utility-e, #EF4444)" : groupAccent, borderLeftWidth: "3px" }}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <span className="font-bold text-text-primary block">
                        Task {task.id}: {task.name}
                      </span>
                      <span className="text-[10px] text-text-muted">
                        Float (Slack): <span className={task.isCritical ? "text-accent-utility-e font-bold" : "text-text-primary font-semibold"}>{task.totalFloat} days</span>
                      </span>
                    </div>

                    <span 
                      className={`font-sans text-[10px] font-bold px-1.5 py-0.5 border rounded uppercase tracking-wide ${
                        task.isCritical 
                          ? "bg-red-500/10 text-red-500 border-red-500/20" 
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {task.isCritical ? "Critical Path" : `Slack ${task.totalFloat}d`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/40 text-[10px] font-mono text-text-muted">
                    <div>
                      <span className="block text-[8px] uppercase text-text-faint">Early Start</span>
                      <span>Day {task.earliestStart}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-text-faint">Early Finish</span>
                      <span>Day {task.earliestFinish}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-text-faint">Late Start</span>
                      <span>Day {task.latestStart}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] uppercase text-text-faint">Late Finish</span>
                      <span>Day {task.latestFinish}</span>
                    </div>
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
