import React from "react";
import Link from "next/link";
import { Tool } from "@/lib/data/toolsRegistry";

interface RelatedToolsRailProps {
  relatedTools: Tool[];
  groupAccent: string;
}

export default function RelatedToolsRail({ relatedTools, groupAccent }: RelatedToolsRailProps) {
  if (!relatedTools || relatedTools.length === 0) return null;

  return (
    <div className="related-tools-rail mt-12">
      <span className="section-label text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-text-muted block mb-4">
        MORE IN THIS GROUP
      </span>

      {/* Horizontal grid list */}
      <div className="flex overflow-x-auto pb-4 gap-4 md:grid md:grid-cols-3 md:overflow-x-visible md:pb-0 scrollbar-thin">
        {relatedTools.map((tool) => (
          <Link
            key={tool.id}
            href={`/tools/${tool.slug}`}
            className="flex-shrink-0 w-[240px] md:w-auto bg-bg-card border border-border rounded-[10px] p-5 transition-all duration-150 hover:bg-bg-card-hover group border-l-[3px]"
            style={{ 
              borderLeftColor: groupAccent,
              "--group-accent": groupAccent 
            } as React.CSSProperties}
          >
            <h4 className="text-sm font-sans font-medium text-text-primary group-hover:text-[var(--group-accent)] transition-colors line-clamp-1">
              {tool.name}
            </h4>
            <p className="text-xs text-text-muted mt-1.5 font-sans font-light leading-normal line-clamp-2">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
