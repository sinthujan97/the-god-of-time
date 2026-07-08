"use client";

import { useState, useEffect, useRef } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "lorenz-attractor-clock")!;

const THEME_COLORS: Record<string, { hour: string; min: string; sec: string }> = {
  rainbow: { hour: "#ff3366", min: "#33ff66", sec: "#3366ff" },
  nebula: { hour: "#f72585", min: "#7209b7", sec: "#4cc9f0" },
  forest: { hour: "#e9c46a", min: "#2a9d8f", sec: "#f4a261" },
  flame: { hour: "#ff0054", min: "#ff5400", sec: "#ffbd00" },
  monochrome: { hour: "#ffffff", min: "#cccccc", sec: "#999999" },
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function getRandomColor(theme: string, level: number, total: number, opacity: number) {
  let r = 255, g = 255, b = 255;
  if (theme === "rainbow") {
    const floor = 170;
    r = floor + Math.floor(Math.random() * (255 - floor));
    g = floor + Math.floor(Math.random() * (255 - floor));
    b = floor + Math.floor(Math.random() * (255 - floor));
  } else if (theme === "nebula") {
    // Cyans, deep blues, and magentas
    r = 90 + Math.floor(Math.random() * 90);
    g = 120 + Math.floor(Math.random() * 125);
    b = 210 + Math.floor(Math.random() * 45);
  } else if (theme === "forest") {
    // Greens, emeralds, soft golds
    r = 100 + Math.floor(Math.random() * 140);
    g = 200 + Math.floor(Math.random() * 55);
    b = 70 + Math.floor(Math.random() * 90);
  } else if (theme === "flame") {
    // Oranges, reds, yellows
    r = 210 + Math.floor(Math.random() * 45);
    g = 70 + Math.floor(Math.random() * 130);
    b = 40 + Math.floor(Math.random() * 60);
  } else if (theme === "monochrome") {
    // White/Gray/Silver
    const val = 170 + Math.floor(Math.random() * 85);
    r = val; g = val; b = val;
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(3)})`;
}

export default function LorenzAttractorClock() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [depth, setDepth] = useState<number>(7);
  const [scale, setScale] = useState<number>(12); // in cqmin
  const [theme, setTheme] = useState<string>("rainbow");
  const [showTime, setShowTime] = useState<boolean>(true);
  const [secOffset, setSecOffset] = useState<number | null>(null);
  const [renderTrigger, setRenderTrigger] = useState<number>(0);

  // Time tracker for digital display overlay
  const [now, setNow] = useState(new Date(2026, 0, 1, 0, 0, 0));

  useEffect(() => {
    setMounted(true);
    setNow(new Date());
    const iv = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const container = containerRef.current;
    if (!container) return;

    // Calculate time offsets
    const d = new Date();
    const h = d.getHours() % 12;
    const m = d.getMinutes();
    const s = d.getSeconds() + 60 * m + 3600 * h;
    setSecOffset(s);

    // Clear previous tree
    container.innerHTML = "";

    // Create root hour hand
    const hourHand = document.createElement("div");
    hourHand.className = "hand rotate-hour hour primary-hour";
    hourHand.setAttribute("style", "width: 5px;");
    hourHand.innerHTML = `<div class="hand rotate-minute primary-minute"></div><div class="hand rotate-second primary-second"></div>`;
    container.appendChild(hourHand);

    // Perform recursive DOM expansion (make secondary branches duller)
    const total = depth;
    const minOpacity = 0.05;
    const maxOpacity = 0.25;

    for (let i = 0; i < total; i++) {
      const opacity = minOpacity + (maxOpacity - minOpacity) * ((total - i) / total);
      const handWidth = Math.max(1.2, 4 - i * 0.5); // Thicker hands at primary levels, tapering down
      const styleStr = `background-color: ${getRandomColor(theme, i, total, opacity)}; width: ${handWidth}px;`;

      const emptyHands = container.querySelectorAll(".hand:empty");
      emptyHands.forEach((n) => {
        n.setAttribute("style", styleStr);
        n.innerHTML = `
          <div class="hand rotate-minute"></div>
          <div class="hand rotate-second"></div>
        `;
      });
    }

    // Set styling for final empty leaves
    const finalEmptyHands = container.querySelectorAll(".hand:empty");
    finalEmptyHands.forEach((n) => {
      n.setAttribute("style", `background-color: ${getRandomColor(theme, total, total, 0.04)}; width: 1px;`);
    });
  }, [mounted, depth, theme, renderTrigger]);

  const syncTime = () => {
    setRenderTrigger((prev) => prev + 1);
  };

  const themeColors = THEME_COLORS[theme] || THEME_COLORS.rainbow;

  return (
    <ClockLayout
      clock={clock}
      noScale={true}
      controlsSection={
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
            {/* Complexity (Depth) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                Complexity (Depth: {depth})
              </span>
              <input
                type="range"
                min={3}
                max={8}
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--section-clocks-accent)" }}
              />
            </div>

            {/* Hand Length (Scale) */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 140 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                Hand Length (Size: {scale}%)
              </span>
              <input
                type="range"
                min={5}
                max={20}
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                style={{ width: "100%", accentColor: "var(--section-clocks-accent)" }}
              />
            </div>

            {/* Color Palette */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 120 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
                Color Palette
              </span>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  height: 36,
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  border: "2px solid var(--border)",
                  background: "var(--bg-surface)",
                  color: "var(--text-primary)",
                  borderRadius: 4,
                  padding: "0 8px",
                }}
              >
                <option value="rainbow">Electric Rainbow</option>
                <option value="nebula">Nebula Dusk</option>
                <option value="forest">Emerald Gold</option>
                <option value="flame">Solar Flare</option>
                <option value="monochrome">Silent Mono</option>
              </select>
            </div>

            {/* Actions & Overlays */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", paddingTop: 10 }}>
              <button
                onClick={syncTime}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "8px 16px",
                  border: "2px solid var(--border)",
                  borderRadius: 4,
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  boxShadow: "2px 2px 0 var(--shadow-color)",
                }}
              >
                SYNC REAL TIME
              </button>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  cursor: "pointer",
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  color: "var(--text-primary)",
                }}
              >
                <input
                  type="checkbox"
                  checked={showTime}
                  onChange={(e) => setShowTime(e.target.checked)}
                  style={{ accentColor: "var(--section-clocks-accent)" }}
                />
                Show Digital Time
              </label>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
            Configure complexity, scale, and colors. The clock will recursively animate based on linear CSS animations.
          </p>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 p-4 md:p-6 w-full h-full">
        <style>{`
          .fractal-container {
            position: relative;
            width: 100%;
            height: 100%;
            min-height: 480px;
            background-color: #000000;
            overflow: hidden;
            container-type: size;
            border-radius: 16px;
            border: 1px solid var(--border);
            box-shadow: inset 0 0 40px rgba(0,0,0,0.8);
          }

          /* Fullscreen styling overrides to fill entire display area without scaling layout artifacts */
          .fullscreen-active > div {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            gap: 0 !important;
          }

          .fullscreen-active .fractal-container,
          .fallback-fullscreen-active .fractal-container,
          :fullscreen .fractal-container,
          .fractal-container:fullscreen {
            max-width: none !important;
            aspect-ratio: auto !important;
            width: 100% !important;
            height: 100% !important;
            border-radius: 0 !important;
            border: none !important;
          }

          @keyframes rotating {
            from {
              transform: rotate(180deg);
            }
            to {
              transform: rotate(540deg);
            }
          }

          .fractal-container .rotate-second {
            animation: rotating 60.083449s linear infinite;
          }

          .fractal-container .rotate-minute {
            animation: rotating 3927.27273s linear infinite;
          }

          .fractal-container .rotate-hour {
            animation: rotating 43200s linear infinite;
          }

          .fractal-container .hand {
            display: inline-block;
            transform-origin: 50% 100%;
            width: 1px;
            height: var(--hand-height, 12cqmin);
            position: absolute;
            left: 0;
            bottom: 100%;
            background-color: white;
            border-radius: 100px;
          }

          .fractal-container .hour {
            position: absolute;
            background-color: white;
            left: 50%;
            bottom: 50%;
            width: 2px;
            height: var(--hour-height, 6cqmin);
            transform-origin: 50% 50%;
          }

          /* Glowing primary indicator overrides to make main clock hands highly visible to normal eyes */
          .fractal-container .primary-hour {
            width: 6px !important;
            height: var(--hour-height, 6cqmin) !important;
            background-color: var(--primary-hour-color, #ff3366) !important;
            box-shadow: 0 0 15px var(--primary-hour-color, #ff3366) !important;
            z-index: 10 !important;
            opacity: 1 !important;
            filter: brightness(1.4) !important;
          }

          .fractal-container .primary-minute {
            width: 4px !important;
            height: var(--hand-height, 12cqmin) !important;
            background-color: var(--primary-min-color, #33ff66) !important;
            box-shadow: 0 0 12px var(--primary-min-color, #33ff66) !important;
            z-index: 9 !important;
            opacity: 1 !important;
            filter: brightness(1.4) !important;
          }

          .fractal-container .primary-second {
            width: 2.5px !important;
            height: var(--hand-height, 12cqmin) !important;
            background-color: var(--primary-sec-color, #3366ff) !important;
            box-shadow: 0 0 10px var(--primary-sec-color, #3366ff) !important;
            z-index: 8 !important;
            opacity: 1 !important;
            filter: brightness(1.4) !important;
          }

          @keyframes tgot-fractal-caption-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }

          ${secOffset !== null ? `
            .fractal-delay-wrapper-${secOffset} .hand {
              animation-delay: -${secOffset}s !important;
            }
          ` : ""}
        `}</style>

        <div
          className={`fractal-container w-full max-w-[640px] aspect-[4/3] relative ${
            secOffset !== null ? `fractal-delay-wrapper-${secOffset}` : ""
          }`}
          style={{
            "--hand-height": `${scale}cqmin`,
            "--hour-height": `${scale / 2}cqmin`,
            "--primary-hour-color": themeColors.hour,
            "--primary-min-color": themeColors.min,
            "--primary-sec-color": themeColors.sec,
          } as React.CSSProperties}
        >
          {/* Centering overlay structure */}
          <div ref={containerRef} className="absolute inset-0 w-full h-full" />

          {/* Optional digital time display overlay */}
          {showTime && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-center bg-black/80 backdrop-blur border border-white/10 px-4 py-2 rounded-lg pointer-events-none select-none z-10">
              <div
                className="text-[9px] font-mono uppercase tracking-[0.18em] text-white/50 mb-1"
                style={{ animation: "tgot-fractal-caption-pulse 2.4s ease-in-out infinite" }}
              >
                System Time
              </div>
              <div className="font-mono text-lg font-bold text-white tracking-wider">
                {mounted ? formatTime(now) : "--:--:--"}
              </div>
            </div>
          )}
        </div>
      </div>
    </ClockLayout>
  );
}
