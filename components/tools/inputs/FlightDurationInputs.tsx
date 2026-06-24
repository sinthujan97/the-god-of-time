"use client";

import React, { useState, useEffect } from "react";
import { ToolSelect } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { calculateFlightDuration, FlightDurationResult } from "@/lib/tools/calculations";

interface FlightDurationInputsProps {
  groupAccent: string;
}

export default function FlightDurationInputs({ groupAccent }: FlightDurationInputsProps) {
  const [departureTime, setDepartureTime] = useState<string>("2026-06-24T08:00");
  const [departureTz, setDepartureTz] = useState<string>("America/New_York");
  const [arrivalTime, setArrivalTime] = useState<string>("2026-06-25T11:00");
  const [arrivalTz, setArrivalTz] = useState<string>("Asia/Tokyo");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState<FlightDurationResult>({
    rawTotalDurationMinutes: 0,
    formattedDurationString: "",
    timezoneOffsetDeltaMinutes: 0,
    crossedDateLine: false
  });

  useEffect(() => {
    // Set a default arrival time that is standard for flights
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const depStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T08:00`;
    
    // Arrival next day 11:00
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const arrStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T11:00`;

    setDepartureTime(depStr);
    setArrivalTime(arrStr);
  }, []);

  useEffect(() => {
    if (!departureTime || !arrivalTime) return;
    const res = calculateFlightDuration(departureTime, departureTz, arrivalTime, arrivalTz);
    setResult(res);
  }, [departureTime, departureTz, arrivalTime, arrivalTz]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const timezoneOptions = [
    { value: "America/Los_Angeles", label: "US Pacific (PT)" },
    { value: "America/Denver", label: "US Mountain (MT)" },
    { value: "America/Chicago", label: "US Central (CT)" },
    { value: "America/New_York", label: "US Eastern (ET)" },
    { value: "America/Sao_Paulo", label: "Sao Paulo (BRT)" },
    { value: "UTC", label: "Coordinated Universal (UTC)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris/Berlin (CET)" },
    { value: "Europe/Moscow", label: "Moscow (MSK)" },
    { value: "Asia/Dubai", label: "Dubai (GST)" },
    { value: "Asia/Kolkata", label: "India (IST)" },
    { value: "Asia/Singapore", label: "Singapore (SGT)" },
    { value: "Asia/Tokyo", label: "Japan (JST)" },
    { value: "Australia/Perth", label: "Perth (AWST)" },
    { value: "Australia/Sydney", label: "Sydney (AEST)" },
    { value: "Pacific/Auckland", label: "Auckland (NZST)" }
  ];

  const getBreakdownRows = () => {
    const shiftHrs = result.timezoneOffsetDeltaMinutes / 60;
    const shiftLabel = shiftHrs >= 0 ? `+${shiftHrs} hrs ahead` : `${shiftHrs} hrs behind`;
    return [
      `Departure Point: ${departureTz}`,
      `Arrival Point: ${arrivalTz}`,
      `Timezone Shift: ${shiftLabel}`,
      `Date Line Crossed: ${result.crossedDateLine ? "Yes (Pacific Meridian)" : "No"}`
    ];
  };

  const getCopyText = () => {
    return `Flight Duration: ${result.formattedDurationString} from ${departureTz} to ${arrivalTz} (Crossed IDL: ${result.crossedDateLine ? "Yes" : "No"})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.formattedDurationString || "—"}
      resultUnit="ELAPSED FLIGHT DURATION"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Departure block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="departure-time">
              Departure Local Time
            </label>
            <input
              id="departure-time"
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col">
            <ToolSelect
              value={departureTz}
              onChange={setDepartureTz}
              options={timezoneOptions}
              label="Departure Timezone"
              searchable
            />
          </div>
        </div>

        {/* Arrival block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="arrival-time">
              Arrival Local Time
            </label>
            <input
              id="arrival-time"
              type="datetime-local"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col">
            <ToolSelect
              value={arrivalTz}
              onChange={setArrivalTz}
              options={timezoneOptions}
              label="Arrival Timezone"
              searchable
            />
          </div>
        </div>

        {/* Premium Animated SVG flight path */}
        <div className="p-4 border border-border rounded-lg bg-bg-card flex flex-col items-center justify-center relative overflow-hidden h-32">
          <svg className="w-full max-w-[400px] h-20" viewBox="0 0 400 100">
            {/* Dashed Meridians */}
            <line x1="100" y1="10" x2="100" y2="90" stroke="var(--border-subtle)" strokeDasharray="3,3" />
            <line x1="200" y1="10" x2="200" y2="90" stroke="var(--border-subtle)" strokeDasharray="6,3" strokeWidth={result.crossedDateLine ? 2 : 1} />
            <line x1="300" y1="10" x2="300" y2="90" stroke="var(--border-subtle)" strokeDasharray="3,3" />

            {/* Path Arc */}
            <path
              id="flight-path-arc"
              d="M 50,70 Q 200,-10 350,70"
              fill="none"
              stroke={groupAccent}
              strokeWidth="2.5"
              strokeDasharray="4,4"
            />

            {/* Departure Dot */}
            <circle cx="50" cy="70" r="4" fill="var(--text-primary)" />
            <text x="35" y="88" fill="var(--text-muted)" className="text-[10px] font-sans font-bold">DEP</text>

            {/* Arrival Dot */}
            <circle cx="350" cy="70" r="4" fill="var(--text-primary)" />
            <text x="335" y="88" fill="var(--text-muted)" className="text-[10px] font-sans font-bold">ARR</text>

            {/* Date line marker label */}
            {result.crossedDateLine && (
              <text x="180" y="98" fill="var(--accent-utility-e)" className="text-[8px] font-sans font-semibold tracking-wider">
                DATE LINE CROSSED
              </text>
            )}

            {/* Flying Airplane SVG Indicator */}
            <g transform="translate(-10, -10)">
              <path
                d="M12 2L2 22l10-6 10 6L12 2z"
                fill={groupAccent}
                className="animate-pulse"
                style={{
                  transformOrigin: "center",
                  animation: "bounce 2s infinite"
                }}
              >
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M 50,70 Q 200,-10 350,70"
                  rotate="auto"
                />
              </path>
            </g>
          </svg>
          <span className="text-[9px] font-sans tracking-wide uppercase text-text-faint mt-1">
            Dynamic Flight Horizon Trajectory
          </span>
        </div>

      </div>
    </CalculatorCard>
  );
}
