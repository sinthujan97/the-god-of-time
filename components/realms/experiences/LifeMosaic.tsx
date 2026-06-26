"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import FloatingPanel, { PanelDisplay } from "@/components/realms/FloatingPanel";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "life-mosaic")!;

const cellWidth = 8;
const cellHeight = 8;
const gapX = 3;
const gapY = 3;
const leftMargin = 60;
const topMargin = 20;
const rightMargin = 10;
const bottomMargin = 20;

interface CanvasMosaicProps {
  weeksLived: number;
  maxWeeks: number;
  numRows: number;
  birthDateObj: Date | null;
}

function CanvasMosaic({ weeksLived, maxWeeks, numRows, birthDateObj }: CanvasMosaicProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<string>("");

  const contentWidth = leftMargin + 52 * cellWidth + 51 * gapX + rightMargin;
  const contentHeight = topMargin + numRows * cellHeight + (numRows - 1) * gapY + bottomMargin;

  const [hoveredWeek, setHoveredWeek] = useState<{ index: number; x: number; y: number } | null>(null);
  const hoveredWeekRef = useRef<{ index: number; x: number; y: number } | null>(null);

  useEffect(() => {
    // Reset cache if birthday or sizing changes
    offscreenCanvasRef.current = null;
  }, [birthDateObj, maxWeeks, numRows]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = contentWidth * dpr;
    canvas.height = contentHeight * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      if (!canvas || !ctx) return;
      const isDark = !document.documentElement.classList.contains("light");
      const themeStr = isDark ? "dark" : "light";

      // 1. Ensure offscreen canvas is cached
      if (!offscreenCanvasRef.current || themeRef.current !== themeStr) {
        themeRef.current = themeStr;
        const offscreen = document.createElement("canvas");
        offscreen.width = contentWidth * dpr;
        offscreen.height = contentHeight * dpr;
        const oCtx = offscreen.getContext("2d");
        if (oCtx) {
          oCtx.scale(dpr, dpr);

          // Draw cells
          for (let idx = 0; idx < maxWeeks; idx++) {
            const isPast = idx < weeksLived;
            const isCurrent = idx === weeksLived;

            // Current week will be drawn dynamically in the animation loop
            if (isCurrent) continue;

            const gridX = idx % 52;
            const gridY = Math.floor(idx / 52);
            const centerX = leftMargin + gridX * (cellWidth + gapX) + cellWidth / 2;
            const centerY = topMargin + gridY * (cellHeight + gapY) + cellHeight / 2;

            oCtx.beginPath();
            oCtx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            if (isPast) {
              oCtx.fillStyle = isDark ? "rgba(59, 130, 246, 0.7)" : "rgba(37, 99, 235, 0.75)";
              oCtx.fill();
            } else {
              oCtx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)";
              oCtx.lineWidth = 1;
              oCtx.stroke();
            }
          }

          // Draw Age labels on the left of every 10th row
          oCtx.font = "10px var(--font-mono)";
          oCtx.fillStyle = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.5)";
          oCtx.textAlign = "right";
          oCtx.textBaseline = "middle";

          for (let row = 0; row < numRows; row++) {
            if (row % 10 === 0) {
              const centerY = topMargin + row * (cellHeight + gapY) + cellHeight / 2;
              oCtx.fillText(`Age ${row}`, leftMargin - 12, centerY);
            }
          }

          // Draw Week labels at the top
          oCtx.font = "8px var(--font-mono)";
          oCtx.fillStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.4)";
          oCtx.textAlign = "center";
          oCtx.textBaseline = "bottom";

          for (let week = 1; week <= 52; week++) {
            if (week === 1 || week === 13 || week === 26 || week === 39 || week === 52) {
              const gridX = week - 1;
              const centerX = leftMargin + gridX * (cellWidth + gapX) + cellWidth / 2;
              oCtx.fillText(`W${week}`, centerX, topMargin - 6);
            }
          }
        }
        offscreenCanvasRef.current = offscreen;
      }

      // 2. Render cached background cells to screen
      ctx.clearRect(0, 0, contentWidth, contentHeight);
      ctx.drawImage(offscreenCanvasRef.current, 0, 0, contentWidth, contentHeight);

      // 3. Draw pulse on the current week
      if (weeksLived < maxWeeks) {
        const gridX = weeksLived % 52;
        const gridY = Math.floor(weeksLived / 52);
        const centerX = leftMargin + gridX * (cellWidth + gapX) + cellWidth / 2;
        const centerY = topMargin + gridY * (cellHeight + gapY) + cellHeight / 2;

        const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.25;
        const pulseAlpha = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;

        // Pulse wave
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5 * pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 204, ${pulseAlpha})`;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffcc";
        ctx.fill();
      }

      // 4. Draw selection box around hovered week
      const hover = hoveredWeekRef.current;
      if (hover && hover.index < maxWeeks) {
        const gridX = hover.index % 52;
        const gridY = Math.floor(hover.index / 52);
        const centerX = leftMargin + gridX * (cellWidth + gapX) + cellWidth / 2;
        const centerY = topMargin + gridY * (cellHeight + gapY) + cellHeight / 2;

        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "#ffffff" : "#1a1a2e";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [weeksLived, maxWeeks, numRows, contentWidth, contentHeight]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Determine if cursor is near a dot
    for (let idx = 0; idx < maxWeeks; idx++) {
      const gridX = idx % 52;
      const gridY = Math.floor(idx / 52);
      const centerX = leftMargin + gridX * (cellWidth + gapX) + cellWidth / 2;
      const centerY = topMargin + gridY * (cellHeight + gapY) + cellHeight / 2;

      const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
      if (dist < (cellWidth + gapX) / 2 + 1) {
        const newHover = { index: idx, x: centerX, y: centerY };
        setHoveredWeek(newHover);
        hoveredWeekRef.current = newHover;
        return;
      }
    }
    setHoveredWeek(null);
    hoveredWeekRef.current = null;
  };

  const handleMouseLeave = () => {
    setHoveredWeek(null);
    hoveredWeekRef.current = null;
  };

  return (
    <div style={{ position: "relative", width: contentWidth, height: contentHeight }}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "block",
          cursor: "crosshair",
          width: contentWidth,
          height: contentHeight
        }}
      />
      {hoveredWeek !== null && (
        <div
          style={{
            position: "absolute",
            left: hoveredWeek.x,
            top: hoveredWeek.y - 45,
            transform: "translateX(-50%)",
            background: "color-mix(in srgb, var(--bg-card) 90%, transparent)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: "6px 10px",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--text-primary)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 10
          }}
        >
          Week {hoveredWeek.index + 1}
          {birthDateObj && (
            <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>
              ({new Date(birthDateObj.getTime() + hoveredWeek.index * 7 * 24 * 3600000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function LifeMosaic() {
  const [birthdate, setBirthdate] = useState("");
  const [birthDateObj, setBirthDateObj] = useState<Date | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (birthdate) {
      setBirthDateObj(new Date(birthdate));
    }
  };

  const getWeeksLived = () => {
    if (!birthDateObj) return 0;
    const msAlive = Date.now() - birthDateObj.getTime();
    return Math.floor(msAlive / (7 * 24 * 60 * 60 * 1000));
  };

  const weeksLived = birthDateObj ? getWeeksLived() : 0;
  const numRows = Math.max(80, Math.ceil((weeksLived + 1) / 52));
  const maxWeeks = numRows * 52;

  const daysRemaining = birthDateObj
    ? Math.max(0, (maxWeeks * 7) - Math.floor((Date.now() - birthDateObj.getTime()) / 86400000))
    : 0;

  const sunsetsLeft = daysRemaining;
  const weekendsLeft = Math.max(0, maxWeeks - weeksLived);
  const sleepLeftHours = daysRemaining * 8; // assuming 8 hours of sleep
  const mealsLeft = daysRemaining * 3; // 3 meals/day

  return (
    <RealmLayout
      realm={realm}
      hasInputZone={true}
      inputZone={
        !birthDateObj ? (
          <form
            onSubmit={handleCalculate}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              maxWidth: 480,
              width: "100%",
              margin: "0 auto",
              boxSizing: "border-box"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: 11, fontWeight: 600, color: "var(--text-muted)" }}>
                ENTER YOUR BIRTHDATE
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
                background: birthdate ? "var(--accent-bio)" : "var(--border)",
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
              Generate Life Mosaic
            </button>
          </form>
        ) : null
      }
      resultsZone={
        birthDateObj ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
                <span style={{ fontSize: 18 }}>🌅</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginTop: 8 }}>Sunsets Left</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text-primary)", fontWeight: "bold" }}>{sunsetsLeft.toLocaleString()}</div>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
                <span style={{ fontSize: 18 }}>🏖️</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginTop: 8 }}>Weekends Remaining</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text-primary)", fontWeight: "bold" }}>{weekendsLeft.toLocaleString()}</div>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
                <span style={{ fontSize: 18 }}>🛏️</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginTop: 8 }}>Hours of Sleep Left</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text-primary)", fontWeight: "bold" }}>{sleepLeftHours.toLocaleString()}</div>
              </div>
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, padding: 20 }}>
                <span style={{ fontSize: 18 }}>🍲</span>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", marginTop: 8 }}>Meals Remaining</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--text-primary)", fontWeight: "bold" }}>{mealsLeft.toLocaleString()}</div>
              </div>
            </div>

            {/* Reset */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={() => {
                  setBirthDateObj(null);
                  setBirthdate("");
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
                Reset Grid
              </button>
            </div>
          </div>
        ) : null
      }
    >
      <div style={{ width: "100%", height: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "450px" }}>
        {birthDateObj ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginBottom: 16, fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(59, 130, 246, 0.7)" }} />
                <span>Past Weeks ({weeksLived})</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ffcc" }} />
                <span>Current Week</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", border: "1px solid var(--border-subtle)", background: "transparent" }} />
                <span>Future Weeks ({Math.max(0, maxWeeks - weeksLived - 1)})</span>
              </div>
            </div>

            <div
              className="mosaic-grid-container"
              style={{
                width: "100%",
                maxHeight: "450px",
                overflowY: "auto",
                paddingRight: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              <CanvasMosaic
                weeksLived={weeksLived}
                maxWeeks={maxWeeks}
                numRows={numRows}
                birthDateObj={birthDateObj}
              />
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: "var(--font-ui)", color: "var(--text-muted)", fontSize: 14, textAlign: "center", padding: "40px 0" }}>
            Enter your birthdate to begin calculations.
          </div>
        )}
      </div>

      {birthDateObj && (
        <FloatingPanel id="mosaic-telemetry" title="LIFE METRIC" defaultPosition="top-right">
          <PanelDisplay
            label="LIFE SPENT"
            value={`${((weeksLived / maxWeeks) * 100).toFixed(2)}%`}
            large
          />
          <PanelDisplay
            label="WEEKS REMAINING"
            value={Math.max(0, maxWeeks - weeksLived).toLocaleString()}
          />
          <PanelDisplay
            label="DAYS EXPELLED"
            value={(weeksLived * 7).toLocaleString()}
          />
        </FloatingPanel>
      )}
    </RealmLayout>
  );
}
