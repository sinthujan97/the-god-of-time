"use client";

import React, { useState, useEffect } from "react";
import { useAccentColor } from "@/lib/context/AccentColorContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BirthDatePickerProps {
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

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default function BirthDatePicker({
  value,
  onChange,
  label,
  accentColor,
  disabled = false,
  minDate,
  maxDate,
  id,
}: BirthDatePickerProps) {
  const contextAccent = useAccentColor();
  const activeAccent = accentColor || contextAccent || "#C5F135";

  const [month, setMonth] = useState<number | undefined>(value?.getMonth());
  const [day, setDay] = useState<number | undefined>(value?.getDate());
  const [year, setYear] = useState<number | undefined>(value?.getFullYear());

  // Stay in sync if the value is changed externally (e.g. a default date set on mount).
  useEffect(() => {
    setMonth(value?.getMonth());
    setDay(value?.getDate());
    setYear(value?.getFullYear());
  }, [value]);

  const maxYear = maxDate?.getFullYear() ?? new Date().getFullYear();
  const minYear = minDate?.getFullYear() ?? maxYear - 120;
  const years: number[] = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  const dayCount = month !== undefined && year !== undefined ? daysInMonth(year, month) : 31;
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);

  const commit = (nextMonth?: number, nextDay?: number, nextYear?: number) => {
    if (nextMonth === undefined || nextDay === undefined || nextYear === undefined) {
      onChange(undefined);
      return;
    }
    const clampedDay = Math.min(nextDay, daysInMonth(nextYear, nextMonth));
    onChange(new Date(nextYear, nextMonth, clampedDay));
  };

  // Clamp the selected day if switching month/year makes it invalid (e.g. 31 -> February).
  useEffect(() => {
    if (month === undefined || year === undefined || day === undefined) return;
    const max = daysInMonth(year, month);
    if (day > max) {
      setDay(max);
      commit(month, max, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const triggerClass =
    "h-12 bg-bg-surface border-[length:var(--border-width)] border-border rounded-[var(--radius-sm)] px-3 font-sans text-sm shadow-[var(--shadow-offset-sm)_var(--shadow-color)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[var(--shadow-offset-md)_var(--shadow-color)] focus-visible:border-[color:var(--local-accent)] focus-visible:shadow-[var(--shadow-offset-sm)_var(--local-accent)] transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

  return (
    <div
      className="tool-input-group w-full max-w-[360px] font-sans"
      style={{ "--local-accent": activeAccent } as React.CSSProperties}
    >
      {label && (
        <span className="tool-input-label" id={id ? `${id}-label` : undefined}>
          {label}
        </span>
      )}
      <div className="grid grid-cols-[1.4fr_1fr_1.2fr] gap-2" role="group" aria-labelledby={id ? `${id}-label` : undefined}>
        <Select
          value={month !== undefined ? String(month) : ""}
          onValueChange={(val) => {
            const m = Number(val);
            setMonth(m);
            commit(m, day, year);
          }}
          disabled={disabled}
        >
          <SelectTrigger className={`${triggerClass} w-full`}>
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={String(i)}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={day !== undefined ? String(day) : ""}
          onValueChange={(val) => {
            const d = Number(val);
            setDay(d);
            commit(month, d, year);
          }}
          disabled={disabled}
        >
          <SelectTrigger className={`${triggerClass} w-full`}>
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            {days.map((d) => (
              <SelectItem key={d} value={String(d)}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={year !== undefined ? String(year) : ""}
          onValueChange={(val) => {
            const y = Number(val);
            setYear(y);
            commit(month, day, y);
          }}
          disabled={disabled}
        >
          <SelectTrigger className={`${triggerClass} w-full`}>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
