"use client";

import React from "react";
import Link from "next/link";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

type FeaturedTool = {
  slug: string;
  name: string;
  category: string;
  description: string;
  accent: string;
};

const featuredTools: FeaturedTool[] = [
  {
    slug: "days-between-dates",
    name: "Days Between Dates Calculator",
    category: "Standard Time & Date",
    description: "Calculate the exact number of days, weeks, and months between any two dates.",
    accent: "var(--accent-utility-a)",
  },
  {
    slug: "overtime-pay-calculator",
    name: "Overtime Pay Calculator",
    category: "HR, Payroll & Freelance",
    description: "Compute gross pay including regular and time-and-a-half (1.5x) or double-time (2x) hours.",
    accent: "var(--accent-utility-b)",
  },
  {
    slug: "project-back-planner",
    name: "Project Deadline Back-Planner",
    category: "Project Management",
    description: "Work backward from a deadline to calculate start dates and milestones, incorporating buffer and weekend rules.",
    accent: "var(--accent-utility-c)",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator (Down to the Second)",
    category: "Health & Lifecycle",
    description: "See your age in years, months, days, minutes, and running seconds.",
    accent: "var(--accent-utility-e)",
  },
];

export default function FeaturedToolsStrip() {
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.1 });

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} className="w-full bg-bg-surface py-20 px-6">
      <div className="max-w-[1280px] mx-auto">
        {/* Section header — no eyebrow, direct heading */}
        <h2 className="font-display font-light text-[28px] md:text-[36px] text-text-primary mb-12 leading-tight">
          Start here.
        </h2>

        {/* Staggered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool, idx) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className={`group block relative bg-bg-card border border-border rounded-lg p-7 min-h-[220px] flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:z-10 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{
                transitionDelay: `${idx * 100}ms`,
                transitionProperty: "opacity, transform, border-color, box-shadow, background-color",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = tool.accent;
                e.currentTarget.style.boxShadow = `4px 4px 0px 0px ${tool.accent}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Category label */}
              <span
                className="font-ui text-[10px] md:text-[11px] font-semibold uppercase tracking-wider mb-3.5 block"
                style={{ color: tool.accent }}
              >
                {tool.category}
              </span>

              {/* Tool Name */}
              <h3 className="font-display font-light text-[22px] text-text-primary leading-tight mb-3.5 flex-1 group-hover:opacity-90">
                {tool.name}
              </h3>

              {/* Description */}
              <p className="font-ui text-sm text-text-muted leading-relaxed mb-6">
                {tool.description}
              </p>

              {/* Card CTA */}
              <span
                className="font-ui text-xs font-semibold tracking-wide mt-auto inline-flex items-center gap-1 group-hover:opacity-85"
                style={{ color: tool.accent }}
              >
                Use Calculator →
              </span>

              {/* Watermark ✦ */}
              <span
                className="absolute right-[-10px] bottom-[-20px] font-sans text-[120px] select-none pointer-events-none opacity-[0.04] leading-none transition-transform duration-500 group-hover:scale-110"
                style={{ color: tool.accent }}
              >
                ✦
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
