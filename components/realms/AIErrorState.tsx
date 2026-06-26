"use client";

import React from "react";

interface AIErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function AIErrorState({ message, onRetry }: AIErrorStateProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 32,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Centered star symbol */}
      <span
        style={{
          fontSize: 32,
          color: "var(--accent-scifi)",
          userSelect: "none",
        }}
      >
        ✦
      </span>

      {/* Main error header text */}
      <h3
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          fontSize: 22,
          fontWeight: 300,
          fontStyle: "italic",
          color: "var(--text-primary)",
          margin: "16px 0 8px 0",
        }}
      >
        {message}
      </h3>

      {/* Technical subtext */}
      <p
        style={{
          fontFamily: "var(--font-ui), sans-serif",
          fontSize: 14,
          color: "var(--text-muted)",
          margin: "0 0 24px 0",
          maxWidth: 380,
          lineHeight: 1.5,
        }}
      >
        The timeline remains fragmented. Re-attempting connection may align the temporal vectors.
      </p>

      {/* Retry Action button */}
      <button
        onClick={onRetry}
        style={{
          padding: "10px 24px",
          borderRadius: 8,
          border: "1px solid var(--accent-scifi)",
          background: "transparent",
          color: "var(--accent-scifi)",
          fontFamily: "var(--font-ui), sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 200ms",
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          target.style.background = "color-mix(in srgb, var(--accent-scifi) 10%, transparent)";
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.background = "transparent";
        }}
      >
        Try Again
      </button>
    </div>
  );
}
