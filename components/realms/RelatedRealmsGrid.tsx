import React from "react";
import { realmsRegistry, Realm } from "@/lib/data/realmsRegistry";
import RealmCard from "./RealmCard";

interface RelatedRealmsGridProps {
  currentSlug: string;
  category: string;
}

function getRelatedRealms(currentSlug: string, category: string, count = 3): Realm[] {
  const others = realmsRegistry.filter((r) => r.slug !== currentSlug);
  const sameCat = others.filter((r) => r.category === category);
  const diffCat = others.filter((r) => r.category !== category);
  return [...sameCat, ...diffCat].slice(0, count);
}

export function RelatedRealmsGrid({ currentSlug, category }: RelatedRealmsGridProps) {
  const related = getRelatedRealms(currentSlug, category, 3);

  return (
    <div className="related-realms-section">
      <div className="related-realms-inner">
        <h2 className="related-realms-title">More Realms to Explore</h2>
        <div className="related-realms-grid">
          {related.map((realm) => (
            <RealmCard key={realm.slug} realm={realm} wide={false} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <a href="/realms" className="view-all-realms-link">
            View All Realms →
          </a>
        </div>
      </div>
    </div>
  );
}
export default RelatedRealmsGrid;
