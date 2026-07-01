"use client";

import React, { useState, useMemo } from "react";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import RealmCard from "./RealmCard";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "cosmos", label: "Space & Cosmos" },
  { id: "physics", label: "Physics" },
  { id: "scifi", label: "Sci-Fi & Paradox" },
  { id: "whimsical", label: "Whimsical" },
  { id: "biology", label: "Biology & History" },
  { id: "destiny", label: "Destiny" },
];

export default function RealmsGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  // Sort: non-AI first, then AI
  const sortedRealms = useMemo(() => {
    const filtered =
      activeCategory === "all"
        ? realmsRegistry
        : realmsRegistry.filter((r) => r.category === activeCategory);
    return [
      ...filtered.filter((r) => !r.needsAI),
      ...filtered.filter((r) => r.needsAI),
    ];
  }, [activeCategory]);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        padding: "80px 24px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Category filter tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 40,
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 16px",
                  border: "var(--border-width) solid var(--border)",
                  cursor: "pointer",
                  transition: "transform 120ms ease, box-shadow 120ms ease",
                  background: isActive ? "var(--text-primary)" : "var(--bg-card)",
                  color: isActive ? "var(--bg-base)" : "var(--text-muted)",
                  boxShadow: isActive
                    ? "var(--shadow-offset-sm) var(--shadow-color)"
                    : "none",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid — individual cards with gaps */}
        <div
          className="realms-grid-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 24,
          }}
        >
          {sortedRealms.map((realm) => (
            <RealmCard key={realm.slug} realm={realm} wide={false} />
          ))}
        </div>

        {sortedRealms.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "var(--text-faint)",
              fontFamily: "var(--font-ui)",
              fontSize: 15,
            }}
          >
            No realms found in this category.
          </div>
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .realms-grid-inner {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
