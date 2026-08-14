#!/usr/bin/env node
/* Extract one module's profile from its checkout — everything a machine can know for certain.
 *
 * Two kinds of field, kept apart on purpose:
 *   facts{}   read from module.manifest, the project layout, the C# and the README. Re-runnable,
 *             diffable, and never written by hand.
 *   notes{}   the judgment a reader needs and no parser can supply (who cares, when to reach for
 *             it, what it owns). Authored, and left empty by this tool.
 *
 * Usage:
 *   node tools/module-profile.js vc-module-webhooks              # write content/modules/<id>.json
 *   node tools/module-profile.js vc-module-webhooks --stdout     # print, write nothing
 *   node tools/module-profile.js --all --ref origin/dev          # every active module, read from dev
 *   ... --online     verify documentation slugs over HTTP
 *   ... --no-fetch   use the refs already in the local clone rather than fetching
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECKOUTS = 'C:/Projects/git/VirtoCommerce';
const REGISTRY = path.join(CHECKOUTS, 'vc-modules/modules_v3.json');
const OUT_DIR = path.join(ROOT, 'content/modules');

// ---------------------------------------------------------------- small helpers

const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } };
const cmpVer = (a, b) => {
  const pa = String(a).split('.').map(Number), pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
  return 0;
};

/* Walk once, skipping build output. Every later probe filters this list instead of re-walking:
   a module tree is ~2k files and eight probes over it is eight seconds we do not need to spend. */
function walk(dir, acc = [], depth = 0) {
  if (depth > 8) return acc;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const e of entries) {
    if (e.name === 'obj' || e.name === 'bin' || e.name === '.git' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc, depth + 1);
    else acc.push(p);
  }
  return acc;
}

const tag = (xml, name) => {
  const m = new RegExp('<' + name + '>([\\s\\S]*?)</' + name + '>').exec(xml || '');
  return m ? m[1].trim() : null;
};
const tagList = (xml, outer, inner) => {
  const block = tag(xml, outer);
  if (!block) return [];
  return [...block.matchAll(new RegExp('<' + inner + '>([\\s\\S]*?)</' + inner + '>', 'g'))].map(m => m[1].trim());
};

// ---------------------------------------------------------------- README

/* READMEs are not uniform: some open with `## Overview`, others with badges and a bare paragraph.
   Take the explicit section when it exists and fall back to the first real prose after the title,
   with badge lines and images dropped — those are the two shapes in the wild today. */
function parseReadme(md) {
  if (!md) return { overview: null, keyFeatures: [], docs: [], references: [], headings: [] };

  const lines = md.split(/\r?\n/);
  const headings = lines.map((l, i) => ({ i, m: /^(#{1,3})\s+(.*)$/.exec(l) }))
    .filter(x => x.m).map(x => ({ line: x.i, level: x.m[1].length, text: x.m[2].trim() }));

  const sectionAfter = h => {
    const next = headings.find(x => x.line > h.line && x.level <= h.level);
    return lines.slice(h.line + 1, next ? next.line : lines.length);
  };
  const find = re => headings.find(h => re.test(h.text));

  const isNoise = l => !l.trim() || /^\[!\[/.test(l.trim()) || /^!\[/.test(l.trim()) || /^<img/.test(l.trim());

  const overviewHeading = find(/^overview$/i);
  let overview;
  if (overviewHeading) {
    overview = sectionAfter(overviewHeading).filter(l => !isNoise(l)).join(' ').trim();
  } else {
    const start = headings.length ? headings[0].line + 1 : 0;
    const end = headings.find(h => h.line > start) ? headings.find(h => h.line > start).line : lines.length;
    const para = [];
    for (const l of lines.slice(start, end)) {
      if (isNoise(l)) { if (para.length) break; else continue; }
      para.push(l.trim());
    }
    overview = para.join(' ').trim();
  }

  const bullets = h => sectionAfter(h)
    .filter(l => /^\s*[*-]\s+/.test(l))
    .map(l => l.replace(/^\s*[*-]\s+/, '').trim());

  const featuresHeading = find(/^key\s+features?$/i) || find(/^features?$/i);
  const linksIn = h => sectionAfter(h)
    .flatMap(l => [...l.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)].map(m => ({ label: m[1].trim(), href: m[2] })));

  const docsHeading = find(/^documentation$/i);
  const refsHeading = find(/^references?$/i);

  return {
    overview: overview || null,
    keyFeatures: featuresHeading ? bullets(featuresHeading) : [],
    docs: docsHeading ? linksIn(docsHeading) : [],
    references: refsHeading ? linksIn(refsHeading) : [],
    headings: headings.filter(h => h.level === 2).map(h => h.text)
  };
}

// ---------------------------------------------------------------- code signals

function codeSignals(repoDir, files) {
  const cs = files.filter(f => f.endsWith('.cs'));
  const rel = f => path.relative(repoDir, f).replace(/\\/g, '/');

  const projects = fs.existsSync(path.join(repoDir, 'src'))
    ? fs.readdirSync(path.join(repoDir, 'src'), { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))   // .nuke is build tooling, not a project
        .map(d => d.name)
    : [];

  const providers = ['SqlServer', 'MySql', 'PostgreSql'].filter(p => projects.some(n => n.endsWith('.Data.' + p)));

  // REST surface: a class with a [Route("api/...")] attribute, plus how many verb-attributed actions
  const controllers = [];
  for (const f of cs.filter(f => /Controller\.cs$/.test(f))) {
    const src = read(f) || '';
    const route = /\[Route\("([^"]+)"\)\]/.exec(src);
    const actions = (src.match(/\[Http(Get|Post|Put|Delete|Patch)/g) || []).length;
    const authorize = (src.match(/\[Authorize\(/g) || []).length;
    if (route || actions) controllers.push({ file: rel(f), route: route ? route[1] : null, actions, authorizedActions: authorize });
  }

  const grab = (re, src) => [...src.matchAll(re)].map(m => m[1]);
  let permissions = [], settings = [];
  for (const f of cs.filter(f => /ModuleConstants\.cs$/.test(f))) {
    const src = read(f) || '';
    /* A permission has a segment on either side of the colon. Catalog's
       `OperationLogVariationMarker = "MainProductId:"` is a const with a trailing colon, not a permission. */
    permissions = permissions.concat(grab(/public const string \w+ = "([^"]+)"/g, src)
      .filter(v => /^[a-z][\w.-]*(:[\w.*-]+)+$/i.test(v)));
    /* A SettingDescriptor name is dotted (Webhooks.General.SendRetryCount). The `Name = "Webhooks|General"`
       lines in the same file are setting-GROUP labels, and counting them as settings inflates the number. */
    settings = settings.concat(grab(/Name = "([^"]+)"/g, src).filter(v => v.includes('.') && !v.includes('|')));
  }

  /* Product code only. A test fake that implements IEventHandler<T> is not a module behaviour, and
     it was the sole "handler" found in Webhooks. */
  const product = cs.filter(f => !/(^|[\/])(tests?|samples?)[\/]/i.test(rel(f)));

  const eventsPublished = [...new Set(product.flatMap(f => grab(/new (\w+ChangedEvent|\w+ChangingEvent)\(/g, read(f) || '')))];
  /* What the module DECLARES, which is what other modules can subscribe to. Construction sites are a
     poor proxy: CrudService raises events through a generic factory, so Cart declares two events and
     constructs neither — "publishes none" would have been a wrong sentence on its page. */
  const declaredEvents = [...new Set(product.flatMap(f =>
    /* `class Name : Base` and `class Name(args) : Base(args)` — the C# 12 primary-constructor form puts
       a parameter list between the two, which the stricter pattern read as "declares nothing". */
    grab(/class\s+(\w+)\s*(?:\([^)]*\))?\s*:\s*(?:GenericChangedEntryEvent|DomainEvent)/g, read(f) || '')))].sort();
  const handlers = product.filter(f => /IEventHandler</.test(read(f) || '')).map(rel);
  /* Which events the module reacts to, read from the generic argument of each IEventHandler<T> it
     implements. A count said "1 handler" and left the reader no wiser; the name says which part of
     the platform this module listens to. Bare type parameters (T, TEvent) are dropped — they are a
     generic signature, not an event. */
  const handledEvents = [...new Set(product.flatMap(f => grab(/IEventHandler<\s*([\w.]+)\s*>/g, read(f) || '')))]
    .map(name => name.split('.').pop())
    .filter(name => /Event$/.test(name) && name.length > 5)
    .sort();
  /* Subscribing through the registrar instead of implementing the interface means the module picks
     its events at runtime — that is how Webhooks reacts to every domain event in the process. */
  const dynamicSubscription = product.some(f => /IEventHandlerRegistrar|RegisterEventHandler\s*\(/.test(read(f) || ''));
  const schemaBuilders = cs.filter(f => /ISchemaBuilder|QueryBuilder<|MutationBuilder</.test(read(f) || '')).map(rel);
  const indexBuilders = cs.filter(f => /IIndexDocumentBuilder|IndexDocumentChangesProvider/.test(read(f) || '')).map(rel);
  const migrations = files.filter(f => /\/Migrations\/.*\.cs$/.test(f.replace(/\\/g, '/')) && !/Designer\.cs$/.test(f));
  const adminScripts = files.filter(f => /\/Scripts\/.*\.(js|html)$/.test(f.replace(/\\/g, '/')));
  /* Localization files are named <lang>.<Assembly>.json; the language prefix is the useful part —
     "13 languages" is a fact a reader can act on, thirteen file names are not. */
  const localizations = files.filter(f => /\/Localizations\/.*\.json$/.test(f.replace(/\\/g, '/')))
    .map(f => path.basename(f, '.json').split('.')[0]);
  const entities = cs.filter(f => /Entity\.cs$/.test(f) && /class \w+Entity\b/.test(read(f) || '')).map(f => path.basename(f, '.cs'));

  return {
    projects, databaseProviders: providers,
    restControllers: controllers,
    permissions: [...new Set(permissions)].sort(),
    settings: [...new Set(settings)].sort(),
    domainEventsPublished: eventsPublished.sort(),
    declaredEvents: declaredEvents,
    eventHandlers: handlers,
    handledEvents: handledEvents,
    subscribesDynamically: dynamicSubscription,
    graphqlBuilders: schemaBuilders,
    indexDocumentBuilders: indexBuilders,
    migrationCount: migrations.length,
    hasAdminUi: adminScripts.length > 0,
    adminUiFiles: adminScripts.length,
    localizations: [...new Set(localizations)].sort(),
    entities: [...new Set(entities)].sort()
  };
}

function gitInfo(repoDir) {
  const git = (...a) => { try { return execFileSync('git', ['-C', repoDir, ...a], { encoding: 'utf8' }).trim(); } catch { return null; } };
  return {
    branch: git('rev-parse', '--abbrev-ref', 'HEAD'),
    lastCommit: git('log', '-1', '--format=%h %ad %s', '--date=short'),
    lastCommitDate: git('log', '-1', '--format=%ad', '--date=short')
  };
}

// ---------------------------------------------------------------- reading a ref, not the worktree

const os = require('os');

/* A repo directory for a registry name, tolerating the two stale ProjectUrl redirects: the acronym
   forms (vc-module-u-c-p) do not exist on disk even though GitHub redirects them. */
function checkoutFor(repoName) {
  /* "vc-module-u-c-p" is the registry's own ProjectUrl for vc-module-ucp. GitHub redirects it; a
     filesystem does not, so collapse the dashes after the prefix and try that too. */
  const collapsed = repoName.replace(/^vc-module-/, '').replace(/-/g, '');
  for (const c of [repoName, 'vc-module-' + collapsed]) {
    const dir = path.join(CHECKOUTS, c);
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
  }
  return null;
}

/* No checkout: clone shallowly into a temp directory rather than into the user's tree. Used only
   with --clone, so a plain run never reaches for the network to invent a repository. */
function shallowClone(repoName, ref) {
  const branch = (ref || 'origin/dev').replace(/^origin\//, '');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vc-clone-'));
  const url = 'https://github.com/VirtoCommerce/' + repoName;
  for (const b of [branch, 'main', 'master']) {
    try {
      execFileSync('git', ['clone', '--depth', '1', '--quiet', '--branch', b, url, dir],
        { stdio: ['ignore', 'ignore', 'ignore'] });
      return { dir: dir, branch: b };
    } catch { /* try the next branch name */ }
  }
  rmrf(dir);
  return null;
}

function git(dir, args, quiet) {
  try { return execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8', stdio: quiet ? ['ignore', 'pipe', 'ignore'] : undefined }).trim(); }
  catch { return null; }
}

/* Export `ref` into a temp directory and return it, or null when the ref does not exist. `git
   archive | tar -x` is one process per repository — reading two thousand blobs through `git show`
   would not be. */
function exportRef(dir, ref, fetch) {
  const branch = ref.replace(/^origin\//, '');
  if (fetch) git(dir, ['fetch', 'origin', branch, '--quiet'], true);

  let resolved = ref;
  if (!git(dir, ['rev-parse', '--verify', '--quiet', resolved], true)) {
    /* Not every module uses dev: fall back to the remote's own default branch. */
    const head = git(dir, ['symbolic-ref', 'refs/remotes/origin/HEAD'], true);
    resolved = head ? head.replace('refs/remotes/', '') : null;
    if (!resolved || !git(dir, ['rev-parse', '--verify', '--quiet', resolved], true)) return null;
  }

  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'vc-profile-'));
  const tarball = path.join(out, '_export.tar');
  try {
    /* No shell and no pipe: git writes the archive, tar unpacks it. A `sh -c` pipeline works in Git
       Bash but not when Node spawns it — /usr/bin/sh is not on the Windows PATH. */
    execFileSync('git', ['-C', dir, 'archive', '--format=tar', '--output=' + tarball, resolved],
      { stdio: ['ignore', 'ignore', 'ignore'] });
    execFileSync('tar', ['-xf', '_export.tar'], { cwd: out, stdio: ['ignore', 'ignore', 'ignore'] });
    fs.unlinkSync(tarball);
  } catch { rmrf(out); return null; }

  return {
    dir: out,
    ref: resolved,
    sha: git(dir, ['rev-parse', '--short', resolved], true),
    date: git(dir, ['log', '-1', '--format=%ad', '--date=short', resolved], true),
    subject: git(dir, ['log', '-1', '--format=%s', resolved], true)
  };
}

function rmrf(dir) { try { fs.rmSync(dir, { recursive: true, force: true }); } catch { /* temp dir */ } }

// ---------------------------------------------------------------- profile

function registryEntry(registry, repoName, manifestId) {
  if (manifestId) {
    const byId = registry.find(m => m.Id === manifestId);
    if (byId) return byId;
  }
  // fall back on the repo name: vc-module-catalog-csv-export-import → CatalogCsvImportModule is
  // not derivable, so match on the project url instead, which the registry carries verbatim.
  return registry.find(m => (m.ProjectUrl || '').toLowerCase().endsWith('/' + repoName.toLowerCase())) || null;
}

function profile(repoName, opts) {
  opts = opts || {};
  let checkout = checkoutFor(repoName), cloned = null;
  if (!checkout && opts.clone) {
    cloned = shallowClone(repoName, opts.ref);
    if (cloned) checkout = cloned.dir;
  }
  if (!checkout) throw new Error('no checkout for ' + repoName + (opts.clone ? ' and cloning failed' : ' (pass --clone to fetch it)'));

  /* Read a ref when asked, so the facts describe the module rather than whatever branch the
     checkout happens to be parked on. */
  let exported = null, repoDir = checkout;
  if (opts.ref && !cloned) {
    exported = exportRef(checkout, opts.ref, opts.fetch !== false);
    if (!exported) throw new Error('cannot read ' + opts.ref + ' in ' + repoName);
    repoDir = exported.dir;
  }

  const files = walk(repoDir);

  /* Pick the module's OWN manifest. Three traps, in the order they bit:
       `_module.manifest` — a disabled sample manifest that endsWith() happily matched;
       samples/ and tests/ — real manifests for demo modules living in the same repo;
       several valid ones — artifacts/ holds a build copy, src/ holds the source of truth. */
  const manifestCandidates = files.filter(f => path.basename(f) === 'module.manifest')
    .filter(f => !/(^|[\/])(samples?|tests?|artifacts)[\/]/i.test(path.relative(repoDir, f)))
    .sort((a, b) => a.split(/[\/]/).length - b.split(/[\/]/).length);

  const expectedId = (function () {
    global.window = {};
    try { eval(read(path.join(ROOT, 'content/modules-active.js')) || ''); } catch { /* optional */ }
    const cat = global.window.VC_ACTIVE_MODULES || [];
    const hit = cat.find(m => m.repo === repoName) ||
                cat.find(m => 'vc-module-' + String(m.id).replace(/^VirtoCommerce\./, '').replace(/-/g, '').toLowerCase() ===
                              repoName.replace(/-/g, '').toLowerCase());
    return hit ? hit.id : null;
  })();

  const manifestFile = (expectedId &&
      manifestCandidates.find(f => (tag(read(f) || '', 'id') || '') === expectedId)) ||
    manifestCandidates[0] ||
    files.find(f => path.basename(f) === 'module.manifest');
  const manifest = read(manifestFile);
  const readme = read(path.join(repoDir, 'README.md'));
  /* The generated catalogue, not the registry clone: it is built from master with --online, and it is
     the same list the tiles are drawn from. Reading a second, older copy is how UCP and SalesRep came
     out with no version at all. */
  const catalogue = (function () {
    global.window = {};
    try { eval(read(path.join(ROOT, 'content/modules-active.js')) || ''); } catch { /* optional */ }
    return global.window.VC_ACTIVE_MODULES || [];
  })();

  const id = manifest ? tag(manifest, 'id') : null;
  const fromCatalogue = catalogue.find(m => m.id === id) ||
                        catalogue.find(m => m.repo === repoName) || null;
  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
  const entry = registryEntry(registry, repoName, id);
  const latest = fromCatalogue ? fromCatalogue.version
    : entry ? (entry.Versions || []).map(v => v.Version).sort(cmpVer).pop() : null;

  const deps = manifest ? [...(tag(manifest, 'dependencies') || '').matchAll(/<dependency\s+([^/>]+)\/>/g)] : [];
  const parseDep = attrs => {
    const get = n => (new RegExp(n + '="([^"]*)"').exec(attrs) || [])[1];
    return { id: get('id'), version: get('version'), optional: get('optional') === 'true' };
  };

  let accents = {};
  try { global.window = {}; eval(read(path.join(ROOT, 'content/module-accents.js')) || ''); accents = global.window.VC_MODULE_ACCENTS || {}; } catch { /* optional */ }

  const rm = parseReadme(readme);

  const result = {
    /* --- identity ------------------------------------------------------- */
    id,
    repo: repoName,
    repoUrl: 'https://github.com/VirtoCommerce/' + repoName,
    name: fromCatalogue ? fromCatalogue.name : (entry ? entry.Title : (manifest ? tag(manifest, 'title') : repoName)),
    tagline: fromCatalogue ? fromCatalogue.description : (entry ? entry.Description : (manifest ? tag(manifest, 'description') : null)),
    latestVersion: latest,
    active: latest ? cmpVer(latest, '3.1000.0') >= 0 : false,
    groups: fromCatalogue ? fromCatalogue.groups : (entry ? (entry.Groups || []) : []),
    accent: accents[id] || null,
    icon: id ? 'assets/module-icons/' + id + '.svg' : null,

    /* --- facts: parsed, never hand-written ------------------------------ */
    facts: {
      manifestVersion: manifest ? tag(manifest, 'version') : null,
      platformVersion: manifest ? tag(manifest, 'platformVersion') : null,
      assembly: manifest ? tag(manifest, 'assemblyFile') : null,
      authors: manifest ? tagList(manifest, 'authors', 'author') : [],
      tags: manifest ? (tag(manifest, 'tags') || '') : '',
      dependsOn: deps.map(m => parseDep(m[1])).filter(d => !d.optional),
      optionalDependencies: deps.map(m => parseDep(m[1])).filter(d => d.optional),
      ...codeSignals(repoDir, files),
      git: exported
        ? { ref: exported.ref, sha: exported.sha, lastCommitDate: exported.date,
            lastCommit: exported.sha + ' ' + exported.date + ' ' + (exported.subject || ''),
            readFrom: 'git ref' }
        : cloned
          ? Object.assign({ ref: 'origin/' + cloned.branch, readFrom: 'shallow clone' }, gitInfo(checkout))
          : Object.assign({ readFrom: 'working tree' }, gitInfo(checkout))
    },

    /* --- readme: quoted, with the source recorded ----------------------- */
    readme: {
      overview: rm.overview,
      keyFeatures: rm.keyFeatures,
      docs: rm.docs,
      references: rm.references,
      sections: rm.headings,
      quality: rm.overview ? (rm.keyFeatures.length ? 'full' : 'overview only') : 'missing'
    },

    /* --- notes: authored, one audience per line -------------------------
       Left null by the tool on purpose. A generated sentence that reads like judgment is worse
       than an empty field, because a reader cannot tell the two apart. */
    notes: {
      forAnalyst: null,
      forArchitect: null,
      forDeveloper: null,
      owns: [],
      reachForItWhen: [],
      doNotReachForItWhen: []
    },

    extractedAt: new Date().toISOString().slice(0, 10),
    extractedBy: 'tools/module-profile.js'
  };

  if (exported) rmrf(exported.dir);
  if (cloned) rmrf(cloned.dir);
  return result;
}

// ---------------------------------------------------------------- cli

/* Documentation links, in order of trust:
     1. whatever the README already links to docs.virtocommerce.org (read, not guessed)
     2. the conventional user-guide and developer-guide slugs, but only the ones that answer 200
   Slug guessing without verification would put dead links on 94 pages, so --online is required for
   step 2 and the field records which route produced each link. */
function docCandidates(id) {
  const short = id.replace(/^VirtoCommerce\./, '').replace(/Module$/, '');
  const slug = short.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  return [
    { label: short + ' — user guide', href: 'https://docs.virtocommerce.org/platform/user-guide/' + slug + '/overview/' },
    { label: short + ' — developer guide', href: 'https://docs.virtocommerce.org/platform/developer-guide/latest/' + slug + '/' }
  ];
}

function verifyUrl(url) {
  try {
    const code = execFileSync('curl', ['-s', '-o', process.platform === 'win32' ? 'NUL' : '/dev/null',
      '-w', '%{http_code}', '-L', '--max-time', '15', url], { encoding: 'utf8' }).trim();
    return code === '200';
  } catch { return false; }
}

function addDocLinks(p, online) {
  const fromReadme = (p.readme.docs || []).filter(d => /docs\.virtocommerce\.org/.test(d.href))
    .map(d => ({ label: d.label, href: d.href, source: 'readme' }));
  const links = fromReadme.slice();
  if (online) {
    for (const c of docCandidates(p.id)) {
      if (links.some(l => l.href === c.href)) continue;
      if (verifyUrl(c.href)) links.push({ label: c.label, href: c.href, source: 'verified 200' });
    }
  }
  p.documentation = {
    repository: p.repoUrl,
    links: links,
    checkedOnline: !!online
  };
  return p;
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: node tools/module-profile.js <vc-module-xxx> [--stdout] | --all');
  process.exit(2);
}

const ONLINE = args.includes('--online');
const REF = (function () { const i = args.indexOf('--ref'); return i >= 0 ? args[i + 1] : null; })();
const FETCH = !args.includes('--no-fetch');
const OPTS = { ref: REF, fetch: FETCH, clone: args.includes('--clone') };

/* Re-running the extractor must not throw away the authored half. Facts are overwritten, notes are
   carried across from whatever is already on disk. */
function mergeNotes(p) {
  const existing = path.join(OUT_DIR, (p.id || '') + '.json');
  if (!fs.existsSync(existing)) return p;
  try {
    const prev = JSON.parse(fs.readFileSync(existing, 'utf8'));
    if (prev.notes && prev.notes.forAnalyst) p.notes = prev.notes;
  } catch { /* a corrupt previous file should not block a fresh extraction */ }
  return p;
}

if (args[0] === '--all') {
  /* The catalogue, not the folder listing: 118 directories look like module repos, and only the 96
     the registry still publishes belong on the map. */
  global.window = {};
  eval(read(path.join(ROOT, 'content/modules-active.js')) || '');
  const active = global.window.VC_ACTIVE_MODULES || [];
  const repos = active.map(m => m.repo);
  console.log('profiling ' + repos.length + ' active modules' + (REF ? ' from ' + REF : ' from the working tree'));
  fs.mkdirSync(OUT_DIR, { recursive: true });
  let ok = 0, skipped = [];
  for (const r of repos) {
    try {
      const p = profile(r, OPTS);
      if (!p.id || !p.active) { skipped.push(r + (p.id ? ' (' + p.latestVersion + ')' : ' (no manifest)')); continue; }
      fs.writeFileSync(path.join(OUT_DIR, p.id + '.json'), JSON.stringify(mergeNotes(addDocLinks(p, ONLINE)), null, 1));
      ok++;
    } catch (e) { skipped.push(r + ' (' + e.message + ')'); }
  }
  console.log(`profiled: ${ok}   skipped: ${skipped.length}`);
  skipped.forEach(s => console.log('  skip ' + s));
} else {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const p = mergeNotes(addDocLinks(profile(args[0], OPTS), ONLINE));
  if (args.includes('--stdout')) { console.log(JSON.stringify(p, null, 1)); }
  else {
    const out = path.join(OUT_DIR, (p.id || args[0]) + '.json');
    fs.writeFileSync(out, JSON.stringify(p, null, 1));
    console.log('wrote ' + path.relative(ROOT, out));
    console.log(`  ${p.id} ${p.latestVersion}  readme: ${p.readme.quality}  features: ${p.readme.keyFeatures.length}  ` +
                `deps: ${p.facts.dependsOn.length}+${p.facts.optionalDependencies.length} optional  ` +
                `controllers: ${p.facts.restControllers.length}  settings: ${p.facts.settings.length}  permissions: ${p.facts.permissions.length}`);
    console.log(`  docs: ${p.documentation.links.length} link(s)` + (p.documentation.checkedOnline ? ' (slugs verified online)' : ' (run --online to discover more)') +
                (p.notes.forAnalyst ? '  notes: carried over' : '  notes: not written'));
  }
}
