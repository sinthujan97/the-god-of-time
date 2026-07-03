"use client";

import { Maximize2, Minimize2 } from "lucide-react";

interface FullscreenButtonProps {
  isFs: boolean;
  onToggle: () => void;
  className?: string;
}

export default function FullscreenButton({ isFs, onToggle, className = "" }: FullscreenButtonProps) {
  return (
    <button
      onClick={onToggle}
      title={isFs ? "Exit fullscreen" : "Enter fullscreen"}
      className={className}
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 20,
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "2px solid var(--border)",
        borderRadius: 8,
        background: "var(--bg-card)",
        boxShadow: "2px 2px 0 var(--shadow-color)",
        cursor: "pointer",
        transition: "transform 0.1s, box-shadow 0.1s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "translate(-1px,-1px)";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "3px 3px 0 var(--shadow-color)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0 var(--shadow-color)";
      }}
    >
      {isFs ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
    </button>
  );
}
