---
name: The God of Time
description: A dual-purpose time platform — 100 precision calculators and immersive cosmic experiences, united by one commanding brand.
colors:
  void-black: "#06060A"
  deep-space: "#0D0D14"
  instrument-panel: "#12121C"
  panel-hover: "#16162A"
  border-default: "#1E1E2E"
  border-subtle: "#161622"
  ink-primary: "#E8E8F0"
  ink-muted: "#6B6B80"
  ink-faint: "#3A3A50"
  cosmos-blue: "#4B8EF1"
  bio-gold: "#C9A84C"
  paradox-violet: "#7B61FF"
  whim-teal: "#3ABFBF"
  destiny-amber: "#E09A3A"
  utility-time: "#52C4A0"
  utility-hr: "#60A5D4"
  utility-project: "#9B8EF5"
  utility-global: "#F5A857"
  utility-health: "#E87C7C"
  light-bg: "#F4F3EF"
  light-ink: "#1A1A2E"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.75rem, 4vw, 3.25rem)"
    fontWeight: 300
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  mono:
    fontFamily: "JetBrains Mono, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "12px"
  lg: "14px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-calculate:
    backgroundColor: "{colors.utility-time}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    height: "52px"
    padding: "0 24px"
  button-calculate-hover:
    backgroundColor: "{colors.utility-time}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    height: "52px"
    padding: "0 24px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.utility-time}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  input-tool:
    backgroundColor: "{colors.deep-space}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.sm}"
    height: "48px"
    padding: "0 16px"
  card-category:
    backgroundColor: "{colors.deep-space}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
  card-realm:
    backgroundColor: "{colors.instrument-panel}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "28px"
  badge-category:
    backgroundColor: "transparent"
    textColor: "{colors.cosmos-blue}"
    rounded: "{rounded.pill}"
    padding: "3px 12px"
---

# Design System: The God of Time

## 1. Overview

**Creative North Star: "The Cosmic Instrument Room"**

Tools that work. A room that shouldn't exist. The payroll calculator and the black hole simulator live side by side — and neither apologizes for the other. This is the design philosophy of The God of Time: a dark, commanding space where precision instrumentation and cosmic wonder occupy the same architecture. Nothing is decorative. Everything pulls weight.

The visual system operates from a deep void. Not dark mode as aesthetic gesture — darkness as deliberate identity. Time at cosmic scale is experienced in the dark. The ten-color accent system maps directly to content categories: each discipline (cosmos, biology, sci-fi, the whimsical, personal destiny, and five utility domains) carries its own spectral signal. Color is information. The palette never blends into a unified gradient; each accent is a distinct instrument reading.

Elevation is structural, not atmospheric. The signature `4px 4px 0px 0px` hard-offset shadow carries no blur; it marks the physical boundary of a surface — a panel extruded from a switchboard. On hover, the shadow color shifts to the category accent, confirming which instrument is being engaged. Components feel retro-mechanical: buttons press, cards lift, inputs acknowledge. You always know when you've touched something.

The system explicitly rejects four failure modes: the generic SaaS / Notion-clone (cream background, Inter-and-rounded-cards grid, blue pill CTA), the NASA / government utility aesthetic (correct information without personality), the hypnotic overwhelming dark (glow saturation, particle blur, rave-flyer motion), and the childish / gamified (rainbow colors, cartoon emojis as primary UI). These are not degrees of the same spectrum — they are four distinct wrong answers.

**Key Characteristics:**
- Dark-first at every scale: tool pages, realm pages, navigation, dialogs
- Ten-signal accent system where color = category identity, never decoration
- Brutalist-structural elevation: hard 4px offset, no blur, no ambient glow
- Cormorant Garamond light serif for cosmic display; Inter for all functional text; JetBrains Mono for timestamps and data
- Retro-mechanical components: physical weight in hover states, tactile input acknowledgment
- Two registers, one voice — tool pages are precise, realm pages are cosmic, same brand at different intensity

## 2. Colors: The Void and Its Signals

A deep void foundation with ten precisely tuned category signals. Color is never used for decoration; it is always a system signal. Every accent belongs to a category; cross-assigning accents is a semantic error, not a style preference.

### Neutral — The Void

- **Void Black** (`#06060A`): The deepest surface. Page background in dark mode. Never lightened for effect; the darkness is the point.
- **Deep Space** (`#0D0D14`): Secondary surface — sections, mega-menu backgrounds, Radix popover and select backdrops.
- **Instrument Panel** (`#12121C`): Card backgrounds. The surface where content lives.
- **Panel Hover** (`#16162A`): Card hover state. One subtle step lighter than Instrument Panel; signals engagement without color.
- **Boundary Line** (`#1E1E2E`): Standard borders. All card, input, and container borders default to this in dark mode. The visible edge of structure.
- **Signal Void** (`#3A3A50`): Faint text, placeholder copy, disabled state markers.
- **Muted Readout** (`#6B6B80`): Secondary text — navigation items at rest, helper copy, label text. Check contrast at 12px and below; it is close to the 4.5:1 minimum on dark surfaces.
- **Ghost Light** (`#E8E8F0`): Primary text in dark mode. Slightly cool-shifted; reads clearly on all void backgrounds without the harshness of pure white.

**Light mode equivalents** (active when `.light` class is set): bg-base `#F4F3EF`, bg-surface `#EDECEA`, bg-card `#FFFFFF`, text-primary `#1A1A2E`, text-muted `#8A8A9A`, borders `#DDDBD5`. All accent colors shift to darkened variants (`--accent-*-dark`) for contrast compliance in light mode.

### Primary — Realm Accents (Five Cosmic Categories)

Each accent is semantically bound to its content category. Never cross-assign.

- **Cosmos Blue** (`#4B8EF1`): Space & Cosmos realm. Also used for site-wide in-text links and primary navigation affordances — the one accent that crosses categories as a utility signal.
- **Bio Gold** (`#C9A84C`): Biology & History realm. Warm-scientific, aged amber.
- **Paradox Violet** (`#7B61FF`): Sci-Fi & Paradox realm. The most saturated accent in the system; reserved for its category only.
- **Whim Teal** (`#3ABFBF`): Whimsical & Absurd realm. Simultaneously calm and strange.
- **Destiny Amber** (`#E09A3A`): Personal Destiny realm. Warm, fateful, directional.

### Secondary — Utility Accents (Five Tool Domains)

- **Time Green** (`#52C4A0`): Standard Time & Date tools. Also the shadcn `--primary` action color — appears on focused inputs, active tab indicators, and the date-picker selection.
- **HR Sky** (`#60A5D4`): HR, Payroll & Freelance tools.
- **Project Lavender** (`#9B8EF5`): Project Management tools.
- **Global Amber** (`#F5A857`): Global Time & Zones tools.
- **Health Coral** (`#E87C7C`): Health & Lifecycle tools. Also the `--destructive` error color (darkened in light mode).

### Named Rules

**The Signal Rule.** Category accent colors are semantic bindings, not aesthetic choices. Cosmos Blue on a realm card means Space & Cosmos. Applying Cosmos Blue to a health tool is a misinformation error. If a new category is added, create a new named accent; do not reuse an existing one.

**The No-Ambient-Glow Rule.** Accent colors do not radiate. No `box-shadow: 0 0 20px var(--accent)`. No gradient-glowing text. The only permitted accent bloom is the 4px input focus ring (`color-mix(in srgb, var(--accent) 12.5%, transparent)`), which communicates keyboard state, not decoration.

## 3. Typography: Two Registers, One Voice

**Display Font:** Cormorant Garamond (Georgia, serif fallback) — weights 300 and 400, normal and italic
**UI Font:** Inter (system-ui, sans-serif) — weights 400, 500, 600
**Mono Font:** JetBrains Mono (Consolas, monospace) — weight 400

**Character:** Cormorant Garamond at weight 300 reads as ancient, vast, and precise simultaneously — it carries cosmic scale. Inter is the instrument panel: workhorse, neutral, exactly as wide as needed. JetBrains Mono marks machine-time: timestamps, hex values, calculated outputs. The three faces never compete; each occupies a distinct register.

### Hierarchy

- **Display** (Cormorant Garamond 300, `clamp(1.75rem, 4vw, 3.25rem)`, line-height 1.08, letter-spacing -0.01em): Realm titles, homepage hero headline, "Related Realms" section title. Cormorant Garamond only — never Inter at display scale. Often italic. Ceiling: 3.5rem.
- **Headline** (Inter 600, 1.125rem / 18px, line-height 1.3): Section headings on tool pages, dialog titles, mega-menu category names at larger scale.
- **Title** (Inter 600, 0.9375rem / 15px, line-height 1.4): Card headings, sub-section labels within tool pages.
- **Body** (Inter 400, 0.875rem / 14px, line-height 1.65): Tool descriptions, SEO content, help text, realm card descriptions. Max line length 65–75ch for prose passages.
- **Label** (Inter 700, 0.625–0.75rem / 10–12px, uppercase, letter-spacing 0.1–0.18em): Category badges, input field labels, realm page eyebrow tags. Used once per component, never stacked.

### Named Rules

**The One-Instrument Rule.** Cormorant Garamond is for cosmic content only — realm titles, hero headings, "Related Realms" section heading. It does not appear on tool-page H1s, form labels, button text, or helper copy. When in doubt, use Inter.

**The Label Ceiling Rule.** Uppercase tracked labels appear at most once per component — category badge OR input label, never both simultaneously. The pattern reads as deliberate when rare; it reads as AI grammar when applied to every text element.

## 4. Elevation: Structural Extrusion

This system has no ambient shadows on content surfaces and no blur-layer depth. Depth is expressed through two mechanisms: **tonal surface layering** (void-black → deep-space → instrument-panel → panel-hover, each step slightly lighter) and **brutalist-structural hard shadows** (solid-color, no blur, exact 4px offset).

The hard shadow is the system's signature: `box-shadow: 4px 4px 0px 0px var(--border)`. No blur radius. No spread. The shadow is a construction line — the physical extrusion of the surface edge — not a simulation of light. On interactive hover, the shadow color shifts to the category accent, confirming which instrument is being engaged. This is the retro-mechanical read: the panel reacts to your hand.

### Shadow Vocabulary

- **Structural-default** (`4px 4px 0px 0px #1E1E2E`): All interactive cards and containers at rest. Category cards in the nav mega-menu. The realm canvas zone. Tool calculate buttons.
- **Structural-engaged** (`4px 4px 0px 0px <category-accent>`): Same geometry, accent color substituted. Appears on hover of category cards, branded nav buttons, and the realm canvas frame.
- **Structural-minor** (`3px 3px 0px 0px #1E1E2E`): Smaller interactive elements — "All categories" nav pills, emoji avatar circles, count badges.
- **Ambient-overlay** (`0 8px 32px rgba(0,0,0,0.4)`): Floating surfaces only — Radix dropdowns, select menus, popovers. Never for card-level content.
- **Ambient-dialog** (`0 24px 64px rgba(0,0,0,0.5)`): Modal dialogs only. Maximum ambient depth in the system.

### Named Rules

**The No-Glow Rule.** `box-shadow: 0 0 Xpx ...` — zero x/y offset, positive blur radius — is prohibited for all content surfaces. The one exception is the keyboard focus ring (`0 0 0 4px color-mix(in srgb, var(--accent) 12.5%, transparent)`), which is an accessibility affordance, not decoration.

**The Flat-By-Default Rule.** Every surface is flat at rest. Shadows appear only in response to interactive state: hover, focus, active. A content card with a shadow at rest is a design error — either make it interactive or remove the shadow.

## 5. Components

### Buttons

Retro-mechanical feel. They press. They confirm. No bounce, no elastic easing.

- **Shape:** 6px radius on all button types.
- **Calculate / Primary CTA:** Background = current tool domain accent, white text, height 52px, full width of the input zone, Inter 700 13px uppercase, letter-spacing 0.08em. Structural-default shadow at rest; structural-engaged (accent) on hover. Active state: `scale(0.99)` + darker overlay. Never a fixed blue; the accent is always the domain color.
- **Copy / Share Ghost:** 36px height, transparent background, 1px border-default. Text = ink-muted. On hover: border and text shift to domain accent. No fill change. Structural-minor shadow.
- **Navigation Pills ("All categories →"):** 28–36px height, 2px border ink-primary, bg = accent/10 tint, text = ink-primary, Inter 700 12px uppercase. Structural-minor shadow. Active: translate-y 1px, shadow shrinks to 1px.

### Category Cards (Nav Mega-menu)

The system's most distinctive pattern — emoji avatar clusters with accent-shifting borders.

- **Background:** deep-space at rest, panel-hover on hover.
- **Border:** 2px solid border-default → category accent on hover.
- **Radius:** 14px (lg).
- **Shadow:** structural-default → structural-engaged (category accent) on hover. Both shift simultaneously.
- **Category label:** Inter 700, 10px, uppercase, tracking-wider, ink-muted at rest → category accent on hover.
- **Avatar cluster:** 32px circles, bg instrument-panel, 2px border ink-primary, stacked with -8px overlap. Structural-minor shadow. Each avatar lifts and scales on individual hover.
- **Count badge:** 32px pill, same 2px border treatment, JetBrains Mono 10px, ink-primary.

### Realm Cards

Atmospheric cards with gravitational gradient overlays.

- **Size:** 320px height (standard), 400px wide-variant spanning 2 columns.
- **Layering:** Radial gradient top (`color-mix(in srgb, accent 8%, transparent)`) + linear gradient bottom overlay (`bg-base 40% → transparent 100%`). Content sits above both overlays at z-index 20.
- **Border:** 1px border-default at rest → category accent on hover. Scale 1.01 on hover.
- **Radius:** 12px.
- **Content zone:** Category badge (pill, 10px uppercase, accent color), Cormorant Garamond 300 title (26px standard / 32px wide), Inter 400 13px description (max 400px width, ink-muted).
- **Enter badge:** "Enter →" pill in top-right, fades in from `translateX(8px)` on card hover. Backdrop-blur 8px — one of two permitted blur uses in the system.

### Tool Input Fields

Precision instrument aesthetic.

- **Height:** 48px — consistent across all tool pages, never shorter.
- **Background:** deep-space.
- **Border:** 1px border-default at rest. On focus: 2px category accent + 4px `color-mix` glow ring (`rgba(accent, 12.5%)`). Transition 150ms.
- **Radius:** 6px.
- **Typography:** Inter 400, 15px, ink-primary.
- **Labels:** Inter 500–700, 12px, uppercase, letter-spacing 0.08em, ink-muted, margin-bottom 8px.
- **Grid:** 2-column on desktop (≥768px), 1-column on mobile.

### Realm Canvas Zone

The primary experience frame — "the screen within the screen."

- **Border:** 2px solid ink-primary. Intentionally high-contrast; this frame marks where the experience begins.
- **Radius:** 12px.
- **Shadow:** `4px 4px 0px 0px var(--border)`.
- **Min height:** 65vh — the canvas is the experience, never collapsed.
- **Margin:** 24px sides on desktop, 16px on mobile.

### Accent Badges / Category Chips

- **Shape:** Full pill (999px), 3px vertical / 10–12px horizontal padding.
- **Style:** Background `color-mix(in srgb, accent 10–12%, transparent)`. Border `color-mix(in srgb, accent 25–30%, transparent)`. Text = accent color.
- **Typography:** Inter 600, 9–10px, uppercase, letter-spacing 0.12–0.15em.
- **Use:** Category labels on realm cards, AI-powered tags, tool-page eyebrow labels. One per component; never stack multiple badges vertically on the same element.

### Navigation

- **Fixed header:** 56–64px. Transparent at page top; `background: bg-surface/80 + backdrop-blur-12px + border-bottom + shadow-md` once scrolled past 80px.
- **Logo:** "✦ GOD OF TIME" — Cormorant Garamond light, 18px, tracking 0.25em, ink-primary. The ✦ mark is part of the logotype; do not remove it.
- **Nav links:** Inter 500, 14px, ink-muted at rest → ink-primary on hover. No underlines.
- **Mega-menu panel:** Full-viewport-width, bg-card, 2px bottom border ink-primary, ambient-dialog shadow. Slides in with `fade-in + slide-from-top` 200ms.
- **Theme toggle:** Retro I/O rocker switch — two stacked segments (I / O), 2px border ink-primary, active half = bg-ink-primary / text-bg-base, inactive = bg-surface / text-muted. **This is a brand signature interaction. Do not replace with a sun/moon icon or a rounded toggle switch.**

## 6. Do's and Don'ts

### Do:

- **Do** use `#06060A` (Void Black) as the page background for all dark-mode surfaces. It is the correct floor; lighter values weaken the identity.
- **Do** apply `4px 4px 0px 0px var(--border)` (no blur) to all interactive card-level components at rest. Shift the shadow color to the category accent on hover.
- **Do** match accent color to content category exactly — Cosmos Blue for space content, Bio Gold for biology, Paradox Violet for sci-fi, Whim Teal for whimsical, Destiny Amber for personal destiny, and each utility color for its domain. This is semantic, not decorative.
- **Do** use Cormorant Garamond 300 for realm titles, hero headings, and cosmic-register display text only. Inter handles all functional text.
- **Do** keep the I/O rocker switch for the theme toggle. It is a brand signature, not a quirky add-on.
- **Do** carry the brand into tool pages — precise, not clinical. Dark palette, structured typography, and the category accent color all apply on tool pages.
- **Do** use the emoji avatar cluster pattern for discovery navigation — 32px circles, stacked with -8px overlap, 2px ink-primary border.
- **Do** check `--text-muted` (`#6B6B80`) contrast at small sizes (≤12px). It passes at 14px+ but is close to the 4.5:1 minimum at body scale on dark backgrounds.
- **Do** include `@media (prefers-reduced-motion: reduce)` alternatives for every transition or animation.

### Don't:

- **Don't** use warm-neutral or cream backgrounds. The SaaS / Notion-clone failure mode begins with near-white or warm-tinted bodies (`#F5F0E8`, `#FAFAF8`, etc.). The light-mode bg-base (`#F4F3EF`) is the maximum warmth in the system; it is never the dark-mode default.
- **Don't** use ambient glow shadows (`box-shadow: 0 0 20px var(--accent)`). The only permitted zero-offset blur is the 4px keyboard focus ring — an accessibility signal, not an aesthetic effect.
- **Don't** use gradient text (`background-clip: text` + gradient background). All text uses a single solid color. Emphasis is through weight and size, not gradient.
- **Don't** use `border-left` or `border-right` thicker than 1px as a colored stripe on cards, callouts, or list items. Use background tints, full borders, or accent badges instead.
- **Don't** use glassmorphism as a default card treatment. Backdrop-blur is permitted in exactly two places: the navbar on scroll (functional, separating header from content) and the realm-enter hover badge (purposeful micro-reveal). Never on static content cards.
- **Don't** make tool pages feel like a government utility: grey tables, clinical sans-serif headlines, neutral blue CTAs. The Cosmic Instrument Room aesthetic carries into every tool page.
- **Don't** introduce accent colors outside the ten-color system. If a new category is added, create a new named token; do not reuse an existing accent for a different category.
- **Don't** animate layout properties or use bounce/elastic easing. All transitions use ease-out with exponential curves (150–300ms). Every animated element needs a `prefers-reduced-motion` fallback.
- **Don't** apply uppercase tracked labels to every text element. One per component is the ceiling. Overuse produces AI grammar, not design voice.
- **Don't** replace the I/O rocker switch with a sun/moon icon or a rounded pill toggle. Replacing it is a brand regression.
- **Don't** use Cormorant Garamond on tool-page headings, form labels, or CTA buttons. It belongs to cosmic content only; functional text is always Inter.
