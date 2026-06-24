"use client";

import React, { useState, useEffect } from "react";
import CalculatorCard from "../CalculatorCard";
import { lookupAbbreviationDetails } from "@/lib/tools/calculations";

interface AbbreviationDirectoryInputsProps {
  groupAccent: string;
}

export default function AbbreviationDirectoryInputs({ groupAccent }: AbbreviationDirectoryInputsProps) {
  const [search, setSearch] = useState<string>("");
  const [selectedAbbrev, setSelectedAbbrev] = useState<string>("PST");

  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [result, setResult] = useState({
    standardFullCodeName: "",
    baseUTCOffsetFormatted: "",
    appliesDaylightSaving: false,
    associatedRegions: [] as string[]
  });

  const abbrevList = ["PST", "PDT", "EST", "EDT", "GMT", "CET", "CEST", "JST", "IST", "AEST", "AEDT", "UTC"];

  useEffect(() => {
    const res = lookupAbbreviationDetails(selectedAbbrev);
    setResult(res);
  }, [selectedAbbrev]);

  const handleCalculate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAnimationKey((prev) => prev + 1);
    }, 200);
  };

  const filteredAbbrevs = abbrevList.filter((a) => 
    a.toLowerCase().includes(search.toLowerCase())
  );

  const getBreakdownRows = () => {
    return [
      `Offset Representation: ${result.baseUTCOffsetFormatted}`,
      `Daylight Saving Rules: ${result.appliesDaylightSaving ? "Applies seasonally" : "Standard time only"}`,
      `Regions: ${result.associatedRegions.join(", ")}`
    ];
  };

  const getCopyText = () => {
    return `Timezone Code: ${selectedAbbrev} | Name: ${result.standardFullCodeName} | Offset: ${result.baseUTCOffsetFormatted}`;
  };

  return (
    <CalculatorCard
      groupAccent={groupAccent}
      isLoading={isLoading}
      onCalculate={handleCalculate}
      resultValue={`${selectedAbbrev} (${result.baseUTCOffsetFormatted})`}
      resultUnit="ACTIVE TIMEZONE DETAILS"
      resultBreakdown={getBreakdownRows()}
      copyText={getCopyText()}
      animationKey={animationKey}
    >
      <div className="space-y-6" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
        
        {/* Search Panel */}
        <div className="flex flex-col space-y-1">
          <label className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted" htmlFor="abbrev-search">
            Filter Timezone Abbreviations
          </label>
          <input
            id="abbrev-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 px-3 bg-bg-surface border border-border rounded-md font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--group-accent)] text-text-primary"
            placeholder="Type code (e.g. EST, JST)..."
          />
        </div>

        {/* Directory Grid of Cards */}
        <div className="space-y-3">
          <h3 className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Directory Registry Cards
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {filteredAbbrevs.map((code) => {
              const isSelected = selectedAbbrev === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setSelectedAbbrev(code)}
                  className={`py-3 px-2 rounded-lg border text-center transition-all cursor-pointer select-none ${
                    isSelected
                      ? "bg-bg-card border-[color:var(--group-accent)] shadow text-[color:var(--group-accent)] font-bold scale-105"
                      : "bg-bg-surface border-border text-text-muted hover:border-text-faint hover:text-text-primary"
                  }`}
                >
                  <span className="font-mono text-sm block">{code}</span>
                  <span className="text-[9px] font-sans font-medium uppercase text-text-faint block mt-0.5">
                    {code.endsWith("DT") || code.endsWith("ST") ? "Seasonal" : "Standard"}
                  </span>
                </button>
              );
            })}
            {filteredAbbrevs.length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-text-faint italic font-sans">
                No matching abbreviation found.
              </div>
            )}
          </div>
        </div>

        {/* Abbreviation detail summary display */}
        <div className="p-4 border border-border rounded-lg bg-bg-card space-y-3 font-sans text-xs">
          <h4 className="font-bold text-text-primary uppercase tracking-wider text-[10px] border-b border-border/40 pb-1">
            Official Designation Specifications
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-text-faint uppercase font-semibold block">Full Name</span>
              <span className="text-text-primary font-medium">{result.standardFullCodeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-text-faint uppercase font-semibold block">UTC Base Offset</span>
              <span className="text-text-primary font-bold font-mono">{result.baseUTCOffsetFormatted}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-text-faint uppercase font-semibold block mb-1">Associated Regions</span>
            <div className="flex flex-wrap gap-1">
              {result.associatedRegions.map((region, i) => (
                <span key={i} className="px-2 py-0.5 bg-bg-surface border border-border rounded text-[10px] text-text-muted">
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </CalculatorCard>
  );
}
