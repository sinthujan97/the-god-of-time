import React from "react";
import Link from "next/link";

interface PaginationItem {
  name: string;
  slug: string;
}

interface ToolPaginationProps {
  prevTool: PaginationItem | null;
  nextTool: PaginationItem | null;
  groupAccent: string;
}

export default function ToolPagination({
  prevTool,
  nextTool,
  groupAccent,
}: ToolPaginationProps) {
  return (
    <div className="tool-pagination flex justify-between items-start pt-8 border-t border-border mt-12 w-full">
      {/* Previous Tool Link */}
      {prevTool ? (
        <Link
          href={`/tools/${prevTool.slug}`}
          className="pagination-prev text-left group block max-w-[45%]"
          style={{ "--group-accent": groupAccent } as React.CSSProperties}
        >
          <span 
            className="pagination-label text-[11px] font-sans font-medium uppercase tracking-[0.1em] block mb-1"
            style={{ color: groupAccent }}
          >
            PREVIOUS
          </span>
          <span className="pagination-name font-sans text-sm md:text-base font-medium text-text-primary group-hover:text-[var(--group-accent)] transition-colors block line-clamp-2">
            {prevTool.name}
          </span>
        </Link>
      ) : (
        <div className="w-10" /> /* Spacer */
      )}

      {/* Next Tool Link */}
      {nextTool ? (
        <Link
          href={`/tools/${nextTool.slug}`}
          className="pagination-next text-right group block max-w-[45%] ml-auto"
          style={{ "--group-accent": groupAccent } as React.CSSProperties}
        >
          <span 
            className="pagination-label text-[11px] font-sans font-medium uppercase tracking-[0.1em] block mb-1"
            style={{ color: groupAccent }}
          >
            NEXT
          </span>
          <span className="pagination-name font-sans text-sm md:text-base font-medium text-text-primary group-hover:text-[var(--group-accent)] transition-colors block line-clamp-2">
            {nextTool.name}
          </span>
        </Link>
      ) : (
        <div className="w-10" /> /* Spacer */
      )}
    </div>
  );
}
