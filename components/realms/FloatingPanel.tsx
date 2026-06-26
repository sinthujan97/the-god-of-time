"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRealm } from "@/lib/context/RealmContext";

// ─── Sub-components ───────────────────────────────────────────────────────────

export function PanelSlider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  unit = "",
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 4,
          accentColor: "var(--tool-accent, var(--accent-cosmos))",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export function PanelToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>
        {label}
      </span>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        style={{
          width: 36,
          height: 18,
          borderRadius: 9,
          border: "1px solid var(--border)",
          background: value ? "var(--tool-accent, var(--accent-cosmos))" : "var(--bg-surface)",
          cursor: "pointer",
          position: "relative",
          transition: "background 200ms",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? "calc(100% - 16px)" : 2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "var(--text-primary)",
            transition: "left 200ms",
          }}
        />
      </button>
    </div>
  );
}

export function PanelDisplay({
  label,
  value,
  unit = "",
  large = false,
  valueColor,
}: {
  label: string;
  value: string | number;
  unit?: string;
  large?: boolean;
  valueColor?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: "var(--text-faint)",
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: large ? 28 : 16,
            color: valueColor || "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {value}
        </span>
        {unit && (
          <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function PanelDivider() {
  return (
    <div
      style={{ height: 1, background: "var(--border-subtle)", margin: "4px 0" }}
    />
  );
}

// ─── Main FloatingPanel ────────────────────────────────────────────────────────

type DefaultPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface FloatingPanelProps {
  id: string;
  title: string;
  defaultPosition: DefaultPosition;
  children: React.ReactNode;
  width?: number;
}

const INITIAL_POSITIONS: Record<DefaultPosition, { top?: number; bottom?: number; left?: number; right?: number }> = {
  "top-left": { top: 72, left: 16 },
  "top-right": { top: 72, right: 16 },
  "bottom-left": { bottom: 64, left: 16 },
  "bottom-right": { bottom: 64, right: 16 },
};

export default function FloatingPanel({
  id,
  title,
  defaultPosition,
  children,
  width = 260,
}: FloatingPanelProps) {
  const { isPanelMinimized, togglePanelMinimized } = useRealm();
  const isMinimized = isPanelMinimized[id] ?? false;

  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  // Compute initial absolute position from defaultPosition on mount
  useEffect(() => {
    if (!panelRef.current) return;
    const panelH = panelRef.current.offsetHeight || 300;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const preset = INITIAL_POSITIONS[defaultPosition];

    const top = preset.top ?? (winH - panelH - (preset.bottom ?? 0));
    const left = preset.left ?? (winW - width - (preset.right ?? 0));

    setPosition({ top, left });
  }, [defaultPosition, width]);

  const clampPosition = useCallback(
    (x: number, y: number) => {
      const panelH = panelRef.current?.offsetHeight ?? 200;
      return {
        left: Math.max(0, Math.min(window.innerWidth - width, x)),
        top: Math.max(0, Math.min(window.innerHeight - panelH, y)),
      };
    },
    [width]
  );

  const onHeaderMouseDown = (e: React.MouseEvent) => {
    if (!position) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
    e.preventDefault();
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      setPosition(clampPosition(e.clientX - dragOffsetRef.current.x, e.clientY - dragOffsetRef.current.y));
    };
    const onMouseUp = () => { isDraggingRef.current = false; };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [clampPosition]);

  // Touch support
  const onHeaderTouchStart = (e: React.TouchEvent) => {
    if (!position) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.touches[0].clientX - position.left,
      y: e.touches[0].clientY - position.top,
    };
  };

  useEffect(() => {
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current) return;
      setPosition(
        clampPosition(
          e.touches[0].clientX - dragOffsetRef.current.x,
          e.touches[0].clientY - dragOffsetRef.current.y
        )
      );
    };
    const onTouchEnd = () => { isDraggingRef.current = false; };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [clampPosition]);

  return (
    <div
      ref={panelRef}
      style={{
        position: "absolute",
        top: position?.top ?? -1000,
        left: position?.left ?? -1000,
        width,
        zIndex: 60,
        background: "color-mix(in srgb, var(--bg-card) 88%, transparent)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        overflow: "hidden",
        transition: position ? "none" : "top 0ms, left 0ms",
      }}
    >
      {/* Header */}
      <div
        onMouseDown={onHeaderMouseDown}
        onTouchStart={onHeaderTouchStart}
        style={{
          height: 36,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          borderBottom: isMinimized ? "none" : "1px solid var(--border-subtle)",
          cursor: "grab",
          userSelect: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--text-muted)",
          }}
        >
          {title}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); togglePanelMinimized(id); }}
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: "transparent",
            border: "none",
            color: "var(--text-faint)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            transition: "color 150ms",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-faint)")}
          aria-label={isMinimized ? "Expand panel" : "Minimize panel"}
        >
          {isMinimized ? "+" : "−"}
        </button>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div
          style={{
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
