"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import FloatingPanel, { PanelDisplay, PanelToggle } from "@/components/realms/FloatingPanel";
import { formatYearsAgo } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useCanvasSize } from "@/lib/realms/useCanvasSize";

const realm = realmsRegistry.find((r) => r.slug === "deep-time-context")!;

const TOTAL_YEARS = 13.8e9;
const TIMELINE_PX = 10000;
const PX_PER_YEAR = TIMELINE_PX / TOTAL_YEARS;

const TIMELINE_EVENTS = [
  { yearsBP: 13.8e9, name: "The Big Bang",           description: "The universe begins from a singularity.",                         category: "universe", color: "var(--accent-destiny)", size: "major" as const },
  { yearsBP: 13.6e9, name: "First Stars",             description: "Population III stars ignite across the universe.",                category: "stellar",  color: "#FDB813",               size: "major" as const },
  { yearsBP: 13.2e9, name: "First Galaxies",          description: "The first galaxies begin to coalesce.",                          category: "galactic", color: "var(--accent-scifi)",   size: "medium" as const },
  { yearsBP: 4.6e9,  name: "Solar System Forms",      description: "A cloud of gas and dust collapses into our Sun and planets.",    category: "solar",    color: "var(--accent-cosmos)",  size: "major" as const },
  { yearsBP: 4.5e9,  name: "Earth Forms",             description: "Proto-Earth coalesces from the protoplanetary disk.",            category: "earth",    color: "#4B8EF1",               size: "medium" as const },
  { yearsBP: 3.8e9,  name: "Life Emerges",            description: "First single-celled organisms in Earth's primordial oceans.",    category: "life",     color: "var(--accent-utility-a)", size: "major" as const },
  { yearsBP: 541e6,  name: "Cambrian Explosion",      description: "Complex multicellular life diversifies rapidly.",                category: "life",     color: "var(--accent-utility-a)", size: "medium" as const },
  { yearsBP: 252e6,  name: "Great Dying",             description: "96% of marine species extinct — the largest mass extinction.",   category: "life",     color: "var(--accent-utility-e)", size: "medium" as const },
  { yearsBP: 66e6,   name: "Dinosaurs Extinct",       description: "Chicxulub impactor ends the Cretaceous period.",                 category: "life",     color: "var(--accent-utility-e)", size: "medium" as const },
  { yearsBP: 300000, name: "Homo Sapiens Emerge",     description: "Modern humans appear in Africa.",                                category: "human",    color: "var(--accent-bio)",     size: "minor" as const },
  { yearsBP: 10000,  name: "Agriculture Begins",      description: "Humans begin farming — the start of civilization.",              category: "human",    color: "var(--accent-bio)",     size: "minor" as const },
  { yearsBP: 0,      name: "Right Now",               description: "You are here.",                                                  category: "human",    color: "var(--accent-cosmos)",  size: "major" as const },
];

const JUMP_SECTIONS = [
  { label: "Big Bang",    yearsBP: 13.8e9 },
  { label: "Solar Sys",  yearsBP: 4.6e9 },
  { label: "Life",        yearsBP: 3.8e9 },
  { label: "Humans",      yearsBP: 300000 },
  { label: "Now",         yearsBP: 0 },
];

function yearsToX(yearsBP: number) {
  return ((TOTAL_YEARS - yearsBP) / TOTAL_YEARS) * TIMELINE_PX;
}

export default function DeepTimeContext() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [earthOnly, setEarthOnly] = useState(false);
  const [visibleEpoch, setVisibleEpoch] = useState("Big Bang");
  const [activeEvt, setActiveEvt] = useState<typeof TIMELINE_EVENTS[0] | null>(null);
  const earthOnlyRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });

  const CANVAS_H = 300;

  // Sync refs to avoid unnecessary render calls
  useEffect(() => {
    earthOnlyRef.current = earthOnly;
  }, [earthOnly]);

  const renderCanvas = useCallback((scrollX: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = sizeRef.current;

    if (w === 0 || h === 0) return;

    const isDark = !document.documentElement.classList.contains("light");

    ctx.clearRect(0, 0, w, h);

    // Timeline axis
    const axisY = h * 0.6;
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(w, axisY);
    ctx.strokeStyle = "var(--border)";
    ctx.lineWidth = 2;
    ctx.stroke();

    const eo = earthOnlyRef.current;
    const events = eo ? TIMELINE_EVENTS.filter(e => ["earth","life","human"].includes(e.category)) : TIMELINE_EVENTS;

    // Update visible epoch based on scroll
    const scrollYearsBP = TOTAL_YEARS * (1 - scrollX / TIMELINE_PX);
    let closest = TIMELINE_EVENTS[0];
    let minDiff = Infinity;
    TIMELINE_EVENTS.forEach(ev => { const diff = Math.abs(ev.yearsBP - scrollYearsBP); if (diff < minDiff) { minDiff = diff; closest = ev; } });
    setVisibleEpoch(formatYearsAgo(closest.yearsBP) + " ago");

    // Draw events
    events.forEach((ev, idx) => {
      const ex = yearsToX(ev.yearsBP) - scrollX;
      if (ex < -60 || ex > w + 60) return;

      const tickH = ev.size === "major" ? 55 : ev.size === "medium" ? 28 : 14;
      const above = idx % 2 === 0;

      // Tick
      ctx.beginPath();
      ctx.moveTo(ex, axisY - (above ? tickH : 0));
      ctx.lineTo(ex, axisY + (above ? 0 : tickH));
      ctx.strokeStyle = ev.color.startsWith("var") ? (isDark ? "#4B8EF1" : "#1A1A2E") : ev.color;
      ctx.lineWidth = ev.size === "major" ? 2 : 1.5;
      ctx.stroke();

      // Dot
      ctx.beginPath();
      ctx.arc(ex, axisY, 4, 0, Math.PI * 2);
      ctx.fillStyle = ev.color.startsWith("var") ? (isDark ? "#4B8EF1" : "#1A1A2E") : ev.color;
      ctx.fill();

      // Label
      ctx.textAlign = "center";
      ctx.font = `${ev.size === "major" ? 13 : 11}px var(--font-ui)`;
      ctx.fillStyle = isDark ? "rgba(232,232,240,0.85)" : "rgba(26,26,46,0.85)";
      ctx.fillText(ev.name, ex, axisY - (above ? tickH + 8 : -(tickH + 18)));

      // Years ago
      ctx.font = "10px var(--font-mono)";
      ctx.fillStyle = "var(--text-muted)";
      ctx.fillText(ev.yearsBP === 0 ? "NOW" : formatYearsAgo(ev.yearsBP), ex, axisY + (above ? 14 : -(tickH + 8)));
    });
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    renderCanvas(scrollRef.current.scrollLeft);
  }, [renderCanvas]);

  useCanvasSize(canvasRef, useCallback((w: number, h: number) => {
    sizeRef.current = { w, h };
    if (scrollRef.current) {
      renderCanvas(scrollRef.current.scrollLeft);
    }
  }, [renderCanvas]));

  // Handle native wheel listener to redirect vertical scroll horizontally
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Initial scroll positioning
  useEffect(() => {
    const w = canvasRef.current?.clientWidth ?? 800;
    const nowX = yearsToX(0) - w / 2;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = Math.max(0, nowX);
    }
    renderCanvas(Math.max(0, nowX));
  }, [renderCanvas]);

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div style={{ width: "100%", height: "100%", position: "relative", minHeight: "450px", overflow: "hidden", background: "var(--bg-base)" }}>
        {/* Jump buttons */}
        <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", zIndex: 10, display: "flex", gap: 8 }}>
          {JUMP_SECTIONS.map(s => (
            <button key={s.label} onClick={() => {
              const w = canvasRef.current?.clientWidth ?? 800;
              const x = Math.max(0, yearsToX(s.yearsBP) - w / 2);
              if (scrollRef.current) { scrollRef.current.scrollLeft = x; renderCanvas(x); }
            }}
              style={{ fontFamily: "var(--font-ui)", fontSize: 12, padding: "5px 14px", borderRadius: 100, border: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-card) 85%, transparent)", backdropFilter: "blur(8px)", color: "var(--text-primary)", cursor: "pointer" }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Canvas positioned statically behind */}
        <canvas ref={canvasRef} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, pointerEvents: "none", zIndex: 0, width: "100%", height: `${CANVAS_H}px` }} />

        {/* Scrollable transparent timeline layer on top */}
        <div ref={scrollRef} onScroll={handleScroll} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 0, right: 0, overflowX: "auto", overflowY: "hidden", height: CANVAS_H + 40, zIndex: 1 }}>
          <div style={{ width: TIMELINE_PX, height: CANVAS_H + 40, position: "relative" }}>
            {/* Clickable event areas */}
            {TIMELINE_EVENTS.map(ev => (
              <div key={ev.yearsBP} onClick={() => setActiveEvt(activeEvt?.yearsBP === ev.yearsBP ? null : ev)}
                style={{ position: "absolute", left: yearsToX(ev.yearsBP) - 20, top: 0, width: 40, height: CANVAS_H + 20, cursor: "pointer" }} />
            ))}
          </div>
        </div>

        {/* Event tooltip */}
        {activeEvt && (
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 20, background: "color-mix(in srgb, var(--bg-card) 95%, transparent)", backdropFilter: "blur(16px)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 24px", maxWidth: 400, textAlign: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", margin: "0 0 8px 0" }}>{activeEvt.name}</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", margin: "0 0 8px 0" }}>{activeEvt.yearsBP === 0 ? "RIGHT NOW" : formatYearsAgo(activeEvt.yearsBP) + " ago"}</p>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{activeEvt.description}</p>
          </div>
        )}

        <FloatingPanel id="dt-controls" title="DEEP TIME" defaultPosition="top-right">
          <PanelDisplay label="VISIBLE EPOCH" value={visibleEpoch} />
          <PanelToggle label="Earth Events Only" value={earthOnly} onChange={v => { setEarthOnly(v); }} />
        </FloatingPanel>
      </div>
    </RealmLayout>
  );
}
