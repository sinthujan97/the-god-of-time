"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toolsRegistry, ToolGroup } from "@/lib/data/toolsRegistry";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

export default function UtilitySection() {
  const [activeGroup, setActiveGroup] = useState<string>("standard-time");
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.05 });

  // Find active group details
  const currentGroup = toolsRegistry.find((g) => g.id === activeGroup) as ToolGroup;
  const currentAccent = currentGroup?.accent || "var(--accent-utility-a)";
  const currentTools = currentGroup?.tools.slice(0, 9) || [];

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full bg-bg-surface py-28 px-6"
    >
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
          <div className="max-w-xl">
            <span 
              className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] block"
              style={{ color: currentAccent }}
            >
              UTILITY TOOLS
            </span>
            <h2 className="font-ui font-semibold text-[32px] md:text-[48px] text-text-primary leading-tight mt-3">
              Built for Precision
            </h2>
            <p className="font-ui text-base md:text-lg text-text-muted mt-4 max-w-[500px] leading-relaxed">
              Professional-grade time calculators for business, HR, project management, global time zones, and health tracking.
            </p>
          </div>
          
          <Link
            href="/tools"
            className="font-ui text-sm font-semibold hover:underline lg:mb-2 shrink-0 inline-flex items-center gap-1.5"
            style={{ color: currentAccent }}
          >
            Browse All Tools →
          </Link>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="border-b border-border/40 pb-px mb-8 overflow-x-auto scrollbar-none">
          <div className="flex space-x-1.5 min-w-max pb-3">
            {toolsRegistry.map((group) => {
              const isActive = group.id === activeGroup;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroup(group.id)}
                  className="font-ui text-xs font-semibold px-5 h-[38px] rounded-full border border-transparent select-none cursor-pointer transition-all duration-150 focus:outline-none"
                  style={{
                    backgroundColor: isActive ? "var(--bg-card)" : "transparent",
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    borderColor: isActive ? "var(--border)" : "transparent",
                    boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.08)" : undefined,
                    borderBottom: isActive ? `2px solid ${group.accent}` : undefined,
                    borderRadius: isActive ? "6px 6px 0 0" : "100px",
                  }}
                >
                  {group.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Staggered Grid of Tools */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {currentTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group block bg-bg-card border border-border rounded-lg p-5 pl-6 transition-all duration-150 hover:bg-bg-card-hover hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] relative"
              style={{
                borderLeft: `3px solid ${currentAccent}`,
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-ui text-[15px] font-medium text-text-primary leading-tight group-hover:text-text-primary">
                  {tool.name}
                </h3>
                <span 
                  className="font-ui text-[15px] font-semibold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 shrink-0"
                  style={{ color: currentAccent }}
                >
                  →
                </span>
              </div>
              <p className="font-ui text-[13px] text-text-muted leading-relaxed mt-2.5">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Footer Show All Grid Link */}
        <div className="mt-12 text-center">
          <Link
            href={`/tools?group=${activeGroup}`}
            className="font-ui text-xs font-semibold uppercase tracking-wider hover:underline inline-flex items-center gap-1"
            style={{ color: currentAccent }}
          >
            Show All {currentGroup?.tools.length || 20} Tools →
          </Link>
        </div>

      </div>
    </section>
  );
}
