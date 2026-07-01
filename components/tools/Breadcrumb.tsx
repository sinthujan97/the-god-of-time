import React from "react";
import Link from "next/link";

interface BreadcrumbProps {
  groupName: string;
  groupId: string;
  toolName: string;
  toolSlug: string;
  groupAccent: string;
}

export default function Breadcrumb({
  groupName,
  groupId,
  toolName,
  toolSlug,
  groupAccent,
}: BreadcrumbProps) {
  // Construct links
  const steps = [
    { name: "The God of Time", href: "https://thegodoftime.com" },
    { name: "Utility Tools", href: "https://thegodoftime.com/tools" },
    { name: groupName, href: `https://thegodoftime.com/tools?group=${groupId}` },
  ];

  // Schema JSON-LD Breadcrumb List
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": steps.map((step, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": step.name,
      "item": step.href,
    })).concat([
      {
        "@type": "ListItem",
        "position": steps.length + 1,
        "name": toolName,
        "item": `https://thegodoftime.com/tools/${toolSlug}`,
      },
    ]),
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="mt-4 mb-6 font-sans text-xs text-text-muted flex flex-wrap items-center gap-y-1"
      style={{ "--group-accent": groupAccent } as React.CSSProperties}
    >
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <Link
            href={idx === 0 ? "/" : idx === 1 ? "/tools" : `/tools?group=${groupId}`}
            className="hover:text-[var(--group-accent)] hover:underline transition-colors"
          >
            {step.name}
          </Link>
          <span className="mx-2 select-none text-text-muted">›</span>
        </React.Fragment>
      ))}
      <span className="breadcrumb-current-brutal text-text-primary truncate max-w-[200px] sm:max-w-xs md:max-w-none">
        {toolName}
      </span>
    </nav>
  );
}
