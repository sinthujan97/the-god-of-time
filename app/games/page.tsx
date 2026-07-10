import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import GamesHero from "@/components/games/GamesHero";
import GamesGrid from "@/components/games/GamesGrid";

export const metadata: Metadata = {
  title: "Daily Time Games | Chrono Vault · Temporal Anchor",
  description:
    "Three free daily time games. Chrono Vault, Temporal Anchor, and Chronal Arborist — precision timing challenges that reset every day. No signup needed.",
  alternates: {
    canonical: "https://thegodoftime.com/games",
  },
  openGraph: {
    title: "Daily Time Games | The God of Time",
    description: "Three free daily time games that reset every day. No signup needed.",
    url: "https://thegodoftime.com/games",
  },
};

const faqs = [
  {
    question: "What are daily time games?",
    answer:
      "Daily time games are precision challenges built around time perception and timing mechanics that reset every 24 hours. Like Wordle for words, each game gives you one daily attempt that updates at midnight, creating a shared daily experience where players compare results."
  },
  {
    question: "How can I play daily games online for free?",
    answer:
      "All three games on this page are completely free with no signup or account required. Visit any game, play your daily attempt, and share your result. Each game resets automatically at midnight UTC so a new challenge is available every day."
  },
  {
    question: "What are the best daily games like Wordle?",
    answer:
      "If you enjoy Wordle's daily-one-attempt format, Temporal Anchor offers a similar word-puzzle experience with a time-travel twist. For reaction-based challenges closer to physical games, Chrono Vault tests pure timing precision in the same once-per-day format."
  },
  {
    question: "What types of daily games are available here?",
    answer:
      "Three categories: precision timing (Chrono Vault — stop the clock at exactly the target time), word puzzle (Temporal Anchor — letters loop through a quantum track), and strategy roguelite (Chronal Arborist — solve chronological puzzles to grow the Seed of Eons in 10 minutes)."
  },
  {
    question: "Can I play daily games on my mobile device?",
    answer:
      "Yes. All three games are fully responsive and work in any mobile browser without downloading an app. Touch controls are supported for each game. The daily challenge syncs by date so your progress is the same whether you play on desktop or mobile."
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Daily Time Games",
  description: "Three free daily time-based puzzle games",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Chrono Vault", url: "https://thegodoftime.com/games/chrono-lock" },
    { "@type": "ListItem", position: 2, name: "Temporal Anchor", url: "https://thegodoftime.com/games/temporal-anchor" },
    { "@type": "ListItem", position: 3, name: "Chronal Arborist", url: "https://thegodoftime.com/games/chronal-arborist" },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "The God of Time", item: "https://thegodoftime.com" },
    { "@type": "ListItem", position: 2, name: "Daily Time Games", item: "https://thegodoftime.com/games" },
  ],
};

export default function GamesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav className="breadcrumb max-w-5xl mx-auto px-6 pt-6" aria-label="breadcrumb">
        <Link href="/" className="breadcrumb-link">The God of Time</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">Daily Time Games</span>
      </nav>

      <GamesHero />
      <GamesGrid />

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="seo-content-zone" style={{ "--group-accent": "var(--accent-game)" } as React.CSSProperties}>
          <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-4 mb-4 font-sans">
            How Daily Time Games Work
          </h2>
          <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light mb-8">
            Each game resets at midnight UTC, giving everyone the same fresh challenge on the same daily schedule. There's one attempt per day — no replays, no do-overs, which is exactly what makes daily games like Wordle so compelling: the result you get is the result you're stuck with, and that shared constraint is what makes comparing scores with other players interesting. Share your result each day the same way Wordle players share their grid, without needing to reveal the actual puzzle. The three games here are deliberately built around different skills — Chrono Vault tests raw timing precision, Temporal Anchor tests vocabulary under pressure, and Chronal Arborist tests longer-form strategic patience — so the daily challenges rotate mentally without asking players to master a single narrow mechanic.
          </p>

          <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-8 mb-4 font-sans">
            The Three Games
          </h2>
          <div className="mb-8">
            <h3 className="seo-h3 text-lg font-medium text-text-primary mt-4 mb-2 font-sans">
              <Link href="/games/chrono-lock" className="seo-internal-link" style={{ color: "var(--accent-game)" }}>Chrono Vault</Link>
            </h3>
            <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
              A precision timing challenge. Freeze a running clock at exactly the right moment, unit by unit — miss the hour and you lose everything you've built. One shot, once a day.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="seo-h3 text-lg font-medium text-text-primary mt-4 mb-2 font-sans">
              <Link href="/games/temporal-anchor" className="seo-internal-link" style={{ color: "var(--accent-game)" }}>Temporal Anchor</Link>
            </h3>
            <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
              A word game with a quantum time-loop letter track. Fire at the noise, spare the artifact — four wrong shots collapse the timeline. Tests vocabulary and quick judgment under pressure.
            </p>
          </div>
          <div className="mb-8">
            <h3 className="seo-h3 text-lg font-medium text-text-primary mt-4 mb-2 font-sans">
              <Link href="/games/chronal-arborist" className="seo-internal-link" style={{ color: "var(--accent-game)" }}>Chronal Arborist</Link>
            </h3>
            <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">
              A 10-minute roguelite. Solve chronological puzzles to grow the Seed of Eons through 10 stages, reaching Golden Maturity before the timeline collapses. The longest and most strategic of the three.
            </p>
          </div>

          <div className="faq-section mt-12">
            <h2 className="seo-h2 text-[22px] font-semibold text-text-primary mt-12 mb-4 font-sans border-t border-border-subtle pt-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div key={idx} className="faq-item">
                  <h3 className="seo-h3 text-lg font-medium text-text-primary mt-6 mb-2 font-sans">{faq.question}</h3>
                  <p className="seo-body text-base leading-relaxed text-text-primary font-sans font-light">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
