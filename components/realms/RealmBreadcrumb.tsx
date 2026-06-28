"use client";

import { Realm } from "@/lib/data/realmsRegistry";

export function RealmBreadcrumb({ realm }: { realm: Realm }) {
  return (
    <>
      <nav className="breadcrumb" aria-label="breadcrumb">
        <a href="/" className="breadcrumb-link">
          The God of Time
        </a>
        <span className="breadcrumb-sep">›</span>
        <a href="/realms" className="breadcrumb-link">
          Fun Realms
        </a>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{realm.name}</span>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "The God of Time",
                "item": "https://thegodoftime.com",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Fun Realms",
                "item": "https://thegodoftime.com/realms",
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": realm.name,
                "item": `https://thegodoftime.com/realms/${realm.slug}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
