"use client";

import React, { useState, useEffect } from "react";
import { PillToggle } from "@/components/ui";
import CalculatorCard from "../CalculatorCard";
import { convertUnixTimestamp } from "@/lib/tools/calculations";
import { Copy, Check } from "lucide-react";

interface UnixTimestampInputsProps {
  groupAccent: string;
}

export default function UnixTimestampInputs({ groupAccent }: UnixTimestampInputsProps) {
  const [mode, setMode] = useState<'epochToDate' | 'dateToEpoch'>("epochToDate");
  const [inputValue, setInputValue] = useState<string>("1719227922");
  const [copiedKey, setCopiedKey] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    secondsValue: 1719227922,
    millisecondsValue: 1719227922000,
    humanReadableUTC: "",
    humanReadableLocal: "",
    isoString: ""
  });

  const handleModeChange = (val: string) => {
    const newMode = val as 'epochToDate' | 'dateToEpoch';
    setMode(newMode);
    if (newMode === "epochToDate") {
      setInputValue(Math.round(Date.now() / 1000).toString());
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setInputValue(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`);
    }
  };

  useEffect(() => {
    const res = convertUnixTimestamp(inputValue, mode);
    setResult(res);
  }, [inputValue, mode]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const getBreakdownRows = () => {
    return [
      `Local Time representation: ${result.humanReadableLocal}`,
      `Universal Time representation: ${result.humanReadableUTC}`
    ];
  };

  const getCopyText = () => {
    return `Epoch: ${result.secondsValue} | ISO Date: ${result.isoString}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={result.secondsValue.toString()}
      resultUnit="UNIX EPOCH SECONDS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Converter Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted w-[120px] flex-shrink-0 pt-3">
            Conversion Mode
          </span>
          <PillToggle
            value={mode}
            onChange={handleModeChange}
            options={[
              { value: "epochToDate", label: "Epoch ➔ Calendar" },
              { value: "dateToEpoch", label: "Calendar ➔ Epoch" }
            ]}
            accentColor={groupAccent}
          />
        </div>

        {/* Input Field */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="epoch-val">
            {mode === "epochToDate" ? "Unix Timestamp (Seconds or Milliseconds)" : "Local Date/Time (YYYY-MM-DDTHH:MM)"}
          </label>
          <input
            id="epoch-val"
            type={mode === "epochToDate" ? "text" : "datetime-local"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-12 px-4 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            placeholder={mode === "epochToDate" ? "1719227922" : ""}
          />
        </div>

        {/* Multi-Format Developer Copy Board */}
        <div className="space-y-3 pt-2">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Format Clipboard Copy Blocks
          </h3>
          <div className="space-y-2 font-mono text-xs">
            
            {/* Seconds Code Block */}
            <div className="flex items-center justify-between gap-3 p-3 bg-bg-card border border-border rounded">
              <div className="min-w-0">
                <span className="text-[9px] text-text-faint block uppercase">Epoch Seconds</span>
                <span className="font-bold text-text-primary truncate block">{result.secondsValue}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.secondsValue.toString(), "sec")}
                className="p-2 hover:bg-bg-surface border border-border rounded transition-colors text-text-muted hover:text-text-primary flex-shrink-0"
              >
                {copiedKey === "sec" ? <Check className="w-3.5 h-3.5 stroke-[3px] text-accent-utility-a" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Milliseconds Code Block */}
            <div className="flex items-center justify-between gap-3 p-3 bg-bg-card border border-border rounded">
              <div className="min-w-0">
                <span className="text-[9px] text-text-faint block uppercase">Epoch Milliseconds</span>
                <span className="font-bold text-text-primary truncate block">{result.millisecondsValue}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.millisecondsValue.toString(), "ms")}
                className="p-2 hover:bg-bg-surface border border-border rounded transition-colors text-text-muted hover:text-text-primary flex-shrink-0"
              >
                {copiedKey === "ms" ? <Check className="w-3.5 h-3.5 stroke-[3px] text-accent-utility-a" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* ISO String Code Block */}
            <div className="flex items-center justify-between gap-3 p-3 bg-bg-card border border-border rounded">
              <div className="min-w-0">
                <span className="text-[9px] text-text-faint block uppercase">ISO 8601 String</span>
                <span className="font-bold text-text-primary truncate block">{result.isoString}</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(result.isoString, "iso")}
                className="p-2 hover:bg-bg-surface border border-border rounded transition-colors text-text-muted hover:text-text-primary flex-shrink-0"
              >
                {copiedKey === "iso" ? <Check className="w-3.5 h-3.5 stroke-[3px] text-accent-utility-a" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
