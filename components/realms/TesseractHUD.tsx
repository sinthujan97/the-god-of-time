"use client";

interface TesseractHUDProps {
  eventCount: number;
  cameraOffset: { x: number; y: number };
}

export default function TesseractHUD({ eventCount, cameraOffset }: TesseractHUDProps) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}>
      {/* Top-left: 5D coordinates */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(91,127,255,0.7)",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          lineHeight: 1.8,
        }}
      >
        <div>ψ: {cameraOffset.x.toFixed(0)}</div>
        <div>φ: {cameraOffset.y.toFixed(0)}</div>
        <div>θ: AUTO</div>
      </div>

      {/* Top-right: dimension label + node count */}
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          color: "rgba(91,127,255,0.5)",
          textAlign: "right",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          lineHeight: 1.8,
        }}
      >
        <div>5TH DIMENSION</div>
        <div style={{ color: "rgba(91,127,255,0.35)" }}>{eventCount} node{eventCount !== 1 ? "s" : ""}</div>
      </div>

      {/* Bottom centre: drag hint */}
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-ui)",
          fontSize: 9,
          color: "rgba(91,127,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          whiteSpace: "nowrap",
        }}
      >
        ↖ drag to navigate ↗
      </div>
    </div>
  );
}
