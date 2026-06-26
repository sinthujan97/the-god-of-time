"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

type Drip = {
  startX: number;
  startY: number;
  maxLength: number;
  curve: number;
  width: number;
};

const realm = realmsRegistry.find((r) => r.slug === "absurd-clocks")!;

export default function AbsurdClocks() {
  // Paint drying states
  const [paintColor, setPaintColor] = useState("#E85D4A");
  const [wetness, setWetness] = useState(1.0); // 1.0 (wet) -> 0.0 (dry)
  const [drips, setDrips] = useState<Drip[]>([]);

  // Popups queue
  const [activeMessage, setActiveMessage] = useState<{ text: string; x: number; y: number; key: number } | null>(null);
  const messageQueue = useRef<string[]>([]);
  const isMessageShowing = useRef(false);
  const triggeredPercentages = useRef<Set<number>>(new Set());

  // Other Clocks states
  const [grassGrown, setGrassGrown] = useState(0.0);
  const [snailDistance, setSnailDistance] = useState(0.0);
  const [iceProgress, setIceProgress] = useState(0);
  const [teaSeconds, setTeaSeconds] = useState(0);
  const [bananaAge, setBananaAge] = useState(0);
  const [gumFlavor, setGumFlavor] = useState(100);
  const [ramenSec, setRamenSec] = useState(180);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wetnessRef = useRef(1.0);

  // Initialize paint drying session
  useEffect(() => {
    const paintColors = ["#E85D4A", "#4B8EF1", "#52C4A0", "#C9A84C", "#9B8EF5"];
    const randomColor = paintColors[Math.floor(Math.random() * paintColors.length)];
    setPaintColor(randomColor);

    let startTimeStr = sessionStorage.getItem("paintStartTime");
    if (!startTimeStr) {
      startTimeStr = Date.now().toString();
      sessionStorage.setItem("paintStartTime", startTimeStr);
    }
    const startTime = parseInt(startTimeStr);

    const dripCount = 3 + Math.floor(Math.random() * 3);
    const newDrips: Drip[] = [];
    for (let i = 0; i < dripCount; i++) {
      newDrips.push({
        startX: 15 + Math.random() * 70,
        startY: 5 + Math.random() * 10,
        maxLength: 35 + Math.random() * 45,
        curve: -8 + Math.random() * 16,
        width: 3 + Math.random() * 4,
      });
    }
    setDrips(newDrips);

    const updateWetness = () => {
      const elapsed = Date.now() - startTime;
      const hoursLimit = 4 * 60 * 60 * 1000; // 4 hours
      const nextWetness = Math.max(0, 1 - elapsed / hoursLimit);
      setWetness(nextWetness);
      wetnessRef.current = nextWetness;

      const dryPercent = Math.round((1 - nextWetness) * 100);
      checkTriggers(dryPercent, nextWetness);
    };

    updateWetness();
    const interval = setInterval(updateWetness, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerMessage = useCallback((text: string) => {
    messageQueue.current.push(text);
    processQueue();
  }, []);

  const processQueue = useCallback(() => {
    if (isMessageShowing.current || messageQueue.current.length === 0) return;

    isMessageShowing.current = true;
    const msg = messageQueue.current.shift()!;

    const randomX = 30 + Math.random() * 40;
    const randomY = 45 + Math.random() * 10;

    setActiveMessage({
      text: msg,
      x: randomX,
      y: randomY,
      key: Date.now() + Math.random(),
    });

    setTimeout(() => {
      setActiveMessage(null);
      isMessageShowing.current = false;
      setTimeout(processQueue, 400);
    }, 4500);
  }, []);

  const checkTriggers = (pct: number, currentWetness: number) => {
    const thresholds = [0, 2, 5, 10, 15, 20, 25, 33, 50, 66, 75, 90, 95, 100];
    thresholds.forEach((t) => {
      if (pct >= t && !triggeredPercentages.current.has(t)) {
        triggeredPercentages.current.add(t);
        let msg = "";
        switch (t) {
          case 0: msg = "The paint does not care. It simply dries."; break;
          case 2: msg = "Scientists have confirmed this is happening."; break;
          case 5: msg = "You could have learned 47 words of Spanish by now. Instead: this."; break;
          case 10: msg = "A study found watching paint dry increases mindfulness by 0%. The study was this."; break;
          case 15: {
            const molecules = Math.max(0, Math.floor(currentWetness * 6.022e14));
            msg = `The paint is drying at ${molecules.toExponential(2)} molecules per second. None of them care.`;
            break;
          }
          case 20: msg = "You are now 20% of the way through something nobody asked for."; break;
          case 25: msg = "One quarter done. The drips are slowing. So is your ambition."; break;
          case 33: msg = "This is now longer than most meetings that could have been emails."; break;
          case 50: msg = "HALFWAY. You have achieved the exact middle of absolutely nothing."; break;
          case 66: msg = "Two thirds dry. You have outlasted most people's attention spans. You are weird. This is a compliment."; break;
          case 75: msg = "Three quarters dry. The paint respects your commitment."; break;
          case 90: msg = "Almost there. Do you feel it? That feeling? That's nothing. There's nothing to feel."; break;
          case 95: msg = "So close. The tension is [not] unbearable."; break;
          case 100: msg = "IT IS DRY. You watched paint dry. History has recorded nothing about this. But you were here."; break;
        }
        if (msg) triggerMessage(msg);
      }
    });
  };

  useEffect(() => {
    const randomPool = [
      "The paint atoms are vibrating. They have always been vibrating.",
      "Somewhere, someone is painting something beautiful. Not here.",
      "Current status: drying. Just like all of us, in our own way.",
      "The paint does not dream. Unlike you, who is somehow choosing to watch paint dry.",
      "If you stare long enough, the paint starts to seem meaningful. It is not.",
      "Time check: yes.",
      "This is the most honest thing on the internet. Paint. Drying. That's it.",
      "No plot twist is coming.",
      "The paint is indifferent to your watching. The paint has achieved enlightenment.",
      "You could close this tab. The paint would still dry.",
      "Scientifically, you are watching polymer chains cross-link. Philosophically, same.",
      "If a wall dries and no one watches it, does it still need a second coat?"
    ];

    const interval = setInterval(() => {
      if (wetnessRef.current > 0) {
        const randMsg = randomPool[Math.floor(Math.random() * randomPool.length)];
        triggerMessage(randMsg);
      }
    }, 90000);

    return () => clearInterval(interval);
  }, [triggerMessage]);

  // Fresh Paint drying canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) {
        frameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // Canvas Base Paint Color
      ctx.fillStyle = paintColor;
      ctx.fillRect(0, 0, w, h);

      // Specular sheen gloss overlay (vanishes as it dries)
      if (wetnessRef.current > 0) {
        const glossGrad = ctx.createRadialGradient(w / 2, h * 0.2, 10, w / 2, h * 0.2, Math.max(w, h));
        glossGrad.addColorStop(0, `rgba(255, 255, 255, ${wetnessRef.current * 0.16})`);
        glossGrad.addColorStop(0.5, `rgba(255, 255, 255, ${wetnessRef.current * 0.04})`);
        glossGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = glossGrad;
        ctx.fillRect(0, 0, w, h);
      }

      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [paintColor]);

  // Hook canvas wrapper resizing
  useCanvasSize(
    canvasRef,
    useCallback((w: number, h: number) => {}, [])
  );

  // Other ticking clocks
  useEffect(() => {
    const interval = setInterval(() => {
      setGrassGrown((prev) => prev + 3.3e-6 * 0.1);
      setSnailDistance((prev) => prev + 1.2 * 0.1);
      setIceProgress((prev) => (prev >= 100 ? 100 : prev + 0.1));
      setTeaSeconds((prev) => (prev >= 300 ? 300 : prev + 1));
      setBananaAge((prev) => (prev >= 100 ? 100 : prev + 0.05));
      setGumFlavor((prev) => (prev <= 0 ? 0 : prev - 0.2));
      setRamenSec((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handlePaintAgain = () => {
    sessionStorage.removeItem("paintStartTime");
    const paintColors = ["#E85D4A", "#4B8EF1", "#52C4A0", "#C9A84C", "#9B8EF5"];
    const randomColor = paintColors[Math.floor(Math.random() * paintColors.length)];
    setPaintColor(randomColor);
    setWetness(1.0);
    wetnessRef.current = 1.0;
    triggeredPercentages.current.clear();
    sessionStorage.setItem("paintStartTime", Date.now().toString());

    const newDrips: Drip[] = [];
    for (let i = 0; i < 4; i++) {
      newDrips.push({
        startX: 15 + Math.random() * 70,
        startY: 5 + Math.random() * 10,
        maxLength: 35 + Math.random() * 45,
        curve: -8 + Math.random() * 16,
        width: 3 + Math.random() * 4,
      });
    }
    setDrips(newDrips);
  };

  const getIceStatus = () => {
    if (iceProgress < 20) return "Solid Ice 🧊";
    if (iceProgress < 50) return "Sweating slickly 💧";
    if (iceProgress < 85) return "Slushy glacier 🧊💧";
    if (iceProgress < 100) return "Almost vanished 💧";
    return "Puddle of entropy 🌊";
  };

  const getTeaSteepColor = () => {
    const pct = teaSeconds / 300;
    const r = Math.floor(120 + pct * 100);
    const g = Math.floor(100 - pct * 60);
    const b = Math.floor(40 - pct * 20);
    return `rgb(${r},${g},${b})`;
  };

  const getBananaColor = () => {
    if (bananaAge < 20) return "#2ecc71";
    if (bananaAge < 60) return "#f1c40f";
    if (bananaAge < 90) return "#d35400";
    return "#3e2723";
  };

  const formatRamenTime = () => {
    const m = Math.floor(ramenSec / 60);
    const s = ramenSec % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const resultsZone = (
    <div className="clocks-grid" style={{ width: "100%" }}>
      <style jsx>{`
        .clocks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
          width: 100%;
        }

        .clock-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 140px;
        }
      `}</style>

      {/* 1. Grass Growth */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>🌱</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Grass Growth Clock</h4>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--accent-bio)", fontWeight: "bold", margin: "8px 0" }}>
          +{grassGrown.toFixed(8)} mm
        </div>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>Since you opened this page.</span>
      </div>

      {/* 2. Snail crawled */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>🐌</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Snail Expedition Tracker</h4>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--text-primary)", fontWeight: "bold", margin: "8px 0" }}>
          {snailDistance.toFixed(2)} mm
        </div>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>Traveled across the virtual floor.</span>
      </div>

      {/* 3. Ice Melt */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>🧊</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Ice Melt Timeline</h4>
        </div>
        <div style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--accent-scifi)", fontWeight: 600, margin: "8px 0" }}>
          {getIceStatus()}
        </div>
        <div style={{ height: 4, background: "var(--border)", borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${iceProgress}%`, background: "var(--accent-scifi)", borderRadius: 2 }} />
        </div>
      </div>

      {/* 4. Tea Steeping */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>☕</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Tea Steeping Infuser</h4>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: getTeaSteepColor() }} />
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 16, color: "var(--text-primary)", fontWeight: "bold" }}>{teaSeconds}s</div>
        </div>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>Optimal infusion at 180s.</span>
      </div>

      {/* 5. Banana Rot */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>🍌</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Banana Rot Indicator</h4>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", margin: "8px 0" }}>
          <div style={{ width: 40, height: 12, borderRadius: 6, background: getBananaColor(), transition: "background 500ms" }} />
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>{bananaAge.toFixed(0)}% decay</span>
        </div>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>Decaying green to organic mush.</span>
      </div>

      {/* 6. Gum Flavor */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>🍬</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Gum Flavor Dilation</h4>
        </div>
        <div style={{ margin: "8px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "var(--font-mono)", marginBottom: 3 }}>
            <span>FLAVOR INTENSITY:</span>
            <span>{gumFlavor.toFixed(1)}%</span>
          </div>
          <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${gumFlavor}%`, background: "var(--accent-utility-d)", borderRadius: 3 }} />
          </div>
        </div>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>Rapid loss of mint oils.</span>
      </div>

      {/* 7. Ramen Countdown */}
      <div className="clock-card">
        <div>
          <span style={{ fontSize: 20 }}>🍜</span>
          <h4 style={{ margin: "10px 0 4px 0", fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-primary)" }}>Instant Ramen Boiling</h4>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 24, color: ramenSec === 0 ? "var(--accent-bio)" : "var(--text-primary)", fontWeight: "bold", margin: "4px 0" }}>
          {formatRamenTime()} {ramenSec === 0 && "🍳 READY!"}
        </div>
        <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)" }}>Three-minute countdown.</span>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} hasInputZone={false} resultsZone={resultsZone}>
      <style jsx>{`
        .paint-drying-hero {
          position: relative;
          width: 100%;
          height: 55vh;
          min-height: 380px;
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
        }

        .paint-canvas-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .fresh-paint-canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }

        .drip-svg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .progress-bar-drying {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          width: 100%;
          z-index: 5;
        }

        .progress-fill-drying {
          height: 100%;
          background: #ffffff;
          transition: width 1s linear;
        }

        .percentage-readout {
          position: absolute;
          bottom: 12px;
          right: 16px;
          font-family: var(--font-mono);
          font-size: 14px;
          color: #ffffff;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0,0,0,0.6);
          z-index: 5;
          letter-spacing: 0.05em;
        }

        .popup-toast {
          position: absolute;
          background: rgba(0, 0, 0, 0.78);
          backdrop-filter: blur(8px);
          border-radius: 10px;
          padding: 16px 24px;
          max-width: 400px;
          z-index: 10;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: toastAnimation 4.5s ease-in-out forwards;
        }

        @keyframes toastAnimation {
          0% { opacity: 0; transform: translate(-50%, -50%) translateY(15px); }
          11% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
          80% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
          100% { opacity: 0; transform: translate(-50%, -50%) translateY(-30px); }
        }

        .paint-again-btn {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 6px;
          padding: 10px 20px;
          font-family: var(--font-ui);
          font-size: 13px;
          color: #121212;
          font-weight: 600;
          cursor: pointer;
          z-index: 15;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: transform 150ms;
        }

        .paint-again-btn:hover {
          transform: scale(1.05);
        }
      `}</style>

      {/* HERO: Fresh Paint Drying simulation */}
      <div className="paint-drying-hero">
        <div
          className="paint-canvas-container"
          style={{
            filter: `saturate(${wetness * 0.7 + 0.3}) brightness(${1 + (1 - wetness) * 0.15})`,
          }}
        >
          <canvas ref={canvasRef} className="fresh-paint-canvas" />

          {/* Drip overlay */}
          <svg className="drip-svg">
            {drips.map((drip, idx) => {
              const progress = 1 - wetness;
              const currentLength = drip.maxLength * progress;
              const endX = drip.startX + drip.curve;
              const cpX = drip.startX + drip.curve / 2;
              const pathData = `
                M ${drip.startX}% ${drip.startY}%
                Q ${cpX}% ${drip.startY + currentLength / 2}% ${endX}% ${drip.startY + currentLength}%
              `;

              return (
                <path
                  key={idx}
                  d={pathData}
                  stroke={paintColor}
                  strokeWidth={drip.width}
                  strokeLinecap="round"
                  fill="none"
                  style={{
                    opacity: wetness * 0.8 + 0.2,
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Toast notifications */}
        {activeMessage && (
          <div
            key={activeMessage.key}
            className="popup-toast"
            style={{
              left: `${activeMessage.x}%`,
              top: `${activeMessage.y}%`,
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontStyle: "italic", color: "#ffffff", lineHeight: 1.4 }}>
              {activeMessage.text}
            </div>
          </div>
        )}

        {/* Bottom progress bar */}
        <div className="progress-bar-drying">
          <div
            className="progress-fill-drying"
            style={{
              width: `${(1 - wetness) * 100}%`,
              opacity: wetness,
            }}
          />
        </div>

        {/* Percentage display */}
        <div className="percentage-readout">
          {Math.round((1 - wetness) * 100)}% dry
        </div>

        {/* Paint Again Trigger Button */}
        {wetness === 0 && (
          <button className="paint-again-btn" onClick={handlePaintAgain}>
            Paint Again
          </button>
        )}
      </div>

      <FloatingPanel id="clocks-telemetry" title="ABSURD DATA" defaultPosition="top-right">
        <PanelDisplay
          label="PAINT WETNESS"
          value={`${Math.round(wetness * 100)}%`}
        />
        <PanelDisplay
          label="RAMEN BOIL"
          value={formatRamenTime()}
        />
      </FloatingPanel>
    </RealmLayout>
  );
}
