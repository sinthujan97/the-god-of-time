"use client";

import React, { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "global-shift-overlap")!;

// Standard shift duration is 8 hours.
const SHIFT_DURATION = 8;
const HANDOVER_WINDOW = 0.5; // 30 minutes (0.25 hours on each side of handover)

export default function GlobalShiftOverlap() {
  const [isLive, setIsLive] = useState(true);
  const [scrubHour, setScrubHour] = useState(12); // UTC hour: 0 to 23.99
  const [realTime, setRealTime] = useState<Date | null>(null);
  
  // Custom shift start hours (UTC, 0-23)
  const [apacStart, setApacStart] = useState(22);     // 10 PM UTC
  const [emeaStart, setEmeaStart] = useState(6);       // 6 AM UTC
  const [americasStart, setAmericasStart] = useState(14); // 2 PM UTC

  // Local user time offset in hours
  const [localOffsetHrs, setLocalOffsetHrs] = useState(0);

  useEffect(() => {
    setRealTime(new Date());
    setLocalOffsetHrs(-new Date().getTimezoneOffset() / 60);

    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute active UTC hour
  const liveUtcHour = realTime ? (realTime.getUTCHours() + realTime.getUTCMinutes() / 60 + realTime.getUTCSeconds() / 3600) : 12;
  const activeHour = isLive && realTime ? liveUtcHour : scrubHour;

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
    let diff = (startHour - current + 24) % 24;
    if (diff > 12) {
      diff = 24 - diff; // signed distance
      return diff; 
    }
    return -diff; 
  };

  const shiftStarts = [
    { name: "APAC ➔ EMEA", start: emeaStart },
    { name: "EMEA ➔ Americas", start: americasStart },
    { name: "Americas ➔ APAC", start: apacStart },
  ];

  // Active status checks based on activeHour
  const apacActive = isShiftActive(apacStart, activeHour);
  const emeaActive = isShiftActive(emeaStart, activeHour);
  const americasActive = isShiftActive(americasStart, activeHour);

  // Determine if in handover zone and get next handover info
  let inHandover = false;
  let activeHandoverName = "";
  let nextHandoverSecs = 0;

  let minDiff = 24;
  shiftStarts.forEach((s) => {
    const handoverStartHour = (s.start - HANDOVER_WINDOW / 2 + 24) % 24;
    const diffToHandoverStart = (handoverStartHour - activeHour + 24) % 24;

    if (diffToHandoverStart < minDiff) {
      minDiff = diffToHandoverStart;
    }

    const diffFromExactStart = getHandoverDistance(s.start, activeHour);
    if (Math.abs(diffFromExactStart) <= HANDOVER_WINDOW / 2) {
      inHandover = true;
      activeHandoverName = s.name;
    }
  });

  nextHandoverSecs = Math.floor(minDiff * 3600);

  // Formatters
  const formatCountdown = (totalSecs: number) => {
    if (inHandover) return "ACTIVE NOW ⚠️";
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  const formatScrubTime = (h: number) => {
    const hr = Math.floor(h);
    const min = Math.floor((h % 1) * 60);
    return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  // Convert hour to localized hour readout
  const getLocalHour = (utcVal: number) => {
    return (utcVal + localOffsetHrs + 24) % 24;
  };

  // Radial SVG helpers
  const cx = 150;
  const cy = 150;
  const p = (n: number) => Math.round(n * 1000) / 1000;

  // Convert hour (0-24) to polar degrees/radians (starting from top clockwise)
  const getArcPath = (start: number, duration: number, r: number) => {
    const sAngle = (start / 24) * 360 - 90;
    const eAngle = ((start + duration) / 24) * 360 - 90;
    const sRad = (sAngle * Math.PI) / 180;
    const eRad = (eAngle * Math.PI) / 180;

    const x1 = p(cx + r * Math.cos(sRad));
    const y1 = p(cy + r * Math.sin(sRad));
    const x2 = p(cx + r * Math.cos(eRad));
    const y2 = p(cy + r * Math.sin(eRad));

    const largeArc = duration > 12 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const controlsSection = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, width: "100%" }}>
      
      {/* Operations Tracker */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Operations Overview</span>
        
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button
            onClick={() => setIsLive(true)}
            style={{
              flex: 1,
              padding: "6px 12px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              background: isLive ? "var(--section-clocks-accent)" : "var(--bg-surface)",
              color: isLive ? "#000000" : "var(--text-primary)",
              border: "2px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            🛰️ LIVE TRACKING
          </button>
          <button
            onClick={() => {
              setIsLive(false);
              setScrubHour(Math.floor(liveUtcHour));
            }}
            style={{
              flex: 1,
              padding: "6px 12px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              background: !isLive ? "var(--text-primary)" : "var(--bg-surface)",
              color: !isLive ? "var(--bg-base)" : "var(--text-primary)",
              border: "2px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            📅 TIME SCRUBBER
          </button>
        </div>

        {/* Dynamic hour scrub slider */}
        {!isLive && (
          <div className="pt-2 border-t border-border-subtle">
            <label className="text-[10px] text-text-faint font-mono uppercase flex justify-between">
              <span>Select Hour (UTC)</span>
              <span className="text-amber-400 font-bold">{formatScrubTime(scrubHour)} UTC</span>
            </label>
            <input
              type="range"
              min="0"
              max="23.9"
              step="0.1"
              value={scrubHour}
              onChange={(e) => setScrubHour(Number(e.target.value))}
              className="w-full accent-amber-500 bg-bg-surface border border-border h-2 rounded mt-1.5 cursor-pointer"
            />
            <div className="flex justify-between text-[8px] text-text-faint font-mono mt-1">
              <span>00:00 UTC</span>
              <span>12:00 UTC</span>
              <span>23:59 UTC</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border-subtle">
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Target Time (UTC)</div>
            <div className="text-lg font-mono font-bold text-text-primary mt-0.5">
              {isLive ? (realTime ? realTime.toUTCString().slice(17, 25) : "12:00:00") : `${formatScrubTime(scrubHour)}:00`}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Local Equivalent</div>
            <div className="text-lg font-mono font-bold text-text-primary mt-0.5">
              {formatScrubTime(getLocalHour(activeHour))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-1">
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Active Region</div>
            <div className="mt-1 flex gap-1.5 flex-wrap">
              {apacActive && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">APAC</span>}
              {emeaActive && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">EMEA</span>}
              {americasActive && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">AMER</span>}
              {!apacActive && !emeaActive && !americasActive && <span className="text-[10px] text-text-muted">None</span>}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Next Handover</div>
            <div className={`text-xs font-mono font-bold mt-1 ${inHandover ? "text-amber-400" : "text-text-primary"}`}>
              {formatCountdown(nextHandoverSecs)}
            </div>
          </div>
        </div>
      </div>

      {/* Shift Configurations */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Shift Start times (UTC)</span>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-text-muted flex justify-between font-mono">
              <span className="text-emerald-400 font-semibold">APAC START</span>
              <span className="text-text-primary">{String(apacStart).padStart(2, "0")}:00 UTC</span>
            </label>
            <input type="range" min="0" max="23" value={apacStart} onChange={(e) => setApacStart(Number(e.target.value))} className="w-full accent-emerald-500 bg-bg-surface border border-border h-1.5 rounded mt-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-text-muted flex justify-between font-mono">
              <span className="text-blue-400 font-semibold">EMEA START</span>
              <span className="text-text-primary">{String(emeaStart).padStart(2, "0")}:00 UTC</span>
            </label>
            <input type="range" min="0" max="23" value={emeaStart} onChange={(e) => setEmeaStart(Number(e.target.value))} className="w-full accent-blue-500 bg-bg-surface border border-border h-1.5 rounded mt-1.5 cursor-pointer" />
          </div>
          <div>
            <label className="text-xs text-text-muted flex justify-between font-mono">
              <span className="text-amber-400 font-semibold">AMER START</span>
              <span className="text-text-primary">{String(americasStart).padStart(2, "0")}:00 UTC</span>
            </label>
            <input type="range" min="0" max="23" value={americasStart} onChange={(e) => setAmericasStart(Number(e.target.value))} className="w-full accent-amber-500 bg-bg-surface border border-border h-1.5 rounded mt-1.5 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} controlsSection={controlsSection}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] select-none text-text-primary">
        
        {/* 24-Hour Concentric Team Shift Clock Face */}
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-bg-card/25 border border-border/40 rounded-full p-4 shadow-2xl">
          
          <div className="absolute inset-4 rounded-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
            {/* Bezel Ring */}
            <circle cx={150} cy={150} r={146} fill="none" stroke="var(--border)" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx={150} cy={150} r={136} fill="none" stroke="var(--border)" strokeWidth="1.5" />

            {/* 24-Hour Dial Markings */}
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * 360;
              const rad = (angle * Math.PI) / 180;
              const x1 = p(cx + 130 * Math.cos(rad));
              const y1 = p(cy + 130 * Math.sin(rad));
              const x2 = p(cx + 136 * Math.cos(rad));
              const y2 = p(cy + 136 * Math.sin(rad));

              // Dial labels at major 2-hour increments
              const lx = p(cx + 115 * Math.cos(rad));
              const ly = p(cy + 115 * Math.sin(rad));
              
              const isMajor = i % 4 === 0;

              return (
                <g key={i} className="font-mono text-[9px] fill-text-faint">
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="var(--border)"
                    strokeWidth={isMajor ? "2" : "1"}
                    strokeOpacity={isMajor ? 0.8 : 0.4}
                  />
                  {i % 2 === 0 && (
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(90 ${lx} ${ly})`}
                      className={isMajor ? "fill-text-muted font-bold text-[10px]" : "fill-text-faint text-[8px]"}
                    >
                      {String(i).padStart(2, "0")}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Handover Overlap Zones highlights (represented behind active rings) */}
            {shiftStarts.map((s, idx) => {
              return (
                <g key={idx}>
                  <path
                    d={getArcPath(s.start - HANDOVER_WINDOW / 2, HANDOVER_WINDOW, 78)}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="50"
                    strokeOpacity="0.08"
                    strokeLinecap="round"
                  />
                  {/* Dashed lines marking boundary handovers */}
                  {(() => {
                    const rad = ((s.start / 24) * 360 * Math.PI) / 180;
                    return (
                      <line
                        x1={p(cx + 42 * Math.cos(rad))}
                        y1={p(cy + 42 * Math.sin(rad))}
                        x2={p(cx + 110 * Math.cos(rad))}
                        y2={p(cy + 110 * Math.sin(rad))}
                        stroke="#F59E0B"
                        strokeWidth="1.2"
                        strokeDasharray="4,4"
                        className="opacity-70 animate-pulse"
                      />
                    );
                  })()}
                </g>
              );
            })}

            {/* Concentric Shift Rings */}
            {/* Outer Ring (Americas): r = 94 */}
            <path
              d={getArcPath(americasStart, SHIFT_DURATION, 94)}
              fill="none"
              stroke={americasActive ? "rgba(245, 158, 11, 0.9)" : "var(--border)"}
              strokeWidth="9"
              strokeLinecap="round"
              className="transition-all duration-350"
              style={{ strokeOpacity: americasActive ? 1 : 0.2 }}
            />
            {/* Middle Ring (EMEA): r = 74 */}
            <path
              d={getArcPath(emeaStart, SHIFT_DURATION, 74)}
              fill="none"
              stroke={emeaActive ? "rgba(59, 130, 246, 0.9)" : "var(--border)"}
              strokeWidth="9"
              strokeLinecap="round"
              className="transition-all duration-350"
              style={{ strokeOpacity: emeaActive ? 1 : 0.2 }}
            />
            {/* Inner Ring (APAC): r = 54 */}
            <path
              d={getArcPath(apacStart, SHIFT_DURATION, 54)}
              fill="none"
              stroke={apacActive ? "rgba(16, 185, 129, 0.9)" : "var(--border)"}
              strokeWidth="9"
              strokeLinecap="round"
              className="transition-all duration-350"
              style={{ strokeOpacity: apacActive ? 1 : 0.2 }}
            />

            {/* Pointer Hand 1: UTC Time Hand (Cyan) */}
            {(() => {
              const rad = ((activeHour / 24) * 360 * Math.PI) / 180;
              const hx = p(cx + 104 * Math.cos(rad));
              const hy = p(cy + 104 * Math.sin(rad));
              return (
                <g>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={hx}
                    y2={hy}
                    stroke="var(--section-clocks-accent)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx={hx} cy={hy} r="4.5" fill="var(--section-clocks-accent)" />
                </g>
              );
            })()}

            {/* Pointer Hand 2: Local Time Hand (Amber / Orange) */}
            {(() => {
              const localHr = getLocalHour(activeHour);
              const rad = ((localHr / 24) * 360 * Math.PI) / 180;
              const hx = p(cx + 104 * Math.cos(rad));
              const hy = p(cy + 104 * Math.sin(rad));
              return (
                <g>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={hx}
                    y2={hy}
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    strokeLinecap="round"
                    style={{ strokeOpacity: 0.85 }}
                  />
                  <circle cx={hx} cy={hy} r="3" fill="#F59E0B" style={{ opacity: 0.85 }} />
                </g>
              );
            })()}

            {/* Central Node */}
            <circle cx={cx} cy={cy} r={8} fill="var(--text-primary)" />
            <circle cx={cx} cy={cy} r={3} fill="var(--bg-surface)" />
          </svg>

          {/* Central Digital Info Badge */}
          <div className="absolute text-center bg-bg-surface/90 backdrop-blur border border-border px-3 py-1.5 rounded-lg pointer-events-none select-none max-w-[110px] shadow-lg">
            <div className="text-[8px] text-text-faint font-mono uppercase tracking-wider">Active Zone</div>
            <div className="text-[10px] font-bold font-mono text-text-primary leading-tight mt-0.5">
              {apacActive && "APAC"}
              {emeaActive && (apacActive ? "+EMEA" : "EMEA")}
              {americasActive && (emeaActive || apacActive ? "+AMER" : "AMER")}
              {!apacActive && !emeaActive && !americasActive && "IDLE"}
            </div>
          </div>
        </div>

        {/* Legend readouts for Hands */}
        <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "var(--font-mono)" }}>
            <span style={{ width: 14, height: 3, background: "var(--section-clocks-accent)", display: "inline-block", borderRadius: 2 }} />
            <span>UTC Clock Sweep Hand</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "var(--font-mono)" }}>
            <span style={{ width: 14, height: 3, borderBottom: "2px dashed #F59E0B", display: "inline-block" }} />
            <span>Local Clock Sweep Hand (Offset: {localOffsetHrs > 0 ? "+" : ""}{localOffsetHrs}h)</span>
          </div>
        </div>

        {/* Handover Zone Warning Banner */}
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
