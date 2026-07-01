"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Realm, realmsRegistry } from "@/lib/data/realmsRegistry";
import { TOOL_REALM_CROSSLINKS } from "@/lib/data/crossLinks";
import { toolsRegistry } from "@/lib/data/toolsRegistry";

interface RealmFooterStripProps {
  realm: Realm;
  navVisible: boolean;
  isMobile: boolean;
}

export default function RealmFooterStrip({ realm, navVisible, isMobile }: RealmFooterStripProps) {
  const [copyLabel, setCopyLabel] = useState("Share this realm");
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find next realm (circular)
  const currentIndex = realmsRegistry.findIndex((r) => r.slug === realm.slug);
  const nextIndex = (currentIndex + 1) % realmsRegistry.length;
  const nextRealm = realmsRegistry[nextIndex];

  // Find tool cross-link: find tool slug whose value matches this realm slug
  const toolSlug = Object.entries(TOOL_REALM_CROSSLINKS).find(
    ([, v]) => v === realm.slug
  )?.[0];
  const allTools = toolsRegistry.flatMap((g) => g.tools);
  const linkedTool = toolSlug ? allTools.find((t) => t.slug === toolSlug) : null;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopyLabel("Link copied ✓");
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopyLabel("Share this realm"), 1500);
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 48,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 16px" : "0 24px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid color-mix(in srgb, var(--border) 40%, transparent)",
        background: "color-mix(in srgb, var(--bg-base) 80%, transparent)",
        opacity: navVisible || isMobile ? 1 : 0,
        transform: navVisible || isMobile ? "translateY(0)" : "translateY(100%)",
        transition: "opacity 400ms ease, transform 400ms ease",
        pointerEvents: navVisible || isMobile ? "all" : "none",
        gap: 12,
      }}
    >
      {/* Left — Description (hidden on mobile) + tool cross-link */}
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: 12,
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "40%",
            }}
          >
            {realm.description}
          </span>
          {linkedTool && (
            <a
              href={`/tools/${linkedTool.slug}`}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: 12,
                color: "var(--text-muted)",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "color 150ms",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
            >
              → Need precise numbers? Try the{" "}
              <span style={{ textDecoration: "underline" }}>{linkedTool.name}</span>
            </a>
          )}
        </div>
      )}
      {isMobile && <div style={{ flex: 1 }} />}

      {/* Center — Share */}
      <button
        onClick={handleShare}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text-muted)",
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: 0,
          padding: "4px 14px",
          height: 28,
          cursor: "pointer",
          transition: "all 150ms",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget;
          btn.style.color = "var(--text-primary)";
          btn.style.borderColor = "var(--text-muted)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget;
          btn.style.color = "var(--text-muted)";
          btn.style.borderColor = "var(--border)";
        }}
      >
        {copyLabel}
      </button>

      {/* Right — Next realm */}
      <a
        href={`/realms/${nextRealm.slug}`}
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          color: "var(--text-muted)",
          textDecoration: "none",
          transition: "color 150ms",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}
      >
        Next: {nextRealm.name} →
      </a>
    </div>
  );
}
