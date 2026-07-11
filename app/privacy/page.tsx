import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | The God of Time",
  description: "How The God of Time collects, uses, and protects your information, including our use of cookies and third-party advertising.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy | The God of Time",
    description: "How The God of Time collects, uses, and protects your information, including our use of cookies and third-party advertising.",
    url: "/privacy",
  },
};

const EFFECTIVE_DATE = "July 11, 2026";

export default function PrivacyPage() {
  return (
    <>
      <nav className="breadcrumb max-w-3xl mx-auto px-6 pt-6" aria-label="breadcrumb">
        <Link href="/" className="breadcrumb-link">The God of Time</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Privacy Policy</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-primary mt-6 mb-2">Privacy Policy</h1>
        <p className="font-mono text-xs text-text-muted mb-8">Effective date: {EFFECTIVE_DATE}</p>

        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          This Privacy Policy explains what information The God of Time ("we," "us," "the site") collects when you use thegodoftime.com, how it's used, and the choices you have. We built this site to be free and usable without an account, and this policy reflects that: we don't operate a login system and we don't maintain a server-side database of personal profiles.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Information We Collect</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-4">
          <strong>Local storage preferences.</strong> Many of our clocks and tools save your preferences — such as pinned cities on the World Clock, your preferred alert sound on a timer, or a saved list of countdowns — directly in your browser's local storage. This data stays on your device; it is not transmitted to our servers or visible to us.
        </p>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-4">
          <strong>Information you provide.</strong> If you email us through the Contact page, we receive whatever information you choose to include in that message (typically your email address and message content) so we can respond to you.
        </p>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          <strong>Usage data.</strong> We use Google Analytics to understand how visitors use this site — such as which pages are viewed, how long visitors stay, and general device/browser/location information (derived from IP address, not the IP address itself). Google Analytics uses cookies to do this. You can opt out of Google Analytics tracking across all websites by installing the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="seo-internal-link underline">Google Analytics Opt-out Browser Add-on</a>.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Cookies and Advertising</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-4">
          This site is supported by advertising. We work with Google AdSense, which may use cookies (including the DoubleClick cookie) to serve ads based on your prior visits to this site or other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to this site and/or other sites.
        </p>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-4">
          You can opt out of personalized advertising by visiting{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="seo-internal-link underline">Google Ads Settings</a>{" "}
          or, for a broader set of ad networks, the{" "}
          <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer" className="seo-internal-link underline">Digital Advertising Alliance's opt-out page</a>.
        </p>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          Most browsers let you block or delete cookies through their settings. Blocking cookies may affect the functionality of some tools on this site that rely on local storage to remember your preferences.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Children's Privacy</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          This site is not directed at children under 13, and we do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Your Rights</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          Depending on where you live, you may have rights under laws such as the EU/UK General Data Protection Regulation (GDPR) or the California Consumer Privacy Act (CCPA), including the right to access, correct, or delete personal information we hold about you, and the right to opt out of the sale or sharing of personal information. Because this site does not maintain user accounts or a server-side personal data store, most of these rights are already satisfied by design — any preferences saved locally can be cleared at any time by clearing your browser's site data. For anything else, contact us using the details below.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Changes to This Policy</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          We may update this Privacy Policy from time to time, for example as we add new features or advertising partners. Changes take effect when posted on this page, and we'll update the effective date above.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Contact Us</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
          Questions about this policy? Visit the <Link href="/contact" className="seo-internal-link underline">Contact page</Link>.
        </p>
      </div>
    </>
  );
}
