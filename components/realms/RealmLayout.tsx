"use client";

import React from "react";
import { Realm } from "@/lib/data/realmsRegistry";
import { RealmSEOSection } from "./RealmSEOSection";
import { RelatedRealmsGrid } from "./RelatedRealmsGrid";
import { RealmAdBanner } from "./RealmAdBanner";
import { RealmProvider } from "@/lib/context/RealmContext";

interface RealmLayoutProps {
  realm: Realm;
  children: React.ReactNode;
  hasInputZone?: boolean;
  inputZone?: React.ReactNode;
  resultsZone?: React.ReactNode;
}

const CATEGORY_ACCENTS: Record<string, string> = {
  cosmos: "var(--accent-cosmos)",
  physics: "var(--accent-cosmos)",
  biology: "var(--accent-bio)",
  scifi: "var(--accent-scifi)",
  whimsical: "var(--accent-whim)",
  destiny: "var(--accent-destiny)",
};

function RealmShell({
  realm,
  children,
  hasInputZone = false,
  inputZone,
  resultsZone,
}: RealmLayoutProps) {
  const accentColor = CATEGORY_ACCENTS[realm.category] ?? "var(--accent-cosmos)";

  return (
    <div className="realm-page-wrapper">
      {/* LEFT COLUMN: MAIN CONTENT STACK */}
      <main className="realm-main-content">
        {/* REALM HEADER */}
        <div className="realm-page-header">
          <span className="realm-page-eyebrow" style={{ color: accentColor }}>
            ✦ {realm.category.toUpperCase()}
          </span>
          <h1 className="realm-page-title">{realm.name}</h1>
          <p className="realm-page-description">{realm.description}</p>
        </div>

        {/* INPUT ZONE — only if realm needs it */}
        {hasInputZone && inputZone && (
          <div className="realm-input-zone">{inputZone}</div>
        )}

        {/* AD SLOT 1 — before canvas */}
        <RealmAdBanner position="top" />

        {/* MAIN CANVAS / EXPERIENCE */}
        <div className="realm-canvas-zone">{children}</div>

        {/* RESULTS ZONE — only if realm has results */}
        {resultsZone && (
          <div className="realm-results-zone">
            <div className="realm-results-inner">{resultsZone}</div>
          </div>
        )}

        {/* AD SLOT 2 — after canvas/results */}
        <RealmAdBanner position="middle" />

        {/* SEO CONTENT */}
        <RealmSEOSection realm={realm} />

        {/* AD SLOT 3 — bottom of left content */}
        <RealmAdBanner position="bottom" />
      </main>

      {/* RIGHT COLUMN: STICKY SIDEBAR */}
      <aside className="realm-sidebar">
        <div className="realm-sidebar-sticky-container">
          {/* SIDEBAR AD SLOT A */}
          <RealmAdBanner position="sidebar-top" />

          {/* RELATED REALMS */}
          <RelatedRealmsGrid currentSlug={realm.slug} category={realm.category} />

          {/* SIDEBAR AD SLOT B */}
          <RealmAdBanner position="sidebar-bottom" />
        </div>
      </aside>
    </div>
  );
}

export function RealmLayout(props: RealmLayoutProps) {
  return (
    <RealmProvider { ...{ realm: props.realm } as any }>
      <RealmShell {...props} />
    </RealmProvider>
  );
}

export default RealmLayout;
