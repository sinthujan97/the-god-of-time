import React from "react";

interface RealmAdBannerProps {
  position: "top" | "middle" | "bottom" | "sidebar-top" | "sidebar-bottom";
}

export function RealmAdBanner({ position }: RealmAdBannerProps) {
  let adLabel = "[728×90 Ad]";
  if (position === "bottom") {
    adLabel = "[970×90 Ad]";
  } else if (position === "sidebar-top" || position === "sidebar-bottom") {
    adLabel = "[300×250 Ad]";
  }

  return (
    <div className={`realm-ad-banner ${position}`}>
      <span className="ad-label">ADVERTISEMENT</span>
      <div className="realm-ad-container">
        <span className="ad-placeholder-text">{adLabel}</span>
      </div>
    </div>
  );
}
export default RealmAdBanner;
