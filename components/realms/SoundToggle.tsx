"use client";

import React, { useState, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useRealm } from "@/lib/context/RealmContext";

export default function SoundToggle() {
  const { soundEnabled, setSoundEnabled } = useRealm();
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleToggle = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      setShowTooltip(true);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        aria-label={soundEnabled ? "Disable ambient sound" : "Enable ambient sound"}
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          color: "var(--text-muted)",
          transition: "background 150ms, color 150ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-card)";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
        }}
      >
        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "4px 10px",
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            color: "var(--text-primary)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 200,
            animation: "fadeIn 200ms ease",
          }}
        >
          Sound enabled
        </div>
      )}
    </div>
  );
}
