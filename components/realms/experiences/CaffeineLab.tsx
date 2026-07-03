"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Beverage definitions ─────────────────────────────────────────────────────

type Beverage = { name: string; mg: number; emoji: string };

const BEVERAGES: Beverage[] = [
  { name: "Coffee",        mg: 95,  emoji: "☕" },
  { name: "Espresso",      mg: 63,  emoji: "⚡" },
  { name: "Latte",         mg: 150, emoji: "🥛" },
  { name: "Green Tea",     mg: 30,  emoji: "🍵" },
  { name: "Energy Drink",  mg: 80,  emoji: "🔋" },
  { name: "Cola",          mg: 34,  emoji: "🥤" },
];

const HALF_LIFE_HRS = 5.7;

// ─── Types ────────────────────────────────────────────────────────────────────

type Dose = { id: string; mg: number; name: string; emoji: string; time: Date };

// ─── Caffeine math ────────────────────────────────────────────────────────────

function caffeineAt(doses: Dose[], atTime: Date): number {
  return doses.reduce((total, d) => {
    const hrsElapsed = (atTime.getTime() - d.time.getTime()) / 3_600_000;
    if (hrsElapsed < 0) return total;
    return total + d.mg * Math.pow(0.5, hrsElapsed / HALF_LIFE_HRS);
  }, 0);
}

function minsUntilBelow(doses: Dose[], threshold: number, fromTime: Date): number | null {
  // Binary search for when caffeine drops below threshold
  let lo = 0, hi = 24 * 60 * 2; // search up to 48 hours out
  const atT = (mins: number) =>
    caffeineAt(doses, new Date(fromTime.getTime() + mins * 60_000));
  if (atT(0) <= threshold) return 0;
  if (atT(hi) > threshold) return null; // never drops below
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    atT(mid) > threshold ? (lo = mid) : (hi = mid);
  }
  return Math.ceil(hi);
}

function fmtMins(totalMins: number): string {
  const h = Math.floor(totalMins / 60);
  const m = Math.round(totalMins % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ─── SVG Decay Curve ─────────────────────────────────────────────────────────

const CURVE_W = 560;
const CURVE_H = 200;
const PAD_L   = 52;
const PAD_R   = 16;
const PAD_T   = 16;
const PAD_B   = 36;
const PLOT_W  = CURVE_W - PAD_L - PAD_R;
const PLOT_H  = CURVE_H - PAD_T - PAD_B;

function DecayCurve({
  doses,
  accent,
  now,
}: {
  doses: Dose[];
  accent: string;
  now: Date;
}) {
  const STEPS = 96; // 15-min intervals over 24h
  const SPAN_HRS = 24;

  const earliest = doses.reduce(
    (min, d) => (d.time < min ? d.time : min),
    doses[0].time
  );
  const startTime = new Date(earliest.getTime() - 30 * 60_000); // 30min before first dose

  const points = Array.from({ length: STEPS + 1 }, (_, i) => {
    const t = new Date(startTime.getTime() + (i / STEPS) * SPAN_HRS * 3_600_000);
    return { t, mg: caffeineAt(doses, t) };
  });

  const peakMg = Math.max(...points.map((p) => p.mg), 50);
  const yScale = PLOT_H / (peakMg * 1.15);
  const xScale = PLOT_W / (SPAN_HRS * 3_600_000);

  const toX = (t: Date) =>
    PAD_L + (t.getTime() - startTime.getTime()) * xScale;
  const toY = (mg: number) =>
    PAD_T + PLOT_H - mg * yScale;

  const polyPoints = points
    .map((p) => `${toX(p.t).toFixed(1)},${toY(p.mg).toFixed(1)}`)
    .join(" ");

  const nowX = Math.min(Math.max(toX(now), PAD_L), PAD_L + PLOT_W);
  const nowMg = caffeineAt(doses, now);
  const nowY = toY(nowMg);

  // Zone Y thresholds
  const y200 = toY(200);
  const y50  = toY(50);

  // X-axis labels (every 4h)
  const xLabels = Array.from({ length: 7 }, (_, i) => {
    const t = new Date(startTime.getTime() + i * 4 * 3_600_000);
    const x = toX(t);
    const label = `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`;
    return { x, label };
  }).filter((l) => l.x >= PAD_L && l.x <= PAD_L + PLOT_W);

  return (
    <svg
      viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
      className="w-full"
      style={{ height: CURVE_H, display: "block" }}
    >
      {/* Background zones */}
      {/* SLEEP READY zone (0–50mg) */}
      <rect
        x={PAD_L} y={toY(50)} width={PLOT_W} height={PLOT_H - toY(50) + PAD_T}
        fill="rgba(52,211,153,0.06)"
      />
      {/* ALERT zone (50–200mg) */}
      {peakMg > 50 && (
        <rect
          x={PAD_L}
          y={Math.max(PAD_T, y200)}
          width={PLOT_W}
          height={Math.max(0, y50 - Math.max(PAD_T, y200))}
          fill="rgba(251,191,36,0.05)"
        />
      )}
      {/* HIGH ALERT zone (>200mg) */}
      {peakMg > 200 && (
        <rect
          x={PAD_L} y={PAD_T} width={PLOT_W} height={Math.max(0, y200 - PAD_T)}
          fill="rgba(239,68,68,0.07)"
        />
      )}

      {/* Zone labels */}
      <text x={PAD_L + 4} y={toY(30)} fontSize={8} fill="rgba(52,211,153,0.6)" fontFamily="var(--font-ui)" fontWeight="700" textAnchor="start" letterSpacing="0.08em">
        SLEEP READY
      </text>
      {peakMg > 80 && (
        <text x={PAD_L + 4} y={Math.min(toY(120), y50 - 4)} fontSize={8} fill="rgba(251,191,36,0.55)" fontFamily="var(--font-ui)" fontWeight="700" textAnchor="start" letterSpacing="0.08em">
          ALERT
        </text>
      )}
      {peakMg > 200 && (
        <text x={PAD_L + 4} y={PAD_T + 10} fontSize={8} fill="rgba(239,68,68,0.6)" fontFamily="var(--font-ui)" fontWeight="700" textAnchor="start" letterSpacing="0.08em">
          HIGH ALERT
        </text>
      )}

      {/* 50mg threshold line */}
      <line x1={PAD_L} y1={y50} x2={PAD_L + PLOT_W} y2={y50}
        stroke="rgba(52,211,153,0.35)" strokeWidth="1" strokeDasharray="4,3" />

      {/* Plot border */}
      <rect x={PAD_L} y={PAD_T} width={PLOT_W} height={PLOT_H}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Decay curve */}
      <polyline
        points={polyPoints}
        fill="none"
        stroke={accent}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      />
      {/* Fill under curve */}
      <polygon
        points={`${PAD_L},${PAD_T + PLOT_H} ${polyPoints} ${PAD_L + PLOT_W},${PAD_T + PLOT_H}`}
        fill={`${accent}18`}
      />

      {/* NOW vertical line */}
      <line x1={nowX} y1={PAD_T} x2={nowX} y2={PAD_T + PLOT_H}
        stroke="rgba(255,255,255,0.25)" strokeWidth="1" strokeDasharray="3,3" />
      <text x={nowX + 3} y={PAD_T + 10} fontSize={8} fill="rgba(255,255,255,0.4)"
        fontFamily="var(--font-ui)" fontWeight="700" letterSpacing="0.06em">
        NOW
      </text>

      {/* Current position dot */}
      {nowX >= PAD_L && nowX <= PAD_L + PLOT_W && (
        <>
          <circle cx={nowX} cy={nowY} r={5} fill="#06060A" stroke={accent} strokeWidth="2" />
          <circle cx={nowX} cy={nowY} r={2.5} fill={accent} />
        </>
      )}

      {/* Dose markers */}
      {doses.map((d) => {
        const dx = toX(d.time);
        if (dx < PAD_L || dx > PAD_L + PLOT_W) return null;
        return (
          <g key={d.id}>
            <line x1={dx} y1={PAD_T} x2={dx} y2={PAD_T + PLOT_H}
              stroke={`${accent}55`} strokeWidth="1" />
            <text x={dx + 2} y={PAD_T + PLOT_H - 4} fontSize={8} fill={`${accent}99`}
              fontFamily="var(--font-ui)">
              {d.emoji}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {xLabels.map(({ x, label }) => (
        <text key={label} x={x} y={CURVE_H - 6} fontSize={8}
          fill="rgba(255,255,255,0.3)" fontFamily="var(--font-ui)" textAnchor="middle">
          {label}
        </text>
      ))}

      {/* Y-axis labels */}
      {[0, 100, 200].filter((v) => v <= peakMg * 1.1).map((v) => {
        const y = toY(v);
        if (y < PAD_T || y > PAD_T + PLOT_H) return null;
        return (
          <text key={v} x={PAD_L - 4} y={y + 3} fontSize={8}
            fill="rgba(255,255,255,0.3)" fontFamily="var(--font-ui)" textAnchor="end">
            {v}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CaffeineLab() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "caffeine-lab";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [doses,        setDoses]        = useState<Dose[]>([]);
  const [selectedBev,  setSelectedBev]  = useState<Beverage>(BEVERAGES[0]);
  const [doseTime,     setDoseTime]     = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [tick, setTick] = useState(0);
  const nowRef = useRef(new Date());

  // Refresh every 60s
  useEffect(() => {
    const id = setInterval(() => {
      nowRef.current = new Date();
      setTick((t) => t + 1);
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  const addDose = useCallback(() => {
    const [h, m] = doseTime.split(":").map(Number);
    const t = new Date();
    t.setHours(h, m, 0, 0);
    setDoses((prev) => [
      ...prev,
      {
        id:    `${Date.now()}`,
        mg:    selectedBev.mg,
        name:  selectedBev.name,
        emoji: selectedBev.emoji,
        time:  t,
      },
    ]);
  }, [doseTime, selectedBev]);

  const removeDose = useCallback((id: string) => {
    setDoses((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const now = nowRef.current;

  const currentMg   = useMemo(() => caffeineAt(doses, now), [doses, now, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const peakMg      = useMemo(() => {
    let peak = 0;
    for (let m = -30; m <= 0; m += 5) {
      const t = new Date(now.getTime() + m * 60_000);
      peak = Math.max(peak, caffeineAt(doses, t));
    }
    // Check historical peak since earliest dose
    if (doses.length > 0) {
      const earliest = doses.reduce((mn, d) => d.time < mn ? d.time : mn, doses[0].time);
      for (let step = 0; step <= 120; step++) {
        const t = new Date(earliest.getTime() + step * 15 * 60_000);
        if (t > now) break;
        peak = Math.max(peak, caffeineAt(doses, t));
      }
    }
    return peak;
  }, [doses, now, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const halfLivesElapsed = useMemo(() => {
    if (doses.length === 0) return 0;
    const earliest = doses.reduce((mn, d) => d.time < mn ? d.time : mn, doses[0].time);
    return (now.getTime() - earliest.getTime()) / (HALF_LIFE_HRS * 3_600_000);
  }, [doses, now, tick]); // eslint-disable-line react-hooks/exhaustive-deps
  const minsToSleep = useMemo(() => minsUntilBelow(doses, 50, now), [doses, now, tick]); // eslint-disable-line react-hooks/exhaustive-deps

  void tick;

  const hasDoses = doses.length > 0;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          {/* Beverage selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Beverage
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BEVERAGES.map((bev) => (
                <button
                  key={bev.name}
                  onClick={() => setSelectedBev(bev)}
                  className="px-2 py-2 text-[11px] font-sans font-bold transition-all text-left"
                  style={{
                    border: "2px solid var(--border)",
                    background: selectedBev.name === bev.name ? accent : "var(--bg-card)",
                    color: selectedBev.name === bev.name ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: selectedBev.name === bev.name ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  {bev.emoji} {bev.name}
                  <span className="block text-[9px] font-normal opacity-70">{bev.mg}mg</span>
                </button>
              ))}
            </div>
          </div>

          {/* Time picker */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
              Time consumed
            </label>
            <input
              type="time"
              value={doseTime}
              onChange={(e) => setDoseTime(e.target.value)}
              className="px-3 py-2 font-mono text-sm bg-bg-base text-text-primary"
              style={{ border: "2px solid var(--border)", outline: "none" }}
            />
          </div>

          <button
            onClick={addDose}
            className="calculate-btn"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            + Add Dose
          </button>

          {/* Dose log */}
          {hasDoses && (
            <div className="flex flex-col gap-2 border-t border-border pt-4 mt-1">
              <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted mb-1">
                Today&apos;s doses
              </p>
              {doses.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-3 py-2"
                  style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}
                >
                  <span className="font-sans text-xs text-text-muted">
                    {d.emoji} {d.name}
                    <span className="font-mono ml-2 font-semibold" style={{ color: accent }}>{d.mg}mg</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-text-faint">
                      {String(d.time.getHours()).padStart(2, "0")}:{String(d.time.getMinutes()).padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => removeDose(d.id)}
                      className="text-text-faint hover:text-text-muted transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {hasDoses ? (
            <>
              {/* Decay curve */}
              <div
                className="w-full overflow-hidden"
                style={{ background: "#06060A", borderBottom: "2px solid var(--border)" }}
              >
                <DecayCurve doses={doses} accent={accent} now={now} />
              </div>

              {/* Stat cards */}
              <div className="p-4 md:p-5 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Current level */}
                  <div
                    className="p-4 col-span-2"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "3px 3px 0 var(--shadow-color)" }}
                  >
                    <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                      Current caffeine level
                    </p>
                    <p className="font-mono tabular-nums leading-none" style={{ fontSize: "2.5rem", fontWeight: 900, color: accent }}>
                      {currentMg.toFixed(1)} <span className="text-xl font-normal text-text-faint">mg</span>
                    </p>
                    <p className="text-[10px] font-sans text-text-faint mt-1">
                      {currentMg > 200 ? "High alert — significantly above typical threshold" :
                       currentMg > 100 ? "Alert — well above sleep threshold" :
                       currentMg > 50  ? "Fading — approaching sleep-ready territory" :
                       "Sleep ready — below the 50mg threshold"}
                    </p>
                  </div>

                  {/* Sleep timer */}
                  <div
                    className="p-4"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                  >
                    <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                      Sleep ready in
                    </p>
                    <p className="font-mono text-xl font-black" style={{ color: minsToSleep === 0 ? "var(--accent-utility-a)" : accent }}>
                      {minsToSleep === 0 ? "Now" : minsToSleep === null ? "> 48h" : fmtMins(minsToSleep)}
                    </p>
                    <p className="text-[10px] font-sans text-text-faint mt-0.5">until &lt; 50mg</p>
                  </div>

                  {/* Peak */}
                  <div
                    className="p-4"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                  >
                    <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                      Peak level
                    </p>
                    <p className="font-mono text-xl font-black" style={{ color: accent }}>
                      {peakMg.toFixed(0)} mg
                    </p>
                    <p className="text-[10px] font-sans text-text-faint mt-0.5">historical max today</p>
                  </div>

                  {/* Half-lives */}
                  <div
                    className="p-4"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                  >
                    <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                      Half-lives elapsed
                    </p>
                    <p className="font-mono text-xl font-black" style={{ color: accent }}>
                      {halfLivesElapsed.toFixed(2)}
                    </p>
                    <p className="text-[10px] font-sans text-text-faint mt-0.5">× {HALF_LIFE_HRS}h half-life</p>
                  </div>

                  {/* Total doses */}
                  <div
                    className="p-4"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-card)", boxShadow: "2px 2px 0 var(--shadow-color)" }}
                  >
                    <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint mb-1">
                      Total consumed today
                    </p>
                    <p className="font-mono text-xl font-black" style={{ color: accent }}>
                      {doses.reduce((s, d) => s + d.mg, 0)} mg
                    </p>
                    <p className="text-[10px] font-sans text-text-faint mt-0.5">across {doses.length} dose{doses.length !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                When can you sleep?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Log your first drink and watch your caffeine level decay in real time — across a live 24-hour curve.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
