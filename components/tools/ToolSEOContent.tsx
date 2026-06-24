import React from "react";
import Link from "next/link";
import { toolsRegistry } from "@/lib/data/toolsRegistry";

interface ToolSEOContentProps {
  introText: string;
  howToTitle: string;
  howToSteps: string[];
  useCases: { title: string; content: string }[];
  faqs: { question: string; answer: string }[];
  relatedToolSlugs: string[];
  groupAccent: string;
}

export default function ToolSEOContent({
  introText,
  howToTitle,
  howToSteps,
  useCases,
  faqs,
  relatedToolSlugs,
  groupAccent,
}: ToolSEOContentProps) {
  
  // Helper to fetch tool names from the registry
  const getToolName = (slug: string) => {
    for (const group of toolsRegistry) {
      const tool = group.tools.find((t) => t.slug === slug);
      if (tool) return tool.name;
    }
    // Fallback title formatting if slug not found
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="seo-content-zone" style={{ "--group-accent": groupAccent } as React.CSSProperties}>
      {/* Schema Injection */}
      {faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* 1. INTRO TEXT */}
      <p className="seo-intro text-base leading-relaxed text-text-primary mb-12 font-sans font-light">
        {/* We expect parent props to pass html-safe or pre-marked strong tags */}
        <span dangerouslySetInnerHTML={{ __html: introText }} />
      </p>

      {/* 2. HOW TO SECTION */}
      <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans">
        {howToTitle}
      </h2>
      <ol className="seo-steps list-decimal list-inside pl-1 space-y-3 mb-12 font-sans font-light text-text-primary leading-relaxed">
        {howToSteps.map((step, idx) => (
          <li 
            key={idx} 
            className="pl-2"
            style={{ markerColor: groupAccent } as React.CSSProperties}
          >
            <span className="text-text-primary font-normal">{step}</span>
          </li>
        ))}
      </ol>

      {/* 3. USE CASES */}
      {useCases.map((useCase, idx) => (
        <div key={idx} className="mb-8">
          <h3 className="seo-h3 text-lg font-medium text-text-primary mt-8 mb-3 font-sans">
            {useCase.title}
          </h3>
          <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
            {useCase.content}
          </p>
        </div>
      ))}

      {/* 4. INTERNAL LINKS */}
      {relatedToolSlugs && relatedToolSlugs.length > 0 && (
        <p className="seo-body seo-internal-links mt-8 mb-12 text-base font-sans font-light text-text-primary leading-relaxed border-t border-border-subtle pt-6">
          For related calculations, check out other utility widgets such as{" "}
          {relatedToolSlugs.map((slug, idx) => {
            const name = getToolName(slug);
            const isLast = idx === relatedToolSlugs.length - 1;
            const isSecondLast = idx === relatedToolSlugs.length - 2;
            return (
              <React.Fragment key={slug}>
                <Link
                  href={`/tools/${slug}`}
                  className="seo-internal-link transition-all"
                  style={{ color: groupAccent }}
                >
                  {name}
                </Link>
                {isLast ? "." : isSecondLast ? ", and " : ", "}
              </React.Fragment>
            );
          })}
        </p>
      )}

      {/* 5. FAQ SECTION */}
      {faqs.length > 0 && (
        <div className="faq-section mt-12">
          <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans border-t border-border-subtle pt-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <h3 className="seo-h3 text-lg font-medium text-text-primary mt-6 mb-2 font-sans">
                  {faq.question}
                </h3>
                <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
