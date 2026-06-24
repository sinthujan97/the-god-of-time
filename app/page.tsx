import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Dynamic Cosmic Gradient Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent-cosmos rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-scifi rounded-full blur-[140px]" />
      </div>

      <div className="max-w-3xl text-center space-y-6 z-10 relative">
        <h1 className="text-5xl md:text-7xl font-display font-light text-text-primary tracking-widest leading-tight">
          ✦ THE GOD OF TIME
        </h1>
        <p className="text-base md:text-lg text-text-muted font-sans font-light max-w-xl mx-auto tracking-wide">
          An interactive sanctuary mapping the temporal dimension: from calculation engines to relativistic physics simulations.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center max-w-lg mx-auto">
          {/* Card: Utility Tools */}
          <Link
            href="/tools"
            className="flex-1 text-left p-6 rounded-xl border border-border bg-bg-card/50 hover:bg-bg-card-hover hover:border-accent-cosmos transition-all duration-300 group"
          >
            <span className="text-2xl mb-2 block">🧮</span>
            <h2 className="text-lg font-display font-medium text-text-primary group-hover:text-accent-cosmos transition-colors">
              Utility Tools
            </h2>
            <p className="text-xs text-text-muted mt-1 font-sans">
              100 professional calculators for standard time, payroll, project timelines, and biological logs.
            </p>
          </Link>

          {/* Card: Fun Realms */}
          <Link
            href="/realms"
            className="flex-1 text-left p-6 rounded-xl border border-border bg-bg-card/50 hover:bg-bg-card-hover hover:border-accent-scifi transition-all duration-300 group"
          >
            <span className="text-2xl mb-2 block">🪐</span>
            <h2 className="text-lg font-display font-medium text-text-primary group-hover:text-accent-scifi transition-colors">
              Cosmic Realms
            </h2>
            <p className="text-xs text-text-muted mt-1 font-sans">
              Immersive simulations, temporal relativity solvers, and generative AI paradox engines.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
