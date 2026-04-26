# Release Notes Presentation — Reusable Prompt

Use this prompt as a starting point whenever you need to turn release notes into a polished, interactive HTML presentation.

Copy the prompt below into a new Claude conversation, fill in the **four inputs** at the top, and send.

---

## How to use

1. Gather your inputs:
   - **Source**: a URL, pasted markdown/text, or a doc
   - **Brand**: company name + logo image URL + 2–3 colors (hex)
   - **Audience**: who will watch this deck
   - **Release label**: e.g. "April 2026" or "v4.2.0"

2. Paste the prompt below, fill the `<INPUT>` blocks, send.

3. Iterate. Ask for changes in plain language — reorder sections, change tone, swap colors, add filters, change export format.

---

# 📋 THE PROMPT

```
You are building a single-file interactive HTML presentation of release notes.

## INPUTS

### Source material
<INPUT: paste the release notes URL, markdown, or full text here>

### Brand
- Name: <INPUT: e.g. "Acme Corp">
- Logo: <INPUT: URL to a square logo image, or a single letter if no image>
- Primary color (dark): <INPUT: hex, e.g. #07254A>
- Primary color (bright): <INPUT: hex, e.g. #2B7FFF>
- Accent color: <INPUT: hex for highlights, e.g. #38BDF8>

### Audience & tone
<INPUT: e.g. "Internal engineering team. Technical but concise. Emphasize developer experience.">

### Release label
<INPUT: e.g. "Release Notes — November 2026" or "v4.2.0">

## DELIVERABLE

One self-contained HTML file at /mnt/user-data/outputs/release-notes-<short-slug>.html.
No external dependencies except Google Fonts (Inter + JetBrains Mono) loaded from their CDN.

## STRUCTURE — FIXED ORDER

1. **Cover slide** — release label, sub-headline, 3–4 highlight chips (e.g. "6 WOW features", "2 new modules"), a T-shirt size legend explaining complexity ratings, and **chronological navigation links** in the footer. The footer should show "← Previous Month" and/or "Next Month →" links pointing to the sibling release folders (e.g. `../2026-03/`). Only show links for months that exist. These are styled as subtle pill-shaped links on the dark cover background (`rgba(255,255,255,0.6)` text, `rgba(255,255,255,0.15)` border, hover to white).

2. **Section 01 · WOW Business Features** (special golden-accent divider)
   - Lead with highest-impact features for the business: revenue lift, UX wins, operational efficiency.
   - 4–8 slides typically.
   - Each slide tagged `★ WOW Feature` with a gold/amber tag color (instead of the regular blue "Update" tag).

3. **Remaining sections** — group by product area, ordered business → technical:
   Typical order: Marketplace/E-commerce → Frontend/UX → Data/Content → Platform/Infrastructure → Admin/DX Tooling → Community & Resources.
   Adapt to source material — don't force irrelevant sections.

4. **Backlog screen** (second-to-last) — see "Backlog feature" below.

5. **Thank you / CTA slide** (last) — 2–3 call-to-action buttons, plus **chronological navigation links** (same style as the cover slide) centered above the footer text, linking to the previous and/or next month's deck.

Between each major group, insert a **section divider slide** with a section number, title, short description, and one headline stat (e.g. "6 business-critical features"). The right column of each divider slide must list the **titles of all feature slides in that section** as clickable buttons (numbered sequentially). Clicking a title navigates directly to that slide. This gives viewers a preview of what's in the section before they start navigating through it.

## CONTENT SLIDE FORMAT (required fields per feature)

Every feature slide must have all of these:

- **category**: short breadcrumb, e.g. "Platform · 3.1001.0" or "Business · Marketing"
- **title**: HTML-enabled; wrap the key phrase in `<span class="accent">...</span>` for a gradient accent
- **problem**: 1–2 sentences describing the pain point before this change. Concrete, not generic.
- **solution**: what shipped. Use `<strong>` for the critical phrases, `<code>` for API names/versions/flags, `<ul><li>` for multi-part solutions.
- **size**: T-shirt size string — one of `S`, `M`, `L` (see scale below)
- **integration**: 1–3 sentences on what's required to adopt this feature. Include module versions and concrete setup steps. **Do NOT include time estimates** (no "~1 day", "2-3 weeks", etc.) — the T-shirt size already conveys complexity, and time estimates depend too much on the adopter's context.
- **image** (preferred) OR **noVisual: true** with an **icon** key from the icon set
- **caption** (if image): short tagline under the screenshot
- **wow: true** (only for WOW Business section slides)

## T-SHIRT SIZE SCALE (3 levels, no time estimates)

- **S** (green #22C55E) — Light: config only or drop-in. Usually a module version bump with minor settings.
- **M** (amber #FBBF24) — Medium: setup + development. Custom modules may need refactoring.
- **L** (orange #F97316) — Large: integration or migration. Touches multiple systems, external accounts, or architecture.

Be honest about sizing. A drop-in UI component is S. A framework upgrade affecting every custom module is L. When in doubt, err toward the larger size.

## VISUAL DESIGN TOKENS

CSS custom properties at the top of the stylesheet:
- Dark bg: user-provided dark primary
- Bright accent: user-provided bright primary
- Cyan/highlight: user-provided accent
- Text: #0F172A, Muted: #5B6B82, Line: #DCE5F1
- BG: #F4F7FB, BG-2: #EAF1FA
- Size colors: S=#22C55E, M=#FBBF24, L=#F97316

Typography: Inter for UI, JetBrains Mono for numbers/code/IDs.

Layout: Each slide is a 1200×720 card centered on a soft gradient backdrop. Border-radius 24px, soft shadow. Slides absolutely positioned and stacked — only the active one is visible.

Problem/Solution/Integration blocks use left border accents: orange (problem), blue (solution), dark navy (integration).

## BRAND MARK (logo)

In the slide header, render the brand mark as a 36×36 rounded container.

If the user provided a **logo image URL**:
```html
<div class="brand-mark"><img src="<URL>" alt="<Brand> logo" /></div>
```
CSS: `.brand-mark { overflow: hidden; border-radius: 10px; }` and `.brand-mark img { width: 100%; height: 100%; object-fit: cover; }`.

If only a **single letter** was provided, use it as styled text inside a gradient-filled container.

On the cover slide (dark background), the brand-mark container should have a white or near-white background with small padding so the logo doesn't disappear.

## T-SHIRT BADGE IN SLIDE HEADER

Keep the badge minimal — just the colored size pill, no text label next to it.

```html
<span class="ts-badge" data-size="${size}">
  <span class="ts-pill">${size}</span>
</span>
```

The `.ts-badge` is a 3px-padded white container with 8px border-radius (small square, not pill-shaped). The `.ts-pill` inside is the colored rectangle with the single letter. Do not add "Integration" or any descriptive text next to it — the size is self-evident from the legend on the cover.

## INTEGRATION BLOCK (below Solution)

Label reads only "Integration" — no "Integration · S" suffix. The size is already shown in the header badge, so no duplication.

## INTERACTIVITY REQUIREMENTS

### 1. Slide transitions
Fade + horizontal slide + scale, 0.45s cubic-bezier. Inactive slides get `visibility: hidden` AFTER the fade completes (use a `transition` on the visibility property with a delay matching the fade duration) — this prevents layout bleed-through where previous slide text shows behind the active one.

### 2. No inline `onerror` handlers on images
Use a delegated `addEventListener('error', ...)` pattern with `data-fallback-icon` attributes. Inline `onerror` strings with escaped quotes cause rendering artifacts like `'" />` to leak onto the page.

### 3. Navigation
- Bottom pill: prev/next arrows, counter (01/NN), Start/End jump buttons, `Backlog N` button, and a **TOC button** that toggles the global table of contents panel (see §4b for icon spec)
- Top-right corner: inline keyboard hint showing `←` `→` `B` `F` `T` — **each key is a clickable `<button>`** with hover state, not a decorative `<span>`. Clicking triggers the same action as the keyboard shortcut.
- Keyboard: Arrow keys (+ space + PageDown/Up) to navigate, Home/End to jump, F for fullscreen, B to toggle current feature into backlog, **T to toggle table of contents**
- Touch swipe left/right for mobile
- Progress bar across the top of the viewport

### 4. Table of contents — two levels

Navigation has two complementary TOC mechanisms:

#### 4a. Section divider slide list (in-slide)

Each section divider slide displays a **list of that section's feature slide titles** in the right column, overlaid on the gradient background. Each title is a clickable `<button>` (numbered sequentially, e.g. `01`, `02`) that navigates directly to that feature slide. Styled with semi-transparent white text on the dark divider background. This gives viewers a preview of what's in the section.

#### 4b. Global TOC panel (slide-out)

A slide-out panel that lets users see and jump to any section or slide across the entire deck.

- **Toggle**: opened/closed by the TOC button in the bottom nav pill or the `T` keyboard shortcut. Pressing `T` or clicking the button again (or pressing `Escape`) closes it. The TOC button icon must look like a table-of-contents outline (three rows, each with a small filled square on the left and a horizontal line on the right), **not** a hamburger menu. Example SVG: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><rect x="3" y="4.5" width="3" height="3" rx="0.5"/><rect x="3" y="10.5" width="3" height="3" rx="0.5"/><rect x="3" y="16.5" width="3" height="3" rx="0.5"/>`
- **Position**: fixed panel on the left side of the viewport, overlaying the slides. Width ~320px on desktop, full-width on mobile. Semi-transparent backdrop behind the panel dims the rest of the deck.
- **Animation**: slides in from the left, 0.3s ease. Backdrop fades in simultaneously.
- **Content**: a vertical list of all sections derived from the `slides` array at runtime. Each **section entry** shows:
  - Section number and title (pulled from divider slides' `num` and `title` + `titleAccent` fields)
  - Number of feature slides in that section (count of content slides between this divider and the next)
  - A highlighted/active state for the section the user is currently viewing
  - **Nested slide titles**: below the section header, list the plain-text title of every feature slide in that section as indented sub-entries (smaller font, `--virto-muted` color). Each sub-entry is also a clickable button that jumps directly to that individual slide. **By default, only the current section's sub-entries are expanded** (visible). All other sections show only the section header. Sub-entries are hidden with CSS (`display: none`) and toggled to `display: block` via an `.expanded` class when the section is active.
- **Special entries**: the Cover slide appears at the top as "Cover", and the Backlog/Thanks slides appear at the bottom by name.
- **Click to jump**: clicking a section header closes the TOC and navigates to that section's divider slide. Clicking an individual slide title closes the TOC and navigates directly to that feature slide.
- **Current section indicator**: the entry for the section containing the currently active slide gets a left-border accent (using `--virto-blue`) and bold text. The current individual slide gets highlighted text.
- **Styling**: matches the deck's design tokens — `Inter` font, `--virto-navy` text, `--virto-bg` background, `--virto-line` separators, `--virto-blue` for the active indicator. The panel has the same `backdrop-filter: blur(20px)` and soft shadow as the bottom nav.
- **Accessibility**: the panel is an `<aside>` with `role="navigation"` and `aria-label="Table of contents"`. Each entry is a `<button>`. When the panel opens, focus moves to it; when it closes, focus returns to the TOC toggle button.
- **Mobile**: panel takes full width, entries get larger tap targets (min 44px height). Close on any entry click or swipe-left.

### 5. Backlog feature (the signature interaction)

- Every content slide has a `+ Add to backlog` button in the slide header. When pressed, it turns into `✓ In backlog`. Press again to remove.
- Bottom nav includes a `Backlog N` button showing the current count; disabled when empty, clicking it jumps to the Backlog screen.
- **Backlog screen** (second-to-last slide): lists all selected features with number, title, category, T-shirt size badge, and a remove-X button per row. Two primary actions at the top:
  - **Copy as Markdown** — generates a Markdown table with columns `# | Feature | Size | Category` and copies to clipboard via `navigator.clipboard.writeText()`. Include a `document.execCommand('copy')` fallback for older browsers. Prepend with a title and a line indicating selection count. End with the source URL.
  - **Clear all** — confirms then empties the Set.
- State stored in a JavaScript `Set` keyed by slide index. Session-only — intentional, so users get a fresh deck each visit.
- Toast notification (top center, slides down from above) on every action: added / removed / copied / cleared.

### 6. Image fallback
When a screenshot fails to load, replace the `<img>` with a centered icon circle + "Screenshot unavailable" label.

## ACCESSIBILITY & RESPONSIVENESS

- Desktop first (1200×720), collapses to single column under 900px
- On mobile: hide Start/End jump buttons, hide keyboard hint, stack problem/solution/integration above the visual, reduce paddings
- Print CSS: make all slides visible and page-break between them

## COPY STYLE

- **Problem statements**: concrete, user-impacting. Not "users had issues with X" — instead "customers had no way to share a specific product variant, forcing recipients to re-select options."
- **Solution statements**: lead with the verb or the new capability. Use `<strong>` for one key phrase per slide, not more.
- **Integration**: realistic and specific. Mention module versions and concrete setup steps. **Never include time estimates.** Let the T-shirt size communicate complexity; the reader will estimate time based on their own team.
- **Titles**: 3–7 words. Put the newsworthy phrase inside `<span class="accent">...</span>` so the gradient draws the eye.

## WHAT TO AVOID

- Time estimates anywhere in the deck (no "1-2 days", "~3 weeks", "few hours")
- Generic spinner loading states — use skeleton shapes matching expected content
- Decorative emoji in slide bodies (the topic tags and ★ WOW marker are enough)
- Long prose paragraphs — break into Problem/Solution/Integration every time
- More than one CSS framework. Pure CSS only, no Tailwind/Bootstrap
- External JS frameworks. Vanilla JS only
- localStorage or sessionStorage — the backlog is intentionally session-only
- `onerror` attributes with nested quotes. Always use `addEventListener` with `data-*` attributes
- Text labels next to the T-shirt pill (no "S Integration", just the pill)
- Size-level duplication in the Integration block label (no "Integration · S")

## OUTPUT CHECKLIST

Before presenting the file, verify:

- [ ] JavaScript parses cleanly (no syntax errors — run node --check or equivalent)
- [ ] Every content slide has all 6 required fields (category, title, problem, solution, size, integration)
- [ ] Every size value is one of S / M / L (no XS, no XL)
- [ ] No integration field contains time references (grep for "day", "week", "hour", "month", "~")
- [ ] Section 01 is the WOW Business Features section with golden divider
- [ ] Backlog screen appears as second-to-last slide, thanks slide is last
- [ ] Hint keys at top are `<button>` elements, not `<span>`, and styled with hover state (includes `T` for TOC)
- [ ] Each section divider slide lists that section's feature titles in the right column as clickable buttons
- [ ] Global TOC panel lists all sections with nested slide titles, highlights the current one, and clicking any entry jumps to that slide
- [ ] TOC panel opens/closes with `T` key, nav TOC button, and `Escape`; focus is managed correctly
- [ ] TOC nav button uses the outline icon (squares + lines), not a hamburger
- [ ] No `onerror` attributes anywhere in the HTML
- [ ] Inactive slides use both `opacity: 0` AND `visibility: hidden` (with delayed transition)
- [ ] Brand mark renders the provided logo image (with overflow:hidden container) or fallback letter
- [ ] Copy-as-Markdown button works and produces a valid Markdown table
- [ ] File is at /mnt/user-data/outputs/ with a descriptive name
- [ ] Total slide count is announced (e.g. "35 slides: cover, 6 section dividers, 26 features, backlog, thanks")
```

---

## Optional: follow-up prompts

After the first version is delivered, these are useful follow-ups:

**Restructure sections**
> Reorder so that [Section X] comes before [Section Y]. Keep all slides intact.

**Adjust sizing**
> Review the T-shirt sizes and downgrade anything that's actually just a module version bump with no config required.

**Change tone**
> The current tone is too marketing-heavy. Rewrite Problem/Solution fields for an engineering audience — more concrete, fewer adjectives.

**Swap logo**
> Replace the brand mark with <IMAGE_URL>. Keep fallback behavior if the image fails to load.

**Localize**
> Add [Russian/Spanish/German] translations of Problem and Solution fields alongside the English text. Keep English titles.

**Additional export formats**
> Add a "Copy as JSON" button on the backlog screen that outputs an array of `{title, category, size, problem, solution, integration}` objects. Keep the existing Markdown button.

**Add filters**
> Add size filter chips (S/M/L) above the backlog list so the user can show/hide items by complexity.

**Persist across sessions**
> Use `window.storage.set('backlog', ...)` to persist the backlog across page reloads. Add a "Reset session" button.

**Publish to GitHub Pages**
> Rename the output file to `index.html` so it can be published directly via GitHub Pages with a clean URL (no filename in path).

---

## Publishing to GitHub Pages (quick reference)

After the HTML is generated:

1. Rename the file to `index.html`
2. Create a new public repository on github.com
3. Upload `index.html` via the web interface OR push with git:
   ```bash
   git init && git add index.html && git commit -m "Add release deck"
   git branch -M main
   git remote add origin https://github.com/<user>/<repo>.git
   git push -u origin main
   ```
4. In the repo: **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**
5. Wait 30–60 seconds. Your deck is live at `https://<user>.github.io/<repo>/`

For a multi-release archive, use subfolders:
```
release-notes/
├── index.html          ← optional landing page with links
├── 2026-04/index.html
├── 2026-05/index.html
```
URLs become `<user>.github.io/release-notes/2026-04/`.

For one-off sharing without git: **Netlify Drop** (app.netlify.com/drop) accepts a dragged HTML file and gives back a URL in seconds.

---

## Why these specific requirements?

Each item in the prompt solved a real problem during development of the Virto Commerce April 2026 deck:

- **`visibility: hidden` on inactive slides** — without it, previous slide content bleeds through on some browsers.
- **No inline `onerror`** — escaped quotes in nested JS strings rendered literal `'" />` artifacts on screen.
- **Clickable keyboard hints** — users want to discover shortcuts by clicking, not by memorizing.
- **Three-level T-shirt scale (S/M/L)** — XS/XL adds decision fatigue without adding signal. S/M/L is the minimum meaningful granularity for backlog triage.
- **No time estimates** — time is context-dependent (team size, existing codebase, skills). The size already communicates effort bucket; calendar days belong in the adopter's own project plan.
- **Integration field** — turns "here's what shipped" into "here's what it costs to adopt" — the decision-useful framing.
- **Backlog export as Markdown** — the minimum friction path into Jira/Linear/GitHub Issues for actual work items.
- **WOW section first** — execs and product managers want business impact up front, not buried behind platform notes.
- **Logo as image, not letter** — a single letter looks amateur; a real logo signals "this is an official artifact."
- **Minimal size badge (no label)** — the pill + color + legend on the cover is enough. Extra text is noise.
