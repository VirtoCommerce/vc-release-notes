<div align="center">

<img src="https://avatars.githubusercontent.com/u/5762443?s=200&v=4" alt="Virto Commerce" width="80" height="80" style="border-radius: 16px;" />

# Virto Commerce · Interactive Release Notes

**Every monthly Virto Commerce release, rendered as an interactive slide deck.**

Product, engineering, and business stakeholders review what shipped, mark features for their own backlog, and export a ready-to-paste Markdown table for Jira, Linear, or GitHub Issues.

[![View live site](https://img.shields.io/badge/View_live-virtocommerce.github.io-2B7FFF?style=for-the-badge&logo=github&logoColor=white)](https://virtocommerce.github.io/vc-release-notes/)
[![License](https://img.shields.io/badge/License-Virto_OSL-07254A?style=for-the-badge)](http://virtocommerce.com/opensourcelicense)

[**🌐 Latest release · July 2026 →**](https://virtocommerce.github.io/vc-release-notes/2026-07/)

</div>

---

## 📅 Releases

> [!TIP]
> Every deck is self-contained HTML. Open the live link, or clone the repo and open the file directly.
> Press <kbd>B</kbd> to add a feature to your backlog, then hit **Copy as Markdown** on the Backlog screen.
> Press <kbd>T</kbd> for the table of contents, <kbd>F</kbd> for fullscreen, <kbd>← →</kbd> to navigate.

| Month | Deck | Highlights | Source |
| :--- | :--- | :--- | :--- |
| **July 2026** · Stable 15 | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-07/) | .NET 10 + PostgreSQL 18, inline checkout, loyalty payments, Virto OZ in Operator Portal | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-july-2026/857) |
| **June 2026** | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-06/) | SOC 2 Type 2 renewal, Login on Behalf, AES-256 backups, VC-Shell 2.0.0 stable | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-june-2026/854) |
| **May 2026** · Comics Edition | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-05/) | WCAG 2.2 AA, `/vc-app` AI skill, OpenSearch + Azure App Config + System Ops modules | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-may-2026-comics-edition/849/) |
| **April 2026** | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-04/) | Coupons hub, Virto OZ CSV creation, dark-mode themes, shareable variant links, Sanity CMS | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-april-2026/847) |
| **March 2026** | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-03/) | .NET 10 preview, marketplace vendor portal, configurable-product improvements | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-march-2026/839) |
| **February 2026** | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-02/) | Cart, order, promotions engine, storefront refinements | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-february-2026/834) |
| **January 2026** | [📊 Open](https://virtocommerce.github.io/vc-release-notes/2026-01/) | Kickoff themes, 2026 platform groundwork | [Notes](https://www.virtocommerce.org/t/virto-s-release-notes-january-2026/821) |

## 🎯 Strategic decks

| Title | Deck |
| :--- | :--- |
| **Release Strategy for Business Users** | [📜 Open](https://virtocommerce.github.io/vc-release-notes/presentations/release-strategy-for-business-users.html) |

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
├── 2026-01/ ... 2026-07/        # One folder per monthly release, each with a self-contained index.html
├── presentations/               # Strategic decks (release strategy, etc.)
└── prompts/                     # Reusable prompt to generate a new deck from a raw release-notes URL
```

## 🧭 References

- [virtocommerce.com](https://virtocommerce.com) · [Community forum](https://www.virtocommerce.org) · [Documentation](https://docs.virtocommerce.org/)
- [All release notes on the forum](https://www.virtocommerce.org/c/news-digest/15)
- [Deck generation prompt](prompts/release-notes-presentation-prompt.md)

## 📄 License

Copyright © Virto Solutions LTD. All rights reserved.

Licensed under the Virto Commerce Open Software License. You may obtain a copy at
[virtocommerce.com/opensourcelicense](http://virtocommerce.com/opensourcelicense). Distributed on an "AS IS" basis, without warranties or conditions of any kind.
