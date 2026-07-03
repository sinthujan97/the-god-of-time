"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { callRealmAI } from "@/lib/realms/aiClient";

// ── Types ──────────────────────────────────────────────────────────────────

type Phase = "loading" | "tree" | "error";
type NodeStatus = "pending" | "selected" | "rejected" | "generating";

type TreeNode = {
  id: string;
  parentId: string | null;
  text: string;
  detail: string;
  depth: number;
  siblingIndex: number;
  status: NodeStatus;
};

// ── Constants ──────────────────────────────────────────────────────────────

const ACCENT        = "#FF8C42";
const MAX_DEPTH     = 4;
const LEVEL_H       = 200;
const NODE_W_ROOT   = 280;
const NODE_W_BRANCH = 185;
const NODE_H        = 80;
const STAR_COUNT    = 120;

// ── Bezier helpers ─────────────────────────────────────────────────────────

function bezierLength(
  x1: number, y1: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x2: number, y2: number,
  steps = 24
): number {
  let len = 0, px = x1, py = y1;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps, mt = 1 - t;
    const nx = mt*mt*mt*x1 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x2;
    const ny = mt*mt*mt*y1 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y2;
    len += Math.hypot(nx - px, ny - py);
    px = nx; py = ny;
  }
  return len;
}

function bezierPoint(
  t: number,
  x1: number, y1: number,
  cx1: number, cy1: number,
  cx2: number, cy2: number,
  x2: number, y2: number
) {
  const mt = 1 - t;
  return {
    x: mt*mt*mt*x1 + 3*mt*mt*t*cx1 + 3*mt*t*t*cx2 + t*t*t*x2,
    y: mt*mt*mt*y1 + 3*mt*mt*t*cy1 + 3*mt*t*t*cy2 + t*t*t*y2,
  };
}

// ── Star generation (LCG, deterministic) ──────────────────────────────────

function makeStars() {
  let seed = 17;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  return Array.from({ length: STAR_COUNT }, () => ({
    x:     lcg() * 2000,
    y:     lcg() * 1600,
    r:     0.3 + lcg() * 1.1,
    o:     0.15 + lcg() * 0.5,
    phase: lcg() * Math.PI * 2,
  }));
}

// ── Path context helper ────────────────────────────────────────────────────

function buildPathContext(node: TreeNode, allNodes: Record<string, TreeNode>): string {
  const chain: string[] = [];
  let current: TreeNode | undefined = node;
  while (current) {
    chain.unshift(current.text);
    current = current.parentId ? allNodes[current.parentId] : undefined;
  }
  return chain.join(" → ");
}

// ── Main component ─────────────────────────────────────────────────────────

export default function ButterflyEffect() {
  const realm = realmsRegistry.find((r) => r.slug === "butterfly-effect")!;

  // State
  const [phase, setPhase]               = useState<Phase>("loading");
  const [nodes, setNodes]               = useState<Record<string, TreeNode>>({});

  const [rootEvent, setRootEvent]       = useState<{ event: string; context: string } | null>(null);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [cameraY, setCameraY]           = useState(0);
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiError, setAiError]           = useState<string | null>(null);
  const [containerW, setContainerW]     = useState(620);

  // Refs
  const canvasRef     = useRef<HTMLCanvasElement | null>(null);
  const containerRef  = useRef<HTMLDivElement | null>(null);
  const starsRef      = useRef(makeStars());
  const animRef       = useRef(0);
  const nodesRef      = useRef<Record<string, TreeNode>>({});
  const cameraYRef    = useRef(0);
  const containerWRef = useRef(620);
  const aiLoadingRef  = useRef(false);
  const lineAnimsRef  = useRef(new Map<string, { startTime: number; length: number }>());
  const particlesRef  = useRef(new Map<string, { t: number; speed: number }[]>());
  const shownNodesRef = useRef(new Set<string>());

  // Keep refs in sync with state
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);
  useEffect(() => { cameraYRef.current = cameraY; }, [cameraY]);
  useEffect(() => { containerWRef.current = containerW; }, [containerW]);

  // Mark nodes as "shown" after each render (for one-time entrance animation)
  useEffect(() => {
    Object.keys(nodes).forEach((id) => shownNodesRef.current.add(id));
  }, [nodes]);

  // ── Node position helper ──

  const getNodePos = useCallback(
    (depth: number, siblingIndex: number) => {
      const spread = Math.min(containerW / 3.2, 210);
      const cx = containerW / 2;
      return {
        x: depth === 0 ? cx : cx + (siblingIndex - 1) * spread,
        y: depth * LEVEL_H + 80,
      };
    },
    [containerW]
  );

  // ── AI: initial generation ──

  const generateInitial = useCallback(async () => {
    if (aiLoadingRef.current) return;
    aiLoadingRef.current = true;
    setPhase("loading");
    setAiError(null);
    setNodes({});
    setSelectedPath([]);
    setCameraY(0);
    setAiLoading(false);
    lineAnimsRef.current.clear();
    particlesRef.current.clear();

    const { content, error } = await callRealmAI({
      systemPrompt:
        'You generate alternate history scenarios. Respond with ONLY valid JSON, no markdown fences. Format exactly: { "event": string, "context": string, "branches": [{ "text": string, "detail": string }, { "text": string, "detail": string }, { "text": string, "detail": string }] }. Keep event ≤80 chars, context ≤200 chars, each branch text ≤70 chars, each branch detail ≤130 chars.',
      userPrompt:
        "Generate one pivotal historical event with 3 distinct alternate timeline branches. Be specific and imaginative — avoid clichés like the Library of Alexandria.",
      maxTokens: 650,
    });

    aiLoadingRef.current = false;

    if (error) {
      setAiError(error);
      setPhase("error");
      return;
    }

    try {
      const cleaned = content.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
      const data = JSON.parse(cleaned) as {
        event: string;
        context: string;
        branches: { text: string; detail: string }[];
      };

      const rid = crypto.randomUUID();
      const initialNodes: Record<string, TreeNode> = {
        [rid]: {
          id: rid, parentId: null, text: data.event, detail: data.context,
          depth: 0, siblingIndex: 0, status: "pending",
        },
      };

      data.branches.slice(0, 3).forEach((b, i) => {
        const id = crypto.randomUUID();
        initialNodes[id] = {
          id, parentId: rid,
          text: b.text || "Alternate branch", detail: b.detail || "",
          depth: 1, siblingIndex: i, status: "pending",
        };
      });

      setRootEvent({ event: data.event, context: data.context });
      setNodes(initialNodes);
      setPhase("tree");
    } catch {
      setAiError("Could not parse the timeline. Please try again.");
      setPhase("error");
    }
  }, []);

  // ── AI: expand a selected branch ──

  const expandBranch = useCallback(async (parentNode: TreeNode, pathContext: string) => {
    setAiLoading(true);
    aiLoadingRef.current = true;

    const placeholders: Record<string, TreeNode> = {};
    for (let i = 0; i < 3; i++) {
      const id = crypto.randomUUID();
      placeholders[id] = {
        id, parentId: parentNode.id, text: "…", detail: "",
        depth: parentNode.depth + 1, siblingIndex: i, status: "generating",
      };
    }
    setNodes((prev) => ({ ...prev, ...placeholders }));

    const { content, error } = await callRealmAI({
      systemPrompt:
        'You are an alternate history oracle. Respond with ONLY a valid JSON array of exactly 3 objects, no markdown. Format: [{ "text": string, "detail": string }, ...]. Keep each text ≤70 chars, each detail ≤130 chars.',
      userPrompt: `Alternate history path so far: "${pathContext}". Generate 3 distinct ways this timeline diverges next. Be creative and specific — avoid repeating previous branches.`,
      maxTokens: 450,
    });

    setAiLoading(false);
    aiLoadingRef.current = false;

    if (error) {
      setNodes((prev) => {
        const updated = { ...prev };
        Object.values(updated)
          .filter((n) => n.parentId === parentNode.id && n.status === "generating")
          .forEach((n) => { updated[n.id] = { ...n, text: "Error loading branch", status: "pending" }; });
        return updated;
      });
      return;
    }

    try {
      const cleaned = content.trim().replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
      const branches = JSON.parse(cleaned) as { text: string; detail: string }[];
      setNodes((prev) => {
        const updated = { ...prev };
        const generatingChildren = Object.values(updated)
          .filter((n) => n.parentId === parentNode.id && n.status === "generating")
          .sort((a, b) => a.siblingIndex - b.siblingIndex);
        generatingChildren.forEach((child, i) => {
          updated[child.id] = {
            ...child,
            text: branches[i]?.text || "Alternate branch",
            detail: branches[i]?.detail || "",
            status: "pending",
          };
        });
        return updated;
      });
    } catch {
      setNodes((prev) => {
        const updated = { ...prev };
        Object.values(updated)
          .filter((n) => n.parentId === parentNode.id && n.status === "generating")
          .forEach((n) => { updated[n.id] = { ...n, text: "Parse error — try resetting", status: "pending" }; });
        return updated;
      });
    }
  }, []);

  // ── Handle node selection ──

  const handleSelect = useCallback(
    async (node: TreeNode) => {
      if (node.status !== "pending" || node.depth === 0 || aiLoadingRef.current) return;

      setNodes((prev) => {
        const updated = { ...prev };
        Object.values(updated)
          .filter((n) => n.depth === node.depth && n.parentId === node.parentId)
          .forEach((n) => {
            updated[n.id] = { ...n, status: n.id === node.id ? "selected" : "rejected" };
          });
        return updated;
      });

      setSelectedPath((prev) => [...prev, node.id]);

      if (node.depth >= MAX_DEPTH) return;

      const newDepth = node.depth + 1;
      const targetY  = newDepth <= 2 ? 0 : -((newDepth - 2) * LEVEL_H);
      setCameraY(targetY);

      const pathContext = buildPathContext(node, nodesRef.current);
      await expandBranch(node, pathContext);
    },
    [expandBranch]
  );

  // ── Mount: generate initial event ──

  useEffect(() => {
    generateInitial();
  }, [generateInitial]);

  // ── Canvas rAF draw loop ──

  useEffect(() => {
    if (phase !== "tree") {
      cancelAnimationFrame(animRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const now    = Date.now();
      const w      = canvas.width;
      const h      = canvas.height;
      const cam    = cameraYRef.current;
      const cw     = containerWRef.current;
      const isDark = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = isDark ? "#060608" : "#F4F0EB";
      ctx.fillRect(0, 0, w, h);

      // Stars with per-star twinkling
      const starRgb = isDark ? "255,255,255" : "26,26,46";
      for (const s of starsRef.current) {
        const sx      = s.x % w;
        const sy      = s.y % h;
        const twinkle = 0.7 + 0.3 * Math.sin(now * 0.0006 + s.phase);
        const op      = s.o * twinkle * (isDark ? 1 : 0.45);
        ctx.beginPath();
        ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRgb},${op.toFixed(3)})`;
        ctx.fill();
      }

      // Canvas position helper (includes camera offset)
      const spread  = Math.min(cw / 3.2, 210);
      const cwCx    = cw / 2;
      const canvasPos = (depth: number, si: number) => ({
        x: depth === 0 ? cwCx : cwCx + (si - 1) * spread,
        y: depth * LEVEL_H + 80 + cam,
      });

      const allNodes = Object.values(nodesRef.current);

      // ── Draw bezier connections ──
      for (const node of allNodes) {
        if (!node.parentId) continue;
        const parent = nodesRef.current[node.parentId];
        if (!parent) continue;

        const pPos   = canvasPos(parent.depth, parent.siblingIndex);
        const nPos   = canvasPos(node.depth, node.siblingIndex);
        const startX = pPos.x;
        const startY = pPos.y + NODE_H / 2;
        const endX   = nPos.x;
        const endY   = nPos.y - NODE_H / 2;
        const dy     = endY - startY;

        // Organic control points: dive down then curve to child X
        const cp1x = startX;
        const cp1y = startY + dy * 0.42;
        const cp2x = endX;
        const cp2y = endY   - dy * 0.42;

        const lineKey = `${node.parentId}→${node.id}`;

        // Register line birth time on first encounter
        if (!lineAnimsRef.current.has(lineKey)) {
          const len = bezierLength(startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY);
          lineAnimsRef.current.set(lineKey, { startTime: now, length: Math.max(len, 10) });
        }
        const anim = lineAnimsRef.current.get(lineKey)!;

        // Draw-in progress: 0→1 over 650ms, ease-out cubic
        const rawProg = (now - anim.startTime) / 650;
        const prog    = Math.min(1, rawProg);
        const eased   = 1 - Math.pow(1 - prog, 3);

        const applyDrawIn = () => {
          if (eased < 1) {
            ctx.setLineDash([anim.length, anim.length]);
            ctx.lineDashOffset = anim.length * (1 - eased);
          } else {
            ctx.setLineDash([]);
          }
        };

        const stroke = () => {
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.stroke();
        };

        if (node.status === "selected") {
          const pulse = 0.62 + 0.38 * Math.sin(now * 0.0022);

          applyDrawIn();

          // Layer 1: wide atmospheric bloom
          ctx.strokeStyle = "rgba(255,140,66,0.06)";
          ctx.lineWidth   = 20;
          ctx.shadowBlur  = 0;
          stroke();

          // Layer 2: mid glow halo
          ctx.strokeStyle = `rgba(255,160,80,${(0.18 * pulse).toFixed(3)})`;
          ctx.lineWidth   = 9;
          stroke();

          // Layer 3: bright core with canvas shadow glow
          ctx.strokeStyle = `rgba(255,140,66,${(0.95 * pulse).toFixed(3)})`;
          ctx.lineWidth   = 2.5;
          ctx.shadowBlur  = 12;
          ctx.shadowColor = "rgba(255,140,66,0.75)";
          stroke();

          ctx.shadowBlur = 0;
          ctx.setLineDash([]);

          // Flowing particles along selected path
          if (!particlesRef.current.has(lineKey)) {
            particlesRef.current.set(lineKey, [
              { t: 0.04, speed: 0.0013 },
              { t: 0.38, speed: 0.0010 },
              { t: 0.71, speed: 0.0016 },
            ]);
          }
          for (const p of particlesRef.current.get(lineKey)!) {
            p.t = (p.t + p.speed) % 1;
            if (p.t > eased) continue; // respect draw-in boundary
            const pt   = bezierPoint(p.t, startX, startY, cp1x, cp1y, cp2x, cp2y, endX, endY);
            const glow = 0.75 + 0.25 * Math.sin(now * 0.005 + p.t * 7);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 2.8, 0, Math.PI * 2);
            ctx.fillStyle   = `rgba(255,210,120,${glow.toFixed(3)})`;
            ctx.shadowBlur  = 9;
            ctx.shadowColor = "rgba(255,190,80,0.9)";
            ctx.fill();
            ctx.shadowBlur = 0;
          }

        } else if (node.status === "pending") {
          applyDrawIn();
          ctx.strokeStyle = "rgba(255,140,66,0.30)";
          ctx.lineWidth   = 1.5;
          stroke();
          ctx.setLineDash([]);

        } else if (node.status === "generating") {
          // Marching ants — continuous movement, no draw-in
          ctx.setLineDash([5, 9]);
          ctx.lineDashOffset = -(now * 0.04) % 14;
          ctx.strokeStyle = "rgba(255,140,66,0.25)";
          ctx.lineWidth   = 1;
          stroke();
          ctx.setLineDash([]);

        } else {
          // rejected — very dim, still animated draw-in if newly rejected
          applyDrawIn();
          ctx.strokeStyle = "rgba(255,140,66,0.07)";
          ctx.lineWidth   = 1;
          stroke();
          ctx.setLineDash([]);
        }
      }

      // ── Radial glow halos behind selected node positions ──
      for (const node of allNodes) {
        if (node.status !== "selected") continue;
        const pos   = canvasPos(node.depth, node.siblingIndex);
        const pulse = 0.65 + 0.35 * Math.sin(now * 0.0015);
        const grd   = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 72);
        grd.addColorStop(0, `rgba(255,140,66,${(0.16 * pulse).toFixed(3)})`);
        grd.addColorStop(1, "rgba(255,140,66,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, 72, 46, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  // ── Canvas resize ──

  useLayoutEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const ro = new ResizeObserver(() => {
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
      setContainerW(container.clientWidth);
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // ── Derived ──

  const lastSelectedNode = selectedPath.length > 0 ? nodes[selectedPath[selectedPath.length - 1]] : null;
  const currentDepth     = selectedPath.length;
  const isComplete       = currentDepth >= MAX_DEPTH;

  // ── controlsSection ────────────────────────────────────────────────────────

  const loadingControls = (
    <div style={{ padding: "8px 0" }}>
      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 11,
        color: ACCENT, letterSpacing: "0.15em", textTransform: "uppercase",
      }}>
        ◎ Summoning a historical pivot…
      </p>
    </div>
  );

  const errorControls = (
    <div>
      <p style={{ fontSize: 13, color: "#FF6B6B", marginBottom: 16 }}>
        {aiError || "Something went wrong."}
      </p>
      <button onClick={generateInitial} className="btn-brutal btn-brutal-primary" style={{ fontSize: 13 }}>
        Try Again
      </button>
    </div>
  );

  const treeControls = (
    <div>
      {/* Root event */}
      {rootEvent && (
        <div style={{
          border: `2px solid ${ACCENT}`, padding: "12px 14px",
          marginBottom: 18, background: `${ACCENT}11`,
        }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.18em", color: ACCENT, marginBottom: 6 }}>
            ✦ Historical Pivot
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6, lineHeight: 1.3 }}>
            {rootEvent.event}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
            {rootEvent.context}
          </p>
        </div>
      )}

      {/* Depth indicator */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-faint)", marginBottom: 8 }}>
          Timeline Depth
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {Array.from({ length: MAX_DEPTH }, (_, i) => (
            <div
              key={i}
              style={{
                width: 28, height: 6,
                background: i < currentDepth ? ACCENT : "var(--border)",
                transition: "background 300ms",
                boxShadow: i < currentDepth ? `0 0 6px ${ACCENT}88` : "none",
              }}
            />
          ))}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginLeft: 4 }}>
            {currentDepth} / {MAX_DEPTH}
          </span>
        </div>
      </div>

      {/* Selected path breadcrumb */}
      {selectedPath.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-faint)", marginBottom: 8 }}>
            Your Path
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {selectedPath.map((id, i) => {
              const n = nodes[id];
              return (
                <div key={id} style={{
                  display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11,
                  color: i === selectedPath.length - 1 ? "var(--text-primary)" : "var(--text-muted)",
                }}>
                  <span style={{ color: ACCENT, fontFamily: "var(--font-mono)", flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ lineHeight: 1.4 }}>{n?.text ?? "…"}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest impact */}
      {lastSelectedNode?.detail && (
        <div style={{
          border: "1px solid var(--border-subtle)", padding: "10px 12px",
          marginBottom: 16, background: "var(--bg-base)",
        }}>
          <div style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-faint)", marginBottom: 6 }}>
            Latest Impact
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>
            {lastSelectedNode.detail}
          </p>
        </div>
      )}

      {/* AI loading indicator */}
      {aiLoading && (
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: 10, color: ACCENT,
          letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 12,
        }}>
          ◎ Calculating divergence…
        </p>
      )}

      {/* Timeline complete */}
      {isComplete && (
        <div style={{ border: `2px solid ${ACCENT}`, padding: "10px 12px", marginBottom: 16, background: `${ACCENT}11` }}>
          <p style={{ fontSize: 12, color: ACCENT, fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
            Timeline complete. This is where your choices lead.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button
          onClick={generateInitial} disabled={aiLoading}
          className="btn-brutal btn-brutal-primary"
          style={{ fontSize: 12, opacity: aiLoading ? 0.5 : 1, cursor: aiLoading ? "not-allowed" : "pointer" }}
        >
          New Historical Event
        </button>
        {rootEvent && (
          <button
            onClick={generateInitial} disabled={aiLoading}
            className="btn-brutal"
            style={{ fontSize: 12, opacity: aiLoading ? 0.5 : 1, cursor: aiLoading ? "not-allowed" : "pointer" }}
          >
            Reset Timeline
          </button>
        )}
      </div>
    </div>
  );

  const controlsSection =
    phase === "loading" ? loadingControls :
    phase === "error"   ? errorControls :
    treeControls;

  // ── canvasSection ──────────────────────────────────────────────────────────

  const loadingCanvas = (
    <div style={{
      minHeight: 320, background: "#060608",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 20,
    }}>
      <style>{`
        @keyframes be-ring {
          0%   { transform: scale(0.8)  rotate(0deg);   opacity: 0.3; }
          50%  { transform: scale(1.1)  rotate(180deg); opacity: 0.9; }
          100% { transform: scale(0.8)  rotate(360deg); opacity: 0.3; }
        }
        @keyframes be-bar {
          0%, 100% { opacity: 0.2; transform: scaleY(0.5); }
          50%       { opacity: 1;   transform: scaleY(1.2); }
        }
      `}</style>

      {/* Animated rings */}
      <div style={{ position: "relative", width: 56, height: 56 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute", inset: i * 8,
              border: `1.5px solid ${ACCENT}`,
              borderRadius: "50%",
              opacity: 0.4 - i * 0.1,
              animation: `be-ring ${1.8 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <div style={{
          position: "absolute", inset: "50%",
          width: 6, height: 6, marginLeft: -3, marginTop: -3,
          borderRadius: "50%", background: ACCENT,
          boxShadow: `0 0 10px ${ACCENT}`,
        }} />
      </div>

      {/* Oscillating bars */}
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 22 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 3, height: 8 + (i % 3) * 6,
              background: ACCENT, borderRadius: 1,
              animation: `be-bar 0.9s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>

      <p style={{
        fontFamily: "var(--font-mono)", fontSize: 10,
        color: `${ACCENT}88`, textTransform: "uppercase", letterSpacing: "0.22em",
      }}>
        Summoning historical event…
      </p>
    </div>
  );

  const errorCanvas = (
    <div style={{
      minHeight: 320, background: "#060608",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 16, padding: 24,
    }}>
      <p style={{ fontSize: 13, color: "#FF6B6B", textAlign: "center" }}>
        {aiError || "Failed to generate timeline."}
      </p>
      <button onClick={generateInitial} className="btn-brutal" style={{ fontSize: 12 }}>
        Try Again
      </button>
    </div>
  );

  const treeCanvas = (
    <div
      ref={containerRef}
      style={{ position: "relative", height: 600, overflow: "hidden", background: "#060608" }}
    >
      <style>{`
        @keyframes be-node-in {
          from { opacity: 0; transform: scale(0.86) translateY(-10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0px);   }
        }
        @keyframes be-glow-pulse {
          0%, 100% { box-shadow: 0 0 8px ${ACCENT}44,  3px 3px 0 ${ACCENT}55; }
          50%       { box-shadow: 0 0 22px ${ACCENT}77, 3px 3px 0 ${ACCENT}77; }
        }
        @keyframes be-gen-bar {
          0%, 100% { opacity: 0.25; transform: scaleY(0.6); }
          50%       { opacity: 0.85; transform: scaleY(1); }
        }
      `}</style>

      {/* Canvas: background + animated bezier lines */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/* Node container — CSS-animated camera scroll */}
      <div style={{
        position: "absolute", inset: 0,
        transform: `translateY(${cameraY}px)`,
        transition: "transform 600ms ease-in-out",
      }}>
        {Object.values(nodes).map((node) => {
          const { x, y }    = getNodePos(node.depth, node.siblingIndex);
          const isRoot       = node.depth === 0;
          const w            = isRoot ? NODE_W_ROOT : NODE_W_BRANCH;
          const isSelected   = node.status === "selected";
          const isRejected   = node.status === "rejected";
          const isGenerating = node.status === "generating";
          const isPending    = node.status === "pending" && !isRoot;

          // Entrance animation fires only on first appearance
          const isNew       = !shownNodesRef.current.has(node.id);
          const entryAnim   = isNew && !isRoot
            ? `be-node-in 420ms cubic-bezier(0.22, 1, 0.36, 1) ${node.siblingIndex * 65}ms both`
            : undefined;

          return (
            <div
              key={node.id}
              onClick={() => handleSelect(node)}
              style={{
                position: "absolute",
                left: x - w / 2,
                top:  y - NODE_H / 2,
                width: w,
                minHeight: NODE_H,
                opacity: isRejected ? 0.12 : 1,
                pointerEvents: isPending ? "auto" : "none",
                cursor: isPending ? "pointer" : "default",
                border: `2px solid ${
                  isSelected   ? ACCENT :
                  isGenerating ? "var(--border-subtle)" :
                  "var(--border)"
                }`,
                background: isRoot
                  ? `linear-gradient(135deg, ${ACCENT}1F 0%, rgba(8,8,10,0.95) 100%)`
                  : isSelected
                  ? `${ACCENT}1A`
                  : "rgba(8,8,10,0.93)",
                animation: isSelected ? "be-glow-pulse 2.4s ease-in-out infinite" : entryAnim,
                padding: "8px 12px",
                backdropFilter: "blur(12px)",
                transition: "opacity 400ms, border-color 200ms, background 200ms",
              }}
            >
              {/* Root accent stripe */}
              {isRoot && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
                }} />
              )}

              {isGenerating ? (
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 0" }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 2, height: 14,
                        background: ACCENT, borderRadius: 1,
                        animation: `be-gen-bar 0.7s ease-in-out ${i * 0.1}s infinite`,
                      }}
                    />
                  ))}
                  <span style={{ fontSize: 10, color: `${ACCENT}88`, fontFamily: "var(--font-mono)", marginLeft: 3 }}>
                    calculating…
                  </span>
                </div>
              ) : (
                <>
                  {isRoot && (
                    <div style={{
                      fontSize: 8, letterSpacing: "0.18em", textTransform: "uppercase",
                      color: ACCENT, marginBottom: 5,
                    }}>
                      ✦ PIVOT EVENT
                    </div>
                  )}
                  {!isRoot && (
                    <div style={{
                      fontSize: 8, letterSpacing: "0.16em", textTransform: "uppercase",
                      color: isSelected ? ACCENT : "var(--text-faint)", marginBottom: 5,
                    }}>
                      {isSelected ? "✦ CHOSEN" : `ALT ${String.fromCharCode(65 + node.siblingIndex)}`}
                    </div>
                  )}

                  <div style={{
                    fontSize: isRoot ? 13 : 11, fontWeight: 700,
                    color: "#F0F0E8", lineHeight: 1.35,
                  }}>
                    {node.text}
                  </div>

                  {isPending && (
                    <div style={{ fontSize: 9, color: `${ACCENT}77`, marginTop: 5 }}>
                      tap to choose →
                    </div>
                  )}
                </>
              )}

              {/* Selected glow dot */}
              {isSelected && (
                <div style={{
                  position: "absolute", top: -4, right: -4,
                  width: 8, height: 8, borderRadius: "50%",
                  background: ACCENT,
                  boxShadow: `0 0 10px ${ACCENT}, 0 0 20px ${ACCENT}88`,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* HUD overlay */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20 }}>
        <div style={{
          position: "absolute", top: 10, right: 12,
          fontFamily: "var(--font-mono)", fontSize: 9,
          color: `${ACCENT}88`, textAlign: "right",
          textTransform: "uppercase", letterSpacing: "0.15em", lineHeight: 1.8,
        }}>
          <div>BUTTERFLY EFFECT</div>
          <div style={{ color: `${ACCENT}55` }}>depth {currentDepth}/{MAX_DEPTH}</div>
        </div>

        {currentDepth === 0 && phase === "tree" && !aiLoading && (
          <div style={{
            position: "absolute", bottom: 12, left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-ui)", fontSize: 9,
            color: `${ACCENT}66`, textTransform: "uppercase",
            letterSpacing: "0.15em", whiteSpace: "nowrap",
          }}>
            ↓ choose a branch below to diverge history ↓
          </div>
        )}
      </div>
    </div>
  );

  const canvasSection =
    phase === "loading" ? loadingCanvas :
    phase === "error"   ? errorCanvas :
    treeCanvas;

  return (
    <RealmLayout
      realm={realm}
      controlsSection={controlsSection}
      canvasSection={canvasSection}
    />
  );
}
