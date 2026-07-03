"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Geological events ────────────────────────────────────────────────────────

type GeoEvent = {
  yrsAgo: number;
  emoji: string;
  label: string;
  note: string;
};

const EVENTS: GeoEvent[] = [
  { yrsAgo: 4_500_000_000, emoji: "🌍", label: "Earth forms",               note: "Accretion from the solar nebula" },
  { yrsAgo: 4_100_000_000, emoji: "💧", label: "First oceans",              note: "Liquid water accumulates on the surface" },
  { yrsAgo: 3_800_000_000, emoji: "🦠", label: "First life",                note: "Single-celled prokaryotes emerge" },
  { yrsAgo: 2_700_000_000, emoji: "🌿", label: "Photosynthesis begins",     note: "Cyanobacteria evolve" },
  { yrsAgo: 2_400_000_000, emoji: "💨", label: "Great Oxidation Event",     note: "Oxygen floods the atmosphere" },
  { yrsAgo: 1_500_000_000, emoji: "🔬", label: "Complex cells",             note: "Eukaryotes evolve a nucleus" },
  { yrsAgo:   600_000_000, emoji: "🐚", label: "Cambrian Explosion",        note: "Complex animal life diversifies rapidly" },
  { yrsAgo:   475_000_000, emoji: "🌱", label: "First land plants",         note: "Colonisation of land begins" },
  { yrsAgo:   230_000_000, emoji: "🦕", label: "Dinosaurs appear",          note: "Triassic period begins" },
  { yrsAgo:    66_000_000, emoji: "☄️", label: "Chicxulub impact",          note: "Mass extinction ends the Cretaceous" },
  { yrsAgo:     5_000_000, emoji: "🦴", label: "Hominids diverge",          note: "Split from common ancestor with chimps" },
  { yrsAgo:       300_000, emoji: "🧠", label: "Homo sapiens appear",       note: "Anatomically modern humans evolve" },
  { yrsAgo:        12_000, emoji: "🌾", label: "Agriculture begins",        note: "Neolithic revolution, Fertile Crescent" },
  { yrsAgo:         5_500, emoji: "📜", label: "Writing invented",           note: "Cuneiform in Sumer, Mesopotamia" },
  { yrsAgo:             0, emoji: "📍", label: "Right now",                 note: "The very end of 4.5 billion years" },
];

const EARTH_AGE_YRS = 4_500_000_000;
const SECS_IN_24H   = 86_400;

function yrsToClockSec(yrsAgo: number): number {
  return SECS_IN_24H - (yrsAgo / EARTH_AGE_YRS) * SECS_IN_24H;
}

function clockTimeStr(yrsAgo: number): string {
  const totalSec = yrsToClockSec(yrsAgo);
  const h = Math.floor(totalSec / 3600) % 24;
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// ─── SVG clock ────────────────────────────────────────────────────────────────

function DeepClockFace({
  events,
  selectedIdx,
  onSelect,
  accent,
}: {
  events: GeoEvent[];
  selectedIdx: number | null;
  onSelect: (i: number | null) => void;
  accent: string;
}) {
  const SIZE = 320;
  const CX   = SIZE / 2;
  const CY   = SIZE / 2;
  const R    = 130; // face radius

  // Convert clock-second (0–86400) to SVG angle.
  // 0s → top (midnight), clockwise.
  function secToAngle(sec: number): number {
    return (sec / SECS_IN_24H) * 360 - 90;
  }

  function polarToXY(angleDeg: number, radius: number) {
    const rad = angleDeg * (Math.PI / 180);
    return { x: CX + Math.cos(rad) * radius, y: CY + Math.sin(rad) * radius };
  }

  // Earth hand always at midnight (top of face = today)
  const handAngle = 270; // -90° → pointing straight up
  const handTip   = polarToXY(handAngle, R * 0.85);

  // Hour markers (24h)
  const hourMarkers = Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * 360 - 90;
    const outer = polarToXY(angle, R);
    const inner = polarToXY(angle, R - (i % 6 === 0 ? 14 : 7));
    return { outer, inner, major: i % 6 === 0, label: String(i).padStart(2,"0") };
  });

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width="100%"
      style={{ maxWidth: SIZE, display: "block", margin: "0 auto" }}
    >
      {/* Background */}
      <circle cx={CX} cy={CY} r={R + 20} fill="#0a0a0f" />

      {/* Face */}
      <circle cx={CX} cy={CY} r={R} fill="#111118" stroke="var(--border)" strokeWidth={2} />

      {/* Hour markers */}
      {hourMarkers.map((m, i) => (
        <g key={i}>
          <line
            x1={m.outer.x} y1={m.outer.y}
            x2={m.inner.x} y2={m.inner.y}
            stroke={m.major ? accent : "rgba(255,255,255,0.2)"}
            strokeWidth={m.major ? 2 : 1}
          />
          {m.major && (
            <text
              x={polarToXY((i / 24) * 360 - 90, R - 24).x}
              y={polarToXY((i / 24) * 360 - 90, R - 24).y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={8}
              fill="rgba(255,255,255,0.4)"
              fontFamily="monospace"
            >
              {m.label}h
            </text>
          )}
        </g>
      ))}

      {/* Event dots */}
      {events.map((ev, i) => {
        const sec   = yrsToClockSec(ev.yrsAgo);
        const angle = secToAngle(sec);
        const dotR  = selectedIdx === i ? R - 15 : R - 18;
        const pos   = polarToXY(angle, dotR);
        const isSelected = selectedIdx === i;
        const isLast = ev.yrsAgo === 0;

        return (
          <g
            key={i}
            onClick={() => onSelect(selectedIdx === i ? null : i)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isSelected ? 9 : 6}
              fill={isSelected ? accent : isLast ? accent : "#1e293b"}
              stroke={isSelected ? accent : isLast ? accent : "rgba(255,255,255,0.35)"}
              strokeWidth={isSelected ? 2 : 1}
            />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isSelected ? 7 : 5.5}
            >
              {ev.emoji}
            </text>
          </g>
        );
      })}

      {/* Earth hand */}
      <line
        x1={CX} y1={CY}
        x2={handTip.x} y2={handTip.y}
        stroke={accent}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <circle cx={CX} cy={CY} r={5} fill={accent} />

      {/* Center label */}
      <text x={CX} y={CY + 22} textAnchor="middle" fontSize={7} fill="rgba(255,255,255,0.3)" fontFamily="monospace">
        4.5 BILLION YRS
      </text>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function DeepTimeClock() {
  const slug   = usePathname().split("/").pop();
  const realm  = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];
  const accent = realm.accent;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [now, setNow]                 = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const selected = selectedIdx !== null ? EVENTS[selectedIdx] : null;

  // Key stats
  const humansPct  = (300_000 / EARTH_AGE_YRS * 100).toFixed(4);
  const historyPct = (5_500 / EARTH_AGE_YRS * 100).toFixed(7);

  const controls = (
    <div className="flex flex-col gap-5">
      {/* Live real time */}
      <div
        className="p-4 rounded"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted mb-1">
          Current Earth Time
        </div>
        <div className="font-mono text-2xl font-bold" style={{ color: accent }}>
          {now.toLocaleTimeString()}
        </div>
        <div className="text-[10px] text-text-muted font-sans mt-1">
          {now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* How to read */}
      <div
        className="p-4 rounded flex flex-col gap-2"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          How to Read This Clock
        </div>
        <p className="text-xs font-sans text-text-primary leading-relaxed">
          The full 24-hour face represents <strong>4.5 billion years</strong> of Earth history. Midnight at the top is when Earth formed. The hand points straight up — to <em>right now</em>, the second midnight.
        </p>
        <p className="text-xs font-sans text-text-muted leading-relaxed">
          Click any dot around the face to see when that event happened on the geological clock.
        </p>
      </div>

      {/* Key stats */}
      <div className="flex flex-col gap-2">
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Perspective
        </div>
        {[
          ["Humans exist for", `0.0067% of Earth's age`],
          ["Recorded history", `${historyPct}% of Earth's age`],
          ["1 clock second =", "52,083 years of real time"],
          ["1 clock minute =", "3.125 million years"],
        ].map(([k, v]) => (
          <div
            key={k}
            className="p-3 rounded flex justify-between items-center gap-2"
            style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}
          >
            <span className="text-[10px] font-sans text-text-muted">{k}</span>
            <span className="text-xs font-mono font-bold" style={{ color: accent }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const canvas_ = (
    <div className="flex flex-col gap-5">
      {/* Clock */}
      <div
        className="w-full p-4 rounded"
        style={{ border: "2px solid var(--border)", boxShadow: `3px 3px 0 var(--shadow-color)`, background: "#0a0a0f" }}
      >
        <DeepClockFace
          events={EVENTS}
          selectedIdx={selectedIdx}
          onSelect={setSelectedIdx}
          accent={accent}
        />
        <div className="text-center text-[10px] text-text-muted font-sans mt-3">
          Click event dots to explore • Hand points to today (midnight)
        </div>
      </div>

      {/* Selected event detail */}
      {selected ? (
        <div
          className="p-4 rounded flex flex-col gap-2"
          style={{ border: `2px solid ${accent}`, boxShadow: `3px 3px 0 ${accent}55`, background: "var(--bg-card)" }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selected.emoji}</span>
            <div>
              <div className="font-mono font-bold text-sm" style={{ color: accent }}>{selected.label}</div>
              <div className="text-[10px] text-text-muted font-sans">{selected.note}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-text-muted font-sans">Years ago</span>
              <span className="font-mono text-xs font-bold" style={{ color: accent }}>
                {selected.yrsAgo === 0 ? "0" : selected.yrsAgo.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-wider text-text-muted font-sans">Clock time</span>
              <span className="font-mono text-xs font-bold" style={{ color: accent }}>
                {clockTimeStr(selected.yrsAgo)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="p-4 rounded text-center"
          style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
        >
          <div className="text-[10px] font-sans text-text-muted">Select an event dot on the clock to see details</div>
        </div>
      )}

      {/* All events list */}
      <div
        className="rounded overflow-hidden"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
      >
        <div
          className="px-4 py-2"
          style={{ background: accent, borderBottom: "2px solid var(--border)" }}
        >
          <span className="text-xs font-mono font-bold text-black">All Events — Geological Clock</span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {EVENTS.map((ev, i) => (
            <button
              key={i}
              className="w-full text-left flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-hover)]"
              style={{ background: selectedIdx === i ? `${accent}11` : undefined }}
              onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
            >
              <span className="text-base w-6 flex-shrink-0">{ev.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono font-bold" style={{ color: selectedIdx === i ? accent : "var(--text-primary)" }}>
                  {ev.label}
                </div>
                <div className="text-[9px] font-sans text-text-muted truncate">{ev.note}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[9px] font-mono" style={{ color: accent }}>
                  {clockTimeStr(ev.yrsAgo)}
                </div>
                <div className="text-[8px] text-text-faint font-sans">
                  {ev.yrsAgo === 0 ? "today" : ev.yrsAgo >= 1_000_000_000
                    ? `${(ev.yrsAgo / 1_000_000_000).toFixed(1)}By`
                    : ev.yrsAgo >= 1_000_000
                    ? `${(ev.yrsAgo / 1_000_000).toFixed(0)}My`
                    : `${(ev.yrsAgo / 1_000).toFixed(0)}ky`} ago
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} controlsSection={controls} canvasSection={canvas_} />
  );
}
