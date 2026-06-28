"use client";

import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import {
  secondsSinceMidnight,
  formatScientific,
  formatElapsed,
} from "@/lib/realms/clockUtils";

// ── CLOCK 1: GRASS GROWTH ──
export function GrassGrowthClock() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const mmGrown = elapsed * 0.0000027778;

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Grass Growth Clock</span>
        <div className="flex gap-[3px] h-8 items-end" aria-hidden="true">
          <div className="w-1 bg-[#52C4A0] rounded-[2px_2px_0_0]" style={{ height: "20px" }} />
          <div className="w-1 bg-[#52C4A0] rounded-[2px_2px_0_0]" style={{ height: "28px" }} />
          <div className="w-1 bg-[#52C4A0] rounded-[2px_2px_0_0]" style={{ height: "18px" }} />
        </div>
      </div>
      <span className="clock-value font-mono">{mmGrown.toFixed(8)} mm</span>
      <span className="clock-subtext">Since you opened this page</span>
      <span className="clock-fact">
        Grass grows ~1cm per hour. Your lawn would not notice. It grows anyway.
      </span>
    </div>
  );
}

// ── CLOCK 2: GLOBAL SNAIL EXPEDITION ──
export function GlobalSnailExpedition() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const km = (elapsed * 13.6) / 1000;
  const circHours = (40075 / (13.6 * 3600)).toFixed(0);

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Global Snail Expedition</span>
        <span className="text-3xl select-none" role="img" aria-label="snail">
          🐌
        </span>
      </div>
      <span className="clock-value font-mono">{km.toFixed(3)} km</span>
      <span className="clock-subtext">Combined distance, 1 billion snails</span>
      <span className="clock-fact">
        At this rate, snails will collectively circumnavigate the Earth in {circHours} hours.
        Together they are unstoppable.
      </span>
    </div>
  );
}

// ── CLOCK 3: ICE MELT COUNTDOWN ──
export function IceMeltCountdown() {
  const [temp, setTemp] = useState(21);
  const [iceStartTime, setIceStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const getMeltDuration = (t: number) => {
    const duration = (90 - (t - 10) * 1.5) * 60000;
    return Math.max(600000, Math.min(7200000, duration));
  };

  const meltDurationMs = getMeltDuration(temp);

  useEffect(() => {
    if (iceStartTime === null) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - iceStartTime);
    }, 200);
    return () => clearInterval(interval);
  }, [iceStartTime]);

  const startIce = () => {
    setIceStartTime(Date.now());
    setElapsed(0);
  };

  const changeTemp = (val: number) => {
    if (iceStartTime !== null) {
      const currentFraction = Math.min(1, elapsed / meltDurationMs);
      const newDuration = getMeltDuration(val);
      const newStartTime = Date.now() - currentFraction * newDuration;
      setIceStartTime(newStartTime);
      setElapsed(currentFraction * newDuration);
    }
    setTemp(val);
  };

  const fraction = iceStartTime === null ? 0 : Math.min(1, elapsed / meltDurationMs);
  const remainingMs = Math.max(0, meltDurationMs - elapsed);

  const minVal = Math.floor(remainingMs / 60000);
  const secVal = Math.floor((remainingMs % 60000) / 1000);
  const timeStr = `${minVal.toString().padStart(2, "0")}:${secVal.toString().padStart(2, "0")}`;

  const countColor =
    fraction > 0.5
      ? "var(--accent-cosmos)"
      : fraction > 0.25
      ? "var(--accent-utility-d)"
      : "var(--accent-utility-e)";

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Ice Melt Countdown</span>
      </div>

      {iceStartTime === null || fraction >= 1 ? (
        <div className="flex flex-col gap-2 py-3 items-center justify-center h-[95px]">
          <span className="text-xs font-sans font-medium text-text-muted">
            {fraction >= 1 ? "💧 Melted" : "No Ice Placed"}
          </span>
          <button
            onClick={startIce}
            className="px-3 py-1.5 text-xs font-semibold font-ui border border-border hover:border-text-primary rounded-md hover:bg-bg-surface transition-all select-none cursor-pointer"
          >
            {fraction >= 1 ? "Add another?" : "Add Ice Cube"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-2 min-h-[95px]">
          <div className="relative w-12 h-10 flex items-center justify-center" aria-hidden="true">
            <div
              className="absolute bottom-0 bg-[#90c0ff]/35 transition-all duration-1000"
              style={{
                width: `${32 + 20 * fraction}px`,
                height: `${4 + 6 * fraction}px`,
                borderRadius: "50%",
              }}
            />
            <div
              className="border border-[#96c8ff]/85 transition-all duration-1000 z-10"
              style={{
                width: `${Math.max(4, 32 * (1 - fraction))}px`,
                height: `${Math.max(4, 32 * (1 - fraction))}px`,
                borderRadius: `${6 * fraction}px`,
                background: "linear-gradient(135deg, rgba(180,220,255,0.85), rgba(100,160,255,0.6))",
              }}
            />
          </div>
          <span className="clock-value font-mono text-2xl transition-colors duration-300" style={{ color: countColor }}>
            {timeStr}
          </span>
        </div>
      )}

      {iceStartTime !== null && fraction < 1 && (
        <div className="mt-2 flex flex-col gap-1.5">
          <div className="flex justify-between text-[11px] font-sans font-medium text-text-muted">
            <span>{temp}°C room temperature</span>
          </div>
          <Slider
            value={[temp]}
            onValueChange={(val) => changeTemp(val[0])}
            min={5}
            max={35}
            step={1}
            className="w-full h-1"
          />
        </div>
      )}

      <span className="clock-subtext">Standard 30ml ice cube</span>
    </div>
  );
}

// ── CLOCK 4: TEA STEEPING MASTER ──
export function TeaSteepingMaster() {
  const [teaType, setTeaType] = useState<"green" | "black" | "herbal">("black");
  const [steepStartTime, setSteepStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (steepStartTime === null) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - steepStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [steepStartTime]);

  const startSteeping = (type: "green" | "black" | "herbal") => {
    setTeaType(type);
    setSteepStartTime(Date.now());
    setElapsed(0);
  };

  const stopSteeping = () => {
    setSteepStartTime(null);
    setElapsed(0);
  };

  const getStageInfo = (type: "green" | "black" | "herbal", time: number) => {
    if (type === "green") {
      if (time <= 45) return { name: "Just Water", color: "#E3F0F7" };
      if (time <= 90) return { name: "Getting There", color: "#F5E8C0" };
      if (time <= 150) return { name: "Perfect ☕", color: "#C9843A", perfect: true };
      if (time <= 210) return { name: "Strong", color: "#7B4A10" };
      return { name: "Battery Acid", color: "#2A1005" };
    } else if (type === "black") {
      if (time <= 60) return { name: "Just Water", color: "#E3F0F7" };
      if (time <= 120) return { name: "Getting There", color: "#F5E8C0" };
      if (time <= 180) return { name: "Perfect ☕", color: "#C9843A", perfect: true };
      if (time <= 240) return { name: "Strong", color: "#7B4A10" };
      return { name: "Battery Acid", color: "#2A1005" };
    } else {
      if (time <= 120) return { name: "Just Water", color: "#E3F0F7" };
      if (time <= 180) return { name: "Getting There", color: "#F5E8C0" };
      if (time <= 300) return { name: "Perfect ☕", color: "#C9843A", perfect: true };
      if (time <= 360) return { name: "Strong", color: "#7B4A10" };
      return { name: "Battery Acid", color: "#2A1005" };
    }
  };

  const stage = getStageInfo(teaType, elapsed);
  const isPerfect = steepStartTime !== null && stage.perfect;
  const formatMMSString = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="absurd-clock-card transition-all duration-300"
      style={{ boxShadow: isPerfect ? "0 0 0 2px var(--accent-bio)" : "none" }}
    >
      <span className="clock-label">Tea Steeping Master</span>

      {steepStartTime === null ? (
        <div className="flex flex-col gap-3 py-3 items-center justify-center">
          <div className="flex gap-2">
            {(["green", "black", "herbal"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTeaType(t)}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wide rounded-full border transition-all ${
                  teaType === t
                    ? "bg-text-primary text-bg-base border-text-primary"
                    : "bg-transparent text-text-muted border-border hover:text-text-primary hover:border-text-muted"
                } select-none cursor-pointer`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => startSteeping(teaType)}
            className="w-full py-1.5 text-xs font-semibold font-ui border-2 border-text-primary rounded-md hover:bg-bg-surface transition-all select-none cursor-pointer"
          >
            Start Steeping
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-2 min-h-[110px]">
          <div className="relative w-[40px] h-[50px] border-2 border-text-primary border-t-0 rounded-b-lg overflow-hidden flex-shrink-0">
            <div className="absolute -top-3 left-0 right-0 flex justify-around opacity-60">
              <svg width="30" height="10" viewBox="0 0 36 12" className="absolute top-0">
                <path
                  d="M 4 10 Q 7 5 10 10 T 16 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="animate-[steam_2s_infinite]"
                />
                <path
                  d="M 12 10 Q 15 5 18 10 T 24 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="animate-[steam_2s_infinite_0.6s]"
                />
              </svg>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-[85%] transition-all duration-[3000ms]"
              style={{ backgroundColor: stage.color }}
            />
            <div className="absolute -right-3 top-1/4 w-2.5 h-4 border-2 border-text-primary border-l-0 rounded-r-md" />
          </div>

          <div className="text-center">
            <span className="text-lg font-sans font-semibold italic text-text-primary block leading-tight">
              {stage.name}
            </span>
            <span className="clock-value font-mono text-xl block mt-1">{formatMMSString(elapsed)}</span>
          </div>

          <button
            onClick={stopSteeping}
            className="w-full py-1 text-xs font-semibold font-ui border border-accent-utility-e hover:bg-accent-utility-e/10 text-accent-utility-e rounded-md transition-all select-none cursor-pointer"
          >
            Stop
          </button>
        </div>
      )}
      <span className="clock-subtext">Timing the perfect brew</span>
    </div>
  );
}

// ── CLOCK 5: DRAMATIC RAMEN TIMER ──
export function DramaticRamenTimer() {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= 180) {
          clearInterval(interval);
          return 180;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started]);

  const startRitual = () => {
    setStarted(true);
    setElapsed(0);
  };

  const resetRitual = () => {
    setStarted(false);
    setElapsed(0);
  };

  const getDramaticMessage = (time: number) => {
    if (time >= 160 && time < 180) {
      const count = 180 - time;
      const words = [
        "ZERO",
        "ONE",
        "TWO",
        "THREE",
        "FOUR",
        "FIVE",
        "SIX",
        "SEVEN",
        "EIGHT",
        "NINE",
        "TEN",
      ];
      return words[count] || `${count}`;
    }
    if (time >= 150) return "THIRTY SECONDS.\nEVERYTHING LEADS TO THIS.";
    if (time >= 120) return "One minute.\nDo not look away.";
    if (time >= 90) return "Almost. The aroma is your reward.";
    if (time >= 60) return "Halfway. The noodles are becoming\nwhat they were always meant to be.";
    if (time >= 30) return "Patience is the ingredient\nthey never list.";
    return "The water awaits.";
  };

  const getCardStyle = () => {
    if (!started || elapsed >= 180) return {};
    let bg = "transparent";
    if (elapsed >= 150) bg = "rgba(224,58,58,0.18)";
    else if (elapsed >= 120) bg = "rgba(224,100,58,0.12)";
    else if (elapsed >= 60) bg = "rgba(224,154,58,0.06)";
    return {
      backgroundColor: bg,
      transition: "background-color 10s linear",
      boxShadow: elapsed >= 180 ? "0 0 0 2px var(--accent-bio)" : "none",
    };
  };

  const remaining = 180 - elapsed;
  const formatMMS = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const isLowTime = started && remaining < 30 && remaining > 0;

  return (
    <div
      className="absurd-clock-card relative overflow-hidden transition-all duration-300"
      style={getCardStyle()}
    >
      <span className="clock-label">Dramatic Ramen Timer</span>

      {!started ? (
        <button
          onClick={startRitual}
          className="w-full py-2 bg-accent-utility-e hover:bg-accent-utility-e-dark text-white font-bold font-ui text-sm rounded-md transition-all select-none cursor-pointer"
        >
          START THE RITUAL
        </button>
      ) : elapsed >= 180 ? (
        <div className="flex flex-col items-center justify-center py-2 relative">
          <span className="text-3xl font-sans font-bold italic text-accent-bio animate-bounce">
            🍜 RAMEN IS READY
          </span>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {[...Array(8)].map((_, i) => {
              const tx = `${(i % 2 === 0 ? 1 : -1) * (30 + Math.random() * 50)}px`;
              const ty = `${(i < 4 ? 1 : -1) * (30 + Math.random() * 50)}px`;
              return (
                <div
                  key={i}
                  className="w-1.5 h-1.5 absolute rounded-sm animate-[confettiPop_600ms_ease-out_forwards]"
                  style={
                    {
                      "--tx": tx,
                      "--ty": ty,
                      animationDelay: `${i * 30}ms`,
                      backgroundColor: ["#52C4A0", "#C9A84C", "#9B8EF5", "#E09A3A"][i % 4],
                    } as React.CSSProperties
                  }
                />
              );
            })}
          </div>
          <button
            onClick={resetRitual}
            className="mt-4 px-3 py-1.5 text-xs font-semibold font-ui border border-border rounded-md hover:bg-bg-surface transition-all select-none cursor-pointer"
          >
            START AGAIN
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 gap-3">
          <span
            className={`font-mono text-5xl font-bold select-none ${
              isLowTime ? "animate-[ramenPulse_1s_infinite] text-accent-utility-e" : "text-text-primary"
            }`}
          >
            {formatMMS(remaining)}
          </span>
          <p className="text-center text-xs font-sans font-light italic text-text-muted leading-relaxed whitespace-pre-line min-h-[36px]">
            {getDramaticMessage(elapsed)}
          </p>
          <div className="w-full h-1 bg-border rounded-full overflow-hidden absolute bottom-0 left-0 right-0">
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${(1 - elapsed / 180) * 100}%`,
                backgroundColor:
                  elapsed >= 150
                    ? "var(--accent-utility-e)"
                    : elapsed >= 120
                    ? "var(--accent-utility-d)"
                    : "var(--accent-utility-a)",
              }}
            />
          </div>
        </div>
      )}
      <span className="clock-subtext">3 minutes of theatrical tension</span>
    </div>
  );
}

// ── CLOCK 6: BANANA TIMELINE ──
export function BananaTimeline() {
  const [days, setDays] = useState(0);

  const getBananaColor = (d: number) => {
    if (d <= 1) return "#7DC242"; // green
    if (d <= 3) return "#F5E642"; // yellow
    if (d <= 5) return "#F5B942"; // spotty yellow
    if (d <= 7) return "#D4821A"; // brown-yellow
    if (d <= 9) return "#8B4513"; // mostly brown
    return "#3D1C00"; // black
  };

  const getStageLabel = (d: number) => {
    if (d <= 1) return "Too Green";
    if (d <= 3) return "Perfect";
    if (d <= 5) return "Getting Spotty";
    if (d <= 7) return "Very Ripe";
    if (d <= 9) return "Smoothie Territory";
    if (d <= 12) return "Art Installation";
    return "Archaeological Find";
  };

  const getStageMessage = (d: number) => {
    if (d <= 1) return "Wait 2 more days. Patience.";
    if (d <= 3) return "Peak banana. Act now. This window closes.";
    if (d <= 5) return "Still fine. Banana bread potential rising.";
    if (d <= 7) return "Banana bread is not optional anymore.";
    if (d <= 9) return "Put it in a smoothie and don't look at it.";
    return "This belongs in a museum or a bin.";
  };

  return (
    <div className="absurd-clock-card">
      <span className="clock-label">Banana Timeline</span>

      <div className="flex flex-col items-center justify-center gap-3 py-2 min-h-[90px] relative">
        <div className="relative w-[80px] h-[28px] flex items-center justify-center overflow-visible">
          <div
            className="w-[80px] h-[28px] rounded-[50%_50%_0_0_/_100%_100%_0_0] rotate-[-20deg] scale-x-[1.3] transition-all duration-[800ms]"
            style={{ backgroundColor: getBananaColor(days) }}
          />
          {days >= 4 && (
            <div className="absolute inset-0 rotate-[-20deg] scale-x-[1.3] pointer-events-none opacity-80">
              <div className="w-1.5 h-1.5 bg-[#8B6914] rounded-full absolute left-1/4 top-1/4" />
              <div className="w-1 h-1 bg-[#8B6914] rounded-full absolute left-1/2 top-1.5" />
              <div className="w-2 h-1.5 bg-[#8B6914] rounded-full absolute left-2/3 top-1/3" />
            </div>
          )}
        </div>

        <div className="text-center">
          <span className="text-lg font-sans font-semibold italic text-text-primary block leading-tight">
            {getBananaColor(days) === "#3D1C00" ? "Archaeological" : getStageLabel(days)}
          </span>
          <span className="text-[11px] font-sans font-light italic text-text-muted mt-1 block max-w-[200px]">
            {getStageMessage(days)}
          </span>
        </div>
      </div>

      <div className="mt-2 flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs font-mono text-text-muted">
          <span>Day {days} of banana life</span>
          <button
            onClick={() => setDays((prev) => Math.min(14, prev + 1))}
            className="px-2 py-0.5 border border-border rounded-md hover:bg-bg-surface select-none cursor-pointer"
          >
            +1 Day
          </button>
        </div>
        <Slider
          value={[days]}
          onValueChange={(val) => setDays(val[0])}
          min={0}
          max={14}
          step={1}
          className="w-full h-1"
        />
      </div>
    </div>
  );
}

// ── CLOCK 7: HUMAN BLINK COUNTER ──
export function HumanBlinkCounter() {
  const [blinkCount, setBlinkCount] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  const BLINK_FACTS = [
    "You blink ~17 times per minute.",
    "Each blink lasts 150-400 milliseconds.",
    "You spend ~10% of waking life with eyes closed.",
    "Blinking spreads tears across your cornea.",
    "You blink less when concentrating.",
    "You just thought about blinking. You're welcome.",
    "Babies blink only 2 times per minute.",
    "Reading this made you blink less.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkCount((prev) => prev + 0.2833 * 0.5);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % BLINK_FACTS.length);
    }, 25000);
    return () => clearInterval(factInterval);
  }, []);

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Your Blink Counter</span>
        <div className="flex flex-col gap-0.5" aria-hidden="true">
          <div className="w-6 h-2 bg-text-primary rounded-full animate-[eyeBlink_4s_infinite]" />
          <div className="w-6 h-2 bg-text-primary rounded-full animate-[eyeBlink_4s_infinite]" />
        </div>
      </div>
      <span className="clock-value font-mono">{Math.floor(blinkCount).toLocaleString()}</span>
      <span className="clock-subtext">estimated blinks since you arrived</span>
      <span className="clock-fact min-h-[34px]">{BLINK_FACTS[factIndex]}</span>
    </div>
  );
}

// ── CLOCK 8: AWKWARD SILENCE GAUGE ──
export function AwkwardSilenceGauge() {
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 100);
    return () => clearInterval(interval);
  }, [started]);

  const startSilence = () => {
    setStarted(true);
    setElapsed(0);
    setResult(null);
  };

  const getDiscomfortLabel = (seconds: number) => {
    if (seconds <= 3) return { text: "Normal pause", color: "var(--accent-utility-a)", pulse: false };
    if (seconds <= 7) return { text: "Getting Weird", color: "var(--accent-bio)", pulse: false };
    if (seconds <= 12) return { text: "Someone Say Something", color: "var(--accent-utility-d)", pulse: false };
    if (seconds <= 20) return { text: "Pure Suffering", color: "var(--accent-utility-e)", pulse: false };
    if (seconds <= 30) return { text: "Social Contract Broken", color: "var(--accent-utility-e)", pulse: true };
    return { text: "LEGENDARY SILENCE", color: "var(--accent-scifi)", pulse: true };
  };

  const seconds = elapsed / 1000;
  const comfort = getDiscomfortLabel(seconds);

  const stopSilence = () => {
    setStarted(false);
    setResult(`You survived ${seconds.toFixed(1)}s of ${comfort.text}.`);
    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  const cardTint = () => {
    if (!started) return {};
    if (seconds > 20) return { backgroundColor: "rgba(224, 58, 58, 0.12)", transition: "background-color 2s" };
    if (seconds > 12) return { backgroundColor: "rgba(224, 58, 58, 0.06)", transition: "background-color 2s" };
    return {};
  };

  const fillPct = Math.min(100, (elapsed / 30000) * 100);

  return (
    <div className="absurd-clock-card transition-all duration-300" style={cardTint()}>
      <span className="clock-label">Awkward Silence Gauge</span>

      {!started ? (
        <div className="flex flex-col gap-2 py-4 justify-center items-center h-[120px]">
          {result ? (
            <span className="text-xs font-sans font-medium text-center text-text-primary px-2 leading-relaxed min-h-[36px]">
              {result}
            </span>
          ) : (
            <span className="text-xs font-sans font-light text-text-muted">
              A test of social endurance
            </span>
          )}
          <button
            onClick={startSilence}
            className="w-full py-1.5 text-xs font-semibold font-ui border-2 border-text-primary rounded-md hover:bg-bg-surface transition-all select-none cursor-pointer"
          >
            BEGIN AWKWARD SILENCE
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 h-[120px] gap-2">
          <span className="font-mono text-5xl font-bold text-text-primary">{seconds.toFixed(1)}</span>
          <span
            className={`text-xs font-sans font-semibold tracking-wide uppercase ${
              comfort.pulse ? "animate-pulse" : ""
            }`}
            style={{ color: comfort.color }}
          >
            {comfort.text}
          </span>

          <div className="w-full mt-1.5">
            <div className="flex justify-between text-[9px] font-sans font-medium text-text-faint uppercase mb-1">
              <span>Cringe Level</span>
              <span>{Math.round(fillPct)}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: `${fillPct}%`,
                  background: "linear-gradient(90deg, #52C4A0 0%, #C9A84C 50%, #E87C7C 100%)",
                }}
              />
            </div>
          </div>

          <button
            onClick={stopSilence}
            className="mt-3 px-3 py-1.5 text-xs font-semibold font-ui border border-accent-utility-e hover:bg-accent-utility-e/10 text-accent-utility-e rounded-md transition-all select-none cursor-pointer"
          >
            END SILENCE
          </button>
        </div>
      )}
      <span className="clock-subtext">Measuring conversational friction</span>
    </div>
  );
}

// ── CLOCK 9: PENCIL LEAD LIFETIME ──
export function PencilLeadLifetime() {
  const [keystrokes, setKeystrokes] = useState(0);

  useEffect(() => {
    const listener = () => {
      setKeystrokes((prev) => prev + 1);
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, []);

  const leadRemaining = Math.max(0, 56000 - keystrokes * 2);
  const leadPct = leadRemaining / 56000;

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Pencil Lead Lifetime</span>
        <div className="flex flex-col items-center justify-center w-6" aria-hidden="true">
          <div className="w-3 h-2.5 bg-pink-400 rounded-t-[2px]" />
          <div
            className="w-3 bg-yellow-500/80 transition-all duration-300"
            style={{ height: `${Math.max(2, 50 * leadPct)}px` }}
          />
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[12px] border-t-yellow-600/80" />
        </div>
      </div>

      <span className="clock-value font-mono">{(leadRemaining / 1000).toFixed(3)} km</span>
      <span className="clock-subtext">lead remaining</span>

      <div className="w-full bg-border h-1 rounded-full overflow-hidden mt-1.5">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${leadPct * 100}%`,
            backgroundColor: leadPct < 0.2 ? "var(--accent-utility-e)" : "var(--accent-bio)",
          }}
        />
      </div>

      <div className="flex justify-between items-center clock-fact mt-2 pt-2">
        <span>A pencil draws a 56km line. You've typed {keystrokes} keys on this page.</span>
        <button
          onClick={() => setKeystrokes(0)}
          className="text-[11px] font-sans text-accent-bio hover:underline select-none cursor-pointer"
        >
          Sharpen
        </button>
      </div>
    </div>
  );
}

// ── CLOCK 10: COFFEE COOLING TRACKER ──
export function CoffeeCoolingTracker() {
  const [poured, setPoured] = useState(false);
  const [coffeeStartTime, setCoffeeStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!poured || coffeeStartTime === null) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - coffeeStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [poured, coffeeStartTime]);

  const pour = () => {
    setPoured(true);
    setCoffeeStartTime(Date.now());
    setElapsed(0);
  };

  const reset = () => {
    setPoured(false);
    setCoffeeStartTime(null);
    setElapsed(0);
  };

  const currentTemp = poured ? 21 + 69 * Math.exp(-0.00083 * elapsed) : 21;

  const getTempColor = (t: number) => {
    if (t > 70) return { word: "TOO HOT", color: "var(--accent-utility-e)" };
    if (t >= 55) return { word: "PERFECT ☕", color: "var(--accent-bio)", glow: true };
    if (t >= 40) return { word: "GETTING COOL", color: "var(--accent-utility-d)" };
    return { word: "COLD COFFEE", color: "var(--accent-cosmos)" };
  };

  const info = getTempColor(currentTemp);

  const formatSecs = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div
      className="absurd-clock-card transition-all duration-300"
      style={{ boxShadow: info.glow ? "0 0 0 2px var(--accent-bio)" : "none" }}
    >
      <span className="clock-label">Coffee Cooling Tracker</span>

      {!poured ? (
        <div className="flex flex-col gap-2 py-4 justify-center items-center h-[90px]">
          <span className="text-3xl select-none" role="img" aria-label="coffee">
            ☕
          </span>
          <button
            onClick={pour}
            className="w-full py-1.5 text-xs font-semibold font-ui border-2 border-text-primary rounded-md hover:bg-bg-surface transition-all select-none cursor-pointer"
          >
            POUR COFFEE
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-2 min-h-[90px]">
          <div
            className="w-20 h-2 border border-border rounded-full overflow-hidden flex bg-border-subtle"
            aria-hidden="true"
          >
            <div
              className="h-full transition-all duration-1000"
              style={{
                width: `${Math.max(0, Math.min(100, ((currentTemp - 20) / 70) * 100))}%`,
                backgroundColor: info.color,
              }}
            />
          </div>

          <div className="text-center">
            <span className="clock-value font-mono text-2xl leading-none">{currentTemp.toFixed(1)}°C</span>
            <span
              className="text-xs font-sans font-bold tracking-wide uppercase block mt-1"
              style={{ color: info.color }}
            >
              {info.word}
            </span>
            <span className="text-[10px] font-sans text-text-faint block mt-0.5">
              Elapsed: {formatSecs(elapsed)} since pour
            </span>
          </div>

          <button
            onClick={reset}
            className="w-full py-1 text-xs font-semibold font-ui border border-border hover:bg-bg-surface text-text-muted rounded-md transition-all select-none cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}
      <span className="clock-subtext">Newtonian cooling rate (k=0.00083/s)</span>
    </div>
  );
}

// ── CLOCK 11: STEPS TAKEN TODAY ──
export function StepsTakenToday() {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    const update = () => {
      setSteps(secondsSinceMidnight() * (8000 / 86400));
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const fillPct = Math.min(100, (steps / 10000) * 100);
  const fillCol =
    fillPct < 33
      ? "var(--accent-utility-e)"
      : fillPct < 66
      ? "var(--accent-utility-d)"
      : "var(--accent-utility-a)";

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Estimated Steps Today</span>
        <span className="text-3xl select-none" role="img" aria-label="shoe">
          👟
        </span>
      </div>
      <span className="clock-value font-mono">{Math.floor(steps).toLocaleString()}</span>
      <span className="clock-subtext">Based on 8,000 step daily average</span>

      <div className="w-full mt-1">
        <div className="flex justify-between text-[9px] font-sans font-medium text-text-faint uppercase mb-1">
          <span>{Math.floor(steps).toLocaleString()} / 10,000 steps</span>
          <span>{Math.round(fillPct)}%</span>
        </div>
        <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-1000"
            style={{ width: `${fillPct}%`, backgroundColor: fillCol }}
          />
        </div>
      </div>
      <span className="clock-fact">
        {(steps * 0.000762).toFixed(2)} km estimated distance. Or you sat all day. No judgment.
      </span>
    </div>
  );
}

// ── CLOCK 12: HEARTBEATS SINCE MIDNIGHT ──
export function HeartbeatsSinceMidnight() {
  const [beats, setBeats] = useState(0);

  useEffect(() => {
    const update = () => {
      setBeats(secondsSinceMidnight() * 1.2);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Heartbeats Since Midnight</span>
        <span
          className="text-3xl select-none text-accent-utility-e leading-none animate-[heartbeat_0.833s_infinite_ease-in-out]"
          role="img"
          aria-label="heart"
        >
          ♥
        </span>
      </div>
      <span className="clock-value font-mono">{Math.floor(beats).toLocaleString()}</span>
      <span className="clock-subtext">At 72 bpm average</span>
      <span className="clock-fact">
        Your heart has beaten ~{(72 * 60 * 24 * 365).toLocaleString()} times this year.
      </span>
    </div>
  );
}

// ── CLOCK 13: WORDS HUMANITY SPOKE TODAY ──
export function WordsHumanitySpokeToday() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const update = () => {
      setTotal(secondsSinceMidnight() * 5135000000);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absurd-clock-card">
      <span className="clock-label">Words Humanity Spoke Today</span>
      <span className="clock-value font-mono text-[22px] leading-tight select-none">
        {formatScientific(total)}
      </span>
      <span className="clock-subtext">{total.toLocaleString()} words</span>
      <span className="clock-fact">
        If printed, today's words would fill approx.{" "}
        {Math.floor(total / 250 / 300).toLocaleString()} books of 300 pages.
      </span>
    </div>
  );
}

// ── CLOCK 14: INTERNET DATA CREATED TODAY ──
export function InternetDataCreatedToday() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const update = () => {
      setTotal(secondsSinceMidnight() * 3796);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatData = (tb: number) => {
    if (tb >= 1000000) return (tb / 1000000).toFixed(2) + " EB";
    if (tb >= 1000) return (tb / 1000).toFixed(1) + " PB";
    return Math.floor(tb).toLocaleString() + " TB";
  };

  return (
    <div className="absurd-clock-card">
      <span className="clock-label">Internet Data Created Today</span>
      <span className="clock-value font-mono">{formatData(total)}</span>
      <span className="clock-subtext">Global data generation</span>
      <span className="clock-fact">
        This includes every email, every video stream, every cloud backup, and this page loading
        0.0000001 times.
      </span>
    </div>
  );
}

// ── CLOCK 15: PLASTIC BOTTLES PRODUCED TODAY ──
export function PlasticBottlesProducedToday() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const update = () => {
      setTotal(secondsSinceMidnight() * 15211);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absurd-clock-card">
      <div className="flex justify-between items-start">
        <span className="clock-label">Plastic Bottles Made Today</span>
        <div className="flex flex-col items-center" aria-hidden="true">
          <div className="w-2 h-3 bg-[#4b8ef1]/50 border border-accent-cosmos rounded-t-[2px]" />
          <div className="w-4.5 h-7 bg-[#4b8ef1]/30 border border-accent-cosmos rounded-[2px]" />
        </div>
      </div>
      <span className="clock-value font-mono">{Math.floor(total).toLocaleString()}</span>
      <span className="clock-subtext">
        Stacked end to end: {((total * 0.23) / 384400000).toFixed(4)}× to the Moon
      </span>
      <span className="clock-fact">480 billion plastic bottles are produced per year. Most are used once.</span>
    </div>
  );
}

// ── CLOCK 16: YOUR NAIL GROWTH TODAY ──
export function YourNailGrowthToday() {
  const [fnGrowth, setFnGrowth] = useState(0);
  const [tnGrowth, setTnGrowth] = useState(0);

  useEffect(() => {
    const update = () => {
      const smdn = secondsSinceMidnight();
      setFnGrowth(smdn * (3.5 / 30 / 86400) * 10);
      setTnGrowth(smdn * (1.5 / 30 / 86400) * 10);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  const totalGrowth = fnGrowth + tnGrowth;

  return (
    <div className="absurd-clock-card">
      <span className="clock-label">Your Nail Growth Today</span>
      
      <div className="flex flex-col gap-1 my-1">
        <div className="flex justify-between text-[11px] font-mono text-text-muted">
          <span>Fingernails</span>
          <span>{(fnGrowth * 1000).toFixed(2)} μm</span>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-text-muted">
          <span>Toenails</span>
          <span>{(tnGrowth * 1000).toFixed(2)} μm</span>
        </div>
      </div>

      <span className="clock-value font-mono text-[22px] leading-tight select-none">
        {(totalGrowth * 1000).toFixed(2)} μm combined
      </span>
      <span className="clock-fact">
        Your nails are growing right now. You cannot feel it. This is somehow unsettling.
      </span>
    </div>
  );
}

// ── CLOCK 17: EMAILS SENT TODAY ──
export function EmailsSentToday() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const update = () => {
      setTotal(secondsSinceMidnight() * 3819444);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absurd-clock-card">
      <span className="clock-label">Emails Sent Today (Global)</span>
      <span className="clock-value font-mono text-[22px] leading-tight select-none">
        {formatScientific(total, 3)}
      </span>
      <span className="clock-subtext">{total.toLocaleString()} emails</span>
      <span className="clock-fact">
        ~85% are spam. That's {formatScientific(total * 0.85, 2)} unsolicited emails today.
        Somewhere someone is clicking unsubscribe.
      </span>
    </div>
  );
}

// ── CLOCK 18: SUN'S ENERGY OUTPUT TODAY ──
export function SunsEnergyOutputToday() {
  const [joules, setJoules] = useState(0);

  useEffect(() => {
    const update = () => {
      setJoules(secondsSinceMidnight() * 3.8e26);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absurd-clock-card">
      <span className="clock-label">Sun's Energy Output Today</span>
      <span className="clock-value font-mono text-[22px] leading-tight select-none">
        {formatScientific(joules, 2)} J
      </span>
      <span className="clock-subtext">Joules emitted since midnight</span>
      <span className="clock-fact">
        One second of the Sun's output could power all of human civilization for ~500,000 years.
        It has been going for 4.6 billion years.
      </span>
    </div>
  );
}
