"use client";

import React from "react";
import { useIntersectionFade } from "@/lib/animations/useIntersectionFade";

export default function TransitionDivider() {
  const { ref, isVisible } = useIntersectionFade({ once: true, threshold: 0.1 });

  return (
    <section 
      ref={ref as React.RefObject<HTMLDivElement>}
      className="w-full bg-gradient-to-b from-bg-base to-bg-surface py-20 px-6 overflow-hidden text-center relative"
    >
      <div 
        className={`flex items-center gap-8 max-w-[1280px] mx-auto transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Left Decorative Line (Hidden on mobile) */}
        <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-r from-transparent to-border" />

        {/* Text Center Panel */}
        <div className="text-center shrink-0 mx-auto max-w-xl">
          <span className="text-lg md:text-xl text-accent-bio block mb-4">
            ✦
          </span>
          <h2 className="font-display font-light italic text-[32px] md:text-[48px] text-text-primary leading-tight mb-4 whitespace-normal md:whitespace-nowrap">
            From wonder to work.
          </h2>
          <p className="font-ui text-sm md:text-base text-text-muted max-w-[480px] mx-auto leading-relaxed">
            100 precision utility tools for the professionals, freelancers, and planners who take time seriously.
          </p>
        </div>

        {/* Right Decorative Line (Hidden on mobile) */}
        <div className="hidden md:block flex-1 h-[1px] bg-gradient-to-l from-transparent to-border" />
      </div>
    </section>
  );
}
