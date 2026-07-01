import React from "react";
import Link from "next/link";
import { Tool } from "@/lib/data/toolsRegistry";

interface SidebarRailProps {
  relatedTools: Tool[];
  groupAccent: string;
  realmSlug?: string;
  realmName?: string;
}

export default function SidebarRail({
  relatedTools,
  groupAccent,
  realmSlug,
  realmName,
}: SidebarRailProps) {
  return (
    <aside className="w-full lg:w-[320px] flex-shrink-0 lg:sticky lg:top-[80px] space-y-6 self-start">
      
      {/* 1. SIDEBAR AD SLOT 1 */}
      <div className="sidebar-ad-slot">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          ADVERTISEMENT
        </span>
        <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border-[length:var(--border-width)] border-border flex items-center justify-center text-text-faint text-xs font-mono">
          [Ad Container - 300×250]
        </div>
      </div>

      {/* 2. SIDEBAR RELATED TOOLS */}
      <div className="sidebar-related bg-bg-card border-[length:var(--border-width)] border-border p-5" style={{ boxShadow: "var(--shadow-offset-sm) var(--shadow-color)" }}>
        <span className="sidebar-section-label text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block mb-4">
          MORE IN THIS GROUP
        </span>
        <div className="flex flex-col">
          {relatedTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="sidebar-tool-link flex items-center gap-3 py-3 border-b border-border-subtle last:border-b-0 group transition-all"
              style={{ "--group-accent": groupAccent } as React.CSSProperties}
            >
              <span 
                className="sidebar-tool-accent-bar w-[2px] h-4 rounded-sm flex-shrink-0 transition-colors"
                style={{ backgroundColor: groupAccent }}
              />
              <span className="sidebar-tool-name font-sans text-sm text-text-muted group-hover:text-text-primary transition-colors truncate">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. SIDEBAR AD SLOT 2 */}
      <div className="sidebar-ad-slot">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          ADVERTISEMENT
        </span>
        <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border-[length:var(--border-width)] border-border flex items-center justify-center text-text-faint text-xs font-mono">
          [Ad Container - 300×250]
        </div>
      </div>

      {/* 4. REALM CROSS-LINK (conditional) */}
      {realmSlug && realmName && (
        <div className="sidebar-realm-link">
          <Link
            href={`/realms/${realmSlug}`}
            className="block p-4 bg-bg-card border-[length:var(--border-width)] border-border hover:border-accent-cosmos transition-all"
            style={{ boxShadow: "var(--shadow-offset-sm) var(--shadow-color)" }}
          >
            <span className="realm-link-eyebrow text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-accent-cosmos block mb-1">
              ✦ EXPLORE THE REALM
            </span>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="realm-link-name font-display text-base italic text-text-primary block truncate">
                {realmName}
              </span>
              <span className="realm-link-arrow text-accent-cosmos text-sm">→</span>
            </div>
          </Link>
        </div>
      )}

    </aside>
  );
}
