import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The God of Time",
  description:
    "The God of Time is a free hub of 100+ time and date calculators, clocks, cosmic realms, and daily games. No signup, no cost, no accounts.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About | The God of Time",
    description:
      "The God of Time is a free hub of 100+ time and date calculators, clocks, cosmic realms, and daily games.",
    url: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <nav className="breadcrumb max-w-3xl mx-auto px-6 pt-6" aria-label="breadcrumb">
        <Link href="/" className="breadcrumb-link">The God of Time</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">About</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-primary mt-6 mb-8">About The God of Time</h1>

        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          The God of Time is a free hub built around a single idea: every calculation, clock, or countdown you need for time and dates should be one click away, with no signup, no account, and no cost. It started as a collection of utility calculators and has grown into three distinct sections — Utility Tools, Clocks, and Fun Realms — plus a set of daily games, all built around the same underlying obsession with time.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">What's Here</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-4">
          <strong>Utility Tools</strong> is a library of over 100 free calculators covering payroll and HR (time card calculators, overtime pay, biweekly timesheets), health and lifecycle milestones (pregnancy due dates, age calculators, ovulation tracking), scheduling and project planning, and general date arithmetic (days between dates, leap years, time zone conversion). Each one is built to answer a specific question fast, with no ads blocking the actual tool and no forced signup to see a result.
        </p>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-4">
          <strong>Clocks</strong> covers everything from precision stopwatches and interval timers to world clocks, sunrise/sunset calculators, and novelty clocks that measure your reaction time or working memory instead of just the hour. Most run entirely in your browser, several persist your preferences locally so they're ready the next time you visit, and none require an account.
        </p>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          <strong>Fun Realms</strong> and the daily games are the site's more experimental corner — interactive explorations of deep time, relativity, and cosmic scale, plus a small set of timing-based daily challenges that reset every 24 hours. They exist because time is more interesting than a spreadsheet, and we wanted a place to show that.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Why Free</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
          Every tool, clock, and game on this site is free to use, with no account required and no feature locked behind a paywall. The site is supported by advertising rather than subscriptions, which is why you may see ads alongside the tools — see our <Link href="/privacy" className="seo-internal-link underline">Privacy Policy</Link> for details on how that works.
        </p>

        <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">Get in Touch</h2>
        <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
          Found a bug, have a tool idea, or just want to say hello? Visit the <Link href="/contact" className="seo-internal-link underline">Contact page</Link>.
        </p>
      </div>
    </>
  );
}
