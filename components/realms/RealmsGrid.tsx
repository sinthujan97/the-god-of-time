"use client";

import React from "react";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import RealmCard from "./RealmCard";

export default function RealmsGrid() {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        padding: "80px 24px 120px",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        {/* Grid centered with a single card */}
        <div
          className="realms-grid-inner"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            maxWidth: "500px",
            margin: "0 auto",
            gap: 24,
          }}
        >
          {realmsRegistry.map((realm) => (
            <RealmCard key={realm.slug} realm={realm} wide={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
