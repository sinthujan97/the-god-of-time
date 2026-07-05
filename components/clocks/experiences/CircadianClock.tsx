"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "circadian-clock")!;

interface Zone {
  start: number;
  end: number;
  label: string;
  color: string;
  desc: string;
}

const ZONES: Zone[] = [
  { start: 0,  end: 5,  label: "Deep Sleep",        color: "var(--border)",           desc: "Core restorative sleep. Melatonin high, body repair active." },
  { start: 5,  end: 7,  label: "Light Sleep",        color: "var(--text-faint)",       desc: "Sleep lightens. Core temperature rising. Easy to wake." },
  { start: 7,  end: 9,  label: "Rising Alertness",   color: "var(--accent-utility-d)", desc: "Cortisol peaks. Short-term memory and analytical thinking rise." },
  { start: 9,  end: 12, label: "Peak Focus",         color: "var(--accent-utility-a)", desc: "Optimal window for deep cognitive work, writing, and problem solving." },
  { start: 12, end: 14, label: "Post-Lunch Dip",     color: "var(--accent-utility-d)", desc: "Alertness drops. Natural nap window — 20 minutes is most restorative." },
  { start: 14, end: 17, label: "Afternoon Energy",   color: "var(--accent-utility-a)", desc: "Reaction time and muscle strength peak. Best for physical tasks." },
  { start: 17, end: 20, label: "Evening Wind-Down",  color: "var(--accent-utility-d)", desc: "Body temperature falls. Social and creative tasks suit this window." },
  { start: 20, end: 22, label: "Pre-Sleep",          color: "var(--text-faint)",       desc: "Melatonin rises strongly. Avoid bright screens and stimulants." },
  { start: 22, end: 24, label: "Deep Sleep",         color: "var(--border)",           desc: "Core restorative sleep. Melatonin high, body repair active." },
];

const LEGEND_ZONES = [
  { label: "Deep Sleep",       color: "var(--border)" },
  { label: "Light Sleep",      color: "var(--text-faint)" },
  { label: "Rising Alertness", color: "var(--accent-utility-d)" },
  { label: "Peak Focus",       color: "var(--accent-utility-a)" },
  { label: "Post-Lunch Dip",   color: "var(--accent-utility-d)" },
  { label: "Afternoon Energy", color: "var(--accent-utility-a)" },
  { label: "Evening Wind-Down",color: "var(--accent-utility-d)" },
  { label: "Pre-Sleep",        color: "var(--text-faint)" },
];

function hourToRad(h: number): number {
  return ((h / 24) * 360 - 90) * Math.PI / 180;
}

function donutArc(s: number, e: number, ro: number, ri: number, cx: number, cy: number): string {
  const sa = hourToRad(s), ea = hourToRad(e);
  const large = (e - s) > 12 ? 1 : 0;
  const x1 = (cx + ro * Math.cos(sa)).toFixed(3);
  const y1 = (cy + ro * Math.sin(sa)).toFixed(3);
  const x2 = (cx + ro * Math.cos(ea)).toFixed(3);
  const y2 = (cy + ro * Math.sin(ea)).toFixed(3);
  const x3 = (cx + ri * Math.cos(ea)).toFixed(3);
  const y3 = (cy + ri * Math.sin(ea)).toFixed(3);
  const x4 = (cx + ri * Math.cos(sa)).toFixed(3);
  const y4 = (cy + ri * Math.sin(sa)).toFixed(3);
  return `M${x1},${y1} A${ro},${ro} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${ri},${ri} 0 ${large},0 ${x4},${y4}Z`;
}

function findZone(eh: number): Zone {
  return ZONES.find((z) => eh >= z.start && eh < z.end) ?? ZONES[ZONES.length - 1];
}

const HOUR_LABELS = [
  { h: 0, label: "12am" }, { h: 6, label: "6am" },
  { h: 12, label: "12pm" }, { h: 18, label: "6pm" },
];

const CHRONO_LABELS: Record<number, string> = {
  "-2": "Early Bird", "-1": "Slightly Early", "0": "Neutral",
  "1": "Slightly Late", "2": "Night Owl",
};

export default function CircadianClock() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date(2026, 0, 1, 12, 0, 0));
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(iv);
  }, []);

  const cx = 110, cy = 110, ro = 98, ri = 60, mid = (ro + ri) / 2;
  const clockH = now.getHours() + now.getMinutes() / 60;
  const effectiveH = ((clockH - offset) + 24) % 24;
  const currentZone = findZone(effectiveH);
  const dotAngle = hourToRad(clockH);
  const dotX = (cx + mid * Math.cos(dotAngle)).toFixed(3);
  const dotY = (cy + mid * Math.sin(dotAngle)).toFixed(3);

  return (
    <ClockLayout clock={clock}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, padding: "28px 24px", alignItems: "center", justifyContent: "center" }}>
          {/* Arc SVG */}
          <svg width={220} height={220} style={{ flexShrink: 0, overflow: "visible" }}>
            {ZONES.map((z, i) => (
              <path
                key={i}
                d={donutArc(z.start, z.end, ro, ri, cx, cy)}
                fill={z.color}
                opacity={currentZone.label === z.label ? 1 : 0.38}
                stroke="var(--bg-card)"
                strokeWidth={1.5}
              />
            ))}
            {/* Tick marks */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = hourToRad(i);
              const isQ = i % 6 === 0;
              const x1 = (cx + (ro + 3) * Math.cos(a)).toFixed(3);
              const y1 = (cy + (ro + 3) * Math.sin(a)).toFixed(3);
              const x2 = (cx + (ro + (isQ ? 10 : 6)) * Math.cos(a)).toFixed(3);
              const y2 = (cy + (ro + (isQ ? 10 : 6)) * Math.sin(a)).toFixed(3);
              return (
                <line key={i}
                  x1={x1} y1={y1}
                  x2={x2} y2={y2}
                  stroke="var(--border)" strokeWidth={isQ ? 2 : 1}
                />
              );
            })}
            {/* Hour labels */}
            {HOUR_LABELS.map(({ h, label }) => {
              const a = hourToRad(h);
              const lx = (cx + (ro + 22) * Math.cos(a)).toFixed(3);
              const ly = (cy + (ro + 22) * Math.sin(a)).toFixed(3);
              return (
                <text key={h}
                  x={lx}
                  y={ly}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={9} fontWeight={700} fill="var(--text-muted)" fontFamily="var(--font-mono)"
                >
                  {label}
                </text>
              );
            })}
            {/* Now dot */}
            <circle cx={dotX} cy={dotY} r={8} fill="var(--section-clocks-accent)" stroke="var(--bg-card)" strokeWidth={2.5} />
            {/* Center text */}
            <text x={cx} y={cy - 9} textAnchor="middle" dominantBaseline="middle"
              fontSize={13} fontWeight={700} fill="var(--text-primary)" fontFamily="var(--font-mono)">
              {mounted ? String(now.getHours()).padStart(2, "0") : "--"}:{mounted ? String(now.getMinutes()).padStart(2, "0") : "--"}
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle"
              fontSize={8} fontWeight={700} fill="var(--text-muted)" fontFamily="var(--font-mono)">
              NOW
            </text>
          </svg>

          {/* Info panel */}
          <div style={{ flex: 1, minWidth: 180, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ border: "2px solid var(--border)", borderRadius: 8, padding: "14px 16px", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--section-clocks-accent)", marginBottom: 5 }}>
                Your Body Is In
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.15, marginBottom: 8 }}>
                {currentZone.label}
              </p>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.55 }}>
                {currentZone.desc}
              </p>
            </div>
            {/* Compact legend */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px" }}>
              {LEGEND_ZONES.map((z) => (
                <div key={z.label} style={{ display: "flex", alignItems: "center", gap: 6, opacity: currentZone.label === z.label ? 1 : 0.45 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: z.color, flexShrink: 0, border: "1px solid var(--border)" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: "var(--text-muted)", lineHeight: 1.2 }}>{z.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chronotype slider */}
        <div style={{ borderTop: "2px solid var(--border)", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>Chronotype</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, color: "var(--section-clocks-accent)" }}>
              {CHRONO_LABELS[offset]}{offset !== 0 ? ` (${offset > 0 ? "+" : ""}${offset}h shift)` : ""}
            </span>
          </div>
          <input type="range" min={-2} max={2} step={1} value={offset}
            onChange={(e) => setOffset(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--section-clocks-accent)", cursor: "pointer" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)" }}>Early Bird ←</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-faint)" }}>→ Night Owl</span>
          </div>
        </div>
      </div>
    </ClockLayout>
  );
}
