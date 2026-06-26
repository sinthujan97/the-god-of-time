"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { callRealmAI } from "@/lib/realms/aiClient";
import AILoadingShimmer from "@/components/realms/AILoadingShimmer";
import AIErrorState from "@/components/realms/AIErrorState";
import { prefersReducedMotion } from "@/lib/realms/physics";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";

const realm = realmsRegistry.find((r) => r.slug === "butterfly-effect")!;


type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

type TreeNode = {
  id: string;
  parentId: string | null;
  label: string;         // 4-6 word label
  description: string;   // 2 sentences
  tone: "positive" | "negative" | "chaotic" | "neutral";
  year: number;
  level: number;         // 0 = origin, 1-5 = branches
  x: number;             // canvas position
  y: number;
  isSelected: boolean;
  isActive: boolean;     // on current chosen path
  isAvailable: boolean;  // can be clicked
  children: string[];    // child IDs
  lineProgress?: number; // 0 -> 1 animation progress
};

type HistoricalEvent = {
  year: number;
  event: string;
  context: string;
  category: "science" | "politics" | "war" | "culture" | "nature" | "technology";
};

type BranchAPIResponse = {
  branches: {
    id: string;
    label: string;
    description: string;
    tone: "positive" | "negative" | "chaotic" | "neutral";
    year: number;
  }[];
};

type FinalWorldState = {
  timelineName: string;
  worldToday: string;
  mostDifferent: string;
  mostSimilar: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  science: "#52C4A0",
  politics: "#7B61FF",
  war: "#E87C7C",
  culture: "#C9A84C",
  nature: "#52C4A0",
  technology: "#7B61FF",
};

const TONE_COLORS: Record<string, string> = {
  positive: "#52C4A0",
  negative: "#E87C7C",
  chaotic: "#7B61FF",
  neutral: "#6B6B80",
};

const TONE_ICONS: Record<string, string> = {
  positive: "↑",
  negative: "↓",
  chaotic: "⚡",
  neutral: "→",
};

function getDecadeLabel(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BC (Ancient Era)`;
  }
  if (year < 1000) {
    return `${year} AD (First Millennium)`;
  }
  const decadeStart = Math.floor(year / 10) * 10;
  return `The ${decadeStart}s`;
}

export default function ButterflyEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);

  // Initial Year Selection State
  const [selectedYear, setSelectedYear] = useState<number>(1969);
  const [isEventLoading, setIsEventLoading] = useState<boolean>(false);
  const [eventData, setEventData] = useState<HistoricalEvent | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);

  // Core Flow States
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(0); // 0 = origin, 1-5 = branches
  const [isBranchLoading, setIsBranchLoading] = useState<boolean>(false);
  const [branchError, setBranchError] = useState<string | null>(null);

  // Tree nodes collection
  const [nodes, setNodes] = useState<Record<string, TreeNode>>({});
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  // Final outcome state
  const [finalState, setFinalState] = useState<FinalWorldState | null>(null);
  const [isFinalLoading, setIsFinalLoading] = useState<boolean>(false);
  const [finalError, setFinalError] = useState<string | null>(null);

  // Tooltip & hover tracking
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Particles for ambient background
  const particles = useRef<Particle[]>([]);

  // 1. Debounce and fetch event for selectedYear
  useEffect(() => {
    if (isStarted) return;
    setIsEventLoading(true);
    setEventData(null);
    setEventError(null);

    const timer = setTimeout(() => {
      fetchEvent(selectedYear);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedYear, isStarted]);

  const fetchEvent = async (year: number) => {
    try {
      const response = await callRealmAI({
        systemPrompt: "Return ONLY JSON. Given a year, return one real significant historical event from that year.\n{\n  \"year\": 1969,\n  \"event\": \"Apollo 11 lands on the Moon\",\n  \"context\": \"2-3 sentence description of this event and why it mattered\",\n  \"category\": \"science|politics|war|culture|nature|technology\"\n}",
        userPrompt: `Give me one significant historical event from the year ${year}.`,
        expectJSON: true,
      });

      if (response.error) {
        setEventError(response.error);
        setIsEventLoading(false);
        return;
      }

      // Parse JSON clean
      let cleanText = response.content;
      if (cleanText.includes("```")) {
        cleanText = cleanText.replace(/```json|```/g, "").trim();
      }
      const data: HistoricalEvent = JSON.parse(cleanText);
      setEventData(data);
    } catch (err) {
      setEventError("The timeline is unclear. Try again.");
    } finally {
      setIsEventLoading(false);
    }
  };

  // Compute Target Years based on level
  const getTargetYearForLevel = (startYear: number, lvl: number): number => {
    switch (lvl) {
      case 1: return startYear + 20 > 2026 ? 2026 : startYear + 20;
      case 2: return startYear + 50 > 2026 ? 2026 : startYear + 50;
      case 3: return startYear + 100 > 2026 ? 2026 : startYear + 100;
      case 4: return startYear + 200 > 2026 ? 2026 : startYear + 200;
      case 5: return 2026;
      default: return 2026;
    }
  };

  // Start the timeline exploration
  const handleStartTimeline = () => {
    if (!eventData) return;
    setIsStarted(true);
    setLevel(0);

    // Initial setup with origin node (level 0)
    const originId = "origin";
    const originNode: TreeNode = {
      id: originId,
      parentId: null,
      label: eventData.event,
      description: eventData.context,
      tone: "neutral",
      year: eventData.year,
      level: 0,
      x: 0, // calculated on canvas resize
      y: 0,
      isSelected: true,
      isActive: true,
      isAvailable: false,
      children: [],
      lineProgress: 1,
    };

    setNodes({ [originId]: originNode });
    setActiveNodeId(originId);

    // Fetch branches for level 1
    fetchLevelBranches(1, originId, [originNode], eventData.year);
  };

  // Fetch branches for a level
  const fetchLevelBranches = async (
    targetLevel: number,
    parentId: string,
    currentPath: TreeNode[],
    startYear: number
  ) => {
    setIsBranchLoading(true);
    setBranchError(null);
    setLevel(targetLevel);

    const targetYear = getTargetYearForLevel(startYear, targetLevel);

    try {
      const parentNode = currentPath[currentPath.length - 1];
      const systemPrompt = "You are a branching timeline engine. Generate exactly 3 divergent historical consequence branches. Return ONLY valid JSON, no other text:\n{\n  \"branches\": [\n    {\n      \"id\": \"A\",\n      \"label\": \"Short 4-6 word label\",\n      \"description\": \"Exactly 2 sentences describing what happened in this branch\",\n      \"tone\": \"positive\",\n      \"year\": 1989\n    },\n    {\n      \"id\": \"B\",\n      \"label\": \"Different path label\",\n      \"description\": \"Exactly 2 sentences for B\",\n      \"tone\": \"negative\",\n      \"year\": 1989\n    },\n    {\n      \"id\": \"C\",\n      \"label\": \"Third option label\",\n      \"description\": \"Exactly 2 sentences for C\",\n      \"tone\": \"chaotic\",\n      \"year\": 1989\n    }\n  ]\n}";

      let userPrompt = "";
      if (targetLevel === 1) {
        userPrompt = `The event that DID NOT HAPPEN: ${parentNode.label} in ${parentNode.year}.\nGenerate 3 branches showing what the world became by ${targetYear} without this event. Make branches genuinely different — not variations of the same theme.`;
      } else {
        const pathStr = currentPath
          .map((c, i) => `Level ${i}: '${c.label}' (${c.year})`)
          .join("\n");
        userPrompt = `Original suppressed event: ${eventData?.event} (${eventData?.year})\nChoices made so far:\n${pathStr}\nCurrent timeline state: ${parentNode.description}\nGenerate 3 branches from ${parentNode.year} toward ${targetYear}.\nEach branch should logically follow from the previous choice and diverge meaningfully.`;
      }

      const response = await callRealmAI({
        systemPrompt,
        userPrompt,
        expectJSON: true,
      });

      if (response.error) {
        setBranchError(response.error);
        setIsBranchLoading(false);
        return;
      }

      let cleanText = response.content;
      if (cleanText.includes("```")) {
        cleanText = cleanText.replace(/```json|```/g, "").trim();
      }
      const data: BranchAPIResponse = JSON.parse(cleanText);

      // Create branch nodes in state
      setNodes((prev) => {
        const updated = { ...prev };
        const childrenIds: string[] = [];

        data.branches.forEach((b, idx) => {
          const childId = `lvl_${targetLevel}_node_${idx}_${Date.now()}`;
          childrenIds.push(childId);

          updated[childId] = {
            id: childId,
            parentId: parentId,
            label: b.label,
            description: b.description,
            tone: b.tone,
            year: targetYear,
            level: targetLevel,
            x: 0, // resolved in sizing
            y: 0,
            isSelected: false,
            isActive: false,
            isAvailable: true,
            children: [],
            lineProgress: 0, // starts animate loop
          };
        });

        // Link parent node to children
        if (updated[parentId]) {
          updated[parentId] = {
            ...updated[parentId],
            children: childrenIds,
          };
        }

        return updated;
      });
    } catch (err) {
      setBranchError("The timeline is unclear. Try again.");
    } finally {
      setIsBranchLoading(false);
    }
  };

  // Generate Final Outcome State at Level 5
  const fetchFinalOutcome = async (path: TreeNode[]) => {
    setIsFinalLoading(true);
    setFinalError(null);

    try {
      const pathStr = path
        .map((c, i) => `Level ${i}: '${c.label}' (${c.year}) - ${c.description}`)
        .join("\n");

      const systemPrompt = "Write the final state of this alternate timeline. Return ONLY JSON:\n{\n  \"timelineName\": \"Proper noun timeline name\",\n  \"worldToday\": \"4-5 vivid sentences about today in this alternate world — technology, politics, culture. Be specific.\",\n  \"mostDifferent\": \"Single most striking difference from our reality\",\n  \"mostSimilar\": \"Something unchanged\"\n}";

      const userPrompt = `Original suppressed event: ${eventData?.event} (${eventData?.year})\nPath through history:\n${pathStr}\nDescribe the world in 2026 in this timeline.`;

      const response = await callRealmAI({
        systemPrompt,
        userPrompt,
        expectJSON: true,
      });

      if (response.error) {
        setFinalError(response.error);
        setIsFinalLoading(false);
        return;
      }

      let cleanText = response.content;
      if (cleanText.includes("```")) {
        cleanText = cleanText.replace(/```json|```/g, "").trim();
      }
      const data: FinalWorldState = JSON.parse(cleanText);
      setFinalState(data);
    } catch (err) {
      setFinalError("The timeline is unclear. Try again.");
    } finally {
      setIsFinalLoading(false);
    }
  };

  // Node selection triggers next level
  const handleSelectNode = (nodeId: string) => {
    const node = nodes[nodeId];
    if (!node || !node.isAvailable || isBranchLoading || isFinalLoading) return;

    // Get current path to parent
    const path = getPathToNode(nodeId);

    setNodes((prev) => {
      const updated = { ...prev };

      // Mark all nodes at current level as unavailable and unselected
      Object.keys(updated).forEach((id) => {
        if (updated[id].level === node.level) {
          updated[id] = {
            ...updated[id],
            isSelected: id === nodeId,
            isActive: id === nodeId,
            isAvailable: false,
          };
        }
      });

      // Mark node's path active
      path.forEach((pNode) => {
        if (updated[pNode.id]) {
          updated[pNode.id].isActive = true;
        }
      });

      return updated;
    });

    setActiveNodeId(nodeId);

    if (node.level < 5) {
      const currentYear = eventData?.year || 1969;
      const nextLevel = node.level + 1;
      fetchLevelBranches(nextLevel, nodeId, path, currentYear);
    } else {
      // Trigger final outcome reveal
      fetchFinalOutcome(path);
    }
  };

  // Helper to trace back path
  const getPathToNode = (nodeId: string): TreeNode[] => {
    const path: TreeNode[] = [];
    let currentId: string | null = nodeId;
    while (currentId) {
      const nodeObj: TreeNode | undefined = nodes[currentId];
      if (!nodeObj) break;
      path.unshift(nodeObj);
      currentId = nodeObj.parentId;
    }
    return path;
  };

  // List of active choice nodes
  const currentPath = useMemo(() => {
    if (!activeNodeId) return [];
    return getPathToNode(activeNodeId);
  }, [activeNodeId, nodes]);

  // Current level options
  const currentBranches = useMemo(() => {
    if (!activeNodeId) return [];
    const activeNode = nodes[activeNodeId];
    if (!activeNode) return [];
    return activeNode.children.map((childId) => nodes[childId]).filter(Boolean);
  }, [activeNodeId, nodes]);

  // Layout sizing calculations
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      canvas.width = width;
      canvas.height = height;

      // Update positions in state
      setNodes((prev) => {
        const updated = { ...prev };
        const totalLvlHeight = height / 6;

        // Position nodes dynamically
        Object.keys(updated).forEach((id) => {
          const n = updated[id];
          if (n.level === 0) {
            n.x = width / 2;
            n.y = height - 70;
          } else {
            // Find parent
            const parent = updated[n.parentId!];
            if (parent) {
              n.y = parent.y - totalLvlHeight;

              // Find siblings
              const siblings = parent.children;
              const sibIndex = siblings.indexOf(id);
              const count = siblings.length;

              if (count > 0) {
                // Splay offset
                if (n.level === 1) {
                  // Width spacing
                  const spacing = width / (count + 1);
                  n.x = spacing * (sibIndex + 1);
                } else {
                  // Span offset around parent x
                  const spread = (width / Math.pow(1.6, n.level - 1)) * 0.28;
                  const left = parent.x - spread;
                  const right = parent.x + spread;
                  if (count === 1) {
                    n.x = parent.x;
                  } else {
                    n.x = left + (sibIndex / (count - 1)) * (right - left);
                  }
                }
              }
            }
          }
        });
        return updated;
      });
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => resizeObserver.disconnect();
  }, [isStarted]);

  // Canvas drawing & animations loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localFrameId: number;

    // Build ambient particles
    if (particles.current.length === 0) {
      const list: Particle[] = [];
      for (let i = 0; i < 40; i++) {
        list.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          size: 1 + Math.random() * 0.6,
          alpha: 0.1 + Math.random() * 0.2,
        });
      }
      particles.current = list;
    }

    const draw = () => {
      if (canvas.width === 0 || canvas.height === 0) {
        localFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw ambient starfield
      particles.current.forEach((p) => {
        if (!prefersReducedMotion()) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 97, 255, ${p.alpha})`;
        ctx.fill();
      });

      // 2. Draw origin dot before started
      if (!isStarted) {
        const cx = canvas.width / 2;
        const cy = canvas.height - 70;

        ctx.save();
        const pulse = 14 + 3 * Math.sin(Date.now() * 0.003);
        ctx.beginPath();
        ctx.arc(cx, cy, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(123, 97, 255, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#7B61FF";
        ctx.fill();
        ctx.restore();

        ctx.font = "300 13px var(--font-ui)";
        ctx.fillStyle = "var(--text-faint)";
        ctx.textAlign = "center";
        ctx.fillText("Select a year and event to begin", cx, cy - 26);
        localFrameId = requestAnimationFrame(draw);
        return;
      }

      // Draw tree connection lines
      Object.keys(nodes).forEach((id) => {
        const node = nodes[id];
        if (node.parentId) {
          const parent = nodes[node.parentId];
          if (parent) {
            // Animate line connection
            if (node.lineProgress !== undefined && node.lineProgress < 1) {
              node.lineProgress += prefersReducedMotion() ? 0.1 : 0.025;
              if (node.lineProgress > 1) node.lineProgress = 1;
            }

            const progress = node.lineProgress ?? 1;
            const endX = parent.x + (node.x - parent.x) * progress;
            const endY = parent.y + (node.y - parent.y) * progress;

            ctx.beginPath();
            ctx.moveTo(parent.x, parent.y);
            // Curved connection
            const cpX = (parent.x + node.x) / 2;
            const cpY = parent.y - 30;
            ctx.quadraticCurveTo(cpX, cpY, endX, endY);

            // Style line based on choice path
            const inChosenPath = node.isActive && parent.isActive;
            ctx.strokeStyle = inChosenPath
              ? TONE_COLORS[node.tone]
              : "rgba(150, 150, 150, 0.15)";
            ctx.lineWidth = inChosenPath ? (finalState ? 3 : 2) : 1;
            ctx.stroke();
          }
        }
      });

      // Draw placeholder branches pulsing while loading
      if (isBranchLoading && activeNodeId) {
        const parent = nodes[activeNodeId];
        if (parent) {
          const nextLvl = parent.level + 1;
          const targetY = parent.y - canvas.height / 6;
          const spread = (canvas.width / Math.pow(1.6, nextLvl - 1)) * 0.28;
          const left = parent.x - spread;
          const right = parent.x + spread;

          for (let i = 0; i < 3; i++) {
            let targetX = parent.x;
            if (nextLvl === 1) {
              const spacing = canvas.width / 4;
              targetX = spacing * (i + 1);
            } else {
              targetX = left + (i / 2) * (right - left);
            }

            // Connection line placeholder
            ctx.beginPath();
            ctx.moveTo(parent.x, parent.y);
            const cpX = (parent.x + targetX) / 2;
            const cpY = parent.y - 30;
            ctx.quadraticCurveTo(cpX, cpY, targetX, targetY);
            ctx.strokeStyle = "rgba(150, 150, 150, 0.08)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Pulsing circles
            ctx.beginPath();
            ctx.arc(targetX, targetY, 6 + 2 * Math.sin(Date.now() * 0.006 + i), 0, Math.PI * 2);
            ctx.fillStyle = "rgba(150, 150, 150, 0.15)";
            ctx.fill();
          }
        }
      }

      // Draw node nodes
      Object.keys(nodes).forEach((id) => {
        const node = nodes[id];
        const opacity = node.isActive ? 1.0 : finalState ? 0.15 : 0.35;

        // Radius mapping
        let r = 8;
        if (node.level === 0) r = 14;
        else if (node.level === 1) r = 10;
        else if (node.isActive) r = 10;
        else if (finalState && node.isSelected) r = 16;
        else if (finalState && !node.isSelected && node.level === 5) r = 6;

        ctx.save();
        ctx.globalAlpha = opacity;

        // Pulsing rings for available nodes
        if (node.isAvailable) {
          const pulse = r + 4 * Math.sin(Date.now() * 0.003) + 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${hexToRgb(TONE_COLORS[node.tone])}, 0.35)`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // Final end node pulse
        if (finalState && node.isActive && node.level === 5) {
          const pulse = r + 5 * Math.sin(Date.now() * 0.004) + 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulse, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${hexToRgb(TONE_COLORS[node.tone])}, 0.5)`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);

        if (node.isActive) {
          ctx.fillStyle = TONE_COLORS[node.tone];
        } else if (node.isAvailable) {
          ctx.fillStyle = `rgba(${hexToRgb(TONE_COLORS[node.tone])}, 0.7)`;
        } else {
          ctx.fillStyle = `rgba(${hexToRgb(TONE_COLORS[node.tone])}, 0.25)`;
        }
        ctx.fill();

        // Node labels
        // Year above
        ctx.font = "500 10px var(--font-mono)";
        ctx.fillStyle = "var(--text-muted)";
        ctx.textAlign = "center";
        ctx.fillText(node.year.toString(), node.x, node.y - r - 6);

        // Name below
        ctx.font = "300 11px var(--font-ui)";
        ctx.fillStyle = "var(--text-primary)";
        const displayLabel = node.label.length > 18 ? node.label.slice(0, 15) + "..." : node.label;
        ctx.fillText(displayLabel, node.x, node.y + r + 14);

        ctx.restore();
      });

      localFrameId = requestAnimationFrame(draw);
    };

    localFrameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(localFrameId);
  }, [nodes, isStarted, isBranchLoading, finalState]);

  // Click collision detection
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Detect collision with available nodes
    const hitNode = Object.values(nodes).find((n) => {
      if (!n.isAvailable) return false;
      const distance = Math.hypot(n.x - clickX, n.y - clickY);
      const r = n.level === 1 ? 10 : 8;
      return distance < r + 12; // generous hit zone
    });

    if (hitNode) {
      handleSelectNode(hitNode.id);
    }
  };

  // Hover detection for tooltips
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;

    // Check hit on any node
    const hoverNode = Object.values(nodes).find((n) => {
      const distance = Math.hypot(n.x - mX, n.y - mY);
      const r = n.level === 0 ? 14 : 10;
      return distance < r + 10;
    });

    if (hoverNode) {
      setHoveredNodeId(hoverNode.id);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredNodeId(null);
    }
  };

  const resetAll = () => {
    setIsStarted(false);
    setLevel(0);
    setNodes({});
    setActiveNodeId(null);
    setFinalState(null);
    setEventData(null);
    setSelectedYear(1969);
  };

  // Hex to RGB parser for transparency overlay
  const hexToRgb = (hex: string): string => {
    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  return (
    <RealmLayout realm={realm} hasInputZone={false}>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          width: "100%",
          height: "600px",
          position: "relative",
        }}
        className="flex-col lg:flex-row"
      >
      {/* SCOPED COMPONENT STYLES */}
      <style jsx>{`
        .panel-left {
          flex: 3;
          height: 100%;
          position: relative;
          background: var(--bg-base);
        }

        .panel-right {
          flex: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border);
          background: color-mix(in srgb, var(--bg-card) 92%, transparent);
          backdrop-filter: blur(20px);
          overflow-y: auto;
          position: relative;
          padding: 32px 24px;
        }

        .category-pill {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 2px 8px;
          border-radius: 4px;
          color: #ffffff;
        }

        .step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--border);
          transition: background 300ms;
        }

        .step-dot.active {
          background: var(--accent-scifi);
          box-shadow: 0 0 8px var(--accent-scifi);
        }

        .branch-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px 20px;
          cursor: pointer;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .branch-card:hover {
          transform: translateX(6px);
          background: var(--bg-card-hover);
        }

        .tone-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          font-size: 11px;
          font-weight: bold;
          margin-right: 8px;
          color: #ffffff;
        }

        .stat-card {
          flex: 1;
          background: rgba(120, 120, 120, 0.05);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 14px;
        }

        .tooltip-card {
          position: fixed;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px 16px;
          max-width: 240px;
          pointer-events: none;
          z-index: 100;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }

        .year-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-scifi);
          cursor: pointer;
          box-shadow: 0 0 8px var(--accent-scifi);
        }

        .year-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--accent-scifi);
          cursor: pointer;
          box-shadow: 0 0 8px var(--accent-scifi);
          border: none;
        }

        @media (max-width: 1024px) {
          .panel-left {
            height: 45vh;
            order: 2;
          }

          .panel-right {
            height: auto;
            border-left: none;
            border-bottom: 1px solid var(--border);
            order: 1;
            padding: 24px;
          }
        }
      `}</style>

      {/* LEFT PANEL: Canvas tree visualizer */}
      <div className="panel-left">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredNodeId(null)}
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {/* Dynamic Tooltip on Hover */}
        {hoveredNodeId && tooltipPos && nodes[hoveredNodeId] && (
          <div
            className="tooltip-card animate-slide-up"
            style={{
              left: tooltipPos.x + 12,
              top: tooltipPos.y - 12,
              borderLeft: `3px solid ${TONE_COLORS[nodes[hoveredNodeId].tone]}`,
            }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: TONE_COLORS[nodes[hoveredNodeId].tone], marginBottom: 4 }}>
              {nodes[hoveredNodeId].year} — {nodes[hoveredNodeId].tone.toUpperCase()}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
              {nodes[hoveredNodeId].label}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-muted)", lineHeight: 1.4 }}>
              {nodes[hoveredNodeId].description}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL: Dynamic Step UIs */}
      <div className="panel-right">
        {/* STEP 1: Event Selector */}
        {!isStarted && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>

            {/* Slider container */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
                Select Origin Year
              </span>
              <div style={{ textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 64, color: "var(--accent-scifi)", fontWeight: 300 }}>
                  {selectedYear}
                </div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                  {getDecadeLabel(selectedYear)}
                </div>
              </div>
              <input
                type="range"
                min={-3000}
                max={2024}
                step={1}
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="year-slider"
                style={{
                  width: "100%",
                  height: 4,
                  background: "var(--border)",
                  outline: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Event Display Card */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {isEventLoading && (
                <div style={{ minHeight: 140 }}>
                  <AILoadingShimmer message="Mapping chronal database..." />
                </div>
              )}

              {eventError && (
                <AIErrorState message={eventError} onRetry={() => fetchEvent(selectedYear)} />
              )}

              {eventData && !isEventLoading && (
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderLeft: `4px solid ${CATEGORY_COLORS[eventData.category] || "var(--accent-scifi)"}`,
                    borderRadius: 8,
                    padding: 20,
                  }}
                  className="animate-slide-up"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: CATEGORY_COLORS[eventData.category], fontWeight: "bold" }}>
                      {eventData.year}
                    </span>
                    <span
                      className="category-pill"
                      style={{ background: CATEGORY_COLORS[eventData.category] }}
                    >
                      {eventData.category}
                    </span>
                  </div>
                  <h3 style={{ margin: "0 0 8px 0", fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                    {eventData.event}
                  </h3>
                  <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {eventData.context}
                  </p>
                </div>
              )}
            </div>

            {/* Action CTA */}
            {eventData && !isEventLoading && (
              <button
                onClick={handleStartTimeline}
                style={{
                  width: "100%",
                  height: 48,
                  background: "var(--accent-scifi)",
                  border: "none",
                  borderRadius: 6,
                  color: "#ffffff",
                  fontFamily: "var(--font-ui)",
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  letterSpacing: "0.08em",
                }}
              >
                What if this never happened?
              </button>
            )}
          </div>
        )}

        {/* STEPS 2-5: Branching gameplay */}
        {isStarted && !finalState && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>
            {/* Header */}
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--accent-scifi)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                TIMELINE BRANCH — LEVEL {level} OF 5
              </span>

              {/* Progress Dots */}
              <div style={{ display: "flex", gap: 6, marginTop: 10, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <div key={lvl} className={`step-dot ${level >= lvl ? "active" : ""}`} />
                ))}
              </div>

              <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, color: "var(--text-primary)", fontWeight: "bold" }}>
                {nodes[activeNodeId!]?.year}
              </div>
            </div>

            {/* Branches view */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              {isBranchLoading && (
                <AILoadingShimmer message="Synthesizing timeline probabilities..." />
              )}

              {branchError && (
                <AIErrorState
                  message={branchError}
                  onRetry={() => {
                    const path = getPathToNode(activeNodeId!);
                    const startYear = eventData?.year || 1969;
                    fetchLevelBranches(level, activeNodeId!, path, startYear);
                  }}
                />
              )}

              {currentBranches.length > 0 && !isBranchLoading && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 11, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
                    Select Consequence Path
                  </span>
                  {currentBranches.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => handleSelectNode(b.id)}
                      className="branch-card"
                      style={{ borderLeft: `4px solid ${TONE_COLORS[b.tone]}` }}
                    >
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
                        <span className="tone-icon" style={{ background: TONE_COLORS[b.tone] }}>
                          {TONE_ICONS[b.tone]}
                        </span>
                        <h4 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 16, fontStyle: "italic", color: "var(--text-primary)", fontWeight: 400 }}>
                          {b.label}
                        </h4>
                      </div>
                      <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {b.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reset / restart options */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                onClick={resetAll}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  padding: "8px 16px",
                  fontSize: 11,
                  fontFamily: "var(--font-ui)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  textTransform: "uppercase",
                }}
              >
                Abandon Alternate Timeline
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: Final Outcome Reveal */}
        {finalState && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24, height: "100%" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-scifi)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                TIMELINE STABILITY: RECORDED
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontStyle: "italic",
                  color: TONE_COLORS[nodes[activeNodeId!].tone],
                  marginTop: 6,
                  marginBottom: 8,
                }}
              >
                {finalState.timelineName}
              </h2>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>
              <div>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: 10, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase" }}>
                  The World Today (2026)
                </span>
                <p style={{ margin: "6px 0 0 0", fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--text-primary)", lineHeight: 1.7 }}>
                  {finalState.worldToday}
                </p>
              </div>

              {/* Stats grid */}
              <div style={{ display: "flex", gap: 12 }}>
                <div className="stat-card">
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                    MOST DIFFERENT
                  </span>
                  <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.4 }}>
                    {finalState.mostDifferent}
                  </p>
                </div>
                <div className="stat-card">
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: 9, color: "var(--text-faint)", fontWeight: 600, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                    MOST SIMILAR
                  </span>
                  <p style={{ margin: 0, fontFamily: "var(--font-ui)", fontSize: 12, color: "var(--text-muted)", fontWeight: 500, lineHeight: 1.4 }}>
                    {finalState.mostSimilar}
                  </p>
                </div>
              </div>
            </div>

            {/* Explore again button */}
            <button
              onClick={resetAll}
              style={{
                width: "100%",
                height: 48,
                background: TONE_COLORS[nodes[activeNodeId!].tone],
                border: "none",
                borderRadius: 6,
                color: "#ffffff",
                fontFamily: "var(--font-ui)",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "uppercase",
                cursor: "pointer",
                letterSpacing: "0.08em",
              }}
            >
              Explore Again
            </button>
          </div>
        )}

        {/* Loading Final State */}
        {isFinalLoading && (
          <AILoadingShimmer message="Stabilizing final alternate present..." />
        )}

        {/* Error Final State */}
        {finalError && (
          <AIErrorState message={finalError} onRetry={() => fetchFinalOutcome(currentPath)} />
        )}
      </div>
    </div>
  </RealmLayout>
  );
}
