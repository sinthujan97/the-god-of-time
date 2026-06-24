"use client";

import React, { useState, useEffect } from "react";
import { DatePicker, PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { simulateIDLCrossing } from "@/lib/tools/calculations";
import { MoveRight } from "lucide-react";

interface IDLSimulatorInputsProps {
  groupAccent: string;
}

export default function IDLSimulatorInputs({ groupAccent }: IDLSimulatorInputsProps) {
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [direction, setDirection] = useState<'eastbound' | 'westbound'>("westbound");
  const [transitHours, setTransitHours] = useState<number>(12);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    calculatedArrivalDate: new Date(),
    arrivalDateFormatted: "",
    netDaysShifted: 0,
    simulationSummary: ""
  });

  useEffect(() => {
    setDepartureDate(new Date());
  }, []);

  const formatDateToYYYYMMDD = (d: Date | undefined) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!departureDate) return;
    const dateStr = formatDateToYYYYMMDD(departureDate);
    const res = simulateIDLCrossing(dateStr, direction, transitHours);
    setResult(res);
  }, [departureDate, direction, transitHours]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Crossing Direction: ${direction === "eastbound" ? "Eastbound (Asia to US)" : "Westbound (US to Asia)"}`,
      `Calendar shift factor: ${result.netDaysShifted > 0 ? `+${result.netDaysShifted} calendar day` : `${result.netDaysShifted} calendar day`}`,
      result.simulationSummary
    ];
  };

  const getCopyText = () => {
    return `IDL simulation: Depart ${departureDate ? departureDate.toDateString() : ""}, cross ${direction}, Arrive ${result.arrivalDateFormatted}`;
  };

  const formatCardDate = (d: Date) => {
    return new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(d);
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.arrivalDateFormatted}
      resultUnit="SIMULATED CALENDAR ARRIVAL DATE"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Departure Date and Transit slider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <DatePicker
              id="dep-date"
              label="Departure Calendar Day"
              value={departureDate}
              onChange={setDepartureDate}
              accentColor={groupAccent}
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="transit-range">
              Transit Duration: {transitHours} Hours
            </label>
            <input
              id="transit-range"
              type="range"
              min="1"
              max="48"
              value={transitHours}
              onChange={(e) => setTransitHours(parseInt(e.target.value, 10))}
              className="h-10 cursor-pointer accent-[color:var(--group-accent)]"
            />
          </div>
        </div>

        {/* Direction Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Travel Direction
          </span>
          <PillToggle
            value={direction}
            onChange={(val) => setDirection(val as 'eastbound' | 'westbound')}
            options={[
              { value: "westbound", label: "Americas ➔ Asia (Lose Day)" },
              { value: "eastbound", label: "Asia ➔ Americas (Gain Day)" }
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Premium Calendar Visualizer */}
        {departureDate && (
          <div className="p-4 border border-border rounded-lg bg-bg-card space-y-4">
            <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted text-center">
              International Date Line Calendar Simulation
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
              
              {/* Departure card */}
              <div className="border border-border p-4 rounded-lg bg-bg-surface w-36 text-center shadow">
                <span className="text-[10px] text-text-faint font-bold block uppercase mb-2">DEPARTURE</span>
                <span className="text-sm font-semibold text-text-primary block">{formatCardDate(departureDate)}</span>
                <span className="text-[10px] text-text-muted font-sans italic block mt-1">Calendar Standard</span>
              </div>

              {/* Meridian Crossing Arrow */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-text-faint animate-pulse">
                  <MoveRight className="w-5 h-5" style={{ color: groupAccent }} />
                </div>
                <span className="text-[8px] font-mono tracking-widest text-text-faint uppercase mt-1">180° MERIDIAN</span>
                {direction === "eastbound" ? (
                  <span className="px-2 py-0.5 mt-1.5 rounded bg-accent-utility-a/10 text-accent-utility-a text-[8px] font-bold uppercase tracking-wider">
                    REPEATING DAY (-24h)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 mt-1.5 rounded bg-accent-utility-e/10 text-accent-utility-e text-[8px] font-bold uppercase tracking-wider">
                    SKIPPING DAY (+24h)
                  </span>
                )}
              </div>

              {/* Arrival card */}
              <div className="border border-border p-4 rounded-lg bg-bg-surface w-36 text-center shadow" style={{ borderColor: groupAccent }}>
                <span className="text-[10px] text-text-faint font-bold block uppercase mb-2">ARRIVAL</span>
                <span className="text-sm font-semibold text-text-primary block" style={{ color: groupAccent }}>
                  {formatCardDate(result.calculatedArrivalDate)}
                </span>
                <span className="text-[10px] text-text-muted font-sans italic block mt-1">Simulated Landing</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </CalculatorCard>
  );
}
