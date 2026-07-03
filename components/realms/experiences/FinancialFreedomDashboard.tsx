"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

// ─── Milestone definitions ────────────────────────────────────────────────────

type Milestone = {
  id: string;
  emoji: string;
  label: string;
  sublabel: string;
};

const MILESTONES: Milestone[] = [
  { id: "debt_free",     emoji: "🧾", label: "Debt-Free",             sublabel: "Total debt cleared" },
  { id: "safety_net",   emoji: "🛡", label: "6-Month Safety Net",    sublabel: "Emergency fund complete" },
  { id: "hundred_k",    emoji: "💯", label: "$100,000 Saved",        sublabel: "First major milestone" },
  { id: "million",      emoji: "🏆", label: "$1,000,000 Milestone",  sublabel: "Millionaire status" },
  { id: "work_optional",emoji: "🌴", label: "Work-Optional",         sublabel: "4% rule — expenses covered" },
  { id: "peace",        emoji: "😴", label: "Financial Peace",       sublabel: "Debt-free + safety net done" },
];

// ─── Compound interest solver ─────────────────────────────────────────────────

// Returns months to reach target T from current savings S with monthly PMT at monthly rate r
function monthsToTarget(S: number, PMT: number, r: number, T: number): number | null {
  if (T <= S) return 0; // already there
  if (PMT <= 0 && r <= 0) return null; // impossible
  if (r === 0) {
    if (PMT <= 0) return null;
    return Math.ceil((T - S) / PMT);
  }
  // Solve: S(1+r)^n + PMT*((1+r)^n - 1)/r = T
  // => (1+r)^n = (T*r + PMT) / (S*r + PMT)
  const ratio = (T * r + PMT) / (S * r + PMT);
  if (ratio <= 0) return null;
  return Math.ceil(Math.log(ratio) / Math.log(1 + r));
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function fmtYrsMonths(months: number): string {
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  if (yrs === 0) return `${mos} month${mos !== 1 ? "s" : ""}`;
  if (mos === 0) return `${yrs} year${yrs !== 1 ? "s" : ""}`;
  return `${yrs}yr ${mos}mo`;
}

function fmtDollars(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n.toFixed(0)}`;
}

// ─── Number input ─────────────────────────────────────────────────────────────

function MoneyInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </label>
      <div className="flex items-center" style={{ border: "2px solid var(--border)", background: "var(--bg-card)" }}>
        <span className="px-3 font-mono text-sm text-text-faint border-r" style={{ borderColor: "var(--border)", paddingTop: "7px", paddingBottom: "7px" }}>
          $
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          min={0}
          className="flex-1 px-3 py-2 font-mono text-sm bg-transparent text-text-primary outline-none"
        />
      </div>
    </div>
  );
}

// ─── Milestone card ───────────────────────────────────────────────────────────

function MilestoneCard({
  milestone,
  months,
  currentSavings,
  target,
  accent,
  achieved,
}: {
  milestone: Milestone;
  months: number | null;
  currentSavings: number;
  target: number;
  accent: string;
  achieved: boolean;
}) {
  const pct = target > 0 ? Math.min(100, (currentSavings / target) * 100) : 0;
  const date = months !== null ? fmtDate(addMonths(new Date(), months)) : null;

  return (
    <div
      className="flex flex-col gap-2 p-4"
      style={{
        border: "2px solid var(--border)",
        background: achieved ? `${accent}0A` : "var(--bg-card)",
        boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{milestone.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-bold text-text-primary leading-tight">{milestone.label}</p>
          <p className="text-[9px] font-sans text-text-faint">{milestone.sublabel}</p>
        </div>
        {achieved && (
          <span className="text-[9px] font-sans font-bold uppercase tracking-wider" style={{ color: "var(--accent-utility-a)" }}>
            ✓ Now
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 overflow-hidden" style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${pct}%`, background: achieved ? "var(--accent-utility-a)" : accent }}
        />
      </div>

      {/* Date + away */}
      {!achieved && date && months !== null ? (
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-sm font-black" style={{ color: accent }}>{date}</p>
            <p className="text-[9px] font-sans text-text-faint">{fmtYrsMonths(months)} away</p>
          </div>
          <p className="font-mono text-[10px] text-text-faint">{pct.toFixed(0)}%</p>
        </div>
      ) : !achieved ? (
        <p className="text-[10px] font-sans text-text-faint italic">
          {target === 0 ? "—" : "Increase savings rate to reach this milestone"}
        </p>
      ) : (
        <p className="font-mono text-sm font-black" style={{ color: "var(--accent-utility-a)" }}>
          {fmtDollars(currentSavings)} / {fmtDollars(target)}
        </p>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FinancialFreedomDashboard() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "financial-freedom-dashboard";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [income,       setIncome]       = useState("");
  const [expenses,     setExpenses]     = useState("");
  const [savings,      setSavings]      = useState("");
  const [debt,         setDebt]         = useState("");
  const [debtPayment,  setDebtPayment]  = useState("");
  const [monthlyInvest,setMonthlyInvest]= useState("");
  const [annualReturn, setAnnualReturn] = useState(7);
  const [calculated,   setCalculated]   = useState(false);
  const [error,        setError]        = useState("");

  const nums = useMemo(() => ({
    income:        parseFloat(income)        || 0,
    expenses:      parseFloat(expenses)      || 0,
    savings:       parseFloat(savings)       || 0,
    debt:          parseFloat(debt)          || 0,
    debtPayment:   parseFloat(debtPayment)   || 0,
    monthlyInvest: parseFloat(monthlyInvest) || 0,
  }), [income, expenses, savings, debt, debtPayment, monthlyInvest]);

  const results = useMemo(() => {
    if (!calculated) return null;
    const r = annualReturn / 100 / 12;
    const S = nums.savings;
    const PMT = nums.monthlyInvest;

    const debtFreeMonths     = nums.debt > 0 && nums.debtPayment > 0
      ? Math.ceil(nums.debt / nums.debtPayment) : (nums.debt === 0 ? 0 : null);
    const safetyNetTarget    = nums.expenses * 6;
    const workOptionalTarget = nums.expenses > 0 ? (nums.expenses * 12) / 0.04 : 0;

    const safetyNetMonths    = monthsToTarget(S, PMT, r, safetyNetTarget);
    const hundredKMonths     = monthsToTarget(S, PMT, r, 100_000);
    const millionMonths      = monthsToTarget(S, PMT, r, 1_000_000);
    const workOptionalMonths = workOptionalTarget > 0 ? monthsToTarget(S, PMT, r, workOptionalTarget) : null;

    const peaceMonths = (debtFreeMonths !== null && safetyNetMonths !== null)
      ? Math.max(debtFreeMonths, safetyNetMonths) : null;

    return {
      debtFreeMonths,
      safetyNetMonths,
      hundredKMonths,
      millionMonths,
      workOptionalMonths,
      peaceMonths,
      safetyNetTarget,
      workOptionalTarget,
    };
  }, [calculated, nums, annualReturn]);

  const handleCalculate = () => {
    if (!income && !savings) { setError("Enter at least your savings or monthly income."); return; }
    setError("");
    setCalculated(true);
  };

  // Timeline axis: earliest and latest milestone in months
  const allMonths = results
    ? [results.debtFreeMonths, results.safetyNetMonths, results.hundredKMonths,
       results.millionMonths, results.workOptionalMonths, results.peaceMonths]
        .filter((m): m is number => m !== null)
    : [];
  const maxMos = allMonths.length > 0 ? Math.max(...allMonths) : 1;

  const milestoneData = results ? [
    { id: "debt_free",      months: results.debtFreeMonths,     target: nums.debt,                achieved: nums.debt === 0 },
    { id: "safety_net",     months: results.safetyNetMonths,    target: results.safetyNetTarget,   achieved: nums.savings >= results.safetyNetTarget },
    { id: "hundred_k",      months: results.hundredKMonths,     target: 100_000,                   achieved: nums.savings >= 100_000 },
    { id: "million",        months: results.millionMonths,      target: 1_000_000,                 achieved: nums.savings >= 1_000_000 },
    { id: "work_optional",  months: results.workOptionalMonths, target: results.workOptionalTarget,achieved: results.workOptionalTarget > 0 && nums.savings >= results.workOptionalTarget },
    { id: "peace",          months: results.peaceMonths,        target: results.safetyNetTarget + nums.debt, achieved: nums.debt === 0 && nums.savings >= results.safetyNetTarget },
  ] : [];

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-4">
          <MoneyInput label="Monthly income (after tax)" value={income} onChange={v => { setIncome(v); setCalculated(false); }} placeholder="4,000" />
          <MoneyInput label="Monthly expenses" value={expenses} onChange={v => { setExpenses(v); setCalculated(false); }} placeholder="2,500" />
          <MoneyInput label="Current savings / investments" value={savings} onChange={v => { setSavings(v); setCalculated(false); }} placeholder="15,000" />
          <MoneyInput label="Total debt" value={debt} onChange={v => { setDebt(v); setCalculated(false); }} placeholder="8,000" />
          <MoneyInput label="Monthly debt repayment" value={debtPayment} onChange={v => { setDebtPayment(v); setCalculated(false); }} placeholder="400" />
          <MoneyInput label="Monthly investment amount" value={monthlyInvest} onChange={v => { setMonthlyInvest(v); setCalculated(false); }} placeholder="500" />

          {/* Return rate */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <label className="text-[10px] font-sans font-semibold uppercase tracking-wider text-text-muted">
                Expected annual return
              </label>
              <span className="font-mono text-xs" style={{ color: accent }}>{annualReturn}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={15}
              step={0.5}
              value={annualReturn}
              onChange={(e) => { setAnnualReturn(Number(e.target.value)); setCalculated(false); }}
              className="w-full"
              style={{ accentColor: accent }}
            />
            <div className="flex justify-between text-[9px] font-sans text-text-faint">
              <span>1%</span>
              <span>7% (S&P avg)</span>
              <span>15%</span>
            </div>
          </div>

          {error && <p className="text-[11px] font-sans" style={{ color: "var(--destructive)" }}>{error}</p>}

          <button
            onClick={handleCalculate}
            className="calculate-btn"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            Calculate My Freedom Timeline
          </button>

          {/* Quick inputs note */}
          <p className="text-[9px] font-sans text-text-faint italic leading-relaxed text-center">
            All figures are estimates. The tool assumes steady contributions and a consistent return rate — real markets fluctuate.
          </p>
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {calculated && results ? (
            <div className="p-4 md:p-5 flex flex-col gap-5">
              {/* Headline */}
              <p
                className="font-display font-light italic text-text-primary leading-tight"
                style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)" }}
              >
                Six milestones. One timeline. Here is when you cross each one.
              </p>

              {/* Milestone cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {milestoneData.map((d) => {
                  const m = MILESTONES.find(ml => ml.id === d.id)!;
                  return (
                    <MilestoneCard
                      key={d.id}
                      milestone={m}
                      months={d.months}
                      currentSavings={nums.savings}
                      target={d.target}
                      accent={accent}
                      achieved={d.achieved}
                    />
                  );
                })}
              </div>

              {/* Timeline bar */}
              {allMonths.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-[9px] font-sans font-bold uppercase tracking-wider text-text-faint">
                    Milestone timeline
                  </p>
                  <div
                    className="w-full h-8 relative"
                    style={{ border: "2px solid var(--border)", background: "var(--bg-base)" }}
                  >
                    {/* Now marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 flex items-center"
                      style={{ left: 0, background: accent }}
                    >
                      <span
                        className="absolute -top-4 left-1 text-[8px] font-mono font-bold"
                        style={{ color: accent }}
                      >
                        NOW
                      </span>
                    </div>
                    {/* Milestone dots */}
                    {milestoneData.map((d) => {
                      if (d.months === null || d.months < 0) return null;
                      const pct = maxMos > 0 ? (d.months / maxMos) * 95 + 2 : 50;
                      const m = MILESTONES.find(ml => ml.id === d.id)!;
                      return (
                        <div
                          key={d.id}
                          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
                          style={{ left: `${pct}%` }}
                          title={`${m.label}: ${fmtYrsMonths(d.months)}`}
                        >
                          <span className="text-sm leading-none">{m.emoji}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[8px] font-mono text-text-faint">
                    <span>Today</span>
                    <span>{maxMos > 0 ? fmtYrsMonths(maxMos) : "—"} from now</span>
                  </div>
                </div>
              )}

              {/* 4% rule note */}
              {results.workOptionalTarget > 0 && (
                <div
                  className="p-4"
                  style={{ border: `2px solid ${accent}44`, background: `${accent}08` }}
                >
                  <p className="text-[11px] font-sans text-text-muted leading-relaxed">
                    <span className="font-bold" style={{ color: accent }}>Work-optional target:</span>{" "}
                    {fmtDollars(results.workOptionalTarget)} — the portfolio size where the 4% safe withdrawal rate covers your monthly expenses of {fmtDollars(nums.expenses)} indefinitely.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                When does money stop running your life?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your numbers to see all six financial milestones simultaneously — from debt-free to work-optional — on a single timeline.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
