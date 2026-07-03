"use client";

import React, { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "global-shift-overlap")!;

// Standard shift duration is 8 hours.
const SHIFT_DURATION = 8;
const HANDOVER_WINDOW = 0.5; // 30 minutes (0.25 hours on each side of handover)

export default function GlobalShiftOverlap() {
  const [now, setNow] = useState<Date>(new Date("2026-07-03T12:00:00Z"));
  
  // Custom shift start hours (UTC, 0-23)
  const [apacStart, setApacStart] = useState(22);     // 10 PM UTC
  const [emeaStart, setEmeaStart] = useState(6);       // 6 AM UTC
  const [americasStart, setAmericasStart] = useState(14); // 2 PM UTC

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60 + now.getUTCSeconds() / 3600;

  // Helper to check if hour falls within shift
  const isShiftActive = (start: number, current: number) => {
    const end = (start + SHIFT_DURATION) % 24;
    if (start < end) {
      return current >= start && current < end;
    } else {
      return current >= start || current < end;
    }
  };

  // Helper to check if hour is in handover zone (±15 mins around shift starts)
  const getHandoverDistance = (startHour: number, current: number) => {
    // Distance from current to startHour in 24h cycle
    let diff = (startHour - current + 24) % 24;
    // If it's within 23.75 to 24 (or 0 to 0.25), it's active handover
    if (diff > 12) {
      diff = 24 - diff; // signed distance
      return diff; // negative if current is after startHour
    }
    return -diff; // positive if current is before startHour
  };

  // Handover start times are the start times of the shifts
  const shiftStarts = [
    { name: "APAC ➔ EMEA", start: emeaStart },
    { name: "EMEA ➔ Americas", start: americasStart },
    { name: "Americas ➔ APAC", start: apacStart },
  ];

  // Determine current active region status
  const apacActive = isShiftActive(apacStart, utcHour);
  const emeaActive = isShiftActive(emeaStart, utcHour);
  const americasActive = isShiftActive(americasStart, utcHour);

  // Determine if in handover zone and get next handover info
  let inHandover = false;
  let activeHandoverName = "";
  let nextHandoverSecs = 0;

  // Find next handover
  let minDiff = 24;
  shiftStarts.forEach((s) => {
    const distToStart = (s.start - utcHour + 24) % 24;
    // Handover starts HANDOVER_WINDOW/2 (15 mins) before the shift start
    const handoverStartHour = (s.start - HANDOVER_WINDOW / 2 + 24) % 24;
    const diffToHandoverStart = (handoverStartHour - utcHour + 24) % 24;

    if (diffToHandoverStart < minDiff) {
      minDiff = diffToHandoverStart;
    }

    // Check if currently inside handover window
    const diffFromExactStart = getHandoverDistance(s.start, utcHour);
    if (Math.abs(diffFromExactStart) <= HANDOVER_WINDOW / 2) {
      inHandover = true;
      activeHandoverName = s.name;
    }
  });

  nextHandoverSecs = Math.floor(minDiff * 3600);

  // Formatter for countdown
  const formatCountdown = (totalSecs: number) => {
    if (inHandover) return "ACTIVE NOW";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  // Draw radial rings SVG helpers
  const cx = 150;
  const cy = 150;

  // Convert hour (0-24) to polar degrees/radians (starting from top, clockwise)
  const getArcPath = (start: number, duration: number, r: number) => {
    const sAngle = (start / 24) * 360 - 90;
    const eAngle = ((start + duration) / 24) * 360 - 90;
    const sRad = (sAngle * Math.PI) / 180;
    const eRad = (eAngle * Math.PI) / 180;
    
    const x1 = cx + r * Math.cos(sRad);
    const y1 = cy + r * Math.sin(sRad);
    const x2 = cx + r * Math.cos(eRad);
    const y2 = cy + r * Math.sin(eRad);
    
    const largeArc = duration > 12 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Custom Sidebar
  const sidebar = (
    <div className="space-y-6">
      {/* Metrics Card */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">
          Operations Overview
        </span>
        
        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Current Time (UTC)</div>
          <div className="text-xl font-mono font-bold text-text-primary mt-1">
            {now.toUTCString().slice(17, 25)}
          </div>
        </div>

        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Active Region</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {apacActive && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                APAC
              </span>
            )}
            {emeaActive && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                EMEA
              </span>
            )}
            {americasActive && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AMER
              </span>
            )}
            {!apacActive && !emeaActive && !americasActive && (
              <span className="text-xs text-text-muted">None (System Idle)</span>
            )}
          </div>
        </div>

        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Handover Status</div>
          <div className={`text-base font-semibold mt-1 ${inHandover ? "text-amber-400 animate-pulse" : "text-text-primary"}`}>
            {inHandover ? `⚠️ Handover: ${activeHandoverName}` : "Nominal Tracking"}
          </div>
        </div>

        <div>
          <div className="text-xs text-text-faint font-mono uppercase">Next Handover Zone</div>
          <div className={`text-2xl font-mono font-bold mt-1 ${inHandover ? "text-amber-400" : "text-text-primary"}`}>
            {formatCountdown(nextHandoverSecs)}
          </div>
        </div>
      </div>

      {/* Adjust Shift Controls */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">
          Shift Configurations
        </span>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted flex justify-between font-mono">
              <span>APAC START (UTC)</span>
              <span className="text-text-primary">{String(apacStart).padStart(2, "0")}:00</span>
            </label>
            <input
              type="range"
              min="0"
              max="23"
              value={apacStart}
              onChange={(e) => setApacStart(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-bg-surface border border-border h-1 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted flex justify-between font-mono">
              <span>EMEA START (UTC)</span>
              <span className="text-text-primary">{String(emeaStart).padStart(2, "0")}:00</span>
            </label>
            <input
              type="range"
              min="0"
              max="23"
              value={emeaStart}
              onChange={(e) => setEmeaStart(Number(e.target.value))}
              className="w-full accent-blue-500 bg-bg-surface border border-border h-1 rounded mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted flex justify-between font-mono">
              <span>AMER START (UTC)</span>
              <span className="text-text-primary">{String(americasStart).padStart(2, "0")}:00</span>
            </label>
            <input
              type="range"
              min="0"
              max="23"
              value={americasStart}
              onChange={(e) => setAmericasStart(Number(e.target.value))}
              className="w-full accent-amber-500 bg-bg-surface border border-border h-1 rounded mt-1"
            />
          </div>
        </div>
      </div>

      {/* Premium Sponsor Ad */}
      <div className="sidebar-ad-slot">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          SPONSOR
        </span>
        <div className="sidebar-ad-container p-5 bg-indigo-950/20 to-purple-950/20 border border-indigo-500/20 rounded-xl flex flex-col justify-between text-center min-h-[220px]">
          <div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded font-mono uppercase">
              DevOps Tooling
            </span>
            <h4 className="text-sm font-bold text-text-primary mt-3 font-sans leading-snug">
              SyncOps: Global Handover Automated
            </h4>
            <p className="text-xs text-text-muted mt-2">
              Eliminate critical communication gaps during timezone shifts. Start your 14-day free trial.
            </p>
          </div>
          <a
            href="https://thegodoftime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white font-semibold rounded text-xs mt-4 block text-center"
          >
            Deploy SyncOps Free
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} customSidebar={sidebar}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] select-none text-text-primary">
        {/* Concentric Timeline SVG */}
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-bg-card/25 border border-border/40 rounded-full p-4 shadow-2xl">
          
          {/* Inner Grid Pattern Overlay */}
          <div className="absolute inset-4 rounded-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
            {/* 24-Hour Dial Markings */}
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360;
              const rad = (angle * Math.PI) / 180;
              const x1 = cx + 138 * Math.cos(rad);
              const y1 = cy + 138 * Math.sin(rad);
              const x2 = cx + 144 * Math.cos(rad);
              const y2 = cy + 144 * Math.sin(rad);
              
              // Hour labels
              const lx = cx + 120 * Math.cos(rad);
              const ly = cy + 120 * Math.sin(rad);
              
              return (
                <g key={i} className="font-mono text-[9px] fill-text-faint">
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--border)"
                    strokeWidth={i % 6 === 0 ? "2" : "1"}
                  />
                  {i % 4 === 0 && (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(90 ${lx} ${ly})`}
                    >
                      {String(i).padStart(2, "0")}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Handover Zone Highlights (drawn behind the rings) */}
            {shiftStarts.map((s, idx) => {
              // 30 mins window around s.start (e.g. s.start - 0.25 to s.start + 0.25)
              return (
                <g key={idx}>
                  {/* Outer glow arc for handover */}
                  <path
                    d={getArcPath(s.start - HANDOVER_WINDOW / 2, HANDOVER_WINDOW, 85)}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="45"
                    strokeOpacity="0.08"
                    strokeLinecap="round"
                  />
                  {/* Line marking the exact split */}
                  {(() => {
                    const rad = ((s.start / 24) * 360 * Math.PI) / 180;
                    return (
                      <line
                        x1={cx + 40 * Math.cos(rad)}
                        y1={cy + 40 * Math.sin(rad)}
                        x2={cx + 115 * Math.cos(rad)}
                        y2={cy + 115 * Math.sin(rad)}
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        strokeDasharray="3,3"
                        className="animate-pulse"
                      />
                    );
                  })()}
                </g>
              );
            })}

            {/* Concentric Shift Rings */}
            {/* 1. Americas (Outer: r = 98) */}
            <path
              d={getArcPath(americasStart, SHIFT_DURATION, 98)}
              fill="none"
              stroke={americasActive ? "rgba(245, 158, 11, 0.9)" : "var(--border)"}
              strokeWidth="10"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            {/* 2. EMEA (Middle: r = 78) */}
            <path
              d={getArcPath(emeaStart, SHIFT_DURATION, 78)}
              fill="none"
              stroke={emeaActive ? "rgba(59, 130, 246, 0.9)" : "var(--border)"}
              strokeWidth="10"
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            {/* 3. APAC (Inner: r = 58) */}
            <path
              d={getArcPath(apacStart, SHIFT_DURATION, 58)}
              fill="none"
              stroke={apacActive ? "rgba(16, 185, 129, 0.9)" : "var(--border)"}
              strokeWidth="10"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Sweep hand representing current UTC time */}
            {(() => {
              const rad = ((utcHour / 24) * 360 * Math.PI) / 180;
              const hx = cx + 110 * Math.cos(rad);
              const hy = cy + 110 * Math.sin(rad);
              return (
                <g>
                  {/* Outer circle pointer */}
                  <circle cx={hx} cy={hy} r="4" fill="var(--text-primary)" />
                  {/* Indicator Line */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={hx}
                    y2={hy}
                    stroke="var(--text-primary)"
                    strokeWidth="1.5"
                  />
                  {/* Central Node */}
                  <circle cx={cx} cy={cy} r="6" fill="var(--text-primary)" />
                  <circle cx={cx} cy={cy} r="2" fill="var(--bg-surface)" />
                </g>
              );
            })()}
          </svg>

          {/* Central Digital Info Badge */}
          <div className="absolute text-center bg-bg-surface/90 backdrop-blur border border-border px-4 py-2 rounded-lg pointer-events-none select-none">
            <div className="text-[10px] text-text-faint font-mono uppercase tracking-wider">Active Shift</div>
            <div className="text-xs font-bold font-mono">
              {apacActive && "APAC"}
              {emeaActive && (apacActive ? " + EMEA" : "EMEA")}
              {americasActive && (emeaActive || apacActive ? " + AMER" : "AMER")}
              {!apacActive && !emeaActive && !americasActive && "NONE"}
            </div>
          </div>
        </div>

        {/* Handover Zone Warnings */}
        {inHandover && (
          <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            CRITICAL HANDOVER OVERLAP: {activeHandoverName}
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
