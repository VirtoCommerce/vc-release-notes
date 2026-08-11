"""Port :fullscreen enhancement rules into a deck.

Usage:
    python .scripts/port_fullscreen.py <deck.html> [<more decks>...]

Adds the :fullscreen CSS block that:
  - Fills the viewport edge-to-edge (100vw × 100vh, no card radius/shadow)
  - Zooms slide content 1.25× so text reads well on large screens
  - Hides the keyboard-shortcut hint bar
  - Fades the bottom nav pill to 0.35 opacity; restores to 1 on hover/focus-within

Windowed browser view stays exactly as before — nothing changes until the
browser is in real fullscreen (F key / fullscreen button).

Idempotent: files already containing `:fullscreen .slide` are skipped.
Reference source of truth: presentations/integration-capabilities.html.
"""
import os
import sys

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(REPO_ROOT, 'presentations', 'integration-capabilities.html')


def extract_block():
    with open(SOURCE, 'r', encoding='utf-8') as f:
        src = f.read()
    start_marker = '  /* ============================================================\n     FULLSCREEN MODE ONLY'
    i = src.find(start_marker)
    if i < 0:
        raise RuntimeError('reference block not found in integration-capabilities.html')
    # Block ends at the closing brace of the last :fullscreen .nav:hover rule.
    end_marker = '  :fullscreen .nav:hover, :fullscreen .nav:focus-within {'
    j = src.find(end_marker, i)
    if j < 0:
        raise RuntimeError('end marker not found')
    # Find the closing brace of that rule
    lbrace = src.find('{', j)
    depth = 0
    k = lbrace
    while k < len(src):
        if src[k] == '{':
            depth += 1
        elif src[k] == '}':
            depth -= 1
            if depth == 0:
                k += 1
                break
        k += 1
    # Include trailing newline
    if k < len(src) and src[k] == '\n':
        k += 1
    return src[i:k]


def port(target, block):
    with open(target, 'r', encoding='utf-8') as f:
        src = f.read()
    if ':fullscreen .slide' in src:
        print(f'{target}: already has fullscreen rules, skipping')
        return

    # Insert right before the mobile @media block
    anchor = '@media (max-width: 900px)'
    at = src.find(anchor)
    if at < 0:
        raise RuntimeError(f'{target}: no @media (max-width: 900px) anchor to insert before')
    # Find beginning of the line containing the anchor
    line_start = src.rfind('\n', 0, at) + 1
    new_src = src[:line_start] + block + '\n' + src[line_start:]
    with open(target, 'w', encoding='utf-8', newline='\n') as f:
        f.write(new_src)
    print(f'{target}: fullscreen block inserted')


def main(argv):
    if not argv:
        print(__doc__)
        sys.exit(2)
    block = extract_block()
    print(f'Extracted block: {len(block)} bytes, {len(block.splitlines())} lines')
    for target in argv:
        port(target, block)


if __name__ == '__main__':
    main(sys.argv[1:])
