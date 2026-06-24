import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import { toolsRegistry } from "@/lib/data/toolsRegistry";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import Breadcrumb from "@/components/tools/Breadcrumb";
import CalculatorCard from "@/components/tools/CalculatorCard";
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

interface ToolPageProps {
  params: Promise<{ slug: string }>;
}

// 1. GENERATE STATIC PARAMS (For all 100 tools)
export async function generateStaticParams() {
  return toolsRegistry
    .flatMap(group => group.tools)
    .map(tool => ({ slug: tool.slug }))
}

// 2. GENERATE DYNAMIC HEAD / META TAGS
export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  let foundTool = null;

  for (const group of toolsRegistry) {
    const t = group.tools.find((tool) => tool.slug === slug);
    if (t) {
      foundTool = t;
      break;
    }
  }

  if (!foundTool) {
    return {
      title: "Tool Not Found | The God of Time",
    };
  }

  const title = `${foundTool.name} | The God of Time`;
  const description = foundTool.description.slice(0, 155);
  const canonical = `https://thegodoftime.com/tools/${foundTool.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "The God of Time",
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;

  // Search for tool and group inside the registry
  let foundTool = null;
  let foundGroup = null;

  for (const group of toolsRegistry) {
    const t = group.tools.find((tool) => tool.slug === slug);
    if (t) {
      foundTool = t;
      foundGroup = group;
      break;
    }
  }

  if (!foundTool || !foundGroup) {
    notFound();
  }

  // Related tools (from same group, excluding current tool, limit to 3)
  const relatedTools = foundGroup.tools
    .filter((t) => t.slug !== slug)
    .slice(0, 3);

  // Pagination navigation calculations
  const allTools = toolsRegistry.flatMap((g) => g.tools);
  const currentIndex = allTools.findIndex((t) => t.slug === slug);
  const prevTool = currentIndex > 0 ? allTools[currentIndex - 1] : null;
  const nextTool = currentIndex < allTools.length - 1 ? allTools[currentIndex + 1] : null;

  // Realm cross-link lookup
  const relatedRealmSlug = toolToRealmMap[slug];
  const relatedRealm = relatedRealmSlug
    ? realmsRegistry.find((r) => r.slug === relatedRealmSlug)
    : null;

  // Placeholder placeholder values for SEO zone content
  const placeholderSeo = {
    introText: `This <strong>${foundTool.name}</strong> utility is designed to help you solve time-related calculations with absolute precision. Use it to coordinate intervals, verify calendar offsets, and streamline schedules.`,
    howToTitle: `How to use the ${foundTool.name}`,
    howToSteps: [
      "Verify the input fields in the calculator zone above.",
      "Enter the correct starting dates, durations, or timezone values.",
      "Click the calculate button to compute the results instantly.",
      "Examine the primary output and secondary breakdown rows."
    ],
    useCases: [
      { title: "Standard Operations", content: "Utilize this tool for daily alignment of schedules, event timelines, and calendar milestones." },
      { title: "Professional Tracking", content: "Streamline project task durations, contractor retainer hours, or billing intervals easily." }
    ],
    faqs: [
      { question: `Is the ${foundTool.name} free to use?`, answer: `Yes, all 100 tools on The God of Time are 100% free and run directly in your web browser.` },
      { question: "Are my input values saved or sent to any servers?", answer: "No. All calculations are executed locally on your device to maintain strict privacy." }
    ],
    relatedToolSlugs: relatedTools.map((t) => t.slug),
  };

  const handleCalculatePlaceholder = async () => {
    "use server";
    // Server action stub for hydration
  };

  return (
    <AccentColorProvider color={foundGroup.accent}>
      <div className="max-w-[1280px] mx-auto px-6 py-4">
        
        {/* 3. BREADCRUMB */}
        <Breadcrumb
          groupName={foundGroup.name}
          groupId={foundGroup.id}
          toolName={foundTool.name}
          toolSlug={foundTool.slug}
          groupAccent={foundGroup.accent}
        />

        {/* Two Column Layout Wrapper */}
        <div className="flex flex-col lg:flex-row gap-12 mt-4">
          
          {/* Left Column (Main) */}
          <div className="w-full lg:w-[720px] lg:shrink-0 flex-1">
            
            {/* 4. TOOL HEADER BLOCK */}
            <div className="relative pl-6 mb-8">
              <div 
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ backgroundColor: foundGroup.accent }}
              />
              <span 
                className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] block"
                style={{ color: foundGroup.accent }}
              >
                {foundGroup.name}
              </span>
              <h1 className="text-3xl md:text-[32px] font-sans font-semibold text-text-primary mt-1 leading-tight">
                {foundTool.name}
              </h1>
              <p className="text-sm md:text-base text-text-muted mt-2 font-sans font-light max-w-2xl leading-relaxed">
                {foundTool.description}
              </p>
            </div>

            {/* 5. CALCULATOR CARD */}
            <CalculatorCard
              groupAccent={foundGroup.accent}
              isLoading={false}
              onCalculate={handleCalculatePlaceholder}
              resultValue="—"
              resultUnit="RESULT"
              animationKey={0}
            >
              <div id="tool-input-area" className="tool-inputs">
                <p style={{ color: 'var(--text-faint)', fontStyle: 'italic' }} className="text-sm font-sans">
                  Tool inputs load here
                </p>
              </div>
            </CalculatorCard>

            {/* 6. DIVIDER */}
            <div className="section-divider my-12">
              <div className="divider-line" />
              <span className="divider-symbol">✦</span>
              <div className="divider-line" />
            </div>

            {/* 7. SEO CONTENT ZONE */}
            <ToolSEOContent
              introText={placeholderSeo.introText}
              howToTitle={placeholderSeo.howToTitle}
              howToSteps={placeholderSeo.howToSteps}
              useCases={placeholderSeo.useCases}
              faqs={placeholderSeo.faqs}
              relatedToolSlugs={placeholderSeo.relatedToolSlugs}
              groupAccent={foundGroup.accent}
            />

            {/* 8. RELATED TOOLS RAIL */}
            <RelatedToolsRail
              relatedTools={relatedTools}
              groupAccent={foundGroup.accent}
            />

            {/* 9. PREV / NEXT NAVIGATION */}
            <ToolPagination
              prevTool={prevTool}
              nextTool={nextTool}
              groupAccent={foundGroup.accent}
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

          {/* Right Column (Sidebar Sticky Rail) - Hidden on mobile, visible on tablet/desktop */}
          <div className="hidden md:block w-full lg:w-[320px] lg:shrink-0">
            <SidebarRail
              relatedTools={relatedTools}
              groupAccent={foundGroup.accent}
              realmSlug={relatedRealm?.slug}
              realmName={relatedRealm?.name}
            />
          </div>

        </div>
      </div>
    </AccentColorProvider>
  );
}
