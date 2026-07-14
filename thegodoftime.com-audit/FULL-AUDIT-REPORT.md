# Full SEO Audit — The God of Time (thegodoftime.com)

**Date:** July 2026
**Live URL audited:** https://www.thegodoftime.com (apex `thegodoftime.com` 308-redirects to `www`)
**Method:** 9 parallel specialist audits (technical, content, schema, sitemap, performance, visual, GEO/AI search, SXO, backlinks) combining live-site testing (curl, real Lighthouse runs, headless-browser screenshots, WebSearch SERP research) with direct read access to the site's own Next.js 15 source code at `d:\the_god_of_time` — an accuracy advantage most external audits don't have.

> Note: this machine did not have the seo-audit skill's own `scripts/` Python tooling installed. All agents worked around this using `curl`, `WebFetch`/`WebSearch`, real Lighthouse CLI runs, a headless-browser CLI, and direct codebase reads instead. This is disclosed for transparency; it did not meaningfully limit coverage.

---

## Executive Summary

### Overall SEO Health Score: **62 / 100**

| Category | Score | Weight |
|---|---|---|
| Technical SEO | 58 | 22% |
| Content Quality | 74 | 23% |
| On-Page SEO | 65 | 20% |
| Schema / Structured Data | 58 | 10% |
| Performance (CWV) | 55 | 10% |
| AI Search Readiness (GEO) | 61 | 10% |
| Images | 40 | 5% |

Supplementary categories (outside the core weighting, still valuable): **Sitemap Structure 80**, **Visual & Mobile 84**, **Search Experience (SXO) 58**, **Backlinks 10** (expected for a brand-new site — not a defect).

**Business type detected:** Free utility SaaS / content-tool hybrid — 100+ time & date calculators, clocks, cosmic "realms" experiences, and daily games. No e-commerce, no local/brick-and-mortar signals, so `seo-local`, `seo-maps`, and `seo-ecommerce` were correctly not spawned.

### Top 5 Critical Issues

1. **Every canonical URL, OG URL, sitemap entry, and JSON-LD `url` field points at the apex domain**, which itself 308-redirects to `www.thegodoftime.com` — confirmed independently by **5 of 9** audit agents (technical, schema, sitemap, geo, backlinks). This is the single highest-confidence finding of the entire audit.
2. **`/tools`, `/clocks`, and `/realms` — three of the site's four top-level hub pages — have no canonical tag at all.**
3. **The Click Per Second Test page's FAQ and schema claim features that don't exist in the code** ("auto clicker detection," "live percentile comparison") — a live factual-accuracy defect, not a hypothetical risk.
4. **No sitewide Organization/WebSite schema and no `llms.txt`** — the site has no structured brand-entity signal for either traditional knowledge panels or AI/LLM retrieval.
5. **Homepage and World Clock measure Poor LCP (7.8s, mobile lab); Age Calculator and Countdown Timer measure severe Total Blocking Time (1.2–1.8s)** — all four driven by main-thread JS/hydration cost, not network (TTFB is consistently good, 70–194ms).

### Top 5 Quick Wins

1. Fix the apex→www domain mismatch in exactly 3 files — highest leverage, lowest effort item in the whole audit.
2. Add `alternates.canonical` to the 3 hub pages missing it (3-line fix each, existing pattern already used elsewhere).
3. Regenerate `icon-192.png`/`icon-512.png` — currently byte-identical, mislabeled, 562KB files; confirmed the single largest resource loaded on the homepage.
4. Correct the false feature claims on the Click Per Second Test page.
5. Delete the confirmed-dead `app/tools/[slug]/page.tsx` placeholder route (101/101 registry tools already have dedicated pages; it's unreachable).

---

## Technical SEO (58/100)

**What works:** Redirect hygiene is otherwise clean (single-hop, correct trailing-slash normalization, ~46 legacy slugs correctly redirected). Every page is fully server-rendered with real content and links in the raw HTML — no `"use client"` in any route file, confirmed via curl. Structured data (WebApplication/BreadcrumbList/FAQPage) is present and correctly typed. The 171-URL sitemap is dynamically generated from the same registries that drive routing, so new pages get sitemap coverage automatically. No image-weight risk to LCP (no `<img>`/`next/image` usage beyond small icons).

**Findings:**
- **Critical** — Canonical/OG/sitemap all point to the apex domain, which 308-redirects to `www`. Fix: standardize on `www` everywhere (it's the domain that actually serves 200s), centralized into one constant.
- **High** — `/tools`, `/clocks`, `/realms` have no canonical tag.
- **High** — No security headers beyond automatic HSTS (no CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- **Medium** — No IndexNow implementation.
- **Medium** — `robots.txt`'s `Sitemap:` directive points at the redirecting apex host.
- **Info** — `ads.txt` returns 404. This is intentional and expected — no AdSense publisher ID exists yet.

---

## Content Quality (74/100)

**What works:** Content is hand-written and factually specific (real formulas: Naegele's Rule, IVF transfer-date offsets, industry pay-differential benchmarks), not generic AI boilerplate. All 101 tool pages emit valid `FAQPage` JSON-LD with genuine Q&A pairs. Registry/folder integrity is excellent — every registry tool has a dedicated page, and the feared `[slug]` placeholder fallback was verified to be dead, unreachable code rather than live thin content. The Privacy Policy is specific and transparent (names Google Analytics/AdSense by name, with working opt-out links) rather than a generic template.

**Findings:**
- **Medium** — `/realms/absurd-clocks` is a live near-duplicate of `/realms/watch-paint-dry`: it's reachable via the realms `[slug]` catch-all and renders the identical component, but the unique SEO content already written for it in `realmsRegistry.ts` is never actually rendered — that content is dead data sitting unused.
- **Medium-High** — No author/organization/named-entity E-E-A-T signal anywhere; no visible "not medical/legal advice" disclaimer on individual YMYL-adjacent tool pages (it's covered site-wide in Terms, but not on the pages themselves).
- **Medium** — The Contact page's support email is flagged by a source-code TODO as a placeholder pending real setup, while the page's own copy claims "we read every message."
- **Medium** — ~70% of tool pages are under ~400 words, well below the site's own best pages (up to 866 words) — not thin in the AI-slop sense, but under-serving topical coverage.
- **Low** — No content freshness/last-updated signals anywhere.
- **Low** — The `[slug]` placeholder route is confirmed dead code — safe to delete as cleanup, not urgent.

---

## On-Page SEO (65/100)

**What works:** Title tags and meta descriptions are consistently unique and appropriately scoped across the site. Single H1 per page with logical heading hierarchy. Internal linking is dense and genuinely relevant (breadcrumbs, related-tool rails, cross-links between sections).

**Findings:**
- **High** — 3 of 4 top-level hub pages missing canonical tags (see Technical SEO).
- **High** — Click Per Second Test page content overclaims: the WebApplication `featureList` and an on-page FAQ describe auto-clicker detection and live percentile comparison that don't exist in `CpsTester.tsx` (no detection logic exists; the score panel is a static rank-tier lookup). Either build the two claimed features or correct the copy.
- **High** — World Clock ships with **zero city times in server-rendered HTML** — city state is seeded `useState([])` and only populated in a mount effect, so crawlers and first paint see an empty widget with none of the content-parity a static reference table (like competitors offer) would provide.
- **Medium** — Genuine competitive differentiators are buried mid-paragraph instead of surfaced as a scannable "why this tool" checklist for comparison-shopping searchers.

---

## Schema & Structured Data (58/100)

**What works:** `BreadcrumbList` is applied almost universally via shared layout components. `FAQPage` generation is templatized and DRY. No deprecated schema types found anywhere. Existing `WebApplication` blocks are well-formed with no placeholder text.

**Findings:**
- **High** — No sitewide `Organization`/`WebSite` schema exists anywhere in the codebase — no `sameAs`, no entity signal, not eligible for a Sitelinks Search Box.
- **High** — All JSON-LD `url`/`item` values use the redirecting apex domain (same root cause as the Technical finding).
- **Medium** — Only ~25% of tool pages (25/102) have `WebApplication` schema — it was added ad hoc rather than built into the shared template.
- **Medium** — Only 4 of 25 built realm pages have `WebApplication` schema, same pattern.
- **Medium** — `global-shift-overlap` is the one clock page (of 32) with zero structured data beyond `BreadcrumbList`.
- **Low** — An empty, unbuilt `app/clocks/split-flap-planner/` directory exists with no page and no registry entry.
- **Info** — FAQ rich results in Google's SERP were substantially restricted industry-wide some time ago (per the auditing agent's general knowledge — this specific claim was not independently re-verified via live search this session, so treat the exact policy date with a grain of salt, but the underlying caveat is directionally sound). The FAQ schema still has real value for AI/LLM citation regardless — keep it, just don't expect a Google rich-result snippet from it alone.

---

## Performance / Core Web Vitals (55/100)

Measured via **real Lighthouse runs** (mobile, simulated throttling) on four representative pages: Home, Age Calculator, World Clock, Countdown Timer.

**What works:** TTFB is genuinely good site-wide (70–194ms) — Vercel hosting is not the bottleneck. Font loading is well-implemented (self-hosted via `next/font`, no font-display issues). CLS is essentially solved (3 of 4 pages exactly 0; the 4th at a comfortable 0.084). Third-party script hygiene is good — GA loads non-blocking, and the AdSense loader is correctly environment-gated and confirmed absent from every network trace.

**Findings:**
- **High** — Home and World Clock LCP measured **Poor (7.8s)**, driven by 1.6s+ of Script Evaluation and 1.0–1.1s of Style & Layout work blocking the main thread before the LCP text node can paint — not a network problem.
- **High** — Age Calculator and Countdown Timer have severe Total Blocking Time (**1,767ms** and **1,222ms**), driven by single 500–640ms hydration tasks plus a shared 72KB chunk that's 37.6% unused.
- **Medium** — `icon-192.png`/`icon-512.png` are byte-identical, mislabeled 562KB files — the single largest resource fetched on the homepage, larger than all JS combined.
- **Medium** — World Clock's per-second tick creates 2-3 new `Intl.DateTimeFormat` objects per pinned city, every second, none memoized — a real recurring main-thread cost during sustained use, an INP risk not fully captured by a single load trace.
- **Medium** — `gtag.js` is deferred correctly but is still 163.7KB with 41.98% unused, appearing in long-tasks on every page.
- **Low** — The compiled global CSS bundle (~27KB) is render-blocking on every page (~150-166ms each).

---

## AI Search Readiness / GEO (61/100)

**What works:** Genuinely citable FAQ content at scale — specific, number-anchored answers correctly wrapped in schema and confirmed present in raw pre-JS HTML. `robots.txt` is fully open to AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot). Solid SSR foundation confirmed via `X-Nextjs-Prerender` — even client components deliver full content server-side.

**Findings:**
- **High** — No `llms.txt` exists at all.
- **High** — No sitewide Organization/WebSite schema and zero cross-platform brand signals (no `sameAs`, no outbound social links in the Footer) — YouTube/Reddit/Wikipedia mentions correlate most strongly with AI citation, and none exist here.
- **Medium** — No authorship/freshness signals anywhere (zero `<lastmod>` across all 171 sitemap URLs).
- **Medium** — Near-zero multi-modal content — no images/video in SEO content components, no per-page OG images.
- **Low** — `robots.txt` has no *explicit, documented* AI-crawler policy (it's open by omission, not by deliberate stated rule) and its sitemap URL forces a redirect.

---

## Images (40/100)

**What works:** Low broken-alt-text surface area, since the site deliberately uses almost no photographic/illustrative imagery.

**Findings:**
- **Medium** — Primary PWA icons are broken (see Performance).
- **Medium** — No per-page Open Graph images — every page shares one sitewide `icon.svg`, a missed social-share differentiation opportunity.
- **Low** — Near-zero illustrative/explanatory imagery anywhere in tool/clock content (cross-referenced with the GEO finding on multi-modal content).

---

## Supplementary: Sitemap Structure (80/100)

Fully dynamic and registry-driven with verified-correct dedup logic (zero duplicate URLs across 171 entries; the `isExistingTool` clock-vs-tool dedup was tested live and works correctly). Registry-to-route arithmetic reconciles exactly with zero orphaned pages. The one real issue is the same apex/www mismatch documented above.

## Supplementary: Visual & Mobile (84/100)

The highest score in the audit. Strong above-the-fold content on both desktop and mobile, a well-built mobile nav overlay, consistent theming, zero console errors and zero horizontal overflow across every page/viewport tested. Real issues found: World Clock's per-card controls fail minimum mobile touch-target size (22px vs. ~44px guideline) with the delete button dangerously close to navigation buttons; the floating ad rails render flush against the browser edge at the common 1600×900 resolution; minor breadcrumb/H1 truncation on long tool names; the homepage's live stat widget is awkwardly bisected by the mobile fold.

## Supplementary: Search Experience / SXO (58/100)

SERP-backwards analysis of 4 sample keywords found the site's tool-first layout correctly matches what's rewarded for transactional/utility queries. The standout finding: **pregnancy-due-date-calculator lacks the reviewer credentials, dates, and citations every top competitor (APA, NHS, UpToDate) carries** for this YMYL-adjacent query — flagged Critical by this agent specifically because of the medical-adjacency, even though the content itself is accurate and appropriately hedged. Also independently found the Click Per Second Test overclaiming issue and the World Clock empty-first-paint issue.

## Supplementary: Backlinks (10/100 — expected baseline, not a defect)

Checked Common Crawl, Wayback Machine, and Hacker News (no Moz/Bing/DataForSEO credentials available). Zero referring domains found anywhere — entirely expected for a site with weeks-old content and no outreach run yet. No evidence of any toxic/penalized history. The report frames this honestly as a starting line with scoped, appropriate first steps (Product Hunt, free-tool directories, per-calculator subreddit posts) rather than generic "build more links" advice.

---

*Full per-category findings with complete evidence are in `findings/*.md`. Screenshots are in `screenshots/`. See `ACTION-PLAN.md` for the prioritized, phased implementation plan.*
