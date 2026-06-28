import React from "react";
import { Realm } from "@/lib/data/realmsRegistry";

interface RealmSEOContentProps {
  realm: Realm;
}

export function RealmSEOContent({ realm }: RealmSEOContentProps) {
  const seo = realm.seo;
  if (!seo) return null;

  return (
    <div className="seo-content-zone" style={{ "--group-accent": realm.accent } as React.CSSProperties}>
      <p className="seo-intro text-base leading-relaxed text-text-primary mb-12 font-sans font-light">
        <span dangerouslySetInnerHTML={{ __html: seo.introText }} />
      </p>

      {seo.howToTitle && (
        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans">
          {seo.howToTitle}
        </h2>
      )}

      {seo.howToSteps && (
        <ol className="seo-steps list-decimal list-inside pl-1 space-y-3 mb-12 font-sans font-light text-text-primary leading-relaxed">
          {seo.howToSteps.map((step, idx) => (
            <li
              key={idx}
              className="pl-2"
              style={{ markerColor: realm.accent } as React.CSSProperties}
            >
              <span className="text-text-primary font-normal">{step}</span>
            </li>
          ))}
        </ol>
      )}

      {seo.useCases &&
        seo.useCases.map((uc, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="seo-h3 text-lg font-medium text-text-primary mt-8 mb-3 font-sans">
              {uc.title}
            </h3>
            <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
              {uc.content}
            </p>
          </div>
        ))}

      {seo.faqs && (
        <div className="faq-section mt-12">
          <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans border-t border-border-subtle pt-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {seo.faqs.map((faq, idx) => (
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": (seo.faqs ?? []).map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
