import Link from "next/link";
import type { ClockEntry } from "@/lib/data/clocksRegistry";

interface ClockCardProps {
  clock: ClockEntry;
  accent: string;
}

export default function ClockCard({ clock, accent }: ClockCardProps) {
  const href = clock.isExistingTool
    ? `/tools/${clock.existingToolSlug}`
    : `/clocks/${clock.slug}`;

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 p-5 bg-bg-card border-2 border-border rounded-xl transition-all duration-150 cursor-pointer select-none"
      style={{
        boxShadow: "3px 3px 0 var(--shadow-color)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "translate(-2px,-2px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "5px 5px 0 var(--shadow-color)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "3px 3px 0 var(--shadow-color)";
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span style={{ fontSize: 32, lineHeight: 1 }}>{clock.icon}</span>
        {clock.isExistingTool && (
          <span
            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border-2 border-border flex-shrink-0 whitespace-nowrap"
            style={{ color: accent, borderColor: accent, background: "transparent" }}
          >
            → IN TOOLS
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-headline font-bold text-[15px] text-text-primary leading-tight group-hover:text-text-primary transition-colors">
          {clock.name}
        </span>
        <p className="font-sans text-[12px] text-text-muted leading-snug line-clamp-2">
          {clock.description}
        </p>
      </div>
      <div
        className="mt-auto h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: accent }}
      />
    </Link>
  );
}
