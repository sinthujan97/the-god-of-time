"use client";

import { useState, useEffect } from "react";
import ClockLayout from "../ClockLayout";
import { clocksRegistry } from "@/lib/data/clocksRegistry";

const clock = clocksRegistry.find((c) => c.id === "ambient-clock")!;

type Face = "analog" | "word" | "binary" | "hex" | "fibonacci" | "decimal";

const FACES: { id: Face; label: string }[] = [
  { id: "analog",    label: "Analog" },
  { id: "word",      label: "Word" },
  { id: "binary",    label: "Binary" },
  { id: "hex",       label: "Hex Color" },
  { id: "fibonacci", label: "Fibonacci" },
  { id: "decimal",   label: "Decimal" },
];

// ── Analog ──────────────────────────────────────────────
function AnalogFace({ h, m, s }: { h: number; m: number; s: number }) {
  const cx = 120, cy = 120, r = 108;
  function hand(deg: number, len: number, w: number, color: string) {
    const a = (deg - 90) * Math.PI / 180;
    return <line x1={cx} y1={cy} x2={cx + len * Math.cos(a)} y2={cy + len * Math.sin(a)} stroke={color} strokeWidth={w} strokeLinecap="round" />;
  }
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "36px 24px" }}>
      <svg viewBox="0 0 240 240" style={{ width: "min(240px, 100%)", height: "auto" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={2} />
        {Array.from({ length: 60 }, (_, i) => {
          const a = ((i / 60) * 360 - 90) * Math.PI / 180;
          const isH = i % 5 === 0;
          const inner = r - (isH ? 14 : 6);
          return <line key={i} x1={cx + inner * Math.cos(a)} y1={cy + inner * Math.sin(a)} x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)} stroke="var(--border)" strokeWidth={isH ? 2.5 : 1} />;
        })}
        {hand(((h % 12 + m / 60) / 12) * 360, 64, 5,   "var(--text-primary)")}
        {hand(((m + s / 60) / 60) * 360,        88, 3.5, "var(--text-primary)")}
        {hand((s / 60) * 360,                    94, 1.5, "var(--section-clocks-accent)")}
        <circle cx={cx} cy={cy} r={5} fill="var(--section-clocks-accent)" />
        <circle cx={cx} cy={cy} r={2} fill="var(--bg-card)" />
      </svg>
    </div>
  );
}

// ── Word ────────────────────────────────────────────────
const HOUR_W = ["twelve","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"];
const MIN_PHRASES: [number, string][] = [
  [0,"o'clock"],[5,"five past"],[10,"ten past"],[15,"quarter past"],
  [20,"twenty past"],[25,"twenty-five past"],[30,"half past"],
  [35,"twenty-five to"],[40,"twenty to"],[45,"quarter to"],[50,"ten to"],[55,"five to"],
];
function WordFace({ h, m }: { h: number; m: number }) {
  const rounded = Math.round(m / 5) * 5 % 60;
  const isTo = rounded > 30;
  const dh = isTo ? (h + 1) % 24 : h;
  const hourWord = HOUR_W[dh % 12 === 0 ? 0 : dh % 12];
  const [, phrase] = MIN_PHRASES.find(([min]) => min === rounded) ?? [0, "o'clock"];
  const text = phrase === "o'clock" ? `${hourWord}\no'clock` : `${phrase}\n${hourWord}`;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", minHeight: 220 }}>
      <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 800, color: "var(--text-primary)", textAlign: "center", lineHeight: 1.25, textTransform: "uppercase", letterSpacing: "0.03em", whiteSpace: "pre-line" }}>
        {text}
      </p>
    </div>
  );
}

// ── Binary ──────────────────────────────────────────────
const BIN_BITS = [8, 4, 2, 1];
const BIN_COLORS = ["var(--destructive)","var(--destructive)","var(--section-clocks-accent)","var(--section-clocks-accent)","var(--accent-utility-a)","var(--accent-utility-a)"];
function BinaryFace({ h, m, s }: { h: number; m: number; s: number }) {
  const cols = [
    { d: Math.floor(h / 10), max: 2 }, { d: h % 10,           max: 9 },
    { d: Math.floor(m / 10), max: 5 }, { d: m % 10,           max: 9 },
    { d: Math.floor(s / 10), max: 5 }, { d: s % 10,           max: 9 },
  ];
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-end", padding: "40px 24px" }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
          {BIN_BITS.map((bit, bi) => {
            const active = (col.d & bit) !== 0;
            const relevant = bit <= col.max;
            return (
              <div key={bi} style={{ width: 26, height: 26, borderRadius: "50%", background: active ? BIN_COLORS[ci] : relevant ? "var(--border)" : "transparent", border: relevant ? `2px solid ${active ? BIN_COLORS[ci] : "var(--border)"}` : "none", transition: "background 0.25s" }} />
            );
          })}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700, color: BIN_COLORS[ci], letterSpacing: "0.06em" }}>
            {["H","H","M","M","S","S"][ci]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Hex Color ───────────────────────────────────────────
function HexFace({ h, m, s }: { h: number; m: number; s: number }) {
  const r = Math.round((h / 23) * 255);
  const g = Math.round((m / 59) * 255);
  const b = Math.round((s / 59) * 255);
  const bg = `rgb(${r},${g},${b})`;
  const hex = `#${[r,g,b].map((v) => v.toString(16).padStart(2,"0")).join("").toUpperCase()}`;
  const pad2 = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ flex: 1, minHeight: 260, display: "flex", alignItems: "center", justifyContent: "center", background: bg, transition: "background 1s ease" }}>
      <div style={{ background: "var(--bg-card)", border: "2px solid var(--border)", borderRadius: 10, padding: "20px 28px", textAlign: "center", boxShadow: "4px 4px 0 var(--shadow-color)" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.06em", lineHeight: 1 }}>{hex}</p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>{pad2(h)}:{pad2(m)}:{pad2(s)}</p>
      </div>
    </div>
  );
}

// ── Fibonacci ───────────────────────────────────────────
const FIBS = [1, 1, 2, 3, 5];
function fiboSubset(target: number): boolean[] {
  const used = [false, false, false, false, false];
  let rem = target;
  for (let i = 4; i >= 0; i--) {
    if (FIBS[i] <= rem) { used[i] = true; rem -= FIBS[i]; }
  }
  return rem === 0 ? used : [false, false, false, false, false];
}
function FibonacciFace({ h, m }: { h: number; m: number }) {
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const min5 = Math.round(m / 5) % 12;
  const hourUsed = fiboSubset(hour12);
  const minUsed  = fiboSubset(min5);
  const U = 30;
  const color = (i: number) =>
    hourUsed[i] && minUsed[i] ? "var(--section-clocks-accent)"
    : hourUsed[i] ? "var(--destructive)"
    : minUsed[i] ? "var(--accent-utility-a)"
    : "var(--border)";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "40px 24px" }}>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
        {FIBS.map((f, i) => (
          <div key={i} style={{ width: f * U, height: f * U, background: color(i), border: "2px solid var(--border)", borderRadius: 4, transition: "background 0.5s ease", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: Math.max(9, f * 6), fontWeight: 700, color: color(i) === "var(--border)" ? "var(--text-muted)" : "var(--section-clocks-text-on-accent)", opacity: 0.8 }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {([ ["Hours", "var(--destructive)"], ["Minutes", "var(--accent-utility-a)"], ["Both", "var(--section-clocks-accent)"] ] as [string,string][]).map(([label, c]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 10, height: 10, background: c, borderRadius: 2 }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", fontWeight: 700 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Decimal ─────────────────────────────────────────────
function DecimalFace({ h, m, s }: { h: number; m: number; s: number }) {
  const frac = (h * 3600 + m * 60 + s) / 86400;
  const dh = Math.floor(frac * 10);
  const dm = Math.floor((frac * 1000) % 100);
  const ds = Math.floor((frac * 100000) % 100);
  const p2 = (n: number) => String(n).padStart(2, "0");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: "48px 32px", minHeight: 220 }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(44px, 9vw, 78px)", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "0.04em", lineHeight: 1 }}>
        {dh}:{p2(dm)}:{p2(ds)}
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
        Decimal Time · 10h · 100min · 100sec
      </p>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────
export default function AmbientClock() {
  const [face, setFace] = useState<Face>("analog");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

  return (
    <ClockLayout clock={clock}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", borderBottom: "2px solid var(--border)", overflowX: "auto" }}>
          {FACES.map((f) => (
            <button key={f.id} onClick={() => setFace(f.id)} style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, padding: "10px 14px", border: "none", borderBottom: face === f.id ? "3px solid var(--section-clocks-accent)" : "3px solid transparent", background: "transparent", color: face === f.id ? "var(--section-clocks-accent)" : "var(--text-muted)", cursor: "pointer", whiteSpace: "nowrap", marginBottom: -2, transition: "color 0.15s" }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280, overflow: "hidden" }}>
          {face === "analog"    && <AnalogFace h={h} m={m} s={s} />}
          {face === "word"      && <WordFace h={h} m={m} />}
          {face === "binary"    && <BinaryFace h={h} m={m} s={s} />}
          {face === "hex"       && <HexFace h={h} m={m} s={s} />}
          {face === "fibonacci" && <FibonacciFace h={h} m={m} />}
          {face === "decimal"   && <DecimalFace h={h} m={m} s={s} />}
        </div>
      </div>
    </ClockLayout>
  );
}
