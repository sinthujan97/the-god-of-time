"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { mockNTPLatencyAnalysis } from "@/lib/tools/calculations";

interface NTPLatencyInputsProps {
  groupAccent: string;
}

export default function NTPLatencyInputs({ groupAccent }: NTPLatencyInputsProps) {
  const [t1, setT1] = useState<number>(1000); // client transmit
  const [t2, setT2] = useState<number>(1012); // server receive
  const [t3, setT3] = useState<number>(1014); // server transmit
  const [t4, setT4] = useState<number>(1030); // client receive

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    roundTripDelayMilliseconds: 0,
    localClockOffsetMilliseconds: 0,
    synchronizationStatus: "Synchronized"
  });

  useEffect(() => {
    // Generate some interesting baseline numbers that simulate a live scenario
    const base = Date.now();
    setT1(base);
    setT2(base + 12);
    setT3(base + 14);
    setT4(base + 30);
  }, []);

  useEffect(() => {
    const res = mockNTPLatencyAnalysis(t1, t2, t3, t4);
    setResult(res);
  }, [t1, t2, t3, t4]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const getBreakdownRows = () => {
    return [
      `Synchronization Quality: ${result.synchronizationStatus}`,
      `Estimated Local Clock Drift: ${result.localClockOffsetMilliseconds} ms`,
      `Estimated Round-Trip Delay (RTT): ${result.roundTripDelayMilliseconds} ms`
    ];
  };

  const getCopyText = () => {
    return `NTP Latency Result: RTT = ${result.roundTripDelayMilliseconds}ms, Offset = ${result.localClockOffsetMilliseconds}ms, Status = ${result.synchronizationStatus}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${result.localClockOffsetMilliseconds} ms`}
      resultUnit="ESTIMATED LOCAL CLOCK DRIFT OFFSET"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Latency Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="t1-val">
              T1 (Client Sent)
            </label>
            <input
              id="t1-val"
              type="number"
              value={t1}
              onChange={(e) => setT1(parseInt(e.target.value, 10) || 0)}
              className="h-10 px-2.5 bg-bg-surface border border-border rounded font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="t2-val">
              T2 (Server Recv)
            </label>
            <input
              id="t2-val"
              type="number"
              value={t2}
              onChange={(e) => setT2(parseInt(e.target.value, 10) || 0)}
              className="h-10 px-2.5 bg-bg-surface border border-border rounded font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="t3-val">
              T3 (Server Sent)
            </label>
            <input
              id="t3-val"
              type="number"
              value={t3}
              onChange={(e) => setT3(parseInt(e.target.value, 10) || 0)}
              className="h-10 px-2.5 bg-bg-surface border border-border rounded font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="t4-val">
              T4 (Client Recv)
            </label>
            <input
              id="t4-val"
              type="number"
              value={t4}
              onChange={(e) => setT4(parseInt(e.target.value, 10) || 0)}
              className="h-10 px-2.5 bg-bg-surface border border-border rounded font-sans text-xs focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            />
          </div>
        </div>

        {/* Diagnostic Curve visualization */}
        <div className="p-4 border border-border rounded-lg bg-bg-card flex flex-col items-center justify-center relative overflow-hidden h-36">
          <svg className="w-full max-w-[400px] h-28" viewBox="0 0 400 100">
            {/* Timeline Line */}
            <line x1="40" y1="50" x2="360" y2="50" stroke="var(--border-subtle)" strokeWidth="1" />
            
            {/* Client nodes */}
            <circle cx="50" cy="50" r="4" fill="var(--text-primary)" />
            <text x="45" y="70" fill="var(--text-muted)" className="text-[8px] font-sans font-bold">Client T1</text>

            <circle cx="350" cy="50" r="4" fill="var(--text-primary)" />
            <text x="340" y="70" fill="var(--text-muted)" className="text-[8px] font-sans font-bold">Client T4</text>

            {/* Server nodes */}
            <circle cx="160" cy="50" r="4" fill={groupAccent} />
            <text x="150" y="32" fill="var(--text-muted)" className="text-[8px] font-sans font-bold">Server T2</text>

            <circle cx="240" cy="50" r="4" fill={groupAccent} />
            <text x="230" y="32" fill="var(--text-muted)" className="text-[8px] font-sans font-bold">Server T3</text>

            {/* Paths */}
            {/* Request path */}
            <path d="M 50,50 Q 105,80 160,50" fill="none" stroke="var(--text-faint)" strokeWidth="1" strokeDasharray="3,3" />
            <text x="95" y="78" fill="var(--text-faint)" className="text-[7px] font-sans">Request Path</text>

            {/* Server delay arc */}
            <path d="M 160,50 Q 200,20 240,50" fill="none" stroke={groupAccent} strokeWidth="1.5" />
            <text x="190" y="30" fill={groupAccent} className="text-[7px] font-sans font-semibold">Process</text>

            {/* Response path */}
            <path d="M 240,50 Q 295,80 350,50" fill="none" stroke="var(--text-faint)" strokeWidth="1" strokeDasharray="3,3" />
            <text x="285" y="78" fill="var(--text-faint)" className="text-[7px] font-sans">Response Path</text>
          </svg>
          <span className="text-[9px] font-sans tracking-wide uppercase text-text-faint">
            Interactive Network Transmit Topology
          </span>
        </div>

      </div>
    </CalculatorCard>
  );
}
