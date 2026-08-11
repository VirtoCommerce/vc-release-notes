"""Port bubbles + cat easter eggs from virto-cloud.html into another business deck.

Usage:
    python .scripts/port_eggs.py presentations/<target>.html [<more targets>...]

Idempotent — files that already contain the eggs are skipped. Extracts fresh
each run from `presentations/virto-cloud.html`, so any future refinements
to the eggs there flow into re-ports automatically.
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(REPO_ROOT, 'presentations', 'virto-cloud.html')


def extract_eggs():
    with open(SOURCE, 'r', encoding='utf-8') as f:
        src = f.read()

    # CSS: from "#bubbles { position:" through the prefers-reduced-motion guard
    css_start = src.find('  #bubbles { position: fixed')
    css_marker = '  @media (prefers-reduced-motion: reduce) { #catEgg .cat-tail { animation: none; } }'
    css_end = src.find(css_marker)
    if css_start < 0 or css_end < 0:
        raise RuntimeError('CSS anchors not found in virto-cloud.html')
    css_end_nl = src.find('\n', css_end) + 1
    css = src[css_start:css_end_nl]

    # Markup: from <canvas id="bubbles" to the closing </div> of the catEgg block
    mk_start = src.find('<canvas id="bubbles"')
    if mk_start < 0:
        raise RuntimeError('canvas#bubbles not found in virto-cloud.html')
    catEgg_open = src.find('<div id="catEgg"', mk_start)
    mk_end = src.find('</div>', catEgg_open) + len('</div>')
    markup = src[mk_start:mk_end] + '\n'

    # JS: from cat IIFE comment to end of bubbles IIFE
    js_start = src.find('/* ---- hidden toggle: press c → ginger cat naps')
    if js_start < 0:
        raise RuntimeError('cat IIFE comment not found in virto-cloud.html')
    bubbles_iife = src.find('/* ---- effervescent bubbles', js_start)
    js_end = src.find('})();', bubbles_iife) + len('})();')
    js = src[js_start:js_end] + '\n'

    return css, markup, js


def port(target, css, markup, js):
    with open(target, 'r', encoding='utf-8') as f:
        src = f.read()
    if '#bubbles' in src or 'catEgg' in src:
        print(f'{target}: already has eggs, skipping')
        return

    changes = []

    # 1) CSS: right before `.stage {` rule
    stage_at = src.find('  .stage {')
    if stage_at < 0:
        raise RuntimeError(f'{target}: no `.stage {{` rule to anchor before')
    src = src[:stage_at] + css + '\n' + src[stage_at:]
    changes.append('css')

    # 2) Markup: right before <div class="progress-bar"
    pb_at = src.find('<div class="progress-bar"')
    if pb_at < 0:
        raise RuntimeError(f'{target}: no progress-bar div to anchor before')
    src = src[:pb_at] + markup + '\n' + src[pb_at:]
    changes.append('markup')

    # 3) JS: right before the final </script>
    script_close = src.rfind('</script>')
    if script_close < 0:
        raise RuntimeError(f'{target}: no </script> to anchor before')
    src = src[:script_close] + js + '\n' + src[script_close:]
    changes.append('js')

    with open(target, 'w', encoding='utf-8', newline='\n') as f:
        f.write(src)
    print(f'{target}: injected {", ".join(changes)}')


def main(argv):
    if not argv:
        print(__doc__)
        sys.exit(2)
    css, markup, js = extract_eggs()
    print(f'Extracted from {os.path.relpath(SOURCE, REPO_ROOT)}: '
          f'css {len(css)}b, markup {len(markup)}b, js {len(js)}b')
    for target in argv:
        port(target, css, markup, js)


if __name__ == '__main__':
    main(sys.argv[1:])
