"use client";

import React, { useMemo } from "react";
import { Realm, realmsRegistry } from "@/lib/data/realmsRegistry";
import RealmCard from "./RealmCard";

interface RealmAdAndRelatedProps {
  realm: Realm;
}

export default function RealmAdAndRelated({ realm }: RealmAdAndRelatedProps) {
  const currentCategory = realm.category;
  const currentSlug = realm.slug;

  const relatedRealms = useMemo(() => {
    // Get other realms, sorting same category first
    const others = realmsRegistry.filter((r) => r.slug !== currentSlug);
    const sameCat = others.filter((r) => r.category === currentCategory);
    const diffCat = others.filter((r) => r.category !== currentCategory);
    return [...sameCat, ...diffCat].slice(0, 3);
  }, [currentCategory, currentSlug]);

  return (
    <div className="w-full bg-bg-surface py-12 px-6 border-t border-border-subtle flex flex-col items-center gap-12">
      
      {/* 1. TOP AD CONTAINER */}
      <div className="w-full max-w-[728px] mx-auto text-center ad-slot-leaderboard">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          ADVERTISEMENT
        </span>
        <div className="ad-container min-h-[90px] w-full bg-bg-base border-t border-b border-border-subtle flex items-center justify-center text-text-faint text-xs font-mono">
          [Leaderboard Banner - 728x90 Desktop / 320x50 Mobile]
        </div>
      </div>

      {/* 2. RELATED REALMS GRID */}
      <div className="w-full max-w-[1280px] mx-auto">
        <h3 className="text-xl md:text-2xl font-display font-light text-text-primary mb-8 text-center italic">
          Explore Related Realms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedRealms.map((related) => (
            <div key={related.slug} className="h-[320px]">
              <RealmCard realm={related} />
            </div>
          ))}
        </div>
      </div>

      {/* 3. BOTTOM AD CONTAINER */}
      <div className="w-full max-w-[728px] mx-auto text-center ad-slot-leaderboard">
        <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
          ADVERTISEMENT
        </span>
        <div className="ad-container min-h-[90px] w-full bg-bg-base border-t border-b border-border-subtle flex items-center justify-center text-text-faint text-xs font-mono">
          [Leaderboard Banner - 728x90 Desktop / 320x50 Mobile]
        </div>
      </div>

    </div>
  );
}
