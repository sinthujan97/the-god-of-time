"use client";

import React, { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "absolute-lunar-anchor")!;

// Constants for astronomy math
const TIDAL_CYCLE = 12.4206; // hours in a semi-diurnal tidal cycle
const SYNODIC_MONTH = 29.53059; // days in a lunar cycle

// Preconfigured coordinate presets
const PRESETS = [
  { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Honolulu, Hawaii", lat: 21.3069, lon: -157.8583 },
  { name: "San Francisco, USA", lat: 37.7749, lon: -122.4194 },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
  { name: "Cape Town, South Africa", lat: -33.9249, lon: 18.4241 },
];

export default function AbsoluteLunarAnchor() {
  const [now, setNow] = useState<Date>(new Date("2026-07-03T12:00:00Z"));
  const [lat, setLat] = useState(37.7749);
  const [lon, setLon] = useState(-122.4194);
  const [presetIndex, setPresetIndex] = useState(2); // SF default

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePresetChange = (idx: number) => {
    setPresetIndex(idx);
    if (idx >= 0 && idx < PRESETS.length) {
      setLat(PRESETS[idx].lat);
      setLon(PRESETS[idx].lon);
    }
  };

  // ─── Tides Calculation ───
  // Tide Epoch: Jan 1, 2026 00:00:00 UTC (assume high tide at Greenwich meridian as a base phase)
  const tideEpoch = new Date("2026-01-01T00:00:00Z").getTime();
  const diffMs = now.getTime() - tideEpoch;
  const diffHours = diffMs / (1000 * 60 * 60);

  // Longitude adjustment: shift by 1 hour per 15 degrees longitude
  const adjustedHours = diffHours + lon / 15;
  const currentCyclePos = (adjustedHours / TIDAL_CYCLE) % 1;
  const cyclePosNormalized = currentCyclePos < 0 ? currentCyclePos + 1 : currentCyclePos;

  // Tide height ratio (cosine wave from -1 to 1)
  // 0 is High Tide, 0.5 is Low Tide, 1.0 is next High Tide
  const tideHeightRatio = Math.cos(cyclePosNormalized * 2 * Math.PI);
  // Convert to percentage (0% = low tide, 100% = high tide)
  const tidePercentage = ((tideHeightRatio + 1) / 2) * 100;

  // Calculate countdown to next high tide and next low tide
  let hoursToNextHigh = 0;
  let hoursToNextLow = 0;

  if (cyclePosNormalized <= 0.5) {
    hoursToNextLow = (0.5 - cyclePosNormalized) * TIDAL_CYCLE;
    hoursToNextHigh = (1.0 - cyclePosNormalized) * TIDAL_CYCLE;
  } else {
    hoursToNextLow = (1.5 - cyclePosNormalized) * TIDAL_CYCLE;
    hoursToNextHigh = (1.0 - cyclePosNormalized) * TIDAL_CYCLE;
  }

  const formatHours = (hrs: number) => {
    const totalSecs = Math.floor(hrs * 3600);
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
  };

  // ─── Moon Phase Calculation ───
  // New Moon Epoch: Dec 30, 2024 22:27:00 UTC
  const moonEpoch = new Date("2024-12-30T22:27:00Z").getTime();
  const diffMoonDays = (now.getTime() - moonEpoch) / (1000 * 60 * 60 * 24);
  const moonCyclePos = (diffMoonDays / SYNODIC_MONTH) % 1;
  const moonCyclePosNormalized = moonCyclePos < 0 ? moonCyclePos + 1 : moonCyclePos;

  // Determine Phase Name & Illumination
  let phaseName = "";
  let illumination = 0; // 0 to 100
  let isWaxing = moonCyclePosNormalized < 0.5;

  if (moonCyclePosNormalized < 0.03 || moonCyclePosNormalized > 0.97) {
    phaseName = "New Moon";
    illumination = 0;
  } else if (moonCyclePosNormalized >= 0.03 && moonCyclePosNormalized < 0.22) {
    phaseName = "Waxing Crescent";
    illumination = Math.round(moonCyclePosNormalized * 2 * 100);
  } else if (moonCyclePosNormalized >= 0.22 && moonCyclePosNormalized < 0.28) {
    phaseName = "First Quarter";
    illumination = 50;
  } else if (moonCyclePosNormalized >= 0.28 && moonCyclePosNormalized < 0.47) {
    phaseName = "Waxing Gibbous";
    illumination = Math.round(50 + (moonCyclePosNormalized - 0.25) * 2 * 50);
  } else if (moonCyclePosNormalized >= 0.47 && moonCyclePosNormalized < 0.53) {
    phaseName = "Full Moon";
    illumination = 100;
  } else if (moonCyclePosNormalized >= 0.53 && moonCyclePosNormalized < 0.72) {
    phaseName = "Waning Gibbous";
    illumination = Math.round(100 - (moonCyclePosNormalized - 0.5) * 2 * 50);
  } else if (moonCyclePosNormalized >= 0.72 && moonCyclePosNormalized < 0.78) {
    phaseName = "Third Quarter";
    illumination = 50;
  } else {
    phaseName = "Waning Crescent";
    illumination = Math.round(50 - (moonCyclePosNormalized - 0.75) * 2 * 50);
  }

  // Draw moon rendering SVG parameters
  // Draw crescent shadow depending on the phase
  const getMoonShadowPath = () => {
    // Basic representation of moon shadow inside a circle of radius 20
    const ratio = moonCyclePosNormalized;
    if (ratio < 0.5) {
      // Waxing phases: shadow retreats from right to left
      const sweep = ratio < 0.25 ? 0 : 1;
      const rx = Math.abs(Math.cos(ratio * 2 * Math.PI) * 20);
      return `M 0 -20 A 20 20 0 0 1 0 20 A ${rx} 20 0 0 ${sweep} 0 -20 Z`;
    } else {
      // Waning phases: shadow grows from right to left
      const sweep = ratio < 0.75 ? 1 : 0;
      const rx = Math.abs(Math.cos(ratio * 2 * Math.PI) * 20);
      return `M 0 -20 A ${rx} 20 0 0 ${sweep} 0 20 A 20 20 0 0 1 0 -20 Z`;
    }
  };

  // Custom Sidebar
  const sidebar = (
    <div className="space-y-6">
      {/* Localized Ocean Stats */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">
          Marine Telemetry
        </span>

        {/* Dynamic Wave Visualizer */}
        <div className="relative h-20 bg-bg-surface border border-border rounded-lg overflow-hidden flex items-end">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
            {/* Ambient Animated Waves */}
            <path
              d={`M 0 ${40 - tidePercentage / 3} Q 25 ${43 - tidePercentage / 3 - 2 * Math.sin(Date.now() / 1000)} 50 ${40 - tidePercentage / 3} T 100 ${40 - tidePercentage / 3} L 100 40 L 0 40 Z`}
              fill="rgba(59, 130, 246, 0.25)"
              className="transition-all duration-1000"
            />
            <path
              d={`M 0 ${41 - tidePercentage / 3} Q 25 ${38 - tidePercentage / 3 + 2.5 * Math.sin(Date.now() / 1000 + 1)} 50 ${41 - tidePercentage / 3} T 100 ${41 - tidePercentage / 3} L 100 40 L 0 40 Z`}
              fill="rgba(59, 130, 246, 0.4)"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-text-primary">
            Tide Level: {tidePercentage.toFixed(1)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Next High Tide</div>
            <div className="text-sm font-mono font-bold text-text-primary mt-0.5">
              {formatHours(hoursToNextHigh)}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Next Low Tide</div>
            <div className="text-sm font-mono font-bold text-text-primary mt-0.5">
              {formatHours(hoursToNextLow)}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-text-faint font-mono uppercase">Lunar Illumination</div>
          <div className="text-lg font-mono font-bold text-text-primary mt-0.5">
            🌕 {illumination}% ({isWaxing ? "Waxing" : "Waning"})
          </div>
        </div>
      </div>

      {/* Coordinate & Presets Selector */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">
          Tidal Alignment
        </span>

        <div>
          <label className="text-xs text-text-muted font-mono block">Marine Preset Location</label>
          <select
            value={presetIndex}
            onChange={(e) => handlePresetChange(Number(e.target.value))}
            className="w-full mt-1.5 p-2 bg-bg-surface border border-border rounded text-xs text-text-primary font-sans"
          >
            {PRESETS.map((p, i) => (
              <option key={i} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-text-muted font-mono block">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={lat}
              onChange={(e) => {
                setLat(Number(e.target.value));
                setPresetIndex(-1); // custom
              }}
              className="w-full mt-1 p-1.5 bg-bg-surface border border-border rounded text-xs text-text-primary font-mono"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted font-mono block">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={lon}
              onChange={(e) => {
                setLon(Number(e.target.value));
                setPresetIndex(-1); // custom
              }}
              className="w-full mt-1 p-1.5 bg-bg-surface border border-border rounded text-xs text-text-primary font-mono"
            />
          </div>
        </div>
      </div>

      {/* Premium Sponsor Ad */}
      <div className="sidebar-ad-slot">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          SPONSOR
        </span>
        <div className="sidebar-ad-container p-5 bg-gradient-to-br from-blue-950/20 to-teal-950/20 border border-blue-500/20 rounded-xl flex flex-col justify-between text-center min-h-[220px]">
          <div>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-mono uppercase">
              Coastal Gear
            </span>
            <h4 className="text-sm font-bold text-text-primary mt-3 font-sans leading-snug">
              Aegir WaveMaster II Smartwatch
            </h4>
            <p className="text-xs text-text-muted mt-2">
              Military-grade water resistance, live tide tables, and GPS tracking. Made for the shoreline.
            </p>
          </div>
          <a
            href="https://thegodoftime.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white font-semibold rounded text-xs mt-4 block text-center"
          >
            Order WaveMaster
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} customSidebar={sidebar}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] select-none text-text-primary">
        
        {/* Tidal Loop SVG Dial */}
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center bg-bg-card/25 border border-border/40 rounded-full p-4 shadow-2xl">
          
          {/* Inner Grid Pattern Overlay */}
          <div className="absolute inset-4 rounded-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          <svg viewBox="0 0 300 300" className="w-full h-full transform -rotate-90">
            {/* Tidal Circle Markers */}
            <circle
              cx="150"
              cy="150"
              r="120"
              fill="none"
              stroke="var(--border)"
              strokeWidth="2"
              strokeDasharray="4,4"
              strokeOpacity="0.4"
            />
            <circle
              cx="150"
              cy="150"
              r="105"
              fill="none"
              stroke="var(--border)"
              strokeWidth="1.5"
              strokeOpacity="0.2"
            />

            {/* Dial Labels */}
            <g className="font-mono text-[10px] fill-text-faint font-semibold">
              {/* High Tide at Top */}
              <text x="150" y="44" textAnchor="middle" transform="rotate(90 150 44)" className="fill-blue-400">
                HIGH TIDE
              </text>
              {/* Low Tide at Bottom */}
              <text x="150" y="264" textAnchor="middle" transform="rotate(90 150 264)" className="fill-amber-400">
                LOW TIDE
              </text>
              {/* Ebb Tide on Right */}
              <text x="256" y="150" textAnchor="middle" transform="rotate(90 256 150)">
                EBB FLOOD
              </text>
              {/* Flood Tide on Left */}
              <text x="44" y="150" textAnchor="middle" transform="rotate(90 44 150)">
                FLOOD EBB
              </text>
            </g>

            {/* Tidal Hour Tick Marks */}
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * 360;
              const rad = (angle * Math.PI) / 180;
              const x1 = 150 + 105 * Math.cos(rad);
              const y1 = 150 + 105 * Math.sin(rad);
              const x2 = 150 + 115 * Math.cos(rad);
              const y2 = 150 + 115 * Math.sin(rad);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
              );
            })}

            {/* Vector Moon Phase Rendering at the Center (R=20) */}
            <g transform="translate(150, 150)">
              {/* Base Moon Back Circle */}
              <circle cx="0" cy="0" r="24" fill="#1e293b" stroke="var(--border)" strokeWidth="1" />
              {/* Moon Illumination Path */}
              {illumination > 0 && (
                <circle cx="0" cy="0" r="24" fill="#fef08a" />
              )}
              {/* Shadow Path Overlay */}
              {phaseName !== "Full Moon" && phaseName !== "New Moon" && (
                <path d={getMoonShadowPath()} fill="#1e293b" transform="scale(1.2)" />
              )}
              {phaseName === "New Moon" && (
                <circle cx="0" cy="0" r="24" fill="#0f172a" />
              )}
            </g>

            {/* Indicator Needle */}
            {(() => {
              // Align pointer based on Semi-Diurnal position
              const rad = (cyclePosNormalized * 2 * Math.PI);
              const px = 150 + 95 * Math.cos(rad);
              const py = 150 + 95 * Math.sin(rad);
              return (
                <g>
                  {/* Arrow Point Line */}
                  <line
                    x1="150"
                    y1="150"
                    x2={px}
                    y2={py}
                    stroke="var(--text-primary)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx={px} cy={py} r="4.5" fill="var(--text-primary)" />
                </g>
              );
            })()}
          </svg>

          {/* Central Overlay Label */}
          <div className="absolute top-[68%] text-center pointer-events-none">
            <div className="text-[10px] text-text-faint font-mono uppercase tracking-widest">Tidal Phase</div>
            <div className="text-xs font-bold text-text-primary font-mono uppercase">
              {cyclePosNormalized < 0.25 && "Rising (Flood)"}
              {cyclePosNormalized >= 0.25 && cyclePosNormalized < 0.5 && "High Peak (Ebb)"}
              {cyclePosNormalized >= 0.5 && cyclePosNormalized < 0.75 && "Falling (Ebb)"}
              {cyclePosNormalized >= 0.75 && "Low Slack (Flood)"}
            </div>
          </div>
        </div>

        {/* Local Presets / Coordinates quick info */}
        <div className="mt-6 flex flex-col items-center gap-1 font-mono text-xs text-text-muted">
          <div>Aligned to: <span className="text-text-primary font-bold">{presetIndex >= 0 ? PRESETS[presetIndex].name : "Custom Coords"}</span></div>
          <div className="text-[10px] text-text-faint">Latitude: {lat.toFixed(4)}° / Longitude: {lon.toFixed(4)}°</div>
        </div>
      </div>
    </ClockLayout>
  );
}
