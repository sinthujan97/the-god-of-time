"use client";

import React from "react";
import Link from "next/link";
import { Realm } from "@/lib/data/realmsRegistry";

interface RealmCardProps {
  realm: Realm;
  wide?: boolean;
}

export default function RealmCard({ realm, wide = false }: RealmCardProps) {
  // Category label map
  const categoryLabels: Record<string, string> = {
    cosmos: "Space & Cosmos",
    biology: "Biology & History",
    scifi: "Sci-Fi & Paradox",
    whimsical: "Whimsical",
    destiny: "Personal Destiny",
    physics: "Physics",
  };

  const categoryLabel = categoryLabels[realm.category] ?? realm.category;

  return (
    <Link
      href={`/realms/${realm.slug}`}
      className="group"
      style={{
        display: "block",
        position: "relative",
        borderRadius: 12,
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
        overflow: "hidden",
        cursor: "pointer",
        height: wide ? 400 : 320,
        gridColumn: wide ? "span 2" : "span 1",
        transition: "transform 300ms, border-color 300ms",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1.01)";
        el.style.borderColor = realm.accent;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "scale(1)";
        el.style.borderColor = "var(--border)";
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at top, color-mix(in srgb, ${realm.accent} 8%, transparent), transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Color overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          background:
            "linear-gradient(to top, var(--bg-base) 40%, color-mix(in srgb, var(--bg-base) 50%, transparent) 70%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* AI Tag */}
      {realm.needsAI && (
        <span
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 20,
            padding: "2px 10px",
            borderRadius: 100,
            fontFamily: "var(--font-ui)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "color-mix(in srgb, var(--accent-scifi) 10%, transparent)",
            border: "1px solid color-mix(in srgb, var(--accent-scifi) 30%, transparent)",
            color: "var(--accent-scifi)",
          }}
        >
          ✦ AI Powered
        </span>
      )}

      {/* Enter hover badge */}
      <span
        className="realm-enter-badge"
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 20,
          padding: "6px 14px",
          borderRadius: 100,
          fontFamily: "var(--font-ui)",
          fontSize: 12,
          fontWeight: 500,
          color: "var(--text-primary)",
          background: "color-mix(in srgb, var(--bg-card) 80%, transparent)",
          border: "1px solid color-mix(in srgb, var(--border) 60%, transparent)",
          backdropFilter: "blur(8px)",
          opacity: 0,
          transform: "translateX(8px)",
          transition: "opacity 300ms, transform 300ms",
        }}
      >
        Enter →
      </span>

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: 28,
          textAlign: "left",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: 100,
            fontFamily: "var(--font-ui)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: realm.accent,
            background: `color-mix(in srgb, ${realm.accent} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${realm.accent} 30%, transparent)`,
            marginBottom: 12,
          }}
        >
          {categoryLabel}
        </span>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: wide ? 32 : 26,
            fontWeight: 300,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            margin: "0 0 8px",
          }}
        >
          {realm.name}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: 13,
            color: "var(--text-muted)",
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 400,
          }}
        >
          {realm.description}
        </p>
      </div>

      <style>{`
        .group:hover .realm-enter-badge {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }
      `}</style>
    </Link>
  );
}
