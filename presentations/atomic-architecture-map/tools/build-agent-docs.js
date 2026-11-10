#!/usr/bin/env node
/* Writes the agent export of the map: the same content as the poster, in files an AI coding agent
   (Claude Code, Copilot, Cursor and the like) can read without running the page.

     llms.txt                      the index, in the llms.txt convention: one line and a link per part
     atomic-map.json               everything in one file, for tools
     agent/RULES.md                what an agent must and must not do in a Virto Commerce module
     agent/atoms/<id>.md           one page per atom: pattern, when to use, what to avoid, API, example
     agent/modules/<id>.md         one page per active module: what it owns, dependencies, events, API
     agent/packages/<id>.md        one page per published package (PBC): modules and business features
     agent/layers/<id>.md          one page per layer of the solution architecture
     agent/features.md             business features → modules → packages

   Every file is a projection of content/*.js and content/modules/*.json, so the export cannot say
   something the map does not. The one exception is the short "Before you write code" list at the top
   of RULES.md, a summary of the Your solution layer kept here; change both together. check-content.js rebuilds it in memory and
   fails when the files on disk differ, the same way it guards the other generated data.

     node tools/build-agent-docs.js          write the export
     node tools/build-agent-docs.js --check  exit 1 if the export on disk is out of date */
const fs = require('fs');
const path = require('path');

const MAP = path.resolve(__dirname, '..');
const OUT_DIR = 'agent';
const DOCS_BASE = 'https://docs.virtocommerce.org/platform/developer-guide/latest/';
const GITHUB_ORG = 'https://github.com/VirtoCommerce/';
const DEFAULT_BRANCH = { 'vc-cli-module-template': 'main', 'vc-modules': 'master' };

const ADOPTION = {
  'platform': { label: 'Platform', blurb: 'Platform-native. This is the Virto way.' },
  'module': { label: 'Module', blurb: 'Ships outside platform core: install the module or tool.' },
  'available': { label: 'Available', blurb: '.NET offers it; this platform does not use it.' },
  'in-flight': { label: 'In flight', blurb: 'Changing right now: read the migration note.' },
  'legacy': { label: 'Legacy', blurb: 'Still works; do not build new code on it.' }
};

function loadContent() {
  const sandbox = { window: {} };
  for (const f of ['meta', 'architecture', 'atoms', 'molecules', 'features', 'module-accents', 'modules-active', 'cells.generated']) {
    const file = path.join(MAP, 'content', f + '.js');
    if (!fs.existsSync(file)) continue;
    new Function('window', fs.readFileSync(file, 'utf8'))(sandbox.window);
  }
  const w = sandbox.window;
  const active = w.VC_ACTIVE_MODULES || [];
  const profiles = {};
  for (const m of active) {
    const file = path.join(MAP, 'content', 'modules', m.id + '.json');
    if (fs.existsSync(file)) profiles[m.id] = JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  return {
    meta: w.VC_MAP_META || {},
    layers: w.VC_MAP_ARCHITECTURE || [],
    families: w.VC_MAP_FAMILIES || [],
    atoms: w.VC_MAP_ATOMS || [],
    topics: (w.VC_MAP_MOLECULES || []).filter(m => m.kind !== 'module'),
    features: w.VC_MAP_FEATURES || [],
    moduleFamilyOrder: w.VC_MODULE_FAMILY_ORDER || [],
    moduleFamilyOf: w.VC_MODULE_FAMILY || {},
    active,
    profiles,
    packages: w.VC_MAP_PBC || []
  };
}

// ---------------------------------------------------------------- links and text

function githubUrl(repo, filePath) {
  const last = filePath.split('/').pop();
  const kind = last.indexOf('.') > 0 ? 'blob' : 'tree';
  return GITHUB_ORG + repo + '/' + kind + '/' + (DEFAULT_BRANCH[repo] || 'dev') + '/' + filePath;
}

/* Same three cases as apiFile() in app.js: a vc-platform path, `(vc-repo/path)`, or prose. */
function apiFileLink(file) {
  const text = String(file || '').trim();
  if (!text) return '';
  if (text[0] !== '(') return '[' + text + '](' + githubUrl('vc-platform', text) + ')';
  const m = /^\((vc-[a-z0-9.-]+)\/(\S+)\)$/.exec(text);
  if (m) return '[' + m[1] + '/' + m[2] + '](' + githubUrl(m[1], m[2]) + ')';
  return text;
}

/* `page` is a vc-docs page, `href` is external, `path` is a file in this repository relative to
   presentations/ — rebased onto the folder the Markdown file sits in. */
function docUrl(doc, depth) {
  if (doc.href) return doc.href;
  if (doc.page) return DOCS_BASE + doc.page + '/';
  if (doc.path) return '../'.repeat(depth + 1) + doc.path;
  return null;
}

/* A module README links its own files relatively (`docs/x.md`); those resolve in the module's
   repository, not next to this export. */
function docList(docs, depth, repo) {
  return (docs || []).map(d => {
    let url = docUrl(d, depth);
    if (repo && d.href && !/^[a-z]+:/i.test(d.href) && d.href[0] !== '#') url = githubUrl(repo, d.href.replace(/^\.?\//, ''));
    return { label: d.label, url };
  }).filter(d => d.url).map(d => '- [' + d.label + '](' + d.url + ')');
}

/* The same for links written inside README prose. */
function rebaseLinks(s, repo) {
  if (!repo) return s;
  return String(s).replace(/\]\(([^)\s]+)\)/g, (all, href) =>
    /^[a-z]+:/i.test(href) || href[0] === '#' ? all : '](' + githubUrl(repo, href.replace(/^\.?\//, '')) + ')');
}

function makeText(ctx) {
  const atomById = {};
  ctx.atoms.forEach(a => { atomById[a.id] = a; });
  /* Prose keeps its Markdown (`code`, **bold**); [[atom-id]] cross-references become links. */
  return function text(s, fromDir) {
    return String(s == null ? '' : s).replace(/\[\[([a-z0-9-]+)\]\]/g, (_, id) => {
      const a = atomById[id];
      const href = fromDir === 'atoms' ? id + '.md' : fromDir === 'root' ? OUT_DIR + '/atoms/' + id + '.md' : (fromDir === 'agent' ? '' : '../') + 'atoms/' + id + '.md';
      return '[' + (a ? a.name : id) + '](' + href + ')';
    });
  };
}

function bullets(list, fn) { return (list || []).map(x => '- ' + (fn ? fn(x) : x)); }
function section(title, lines) { return lines && lines.length ? ['', '## ' + title, '', ...lines] : []; }
function page(lines) { return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n'; }

// ---------------------------------------------------------------- derived relations

function featureSlots(f) { return (f.modules || []).map(s => Array.isArray(s) ? s : [s]); }

function packagesForFeature(f, packages) {
  return packages.filter(p => featureSlots(f).every(slot => slot.some(id => (p.modules || []).includes(id))));
}

function relations(ctx) {
  const activeIds = new Set(ctx.active.map(m => m.id));
  const packagesOf = {};
  ctx.packages.forEach(p => (p.modules || []).forEach(id => { (packagesOf[id] = packagesOf[id] || []).push(p); }));
  const featuresOf = {};
  ctx.features.forEach(f => featureSlots(f).forEach(slot => slot.forEach(id => {
    (featuresOf[id] = featuresOf[id] || []).push(f);
  })));
  const topicById = {};
  ctx.topics.forEach(t => { topicById[t.id] = t; });
  const familyName = {};
  ctx.families.forEach(f => { familyName[f.id] = f.name; });
  const moduleFamilyName = {};
  ctx.moduleFamilyOrder.forEach(f => { moduleFamilyName[f.id] = f.name; });
  return { activeIds, packagesOf, featuresOf, topicById, familyName, moduleFamilyName };
}

// ---------------------------------------------------------------- pages

function atomPage(a, ctx, rel, text) {
  const ad = ADOPTION[a.adoption] || { label: a.adoption, blurb: '' };
  const seeAlso = (a.seeAlso || []).map(id => ctx.atoms.find(x => x.id === id)).filter(Boolean);
  const topic = a.molecule && rel.topicById[a.molecule];
  const lines = [
    '# ' + a.name + ' (' + a.symbol + ')',
    '',
    '> ' + text(a.oneLiner, 'atoms'),
    '',
    '- Family: ' + (rel.familyName[a.family] || a.family),
    '- Adoption: **' + ad.label + '**. ' + ad.blurb,
    '- Layer: ' + a.layer,
    '- Verified against platform ' + (a.verifiedAgainst || ctx.meta.platformVersion),
    '- On the map: `#/atom/' + a.id + '`',
    ...section('Pattern', [text(a.pattern, 'atoms')]),
    ...section('When to use', bullets(a.whenToUse, x => text(x, 'atoms'))),
    ...section('Avoid', bullets(a.avoid, x => text(x, 'atoms'))),
    ...(a.useInstead ? section('Use instead', [text(a.useInstead, 'atoms')]) : []),
    ...(a.note ? section('Note', [text(a.note, 'atoms')]) : []),
    ...section('API', bullets(a.api, x => '`' + x.name + '`' + (x.file ? ' · ' + apiFileLink(x.file) : ''))),
    ...(a.snippet ? section('Example', ['```' + (a.snippet.lang || ''), a.snippet.code, '```']) : []),
    ...section('Pitfalls', bullets(a.gotchas, x => text(x, 'atoms'))),
    ...section('Documentation', docList(a.docs, 2)),
    ...section('See also', seeAlso.map(x => '- [' + x.name + '](' + x.id + '.md): ' + text(x.oneLiner, 'atoms'))),
    ...(topic ? section('Topic', ['Part of **' + topic.name + '**: ' + text(topic.sub, 'atoms')]) : [])
  ];
  return page(lines);
}

function moduleLink(id, rel, ctx, fromDir) {
  const m = ctx.active.find(x => x.id === id);
  if (!m) return '`' + id + '`';
  const href = fromDir === 'modules' ? id + '.md' : (fromDir === 'agent' ? '' : '../') + 'modules/' + id + '.md';
  return '[' + m.name + '](' + href + ') (`' + id + '`)';
}

function moduleDeps(m, p) {
  const facts = (p && p.facts) || {};
  const required = (facts.dependsOn || []).filter(d => !d.optional);
  const optional = (facts.optionalDependencies || []).concat((facts.dependsOn || []).filter(d => d.optional));
  if (required.length || optional.length || !m.dependsOn) return { required, optional };
  return {
    required: (m.dependsOn || []).map(id => ({ id: /^VirtoCommerce\./.test(id) ? id : 'VirtoCommerce.' + id })),
    optional: (m.optional || []).map(id => ({ id: /^VirtoCommerce\./.test(id) ? id : 'VirtoCommerce.' + id }))
  };
}

function modulePage(m, ctx, rel, text) {
  const p = ctx.profiles[m.id] || {};
  const facts = p.facts || {};
  const notes = p.notes || {};
  const readme = p.readme || {};
  const deps = moduleDeps(m, p);
  const depLine = d => moduleLink(d.id, rel, ctx, 'modules') + (d.version ? ' ≥ ' + d.version : '');
  const pk = rel.packagesOf[m.id] || [];
  const feats = rel.featuresOf[m.id] || [];
  const list = (title, items, fmt) => (items && items.length ? section(title, bullets(items, fmt || (x => '`' + x + '`'))) : []);
  const lines = [
    '# ' + m.name + ' (`' + m.id + '`)',
    '',
    '> ' + (p.tagline || m.description || ''),
    '',
    '- Latest version: ' + m.version + ' (needs platform ' + (m.platformVersion || facts.platformVersion || '?') + ')',
    '- Repository: ' + (m.repoUrl || (m.repo ? GITHUB_ORG + m.repo : '')),
    '- Area: ' + (rel.moduleFamilyName[ctx.moduleFamilyOf[m.id]] || ctx.moduleFamilyOf[m.id] || 'other'),
    '- On the map: `#/molecule/' + m.moleculeId + '`',
    ...(notes.forAnalyst ? section('For business analysts', [text(notes.forAnalyst, 'modules')]) : []),
    ...(notes.forArchitect ? section('For architects', [text(notes.forArchitect, 'modules')]) : []),
    ...(notes.forDeveloper ? section('For developers', [text(notes.forDeveloper, 'modules')]) : []),
    ...section('Use it when', bullets(notes.reachForItWhen, x => text(x, 'modules'))),
    ...section('Do not use it when', bullets(notes.doNotReachForItWhen, x => text(x, 'modules'))),
    ...section('Required modules', deps.required.map(d => '- ' + depLine(d))),
    ...section('Optional modules', deps.optional.map(d => '- ' + depLine(d))),
    ...list('Cannot be installed with', m.incompatibleWith, x => moduleLink(/^VirtoCommerce\./.test(x) ? x : 'VirtoCommerce.' + x, rel, ctx, 'modules')),
    ...list('Owns these entities', notes.owns && notes.owns.length ? notes.owns : facts.entities),
    ...list('Events it publishes', facts.domainEventsPublished),
    ...list('Events it handles', facts.handledEvents),
    ...list('REST controllers', facts.restControllers, c => '`' + c.route + '` · ' + c.actions + ' actions · ' + apiFileLink('(' + m.repo + '/' + c.file + ')')),
    ...list('GraphQL builders', facts.graphqlBuilders, f => apiFileLink('(' + m.repo + '/' + f + ')')),
    ...list('Search index builders', facts.indexDocumentBuilders, f => apiFileLink('(' + m.repo + '/' + f + ')')),
    ...list('Permissions', facts.permissions),
    ...list('Settings', facts.settings),
    ...(facts.databaseProviders && facts.databaseProviders.length
      ? section('Database', ['Providers: ' + facts.databaseProviders.join(', ') + '. Migrations: ' + (facts.migrationCount || 0) + '.']) : []),
    ...section('Packages that include it', pk.map(x => '- [' + x.name + '](../packages/' + x.id + '.md)')),
    ...section('Business features it serves', feats.map(f => '- **' + f.name + '** (' + f.category + '): ' + f.blurb)),
    ...section('Key features', bullets(readme.keyFeatures, x => rebaseLinks(x, m.repo))),
    ...section('Documentation', docList(readme.docs, 2, m.repo))
  ];
  return page(lines);
}

function packagePage(p, ctx, rel, text) {
  const feats = ctx.features.filter(f => packagesForFeature(f, [p]).length);
  const layers = p.layers || {};
  const layerLines = Object.keys(layers).filter(k => (layers[k] || []).length)
    .map(k => '- **' + k + '**: ' + layers[k].map(id => moduleLink(id, rel, ctx, 'packages')).join(', '));
  const lines = [
    '# ' + p.name + ' (package)',
    '',
    '> ' + text(p.sub, 'packages'),
    '',
    '- Audience: ' + (p.audience || ''),
    '- Modules: ' + (p.modules || []).length + ', for platform ' + (p.platformVersion || ''),
    p.manifestUrl ? '- Manifest: ' + p.manifestUrl : '',
    '- On the map: `#/cell/' + p.id + '`',
    ...section('Overview', [text(p.overview, 'packages')]),
    ...section('Business outcomes', bullets(p.businessOutcomes, x => text(x, 'packages'))),
    ...section('Business features included', feats.map(f => '- **' + f.name + '** (' + f.category + '): ' + f.blurb)),
    ...section('Modules by layer', layerLines),
    ...section('All modules', (p.modules || []).map(id => '- ' + moduleLink(id, rel, ctx, 'packages')))
  ];
  return page(lines);
}

function layerPage(l, ctx, rel, text) {
  const matrix = (l.matrix || []).map(r => '- **' + r.name + '**: ' + text(r.desc, 'layers'));
  const lines = [
    '# ' + l.name + ' (architecture layer)',
    '',
    '> ' + text(l.sub, 'layers'),
    '',
    '- Tags: ' + (l.tags || []).map(t => '`' + t + '`').join(', '),
    '- On the map: `#/layer/' + l.id + '`',
    ...section('What to know', bullets(l.bullets, x => text(x, 'layers'))),
    ...(matrix.length ? section(l.matrixTitle || 'Options', matrix) : []),
    ...section('Pitfalls', bullets(l.gotchas, x => text(x, 'layers'))),
    ...section('Documentation', docList(l.docs, 2))
  ];
  return page(lines);
}

function featuresPage(ctx, rel) {
  const byCat = {};
  const order = [];
  ctx.features.forEach(f => { if (!byCat[f.category]) { byCat[f.category] = []; order.push(f.category); } byCat[f.category].push(f); });
  const lines = ['# Business features', '',
    '> What the business asks for, mapped to the modules that deliver it and the published packages that include all of them. ' +
    'A slot written as "A or B" can be filled by either module.', ''];
  order.forEach(cat => {
    lines.push('', '## ' + cat, '');
    byCat[cat].forEach(f => {
      const slots = featureSlots(f).map(slot => slot.map(id => moduleLink(id, rel, ctx, 'agent')).join(' or '));
      const pk = packagesForFeature(f, ctx.packages).map(p => '[' + p.name + '](packages/' + p.id + '.md)');
      lines.push('- **' + f.name + '**: ' + f.blurb, '  - Modules: ' + slots.join('; '),
        '  - Packages: ' + (pk.length ? pk.join(', ') : 'none yet; build a custom package'));
    });
  });
  return page(lines);
}

/* The rules page: what an agent has to respect before it writes code for a Virto Commerce module.
   Cross-cutting rules come from the layers' pitfalls; per-pattern rules come from each atom's
   "avoid" list; the do-not-build-on list comes from the legacy and in-flight atoms. */
function rulesPage(ctx, rel, text) {
  const link = a => '[' + a.name + '](atoms/' + a.id + '.md)';
  /* Legacy atoms and those with a "use instead" are off limits for new code. In-flight atoms are the
     opposite: the current direction, still moving, so they get their own list with the note to read. */
  const notNew = ctx.atoms.filter(a => a.adoption === 'legacy' || (a.useInstead && a.adoption !== 'in-flight'));
  const moving = ctx.atoms.filter(a => a.adoption === 'in-flight');
  const lines = [
    '# Rules for building on Virto Commerce',
    '',
    '> For AI coding agents and the people reviewing their work. Platform ' + ctx.meta.platformVersion +
      ', map updated ' + ctx.meta.updated + '. Every rule links to the page that explains why.',
    '',
    'Reference this file from your `CLAUDE.md` or `AGENTS.md`, or copy the first two sections into it. ' +
      'Before writing code that uses a platform pattern, read that pattern\'s atom page.',
    '',
    '## Before you write code',
    '',
    '- Never edit the source of a Virto module or the platform. Extend from your own module; otherwise every upgrade becomes a merge.',
    '- Extend in this order and stop at the first level that works: no-code (dynamic properties, settings, permissions), then API (REST or GraphQL, webhooks, event handlers), then native (`AbstractTypeFactory` override).',
    '- A custom module has the same three projects as a Virto one: `Core`, `Data`, `Web`.',
    '- `vc-package.json` pins the Virto modules and versions the solution uses. Commit it.',
    '- Read the atom page for the pattern you are about to use. It lists when to use it, what to avoid and the API to call.',
    '',
    '## Solution and module structure',
    '',
    ...['solution', 'modules'].flatMap(id => {
      const l = ctx.layers.find(x => x.id === id);
      return l ? (l.gotchas || []).map(g => '- ' + text(g, 'agent') + ' ([' + l.name + '](layers/' + l.id + '.md))') : [];
    }),
    ...section('For new code, use the alternative', notNew.map(a => '- ' + link(a) + ' (' + (ADOPTION[a.adoption] || {}).label + '). ' +
      (a.useInstead ? 'Use instead: ' + text(a.useInstead, 'agent') : text(a.oneLiner, 'agent')))),
    ...section('Changing right now: read the atom page before using', moving.map(a => '- ' + link(a) + '. ' + text(a.oneLiner, 'agent'))),
    '',
    '## What to avoid, pattern by pattern',
    ''
  ];
  ctx.families.forEach(f => {
    const atoms = ctx.atoms.filter(a => a.family === f.id && (a.avoid || []).length);
    if (!atoms.length) return;
    lines.push('', '### ' + f.name, '');
    atoms.forEach(a => {
      lines.push('- ' + link(a) + ':');
      a.avoid.forEach(x => lines.push('  - ' + text(x, 'agent')));
    });
  });
  lines.push('', '## Pitfalls by layer', '');
  ctx.layers.filter(l => l.id !== 'solution' && l.id !== 'modules').forEach(l => {
    if (!(l.gotchas || []).length) return;
    lines.push('', '### [' + l.name + '](layers/' + l.id + '.md)', '');
    l.gotchas.forEach(g => lines.push('- ' + text(g, 'agent')));
  });
  return page(lines);
}

function llmsTxt(ctx, rel, text) {
  const lines = [
    '# Virto Commerce Atomic Architecture Map',
    '',
    '> How a Virto Commerce solution is built, for platform ' + ctx.meta.platformVersion + ': ' + ctx.atoms.length +
      ' atoms (platform patterns), ' + ctx.active.length + ' modules, ' + ctx.packages.length + ' packages (PBCs) and ' +
      ctx.features.length + ' business features. Generated from the interactive map\'s data, updated ' + ctx.meta.updated + '.',
    '',
    'Atoms are the patterns modules are built from. Modules (molecules) each do one business job and are what gets installed. ' +
      'Packages (cells) are sets of modules for one business scenario. Read the rules first, then the atom page for the pattern you need.',
    '',
    '## Start here',
    '',
    '- [Rules for building on Virto Commerce](' + OUT_DIR + '/RULES.md): what to do and avoid in a custom module, with links to the reasons',
    '- [Business features](' + OUT_DIR + '/features.md): business needs mapped to modules and packages',
    '- [Full data as JSON](atomic-map.json): every atom, module, package, feature and layer in one file',
    '',
    '## Architecture layers',
    '',
    ...ctx.layers.map(l => '- [' + l.name + '](' + OUT_DIR + '/layers/' + l.id + '.md): ' + text(l.sub, 'root')),
    '',
    '## Atoms'
  ];
  ctx.families.forEach(f => {
    const atoms = ctx.atoms.filter(a => a.family === f.id);
    if (!atoms.length) return;
    lines.push('', '### ' + f.name, '');
    atoms.forEach(a => lines.push('- [' + a.name + '](' + OUT_DIR + '/atoms/' + a.id + '.md): ' + text(a.oneLiner, 'root') +
      ' (' + (ADOPTION[a.adoption] || {}).label + ')'));
  });
  lines.push('', '## Modules');
  const groups = ctx.moduleFamilyOrder.map(g => ({ name: g.name, members: ctx.active.filter(m => ctx.moduleFamilyOf[m.id] === g.id) }));
  const unfiled = ctx.active.filter(m => !ctx.moduleFamilyOf[m.id]);
  if (unfiled.length) groups.push({ name: 'Other', members: unfiled });
  groups.filter(g => g.members.length).forEach(g => {
    lines.push('', '### ' + g.name, '');
    g.members.slice().sort((a, b) => a.name.localeCompare(b.name))
      .forEach(m => lines.push('- [' + m.name + '](' + OUT_DIR + '/modules/' + m.id + '.md): ' + ((ctx.profiles[m.id] || {}).tagline || m.description || '')));
  });
  lines.push('', '## Packages', '');
  ctx.packages.forEach(p => lines.push('- [' + p.name + '](' + OUT_DIR + '/packages/' + p.id + '.md): ' + text(p.sub, 'root')));
  return page(lines);
}

function jsonExport(ctx, rel) {
  const strip = l => { const o = Object.assign({}, l); delete o.diagrams; delete o.hue; return o; };
  return JSON.stringify({
    platformVersion: ctx.meta.platformVersion,
    updated: ctx.meta.updated,
    levels: {
      atoms: 'Platform patterns and principles. Not installed on their own.',
      molecules: 'Modules: one business job each. What gets installed.',
      cells: 'Packages (PBCs): modules that together cover one business scenario.',
      organism: 'Your solution: packages plus your own modules.'
    },
    adoption: ADOPTION,
    layers: ctx.layers.map(strip),
    families: ctx.families.map(f => ({ id: f.id, name: f.name })),
    atoms: ctx.atoms,
    topics: ctx.topics,
    modules: ctx.active.map(m => {
      const p = ctx.profiles[m.id] || {};
      return Object.assign({}, m, {
        area: ctx.moduleFamilyOf[m.id] || null,
        tagline: p.tagline || null,
        notes: p.notes || null,
        facts: p.facts ? Object.assign({}, p.facts, { git: undefined }) : null,
        keyFeatures: (p.readme || {}).keyFeatures || [],
        docs: (p.readme || {}).docs || [],
        packages: (rel.packagesOf[m.id] || []).map(x => x.id),
        features: (rel.featuresOf[m.id] || []).map(f => f.id)
      });
    }),
    packages: ctx.packages.map(p => Object.assign({}, p, {
      features: ctx.features.filter(f => packagesForFeature(f, [p]).length).map(f => f.id)
    })),
    features: ctx.features.map(f => Object.assign({}, f, { packages: packagesForFeature(f, ctx.packages).map(p => p.id) }))
  }, null, 1) + '\n';
}

/* Returns { relativePath: content } for the whole export. */
function build() {
  const ctx = loadContent();
  const rel = relations(ctx);
  const text = makeText(ctx);
  const files = {};
  files['llms.txt'] = llmsTxt(ctx, rel, text);
  files['atomic-map.json'] = jsonExport(ctx, rel);
  files[OUT_DIR + '/RULES.md'] = rulesPage(ctx, rel, text);
  files[OUT_DIR + '/features.md'] = featuresPage(ctx, rel);
  ctx.atoms.forEach(a => { files[OUT_DIR + '/atoms/' + a.id + '.md'] = atomPage(a, ctx, rel, text); });
  ctx.active.forEach(m => { files[OUT_DIR + '/modules/' + m.id + '.md'] = modulePage(m, ctx, rel, text); });
  ctx.packages.forEach(p => { files[OUT_DIR + '/packages/' + p.id + '.md'] = packagePage(p, ctx, rel, text); });
  ctx.layers.forEach(l => { files[OUT_DIR + '/layers/' + l.id + '.md'] = layerPage(l, ctx, rel, text); });
  return files;
}

function listExisting(dir) {
  const out = [];
  const walk = d => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) walk(full); else out.push(path.relative(MAP, full).split(path.sep).join('/'));
    }
  };
  walk(path.join(MAP, dir));
  return out;
}

/* Compares the export on disk with a fresh build. Line endings are ignored, since git may
   check the files out with CRLF on Windows. */
function diff() {
  const files = build();
  const problems = [];
  for (const f of Object.keys(files)) {
    const full = path.join(MAP, f);
    if (!fs.existsSync(full)) { problems.push('missing ' + f); continue; }
    if (fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n') !== files[f]) problems.push('out of date ' + f);
  }
  for (const f of listExisting(OUT_DIR)) if (!files[f]) problems.push('no longer generated ' + f);
  return { files, problems };
}

module.exports = { build, diff };

if (require.main === module) {
  if (process.argv.includes('--check')) {
    const { problems } = diff();
    problems.forEach(p => console.log('  - ' + p));
    console.log(problems.length ? 'agent export is out of date — run node tools/build-agent-docs.js' : 'agent export is up to date');
    process.exit(problems.length ? 1 : 0);
  }
  const files = build();
  for (const f of listExisting(OUT_DIR)) if (!files[f]) fs.unlinkSync(path.join(MAP, f));
  for (const [f, content] of Object.entries(files)) {
    const full = path.join(MAP, f);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  const count = k => Object.keys(files).filter(f => f.startsWith(OUT_DIR + '/' + k + '/')).length;
  console.log('agent export: llms.txt, atomic-map.json, ' + OUT_DIR + '/RULES.md, ' + OUT_DIR + '/features.md, ' +
    count('atoms') + ' atoms, ' + count('modules') + ' modules, ' + count('packages') + ' packages, ' + count('layers') + ' layers');
}
