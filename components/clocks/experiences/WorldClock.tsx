"use client";

import { useState, useEffect, useMemo } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";
import { calculateNextDSTTransition, type DSTTransitionEvent } from "@/lib/tools/calculations";

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

// A fixed reference list for the always-visible "Time Right Now" strip below —
// unlike the user's pinned clocks (empty until the client hydrates and reads
// localStorage), this renders unconditionally so crawlers and first paint see
// real city/time content instead of nothing.
const REFERENCE_CITIES = [
  "local",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "America/Sao_Paulo",
  "Pacific/Auckland",
];

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

// Helper to format a Date as a local YYYY-MM-DD string (not toISOString, which is UTC and can drift near midnight)
function toInputDateLocal(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Intl.DateTimeFormat instances are expensive to construct — with up to 10
// pinned clocks re-rendering every second, reconstructing them per-tick was
// a real recurring main-thread cost. Cache one instance per timezone instead.
const partsFormatterCache = new Map<string, Intl.DateTimeFormat>();
function getPartsFormatter(timeZone: string) {
  let f = partsFormatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    partsFormatterCache.set(timeZone, f);
  }
  return f;
}

const offsetFormatterCache = new Map<string, Intl.DateTimeFormat>();
function getOffsetFormatter(timeZone: string) {
  let f = offsetFormatterCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "shortOffset" });
    offsetFormatterCache.set(timeZone, f);
  }
  return f;
}

// Builds the digital time string, optionally with a 12-hour AM/PM suffix
function formatDisplayTime(h: number, m: number, s: number, use12h: boolean): { timeString: string; ampm: string | null } {
  if (!use12h) return { timeString: `${pad(h)}:${pad(m)}:${pad(s)}`, ampm: null };
  const displayH = h % 12 === 0 ? 12 : h % 12;
  return { timeString: `${pad(displayH)}:${pad(m)}:${pad(s)}`, ampm: h < 12 ? "AM" : "PM" };
}

// SVG Analog Face
function AnalogFace({ h, m, s, size = 150 }: { h: number; m: number; s: number; size?: number }) {
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
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4px 0" }}>
      <svg width={size} height={size} viewBox="0 0 150 150">
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

// Sound Synthesis for split-flap clicks
let lastClickTime = 0;
let splitFlapAudioCtx: AudioContext | null = null;
function getSplitFlapAudioCtx(): AudioContext | null {
  if (splitFlapAudioCtx) return splitFlapAudioCtx;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return null;
  splitFlapAudioCtx = new AudioContextClass();
  return splitFlapAudioCtx;
}
function playSplitFlapClick() {
  try {
    const now = Date.now();
    if (now - lastClickTime < 35) return;
    lastClickTime = now;

    const ctx = getSplitFlapAudioCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {}
}

const ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-+·.";

// Split-Flap Character Card Component
function SplitFlapChar({ char, color = "var(--text-primary)", glow = false, animate = true }: { char: string; color?: string; glow?: boolean; animate?: boolean }) {
  const [displayChar, setDisplayChar] = useState(char);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (char === displayChar) return;

    let currentVal = displayChar;
    const interval = setInterval(() => {
      let currentIdx = ALPHABET.indexOf(currentVal);
      if (currentIdx === -1) currentIdx = 0;
      
      const nextIdx = (currentIdx + 1) % ALPHABET.length;
      const nextChar = ALPHABET[nextIdx];
      
      currentVal = nextChar;
      setDisplayChar(nextChar);
      setIsFlipping(true);
      playSplitFlapClick();

      // Clear flip flag quickly to reset transition triggers for next step
      setTimeout(() => setIsFlipping(false), 20);

      if (nextChar === char) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [char]);

  return (
    <div
      style={{
        position: "relative",
        width: "var(--flap-w)",
        height: "var(--flap-h)",
        background: "#18181A",
        border: "1.5px solid var(--border)",
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxShadow: "1px 1px 0px var(--shadow-color)",
        perspective: "100px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--flap-fs)",
          fontWeight: 900,
          color: glow ? "var(--section-clocks-accent)" : color,
          lineHeight: 1,
        }}
      >
        {displayChar}
      </span>

      {/* Horizontal divider line in the middle */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "calc(50% - 0.75px)",
          height: 1.5,
          background: "#000000",
          opacity: 0.8,
        }}
      />

      {/* Flipping card flap animation overlay */}
      {isFlipping && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: "50%",
            background: "#18181A",
            borderBottom: "1.5px solid #000000",
            transformOrigin: "bottom center",
            animation: "flipCardAnim 0.025s ease-in-out forwards",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--flap-fs)",
              fontWeight: 900,
              color: glow ? "var(--section-clocks-accent)" : color,
              transform: "translateY(var(--flap-y))",
              lineHeight: 1,
            }}
          >
            {char}
          </span>
        </div>
      )}
    </div>
  );
}

// Split-Flap Word Wrapper Component
function SplitFlapWord({ word, length, color = "var(--text-primary)", glow = false, animate = true }: { word: string; length: number; color?: string; glow?: boolean; animate?: boolean }) {
  const chars = word.toUpperCase().padEnd(length, " ").slice(0, length).split("");
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {chars.map((char, idx) => (
        <SplitFlapChar key={idx} char={char} color={color} glow={glow} animate={animate} />
      ))}
    </div>
  );
}

export default function WorldClock() {
  const [clocks, setClocks] = useState<PinnedClock[]>([]);
  const [newTz, setNewTz] = useState<string>("UTC");
  const [, setTick] = useState(0);
  const [use12Hour, setUse12Hour] = useState(false);
  const [dstDateStr, setDstDateStr] = useState("2026-01-01");

  const [displayMode, setDisplayMode] = useState<"grid" | "split-flap">("grid");
  const [activePage, setActivePage] = useState(0);
  const [pageChanging, setPageChanging] = useState(false);

  const [isFs, setIsFs] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  // Monitor fullscreen status
  useEffect(() => {
    const handler = () => {
      const active = !!document.fullscreenElement || 
                     document.body.classList.contains("fallback-fullscreen-active") || 
                     !!document.querySelector(".fullscreen-active");
      setIsFs(active);
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    const iv = setInterval(handler, 400);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
      clearInterval(iv);
    };
  }, []);

  // Monitor screen orientation
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Load 12h/24h preference from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("world_clock_use12h");
      if (saved !== null) setUse12Hour(saved === "1");
    } catch {}
    setDstDateStr(toInputDateLocal(new Date()));
  }, []);

  const toggleUse12Hour = () => {
    setUse12Hour((prev) => {
      const next = !prev;
      try { localStorage.setItem("world_clock_use12h", next ? "1" : "0"); } catch {}
      return next;
    });
  };

  // Load display mode preference
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("world_clock_display_mode");
      if (savedMode === "grid" || savedMode === "split-flap") {
        setDisplayMode(savedMode as any);
      }
    } catch {}
  }, []);

  const changeDisplayMode = (mode: "grid" | "split-flap") => {
    setDisplayMode(mode);
    try {
      localStorage.setItem("world_clock_display_mode", mode);
    } catch {}
  };

  // Auto-cycle pages for split-flap board
  useEffect(() => {
    if (displayMode !== "split-flap") return;
    const totalPages = Math.ceil(clocks.length / 3);
    if (totalPages <= 1) {
      setActivePage(0);
      return;
    }
    const timer = setInterval(() => {
      setActivePage((prev) => (prev + 1) % totalPages);
    }, 8000);
    return () => clearInterval(timer);
  }, [displayMode, clocks.length]);

  // Lock animation flipping only during activePage shifts
  useEffect(() => {
    setPageChanging(true);
    const timer = setTimeout(() => {
      setPageChanging(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [activePage]);

  // Clock tick timer — also throttles dstDateStr to update at most once/day
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
      const today = toInputDateLocal(new Date());
      setDstDateStr((prev) => (prev === today ? prev : today));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addClock = () => {
    if (clocks.length >= 10) return;
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
  const getClockData = (tzKey: string, use12h: boolean) => {
    const tzResolved = resolveTzName(tzKey);
    try {
      const now = new Date();
      // Parse timezone target time components
      const parts = getPartsFormatter(tzResolved).formatToParts(now);
      const year = Number(parts.find((p) => p.type === "year")?.value ?? 0);
      const month = Number(parts.find((p) => p.type === "month")?.value ?? 0);
      const day = Number(parts.find((p) => p.type === "day")?.value ?? 0);
      const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
      const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const second = Number(parts.find((p) => p.type === "second")?.value ?? 0);

      const targetLocal = new Date(year, month - 1, day, hour, minute, second);

      // Relative difference in hours to system local timezone
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const localParts = getPartsFormatter(localTz).formatToParts(now);
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
      const offsetParts = getOffsetFormatter(tzResolved).formatToParts(now);
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
        ...formatDisplayTime(hour, minute, second, use12h),
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
        ...formatDisplayTime(now.getHours(), now.getMinutes(), now.getSeconds(), use12h),
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

  // DST-transition lookup for all pinned cities, recomputed at most once/day
  const dstInfoByTz = useMemo(() => {
    const map: Record<string, { hasDSTSystem: boolean; activeTransition: DSTTransitionEvent | null; currentStatusLabel: string } | null> = {};
    for (const c of clocks) {
      const resolved = resolveTzName(c.tz);
      if (map[resolved] !== undefined) continue;
      try {
        map[resolved] = calculateNextDSTTransition(resolved, dstDateStr);
      } catch {
        map[resolved] = null;
      }
    }
    return map;
  }, [clocks, dstDateStr]);

  let cols = 1;
  let rows = 1;
  const N = clocks.length;

  if (isFs && N > 0) {
    if (isPortrait) {
      if (N === 1) { cols = 1; rows = 1; }
      else if (N === 2) { cols = 1; rows = 2; }
      else if (N === 3) { cols = 1; rows = 3; }
      else if (N === 4) { cols = 2; rows = 2; }
      else if (N <= 6) { cols = 2; rows = 3; }
      else if (N <= 8) { cols = 2; rows = 4; }
      else { cols = 2; rows = 5; }
    } else {
      if (N === 1) { cols = 1; rows = 1; }
      else if (N === 2) { cols = 2; rows = 1; }
      else if (N === 3) { cols = 3; rows = 1; }
      else if (N === 4) { cols = 2; rows = 2; }
      else if (N <= 6) { cols = 3; rows = 2; }
      else if (N <= 8) { cols = 4; rows = 2; }
      else { cols = 5; rows = 2; }
    }
  }

  return (
    <ClockLayout
      clock={clockDef}
      noScale={true}
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
              disabled={clocks.length >= 10}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                padding: "0 18px",
                height: 40,
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: "var(--section-clocks-accent)",
                color: "var(--section-clocks-text-on-accent)",
                cursor: clocks.length >= 10 ? "not-allowed" : "pointer",
                boxShadow: clocks.length >= 10 ? "none" : "2px 2px 0 var(--shadow-color)",
                opacity: clocks.length >= 10 ? 0.5 : 1,
                alignSelf: "flex-end",
                letterSpacing: "0.08em",
              }}
            >
              + ADD CLOCK
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={toggleUse12Hour}
              title="Toggle 12-hour / 24-hour time format for all pinned clocks"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                padding: "6px 14px",
                border: "2px solid var(--border)",
                borderRadius: 6,
                background: use12Hour ? "var(--section-clocks-accent)" : "transparent",
                color: use12Hour ? "var(--section-clocks-text-on-accent)" : "var(--text-muted)",
                cursor: "pointer",
                boxShadow: use12Hour ? "2px 2px 0 var(--shadow-color)" : "none",
                letterSpacing: "0.05em",
              }}
            >
              {use12Hour ? "12H" : "24H"}
            </button>
            <div style={{ display: "flex", background: "var(--bg-surface)", border: "2px solid var(--border)", borderRadius: 6, padding: "2px", alignItems: "center" }}>
              <button
                onClick={() => changeDisplayMode("grid")}
                style={{
                  padding: "4px 10px",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: displayMode === "grid" ? "var(--section-clocks-accent)" : "transparent",
                  color: displayMode === "grid" ? "#000000" : "var(--text-muted)",
                }}
              >
                GRID
              </button>
              <button
                onClick={() => changeDisplayMode("split-flap")}
                style={{
                  padding: "4px 10px",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: displayMode === "split-flap" ? "var(--section-clocks-accent)" : "transparent",
                  color: displayMode === "split-flap" ? "#000000" : "var(--text-muted)",
                }}
              >
                BOARD ✈️
              </button>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)", fontWeight: 700 }}>
              {clocks.length} OF 10 CLOCKS ACTIVE
            </div>
          </div>
        </div>
      }
    >
      <div style={isFs ? { padding: "12px", height: "100%", width: "100%", boxSizing: "border-box" } : { padding: "32px 16px", minHeight: 380 }}>
        {!isFs && (
          <div
            style={{
              marginBottom: 24,
              background: "var(--bg-surface)",
              border: "1.5px solid var(--border-subtle)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
                display: "block",
                marginBottom: 10,
              }}
            >
              Time Right Now — Major Cities
            </span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "8px 16px" }}>
              {REFERENCE_CITIES.map((tzKey) => {
                const data = getClockData(tzKey, use12Hour);
                return (
                  <div key={tzKey} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)" }}>{data.cityName}</span>
                    <span
                      suppressHydrationWarning
                      style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}
                    >
                      {data.timeString}{data.ampm ? ` ${data.ampm}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {clocks.length === 0 ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 260 }}>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 15, color: "var(--text-muted)", textAlign: "center" }}>
              Pin up to 10 locations above to build your custom global clock array.
            </p>
          </div>
        ) : displayMode === "split-flap" ? (
          <div
            style={{
              width: "100%",
              height: isFs ? "100%" : "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
            }}
          >
            <div
              className={`split-flap-board-container ${isFs ? "board-fs-active" : ""}`}
              style={{
                width: "100%",
                maxWidth: isFs ? "none" : 780,
                height: isFs ? "100%" : "auto",
                background: "#080809",
                border: isFs ? "none" : "3px solid #1A1A1A",
                borderRadius: isFs ? 0 : 12,
                padding: isFs ? "48px" : "20px 24px",
                boxShadow: isFs ? "none" : "6px 6px 0 var(--shadow-color)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxSizing: "border-box",
                justifyContent: isFs ? "center" : "flex-start",
              }}
            >
              {/* Dynamic CSS Keyframes & responsive classes */}
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes flipCardAnim {
                  0% { transform: rotateX(0deg); }
                  100% { transform: rotateX(-90deg); }
                }
                .fullscreen-active {
                  background: #080809 !important;
                }
                .split-flap-board-container {
                  --flap-w: 18px;
                  --flap-h: 28px;
                  --flap-fs: 14px;
                  --flap-y: 6px;
                }
                .board-fs-active {
                  --flap-w: 32px !important;
                  --flap-h: 52px !important;
                  --flap-fs: 28px !important;
                  --flap-y: 13px !important;
                }
                @media (max-width: 768px) {
                  .split-flap-board-container {
                    --flap-w: 13px !important;
                    --flap-h: 20px !important;
                    --flap-fs: 10px !important;
                    --flap-y: 4px !important;
                  }
                  .hide-mobile {
                    display: none !important;
                  }
                  .grid-board-row {
                    grid-template-columns: 1.2fr 1fr !important;
                  }
                }
              `}} />

              {/* Board Header Status Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #222", paddingBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 16 }}>✈️</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: isFs ? 18 : 13, fontWeight: 800, color: "var(--section-clocks-accent)", letterSpacing: "0.1em" }}>
                    DEPARTURES & LOCAL TIMES
                  </span>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase" }}>
                  Terminal Gate 1A
                </div>
              </div>

              {/* Column Titles */}
              <div className="grid-board-row grid-board-row-sub" style={{ display: "grid", gridTemplateColumns: "1.8fr 3.4fr", gap: 8, padding: "0 8px", borderBottom: "1.5px solid #222", paddingBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Time Zone / Region</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Current Time & Info</span>
              </div>

              {/* The 3 Board Rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: isFs ? 20 : 10 }}>
                {(() => {
                  const startIdx = activePage * 3;
                  const pageClocks = clocks.slice(startIdx, startIdx + 3);
                  const boardRows = Array.from({ length: 3 }, (_, i) => pageClocks[i] || null);

                  return boardRows.map((c, idx) => {
                    if (!c) {
                      return (
                        <div
                          key={`row-${idx}`}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                            padding: "10px 8px",
                            opacity: 0.2,
                            borderBottom: idx < boardRows.length - 1 ? "1.5px solid #222" : "none",
                          }}
                        >
                          {/* Line 1 empty */}
                          <div
                            className="grid-board-row"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1.8fr 1.6fr 0.6fr 1.2fr",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <SplitFlapWord word=".........." length={10} color="var(--text-faint)" />
                            <SplitFlapWord word="........" length={8} color="var(--text-faint)" />
                            <div className="hide-mobile">
                              <SplitFlapWord word=".." length={2} color="var(--text-faint)" />
                            </div>
                            <div className="hide-mobile">
                              <SplitFlapWord word="......" length={6} color="var(--text-faint)" />
                            </div>
                          </div>

                          {/* Line 2 empty */}
                          <div
                            className="grid-board-row grid-board-row-sub"
                            style={{
                              display: "grid",
                              gridTemplateColumns: "3.45fr 1.75fr",
                              gap: 8,
                              alignItems: "center",
                            }}
                          >
                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 10 }}>📍</span>
                              <SplitFlapWord word="......................" length={22} color="var(--text-faint)" />
                            </div>
                            <div className="hide-mobile" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                              <span style={{ fontSize: 10 }}>💼</span>
                              <SplitFlapWord word="......" length={6} color="var(--text-faint)" />
                            </div>
                          </div>
                        </div>
                      );
                    }

                    const data = getClockData(c.tz, use12Hour);
                    
                    let statusText = "WORK";
                    let statusColor = "var(--accent-utility-a)"; // lime
                    if (!data.isBusinessHours) {
                      statusText = "OFF";
                      statusColor = "var(--accent-utility-d)"; // soft amber
                    }
                    if (data.h >= 22 || data.h < 6) {
                      statusText = "SLEEP";
                      statusColor = "var(--accent-utility-e)"; // dim gray
                    } else if (data.h === 12 || data.h === 13) {
                      statusText = "LUNCH";
                      statusColor = "var(--section-clocks-accent)"; // orange
                    }

                    const cityString = data.cityName.toUpperCase();
                    const cleanTimeStr = data.timeString;
                    const ampmStr = data.ampm ? data.ampm.toUpperCase() : "  ";

                    const offsetStr = data.offsetHours === 0
                      ? "LOCAL"
                      : `${data.offsetHours >= 0 ? "+" : ""}${data.offsetHours.toFixed(1)}H`.padEnd(6, " ");

                    const locationString = `${data.countryName.toUpperCase()} - ${data.zoneCode.toUpperCase()}`;

                    return (
                      <div
                        key={`row-${idx}`}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          padding: "10px 8px",
                          borderBottom: idx < boardRows.length - 1 ? "1.5px solid #222" : "none",
                        }}
                      >
                        {/* Line 1 */}
                        <div
                          className="grid-board-row"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "1.8fr 1.6fr 0.6fr 1.2fr",
                            gap: 8,
                            alignItems: "center",
                          }}
                        >
                          <SplitFlapWord word={cityString} length={10} />
                          <SplitFlapWord word={cleanTimeStr} length={8} glow animate={pageChanging} />
                          <div className="hide-mobile">
                            <SplitFlapWord word={ampmStr} length={2} color="var(--text-muted)" />
                          </div>
                          <div className="hide-mobile">
                            <SplitFlapWord word={offsetStr} length={6} color="var(--text-muted)" />
                          </div>
                        </div>

                        {/* Line 2 */}
                        <div
                          className="grid-board-row grid-board-row-sub"
                          style={{
                            display: "grid",
                            gridTemplateColumns: "3.45fr 1.75fr",
                            gap: 8,
                            alignItems: "center",
                            opacity: 0.85,
                          }}
                        >
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 10 }}>📍</span>
                            <SplitFlapWord word={locationString} length={22} color="var(--text-muted)" />
                          </div>
                          <div className="hide-mobile" style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ fontSize: 10 }}>💼</span>
                            <SplitFlapWord word={statusText} length={6} color={statusColor} />
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* Board Footer Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #222", paddingTop: 14, marginTop: 4 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-faint)" }}>
                  PAGE {Math.min(activePage + 1, Math.ceil(clocks.length / 3))} OF {Math.ceil(clocks.length / 3) || 1}
                </span>

                {/* Manual Page Selector */}
                {Math.ceil(clocks.length / 3) > 1 && (
                  <div style={{ display: "flex", gap: 6 }}>
                    {Array.from({ length: Math.ceil(clocks.length / 3) }).map((_, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setActivePage(pIdx)}
                        style={{
                          width: 22,
                          height: 22,
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          fontWeight: 700,
                          border: "1.5px solid var(--border)",
                          borderRadius: 4,
                          cursor: "pointer",
                          background: activePage === pIdx ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                          color: activePage === pIdx ? "#000000" : "var(--text-primary)",
                          transition: "background 0.1s",
                        }}
                      >
                        {pIdx + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div
            style={isFs ? {
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: 12,
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            } : {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 340px))",
              justifyContent: "center",
              gap: 24,
              width: "100%",
            }}
          >
            {clocks.map((c, idx) => {
              const data = getClockData(c.tz, use12Hour);
              const dst = dstInfoByTz[resolveTzName(c.tz)];
              const dstSoon = !!(dst?.hasDSTSystem && dst.activeTransition && dst.activeTransition.daysRemaining <= 7);
              // Calculate responsive text size based on grid height
              const titleSize = isFs ? (rows >= 3 ? 14 : 16) : 18;
              const subTitleSize = isFs ? 10 : 11;
              const digitalTimeSize = isFs ? (rows === 1 ? 48 : rows === 2 ? 32 : 22) : 34;
              const digitalDateSize = isFs ? 10 : 12;

              return (
                <div
                  key={c.id}
                  style={{
                    background: "var(--bg-surface)",
                    border: "2.5px solid var(--border)",
                    borderRadius: 12,
                    padding: isFs ? "12px" : "20px",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    boxShadow: isFs ? "none" : "4px 4px 0 var(--shadow-color)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    height: "100%",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                  }}
                >
                  {/* Top Bar inside card */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isFs ? 4 : 12 }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-display)", fontSize: titleSize, fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                        {data.cityName}
                      </h3>
                      <p style={{ fontFamily: "var(--font-ui)", fontSize: subTitleSize, color: "var(--text-muted)", margin: "2px 0 0" }}>
                        {data.countryName} · <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>{data.zoneCode}</span>
                      </p>
                    </div>
                    {/* Delete and Reorder buttons - hidden in fullscreen mode to keep view clean */}
                    {!isFs && (
                      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                        <button
                          onClick={() => moveClock(idx, -1)}
                          disabled={idx === 0}
                          title="Move Left/Up"
                          style={{
                            width: 44,
                            height: 44,
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
                            width: 44,
                            height: 44,
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
                            width: 44,
                            height: 44,
                            marginLeft: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1.5px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--destructive)",
                            color: "var(--section-clocks-text-on-accent)",
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
                    )}
                  </div>

                  {/* Main Display Area (Digital or Analog) */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: isFs ? 0 : (c.mode === "analog" ? 170 : 100),
                      border: "2px dashed var(--border-subtle)",
                      borderRadius: 8,
                      background: "var(--bg-card)",
                      padding: isFs ? "4px" : "10px",
                      margin: isFs ? "4px 0" : "6px 0 14px",
                    }}
                  >
                    {c.mode === "analog" ? (
                      <AnalogFace h={data.h} m={data.m} s={data.s} size={isFs ? (rows >= 3 ? 75 : rows === 2 ? 100 : 135) : 150} />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: isFs ? "8px 0" : "20px 0" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: digitalTimeSize,
                              fontWeight: 700,
                              color: "var(--text-primary)",
                              letterSpacing: "0.02em",
                              lineHeight: 1,
                            }}
                          >
                            {data.timeString}
                          </span>
                          {data.ampm && (
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: digitalDateSize + 2,
                                fontWeight: 700,
                                color: "var(--text-muted)",
                              }}
                            >
                              {data.ampm}
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: digitalDateSize,
                            fontWeight: 700,
                            color: "var(--text-muted)",
                            marginTop: isFs ? 4 : 8,
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
                          background: data.isDay ? "var(--section-clocks-accent)" : "var(--bg-surface)",
                          color: data.isDay ? "var(--section-clocks-text-on-accent)" : "var(--text-primary)",
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
                          color: data.isBusinessHours ? "var(--section-clocks-text-on-accent)" : "var(--text-muted)",
                        }}
                      >
                        {data.isBusinessHours ? "💼 WORK" : "🏠 OFF"}
                      </span>

                      {/* DST transition heads-up */}
                      {dstSoon && dst?.activeTransition && (
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 6px",
                            border: "1.5px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--accent-utility-d)",
                            color: "var(--section-clocks-text-on-accent)",
                          }}
                        >
                          ⏰ {dst.activeTransition.typeOfShift === "forward" ? "SPRINGS FWD" : "FALLS BACK"} {dst.activeTransition.daysRemaining}D
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Mode Selector Button - hidden in fullscreen to keep it minimal and neat */}
                  {!isFs && (
                    <button
                      onClick={() => toggleMode(c.id)}
                      style={{
                        marginTop: 14,
                        minHeight: 44,
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
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ClockLayout>
  );
}
