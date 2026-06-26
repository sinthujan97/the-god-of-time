"use client";

import React, { useState, useEffect, useRef } from "react";
import { callRealmAI } from "@/lib/realms/aiClient";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

type SystemReading = {
  flux: number;
  integrity: number;
  paradox: number;
};

const realm = realmsRegistry.find((r) => r.slug === "retrocausality")!;

export default function Retrocausality() {
  const [currentAction, setCurrentAction] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [totalScans, setTotalScans] = useState(0);

  // AI responses
  const [detected, setDetected] = useState("Awaiting temporal action...");
  const [mechanism, setMechanism] = useState("Quantum causal engines idle.");
  const [changed, setChanged] = useState("No timeline modifications recorded.");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [magnitude, setMagnitude] = useState("Minor");
  const [timelineHealth, setTimelineHealth] = useState(100.0);
  const [error, setError] = useState<string | null>(null);

  // Live dashboard readings
  const [needleVal, setNeedleVal] = useState(0);
  const [readings, setReadings] = useState<SystemReading>({ flux: 12.4, integrity: 100.0, paradox: 0.0 });
  const [interferenceDays, setInterferenceDays] = useState<number[]>([]); // indices of days with interference

  // Debouncing refs
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const hasAnimation = !prefersReducedMotion();

  // Handle live random ticking for system readings
  useEffect(() => {
    if (!hasAnimation) return;
    const interval = setInterval(() => {
      setReadings((prev) => {
        if (isScanning || isTyping) {
          return {
            flux: parseFloat((10 + Math.random() * 80).toFixed(1)),
            integrity: parseFloat(Math.max(60, Math.min(100, prev.integrity + (Math.random() - 0.5) * 5)).toFixed(1)),
            paradox: parseFloat((Math.random() * 8.5).toFixed(2)),
          };
        } else {
          return {
            flux: parseFloat((10 + Math.random() * 5).toFixed(1)),
            integrity: parseFloat(Math.max(90, Math.min(100, timelineHealth + (Math.random() - 0.5) * 0.5)).toFixed(1)),
            paradox: parseFloat(Math.max(0, (100 - timelineHealth) * 0.05 + (Math.random() - 0.5) * 0.2).toFixed(2)),
          };
        }
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isScanning, isTyping, timelineHealth, hasAnimation]);

  // Oscillating needle during typing or scanning
  useEffect(() => {
    if (!hasAnimation) return;

    if (isTyping || isScanning) {
      animationIntervalRef.current = setInterval(() => {
        setNeedleVal(Math.floor(Math.random() * 80) + 10);
      }, 100);
    } else {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      // Smoothly settle needle to target value
      const target = Math.max(0, Math.min(100, 100 - timelineHealth));
      setNeedleVal(target);
    }

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [isTyping, isScanning, timelineHealth, hasAnimation]);

  const executeAnalysis = async (actionText: string) => {
    setIsScanning(true);
    setIsTyping(false);
    setError(null);

    const systemPrompt = `You are the Retrocausality Engine — a fictional scientific instrument that analyzes how present actions retroactively alter the past through quantum temporal interference fields.

Write in the tone of a hyper-confident scientific report — use real-sounding but completely made-up scientific terminology. Be funny but keep a straight face throughout.

Return ONLY valid JSON in this exact format, no other text:
{
  "detected": "1 sentence stating what past event has been retroactively altered, in specific detail",
  "mechanism": "2 sentences of plausible-sounding pseudo-scientific explanation for HOW their current action caused this past change",
  "changed": "2-3 sentences describing the specific memory or event from their past that has now been retroactively modified",
  "evidence": [
    "observable evidence item 1",
    "observable evidence item 2",
    "observable evidence item 3"
  ],
  "magnitudeVal": "Minor|Moderate|Major|Catastrophic",
  "healthPercent": 84.5
}`;

    const userPrompt = `Analyze action: "${actionText}" affecting the past. Generate the retrocausal report.`;

    try {
      const res = await callRealmAI({
        systemPrompt,
        userPrompt,
        maxTokens: 1000,
      });

      if (res.error) throw new Error(res.error);

      let jsonText = res.content.trim();
      const startIdx = jsonText.indexOf("{");
      const endIdx = jsonText.lastIndexOf("}");
      if (startIdx !== -1 && endIdx !== -1) {
        jsonText = jsonText.substring(startIdx, endIdx + 1);
      }

      const data = JSON.parse(jsonText);
      setDetected(data.detected);
      setMechanism(data.mechanism);
      setChanged(data.changed);
      setEvidence(data.evidence);
      setMagnitude(data.magnitudeVal);
      setTimelineHealth(data.healthPercent);
      setTotalScans((prev) => prev + 1);

      // Randomly flag 1 or 2 days in Panel 2 as interfered
      const numDays = Math.floor(Math.random() * 2) + 1;
      const daysList: number[] = [];
      while (daysList.length < numDays) {
        const d = Math.floor(Math.random() * 7);
        if (!daysList.includes(d)) daysList.push(d);
      }
      setInterferenceDays(daysList);
    } catch (err) {
      console.error(err);
      setError("Causal connection lost. Rescan initiated.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentAction(val);
    setIsTyping(true);

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (val.trim() === "") {
      setIsTyping(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      executeAnalysis(val.trim());
    }, 1500);
  };

  const handleReset = () => {
    setCurrentAction("");
    setIsTyping(false);
    setIsScanning(false);
    setDetected("Awaiting temporal action...");
    setMechanism("Quantum causal engines idle.");
    setChanged("No timeline modifications recorded.");
    setEvidence([]);
    setMagnitude("Minor");
    setTimelineHealth(100.0);
    setNeedleVal(0);
    setInterferenceDays([]);
    setError(null);
  };

  const getMagnitudeColor = () => {
    switch (magnitude.toLowerCase()) {
      case "catastrophic": return "var(--accent-utility-e)";
      case "major": return "var(--accent-utility-e)";
      case "moderate": return "var(--accent-utility-d)";
      default: return "var(--accent-utility-a)";
    }
  };

  // SVG Gauge calculations
  const radius = 50;
  const circumference = Math.PI * radius; // semi-circle
  const strokeDashoffset = circumference - (needleVal / 100) * circumference;

  const inputZone = (
    <div className="w-full bg-bg-card border border-border rounded-lg p-5 shadow-lg">
      <div className="flex items-center text-sm md:text-base text-text-primary">
        <span className="text-accent-utility-a mr-3 font-bold select-none">{`> ANALYZING:`}</span>
        <input
          type="text"
          value={currentAction}
          onChange={handleInputChange}
          placeholder="Describe what you are doing in the present moment..."
          className="flex-grow bg-transparent border-0 border-b border-border-subtle focus:border-accent-utility-a focus:outline-none text-text-primary placeholder-text-faint py-1"
        />
        {isTyping && (
          <span className="text-xs text-accent-utility-a ml-2 animate-pulse uppercase">
            TYPING...
          </span>
        )}
        {isScanning && (
          <span className="text-xs text-accent-utility-a ml-2 animate-pulse uppercase">
            SCANNING...
          </span>
        )}
      </div>
    </div>
  );

  const resultsZone = (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
      {/* PANEL 3: AFFECTED PAST EVENTS */}
      <div className="bg-bg-card border border-border rounded-lg p-5 flex flex-col shadow-md">
        <div className="text-[10px] text-text-faint tracking-wider uppercase mb-4 text-center">
          PANEL 03 // RETROCAUSAL DRIFT LOGS
        </div>

        {error ? (
          <div className="text-xs text-center py-6 text-accent-utility-e">
            {error}
          </div>
        ) : isScanning ? (
          <div className="flex items-center justify-center py-8 text-xs text-text-faint animate-pulse">
            SCANNING QUANTUM STATE...
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="border-b border-border-subtle pb-3">
              <span className="text-[9px] text-text-faint block">DRIFT VERDICT</span>
              <p className="text-xs text-accent-utility-a leading-relaxed mt-1 font-sans">
                {detected}
              </p>
            </div>
            
            {evidence.length > 0 && (
              <div>
                <span className="text-[9px] text-text-faint block mb-2">OBSERVABLE EVIDENCE</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {evidence.map((ev, idx) => (
                    <div 
                      key={idx} 
                      className="bg-bg-surface border border-border rounded p-3 text-xs text-text-muted font-sans leading-relaxed animate-slide-up"
                      style={{ animationDelay: `${idx * 200}ms` }}
                    >
                      <span className="text-accent-utility-a mr-1 font-mono">✓</span> {ev}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PANEL 4: SYSTEM READINGS */}
      <div className="bg-bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-md">
        <div className="text-[10px] text-text-faint tracking-wider uppercase mb-4 text-center">
          PANEL 04 // DIAGNOSTIC TELEMETRY READINGS
        </div>

        <div className="grid grid-cols-3 text-center gap-4 py-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-faint">CHRONAL FLUX</span>
            <span className="text-lg font-mono text-text-primary mt-1">
              {readings.flux} FL/s
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-faint">TIMELINE INTEGRITY</span>
            <span className="text-lg font-mono text-text-primary mt-1" style={{ color: timelineHealth < 80 ? "var(--accent-utility-d)" : "var(--accent-utility-a)" }}>
              {readings.integrity}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-text-faint">PARADOX INDEX</span>
            <span className="text-lg font-mono text-text-primary mt-1" style={{ color: readings.paradox > 4 ? "var(--accent-utility-e)" : "var(--text-primary)" }}>
              {readings.paradox} Px
            </span>
          </div>
        </div>
      </div>

      {/* Clear buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-border hover:bg-bg-card text-text-primary text-xs rounded cursor-pointer transition-colors"
        >
          Clear Diagnostic Metrics
        </button>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} hasInputZone={true} inputZone={inputZone} resultsZone={resultsZone}>
      <div style={{ width: "100%" }}>
        {/* Console Grid dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PANEL 1: INTERFERENCE GAUGE */}
          <div className="bg-bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-between text-center relative shadow-md">
            <div className="text-[10px] text-text-faint tracking-wider uppercase mb-2">
              PANEL 01 // TEMPORAL INTERFERENCE METER
            </div>

            {/* SVG semi-circle gauge */}
            <div className="relative w-[200px] h-[100px] mt-4 overflow-hidden">
              <svg viewBox="0 0 120 60" className="w-full h-full">
                {/* Background arc */}
                <path
                  d="M 10,60 A 50,50 0 0,1 110,60"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                {/* Colored progress arc */}
                <path
                  d="M 10,60 A 50,50 0 0,1 110,60"
                  fill="none"
                  stroke="var(--accent-utility-a)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              </svg>
              {/* Value needle */}
              <div 
                className="absolute bottom-0 left-1/2 w-1 h-16 bg-accent-utility-a origin-bottom transition-all duration-500"
                style={{
                  transform: `translateX(-50%) rotate(${(needleVal / 100) * 180 - 90}deg)`,
                  boxShadow: "0 0 10px var(--accent-utility-a)",
                }}
              />
            </div>
            
            <div className="mt-4">
              <span className="text-2xl font-bold font-mono text-accent-utility-a">
                {needleVal.toFixed(0)} FLUX
              </span>
            </div>
          </div>

          {/* PANEL 2: CAUSAL TIMELINE */}
          <div className="bg-bg-card border border-border rounded-lg p-5 flex flex-col justify-between shadow-md">
            <div className="text-[10px] text-text-faint tracking-wider uppercase mb-4 text-center">
              PANEL 02 // CAUSAL TIMELINE AUDIT (-7 DAYS)
            </div>

            <div className="flex justify-between items-center px-4 py-8">
              {[-7, -6, -5, -4, -3, -2, -1].map((day, idx) => {
                const isInterfered = interferenceDays.includes(idx);
                return (
                  <div key={day} className="flex flex-col items-center gap-2">
                    <span className="text-[10px] text-text-faint font-mono">{day}d</span>
                    <div 
                      className="w-4 h-4 rounded-full border border-border flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isInterfered ? "var(--accent-utility-e)" : "transparent",
                        boxShadow: isInterfered ? "0 0 8px var(--accent-utility-e)" : "none",
                        animation: isInterfered && hasAnimation ? "tempPulse 1.5s infinite" : "none",
                      }}
                    >
                      {isInterfered && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center text-[10px] text-text-muted mt-2">
              {interferenceDays.length > 0 ? "⚠️ Causal node drift detected on timeline." : "Timeline nodes locked and stable."}
            </div>
          </div>

        </div>
      </div>

      <FloatingPanel id="rc-controls" title="TEMPORAL STATUS" defaultPosition="top-right">
        <PanelDisplay
          label="MAGNITUDE"
          value={magnitude.toUpperCase()}
          valueColor={getMagnitudeColor()}
        />
        <PanelDisplay
          label="SCANS RUN"
          value={totalScans}
        />
      </FloatingPanel>

      <style>{`
        @keyframes tempPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-slide-up {
          animation: slideUp 0.4s ease-out forwards;
          opacity: 0;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </RealmLayout>
  );
}
