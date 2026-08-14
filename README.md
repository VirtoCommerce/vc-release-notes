<div align="center">

<img src="https://avatars.githubusercontent.com/u/5762443?s=200&v=4" alt="Virto Commerce" width="80" height="80" style="border-radius: 16px;" />

# Virto Commerce · Interactive Presentation

**Every monthly Virto Commerce release, rendered as an interactive slide deck.**

Product, engineering, and business stakeholders review what shipped, mark features for their own backlog, and export a ready-to-paste Markdown table for Jira, Linear, or GitHub Issues.

[![View live site](https://img.shields.io/badge/View_live-virtocommerce.github.io-2B7FFF?style=for-the-badge&logo=github&logoColor=white)](https://virtocommerce.github.io/vc-release-notes/)

[**🌐 Latest release · August 2026 →**](https://virtocommerce.github.io/vc-release-notes/2026-08/)

</div>

---

## 📅 Releases

> [!TIP]
> Every deck is self-contained HTML. Open the live link, or clone the repo and open the file directly.
> Press <kbd>B</kbd> to add a feature to your backlog, then hit **Copy as Markdown** on the Backlog screen.
> Press <kbd>T</kbd> for the table of contents, <kbd>F</kbd> for fullscreen, <kbd>← →</kbd> to navigate.

| Release | Highlights | Source |
| :--- | :--- | :--- |
| 📊 [**August 2026**](https://virtocommerce.github.io/vc-release-notes/2026-08/) | Native MCP for UCP (AI-agent commerce), Sales Rep Hub, engine-agnostic Background Jobs, VC-Shell 2.2.0, vc-fix QA plugin, Paradigm B2B 5-gold | [Notes](https://www.virtocommerce.org/t/virtos-release-notes-august-2026/858/1) |
| 📊 [**July 2026** · Stable 15](https://virtocommerce.github.io/vc-release-notes/2026-07/) | .NET 10 + PostgreSQL 18, inline checkout, loyalty payments, Virto OZ in Operator Portal | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-july-2026/857) |
| 📊 [**June 2026**](https://virtocommerce.github.io/vc-release-notes/2026-06/) | SOC 2 Type 2 renewal, Login on Behalf, AES-256 backups, VC-Shell 2.0.0 stable | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-june-2026/854) |
| 📊 [**May 2026** · Comics Edition](https://virtocommerce.github.io/vc-release-notes/2026-05/) | WCAG 2.2 AA, `/vc-app` AI skill, OpenSearch + Azure App Config + System Ops modules | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-may-2026-comics-edition/849/) |
| 📊 [**April 2026**](https://virtocommerce.github.io/vc-release-notes/2026-04/) | Coupons hub, Virto OZ CSV creation, dark-mode themes, shareable variant links, Sanity CMS | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-april-2026/847) |
| 📊 [**March 2026**](https://virtocommerce.github.io/vc-release-notes/2026-03/) | .NET 10 preview, marketplace vendor portal, configurable-product improvements | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-march-2026/839) |
| 📊 [**February 2026**](https://virtocommerce.github.io/vc-release-notes/2026-02/) | Cart, order, promotions engine, storefront refinements | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-february-2026/834) |
| 📊 [**January 2026**](https://virtocommerce.github.io/vc-release-notes/2026-01/) | Kickoff themes, 2026 platform groundwork | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-january-2026/821) |

## 🎯 Strategic decks

- 🔌 [**Integration Capabilities of Virto Commerce**](https://virtocommerce.github.io/vc-release-notes/presentations/integration-capabilities.html)
- ☁️ [**Virto Cloud — Enterprise Commerce, Fully Managed**](https://virtocommerce.github.io/vc-release-notes/presentations/virto-cloud.html)
- 📜 [**Release Strategy for Business Users**](https://virtocommerce.github.io/vc-release-notes/presentations/release-strategy-for-business-users.html)
- ⚛️ [**Atomic Architecture Map**](https://virtocommerce.github.io/vc-release-notes/presentations/atomic-architecture-map/) — one-screen interactive map of the platform's building blocks: atoms, molecules, modules and the business capabilities they compose.

## ✨ What's inside every deck

- **Business-first ordering** — "WOW Business Features" always come before technical sections.
- **T-shirt sizing** — `S` · `M` · `L` per feature. Estimates integration complexity, not calendar time.
- **Backlog builder** — mark features across the deck, export as Markdown, paste into your tracker.
- **Table of contents** — slide-out panel; jump between sections or feature titles.
- **Keyboard + touch + mobile** — arrow keys, swipe, pinch-zoom on any screenshot.
- **Zero dependencies** — pure HTML/CSS/JS in a single file. No build, no framework, no CDN scripts.

## 📸 Preview

![Interactive release notes demo](https://github.com/user-attachments/assets/4c912125-86b3-4765-859d-637b1bdbfd74)

## 🛠️ Repository structure

```
.
├── index.html                   # Landing page (served at virtocommerce.github.io/vc-release-notes/)
├── 2026-01/ ... 2026-08/        # One folder per monthly release, each with a self-contained index.html
├── presentations/               # Strategic decks (release strategy, etc.)
├── prompts/                     # Reusable prompt to generate a new deck from a raw release-notes URL
└── .claude/skills/              # Claude Code skills that automate deck generation (see below)
```

## 🤖 Add a deck with Claude Code

Two skills live in [`.claude/skills/`](.claude/skills/) — anyone using Claude Code inside this repo gets them automatically. They encode the full workflow (fetch source, plan sections, replace slides, wire chronological links, update landing pages, verify at 4 viewports) so you don't need to remember it.

### 🗓️ `release-notes-deck` — monthly release deck from a forum URL

**Use when** you have a Virto community-forum release-notes URL and want it turned into an interactive deck.

**How to invoke** — just drop the URL and tell Claude what to do. Trigger phrases like these all work:

```
Create a release deck from https://www.virtocommerce.org/t/virto-s-release-notes-august-2026/...
```
```
Add August 2026 to the release notes site
```
```
/release-notes-deck  https://www.virtocommerce.org/t/…
```

**What the skill does:**

1. Reads the master spec [`prompts/release-notes-presentation-prompt.md`](prompts/release-notes-presentation-prompt.md).
2. Fetches the source URL twice — once for feature content (title, category, problem, solution, integration, size, WOW flag), once for image URLs.
3. Plans the section grouping: **Section 01 · WOW Business Features** first, then business → technical sections.
4. Copies the previous month's `index.html` as template, swaps in the new slides array.
5. Wires chronological navigation **both ways** — the new deck links back, and the previous month gets a forward link added.
6. Updates the [top-level `index.html`](index.html) landing page and the Releases table in this README.
7. Verifies: `node --check` on extracted JS, every content slide has the 6 required fields (`category` / `title` / `problem` / `solution` / `size` / `integration`), all sizes are `S`/`M`/`L`, no time estimates in integration text, no `onerror` attributes, backlog is second-to-last, thanks is last.
8. Visual check at iPhone 17 Pro (402×874), iPhone SE (375×667), iPad portrait (820×1180), and desktop (1280×800).

### 🎯 `business-presentation` — strategic deck from a content draft

**Use when** you're preparing a business / partner / executive presentation (like [Release Strategy for Business Users](presentations/release-strategy-for-business-users.html)) — not one tied to a specific monthly release.

**How to invoke** — provide a topic and rough outline; no URL required. Trigger phrases:

```
Create a business presentation about our 2026 platform roadmap.
Sections: where we are, where we're going, how partners plug in. Audience: CTOs at prospect accounts.
```
```
Make a partner-onboarding deck in the same style as the Release Strategy one
```
```
/business-presentation
```

**What the skill does:**

1. Absorbs your content draft and picks the story arc (Problem→Solution→Proof · Myths→Reality→How · Where-are-we→Where-are-we-going→How).
2. Uses the [reference implementation](presentations/release-strategy-for-business-users.html) as the design template.
3. Picks the right slide types from the strategic-deck vocabulary — **cover · divider · standard content · `compare` (before/after) · `myths` (myth vs reality) · `glossary` · `services` · thanks**.
4. Optionally authors inline SVG diagrams for the right column of content slides when the story calls for one.
5. Registers the new deck on the [top-level `index.html`](index.html) presentations grid and this README's Strategic Decks table.
6. Same four-viewport visual verification.

### Skill boundaries — which one applies

| Signal | Skill |
| :--- | :--- |
| You have a `virtocommerce.org/t/…` URL | `release-notes-deck` |
| The deck is one month | `release-notes-deck` |
| The deck is a topic / story / playbook | `business-presentation` |
| You gave a content draft, not a URL | `business-presentation` |
| The deck should have `+ Add to backlog` + Markdown export | `release-notes-deck` |
| The deck should have `compare` / `myths` / `glossary` slides | `business-presentation` |

Both skills produce self-contained HTML that matches the shared design tokens (Virto navy/blue/cyan/gold, Inter + JetBrains Mono, same shadow/radius scales) and inherit the mobile-first responsive layout used by every existing deck.

### Not using Claude Code?

Everything is still doable by hand — the [master spec](prompts/release-notes-presentation-prompt.md) has the full CSS/JS/markup contract, and [`presentations/release-strategy-for-business-users.html`](presentations/release-strategy-for-business-users.html) is the reference for the business-deck style. Copy the closest existing deck, replace the slides array, update the cover/thanks/chronology, verify at four viewports.

## 🧭 References

- [VirtoCommerce.com](https://virtocommerce.com) 
- [Virto Commerce Community](https://www.virtocommerce.org)
- [Virto Commerce Documentation with Virto OZ assistant](https://docs.virtocommerce.org/)
- [All release notes](https://www.virtocommerce.org/c/news-digest/15)
- [Deck generation prompt](prompts/release-notes-presentation-prompt.md)

## 📄 License

Copyright © Virto Solutions LTD. All rights reserved.

Licensed under the Virto Commerce Open Software License. You may obtain a copy at
[virtocommerce.com/opensourcelicense](http://virtocommerce.com/opensourcelicense). Distributed on an "AS IS" basis, without warranties or conditions of any kind.
