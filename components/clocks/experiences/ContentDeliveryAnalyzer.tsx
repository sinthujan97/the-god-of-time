"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "content-delivery-window")!;

const NETWORKS = [
  { id: "linkedin", name: "LinkedIn", icon: "💼", accent: "#0A66C2" },
  { id: "twitter", name: "X / Twitter", icon: "🐦", accent: "#000000" },
  { id: "tiktok", name: "TikTok", icon: "🎵", accent: "#FE2C55" },
  { id: "instagram", name: "Instagram", icon: "📸", accent: "#E1306C" },
  { id: "youtube", name: "YouTube", icon: "📺", accent: "#FF0000" },
];

// Region weights & offset from UTC
const REGIONS = [
  { name: "North America", offset: -5, weight: 0.40, color: "var(--accent-utility-a)" },
  { name: "Europe & Africa", offset: 1, weight: 0.30, color: "var(--accent-utility-d)" },
  { name: "Asia & Pacific", offset: 8, weight: 0.20, color: "var(--accent-utility-a)" },
  { name: "Latin America", offset: -3, weight: 0.10, color: "var(--text-faint)" },
];

export default function ContentDeliveryAnalyzer() {
  const [now, setNow] = useState<Date>(new Date("2026-07-03T12:00:00Z"));
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const utcHour = now.getUTCHours() + now.getUTCMinutes() / 60;

  // Get local hour for a given UTC offset
  const getLocalHour = (offset: number) => {
    return (utcHour + offset + 24) % 24;
  };

  // Activity coefficient based on network & local hour (0.0 to 1.0)
  const getActivityCoefficient = (networkId: string, localHour: number) => {
    switch (networkId) {
      case "linkedin":
        // Peaks: 8am-11am (business start), 2pm-5pm (afternoon slide)
        if (localHour >= 8 && localHour < 12) return 0.95;
        if (localHour >= 12 && localHour < 14) return 0.65;
        if (localHour >= 14 && localHour < 17) return 0.88;
        if (localHour >= 17 && localHour < 21) return 0.45;
        return 0.15;
      case "twitter":
        // General rolling day activity: 9am to 10pm steady, peaks around 12pm & 6pm
        if (localHour >= 9 && localHour < 22) {
          if (localHour >= 12 && localHour < 14) return 0.95;
          if (localHour >= 18 && localHour < 20) return 0.98;
          return 0.80;
        }
        return 0.25;
      case "tiktok":
        // Peak evening/afternoon activity: 4pm to 11pm
        if (localHour >= 16 && localHour < 23) return 0.95;
        if (localHour >= 12 && localHour < 16) return 0.70;
        if (localHour >= 23 || localHour < 2) return 0.50;
        return 0.15;
      case "instagram":
        // Lunch window: 11am-1pm, Evening window: 5pm-8pm, late-night scroll: 9pm-11pm
        if (localHour >= 11 && localHour < 14) return 0.90;
        if (localHour >= 17 && localHour < 23) {
          if (localHour >= 19 && localHour < 21) return 0.98;
          return 0.85;
        }
        if (localHour >= 14 && localHour < 17) return 0.60;
        return 0.20;
      case "youtube":
        // Gradual rise: peaks 12pm-9pm
        if (localHour >= 12 && localHour < 21) return 0.95;
        if (localHour >= 21 || localHour < 2) return 0.70;
        if (localHour >= 8 && localHour < 12) return 0.45;
        return 0.15;
      default:
        return 0.5;
    }
  };

  // Calculate weighted Algorithmic Heat Score
  let rawScore = 0;
  const regionalBreakdown = REGIONS.map((r) => {
    const localHour = getLocalHour(r.offset);
    const activity = getActivityCoefficient(selectedNetwork.id, localHour);
    const weighted = activity * r.weight;
    rawScore += weighted;

    // Check if awake (typically 7am to 11pm)
    const isAwake = localHour >= 7 && localHour < 23;

    return {
      ...r,
      localHour,
      activity,
      isAwake,
    };
  });

  const heatScore = Math.round(rawScore * 100);

  const controlsSection = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
      {/* Algorithmic Score */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Algorithmic Score</span>
        <div>
          <div className="text-[10px] text-text-faint font-mono uppercase">Global Heat Index</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-4xl font-mono font-bold text-text-primary">{heatScore}%</span>
            <span className="text-xs font-mono font-semibold" style={{ color: selectedNetwork.accent }}>
              {heatScore > 75 ? "🔥 Peak Window" : heatScore > 50 ? "⚡ Moderate" : "💤 Quiet"}
            </span>
          </div>
        </div>
        <div className="w-full bg-bg-surface border border-border h-2 rounded-full overflow-hidden">
          <div className="h-full transition-all duration-500" style={{ width: `${heatScore}%`, backgroundColor: selectedNetwork.accent || "var(--section-clocks-accent)" }} />
        </div>
      </div>

      {/* Audience Wakefulness */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block">Audience Wakefulness</span>
        <div className="space-y-3">
          {regionalBreakdown.map((r, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-text-muted">{r.name}</span>
                <span className="text-text-primary font-bold">
                  {Math.floor(r.localHour)}:{String(Math.floor((r.localHour % 1) * 60)).padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-text-faint">
                <span>Weight: {Math.round(r.weight * 100)}%</span>
                <span className={r.isAwake ? "text-amber-500 font-semibold" : "text-blue-500 font-semibold"}>
                  {r.isAwake ? "☀️ Awake" : "🌙 Sleeping"}
                </span>
              </div>
              <div className="w-full bg-bg-surface border border-border h-1 rounded-full overflow-hidden mt-1">
                <div className="h-full transition-all" style={{ width: `${r.activity * 100}%`, backgroundColor: r.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} controlsSection={controlsSection}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] select-none text-text-primary">
        
        {/* Dynamic World Map Choropleth */}
        <div className="w-full max-w-[480px] bg-bg-card/20 border border-border/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
          
          {/* Channel Selectors */}
          <div className="flex flex-wrap justify-center gap-2 mb-6 w-full">
            {NETWORKS.map((net) => (
              <button
                key={net.id}
                onClick={() => setSelectedNetwork(net)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold font-sans flex items-center gap-1.5 transition-all ${
                  selectedNetwork.id === net.id
                    ? "bg-text-primary text-bg-surface border-text-primary shadow-md"
                    : "bg-bg-surface text-text-muted border-border hover:bg-bg-card"
                }`}
              >
                <span>{net.icon}</span>
                <span>{net.name}</span>
              </button>
            ))}
          </div>

          {/* Choropleth Geometric Map Drawing */}
          <div className="relative w-full aspect-[2/1] border border-border/20 rounded-xl bg-bg-surface/50 overflow-hidden p-4">
            
            {/* Hour marker grid overlays */}
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-full w-[1px] bg-text-primary" />
              ))}
            </div>

            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* STYLIZED CONTINENTAL SHAPES */}
              
              {/* North America */}
              <g className="transition-all duration-500">
                <polygon
                  points="40,30 110,30 130,55 100,75 80,105 60,95 30,55"
                  fill={regionalBreakdown[0].isAwake ? "rgba(245, 158, 11, 0.7)" : "rgba(30, 41, 59, 0.7)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                <text x="75" y="60" className="fill-text-primary font-mono text-[9px] font-bold" textAnchor="middle">
                  NA
                </text>
              </g>

              {/* Latin America */}
              <g className="transition-all duration-500">
                <polygon
                  points="90,110 130,110 160,140 140,185 110,185"
                  fill={regionalBreakdown[3].isAwake ? "rgba(245, 158, 11, 0.5)" : "rgba(30, 41, 59, 0.5)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                <text x="125" y="145" className="fill-text-primary font-mono text-[9px] font-bold" textAnchor="middle">
                  LATAM
                </text>
              </g>

              {/* Europe & Africa */}
              <g className="transition-all duration-500">
                {/* Europe */}
                <polygon
                  points="180,30 220,25 240,45 220,65 170,55"
                  fill={regionalBreakdown[1].isAwake ? "rgba(245, 158, 11, 0.7)" : "rgba(30, 41, 59, 0.7)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                {/* Africa */}
                <polygon
                  points="180,75 220,70 240,105 210,165 170,105"
                  fill={regionalBreakdown[1].isAwake ? "rgba(245, 158, 11, 0.6)" : "rgba(30, 41, 59, 0.6)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                <text x="205" y="47" className="fill-text-primary font-mono text-[9px] font-bold" textAnchor="middle">
                  EU
                </text>
                <text x="205" y="115" className="fill-text-primary font-mono text-[9px] font-bold" textAnchor="middle">
                  AFRICA
                </text>
              </g>

              {/* Asia / Pacific */}
              <g className="transition-all duration-500">
                {/* Russia / North Asia */}
                <polygon
                  points="250,25 350,25 360,65 300,75 245,55"
                  fill={regionalBreakdown[2].isAwake ? "rgba(245, 158, 11, 0.7)" : "rgba(30, 41, 59, 0.7)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                {/* Southern Asia / India / China */}
                <polygon
                  points="260,80 320,80 340,115 310,135 280,115"
                  fill={regionalBreakdown[2].isAwake ? "rgba(245, 158, 11, 0.85)" : "rgba(30, 41, 59, 0.85)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                {/* Australia */}
                <polygon
                  points="320,145 365,145 375,175 330,175"
                  fill={regionalBreakdown[2].isAwake ? "rgba(245, 158, 11, 0.75)" : "rgba(30, 41, 59, 0.75)"}
                  stroke="var(--border)"
                  strokeWidth="1.5"
                />
                <text x="295" y="55" className="fill-text-primary font-mono text-[9px] font-bold" textAnchor="middle">
                  ASIA
                </text>
                <text x="345" y="162" className="fill-text-primary font-mono text-[9px] font-bold" textAnchor="middle">
                  AUS
                </text>
              </g>
            </svg>
          </div>

          {/* Quick instructions / status info */}
          <div className="mt-4 flex items-center gap-1.5 text-xs font-mono text-text-muted">
            <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-sm" />
            <span>Daytime (Active Audience)</span>
            <span className="inline-block w-2.5 h-2.5 bg-slate-800 rounded-sm ml-3" />
            <span>Nighttime (Asleep)</span>
          </div>
        </div>

      </div>
    </ClockLayout>
  );
}
