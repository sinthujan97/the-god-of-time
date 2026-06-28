"use client";

import React from "react";
import Link from "next/link";
import { Realm } from "@/lib/data/realmsRegistry";
import { RealmBreadcrumb } from "./RealmBreadcrumb";
import { RealmHeader } from "./RealmHeader";
import { RealmSEOContent } from "./RealmSEOContent";

interface RealmLayoutProps {
  realm: Realm;
  controlsSection: React.ReactNode;
  canvasSection: React.ReactNode;
}

export function RealmLayout({
  realm,
  controlsSection,
  canvasSection,
}: RealmLayoutProps) {
  return (
    <div className="realm-page">
      <div className="realm-two-col-zone">
        <main className="realm-main-col">
          <RealmBreadcrumb realm={realm} />
          <RealmHeader realm={realm} />

          <div className="realm-controls-card">{controlsSection}</div>

          <div className="realm-section-divider">
            <div className="divider-line" />
            <span className="divider-symbol">✦</span>
            <div className="divider-line" />
          </div>

          <div className="realm-canvas-card">{canvasSection}</div>

          {/* Inline Section Divider before SEO */}
          <div className="realm-section-divider">
            <div className="divider-line" />
            <span className="divider-symbol">✦</span>
            <div className="divider-line" />
          </div>

          {/* SEO Content Zone - Blends into main column */}
          <div className="realm-seo-inline-container pb-16">
            <RealmSEOContent realm={realm} />
          </div>
        </main>

        <aside
          className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-[80px] space-y-6 self-start"
        >
          {/* 1. SIDEBAR AD SLOT 1 */}
          <div className="sidebar-ad-slot">
            <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
              ADVERTISEMENT
            </span>
            <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border border-border rounded-md flex items-center justify-center text-text-faint text-xs font-mono">
              [Ad Container - 300×250]
            </div>
          </div>

          {/* 2. SIDEBAR RELATED PRODUCTS */}
          <div className="sidebar-related bg-bg-card/30 border border-border/50 rounded-xl p-5">
            <span className="sidebar-section-label text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block mb-4">
              MORE IN THIS REALM
            </span>
            <div className="flex flex-col">
              <Link
                href="/realms"
                className="sidebar-tool-link flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 group transition-all"
              >
                <span
                  className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0 transition-colors"
                  style={{ backgroundColor: realm.accent }}
                />
                <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors truncate">
                  Browse All Realms
                </span>
              </Link>

              <Link
                href="/tools"
                className="sidebar-tool-link flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 group transition-all"
              >
                <span
                  className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0 transition-colors"
                  style={{ backgroundColor: realm.accent }}
                />
                <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors truncate">
                  Utility Tools
                </span>
              </Link>

              <Link
                href="/tools/days-between-dates"
                className="sidebar-tool-link flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 group transition-all"
              >
                <span
                  className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0 transition-colors"
                  style={{ backgroundColor: realm.accent }}
                />
                <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors truncate">
                  Days Between Dates
                </span>
              </Link>
            </div>
          </div>

          {/* 3. SIDEBAR AD SLOT 2 */}
          <div className="sidebar-ad-slot">
            <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
              ADVERTISEMENT
            </span>
            <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border border-border rounded-md flex items-center justify-center text-text-faint text-xs font-mono">
              [Ad Container - 300×250]
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
