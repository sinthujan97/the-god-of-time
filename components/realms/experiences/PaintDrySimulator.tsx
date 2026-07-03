"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { Slider } from "@/components/ui/slider";
import {
  formatScientific,
  formatElapsed,
  darkenHex,
} from "@/lib/realms/clockUtils";
import {
  GrassGrowthClock,
  GlobalSnailExpedition,
  IceMeltCountdown,
  TeaSteepingMaster,
  DramaticRamenTimer,
  BananaTimeline,
  HumanBlinkCounter,
  AwkwardSilenceGauge,
  PencilLeadLifetime,
  CoffeeCoolingTracker,
  StepsTakenToday,
  HeartbeatsSinceMidnight,
  WordsHumanitySpokeToday,
  InternetDataCreatedToday,
  PlasticBottlesProducedToday,
  YourNailGrowthToday,
  EmailsSentToday,
  SunsEnergyOutputToday,
} from "@/components/realms/clocks";

// 6 circles color presets
const PRESET_COLORS = [
  "#E85D4A", // red
  "#4B8EF1", // blue
  "#52C4A0", // teal
  "#C9A84C", // gold
  "#9B8EF5", // purple
  "#E09A3A", // amber
];

type NoiseDot = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

type DripInit = {
  xPct: number;
  startYPct: number;
  maxLength: number;
  baseWidth: number;
};

// Percentage milestone messages
const PCT_MESSAGES: [number, string][] = [
  [0, "The paint does not care.\nIt simply dries."],
  [2, "Scientists have confirmed\nthis is happening."],
  [5, "You could have learned 47 words of Spanish by now.\nInstead: this."],
  [8, "The paint is thinking about nothing.\nYou are thinking about the paint.\nOnly one of you is correct."],
  [10, "A study found watching paint dry\nincreases mindfulness by 0%.\nThe study was this page."],
  [15, "The paint is drying at approximately\n3.8 trillion molecules per second.\nNone of them care."],
  [20, "You are now 20% of the way through\nsomething nobody asked for."],
  [25, "One quarter done.\nThe drips are slowing.\nSo is your ambition."],
  [30, "Thirty percent.\nThe paint has no opinion of you.\nThis is actually quite peaceful."],
  [33, "This is now longer than most meetings\nthat could have been emails."],
  [40, "Forty percent dry.\nYou are committed now.\nThere is no graceful exit."],
  [50, "HALFWAY.\nYou have achieved the exact middle\nof absolutely nothing."],
  [60, "Sixty percent.\nThe gloss is fading.\nSo is the illusion that this was a good use of time."],
  [66, "Two thirds dry.\nYou have outlasted most people's attention spans.\nYou are different. You are weird.\nThis is a compliment."],
  [75, "Three quarters dry.\nThe paint respects your commitment."],
  [80, "Eighty percent.\nThe polymer chains are nearly done\ncross-linking.\nYou have watched chemistry happen."],
  [90, "Almost there.\nDo you feel it?\nThat feeling?\nThat's nothing.\nThere's nothing to feel."],
  [95, "So close.\nThe tension is [not] unbearable."],
  [99, "Ninety-nine percent.\nOne final molecule.\nAnywhere between now\nand the heat death of the universe."],
  [100, "IT IS DRY.\nYou watched paint dry.\nHistory has recorded nothing about this.\nBut you were here."],
];

// Random messages list
const RANDOM_MSGS = [
  "The paint atoms are vibrating.\nThey have always been vibrating.",
  "Somewhere, someone is painting\nsomething beautiful.\nNot here.",
  "Current status: drying.\nJust like all of us, in our own way.",
  "The paint does not dream.\nUnlike you, who is somehow\nchoosing to watch paint dry.",
  "If you stare long enough,\nthe paint starts to seem meaningful.\nIt is not.",
  "Time check: yes.",
  "This is the most honest thing on the internet.\nPaint. Drying. That's it.",
  "No plot twist is coming.",
  "The paint is indifferent to your watching.\nThe paint has achieved enlightenment.",
  "You could close this tab.\nThe paint would still dry.",
  "Scientifically, you are watching\npolymer chains cross-link.\nPhilosophically, same.",
  "If a wall dries and no one watches it,\ndoes it still need a second coat?",
  "You have been here long enough\nfor the paint to have opinions.\nIt doesn't.",
  "At this rate you will have witnessed\napproximately some drying.\nThis goes on your CV.",
  "The paint does not know your name.\nThis is fine.",
];

export default function PaintDrySimulator() {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() || "paint-dry-simulator";
  const realm = realmsRegistry.find((r) => r.slug === slug) || realmsRegistry[0];

  // Primary States
  const [temperature, setTemperature] = useState(21);
  const [wetness, setWetness] = useState(1.0);
  const [paintColor, setPaintColor] = useState("#4B8EF1");
  const [paintStartTime, setPaintStartTime] = useState(0);

  // Stats / Action States
  const [mountTime] = useState(() => Date.now());
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [shareText, setShareText] = useState("Share Progress");

  // Popup Message States
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [animState, setAnimState] = useState(""); // "enter", "show", "exit"

  // Ref trackers for the queue & triggers
  const messageQueue = useRef<string[]>([]);
  const messageShowing = useRef(false);
  const firedMessages = useRef<Set<number>>(new Set());

  // Ref canvas sizing & pre-gen assets
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const noiseDots = useRef<NoiseDot[]>([]);
  const dripInits = useRef<DripInit[]>([]);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 440 });

  // 1. Initial State Loading
  useEffect(() => {
    let savedTime = sessionStorage.getItem("paintStartTime");
    if (!savedTime) {
      const now = Date.now();
      sessionStorage.setItem("paintStartTime", now.toString());
      savedTime = now.toString();
    }
    setPaintStartTime(parseInt(savedTime));

    const savedColor = sessionStorage.getItem("paintColor");
    if (savedColor) {
      setPaintColor(savedColor);
    }

    // Pre-generate noise texture once
    const dots: NoiseDot[] = [];
    for (let i = 0; i < 200; i++) {
      dots.push({
        x: Math.random(),
        y: Math.random(),
        radius: 0.5 + Math.random() * 1.0,
        opacity: 0.02 + Math.random() * 0.04,
      });
    }
    noiseDots.current = dots;

    // Pre-generate SVG drip templates once
    const drips: DripInit[] = [];
    for (let i = 0; i < 5; i++) {
      drips.push({
        xPct: 0.1 + Math.random() * 0.8,
        startYPct: 0.02 + Math.random() * 0.1,
        maxLength: 40 + Math.random() * 60,
        baseWidth: 5 + Math.random() * 5,
      });
    }
    dripInits.current = drips;
  }, []);

  // 2. Sizing Resize Observer
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasDimensions({ width, height: height || 440 });
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  // 3. Message Queue Management
  const queueMessage = (msg: string) => {
    messageQueue.current.push(msg);
    if (!messageShowing.current) {
      showNextMessage();
    }
  };

  const showNextMessage = () => {
    if (messageQueue.current.length === 0) {
      messageShowing.current = false;
      return;
    }
    messageShowing.current = true;
    const msg = messageQueue.current.shift()!;
    setActiveMessage(msg);
    setAnimState("enter");

    setTimeout(() => {
      setAnimState("show");
    }, 50);

    setTimeout(() => {
      setAnimState("exit");
      setTimeout(() => {
        setActiveMessage(null);
        setAnimState("");
        messageShowing.current = false;
        if (messageQueue.current.length > 0) {
          setTimeout(showNextMessage, 2000);
        }
      }, 400);
    }, 4500);
  };

  const checkMessageTriggers = (currentWetness: number) => {
    const pct = Math.round((1 - currentWetness) * 100);
    for (const [threshold, msg] of PCT_MESSAGES) {
      if (pct >= threshold && !firedMessages.current.has(threshold)) {
        firedMessages.current.add(threshold);
        queueMessage(msg);
      }
    }
  };

  // 4. Update Loops (Intervals)
  useEffect(() => {
    if (paintStartTime === 0) return;

    const updateWetness = () => {
      const elapsed = Date.now() - paintStartTime;
      const dryDuration = (4 * 3600000) / (temperature / 21);
      const newWetness = Math.max(0, 1 - elapsed / dryDuration);
      setWetness(newWetness);
      checkMessageTriggers(newWetness);
    };

    updateWetness();
    const wetnessInterval = setInterval(updateWetness, 10000);

    return () => clearInterval(wetnessInterval);
  }, [paintStartTime, temperature]);

  // Timer counter ticks every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - mountTime) / 1000));
    }, 1000);
    return () => clearInterval(timeInterval);
  }, [mountTime]);

  // Random messages interval
  useEffect(() => {
    const randomInterval = setInterval(() => {
      const msg = RANDOM_MSGS[Math.floor(Math.random() * RANDOM_MSGS.length)];
      // If it contains a placeholder for elapsed time on page
      const elapsedStr = formatElapsed(timeOnPage);
      const finalMsg = msg.replace("{elapsed}", elapsedStr);
      queueMessage(finalMsg);
    }, 90000);
    return () => clearInterval(randomInterval);
  }, [timeOnPage]);

  // 5. Canvas Animation Frame Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Draw background paint
      ctx.fillStyle = paintColor;
      ctx.fillRect(0, 0, w, h);

      // Radial wet gloss overlay
      const g = ctx.createRadialGradient(w / 2, 0, 0, w / 2, h * 0.3, h * 0.6);
      g.addColorStop(0, `rgba(255, 255, 255, ${wetness * 0.22})`);
      g.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Noise dots
      const mult = 0.4 + (1 - wetness) * 0.6;
      noiseDots.current.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x * w, dot.y * h, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${dot.opacity * mult})`;
        ctx.fill();
      });

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [paintColor, wetness]);

  // 6. Action Triggers
  const handleTempChange = (newTemp: number) => {
    const currentWetness = wetness;
    const newDryDuration = (4 * 3600000) / (newTemp / 21);
    const newStartTime = Date.now() - (1 - currentWetness) * newDryDuration;
    setPaintStartTime(newStartTime);
    sessionStorage.setItem("paintStartTime", newStartTime.toString());
    setTemperature(newTemp);
  };

  const handlePaintAgain = () => {
    sessionStorage.removeItem("paintStartTime");
    sessionStorage.removeItem("paintColor");
    const newTime = Date.now();
    setPaintStartTime(newTime);
    sessionStorage.setItem("paintStartTime", newTime.toString());
    setWetness(1.0);
    firedMessages.current.clear();

    const newCol = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)];
    setPaintColor(newCol);
    sessionStorage.setItem("paintColor", newCol);
  };

  const handleShare = () => {
    const elapsedSecs = (Date.now() - paintStartTime) / 1000;
    const elapsedStr = formatElapsed(elapsedSecs);
    navigator.clipboard.writeText(
      `I have watched paint dry for ${elapsedStr} and it is ${Math.round(
        (1 - wetness) * 100
      )}% dry. thegodoftime.com/realms/paint-dry-simulator`
    );
    setShareText("Copied ✓");
    setTimeout(() => setShareText("Share Progress"), 1500);
  };

  // Calculations for display
  const dryDuration = (4 * 3600000) / (temperature / 21);
  const elapsedMs = paintStartTime === 0 ? 0 : Date.now() - paintStartTime;
  const remainingMs = Math.max(0, dryDuration - elapsedMs);

  const getStatusWord = () => {
    if (wetness > 0.9) return "WET";
    if (wetness > 0.6) return "DRYING";
    if (wetness > 0.3) return "ALMOST";
    if (wetness > 0.1) return "NEARLY DRY";
    if (wetness > 0) return "ALMOST DRY";
    return "DRY";
  };

  const formatRemainingShort = (ms: number) => {
    if (wetness === 0) return "Complete";
    const totalSecs = ms / 1000;
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = Math.floor(totalSecs % 60);

    if (ms > 3600000) return `${h}h ${m}m remaining`;
    if (ms > 60000) return `${m}m ${s}s remaining`;
    return `${s}s remaining`;
  };

  // Dynamic filter string for canvas wrapper
  const sat = 0.8 + wetness * 0.2;
  const bri = 1 + (1 - wetness) * 0.12;
  const canvasFilter = `saturate(${sat}) brightness(${bri})`;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-6">
          {/* COMPACT INPUT BAR */}
          <div className="flex items-center pb-5 border-b border-border flex-wrap gap-y-4 md:gap-y-0">
            {/* GROUP 1: COLOR */}
            <div className="flex flex-col gap-1 items-start pr-5 border-r border-border min-w-[210px]">
              <span className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase">
                Color
              </span>
              <div className="flex items-center gap-3">
                <div className="flex gap-2 items-center">
                  {PRESET_COLORS.map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        setPaintColor(col);
                        sessionStorage.setItem("paintColor", col);
                      }}
                      className="w-8 h-8 rounded-full transition-all cursor-pointer select-none"
                      style={{
                        backgroundColor: col,
                        border: paintColor === col ? "2px solid var(--text-primary)" : "2px solid transparent",
                        transform: paintColor === col ? "scale(1.18)" : "scale(1)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <input
                    type="color"
                    value={paintColor}
                    onChange={(e) => {
                      setPaintColor(e.target.value);
                      sessionStorage.setItem("paintColor", e.target.value);
                    }}
                    className="w-9 h-9 border-0 bg-transparent cursor-pointer p-0 select-none"
                  />
                  <span className="text-[9px] font-sans font-medium text-text-muted mt-[-2px]">Custom</span>
                </div>
              </div>
            </div>

            {/* GROUP 2: STATUS */}
            <div className="flex flex-col gap-0 items-start px-5 border-r border-border min-w-[180px]">
              <span className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase">
                Status
              </span>
              <span className="font-sans font-bold text-[48px] md:text-[56px] text-text-primary leading-none tracking-tight mt-1">
                {getStatusWord()}
              </span>
            </div>

            {/* GROUP 3: PROGRESS */}
            <div className="flex flex-col gap-0 items-start px-5 border-r border-border min-w-[150px]">
              <span className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase">
                Progress
              </span>
              <span
                className="font-mono text-[48px] md:text-[56px] leading-none tabular-nums mt-1"
                style={{ color: "var(--accent-whim)" }}
              >
                {Math.round((1 - wetness) * 100)}%
              </span>
            </div>

            {/* GROUP 4: REMAINING */}
            <div className="flex flex-col gap-1 items-start pl-5 min-w-[120px]">
              <span className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase">
                Remaining
              </span>
              <span className="font-mono text-[16px] text-accent-whim leading-none mt-2 font-semibold">
                {formatRemainingShort(remainingMs)}
              </span>
            </div>
          </div>

          {/* TEMPERATURE CONTROL */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-sans font-medium text-text-muted uppercase">
              <span>Room Temperature</span>
              <span className="font-mono text-sm text-text-primary lowercase font-semibold">{temperature}°C</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(val) => handleTempChange(val[0])}
              min={5}
              max={40}
              step={1}
              className="w-full h-1"
            />
            <div className="flex justify-between text-[11px] font-sans font-light text-text-faint italic mt-0.5">
              <span>🥶 Slow drying</span>
              <span>🔥 Fast drying</span>
            </div>
          </div>

          {/* TIMELINE STATS */}
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-sans font-light">Total drying time</span>
              <span className="font-mono text-text-primary font-semibold">
                {formatElapsed(dryDuration / 1000)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-sans font-light">Paint color</span>
              <span className="flex items-center gap-1.5 font-mono text-text-primary font-semibold">
                <span
                  className="w-3 h-3 rounded-full inline-block border border-border"
                  style={{ backgroundColor: paintColor }}
                />
                {paintColor.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-sans font-light">Elapsed</span>
              <span className="font-mono text-text-primary font-semibold">
                {formatElapsed(elapsedMs / 1000)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-sans font-light">Temperature</span>
              <span className="font-mono text-text-primary font-semibold">{temperature}°C</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-sans font-light">Remaining</span>
              <span className="font-mono text-text-primary font-semibold">
                {formatElapsed(remainingMs / 1000)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-muted font-sans font-light">Drying speed</span>
              <span className="font-mono text-text-primary font-semibold">
                {(temperature / 21).toFixed(2)}x
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-4 border-t border-border pt-4">
            <button
              onClick={handlePaintAgain}
              className="flex-1 h-11 border-2 border-border hover:border-accent-whim hover:text-accent-whim text-text-muted text-xs font-bold rounded-[var(--radius-sm)] transition-transform duration-150 select-none cursor-pointer shadow-[var(--shadow-offset-sm)_var(--shadow-color)] hover:shadow-[var(--shadow-offset-md)_var(--shadow-color)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
            >
              Paint Again
            </button>
            <button
              onClick={handleShare}
              className="flex-1 h-11 border-2 border-border hover:border-accent-whim hover:text-accent-whim text-text-muted text-xs font-bold rounded-[var(--radius-sm)] transition-transform duration-150 select-none cursor-pointer shadow-[var(--shadow-offset-sm)_var(--shadow-color)] hover:shadow-[var(--shadow-offset-md)_var(--shadow-color)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
            >
              {shareText}
            </button>
          </div>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {/* Paint Canvas — framed within card for shadow room */}
          <div className="p-4 md:p-5">
          <div
            className="relative w-full h-[440px] max-md:h-[300px] overflow-hidden rounded-xl bg-bg-card transition-shadow duration-150"
            style={{
              border: "var(--border-width) solid var(--border)",
              boxShadow: "var(--shadow-offset-md) var(--shadow-color)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-offset-lg) var(--accent-whim)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "var(--shadow-offset-md) var(--shadow-color)";
            }}
          >
            {/* Canvas Wrapper */}
            <div
              className="w-full h-full transition-all duration-300"
              style={{ filter: canvasFilter }}
            >
              <canvas
                ref={canvasRef}
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                className="block w-full h-full"
              />
            </div>

            {/* DRIP SVG OVERLAY */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox={`0 0 ${canvasDimensions.width} ${canvasDimensions.height}`}
            >
              {dripInits.current.map((drip, idx) => {
                const x = drip.xPct * canvasDimensions.width;
                const startY = drip.startYPct * canvasDimensions.height;
                const cL = drip.maxLength * wetness;
                const baseWidth = drip.baseWidth;
                const darkColor = darkenHex(paintColor, 38); // ~15% darker

                if (cL <= 0) return null;

                // Path data drawing a dripping drop
                const pathData = `
                  M ${x} ${startY}
                  C ${x - baseWidth / 2} ${startY + cL * 0.3}
                    ${x + baseWidth / 2} ${startY + cL * 0.6}
                    ${x} ${startY + cL}
                `;

                return (
                  <path
                    key={idx}
                    d={pathData}
                    fill={darkColor}
                    opacity={wetness * 0.85}
                    stroke={darkColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* PROGRESS BAR */}
            <div className="absolute bottom-0 left-0 right-0 h-[6px] bg-black/20 overflow-hidden">
              <div
                className="h-full w-full bg-white/55 origin-left"
                style={{
                  transform: `scaleX(${(1 - wetness)})`,
                  transition: "transform 10s linear",
                }}
              />
            </div>

            {/* PERCENTAGE TEXT */}
            <span className="absolute bottom-3.5 right-4 font-mono text-xs text-white/85 select-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
              {Math.round((1 - wetness) * 100)}% dry
            </span>

            {/* MESSAGE POPUP — Oracle Treatment */}
            {activeMessage && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
                <div
                  className={`absolute left-1/2 max-w-[min(420px,88%)] border border-white/20 bg-black/90 backdrop-blur-sm px-8 py-6 shadow-[4px_4px_0px_0px_var(--accent-whim)] ${
                    animState === "show"
                      ? "msg-show"
                      : animState === "exit"
                      ? "msg-exit"
                      : "msg-enter"
                  }`}
                  style={{ top: "35%" }}
                >
                  <p className="font-display font-light italic text-[1.35rem] text-center text-white leading-[1.5] whitespace-pre-line">
                    {activeMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
          </div>

          {/* INLINE AD SLOT */}
          <div className="ad-slot-inline mt-4 w-full flex flex-col items-center border border-dashed border-border/80 p-3 rounded-lg bg-bg-surface/50">
            <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase mb-1">
              ADVERTISEMENT
            </span>
            <div className="w-[728px] max-w-full h-[90px] bg-bg-card-hover border border-border flex items-center justify-center text-text-faint font-sans text-xs">
              Responsive Banner Placement (728×90)
            </div>
          </div>

          {/* LIVE STATS — Unified Instrument Panel */}
          <div className="mt-4 border-t border-b border-border bg-bg-card">
            <div className="grid grid-cols-2 md:grid-cols-4">
              <div className="p-4 flex flex-col gap-1.5 border-r border-b md:border-b-0 border-border">
                <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase">
                  Molecules Evaporated
                </span>
                <div className="font-mono text-lg text-text-primary select-all tabular-nums">
                  {formatScientific((1 - wetness) * 2.8e21)}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r border-border">
                <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase">
                  Messages Received
                </span>
                <div className="font-mono text-lg text-text-primary tabular-nums">
                  {firedMessages.current.size.toString()}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1.5 border-r border-border">
                <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase">
                  Time on Page
                </span>
                <div className="font-mono text-lg text-text-primary tabular-nums">
                  {formatElapsed(timeOnPage)}
                </div>
              </div>
              <div className="p-4 flex flex-col gap-1.5">
                <span className="text-[9px] font-sans font-semibold tracking-wider text-text-faint uppercase">
                  Wetness Index
                </span>
                <div className="font-mono text-lg text-text-primary tabular-nums">
                  {(wetness * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* MORE ABSURD CLOCKS HEADER */}
          <div className="mt-10 px-4 md:px-5 border-t border-border pt-10">
            <p
              className="font-display font-light italic text-text-primary leading-[1.1] mb-2 text-balance"
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", letterSpacing: "-0.01em" }}
            >
              Chronometers of No Consequence
            </p>
            <p className="font-sans text-sm text-text-muted mb-6">
              Things being measured. For absolutely no reason.
            </p>
          </div>

          {/* CLOCK GRID (18 Clocks) */}
          <div className="px-4 md:px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <GrassGrowthClock />
            <GlobalSnailExpedition />
            <IceMeltCountdown />
            <TeaSteepingMaster />
            <DramaticRamenTimer />
            <BananaTimeline />
            <HumanBlinkCounter />
            <AwkwardSilenceGauge />
            <PencilLeadLifetime />
            <CoffeeCoolingTracker />
            <StepsTakenToday />
            <HeartbeatsSinceMidnight />
            <WordsHumanitySpokeToday />
            <InternetDataCreatedToday />
            <PlasticBottlesProducedToday />
            <YourNailGrowthToday />
            <EmailsSentToday />
            <SunsEnergyOutputToday />
          </div>
        </div>
      }
    />
  );
}
