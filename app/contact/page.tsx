import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | The God of Time",
  description: "Get in touch with The God of Time — report a bug, suggest a tool, or ask a question.",
  alternates: {
    canonical: "https://thegodoftime.com/contact",
  },
  openGraph: {
    title: "Contact | The God of Time",
    description: "Get in touch with The God of Time — report a bug, suggest a tool, or ask a question.",
    url: "https://thegodoftime.com/contact",
  },
};

// TODO: replace this mailto link with a real support form (e.g. Formspree) that
// forwards to the live support inbox once the domain and email are fully set up.
const SUPPORT_EMAIL = "support@thegodoftime.com";

export default function ContactPage() {
  return (
    <>
      <nav className="breadcrumb max-w-3xl mx-auto px-6 pt-6" aria-label="breadcrumb">
        <Link href="/" className="breadcrumb-link">The God of Time</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Contact</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-primary mt-6 mb-8">Contact</h1>

        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          Found a bug, have an idea for a new tool or clock, or just want to say hello? We read every message.
        </p>

        <div className="card-brutal-static p-6 mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">Email</span>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="seo-internal-link text-lg font-mono underline"
          >
            {SUPPORT_EMAIL}
          </a>
          <p className="seo-body text-sm leading-relaxed text-text-muted font-sans font-light mt-3">
            We aim to reply within a few business days. Please include the page URL if you're reporting a bug — it helps us track it down faster.
          </p>
        </div>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Before You Write</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
          For questions about how your data is handled, check the <Link href="/privacy" className="seo-internal-link underline">Privacy Policy</Link> first. For questions about using the site, the <Link href="/terms" className="seo-internal-link underline">Terms of Service</Link> may already have your answer.
        </p>
      </div>
    </>
  );
}
