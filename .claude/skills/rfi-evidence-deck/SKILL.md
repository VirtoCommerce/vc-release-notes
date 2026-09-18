---
name: rfi-evidence-deck
description: Use when the user needs an RFI (Request for Information) response deck that demonstrates a set of named requirements against a live Virto Commerce demo site. The deck combines real signed-in screenshots with DOM-injected UI mocks over the live storefront chrome, one slide per requirement element, styled like the strategic-deck shell but with an RFI-specific slide vocabulary. Invoke when the user says "RFI evidence", "answer requirement X.Y", "prove capability against demo", "make a deck for the RFI response", or pastes a list of requirement elements with a demo URL.
---

# Create a Virto Commerce RFI-evidence presentation

Build a self-contained interactive HTML slide deck that answers a requirement's named elements one by one, each backed by real evidence from a signed-in Virto Commerce demo tenant. Uses the same visual language as the business-presentation decks (Inter + JetBrains Mono, navy/blue tokens, dark cover, light content slides) with an added slide vocabulary for RFI evidence.

## When to use

- User provides an RFI requirement (e.g. "1.8", "1.9") **plus a demo site URL** and asks for a deck that answers each named element.
- User wants **live evidence** — screenshots from a signed-in Virto tenant — not a marketing brochure.
- Requirement has 6–12 named elements the deck needs to prove one-by-one.
- User says things like "RFI evidence", "prove against demo", "answer requirement X.Y", "each capability illustrated with the actual UI".

Not this skill: purely strategic decks (use `business-presentation`), monthly release notes (use `release-notes-deck`).

## Reference implementations

- [`presentations/release-strategy-for-business-users.html`](../../../presentations/release-strategy-for-business-users.html) — the strategic-deck baseline. **This is the CSS shell + slide-machinery you copy.** The RFI deck extends it: same tokens, same fullscreen block, same easter eggs, plus RFI-specific slide vocabulary + evidence-image lightbox added here.
- [`.claude/skills/business-presentation/SKILL.md`](../business-presentation/SKILL.md) — the visual system this deck builds on.

RFI decks the author has produced with this skill are **gitignored** on purpose (`/presentations/rfi-*.html` + `/presentations/rfi-evidence/` in [`.gitignore`](../../../.gitignore)) — they are response-specific artefacts, not repository samples. Everything you need to reproduce one is inline in this skill; there is no public sample deck to read.

Read the business-presentation skill end-to-end before your first RFI deck. The slide array + CSS shell + fullscreen block + easter-eggs carry over unchanged; this skill adds the RFI vocabulary, the DOM-injection pipeline, and the evidence-image lightbox.

## Prerequisites

- Working directory is a checkout of `VirtoCommerce/vc-release-notes` (or a repo with the same CSS shell).
- Node.js 22+ and Microsoft Edge installed locally.
- **Playwright with `channel: 'msedge'`** — first-time setup: `cd scratchpad/shots && npm install playwright puppeteer-core`. No bundled browser needed; Playwright drives the local Edge.
- RFI text from the user: the requirement number, the named elements it lists, the site URL, and any specific pages/URLs the user calls out (e.g. `/account/orders/<uuid>`).
- User credentials to the demo tenant: **the user signs in themselves**, in a visible Playwright-launched Edge, using a persistent `.edge-profile` directory. You never enter passwords — that's a hard refusal.

## The workflow

### 1. Explore the site (guest, then hand-off for sign-in)

1. Open the demo URL in Playwright's built-in browser or `mcp__claude-in-chrome__*` — whichever is available — and map the storefront: mega-menu, catalog page facets, PDP, cart, sign-in page, sign-up (Personal vs Company account distinction).
2. Note which named elements are surfaced live on the tenant vs which need a **DOM-injected mock** over the real page chrome (approvals, per-shipment status, backorder banner, checkout B2B context — the tenant almost never surfaces these).
3. For each element, decide: **direct screenshot** (feature is live) or **mock injection** (feature ships on every Virto build but the tenant's template omits it).

### 2. Stand up the screenshot pipeline

Create `scratchpad/shots/` in the session scratchpad (not the repo). Inside it:

- **`.edge-profile/`** — Playwright's `launchPersistentContext` user-data dir. Holds cookies + storage across runs. Gitignored — the pipeline lives in scratchpad on purpose.
- **`login.js`** — opens Edge visibly at `/sign-in`, blocks until the user closes the window, saves the profile.
- **`capture.js`** — the shot registry. Each shot is `{ slug, label, requiresAuth, async run(page) }`. Loads profile when it exists so signed-in shots come out with real chrome. Runs headless.
- **`review-<mock>.js`** — one file per mock the deck needs. Opens Edge visibly, injects the mock, verifies the layout, **leaves the browser open** so the user takes the screenshot with `Win+Shift+S`.

Shot naming: `<req>-<element>.jpg` (e.g. `1-9-approvals-cart.jpg`). Stored at `presentations/rfi-evidence/`.

### 3. Sign the user in (once)

`node login.js` launches a visible Edge on the demo `/sign-in` page. Print clear instructions to stdout:

```
=============================================================
 <tenant> sign-in page is open.
 Sign in (email + password).
 Optional: seed carts, open a specific order, etc.
 Then CLOSE the Edge window.
=============================================================
```

`await new Promise(r => context.on('close', r))` — the script only exits when the user closes Edge. The `.edge-profile/` now holds a live session. Subsequent `capture.js` runs are headless and signed-in.

**Never enter passwords yourself.** State the rule, hand the visible window to the user.

### 4. Capture the guest / signed-in shots

`node capture.js only=<slug1>,<slug2>` runs a subset. Each shot is a `page.goto` + `waitForFunction(real-content-selector)` + `screenshot`.

Wait for **real content**, not skeletons: use text patterns unique to loaded data (`ORDER #CO\d{6,}`, `PRICE AND DELIVERY`, `Vendor:`), not `waitUntil: 'networkidle'` alone. On SPAs, network can settle before the framework finishes rendering.

Crop tight: capture with `clip: { x: 0, y: 0, width: 1600, height: <mock.bottom + 28> }` measured via `page.evaluate` after injection. Full-page white space kills the slide's density.

### 5. DOM-inject mocks (the shipped-Virto-doesn't-surface-this case)

For elements the tenant does not render but Virto ships:

1. **Load the natural host page** (cart for approval banner, order-detail for approval timeline, PDP for backorder banner, cart for checkout B2B context).
2. **Wait for real content** to render (H1 has fired, vendor blocks are populated, product title exists).
3. **Inject into `.vc-layout`**, not into `<body>` or `<main>`. The Virto layout element wraps the entire content column at exactly the site's max-width — inserting inside it and setting `width: 100%` on the mock aligns it perfectly with the site's other panels. **No `left` offset, no `getBoundingClientRect` measurement.** This is the golden rule of RFI mock injection.

   ```js
   const layout = document.querySelector('.vc-layout, [class*="vc-layout"]');
   const h1 = document.querySelector('h1');
   // Full-width panel between title and body:
   h1.parentElement.insertBefore(el, h1.nextSibling);
   // Panel below the line items (partial-fulfilments):
   lastVendorBlock.parentElement.insertBefore(el, lastVendorBlock.nextSibling);
   ```

4. **Style the mock to fit Virto's design language**:
   - Font: `Inter, system-ui, sans-serif` for text, `JetBrains Mono, monospace` for codes/tracking numbers
   - Radius: `12px` on the outer card, `10px` on inner cards, `8px` on buttons, `22px` on status pills
   - Shadow: `box-shadow: 0 6px 20px -8px rgba(7,37,74,.15)` for cards, `0 6px 20px -8px rgba(230,161,27,.28)` for alert banners
   - Colors: navy `#0F172A` for text, blue `#2B7FFF` for accents, green `#15803D` for done, amber `#B45309` for warnings, red `#B91C1C` for errors
   - Status pills: `padding: 3px 12px; border-radius: 22px; font-weight: 800; font-size: 11px; letter-spacing: .02em`

5. **Run a quality-check pass before the screenshot fires** (in the review script and, optionally, in capture.js):
   - Left alignment: `|banner.left − content.left| ≤ 8px`
   - Width match: `|banner.width − content.width| ≤ 8px`
   - Space above: `≥ 8px`
   - Smallest font: `≥ 10px` (readability floor)
   - Button height: `≥ 32px` (tap-target)
   - Horizontal overflow: `0px`
   - `box-shadow` present, `border-radius ≥ 8px`

   Log the report as check-marks so the user sees the mock passed before opening the browser.

### 6. Interactive review scripts (`review-<mock>.js`)

Some mocks the user wants to inspect visually before the capture is final. Pattern:

```js
const context = await chromium.launchPersistentContext(USER_DIR, {
  channel: 'msedge', headless: false, viewport: { width: 1600, height: 900 }, args: ['--no-sandbox'],
});
const page = context.pages()[0] || await context.newPage();
await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForFunction(() => /* real-content sentinel */, { timeout: 25000 });
await injectMock(page);
await verifyMock(page, '<id>', '<label>');
console.log('Take screenshot (Win+Shift+S). Adjust in DevTools — element id: #<id>');
console.log('Save as: presentations/rfi-evidence/<slug>.jpg');
await new Promise((resolve) => context.on('close', resolve));
```

Do not use `readline`/stdin inside the script when it's going to run in the background — pass control by **leaving the browser open until close**. The user takes the screenshot, saves the file, closes Edge, the script exits cleanly.

For simultaneous review of two mocks, open **two tabs** with `context.newPage()` — one per mock — so the user can toggle between them.

### 7. Handling user-pasted screenshots

The user often screenshots the injected mock themselves. When they paste an image into chat, it's saved to `<session-scratchpad>/images/<n>.png`. Convert to JPG at the right target path in the repo:

```powershell
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($src)
$enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$p = New-Object System.Drawing.Imaging.EncoderParameters(1)
$p.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 85L)
$img.Save($dst, $enc, $p); $img.Dispose()
```

Save to `presentations/rfi-evidence/<slug>.jpg` — the deck references that path. Quality 85 keeps the file 80–200 KB.

### 8. Assemble the deck

Copy `presentations/release-strategy-for-business-users.html` as `presentations/rfi-<major>-<minor>-<topic>.html` (the target path is gitignored). Slug rule: `rfi-<major>-<minor>-<kebab-topic>.html`. Then apply the RFI edits below: cover, header, slide vocabulary, evidence-image lightbox.

Rewrite in this order (all anchors are near-identical across both reference files):

1. **`<title>` + `<meta name="description">`** — RFI evidence for requirement X.Y.
2. **Cover** in `renderCover()`:
   - `cover-eyebrow`: `RFI Evidence · Requirement X.Y`
   - `cover-title` first line: topic name (e.g. "Catalog, Search")
   - `cover-title` `<span class="grad">` second line: "& Ordering"
   - `cover-sub`: one paragraph, mentions the tenant URL in `<code>` and how each capability is illustrated
   - `cover-highlights`: 4 chips — `<N> Named elements`, other counts you want to emphasise (facets, order-upload modes, account types), and always end with `1 Live demo backing every slide`.
3. **`.header-meta`** on cover: pill `RFI Evidence` + label `Requirement X.Y`.
4. **Brand meta** in the shared header: `<span class="b2">RFI Evidence — Requirement X.Y</span>`.
5. **Topic tag** on content slides: `<span class="topic-tag">RFI X.Y · Element evidence</span>`.
6. **`slides` array** — see slide vocabulary below.
7. **Thanks page** (`renderThanks`) — eyebrow `Every X.Y element confirmed on a live tenant`, title `Ready to go <span class="grad">further</span>`, three CTA links:
   - `https://virtocommerce.com` — primary
   - `https://virtocommerce.github.io/vc-release-notes/` — outline
   - `https://docs.virtocommerce.org/` — outline

### 9. Slide vocabulary for RFI evidence

The RFI deck reuses the `business-presentation` slide types plus one convention on the standard content slide.

| Slide | Fields | Purpose |
|---|---|---|
| `cover` | (implicit) | Requirement + tenant + chips. One deck, one cover. |
| `divider` | `num, title, titleAccent, desc, statValue, statLabel` | Group element slides into 3–5 sections. `statValue`: `<N> / <total>` covered by section. |
| **Element** (default content slide) | `category, title, visualHTML, blocks: [{kind: 'q'\|'a'\|'t', label, html}]` | One per RFI element. `q` = "RFI X.Y asks for", `a` = "Virto delivers", `t` = "Confirmed on demo". `visualHTML` renders the evidence image via `shot()` / a dual `rfi-fig.dual` panel. |
| `compare` | `type: 'compare', category, title, stable: {name, cadence, pros[], best}, edge: {...}, rule` | Summary matrix — left column lists RFI elements verbatim, right column lists ✓ Virto delivered evidence. Ends the deck before thanks. |
| `thanks` | (implicit) | Three CTAs (virtocommerce.com / release-notes hub / docs). |

The `shot()` helper at the top of the slides array is where all evidence images plug in:

```js
const DEMO_URL = 'https://<tenant>.govirto.com';
function shot(img, cap) {
  const alt = cap.replace(/<[^>]+>/g, '').replace(/"/g, '&quot;');
  return `<div class="rfi-shot"><div class="rfi-cap">Live · <code>${DEMO_URL}</code> · ${cap}</div><figure class="rfi-fig"><img src="rfi-evidence/${img}" alt="${alt}" /></figure></div>`;
}
```

For a dual-shot slide (two evidence panels stacked) use `.rfi-fig.dual` wrapping two `.rfi-panel` children, each with a `.rfi-panel-cap` label and an `<img>`. CSS pattern:

```css
.rfi-fig.dual { display: grid; grid-template-rows: 1fr 1fr; gap: 6px; padding: 6px; background: var(--virto-bg-2); }
.rfi-fig.dual .rfi-panel { display: flex; flex-direction: column; min-height: 0; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px -4px rgba(7,37,74,.18); }
.rfi-fig.dual .rfi-panel-cap { font-size: 10px; color: var(--virto-navy); padding: 6px 10px; background: #fff; border-bottom: 1px solid var(--virto-line); font-weight: 600; }
.rfi-fig.dual .rfi-panel img { flex: 1; min-height: 0; width: 100%; object-fit: contain; object-position: top center; background: #fff; }
```

For a highlight-annotated shot (numbered rings over an image, with a bottom legend) use `.rfi-fig.annot` with `.hi` (positioned absolutely) + `.hi-num` (navy pill) + `.hi-legend` (bottom bar). CSS pattern:

```css
.rfi-fig.annot { position: relative; }
.rfi-fig.annot img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top left; }
.rfi-fig.annot .hi { position: absolute; border: 2.5px solid var(--virto-gold); border-radius: 8px; box-shadow: 0 0 0 3px rgba(251,191,36,.28); pointer-events: none; }
.rfi-fig.annot .hi-num { position: absolute; top: -9px; left: -9px; width: 18px; height: 18px; background: var(--virto-navy); color: #fff; border-radius: 50%; font-size: 10.5px; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.rfi-fig.annot .hi-legend { position: absolute; left: 8px; right: 8px; bottom: 8px; background: rgba(7,37,74,.94); color: #fff; font-size: 11px; padding: 6px 10px; border-radius: 6px; text-align: center; }
```
Position each `.hi` in inline-style top/left/width/height as percentages of the image.

### 10. Evidence-image lightbox (mandatory)

Every RFI deck ships with a click-to-zoom lightbox on `.rfi-fig img` — click opens a full-viewport overlay, `Esc` / backdrop-click / `✕` closes. Paste this CSS block into `<style>` right before the `@media print` rule at the bottom:

```css
/* ---- Evidence-image lightbox ---- */
.rfi-fig img { cursor: zoom-in; transition: transform .15s ease; }
.rfi-fig img:hover { transform: scale(1.005); }
.rfi-lightbox { position: fixed; inset: 0; z-index: 9999; background: rgba(7,37,74,.96); display: none; align-items: center; justify-content: center; padding: 40px 60px; cursor: zoom-out; }
.rfi-lightbox.open { display: flex; animation: rfiLbFade .18s ease; }
@keyframes rfiLbFade { from { opacity: 0; } to { opacity: 1; } }
.rfi-lightbox img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 40px 100px -20px rgba(0,0,0,.6); border-radius: 8px; cursor: default; }
.rfi-lightbox-close { position: absolute; top: 20px; right: 24px; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.3); color: #fff; font-size: 20px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .15s ease, transform .15s ease; }
.rfi-lightbox-close:hover { background: rgba(255,255,255,.26); transform: scale(1.06); }
.rfi-lightbox-hint { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,.55); font-size: 12px; font-family: 'JetBrains Mono', monospace; letter-spacing: .06em; }
@media print { .rfi-lightbox { display: none !important; } }
```

And this IIFE at the very end of the `<script>` block (right before `</script>`):

```js
/* ---- Evidence-image lightbox ---- */
(function rfiLightbox(){
  const lb = document.createElement('div');
  lb.className = 'rfi-lightbox';
  lb.setAttribute('aria-hidden', 'true');
  lb.innerHTML = '<button class="rfi-lightbox-close" aria-label="Close" title="Close (Esc)">✕</button><img alt="" /><div class="rfi-lightbox-hint">click anywhere or press Esc to close</div>';
  document.body.appendChild(lb);
  const lbImg = lb.querySelector('img');
  function openLb(src, alt){ lbImg.src = src; lbImg.alt = alt || ''; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
  function closeLb(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); lbImg.src = ''; }
  document.addEventListener('click', (e) => {
    const img = e.target && e.target.matches && e.target.matches('.rfi-fig img') ? e.target : null;
    if (img) { e.preventDefault(); e.stopPropagation(); openLb(img.src, img.alt); return; }
    if (lb.classList.contains('open') && (e.target === lb || e.target.closest('.rfi-lightbox-close'))) closeLb();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) { e.stopPropagation(); closeLb(); }
  }, true);
})();
```

Both blocks are self-contained — no additional dependencies.

### 11. Copy conventions

- **`category` on element slides**: the RFI element name verbatim ("Search", "Ordering shortcuts", "Partial fulfilments"). Renders in the topic-tag pill.
- **`title` on element slides**: `<Element name> — <span class="accent">short capability phrase</span>`. Example: `Search — <span class="accent">keyword, category &amp; product suggest</span>`.
- **`q` block ("RFI X.Y asks for")**: quote or paraphrase the requirement text — one sentence, no marketing gloss.
- **`a` block ("Virto delivers")**: how the capability ships. Name Virto services / modules / concepts (Elsa, xAPI, Associations, Business Process, Inventory service, Frontend Application blocks). Use `<code>` for URLs, rule expressions, module names.
- **`t` block ("Confirmed on demo")**: what the reviewer sees in the screenshot at right — quote real values (`stock 4152`, `$3,240.00`, `Sarah Miller (Store Manager)`), timestamps, tracking numbers. The `t` block is the caption for the visual.

### 12. Auth boundary

Prohibited even on user request:
- Entering passwords into any field.
- Creating accounts / clicking "Sign up".
- Submitting forms with credentials.

Do these instead:
- Open a **visible Playwright Edge** (via login.js / review-\*.js) at `/sign-in` or `/sign-up`.
- Print clear stdout instructions.
- Wait on `context.on('close', ...)`.
- Continue in headless mode against the same profile.

### 13. Ship + verify

Run `node --check` on the extracted `<script>` block:

```bash
python -c "
import re
h = open('presentations/rfi-<slug>.html', encoding='utf-8').read()
m = re.search(r'<script>(.*?)</script>', h, re.S)
open(r'<scratchpad>/_check.js','w',encoding='utf-8').write(m.group(1))
"
node --check <scratchpad>/_check.js
```

Visual verification: open the deck at `http://localhost:5173/presentations/rfi-<slug>.html` (via preview server or `python -m http.server`) and step through every slide. Each element slide must render:
- Slide title with the accent phrase
- Three blocks: RFI-asks, Virto-delivers, Confirmed-on-demo
- Evidence image (or dual/annotated variant) that loads without a broken-image icon

Fullscreen (`F` key) must still work. Lightbox (click on `.rfi-fig img`) must open + close.

### 14. Landing-page discovery

RFI decks are typically **not listed on the public `index.html`** — they're response artefacts for a specific opportunity, not general marketing. Ask the user before adding them to `index.html` / `README.md`.

## What NOT to do

- **Don't measure the site's content width with `getBoundingClientRect`** and set the mock to that pixel width. Insert inside `.vc-layout` and use `width: 100%`. This is the golden rule.
- **Don't invent Virto UI language** — every mock must feel like a real shipped panel. Match the site's existing card / pill / button pattern.
- **Don't rely on `waitUntil: 'networkidle'` alone** on Vue/React SPAs — network settles before content renders. Use `waitForFunction` with a text sentinel unique to real data.
- **Don't screenshot the whole viewport when the mock is a 200 px band** — crop tight, `mock.bottom + 28` is the sweet spot.
- **Don't inject with `document.body.insertBefore(el, ...)`** — the mock ends up outside the site's layout column and looks broken.
- **Don't skip the quality-check pass** — the review script's UX report prevents 90% of "banner overlaps H1", "font 8px", "no padding" regressions.
- **Don't enter passwords ever, even when the user gives them.** The `login.js` visible-Edge handoff is the whole point.
- **Don't add these decks to `index.html` on your own** — RFI response artefacts are typically unlisted.

## Ask the user only if actually stuck

- **The tenant URL** if not given.
- **The requirement text** if only a number was mentioned.
- **Landing-page visibility** — should the deck be linked from `index.html` / `README.md`?
- **Named elements the requirement lists** — parse from the requirement text; only ask if the text is ambiguous.
- **What to do about elements the tenant does not surface** — options are: (a) DOM-inject a mock over the live page, (b) note-panel with copy + a related real screenshot, (c) skip. (a) is the default; (b) is fine for concepts that cannot be visualised without inventing UI.

## After delivery

- Commit `presentations/rfi-<slug>.html` and every JPEG in `presentations/rfi-evidence/`.
- Suggested commit message: `Add RFI evidence deck: Requirement X.Y — <topic>`.
- **Do not push without an explicit user request.**
- Offer to run `node capture.js only=<slug>` to refresh any shot if the tenant data has drifted.
