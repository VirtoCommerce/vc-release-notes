#!/usr/bin/env node
/* Release history  →  content/heat.generated.js
 *
 * The change heat map: how much each tile changed, month by month, from --since (default 2025-01)
 * to the current month. Two sources, both read rather than remembered:
 *
 *   modules  GitHub releases of every active module repository. Each release is one event; its body
 *            is split into items under the "Development" and "Bug fixes" headings the release
 *            workflow writes, and each item is classified as a feature or a fix/update.
 *   atoms    commits on vc-platform origin/dev, attributed to an atom through the source files the
 *            atom cites. Atoms about other repositories borrow their module's releases.
 *
 * Scoring, per event (one release, or one platform commit):
 *   +5  a new capability appears — a module's first release, or a commit that adds a file an atom cites
 *   +3  the event carries at least one feature
 *   +1  fixes, dependency bumps and other updates only
 *
 * Usage: node tools/build-heat.js [--since 2025-01] [--platform <path to vc-platform>]
 */
const fs = require('fs');
const path = require('path');
const { execFile, execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'content/heat.generated.js');
const args = process.argv.slice(2);
const argOf = (name, dflt) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : dflt; };
const SINCE = argOf('--since', '2025-01');
const PLATFORM = argOf('--platform', path.resolve(ROOT, '../../../vc-platform'));
const SCORE = { newCapability: 5, featureRelease: 3, fixRelease: 1 };

const sinceDate = new Date(SINCE + '-01T00:00:00Z');
const now = new Date();
const months = [];
for (let d = new Date(sinceDate); d <= now; d.setUTCMonth(d.getUTCMonth() + 1)) {
  months.push(d.toISOString().slice(0, 7));
}
const monthIndex = iso => months.indexOf(String(iso).slice(0, 7));

function load(file, key) {
  const sandbox = {};
  new Function('window', fs.readFileSync(path.join(ROOT, file), 'utf8'))(sandbox);
  return sandbox[key];
}
const MODULES = load('content/modules-active.js', 'VC_ACTIVE_MODULES');
const ATOMS = load('content/atoms.js', 'VC_MAP_ATOMS');

/* ---------------------------------------------------------------- classification */

/* What reads as maintenance rather than new behaviour. Checked against each release item and each
   commit subject; a "Development" item that matches it is still an update, not a feature. */
const FIX_RE = new RegExp('\\b(' + [
  'fix(es|ed)?', 'bug', 'hotfix', 'bump(s|ed)?', 'upgrade[sd]?', 'vulnerab\\w*', 'dependenc\\w*', 'dependabot',
  'security patch', 'chore', 'ci', 'refactor\\w*', 'typo', 'revert\\w*', 'clean ?up', 'lint\\w*', 'test(s|ing)?',
  'docs?', 'documentation', 'readme', 'migrate to', 'align\\w*', 'pin(ned)?',
  // housekeeping that release notes file under "Development"
  'logo', 'locali[sz]ation\\w*', 'translations?', 'obsolete', 'deprecat\\w*', 'remove[sd]?', 'drop(s|ped)?',
  'rename[sd]?', 'perf(ormance)?', 'optimi[sz]\\w*', 'cost', 'faster', 'net ?\\d+', 'stable ?\\d+',
  'nuget', 'packages?', 'workflows?', 'github actions?', 'pipeline', 'version', 'per request'
].join('|') + ')\\b', 'i');
const FEATURE_PREFIX_RE = /^(feat(ure)?)(\(.+\))?:/i;

const stripTags = s => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
const tidyTitle = s => stripTags(s).replace(/\s*\(#\d+\)\s*$/, '').replace(/^(feat|fix|chore)(\(.+\))?:\s*/i, '')
  .replace(/^VCST-\d+:?\s*/i, '').replace(/^\W+/, '').slice(0, 140);

/* A release body is HTML (<h3>section</h3><ul><li>item</li></ul>) from the release workflow, or
   Markdown in older releases. Both become [{ section, text }]. */
function releaseItems(body) {
  const items = [];
  let section = '';
  const tokens = String(body || '').split(/(<h\d[^>]*>[\s\S]*?<\/h\d>|<li[^>]*>[\s\S]*?<\/li>|\n)/i);
  for (const t of tokens) {
    if (!t) continue;
    let m;
    if ((m = /^<h\d[^>]*>([\s\S]*?)<\/h\d>$/i.exec(t))) { section = stripTags(m[1]); continue; }
    if ((m = /^<li[^>]*>([\s\S]*?)<\/li>$/i.exec(t))) { items.push({ section, text: stripTags(m[1]) }); continue; }
    if ((m = /^\s*#{1,4}\s+(.+)$/.exec(t))) { section = m[1].trim(); continue; }
    if ((m = /^\s*[*-]\s+(.+)$/.exec(t))) items.push({ section, text: stripTags(m[1]) });
  }
  return items.filter(i => i.text && !/^full changelog/i.test(i.text));
}

function classifyItem(item) {
  if (/bug|fix/i.test(item.section)) return 'fix';
  if (FEATURE_PREFIX_RE.test(item.text)) return 'feature';
  return FIX_RE.test(item.text) ? 'fix' : 'feature';
}

/* ---------------------------------------------------------------- per-tile accumulation */

function emptyTile() {
  return { score: months.map(() => 0), events: months.map(() => 0), features: months.map(() => 0),
           born: -1, highlights: [] };
}
function addEvent(tile, mi, { born, featureTitles, fixCount }) {
  if (mi < 0) return;
  const hasFeature = featureTitles.length > 0;
  let s = hasFeature ? SCORE.featureRelease : SCORE.fixRelease;
  if (born) { s += SCORE.newCapability; tile.born = mi; }
  tile.score[mi] += s;
  tile.events[mi] += 1;
  tile.features[mi] += hasFeature ? 1 : 0;
  for (const t of featureTitles) tile.highlights.push([mi, t]);
  if (born) tile.highlights.push([mi, '__born__']);
  void fixCount;
}
function finishTile(tile) {
  /* Newest first, deduplicated, capped: the tooltip and the drawer show a handful, not the history. */
  const seen = new Set();
  tile.highlights = tile.highlights.sort((a, b) => b[0] - a[0])
    .filter(([, t]) => (seen.has(t) ? false : seen.add(t)))
    .slice(0, 40);
  return tile;
}

/* ---------------------------------------------------------------- modules: GitHub releases */

function gh(apiPath) {
  return new Promise(resolve => {
    execFile('gh', ['api', apiPath], { maxBuffer: 64 * 1024 * 1024 }, (err, stdout) => {
      if (err) return resolve(null);
      try { resolve(JSON.parse(stdout)); } catch (e) { resolve(null); }
    });
  });
}

function repoPath(m) {
  const url = String(m.repoUrl || '').replace(/\s+/g, '');
  const hit = /github\.com\/([^/]+)\/([^/#?]+)/i.exec(url);
  return hit ? hit[1] + '/' + hit[2].replace(/\.git$/, '') : 'VirtoCommerce/' + m.repo;
}

async function moduleReleases(m) {
  const all = [];
  let reachedOlder = false;
  for (let page = 1; page <= 15 && !reachedOlder; page++) {
    const batch = await gh(`repos/${repoPath(m)}/releases?per_page=100&page=${page}`);
    if (!Array.isArray(batch) || !batch.length) break;
    for (const r of batch) {
      if (r.draft || r.prerelease || !r.published_at) continue;
      if (new Date(r.published_at) < sinceDate) { reachedOlder = true; continue; }
      all.push(r);
    }
    if (batch.length < 100) break;
  }
  /* The module was born inside the window only if no release older than the window exists. */
  return { releases: all, bornInWindow: !reachedOlder && all.length > 0 };
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (next < items.length) { const i = next++; out[i] = await fn(items[i], i); }
  }));
  return out;
}

/* ---------------------------------------------------------------- atoms: platform commits */

function platformCommits() {
  const fmt = '%x1e%H%x1f%ad%x1f%s';
  const raw = execFileSync('git', ['-C', PLATFORM, 'log', 'origin/dev', '--no-merges', '--date=short',
    '--since=' + SINCE + '-01', '--name-status', '--format=' + fmt], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  return raw.split('\x1e').filter(Boolean).map(block => {
    const [head, ...rest] = block.split('\n');
    const [hash, date, subject] = head.split('\x1f');
    const files = rest.filter(Boolean).map(l => { const p = l.split('\t'); return { status: p[0][0], file: p[p.length - 1] }; });
    return { hash, date, subject, files };
  });
}

/* Atoms whose subject lives in another repository borrow that module's releases. */
const ATOM_MODULES = {
  xapi: ['VirtoCommerce.Xapi'],
  search: ['VirtoCommerce.Search'],
  assets: ['VirtoCommerce.Assets', 'VirtoCommerce.AzureBlobAssets', 'VirtoCommerce.FileSystemAssets'],
  'eventbus-webhooks': ['VirtoCommerce.EventBus', 'VirtoCommerce.WebHooks'],
  'seq-logging': ['VirtoCommerce.SeqLog'],
  'admin-ui': ['VirtoCommerce.AdminAngularJs', 'VirtoCommerce.AdminShell'],
  'background-jobs': ['VirtoCommerce.BackgroundJobs'],
  'module-federation': ['VirtoCommerce.ModuleFederation']
};

/* Files cited by many atoms (Startup.cs by 14) change for reasons unrelated to most of them. A
   touch on such a file counts for an atom only when the commit subject names something the atom is
   about; otherwise one refactor of Startup.cs would heat half the table. */
function atomKeywords(a) {
  const words = [a.name, ...(a.tags || []), ...(a.api || []).map(x => x.name)]
    .join(' ').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 4);
  return new Set(words.filter(w => !['platform', 'virtocommerce', 'service', 'services', 'with', 'from', 'configuration'].includes(w)));
}

/* ---------------------------------------------------------------- main */

(async function main() {
  const t0 = Date.now();
  console.log(`heat window ${months[0]} … ${months[months.length - 1]} (${months.length} months)`);

  /* modules */
  const moduleTiles = {};
  const results = await pool(MODULES, 8, async m => ({ m, ...(await moduleReleases(m)) }));
  let releaseCount = 0, featureReleases = 0, born = 0;
  for (const { m, releases, bornInWindow } of results) {
    const tile = emptyTile();
    const ordered = releases.slice().sort((a, b) => a.published_at.localeCompare(b.published_at));
    ordered.forEach((r, i) => {
      const items = releaseItems(r.body);
      const featureTitles = items.filter(it => classifyItem(it) === 'feature').map(it => tidyTitle(it.text)).filter(Boolean);
      const isBorn = bornInWindow && i === 0;
      addEvent(tile, monthIndex(r.published_at), { born: isBorn, featureTitles, fixCount: items.length - featureTitles.length });
      releaseCount++; if (featureTitles.length) featureReleases++; if (isBorn) born++;
    });
    moduleTiles[m.id] = finishTile(tile);
  }
  console.log(`modules: ${MODULES.length} repositories, ${releaseCount} releases (${featureReleases} with features, ${born} new modules)`);

  /* platform */
  const commits = platformCommits();
  const platformReleases = months.map(() => 0);
  const platformScore = months.map(() => 0);
  const citeCount = {};
  ATOMS.forEach(a => (a.api || []).forEach(x => { if (x.file && !x.file.startsWith('(')) citeCount[x.file] = (citeCount[x.file] || 0) + 1; }));
  const isHub = f => (citeCount[f] || 0) >= 3;

  const atomTiles = {};
  for (const a of ATOMS) atomTiles[a.id] = emptyTile();
  let attributed = 0;
  for (const c of commits) {
    const mi = monthIndex(c.date);
    if (mi < 0) continue;
    if (/^\d+\.\d+\.\d+$/.test(c.subject.trim())) { platformReleases[mi]++; continue; }
    const isFeature = FEATURE_PREFIX_RE.test(c.subject) || !FIX_RE.test(c.subject);
    platformScore[mi] += isFeature ? SCORE.featureRelease : SCORE.fixRelease;
    const subjectWords = new Set(c.subject.toLowerCase().split(/[^a-z0-9]+/));
    for (const a of ATOMS) {
      const cited = (a.api || []).map(x => x.file).filter(f => f && !f.startsWith('('));
      if (!cited.length) continue;
      const hits = c.files.filter(f => cited.some(p => (p.endsWith('/') ? f.file.startsWith(p) : f.file === p)));
      if (!hits.length) continue;
      const nonHub = hits.filter(h => !isHub(cited.find(p => p === h.file) || ''));
      if (!nonHub.length) {
        const kw = atomKeywords(a);
        if (![...subjectWords].some(w => kw.has(w))) continue;
      }
      const added = hits.some(h => h.status === 'A');
      addEvent(atomTiles[a.id], mi, { born: added, featureTitles: isFeature ? [tidyTitle(c.subject)] : [], fixCount: isFeature ? 0 : 1 });
      attributed++;
    }
  }
  for (const [atomId, moduleIds] of Object.entries(ATOM_MODULES)) {
    const tile = atomTiles[atomId];
    if (!tile) continue;
    for (const id of moduleIds) {
      const src = moduleTiles[id];
      if (!src) continue;
      src.score.forEach((v, i) => { tile.score[i] += v; tile.events[i] += src.events[i]; tile.features[i] += src.features[i]; });
      tile.highlights.push(...src.highlights.filter(h => h[1] !== '__born__'));
    }
  }
  Object.values(atomTiles).forEach(finishTile);
  console.log(`platform: ${commits.length} commits, ${platformReleases.reduce((s, v) => s + v, 0)} releases, ${attributed} atom attributions`);

  /* the timeline behind the period picker: everything that happened, per month */
  const moduleScore = months.map((_, i) => Object.values(moduleTiles).reduce((s, t) => s + t.score[i], 0));
  const moduleReleaseCount = months.map((_, i) => Object.values(moduleTiles).reduce((s, t) => s + t.events[i], 0));

  const compact = tiles => Object.fromEntries(Object.entries(tiles)
    .filter(([, t]) => t.score.some(Boolean))
    .map(([id, t]) => [id, { s: t.score, e: t.events, f: t.features, b: t.born, h: t.highlights }]));

  const data = {
    generatedAt: now.toISOString().slice(0, 10),
    since: months[0],
    months,
    scoring: SCORE,
    timeline: { platformReleases, platformScore, moduleReleases: moduleReleaseCount, moduleScore },
    modules: compact(moduleTiles),
    atoms: compact(atomTiles)
  };
  const body = [
    '/* GENERATED by tools/build-heat.js — do not edit.',
    ` * Change heat from ${months[0]} to ${months[months.length - 1]}: module releases from GitHub and`,
    ' * vc-platform commits on origin/dev, scored +5 new capability, +3 feature, +1 fix or update.',
    ' * Per tile: s = score, e = events, f = events with features (one number per month), b = month',
    ' * index the tile was born in (-1 if before the window), h = [month index, title] highlights. */',
    'window.VC_MAP_HEAT = ' + JSON.stringify(data) + ';',
    ''
  ].join('\n');
  fs.writeFileSync(OUT, body);
  console.log(`wrote content/heat.generated.js — ${(body.length / 1024).toFixed(0)}KB, ` +
    `${Object.keys(data.modules).length} modules and ${Object.keys(data.atoms).length} atoms with changes, ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})();
