# Action Plan — The God of Time SEO Audit

Prioritized by impact and effort. Critical items block correct indexing/canonicalization or contain live factual errors; fix those first regardless of anything else on this list.

---

## Phase 1: Critical Fixes (Week 1)

- [ ] **Centralize the domain to `www`.** Update `metadataBase` in `app/layout.tsx`, `BASE_URL` in `app/sitemap.ts`, and the `sitemap` field in `app/robots.ts` to `https://www.thegodoftime.com`. This single change fixes every canonical tag, OG URL, sitemap URL, and JSON-LD `url` field sitewide — confirmed as the top issue by 5 of 9 audit agents independently. Extract into one exported constant so it can't drift again.
- [ ] **Add canonical tags to the 3 missing hub pages** — `app/tools/page.tsx`, `app/clocks/page.tsx`, `app/realms/page.tsx` (the pattern already exists on `app/games/page.tsx`, copy it).
- [ ] **Fix the false feature claims on Click Per Second Test.** Its FAQ and `WebApplication` schema currently claim "auto clicker detection" and "live percentile comparison" that don't exist in `CpsTester.tsx`. Either implement both (a CPS threshold flag is trivial; percentile needs a static distribution table) or rewrite the copy to describe only what the tool actually does.
- [ ] **Add real E-E-A-T signals to `pregnancy-due-date-calculator`** specifically — this is the site's highest YMYL exposure and the one page where competitors (APA, NHS, UpToDate) clearly out-signal it on trust markers, not content quality. A reviewed-date line, `dateModified`/author in schema, and 1-2 outbound citations to ACOG/NHS/Mayo close most of the gap.

## Phase 2: High-Impact Improvements (Weeks 2-3)

- [ ] Add sitewide `Organization` + `WebSite` JSON-LD schema with a `sameAs` array.
- [ ] Add `public/llms.txt`, generated from the existing content registries so it can't go stale.
- [ ] Regenerate `icon-192.png`/`icon-512.png` — currently identical, mislabeled, 562KB files; the single largest resource on the homepage.
- [ ] Add security headers via `next.config.ts`'s `headers()` (nosniff, frame-ancestors, `Referrer-Policy`, scoped `Permissions-Policy`).
- [ ] Server-render a default city-times table on World Clock — it currently ships an empty widget in the initial HTML (`useState([])`, populated only client-side), losing both first-paint UX and content parity against competitors.
- [ ] Investigate and reduce **LCP** on Home/World Clock (7.8s, Poor) and **TBT** on Age Calculator/Countdown Timer (1.2-1.8s) — code-split the shared 72KB chunk (37.6% unused), defer non-critical hydration off the above-the-fold path.
- [ ] Memoize `Intl.DateTimeFormat` instances in `WorldClock.tsx`'s per-second tick (cache per timezone in a `Map`); reuse a single `AudioContext` instead of creating a new one per split-flap character flip.
- [ ] Fix World Clock's mobile touch targets — per-card controls are 22px against a ~44px guideline, with the delete button dangerously close to navigation buttons.
- [ ] Fix the ad-rail layout at ~1600px viewport width, where it currently renders flush against the browser edge with 0px margin.

## Phase 3: Content & Authority (Month 2)

- [ ] Backfill the H2 "sections" content block to the ~40-50 thinnest tool pages (currently under ~400 words vs. the site's own 866-word benchmark pages), prioritizing YMYL-adjacent tools first.
- [ ] Add `WebApplication` schema to the ~77 tool pages and ~21 realm pages currently missing it — lift the generation into the shared template components (`ToolSEOContent`/`RealmLayout`) rather than continuing to hand-add it per page.
- [ ] Fix `/realms/absurd-clocks` to render its own unique registry content instead of silently duplicating `watch-paint-dry`.
- [ ] Add `dateModified`/`lastmod` signals sitewide (sitemap entries + schema blocks).
- [ ] Add per-page or per-category Open Graph images (every page currently shares one sitewide `icon.svg`).
- [ ] Confirm the `support@thegodoftime.com` inbox is actually live and monitored (there's a source-code TODO flagging it as a placeholder), or ship the planned support form.
- [ ] Add print/export functionality to Time Card Calculator and related HR/Payroll tools — the one feature every top competitor for that keyword offers and this site lacks entirely.
- [ ] Delete the confirmed-dead `app/tools/[slug]/page.tsx` placeholder route (101/101 registry tools have dedicated pages; it's unreachable).
- [ ] Add `WebApplication` schema + a populated FAQ to `global-shift-overlap`, the one clock page missing both.

## Phase 4: Monitoring & Iteration (Ongoing)

- [ ] Set up Google Search Console and Bing Webmaster Tools; submit the sitemap.
- [ ] Begin scoped link-building appropriate to a new free-tool site: a Product Hunt launch, free-tool directory submissions, relevant per-calculator subreddit posts, "best free tools" listicle outreach. (Zero backlinks currently — expected for a brand-new site, not a defect, but worth building deliberately from here.)
- [ ] Establish at least one off-site brand channel (YouTube demo clips or genuine Reddit participation) — these correlate most strongly with AI citation per the GEO findings.
- [ ] Re-run the Performance audit once AdSense goes live with a real publisher ID; pre-size the ad-rail containers to the eventual ad slot dimensions to avoid a new CLS regression when real ads start rendering.
- [ ] Add an IndexNow key and push integration for faster Bing/Yandex discovery.

---

*See `FULL-AUDIT-REPORT.md` for complete findings and evidence, `findings/*.md` for per-category detail, and `audit-data.json` for the structured data envelope (used for optional PDF report generation).*
