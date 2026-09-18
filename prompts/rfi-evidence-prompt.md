# RFI-evidence presentation — hand-off prompt

Copy the block below into a fresh Claude Code session in `VirtoCommerce/vc-release-notes` (or any repo with the same CSS shell). Fill in the four bracketed sections at the top. Claude will invoke the `rfi-evidence-deck` skill and produce the deck.

---

## Prompt template

```
Create an RFI evidence presentation for requirement <MAJOR.MINOR> based on the live Virto Commerce demo.

Requirement text (verbatim from the RFI):
<QUOTE THE REQUIREMENT. Include every named element the requirement lists — search, navigation, filtering, etc. — the deck will have one element slide per named item.>

Demo site URL:
<https://<tenant>.govirto.com>

Signed-in URLs the reviewer expects to see (order-detail, wish-list, checkout, etc.):
<PASTE ANY SPECIFIC URLS. Leave empty if none.>

Deliverable:
- One HTML deck at presentations/rfi-<major>-<minor>-<slug>.html (gitignored — response-specific, not publicly linked)
- One JPEG per element under presentations/rfi-evidence/<slug>.jpg (gitignored)
- Same visual system as the strategic-deck template (Inter + JetBrains Mono, Virto navy/blue/green/amber tokens, 12 px card radius, box-shadow, cover / dividers / element slides / compare summary / thanks)
- Evidence-image lightbox (click to zoom fullscreen, Esc / backdrop / × to close) and fullscreen shortcut F on every deck
- Do NOT publish to index.html / README.md — these are RFI response artefacts, share directly with the reviewer

Rules of the road:
- Do not enter passwords or create accounts. Open a visible Playwright Edge on /sign-in and let me sign in myself, then hand back for headless capture.
- For elements the tenant does not surface, DOM-inject a mock over the live page — insert inside .vc-layout with width:100%, no left offset. Use Virto's design tokens (Inter, JetBrains Mono, 12px radius, navy #0F172A / blue #2B7FFF / green #15803D / amber #B45309).
- For each mock, run a UX/verstka verification pass BEFORE capture — left/width alignment ≤ 8px, font ≥ 10px, button height ≥ 32px, no horizontal overflow, box-shadow present.
- Slide vocabulary: cover → dividers grouping element slides → element slides (RFI-asks / Virto-delivers / Confirmed-on-demo blocks + evidence image) → compare-style summary → thanks with three CTAs (virtocommerce.com, release-notes hub, docs).
- Ship the deck end-to-end before I sign off. Slide-by-slide review checkpoints are fine if I ask for them.

Use the rfi-evidence-deck skill.
```

---

## What to expect

1. **First response** — Claude reads the requirement, opens the demo URL, maps the storefront (mega-menu, catalog facets, PDP, cart, sign-in). Reports which elements are surfaced live vs which need mock injection. Sets up a task list.
2. **Sign-in handoff** — Claude opens a visible Edge window at `/sign-in`. You sign in. You close Edge.
3. **Headless capture** — Claude runs `node capture.js` against the signed-in profile. Real signed-in screenshots land in `presentations/rfi-evidence/`.
4. **Mock reviews (per element that needs it)** — Claude opens a visible Edge with the mock injected. You verify the layout, adjust in DevTools if you want, screenshot with `Win+Shift+S`, save at the target JPG path (or paste the image into the chat — Claude converts PNG → JPG in the right place).
5. **Deck assembly** — Claude starts from the strategic-deck template ([`presentations/release-strategy-for-business-users.html`](../presentations/release-strategy-for-business-users.html)) as the CSS shell, then follows the RFI slide template in the skill (cover with requirement chips → section dividers → element slides with `RFI asks for` / `Virto delivers` / `Confirmed on demo` blocks + evidence image → compare-style summary matrix → thanks with three CTAs). Wires the evidence images through the `shot()` helper. Sends the file.
6. **Verify** — `node --check` on the extracted script, open in a browser, walk every slide, confirm the lightbox opens + closes on every evidence image.

## What Claude will NOT do

- Type passwords, create accounts, submit auth forms.
- Push to remote or add the RFI deck to `index.html` / `README.md` without explicit permission.
- Invent Virto UI language for the mocks — every injected panel matches shipped Virto design tokens.
- Skip the UX-quality-check pass on mocks.

## Reference

- Skill: [`.claude/skills/rfi-evidence-deck/SKILL.md`](../.claude/skills/rfi-evidence-deck/SKILL.md) — full slide template + DOM-injection pattern + Playwright screenshot pipeline
- CSS shell: [`presentations/release-strategy-for-business-users.html`](../presentations/release-strategy-for-business-users.html) — the strategic-deck baseline the RFI deck extends
- Evidence folder convention: `presentations/rfi-evidence/<slug>.jpg` (gitignored)
- RFI decks themselves live at `presentations/rfi-<major>-<minor>-<slug>.html` (gitignored) — response-specific artefacts, not publicly linked
