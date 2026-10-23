# Virto AI Roadmap · demo videos

Videos embedded in [`presentations/virto-ai-roadmap.html`](../virto-ai-roadmap.html). Eight demos were extracted from the source PPTX (`All Things AI Webinar.pptx`) and renamed to match the deck's slide references.

## Extracted from the source deck

| File | Size | Duration | Source PPTX slide | Deck slide |
| :--- | ---: | ---: | :--- | :--- |
| `intent-search.mp4` | 6.2 MB | 2:05 | 11 — AI Intent Search | 03 |
| `search-by-image.mov` | 24.5 MB | 0:30 | 17 — Search by Image concept | 04 |
| `ai-product-assistant.mp4` | 1.9 MB | — | 22 — AI Product Assistant | 05 |
| `ucp-ai-agents.mp4` | 5.7 MB | — | 30 — UCP Agentic Buying | 06 |
| `supplier-activation.mp4` | 5.7 MB | — | 48 — Tenant/Supplier Activation | 09 |
| `virto-oz.mp4` | 2.2 MB | — | 57 — Catalog enrichment / OZ | 11 |
| `virto-oz-properties.mp4` | 2.7 MB | — | 58 — Catalog enrichment properties | *bonus — not currently referenced* |
| `one-buying-experience.mp4` | 35.3 MB | — | 71 — One Buying Experience | 12 |

**Total: 84 MB across 8 files.**

> `search-by-image.mov` is a QuickTime container but holds H.264, so modern browsers play it when labeled `video/mp4` (as the deck does). If you want to be extra safe, convert it with `ffmpeg -i search-by-image.mov -c copy search-by-image.mp4` and the deck will pick up the `.mp4` version automatically (just drop the `videoType` field or rename the file).

## Not yet in the source — placeholders still show

The deck references these filenames but no video exists for them yet. The nice navy placeholder card with a play icon shows the title and the expected path until a real MP4 is dropped in.

| File | Deck slide | Needed for |
| :--- | :--- | :--- |
| `po-to-order.mp4` | 07 | Smart PO to Order Capture |
| `onx-order-ops.mp4` | 13 | onX |
| `ai-page-publishing.mp4` | 14 | AI Page Publishing |
| `virto-oz-developers.mp4` | 16 | Virto OZ for Developers |

## Recommended encoding

- Container: **MP4** (H.264 + AAC)
- Resolution: **1920 × 1080** (16:9); scales to the slide, fills the screen on fullscreen expand
- Target duration: **30–90 seconds** per demo — roadmap deck, not a tutorial
- Captions: burn in or ship a `.vtt` sidecar

## Fullscreen

Every video has an **expand button** (⤢) in the top-right corner. Clicking it fullscreens the player — demo plays full-screen for a conference-room presentation. Esc returns to the slide.

## Replacing a video

```bash
cp new-intent-search.mp4 presentations/videos/intent-search.mp4
```

No HTML or JS change needed — the deck reloads and the new frame plays.
