# Visual Analysis — thegodoftime.com

Pages audited: Homepage (`/`), `/tools/age-calculator`, `/clocks/world-clock`, `/realms/solar-system-age`, `/games`, `/about`.
Viewports tested: 1920×1080, 1600×900 (ad-rail edge case), 1280×800, 375×812 (iPhone), plus viewport-only ("above the fold") captures.

Screenshots saved to `d:\the_god_of_time\thegodoftime.com-audit\screenshots\`:
- `homepage-desktop.png` / `homepage-desktop-fold.png` / `homepage-mobile.png` / `homepage-mobile-fold.png`
- `homepage-desktop-1920-adrails.png`, `homepage-desktop-1600-adrails-edge.png`
- `age-calculator-desktop.png`, `age-calculator-mobile.png`, `age-calculator-mobile-fold.png`
- `world-clock-desktop.png`, `world-clock-mobile.png`, `world-clock-mobile-fold.png`
- `solar-system-age-desktop.png`, `solar-system-age-mobile.png`, `solar-system-age-mobile-fold.png`
- `games-desktop.png`, `games-mobile.png`
- `about-desktop.png`, `about-mobile.png`
- `homepage-mobile-menu-open-fold.png` (mobile nav overlay)

Console was checked (`browse console --errors`) on every page/viewport combination above: **no console errors on any page tested**. No horizontal overflow was detected on mobile (`document.documentElement.scrollWidth === window.innerWidth === 375` on every page tested).

---

## What Works

- **Strong above-the-fold on desktop homepage.** H1 ("EVERY SECOND HAS A CALCULATOR."), subhead, all three CTAs (Explore Tools / Play Today's Game / Enter Realm), and the live countdown widget are all visible without scrolling at 1280×800 and 1920×1080, with zero layout shift risk since the live clock uses fixed-width digit boxes.
- **Mobile homepage above-the-fold is solid.** Heading, subhead, and primary CTA ("Explore 100+ Tools") are visible immediately at 375×812; the CTA button is full-width and easily tappable.
- **Mobile navigation is well-built.** The hamburger opens a full-height, scrollable overlay that reproduces the entire mega-menu (grouped by category, numbered lists, icons, "View all tools" links) — good for discoverability, with a clearly visible close (✕) button pinned in the header.
- **Consistent neo-brutalist dark theme** across every page type (tool pages, realm/game pages, static pages) — consistent card borders/shadows, consistent green/orange accent usage per section, consistent typography hierarchy (Cormorant serif for editorial headings, Space Grotesk for UI).
- **Ad placeholders are honest and non-intrusive.** Both the floating skyscraper rails and in-content `[Ad Container - 300×250]` / inline banner boxes are clearly labeled "Advertisement" with dashed borders, sit outside the primary tool card, and never overlap or block calculator inputs/results — this matches the site's own "About" page claim that ads don't block tools.
- **Zero console errors and zero horizontal scroll** across all 6 pages tested, at both desktop and mobile viewports — a clean technical baseline.
- **Tool pages are content-rich and well structured**: breadcrumbs, clear H1 + description, calculator card, results, "How to" steps, FAQ accordion (numbered), and "More in this group" cross-links — a repeatable, SEO-friendly template applied consistently (verified on Age Calculator and World Clock).

---

## Findings

### 1. World Clock card controls fail minimum touch-target size on mobile
**Severity:** Medium (Mobile usability / Accessibility)

**Description:** On `/clocks/world-clock` at 375×812, the per-clock prev/next/remove icon buttons (◀ ▶ ✕) measure **22×22px** via `getBoundingClientRect()`, and the "SWITCH TO ANALOG/DIGITAL" toggle measures 263×**31px** tall. Both are well under the widely-used 44–48px minimum touch target guideline (WCAG 2.5.5 / iOS HIG), making it easy to mis-tap the wrong control or accidentally remove a pinned clock instead of paging it, especially since ✕ (delete) sits directly beside ◀/▶ (navigate) with no extra spacing buffer.

**Recommendation:** Increase the tappable hit area of the icon buttons to at least 44×44px (padding can be added without growing the visible icon), and increase the toggle button's height to ~44px on mobile breakpoints. Add a small gap or confirm-on-tap for the ✕ remove action to reduce accidental deletions.

### 2. Floating skyscraper ad rails sit flush against the viewport edge at ~1600px width
**Severity:** Low-Medium (Visual polish)

**Description:** The desktop ad rails (`.desktop-ad-rail-left/right` in `styles/globals.css`) are positioned with `right/left: calc(50% + 630px)` and are hidden entirely below 1580px (`@media (max-width: 1579px)`). At the very common 1600×900 laptop resolution (just above the breakpoint), both 160px-wide ad boxes are pinned with **0px margin to the browser edge** — confirmed visually (`homepage-desktop-1600-adrails-edge.png`), where the ad box border touches the viewport edge while the navbar/content above still has normal padding. This reads as an unfinished/cramped edge case compared to the generous ~170px gutter seen at 1920px width.
- On mobile the rails are correctly hidden (verified no ad-rail elements/overflow on 375px viewport).

**Recommendation:** Add a minimum outer margin (e.g., `max(16px, calc(50% - 800px))`) so the rails never render flush against the browser chrome, or raise the hide breakpoint slightly (e.g., to 1650px) so the rails only appear once there's guaranteed clearance.

### 3. Mobile page title / breadcrumb truncation on long tool names
**Severity:** Low (Visual polish)

**Description:** On `/tools/age-calculator` at 375px, the breadcrumb trail truncates the current page name with an ellipsis ("Age Calculator (Down to the ...") because the full title doesn't fit the breadcrumb pill. The H1 itself also wraps across 3 lines, pushing the calculator form further down the fold on longer-named tools (this site has 100+ tools, many with descriptive parenthetical names).

**Recommendation:** On mobile, drop the current-page breadcrumb crumb (parent breadcrumbs are usually sufficient context) or truncate more gracefully with `text-overflow: ellipsis` plus a larger max-width; consider shortening long tool titles for the H1/breadcrumb specifically vs. the meta `<title>`.

### 4. Live clock/stat widget partially clipped at the fold on mobile homepage
**Severity:** Low (Visual polish)

**Description:** At 375×812 above-the-fold, the "◎ LIVE" countdown/stat card (which shows HR/MIN/SEC/MS and Tools/Games/Realm counts) is only ~10% visible at the very bottom edge of the viewport before the user scrolls — it's not a functional problem since the primary CTA is already visible, but the card is cut mid-row rather than fully above or fully below the fold, which looks like an accidental crop rather than an intentional design choice.

**Recommendation:** Either move the live widget above the CTA stack on mobile (it's a strong trust/social-proof signal — "100+ Tools, 3 Games, 1 Realm") or push it fully below the fold with adequate top margin so it isn't awkwardly bisected by the viewport edge.

---

## Above-the-Fold Summary

| Page | Desktop (1280/1920) | Mobile (375) |
|---|---|---|
| Homepage | H1, subhead, 3 CTAs, live widget — all visible | H1, subhead, 3 CTAs visible; live widget clipped at edge |
| Age Calculator | Breadcrumb, H1, subhead, full DOB form, live chronometer, Calculate button all visible | Breadcrumb (truncated), H1 (3 lines), subhead, DOB/time fields visible; Calculate button + results below fold |
| World Clock | Header controls + 2 of 4 clock cards visible | Header controls + Local Time card visible |
| Solar System Age (realm) | H1, form, and top of orbit visualization visible | H1, form fully visible; orbit visualization just below fold |
| Games | Hero + stat row visible | Hero + stat row visible |
| About | H1 + first paragraph visible | H1 + first paragraph visible |

Overall, primary CTAs are reliably above the fold on every page type tested, on both desktop and mobile.
