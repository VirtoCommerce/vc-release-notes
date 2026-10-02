"""Port wide-monitor comfort scaling to every slide deck.

Injects two media queries right before the first mobile breakpoint:

  @media (min-width: 1700px) and (min-height: 980px) {
    .slide { width: min(1680px, ...); height: min(1008px, ...); border-radius: 32px; }
    .slide-inner { zoom: 1.4; }   /* +40% to text + visuals + padding */
  }
  @media (min-width: 2200px) and (min-height: 1280px) {
    .slide { width: min(2040px, ...); height: min(1224px, ...); border-radius: 40px; }
    .slide-inner { zoom: 1.7; }   /* +70% for 4K */
  }

Anchors on `@media (max-width: 900px)` first, falls back to `@media (max-width: 1024px)`.
Skips files that are already patched (checks for `min-width: 1700px`) or that
have no mobile breakpoint at all (e.g. the Atomic Architecture Map).

Idempotent: re-runs are no-ops.
"""
from __future__ import annotations
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent

TARGETS = [
    ROOT / "2026-01" / "index.html",
    ROOT / "2026-02" / "index.html",
    ROOT / "2026-03" / "index.html",
    ROOT / "2026-04" / "index.html",
    ROOT / "2026-05" / "index.html",
    ROOT / "2026-06" / "index.html",
    ROOT / "2026-07" / "index.html",
    ROOT / "2026-08" / "index.html",
    ROOT / "2026-09" / "index.html",
    ROOT / "2026-10" / "index.html",  # already patched; proves idempotency
    ROOT / "presentations" / "release-strategy-for-business-users.html",
    ROOT / "presentations" / "virto-cloud.html",
    ROOT / "presentations" / "integration-capabilities.html",
]

MARKER = "min-width: 1700px"

ANCHORS = [
    "@media (max-width: 900px) {",
    "@media (max-width: 1024px) {",
]

BLOCK = """  /* ===== Wide-monitor comfort mode =====
     On big displays (>=1700px wide, enough height) scale the slide and
     everything inside it up proportionally -- same zoom trick that fullscreen
     uses -- so text and visuals stay comfortable instead of marooned in a
     1200x720 island. Nav pill and keyboard-hint strip keep their size (they
     are chrome, not content).
  */
  @media (min-width: 1700px) and (min-height: 980px) {
    .slide {
      width: min(1680px, calc(100vw - 72px));
      height: min(1008px, calc(100vh - 72px));
      border-radius: 32px;
    }
    .slide-inner { zoom: 1.4; }
  }

  @media (min-width: 2200px) and (min-height: 1280px) {
    .slide {
      width: min(2040px, calc(100vw - 96px));
      height: min(1224px, calc(100vh - 96px));
      border-radius: 40px;
    }
    .slide-inner { zoom: 1.7; }
  }

"""


def port(path: Path) -> str:
    try:
        html = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return f"[SKIP] {path.relative_to(ROOT)} (file missing)"

    if MARKER in html:
        return f"[  OK] {path.relative_to(ROOT)} (already patched)"

    for anchor in ANCHORS:
        if anchor in html:
            new_html = html.replace(anchor, BLOCK + "  " + anchor, 1)
            path.write_text(new_html, encoding="utf-8", newline="\n")
            return f"[PATCH] {path.relative_to(ROOT)} -> inserted before {anchor!r}"

    return f"[SKIP] {path.relative_to(ROOT)} (no mobile @media anchor found)"


def main() -> int:
    rc = 0
    for p in TARGETS:
        print(port(p))
    return rc


if __name__ == "__main__":
    sys.exit(main())
