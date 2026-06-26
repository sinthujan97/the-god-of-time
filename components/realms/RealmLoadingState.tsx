"use client";

import React from "react";

export default function RealmLoadingState() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent 0%, var(--border) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmerSweep 1.5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 48,
          color: "var(--text-faint)",
          animation: "pulse 2s ease-in-out infinite",
          zIndex: 1,
        }}
      >
        ✦
      </span>
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          color: "var(--text-faint)",
          zIndex: 1,
        }}
      >
        Loading realm...
      </p>

      <style>{`
        @keyframes shimmerSweep {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
