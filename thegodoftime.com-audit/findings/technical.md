# Technical SEO Audit — The God of Time (thegodoftime.com)

Audited: 2026-07-14
Live domain tested: https://www.thegodoftime.com
Method: Live HTTP/header inspection (curl) + direct source review of the Next.js 15 App Router codebase at `d:\the_god_of_time`.

**Technical Score: 58/100**

---

## Critical

### 1. Canonical/OG/sitemap domain conflicts with the domain Vercel actually serves (apex vs www)
**Severity:** Critical

**Description:** Every page's canonical tag, Open Graph URL, `robots.txt` Sitemap directive, and every URL inside `sitemap.xml` point to the bare apex domain `https://thegodoftime.com`. But Vercel is configured so the apex 308-redirects to `https://www.thegodoftime.com` (confirmed: `curl -sI https://thegodoftime.com/` → `308 Permanent Redirect` → `Location: https://www.thegodoftime.com/`). The site only ever serves a `200 OK` on the `www` host.

This means:
- Search engines are told (via canonical/OG tags) that the "real" URL is a domain that 308-redirects elsewhere. Google generally resolves this correctly (redirect target becomes canonical), but it is a conflicting signal that can cause inconsistent indexing, URL selection reported in GSC that fights the webmaster's declared canonical, and wasted crawl budget.
- Every single one of the 171 URLs in `sitemap.xml` forces an extra redirect hop for crawlers (`https://thegodoftime.com/sitemap.xml` itself 308s to `https://www.thegodoftime.com/sitemap.xml`, and so does every URL listed inside it). Confirmed via `curl -sI https://thegodoftime.com/sitemap.xml` and `https://thegodoftime.com/tools/pregnancy-due-date-calculator` style checks.
- Source of the mismatch, confirmed by reading code:
  - `app/layout.tsx:43` — `metadataBase: new URL("https://thegodoftime.com")`
  - `app/robots.ts:9` — `sitemap: "https://thegodoftime.com/sitemap.xml"`
  - `app/sitemap.ts:7` — `const BASE_URL = "https://thegodoftime.com";`
  - Per-page `alternates.canonical` values resolve against `metadataBase`, so they all render as apex URLs (verified live: homepage, `/tools/pregnancy-due-date-calculator`, `/games` all emit `<link rel="canonical" href="https://thegodoftime.com/...">`).

**Recommendation:** Pick ONE canonical host and make code + redirects agree — do not leave them pointing opposite directions. Recommended fix: **keep `www` as the served/canonical host** (it's already what Vercel serves as the 200 destination, it's the lower-risk change since it requires no DNS/Vercel domain reconfiguration, and `www` is the more conventional default for Vercel projects). Concretely:
- Change `metadataBase` in `app/layout.tsx` to `new URL("https://www.thegodoftime.com")`.
- Change `BASE_URL` in `app/sitemap.ts` to `"https://www.thegodoftime.com"`.
- Change the `sitemap` field in `app/robots.ts` to `"https://www.thegodoftime.com/sitemap.xml"`.
- Leave the existing apex→www 308 redirect in Vercel as-is (it already does the right thing).
- Alternative (not recommended unless there's a branding reason to prefer bare domain): flip the Vercel redirect to send `www → apex` instead and leave the code as-is. This works too, but is non-standard for a Vercel-hosted site and requires a domain reconfiguration in the Vercel dashboard, which carries more operational risk than a one-line code/const change.

---

## High

### 2. Three of four category "hub" pages are missing canonical tags entirely
**Severity:** High

**Description:** `/tools`, `/clocks`, and `/realms` — three of the site's four highest-value hub/listing pages (each aggregating dozens of internal links) — render **no `<link rel="canonical">` tag at all**. Verified live:

```
/tools   -> NO CANONICAL FOUND
/clocks  -> NO CANONICAL FOUND
/realms  -> NO CANONICAL FOUND
/games   -> <link rel="canonical" href="https://thegodoftime.com/games"/>
```

Root cause confirmed in source: `app/games/page.tsx` and `app/page.tsx` both explicitly set `alternates: { canonical: "..." } }` in their `metadata` export, but `app/tools/page.tsx`, `app/clocks/page.tsx`, and `app/realms/page.tsx` do not set `alternates` at all — Next.js does not auto-generate a canonical tag just from `metadataBase`, so these three pages simply have none. This is an inconsistency introduced page-by-page, not a systemic template issue (the individual tool/clock/realm detail pages under them DO have canonicals, confirmed on `/tools/pregnancy-due-date-calculator` and `/realms/boredom-physics`).

**Recommendation:** Add `alternates: { canonical: "/tools" }`, `"/clocks"`, and `"/realms"` respectively to the `metadata` export in each of the three hub `page.tsx` files, matching the pattern already used in `app/games/page.tsx`. Do this in the same pass as fixing Finding #1 so the values resolve against the corrected `www` `metadataBase`.

### 3. No security response headers configured (HSTS only)
**Severity:** High

**Description:** Across every page checked (homepage, tool pages, clock pages, 404 page), the only security-relevant header present is `Strict-Transport-Security: max-age=63072000` (Vercel's automatic HSTS for verified custom domains). Confirmed missing on all responses:
- `X-Content-Type-Options` (no `nosniff` — allows MIME-sniffing attacks)
- `X-Frame-Options` / CSP `frame-ancestors` (no clickjacking protection)
- `Content-Security-Policy` (none at all)
- `Referrer-Policy` (none — defaults to browser's own policy, leaks full referrer cross-origin)
- `Permissions-Policy` (none)

There is no `next.config.ts` `headers()` function, no `middleware.ts`, and no `vercel.json` in the repo — nothing is producing these headers today. (Note: `Access-Control-Allow-Origin: *` is present on all HTML responses too; low risk for public content but worth knowing it's Vercel's default and not an intentional CORS policy.)

**Recommendation:** Add a `headers()` function in `next.config.ts` (or `middleware.ts`) applying to all routes:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (or CSP `frame-ancestors 'self'`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), camera=(), microphone=()` (tune per actual feature usage — note the site does have audio synthesis via `AudioContext` in clock components, so don't block `autoplay`/`microphone` unless truly unused)
- A `Content-Security-Policy` is more involved given inline `<Script>` tags for GA4 in `app/layout.tsx` (would need a nonce or `'unsafe-inline'` carve-out for the gtag bootstrap script) — treat as a follow-up once the simpler headers ship, don't block on it.

None of this is Google ranking-critical today, but security headers are an increasingly common signal in third-party technical SEO/site-quality scoring tools and are a real hardening gap for a public, ad-supported site.

---

## Medium

### 4. No IndexNow protocol implementation
**Severity:** Medium

**Description:** No IndexNow key file or push integration exists anywhere in the codebase (`grep` for "indexnow" across the repo returned nothing, and no key `.txt` file exists under `public/`). The site has daily-refreshing content (`/games` — "Daily Time Games") and periodically adds new tools/clocks/realms (evidenced by the growing `redirects()` list in `next.config.ts` from renamed/consolidated pages). Without IndexNow, Bing/Yandex/Naver only discover new and changed content on their own crawl schedule rather than near-instantly.

**Recommendation:** Generate an IndexNow key, host it at `public/<key>.txt`, and add a small server action or GitHub Action / Vercel Cron that pings `https://api.indexnow.org/indexnow` with changed URLs whenever the sitemap-backing registries (`clocksRegistry`, `toolsRegistry`, `realmsRegistry`, `gamesRegistry`) change, and especially whenever `/games` content rotates daily. This is low-effort and directly benefits Bing (and by extension ChatGPt/Copilot-style answer engines that lean on Bing's index) discovery speed.

### 5. `ads.txt` returns 404
**Severity:** Medium (informational — not an immediate action item)

**Description:** `https://www.thegodoftime.com/ads.txt` returns `404 Not Found`. Per project context, this is intentional: the site has not yet been approved for Google AdSense and no publisher ID exists, so no `ads.txt` was created to avoid publishing a fake/invalid entry.

**Recommendation:** No action needed now. Revisit and add `ads.txt` (or generate it dynamically via an `app/ads.txt/route.ts` route reading `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, mirroring the pattern already used for the AdSense script gate in `app/layout.tsx`) once AdSense approval issues a publisher ID. Flagging as Medium only so it isn't forgotten post-approval, not because it's currently broken.

### 6. `robots.txt` and sitemap reference the redirecting apex host
**Severity:** Medium (subset of Finding #1, called out separately because it affects crawler efficiency directly, not just canonicalization signals)

**Description:** `robots.txt` (served correctly at `https://www.thegodoftime.com/robots.txt`) contains `Sitemap: https://thegodoftime.com/sitemap.xml` — an apex URL that itself requires a redirect hop before a crawler can read it. Bots that respect `robots.txt` sitemap directives will take an unnecessary extra round-trip on every fetch of the sitemap index.

**Recommendation:** Covered by the same fix as Finding #1 (update `app/robots.ts`'s `sitemap` field to the `www` URL). Listed separately here to make clear it's a distinct, easily-verifiable crawl-efficiency cost, not just an abstract canonicalization concern.

---

## Low

### 7. PWA manifest icons lack a "maskable" purpose variant
**Severity:** Low

**Description:** `public/manifest.json` defines two icons (`192x192`, `512x512`) with no `"purpose": "maskable"` entries. Not an SEO issue, minor Add-to-Home-Screen/PWA polish item only (site does register a service worker via `RegisterSW` in `app/layout.tsx`).

**Recommendation:** Optional — add a maskable icon variant if/when PWA install experience is prioritized. Not worth spending time on for core SEO.

### 8. No `Content-Security-Policy` around GA4 inline bootstrap script
**Severity:** Low (rolled into Finding #3's remediation, noted separately for implementation planning)

**Description:** `app/layout.tsx` injects an inline `<Script id="google-analytics">` block that calls `gtag('config', ...)`. If/when a CSP is added (Finding #3), this inline script will need either a nonce, a hash-based `script-src` allowance, or migration to an external GA4 loader snippet — otherwise the CSP will silently break analytics.

**Recommendation:** Plan the CSP rollout and GA4 script together; don't add a strict CSP without accounting for this inline script first, or analytics will go dark without any visible error to the team.

---

## What Works

- **Redirect hygiene is otherwise clean.** Apex→www is a single 308 hop (no chains), trailing-slash and double-slash URLs normalize to a single canonical path via one redirect, and the `next.config.ts` `redirects()` block correctly 301/308s ~46 legacy/renamed tool, clock, and realm slugs to their current URLs — good handling of the site's ongoing slug consolidation.
- **Server-rendered content, not JS-dependent.** Verified on `/`, `/tools/pregnancy-due-date-calculator`, `/tools` (hub, 101 internal `<a href>` tool links present in raw HTML), and `/realms/boredom-physics`: full body copy, headings, and internal navigation links are present in the initial HTML response with no client JS execution required. No `"use client"` directive appears in any `app/**/page.tsx` route file — page shells are server components; only the interactive calculator/clock widgets inside them are client components. This is close to ideal for a calculator-heavy site.
- **Structured data is present and appropriately typed.** Tool pages emit `WebApplication`, `BreadcrumbList`, and `FAQPage` JSON-LD (verified on the pregnancy due date calculator); realm pages emit their own JSON-LD too. No malformed/missing JSON-LD encountered in spot checks.
- **robots.txt/sitemap.xml are live and correctly structured** (mechanically): `Allow: /` with no accidental blocks, and a dynamically-generated 171-URL sitemap built from the same content registries that drive routing (`app/sitemap.ts` reading `clocksRegistry`/`toolsRegistry`/`realmsRegistry`/`gamesRegistry`), so new pages get sitemap coverage automatically without manual upkeep.
- **No meta-robots noindex or X-Robots-Tag issues found** anywhere in spot checks — nothing is being accidentally deindexed.
- **Lightweight image footprint.** No `<img>` tags and no `next/image` usage found in `components/`; the site's only images are small SVG/PNG icons (`public/icon.svg`, `icon-192.png`, `icon-512.png`). No large unoptimized hero images to threaten LCP. Fonts are loaded via `next/font/google` (self-hosted, `font-display` handled automatically), which avoids the classic FOUT/CLS problems of runtime Google Fonts `<link>` tags.
- **404 handling is correct**: nonexistent URLs return a true `404 Not Found` HTTP status (not a soft-404 200), confirmed via header check.
- **Mobile viewport meta tag is present and unrestrictive** (`width=device-width, initial-scale=1`, no `user-scalable=no` / `maximum-scale` lockout) on every page checked.
