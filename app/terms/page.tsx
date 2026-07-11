import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | The God of Time",
  description: "The terms that govern your use of The God of Time's free calculators, clocks, and games.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | The God of Time",
    description: "The terms that govern your use of The God of Time's free calculators, clocks, and games.",
    url: "/terms",
  },
};

const EFFECTIVE_DATE = "July 11, 2026";

export default function TermsPage() {
  return (
    <>
      <nav className="breadcrumb max-w-3xl mx-auto px-6 pt-6" aria-label="breadcrumb">
        <Link href="/" className="breadcrumb-link">The God of Time</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Terms of Service</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-primary mt-6 mb-2">Terms of Service</h1>
        <p className="font-mono text-xs text-text-muted mb-8">Effective date: {EFFECTIVE_DATE}</p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">1. Acceptance of Terms</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          By accessing or using thegodoftime.com (the "Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">2. Description of Service</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          The Site provides free, browser-based calculators, clocks, timers, and interactive experiences related to time and dates. No account or payment is required to use any tool on the Site. We may add, modify, or remove tools at any time without notice.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">3. Not Professional Advice</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          Tools on this Site — including but not limited to the pregnancy due date calculator, ovulation calculator, age calculator, payroll and timesheet calculators, and any health-, financial-, or legal-adjacent tool — provide estimates for general informational purposes only. They are not medical, legal, financial, or professional advice, and should not be relied upon as a substitute for consultation with a qualified professional (such as a physician, accountant, or attorney). Always confirm important dates, calculations, or decisions with an appropriate professional before acting on them.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">4. Acceptable Use</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          You agree not to misuse the Site — including attempting to disrupt its operation, scraping content at scale, reverse-engineering functionality for a competing product, or using the Site for any unlawful purpose. We reserve the right to restrict access to anyone who violates these terms.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">5. Intellectual Property</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          The Site's design, code, text, and original content are owned by The God of Time unless otherwise noted. You may use the Site's tools for personal or internal purposes, but may not copy, redistribute, or republish substantial portions of the Site's content or code without permission.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">6. Third-Party Links and Advertising</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          The Site may display advertisements served by third parties, including Google AdSense, and may link to third-party websites. We do not control and are not responsible for the content, accuracy, or practices of third-party sites or advertisers. See our <Link href="/privacy" className="seo-internal-link underline">Privacy Policy</Link> for details on advertising cookies.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">7. No Warranty; Limitation of Liability</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          The Site and its tools are provided "as is" and "as available," without warranties of any kind, express or implied, including accuracy, reliability, or fitness for a particular purpose. We make reasonable efforts to keep calculations correct but do not guarantee they are error-free. To the fullest extent permitted by law, The God of Time will not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the Site.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">8. Changes to These Terms</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          We may update these Terms from time to time. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms. We'll update the effective date above when changes are made.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">9. Governing Law</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict-of-law principles. <em>(Placeholder — to be filled in with the operator's actual jurisdiction.)</em>
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">10. Contact</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
          Questions about these Terms? Visit the <Link href="/contact" className="seo-internal-link underline">Contact page</Link>.
        </p>
      </div>
    </>
  );
}
