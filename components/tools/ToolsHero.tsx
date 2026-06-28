import React from "react";
import { toolsRegistry } from "@/lib/data/toolsRegistry";

export default function ToolsHero() {
  const totalTools = toolsRegistry.reduce((acc, g) => acc + g.tools.length, 0);
  const totalGroups = toolsRegistry.length;

  return (
    <div className="tools-hero">
      <div className="tools-hero__inner">
        <span className="tools-hero__eyebrow">✦ Utility Tools</span>
        <h1 className="tools-hero__title">
          {totalTools} Precision<br />Time Tools
        </h1>
        <p className="tools-hero__desc">
          Every calculator, converter, and planner you need for dates, time zones, payroll, 
          project management, health, and beyond. Organised across {totalGroups} categories.
        </p>

        {/* Stats strip */}
        <div className="tools-hero__stats">
          {toolsRegistry.map((group) => (
            <div key={group.id} className="tools-hero__stat">
              <span
                className="tools-hero__stat-dot"
                style={{ background: group.accent }}
              />
              <span className="tools-hero__stat-count">{group.tools.length}</span>
              <span className="tools-hero__stat-label">{group.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tools-hero {
          background: var(--bg-base);
          border-bottom: 1px solid var(--border);
          padding: 64px 24px 48px;
        }
        .tools-hero__inner {
          max-width: 1280px;
          margin: 0 auto;
        }
        .tools-hero__eyebrow {
          display: inline-block;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent-utility-a);
          margin-bottom: 16px;
        }
        .tools-hero__title {
          font-family: var(--font-display);
          font-size: clamp(36px, 6vw, 72px);
          font-weight: 300;
          color: var(--text-primary);
          line-height: 1.05;
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .tools-hero__desc {
          font-family: var(--font-ui);
          font-size: 16px;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 600px;
          margin: 0 0 40px;
        }
        .tools-hero__stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 24px;
        }
        .tools-hero__stat {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-ui);
          font-size: 13px;
          color: var(--text-muted);
        }
        .tools-hero__stat-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tools-hero__stat-count {
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
        .tools-hero__stat-label {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
