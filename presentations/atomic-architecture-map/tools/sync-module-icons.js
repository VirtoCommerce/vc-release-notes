#!/usr/bin/env node
/* Copy the per-module icons into the presentation and record each one's accent colour.
 *
 * The icon set names every file exactly after the module id in modules_v3.json
 * (VirtoCommerce.Cart.svg), so the mapping needs no table. Each icon is a 128x128 rounded square
 * whose background is a two-stop gradient; the FIRST stop is that module's brand colour, and that
 * is what the tile's left border uses — so the palette on the poster is the palette of the icons
 * by construction rather than by a second hand-maintained list.
 *
 * Usage: node tools/sync-module-icons.js [--source DIR] [--check]
 *   --check  report what would change and exit non-zero if anything is missing
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const SOURCE = (() => {
  const i = args.indexOf('--source');
  return i >= 0 ? args[i + 1] : 'C:/Users/Admin/Downloads/_icon_set';
})();
const CHECK = args.includes('--check');
const ONLINE = args.includes('--online');
const REGISTRY = 'C:/Projects/git/VirtoCommerce/vc-modules/modules_v3.json';
const REGISTRY_URL = 'https://raw.githubusercontent.com/VirtoCommerce/vc-modules/refs/heads/master/modules_v3.json';
const DEST = path.join(ROOT, 'assets/module-icons');

const cmp = (a, b) => {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
};
const latestOf = m => (m.Versions || []).map(v => v.Version).sort(cmp).pop();

/* "Active" is the registry's own signal: a module still being released against platform 3.1xxx.
   Anything whose newest published version is below 3.1000.0 is either archived or pre-3.1 and does
   not belong on a map of what you can install today. */
const ACTIVE_FLOOR = '3.1000.0';

/* Same source as the catalogue generator, for the same reason: a stale clone hides modules. */
const registry = (function () {
  if (ONLINE) {
    const raw = require('child_process').execFileSync('curl', ['-s', '--max-time', '30', REGISTRY_URL],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const parsed = JSON.parse(raw);
    console.log('registry: master over HTTP — ' + parsed.length + ' entries');
    return parsed;
  }
  return JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
})();
const active = registry
  .map(m => ({ id: m.Id, title: m.Title, description: m.Description, groups: m.Groups || [], tags: m.Tags || '', version: latestOf(m) }))
  .filter(m => m.version && cmp(m.version, ACTIVE_FLOOR) >= 0);

/* The icon set is not 94 arbitrary colours — it is a palette of eleven, and modules that share a
   colour share a domain. So the family a module belongs to is READ from its icon rather than
   invented here: the only judgment below is the human name for each hue, plus two singletons that
   are folded into the family they belong to (Profile XAPI is customer data; AI stands alone).
   If the icon set repaints a module, its family follows automatically. */
const FAMILIES = [
  { hex: '#3FD8B4', id: 'catalog',      name: 'Catalog & product data' },
  { hex: '#FFC24D', id: 'cart',         name: 'Cart & checkout' },
  { hex: '#9D86F5', id: 'orders',       name: 'Orders & fulfilment' },
  { hex: '#B79DFB', id: 'content',      name: 'Content & CMS' },
  { hex: '#F87FAC', id: 'customer',     name: 'Customer' },
  { hex: '#4FD2EE', id: 'customer',     name: 'Customer' },              // Profile experience API
  { hex: '#F88A8D', id: 'marketing',    name: 'Marketing & loyalty' },
  { hex: '#5FC8F5', id: 'platform',     name: 'Platform services' },
  { hex: '#5FD080', id: 'integrations', name: 'Integrations & providers' },
  { hex: '#6E7E97', id: 'security',     name: 'Security & compliance' },
  { hex: '#A66BFF', id: 'ai',           name: 'AI' }
];
/* Alphabetical by name. A reading order (commerce story first, substrate after) only helps someone
   who already knows the story; A-to-Z helps someone hunting for a family they can name. Both the
   shelf and the legend read this array, so they cannot disagree. */
const FAMILY_ORDER = FAMILIES
  .map(f => f.id)
  .filter((id, i, all) => all.indexOf(id) === i)
  .sort((a, b) => {
    const nameOf = id => FAMILIES.find(f => f.id === id).name;
    return nameOf(a).localeCompare(nameOf(b), 'en');
  });

function familyOf(accent) {
  const hit = FAMILIES.find(f => f.hex.toLowerCase() === String(accent).toLowerCase());
  return hit ? { id: hit.id, name: hit.name } : { id: 'other', name: 'Other' };
}

/* First gradient stop = the module's brand colour. Falls back to a flat fill, then to a neutral,
   so a hand-drawn icon without a gradient still yields something rather than crashing. */
function accentOf(svg) {
  const stop = /<stop[^>]*stop-color="(#[0-9a-fA-F]{3,8})"/.exec(svg);
  if (stop) return stop[1];
  const fill = /fill="(#[0-9a-fA-F]{3,8})"/.exec(svg);
  return fill ? fill[1] : null;
}

if (!CHECK) fs.mkdirSync(DEST, { recursive: true });

const accents = {}, missing = [];
let copied = 0, unchanged = 0;
for (const m of active) {
  const src = path.join(SOURCE, m.id + '.svg');
  if (!fs.existsSync(src)) { missing.push(m.id); continue; }
  const svg = fs.readFileSync(src, 'utf8');
  const accent = accentOf(svg);
  if (!accent) missing.push(m.id + ' (no colour found)');
  accents[m.id] = accent;
  if (CHECK) continue;
  const dst = path.join(DEST, m.id + '.svg');
  if (fs.existsSync(dst) && fs.readFileSync(dst, 'utf8') === svg) { unchanged++; continue; }
  fs.writeFileSync(dst, svg);
  copied++;
}

console.log(`active modules (>= ${ACTIVE_FLOOR}): ${active.length}`);
console.log(CHECK ? `icons present: ${Object.keys(accents).length}` : `icons copied: ${copied}   unchanged: ${unchanged}`);
if (missing.length) console.log(`MISSING (${missing.length}): ${missing.join(', ')}`);

if (!CHECK) {
  const families = {};
  for (const [id, accent] of Object.entries(accents)) families[id] = familyOf(accent).id;

  const groups = FAMILY_ORDER.map(fid => {
    const meta = FAMILIES.find(f => f.id === fid);
    const members = Object.keys(families).filter(id => families[id] === fid);
    return { id: fid, name: meta.name, hex: meta.hex, count: members.length };
  }).filter(g => g.count);

  const orphans = Object.keys(families).filter(id => families[id] === 'other');
  if (orphans.length) {
    groups.push({ id: 'other', name: 'Other', hex: null, count: orphans.length });
    console.log(`unmapped colours (${orphans.length}): ${orphans.join(', ')}`);
  }

  const out = [
    '/* GENERATED by tools/sync-module-icons.js — do not edit by hand.',
    '   Accent per module, read from the first gradient stop of its icon, so the tile border and the',
    '   icon cannot drift apart. The family is that same colour, named: modules sharing a hue in the',
    '   icon set share a domain, so grouping follows the artwork instead of a second opinion.',
    '   Re-run the tool when the icon set changes. */',
    'window.VC_MODULE_ACCENTS = ' + JSON.stringify(accents, null, 1) + ';',
    'window.VC_MODULE_FAMILY = ' + JSON.stringify(families, null, 1) + ';',
    'window.VC_MODULE_FAMILY_ORDER = ' + JSON.stringify(groups, null, 1) + ';',
    ''
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, 'content/module-accents.js'), out);
  console.log('wrote content/module-accents.js');
  groups.forEach(g => console.log('  ' + String(g.count).padStart(3) + '  ' + g.name + '  ' + (g.hex || '')));
}

process.exit(missing.length && CHECK ? 1 : 0);
