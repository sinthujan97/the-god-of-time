import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { daysBetweenDatesData } from "@/lib/tools/data/days-between-dates";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import Breadcrumb from "@/components/tools/Breadcrumb";
import DaysBetweenCalculator from "@/components/tools/DaysBetweenCalculator";
import ToolSEOContent from "@/components/tools/ToolSEOContent";
import RelatedToolsRail from "@/components/tools/RelatedToolsRail";
import ToolPagination from "@/components/tools/ToolPagination";
import SidebarRail from "@/components/tools/SidebarRail";
import { AccentColorProvider } from "@/lib/context/AccentColorContext";

const data = daysBetweenDatesData;

// 1. HEAD / META TAGS
export const metadata: Metadata = {
  title: data.seo.title,
  description: data.seo.metaDescription,
  alternates: {
    canonical: `https://thegodoftime.com/tools/${data.slug}`,
  },
  openGraph: {
    title: data.seo.title,
    description: data.seo.metaDescription,
    url: `https://thegodoftime.com/tools/${data.slug}`,
    siteName: "The God of Time",
    type: "website",
  },
};

export default function DaysBetweenDatesPage() {
  
  // Find related tools (top 3 in the group)
  const relatedTools = toolsRegistry
    .find((g) => g.name === data.groupName)
    ?.tools.filter((t) => t.slug !== data.slug)
    .slice(0, 3) || [];

  // Determine prev/next page calculations from the flat 100 tools array
  const allTools = toolsRegistry.flatMap((g) => g.tools);
  const currentIndex = allTools.findIndex((t) => t.slug === data.slug);
  const prevTool = currentIndex > 0 ? allTools[currentIndex - 1] : null;
  const nextTool = currentIndex < allTools.length - 1 ? allTools[currentIndex + 1] : null;

  // Cross-link to Deep Time life context simulator
  const relatedRealm = realmsRegistry.find((r) => r.slug === "deep-time-context");

  return (
    <AccentColorProvider color={data.groupAccent}>
      <div className="max-w-[1280px] mx-auto px-6 py-4 animate-in fade-in duration-300">
        
        {/* 3. BREADCRUMB */}
        <Breadcrumb
          groupName={data.groupName}
          groupId="standard-time"
          toolName={data.name}
          toolSlug={data.slug}
          groupAccent={data.groupAccent}
        />

        {/* Two Column Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          
          {/* Left Column (Main) */}
          <div className="w-full lg:w-[720px] lg:shrink-0 flex-1">
            
            {/* 4. TOOL HEADER BLOCK */}
            <div className="relative pl-6 mb-8">
              <div 
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ backgroundColor: data.groupAccent }}
              />
              <span 
                className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] block"
                style={{ color: data.groupAccent }}
              >
                {data.groupName}
              </span>
              <h1 className="text-3xl md:text-[32px] font-sans font-semibold text-text-primary mt-1 leading-tight">
                {data.name}
              </h1>
              <p className="text-sm md:text-base text-text-muted mt-2 font-sans font-light max-w-2xl leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* 5. CALCULATOR CARD */}
            <Suspense fallback={<div className="text-sm text-text-muted font-sans font-light">Loading Calculator Module...</div>}>
              <DaysBetweenCalculator groupAccent={data.groupAccent} />
            </Suspense>

            {/* 6. DIVIDER */}
            <div className="section-divider my-12">
              <div className="divider-line" />
              <span className="divider-symbol">✦</span>
              <div className="divider-line" />
            </div>

            {/* 7. SEO CONTENT ZONE */}
            <ToolSEOContent
              introText={data.seo.introText}
              howToTitle={data.seo.howToTitle}
              howToSteps={data.seo.howToSteps}
              useCases={data.seo.useCases}
              faqs={data.seo.faqs}
              relatedToolSlugs={data.seo.relatedToolSlugs}
              groupAccent={data.groupAccent}
            />

            {/* 8. RELATED TOOLS RAIL */}
            <RelatedToolsRail
              relatedTools={relatedTools}
              groupAccent={data.groupAccent}
            />

            {/* 9. PREV / NEXT NAVIGATION */}
            <ToolPagination
              prevTool={prevTool}
              nextTool={nextTool}
              groupAccent={data.groupAccent}
            />

            {/* 11. MOBILE SIDEBAR REFLOW (Only rendered on mobile viewports < 768px) */}
            <div className="block md:hidden space-y-6 mt-12 border-t border-border pt-8">
              {/* Sidebar Ad 1 */}
              <div className="sidebar-ad-slot">
                <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
                  ADVERTISEMENT
                </span>
                <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border border-border rounded-md flex items-center justify-center text-text-faint text-xs font-mono">
                  [Ad Container - 300×250]
                </div>
              </div>

              {/* Realm Cross-Link */}
              {relatedRealm && (
                <div className="sidebar-realm-link max-w-[300px] mx-auto">
                  <Link
                    href={`/realms/${relatedRealm.slug}`}
                    className="block p-4 bg-bg-card border border-border hover:border-accent-cosmos rounded-lg transition-all"
                  >
                    <span className="realm-link-eyebrow text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-accent-cosmos block mb-1">
                      ✦ EXPLORE THE REALM
                    </span>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="realm-link-name font-display text-base italic text-text-primary block truncate">
                        {relatedRealm.name}
                      </span>
                      <span className="realm-link-arrow text-accent-cosmos text-sm">→</span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Sidebar Ad 2 */}
              <div className="sidebar-ad-slot">
                <span className="ad-label text-[10px] font-sans font-medium uppercase tracking-[0.1em] text-text-faint block text-center mb-1">
                  ADVERTISEMENT
                </span>
                <div className="sidebar-ad-container w-[300px] h-[250px] mx-auto bg-bg-surface border border-border rounded-md flex items-center justify-center text-text-faint text-xs font-mono">
                  [Ad Container - 300×250]
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar Sticky Rail) - Hidden on mobile */}
          <div className="hidden md:block w-full lg:w-[320px] lg:shrink-0">
            <SidebarRail
              relatedTools={relatedTools}
              groupAccent={data.groupAccent}
              realmSlug={relatedRealm?.slug}
              realmName={relatedRealm?.name}
            />
          </div>

        </div>
      </div>
    </AccentColorProvider>
  );
}
