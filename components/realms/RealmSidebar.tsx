"use client";

import React from "react";
import Link from "next/link";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

interface RealmSidebarProps {
  currentSlug: string;
  category: string;
}

function SidebarAdSlot() {
  return (
    <div className="realm-sidebar-ad">
      <span className="realm-sidebar-ad-label">Advertisement</span>
      <div className="realm-sidebar-ad-container">[300 × 250]</div>
    </div>
  );
}

export function RealmSidebar({ currentSlug }: RealmSidebarProps) {
  const suggestions = realmsRegistry
    .filter((r) => r.slug !== currentSlug)
    .slice(0, 4);

  return (
    <aside className="realm-right-sidebar">
      <div className="realm-sidebar-inner">
        <SidebarAdSlot />
        <SidebarAdSlot />

        <div className="realm-sidebar-suggestions">
          <span className="realm-sidebar-suggestions-title">More Realms</span>

          {suggestions.length > 0 ? (
            suggestions.map((realm) => (
              <Link
                key={realm.slug}
                href={`/realms/${realm.slug}`}
                className="realm-sidebar-suggestion-card"
              >
                <span
                  className="realm-sidebar-suggestion-cat"
                  style={{ color: realm.accent }}
                >
                  {realm.category}
                </span>
                <span className="realm-sidebar-suggestion-name">
                  {realm.name}
                </span>
                <span className="realm-sidebar-suggestion-desc">
                  {realm.description.length > 72
                    ? realm.description.slice(0, 72) + "…"
                    : realm.description}
                </span>
              </Link>
            ))
          ) : (
            <div className="realm-sidebar-coming-soon">
              <span className="realm-sidebar-coming-soon-mark">✦</span>
              <p className="realm-sidebar-coming-soon-text">
                More realms arriving soon.
                <br />
                The God of Time is watching.
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default RealmSidebar;
