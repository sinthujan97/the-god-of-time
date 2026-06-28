"use client";

import React from "react";
import Link from "next/link";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

function PaintDryBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Paint drips — slow vertical streaks from the top */}
      {[
        { left: "8%",  h: "38%", w: 5, opacity: 0.18 },
        { left: "19%", h: "24%", w: 3, opacity: 0.12 },
        { left: "33%", h: "55%", w: 6, opacity: 0.20 },
        { left: "51%", h: "31%", w: 4, opacity: 0.14 },
        { left: "67%", h: "44%", w: 5, opacity: 0.16 },
        { left: "80%", h: "28%", w: 3, opacity: 0.11 },
        { left: "91%", h: "48%", w: 4, opacity: 0.15 },
      ].map((drip, i) => (
        <div
          key={i}
          className="absolute top-0 rounded-b-full"
          style={{
            left: drip.left,
            width: drip.w,
            height: drip.h,
            background: "#3ABFBF",
            opacity: drip.opacity,
          }}
        />
      ))}
      {/* Faint teal radial wash top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% -10%, rgba(58,191,191,0.14) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

export default function RealmsSection() {
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.05 });
  const realm = realmsRegistry[0];

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full py-28 px-6 bg-bg-base"
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div className="max-w-xl">
            <span
              className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] block"
              style={{ color: realm.accent }}
            >
              ✦ ONE REALM
            </span>
            <h2 className="font-display font-light italic text-[36px] md:text-[56px] text-text-primary leading-tight mt-3">
              The Only Realm You Need.
            </h2>
            <p className="font-ui text-base md:text-lg text-text-muted mt-4 max-w-[500px] leading-relaxed">
              A 4-hour paint drying experience with philosophical commentary.
            </p>
          </div>

          <Link
            href={`/realms/${realm.slug}`}
            className="font-ui text-sm font-semibold hover:underline lg:mb-2 shrink-0 inline-flex items-center gap-1.5"
            style={{ color: realm.accent }}
          >
            Enter Realm →
          </Link>
        </div>

        {/* Featured realm — full-width card */}
        <Link
          href={`/realms/${realm.slug}`}
          className={`group block relative rounded-xl border border-border bg-bg-card overflow-hidden cursor-pointer h-[420px] transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionProperty: "opacity, transform, border-color" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = realm.accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <PaintDryBackground />

          {/* Left-to-right gradient overlay keeps text readable */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-bg-base/90 via-bg-base/55 to-transparent" />

          {/* Hover badge */}
          <span className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full font-ui text-[12px] bg-white/10 border border-white/20 text-white font-medium backdrop-blur-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Enter →
          </span>

          {/* Text */}
          <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 max-w-[600px]">
            <span
              className="inline-block px-2.5 py-0.5 rounded-full font-ui text-[10px] font-semibold tracking-wider uppercase border border-current mb-4"
              style={{
                color: realm.accent,
                backgroundColor: `color-mix(in srgb, ${realm.accent} 12%, transparent)`,
              }}
            >
              {realm.category}
            </span>

            <h3 className="font-display font-light text-[40px] md:text-[52px] text-text-primary leading-[1.05] mb-4">
              {realm.name}
            </h3>

            <p className="font-ui text-[15px] text-text-muted leading-relaxed">
              {realm.description}
            </p>
          </div>
        </Link>

        {/* Divider — peak time wasting */}
        <div className="mt-5 flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <span className="font-ui text-[10px] text-text-faint uppercase tracking-[0.22em] whitespace-nowrap">
            No other realms arriving. This is peak time-wasting.
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

      </div>
    </section>
  );
}
