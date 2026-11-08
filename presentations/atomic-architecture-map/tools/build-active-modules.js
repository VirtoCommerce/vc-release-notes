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

/* Registry entries that are not platform capabilities, whatever their release state. Named with a
   reason so the exclusion is a decision someone can read and reverse, not a silent filter. */
const NOT_PRODUCTS = {
  'VirtoCommerce.CITest': 'the CI test module (vc-ci-test): exercises the release pipeline, not a platform capability'
};

/* A registry entry is not a release. Since 3.1058 the registry has gained entries with no published
   release behind them (Punchout, VirtoOZManagement) and one whose repository does not resolve
   (OneShell). A module goes on the map only when its repository has a published release a customer
   could download. One GraphQL call answers that for every repository at once.

   Offline there is no way to ask, so the previous run's exclusions are reused and the output says
   so — the catalogue must not silently grow back the entries a networked run removed. */
function ownerOf(entry) {
  /* Whitespace stripped first: Punchout's ProjectUrl reads "github.com/Virto Commerce/…". */
  const m = String(entry.ProjectUrl || '').replace(/\s+/g, '').match(/github\.com\/([^/]+)\//i);
  return m ? m[1] : 'VirtoCommerce';
}

function releaseStatus(entries) {
  if (!ONLINE) return null;
  const query = 'query { ' + entries.map((e, i) =>
    'm' + i + ': repository(owner: ' + JSON.stringify(ownerOf(e)) + ', name: ' + JSON.stringify(repoOf(e)) + ') ' +
    '{ latestRelease { tagName } }').join('\n') + ' }';
  const tmp = path.join(require('os').tmpdir(), 'vc-map-releases.graphql');
  fs.writeFileSync(tmp, query);
  let raw;
  try {
    raw = execFileSync('gh', ['api', 'graphql', '-F', 'query=@' + tmp], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  } catch (e) {
    /* gh exits non-zero when any one repository is missing, but still prints the data for the rest. */
    raw = e.stdout || '';
  }
  let data = null;
  try { data = JSON.parse(raw).data; } catch (e) { /* fall through */ }
  if (!data) { console.error('release check failed — is `gh` installed and authenticated?'); process.exit(1); }
  const status = {};
  entries.forEach((e, i) => {
    const r = data['m' + i];
    status[e.Id] = !r ? 'repository ' + ownerOf(e) + '/' + repoOf(e) + ' not found'
      : !r.latestRelease ? 'no published release in ' + ownerOf(e) + '/' + repoOf(e)
      : null;
  });
  return status;
}

function previousExclusions() {
  if (!fs.existsSync(OUT)) return [];
  const sandbox = {};
  try { new Function('window', fs.readFileSync(OUT, 'utf8'))(sandbox); } catch (e) { return []; }
  return sandbox.VC_EXCLUDED_MODULES || [];
}

const aboveFloor = registry
  .map(entry => {
    const versions = (entry.Versions || []).slice().sort((a, b) => cmp(a.Version, b.Version));
    return { entry, newest: versions[versions.length - 1] };
  })
  .filter(x => x.newest && cmp(x.newest.Version, ACTIVE_FLOOR) >= 0);

const released = releaseStatus(aboveFloor.map(x => x.entry));
const excluded = [];
if (released) {
  aboveFloor.forEach(({ entry, newest }) => {
    const reason = NOT_PRODUCTS[entry.Id] || released[entry.Id];
    if (reason) excluded.push({ id: entry.Id, version: newest.Version, reason });
  });
} else {
  previousExclusions().forEach(x => excluded.push(x));
  Object.keys(NOT_PRODUCTS).forEach(id => {
    const hit = aboveFloor.find(x => x.entry.Id === id);
    if (hit && !excluded.some(x => x.id === id)) excluded.push({ id, version: hit.newest.Version, reason: NOT_PRODUCTS[id] });
  });
}
const excludedIds = new Set(excluded.map(x => x.id));

const modules = aboveFloor
  .filter(x => !excludedIds.has(x.entry.Id))
  .map(({ entry, newest }) => {
    const deps = newest.Dependencies || [];
    return {
      id: entry.Id,
      /* The module id IS the tile id, so a deep link reads #/molecule/VirtoCommerce.Core — the identity
         a developer already has from module.manifest, the registry and every dependency list. The old
         derived slug is kept so links written against it still resolve. */
      moleculeId: entry.Id,
      slug: 'mod-' + short(entry.Id).replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/Module$/, '').replace(/-+$/, '').toLowerCase(),
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
  ' * A module is listed only if its repository has a published release; the entries above the',
  ' * version floor that do not are in VC_EXCLUDED_MODULES, each with the reason.',
  ' */',
  'window.VC_ACTIVE_MODULES = ' + JSON.stringify(modules, null, 1) + ';',
  '',
  'window.VC_EXCLUDED_MODULES = ' + JSON.stringify(excluded.sort((a, b) => a.id.localeCompare(b.id)), null, 1) + ';',
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
  console.log('  excluded above the floor: ' + excluded.length +
              (released ? '' : '  (offline — reused from the previous online run)'));
  excluded.forEach(x => console.log('    ' + x.id + ' ' + x.version + ' — ' + x.reason));
  const renamed = modules.filter(m => m.registryTitle && m.registryTitle !== m.name);
  console.log('  display names cleaned: ' + renamed.length);
  renamed.forEach(m => console.log('    ' + JSON.stringify(m.registryTitle) + ' → ' + JSON.stringify(m.name)));
}
