"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useRealmAI } from "@/lib/realms/aiClient";
import TesseractHUD from "@/components/realms/TesseractHUD";

// ── Types ──────────────────────────────────────────────────────────────────

type Emotion = "joy" | "grief" | "fear" | "hope" | "love" | "regret" | "pride" | "wonder";
type Phase = "input" | "transition" | "tesseract";

type LifeEvent = {
  id: string;
  name: string;
  date: string;
  emotion: Emotion;
  x: number;
  y: number;
};

// ── Constants ──────────────────────────────────────────────────────────────

const EMOTION_COLORS: Record<Emotion, string> = {
  joy:    "#FFD700",
  grief:  "#6B6BFF",
  fear:   "#FF6B6B",
  hope:   "#A8CC1C",
  love:   "#FF4D9E",
  regret: "#888899",
  pride:  "#FF9500",
  wonder: "#5B7FFF",
};

const EMOTION_LABELS: Record<Emotion, string> = {
  joy:    "✦ Joy",
  grief:  "◆ Grief",
  fear:   "▲ Fear",
  hope:   "★ Hope",
  love:   "♥ Love",
  regret: "◇ Regret",
  pride:  "◉ Pride",
  wonder: "○ Wonder",
};

const EMOTIONS: Emotion[] = ["joy", "grief", "fear", "hope", "love", "regret", "pride", "wonder"];

const MAX_EVENTS = 7;

// ── LCG star generation ────────────────────────────────────────────────────

function generateStars() {
  let seed = 42;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  return Array.from({ length: 150 }, () => ({
    x: lcg() * 2400,
    y: lcg() * 1600,
    r: 0.3 + lcg() * 1.2,
    o: 0.2 + lcg() * 0.6,
  }));
}

// ── Main component ─────────────────────────────────────────────────────────

export default function FifthDimension() {
  const realm = realmsRegistry.find((r) => r.slug === "fifth-dimension")!;

  const [phase, setPhase] = useState<Phase>("input");
  const [events, setEvents] = useState<LifeEvent[]>([
    { id: crypto.randomUUID(), name: "", date: "", emotion: "wonder", x: 0, y: 0 },
    { id: crypto.randomUUID(), name: "", date: "", emotion: "hope",   x: 0, y: 0 },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef    = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const signalCache  = useRef(new Map<string, string>());
  const dragRef      = useRef({ dragging: false, startX: 0, startY: 0, vx: 0, vy: 0 });
  const cameraRef    = useRef({ x: 0, y: 0 });
  const animRef      = useRef(0);
  const momentumRef  = useRef(0);
  const starsRef     = useRef<{ x: number; y: number; r: number; o: number }[]>([]);

  const { isLoading, error, result, generate, reset } = useRealmAI();

  const selectedEvent = events.find((e) => e.id === selectedId) ?? null;
  const validCount    = events.filter((e) => e.name.trim()).length;

  // ── Star generation ──

  useEffect(() => {
    starsRef.current = generateStars();
  }, []);

  // ── Transition → tesseract auto-advance ──

  useEffect(() => {
    if (phase !== "transition") return;
    const t = setTimeout(() => {
      setEvents((prev) =>
        prev.map((ev, i) => {
          const angle  = (i / prev.length) * Math.PI * 2 + (i % 2 === 0 ? 0.3 : -0.2);
          const radius = 200 + (i * 47) % 140;
          return { ...ev, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
        })
      );
      setPhase("tesseract");
    }, 2500);
    return () => clearTimeout(t);
  }, [phase]);

  // ── Canvas rAF draw loop ──

  useEffect(() => {
    if (phase !== "tesseract") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w   = canvas.width;
      const h   = canvas.height;
      const cam = cameraRef.current;
      const isDark = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = isDark ? "#0A0A0A" : "#F5F5F0";
      ctx.fillRect(0, 0, w, h);

      // Grid
      const gridSize = 40;
      const ox = ((cam.x % gridSize) + gridSize) % gridSize;
      const oy = ((cam.y % gridSize) + gridSize) % gridSize;
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";
      ctx.lineWidth   = 1;
      for (let x = ox - gridSize; x < w + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = oy - gridSize; y < h + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }

      // Stars (parallax at 0.15× camera speed, tiled)
      const starRgb = isDark ? "255,255,255" : "26,26,46";
      for (const s of starsRef.current) {
        const sx = ((s.x + cam.x * 0.15) % 2400 + 2400) % 2400;
        const sy = ((s.y + cam.y * 0.15) % 1600 + 1600) % 1600;
        const cx = (sx / 2400) * w;
        const cy = (sy / 1600) * h;
        ctx.beginPath();
        ctx.arc(cx, cy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRgb},${s.o})`;
        ctx.fill();
      }

      // Dashed connection lines between event pairs
      ctx.strokeStyle = isDark ? "rgba(91,127,255,0.12)" : "rgba(91,127,255,0.18)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 10]);
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < events.length; i++) {
        for (let j = i + 1; j < events.length; j++) {
          const a = events[i];
          const b = events[j];
          ctx.beginPath();
          ctx.moveTo(a.x + cam.x + cx, a.y + cam.y + cy);
          ctx.lineTo(b.x + cam.x + cx, b.y + cam.y + cy);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase, events]);

  // ── Canvas resize ──

  useLayoutEffect(() => {
    if (phase !== "tesseract") return;
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [phase]);

  // ── Cache incoming AI result ──

  useEffect(() => {
    if (result && selectedId) {
      signalCache.current.set(selectedId, result);
    }
  }, [result, selectedId]);

  // ── Phase cleanup ──

  useEffect(() => {
    if (phase !== "tesseract") {
      cancelAnimationFrame(animRef.current);
      cancelAnimationFrame(momentumRef.current);
    }
  }, [phase]);

  // ── Momentum deceleration ──

  const runMomentum = useCallback(() => {
    const dr = dragRef.current;
    if (!dr.dragging && (Math.abs(dr.vx) > 0.1 || Math.abs(dr.vy) > 0.1)) {
      dr.vx *= 0.92;
      dr.vy *= 0.92;
      cameraRef.current.x += dr.vx;
      cameraRef.current.y += dr.vy;
      setCameraOffset({ x: cameraRef.current.x, y: cameraRef.current.y });
      momentumRef.current = requestAnimationFrame(runMomentum);
    }
  }, []);

  // ── Handlers ──

  const addEvent = () => {
    if (events.length >= MAX_EVENTS) return;
    setEvents((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", date: "", emotion: "wonder", x: 0, y: 0 },
    ]);
  };

  const removeEvent = (id: string) => {
    if (events.length <= 2) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEvent = (id: string, patch: Partial<LifeEvent>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const enterDimension = () => {
    cameraRef.current = { x: 0, y: 0 };
    setCameraOffset({ x: 0, y: 0 });
    setPhase("transition");
  };

  const returnToInput = () => {
    cancelAnimationFrame(animRef.current);
    cancelAnimationFrame(momentumRef.current);
    setPhase("input");
    setSelectedId(null);
    reset();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    cancelAnimationFrame(momentumRef.current);
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, vx: 0, vy: 0 };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.startX = e.clientX;
    dragRef.current.startY = e.clientY;
    dragRef.current.vx = dx;
    dragRef.current.vy = dy;
    cameraRef.current.x += dx;
    cameraRef.current.y += dy;
    setCameraOffset({ x: cameraRef.current.x, y: cameraRef.current.y });
  };

  const handleMouseUp = () => {
    dragRef.current.dragging = false;
    setIsDragging(false);
    momentumRef.current = requestAnimationFrame(runMomentum);
  };

  const handleNodeClick = useCallback(
    async (ev: LifeEvent) => {
      setSelectedId(ev.id);
      reset();
      if (signalCache.current.has(ev.id)) return;
      await generate({
        systemPrompt:
          "You are an oracle from a parallel dimension. When given a life event, send a brief (2–3 sentence) cryptic signal about how this moment unfolded differently in your timeline. Be poetic, mysterious, and specific to the event. Do not be generic.",
        userPrompt: `Life event: "${ev.name}" — date: ${ev.date || "unspecified"} — emotional signature: ${ev.emotion}. Transmit the signal.`,
        maxTokens: 120,
      });
    },
    [generate, reset]
  );

  // ── controlsSection ────────────────────────────────────────────────────────

  const inputControls = (
    <div>
      <h2
        style={{
          fontFamily: "var(--font-ui)",
          fontWeight: 800,
          fontSize: 20,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 6,
          color: "var(--text-primary)",
        }}
      >
        Map Your Timeline
      </h2>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.6 }}>
        Enter 2–7 significant life events. We'll map them across the 5th dimension.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {events.map((ev, i) => (
          <div
            key={ev.id}
            style={{
              border: "2px solid var(--border)",
              background: "var(--bg-base)",
              padding: "10px 12px",
            }}
          >
            {/* Row 1: index + name + remove */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-faint)",
                  minWidth: 14,
                }}
              >
                {i + 1}.
              </span>
              <input
                type="text"
                placeholder="Event name (e.g. First job offer)"
                value={ev.name}
                onChange={(e) => updateEvent(ev.id, { name: e.target.value })}
                maxLength={60}
                style={{
                  flex: 1,
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "var(--text-primary)",
                  padding: 0,
                  boxShadow: "none",
                  transform: "none",
                }}
              />
              {events.length > 2 && (
                <button
                  onClick={() => removeEvent(ev.id)}
                  style={{
                    fontSize: 13,
                    color: "var(--text-faint)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0 2px",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Row 2: date */}
            <div style={{ marginBottom: 8 }}>
              <input
                type="date"
                value={ev.date}
                onChange={(e) => updateEvent(ev.id, { date: e.target.value })}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  border: "1px solid var(--border-subtle)",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  padding: "3px 6px",
                  boxShadow: "none",
                  transform: "none",
                }}
              />
            </div>

            {/* Row 3: emotion pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {EMOTIONS.map((em) => {
                const active = ev.emotion === em;
                return (
                  <button
                    key={em}
                    onClick={() => updateEvent(ev.id, { emotion: em })}
                    style={{
                      fontSize: 10,
                      padding: "2px 7px",
                      border: `2px solid ${active ? EMOTION_COLORS[em] : "var(--border)"}`,
                      background: active ? EMOTION_COLORS[em] + "22" : "transparent",
                      color: active ? EMOTION_COLORS[em] : "var(--text-muted)",
                      cursor: "pointer",
                      fontFamily: "var(--font-ui)",
                      fontWeight: active ? 700 : 400,
                      transition: "all 120ms",
                    }}
                  >
                    {EMOTION_LABELS[em]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {events.length < MAX_EVENTS && (
        <button
          onClick={addEvent}
          className="btn-brutal"
          style={{ marginTop: 12, width: "100%", fontSize: 12 }}
        >
          + Add Event
        </button>
      )}

      <button
        onClick={enterDimension}
        disabled={validCount < 2}
        className="btn-brutal btn-brutal-primary"
        style={{
          marginTop: 12,
          width: "100%",
          fontSize: 14,
          opacity: validCount < 2 ? 0.4 : 1,
          cursor: validCount < 2 ? "not-allowed" : "pointer",
        }}
      >
        Enter the 5th Dimension →
      </button>
    </div>
  );

  const transitionControls = (
    <div style={{ padding: "8px 0" }}>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "#5B7FFF",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Mapping your coordinates…
      </p>
    </div>
  );

  const cachedSignal = selectedEvent ? signalCache.current.get(selectedEvent.id) : undefined;

  const tesseractControls = (
    <div>
      {selectedEvent ? (
        <>
          {/* Selected event info */}
          <div
            style={{
              border: `2px solid ${EMOTION_COLORS[selectedEvent.emotion]}`,
              padding: "10px 12px",
              marginBottom: 16,
              background: "var(--bg-base)",
            }}
          >
            <div
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--text-faint)",
                marginBottom: 4,
              }}
            >
              Selected Node
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>
              {selectedEvent.name}
            </div>
            {selectedEvent.date && (
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {selectedEvent.date}
              </div>
            )}
            <div
              style={{
                fontSize: 11,
                color: EMOTION_COLORS[selectedEvent.emotion],
                marginTop: 4,
              }}
            >
              {EMOTION_LABELS[selectedEvent.emotion]}
            </div>
          </div>

          {/* AI Signal */}
          <div
            style={{
              border: "2px solid var(--border)",
              padding: 14,
              background: "var(--bg-base)",
              minHeight: 80,
            }}
          >
            <div
              style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--text-faint)",
                marginBottom: 8,
              }}
            >
              ⬡ Signal from Alternate Timeline
            </div>
            {isLoading && (
              <p style={{ fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>
                Scanning parallel timelines…
              </p>
            )}
            {error && !isLoading && (
              <p style={{ fontSize: 12, color: "#FF6B6B" }}>{error}</p>
            )}
            {(cachedSignal || result) && !isLoading && (
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                  fontStyle: "italic",
                }}
              >
                {cachedSignal || result}
              </p>
            )}
            {!isLoading && !error && !cachedSignal && !result && (
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Awaiting transmission…
              </p>
            )}
          </div>
        </>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 12 }}>
            Drag to navigate your 5th-dimensional map. Click any event node to receive a signal
            from an alternate timeline.
          </p>
          <div
            style={{
              fontSize: 10,
              color: "var(--text-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            {events.length} event{events.length !== 1 ? "s" : ""} mapped
          </div>
        </div>
      )}

      <button
        onClick={returnToInput}
        className="btn-brutal"
        style={{ marginTop: 20, width: "100%", fontSize: 12 }}
      >
        ← Return to Map
      </button>
    </div>
  );

  const controlsSection =
    phase === "input"
      ? inputControls
      : phase === "transition"
      ? transitionControls
      : tesseractControls;

  // ── canvasSection ──────────────────────────────────────────────────────────

  // Static tesseract wireframe SVG (two squares + 4 connecting diagonals)
  const tesseractSVG = (
    <svg
      viewBox="0 0 200 200"
      width={160}
      height={160}
      style={{ opacity: 0.13, position: "absolute" }}
      aria-hidden
    >
      <rect x="20" y="20" width="120" height="120" fill="none" stroke="#5B7FFF" strokeWidth="1.5" />
      <rect x="60" y="60" width="120" height="120" fill="none" stroke="#5B7FFF" strokeWidth="1.5" />
      <line x1="20" y1="20" x2="60" y2="60"   stroke="#5B7FFF" strokeWidth="1" />
      <line x1="140" y1="20" x2="180" y2="60" stroke="#5B7FFF" strokeWidth="1" />
      <line x1="20" y1="140" x2="60" y2="180" stroke="#5B7FFF" strokeWidth="1" />
      <line x1="140" y1="140" x2="180" y2="180" stroke="#5B7FFF" strokeWidth="1" />
    </svg>
  );

  const inputCanvas = (
    <div
      style={{
        minHeight: 280,
        border: "2px dashed var(--border-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {tesseractSVG}
      <p
        style={{
          position: "relative",
          fontSize: 12,
          color: "var(--text-faint)",
          textAlign: "center",
          padding: "0 24px",
          lineHeight: 1.8,
        }}
      >
        Add your events above
        <br />
        to reveal your dimension
      </p>
    </div>
  );

  const transitionCanvas = (
    <div
      style={{
        minHeight: 400,
        background: "#030308",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`@keyframes fd-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <svg
        viewBox="0 0 200 200"
        width={160}
        height={160}
        style={{ animation: "fd-spin 4s linear infinite", marginBottom: 28, opacity: 0.8 }}
        aria-hidden
      >
        <rect x="20" y="20" width="120" height="120" fill="none" stroke="#5B7FFF" strokeWidth="1.5" />
        <rect x="60" y="60" width="120" height="120" fill="none" stroke="#5B7FFF" strokeWidth="1.5" />
        <line x1="20" y1="20" x2="60" y2="60"     stroke="#5B7FFF" strokeWidth="1" />
        <line x1="140" y1="20" x2="180" y2="60"   stroke="#5B7FFF" strokeWidth="1" />
        <line x1="20" y1="140" x2="60" y2="180"   stroke="#5B7FFF" strokeWidth="1" />
        <line x1="140" y1="140" x2="180" y2="180" stroke="#5B7FFF" strokeWidth="1" />
      </svg>
      <p
        style={{
          color: "#5B7FFF",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.22em",
          textAlign: "center",
          lineHeight: 2,
        }}
      >
        Calculating your coordinates
        <br />
        in the 5th Dimension…
      </p>
    </div>
  );

  const tesseractCanvas = (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: 560,
        overflow: "hidden",
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        background: "#0A0A0A",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Event nodes */}
      {events.map((ev) => {
        const cached = signalCache.current.has(ev.id);
        const isSelected = selectedId === ev.id;
        return (
          <div
            key={ev.id}
            onClick={(e) => {
              e.stopPropagation();
              if (!isDragging) handleNodeClick(ev);
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${ev.x + cameraOffset.x}px), calc(-50% + ${ev.y + cameraOffset.y}px))`,
              zIndex: 10,
              cursor: isDragging ? "grabbing" : "pointer",
              pointerEvents: isDragging ? "none" : "auto",
            }}
          >
            <div
              style={{
                border: `2px solid ${EMOTION_COLORS[ev.emotion]}`,
                background: isSelected
                  ? EMOTION_COLORS[ev.emotion] + "33"
                  : "rgba(10,10,10,0.88)",
                padding: "6px 12px",
                maxWidth: 160,
                backdropFilter: "blur(8px)",
                boxShadow: `0 0 14px ${EMOTION_COLORS[ev.emotion]}33, 3px 3px 0 ${EMOTION_COLORS[ev.emotion]}55`,
                transition: "all 120ms",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: EMOTION_COLORS[ev.emotion],
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  marginBottom: 2,
                }}
              >
                {EMOTION_LABELS[ev.emotion]}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#F0F0E8",
                  fontWeight: 600,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 140,
                }}
              >
                {ev.name || "Unnamed Event"}
              </div>
              {ev.date && (
                <div style={{ fontSize: 9, color: "rgba(240,240,232,0.45)", marginTop: 2 }}>
                  {ev.date}
                </div>
              )}
              {/* Blue dot if signal is cached */}
              {cached && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#5B7FFF",
                    boxShadow: "0 0 6px #5B7FFF",
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      <TesseractHUD eventCount={events.length} cameraOffset={cameraOffset} />
    </div>
  );

  const canvasSection =
    phase === "input"
      ? inputCanvas
      : phase === "transition"
      ? transitionCanvas
      : tesseractCanvas;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={controlsSection}
      canvasSection={canvasSection}
    />
  );
}
