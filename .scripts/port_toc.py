"""Port the TOC panel feature (CSS + markup + JS + wire-up) from 2026-07 into an older release-notes deck.

Usage:
    python .scripts/port_toc.py 2026-<NN>/index.html [<more>...]

Idempotent — files that already have `.toc-panel {` (base rule) or `renderTocPanel` (JS)
are skipped. Reference source of truth: 2026-07/index.html.
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(REPO_ROOT, '2026-07', 'index.html')


def extract():
    with open(SOURCE, 'r', encoding='utf-8') as f:
        src = f.read()
    css_start = src.find('  /* TOC panel */')
    css_end = src.find('  /* Nav Add-to-backlog toggle button')
    if css_start < 0 or css_end < 0:
        raise RuntimeError('CSS TOC anchors not found in 2026-07')
    css = src[css_start:css_end]

    mk_start = src.find('<div class="toc-backdrop"')
    mk_end = src.find('</aside>', mk_start) + len('</aside>')
    markup = src[mk_start:mk_end] + '\n'

    js_start = src.find('/* ---------------- TOC PANEL ----------------')
    js_marker = 'if (e.changedTouches[0].screenX - tocTouchStartX < -60) closeToc();'
    js_pos = src.find(js_marker, js_start)
    js_end = src.find('});', js_pos) + len('});')
    js = src[js_start:js_end] + '\n'

    return css, markup, js


def port(target, css, markup, js):
    with open(target, 'r', encoding='utf-8') as f:
        src = f.read()
    # Precise idempotency check — the mobile-fix port added `.toc-panel { width: 100% }` inside
    # an @media block, so a plain `.toc-panel {` string is not a reliable "already ported" signal.
    if 'function renderTocPanel' in src and 'id="tocBackdrop"' in src:
        print(f'{target}: already has TOC, skipping')
        return

    changes = []

    # 1) CSS: insert before `/* Nav Add-to-backlog toggle` comment (falls back to `/* NAV */`)
    anchor = '/* Nav Add-to-backlog toggle'
    at = src.find(anchor)
    if at < 0:
        anchor = '/* NAV */'
        at = src.find(anchor)
    if at < 0:
        raise RuntimeError(f'{target}: no CSS anchor')
    line_start = src.rfind('\n', 0, at) + 1
    src = src[:line_start] + css + src[line_start:]
    changes.append('css')

    # 2) Markup: insert before `<div class="stage"`
    stage = src.find('<div class="stage"')
    line_start = src.rfind('\n', 0, stage) + 1
    src = src[:line_start] + markup + '\n' + src[line_start:]
    changes.append('markup')

    # 3) JS module: insert before final `render();` call
    render_call = src.rfind('\nrender();')
    src = src[:render_call + 1] + js + '\n' + src[render_call + 1:]
    changes.append('js-module')

    # 4) Add renderTocPanel() call after render()
    render_call = src.find('\nrender();')
    eol = src.find('\n', render_call + 1)
    src = src[:eol] + '\nrenderTocPanel();' + src[eol:]
    changes.append('renderTocPanel-call')

    # 5) In showSlide, wire updateTocActive so the highlighted section updates as you navigate
    if 'updateTocActive()' not in src:
        idx = src.find('function showSlide(i)')
        if idx > 0:
            lbrace = src.find('{', idx)
            depth = 0
            k = lbrace
            while k < len(src):
                if src[k] == '{':
                    depth += 1
                elif src[k] == '}':
                    depth -= 1
                    if depth == 0:
                        break
                k += 1
            src = src[:k] + '  if (typeof tocOpen !== "undefined" && tocOpen) updateTocActive();\n' + src[k:]
            changes.append('showSlide-updateTocActive')

    # 6) Update keydown: add T shortcut and extend Escape to closeToc too
    old_esc = "} else if (e.key === 'Escape') {\n    if (lightboxOpen) closeLightbox();\n  }"
    new_esc = "} else if (e.key === 't' || e.key === 'T') {\n    toggleToc();\n  } else if (e.key === 'Escape') {\n    if (lightboxOpen) closeLightbox();\n    else closeToc();\n  }"
    if old_esc in src:
        src = src.replace(old_esc, new_esc)
        changes.append('escape+T-handler')

    with open(target, 'w', encoding='utf-8', newline='\n') as f:
        f.write(src)
    print(f'{target}: injected {", ".join(changes)}')


def main(argv):
    if not argv:
        print(__doc__)
        sys.exit(2)
    css, markup, js = extract()
    print(f'Extracted from 2026-07: css {len(css)}b, markup {len(markup)}b, js {len(js)}b')
    for t in argv:
        port(t, css, markup, js)


if __name__ == '__main__':
    main(sys.argv[1:])
