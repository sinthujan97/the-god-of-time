"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ToolPageData } from "@/lib/tools/toolPageData";
import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import Breadcrumb from "@/components/tools/Breadcrumb";
import ToolSEOContent from "@/components/tools/ToolSEOContent";
import RelatedToolsRail from "@/components/tools/RelatedToolsRail";
import ToolPagination from "@/components/tools/ToolPagination";
import SidebarRail from "@/components/tools/SidebarRail";
import { AccentColorProvider } from "@/lib/context/AccentColorContext";

// Association map linking tool slugs to related cosmic/paradox realms
const toolToRealmMap: Record<string, string> = {
  "days-between-dates": "deep-time-context",
  "age-calculator": "body-in-numbers",
  "time-duration-calculator": "time-dilation-slider",
  "days-until-counter": "cosmic-countdown",
  "leap-year-checker": "solar-system-age",
  "date-line-simulator": "relativistic-travel",
  "solar-noon-tracker": "planet-billiards",
  "pomodoro-segments": "what-year-am-i",
  "habit-streak-planner": "born-wrong-era",
  "milestone-buffer": "butterfly-effect",
  "fractional-executive": "genius-age-matcher",
  "recurring-event-rule": "quantum-leap",
  "invoice-due-date": "retrocausality",
  "campaign-deployment": "alternate-history",
  "interest-day-count": "destiny-matrix",
};

interface ToolPageTemplateProps {
  data: ToolPageData;
  InputsComponent: React.ComponentType<{ groupAccent: string }>;
}

export default function ToolPageTemplate({ data, InputsComponent }: ToolPageTemplateProps) {
  // Find related tools (top 3 in the group, excluding current)
  const relatedTools = toolsRegistry
    .find((g) => g.name === data.groupName)
    ?.tools.filter((t) => t.slug !== data.slug)
    .slice(0, 3) || [];

  // Determine prev/next page calculations from the flat tools array
  const allTools = toolsRegistry.flatMap((g) => g.tools);
  const currentIndex = allTools.findIndex((t) => t.slug === data.slug);
  const prevTool = currentIndex > 0 ? allTools[currentIndex - 1] : null;
  const nextTool = currentIndex < allTools.length - 1 ? allTools[currentIndex + 1] : null;

  // Cross-link to cosmic/paradox realm
  const relatedRealmSlug = data.relatedRealmSlug || toolToRealmMap[data.slug];
  const relatedRealm = relatedRealmSlug
    ? realmsRegistry.find((r) => r.slug === relatedRealmSlug)
    : null;

  return (
    <AccentColorProvider color={data.groupAccent}>
      <div className="max-w-[1280px] mx-auto px-6 py-4 animate-in fade-in duration-300">
        {/* Breadcrumbs */}
        <Breadcrumb
          groupName={data.groupName}
          groupId={data.group === "utility-a" ? "standard-time" : data.group}
          toolName={data.name}
          toolSlug={data.slug}
          groupAccent={data.groupAccent}
        />

        {/* Two Column Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          
          {/* Left Column (Main) */}
          <div className="w-full lg:w-[720px] lg:shrink-0 flex-1">
            
            {/* Tool Header Block */}
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

            {/* Calculator Card with input fields */}
            <Suspense fallback={<div className="text-sm text-text-muted font-sans font-light">Loading Calculator Module...</div>}>
              <InputsComponent groupAccent={data.groupAccent} />
            </Suspense>

            {/* Section Divider */}
            <div className="section-divider my-12">
              <div className="divider-line" />
              <span className="divider-symbol">✦</span>
              <div className="divider-line" />
            </div>

            {/* SEO Content Zone */}
            <ToolSEOContent
              introText={data.seo.introText}
              howToTitle={data.seo.howToTitle}
              howToSteps={data.seo.howToSteps}
              useCases={data.seo.useCases}
              faqs={data.seo.faqs}
              relatedToolSlugs={data.seo.relatedToolSlugs}
              groupAccent={data.groupAccent}
            />

            {/* Related Tools Rail */}
            <RelatedToolsRail
              relatedTools={relatedTools}
              groupAccent={data.groupAccent}
            />

            {/* Prev/Next Pagination */}
            <ToolPagination
              prevTool={prevTool}
              nextTool={nextTool}
              groupAccent={data.groupAccent}
            />

            {/* Mobile Sidebar Reflow */}
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
