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

export default function ContentDeliveryAnalyzer() {
  const [isLive, setIsLive] = useState(true);
  const [scrubHour, setScrubHour] = useState(12); // UTC hour: 0 to 23.9
  const [isWeekend, setIsWeekend] = useState(false);
  const [realTime, setRealTime] = useState<Date | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);

  // Customizable Audience Regional Weights (%)
  const [naWeight, setNaWeight] = useState(40);
  const [euWeight, setEuWeight] = useState(30);
  const [apWeight, setApWeight] = useState(20);
  const [laWeight, setLaWeight] = useState(10);

  useEffect(() => {
    setRealTime(new Date());
    // Determine if today is weekend
    const day = new Date().getDay();
    setIsWeekend(day === 0 || day === 6);

    const timer = setInterval(() => {
      setRealTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveUtcHour = realTime ? (realTime.getUTCHours() + realTime.getUTCMinutes() / 60 + realTime.getUTCSeconds() / 3600) : 12;
  const activeHour = isLive && realTime ? liveUtcHour : scrubHour;

  // Normalize weights
  const totalWeight = naWeight + euWeight + apWeight + laWeight;
  const getNormWeight = (w: number) => (totalWeight > 0 ? w / totalWeight : 0.25);

  const REGIONS = [
    { name: "North America", offset: -5, weight: getNormWeight(naWeight), color: "var(--accent-utility-a)", setter: setNaWeight, rawVal: naWeight },
    { name: "Europe & Africa", offset: 1, weight: getNormWeight(euWeight), color: "var(--accent-utility-d)", setter: setEuWeight, rawVal: euWeight },
    { name: "Asia & Pacific", offset: 8, weight: getNormWeight(apWeight), color: "var(--accent-utility-a)", setter: setApWeight, rawVal: apWeight },
    { name: "Latin America", offset: -3, weight: getNormWeight(laWeight), color: "var(--text-faint)", setter: setLaWeight, rawVal: laWeight },
  ];

  // Activity coefficient based on network, local hour, and day type (0.0 to 1.0)
  const getActivityCoefficient = (networkId: string, localHour: number, isWeekendMode: boolean) => {
    const h = (localHour + 24) % 24;
    
    if (isWeekendMode) {
      switch (networkId) {
        case "linkedin":
          // Massive drop on weekends for B2B/professional networks
          return 0.12;
        case "twitter":
          // Steady casual reading, peaking slightly later: 11am to 10pm
          if (h >= 11 && h < 22) return 0.70;
          if (h >= 22 || h < 2) return 0.45;
          return 0.20;
        case "tiktok":
          // Extremely active continuous scrolling: 1pm to 1am
          if (h >= 13 && h < 24) return 0.98;
          if (h >= 0 && h < 2.5) return 0.75;
          if (h >= 10 && h < 13) return 0.50;
          return 0.15;
        case "instagram":
          // Weekend leisure peaks: 12pm to 11pm
          if (h >= 12 && h < 23) return 0.94;
          if (h >= 9 && h < 12) return 0.55;
          return 0.20;
        case "youtube":
          // Sunday/Saturday binges: 10am to 10pm
          if (h >= 10 && h < 22) return 0.98;
          if (h >= 22 || h < 2) return 0.65;
          return 0.20;
        default:
          return 0.4;
      }
    }

    // Standard Weekday coefficients
    switch (networkId) {
      case "linkedin":
        // Peaks: 8am-11am (commute/start), 2pm-5pm (afternoon lag)
        if (h >= 8 && h < 12) return 0.95;
        if (h >= 12 && h < 14) return 0.60;
        if (h >= 14 && h < 17) return 0.88;
        if (h >= 17 && h < 21) return 0.40;
        return 0.15;
      case "twitter":
        // Commutes and lunch: 8am to 10am, 12pm to 2pm, 5pm to 7pm
        if (h >= 8 && h < 22) {
          if (h >= 12 && h < 14) return 0.95;
          if (h >= 18 && h < 20) return 0.98;
          return 0.78;
        }
        return 0.25;
      case "tiktok":
        // Peak evening wind-down: 4pm to 11pm
        if (h >= 16 && h < 23) return 0.96;
        if (h >= 12 && h < 16) return 0.68;
        if (h >= 23 || h < 2) return 0.55;
        return 0.15;
      case "instagram":
        // Commute, lunch, evening scroll: 11am-1pm, 7pm-9pm
        if (h >= 11 && h < 14) return 0.90;
        if (h >= 17 && h < 23) {
          if (h >= 19 && h < 21.5) return 0.98;
          return 0.85;
        }
        if (h >= 14 && h < 17) return 0.55;
        return 0.20;
      case "youtube":
        // Mid-afternoon posting catches evening viewers: 2pm to 9pm
        if (h >= 13 && h < 22) return 0.95;
        if (h >= 22 || h < 2) return 0.70;
        if (h >= 8 && h < 13) return 0.40;
        return 0.15;
      default:
        return 0.5;
    }
  };

  // Helper to check if hour is in target local timezone's awake window
  const isAwake = (localHour: number) => {
    const h = (localHour + 24) % 24;
    return h >= 7 && h < 23;
  };

  const getHeatScoreForHour = (targetUtcHour: number) => {
    let raw = 0;
    REGIONS.forEach((r) => {
      const localHour = (targetUtcHour + r.offset + 24) % 24;
      const activity = getActivityCoefficient(selectedNetwork.id, localHour, isWeekend);
      raw += activity * r.weight;
    });
    return Math.round(raw * 100);
  };

  // Calculate weighted Algorithmic Heat Score for active hour
  const heatScore = getHeatScoreForHour(activeHour);

  // Regional details list for current hour
  const regionalBreakdown = REGIONS.map((r) => {
    const localHour = (activeHour + r.offset + 24) % 24;
    const activity = getActivityCoefficient(selectedNetwork.id, localHour, isWeekend);
    const asleep = !isAwake(localHour);

    return {
      ...r,
      localHour,
      activity,
      isAwake: !asleep,
    };
  });

  const formatScrubTime = (h: number) => {
    const hr = Math.floor(h);
    const min = Math.floor((h % 1) * 60);
    return `${String(hr).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  // Build points for 24h Area Chart SVG
  const graphPoints: { x: number; y: number }[] = [];
  const chartHeight = 70;
  const chartWidth = 360;
  const paddingBottom = 8;
  const paddingTop = 6;
  const plotHeight = chartHeight - paddingBottom - paddingTop;

  for (let i = 0; i <= 24; i++) {
    const hVal = i % 24;
    const score = getHeatScoreForHour(hVal);
    const x = (i / 24) * chartWidth;
    const y = chartHeight - paddingBottom - (score / 100) * plotHeight;
    graphPoints.push({ x, y });
  }

  const areaPathD = `M 0,${chartHeight} L ${graphPoints.map((pt) => `${p(pt.x)},${p(pt.y)}`).join(" L ")} L ${chartWidth},${chartHeight} Z`;
  const linePathD = `M ${graphPoints.map((pt) => `${p(pt.x)},${p(pt.y)}`).join(" L ")}`;

  // Value formatting helper
  function p(n: number) {
    return Math.round(n * 100) / 100;
  }

  const activeIndexX = (activeHour / 24) * chartWidth;
  const activeYVal = chartHeight - paddingBottom - (heatScore / 100) * plotHeight;

  const controlsSection = (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, width: "100%" }}>
      
      {/* Metrics & Mode Panel */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-4">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block font-bold">Algorithmic Score</span>
        
        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={() => setIsLive(true)}
            style={{
              flex: 1,
              padding: "6px 12px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              background: isLive ? "var(--section-clocks-accent)" : "var(--bg-surface)",
              color: isLive ? "#000000" : "var(--text-primary)",
              border: "2px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            🛰️ LIVE MODE
          </button>
          <button
            onClick={() => {
              setIsLive(false);
              if (realTime) setScrubHour(liveUtcHour);
            }}
            style={{
              flex: 1,
              padding: "6px 12px",
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              background: !isLive ? "var(--text-primary)" : "var(--bg-surface)",
              color: !isLive ? "var(--bg-base)" : "var(--text-primary)",
              border: "2px solid var(--border)",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            📅 PLANNING MODE
          </button>
        </div>

        {/* Day selection */}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span className="text-xs font-mono text-text-faint uppercase">Day Filter:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setIsWeekend(false)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${!isWeekend ? "border-text-primary text-text-primary bg-bg-surface" : "border-border text-text-muted bg-transparent"}`}
            >
              Weekday
            </button>
            <button
              onClick={() => setIsWeekend(true)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${isWeekend ? "border-text-primary text-text-primary bg-bg-surface" : "border-border text-text-muted bg-transparent"}`}
            >
              Weekend
            </button>
          </div>
        </div>

        {/* Dynamic hour scrub slider */}
        {!isLive && (
          <div>
            <label className="text-[10px] text-text-faint font-mono uppercase flex justify-between">
              <span>Simulation Hour (UTC)</span>
              <span className="text-amber-400 font-bold">{formatScrubTime(scrubHour)} UTC</span>
            </label>
            <input
              type="range"
              min="0"
              max="23.9"
              step="0.1"
              value={scrubHour}
              onChange={(e) => setScrubHour(Number(e.target.value))}
              className="w-full accent-amber-500 bg-bg-surface border border-border h-2 rounded mt-1 cursor-pointer"
            />
          </div>
        )}

        <div className="pt-2 border-t border-border-subtle flex justify-between items-center">
          <div>
            <div className="text-[10px] text-text-faint font-mono uppercase">Global Heat Index</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-mono font-bold text-text-primary">{heatScore}%</span>
              <span className="text-[10px] font-mono font-bold uppercase" style={{ color: selectedNetwork.accent || "var(--section-clocks-accent)" }}>
                {heatScore > 75 ? "🔥 Peak Window" : heatScore > 50 ? "⚡ Moderate" : "💤 Quiet"}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="text-[10px] text-text-faint font-mono uppercase">Time (UTC)</div>
            <div className="text-base font-mono font-bold text-text-primary mt-0.5">
              {isLive && realTime ? realTime.toUTCString().slice(17, 25) : `${formatScrubTime(activeHour)}:00`}
            </div>
          </div>
        </div>
      </div>

      {/* Customizable Audience Weights Configurator */}
      <div className="bg-bg-card border border-border rounded-xl p-5 space-y-3">
        <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block font-bold">Customize Audience Weights</span>
        <div className="space-y-2">
          {REGIONS.map((r, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <label className="text-[10px] text-text-muted flex justify-between font-mono">
                <span>{r.name}</span>
                <span className="text-text-primary font-bold">{Math.round(r.weight * 100)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={r.rawVal}
                onChange={(e) => r.setter(Number(e.target.value))}
                className="w-full accent-text-primary bg-bg-surface border border-border h-1 rounded cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <ClockLayout clock={clock} controlsSection={controlsSection}>
      <div className="flex flex-col items-center justify-center p-8 min-h-[460px] select-none text-text-primary">
        
        {/* Main Board Container */}
        <div className="w-full max-w-[500px] bg-bg-card/25 border border-border/40 rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-6">
          
          {/* Channel Selectors */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
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
          <div className="relative w-full aspect-[2/1] border border-border/20 rounded-xl bg-bg-surface/60 overflow-hidden p-3">
            
            {/* Hour marker grid overlays */}
            <div className="absolute inset-0 flex justify-between pointer-events-none opacity-[0.03]">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-full w-[1px] bg-text-primary" />
              ))}
            </div>

            <svg viewBox="0 0 400 200" className="w-full h-full">
              {/* STYLIZED CONTINENTAL SHAPES */}
              
              {/* North America */}
              <g className="transition-all duration-350">
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
              <g className="transition-all duration-355">
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
              <g className="transition-all duration-360">
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
              <g className="transition-all duration-370">
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

          {/* Dynamic 24h Algorithmic Heat Wave Area Chart */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.08em" }}>
                24-Hour Global Heat Wave (UTC)
              </span>
              {isWeekend && <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", background: "rgba(245,158,11,0.1)", color: "#F59E0B", padding: "1px 6px", borderRadius: 3, fontWeight: "bold" }}>Weekend Scale</span>}
            </div>

            <div 
              style={{ 
                width: "100%", 
                background: "var(--bg-surface)", 
                border: "2px solid var(--border)", 
                borderRadius: 8, 
                padding: "8px 12px", 
                position: "relative" 
              }}
            >
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
                
                {/* Y-axis grid marks */}
                <line x1={0} y1={chartHeight - paddingBottom} x2={chartWidth} y2={chartHeight - paddingBottom} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1={0} y1={chartHeight - paddingBottom - plotHeight / 2} x2={chartWidth} y2={chartHeight - paddingBottom - plotHeight / 2} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1={0} y1={paddingTop} x2={chartWidth} y2={paddingTop} stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />

                {/* Wave Gradient */}
                <defs>
                  <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={selectedNetwork.accent} stopOpacity="0.45" />
                    <stop offset="100%" stopColor={selectedNetwork.accent} stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Filled Area Chart */}
                <path d={areaPathD} fill="url(#waveGradient)" />

                {/* Top boundary stroke line */}
                <path d={linePathD} fill="none" stroke={selectedNetwork.accent} strokeWidth="2" strokeLinecap="round" />

                {/* Vertical scrub indicator pointer */}
                <line
                  x1={activeIndexX}
                  y1={0}
                  x2={activeIndexX}
                  y2={chartHeight - paddingBottom}
                  stroke="var(--text-primary)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />

                {/* Pulse dot at wave intersection */}
                <circle cx={activeIndexX} cy={activeYVal} r="4" fill="var(--text-primary)" />
                <circle cx={activeIndexX} cy={activeYVal} r="8" fill="none" stroke="var(--text-primary)" strokeWidth="1" className="animate-ping" style={{ transformOrigin: `${activeIndexX}px ${activeYVal}px` }} />
              </svg>

              {/* Time stamps footer */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, fontFamily: "var(--font-mono)", color: "var(--text-faint)", marginTop: 4 }}>
                <span>00:00 UTC</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00 UTC</span>
              </div>
            </div>
          </div>

          {/* Regional breakdowns list */}
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            {regionalBreakdown.map((r, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, background: r.color, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--text-muted)" }}>{r.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700 }}>
                    {formatScrubTime(r.localHour)} ({r.isAwake ? "☀️ Awake" : "🌙 Sleeping"})
                  </span>
                  <div style={{ width: 60, height: 6, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", background: selectedNetwork.accent, width: `${r.activity * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </ClockLayout>
  );
}
