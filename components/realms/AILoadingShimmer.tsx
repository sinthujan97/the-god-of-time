"use client";

import React, { useEffect, useState, useRef } from "react";
import { prefersReducedMotion } from "@/lib/realms/physics";

interface AILoadingShimmerProps {
  message?: string;
  lines?: number;
}

export default function AILoadingShimmer({
  message = "Consulting the cosmos",
  lines = 4,
}: AILoadingShimmerProps) {
  const [dots, setDots] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const hasAnimation = !reducedMotion;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 32,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Self-contained CSS for shimmer and pulse */}
      <style>{`
        @keyframes shimmer-move {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes shimmer-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .shimmer-line-animated {
          animation: shimmer-move 1.8s ease-in-out infinite;
        }
        .shimmer-symbol-animated {
          animation: shimmer-pulse 2s ease-in-out infinite;
        }
      `}</style>

      {/* Loading message */}
      <div
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 18,
          fontStyle: "italic",
          color: "var(--text-muted)",
          marginBottom: 8,
          userSelect: "none",
        }}
      >
        {message}
        <span style={{ fontFamily: "var(--font-mono)", display: "inline-block", width: 24, textAlign: "left" }}>
          {dots}
        </span>
      </div>

      {/* Shimmer lines */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: lines }).map((_, idx) => {
          const isLast = idx === lines - 1;
          return (
            <div
              key={idx}
              className={hasAnimation ? "shimmer-line-animated" : ""}
              style={{
                height: 16,
                width: isLast ? "60%" : "100%",
                borderRadius: 4,
                background: hasAnimation
                  ? "linear-gradient(90deg, var(--border) 0%, var(--bg-card-hover) 50%, var(--border) 100%)"
                  : "var(--border)",
                backgroundSize: "200% 100%",
              }}
            />
          );
        })}
      </div>

      {/* Symbol indicator */}
      <div
        className={hasAnimation ? "shimmer-symbol-animated" : ""}
        style={{
          fontSize: 24,
          color: "var(--text-faint)",
          textAlign: "center",
          marginTop: 16,
          userSelect: "none",
        }}
      >
        ✦
      </div>
    </div>
  );
}
