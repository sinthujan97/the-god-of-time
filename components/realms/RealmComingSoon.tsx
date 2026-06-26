"use client";

import React from "react";
import Link from "next/link";

interface RealmComingSoonProps {
  name?: string;
}

export default function RealmComingSoon({ name }: RealmComingSoonProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 32,
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 56,
          color: "var(--text-faint)",
        }}
      >
        ✦
      </span>
      {name && (
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 32,
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--text-primary)",
          }}
        >
          {name}
        </h2>
      )}
      <p
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 15,
          color: "var(--text-muted)",
          maxWidth: 400,
          lineHeight: 1.6,
        }}
      >
        This realm is coming soon.
      </p>
      <Link
        href="/realms"
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: 13,
          color: "var(--accent-cosmos)",
          textDecoration: "underline",
          marginTop: 8,
        }}
      >
        ← Back to all realms
      </Link>
    </div>
  );
}
