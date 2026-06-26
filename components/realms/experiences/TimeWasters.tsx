"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

type Waster = {
  id: string;
  name: string;
  defaultHours: number; // hours per day
  description: string;
  icon: string;
  active: boolean;
};

const INITIAL_WASTERS: Waster[] = [
  { id: "social", name: "Social Media Scrolling", defaultHours: 2.5, description: "Instagram, TikTok, Twitter, Reddit feed scrolling.", icon: "📱", active: true },
  { id: "commute", name: "Commuting & Traffic", defaultHours: 1.2, description: "Sitting in traffic jams or waiting on subway platforms.", icon: "🚗", active: true },
  { id: "tv", name: "TV & Streaming Services", defaultHours: 3.0, description: "Netflix, YouTube, Twitch, and binge-watching shows.", icon: "📺", active: true },
  { id: "lost", name: "Searching for Lost Items", defaultHours: 0.25, description: "Looking for keys, phones, wallets, or misplaced socks.", icon: "🔑", active: true },
  { id: "loading", name: "Waiting for Tech to Load", defaultHours: 0.1, description: "Waiting for pages to load, apps to update, or Wi-Fi to reconnect.", icon: "⏳", active: false },
  { id: "deciding", name: "Deciding What to Eat", defaultHours: 0.4, description: "Staring into the open fridge, debating restaurant options.", icon: "🍕", active: true },
  { id: "meetings", name: "Unproductive Meetings", defaultHours: 1.0, description: "Meetings that could have been emails or text messages.", icon: "💼", active: false },
  { id: "overthinking", name: "Existential Worry & Overthinking", defaultHours: 0.75, description: "Staring at the ceiling rehearsing old conversations.", icon: "🌀", active: true },
];

const realm = realmsRegistry.find((r) => r.slug === "time-wasters")!;

export default function TimeWasters() {
  const [birthdate, setBirthdate] = useState("");
  const [birthDateObj, setBirthDateObj] = useState<Date | null>(null);
  const [wasters, setWasters] = useState<Waster[]>(INITIAL_WASTERS);
  const [durations, setDurations] = useState<Record<string, number>>({});

  // Particle canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ w: 0, h: 0 });
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<{ x: number; y: number; vy: number; size: number; color: string }[]>([]);

  useCanvasSize(
    canvasRef,
    useCallback((w: number, h: number) => {
      sizeRef.current = { w, h };
    }, [])
  );

  useEffect(() => {
    const initialDurs: Record<string, number> = {};
    INITIAL_WASTERS.forEach((w) => {
      initialDurs[w.id] = w.defaultHours;
    });
    setDurations(initialDurs);
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthdate) {
      setBirthDateObj(new Date(birthdate));
    }
  };

  const getDaysAlive = () => {
    if (!birthDateObj) return 0;
    return Math.floor((Date.now() - birthDateObj.getTime()) / 86400000);
  };

  const daysAlive = birthDateObj ? getDaysAlive() : 0;

  const toggleWaster = (id: string) => {
    setWasters((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const handleSliderChange = (id: string, val: number) => {
    setDurations((prev) => ({ ...prev, [id]: val }));
  };

  const calculateTimeSpent = (id: string) => {
    const dailyHours = durations[id] ?? 0;
    const totalHours = daysAlive * dailyHours;
    const totalDays = totalHours / 24;
    const totalYears = totalDays / 365.25;

    if (totalYears >= 1.0) {
      return `${totalYears.toFixed(2)} Years`;
    }
    const months = totalDays / 30.44;
    if (months >= 1.0) {
      return `${months.toFixed(1)} Months`;
    }
    return `${totalDays.toFixed(1)} Days`;
  };

  const getWasterHours = (id: string) => {
    const dailyHours = durations[id] ?? 0;
    return daysAlive * dailyHours;
  };

  const sortedWasters = [...wasters].sort((a, b) => {
    if (a.active && !b.active) return -1;
    if (!a.active && b.active) return 1;
    return getWasterHours(b.id) - getWasterHours(a.id);
  });

  const totalWastedHours = wasters
    .filter((w) => w.active)
    .reduce((sum, w) => sum + getWasterHours(w.id), 0);

  const totalWastedYears = totalWastedHours / 24 / 365.25;

  // Particle logic reflecting the waste rate
  const drawHourglass = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;
    if (w === 0 || h === 0) {
      rafRef.current = requestAnimationFrame(drawHourglass);
      return;
    }

    const isDark = !document.documentElement.classList.contains("light");
    ctx.clearRect(0, 0, w, h);

    // Rate of leak controls generation rate
    // If birthdate not entered, leak rate is low. Otherwise scale with totalWastedYears
    const currentDailyTotal = wasters
      .filter((w) => w.active)
      .reduce((sum, w) => sum + (durations[w.id] ?? w.defaultHours), 0);
    const spawnRate = Math.max(0.1, currentDailyTotal * 0.15);

    if (Math.random() < spawnRate && particlesRef.current.length < 250) {
      particlesRef.current.push({
        x: w / 2 + (Math.random() - 0.5) * 16,
        y: h * 0.2,
        vy: 1.5 + Math.random() * 2,
        size: 1.5 + Math.random() * 2.5,
        color: isDark ? "rgba(235, 178, 93, 0.7)" : "rgba(189, 131, 43, 0.6)",
      });
    }

    // Draw hourglass boundaries (minimalistic lines)
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)";
    ctx.lineWidth = 2;

    // Top half
    ctx.beginPath();
    ctx.moveTo(w / 2 - 50, h * 0.18);
    ctx.lineTo(w / 2 + 50, h * 0.18);
    ctx.lineTo(w / 2 - 8, h * 0.48);
    ctx.lineTo(w / 2 + 8, h * 0.48);
    ctx.stroke();

    // Bottom half
    ctx.beginPath();
    ctx.moveTo(w / 2 - 8, h * 0.52);
    ctx.lineTo(w / 2 + 8, h * 0.52);
    ctx.lineTo(w / 2 - 50, h * 0.82);
    ctx.lineTo(w / 2 + 50, h * 0.82);
    ctx.stroke();

    // Bottom platform
    ctx.beginPath();
    ctx.moveTo(w / 2 - 60, h * 0.82);
    ctx.lineTo(w / 2 + 60, h * 0.82);
    ctx.stroke();

    // Top platform
    ctx.beginPath();
    ctx.moveTo(w / 2 - 60, h * 0.18);
    ctx.lineTo(w / 2 + 60, h * 0.18);
    ctx.stroke();

    // Update and draw sand particles
    particlesRef.current.forEach((p, idx) => {
      p.y += p.vy;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Collision at bottom
      if (p.y > h * 0.81) {
        particlesRef.current.splice(idx, 1);
      }
    });

    rafRef.current = requestAnimationFrame(drawHourglass);
  }, [wasters, durations]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawHourglass);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawHourglass]);

  const inputZone = !birthDateObj ? (
    <form
      onSubmit={handleCalculate}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: 32,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        maxWidth: 480,
        margin: "0 auto"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>
          SELECT YOUR BIRTHDATE
        </label>
        <input
          type="date"
          value={birthdate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setBirthdate(e.target.value)}
          style={{
            height: 48,
            padding: "0 16px",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            color: "var(--text-primary)",
            cursor: "pointer",
            outline: "none"
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!birthdate}
        style={{
          height: 48,
          borderRadius: 8,
          background: birthdate ? "var(--accent-whim)" : "var(--border)",
          border: "none",
          color: birthdate ? "#ffffff" : "var(--text-faint)",
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          fontWeight: 600,
          cursor: birthdate ? "pointer" : "not-allowed",
          textTransform: "uppercase",
          transition: "all 150ms"
        }}
      >
        Analyze Time Leaks
      </button>
    </form>
  ) : null;

  const resultsZone = birthDateObj ? (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* Summary Banner */}
      <div
        style={{
          background: "color-mix(in srgb, var(--accent-utility-d) 15%, transparent)",
          border: "1px solid var(--accent-utility-d)",
          borderRadius: 12,
          padding: "24px 32px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)"
        }}
      >
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--accent-utility-d)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Total Leak Audit Results
        </span>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--text-primary)", margin: "8px 0 4px", fontWeight: 300 }}>
          {totalWastedYears.toFixed(2)} Years
        </h3>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          Spent on active checked activities over your {daysAlive.toLocaleString()} days on Earth.
        </p>
      </div>

      {/* Leaks list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sortedWasters.map((w) => {
          const hourVal = durations[w.id] ?? w.defaultHours;
          return (
            <div
              key={w.id}
              style={{
                background: "var(--bg-card)",
                border: `1px solid ${w.active ? "var(--border)" : "color-mix(in srgb, var(--border) 40%, transparent)"}`,
                borderRadius: 10,
                padding: 20,
                opacity: w.active ? 1.0 : 0.55,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "opacity 300ms, border-color 300ms"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{w.icon}</span>
                  <div>
                    <h4 style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{w.name}</h4>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)" }}>{w.description}</span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={w.active}
                  onChange={() => toggleWaster(w.id)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--accent-whim)" }}
                />
              </div>

              {w.active && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, borderTop: "1px solid var(--border-subtle)", paddingTop: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--text-muted)" }}>
                    <span>Adjust Daily Duration:</span>
                    <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent-whim)", fontWeight: 600 }}>{hourVal.toFixed(2)} hours/day</span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={8}
                    step={0.05}
                    value={hourVal}
                    onChange={(e) => handleSliderChange(w.id, Number(e.target.value))}
                    style={{ width: "100%", height: 4, cursor: "pointer", accentColor: "var(--accent-whim)" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 12, fontFamily: "var(--font-mono)" }}>
                    <span style={{ color: "var(--text-faint)" }}>CUMULATIVE WASTED:</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{calculateTimeSpent(w.id)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
        <button
          onClick={() => {
            setBirthDateObj(null);
            setBirthdate("");
            setWasters(INITIAL_WASTERS);
          }}
          style={{
            height: 48,
            padding: "0 30px",
            borderRadius: 8,
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            textTransform: "uppercase"
          }}
        >
          Reset Audit
        </button>
      </div>

    </div>
  ) : null;

  return (
    <RealmLayout realm={realm} hasInputZone={!birthDateObj} inputZone={inputZone} resultsZone={resultsZone}>
      <div style={{ position: "relative", width: "100%", height: "350px", background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      </div>

      {/* Floating telemetry panel */}
      {birthDateObj && (
        <FloatingPanel id="wasted-telemetry" title="LEAK TELEMETRY" defaultPosition="top-right">
          <PanelDisplay
            label="DAYS LEAKED"
            value={Math.floor(totalWastedHours / 24).toLocaleString()}
          />
          <PanelDisplay
            label="TOTAL HOURS LEAKED"
            value={Math.floor(totalWastedHours).toLocaleString()}
          />
        </FloatingPanel>
      )}
    </RealmLayout>
  );
}
