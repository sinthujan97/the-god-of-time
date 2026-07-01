"use client";

import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { useAccentColor } from "@/lib/context/AccentColorContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  accentColor?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  id?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  label,
  accentColor,
  disabled = false,
  minDate,
  maxDate,
  id,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const contextAccent = useAccentColor();
  const activeAccent = accentColor || contextAccent || "#C5F135";

  // Date formatting options
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const triggerStyles: React.CSSProperties = {
    "--local-accent": activeAccent,
  } as React.CSSProperties;

  return (
    <div className="tool-input-group w-full max-w-[280px] font-sans">
      {label && (
        <label className="tool-input-label" htmlFor={id}>
          {label}
        </label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            disabled={disabled}
            style={triggerStyles}
            className={`w-full h-12 bg-bg-surface border-[length:var(--border-width)] rounded-[var(--radius-sm)] px-4 flex items-center justify-between text-left font-sans text-sm transition-all focus:outline-none select-none cursor-pointer ${
              open
                ? "border-[color:var(--local-accent)] shadow-[var(--shadow-offset-sm)_var(--local-accent)] -translate-x-px -translate-y-px"
                : "border-border shadow-[var(--shadow-offset-sm)_var(--shadow-color)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[var(--shadow-offset-md)_var(--shadow-color)]"
            } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            {value ? (
              <span className="text-text-primary">{formatDate(value)}</span>
            ) : (
              <span className="text-text-muted italic">{placeholder}</span>
            )}
            <CalendarIcon className="w-4 h-4 text-text-muted flex-shrink-0" />
          </button>
        </PopoverTrigger>
        
        <PopoverContent
          className="w-auto p-0 border-[length:var(--border-width)] border-border bg-bg-card rounded-[var(--radius-lg)] shadow-[var(--shadow-offset-lg)_var(--shadow-color)]"
          align="start"
        >
          <div style={{ "--accent-utility-a": activeAccent } as React.CSSProperties}>
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setOpen(false); // Auto close
              }}
              disabled={(date) => {
                if (minDate && date < minDate) return true;
                if (maxDate && date > maxDate) return true;
                return false;
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
