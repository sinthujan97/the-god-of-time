import React from "react";

interface RealmAdBannerProps {
  position: 'top' | 'middle' | 'bottom';
}

export function RealmAdBanner({ position }: RealmAdBannerProps) {
  return (
    <div className={`realm-ad-banner realm-ad-${position}`}>
      <span className="ad-label">ADVERTISEMENT</span>
      <div className="realm-ad-container">
        {/* AdSense code goes here */}
        <span className="ad-placeholder-text desktop-ad-label">
          [{position === 'bottom' ? '970×90' : '728×90'} Ad]
        </span>
        <span className="ad-placeholder-text mobile-ad-label">
          [320×50 Ad]
        </span>
      </div>
    </div>
  );
}

export default RealmAdBanner;
