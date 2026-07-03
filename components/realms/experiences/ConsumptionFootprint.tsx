"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Types ────────────────────────────────────────────────────────────────────

type Diet       = "omnivore" | "vegetarian" | "vegan";
type Recycling  = "none" | "some" | "diligent";

// ─── Per-year baseline (global averages) ─────────────────────────────────────

const PER_YEAR = {
  plasticBottles: 156,
  garbageBags:    500,
  breadLoaves:    20,
  eggs:           285,
  coffeeKg:       4.5,    // ~1,500 cups
  waterGallons:   36_500, // ~100 gal/day
  laundryLoads:   390,
  showerMins:     3_285,  // 9 min × 365
  meatKg:         { omnivore: 82, vegetarian: 5, vegan: 0 },
};

// Recycling multiplier for plastic bottles
const RECYCLE_MULT: Record<Recycling, number> = {
  none:     1.0,
  some:     0.6,
  diligent: 0.25,
};

// Meat label
const MEAT_LABEL: Record<Diet, string> = {
  omnivore:   "Meat consumed",
  vegetarian: "Meat equivalent",
  vegan:      "Meat avoided",
};

// ─── Calculation ──────────────────────────────────────────────────────────────

function calcLifetime(age: number, diet: Diet, recycling: Recycling) {
  const lifeExpectancy = 80;
  const yearsLeft      = Math.max(0, lifeExpectancy - age);
  const totalYears     = lifeExpectancy;

  const bottles   = Math.round(PER_YEAR.plasticBottles * RECYCLE_MULT[recycling] * totalYears);
  const bags      = Math.round(PER_YEAR.garbageBags * totalYears);
  const bread     = Math.round(PER_YEAR.breadLoaves * totalYears);
  const eggs      = Math.round(PER_YEAR.eggs * totalYears);
  const waterGal  = Math.round(PER_YEAR.waterGallons * totalYears);
  const laundry   = Math.round(PER_YEAR.laundryLoads * totalYears);
  const showerMins= Math.round(PER_YEAR.showerMins * totalYears);
  const meatKg    = Math.round(PER_YEAR.meatKg[diet] * totalYears);
  const coffeeKg  = Math.round(PER_YEAR.coffeeKg * totalYears);

  const usedFrac  = Math.min(1, age / lifeExpectancy);

  // Physical equivalents
  const truckLoads     = Math.round(bags / 900);                   // ~900 bags per garbage truck
  const swimmingPools  = (waterGal / 660_253).toFixed(2);          // 1 pool = 660,253 gal
  const bottleWeightKg = bottles * 0.025;                          // 25g each
  const coffeeAcres    = (coffeeKg / 2_000).toFixed(3);            // ~2,000 kg per acre/yr
  const showerHrs      = Math.round(showerMins / 60);
  const meatCows       = diet === "vegan" ? 0 : Math.round(meatKg / 250); // ~250 kg meat per cow

  return {
    bottles, bags, bread, eggs, waterGal, laundry, showerMins,
    meatKg, coffeeKg, truckLoads, swimmingPools, bottleWeightKg,
    coffeeAcres, showerHrs, meatCows, usedFrac, yearsLeft,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FootprintCard({
  emoji,
  label,
  lifetime,
  unit,
  equivalent,
  usedFrac,
  accent,
}: {
  emoji: string;
  label: string;
  lifetime: string;
  unit: string;
  equivalent: string;
  usedFrac: number;
  accent: string;
}) {
  return (
    <div
      className="p-4 rounded flex flex-col gap-3"
      style={{
        border: "2px solid var(--border)",
        boxShadow: "3px 3px 0 var(--shadow-color)",
        background: "var(--bg-card)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
            {emoji} {label}
          </div>
          <div className="font-mono text-xl font-bold mt-0.5" style={{ color: accent }}>
            {lifetime}
            <span className="text-xs font-sans text-text-muted ml-1">{unit}</span>
          </div>
        </div>
      </div>
      {/* Progress: used so far */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[9px] font-sans text-text-faint">
          <span>Used so far</span>
          <span>{(usedFrac * 100).toFixed(0)}%</span>
        </div>
        <div className="relative h-2 rounded overflow-hidden" style={{ background: "var(--bg-base)" }}>
          <div
            className="h-full rounded transition-all"
            style={{ width: `${usedFrac * 100}%`, background: accent }}
          />
        </div>
      </div>
      <div className="text-[10px] font-sans text-text-muted leading-relaxed">
        {equivalent}
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConsumptionFootprint() {
  const slug   = usePathname().split("/").pop();
  const realm  = realmsRegistry.find(r => r.slug === slug) ?? realmsRegistry[0];
  const accent = realm.accent;

  const [age,       setAge]       = useState(30);
  const [diet,      setDiet]      = useState<Diet>("omnivore");
  const [recycling, setRecycling] = useState<Recycling>("some");

  const data = useMemo(
    () => calcLifetime(age, diet, recycling),
    [age, diet, recycling]
  );

  // ─── Controls ──────────────────────────────────────────────────────────────

  const controls = (
    <div className="flex flex-col gap-6">
      {/* Age */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between">
          <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
            Your Current Age
          </label>
          <span className="font-mono text-xs font-bold" style={{ color: accent }}>
            {age} yrs
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={79}
          step={1}
          value={age}
          onChange={e => setAge(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: accent }}
        />
        <div className="flex justify-between text-[9px] font-sans text-text-faint">
          <span>5</span>
          <span>79</span>
        </div>
      </div>

      {/* Diet */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Diet
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["omnivore", "vegetarian", "vegan"] as Diet[]).map(d => (
            <button
              key={d}
              onClick={() => setDiet(d)}
              className="py-2 text-xs font-mono rounded transition-all duration-150"
              style={{
                border: "2px solid var(--border)",
                boxShadow: diet === d ? `2px 2px 0 ${accent}` : "2px 2px 0 var(--shadow-color)",
                background: diet === d ? accent : "var(--bg-card)",
                color: diet === d ? "var(--bg-base)" : "var(--text-primary)",
                transform: diet === d ? "translate(-1px,-1px)" : undefined,
              }}
            >
              {d === "omnivore" ? "🍖 Omni" : d === "vegetarian" ? "🥦 Veg" : "🌱 Vegan"}
            </button>
          ))}
        </div>
      </div>

      {/* Recycling */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Recycling Habit
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["none", "some", "diligent"] as Recycling[]).map(r => (
            <button
              key={r}
              onClick={() => setRecycling(r)}
              className="py-2 text-xs font-mono rounded transition-all duration-150"
              style={{
                border: "2px solid var(--border)",
                boxShadow: recycling === r ? `2px 2px 0 ${accent}` : "2px 2px 0 var(--shadow-color)",
                background: recycling === r ? accent : "var(--bg-card)",
                color: recycling === r ? "var(--bg-base)" : "var(--text-primary)",
                transform: recycling === r ? "translate(-1px,-1px)" : undefined,
              }}
            >
              {r === "none" ? "♻ None" : r === "some" ? "♻ Some" : "♻ Always"}
            </button>
          ))}
        </div>
      </div>

      {/* Quick summary */}
      <div
        className="p-4 rounded flex flex-col gap-2"
        style={{ border: "2px solid var(--border)", boxShadow: "3px 3px 0 var(--shadow-color)", background: "var(--bg-card)" }}
      >
        <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
          Your Profile
        </div>
        <div className="text-xs font-sans text-text-primary leading-relaxed">
          Based on a <strong>{age}-year-old</strong> {diet} who recycles <strong>{recycling === "none" ? "nothing" : recycling === "some" ? "occasionally" : "diligently"}</strong>. Lifetime = 80 years. Numbers are global averages — actual varies by country, income, and habit.
        </div>
        <div className="text-[10px] text-text-muted font-sans mt-1">
          {data.yearsLeft} years remaining → {(data.usedFrac * 100).toFixed(0)}% of lifetime consumed
        </div>
      </div>
    </div>
  );

  // ─── Canvas section ────────────────────────────────────────────────────────

  const canvas_ = (
    <div className="flex flex-col gap-4">
      <div className="text-xs font-sans text-text-muted">
        This is your lifetime consumption portrait — no guilt, just scale.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FootprintCard
          emoji="🧴"
          label="Plastic bottles"
          lifetime={data.bottles.toLocaleString()}
          unit="bottles"
          equivalent={`That's ${data.bottleWeightKg.toLocaleString()} kg of plastic — about ${Math.round(data.bottleWeightKg / 3_700)} Boeing 737s by weight.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji="🗑️"
          label="Garbage bags"
          lifetime={data.bags.toLocaleString()}
          unit="bags"
          equivalent={`That fills roughly ${data.truckLoads} garbage trucks — parked bumper to bumper.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji="💧"
          label="Water consumed"
          lifetime={data.waterGal.toLocaleString()}
          unit="gallons"
          equivalent={`${data.swimmingPools} Olympic swimming pools — more than any village uses in a year.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji="🍞"
          label="Bread loaves"
          lifetime={data.bread.toLocaleString()}
          unit="loaves"
          equivalent={`Stacked end-to-end: ${Math.round(data.bread * 0.3)} metres tall. That's ${(Math.round(data.bread * 0.3) / 828).toFixed(1)}× the Burj Khalifa.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji="🥚"
          label="Eggs"
          lifetime={data.eggs.toLocaleString()}
          unit="eggs"
          equivalent={`${Math.round(data.eggs / 12).toLocaleString()} egg boxes — about one new carton every 2.5 weeks, lifetime.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji="👕"
          label="Laundry loads"
          lifetime={data.laundry.toLocaleString()}
          unit="loads"
          equivalent={`At 30 min each: ${Math.round(data.laundry * 0.5).toLocaleString()} hours of your life, just washing clothes.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji="🚿"
          label="Shower time"
          lifetime={data.showerHrs.toLocaleString()}
          unit="hours"
          equivalent={`${Math.round(data.showerHrs / 24)} full days standing in the shower across your lifetime.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
        <FootprintCard
          emoji={diet === "vegan" ? "🌱" : "🥩"}
          label={MEAT_LABEL[diet]}
          lifetime={data.meatKg.toLocaleString()}
          unit="kg"
          equivalent={diet === "vegan"
            ? `Choosing vegan avoids ~${Math.round(82 * 80).toLocaleString()} kg of meat — roughly ${Math.round(82 * 80 / 250)} cattle not slaughtered.`
            : `That's approximately ${data.meatCows.toLocaleString()} cattle worth of meat over a lifetime.`}
          usedFrac={data.usedFrac}
          accent={accent}
        />
      </div>

      <div
        className="p-3 rounded text-center"
        style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}
      >
        <div className="text-[9px] font-sans text-text-faint">
          Global averages sourced from UN, EPA, and Eurostat datasets. These are estimates — not precise measures.
        </div>
      </div>
    </div>
  );

  return (
    <RealmLayout realm={realm} controlsSection={controls} canvasSection={canvas_} />
  );
}
