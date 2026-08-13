#!/usr/bin/env node
/* modules_v3.json  →  content/modules-active.js
 *
 * The catalogue tier: every module you can install today, with the facts the registry already
 * knows — identity, newest version, platform floor, dependencies with their optional flag,
 * incompatibilities, group. Nothing hand-maintained: "active" is a rule (newest published version
 * >= 3.1000.0), not a list somebody remembers to update.
 *
 * Usage: node tools/build-active-modules.js [--online] [--check]
 *   --online  read master over HTTP instead of the local vc-modules clone
 *   --check   fail if the generated file is stale
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY = 'C:/Projects/git/VirtoCommerce/vc-modules/modules_v3.json';
const REGISTRY_URL = 'https://raw.githubusercontent.com/VirtoCommerce/vc-modules/refs/heads/master/modules_v3.json';
const OUT = path.join(ROOT, 'content/modules-active.js');
const ONLINE = process.argv.includes('--online');
const CHECK = process.argv.includes('--check');
const ACTIVE_FLOOR = '3.1000.0';

const cmp = (a, b) => {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
};

/* A local clone goes stale silently — this one sat two modules behind master, which hid UCP and
   SalesRep and kept an old title for Background Jobs. That is exactly what a projection cannot
   notice on its own, so --online reads master and both paths print what they loaded. */
const registry = (function loadRegistry() {
  if (ONLINE) {
    const raw = execFileSync('curl', ['-s', '--max-time', '30', REGISTRY_URL],
      { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
    const parsed = JSON.parse(raw);
    console.log('registry: master over HTTP — ' + parsed.length + ' entries');
    return parsed;
  }
  const parsed = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  console.log('registry: local clone — ' + parsed.length + ' entries (pass --online to read master)');
  return parsed;
})();

/* Module id → repo name. The registry records the project URL, so the repo is read rather than
   guessed — VirtoCommerce.CatalogCsvImportModule lives in vc-module-catalog-csv-export-import and
   no naming rule would have found it. One row (Contentful) has no ProjectUrl at all; there the
   conventional name is derived and flagged as derived. */
const repoOf = entry => {
  const m = /github\.com\/VirtoCommerce\/([^/#?]+)/i.exec(entry.ProjectUrl || '');
  if (m) return m[1];
  return 'vc-module-' + entry.Id.replace(/^VirtoCommerce\./, '')
    .replace(/Module$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
};

/* Registry titles are written for a package list, not for a poster: seven end in the word "module"
   ("Payment module", "Import module"), two repeat the vendor ("VirtoCommerce AI"), one is unspaced.
   These rules strip that noise and nothing else. Anything a rule cannot fix is named explicitly
   below, and the raw title travels alongside as `registryTitle`, so the module page can still show
   what the registry actually says. */
const NAME_OVERRIDES = {
  'VirtoCommerce.StateMachine': 'State Machine',   // "StateMachine module" — no rule restores that space
  'VirtoCommerce.SeqLog': 'Seq log sink',          // "SeqLog" does not say what it is
  'VirtoCommerce.Core': 'Commerce core'            // "Commerce core module"
};

function displayName(entry) {
  if (NAME_OVERRIDES[entry.Id]) return NAME_OVERRIDES[entry.Id];
  let name = (entry.Title || '').trim();
  if (!name) name = entry.Id.replace(/^VirtoCommerce\./, '').replace(/([a-z0-9])([A-Z])/g, '$1 $2');
  name = name.replace(/^virto\s*commerce\s+/i, '');   // "VirtoCommerce AI" → "AI"
  name = name.replace(/\s+modules?$/i, '');           // "Payment module" → "Payment"
  return name.trim();
}

const short = id => String(id).replace(/^VirtoCommerce\./, '');

const modules = registry
  .map(entry => {
    const versions = (entry.Versions || []).slice().sort((a, b) => cmp(a.Version, b.Version));
    return { entry, newest: versions[versions.length - 1] };
  })
  .filter(x => x.newest && cmp(x.newest.Version, ACTIVE_FLOOR) >= 0)
  .map(({ entry, newest }) => {
    const deps = newest.Dependencies || [];
    return {
      id: entry.Id,
      /* Tile id, kept in the molecule namespace so existing deep links keep working. */
      moleculeId: 'mod-' + short(entry.Id).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/Module$/, '').replace(/-+$/, '').toLowerCase(),
      name: displayName(entry),
      registryTitle: entry.Title || null,
      description: entry.Description || null,
      version: newest.Version,
      versionTag: newest.VersionTag || null,
      platformVersion: newest.PlatformVersion || null,
      groups: entry.Groups || [],
      tags: entry.Tags || '',
      repo: repoOf(entry),
      repoUrl: entry.ProjectUrl || ('https://github.com/VirtoCommerce/' + repoOf(entry)),
      repoUrlDerived: !entry.ProjectUrl || undefined,
      dependsOn: deps.filter(d => !d.Optional).map(d => short(d.Id)).sort(),
      optional: deps.filter(d => d.Optional).map(d => short(d.Id)).sort(),
      incompatibleWith: (newest.Incompatibilities || []).map(i => short(i.Id || i.id || '')).filter(Boolean)
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const dupes = modules.map(m => m.moleculeId).filter((v, i, a) => a.indexOf(v) !== i);
if (dupes.length) { console.error('duplicate tile ids: ' + [...new Set(dupes)].join(', ')); process.exit(1); }

const body = [
  '/* GENERATED by tools/build-active-modules.js from vc-modules/modules_v3.json — do not edit.',
  ' * ' + modules.length + ' modules whose newest published version is >= ' + ACTIVE_FLOOR + '.',
  ' * Identity, version, platform floor and dependencies (with the optional flag) all come from the',
  ' * registry, so this file is a projection of it and never a second opinion. `name` is the registry',
  ' * title with package-list noise stripped; `registryTitle` is that title verbatim.',
  ' */',
  'window.VC_ACTIVE_MODULES = ' + JSON.stringify(modules, null, 1) + ';',
  ''
].join('\n');

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current !== body) { console.error('modules-active.js is STALE — run node tools/build-active-modules.js --online'); process.exit(1); }
  console.log('modules-active.js is up to date (' + modules.length + ' modules)');
} else {
  fs.writeFileSync(OUT, body);
  console.log('wrote content/modules-active.js — ' + modules.length + ' active modules');
  console.log('  commerce group: ' + modules.filter(m => m.groups.includes('commerce')).length +
              '   standalone (no required deps): ' + modules.filter(m => !m.dependsOn.length).length +
              '   declaring optional deps: ' + modules.filter(m => m.optional.length).length);
  const renamed = modules.filter(m => m.registryTitle && m.registryTitle !== m.name);
  console.log('  display names cleaned: ' + renamed.length);
  renamed.forEach(m => console.log('    ' + JSON.stringify(m.registryTitle) + ' → ' + JSON.stringify(m.name)));
}
