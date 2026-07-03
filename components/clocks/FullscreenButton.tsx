"use client";

import { useState, useEffect, RefObject } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface FullscreenButtonProps {
  targetRef: RefObject<HTMLElement | null>;
  className?: string;
}

export default function FullscreenButton({ targetRef, className = "" }: FullscreenButtonProps) {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function toggle() {
    if (!document.fullscreenElement) {
      targetRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <button
      onClick={toggle}
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
