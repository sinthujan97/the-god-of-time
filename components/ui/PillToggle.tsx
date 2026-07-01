"use client";

import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAccentColor } from "@/lib/context/AccentColorContext";

interface Option {
  value: string;
  label: string;
}

interface PillToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
  accentColor?: string;
}

export default function PillToggle({
  value,
  onChange,
  options,
  label,
  accentColor,
}: PillToggleProps) {
  const contextAccent = useAccentColor();
  const activeAccent = accentColor || contextAccent || "#C5F135";

  return (
    <div className="pill-toggle-group flex flex-col gap-2 mt-4 font-sans">
      {label && (
        <span className="pill-toggle-label font-sans text-[12px] font-semibold uppercase tracking-[0.08em] text-text-muted">
          {label}
        </span>
      )}
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(val) => {
          // Prevent setting to empty/deselecting the active option
          if (val) onChange(val);
        }}
        className="flex flex-wrap gap-1.5 justify-start bg-transparent"
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className={`pill-option h-9 px-4 rounded-[var(--radius-pill)] font-sans text-xs font-bold border-[length:var(--border-width)] border-border transition-transform duration-150 cursor-pointer select-none focus:outline-none hover:-translate-x-px hover:-translate-y-px active:translate-x-px active:translate-y-px ${
                isSelected
                  ? "hover:text-[var(--section-tools-text-on-accent)]"
                  : "bg-bg-surface text-text-muted hover:bg-bg-card-hover hover:text-text-primary"
              }`}
              style={{
                backgroundColor: isSelected ? activeAccent : undefined,
                borderColor: isSelected ? activeAccent : undefined,
                color: isSelected ? "var(--section-tools-text-on-accent)" : undefined,
                boxShadow: "var(--shadow-offset-sm) var(--shadow-color)",
              }}
            >
              {opt.label}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
