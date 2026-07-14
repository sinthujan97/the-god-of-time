# Search Experience Optimization (SXO) Findings — The God of Time

**Scope:** Reading the live SERP backwards for a representative sample of keywords, comparing what Google is actually rewarding against the site's shared `ToolPageTemplate` / `ClockSEOContent` layout (calculator UI → divider → 130-150 word intro → 2 H2 sections → FAQ block, per `components/tools/ToolPageTemplate.tsx` and `components/tools/ToolSEOContent.tsx`).

**SXO Gap Score: 58/100** (separate from, and not to be confused with, the technical SEO Health Score — see `technical.md`)

Note on methodology: the seo-audit skill's own `scripts/` directory (render_page.py, parse_html.py) is not installed on this machine. Page analysis below was done via direct `Read` of the Next.js source (`app/**/page.tsx`, `lib/tools/data/*.ts`, `components/tools/**`, `components/clocks/experiences/**`) rather than a rendered-DOM fetch, and SERP analysis was done via `WebSearch`/`WebFetch` rather than the taxonomy scripts. Findings are framed accordingly; see Limitations at the end.

---

## Sample analyzed

| Page | Keyword | Intent class |
|---|---|---|
| `/tools/pregnancy-due-date-calculator` | "pregnancy due date calculator" | YMYL-adjacent, transactional-with-trust-requirement |
| `/clocks/world-clock` | "world clock" | Transactional/utility vs. a dominant long-tail incumbent |
| `/tools/time-card-calculator` | "time card calculator" | Pure transactional/utility |
| `/clocks/click-per-second-test` | "click per second test" / "cps test" | Entertainment/challenge, novelty |

---

## Finding 1 — YMYL E-E-A-T signals missing on pregnancy-due-date-calculator

**Severity:** CRITICAL

**Description:** The top of the SERP for "pregnancy due date calculator" is entirely institutional/medical authority: American Pregnancy Association, NHS, a hospital (Woman's Hospital), Perinatology.com, mdcalc.com, and UpToDate. On the APA page specifically (the #1 organic result), the calculator sits above the fold — same layout choice this site makes — but it is wrapped in trust scaffolding this site's page has none of: a stated last-revision date ("June 1, 2026"), a "maintained and verified by the APA Content Validation Team" line, a disclaimer block, a featured video, and outbound links into a broader pregnancy-content ecosystem. `lib/tools/data/pregnancy-due-date.ts` has genuinely good content depth (Naegele's Rule explained, IVF Day-3/Day-5 offsets, milestone-by-week breakdown, appropriate "this is an estimate, confirm with your provider" hedging) — the content itself is not thin. But nowhere in the codebase (confirmed via repo-wide grep for `author`, `reviewedBy`, `medicalReview`, `dateModified`, `lastUpdated`) does any page — this one included — carry a reviewer byline, a "medically reviewed by" credential, a visible last-updated date, or a citation/outbound link to an authoritative source (ACOG, NHS, Mayo Clinic). For a query this close to medical advice, that is the single highest-leverage gap: Google's YMYL guidance weighs author/publisher expertise and demonstrable trustworthiness heavily, and every top-8 competitor here is an institution, not a niche utility site — the credibility gap, not the format, is what's costing this page.

**Recommendation:** Add a visible "Reviewed by [credential]" or "Methodology reviewed against ACOG/NHS guidelines" line with a real date, expose `dateModified` in the `WebApplication` schema (currently only `price`/`applicationCategory`/`offers` are set — no `dateModified`, no `author`, no `reviewedBy`), and add 1-2 outbound citation links to ACOG/NHS/Mayo Clinic within the "How Is a Pregnancy Due Date Calculated?" section. This is the specific gap `/seo content` is built to close — recommend routing this page through it for a deeper E-E-A-T pass, and extending the same treatment to the rest of the Health & Lifecycle group (ovulation-calculator, alcohol-clearance, nicotine-detox, vaccination-tracker) since they carry the same exposure.

---

## Finding 2 — Click-per-second-test claims features that don't exist in the shipped component

**Severity:** HIGH

**Description:** Both the `WebApplication` schema `featureList` in `app/clocks/click-per-second-test/page.tsx` and an on-page FAQ answer explicitly state: "The test includes basic detection that flags results significantly above the human maximum of approximately 16 CPS with regular technique," and separately claim "Percentile comparison against other testers." Reading `components/clocks/experiences/CpsTester.tsx` directly: there is no auto-clicker detection logic anywhere in the file (no threshold check against 16 CPS, no flagging), and the "score panel" is a static `getCpsRank()` lookup against hardcoded thresholds — a fixed tier/label, not a live percentile computed against real other-user data. The one claim that *is* true is the double-click hardware diagnostic mode (`mode === "double-click"`, switch-chatter detection at <80ms deltas is genuinely implemented). This is a content-accuracy problem, not a design one: a user who reads the FAQ and then tries to trigger "detection" by using an auto-clicker, or looks for a percentile/leaderboard comparison, will find neither — a direct trust hit for a page whose entire value proposition is "click as fast as possible and see how you compare."

**Recommendation:** Either build the two claimed features (a simple >16 CPS flag is trivial to add to the existing click-timestamp array already being tracked; a percentile requires either a static distribution table — easy — or real aggregate data — harder) or rewrite the FAQ/schema copy to only describe what `CpsTester.tsx` actually does (the rank-tier system and the double-click diagnostic, both of which are legitimate differentiators). Do not ship structured data or FAQ content describing functionality that isn't in the component.

---

## Finding 3 — World clock: tool renders empty on first paint, and lacks the static reference table the dominant format uses

**Severity:** HIGH

**Description:** `timeanddate.com` (the runaway #1 result) and `worldclock.com` (#6) both pair an interactive tool with a static, scannable table of major-city times sitting directly below/beside it — worldclock.com explicitly leads with "Local Time In Major Cities" as a 16-city table before the prose content starts. `components/clocks/experiences/WorldClock.tsx` has no equivalent static table; its only city-time content lives inside the interactive widget itself. Compounding this: `WorldClock` is a `"use client"` component whose city state initializes as `useState<PinnedClock[]>([])` and is only populated with `DEFAULT_CLOCKS` (New York/London/Tokyo) inside a `useEffect` — meaning the server-rendered HTML for `/clocks/world-clock` ships with zero city times in the markup. A user on a slow connection, or Googlebot's initial (non-JS) crawl pass, sees a blank tool shell before hydration, not the "world clock time zone dashboard" the intro copy promises. Two related SERP signals point the same direction: the incumbent's advantage isn't just page format, it's the sheer breadth of individually indexable "current time in [city]" URLs feeding it long-tail traffic — a single `/clocks/world-clock` page cannot compete with that breadth directly.

**Recommendation:** (1) Server-render a default table of ~10-15 major world cities (New York, London, Tokyo, Sydney, Dubai, etc.) as real HTML — both as a UX safety net for slow/no-JS first paint and as crawlable, scannable content that mirrors the format Google is visibly rewarding here. (2) Longer-term, consider whether a small set of high-volume individual "current time in [major city]" pages (programmatic, but genuinely useful — not spun) would let this site compete on the long-tail the way the incumbent does, rather than relying on one hub page.

---

## Finding 4 — Time card calculator: format is correctly matched, but missing export/print — the one feature every top competitor has

**Severity:** MEDIUM

**Description:** For "time card calculator," this site's layout choice is validated by the SERP: calculator.net, Harvest, and Rize all put the interactive tool immediately above the fold with FLSA/overtime explanatory content below it — exactly the `ToolPageTemplate` pattern. `lib/tools/data/time-card-calculator.ts` matches competitor content depth well (federal break rules, the 8/40 daily/weekly overtime distinction, California's daily-overtime exception, rounding rules) and the default 7-day entry grid matches calculator.net's default view. However: calculator.net advertises printable reports, and Harvest explicitly offers PDF/CSV export. A repo-wide grep across `components/tools/**` for `print`, `export`, `download`, `CSV`, `PDF` returns nothing — no tool on this entire site has an export/print/save-result feature. For this specific persona (an hourly employee verifying a paycheck, or a manager approving a timesheet — both journey stages this page's own FAQ explicitly names) the natural next action after calculating is "now save/share/print this," and there is currently no way to do that without a manual screenshot.

**Recommendation:** Add a lightweight "Print this timecard" (CSS print stylesheet, no backend needed) or "Copy summary" action to `TimeCardInputs.tsx` and the other HR/Payroll group tools (`time-card-with-breaks`, `free-biweekly-timesheet-calculator`). This is a small build relative to the persona payoff — it directly serves the "manager approving timesheets" and "freelancer preparing an invoice" use cases the page's own copy already claims to serve.

---

## Finding 5 — Comparison-shopper claims are buried in prose instead of shown as scannable proof

**Severity:** MEDIUM

**Description:** Several intro paragraphs make direct competitive claims in unstructured text rather than a visual format a comparison-shopping user (a mid-funnel persona clearly present in these SERPs — multiple competing tools per query, several offering more granular variants) can scan quickly. Examples pulled directly from the data files: world-clock's intro says "most world clock online tools convert one city at a time, while this one keeps your whole set of cities visible together"; time-card-calculator's intro says "the lunch and break deduction is handled properly here... which is where most competing calculators handle things poorly." Both are real, credible differentiators — but they're one clause inside a 100+ word paragraph, not a table, checklist, or badge a scanning user (or a featured-snippet-eligible block) can lift out.

**Recommendation:** Convert 2-3 of these embedded comparison claims into a small visual "why this tool" checklist or comparison table near the top of the SEO content zone (e.g., "✓ Multi-city simultaneous view ✓ Real per-city DST auto-adjustment ✓ No signup" for world-clock). This also creates a cleaner featured-snippet/PAA target than the current paragraph form.

---

## Finding 6 — No freshness or authorship schema anywhere on the site

**Severity:** LOW (sitewide, compounds Finding 1)

**Description:** Across all four sampled pages' `WebApplication` JSON-LD blocks, only `name`, `url`, `description`, `applicationCategory`, `operatingSystem`, and `offers` are populated — none carry `dateModified`, `author`, or `datePublished`. This is a low-severity issue on a novelty tool like click-per-second-test, but it directly compounds Finding 1 on every page in the Health & Lifecycle group (ovulation-calculator, alcohol-clearance, nicotine-detox, vaccination-tracker, sleep-calculator) that sits in similarly sensitive territory without the pregnancy page's relative content depth.

**Recommendation:** Add `dateModified` to the shared `webAppSchema` pattern site-wide (cheap, mechanical) and prioritize adding a real `author`/`reviewedBy` entity for the Health & Lifecycle group specifically.

---

## Finding 7 — CPS test has the mechanics of a challenge but not the social hook the intent implies

**Severity:** LOW

**Description:** "Click per second test" is an entertainment/challenge query — the explicit intent (confirmed by SERP language like "bragging rights," leaderboards, and world-record framing across competitors) is social comparison, not just measurement. `CpsTester.tsx` does the measurement well (5/10/30s trials, rank tiers, the genuinely differentiated double-click diagnostic) but the world-record comparison (Dylan Allard, 14.1 CPS) only exists as FAQ prose — it's never surfaced live in the results panel next to the user's own score — and there's no share-result action (`navigator.share`/clipboard) anywhere in the component. A user who just beat their friend has no built-in way to prove or share it from the tool itself.

**Recommendation:** Surface "You: X CPS — World record: 14.1 CPS" as a live comparison in the results panel (data already exists in copy, just not wired into the UI), and add a one-tap "copy my result" / share action. Low engineering cost, direct match to the query's actual (competitive/social) intent.

---

## What Works

- **Tool-first layout is the correct call for the utility queries sampled.** For "time card calculator" and "world clock," every SERP-topping competitor also puts the interactive tool above the fold before any prose — the site's shared `ToolPageTemplate` pattern (calculator → divider → content → FAQ) is not a mismatch for these query types.
- **Time card calculator's content depth and structure closely mirror what's actually ranking**: the 7-day default entry grid matches calculator.net's default view, and the FLSA-specific content (20-minute paid-break rule, California daily-overtime exception, rounding-rule caveats) is the same level of specificity competitors offer.
- **FAQPage schema is implemented consistently sitewide** (`ToolSEOContent.tsx`, `ClockSEOContent.tsx`) with genuinely non-boilerplate, long-tail-query-shaped answers (IVF Day-3 vs Day-5 offsets, overnight-shift handling, switch-chatter diagnostics) rather than generic filler.
- **Pregnancy due date calculator's actual calculation coverage is on par with the medical-authority competitors** — it correctly implements and explains all three real-world methods (LMP/Naegele's Rule, conception date, IVF Day-3/Day-5 transfer) and appropriately hedges medical certainty ("always confirm your due date with your healthcare provider," "only about 4% of babies are born exactly on their EDD").
- **Click-per-second-test's double-click hardware diagnostic mode is a genuine, working differentiator** most CPS-test competitors don't offer — it's real functionality, not just marketing copy (unlike the two features flagged in Finding 2).

---

## Limitations

- No live rendering was performed (`scripts/render_page.py` / `scripts/parse_html.py` are not installed on this machine); analysis is based on direct reading of the Next.js source (page templates, data files, and interactive components) rather than the actual rendered DOM/HTML served to Googlebot or users. Behavior could differ if client-side logic not visible in source (e.g., feature flags, A/B tests) alters what ships in production.
- SERP snapshots were captured via `WebSearch`/`WebFetch` summaries rather than the taxonomy/persona-scoring reference scripts bundled with the seo-audit skill; page-type classification and persona derivation above were done manually against the same intent rather than through the scripted taxonomy.
- `WebFetch` was blocked (403) on `timeanddate.com` and `cpstest.org` directly; those two competitor pages were assessed via search-result summaries and a substitute competitor (`worldclock.com`) rather than direct fetch.
- Only 4 of 100+ tool/clock pages were sampled; findings 4-7 (export/print gap, comparison-table gap, missing freshness schema) are sitewide architectural patterns inferred from the shared templates (`ToolPageTemplate.tsx`, `ToolSEOContent.tsx`) and should be assumed to apply broadly, not just to the 4 sampled URLs — but this was not verified page-by-page across the full catalog.
- No rank-tracking or GSC data was available, so "why a page fails to rank" is inferred from SERP-vs-page comparison rather than confirmed against actual impression/click data.
