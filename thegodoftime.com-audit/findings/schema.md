# Schema.org Structured Data Audit — The God of Time (thegodoftime.com)

Audit date: 2026-07-14
Method: Direct source read of `d:\the_god_of_time` (Next.js 15 App Router) via `Read`/`Grep`, cross-checked against live rendered HTML for `https://www.thegodoftime.com/clocks/pomodoro-timer-online` via `curl`. No automated Rich Results Test / Schema Validator tool was available in this environment — all required/recommended-field checks below were performed manually against the schema.org and Google Search Central specs for `WebApplication`, `FAQPage`, `BreadcrumbList`, and `ItemList`. Recommend running the live URLs through Google's Rich Results Test as a follow-up to confirm parse-ability.

---

## Inventory Summary

| Schema type | Where generated | Coverage |
|---|---|---|
| `WebApplication` | Hand-added per-page `<script>` in `page.tsx` | Clocks: 31/32 built pages (1 missing: `global-shift-overlap`; `split-flap-planner` route dir is empty, not a live route). Tools: **25/102** pages (~25%). Realms: **4/25** built pages (~16%). Games: 0/3 (games use `ItemList` instead, appropriately). |
| `FAQPage` | `ClockSEOContent.tsx` (clocks), `ToolSEOContent.tsx` (tools), `RealmSEOContent.tsx`/`RealmSEOSection.tsx` (realms), inline in `app/games/page.tsx` | Present on effectively every clock/tool/realm page that has an FAQ array populated (auto-generated, conditional on `faqs.length > 0`). |
| `BreadcrumbList` | `ClockLayout.tsx` (clocks), `components/tools/Breadcrumb.tsx` (tools), `RealmBreadcrumb.tsx` (realms), inline in `app/games/page.tsx` | Present on nearly all clock/tool/realm/games pages via shared layout components — this is the most consistently-applied schema type site-wide. |
| `ItemList` | Inline in `app/games/page.tsx` | Only the `/games` hub page. |
| `Organization` | **Not found anywhere in the codebase.** | 0 pages. |
| `WebSite` (+ `SearchAction`) | **Not found anywhere in the codebase.** | 0 pages. |
| `SoftwareApplication` | Not used — all app-like schema uses `WebApplication` instead. | N/A |
| `HowTo` | Not used (correctly avoided — deprecated Sept 2023). | N/A |

Total routes audited: 32 clock pages, 102 tool pages, 25 built realm pages (+ 1 dynamic `[slug]` catch-all + `remaining-experiences`), 3 game pages, plus homepage, `/about`, `/tools`, `/clocks`, `/realms`, `/games` hub pages and legal pages.

---

## What Works

- **BreadcrumbList is applied almost universally** across clocks, tools, realms, and the games hub via shared layout components (`ClockLayout.tsx`, `components/tools/Breadcrumb.tsx`, `RealmBreadcrumb.tsx`), giving consistent, low-maintenance breadcrumb trail markup across 100+ pages without per-page hand-coding.
- **FAQPage generation is templatized and DRY**: `ClockSEOContent`, `ToolSEOContent`, and `RealmSEOContent`/`RealmSEOSection` all pull from a page-local `faqs` array and only render the `<script>` block when `faqs.length > 0`, avoiding empty/malformed FAQPage schema.
- **No deprecated schema types found.** No `HowTo`, no `SpecialAnnouncement`, no `CourseInfo`/`EstimatedSalary`/`LearningVideo`. The team has correctly avoided the post-2023 deprecated set despite having many step-based, how-to-shaped tool pages that would have been tempting `HowTo` candidates.
- **`WebApplication` schema, where present, is well-formed**: correct `@context`, `offers` with `price: "0"` / `priceCurrency: "USD"` for a free tool, `applicationCategory: "UtilityApplication"`, and a populated `featureList` (see `app/clocks/pomodoro-timer-online/page.tsx`). No placeholder text was found in any sampled schema block.
- **`ItemList` on `/games`** is a correct, appropriate use of the type for a 3-item content hub, distinct from (and not confused with) `FAQPage`, and paired with its own `BreadcrumbList`.
- **JSON-LD (not Microdata/RDFa) is used consistently** throughout, and `@context` is consistently `"https://schema.org"` (not `http`), matching best practice.

---

## Findings

### 1. Sitewide: No `Organization` or `WebSite` schema anywhere
**Severity:** High
**Description:** No page in the codebase — not the homepage (`app/page.tsx`), not the root layout (`app/layout.tsx`), not `/about` — emits an `Organization` or `WebSite` schema block. Grepping the entire repo for `"@type": "Organization"` / `"@type": "WebSite"` returns zero matches. This means the site has no structured signal identifying "The God of Time" as a distinct entity/brand (name, logo, `sameAs` social profiles, founding info) and no `WebSite` + `SearchAction` markup that would make the site eligible for a Google Sitelinks Search Box. For a site with 100+ tools trying to build topical/brand authority (and per the project's own stated interest in AI/LLM citation and entity resolution), this is a foundational, low-effort gap.
**Recommendation:** Add a single sitewide `Organization` schema (in `app/layout.tsx` or a new shared `<SiteSchema>` component rendered once at the root) plus a `WebSite` schema with a `potentialAction` `SearchAction` if/when site search exists (omit `SearchAction` if there is no search endpoint). Example:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The God of Time",
  "url": "https://www.thegodoftime.com",
  "logo": "https://www.thegodoftime.com/icon.svg",
  "description": "A hub of utility time calculators and immersive relativistic cosmic experiences."
}
```
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The God of Time",
  "url": "https://www.thegodoftime.com"
}
```
Render both once, sitewide, not per-page (avoid duplicating on every route).

### 2. Sitewide: All JSON-LD `url`/`item` values use the apex domain, which 308-redirects to `www`
**Severity:** High
**Description:** Every schema block in the codebase (and confirmed live on the rendered `www` page) uses `https://thegodoftime.com/...` as the base for `url`, `item`, and canonical values — e.g. `app/sitemap.ts` (`BASE_URL = "https://thegodoftime.com"`), `app/robots.ts` sitemap pointer, `app/layout.tsx` `metadataBase`, and every hand-written `webAppSchema.url` / `BreadcrumbList` `item`. Live check confirms `https://thegodoftime.com/clocks/pomodoro-timer-online` returns `HTTP/1.1 308 Permanent Redirect` to `https://www.thegodoftime.com/clocks/pomodoro-timer-online`, yet the page served at the `www` (canonical, 200-status) URL still emits `"url":"https://thegodoftime.com/clocks/pomodoro-timer-online"` in its own `WebApplication` schema and `<link rel="canonical" href="https://thegodoftime.com/...">`. So the canonically-served page self-references a non-canonical, redirecting URL in both its `<link rel="canonical">` and every JSON-LD block. While Google generally follows redirects, this is inconsistent with best practice (structured data `url`/`@id` values should exactly match the final serving URL) and is a sitewide, single-root-cause issue (fixing `metadataBase` and the handful of `BASE_URL`/hardcoded-domain constants fixes it everywhere at once).
**Recommendation:** Decide `www` as canonical (matches actual DNS/redirect behavior) and update: `app/layout.tsx` `metadataBase` → `new URL("https://www.thegodoftime.com")`; `app/sitemap.ts` `BASE_URL` → `"https://www.thegodoftime.com"`; `app/robots.ts` sitemap URL; and every hardcoded `https://thegodoftime.com` string used inside `webAppSchema.url`, `ClockLayout.tsx`/`Breadcrumb.tsx`/`RealmBreadcrumb.tsx` breadcrumb `item` values, and the games `ItemList`/`BreadcrumbList`. Since most of the hardcoded domain strings are baked into 30+ individual `page.tsx` files, prioritize centralizing this into a single exported constant (e.g. `lib/constants.ts` → `SITE_URL`) to prevent future drift.

### 3. Tools: only ~25% of tool pages have `WebApplication` schema
**Severity:** Medium
**Description:** Of 102 built tool pages (`app/tools/<slug>/page.tsx`), only **25** contain a hand-added `WebApplication` schema block (confirmed via `grep -rl '"@type": "WebApplication"' app/tools/*/page.tsx`). The remaining ~77 tool pages get `FAQPage` (via `ToolSEOContent`) and `BreadcrumbList` (via `Breadcrumb.tsx`) but no entity-level schema describing the tool itself — meaning Google/AI crawlers have no structured signal that e.g. `/tools/leap-year-calculator` is a free, browser-based calculator app versus just an article page. This was clearly added ad hoc over time rather than being part of the shared `ToolPageTemplate`, creating an inconsistent, unpredictable pattern across the tools section (the single largest content category on the site).
**Recommendation:** Move `WebApplication` schema generation into the shared `ToolSEOContent.tsx` (or `ToolPageTemplate`) component itself, generating it from data already present in `lib/tools/data/<slug>.ts` (name, description, category) rather than requiring each `page.tsx` to hand-roll it. This closes the gap for all 77 pages in one change and prevents future tool pages from shipping without it. Use `applicationCategory: "UtilityApplication"` (or `"BusinessApplication"` where more accurate, e.g. `shift-differential-calculator`, `furlough-pay-calculator`) and `offers.price: "0"` for consistency with the 25 existing examples.

### 4. Realms: only 4 of 25 built realm pages have `WebApplication`/experience-level schema
**Severity:** Medium
**Description:** `RealmLayout.tsx` (used by 21 of the 25 realm experience components, e.g. `BoredomPhysics.tsx`, `CaffeineLab.tsx`, `SolarSystemOrrery.tsx`) auto-generates `BreadcrumbList` (via `RealmBreadcrumb.tsx`) and `FAQPage` (via `RealmSEOContent.tsx`/`RealmSEOSection.tsx`), so those pages are not schema-bare — but only 4 realm pages (`grandfather-paradox`, `parent-child-time-calculator`, `the-sacred-timeline`, `watch-paint-dry`) additionally have a hand-added `WebApplication` block directly in `page.tsx`, mirroring the same ad hoc pattern seen in the tools section. Interactive experiences like `solar-system-orrery`, `decay-sandbox`, and `financial-freedom-dashboard` are functionally web applications but carry no `WebApplication`/`SoftwareApplication` entity markup.
**Recommendation:** Same fix pattern as Finding 3 — lift `WebApplication` generation into `RealmLayout.tsx` (or a shared `RealmSEOContent` prop) so it's generated once from realm registry data (`lib/data/realmsRegistry.ts` already has `name`/`description`/`slug` per entry) rather than requiring per-page hand authoring.

### 5. `global-shift-overlap` clock page has zero structured data
**Severity:** Medium
**Description:** `app/clocks/global-shift-overlap/page.tsx` is a standalone page that renders `<GlobalShiftOverlap />` directly with no `WebApplication` schema in `page.tsx` and no `ClockSEOContent` call inside the component (confirmed via grep — no `ClockSEOContent`, `WebApplication`, or `FAQPage` references anywhere in `components/clocks/experiences/GlobalShiftOverlap.tsx`). It does still get `BreadcrumbList` because the component wraps its content in `ClockLayout`, but it is the only one of the 32 built clock pages with no `WebApplication` and no `FAQPage` schema at all — an outlier versus 31/32 sibling clock pages.
**Recommendation:** Add a `webAppSchema` block to `app/clocks/global-shift-overlap/page.tsx` (`WebApplication`, `applicationCategory: "BusinessApplication"` given its DevOps/ops-team framing) and pass a populated `faqs` array through `ClockSEOContent` inside `GlobalShiftOverlap.tsx`, matching the pattern used by every other clock page (e.g. `pomodoro-timer-online/page.tsx`).

### 6. Orphaned route: `app/clocks/split-flap-planner/` directory exists with no `page.tsx`
**Severity:** Low
**Description:** `app/clocks/split-flap-planner/` is an empty directory (no `page.tsx`, no files at all) sitting alongside 32 real clock routes. This is not a schema defect per se, but is worth flagging in a structured-data context because it suggests either an incomplete migration or a route that should be added to (or removed from) `lib/data/clocksRegistry.ts`/the sitemap. If this slug is referenced anywhere in `clocksRegistry.ts` or internal links, it would 404 with no schema at all.
**Recommendation:** Either finish building the page (with the standard `WebApplication` + `ClockSEOContent` + `ClockLayout` pattern) or delete the stray directory and confirm no registry entry or internal link points to `/clocks/split-flap-planner`.

### 7. Existing `FAQPage` markup: correct to keep, but re-classify priority per current Google policy
**Severity:** Info
**Description:** `FAQPage` schema is emitted on nearly every clock, tool, and realm page (wherever `faqs.length > 0`), plus `app/games/page.tsx`. Per current Google Search policy, FAQ rich results were retired for all sites (May 2026), so this markup produces no SERP feature. All sampled `FAQPage` blocks were structurally correct (`mainEntity` → `Question` → `acceptedAnswer.Answer`, no placeholder text, valid nesting).
**Recommendation:** No removal needed. Keep `FAQPage` as-is — it continues to aid AI/LLM citation and entity/answer extraction (this is directly relevant to a site whose owner has flagged AI/GEO visibility as a goal). Do not invest further engineering time expanding FAQ coverage purely for Google SERP purposes; do continue populating FAQs for AI-answer-engine visibility.

### 8. `ItemList` on `/games` uses `url` directly on `ListItem` rather than nesting `item`
**Severity:** Low
**Description:** `app/games/page.tsx`'s `itemListSchema` sets `{ "@type": "ListItem", position, name, url }` rather than the strict schema.org pattern of `{ "@type": "ListItem", position, item: { "@type": "Thing", "url": ... } }` (or `item` as a bare URL string). This flat `url`-on-`ListItem` pattern is explicitly supported by Google's own carousel/ItemList documentation and is not itself an error, but it's worth flagging because it deviates from strict schema.org `ListItem` property semantics (schema.org does not define a `url` property directly on `ListItem`) and validators outside Google's own toolset may flag it as an unrecognized property.
**Recommendation:** Low priority — leave as-is if optimizing purely for Google (matches their documented pattern), but if broader validator/AI-crawler compatibility matters, switch to nesting: `item: "https://www.thegodoftime.com/games/chrono-lock"` (bare URL string, which is valid per schema.org's `item: URL` allowance) or `item: { "@type": "Game", "name": ..., "url": ... }` for richer typing.

### 9. Breadcrumb "item" for the tools group-level crumb points to a query-string URL, not a canonical page
**Severity:** Low
**Description:** `components/tools/Breadcrumb.tsx` sets the third breadcrumb level's `item` to `https://thegodoftime.com/tools?group=${groupId}` — a query-parameterized URL. If `/tools` uses client-side filtering rather than server-rendering distinct canonical pages per `group`, this breadcrumb `item` doesn't correspond to an independently indexable/canonical URL, which is a minor inconsistency (compounded by Finding 2's domain issue on the same line).
**Recommendation:** Low priority given breadcrumbs no longer drive a Google SERP feature on their own merit beyond aiding crawl/entity understanding, but consider pointing the group-level crumb `item` at `/tools#group-${groupId}` or simply `/tools` if `/tools?group=...` is not set as a canonical, separately-indexed URL, to avoid submitting non-canonical URLs in structured data.

---

## Coverage Gap Quantification (as requested)

- **Tools:** 25/102 page.tsx files (~24.5%) contain a hand-added `WebApplication` block; 77/102 (~75.5%) rely solely on the auto-generated `FAQPage` + `BreadcrumbList`.
- **Clocks:** 31/32 built page.tsx files have `WebApplication`; 1 (`global-shift-overlap`) has none. (`split-flap-planner` is a non-route, excluded.)
- **Realms:** 4/25 built page.tsx files have a hand-added `WebApplication`; 21/25 rely solely on `RealmLayout`'s `BreadcrumbList` + `FAQPage`.
- **Sitewide:** 0/entire-site `Organization` or `WebSite` schema.

## Validation Notes

- No automated Rich Results Test could be run in this environment (no network access to Google's validator tooling was exercised; manual field-by-field checks were performed instead against the schema.org/Google Search Central specs).
- Live spot-check of `https://www.thegodoftime.com/clocks/pomodoro-timer-online` confirmed the rendered HTML matches source exactly (5 `<script type="application/ld+json">` blocks: `WebApplication`, `FAQPage`, `BreadcrumbList` — no SSR/hydration gap, no duplicate blocks).
- No malformed JSON or duplicate schema blocks on a single page were found in any of the sampled files.
- No required-field violations found in the `WebApplication`, `FAQPage`, or `BreadcrumbList` blocks that do exist — the defects here are entirely coverage gaps (missing blocks) and domain-consistency issues (Finding 2), not malformed existing markup.
