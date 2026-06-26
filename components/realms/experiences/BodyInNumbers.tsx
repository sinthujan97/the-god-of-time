"use client";

import React, { useEffect, useState } from "react";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "body-in-numbers")!;

const BODY_STATS = [
  { id: "heartbeats",    label: "Heartbeats",      calculate: (s: number) => s * 1.2,              unit: "beats",   description: "At average 72 bpm",                  color: "var(--accent-utility-e)", icon: "♥",  format: "integer" as const },
  { id: "breaths",       label: "Breaths Taken",   calculate: (s: number) => s * 0.267,            unit: "breaths", description: "At average 16 per minute",            color: "var(--accent-cosmos)",     icon: "∿",  format: "integer" as const },
  { id: "blinks",        label: "Eye Blinks",      calculate: (s: number) => s * 0.267,            unit: "blinks",  description: "15–20 per minute average",           color: "var(--accent-utility-a)", icon: "◡",  format: "integer" as const },
  { id: "blood",         label: "Blood Pumped",    calculate: (s: number) => s * 0.083,            unit: "litres",  description: "5 litres per minute",                color: "var(--accent-utility-e)", icon: "◈",  format: "decimal" as const },
  { id: "cells",         label: "Cells Replaced",  calculate: (s: number) => s * 3800000,          unit: "cells",   description: "3.8 million per second",             color: "var(--accent-scifi)",      icon: "⬡",  format: "integer" as const },
  { id: "steps",         label: "Steps Walked",    calculate: (s: number) => (s / 86400) * 8000,   unit: "steps",   description: "8,000 steps per day average",        color: "var(--accent-bio)",        icon: "⊣",  format: "integer" as const },
  { id: "sleep",         label: "Hours Slept",     calculate: (s: number) => (s / 3600) * 0.333,   unit: "hours",   description: "8 hours per night",                  color: "var(--accent-whim)",       icon: "◑",  format: "decimal" as const },
  { id: "words",         label: "Words Spoken",    calculate: (s: number) => (s / 60) * 130,       unit: "words",   description: "If talking 60% of waking hours",     color: "var(--accent-destiny)",    icon: "◉",  format: "integer" as const },
  { id: "dreams",        label: "Dreams Dreamed",  calculate: (s: number) => (s / 86400) * 4,      unit: "dreams",  description: "4 dreams per sleep cycle",           color: "var(--accent-scifi)",      icon: "⋯",  format: "integer" as const },
];

function formatVal(n: number, fmt: "integer" | "decimal"): string {
  if (n >= 1e12) { const e = Math.floor(Math.log10(n)); return `${(n / Math.pow(10, e)).toFixed(1)} × 10^${e}`; }
  if (fmt === "decimal") return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return Math.floor(n).toLocaleString();
}

export default function BodyInNumbers() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [secondsAlive, setSecondsAlive] = useState(0);
  const [visible, setVisible] = useState<boolean[]>(Array(BODY_STATS.length).fill(true));

  useEffect(() => {
    if (!birthDate) return;
    const base = (Date.now() - birthDate.getTime()) / 1000;
    setSecondsAlive(base);

    const interval = setInterval(() => {
      setSecondsAlive(s => s + 1);
      setVisible(prev => prev.map(() => false));
      requestAnimationFrame(() => {
        setTimeout(() => setVisible(prev => prev.map(() => true)), 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [birthDate]);

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%" }}>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            Enter your birthdate to see live counters of everything your body has done since birth
          </p>
          <input
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={birthDate ? birthDate.toISOString().slice(0, 10) : ""}
            onChange={e => setBirthDate(e.target.value ? new Date(e.target.value) : null)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px 20px",
              fontFamily: "var(--font-mono)",
              fontSize: 15,
              color: "var(--text-primary)",
              cursor: "pointer",
              outline: "none"
            }}
          />
        </div>
      }
      resultsZone={
        birthDate ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, width: "100%" }}>
            {BODY_STATS.map((stat, i) => {
              const val = stat.calculate(secondsAlive);
              return (
                <div key={stat.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderTop: `3px solid ${stat.color}`, borderRadius: 10, padding: 20, height: 160, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18, color: stat.color }}>{stat.icon}</span>
                    <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>{stat.label}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 26, color: "var(--text-primary)", opacity: visible[i] ? 1 : 0, transition: "opacity 80ms", lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>
                      {formatVal(val, stat.format)}
                    </div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, textTransform: "uppercase", color: "var(--text-muted)", marginTop: 2 }}>{stat.unit}</div>
                  </div>
                  <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)" }}>{stat.description}</div>
                </div>
              );
            })}
          </div>
        ) : null
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "30vh", background: "var(--bg-base)" }}>
        {/* Dot grid background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "radial-gradient(circle, rgba(75,142,241,0.12) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        {!birthDate && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "30vh", fontFamily: "var(--font-ui)", color: "var(--text-muted)", fontSize: 14 }}>
            Please select a date to initialize biological trackers.
          </div>
        )}
      </div>

      <FloatingPanel id="body-controls" title="YOUR BIOLOGY" defaultPosition="top-right">
        <PanelDisplay label="SECONDS ALIVE" value={secondsAlive > 0 ? Math.floor(secondsAlive).toLocaleString() : "—"} large />
        <PanelDisplay label="MINUTES ALIVE" value={secondsAlive > 0 ? Math.floor(secondsAlive / 60).toLocaleString() : "—"} />
        <PanelDisplay label="HOURS ALIVE" value={secondsAlive > 0 ? (secondsAlive / 3600).toFixed(1) : "—"} />
      </FloatingPanel>
    </RealmLayout>
  );
}
