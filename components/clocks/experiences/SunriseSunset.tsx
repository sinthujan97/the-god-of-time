"use client";

import { useState, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Bell, BellRing } from "lucide-react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "sunrise-sunset")!;

interface City { name: string; lat: number; lng: number; tz: string; }

const CITIES: City[] = [
  { name: "London",       lat:  51.5074,  lng:  -0.1278,   tz: "Europe/London" },
  { name: "New York",     lat:  40.7128,  lng: -74.0060,   tz: "America/New_York" },
  { name: "Los Angeles",  lat:  34.0522,  lng: -118.2437,  tz: "America/Los_Angeles" },
  { name: "Chicago",      lat:  41.8781,  lng: -87.6298,   tz: "America/Chicago" },
  { name: "Toronto",      lat:  43.6532,  lng: -79.3832,   tz: "America/Toronto" },
  { name: "São Paulo",    lat: -23.5505,  lng: -46.6333,   tz: "America/Sao_Paulo" },
  { name: "Mexico City",  lat:  19.4326,  lng: -99.1332,   tz: "America/Mexico_City" },
  { name: "Paris",        lat:  48.8566,  lng:   2.3522,   tz: "Europe/Paris" },
  { name: "Berlin",       lat:  52.5200,  lng:  13.4050,   tz: "Europe/Berlin" },
  { name: "Istanbul",     lat:  41.0082,  lng:  28.9784,   tz: "Europe/Istanbul" },
  { name: "Moscow",       lat:  55.7558,  lng:  37.6173,   tz: "Europe/Moscow" },
  { name: "Cairo",        lat:  30.0444,  lng:  31.2357,   tz: "Africa/Cairo" },
  { name: "Dubai",        lat:  25.2048,  lng:  55.2708,   tz: "Asia/Dubai" },
  { name: "Mumbai",       lat:  19.0760,  lng:  72.8777,   tz: "Asia/Kolkata" },
  { name: "Singapore",    lat:   1.3521,  lng: 103.8198,   tz: "Asia/Singapore" },
  { name: "Beijing",      lat:  39.9042,  lng: 116.4074,   tz: "Asia/Shanghai" },
  { name: "Tokyo",        lat:  35.6762,  lng: 139.6503,   tz: "Asia/Tokyo" },
  { name: "Seoul",        lat:  37.5665,  lng: 126.9780,   tz: "Asia/Seoul" },
  { name: "Sydney",       lat: -33.8688,  lng: 151.2093,   tz: "Australia/Sydney" },
  { name: "Reykjavik",    lat:  64.1355,  lng: -21.8954,   tz: "Atlantic/Reykjavik" },
];

function calcSunTimes(lat: number, lng: number, date: Date) {
  const JD = date.getTime() / 86400000 + 2440587.5;
  const T = (JD - 2451545.0) / 36525;
  const L0 = ((280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360 + 360) % 360;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);
  const sunLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const sunAppLon = sunLon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  const e0 = 23 + 26 / 60 + 21.448 / 3600 - T * (46.8150 + T * (0.00059 - T * 0.001813)) / 3600;
  const ec = e0 + 0.00256 * Math.cos(omega * Math.PI / 180);
  const ecRad = ec * Math.PI / 180;
  const decRad = Math.asin(Math.sin(ecRad) * Math.sin(sunAppLon * Math.PI / 180));
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
  const y = Math.tan(ecRad / 2) ** 2;
  const L0rad = L0 * Math.PI / 180;
  const eqTime = 4 * (180 / Math.PI) * (
    y * Math.sin(2 * L0rad) - 2 * e * Math.sin(Mrad)
    + 4 * e * y * Math.sin(Mrad) * Math.cos(2 * L0rad)
    - 0.5 * y * y * Math.sin(4 * L0rad) - 1.25 * e * e * Math.sin(2 * Mrad)
  );
  const latRad = lat * Math.PI / 180;
  const cosHA = Math.cos(90.833 * Math.PI / 180) / (Math.cos(latRad) * Math.cos(decRad)) - Math.tan(latRad) * Math.tan(decRad);
  const base = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const noonMin = 720 - 4 * lng - eqTime;
  const noon = new Date(base.getTime() + noonMin * 60000);
  if (cosHA < -1 || cosHA > 1) return { sunrise: null, sunset: null, noon, polar: cosHA < -1 ? "night" : "day" };
  const HA = Math.acos(cosHA) * 180 / Math.PI;
  return {
    sunrise: new Date(base.getTime() + (noonMin - HA * 4) * 60000),
    sunset:  new Date(base.getTime() + (noonMin + HA * 4) * 60000),
    noon,
    polar: null,
  };
}

function fmtTime(d: Date, tz: string) {
  return d.toLocaleTimeString("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: true });
}

function msToHm(ms: number) {
  const m = Math.round(Math.abs(ms) / 60000);
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
}

function msToHms(ms: number) {
  const totalSec = Math.max(0, Math.floor(Math.abs(ms) / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function toInputDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type BellPref = { enabled: boolean; minutesBefore: number };
type BellPrefs = { sunrise: BellPref; sunset: BellPref };
const DEFAULT_BELL_PREFS: BellPrefs = {
  sunrise: { enabled: false, minutesBefore: 15 },
  sunset: { enabled: false, minutesBefore: 15 },
};

function BellButton({ pref, onToggle, onMinutesChange }: { pref: BellPref; onToggle: () => void; onMinutesChange: (m: number) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <select
        value={pref.minutesBefore}
        onChange={(e) => onMinutesChange(Number(e.target.value))}
        style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, padding: "2px 4px", border: "1.5px solid var(--border)", borderRadius: 4, background: "var(--bg-surface)", color: "var(--text-muted)", cursor: "pointer" }}
      >
        {[5, 10, 15, 30, 60].map((m) => <option key={m} value={m}>{m}m</option>)}
      </select>
      <button
        onClick={onToggle}
        title={pref.enabled ? "Alert enabled — click to disable" : "Get notified before this event"}
        style={{
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1.5px solid var(--border)",
          borderRadius: 4,
          background: pref.enabled ? "var(--section-clocks-accent)" : "var(--bg-card)",
          color: pref.enabled ? "var(--section-clocks-text-on-accent)" : "var(--text-muted)",
          cursor: "pointer",
          boxShadow: pref.enabled ? "1px 1px 0 var(--shadow-color)" : "none",
          transition: "transform 0.08s, box-shadow 0.08s",
        }}
        onMouseDown={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(1px, 1px)"; }}
        onMouseUp={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = ""; }}
      >
        {pref.enabled ? <BellRing size={13} /> : <Bell size={13} />}
      </button>
    </div>
  );
}

function TimeRow({ label, time, tz, note, accent, trailing }: { label: string; time: Date | null; tz: string; note?: string; accent?: string; trailing?: ReactNode }) {
  if (!time) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", padding: "11px 0", borderBottom: "1px solid var(--border-subtle)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: accent ?? "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
        {note && <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)" }}>{note}</span>}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginLeft: 16 }}>{fmtTime(time, tz)}</span>
      {trailing && <div style={{ marginLeft: 10, display: "flex", alignItems: "center" }}>{trailing}</div>}
    </div>
  );
}

export default function SunriseSunset() {
  const [cityIdx, setCityIdx] = useState(0);
  const [now, setNow] = useState(new Date(2026, 0, 1, 12, 0, 0));
  const [viewDateStr, setViewDateStr] = useState("2026-01-01");
  const [bellPrefs, setBellPrefs] = useState<BellPrefs>(DEFAULT_BELL_PREFS);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const idx = CITIES.findIndex((c) => c.tz === tz);
      if (idx !== -1) setCityIdx(idx);
    } catch {}
    const today = new Date();
    setNow(today);
    setViewDateStr(toInputDate(today));
    try {
      const saved = localStorage.getItem("sunrise_sunset_bell_prefs");
      if (saved) setBellPrefs(JSON.parse(saved));
    } catch {}
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  function toggleBell(target: "sunrise" | "sunset") {
    setBellPrefs((prev) => {
      const next = { ...prev, [target]: { ...prev[target], enabled: !prev[target].enabled } };
      try { localStorage.setItem("sunrise_sunset_bell_prefs", JSON.stringify(next)); } catch {}
      return next;
    });
    try { if (Notification.permission === "default") Notification.requestPermission(); } catch {}
  }

  function setBellMinutes(target: "sunrise" | "sunset", minutes: number) {
    setBellPrefs((prev) => {
      const next = { ...prev, [target]: { ...prev[target], minutesBefore: minutes } };
      try { localStorage.setItem("sunrise_sunset_bell_prefs", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const city = CITIES[cityIdx];

  const { sunrise, sunset, noon, polar } = useMemo(() => {
    const parts = viewDateStr.split("-").map(Number);
    const y = parts[0] || 2026, mo = parts[1] || 1, d = parts[2] || 1;
    const viewDate = new Date(y, mo - 1, d, 12, 0, 0);
    return calcSunTimes(city.lat, city.lng, viewDate);
  }, [city.lat, city.lng, viewDateStr]);

  const isViewingToday = viewDateStr === toInputDate(now);
  const nowMs = now.getTime();

  const goldenMorningEnd  = sunrise ? new Date(sunrise.getTime() + 30 * 60000) : null;
  const blueMorning       = sunrise ? new Date(sunrise.getTime() - 20 * 60000) : null;
  const goldenEveStart    = sunset  ? new Date(sunset.getTime()  - 30 * 60000) : null;
  const blueEvening       = sunset  ? new Date(sunset.getTime()  + 20 * 60000) : null;

  const dayMs = sunrise && sunset ? sunset.getTime() - sunrise.getTime() : null;
  const msTilSunset  = sunset  ? sunset.getTime()  - nowMs : null;
  const msTilSunrise = sunrise ? sunrise.getTime() - nowMs : null;

  const dayPct = sunrise && sunset && dayMs
    ? Math.max(0, Math.min(100, (nowMs - sunrise.getTime()) / dayMs * 100))
    : null;

  const tz = city.tz;

  // Sunrise/sunset notification bell — only ever fires while viewing today
  useEffect(() => {
    if (!isViewingToday) return;
    (["sunrise", "sunset"] as const).forEach((key) => {
      const pref = bellPrefs[key];
      if (!pref.enabled) return;
      const target = key === "sunrise" ? sunrise : sunset;
      if (!target) return;
      const msUntil = target.getTime() - now.getTime();
      const fireKey = `${key}-${viewDateStr}`;
      if (msUntil >= 0 && msUntil <= pref.minutesBefore * 60000 && !firedRef.current.has(fireKey)) {
        firedRef.current.add(fireKey);
        try {
          if (Notification.permission === "granted") {
            new Notification(`${key === "sunrise" ? "Sunrise" : "Sunset"} in ~${pref.minutesBefore} min`, {
              body: `${city.name} — ${key} at ${fmtTime(target, city.tz)}`,
            });
          }
        } catch {}
      }
    });
  }, [now, bellPrefs, sunrise, sunset, isViewingToday, viewDateStr, city.name, city.tz]);

  return (
    <ClockLayout clock={clock} controlsSection={
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>City</span>
            <select
              value={cityIdx}
              onChange={(e) => setCityIdx(Number(e.target.value))}
              style={{ fontFamily: "var(--font-ui)", fontSize: 14, padding: "8px 12px", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4, cursor: "pointer" }}
            >
              {CITIES.map((c, i) => <option key={c.name} value={i}>{c.name}</option>)}
            </select>
          </label>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
            {city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°
          </p>
        </div>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Date</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="date"
              value={viewDateStr}
              min="1900-01-01"
              max="2100-12-31"
              onChange={(e) => setViewDateStr(e.target.value)}
              style={{ fontFamily: "var(--font-mono)", fontSize: 14, padding: "8px 12px", border: "2px solid var(--border)", background: "var(--bg-surface)", color: "var(--text-primary)", borderRadius: 4 }}
            />
            {!isViewingToday && (
              <button
                onClick={() => setViewDateStr(toInputDate(now))}
                style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--section-clocks-accent)", background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0 }}
              >
                Today
              </button>
            )}
          </div>
        </label>
      </div>
    }>
      <div style={{ padding: "36px 32px 32px", display: "flex", flexDirection: "column", gap: 8 }}>

        {polar === "day" && <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--section-clocks-accent)", textAlign: "center", padding: "32px 0" }}>☀️ Midnight sun — continuous daylight {isViewingToday ? "today" : "on this date"}</p>}
        {polar === "night" && <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-muted)", textAlign: "center", padding: "32px 0" }}>🌑 Polar night — no sunrise {isViewingToday ? "today" : "on this date"}</p>}

        {/* Day arc bar */}
        {sunrise && sunset && dayMs && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{fmtTime(sunrise, tz)}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>noon {fmtTime(noon, tz)}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>{fmtTime(sunset, tz)}</span>
            </div>
            <div style={{ position: "relative", height: 12, background: "var(--border)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right,#0d1b4b 0%,#e8660d 12%,#f5c842 25%,#87ceeb 35%,#87ceeb 65%,#f5c842 75%,#e8660d 88%,#0d1b4b 100%)", opacity: 0.7 }} />
              {isViewingToday && dayPct !== null && (
                <div style={{ position: "absolute", top: 0, bottom: 0, left: `${dayPct}%`, width: 3, background: "var(--text-primary)", borderRadius: 2, transform: "translateX(-50%)" }} />
              )}
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", marginTop: 6, textAlign: "center" }}>
              {msToHm(dayMs)} of daylight
              {isViewingToday && msTilSunset !== null && msTilSunset > 0 && ` · sunset in ${msToHms(msTilSunset)}`}
              {isViewingToday && msTilSunrise !== null && msTilSunrise > 0 && msTilSunset !== null && msTilSunset <= 0 && ` · sunrise in ${msToHms(msTilSunrise)}`}
            </p>
          </div>
        )}

        {/* Time rows */}
        <TimeRow label="Blue hour (morning)" time={blueMorning} tz={tz} note="Before golden hour — soft diffused light" />
        <TimeRow label="Sunrise" time={sunrise} tz={tz} accent="var(--section-clocks-accent)"
          note={isViewingToday && msTilSunrise !== null ? (msTilSunrise > 0 ? `in ${msToHms(msTilSunrise)}` : "passed") : undefined}
          trailing={<BellButton pref={bellPrefs.sunrise} onToggle={() => toggleBell("sunrise")} onMinutesChange={(m) => setBellMinutes("sunrise", m)} />} />
        <TimeRow label="Golden hour ends" time={goldenMorningEnd} tz={tz} accent="var(--accent-utility-d)" note="~30 min after sunrise" />
        <TimeRow label="Solar noon" time={noon} tz={tz} note="Sun at highest point" />
        <TimeRow label="Golden hour begins" time={goldenEveStart} tz={tz} accent="var(--accent-utility-d)" note="~30 min before sunset" />
        <TimeRow label="Sunset" time={sunset} tz={tz} accent="var(--section-clocks-accent)"
          note={isViewingToday && msTilSunset !== null ? (msTilSunset > 0 ? `in ${msToHms(msTilSunset)}` : "passed") : undefined}
          trailing={<BellButton pref={bellPrefs.sunset} onToggle={() => toggleBell("sunset")} onMinutesChange={(m) => setBellMinutes("sunset", m)} />} />
        <TimeRow label="Blue hour (evening)" time={blueEvening} tz={tz} note="~20 min after sunset" />
      </div>
    </ClockLayout>
  );
}
