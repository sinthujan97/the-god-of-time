import React from "react";
import Link from "next/link";
import { toolsRegistry } from "@/lib/data/toolsRegistry";

interface RelatedToolsProps {
  currentToolSlug: string;
  groupId: string;
}

export default function RelatedTools({ currentToolSlug, groupId }: RelatedToolsProps) {
  const group = toolsRegistry.find((g) => g.id === groupId);
  if (!group) return null;

  const related = group.tools
    .filter((t) => t.slug !== currentToolSlug)
    .slice(0, 4); // Show top 4 related tools

  return (
    <div className="w-full mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-display font-medium text-text-primary tracking-wide mb-4">
        Related {group.name} Tools
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {related.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="flex flex-col p-4 rounded-lg bg-bg-card border border-border-subtle hover:border-text-faint hover:bg-bg-card-hover transition-all group"
          >
            <span className="text-sm font-sans font-medium text-text-primary group-hover:text-accent-cosmos transition-colors">
              {tool.name}
            </span>
            <span className="text-xs font-sans text-text-muted mt-1 line-clamp-1">
              {tool.description}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
