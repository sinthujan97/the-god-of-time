"use client";

import React from "react";
import { Realm } from "@/lib/data/realmsRegistry";

interface RealmSEOSectionProps {
  realm: Realm;
}

export function RealmSEOSection({ realm }: RealmSEOSectionProps) {
  const seo = realm.seo;
  if (!seo) return null;

  // FAQ Schema JSON-LD
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": seo.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <section 
      className="w-full bg-bg-base border-t border-border-subtle"
      style={{ "--realm-accent": realm.accent } as React.CSSProperties}
    >
      {/* Schema Injection */}
      {seo.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="max-w-[720px] mx-auto">
          {/* 1. INTRO TEXT */}
          <p className="text-base md:text-lg leading-relaxed text-text-primary mb-12 font-sans font-light">
            <span dangerouslySetInnerHTML={{ __html: seo.introText }} />
          </p>

          {/* 2. HOW TO SECTION */}
          <h2 className="text-[22px] font-semibold text-text-primary mt-12 mb-6 font-sans">
            How {realm.name} Works
          </h2>
          <ol className="list-decimal list-inside pl-1 space-y-4 mb-12 font-sans font-light text-text-primary leading-relaxed">
            {seo.howToSteps.map((step, idx) => (
              <li key={idx} className="pl-2">
                <span className="text-text-primary font-normal">{step}</span>
              </li>
            ))}
          </ol>

          {/* 4. FAQ SECTION */}
          {seo.faqs.length > 0 && (
            <div className="faq-section mt-12">
              <h2 className="text-[22px] font-semibold text-text-primary mt-12 mb-6 font-sans border-t border-border-subtle pt-8">
                Frequently Asked Questions
              </h2>
              <div className="space-y-8">
                {seo.faqs.map((faq, idx) => (
                  <div key={idx} className="faq-item">
                    <h3 className="text-lg font-medium text-text-primary mb-2 font-sans">
                      {faq.question}
                    </h3>
                    <p className="text-base leading-relaxed text-text-muted font-sans font-light">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RealmSEOSection;
