---
name: release-notes-deck
description: Use when the user wants to create a new monthly Virto Commerce release-notes deck from a community-forum URL (e.g. "Create release notes from https://www.virtocommerce.org/t/virto-s-release-notes-august-2026/..."). Covers the full workflow — fetch the source, plan sections, copy the previous month as template, replace the slides array, wire chronological navigation between months, update README, and verify layout across viewports. Also invoke when a user says "add a new month", "generate a release deck", or drops a raw notes URL and asks for a deck.
---

# Create a monthly release-notes deck

Build a self-contained interactive HTML slide deck for one Virto Commerce monthly release, matching the design and behavior of every existing deck in this repo.

## When to use

- User provides a URL like `https://www.virtocommerce.org/t/virto-s-release-notes-<month>-<year>/<id>` and asks to turn it into a deck.
- User says "create a release deck for [month]" or "add [month] to the release notes site".
- User is preparing the monthly release announcement and needs the interactive deck alongside the forum post.

## Prerequisites

- The repo is a checkout of `VirtoCommerce/vc-release-notes` with existing month folders `2026-01/` … `2026-NN/` and the reference file `2026-07/index.html` (or newer).
- The full presentation spec lives at [prompts/release-notes-presentation-prompt.md](../../../prompts/release-notes-presentation-prompt.md). Read it once at the start of every deck generation.

## Workflow

### 1. Read the spec, then fetch the source

```
Read: prompts/release-notes-presentation-prompt.md    ← the design + behavior contract
```

Fetch the source URL twice with WebFetch — once for content, once for image URLs — to keep the results focused:

- Content extraction: title, category, problem, solution, integration/adoption, module versions, WOW flag, per feature. Preserve order.
- Image extraction: raw `https://` image URLs in order, each with a one-line label describing the feature.

### 2. Plan the section grouping

The deck opens with **Section 01 · WOW Business Features** (7 features max, golden divider), then groups the rest by product area business → technical. Typical sections after WOW:

- Cart / Configurable Products / Loyalty
- Frontend & Storefront UX
- Marketplace & AI (Virto OZ)
- Catalog, Search & Content
- Payments, Notifications & Logs
- Platform / Modularity / DX
- Quality & Community

Adapt to source material — don't force sections that aren't there. Consolidate related minor features onto one slide (e.g. "AI Vendor Portal enhancements" grouping search + description generation + translation into one feature).

Constraints from the spec:

- Every content slide must have all six fields: `category`, `title`, `problem`, `solution`, `size` (`S`/`M`/`L`), `integration`.
- **No time estimates** in the `integration` field. No "day", "week", "hour", "minute", "~".
- WOW features get `wow: true` and appear in Section 01 only.
- Slide with an image sets `image` + `caption`; slide without sets `noVisual: true` and `icon: 'network'|'api'|'refund'|'ai'|'speed'|'book'|'globe'|'moon'`.

### 3. Copy the previous month as template

```bash
cp 2026-<PREV>/index.html 2026-<NEW>/index.html
```

Then update:

1. `<title>` — `Virto Commerce – Release Notes | <Month> <Year>` (add edition subtitle like `(Comics Edition)` or `(Stable 15)` only if the source itself uses one).
2. Every occurrence of `Release Notes — <Prev Month>` → `Release Notes — <New Month>` (`replace_all`).
3. Cover header pill + eyebrow + h1 with the new month.
4. `cover-highlights` chips — 4 chips summarizing the release headlines (numbers or short labels).
5. Chronological navigation on **cover** and **thanks** slides: `href="../2026-<PREV>/"` and title "<Prev Month> <Year>".
6. Thanks slide `.thanks-sub` + `.cta-btn.outline` link → new source URL. Keep the Documentation button and Request-a-Demo button.
7. `.thanks-footer` bottom string.
8. Markdown export in `buildMarkdown()` — heading `# Virto Commerce — <Month> <Year> Backlog` and the final `Source:` URL.

### 4. Replace the slides array

The slides array is bounded by `const slides = [` and the matching `];` right before `const icons = {`. Locate both, splice the new array in.

Prefer authoring the new slides array as a plain text file, then splicing with a small Python script (see the example in `scratchpad/port/apply.py` from the mobile-port work — same brace-matching pattern).

### 5. Verify fullscreen-mode enhancements are present (mandatory)

Every deck in this repo ships with a `:fullscreen` CSS block that swaps the bounded card for edge-to-edge presentation when the user presses `F` or the fullscreen button. Because you copied the previous month as template, this block is already there — but if you started from an older reference or the block is missing, run:

```bash
python .scripts/port_fullscreen.py 2026-<NEW>/index.html
```

The script is idempotent — files that already have `:fullscreen .slide` are skipped. Grep to confirm:

```bash
grep -c ':fullscreen' 2026-<NEW>/index.html   # should print 6
```

**What the block gives you in fullscreen mode:**
- Slide fills the whole viewport (100vw × 100vh, no radius, no shadow, no stage padding).
- Slide content scales 1.25× via `zoom` so text and layout read well on a projector or 4K screen.
- Keyboard-shortcut hint bar hides.
- Bottom nav pill fades to `opacity: 0.35`; hover / focus-within restores it to `opacity: 1` so it's usable when needed.

Windowed view stays exactly as before — nothing changes until fullscreen is entered.

### 6. Wire the previous month's forward link

In `2026-<PREV>/index.html`, both cover and thanks slides have `<div class="cover-nav">…</div>`. Add a second `<a class="cover-nav-link">` alongside the existing back-link, this time pointing forward with a right-chevron:

```html
<a class="cover-nav-link" href="../2026-<NEW>/" title="<New Month> <Year>">
  <New Month> <Year>
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
</a>
```

Do this for **both** the cover-slide footer and the thanks-slide `.cover-nav`.

### 7. Update the README + landing page

- `README.md`: insert a new row at the top of the Releases table, format matching existing rows (Month · Highlights · Deck link · Source link).
- `index.html`: insert a new `<article class="release-card">` at the top of the `.releases` grid. Update the Hero + Spotlight + CTA-strip primary CTAs to point to the new month.

### 8. Verify

Run the following checks against the new file. If any fails, fix and re-run.

```bash
# 1. JavaScript parses cleanly
python -c "import re; \
  h=open('2026-<NEW>/index.html', encoding='utf-8').read(); \
  m=re.search(r'<script>(.*?)</script>', h, re.S); \
  open('/tmp/_c.js','w',encoding='utf-8').write(m.group(1))"
node --check /tmp/_c.js && echo "JS OK"
```

Programmatic content checks (Python script, run against the file):

- Every content slide has `category:`, `title:`, `problem:`, `solution:`, `size:`, `integration:`.
- Every `size` is `S`, `M`, or `L`.
- Integration text contains no word-boundary matches for `day`, `week`, `hour`, `minute`, and no `~`.
- Slide order: `cover` → `div-wow` at index 1 → content slides + dividers → `backlog` second-to-last → `thanks` last.
- No `onerror=` attributes anywhere.
- Both `cover-nav-link` hrefs on the new file point to `../2026-<PREV>/`.
- Previous-month file's `cover-nav` now has two links (back + forward).

Visual verification with the browser pane (if available), at four viewports:

- iPhone 17 Pro **402×874**, iPhone SE **375×667**, iPad portrait **820×1180**, desktop **1280×800**.
- Check: no horizontal overflow, nav pill doesn't overlap slide-footer at end of scroll, `+ Add` button in nav enabled on content slides / disabled on cover-divider-backlog-thanks, image click opens the lightbox.

### 9. Ask the user (only if genuinely blocked)

Don't ask about anything already in the source URL or the spec. Do ask if:

- Section 01 has fewer than 5 or more than 8 WOW candidates (spec target is 4–8; if wildly off, confirm intent).
- The source is very short (< 8 features) and would produce a thin deck — offer to consolidate more aggressively or add editorial content.

## What NOT to do

- Don't change the base CSS shell, `.slide`, `.slide-inner`, or media queries — the template already has all the mobile fixes.
- Don't add new JavaScript to the slide-rendering path. If you need new state, add it to the existing `updateBacklogChrome` / `showSlide` / `syncNavBacklogToggle` seams.
- Don't skip the `data-goto`-wiring in `renderDivider` — the in-slide TOC on section-divider slides is a spec item.
- Don't move `Backlog` or `Thanks` off the last two positions.
- Don't rename `.wow` / `.section-divider.wow` / topic-tag classes — CSS depends on them.
- Don't remove the previous month's chronological link — it stays as "← <PrevPrev>" and you add "<PrevNext> →" alongside.

## Reference files

- [prompts/release-notes-presentation-prompt.md](../../../prompts/release-notes-presentation-prompt.md) — the design + behavior contract in full.
- [2026-07/index.html](../../../2026-07/index.html) — the most polished reference implementation. When in doubt, mirror it.
- [2026-06/index.html](../../../2026-06/index.html) — an equally polished mid-cohort example with slightly different section shape.

## After delivery

- Commit the new month folder plus updates to README, index.html, and previous-month index.html together in one commit: `Add <Month> <Year> release notes`.
- Do **not** push without explicit user request.
