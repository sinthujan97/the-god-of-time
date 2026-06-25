"use client";

import React from "react";
import Link from "next/link";

export default function HomepageFooter() {
  const realmsLinks = [
    { slug: "solar-system-age", name: "Solar System Age" },
    { slug: "black-hole-gravity", name: "Black Hole Gravity" },
    { slug: "what-year-am-i", name: "What Year Am I In?" },
    { slug: "butterfly-effect", name: "Butterfly Effect" },
    { slug: "spacetime-fabric", name: "Spacetime Fabric" },
    { slug: "born-wrong-era", name: "Born Wrong Era" },
    { slug: "destiny-matrix", name: "Destiny Matrix" },
    { slug: "cosmic-countdown", name: "Cosmic Countdown" },
  ];

  const toolsLinks = [
    { id: "standard-time", name: "Standard Time & Date →" },
    { id: "hr-payroll", name: "HR, Payroll & Freelance →" },
    { id: "project-management", name: "Project Management →" },
    { id: "global-time", name: "Global Time & Zones →" },
    { id: "health-lifecycle", name: "Health & Lifecycle →" },
  ];

  return (
    <section className="w-full bg-gradient-to-b from-bg-surface to-bg-base pt-28 pb-20 px-6">
      <div className="max-w-[800px] mx-auto text-center">
        {/* Logo Repeated */}
        <h2 className="font-display font-light italic text-[40px] md:text-[48px] text-text-primary tracking-wide mb-6">
          ✦ GOD OF TIME
        </h2>
        
        {/* Tagline */}
        <p className="font-ui text-base md:text-lg text-text-muted mb-16 leading-relaxed">
          Every second counts. Or doesn't. <br className="block sm:hidden" />
          Depends on the tool.
        </p>

        {/* Two-Column Link Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 text-left mb-16">
          {/* Left Column: Fun Realms */}
          <div className="space-y-5">
            <h4 className="font-display font-light italic text-[20px] text-text-primary border-b border-border/40 pb-2">
              Fun Realms
            </h4>
            <div className="flex flex-col">
              {realmsLinks.map((realm) => (
                <Link
                  key={realm.slug}
                  href={`/realms/${realm.slug}`}
                  className="font-ui text-sm text-text-muted hover:text-accent-cosmos py-1.5 border-b border-border-subtle hover:border-accent-cosmos/30 transition-all duration-150"
                >
                  {realm.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Utility Tools */}
          <div className="space-y-5">
            <h4 className="font-ui font-semibold text-[18px] text-text-primary border-b border-border/40 pb-2">
              Utility Tools
            </h4>
            <div className="flex flex-col">
              {toolsLinks.map((group) => (
                <Link
                  key={group.id}
                  href={`/tools?group=${group.id}`}
                  className="font-ui text-sm text-text-muted hover:text-accent-utility-a py-1.5 border-b border-border-subtle hover:border-accent-utility-a/30 transition-all duration-150"
                >
                  {group.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <span className="font-ui text-xs text-text-faint">
            © 2026 The God of Time. All rights reserved.
          </span>
          <div className="flex items-center gap-4 font-ui text-xs text-text-faint">
            <Link href="/about" className="hover:text-text-muted transition-colors">
              About
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-text-muted transition-colors">
              Privacy
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
