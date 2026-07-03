"use client";

import React from "react";
import Link from "next/link";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

export default function RealmsSection() {
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.05 });
  const featuredRealms = realmsRegistry.filter((r) =>
    ["butterfly-effect", "fifth-dimension"].includes(r.id)
  );

  return (
    <section
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full py-28 px-6 bg-bg-base"
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div className="max-w-xl">
            <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] block text-text-muted">
              ✦ 2 REALMS
            </span>
            <h2 className="font-display font-light italic text-[36px] md:text-[56px] text-text-primary leading-tight mt-3">
              Realms Worth Getting Lost In.
            </h2>
            <p className="font-ui text-base md:text-lg text-text-muted mt-4 max-w-[500px] leading-relaxed">
              Alter history and watch timelines split — or map your life events across the
              5th dimension and receive transmissions from alternate futures.
            </p>
          </div>

          <Link href="/realms" className="btn-brutal btn-brutal-primary shrink-0">
            Browse All Realms →
          </Link>
        </div>

        {/* Realm cards grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionProperty: "opacity, transform" }}
        >
          {featuredRealms.map((realm) => (
            <Link
              key={realm.id}
              href={`/realms/${realm.slug}`}
              className="realm-card-brutal group block relative overflow-hidden cursor-pointer h-[360px]"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translate(-3px, -3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-offset-xl) var(--shadow-color)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0, 0)";
                e.currentTarget.style.boxShadow = "var(--shadow-offset-lg) var(--shadow-color)";
              }}
            >
              {/* Per-realm background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 70% -10%, color-mix(in srgb, ${realm.accent} 12%, transparent) 0%, transparent 60%)`,
                }}
              />

              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-base/90 via-bg-base/40 to-transparent" />

              {/* AI tag */}
              {realm.needsAI && (
                <span
                  className="absolute top-4 left-4 z-20 px-2 py-0.5 font-ui font-bold uppercase tracking-wider"
                  style={{
                    fontSize: 9,
                    background: "var(--section-realms-accent)",
                    color: "var(--section-realms-text-on-accent)",
                    border: "var(--border-width-thin) solid var(--border)",
                  }}
                >
                  ✦ AI
                </span>
              )}

              {/* Hover badge */}
              <span
                className="badge-brutal-filled absolute top-4 right-4 z-20 px-3 py-1 rounded-none font-ui text-[11px] font-bold opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150"
                style={{
                  background: realm.accent,
                  color: "#0A0A0A",
                  border: "var(--border-width-thin) solid var(--border)",
                }}
              >
                Enter →
              </span>

              {/* Text */}
              <div className="absolute bottom-0 left-0 z-20 p-7 w-full">
                <span
                  className="inline-block px-2.5 py-0.5 rounded-none font-ui text-[10px] font-bold tracking-wider uppercase mb-3"
                  style={{
                    color: "#0A0A0A",
                    background: realm.accent,
                    border: "var(--border-width-thin) solid var(--border)",
                  }}
                >
                  {realm.category}
                </span>

                <h3 className="font-display font-light text-[32px] md:text-[38px] text-text-primary leading-[1.05] mb-3">
                  {realm.name}
                </h3>

                <p className="font-ui text-[13px] text-text-muted leading-relaxed line-clamp-2">
                  {realm.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-5 flex items-center gap-4">
          <div className="h-px bg-border flex-1" />
          <span className="font-ui text-[10px] text-text-faint uppercase tracking-[0.22em] whitespace-nowrap">
            More realms arriving soon.
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

      </div>
    </section>
  );
}
