"use client";

import { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { RealmLayout } from "@/components/realms/RealmLayout";
import { realmsRegistry } from "@/lib/data/realmsRegistry";
import { BirthDatePicker } from "@/components/ui";

// ─── Dataset ─────────────────────────────────────────────────────────────────

type Category = "tech" | "company" | "invention" | "culture" | "scifi";

type TimelineEvent = {
  year: number;
  name: string;
  category: Category;
  emoji: string;
  description: string;
};

const EVENTS: TimelineEvent[] = [
  // Tech / company
  { year: 1994, name: "Yahoo!",          category: "company",   emoji: "🔍", description: "One of the first web directories and search engines." },
  { year: 1994, name: "Amazon",          category: "company",   emoji: "📦", description: "Started as an online bookstore by Jeff Bezos." },
  { year: 1995, name: "eBay",            category: "company",   emoji: "🛒", description: "Online auction and marketplace, launched September 1995." },
  { year: 1995, name: "JavaScript",      category: "invention", emoji: "⚡", description: "Programming language created in 10 days by Brendan Eich at Netscape." },
  { year: 1995, name: "GPS (civilian)",  category: "invention", emoji: "📡", description: "Civilian GPS use was enabled by the US government in 1995." },
  { year: 1996, name: "Hotmail",         category: "company",   emoji: "📧", description: "One of the first web-based email services, later acquired by Microsoft." },
  { year: 1997, name: "Netflix",         category: "company",   emoji: "🎬", description: "Founded as a DVD-by-mail rental service." },
  { year: 1997, name: "Harry Potter",    category: "culture",   emoji: "🧙", description: "Harry Potter and the Philosopher's Stone published June 26, 1997." },
  { year: 1998, name: "Google",          category: "company",   emoji: "🔎", description: "Founded by Larry Page and Sergey Brin at Stanford University." },
  { year: 1998, name: "Bluetooth",       category: "invention", emoji: "📶", description: "Short-range wireless standard released in 1998 by Ericsson." },
  { year: 1998, name: "IMDb",            category: "company",   emoji: "🎞", description: "Internet Movie Database became a subsidiary of Amazon." },
  { year: 1999, name: "Napster",         category: "company",   emoji: "🎵", description: "Peer-to-peer music sharing service that changed the music industry." },
  { year: 2001, name: "Wikipedia",       category: "invention", emoji: "📖", description: "Free online encyclopedia launched January 15, 2001." },
  { year: 2001, name: "iPod",            category: "invention", emoji: "🎧", description: "Apple's portable music player, released October 2001." },
  { year: 2001, name: "Xbox",            category: "invention", emoji: "🎮", description: "Microsoft's first games console, launched November 2001." },
  { year: 2003, name: "LinkedIn",        category: "company",   emoji: "💼", description: "Professional social network founded in December 2002, launched May 2003." },
  { year: 2003, name: "Skype",           category: "company",   emoji: "📞", description: "Internet voice and video calling, launched in August 2003." },
  { year: 2004, name: "Facebook",        category: "company",   emoji: "👤", description: "Social network launched by Mark Zuckerberg from his Harvard dorm room." },
  { year: 2004, name: "Gmail",           category: "tech",      emoji: "📬", description: "Google's email service, launched April 1, 2004 — widely assumed to be an April Fools' joke." },
  { year: 2005, name: "YouTube",         category: "company",   emoji: "▶️", description: "Video sharing platform founded by three former PayPal employees." },
  { year: 2005, name: "Reddit",          category: "company",   emoji: "🤖", description: "Social news and discussion site founded by Steve Huffman and Alexis Ohanian." },
  { year: 2006, name: "Twitter / X",     category: "company",   emoji: "🐦", description: "Microblogging platform where the first tweet was sent by Jack Dorsey." },
  { year: 2006, name: "Spotify",         category: "company",   emoji: "🎶", description: "Music streaming service founded in Sweden, launched publicly in 2008." },
  { year: 2007, name: "iPhone",          category: "invention", emoji: "📱", description: "Apple's first touchscreen smartphone, announced by Steve Jobs on January 9, 2007." },
  { year: 2007, name: "Kindle",          category: "invention", emoji: "📚", description: "Amazon's e-reader, sold out in under 6 hours on its first day." },
  { year: 2008, name: "Android",         category: "tech",      emoji: "🤖", description: "Google's mobile operating system, first appearing on the HTC Dream." },
  { year: 2008, name: "Airbnb",          category: "company",   emoji: "🏠", description: "Short-term rental marketplace started with an air mattress in a San Francisco apartment." },
  { year: 2009, name: "WhatsApp",        category: "company",   emoji: "💬", description: "Messaging app founded by two former Yahoo employees." },
  { year: 2009, name: "Uber",            category: "company",   emoji: "🚗", description: "Ride-sharing app founded after its founders couldn't find a taxi in Paris." },
  { year: 2009, name: "Bitcoin",         category: "invention", emoji: "₿",  description: "Cryptocurrency created by the pseudonymous Satoshi Nakamoto." },
  { year: 2010, name: "Instagram",       category: "company",   emoji: "📷", description: "Photo sharing app that was acquired by Facebook for $1 billion two years later." },
  { year: 2010, name: "iPad",            category: "invention", emoji: "🖥", description: "Apple's tablet computer, creating a new product category." },
  { year: 2011, name: "Snapchat",        category: "company",   emoji: "👻", description: "Disappearing message app created by Stanford students." },
  { year: 2011, name: "Siri",            category: "tech",      emoji: "🗣", description: "Apple's voice assistant, acquired and integrated into the iPhone 4S." },
  { year: 2012, name: "Raspberry Pi",    category: "invention", emoji: "🍓", description: "Credit card-sized single-board computer designed to teach programming." },
  { year: 2013, name: "Tinder",          category: "company",   emoji: "🔥", description: "Dating app that popularised the swipe gesture for matching." },
  { year: 2016, name: "TikTok",          category: "company",   emoji: "🕺", description: "Short-form video platform that became the fastest app to reach 1 billion users." },
  { year: 2020, name: "Zoom (mainstream)", category: "tech",    emoji: "💻", description: "Video conferencing exploded in 2020, adding 2 million users in a single month." },
  { year: 2022, name: "ChatGPT",         category: "tech",      emoji: "🧠", description: "OpenAI's conversational AI, reaching 100 million users faster than any app in history." },
  { year: 2023, name: "GPT-4",           category: "tech",      emoji: "✨", description: "Multimodal AI model, one of the most capable language models ever created." },
  // Sci-fi futures already passed
  { year: 1984, name: "Orwell's 1984",   category: "scifi",     emoji: "📡", description: "George Orwell's dystopian surveillance state — we've been past it for decades." },
  { year: 1992, name: "HAL 9000 activated", category: "scifi",  emoji: "🔴", description: "HAL 9000 from 2001: A Space Odyssey was 'born' on January 12, 1992." },
  { year: 1997, name: "Skynet becomes self-aware", category: "scifi", emoji: "🤖", description: "Terminator's Skynet was supposed to trigger nuclear war on August 29, 1997." },
  { year: 1999, name: "The Matrix",      category: "scifi",     emoji: "💊", description: "The world of The Matrix is set in 1999 — we've already lived through it." },
  { year: 2001, name: "Space Odyssey 2001", category: "scifi",  emoji: "🛸", description: "Kubrick's 2001: A Space Odyssey predicted a manned Jupiter mission by now." },
  { year: 2015, name: "Back to the Future 2015", category: "scifi", emoji: "⚡", description: "Marty McFly's destination: October 21, 2015. No hoverboards arrived." },
  { year: 2019, name: "Blade Runner 2019", category: "scifi",   emoji: "🌃", description: "Blade Runner's Los Angeles of 2019: flying cars, replicants. Still waiting." },
];

const CURRENT_YEAR = new Date().getFullYear();

const CATEGORY_LABELS: Record<Category, string> = {
  tech:      "Technology",
  company:   "Companies",
  invention: "Inventions",
  culture:   "Culture",
  scifi:     "Sci-Fi Futures",
};

const CATEGORY_COLORS: Record<Category, string> = {
  tech:      "#5B7FFF",
  company:   "#C5F135",
  invention: "#F39C12",
  culture:   "#E91E8C",
  scifi:     "#9B59B6",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OlderThan() {
  const pathname = usePathname();
  const slug     = pathname.split("/").pop() ?? "older-than";
  const realm    = realmsRegistry.find((r) => r.slug === slug) ?? realmsRegistry[0];
  const accent   = realm.accent;

  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [error,     setError]     = useState("");
  const [revealed,  setRevealed]  = useState(false);
  const [activeFilter, setActiveFilter] = useState<Category | "all">("all");

  const birthYear = birthDate ? birthDate.getFullYear() : null;

  const younger = useMemo(() => {
    if (!birthYear) return [];
    return EVENTS.filter((e) => e.year > birthYear && e.year <= CURRENT_YEAR);
  }, [birthYear]);

  const scifiPassed = useMemo(
    () => younger.filter((e) => e.category === "scifi"),
    [younger]
  );

  const categories = useMemo(
    () => [...new Set(younger.map((e) => e.category))],
    [younger]
  );

  const filtered = useMemo(() => {
    if (activeFilter === "all") return younger.filter((e) => e.category !== "scifi");
    if (activeFilter === "scifi") return scifiPassed;
    return younger.filter((e) => e.category === activeFilter);
  }, [younger, scifiPassed, activeFilter]);

  const handleReveal = () => {
    if (!birthDate) { setError("Please enter your birth date."); return; }
    if (birthDate > new Date()) { setError("Birth date cannot be in the future."); return; }
    setError("");
    setRevealed(true);
  };

  return (
    <RealmLayout
      realm={realm}
      controlsSection={
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <BirthDatePicker
              id="ot-birth"
              label="Your Birth Date"
              value={birthDate}
              onChange={(val) => { setBirthDate(val); setError(""); setRevealed(false); }}
            />
            {error && (
              <p className="text-[11px] font-sans text-accent-utility-e mt-0.5">{error}</p>
            )}
          </div>

          <button
            onClick={handleReveal}
            disabled={!birthDate}
            className="calculate-btn disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: accent, boxShadow: "3px 3px 0 var(--border)" }}
          >
            Show What&apos;s Younger Than Me
          </button>

          {revealed && younger.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-border pt-5 mt-1">
              <p className="text-[10px] font-sans font-semibold tracking-wider text-text-muted uppercase mb-1">
                Summary
              </p>
              {([
                ["Things younger than you", younger.length.toString()],
                ["Sci-fi futures outlived",  scifiPassed.length.toString()],
                ["Born before the internet", birthYear && birthYear < 1991 ? "Yes" : "No"],
              ] as [string, string][]).map(([label, value]) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="text-text-muted font-sans">{label}</span>
                  <span className="font-mono text-text-primary font-semibold" style={{ color: accent }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      }
      canvasSection={
        <div className="flex flex-col w-full">
          {revealed && younger.length > 0 ? (
            <div className="p-4 md:p-5 flex flex-col gap-4">
              <p
                className="font-display font-light italic text-text-primary leading-tight"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)" }}
              >
                You are older than {younger.length} things.
              </p>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                  style={{
                    border: "2px solid var(--border)",
                    background: activeFilter === "all" ? accent : "var(--bg-card)",
                    color: activeFilter === "all" ? "#0A0A0A" : "var(--text-muted)",
                    boxShadow: activeFilter === "all" ? "2px 2px 0 var(--shadow-color)" : "none",
                  }}
                >
                  All ({younger.filter((e) => e.category !== "scifi").length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className="px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider transition-all"
                    style={{
                      border: "2px solid var(--border)",
                      background: activeFilter === cat ? CATEGORY_COLORS[cat] : "var(--bg-card)",
                      color: activeFilter === cat ? "#0A0A0A" : "var(--text-muted)",
                      boxShadow: activeFilter === cat ? "2px 2px 0 var(--shadow-color)" : "none",
                    }}
                  >
                    {CATEGORY_LABELS[cat]} ({younger.filter((e) => e.category === cat).length})
                  </button>
                ))}
              </div>

              {/* Event list */}
              <div className="flex flex-col gap-2">
                {filtered.map((event) => (
                  <div
                    key={`${event.year}-${event.name}`}
                    className="flex items-start gap-3 p-3 transition-all duration-150"
                    style={{
                      border: "2px solid var(--border)",
                      background: "var(--bg-card)",
                      boxShadow: "2px 2px 0 var(--shadow-color)",
                    }}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{event.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-sans text-sm font-semibold text-text-primary">{event.name}</span>
                        <span
                          className="px-1.5 py-0.5 text-[9px] font-sans font-bold uppercase tracking-wider"
                          style={{
                            background: CATEGORY_COLORS[event.category],
                            color: "#0A0A0A",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {event.year}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-text-faint leading-snug mt-0.5">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sci-fi section (always shown at bottom unless filtered) */}
              {activeFilter === "all" && scifiPassed.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setActiveFilter("scifi")}
                    className="w-full p-4 text-left transition-all duration-150"
                    style={{
                      border: `2px solid ${CATEGORY_COLORS.scifi}`,
                      background: `${CATEGORY_COLORS.scifi}11`,
                      boxShadow: `3px 3px 0 ${CATEGORY_COLORS.scifi}44`,
                    }}
                  >
                    <p className="font-sans text-xs font-bold uppercase tracking-wider" style={{ color: CATEGORY_COLORS.scifi }}>
                      ✦ Sci-Fi Futures You&apos;ve Already Outlived →
                    </p>
                    <p className="font-sans text-[11px] text-text-faint mt-1">
                      {scifiPassed.length} fictional futures are now your past — Skynet, The Matrix, Blade Runner 2019…
                    </p>
                  </button>
                </div>
              )}
            </div>
          ) : revealed && younger.length === 0 ? (
            <div className="px-5 py-14 flex flex-col items-center text-center border-t border-border">
              <p className="font-display font-light italic text-text-muted text-2xl mb-2">
                You predate our database.
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[48ch] leading-relaxed">
                Everything in our timeline appeared after your birth. You are older than the entire modern internet era.
              </p>
            </div>
          ) : (
            <div className="px-5 py-16 flex flex-col items-center text-center border-t border-border">
              <p
                className="font-display font-light italic text-text-muted leading-[1.2] mb-3 text-balance"
                style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.75rem)" }}
              >
                Are you older than Google?
              </p>
              <p className="font-sans text-sm text-text-faint max-w-[52ch] leading-relaxed">
                Enter your birth date to see every company, invention, and cultural moment younger than you — including the sci-fi futures you've already outlived.
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}
