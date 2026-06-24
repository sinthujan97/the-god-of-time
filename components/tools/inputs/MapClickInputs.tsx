"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { lookupTimezoneByCoordinates } from "@/lib/tools/calculations";

interface MapClickInputsProps {
  groupAccent: string;
}

export default function MapClickInputs({ groupAccent }: MapClickInputsProps) {
  const [latitude, setLatitude] = useState<number>(35.68); // Default Tokyo
  const [longitude, setLongitude] = useState<number>(139.76);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    timezoneIANA: "Asia/Tokyo",
    currentOffsetFormatted: "GMT +09:00",
    countryCode: "JP",
    rawUTCOffsetMinutes: 540
  });

  useEffect(() => {
    const res = lookupTimezoneByCoordinates(latitude, longitude);
    setResult(res);
  }, [latitude, longitude]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  // Convert SVG Click coordinates to Latitude / Longitude
  // SVG size: width=400, height=200
  // x: 0 to 400 maps to Longitude: -180 to 180
  // y: 0 to 200 maps to Latitude: 90 to -90
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    const pctX = x / width;
    const pctY = y / height;

    const calculatedLon = parseFloat((-180 + pctX * 360).toFixed(2));
    const calculatedLat = parseFloat((90 - pctY * 180).toFixed(2));

    setLongitude(calculatedLon);
    setLatitude(calculatedLat);
  };

  // Convert Lon/Lat back to SVG coordinates for pin placement
  const pinX = ((longitude + 180) / 360) * 100; // percent
  const pinY = ((90 - latitude) / 180) * 100; // percent

  const getBreakdownRows = () => {
    return [
      `Resolved Country: ${result.countryCode}`,
      `Coordinate Point: ${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`,
      `Raw Offset minutes: ${result.rawUTCOffsetMinutes} mins`
    ];
  };

  const getCopyText = () => {
    return `Timezone at ${latitude}°N, ${longitude}°E: ${result.timezoneIANA} (${result.currentOffsetFormatted})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.timezoneIANA}
      resultUnit="RESOLVED LOCAL TIMEZONE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Coordinate Input Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="latitude">
              Latitude (-90 to 90)
            </label>
            <input
              id="latitude"
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
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="longitude">
              Longitude (-180 to 180)
            </label>
            <input
              id="longitude"
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

        {/* Interactive SVG World Map Coordinate Panel */}
        <div className="space-y-2">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted block">
            Interactive Coordinates Map Click
          </label>
          <div className="relative border border-border rounded-lg overflow-hidden bg-[#1E293B] shadow-inner cursor-crosshair">
            <svg
              className="w-full h-auto min-h-[160px] max-h-[300px]"
              viewBox="0 0 400 200"
              onClick={handleMapClick}
            >
              {/* Grid Lines */}
              <line x1="0" y1="100" x2="400" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />
              <line x1="200" y1="0" x2="200" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" />

              {/* Simplified Continent Paths for visualization */}
              {/* North America */}
              <path d="M 30,30 L 100,20 L 140,50 L 110,80 L 70,80 Z" fill="#475569" opacity="0.3" />
              {/* South America */}
              <path d="M 110,90 L 140,110 L 130,170 L 115,190 L 105,120 Z" fill="#475569" opacity="0.3" />
              {/* Eurasia */}
              <path d="M 180,30 L 320,10 L 370,40 L 350,90 L 250,80 L 190,60 Z" fill="#475569" opacity="0.3" />
              {/* Africa */}
              <path d="M 190,80 L 240,80 L 250,110 L 220,170 L 190,120 Z" fill="#475569" opacity="0.3" />
              {/* Australia */}
              <path d="M 320,120 L 370,120 L 360,160 L 310,150 Z" fill="#475569" opacity="0.3" />

              {/* Interactive Pulsing Pin */}
              <g style={{ left: `${pinX}%`, top: `${pinY}%`, position: "absolute" }}>
                <circle cx={pinX * 4} cy={pinY * 2} r="6" fill={groupAccent} opacity="0.8" className="animate-ping" />
                <circle cx={pinX * 4} cy={pinY * 2} r="4" fill={groupAccent} />
                <circle cx={pinX * 4} cy={pinY * 2} r="1.5" fill="#FFFFFF" />
              </g>
            </svg>
            <div className="absolute bottom-2 left-2 text-[8px] font-mono text-text-faint bg-bg-surface/60 px-1.5 py-0.5 rounded">
              Mercator Grid (Interactive Tap)
            </div>
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
