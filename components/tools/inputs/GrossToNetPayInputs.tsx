"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { estimateNetPay } from "@/lib/tools/calculations";

interface GrossToNetPayInputsProps {
  groupAccent: string;
}

export default function GrossToNetPayInputs({ groupAccent }: GrossToNetPayInputsProps) {
  const [grossPay, setGrossPay] = useState<number>(3000);
  const [fedRate, setFedRate] = useState<number>(12);
  const [stateRate, setStateRate] = useState<number>(4);
  const [ficaRate, setFicaRate] = useState<number>(7.65);
  const [otherDeductions, setOtherDeductions] = useState<number>(150);

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    federalTax: 0,
    stateTax: 0,
    ficaTax: 0,
    totalDeductions: 0,
    estimatedNetPay: 0,
    effectiveTaxRate: 0,
  });

  useEffect(() => {
    const res = estimateNetPay(grossPay, fedRate, stateRate, ficaRate, otherDeductions);
    setResult(res);
  }, [grossPay, fedRate, stateRate, ficaRate, otherDeductions]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
  };

  const getBreakdownRows = () => {
    return [
      `Gross Income: ${formatCurrency(grossPay)}`,
      `Federal Tax withholding (${fedRate}%): -${formatCurrency(result.federalTax)}`,
      `State Tax withholding (${stateRate}%): -${formatCurrency(result.stateTax)}`,
      `FICA Tax (SS + Medicare) (${ficaRate}%): -${formatCurrency(result.ficaTax)}`,
      `Other Deductions (benefits, etc.): -${formatCurrency(otherDeductions)}`,
      `Total Deductions: -${formatCurrency(result.totalDeductions)}`,
      `Effective Tax & Deduction Rate: ${result.effectiveTaxRate.toFixed(1)}%`,
    ];
  };

  const getCopyText = () => {
    return `Net Pay: ${formatCurrency(result.estimatedNetPay)} (Gross: ${formatCurrency(grossPay)}, Deductions: ${formatCurrency(result.totalDeductions)})`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={formatCurrency(result.estimatedNetPay)}
      resultUnit="ESTIMATED TAKE-HOME PAY"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Gross pay */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="gross-pay">
            Gross Pay for Period ($)
          </label>
          <input
            id="gross-pay"
            type="number"
            min="0"
            step="10"
            value={isNaN(grossPay) ? "" : grossPay}
            onChange={(e) => setGrossPay(parseFloat(e.target.value) || 0)}
            className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
        </div>

        {/* Taxes */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-subtle">
          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted" htmlFor="fed-rate">
              Federal Tax (%)
            </label>
            <input
              id="fed-rate"
              type="number"
              min="0"
              max="99"
              step="0.1"
              value={isNaN(fedRate) ? "" : fedRate}
              onChange={(e) => setFedRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted" htmlFor="state-rate">
              State Tax (%)
            </label>
            <input
              id="state-rate"
              type="number"
              min="0"
              max="99"
              step="0.1"
              value={isNaN(stateRate) ? "" : stateRate}
              onChange={(e) => setStateRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted" htmlFor="fica-rate">
              FICA Tax (%)
            </label>
            <input
              id="fica-rate"
              type="number"
              min="0"
              max="99"
              step="0.01"
              value={isNaN(ficaRate) ? "" : ficaRate}
              onChange={(e) => setFicaRate(parseFloat(e.target.value) || 0)}
              className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary"
              style={{ "--local-accent": groupAccent } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Deductions */}
        <div className="pt-4 border-t border-border-subtle flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="other-ded">
            Other Voluntary Period Deductions ($)
          </label>
          <input
            id="other-ded"
            type="number"
            min="0"
            step="1"
            value={isNaN(otherDeductions) ? "" : otherDeductions}
            onChange={(e) => setOtherDeductions(parseFloat(e.target.value) || 0)}
            className="h-10 px-3 bg-bg-surface border border-border rounded-md font-sans text-xs focus:outline-none focus:ring-2 text-text-primary w-[200px]"
            style={{ "--local-accent": groupAccent } as React.CSSProperties}
          />
          <span className="text-[11px] text-text-muted font-sans font-light mt-1">
            Includes healthcare premium shares, HSA, 401(k), etc.
          </span>
        </div>

      </div>
    </CalculatorCard>
  );
}
