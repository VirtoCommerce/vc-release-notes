---
name: business-presentation
description: Use when the user wants to create a new strategic / business-oriented Virto Commerce presentation from an initial content draft — a story-driven deck for executives, partners, or business stakeholders, styled like the "Release Strategy for Business Users" deck. Not for monthly release notes (use release-notes-deck for those). Invoke when the user provides a topic + rough section outline and asks for "a presentation", "a business deck", "a partner-facing deck", or when they say "make it look like the Release Strategy deck".
---

# Create a Virto Commerce business presentation

Build a self-contained interactive HTML slide deck in the "strategic / business" style — the same style as `presentations/release-strategy-for-business-users.html`. Content-driven, story-first, no backlog feature, no image-lightbox — the design language matches the monthly release-notes decks (Virto brand tokens, Inter + JetBrains Mono, dark cover / navy dividers / light content slides) but the slide vocabulary is richer.

## When to use

- User wants a deck about a Virto Commerce **topic** (strategy, migration story, adoption playbook, roadmap, partner enablement, tech-stack tour, positioning story) — not one specific monthly release.
- User provides a **content draft** — a rough outline of sections and messages, or a document to summarize into slides.
- User says "make it look like the Release Strategy deck" or "in that business-style".

## Reference implementation

`presentations/release-strategy-for-business-users.html` — read it once at the start. Every design decision in this skill assumes that file as the pattern.

## Prerequisites

- Working directory is a checkout of `VirtoCommerce/vc-release-notes` (or the target repo has the same CSS shell).
- Content draft from user: title, subtitle/tagline, section outline with 1–2 lines of intent per section, key messages/data points/quotes where the user wants them.
- If the draft is thin, ask for the target audience and the one thing you want them to remember (see "Ask the user" below).

## The slide vocabulary

The reference file defines seven slide types. Reuse them; don't invent new ones unless the content genuinely doesn't fit.

| Slide type | Use for | Fields on the slide object |
|---|---|---|
| `cover` | The one-time opener | (implicit — hardcoded in `renderCover()`) |
| `divider` | Start each major section | `type: 'divider'`, `num`, `title`, `titleAccent`, `desc`, `statValue`, `statLabel` |
| Standard content (default) | Problem / Solution / Integration explainer OR left-copy + right-visual | `category`, `title`, `problem`, `solution`, `size?`, `integration?`, `image?` OR `noVisual: true, icon` OR `visualHTML` (custom SVG diagram) |
| `compare` | Side-by-side "before / after" or "old / new" | `type: 'compare'`, `category`, `title`, `left: {label, items[]}`, `right: {label, items[]}` |
| `myths` | Bust common misconceptions ("Myth X → Reality ✓") | `type: 'myths'`, `category`, `title`, `items: [{myth, reality}]` |
| `glossary` | End-of-deck term reference | `type: 'glossary'`, `category`, `title`, `terms: [{t, d}]` |
| `services` | Call-out for team offerings / next steps / commercial paths | `type: 'services'`, `category`, `title`, `items: [{icon, name, blurb}]` |
| `thanks` | Closing slide with CTAs | (implicit — hardcoded in `renderThanks()`) |

If your content really doesn't fit any of these, prefer authoring a **custom `visualHTML`** field on a standard content slide (as an inline SVG diagram) rather than adding a new slide type.

## Workflow

### 1. Absorb the draft, choose the story shape

Read the user's draft with these three questions in mind:

1. **Who's in the room?** Executives, partners, prospects, engineers-turned-managers, procurement — this determines tone and detail.
2. **What's the one thing they should remember?** Write it in one sentence before you start building slides.
3. **What's the arc?** Typical shapes: "Problem → Solution → Proof", "Myths → Reality → How", "Where we are → Where we're going → How to get there".

Sketch the section list. 5–7 sections is the sweet spot. Each section has a divider slide + 2–5 content slides.

### 2. Copy the reference file as the template

```bash
cp presentations/release-strategy-for-business-users.html presentations/<new-slug>.html
```

Slug rule: kebab-case, describes the deck's role. Examples: `platform-adoption-guide`, `partner-onboarding-story`, `2026-roadmap-brief`.

### 3. Rewrite the header block

- `<title>`
- Cover slide: eyebrow (one-line label), title (2 lines, second wrapped in `<span class="grad">`), sub (one paragraph, ~2 sentences).
- Any hardcoded brand-mark alt text or "Release Strategy" strings.

### 4. Rewrite the slides array

Location: search for `const slides = [` and the matching `];` before `const icons = {`. Replace between those anchors.

Order:
1. `{ type: 'cover' }` (must be first)
2. Section 01 divider
3. Section 01 content slides (mix of standard + typed as appropriate)
4. Section 02 divider
5. …
6. Optional `{ type: 'glossary' }` near the end
7. `{ type: 'thanks' }` (must be last)

Copy conventions:

- **Divider `num`**: `Section 01`, `Section 02`, … (no dot, no trailing text unless section is a WOW-equivalent — but this deck style typically has no WOW section).
- **Divider `title` + `titleAccent`**: two lines. `title` renders plain-color, `titleAccent` renders with the gradient. Example: `title: 'Delivery'`, `titleAccent: 'cadence'`.
- **Divider `statValue` + `statLabel`**: one hero number per section (e.g. `4` + `Modules covered`). Optional but strongly recommended — it anchors the section visually.
- **Content `title`**: 3–7 words. Wrap the newsworthy word in `<span class="accent">…</span>` for the blue gradient.
- **Problem / Solution / Integration**: keep concrete, no fluff. Use `<strong>` sparingly (one key phrase per slide), `<code>` for API names / version numbers / module names, `<ul><li>` for multi-part solutions.
- **Category pill**: short breadcrumb ("Platform · Modules" / "Business · Adoption" / "Community · Resources").

### 5. Custom diagrams (when relevant)

The `visualHTML` field on a content slide lets you insert an inline SVG for the right-column visual. Keep diagrams:

- SVG viewBox 600×400 or 600×360.
- Colors from the Virto tokens (`--virto-blue`, `--virto-cyan`, `--virto-navy`, `--virto-gold`) — use `stroke="var(--virto-blue)"` inline.
- Rounded rects, muted grid backdrop, small labels — mirror the diagram in the reference deck's Section 05.

Wrap custom SVGs in `<div class="visual-col diagram-col">…</div>` (the class already exists in the CSS shell and gets special mobile treatment).

### 6. Wire up the hidden easter eggs (mandatory)

Every business deck in this repo ships with **two hidden delighter interactions**. They are opt-in via keyboard shortcut, add no visual weight until triggered, and take almost nothing to include. Ship them by default; they're part of the house style.

| Key | Element | Effect |
| :-- | :-- | :-- |
| <kbd>B</kbd> | `<canvas id="bubbles">` background canvas | Effervescent blue-cyan bubbles rise up the whole viewport, respects `prefers-reduced-motion`. Press again to hide. |
| <kbd>C</kbd> | `<div id="catEgg">` inline-SVG ginger cat | A small napping cat appears at the top-right of the active slide. Cursor within 250px wakes it and its pupils track the mouse; move away and it sleeps again. |

**How to port them into a new deck** — the reference source of truth is `presentations/virto-cloud.html`. Three pieces to copy:

1. **CSS** — a ~11-line block containing `#bubbles`, `#catEgg`, `#catEgg.show`, `#catEgg svg`, `#catEgg .cat-tail`, the `@keyframes catWag`, `#catEgg .cat-pupil`, `.eyes-closed`, `.eyes-open`, `.sleeping` variants, and the `prefers-reduced-motion` guard. Insert **right before the `.stage {` rule**.
2. **Markup** — `<canvas id="bubbles" aria-hidden="true"></canvas>` plus `<div id="catEgg" aria-hidden="true">…the inline SVG…</div>`. Insert **right before `<div class="progress-bar" …>`** so the canvas sits behind slide content and the cat overlays it.
3. **JavaScript** — two self-executing IIFEs at the end of the `<script>` block:
   - `press c → cat toggle` — reads slide bounding-rect, positions the cat at slide top-right, wires `mousemove` to move pupils / sleep the cat.
   - `press b → bubbles toggle` — sets up canvas, seeds ~28 bubbles, animates via `requestAnimationFrame`, hides on second press. Respects `prefers-reduced-motion`.

Insert both IIFEs **just before the final `</script>`**. Both listeners guard against input focus (`INPUT` / `TEXTAREA` / `contentEditable`) so they don't fire while the user is typing.

**Automation shortcut** — a reusable port script and pre-extracted snippets live in `scratchpad/eggs/` (created when porting the first deck). Reuse them:

```bash
# Copies CSS/HTML/JS from virto-cloud.html into a target deck, idempotent
python .scripts/port_eggs.py presentations/<new-deck>.html
```

If the scratchpad snippets aren't present, extract them fresh from `presentations/virto-cloud.html` using the same anchors — the canonical layout locations described above.

**Do not** advertise the shortcuts anywhere in the deck's TOC, hint bar, or nav pill — the whole point is that they're a hidden delighter. If someone asks, tell them in text; do not surface in UI.

### 7. Update the top-level landing pages

Add an entry for the new deck to:

- `index.html` — inside the `.pres-list` grid.
- `README.md` — inside the "Strategic decks" table.

Both need: title, short one-line description, link to the deck path.

### 8. Verify

The reference file has all the mobile fixes already ported (see the wider mobile audit in this repo's history). Just confirm nothing broke:

```bash
# JS parses
python -c "import re; \
  h=open('presentations/<new-slug>.html', encoding='utf-8').read(); \
  m=re.search(r'<script>(.*?)</script>', h, re.S); \
  open('/tmp/_c.js','w',encoding='utf-8').write(m.group(1))"
node --check /tmp/_c.js && echo "JS OK"
```

Programmatic checks:

- Every slide with `type: 'divider'` has both `title` and `titleAccent`.
- Every standard content slide (no `type`) has `category` and `title` at minimum. `problem` / `solution` are strongly recommended but not enforced (some slides intentionally use only `title` + `visualHTML`).
- No `data-jump` remaining in the HTML (Start/End buttons were removed as part of the mobile audit).
- No `.jump-btn` class references.

Visual verification with the browser pane (if available), at four viewports:

- iPhone 17 Pro **402×874**, iPhone SE **375×667**, iPad portrait **820×1180**, desktop **1280×800**.
- Check: no horizontal overflow, no nav-pill/footer overlap at bottom of scroll, all custom `visualHTML` diagrams still scale.

## Copy style

- **Titles**: statement, not question. "How Virto ships bundles" ✗ → "Virto ships in bundles" ✓.
- **Problem**: concrete failure state before the change. Not "users had issues", but "customers had no way to compare two vendor bundles side-by-side".
- **Solution**: lead with the verb or the new capability. Use `<strong>` for one key phrase per slide.
- **Body prose**: 1–3 sentences per block. If it needs a bullet list, use `<ul><li>`.
- **Numbers over adjectives**: "56 modules" beats "many modules"; "3× faster" beats "much faster".

## What NOT to do

- Don't add backlog / lightbox / TOC-toggle features specific to release-note decks. This style deck typically has: TOC panel yes, backlog no, lightbox no.
- Don't recycle the "★ WOW Feature" topic tag — that's release-notes vocabulary.
- Don't skip section dividers — dividers structure the story and give the viewer a reset point.
- Don't cram 6+ bullets into one slide. Break into two.
- Don't invent new brand colors, fonts, or shadow scales. Use the CSS custom properties in `:root`.
- Don't remove `syncNavBacklogToggle` / `openLightbox` if they exist — they're no-ops on this deck because the markup isn't present, and stripping them creates JS ReferenceErrors on Escape / showSlide.

## Ask the user (only if actually stuck)

- **Audience** if the draft doesn't imply one (executive-briefing tone ≠ engineering-adoption tone).
- **Deck length** if the draft has fewer than 5 or more than 12 candidate sections.
- **Custom SVG diagrams** — if the draft references a diagram, ask for a sketch/reference before authoring inline SVG.
- **Tone** — "confident and factual" (default) vs. "punchy and marketing" — this deck style leans confident.

Don't ask about anything the draft already specifies.

## Reference files

- [presentations/release-strategy-for-business-users.html](../../../presentations/release-strategy-for-business-users.html) — the reference implementation. Read it end-to-end before your first deck.
- [prompts/release-notes-presentation-prompt.md](../../../prompts/release-notes-presentation-prompt.md) — the release-notes contract. Design tokens and CSS shell are shared; content structure and slide-type vocabulary differ.

## After delivery

- Add the new deck to `index.html` and `README.md` in the same commit.
- Suggested commit message: `Add presentation: <title>`.
- Do **not** push without explicit user request.
