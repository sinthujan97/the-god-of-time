"use client";

import React from "react";
import Link from "next/link";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

type Realm = {
  slug: string;
  name: string;
  description: string;
  category: string;
  accent: string;
  needsAI: boolean;
  wide?: boolean;
};

const realms: Realm[] = [
  {
    slug: "solar-system-age",
    name: "Solar System Age",
    description: "Compare your timeline against standard orbital periods of the planets.",
    category: "Cosmos",
    accent: "var(--accent-cosmos)",
    needsAI: false,
    wide: true,
  },
  {
    slug: "black-hole-gravity",
    name: "Black Hole Gravity Playground",
    description: "Experience relativistic time dilation as you descend near the singularity.",
    category: "Physics",
    accent: "var(--accent-scifi)",
    needsAI: false,
  },
  {
    slug: "what-year-am-i",
    name: "What Year Am I In?",
    description: "Generative AI timeline solver evaluating historical dates from text clues.",
    category: "Sci-Fi",
    accent: "var(--accent-whim)",
    needsAI: true,
  },
  {
    slug: "butterfly-effect",
    name: "Butterfly Effect Timeline Simulator",
    description: "Branch timeline variables and trace cascades using chaos engines.",
    category: "Sci-Fi",
    accent: "var(--accent-whim)",
    needsAI: true,
  },
  {
    slug: "spacetime-fabric",
    name: "Spacetime Fabric Warp Grid",
    description: "Deform spatial lines and plot paths through high-gravity vectors.",
    category: "Physics",
    accent: "var(--accent-scifi)",
    needsAI: false,
  },
  {
    slug: "born-wrong-era",
    name: "Born in the Wrong Era?",
    description: "Match your behavioral profile to historical and speculative timelines.",
    category: "Whimsical",
    accent: "var(--accent-whim)",
    needsAI: true,
  },
  {
    slug: "destiny-matrix",
    name: "Destiny Matrix Path Finder",
    description: "Map your birth moment to cosmic alignments and destiny matrices.",
    category: "Destiny",
    accent: "var(--accent-destiny)",
    needsAI: false,
  },
  {
    slug: "cosmic-countdown",
    name: "Cosmic Countdown Dashboard",
    description: "Track ticking clocks counting down to major solar and galactic events.",
    category: "Cosmos",
    accent: "var(--accent-cosmos)",
    needsAI: false,
    wide: true,
  },
];

export default function RealmsSection() {
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.05 });

  // Custom visual components rendered inline for backgrounds
  const renderBackground = (slug: string) => {
    switch (slug) {
      case "solar-system-age":
        return (
          <div className="absolute inset-0 bg-[#06060c] overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-50">
            <div className="w-[100px] h-[100px] rounded-full bg-orange-500/20 blur-md absolute" />
            <div className="w-[140px] h-[140px] border border-accent-cosmos/20 rounded-full absolute animate-[orbit_8s_linear_infinite]" />
            <div className="w-[200px] h-[200px] border border-accent-cosmos/15 rounded-full absolute animate-[orbit_14s_linear_infinite]" />
            <div className="w-[260px] h-[260px] border border-accent-cosmos/10 rounded-full absolute animate-[orbit_22s_linear_infinite]" />
            
            {/* Planets */}
            <div className="w-2.5 h-2.5 rounded-full bg-accent-cosmos absolute -translate-x-[70px] animate-[orbit_8s_linear_infinite]" />
            <div className="w-3.5 h-3.5 rounded-full bg-accent-scifi absolute translate-x-[100px] animate-[orbit_14s_linear_infinite]" />
            <div className="w-2 h-2 rounded-full bg-accent-whim absolute -translate-y-[130px] animate-[orbit_22s_linear_infinite]" />
          </div>
        );

      case "black-hole-gravity":
        return (
          <div className="absolute inset-0 bg-[#050508] overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-40">
            <div className="w-[80px] h-[80px] rounded-full bg-[#000000] border-2 border-accent-scifi/50 absolute z-10" />
            <div className="w-[120px] h-[120px] rounded-full absolute bg-conic from-transparent via-accent-scifi/20 to-accent-scifi/80 animate-[spin_5s_linear_infinite]" />
            {/* Spiraling particles */}
            <div className="w-1 h-1 rounded-full bg-white absolute translate-x-[50px] -translate-y-[20px] animate-[ping_2s_infinite]" />
            <div className="w-1 h-1 rounded-full bg-white absolute -translate-x-[60px] translate-y-[30px] animate-[ping_3s_infinite]" />
          </div>
        );

      case "what-year-am-i":
        return (
          <div className="absolute inset-0 bg-bg-base overflow-hidden pointer-events-none select-none opacity-30 font-mono text-[10px] text-accent-whim select-none">
            <div className="absolute top-[20%] left-[10%] animate-[pulse_2s_infinite] opacity-50">1789 AD</div>
            <div className="absolute top-[50%] left-[60%] animate-[pulse_3s_infinite] opacity-60">2026 AD</div>
            <div className="absolute top-[80%] left-[25%] animate-[pulse_1.5s_infinite] opacity-40">3050 AD</div>
            <div className="absolute top-[30%] left-[80%] animate-[pulse_4s_infinite] opacity-50">1066 AD</div>
          </div>
        );

      case "butterfly-effect":
        return (
          <div className="absolute inset-0 bg-bg-base overflow-hidden flex items-center justify-center pointer-events-none select-none opacity-45">
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" className="stroke-accent-whim stroke-[1.5]">
              <path d="M50 95 C 50 65, 30 50, 15 50" strokeDasharray="100" strokeDashoffset="0" className="animate-[draw_3s_ease-out_infinite]" />
              <path d="M50 95 C 50 65, 70 50, 85 50" strokeDasharray="100" strokeDashoffset="0" className="animate-[draw_3.5s_ease-out_infinite]" />
              <path d="M15 50 C 15 35, 25 20, 30 10" strokeDasharray="50" strokeDashoffset="0" className="animate-[draw_4s_ease-out_infinite]" />
              <path d="M85 50 C 85 35, 75 20, 70 10" strokeDasharray="50" strokeDashoffset="0" className="animate-[draw_4.5s_ease-out_infinite]" />
            </svg>
          </div>
        );

      case "spacetime-fabric":
        return (
          <div className="absolute inset-0 bg-bg-base overflow-hidden pointer-events-none select-none opacity-20">
            <div 
              className="w-[200%] h-[200%] border border-accent-scifi/20 rounded-full absolute -top-1/2 -left-1/2 animate-[pulse_6s_ease-in-out_infinite]"
              style={{
                backgroundImage: "radial-gradient(circle, transparent 30%, var(--accent-scifi) 70%)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>
        );

      case "born-wrong-era":
        return (
          <div className="absolute inset-0 bg-bg-base overflow-hidden pointer-events-none select-none opacity-20">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-purple-500/10 to-teal-500/10 animate-[pulse_5s_infinite]" />
          </div>
        );

      case "destiny-matrix":
        return (
          <div className="absolute inset-0 bg-bg-base overflow-hidden pointer-events-none select-none opacity-30 flex items-center justify-center">
            <svg width="200" height="200" viewBox="0 0 100 100" fill="none" className="stroke-accent-destiny/30 stroke-[0.75]">
              <circle cx="50" cy="50" r="4" fill="var(--accent-destiny)" className="animate-pulse" />
              <circle cx="20" cy="30" r="2" fill="var(--accent-destiny)" />
              <circle cx="80" cy="40" r="2" fill="var(--accent-destiny)" />
              <circle cx="40" cy="80" r="2" fill="var(--accent-destiny)" />
              
              <line x1="50" y1="50" x2="20" y2="30" />
              <line x1="50" y1="50" x2="80" y2="40" />
              <line x1="50" y1="50" x2="40" y2="80" />
              <line x1="20" y1="30" x2="80" y2="40" strokeDasharray="3 3" />
            </svg>
          </div>
        );

      case "cosmic-countdown":
        return (
          <div className="absolute inset-0 bg-[#050508] overflow-hidden pointer-events-none select-none opacity-25 font-mono text-[9px] text-accent-cosmos">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="absolute animate-[floatUp_6s_linear_infinite]"
                style={{
                  left: `${15 + idx * 10}%`,
                  animationDelay: `${idx * 0.8}ms`,
                  bottom: "-20px",
                }}
              >
                {(idx * 7 + 3) % 10}
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section ref={ref as React.RefObject<HTMLDivElement>} className="w-full py-28 px-6 bg-bg-base">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div className="max-w-xl">
            <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.25em] text-accent-cosmos block">
              ✦ FUN REALMS
            </span>
            <h2 className="font-display font-light italic text-[36px] md:text-[56px] text-text-primary leading-tight mt-3">
              Enter a Realm
            </h2>
            <p className="font-ui text-base md:text-lg text-text-muted mt-4 max-w-[500px] leading-relaxed">
              Immersive cosmic experiences where physics bends, time distorts, and every click reveals something extraordinary.
            </p>
          </div>
          
          <Link
            href="/realms"
            className="font-ui text-sm font-semibold text-accent-cosmos hover:underline lg:mb-2 shrink-0 inline-flex items-center gap-1.5"
          >
            View All Realms →
          </Link>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {realms.map((realm, idx) => {
            const isWide = realm.wide;
            return (
              <Link
                key={realm.slug}
                href={`/realms/${realm.slug}`}
                className={`group block relative rounded-xl border border-border bg-bg-card/50 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:border-accent-cosmos ${
                  isWide ? "md:col-span-2 h-[400px]" : "h-[320px]"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{
                  transitionDelay: `${idx * 80}ms`,
                  transitionProperty: "opacity, transform, border-color",
                }}
              >
                {/* 1. CSS Animated Background Panel */}
                {renderBackground(realm.slug)}

                {/* 2. Color Gradient Overlay */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-base/95 via-bg-base/40 to-transparent dark:from-[#06060a]/95 dark:via-[#06060a]/40" />

                {/* 3. AI Powered Tag */}
                {realm.needsAI && (
                  <span className="absolute top-5 left-5 z-20 px-2.5 py-0.5 rounded-full font-ui text-[9px] font-semibold tracking-wider bg-accent-scifi/10 border border-accent-scifi/30 text-accent-scifi uppercase">
                    ✦ AI Powered
                  </span>
                )}

                {/* 4. Hover Enter Badge */}
                <span className="absolute top-5 right-5 z-20 px-3.5 py-1.5 rounded-full font-ui text-[12px] bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white font-medium backdrop-blur-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Enter →
                </span>

                {/* 5. Text Information */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-7">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-full font-ui text-[10px] font-semibold tracking-wider uppercase border border-current mb-3"
                    style={{
                      color: realm.accent,
                      backgroundColor: `color-mix(in srgb, ${realm.accent} 12.5%, transparent)`,
                    }}
                  >
                    {realm.category}
                  </span>
                  
                  <h3 className="font-display font-light text-[28px] text-text-primary leading-tight mb-2">
                    {realm.name}
                  </h3>
                  
                  <p className="font-ui text-sm text-text-muted leading-relaxed max-w-[320px] md:max-w-[400px]">
                    {realm.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes draw {
          0% { stroke-dashoffset: 100; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -100; }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-340px) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
