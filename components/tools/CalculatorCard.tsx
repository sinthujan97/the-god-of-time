"use client";

import React from "react";
import ResultDisplay from "./ResultDisplay";

interface CalculatorCardProps {
  groupAccent: string;
  isLoading: boolean;
  onCalculate: () => void;
  resultValue: string | number;
  resultUnit: string;
  resultBreakdown?: string[];
  copyText?: string;
  animationKey: number;
  errorMessage?: string;
  fontClass?: string;
  children: React.ReactNode;
}

export default function CalculatorCard({
  groupAccent,
  isLoading,
  onCalculate,
  resultValue,
  resultUnit,
  resultBreakdown,
  copyText,
  animationKey,
  errorMessage,
  fontClass,
  children,
}: CalculatorCardProps) {
  return (
    <div
      className="card-brutal-static w-full p-6 md:p-8"
      style={{ "--group-accent": groupAccent } as React.CSSProperties}
    >
      
      {/* 1. INPUT AREA */}
      <div id="tool-input-area" className="tool-inputs space-y-4">
        {children}
      </div>

      {/* 2. CALCULATE BUTTON */}
      <div className="mt-6">
        <button
          id="calculate-btn"
          onClick={onCalculate}
          disabled={isLoading}
          className={`calculate-btn flex items-center justify-center cursor-pointer select-none ${
            isLoading ? "btn-loading" : ""
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-text-primary animate-pulse duration-[600ms] [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-primary animate-pulse duration-[600ms] [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-primary animate-pulse duration-[600ms]" />
            </div>
          ) : (
            "Calculate"
          )}
        </button>
      </div>

      {/* 3. AD SLOT (BETWEEN BUTTON AND RESULT) */}
      <div className="ad-slot-inline mt-6 w-full">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          ADVERTISEMENT
        </span>
        <div className="ad-container min-h-[90px] bg-bg-surface border-t border-b border-border-subtle flex items-center justify-center text-text-faint text-xs font-mono">
          {/* AdSense code placeholder */}
          [Ad Container - Inline Banner]
        </div>
      </div>

      {/* 4. RESULT ZONE */}
      <ResultDisplay
        value={resultValue}
        unit={resultUnit}
        breakdown={resultBreakdown}
        copyText={copyText}
        groupAccent={groupAccent}
        animationKey={animationKey}
        errorMessage={errorMessage}
        fontClass={fontClass}
      />

    </div>
  );
}
