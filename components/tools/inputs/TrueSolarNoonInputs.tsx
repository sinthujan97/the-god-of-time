"use client";

import React, { useState, useEffect } from "react";
import { DatePicker } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateTrueSolarNoon } from "@/lib/tools/calculations";

interface TrueSolarNoonInputsProps {
  groupAccent: string;
}

export default function TrueSolarNoonInputs({ groupAccent }: TrueSolarNoonInputsProps) {
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  const [latitude, setLatitude] = useState<number>(35.6895); // Tokyo
  const [longitude, setLongitude] = useState<number>(139.6917);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    solarNoonTimeFormatted: "12:00",
    sunElevationAngleDegrees: 45,
    shadowLengthRatioFactor: 1.0
  });

  useEffect(() => {
    setTargetDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!targetDate) return;
    const dateStr = formatDateToYYYYMMDD(targetDate);
    const res = calculateTrueSolarNoon(dateStr, latitude, longitude);
    setResult(res);
  }, [targetDate, latitude, longitude]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Peak Sun Elevation: ${result.sunElevationAngleDegrees}° above horizon`,
      `Object-to-Shadow Length Ratio: 1 : ${result.shadowLengthRatioFactor.toFixed(2)}`,
      `Shadow Profile: ${result.shadowLengthRatioFactor < 0.5 ? "Short / Direct Zenith" : result.shadowLengthRatioFactor > 2.0 ? "Long / Low Elevation" : "Moderate Length"}`
    ];
  };

  const getCopyText = () => {
    return `Solar Noon: ${result.solarNoonTimeFormatted} | Sun Elevation: ${result.sunElevationAngleDegrees}° | Shadow Ratio: ${result.shadowLengthRatioFactor}`;
  };

  // SVG parameters for sun placement based on elevation angle
  // Ground center at x=100, y=85. Vertical pole is 30px high, going from y=85 up to y=55.
  // We place sun on a circle centered at (100, 85) with radius 60.
  // Angle is from horizontal (0 degrees is right side). Elevation is 0 to 90 degrees.
  const angleRad = (result.sunElevationAngleDegrees * Math.PI) / 180;
  
  // Let's place sun on the left side to cast shadow to the right.
  // Center is (150, 80). Pole is at x=150, height = 40 (y goes from 80 up to 40).
  const poleBaseX = 150;
  const poleBaseY = 80;
  const poleHeight = 35;
  const poleTopY = poleBaseY - poleHeight;

  const sunRadius = 55;
  const sunX = poleBaseX - Math.cos(angleRad) * sunRadius;
  const sunY = poleBaseY - Math.sin(angleRad) * sunRadius;

  // Shadow length: height * shadowRatio. Let's cap shadow display length at 100px.
  const shadowLength = Math.min(100, poleHeight * result.shadowLengthRatioFactor);
  const shadowEndX = poleBaseX + shadowLength;

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.solarNoonTimeFormatted}
      resultUnit="TRUE SOLAR NOON (LOCAL CLOCK)"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Date picker */}
        <div className="flex flex-col">
          <DatePicker
            id="solar-date"
            label="Evaluation Date"
            value={targetDate}
            onChange={setTargetDate}
            accentColor={groupAccent}
          />
        </div>

        {/* Latitude & Longitude */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="lat-val">
              Latitude (-90 to 90)
            </label>
            <input
              id="lat-val"
              type="number"
              min="-90"
              max="90"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(Math.min(90, Math.max(-90, parseFloat(e.target.value) || 0)))}
              className="h-11 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="lon-val">
              Longitude (-180 to 180)
            </label>
            <input
              id="lon-val"
              type="number"
              min="-180"
              max="180"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(Math.min(180, Math.max(-180, parseFloat(e.target.value) || 0)))}
              className="h-11 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        </div>

        {/* Premium Sun Apex Shadow Visualizer */}
        <div className="p-4 border border-border rounded-lg bg-bg-card flex flex-col items-center justify-center relative overflow-hidden h-36">
          <svg className="w-full max-w-[360px] h-28" viewBox="0 0 300 100">
            {/* Horizon Ground Line */}
            <line x1="10" y1={poleBaseY} x2="290" y2={poleBaseY} stroke="var(--border-subtle)" strokeWidth="1.5" />

            {/* Vertical Object (Gnomon / Pole) */}
            <line x1={poleBaseX} y1={poleBaseY} x2={poleBaseX} y2={poleTopY} stroke="var(--text-primary)" strokeWidth="3" strokeLinecap="round" />
            <text x={poleBaseX - 18} y={poleTopY - 4} fill="var(--text-muted)" className="text-[7px] font-sans font-bold">Gnomon</text>

            {/* Shadow Vector on the ground */}
            {result.sunElevationAngleDegrees > 0 && (
              <line x1={poleBaseX} y1={poleBaseY + 1} x2={shadowEndX} y2={poleBaseY + 1} stroke="#E4B555" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
            )}
            <text x={poleBaseX + (shadowLength / 2) - 15} y={poleBaseY + 11} fill="var(--text-muted)" className="text-[7px] font-sans font-bold">Shadow</text>

            {/* Sun Rays */}
            {result.sunElevationAngleDegrees > 0 && (
              <line x1={sunX} y1={sunY} x2={poleBaseX} y2={poleTopY} stroke="var(--text-faint)" strokeWidth="0.5" strokeDasharray="3,3" />
            )}

            {/* The Sun Circle */}
            {result.sunElevationAngleDegrees > 0 ? (
              <g>
                <circle cx={sunX} cy={sunY} r="8" fill="#E4B555" className="animate-pulse" />
                <circle cx={sunX} cy={sunY} r="6" fill="#FCD34D" />
                <text x={sunX - 18} y={sunY - 10} fill="var(--text-muted)" className="text-[7px] font-mono font-bold">
                  {result.sunElevationAngleDegrees}°
                </text>
              </g>
            ) : (
              <text x="50" y="40" fill="var(--text-faint)" className="text-[9px] font-sans italic">Sun below horizon</text>
            )}
          </svg>
          <span className="text-[9px] font-sans tracking-wide uppercase text-text-faint">
            Zenith Elevation & Shadow Raytrace
          </span>
        </div>

      </div>
    </CalculatorCard>
  );
}
