"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { clocksRegistry, type ClockEntry } from "@/lib/data/clocksRegistry";
import FullscreenWrapper from "./FullscreenWrapper";

interface ClockLayoutProps {
  clock: ClockEntry;
  children: ReactNode;
  controlsSection?: ReactNode;
  customSidebar?: ReactNode;
}

export default function ClockLayout({ clock, children, controlsSection, customSidebar }: ClockLayoutProps) {
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const related = clocksRegistry
    .filter((c) => c.category === clock.category && c.id !== clock.id)
    .slice(0, 3);

  return (
    <div className="realm-page">
      <div className="realm-two-col-zone">
        <main className="realm-main-col">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="breadcrumb">
            <Link href="/" className="breadcrumb-link">The God of Time</Link>
            <span className="breadcrumb-sep">›</span>
            <Link href="/clocks" className="breadcrumb-link">Clocks</Link>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-current">{clock.name}</span>
          </nav>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "The God of Time", item: "https://thegodoftime.com" },
                  { "@type": "ListItem", position: 2, name: "Clocks", item: "https://thegodoftime.com/clocks" },
                  { "@type": "ListItem", position: 3, name: clock.name, item: `https://thegodoftime.com/clocks/${clock.slug}` },
                ],
              }),
            }}
          />

          {/* Header */}
          <div className="tool-header-block" style={{ marginBottom: 32 }}>
            <div className="tool-header-accent-bar" style={{ background: "var(--section-clocks-accent)" }} />
            <span className="tool-header-eyebrow" style={{ color: "var(--section-clocks-accent)" }}>
              CLOCKS
            </span>
            <h1 className="tool-header-h1">{clock.name}</h1>
            <p className="tool-header-description">{clock.description}</p>
          </div>

          {/* Controls / Settings */}
          {controlsSection && (
            <div className="realm-controls-card" style={{ marginBottom: 24 }}>
              {controlsSection}
            </div>
          )}

          {/* Clock card with fullscreen */}
          <div className="realm-canvas-card" style={{ position: "relative", padding: 0, overflow: "hidden" }}>
            <FullscreenWrapper clockName={clock.name}>
              {children}
            </FullscreenWrapper>
          </div>

          {/* Divider */}
          <div className="realm-section-divider">
            <div className="divider-line" />
            <span className="divider-symbol">✦</span>
            <div className="divider-line" />
          </div>

          {/* Keyboard hint */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-muted)",
              textAlign: "center",
              opacity: hintVisible ? 0.6 : 0,
              transition: "opacity 1s ease",
              marginBottom: 48,
              letterSpacing: "0.05em",
            }}
          >
            Press <strong>F</strong> for fullscreen
          </p>
        </main>

        <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-[80px] space-y-6 self-start">
          {customSidebar ? (
            customSidebar
          ) : (
            <>
              {/* Ad slot 1 */}
              <div className="sidebar-ad-slot">
                <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
                  ADVERTISEMENT
                </span>
                <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border border-border rounded-md flex items-center justify-center text-text-faint text-xs font-mono">
                  [Ad Container - 300×250]
                </div>
              </div>

              {/* Related clocks */}
              <div className="sidebar-related bg-bg-card/30 border border-border/50 rounded-xl p-5">
                <span className="sidebar-section-label text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block mb-4">
                  MORE CLOCKS
                </span>
                <div className="flex flex-col">
                  {related.length > 0 ? related.map((c) => (
                    <Link
                      key={c.id}
                      href={c.isExistingTool ? `/tools/${c.existingToolSlug}` : `/clocks/${c.slug}`}
                      className="sidebar-tool-link flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 group transition-all"
                    >
                      <span
                        className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: "var(--section-clocks-accent)" }}
                      />
                      <span className="text-base">{c.icon}</span>
                      <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors truncate">
                        {c.name}
                      </span>
                    </Link>
                  )) : (
                    <Link
                      href="/clocks"
                      className="sidebar-tool-link flex items-center gap-3 py-3 group transition-all"
                    >
                      <span
                        className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: "var(--section-clocks-accent)" }}
                      />
                      <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors">
                        Browse All Clocks
                      </span>
                    </Link>
                  )}
                  <Link
                    href="/clocks"
                    className="sidebar-tool-link flex items-center gap-3 py-3 border-t border-border-subtle group transition-all mt-1"
                  >
                    <span
                      className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: "var(--section-clocks-accent)" }}
                    />
                    <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors">
                      All Clocks & Timers →
                    </span>
                  </Link>
                </div>
              </div>

              {/* Ad slot 2 */}
              <div className="sidebar-ad-slot">
                <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
                  ADVERTISEMENT
                </span>
                <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border border-border rounded-md flex items-center justify-center text-text-faint text-xs font-mono">
                  [Ad Container - 300×250]
                </div>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
