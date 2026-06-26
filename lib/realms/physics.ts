// ─── Vector Math ──────────────────────────────────────────────────────────────

export type Vec2 = { x: number; y: number };

export function vec2Add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

export function vec2Sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

export function vec2Scale(v: Vec2, s: number): Vec2 {
  return { x: v.x * s, y: v.y * s };
}

export function vec2Mag(v: Vec2): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}

export function vec2Norm(v: Vec2): Vec2 {
  const mag = vec2Mag(v);
  if (mag === 0) return { x: 0, y: 0 };
  return { x: v.x / mag, y: v.y / mag };
}

export function vec2Dot(a: Vec2, b: Vec2): number {
  return a.x * b.x + a.y * b.y;
}

export function vec2Dist(a: Vec2, b: Vec2): number {
  return vec2Mag(vec2Sub(b, a));
}

// ─── Color Utilities ──────────────────────────────────────────────────────────

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function rgbaString(r: number, g: number, b: number, a: number): string {
  return `rgba(${r},${g},${b},${a})`;
}

/** Read a CSS variable value at runtime (client-side only). */
export function getCSSVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// ─── Easing ───────────────────────────────────────────────────────────────────

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

// ─── Math Helpers ─────────────────────────────────────────────────────────────

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + (outMax - outMin) * ((value - inMin) / (inMax - inMin));
}

// ─── Physics ──────────────────────────────────────────────────────────────────

/**
 * Gravitational force magnitude between two bodies.
 * Uses a small softening epsilon to prevent singularities.
 */
export function gravitationalForce(
  mass1: number,
  mass2: number,
  distance: number,
  G: number = 6.674e-11,
  softening: number = 1
): number {
  const d = Math.max(distance, softening);
  return (G * mass1 * mass2) / (d * d);
}

// ─── Accessibility ────────────────────────────────────────────────────────────

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ─── Number Formatting ────────────────────────────────────────────────────────

export function formatLargeNumber(n: number): string {
  if (n >= 1e100) {
    const exp = Math.floor(Math.log10(n));
    const base = (n / Math.pow(10, exp)).toFixed(1);
    return `${base} × 10^${exp}`;
  }
  if (n >= 1e15) return `${(n / 1e15).toFixed(2)} quadrillion`;
  if (n >= 1e12) return `${(n / 1e12).toFixed(2)} trillion`;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`;
  return n.toLocaleString();
}

export function formatYearsAgo(years: number): string {
  if (years >= 1e9) return `${(years / 1e9).toFixed(1)} Gyr`;
  if (years >= 1e6) return `${(years / 1e6).toFixed(0)} Myr`;
  if (years >= 1e3) return `${(years / 1e3).toFixed(0)} Kyr`;
  return `${years} yr`;
}
