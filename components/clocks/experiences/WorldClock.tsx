"use client";

import React, { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clockDef = clocksRegistry.find((c) => c.id === "world-clock")!;

const TZ_OPTIONS = [
  { value: "America/Los_Angeles", label: "Los Angeles (US Pacific Time)", city: "Los Angeles", country: "USA", code: "PT" },
  { value: "America/Denver", label: "Denver (US Mountain Time)", city: "Denver", country: "USA", code: "MT" },
  { value: "America/Chicago", label: "Chicago (US Central Time)", city: "Chicago", country: "USA", code: "CT" },
  { value: "America/New_York", label: "New York (US Eastern Time)", city: "New York", country: "USA", code: "ET" },
  { value: "America/Sao_Paulo", label: "São Paulo (Brasília Time)", city: "São Paulo", country: "Brazil", code: "BRT" },
  { value: "UTC", label: "UTC / GMT (Coordinated Universal Time)", city: "UTC", country: "Global", code: "UTC" },
  { value: "Europe/London", label: "London (Greenwich Mean Time)", city: "London", country: "UK", code: "GMT" },
  { value: "Europe/Paris", label: "Paris (Central European Time)", city: "Paris", country: "France", code: "CET" },
  { value: "Europe/Berlin", label: "Berlin (Central European Time)", city: "Berlin", country: "Germany", code: "CET" },
  { value: "Europe/Moscow", label: "Moscow (Moscow Time)", city: "Moscow", country: "Russia", code: "MSK" },
  { value: "Asia/Dubai", label: "Dubai (Gulf Standard Time)", city: "Dubai", country: "UAE", code: "GST" },
  { value: "Asia/Kolkata", label: "Kolkata / Mumbai (India Standard Time)", city: "Kolkata", country: "India", code: "IST" },
  { value: "Asia/Singapore", label: "Singapore (Singapore Time)", city: "Singapore", country: "Singapore", code: "SGT" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (Hong Kong Time)", city: "Hong Kong", country: "Hong Kong", code: "HKT" },
  { value: "Asia/Tokyo", label: "Tokyo (Japan Standard Time)", city: "Tokyo", country: "Japan", code: "JST" },
  { value: "Asia/Seoul", label: "Seoul (Korea Standard Time)", city: "Seoul", country: "South Korea", code: "KST" },
  { value: "Australia/Perth", label: "Perth (Australian Western Time)", city: "Perth", country: "Australia", code: "AWST" },
  { value: "Australia/Sydney", label: "Sydney (Australian Eastern Time)", city: "Sydney", country: "Australia", code: "AEST" },
  { value: "Pacific/Auckland", label: "Auckland (New Zealand Time)", city: "Auckland", country: "New Zealand", code: "NZST" },
];

const STORAGE_KEY = "world_clocks_v2";

type PinnedClock = {
  id: string;
  tz: string;
  mode: "digital" | "analog";
};

const DEFAULT_CLOCKS: PinnedClock[] = [
  { id: "local-clock", tz: "local", mode: "digital" },
  { id: "ny-clock", tz: "America/New_York", mode: "analog" },
  { id: "london-clock", tz: "Europe/London", mode: "digital" },
  { id: "tokyo-clock", tz: "Asia/Tokyo", mode: "analog" },
];

// Helper to pad numbers
const pad = (n: number) => String(n).padStart(2, "0");

// Helper to resolve timezone name
const resolveTzName = (tz: string) => {
  if (tz === "local") {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  }
  return tz;
};

// SVG Analog Face
function AnalogFace({ h, m, s }: { h: number; m: number; s: number }) {
  const cx = 75, cy = 75, r = 68;
  function drawHand(deg: number, len: number, w: number, color: string) {
    const angle = (deg - 90) * Math.PI / 180;
    return (
      <line
        x1={cx}
        y1={cy}
        x2={cx + len * Math.cos(angle)}
        y2={cy + len * Math.sin(angle)}
        stroke={color}
        strokeWidth={w}
        strokeLinecap="round"
      />
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
      <svg width={150} height={150}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={2.5} />
        {Array.from({ length: 12 }, (_, i) => {
          const angle = ((i / 12) * 360 - 90) * Math.PI / 180;
          const inner = r - 8;
          return (
            <line
              key={i}
              x1={cx + inner * Math.cos(angle)}
              y1={cy + inner * Math.sin(angle)}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="var(--border)"
              strokeWidth={2}
            />
          );
        })}
        {/* Hour, Minute, Second hands */}
        {drawHand(((h % 12 + m / 60) / 12) * 360, 38, 4.5, "var(--text-primary)")}
        {drawHand(((m + s / 60) / 60) * 360, 52, 2.5, "var(--text-primary)")}
        {drawHand((s / 60) * 360, 56, 1.25, "var(--section-clocks-accent)")}
        <circle cx={cx} cy={cy} r={4.5} fill="var(--section-clocks-accent)" />
        <circle cx={cx} cy={cy} r={1.5} fill="var(--bg-card)" />
      </svg>
    </div>
  );
}

export default function WorldClock() {
  const [clocks, setClocks] = useState<PinnedClock[]>([]);
  const [newTz, setNewTz] = useState<string>("UTC");
  const [tick, setTick] = useState(0);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setClocks(JSON.parse(saved));
      } else {
        setClocks(DEFAULT_CLOCKS);
      }
    } catch {
      setClocks(DEFAULT_CLOCKS);
    }
  }, []);

  // Save to local storage
  const saveClocks = (updated: PinnedClock[]) => {
    setClocks(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Clock tick timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addClock = () => {
    if (clocks.length >= 6) return;
    const resolvedNewTz = newTz;
    const newId = `${resolvedNewTz}-${Date.now()}`;
    const updated = [...clocks, { id: newId, tz: resolvedNewTz, mode: "digital" as const }];
    saveClocks(updated);
  };

  const removeClock = (id: string) => {
    const updated = clocks.filter((c) => c.id !== id);
    saveClocks(updated);
  };

  const toggleMode = (id: string) => {
    const updated = clocks.map((c) => {
      if (c.id === id) {
        return { ...c, mode: c.mode === "digital" ? ("analog" as const) : ("digital" as const) };
      }
      return c;
    });
    saveClocks(updated);
  };

  const moveClock = (index: number, direction: -1 | 1) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= clocks.length) return;
    const updated = [...clocks];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    saveClocks(updated);
  };

  // Calculations for each timezone clock
  const getClockData = (tzKey: string) => {
    const tzResolved = resolveTzName(tzKey);
    try {
      const now = new Date();
      // Parse timezone target time components
      const targetFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tzResolved,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });
      const parts = targetFormatter.formatToParts(now);
      const year = Number(parts.find((p) => p.type === "year")?.value ?? 0);
      const month = Number(parts.find((p) => p.type === "month")?.value ?? 0);
      const day = Number(parts.find((p) => p.type === "day")?.value ?? 0);
      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const second = Number(parts.find((p) => p.type === "second")?.value ?? 0);

      const targetLocal = new Date(year, month - 1, day, hour, minute, second);

      // Relative difference in hours to system local timezone
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: localTz,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
      });
      const localParts = localFormatter.formatToParts(now);
      const ly = Number(localParts.find((p) => p.type === "year")?.value ?? 0);
      const lm = Number(localParts.find((p) => p.type === "month")?.value ?? 0);
      const ld = Number(localParts.find((p) => p.type === "day")?.value ?? 0);
      const lh = Number(localParts.find((p) => p.type === "hour")?.value ?? 0);
      const lmin = Number(localParts.find((p) => p.type === "minute")?.value ?? 0);
      const lsec = Number(localParts.find((p) => p.type === "second")?.value ?? 0);
      const localLocal = new Date(ly, lm - 1, ld, lh, lmin, lsec);

      const diffMs = targetLocal.getTime() - localLocal.getTime();
      const offsetHours = Math.round((diffMs / 3600000) * 10) / 10;

      // GMT Offset string
      const offsetFormatter = new Intl.DateTimeFormat("en-US", { timeZone: tzResolved, timeZoneName: "shortOffset" });
      const offsetParts = offsetFormatter.formatToParts(now);
      const gmtOffsetStr = offsetParts.find((p) => p.type === "timeZoneName")?.value ?? "UTC";

      // Daylight info
      const isDay = hour >= 6 && hour < 18;

      // Business hours (9 AM - 5 PM, Mon-Fri)
      const dayOfWeek = targetLocal.getDay(); // 0 = Sun, 6 = Sat
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isBusinessHours = isWeekday && hour >= 9 && hour < 17;

      // Geolocation info from curated list
      const curated = TZ_OPTIONS.find((t) => t.value === tzKey);
      const cityName = tzKey === "local" ? "Local Time" : curated?.city ?? tzKey.split("/").pop()?.replace("_", " ") ?? "Unknown City";
      const countryName = tzKey === "local" ? "Your Device Location" : curated?.country ?? "Global";
      const zoneCode = curated?.code ?? gmtOffsetStr;

      return {
        h: hour,
        m: minute,
        s: second,
        timeString: `${pad(hour)}:${pad(minute)}:${pad(second)}`,
        dateString: targetLocal.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        offsetHours,
        gmtOffsetStr,
        isDay,
        isBusinessHours,
        cityName,
        countryName,
        zoneCode,
      };
    } catch {
      const now = new Date();
      return {
        h: now.getHours(),
        m: now.getMinutes(),
        s: now.getSeconds(),
        timeString: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
        dateString: now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        offsetHours: 0,
        gmtOffsetStr: "UTC",
        isDay: now.getHours() >= 6 && now.getHours() < 18,
        isBusinessHours: now.getDay() >= 1 && now.getDay() <= 5 && now.getHours() >= 9 && now.getHours() < 17,
        cityName: tzKey === "local" ? "Local Time" : tzKey.split("/").pop()?.replace("_", " ") ?? "Unknown",
        countryName: "Global",
        zoneCode: "UTC",
      };
    }
  };

  return (
    <ClockLayout
      clock={clockDef}
      controlsSection={
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
                Select Location to Pin
              </span>
              <select
                value={newTz}
                onChange={(e) => setNewTz(e.target.value)}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 14,
                  fontWeight: 600,
                  padding: "8px 12px",
                  border: "2px solid var(--border)",
                  borderRadius: 6,
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  height: 40,
                }}
              >
                <option value="local">📍 Local Time (Auto-resolved)</option>
                {TZ_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={addClock}
              disabled={clocks.length >= 6}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                padding: "0 18px",
                height: 40,
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: "var(--section-clocks-accent)",
                color: "#000000",
                cursor: clocks.length >= 6 ? "not-allowed" : "pointer",
                boxShadow: clocks.length >= 6 ? "none" : "2px 2px 0 var(--shadow-color)",
                opacity: clocks.length >= 6 ? 0.5 : 1,
                alignSelf: "flex-end",
                letterSpacing: "0.08em",
              }}
            >
              + ADD CLOCK
            </button>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>
            {clocks.length} OF 6 CLOCKS ACTIVE
          </div>
        </div>
      }
    >
      <div style={{ padding: "32px 16px", minHeight: 380 }}>
        {clocks.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-muted)", textAlign: "center" }}>
              Pin up to 6 locations above to build your custom global clock array.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 24,
            }}
          >
            {clocks.map((c, idx) => {
              const data = getClockData(c.tz);
              return (
                <div
                  key={c.id}
                  style={{
                    background: "var(--bg-surface)",
                    border: "2.5px solid var(--border)",
                    borderRadius: 12,
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    boxShadow: "4px 4px 0 var(--shadow-color)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                >
                  {/* Top Bar inside card */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        {data.cityName}
                      </h3>
                      <p style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", margin: "2px 0 0" }}>
                        {data.countryName} · <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>{data.zoneCode}</span>
                      </p>
                    </div>
                    {/* Delete and Reorder buttons */}
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      <button
                        onClick={() => moveClock(idx, -1)}
                        disabled={idx === 0}
                        title="Move Left/Up"
                        style={{
                          width: 22,
                          height: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1.5px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--bg-card)",
                          color: "var(--text-primary)",
                          fontSize: 9,
                          cursor: idx === 0 ? "not-allowed" : "pointer",
                          opacity: idx === 0 ? 0.3 : 1,
                        }}
                      >
                        ◀
                      </button>
                      <button
                        onClick={() => moveClock(idx, 1)}
                        disabled={idx === clocks.length - 1}
                        title="Move Right/Down"
                        style={{
                          width: 22,
                          height: 22,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1.5px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--bg-card)",
                          color: "var(--text-primary)",
                          fontSize: 9,
                          cursor: idx === clocks.length - 1 ? "not-allowed" : "pointer",
                          opacity: idx === clocks.length - 1 ? 0.3 : 1,
                        }}
                      >
                        ▶
                      </button>
                      <button
                        onClick={() => removeClock(c.id)}
                        title="Remove Clock"
                        style={{
                          width: 22,
                          height: 22,
                          marginLeft: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1.5px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--destructive)",
                          color: "#000000",
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          cursor: "pointer",
                          boxShadow: "1px 1px 0 var(--shadow-color)",
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Main Display Area (Digital or Analog) */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 170,
                      border: "2px dashed var(--border-subtle)",
                      borderRadius: 8,
                      background: "var(--bg-card)",
                      padding: "10px",
                      margin: "6px 0 14px",
                    }}
                  >
                    {c.mode === "analog" ? (
                      <AnalogFace h={data.h} m={data.m} s={data.s} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 0" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 34,
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            letterSpacing: "0.02em",
                            lineHeight: 1,
                          }}
                        >
                          {data.timeString}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 12,
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            marginTop: 8,
                            letterSpacing: "0.05em",
                          }}
                        >
                          {data.dateString}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Stats Card Info */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", justifyContent: "space-between" }}>
                    {/* Relative offset text */}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--text-muted)",
                      }}
                    >
                      {data.offsetHours === 0
                        ? "LOCAL TIME"
                        : data.offsetHours > 0
                        ? `${data.offsetHours} HRS AHEAD`
                        : `${Math.abs(data.offsetHours)} HRS BEHIND`}
                    </span>

                    {/* Quick badges */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {/* Day/Night */}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          border: "1.5px solid var(--border)",
                          borderRadius: 4,
                          background: data.isDay ? "var(--section-clocks-accent)" : "var(--border)",
                          color: data.isDay ? "#000000" : "var(--text-primary)",
                        }}
                      >
                        {data.isDay ? "☀️ DAY" : "🌙 NIGHT"}
                      </span>

                      {/* Work hours */}
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 9,
                          fontWeight: 700,
                          padding: "2px 6px",
                          border: "1.5px solid var(--border)",
                          borderRadius: 4,
                          background: data.isBusinessHours ? "var(--accent-utility-a)" : "var(--bg-surface)",
                          color: data.isBusinessHours ? "#000000" : "var(--text-muted)",
                        }}
                      >
                        {data.isBusinessHours ? "💼 WORK" : "🏠 OFF"}
                      </span>
                    </div>
                  </div>

                  {/* Mode Selector Button */}
                  <button
                    onClick={() => toggleMode(c.id)}
                    style={{
                      marginTop: 14,
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "6px 12px",
                      border: "2px solid var(--border)",
                      borderRadius: 6,
                      background: "var(--bg-surface)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      boxShadow: "2px 2px 0 var(--shadow-color)",
                      textAlign: "center",
                      letterSpacing: "0.05em",
                      transition: "transform 0.08s, box-shadow 0.08s",
                    }}
                    onMouseDown={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translate(1px, 1px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "1px 1px 0 var(--shadow-color)";
                    }}
                    onMouseUp={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.transform = "";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0 var(--shadow-color)";
                    }}
                  >
                    SWITCH TO {c.mode === "digital" ? "ANALOG" : "DIGITAL"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
