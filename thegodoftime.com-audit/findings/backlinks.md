# Backlink Profile Audit — The God of Time (thegodoftime.com)

Audited: 2026-07-14
Live domain tested: https://www.thegodoftime.com (apex `thegodoftime.com` 308-redirects to `www`)
Site context: genuinely new/young site — first content batches only weeks old as of this audit, no deliberate link-building campaign has been run yet.

**Tooling note (important):** This machine does not have the seo-audit skill's `scripts/` directory installed (`backlinks_auth.py`, `commoncrawl_graph.py`, `verify_backlinks.py`, `moz_api.py`, `bing_webmaster.py` are all missing — confirmed via directory listing). No Moz, Bing Webmaster Tools, or DataForSEO credentials/MCP are configured either. All data below was gathered directly via `curl` against free, public, unauthenticated APIs, since the standard skill scripts were unavailable. Every metric is labeled with the exact source queried.

**Backlink Health Score: INSUFFICIENT DATA (not a numeric score)** — see rationale below.

---

## Data Sources Actually Used vs. Unavailable

| Source | Status | Confidence |
|---|---|---|
| Common Crawl CDX API (`index.commoncrawl.org`) | Queried directly, 8 monthly indexes (Nov 2025 – Jun 2026) | 0.50 (domain-level, when data exists) |
| Wayback Machine CDX API (`web.archive.org/cdx`) | Queried directly | 0.40 (archival footprint, not a backlink source, used for context only) |
| Hacker News (Algolia search API) | Queried directly, free/no auth | 0.50 (mention-detection only, not a link authority source) |
| Reddit public search JSON | Attempted — blocked (returned an HTML interstitial instead of JSON, likely bot/consent-wall); **inconclusive, not used as evidence either way** | n/a |
| DuckDuckGo / Bing HTML scraping | Attempted as a cross-check — both returned JS-shell/bot-detection pages with no parseable organic results; **inconclusive, not used as evidence either way** | n/a |
| Moz API (metrics/domains/anchors/pages) | Not available — no API key configured on this machine | — |
| Bing Webmaster Tools API | Not available — not configured | — |
| DataForSEO MCP | Not available — not installed | — |
| Known-backlinks verification (`verify_backlinks.py`) | Not run — script missing, and no candidate backlink list was supplied | — |

Because the two highest-confidence free sources (Common Crawl and Moz) are either empty-result or entirely unavailable, and Reddit/DDG/Bing scraping attempts were inconclusive rather than genuine negative evidence, **zero of the seven confidence-weighted scoring factors (referring domains, domain quality distribution, anchor text naturalness, toxic link ratio, link velocity, follow/nofollow ratio, geographic relevance) have real data to score against.** Per the Tier-0 rule ("fewer than 4 scoring factors have data → report INSUFFICIENT DATA, not a numeric score"), this report does not assign a fabricated numeric backlink score. It is not appropriate to score a link profile that, by every free measurement available, does not yet exist in a form external sources have observed.

---

## Info

### 1. Domain has zero footprint in Common Crawl's index (expected for site age)
**Severity:** Info

**Description:** Queried the Common Crawl CDX API directly (`https://index.commoncrawl.org/{index}-index?url=thegodoftime.com*`) against eight monthly crawl indexes spanning `CC-MAIN-2025-47` (November 2025) through `CC-MAIN-2026-25` (the current index, covering June 5–18, 2026) for both `thegodoftime.com*` and `www.thegodoftime.com`. Every single query returned:
```
HTTP 404 — {"message": "No Captures found for: thegodoftime.com"}
```
The domain is not present in Common Crawl's host graph at all — meaning no in-degree, PageRank, harmonic centrality, or referring-domain data can be derived from it, not even at low confidence. This is the expected outcome for a site whose first content batches are only weeks old: Common Crawl discovers new hosts primarily by following outlinks from pages it has already crawled, and it only recrawls/re-seeds on a monthly cadence. A brand-new domain with no inbound links yet and no prior crawl history has no path into the index until (a) something already-crawled links to it, or (b) enough time passes for CC's broader seed/discovery process to catch it independently.

**Recommendation:** No technical fix needed — this is not a defect. It will resolve naturally once (1) the site accumulates any inbound links from pages CC already crawls, or (2) subsequent monthly CC indexes run. To help this along indirectly: submit the sitemap to Google Search Console and Bing Webmaster Tools (separate systems from Common Crawl, but faster-moving) so the primary search engines index the site quickly, and prioritize the link-building first steps in the Recommendations section below — every inbound link from an already-indexed site (a subreddit thread, a directory listing, a listicle) is also a potential discovery path into Common Crawl's next crawl cycle.

### 2. Zero referring domains found via free public sources (expected baseline, not a defect)
**Severity:** Info

**Description:** Cross-checked for any organic mentions/links via Hacker News's public Algolia search API (`hn.algolia.com/api/v1/search`) for both `thegodoftime.com` and `"God of Time" calculators` — **0 hits** on both queries. Reddit's public search JSON endpoint returned a bot/consent-wall HTML page instead of results, and manual DuckDuckGo/Bing HTML scraping attempts were both blocked by bot-detection shells with no parseable results — those two are logged as **inconclusive, not evidence of zero mentions**, per the "don't state unobserved things as fact" rule. Combined with the confirmed-empty Common Crawl result above, the honest picture is: no referring domains have been found through any source this audit could actually query, which is exactly the expected baseline for a site with first content only weeks old and no deliberate outreach yet — not a sign of a penalty, technical block, or broken site.

**Recommendation:** Treat this as a starting line, not a problem to remediate. See the dedicated "First Link-Building Steps" section below for concrete, appropriately-scoped next actions for a free utility-tool site at this stage.

### 3. Wayback Machine shows one unrelated legacy snapshot predating the current site by ~8 years
**Severity:** Info

**Description:** Queried the Wayback Machine's CDX API (`web.archive.org/cdx/search/cdx?url=thegodoftime.com*`). It returned exactly **one** archived capture in the domain's entire history: a `robots.txt` snapshot dated `2018-07-26` (`http://thegodoftime.com/robots.txt`, HTTP 200, non-www, no `https`). No captures of any actual page content exist at any point since — not in 2018, and not since the current site launched. This indicates the domain was likely registered and briefly parked or minimally configured under prior ownership roughly eight years ago, unrelated to the current Next.js site, and was never meaningfully crawled by the Internet Archive's bot either then or since.

**Recommendation:** Not an actionable backlink item — this is domain-history context, not a link signal. Worth a quick manual WHOIS/domain-history sanity check (outside this skill's scope; not something Common Crawl, HN, or Wayback can confirm) to rule out any residual spam or penalty history attached to the domain from its pre-2018 registration. Given the single archived asset is an innocuous `robots.txt` with no other captures, there is no indication of prior spam/adult/malware use, but a WHOIS history check is the only way to fully rule it out. If clean (likely), no further action needed.

### 4. Canonical host inconsistency will matter once inbound links start arriving (cross-reference)
**Severity:** Info

**Description:** `findings/technical.md` (Finding #1, rated Critical there) already documents that the site's sitemap, canonical tags, and OG URLs currently point at the apex `thegodoftime.com`, which 308-redirects to the actually-served `www.thegodoftime.com`. This is flagged here only because it is directly relevant to backlink equity: once external sites start linking to the domain (from directories, listicles, Reddit threads, etc.), any link built against a URL copied from the sitemap or `<link rel=canonical>` tag will point at the apex host and take an extra redirect hop before consolidating on `www`. Search engines generally handle a single 308 hop fine, but it is one avoidable inefficiency for a site that will want every incoming link signal it earns to consolidate cleanly.

**Recommendation:** No new action needed from a backlinks perspective — this is already tracked and prioritized as a Critical technical-SEO fix in `findings/technical.md`. Once fixed there (making `www` the canonical host everywhere in code), any future backlinks will resolve directly to the canonical URL. Do not duplicate the technical fix here; see `findings/technical.md` for the full remediation.

---

## What Works

- **Nothing is technically blocking future backlink accumulation or discovery.** `robots.txt` returns `200` with `Allow: /` (no accidental disallow), and `sitemap.xml` is live, well-formed, and populated with 100+ URLs covering tools, clocks, realms, and games — so once any external source links in, crawlers have a clean, complete path to the rest of the site.
- **No evidence of a toxic, spammy, or penalized backlink/domain history.** The single artifact found in the Wayback Machine (a bare `robots.txt` from 2018) shows no signs of prior adult/malware/spam content, and no source consulted (Common Crawl, HN, Wayback) surfaced any negative-SEO or link-spam pattern.
- **Genuinely link-worthy content foundation.** 100+ free, working interactive calculators, clocks, and games is exactly the kind of content that organically attracts the link types available to a young utility site — "free tools" roundup listicles, Reddit/forum recommendations, and directory listings — unlike thin or gated content that gives reviewers/curators nothing to link to.
- **Clean single-hop apex→www redirect** (confirmed `308` with no chain) means that once the canonical-host fix in `findings/technical.md` ships, all future inbound link equity will consolidate on one host with no additional redirect cleanup required.
- **Honest, verifiable starting point.** Every free channel checked (Common Crawl, Wayback, HN) agrees: this is a domain with no backlink history yet, cleanly and consistently, rather than a confusing mixed signal — which makes it straightforward to measure real progress against as link-building begins.

---

## First Link-Building Steps (Forward-Looking, Appropriate to Site Stage)

Generic "build high-authority backlinks" advice doesn't fit a brand-new, free, ad-supported utility-tool site with no outreach budget or track record. The following is scoped specifically to what a site like this — a Product Hunt-style directory of 100+ time/date calculators, clocks, cosmic "realms" experiences, and daily games — can realistically pursue first, in rough priority order:

1. **Launch on Product Hunt.** A polished, free, genuinely useful tool directory is a strong PH fit. A single well-prepared launch (good tagline, screenshots/GIFs of the more novel features like the "realms" experiences, first-comment context from the maker) is one of the highest-leverage first moves — it drives a real referring domain (producthunt.com), plus secondary pickup from PH-watching newsletters/aggregators.
2. **Submit to free-tool and utility directories.** Concrete, relevant targets for this kind of site: AlternativeTo, SaaSHub, Uneed, TinyLaunch, BetaList, Indie Hackers (as a "Product" and in relevant forum threads), StartupStash, Launching Next, Turbo0. These are low-effort submissions that each yield one legitimate, on-topic referring domain.
3. **Targeted subreddit posts for specific calculators, not the whole site.** Whole-site self-promotion tends to get removed; individual useful tools do well when posted as genuinely helpful answers or dedicated posts in the right community — e.g. a pregnancy due-date calculator in a relevant parenting-adjacent sub, a workout-timer clock in r/loseit or r/bodyweightfitness-style fitness subs, a countdown/stopwatch tool in r/productivity, and the cosmic "realms" experiences in astronomy/astrology-adjacent or "cool web toys" communities (r/InternetIsBeautiful, r/webdev's showcase threads, r/SideProject). Always read and follow each subreddit's self-promotion rules first (many require a 9:1 non-self-promo ratio or restrict links to certain days).
4. **Pitch inclusion in "best free online [X] tools" listicle roundups.** Sites that maintain evergreen "best free timer/stopwatch/countdown/calculator tools" listicles refresh them periodically and are often open to suggestions via a short, specific email (not a mass blast) pointing at the one or two most relevant tools plus a one-line reason they're a good fit (e.g., no signup, no paywall, fast, mobile-friendly).
5. **Build one or two "embeddable" linkable assets.** A simple embeddable widget (e.g., an iframe-able countdown timer or clock that other sites/blogs can drop into their own pages with a small "powered by thegodoftime.com" credit link) is a classic, low-effort backlink driver for utility-tool sites — every embed is a natural, contextual referring domain that keeps accumulating without further outreach.
6. **List the games separately on browser-game directories.** The "daily games" feature is a distinct asset from the calculators/clocks and can be submitted independently to browser-game aggregator sites and daily-puzzle-game roundup lists (the same category that indexes Wordle-likes), which is a different audience/link pool than the utility-tool directories above.
7. **Submit the sitemap directly to Google Search Console and Bing Webmaster Tools now**, even though this isn't a backlink itself — it's the fastest way to get pages indexed by the two engines that actually drive traffic, and faster indexing shortens the feedback loop for every link-building step above (curators and Redditors are more likely to link to a page that already shows up when they search the topic).

None of these require budget, a PR agency, or an existing audience — they are the appropriate scale of first move for a site that is weeks old with zero prior outreach. Re-run this audit in 4–6 weeks after 2–3 of the above are attempted to start measuring real Common Crawl / referring-domain movement.

---

*Cross-references: for crawlability/canonical/technical issues, see `findings/technical.md`. For content quality (E-E-A-T) not covered here, run `/seo content <url>`. For structured data, see `findings/schema.md`.*
