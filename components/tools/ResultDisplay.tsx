/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { animateCountUp } from "@/lib/tools/calculations";

interface ResultDisplayProps {
  value: string | number;
  unit: string;
  breakdown?: string[];
  copyText?: string;
  groupAccent: string;
  animationKey: number; // Incrementing key to trigger calculation animations
  errorMessage?: string; // Verification/validation error warning
  fontClass?: string; // Optional custom font override (e.g. for dates)
}

export default function ResultDisplay({
  value,
  unit,
  breakdown,
  copyText,
  groupAccent,
  animationKey,
  errorMessage,
  fontClass,
}: ResultDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const prevKeyRef = useRef(animationKey);

  // Check prefers-reduced-motion on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReduced(media.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  // Control the number countup animation sequence
  useEffect(() => {
    if (numRef.current) {
      if (typeof value === "number") {
        if (animationKey > 0 && animationKey !== prevKeyRef.current && !prefersReduced) {
          animateCountUp(numRef.current, value, 600);
        } else {
          // Direct update for live edits
          numRef.current.textContent = value.toLocaleString();
        }
      } else {
        // String outputs (e.g. date representation or "—")
        numRef.current.textContent = String(value);
      }
    }
    prevKeyRef.current = animationKey;
  }, [value, animationKey, prefersReduced]);

  const handleCopy = () => {
    const textToCopy = copyText || String(value);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Tool page link copied to clipboard!");
      });
    }
  };

  // Fade-in helper class for animation triggers (button clicks)
  const animClass = animationKey > 0 && !prefersReduced
    ? "opacity-0 animate-[toolFadeIn_300ms_ease-out_forwards]"
    : "opacity-100";

  return (
    <div id="tool-result-zone" className="mt-6 pt-6 border-t border-border-subtle">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        
        {/* Left Side: Primary Result */}
        <div className="result-box-brutal result-primary flex-1">
          <span
            ref={numRef}
            id="result-number"
            className={`result-number text-[36px] md:text-[52px] font-normal text-text-primary block leading-none tracking-tight ${fontClass || "font-mono tabular-nums"}`}
          >
            —
          </span>

          {/* Error Message underneath the result-number if invalid */}
          {errorMessage ? (
            <div className="text-[14px] italic text-text-muted font-sans mt-2">
              {errorMessage}
            </div>
          ) : (
            <span
              key={`unit-${animationKey}`}
              id="result-unit"
              className={`result-unit text-xs font-sans font-medium uppercase tracking-wider block mt-2 ${animClass}`}
              style={{
                color: groupAccent,
                animationDelay: animationKey > 0 && !prefersReduced ? "300ms" : undefined
              }}
            >
              {unit}
            </span>
          )}
        </div>

        {/* Right Side: Action Buttons */}
        {!errorMessage && value !== "—" && (
          <div className="flex items-center gap-2 md:mt-2">
            <button
              key={`copy-${animationKey}`}
              onClick={handleCopy}
              className={`btn-copy h-9 px-4 bg-transparent border border-border rounded-md font-sans text-xs text-text-muted cursor-pointer transition-all ${animClass} ${
                copied ? "copied" : ""
              }`}
              id="copy-btn"
              style={{ 
                "--group-accent": groupAccent,
                borderColor: copied ? groupAccent : undefined,
                color: copied ? groupAccent : undefined,
                animationDelay: animationKey > 0 && !prefersReduced ? "600ms" : undefined
              } as React.CSSProperties}
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <button
              key={`share-${animationKey}`}
              onClick={handleShare}
              className={`btn-share h-9 px-4 bg-transparent border border-border rounded-md font-sans text-xs text-text-muted cursor-pointer transition-all ${animClass}`}
              id="share-btn"
              style={{ 
                "--group-accent": groupAccent,
                animationDelay: animationKey > 0 && !prefersReduced ? "600ms" : undefined
              } as React.CSSProperties}
            >
              Share
            </button>
          </div>
        )}
      </div>

      {/* Secondary breakdown rows */}
      {!errorMessage && breakdown && breakdown.length > 0 && (
        <div id="result-breakdown" className="result-breakdown mt-4 flex flex-col gap-1.5">
          {breakdown.map((row, index) => (
            <div 
              key={`row-${animationKey}-${index}`}
              className={`result-breakdown-row font-mono text-sm text-text-muted ${animClass}`}
              style={{ 
                animationDelay: animationKey > 0 && !prefersReduced ? `${400 + index * 80}ms` : undefined 
              }}
            >
              {row}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
