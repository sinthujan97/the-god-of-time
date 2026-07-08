import React from "react";
import Link from "next/link";

interface ClockSEOContentProps {
  introText: string;
  sections: { title: string; body?: string; steps?: string[] }[];
  faqs: { question: string; answer: string }[];
  relatedLinks: { href: string; name: string }[];
  accent: string;
}

export default function ClockSEOContent({
  introText,
  sections,
  faqs,
  relatedLinks,
  accent,
}: ClockSEOContentProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="realm-page">
      <div className="realm-two-col-zone" style={{ paddingTop: 0 }}>
        <div className="realm-main-col" style={{ paddingTop: 0, borderRight: "none" }}>
          <div
            className="seo-content-zone"
            style={{ "--group-accent": accent } as React.CSSProperties}
          >
            {faqs.length > 0 && (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
              />
            )}

            <p className="seo-intro text-base leading-relaxed text-text-primary mb-12 font-sans font-light">
              <span dangerouslySetInnerHTML={{ __html: introText }} />
            </p>

            {sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans">
                  {section.title}
                </h2>
                {section.steps ? (
                  <ol className="seo-steps list-decimal list-inside pl-1 space-y-3 mb-12 font-sans font-light text-text-primary leading-relaxed">
                    {section.steps.map((step, stepIdx) => (
                      <li key={stepIdx} className="pl-2">
                        <span className="text-text-primary font-normal">{step}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
                    {section.body}
                  </p>
                )}
              </div>
            ))}

            {relatedLinks.length > 0 && (
              <p className="seo-body seo-internal-links mt-8 mb-12 text-base font-sans font-light text-text-primary leading-relaxed border-t border-border-subtle pt-6">
                For related tools, check out{" "}
                {relatedLinks.map((link, idx) => {
                  const isLast = idx === relatedLinks.length - 1;
                  const isSecondLast = idx === relatedLinks.length - 2;
                  return (
                    <React.Fragment key={link.href}>
                      <Link
                        href={link.href}
                        className="seo-internal-link transition-all"
                        style={{ color: accent }}
                      >
                        {link.name}
                      </Link>
                      {isLast ? "." : isSecondLast ? ", and " : ", "}
                    </React.Fragment>
                  );
                })}
              </p>
            )}

            {faqs.length > 0 && (
              <div className="faq-section mt-12">
                <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans border-t border-border-subtle pt-8">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-6">
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="faq-item flex gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 mt-6 flex items-center justify-center font-mono text-xs font-bold"
                        style={{
                          border: "var(--border-width-thin) solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          color: accent,
                        }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="seo-h3 text-lg font-medium text-text-primary mt-6 mb-2 font-sans">
                          {faq.question}
                        </h3>
                        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
