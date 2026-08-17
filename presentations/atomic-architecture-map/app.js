/* Virto Commerce — Atomic Architecture Map · renderer
 *
 * Deliberately dependency-free and content-agnostic: everything it draws comes from
 * content/*.js. Adding or correcting an atom never means touching this file.
 *
 * DOM is built with the el() helper rather than innerHTML — C# snippets are full of
 * generics like IBackgroundJobHandler<TPayload>, and string interpolation into innerHTML
 * would either mangle them or open an injection hole.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- content

  var META = window.VC_MAP_META || {};
  var LAYERS = window.VC_MAP_ARCHITECTURE || [];
  var FAMILIES = window.VC_MAP_FAMILIES || [];
  var ATOMS = window.VC_MAP_ATOMS || [];
  /* Cells are the published PBCs (tools/build-cells.js reads vc-modules/pbc/*.json). The authored
     cells that used to live here are gone: a package manifest is a better source than a description
     of one. CUSTOM_PBC is the seventh tile — a builder rather than a published capability. */
  var CELLS = window.VC_MAP_PBC || [];
  var CUSTOM_PBC = { id: 'custom', name: 'Build custom PBC', audience: 'Your idea',
    sub: 'Pick capabilities and see the package this becomes \u2014 the readme\u2019s \u201cyour idea here\u201d, made clickable.' };
  /* Molecules = every active Virto Commerce module, plus the composite topics that are written
     across several of them. The module half is a projection of the registry (see
     tools/build-active-modules.js) rather than a hand-kept list, so "what ships today" cannot go
     stale here; the topic half stays authored. Both are normalised to one shape so every code path
     downstream — rendering, filtering, deep links, the drawer — sees a single kind of thing. */
  var MODULE_TILES = (window.VC_ACTIVE_MODULES || []).map(function (m) {
    return {
      id: m.moleculeId, slug: m.slug, kind: 'module', name: m.name, moduleId: m.id, version: m.version,
      sub: m.description || '', group: (m.groups && m.groups[0]) || 'extension',
      dependsOn: m.dependsOn, optional: m.optional, incompatibleWith: m.incompatibleWith,
      platformVersion: m.platformVersion, tags: m.tags, registryTitle: m.registryTitle,
      repo: m.repoUrl || (m.repo ? 'https://github.com/VirtoCommerce/' + m.repo : null)
    };
  });
  var TOPIC_TILES = (window.VC_MAP_MOLECULES || []).filter(function (m) { return m.kind !== 'module'; });
  var MOLECULES = MODULE_TILES.concat(TOPIC_TILES);

  /* ---------- business features ----------
     The layer between "what the business asked for" and "which modules ship it". Authored in
     content/features.js; everything below is derived from it, so a package's capability list is a
     computation over its module set rather than a second thing to keep true. */
  var FEATURES = window.VC_MAP_FEATURES || [];
  var FEATURE_CATEGORIES = (function () {
    var seen = {}, order = [];
    FEATURES.forEach(function (f) { if (!seen[f.category]) { seen[f.category] = 1; order.push(f.category); } });
    return order;
  })();

  /* Each entry in `modules` is one slot. A plain string is a slot of one; an array is a slot any of
     whose members satisfies it — interchangeable search engines, gateways, identity providers. */
  function featureSlots(f) {
    return (f.modules || []).map(function (slot) { return Array.isArray(slot) ? slot : [slot]; });
  }

  function featureModules(f) {
    return featureSlots(f).reduce(function (all, slot) { return all.concat(slot); }, []);
  }

  /* Against a set of installed modules: is the feature there, half there, or absent — and if it is
     not there, what is the shortest way to get it. `missing` holds one preferred module per empty
     slot (the first alternative, which is the commonly deployed one). */
  function featureState(f, has) {
    var slots = featureSlots(f), met = 0, missing = [];
    slots.forEach(function (slot) {
      var found = null;
      for (var i = 0; i < slot.length; i++) if (has[slot[i]]) { found = slot[i]; break; }
      if (found) met++; else missing.push(slot[0]);
    });
    return {
      met: met, total: slots.length, missing: missing,
      status: met === slots.length ? 'in' : (met ? 'part' : 'out')
    };
  }

  function moduleSet(ids) {
    var has = {};
    (ids || []).forEach(function (id) { has[id] = true; });
    return has;
  }

  /* Group a feature list into its categories, in the order content/features.js declares them, so the
     reading order is authored rather than alphabetical by accident. */
  function groupFeatures(list) {
    var by = {};
    list.forEach(function (f) { (by[f.category] = by[f.category] || []).push(f); });
    return FEATURE_CATEGORIES.filter(function (c) { return by[c]; })
      .map(function (c) { return { category: c, features: by[c] }; });
  }

  function featureById(id) {
    for (var i = 0; i < FEATURES.length; i++) if (FEATURES[i].id === id) return FEATURES[i];
    return null;
  }

  var ADOPTION = {
    'platform':  { glyph: '●', label: 'Platform',  cls: 'adopt-platform',  blurb: 'Platform-native. This is the Virto way.' },
    'module':    { glyph: '◐', label: 'Module',    cls: 'adopt-module',    blurb: 'Ships outside platform core — install the module or tool.' },
    'available': { glyph: '○', label: 'Available', cls: 'adopt-available', blurb: '.NET offers it; this platform does not use it.' },
    'in-flight': { glyph: '△', label: 'In flight', cls: 'adopt-inflight',  blurb: 'Changing right now — read the migration note.' },
    'legacy':    { glyph: '✕', label: 'Legacy',    cls: 'adopt-legacy',    blurb: 'Still works; do not build new code on it.' }
  };
  var ADOPTION_ORDER = ['platform', 'module', 'in-flight', 'legacy', 'available'];

  var REQUIRED = ['id', 'symbol', 'name', 'family', 'adoption', 'layer', 'oneLiner', 'pattern', 'whenToUse', 'api'];

  /* Documentation lives on the public docs site, which is built from the vc-docs repo
     (github.com/VirtoCommerce/vc-docs). Content stores the page path only —
     `Fundamentals/Caching/01-overview` — and the URL is derived here, so the base and the
     version segment are defined in exactly one place. */
  var DOCS_BASE = 'https://docs.virtocommerce.org/platform/developer-guide/latest/';

  function docHref(doc) {
    if (doc.href) return doc.href;                       // fully external (GitHub, ucp.dev)
    if (doc.page) return DOCS_BASE + doc.page + '/';     // vc-docs page
    if (doc.path) return '../' + doc.path;               // in-repo file, e.g. a design spec
    return null;
  }

  /* Default branch per repository — dev for the platform and its modules, but not for everything,
     and a wrong branch is a 404 rather than a redirect. */
  var GITHUB_ORG = 'https://github.com/VirtoCommerce/';
  var DEFAULT_BRANCH = { 'vc-cli-module-template': 'main', 'vc-modules': 'master' };

  function branchOf(repo) { return DEFAULT_BRANCH[repo] || 'dev'; }

  /* GitHub serves a file under /blob and a directory under /tree, and swapping them 404s. The last
     path segment having an extension is the available signal. */
  function githubUrl(repo, filePath) {
    var last = filePath.split('/').pop();
    var kind = last.indexOf('.') > 0 ? 'blob' : 'tree';
    return GITHUB_ORG + repo + '/' + kind + '/' + branchOf(repo) + '/' + filePath;
  }

  /* An api[].file is one of three things:
       a repo-relative path in vc-platform          → link it
       `(vc-some-repo/path/to/File.cs)`             → link it, in that repository
       any other `(parenthesised annotation)`       → prose, and deliberately not a path */
  function apiFile(file) {
    if (!file) return null;
    var text = String(file).trim();
    if (text.charAt(0) !== '(') {
      return el('a', { class: 'api-file is-link', href: githubUrl('vc-platform', text),
        target: '_blank', rel: 'noopener',
        title: 'Open on GitHub (vc-platform@' + branchOf('vc-platform') + ')', text: text });
    }
    var inner = text.slice(1, -1);
    var m = /^(vc-[a-z0-9.-]+)\/(\S+)$/.exec(inner);
    if (m) {
      return el('a', { class: 'api-file is-link', href: githubUrl(m[1], m[2]),
        target: '_blank', rel: 'noopener',
        title: 'Open on GitHub (' + m[1] + '@' + branchOf(m[1]) + ')', text: inner });
    }
    return el('span', { class: 'api-file', text: text });
  }

  function docLinks(docs) {
    var usable = (docs || []).filter(function (doc) { return docHref(doc); });
    if (!usable.length) return null;
    return el('div', { class: 'd-links' }, usable.map(function (doc) {
      var href = docHref(doc);
      return el('a', {
        href: href,
        text: doc.label,
        // Off-site links open in a new tab so the map is not navigated away from.
        target: /^https?:/.test(href) ? '_blank' : null,
        rel: /^https?:/.test(href) ? 'noopener' : null
      });
    }));
  }

  // ---------------------------------------------------------------- helpers

  function el(tag, props) {
    var node = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (key) {
        var value = props[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'dataset') Object.keys(value).forEach(function (d) { node.dataset[d] = value[d]; });
        else if (key.slice(0, 2) === 'on') node.addEventListener(key.slice(2).toLowerCase(), value);
        else node.setAttribute(key, value === true ? '' : value);
      });
    }
    for (var i = 2; i < arguments.length; i++) append(node, arguments[i]);
    return node;
  }

  function append(node, child) {
    if (child === null || child === undefined || child === false) return;
    if (Array.isArray(child)) { child.forEach(function (c) { append(node, c); }); return; }
    node.appendChild(child.nodeType ? child : document.createTextNode(String(child)));
  }

  /** Renders `backticked` spans as <code> and **double-starred** spans as <strong>.
   *  No HTML is ever parsed — every case builds elements and sets text via textContent.
   *
   *  Bold is the OUTER split so that **`Something`** works. Splitting backticks first
   *  separates the two ** markers into different segments, which breaks the pairing and
   *  silently bolds everything up to the next marker instead of the intended phrase.
   *  Caveat: an odd number of ** in one string bolds the tail — pair your markers. */
  /* `[[atom-id]]` in any prose becomes a link to that atom. Written as an anchor rather than a
     button because rich() output lands inside <div>s and <li>s — never inside a <button>, where a
     nested interactive element would be invalid. The hash router already handles the href. */
  function crossRef(id) {
    var atom = byId(ATOMS, id);
    return el('a', { class: 'x-ref', href: '#/atom/' + id,
      title: atom ? atom.oneLiner : 'Unknown atom: ' + id,
      text: atom ? atom.name : id });
  }

  function rich(text) {
    var frag = document.createDocumentFragment();
    String(text).split('**').forEach(function (part, i) {
      if (part === '') return;
      var bold = i % 2 === 1;
      var host = bold ? el('strong', {}) : frag;
      part.split('`').forEach(function (chunk, j) {
        if (chunk === '') return;
        if (j % 2) { host.appendChild(el('code', { text: chunk })); return; }
        // Outside code spans, split the plain text on [[atom-id]] and link every other piece.
        chunk.split(/\[\[([a-z0-9-]+)\]\]/).forEach(function (piece, k) {
          if (piece === '') return;
          host.appendChild(k % 2 ? crossRef(piece) : document.createTextNode(piece));
        });
      });
      if (bold) frag.appendChild(host);
    });
    return frag;
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function hueOf(familyId) {
    var family = byId(FAMILIES, familyId);
    return family ? family.hue : 220;
  }

  function adoptionOf(id) {
    return ADOPTION[id] || { glyph: '⚠', label: 'Unknown', cls: 'adopt-schema', blurb: 'Unrecognised adoption state.' };
  }

  // ---------------------------------------------------------------- schema check

  /* Content that is missing required fields must fail loudly. A silently blank tile in a
     reference map is worse than no tile: it teaches the reader something false by omission. */
  function schemaProblems(atom) {
    var missing = REQUIRED.filter(function (field) {
      var value = atom[field];
      return value === undefined || value === null || value === '' ||
             (Array.isArray(value) && value.length === 0);
    });
    if (!ADOPTION[atom.adoption]) missing.push('adoption (unknown value "' + atom.adoption + '")');
    if (atom.family && !byId(FAMILIES, atom.family)) missing.push('family (unknown "' + atom.family + '")');
    if (atom.layer && LAYERS.length && !byId(LAYERS, atom.layer)) missing.push('layer (unknown "' + atom.layer + '")');
    (atom.seeAlso || []).forEach(function (ref) {
      if (!byId(ATOMS, ref)) missing.push('seeAlso → "' + ref + '" does not exist');
    });
    return missing;
  }

  ATOMS.forEach(function (atom) { atom._problems = schemaProblems(atom); });

  // ---------------------------------------------------------------- search index

  ATOMS.forEach(function (atom) {
    atom._haystack = [
      atom.id, atom.symbol, atom.name, atom.oneLiner, atom.pattern,
      (atom.tags || []).join(' '),
      (atom.api || []).map(function (a) { return a.name + ' ' + (a.file || ''); }).join(' '),
      (atom.whenToUse || []).join(' '),
      (atom.avoid || []).join(' '),
      (atom.gotchas || []).join(' '),
      atom.useInstead || '', atom.note || ''
    ].join(' ').toLowerCase();
  });

  // ---------------------------------------------------------------- state

  var state = { query: '', adoptions: {}, spotlight: null, open: null };
  var nodes = { atoms: {}, layers: {}, cells: {}, molecules: {} };
  var lastTrigger = null;

  function queryTokens() {
    return state.query.toLowerCase().split(/\s+/).filter(Boolean);
  }

  function anyAdoptionFilter() {
    return Object.keys(state.adoptions).some(function (k) { return state.adoptions[k]; });
  }

  function atomMatches(atom) {
    var tokens = queryTokens();
    for (var i = 0; i < tokens.length; i++) {
      if (atom._haystack.indexOf(tokens[i]) === -1) return false;
    }
    if (anyAdoptionFilter() && !state.adoptions[atom.adoption]) return false;
    if (state.spotlight && atom.layer !== state.spotlight) return false;
    return true;
  }

  // ---------------------------------------------------------------- topbar / legend

  function renderBrand() {
    var sub = document.getElementById('brand-sub');
    sub.textContent = 'verified against platform ' + (META.platformVersion || '?') +
      (META.updated ? ' · updated ' + META.updated : '');

    /* The counts the footer used to print live in the section headings and the legend now. What the
       footer alone carried is the schema alarm, and that has to stay loud, so it moves next to the
       version line where it cannot be missed. */
    var problems = ATOMS.filter(function (a) { return a._problems.length; });
    if (problems.length) {
      append(document.getElementById('brand-sub'), el('span', { class: 'adopt-schema' },
        '  ⚠ ' + problems.length + ' atom(s) fail the content schema'));
    }
  }

  /* The footer answers the question a reference map has to answer about itself: which of this is read
     from somewhere, which of it is somebody's judgement, and where to check. Counts stay in the
     section headings where they belong — a footer repeating them told the reader nothing. */
  function renderFooter() {
    var host = document.getElementById('pagefoot');
    if (!host) return;
    host.textContent = '';

    var written = MODULE_PROFILES.filter(function (p) { return p.notes; }).length;

    append(host, [
      el('div', { class: 'pagefoot-main' },
        el('p', { class: 'pagefoot-line' }, rich(
          '**Generated, not maintained by hand:** the ' + MODULE_TILES.length + ' module tiles come from ' +
          '`vc-modules/modules_v3.json`, the ' + CELLS.length + ' PBCs from the package manifests in ' +
          '`vc-modules/pbc`, and each module page from a checkout read at `origin/dev`.')),
        el('p', { class: 'pagefoot-line' }, rich(
          '**Authored, and checked:** ' + ATOMS.length + ' atom pages, ' + written + ' module notes and ' +
          FEATURES.length + ' business features are written by hand — `check-content.js` fails on a source ' +
          'path, doc page, module id or version that no longer exists, so what is stale is loud rather than quiet.'))),

      el('nav', { class: 'pagefoot-links', 'aria-label': 'Sources' }, [
        { label: 'Module registry', href: 'https://github.com/VirtoCommerce/vc-modules/blob/master/modules_v3.json' },
        { label: 'PBC packages', href: 'https://github.com/VirtoCommerce/vc-modules/tree/master/pbc' },
        { label: 'Platform docs', href: 'https://docs.virtocommerce.org/platform/developer-guide/' },
        { label: 'vc-platform', href: 'https://github.com/VirtoCommerce/vc-platform' }
      ].map(function (link) {
        return el('a', { class: 'pagefoot-link', href: link.href, target: '_blank',
                         rel: 'noopener noreferrer', text: link.label });
      }).concat([
        el('span', { class: 'pagefoot-hint', text: 'Ctrl / Cmd + P prints it — one A3 page' })
      ]))
    ]);
  }

  function renderFilters() {
    var host = document.getElementById('filters');
    host.textContent = '';
    var counts = {};
    ATOMS.forEach(function (a) { counts[a.adoption] = (counts[a.adoption] || 0) + 1; });

    ADOPTION_ORDER.forEach(function (key) {
      if (!counts[key]) return;
      var meta = adoptionOf(key);
      var chip = el('button', {
        type: 'button', class: 'chip', 'aria-pressed': 'false',
        title: meta.blurb,
        onclick: function () {
          state.adoptions[key] = !state.adoptions[key];
          chip.setAttribute('aria-pressed', state.adoptions[key] ? 'true' : 'false');
          applyFilter();
        }
      },
        el('span', { class: 'glyph ' + meta.cls, text: meta.glyph, 'aria-hidden': 'true' }),
        meta.label,
        el('span', { class: 'chip-n', text: counts[key] }));
      host.appendChild(chip);
    });
  }

  function renderLegend() {
    var host = document.getElementById('legend');
    host.textContent = '';

    var adoptionList = el('ul', { class: 'legend-list' }, ADOPTION_ORDER.map(function (key) {
      var meta = adoptionOf(key);
      return el('li', {},
        el('span', { class: 'glyph ' + meta.cls, text: meta.glyph, 'aria-hidden': 'true' }),
        el('b', { text: meta.label }),
        el('span', { text: '— ' + meta.blurb }));
    }));

    var familyList = el('ul', { class: 'legend-list' }, FAMILIES.map(function (family) {
      var n = ATOMS.filter(function (a) { return a.family === family.id; }).length;
      return el('li', {},
        el('span', { class: 'legend-swatch', style: '--h:' + family.hue, 'aria-hidden': 'true' }),
        el('b', { text: family.name }),
        el('span', { text: '— ' + n + ' atoms' }));
    }));

    /* Module families read their colour from the icon set rather than from a hue token, so the
       legend swatch is filled with the exact accent the icons and the tile borders use. */
    var moduleFamilyList = el('ul', { class: 'legend-list' }, (window.VC_MODULE_FAMILY_ORDER || []).map(function (g) {
      return el('li', {},
        el('span', { class: 'legend-swatch is-flat', style: '--flat:' + (g.hex || 'var(--border-strong)'), 'aria-hidden': 'true' }),
        el('b', { text: g.name }),
        el('span', { text: '— ' + g.count + (g.count === 1 ? ' module' : ' modules') }));
    }));

    append(host, el('div', { class: 'legend-cols' },
      el('div', {}, el('h3', { text: 'Adoption state — read this first' }), adoptionList),
      el('div', {}, el('h3', { text: 'Atom families' }), familyList),
      el('div', {}, el('h3', { text: 'Module families — the colour is the module’s own icon' }), moduleFamilyList)));

    append(host, el('div', { class: 'legend-keys' },
      el('span', {}, el('kbd', { text: '/' }), ' search'),
      el('span', {}, el('kbd', { text: '←→↑↓' }), ' move between tiles'),
      el('span', {}, el('kbd', { text: 'Enter' }), ' open'),
      el('span', {}, el('kbd', { text: 'Esc' }), ' close / clear'),
      el('span', {}, el('kbd', { text: 'f' }), ' full-screen panel'),
      el('span', {}, el('kbd', { text: '?' }), ' this legend'),
      el('span', {}, 'Deep-link any tile: the address bar tracks what you opened.')));
  }

  // ---------------------------------------------------------------- architecture band

  function renderArchitecture() {
    var host = document.getElementById('arch');
    host.textContent = '';

    LAYERS.forEach(function (layer) {
      var node = el('button', {
        type: 'button', class: 'layer', style: '--h:' + (layer.hue || 220),
        'aria-label': layer.name + ' layer — ' + layer.sub,
        dataset: { id: layer.id },
        onclick: function () { openHash('layer', layer.id, node); },
        onmouseenter: function () { setSpotlight(layer.id); },
        onmouseleave: function () { setSpotlight(null); },
        onfocus: function () { setSpotlight(layer.id); },
        onblur: function () { setSpotlight(null); }
      },
        el('span', { class: 'layer-name', text: layer.name }),
        el('span', { class: 'layer-sub' }, rich(layer.sub)),
        el('span', { class: 'layer-tags' }, (layer.tags || []).map(function (tag) {
          return el('span', { class: 'layer-tag', text: tag });
        })));
      nodes.layers[layer.id] = node;
      host.appendChild(node);
    });
  }

  function setSpotlight(layerId) {
    if (state.spotlight === layerId) return;
    state.spotlight = layerId;
    applyFilter();
  }

  // ---------------------------------------------------------------- atom grid

  function renderAtoms() {
    var host = document.getElementById('atoms');
    host.textContent = '';

    FAMILIES.forEach(function (family) {
      var members = ATOMS.filter(function (a) { return a.family === family.id; });
      if (!members.length) return;

      var tiles = el('div', { class: 'family-tiles' }, members.map(function (atom) {
        var meta = adoptionOf(atom.adoption);
        var broken = atom._problems.length > 0;
        var tile = el('button', {
          type: 'button',
          class: 'tile' + (atom.keystone ? ' is-keystone' : ''),
          style: '--h:' + family.hue,
          'aria-label': atom.name + ' — ' + (broken ? 'incomplete content' : meta.label) + '. ' + (atom.oneLiner || ''),
          title: atom.name + ' · ' + meta.label,
          dataset: { id: atom.id },
          onclick: function () { openHash('atom', atom.id, tile); }
        },
          el('span', { class: 'tile-badge ' + (broken ? 'adopt-schema' : meta.cls), 'aria-hidden': 'true',
                       text: broken ? '⚠' : meta.glyph }),
          el('span', { class: 'tile-symbol', text: atom.symbol || '??' }),
          el('span', { class: 'tile-name', text: atom.name }));
        nodes.atoms[atom.id] = tile;
        return tile;
      }));

      host.appendChild(el('div', { class: 'family', style: '--h:' + family.hue },
        el('div', { class: 'family-label' },
          el('span', { text: family.name }),
          el('span', { class: 'family-n', text: members.length })),
        tiles));
    });
  }

  // ---------------------------------------------------------------- cells
  /* The third rung of the ladder the Architectural Guidelines define: a cell is a set of
     modules that solves a business scenario. It matters here because it is the rung a solution
     can actually be deployed along — a module is not a service, a module set is a host. The
     `splittable` verdict is on the tile rather than inside it, so the answer to "where can we
     cut?" is legible without opening anything. */
  var SPLITTABLE = {
    'own host':     { label: 'own host', cls: 'is-yes',       title: 'Its required closure is small — it can run as its own deployment' },
    'with catalog': { label: 'with catalog', cls: 'is-part',  title: 'Its manifest requires XCatalog, so the catalog cell deploys with it' },
    'with cart':    { label: 'with cart', cls: 'is-part',     title: 'It requires XCart, and so XCatalog too — the three deploy together' },
    'no':           { label: 'not yet', cls: 'is-no',         title: 'Too entangled to separate today' }
  };

  function splitVerdict(id) {
    return SPLITTABLE[id] || { label: id || 'unknown', cls: 'is-no', title: 'Unrecognised verdict' };
  }

  function renderCells() {
    var host = document.getElementById('cells');
    host.textContent = '';

    CELLS.concat([CUSTOM_PBC]).forEach(function (cell) {
      var custom = cell.id === 'custom';
      var node = el('button', {
        type: 'button', class: 'cell' + (custom ? ' is-custom-pbc' : ''),
        'aria-label': cell.name + ' — packaged business capability. ' + (cell.sub || '') +
                      (custom ? '' : ' ' + cell.moduleCount + ' modules.'),
        dataset: { id: cell.id },
        onclick: function () { openHash('cell', cell.id, node); }
      },
        el('span', { class: 'cell-head' },
          el('span', { class: 'cell-name', text: cell.name }),
          el('span', { class: 'cell-count', text: custom ? '+' : String(cell.moduleCount) })),
        el('span', { class: 'cell-audience', text: cell.audience || '' }),
        /* A strip of the actual icons: the tile shows what is inside without spelling it out, and the
           colours are the same ones the Molecules tier uses. */
        custom ? el('span', { class: 'cell-sub', text: 'compose your own' })
               : el('span', { class: 'cell-icons' }, (cell.modules || []).slice(0, 9).map(function (id) {
                   return MODULE_ACCENTS[id]
                     ? el('img', { class: 'cell-icon', src: 'assets/module-icons/' + id + '.svg',
                                   width: 16, height: 16, alt: '', loading: 'lazy', title: id })
                     : null;
                 }).filter(Boolean).concat(
                   (cell.modules || []).length > 9
                     ? [el('span', { class: 'cell-more', text: '+' + ((cell.modules || []).length - 9) })]
                     : [])));
      nodes.cells[cell.id] = node;
      host.appendChild(node);
    });
  }

  /* ---------- the PBC schema ----------
     Top to bottom, because that is the direction a request travels: a client reaches the XAPI layer,
     which calls services, which stand on the platform, which reach outward through integrations and
     the outbound modules. Every band is drawn even when empty — an absent XAPI layer is the single
     most informative thing about the IdP and PIM packages, and hiding it would hide that. */
  var PBC_LAYERS = [
    { key: 'xapi', name: 'Business API', hint: 'GraphQL surface a client talks to' },
    { key: 'services', name: 'Commerce services', hint: 'the capability itself — data and behaviour' },
    { key: 'platform', name: 'Platform services', hint: 'jobs, search, assets, notifications' },
    { key: 'integration', name: 'Integrations & providers', hint: 'engines and gateways behind the ports' },
    { key: 'outbound', name: 'Outbound', hint: 'how the world hears about a change' }
  ];

  function moduleChip(id) {
    var m = null;
    for (var i = 0; i < MODULE_TILES.length; i++) if (MODULE_TILES[i].moduleId === id) { m = MODULE_TILES[i]; break; }
    var accent = MODULE_ACCENTS[id];
    var name = m ? m.name : id.replace('VirtoCommerce.', '');
    var node = el('button', {
      type: 'button', class: 'molecule is-module' + (accent ? ' has-icon' : ''),
      style: accent ? '--accent:' + accent : null,
      title: id + (m ? ' — ' + (m.sub || '') : ''),
      onclick: function () { openHash('molecule', id, node); }
    },
      accent ? moduleIcon(id, 22) : null,
      el('span', { class: 'mol-name', text: name }));
    return node;
  }

  /* `edit` turns the schema from a picture into a control: each band grows a + tile that opens a
     module picker for that band, and each chip an × that takes it back out. Published packages pass
     nothing and get the picture, because their composition is not the reader's to change. */
  function pbcSchema(layers, edit) {
    return el('div', { class: 'pbc-schema' + (edit ? ' is-editable' : '') }, PBC_LAYERS.map(function (layer) {
      var ids = (layers && layers[layer.key]) || [];
      var chips = ids.map(function (id) {
            if (!edit) return moduleChip(id);
            /* The × is its own button beside the chip, not inside it: a button within a button is
               invalid markup and the inner one stops being reachable. A module that is only present
               because something else requires it cannot be removed on its own — the × says so and is
               disabled, rather than looking live and silently undoing itself on the next redraw. */
            var held = edit.heldBy(id);
            return el('div', { class: 'pbc-chip' + (held ? ' is-dep' : '') }, moduleChip(id),
              el('button', { type: 'button', class: 'pbc-chip-x' + (held ? ' is-locked' : ''),
                disabled: held ? 'disabled' : null,
                title: held
                  ? moduleTag(id) + ' is required by ' + held + ' — remove that to drop it'
                  : 'Remove ' + moduleTag(id) + ' from the package',
                'aria-label': held ? moduleTag(id) + ' is required by ' + held : 'Remove ' + moduleTag(id),
                onclick: function () { edit.onRemove(id); } }, held ? '🔒' : '✕'));
          });

      /* The + tile is the last cell of the band's grid, so it sits where the next module will appear.
         Only in edit mode: a published package must stay a picture. */
      if (edit) {
        /* `is-module` on purpose: it buys the module tile's two-column grid, so the + sits in the icon
           slot and the label beside it exactly where a module's name would be. Without it the tile
           falls to the topic rule — a single-column pill — and the glyph stacks above the label. */
        chips.push(el('button', { type: 'button', class: 'molecule is-module has-icon pbc-add',
          title: 'Add a module to the ' + layer.name + ' layer',
          onclick: function (event) { edit.onAdd(layer, event.currentTarget); } },
          el('span', { class: 'mod-icon pbc-add-glyph', 'aria-hidden': 'true', text: '+' }),
          el('span', { class: 'mol-name', text: 'Add module' })));
      }

      var body = chips.length
        ? el('div', { class: 'pbc-layer-body' }, chips)
        : el('div', { class: 'pbc-layer-empty', text: 'nothing in this layer — the capability does not reach it' });

      return el('div', { class: 'pbc-layer is-' + layer.key + (ids.length ? '' : ' is-empty') },
        el('div', { class: 'pbc-layer-head' },
          el('span', { class: 'pbc-layer-name', text: layer.name }),
          el('span', { class: 'pbc-layer-hint', text: layer.hint }),
          el('span', { class: 'pbc-layer-n', text: String(ids.length) })),
        body);
    }));
  }

  /* ---------- the module picker ----------
     A small dialog over the panel, so adding a module to a band does not mean scrolling to the
     bottom of the page and hunting through 96 checkboxes. It lists only what that band can hold and
     the package does not already have, filtered as you type. */
  var pickerHost = null;

  function closeModulePicker() {
    if (!pickerHost) return;
    var trigger = pickerHost.trigger;
    document.body.removeChild(pickerHost.node);
    pickerHost = null;
    if (trigger && document.body.contains(trigger)) trigger.focus();
  }

  function openModulePicker(opts) {
    closeModulePicker();

    var list = el('div', { class: 'mod-picker-list' });
    var count = el('span', { class: 'mod-picker-n' });
    var search = el('input', { type: 'search', class: 'mod-picker-search',
      placeholder: 'Filter by name…', 'aria-label': 'Filter modules by name' });

    function draw() {
      /* `has` is read on every draw, not captured once: the package changes under the dialog as the
         reader adds modules, and a stale list would offer something twice. */
      var has = typeof opts.has === 'function' ? opts.has() : (opts.has || {});
      var q = search.value.trim().toLowerCase();
      var members = MODULE_TILES.filter(function (m) {
        return layerOfModule(m.moduleId) === opts.layer.key && !has[m.moduleId];
      }).filter(function (m) {
        return !q || String(m.name).toLowerCase().indexOf(q) !== -1
                  || m.moduleId.toLowerCase().indexOf(q) !== -1;
      }).sort(function (a, b) { return String(a.name).localeCompare(String(b.name)); });

      count.textContent = members.length + ' available';
      list.textContent = '';
      if (!members.length) {
        append(list, el('p', { class: 'empty', text: q
          ? 'No module in this layer matches “' + search.value.trim() + '”.'
          : 'Every module in this layer is already in the package.' }));
        return;
      }
      append(list, members.map(function (m) {
        var id = m.moduleId, accent = MODULE_ACCENTS[id];
        return el('button', {
          type: 'button', class: 'mod-picker-row', style: accent ? '--accent:' + accent : null,
          title: id + (m.sub ? ' — ' + m.sub : ''),
          onclick: function () { opts.onPick(id); draw(); }   /* stays open: adding two is common */
        },
          accent ? moduleIcon(id, 20) : null,
          el('span', { class: 'mod-picker-name', text: m.name }),
          el('span', { class: 'mod-picker-sub', text: m.sub || '' }),
          el('span', { class: 'mod-picker-plus', text: '+', 'aria-hidden': 'true' }));
      }));
    }

    search.addEventListener('input', draw);

    var panel = el('div', { class: 'mod-picker', role: 'dialog', 'aria-modal': 'true',
                            'aria-label': 'Add a module to the ' + opts.layer.name + ' layer' },
      el('div', { class: 'mod-picker-head' },
        el('span', { class: 'mod-picker-title', text: 'Add to ' + opts.layer.name }),
        count,
        el('button', { type: 'button', class: 'icon-btn', 'aria-label': 'Close',
                       onclick: closeModulePicker }, '✕')),
      el('p', { class: 'mod-picker-hint', text: opts.layer.hint +
        ' — a module lands in this band by the same rule the published packages use, so the list is what can go here.' }),
      search, list);

    var backdrop = el('div', { class: 'mod-picker-backdrop', onclick: function (event) {
      if (event.target === backdrop) closeModulePicker();
    } }, panel);

    pickerHost = { node: backdrop, trigger: opts.trigger, redraw: draw };
    document.body.appendChild(backdrop);
    draw();
    search.focus();
  }

  // ---------------------------------------------------------------- molecules

  /* The generated pair. Absent files must not break the page: the map still opens from a bare
     checkout, it just draws chips without icons and pages without profiles. */
  var MODULE_ACCENTS = window.VC_MODULE_ACCENTS || {};
  var MODULE_PROFILES = window.VC_MODULE_PROFILES || [];

  function profileOf(moduleId) {
    for (var i = 0; i < MODULE_PROFILES.length; i++) {
      if (MODULE_PROFILES[i].id === moduleId) return MODULE_PROFILES[i];
    }
    return null;
  }

  /* An icon as <img>, not inline SVG. Every icon in the set declares gradients as id="bg", so
     inlining ninety of them would collide on ids and paint the wrong colours; an <img> is its own
     document. Falls back to the accent as a plain swatch when the file is missing. */
  function moduleIcon(moduleId, size) {
    var accent = MODULE_ACCENTS[moduleId];
    if (!MODULE_ACCENTS[moduleId]) return el('span', { class: 'mod-icon is-blank', 'aria-hidden': 'true' });
    return el('img', { class: 'mod-icon', src: 'assets/module-icons/' + moduleId + '.svg',
                       width: size || 22, height: size || 22, alt: '', loading: 'lazy',
                       style: '--accent:' + accent });
  }

  /* Same shape as the atoms table: one column per family, a coloured label at its head, the tiles
     flowing beneath it. Everything is visible at once — nothing to expand, nothing hidden behind a
     count — which is the point of an inventory. A family bigger than SPAN_AT gets a wider column so
     its tiles flow two and three abreast instead of building a tower that sets the whole row's
     height; the widths come from the grid, so this stays one declaration rather than per-family
     tuning. */
  function renderMoleculeFamilies(host, tiles) {
    var order = window.VC_MODULE_FAMILY_ORDER || [];
    var familyOf = window.VC_MODULE_FAMILY || {};
    var groups = order.map(function (g) {
      return { meta: g, members: tiles.filter(function (t) { return familyOf[t.moduleId] === g.id; }) };
    }).filter(function (g) { return g.members.length; });

    var unfiled = tiles.filter(function (t) { return !familyOf[t.moduleId]; });
    if (unfiled.length) groups.push({ meta: { id: 'other', name: 'Other', hex: null }, members: unfiled });

    nodes.moleculeFamilies = {};
    groups.forEach(function (g) {
      var body = el('div', { class: 'mol-family-tiles' });
      g.members.forEach(function (t) { body.appendChild(moleculeTile(t)); });

      var head = el('div', { class: 'mol-family-label' },
        el('span', { class: 'mol-family-swatch', 'aria-hidden': 'true' }),
        el('span', { class: 'mol-family-name', text: g.meta.name }),
        el('span', { class: 'mol-family-n', text: String(g.members.length) }));

      var wrap = el('div', {
        class: 'mol-family',
        style: g.meta.hex ? '--accent:' + g.meta.hex : null
      }, head, body);

      nodes.moleculeFamilies[g.meta.id] = { wrap: wrap, head: head, body: body, members: g.members };
      host.appendChild(wrap);
    });
  }

  function moleculeTile(molecule) {
    var isModule = molecule.kind === 'module';
    var accent = isModule ? MODULE_ACCENTS[molecule.moduleId] : null;
    /* Facts are now extracted for every module, so the tile marks the scarcer thing: authored notes. */
    var prof = isModule && profileOf(molecule.moduleId);
    var written = !!(prof && prof.notes && prof.notes.forAnalyst);
    var node = el('button', {
      type: 'button',
      class: 'molecule' + (isModule ? ' is-module' : '') + (accent ? ' has-icon' : '') + (written ? ' is-written' : ''),
      /* The accent is the module icon's own first gradient stop, so the border and the icon
         cannot drift apart — see tools/sync-module-icons.js. */
      style: accent ? '--accent:' + accent : null,
      'aria-label': molecule.name + (isModule ? ' — module ' + molecule.moduleId + ' ' + molecule.version + '. '
                                              : ' — reserved molecule. ') + (molecule.sub || ''),
      title: isModule
        ? molecule.moduleId + ' ' + molecule.version + (written ? '' : ' — facts only, write-up not written yet') +
          ' — ' + (molecule.sub || '')
        : (molecule.sub || ''),
      dataset: { id: molecule.id },
      onclick: function () { openHash('molecule', molecule.id, node); }
    },
      accent ? moduleIcon(molecule.moduleId) : null,
      el('span', { class: 'mol-name', text: molecule.name }),
      el('span', { class: 'mol-sub', text: molecule.sub || '' }));
    nodes.molecules[molecule.id] = node;
    return node;
  }

  function renderMolecules() {
    var host = document.getElementById('molecules');
    host.textContent = '';

    renderMoleculeFamilies(host, MODULE_TILES);

    /* No column for the authored topics. They are still in MOLECULES, so an atom's "Part of" link
       and a #/molecule/<topic> deep link both still open them — they simply do not take space in an
       inventory of installable modules. */
  }

  // ---------------------------------------------------------------- filtering

  function applyFilter() {
    var shown = 0;
    ATOMS.forEach(function (atom) {
      var node = nodes.atoms[atom.id];
      if (!node) return;
      var ok = atomMatches(atom);
      node.classList.toggle('is-dim', !ok);
      if (ok) shown++;
    });

    var tokens = queryTokens();
    LAYERS.forEach(function (layer) {
      var node = nodes.layers[layer.id];
      var dim = state.spotlight ? state.spotlight !== layer.id
        : tokens.length ? !layerHaystack(layer).match(tokensRegexSafe(tokens)) : false;
      node.classList.toggle('is-dim', !!dim);
    });

    CELLS.forEach(function (cell) {
      var node = nodes.cells[cell.id];
      var dimCell = tokens.length ? !tokens.every(function (t) { return cellHaystack(cell).indexOf(t) !== -1; })
        : false;
      node.classList.toggle('is-dim', !!dimCell);
    });

    MOLECULES.forEach(function (molecule) {
      var node = nodes.molecules[molecule.id];
      if (!node) return;
      var dim = tokens.length ? !tokens.every(function (t) { return moleculeHaystack(molecule).indexOf(t) !== -1; })
        : false;
      node.classList.toggle('is-dim', !!dim);
    });

    /* Nothing collapses any more, so a search only greys out the families it did not hit and swaps
       their count for hits/total — the column keeps its place, which is what makes the shape of a
       result readable at a glance. */
    if (nodes.moleculeFamilies) {
      Object.keys(nodes.moleculeFamilies).forEach(function (fid) {
        var f = nodes.moleculeFamilies[fid];
        var hits = tokens.length ? f.members.filter(function (m) {
          var node = nodes.molecules[m.id];
          return node && !node.classList.contains('is-dim');
        }).length : 0;
        f.wrap.classList.toggle('is-dim', !!tokens.length && !hits);
        f.head.querySelector('.mol-family-n').textContent = tokens.length
          ? hits + '/' + f.members.length
          : String(f.members.length);
      });
    }

    var label = document.getElementById('atoms-count');
    label.textContent = shown === ATOMS.length
      ? 'click any tile · ' + ATOMS.length + ' building blocks'
      : shown + ' of ' + ATOMS.length + ' shown';

    document.getElementById('search-clear').hidden = state.query === '';
  }

  function layerHaystack(layer) {
    if (!layer._haystack) {
      layer._haystack = [layer.name, layer.sub, (layer.tags || []).join(' '),
        (layer.bullets || []).join(' ')].join(' ').toLowerCase();
    }
    return layer._haystack;
  }

  function cellHaystack(cell) {
    if (!cell._haystack) {
      cell._haystack = [cell.name, cell.sub, cell.anchor, cell.splittable,
        (cell.modules || []).join(' '), (cell.planned || []).join(' ')].join(' ').toLowerCase();
    }
    return cell._haystack;
  }

  function moleculeHaystack(molecule) {
    if (!molecule._haystack) {
      molecule._haystack = [molecule.name, molecule.sub, molecule.moduleId, molecule.group,
        (molecule.dependsOn || []).join(' '), (molecule.optional || []).join(' '),
        (molecule.planned || []).join(' ')].join(' ').toLowerCase();
    }
    return molecule._haystack;
  }

  /* Layers dim on a plain substring test too; kept as a helper so the regex is built once. */
  function tokensRegexSafe(tokens) {
    return new RegExp(tokens.map(function (t) {
      return '(?=.*' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')';
    }).join(''));
  }

  // ---------------------------------------------------------------- drawer

  var drawer = document.getElementById('drawer');
  var scrim = document.getElementById('scrim');

  /* `span` controls how much of the expanded-mode grid a block claims:
       true / 'is-wide' — every column (code and long prose both read badly narrow)
       'is-half'        — two of four columns, for prose-heavy blocks like Gotchas
       omitted          — one column
     In docked mode the body is a plain block flow and these are inert. */
  function block(title, body, span) {
    if (!body) return null;
    var cls = 'd-block' + (span === true ? ' is-wide' : span ? ' ' + span : '');
    return el('div', { class: cls }, el('h3', { text: title }), body);
  }

  function list(items, variant) {
    if (!items || !items.length) return null;
    return el('ul', { class: 'd-list' + (variant ? ' ' + variant : '') },
      items.map(function (item) { return el('li', {}, rich(item)); }));
  }

  /* ---------- syntax highlighting ----------
   * A deliberately small tokenizer. Every token becomes a span whose text is set
   * via textContent, so it cannot corrupt the code or inject markup — the worst a
   * mis-tokenization can do is colour something oddly.
   *
   * Ordering inside each regex matters: comments and strings come first, so a `//`
   * inside a string literal is consumed as part of the string, and a quote inside a
   * comment is consumed as part of the comment.
   */

  var CS_KEYWORDS = {};
  ('abstract as async await base bool break byte case catch char checked class const continue decimal default ' +
   'delegate do double else enum event explicit extern false finally fixed float for foreach get global goto if ' +
   'implicit in init int interface internal is lock long nameof namespace new null object operator out override ' +
   'params private protected public readonly record ref return sbyte sealed set short sizeof stackalloc static ' +
   'string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual void ' +
   'volatile when where while yield'
  ).split(' ').forEach(function (word) { CS_KEYWORDS[word] = true; });

  var SYNTAX = {
    csharp: {
      re: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(@?\$?"(?:[^"\\]|\\.|"")*"|'(?:[^'\\]|\\.)*')|(\b\d[\d_]*(?:\.\d+)?[a-zA-Z]?\b)|([A-Za-z_]\w*)/g,
      classify: function (m) {
        if (m[1]) return 'comment';
        if (m[2]) return 'string';
        if (m[3]) return 'number';
        if (m[4]) return CS_KEYWORDS[m[4]] ? 'keyword' : (/^[A-Z]/.test(m[4]) ? 'type' : null);
        return null;
      }
    },
    json: {
      re: /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*")|(\b(?:true|false|null)\b)|(-?\b\d[\d.]*\b)/g,
      classify: function (m, code) {
        if (m[1]) return 'comment';
        // A string followed by a colon is a property name, not a value.
        if (m[2]) return /^\s*:/.test(code.slice(m.index + m[0].length)) ? 'type' : 'string';
        if (m[3]) return 'keyword';
        if (m[4]) return 'number';
        return null;
      }
    },
    bash: {
      re: /(#[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g,
      classify: function (m) { return m[1] ? 'comment' : m[2] ? 'string' : null; }
    },
    xml: {
      // Comments first, then attribute values, then tag names — so a quote inside a
      // comment stays part of the comment and text content stays plain.
      re: /(<!--[\s\S]*?-->)|("(?:[^"\\]|\\.)*")|(<\/?[A-Za-z_][\w.:-]*)|(\/?>)/g,
      classify: function (m) {
        if (m[1]) return 'comment';
        if (m[2]) return 'string';
        if (m[3] || m[4]) return 'keyword';
        return null;
      }
    }
  };

  var LANG_LABELS = { csharp: 'C#', json: 'JSON', bash: 'Shell', xml: 'XML' };

  function highlight(code, lang) {
    var frag = document.createDocumentFragment();
    var spec = SYNTAX[lang];
    if (!spec) { frag.appendChild(document.createTextNode(code)); return frag; }

    var re = spec.re;
    re.lastIndex = 0;
    var last = 0;
    var match;

    while ((match = re.exec(code)) !== null) {
      if (!match[0].length) { re.lastIndex++; continue; }   // never loop on a zero-length match
      if (match.index > last) frag.appendChild(document.createTextNode(code.slice(last, match.index)));

      var cls = spec.classify(match, code);
      frag.appendChild(cls ? el('span', { class: 'syn-' + cls, text: match[0] })
                           : document.createTextNode(match[0]));
      last = match.index + match[0].length;
    }
    if (last < code.length) frag.appendChild(document.createTextNode(code.slice(last)));
    return frag;
  }

  function snippetBlock(snippet) {
    if (!snippet || !snippet.code) return null;

    var copy = el('button', {
      type: 'button', class: 'icon-btn snippet-copy',
      'aria-label': 'Copy snippet to clipboard',
      onclick: function () {
        copyText(snippet.code).then(function (ok) {
          copy.textContent = ok ? 'copied' : 'select & copy';
          setTimeout(function () { copy.textContent = 'copy'; }, 1400);
        });
      }
    }, 'copy');

    return el('div', { class: 'snippet' },
      el('div', { class: 'snippet-bar' },
        el('span', { class: 'snippet-lang', text: LANG_LABELS[snippet.lang] || snippet.lang || 'code' }),
        copy),
      /* `display` lets a caller show a shortened form — a folded manifest, say — while `code` stays
         what the copy button puts on the clipboard. */
      el('pre', {}, el('code', {}, highlight(snippet.display || snippet.code, snippet.lang))));
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; },
        function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var area = el('textarea', { style: 'position:fixed;opacity:0' });
      area.value = text;
      document.body.appendChild(area);
      area.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(area);
      return ok;
    } catch (e) { return false; }
  }

  function pills(label, items, span) {
    if (!items || !items.length) return null;
    return block(label, el('div', { class: 'pill-row' }, items), span);
  }

  /* Static, non-interactive chips. `tags` were previously only visible on the poster
     tile; in the drawer they fill the column beside the lead paragraph, which would
     otherwise be empty on a wide screen. */
  function tagsBlock(label, tags) {
    if (!tags || !tags.length) return null;
    return block(label, el('div', { class: 'tag-row' }, tags.map(function (tag) {
      return el('span', { class: 'tag-chip', text: tag });
    })), 'is-half');
  }

  /* The lead only claims half the width when something sits beside it. */
  function leadPara(text, hasNeighbour) {
    return el('p', { class: 'd-lead' + (hasNeighbour ? ' is-half' : '') }, rich(text));
  }

  /* Emptying the panel drops the topology redraws with it — they close over elements that are
     about to be discarded, and drawing into a detached SVG is wasted work. */
  function clearDrawerBody(body) {
    TOPOLOGY_REDRAWS.length = 0;
    body.textContent = '';
  }

  function renderAtomDrawer(atom) {
    var meta = adoptionOf(atom.adoption);
    var family = byId(FAMILIES, atom.family);
    var layer = byId(LAYERS, atom.layer);

    document.getElementById('drawer-eyebrow').textContent = '';
    append(document.getElementById('drawer-eyebrow'), [
      el('span', { class: 'adopt ' + meta.cls }, meta.glyph + ' ' + meta.label),
      family ? el('span', { text: '· ' + family.name }) : null,
      layer ? el('span', { text: '· ' + layer.name }) : null
    ]);
    document.getElementById('drawer-title').textContent = atom.name;

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    var seeAlsoBlock = pills('See also', (atom.seeAlso || []).map(function (ref) {
      var other = byId(ATOMS, ref);
      if (!other) return null;
      return el('button', { type: 'button', class: 'pill', text: other.name,
        onclick: function () { openHash('atom', other.id, nodes.atoms[other.id]); } });
    }).filter(Boolean));

    var partOfBlock = atom.molecule ? pills('Part of', [(function () {
      var mol = byId(MOLECULES, atom.molecule);
      return mol ? el('button', { type: 'button', class: 'pill', text: mol.name + ' →',
        onclick: function () { openHash('molecule', mol.id, nodes.molecules[mol.id]); } }) : null;
    })()].filter(Boolean)) : null;

    if (atom._problems.length) {
      append(body, el('div', { class: 'd-note' },
        el('strong', { class: 'd-note-label', text: '⚠ Content schema' }),
        ' — this atom is incomplete: ' + atom._problems.join('; ') + '.'));
    }

    var alsoKnownAs = tagsBlock('Also known as', atom.tags);
    append(body, [leadPara(atom.oneLiner, !!alsoKnownAs), alsoKnownAs]);

    if (atom.note) {
      append(body, el('div', { class: 'd-note' },
        el('strong', { class: 'd-note-label', text: atom.adoption === 'in-flight' ? 'Migration note' : 'Read this first' }),
        ' — ', rich(atom.note)));
    }
    if (atom.useInstead) {
      append(body, el('div', { class: 'd-note' },
        el('strong', { class: 'd-note-label', text: 'Use instead' }), ' — ', rich(atom.useInstead)));
    }

    append(body, [
      block('Pattern', el('p', { style: 'margin:0' }, rich(atom.pattern))),
      block('When to use', list(atom.whenToUse, 'good')),
      block('Avoid', list(atom.avoid, 'bad')),
      block('API', atom.api && atom.api.length
        ? el('div', { class: 'api-list' }, atom.api.map(function (api) {
            return el('div', { class: 'api-row' },
              el('span', { class: 'api-name', text: api.name }),
              apiFile(api.file));
          }))
        : null),
      block('Snippet', snippetBlock(atom.snippet), true),
      /* Bottom row of the expanded grid: Gotchas 50% (prose, needs the width),
         Docs 25%, and the two short pill blocks stacked together in the last 25%
         rather than each claiming a column of mostly white space. */
      block('Gotchas', list(atom.gotchas, 'warn'), 'is-half'),
      block('Docs', docLinks(atom.docs)),
      // Only claim a column when there is actually something to put in it.
      (seeAlsoBlock || partOfBlock) ? el('div', { class: 'd-col' }, seeAlsoBlock, partOfBlock) : null,
      el('div', { class: 'd-meta' }, 'Verified against platform ' + (atom.verifiedAgainst || '?') +
        '  ·  id: ' + atom.id)
    ]);
  }

  /* A vertical layered schema: an ordered stack of rows joined by connector pills.
     A row is either a group of consumer nodes or the target itself, so the target can sit
     anywhere in the stack — Channels puts the platform in the middle, with sales channels
     calling down into it and back office / integrations calling up. Declared in content as
     `schema`, so a layer gains a diagram without any change here. */
  var CONNECTOR_DIRS = { down: '↓', up: '↑', both: '↕' };

  function schemaNode(node) {
    return el('div', { class: 'sch-node' + (node.trend ? ' is-trend' : '') },
      el('span', { class: 'sch-node-name' }, rich(node.name)),
      node.sub ? el('span', { class: 'sch-node-sub' }, rich(node.sub)) : null,
      node.via ? el('span', { class: 'sch-via sch-via-' + (node.viaKind || 'plain'), text: node.via }) : null);
  }

  /* A name/description table — the module-type matrix, the API-shape comparison.
     Deliberately NOT the .api-list styling it used to borrow: that is monospace,
     which made prose descriptions read like file paths. */
  function matrixBlock(rows) {
    if (!rows || !rows.length) return null;
    return el('div', { class: 'd-matrix' }, rows.map(function (row) {
      return el('div', { class: 'd-matrix-row' },
        el('span', { class: 'd-matrix-name', text: row.name }),
        el('span', { class: 'd-matrix-desc' }, rich(row.desc)));
    }));
  }

  /* ---------- horizontal tier flow ----------
   * Left-to-right tiers of cards, optionally grouped into dashed clusters, with arrows
   * between tiers. Adapted from vc-module-solution-architecture-map's tier/node/cluster
   * vocabulary, with two deliberate departures: colours map onto this map's own tokens so
   * light mode still works, and there are no status dots — those mean live health in that
   * module, and an all-green static poster would imply monitoring this page does not do.
   */
  /* A legend entry is either a colour (a node `kind`) or a line style — `dashed` describes
     the border, not an ownership colour, so it must not render as a coloured swatch. */
  function legendItem(item) {
    return el('span', { class: 'fl-legend-item' },
      el('span', { class: 'fl-legend-swatch' + (item.dashed ? ' is-dashed' : ' is-' + item.kind) }),
      item.label);
  }

  function flowNode(node) {
    return el('div', { class: 'fl-node' + (node.kind ? ' is-' + node.kind : '') + (node.bypass ? ' is-bypass' : '') },
      /* `badge` names a path that does not follow the column order — used for the static
         route, which the edge serves directly without passing through API or modules. */
      node.badge ? el('span', { class: 'fl-node-badge', text: node.badge }) : null,
      el('span', { class: 'fl-node-name' }, rich(node.name)),
      node.role ? el('span', { class: 'fl-node-role' }, rich(node.role)) : null,
      node.meta ? el('span', { class: 'fl-node-meta', text: node.meta }) : null);
  }

  function flowTier(tier) {
    if (tier.arrow) return el('div', { class: 'fl-arrow', 'aria-hidden': 'true', text: '→' });
    return el('div', { class: 'fl-tier' },
      el('div', { class: 'fl-tier-label', text: tier.label }),
      el('div', { class: 'fl-tier-body' },
        (tier.clusters || []).map(function (cluster) {
          return el('div', { class: 'fl-cluster' },
            el('div', { class: 'fl-cluster-head' },
              el('span', { class: 'fl-cluster-title', text: cluster.title }),
              cluster.chip ? el('span', { class: 'fl-chip', text: cluster.chip }) : null),
            el('div', { class: 'fl-cluster-nodes' }, (cluster.nodes || []).map(flowNode)));
        }),
        (tier.nodes || []).map(flowNode)));
  }

  function flowBlock(flow) {
    if (!flow || !flow.tiers || !flow.tiers.length) return null;
    return el('div', { class: 'flow-wrap' },
      el('div', { class: 'fl-flow' }, flow.tiers.map(flowTier)),
      flow.legend ? el('div', { class: 'fl-legend' }, flow.legend.map(legendItem)) : null);
  }

  /* ---------- swimlanes ----------
   * Columns are stages, rows are isolated paths. Each lane is a continuous rail across the
   * stages where the paths are separate; a column marked `shared` spans every lane, which is
   * where they converge. A `scope` renders like a Cell in the Atomic Architecture diagram:
   * a bounded box whose contents are named modules, so "this is a set of modules" is visible
   * rather than implied.
   */
  function scopeBox(scope) {
    var count = (scope.modules || []).length;
    return el('div', { class: 'ln-scope' + (scope.accent ? ' is-' + scope.accent : '') },
      el('div', { class: 'ln-scope-head' },
        el('span', { class: 'ln-scope-title', text: scope.title }),
        scope.chip ? el('span', { class: 'fl-chip', text: scope.chip }) : null),
      scope.role ? el('span', { class: 'ln-scope-role' }, rich(scope.role)) : null,
      count ? el('div', { class: 'ln-mods' }, scope.modules.map(function (m) {
        return el('span', { class: 'ln-mod', text: m });
      })) : null,
      /* `count` overrides the chip tally — the chips are a sample when the real set is
         far larger than what fits in a box. */
      (scope.count || count) ? el('span', { class: 'ln-scope-count',
                                            text: scope.count || (count + ' modules') }) : null);
  }

  function laneCellBody(cell) {
    if (!cell) return null;
    return [].concat(
      (cell.scopes || []).map(scopeBox),
      (cell.nodes || []).map(flowNode)
    );
  }

  function lanesBlock(diagram) {
    var columns = diagram.columns || [];
    var lanes = diagram.lanes || [];
    if (!columns.length || !lanes.length) return null;

    var laned = columns.filter(function (c) { return !c.shared; });
    var grid = el('div', { class: 'lanes', style: '--ln-cols:' + columns.length });
    var ROW = 3;   // 1 = stage headings, 2 = spacer band the group label sits in

    // Row 1: the stage headings, offset by the lane-label gutter. Every heading but the last
    // carries a flow arrow into the next stage.
    columns.forEach(function (col, i) {
      grid.appendChild(el('div', {
        class: 'ln-colhead' + (i === columns.length - 1 ? ' is-last' : ''),
        style: 'grid-column:' + (i + 2) + ';grid-row:1',
        text: col.label
      }));
    });

    /* One faint band per lane, spanning every column. With the per-cell tint removed, this is
       what keeps a lane readable — without boxing each cell, which is what made empty cells
       look like empty boxes. Appended first so it sits under both the group and the cards. */
    lanes.forEach(function (lane, li) {
      grid.appendChild(el('div', {
        class: 'ln-band' + (lane.accent ? ' is-' + lane.accent : ''),
        style: 'grid-column:1 / -1;grid-row:' + (li + 3)
      }));
    });

    /* A group draws one bounded region behind a contiguous run of columns — used to say
       "these stages are all the platform". Appended before the cells so it paints underneath. */
    Object.keys(diagram.groups || {}).forEach(function (id) {
      var idx = columns.reduce(function (acc, col, i) { return col.group === id ? acc.concat(i) : acc; }, []);
      if (!idx.length) return;
      grid.appendChild(el('div', {
        class: 'ln-group',
        style: 'grid-column:' + (idx[0] + 2) + ' / ' + (idx[idx.length - 1] + 3) +
               ';grid-row:2 / span ' + (lanes.length + 1)
      }, el('span', { class: 'ln-group-label', text: diagram.groups[id] })));
    });

    lanes.forEach(function (lane, li) {
      grid.appendChild(el('div', { class: 'ln-label' + (lane.accent ? ' is-' + lane.accent : ''),
                                   style: 'grid-column:1;grid-row:' + (li + ROW) },
        el('span', { class: 'ln-label-name', text: lane.label }),
        lane.chip ? el('span', { class: 'ln-label-chip', text: lane.chip }) : null));

      laned.forEach(function (col, ci) {
        grid.appendChild(el('div', { class: 'ln-cell' + (lane.accent ? ' is-' + lane.accent : ''),
                                     style: 'grid-column:' + (ci + 2) + ';grid-row:' + (li + ROW) },
          laneCellBody((lane.cells || [])[ci])));
      });
    });

    // Shared columns span every lane row — the point where the paths converge.
    columns.forEach(function (col, i) {
      if (!col.shared) return;
      grid.appendChild(el('div', { class: 'ln-cell is-shared',
                                   style: 'grid-column:' + (i + 2) + ';grid-row:' + ROW + ' / span ' + lanes.length },
        laneCellBody(col)));
    });

    return el('div', { class: 'flow-wrap' }, grid,
      diagram.legend ? el('div', { class: 'fl-legend' }, diagram.legend.map(legendItem)) : null);
  }

  /* ---------- compact pipeline ----------
   * Parallel source→storage lanes on top, then converged full-width steps, joined by small
   * uppercase pills. Follows the release-strategy deck's fl-lane / fl-conn / fl-lbl shape:
   * each lane runs node → mini pill → node, and the rows below span the whole width.
   */
  function pipelineNode(node) {
    return el('div', { class: 'pp-node' + (node.kind ? ' is-' + node.kind : '') },
      el('span', { class: 'pp-node-name' }, rich(node.name)),
      node.sub ? el('span', { class: 'pp-node-sub', text: node.sub }) : null);
  }

  function pipelineConn(label, mini) {
    return el('div', { class: 'pp-conn' + (mini ? ' is-mini' : '') },
      el('span', { class: 'pp-lbl', text: label }));
  }

  function pipelineBlock(diagram) {
    var parts = [];

    if ((diagram.lanes || []).length) {
      parts.push(el('div', { class: 'pp-lanes', style: '--pp-lanes:' + diagram.lanes.length },
        diagram.lanes.map(function (lane) {
          /* `accent` tints the whole lane — heading included — so ownership is one colour
             read down the lane rather than something to work out card by card. */
          return el('div', { class: 'pp-lane' + (lane.accent ? ' is-' + lane.accent : '') },
            lane.label ? el('div', { class: 'pp-lane-label', text: lane.label }) : null,
            (lane.steps || []).map(function (step) {
              return step.connector ? pipelineConn(step.connector, true) : pipelineNode(step);
            }));
        })));
    }

    (diagram.rows || []).forEach(function (row) {
      if (row.connector) parts.push(pipelineConn(row.connector));
      parts.push(pipelineNode(row));
    });

    return el('div', { class: 'pipeline' }, parts);
  }

  /* ---------- classic topology ----------
   * The cloud-architecture idiom: boxes placed on a grid, bounded regions behind them, and
   * labelled orthogonal connectors drawn between them. Unlike the other kinds, position is
   * authored (`col` / `row`) rather than derived — an architecture diagram's layout carries
   * meaning, and a renderer cannot guess which node belongs beside which.
   *
   * Edges are drawn into an SVG overlay after layout, from measured element boxes, because
   * the grid's own track sizes are what decide where a card ends up. Every route is
   * orthogonal: straight when two nodes share a centre line, otherwise a Z with the turn at
   * the midpoint of the gap between the columns.
   */
  var SVG_NS = 'http://www.w3.org/2000/svg';
  /* Redraw callbacks for the topologies currently in the panel. Explicit rather than a
     ResizeObserver: the panel is `hidden` while its content is built, so at that moment the
     grid has no box to measure, and observer callbacks are delivered with the rendering steps
     — which a hidden or non-compositing tab does not run. Drawing from the three places the
     geometry can actually change is deterministic and needs no frame. */
  var TOPOLOGY_REDRAWS = [];

  function redrawTopologies() {
    TOPOLOGY_REDRAWS.forEach(function (redraw) { redraw(); });
  }

  function svgEl(tag, props) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(props || {}).forEach(function (key) { node.setAttribute(key, props[key]); });
    return node;
  }

  /* Anchors are edge midpoints, so a connector meets a card square-on rather than at a
     corner. `side` is chosen from the relative position of the two boxes. */
  function anchor(box, side) {
    if (side === 'right') return { x: box.right, y: box.top + box.height / 2 };
    if (side === 'left') return { x: box.left, y: box.top + box.height / 2 };
    if (side === 'bottom') return { x: box.left + box.width / 2, y: box.bottom };
    return { x: box.left + box.width / 2, y: box.top };
  }

  /* Half the grid's column gap — keep it in step with `column-gap` in .tp-grid. The turn happens
     in the gutter immediately before the target rather than half way along the whole run: for
     neighbouring columns the two are the same point, and for distant ones it keeps the vertical
     segment out of the cards in between. */
  var TP_GUTTER = 44;

  function edgePath(s, t, offset) {
    // Horizontal run when the boxes are side by side, vertical when stacked.
    var horizontal = t.left >= s.right - 1 || s.left >= t.right - 1;
    var a, b, d, labelAt;
    var nudge = offset || 0;
    if (horizontal) {
      var forward = t.left >= s.right - 1;
      a = anchor(s, forward ? 'right' : 'left');
      b = anchor(t, forward ? 'left' : 'right');
      var midX = forward ? b.x - TP_GUTTER + nudge : b.x + TP_GUTTER - nudge;
      if (Math.abs(a.y - b.y) < 2) {
        d = 'M' + a.x + ' ' + a.y + 'H' + b.x;
        labelAt = { x: (a.x + b.x) / 2, y: a.y };
      } else {
        d = 'M' + a.x + ' ' + a.y + 'H' + midX + 'V' + b.y + 'H' + b.x;
        labelAt = { x: midX, y: (a.y + b.y) / 2 };
      }
    } else {
      var down = t.top >= s.bottom - 1;
      a = anchor(s, down ? 'bottom' : 'top');
      b = anchor(t, down ? 'top' : 'bottom');
      var midY = (a.y + b.y) / 2;
      if (Math.abs(a.x - b.x) < 2) {
        d = 'M' + a.x + ' ' + a.y + 'V' + b.y;
        labelAt = { x: a.x, y: midY };
      } else {
        d = 'M' + a.x + ' ' + a.y + 'V' + midY + 'H' + b.x + 'V' + b.y;
        labelAt = { x: (a.x + b.x) / 2, y: midY };
      }
    }
    return { d: d, labelAt: labelAt };
  }

  function drawEdges(svg, grid, byId, edges) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var origin = grid.getBoundingClientRect();
    var w = Math.ceil(origin.width), h = Math.ceil(origin.height);
    if (!w || !h) return;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    var defs = svgEl('defs', {});
    ['solid', 'bypass'].forEach(function (variant) {
      var marker = svgEl('marker', { id: 'tp-arrow-' + variant, viewBox: '0 0 8 8',
        refX: '7', refY: '4', markerWidth: '5.5', markerHeight: '5.5', orient: 'auto' });
      marker.appendChild(svgEl('path', { d: 'M0 0.6 L8 4 L0 7.4 Z', class: 'tp-head is-' + variant }));
      defs.appendChild(marker);
    });
    svg.appendChild(defs);

    function local(node) {
      var r = node.getBoundingClientRect();
      return { left: r.left - origin.left, right: r.right - origin.left,
               top: r.top - origin.top, bottom: r.bottom - origin.top,
               width: r.width, height: r.height };
    }

    edges.forEach(function (edge) {
      var from = byId[edge.from], to = byId[edge.to];
      if (!from || !to) return;
      var route = edgePath(local(from), local(to), edge.turnOffset);
      var variant = edge.bypass ? 'bypass' : 'solid';
      svg.appendChild(svgEl('path', { d: route.d, class: 'tp-edge is-' + variant,
        'marker-end': 'url(#tp-arrow-' + variant + ')' }));
      if (!edge.label) return;
      /* The label is knocked out of the line with a stroke halo in the panel colour —
         cheaper and more robust than measuring the text to place a rectangle behind it. */
      /* labelDx / labelDy nudge a label off its own turn point — the escape hatch for the one
         case the router cannot solve: two edges whose labels land on the same spot. */
      var text = svgEl('text', { x: route.labelAt.x + (edge.labelDx || 0),
        y: route.labelAt.y + (edge.labelDy || 0),
        class: 'tp-edge-label' + (edge.bypass ? ' is-bypass' : '') });
      text.textContent = edge.label;
      svg.appendChild(text);
    });
  }

  function topologyBlock(diagram) {
    var nodes = diagram.nodes || [];
    if (!nodes.length) return null;

    var grid = el('div', { class: 'tp-grid', style: '--tp-cols:' + (diagram.cols || 4) });
    var byNodeId = {};

    // Regions first: they are the backdrop the boxes sit on, so they must paint underneath.
    (diagram.regions || []).forEach(function (region) {
      grid.appendChild(el('div', {
        /* `tight` hugs a single cell instead of bleeding into the gutters, which is what makes a
           per-card boundary — one deployable image — legible inside a larger region. */
        class: 'tp-region' + (region.accent ? ' is-' + region.accent : '') +
               (region.outer ? ' is-outer' : '') + (region.tight ? ' is-tight' : ''),
        style: 'grid-column:' + region.col[0] + ' / ' + (region.col[1] + 1) +
               ';grid-row:' + region.row[0] + ' / ' + (region.row[1] + 1)
        /* A per-card boundary is only a few pixels taller than the card it wraps, so there is
           nowhere to put a label without covering it. Those regions carry none. */
      }, region.label ? el('span', { class: 'tp-region-label', text: region.label }) : null));
    });

    nodes.forEach(function (node) {
      var card = el('div', { class: 'tp-node' + (node.kind ? ' is-' + node.kind : ''),
        style: 'grid-column:' + node.col + ';grid-row:' + node.row },
        el('span', { class: 'tp-node-name' }, rich(node.name)),
        node.sub ? el('span', { class: 'tp-node-sub' }, rich(node.sub)) : null,
        node.meta ? el('span', { class: 'tp-node-meta', text: node.meta }) : null);
      byNodeId[node.id] = card;
      grid.appendChild(card);
    });

    var svg = svgEl('svg', { class: 'tp-edges', 'aria-hidden': 'true' });
    var stage = el('div', { class: 'tp-stage' }, svg, grid);

    /* Re-measured rather than computed once: the same diagram is laid out at two widths
       (panel and full screen) and the turn points move with the tracks. */
    TOPOLOGY_REDRAWS.push(function () { drawEdges(svg, grid, byNodeId, diagram.edges || []); });

    return el('div', { class: 'flow-wrap' }, stage,
      diagram.legend ? el('div', { class: 'fl-legend' }, diagram.legend.map(legendItem)) : null);
  }

  /* ---------- annotated tree ----------
   * A folder listing where every line is answered, not just shown: the path on the left, what
   * it is for on the right. Depth is authored, so the shape of a real repository survives
   * without the renderer having to parse paths.
   */
  function treeBlock(diagram) {
    var items = diagram.items || [];
    if (!items.length) return null;
    return el('div', { class: 'tree' },
      diagram.root ? el('div', { class: 'tr-root' }, el('code', { text: diagram.root })) : null,
      el('ul', { class: 'tr-list' }, items.map(function (item) {
        return el('li', { class: 'tr-row' + (item.kind ? ' is-' + item.kind : ''),
                          style: '--tr-depth:' + (item.depth || 0) },
          el('code', { class: 'tr-name', text: item.name }),
          item.desc ? el('span', { class: 'tr-desc' }, rich(item.desc)) : null);
      })));
  }

  /* A layer can carry several ordered diagrams; `kind` picks the renderer. */
  var DIAGRAM_RENDERERS = { flow: flowBlock, lanes: lanesBlock, stack: schemaBlock,
                            pipeline: pipelineBlock, topology: topologyBlock, tree: treeBlock };

  function diagramBlocks(layer) {
    return (layer.diagrams || []).map(function (diagram) {
      /* A section is prose, not a picture, but it lives in the same ordered list so an author can
         put it between two diagrams — which is where an explanation usually belongs. */
      if (diagram.kind === 'section') {
        return block(diagram.title, [
          (diagram.note || '').split('\n\n').filter(Boolean).map(function (para) {
            return el('p', { class: 'dg-cap' }, rich(para));
          }),
          list(diagram.items)
        ], true);
      }
      var render = DIAGRAM_RENDERERS[diagram.kind] || schemaBlock;
      /* `note` is the caption that says which documented configuration this is and what the
         numbers behind it are — the part a diagram of boxes cannot carry on its own. A blank line
         starts a new paragraph, because an explanation long enough to need one should get one. */
      var caption = (diagram.note || '').split('\n\n').filter(Boolean).map(function (para) {
        return el('p', { class: 'dg-cap' }, rich(para));
      });
      return block(diagram.title, [caption, render(diagram)], true);
    });
  }

  function schemaBlock(schema) {
    if (!schema || !schema.rows || !schema.rows.length) return null;

    var parts = [];
    schema.rows.forEach(function (row) {
      if (row.connector) {
        parts.push(el('div', { class: 'sch-conn' },
          el('span', { class: 'sch-conn-pill' },
            el('span', { class: 'sch-conn-dir', 'aria-hidden': 'true',
                         text: CONNECTOR_DIRS[row.connectorDir] || CONNECTOR_DIRS.down }),
            row.connector)));
      }
      if (row.target) {
        parts.push(el('div', { class: 'sch-row sch-target' },
          el('span', { class: 'sch-target-name', text: row.target }),
          row.sub ? el('span', { class: 'sch-target-sub' }, rich(row.sub)) : null));
        return;
      }
      parts.push(el('div', { class: 'sch-row sch-group' },
        el('div', { class: 'sch-group-head' },
          el('span', { class: 'sch-group-title', text: row.title }),
          row.hint ? el('span', { class: 'sch-group-hint', text: row.hint }) : null),
        el('div', { class: 'sch-nodes' }, (row.nodes || []).map(schemaNode))));
    });
    return el('div', { class: 'schema' }, parts);
  }

  function renderLayerDrawer(layer) {
    document.getElementById('drawer-eyebrow').textContent = 'Solution architecture';
    document.getElementById('drawer-title').textContent = layer.name;

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    var keyPieces = tagsBlock('Key pieces', layer.tags);
    append(body, [leadPara(layer.sub, !!keyPieces), keyPieces]);

    var atomPills = pills('Atoms in this layer', ATOMS.filter(function (a) { return a.layer === layer.id; })
      .map(function (atom) {
        return el('button', { type: 'button', class: 'pill',
          text: adoptionOf(atom.adoption).glyph + ' ' + atom.name,
          onclick: function () { openHash('atom', atom.id, nodes.atoms[atom.id]); } });
      }));

    append(body, [
      diagramBlocks(layer),
      /* Full width: these are long bullets, and one narrow track left three empty
         beside it. The list flows into columns so lines keep a readable measure. */
      block('What lives here', list(layer.bullets), true),
      layer.matrix ? block(layer.matrixTitle || 'Variants', matrixBlock(layer.matrix), true) : null,
      block('Gotchas', list(layer.gotchas, 'warn'), 'is-half'),
      /* Some layers own no atoms — Channels is all consumers, not primitives. Without
         that third block the bottom row would stop at 69%, so Docs takes the slack. */
      block('Docs', docLinks(layer.docs), atomPills ? null : 'is-half'),
      atomPills
    ]);
  }

  /* ---------- module pages ----------
     Two halves, kept visibly apart: `facts` were parsed from the module at a git ref, `notes` were
     authored. A module with no notes falls through to the registry-only page below, which is honest
     about knowing less. */

  /* A row of parsed facts. Deliberately plain: this is the half of the page no one wrote, and it
     should look like a readout rather than like prose. */
  function factRows(pairs) {
    return el('div', { class: 'fact-grid' }, pairs.filter(Boolean).map(function (pair) {
      return el('div', { class: 'fact-row' },
        el('span', { class: 'fact-key', text: pair[0] }),
        el('span', { class: 'fact-val' }, typeof pair[1] === 'string' ? rich(pair[1]) : pair[1]));
    }));
  }

  function depChipsFromProfile(p) {
    var req = (p.facts.dependsOn || []).map(function (d) {
      return el('span', { class: 'tag-chip', title: 'Required — ' + d.version, text: d.id.replace('VirtoCommerce.', '') });
    });
    var opt = (p.facts.optionalDependencies || []).map(function (d) {
      return el('span', { class: 'tag-chip is-optional', title: 'optional="true" in module.manifest — ' + d.version },
        d.id.replace('VirtoCommerce.', ''), el('span', { class: 'opt-mark', text: 'opt' }));
    });
    if (!req.length && !opt.length) {
      return el('p', { class: 'd-lead is-quiet' },
        rich('Nothing — `<dependencies/>` is empty in `module.manifest`, so this module can be installed on any host.'));
    }
    return el('div', { class: 'tag-row is-left' }, req, opt);
  }

  /* One vocabulary for every module's links, read off the URL instead of the README's wording:
     eleven modules called the same page eleven things. Specific pages come first — modules-installation
     lives under /user-guide/, so a generic rule above it would swallow it. */
  var REFERENCE_NAMES = [
    [/modules-installation/i, 'How to install a module'],
    [/deploy-module-from-source-code/i, 'How to deploy from source'],
    [/\/releases\/latest/i, 'Download the latest release'],
    [/github\.com\/VirtoCommerce\/[^/]+\/?$/i, 'Source code on GitHub'],
    [/swagger|urls\.primaryName=|\/docs\/index\.html/i, 'REST API reference'],
    [/graphql|playground|graphiql/i, 'GraphQL API reference'],
    [/docs\.virtocommerce\.org\/.*\/user-guide\//i, 'User documentation'],
    [/docs\.virtocommerce\.org\/.*\/developer-guide\//i, 'Developer documentation'],
    [/docs\.virtocommerce\.org/i, 'Documentation'],
    [/virtocommerce\.org\/?$/i, 'Community'],
    [/virtocommerce\.com\/?$/i, 'Virto Commerce']
  ];

  function referenceName(link) {
    for (var i = 0; i < REFERENCE_NAMES.length; i++) {
      if (REFERENCE_NAMES[i][0].test(link.href)) return REFERENCE_NAMES[i][1];
    }
    return String(link.label || link.href).replace(/\s*module\s*/i, ' ').replace(/\s+/g, ' ').trim();
  }

  /* Same URL twice under two labels is common — a README links GitHub in Documentation and again in
     References. First occurrence wins. */
  function referenceLinks(list) {
    var seen = {}, out = [];
    list.forEach(function (l) {
      if (!l || !l.href) return;
      var key = l.href.replace(/\/+$/, '');
      if (seen[key]) return;
      seen[key] = true;
      out.push({ label: referenceName(l), href: l.href });
    });
    return out;
  }

  function renderModuleProfileDrawer(molecule, p) {
    var eyebrow = document.getElementById('drawer-eyebrow');
    eyebrow.textContent = '';
    append(eyebrow, [
      molecule.group ? el('span', { class: 'mol-group is-' + molecule.group, text: molecule.group }) : null,
      el('span', { text: '· ' + p.id }),
      el('span', { text: '· ' + p.latestVersion }),
      p.facts.platformVersion ? el('span', { text: '· platform ' + p.facts.platformVersion }) : null
    ].filter(Boolean));

    var title = document.getElementById('drawer-title');
    title.textContent = '';
    append(title, [moduleIcon(p.id, 26), el('span', { text: p.name })]);

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    if (p.tagline && p.tagline.toLowerCase() !== p.name.toLowerCase()) {
      append(body, el('p', { class: 'd-lead' }, rich(p.tagline)));
    }

    var n = p.notes || {};
    var f = p.facts;

    append(body, [
      p.readme.overview ? block('Overview', el('p', { class: 'dg-cap' }, rich(p.readme.overview)), true) : null,

      n.forAnalyst || n.forArchitect || n.forDeveloper
        ? block('What it means for you', factRows([
            n.forAnalyst ? ['Business analyst', n.forAnalyst] : null,
            n.forArchitect ? ['Solution architect', n.forArchitect] : null,
            n.forDeveloper ? ['Developer', n.forDeveloper] : null
          ]), true)
        : null,

      (p.readme.keyFeatures || []).length ? block('Key features', list(p.readme.keyFeatures), true) : null,

      /* A matched pair, half width each: they are read against one another. */
      (n.reachForItWhen || []).length ? block('Reach for it when', list(n.reachForItWhen, 'good'), 'is-half') : null,
      (n.doNotReachForItWhen || []).length ? block('Do not reach for it when', list(n.doNotReachForItWhen, 'bad'), 'is-half') : null,

      /* One readout for the whole module. Dependencies lead it: whether this module can be deployed
         on its own is the first thing a solution architect needs. Counts are gone from the rows —
         "4 — A, B, C, D" made the reader check arithmetic instead of reading names. */
      block('Module summary', factRows([
        ['Depends on', depChipsFromProfile(p)],
        (f.databaseProviders || []).length ? ['Databases', f.databaseProviders.join(' · ')] : null,
        (f.permissions || []).length ? ['Permissions', f.permissions.map(function (x) { return '`' + x + '`'; }).join(' ')] : null,
        (f.settings || []).length ? ['Settings', f.settings.map(function (x) { return '`' + x + '`'; }).join(' ')] : null,
        (f.entities || []).length ? ['Entities', f.entities.join(', ')] : null,
        /* Declared, not constructed: these are the events another module can subscribe to. */
        (f.declaredEvents || []).length ? ['Events it raises', f.declaredEvents.join(', ')]
          : ((f.domainEventsPublished || []).length ? ['Events it raises', f.domainEventsPublished.join(', ')] : null),
        (f.handledEvents || []).length ? ['Events handled', f.handledEvents.join(', ')]
          : (f.subscribesDynamically ? ['Events handled', 'chosen at runtime through `IEventHandlerRegistrar` — every domain event in the process is available'] : null),
        f.graphqlBuilderCount ? ['GraphQL', f.graphqlBuilderCount + ' schema builders'] : null,
        f.indexDocumentBuilderCount ? ['Search index', 'feeds it — bulk writes need a reindex'] : null,
        (f.localizations || []).length ? ['Languages', f.localizations.join(' ')] : null
      ]), true),

      /* Paired with Reference below: two half-width blocks close the page on one row. */
      (n.owns || []).length ? block('EF Core entities', list(n.owns), 'is-half') : null,

      /* Source first, then documentation, then the how-tos. Every label is derived from its URL, so
         the same kind of link is called the same thing on all 96 module pages. */
      block('Reference', docLinks(referenceLinks(
        [{ label: 'Source code on GitHub', href: p.repoUrl }]
          .concat((p.documentation && p.documentation.links) || [])
          .concat(p.readme.docs || [])
          .concat(p.readme.references || [])
      ).filter(function (l) {
        return !/^(Virto Commerce|Community)$/.test(l.label);
      }).slice(0, 8)), 'is-half')
    ]);

    append(body, el('div', { class: 'd-meta' },
      rich('Facts parsed from `' + p.repo + '` at `' + (f.git && (f.git.ref || f.git.branch) || '?') + '`' +
           (f.git && f.git.sha ? ' (' + f.git.sha + ')' : '') +
           (f.git && f.git.lastCommitDate ? ', last commit ' + f.git.lastCommitDate : '') +
           ' · extracted ' + p.extractedAt + ' by `' + p.extractedBy + '`' +
           (n.forAnalyst ? ' · notes authored' : ' · notes not written yet'))));
  }

  function renderModuleMoleculeDrawer(molecule) {
    var p = profileOf(molecule.moduleId);
    if (p) { renderModuleProfileDrawer(molecule, p); return; }

    /* No profile yet: the registry still knows identity, release and dependencies. */
    var eyebrow = document.getElementById('drawer-eyebrow');
    eyebrow.textContent = '';
    append(eyebrow, [
      el('span', { class: 'mol-group is-' + molecule.group, text: molecule.group }),
      el('span', { text: '· ' + molecule.moduleId }),
      el('span', { text: '· ' + molecule.version })
    ]);
    document.getElementById('drawer-title').textContent = molecule.name;

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    if (molecule.sub && molecule.sub.toLowerCase() !== molecule.name.toLowerCase()) {
      append(body, el('p', { class: 'd-lead' }, rich(molecule.sub)));
    }
    append(body, el('div', { class: 'd-note' },
      el('strong', { class: 'd-note-label', text: 'From the registry' }),
      rich(' — identity, release and dependencies below are what `modules_v3.json` records for this' +
           ' module. Run `node tools/module-profile.js ' + (molecule.repo || '').replace('https://github.com/VirtoCommerce/', '') +
           ' --ref origin/dev` to profile it.')));

    append(body, [
      block('Depends on', el('div', { class: 'tag-row is-left' },
        (molecule.dependsOn || []).map(function (name) { return el('span', { class: 'tag-chip', text: name }); }),
        (molecule.optional || []).map(function (name) {
          return el('span', { class: 'tag-chip is-optional' }, name, el('span', { class: 'opt-mark', text: 'opt' }));
        })), true),
      block('Reference', docLinks([
        molecule.repo ? { label: 'Source code on GitHub', href: molecule.repo } : null,
        { label: 'Module registry entry', href: 'https://github.com/VirtoCommerce/vc-modules/blob/master/modules_v3.json' }
      ].filter(Boolean)), 'is-half')
    ]);
  }

  /* ---------- feature rendering ----------
     One row shape, used on package pages, in the builder and in the feature drawer itself: a status
     glyph, the business name, the one-line promise, and — when the feature is not there — what would
     have to be installed for it to be. */
  var FEATURE_GLYPH = { in: '✓', part: '◐', out: '+' };

  /* Two names for a module, and they are not interchangeable. The friendly one reads in a sentence;
     the id form is what goes in a manifest — and it is short, which matters in a badge. */
  function moduleTag(id) { return id.replace('VirtoCommerce.', ''); }

  function moduleShort(id) {
    var p = profileOf(id);
    return (p && p.name) || id.replace('VirtoCommerce.', '');
  }

  function featureRow(f, has, showMissing, onPick, hint) {
    var st = featureState(f, has);
    var extra = hint ? hint(f, st) : null;
    return el('button', {
      type: 'button', class: 'feat-row is-' + st.status + (onPick ? ' is-pick' : ''),
      title: (onPick ? (st.status === 'in' ? 'Remove ' : 'Add ') + f.name + ' — ' : f.name + ' — needs ') +
        (extra || featureSlots(f).map(function (slot) {
          return slot.map(moduleShort).join(' or ');
        }).join(' + ')),
      onclick: onPick ? function () { onPick(f, st); } : function () { openHash('feature', f.id, null); }
    },
      el('span', { class: 'feat-glyph', text: FEATURE_GLYPH[st.status], 'aria-hidden': 'true' }),
      el('span', { class: 'feat-name', text: f.name }),
      /* The badge precedes the blurb on purpose: the blurb takes a whole line, so anything after it
         lands on a third one. Name then price then description also happens to be the reading order
         a buyer wants. */
      showMissing && st.missing.length
        ? el('span', { class: 'feat-add', text: '+ ' + st.missing.map(moduleTag).join(' + ') })
        : null,
      el('span', { class: 'feat-blurb', text: f.blurb }));
  }

  /* Categories in the order content/features.js declares them, each with its own count, because a
     flat list of eighty rows is a wall and the categories are how a stakeholder scans it. */
  function featureGroups(features, has, showMissing, onPick, hint) {
    return el('div', { class: 'feat-groups' }, groupFeatures(features).map(function (g) {
      return el('div', { class: 'feat-group' },
        el('div', { class: 'feat-group-head' },
          el('span', { class: 'feat-group-name', text: g.category }),
          el('span', { class: 'feat-group-n', text: String(g.features.length) })),
        el('div', { class: 'feat-group-body' }, g.features.map(function (f) {
          return featureRow(f, has, showMissing, onPick, hint);
        })));
    }));
  }

  function renderFeatureDrawer(f) {
    var eyebrow = document.getElementById('drawer-eyebrow');
    eyebrow.textContent = '';
    append(eyebrow, [
      el('span', { class: 'cell-split is-yes', text: 'Business feature' }),
      el('span', { text: '· ' + f.category })
    ]);
    document.getElementById('drawer-title').textContent = f.name;

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    append(body, el('p', { class: 'd-lead' }, rich(f.blurb)));

    /* What it needs, slot by slot. An any-of slot is drawn as one row with alternatives, because the
       distinction between "you need all of these" and "you need one of these" is the whole reason a
       package with Algolia is not missing search. */
    var slots = featureSlots(f);
    var needs = el('div', { class: 'feat-needs' }, slots.map(function (slot) {
      return el('div', { class: 'feat-need' + (slot.length > 1 ? ' is-any' : '') },
        el('span', { class: 'feat-need-kind', text: slot.length > 1 ? 'any one of' : 'required' }),
        el('span', { class: 'feat-need-mods' }, slot.map(moduleChip)));
    }));

    /* Where it ships. This is the question a salesperson actually has — and the answer is computed
       from the package manifests, so it cannot flatter the product. */
    var where = el('div', { class: 'feat-where' }, CELLS.map(function (c) {
      /* Closed set, same as the package pages: a dependency the manifest leaves implicit still ships. */
      var st = featureState(f, moduleSet(pbcDependencyClosure(c.modules || []).ids));
      return el('button', {
        type: 'button', class: 'feat-where-row is-' + st.status,
        title: 'Open ' + c.name,
        onclick: function () { openHash('cell', c.id, null); }
      },
        el('span', { class: 'feat-glyph', text: FEATURE_GLYPH[st.status], 'aria-hidden': 'true' }),
        el('span', { class: 'feat-where-name', text: c.name }),
        el('span', { class: 'feat-where-text',
          text: st.status === 'in' ? 'included'
            : st.status === 'part' ? st.met + ' of ' + st.total + ' slots — add ' + st.missing.map(moduleTag).join(' + ')
            : 'add ' + st.missing.map(moduleTag).join(' + ') }));
    }));

    append(body, [
      block('What has to be installed', needs, true),
      block('Where it ships today', where, true),
      block('Build a package around it', el('div', {},
        el('p', { class: 'dg-cap' }, rich('The custom PBC builder can start from this feature: it ticks the ' +
          'modules above, closes their dependencies and writes the manifest.')),
        el('button', { type: 'button', class: 'chip',
          onclick: function () {
            customPick = {};
            customStarted = true;
            featureState(f, {}).missing.forEach(function (id) { customPick[id] = true; });
            openHash('cell', CUSTOM_PBC.id, null);
          } },
          el('span', { class: 'glyph', text: '◆', 'aria-hidden': 'true' }),
          'Build custom PBC from this feature')), true)
    ]);

    append(body, el('div', { class: 'd-meta' },
      rich('Feature `' + f.id + '` — authored in `content/features.js`, module ids checked against the ' +
           'active registry by `check-content.js`')));
  }

  function renderCellDrawer(cell) {
    if (cell.id === 'custom') { renderCustomPbcDrawer(); return; }

    /* The feature catalogue against this package: what it has, and how much of it is half there. What
       it does NOT have is deliberately absent from this page — a published package is fixed, so a list
       of 23–46 things to add was advice the reader could not act on here. The builder carries it, with
       every feature and a live status, and one button below hands this package over to it. */
    var cellFeatures = (function () {
      /* Against what actually gets installed, not against what the manifest lists. Purchase names 31
         modules but five of them require Catalog, XCatalog, Seo, Export and the file API, so a
         Purchase install has a catalogue whether the file mentions one or not. Counting the manifest
         alone understated it by nine features — and made this page disagree with the builder, which
         has always closed dependencies. The schema, the module count and the evidence list still
         follow the manifest: that is composition, and this is capability. */
      var closed = pbcDependencyClosure(cell.modules || []);
      var has = moduleSet(closed.ids);
      var included = [], partial = [];
      FEATURES.forEach(function (f) {
        var st = featureState(f, has);
        if (st.status === 'in') included.push(f);
        else if (st.status === 'part') partial.push(f);
      });
      return { has: has, included: included, partial: partial, pulled: closed.added };
    })();

    var eyebrow = document.getElementById('drawer-eyebrow');
    eyebrow.textContent = '';
    append(eyebrow, [
      el('span', { class: 'cell-split is-yes', text: 'Packaged Business Capability' }),
      el('span', { text: '· ' + cell.moduleCount + ' modules' }),
      el('span', { text: '· ' + cellFeatures.included.length + ' of ' + FEATURES.length + ' business features' }),
      cell.platformVersion ? el('span', { text: '· platform ' + cell.platformVersion }) : null
    ].filter(Boolean));
    document.getElementById('drawer-title').textContent = cell.name;

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    append(body, el('p', { class: 'd-lead' }, rich(cell.sub || '')));

    append(body, [
      /* Virto's own words, in the order a reader needs them: what a PBC is, then what this one is for.
         The provenance line at the foot of the page already says where the module list came from, so
         nothing needs to say it up here. */
      block('What a PBC is, and what this one is for', el('div', {},
        el('p', { class: 'dg-cap' }, rich(cell.intro || '')),
        cell.overview ? el('p', { class: 'dg-cap' }, rich('**' + cell.name + '.** ' + cell.overview)) : null
      ), true),

      /* What the business gets, then the modules that back it. The bullets are authored and checked
         against the package's own module list; the evidence lines are each module's own business
         sentence, so a claim is one click from the thing that implements it and nothing here needs
         maintaining twice. */
      (cell.businessOutcomes || []).length
        ? block('What the business gets', list(cell.businessOutcomes, 'good'), true)
        : null,

      /* The feature catalogue, applied to this package's module set. Nothing here is authored per
         package: a feature is included when the modules it needs are present, which means this list
         changes the moment a manifest does. */
      cellFeatures.included.length
        ? block('Business features included', el('div', {},
            el('p', { class: 'dg-cap' }, rich('**' + cellFeatures.included.length + ' of ' + FEATURES.length +
              '** catalogued business features work with this package as it installs' +
              (cellFeatures.partial.length ? ', and ' + cellFeatures.partial.length + ' more are partly there' : '') + '. ' +
              (cellFeatures.pulled.length
                ? 'That counts ' + cellFeatures.pulled.length + ' module(s) the manifest does not name but its ' +
                  'modules require, so an install brings them anyway: ' +
                  cellFeatures.pulled.map(function (id) { return '`' + moduleTag(id) + '`'; }).join(' ') + '.'
                : ''))),
            featureGroups(cellFeatures.included, cellFeatures.has, false),
            /* A published package is a fixed thing, so this page does not shop: wanting more than it
               contains means building a package, and that is the builder's page. One line and one
               button, instead of the 23–46 rows of "add a module" this block used to carry — those
               belong where they can be acted on. */
            el('p', { class: 'dg-cap', style: 'margin-top:10px' },
              rich('Need more than this? A published package is fixed — **Build custom PBC** starts from these ' +
                   String(cell.moduleCount) + ' modules and lets you add the other ' +
                   String(FEATURES.length - cellFeatures.included.length) + ' features.')),
            el('div', { class: 'pbc-presets' },
              el('button', { type: 'button', class: 'chip is-template',
                title: 'Open the builder with this package already ticked',
                onclick: function () {
                  customPick = {};
                  customStarted = true;
                  (cell.modules || []).forEach(function (id) { customPick[id] = true; });
                  openHash('cell', CUSTOM_PBC.id, null);
                } },
                el('span', { class: 'glyph', text: '◆', 'aria-hidden': 'true' }),
                'Build custom PBC from ' + cell.name))), true)
        : null,

      block('How a request travels', pbcSchema(cell.layers), true),

      /* A table, not a list of cards: the reader is comparing modules against each other here, and a
         column of names beside a column of purposes is what comparison wants. The sentence in the
         second column is each module's own authored business line, so nothing is maintained twice. */
      (cell.businessEvidence || []).length
        ? block('Backed by these modules', el('div', { class: 'pbc-table-wrap' },
            el('table', { class: 'pbc-table' },
              el('thead', {}, el('tr', {},
                el('th', { scope: 'col', text: 'Module' }),
                el('th', { scope: 'col', text: 'What it does for the business' }))),
              el('tbody', {}, cell.businessEvidence.map(function (id) {
                var p = profileOf(id);
                var line = p && p.notes && p.notes.forAnalyst ? p.notes.forAnalyst
                  : (p && p.tagline) || '';
                var accent = MODULE_ACCENTS[id];
                return el('tr', { class: 'pbc-table-row', style: accent ? '--accent:' + accent : null },
                  el('th', { scope: 'row' },
                    el('button', {
                      type: 'button', class: 'pbc-table-link', title: 'Open ' + id,
                      onclick: function () { openHash('molecule', id, null); }
                    },
                      accent ? moduleIcon(id, 20) : null,
                      el('span', { class: 'pbc-table-name', text: (p && p.name) || moduleTag(id) }))),
                  /* The sentence sits in a span, not straight in the cell: a fixed-layout column
                     ignores max-width, and a 912px line of prose is a bad measure. */
                  el('td', { class: 'pbc-table-text' }, el('span', { class: 'pbc-table-line', text: line })));
              })))), true)
        : null,

      cell.unlisted && cell.unlisted.length
        ? block('Named in the package but not in the registry', list(cell.unlisted.map(function (id) {
            return '`' + id + '` — the package file is ahead of, or behind, the module registry';
          })), 'is-half')
        : null,

      block('Install it', el('div', {},
        el('p', { class: 'dg-cap' }, rich('A PBC is a package manifest in `vc-modules/pbc`, installed with the ' +
          'vc-build CLI. Versions in that file are ignored on this map — the tier documents composition, and a ' +
          'pinned version goes stale long before the module set does.')),
        snippetBlock({ lang: 'bash',
          code: 'vc-build install -PackageManifestPath "' + cell.manifest + '"' })), true),

      block('Reference', docLinks([
        { label: 'Package manifest on GitHub', href: cell.manifestUrl },
        { label: 'All PBC packages', href: 'https://github.com/VirtoCommerce/vc-modules/tree/master/pbc' },
        { label: 'PBC overview in the docs', href: 'https://docs.virtocommerce.org/platform/developer-guide/Getting-Started/Installation-Guide/pbcs/' }
      ]), 'is-half')
    ]);

    append(body, el('div', { class: 'd-meta' },
      rich('Install with `vc-build install -PackageManifestPath ' + cell.manifest + '` · ' +
           'generated from vc-modules master by `tools/build-cells.js`')));
  }

  /* ---------- build a custom PBC ----------
     The readme offers "your idea here"; this is that, made clickable. State is a set of module ids,
     the dependency graph is closed automatically, and the output is a manifest in the same shape as
     the published packages. */
  /* The default template: what every published PBC contains. Computed from the packages rather than
     listed, so it follows the manifests instead of drifting from them — today that is telemetry,
     storage, identity, the commerce core and both outbound channels. */
  function defaultTemplate() {
    if (!CELLS.length) return [];
    var sets = CELLS.map(function (c) { return c.modules || []; });
    return sets[0].filter(function (id) {
      return sets.every(function (list) { return list.indexOf(id) !== -1; });
    }).sort();
  }

  var customPick = {};
  var customStarted = false;

  function pbcDependencyClosure(ids) {
    /* Registry dependency names are short (`Catalog`), ids are long (`VirtoCommerce.Catalog`). */
    var byShort = {};
    MODULE_TILES.forEach(function (m) { byShort[m.moduleId.replace('VirtoCommerce.', '')] = m.moduleId; });

    var chosen = {}, added = [];
    ids.forEach(function (id) { chosen[id] = true; });
    var changed = true;
    while (changed) {
      changed = false;
      Object.keys(chosen).forEach(function (id) {
        var tile = null;
        for (var i = 0; i < MODULE_TILES.length; i++) if (MODULE_TILES[i].moduleId === id) { tile = MODULE_TILES[i]; break; }
        (tile && tile.dependsOn || []).forEach(function (shortName) {
          var dep = byShort[shortName];
          if (dep && !chosen[dep]) { chosen[dep] = true; added.push(dep); changed = true; }
        });
      });
    }
    return { ids: Object.keys(chosen).sort(), added: added };
  }

  /* The same rule tools/build-cells.js applies to a published package, so a module lands in the same
     band whether it arrived from a manifest or from a checkbox. Kept in one place because two copies
     would eventually disagree — offering a module in one group and drawing it in another. */
  var PBC_OUTBOUND = { 'VirtoCommerce.EventBus': 1, 'VirtoCommerce.WebHooks': 1, 'VirtoCommerce.Notifications': 1 };
  var PBC_XAPI_RE = /^VirtoCommerce\.(Xapi|X[A-Z]|ProfileExperienceApiModule|MarketingExperienceApi|FileExperienceApi|SalesRep|UCP)/;

  function layerOfModule(id) {
    var famOf = window.VC_MODULE_FAMILY || {};
    if (PBC_XAPI_RE.test(id)) return 'xapi';
    if (PBC_OUTBOUND[id]) return 'outbound';
    if (famOf[id] === 'integrations') return 'integration';
    if (famOf[id] === 'platform') return 'platform';
    return 'services';
  }

  function customLayers(ids) {
    var layers = { xapi: [], services: [], platform: [], integration: [], outbound: [] };
    ids.forEach(function (id) { layers[layerOfModule(id)].push(id); });
    return layers;
  }

  function renderCustomPbcDrawer() {
    /* First open lands on the template: an empty schema shows five empty bands and teaches nothing.
       Re-renders keep whatever the reader has picked since. */
    if (!customStarted) {
      customStarted = true;
      defaultTemplate().forEach(function (id) { customPick[id] = true; });
    }

    var eyebrow = document.getElementById('drawer-eyebrow');
    eyebrow.textContent = '';
    append(eyebrow, [el('span', { class: 'cell-split is-part', text: 'Build your own' }),
                     el('span', { text: '· composition, not a published package' })]);
    document.getElementById('drawer-title').textContent = 'Build custom PBC';

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    append(body, el('p', { class: 'd-lead' },
      rich('🔥 **Your idea here.** The readme offers to build a custom PBC for a business need; this is ' +
           'that offer, made clickable. Start from a published capability or from nothing, add what the ' +
           'business needs, and the package assembles itself — required dependencies are pulled in ' +
           'automatically, because a package missing one does not install.')));

    var schemaHost = el('div', {});
    var summaryHost = el('div', {});
    var manifestHost = el('div', {});
    var featureHost = el('div', {});
    var manifestOpen = false;   // folded on arrival; the toggle below unfolds it

    /* What the package holds right now, dependencies included. A function, not a value, because the
       module dialog stays open across redraws and has to see the set as it is. */
    function currentSet() {
      return moduleSet(pbcDependencyClosure(
        Object.keys(customPick).filter(function (k) { return customPick[k]; })).ids);
    }

    /* Which ticked modules would keep `id` in the package: the ones whose required closure reaches it.
       Walking the dependency graph upward is the only way to answer it — a module can arrive three
       levels below something the reader asked for. */
    function holdersOf(id, picked) {
      return picked.filter(function (p) {
        return p !== id && pbcDependencyClosure([p]).ids.indexOf(id) !== -1;
      });
    }

    /* Everything that has to go for feature `f` to actually be gone: the modules satisfying it, plus
       every ticked module that would drag one of them back in as a dependency. Removing the first
       group alone looked like a no-op whenever the module was a dependency of something else — the
       tick stayed lit and the reader clicked it again. */
    function featureRemovalSet(f, picked, has) {
      var targets = featureModules(f).filter(function (id) { return has[id]; });
      var out = {};
      targets.forEach(function (id) {
        out[id] = true;
        holdersOf(id, picked).forEach(function (p) { out[p] = true; });
      });
      return Object.keys(out);
    }

    /* Ticking a feature ticks its modules, which is how a business shops: nobody asks for
       `VirtoCommerce.Quote`, they ask to negotiate quotes. Unticking takes the whole chain with it —
       dependants included — because a feature that cannot be switched off is not a control. */
    function toggleFeature(f, st) {
      if (st.status === 'in') {
        var picked = Object.keys(customPick).filter(function (k) { return customPick[k]; });
        featureRemovalSet(f, picked, moduleSet(pbcDependencyClosure(picked).ids))
          .forEach(function (id) { delete customPick[id]; });
      } else st.missing.forEach(function (id) { customPick[id] = true; });
      redraw();
    }

    /* The tooltip says what a click costs before it costs it: removing "Product catalogue" from a
       package that quotes also removes Quotes, and that should not be a surprise. */
    function featureHint(f, st) {
      if (st.status !== 'in') return null;
      var picked = Object.keys(customPick).filter(function (k) { return customPick[k]; });
      var going = featureRemovalSet(f, picked, moduleSet(pbcDependencyClosure(picked).ids));
      return going.length
        ? 'removes ' + going.map(moduleTag).join(', ') + ' and anything only they required'
        : null;
    }

    function redraw() {
      var picked = Object.keys(customPick).filter(function (k) { return customPick[k]; });
      var closed = pbcDependencyClosure(picked);
      /* Status is read from the closed set, not the ticked one: a dependency pulled in automatically
         counts towards a feature exactly as a deliberate tick does. */
      var has = moduleSet(closed.ids);
      var inCount = 0, partCount = 0;
      FEATURES.forEach(function (f) {
        var s = featureState(f, has);
        if (s.status === 'in') inCount++; else if (s.status === 'part') partCount++;
      });

      schemaHost.textContent = '';
      append(schemaHost, pbcSchema(customLayers(closed.ids), {
        onAdd: function (layer, trigger) {
          openModulePicker({ layer: layer, trigger: trigger, has: currentSet, onPick: function (id) {
            customPick[id] = true;
            redraw();
          } });
        },
        /* Which ticked module is holding this one, if the reader did not ask for it directly. */
        heldBy: function (id) {
          if (customPick[id]) return null;
          var holders = picked.filter(function (p) {
            return p !== id && pbcDependencyClosure([p]).ids.indexOf(id) !== -1;
          }).map(moduleTag);
          return holders.length ? holders.slice(0, 3).join(', ') : 'another module';
        },
        onRemove: function (id) { delete customPick[id]; redraw(); }
      }));

      /* An open dialog is showing a list that just changed underneath it. */
      if (pickerHost && pickerHost.redraw) pickerHost.redraw();

      featureHost.textContent = '';
      append(featureHost, featureGroups(FEATURES, has, true, toggleFeature, featureHint));

      summaryHost.textContent = '';
      var fromTemplate = template.filter(function (id) { return customPick[id]; }).length;
      append(summaryHost, factRows([
        ['Chosen', picked.length ? String(picked.length) + ' module(s)' : 'nothing yet — pick a capability below'],
        ['Business features', inCount + ' of ' + FEATURES.length + ' included' +
          (partCount ? ', ' + partCount + ' partly there' : '')],
        fromTemplate ? ['Baseline', fromTemplate + ' of the ' + template.length +
          ' modules every published PBC includes — telemetry, storage, identity, the commerce core and both outbound channels'] : null,
        closed.added.length ? ['Pulled in', closed.added.length + ' required dependency(ies): ' +
          closed.added.map(function (id) { return '`' + id.replace('VirtoCommerce.', '') + '`'; }).join(' ')] : null,
        ['Package size', String(closed.ids.length) + ' modules in total']
      ]));

      /* The manifest arrives folded: the interesting part is the three header lines, and eighty
         `{ "Id": … }` rows push everything below them off the screen. Copy still takes the whole
         thing — a folded snippet that copies an ellipsis would be a trap. */
      manifestHost.textContent = '';
      var head = '{\n  "ManifestVersion": "2.0",\n  "PlatformVersion": "' +
        (META.platformVersion || '3.1058.0') + '",\n';
      var rows = closed.ids.map(function (id) { return '    { "Id": "' + id + '" }'; }).join(',\n');
      var full = head + '  "Modules": [\n' + rows + '\n  ]\n}';
      var folded = head + '  "Modules": [ … ' + closed.ids.length + ' modules … ]\n}';

      var snippet = snippetBlock({ lang: 'json', code: full, display: manifestOpen ? null : folded });

      /* The folded `"Modules": [ … ]` line is the obvious thing to click, so it is clickable — the
         chip stays for anyone who reads the label first. Only while folded: once the JSON is open,
         clicking it should select text, not throw the reader back to a summary. */
      if (!manifestOpen) {
        var pre = snippet.querySelector('pre');
        pre.classList.add('is-foldable');
        pre.setAttribute('role', 'button');
        pre.setAttribute('tabindex', '0');
        pre.title = 'Click to see the whole manifest (' + closed.ids.length + ' modules)';
        pre.addEventListener('click', function () { manifestOpen = true; redraw(); });
        pre.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') { manifestOpen = true; redraw(); event.preventDefault(); }
        });
      }

      append(manifestHost, [
        el('div', { class: 'pbc-presets', style: 'margin-bottom:6px' },
          el('button', { type: 'button', class: 'chip',
            'aria-expanded': manifestOpen ? 'true' : 'false',
            title: manifestOpen ? 'Fold the module list away' : 'Show every module in the manifest',
            onclick: function () { manifestOpen = !manifestOpen; redraw(); } },
            el('span', { class: 'glyph', text: manifestOpen ? '▾' : '▸', 'aria-hidden': 'true' }),
            manifestOpen ? 'Collapse module list' : 'Expand ' + closed.ids.length + ' modules')),
        snippet
      ]);
    }

    /* Preset buttons: start from a published PBC rather than from an empty page, which is how a real
       custom package begins. */
    var template = defaultTemplate();
    var presets = el('div', { class: 'pbc-presets' }, [
      /* First, and marked: the baseline every published package shares. */
      el('button', { type: 'button', class: 'chip is-template',
        title: 'The ' + template.length + ' modules every published PBC contains: ' +
               template.map(function (id) { return id.replace('VirtoCommerce.', ''); }).join(', ') },
        el('span', { class: 'glyph', text: '◆', 'aria-hidden': 'true' }),
        'Default template',
        el('span', { class: 'chip-n', text: String(template.length) }))
    ].concat(CELLS.map(function (c) {
      return el('button', { type: 'button', class: 'chip', text: c.name,
        title: 'Start from ' + c.name + ' (' + c.moduleCount + ' modules)',
        onclick: function () {
          customPick = {};
          (c.modules || []).forEach(function (id) { customPick[id] = true; });
          renderCustomPbcDrawer();
        } });
    })).concat([
      el('button', { type: 'button', class: 'chip', text: 'Clear',
        title: 'Start from nothing',
        onclick: function () { customPick = {}; renderCustomPbcDrawer(); } })
    ]));

    /* The template button has to be wired after creation: it resets to the template rather than to a
       published package, and the chip above carries child nodes rather than a text label. */
    presets.firstChild.addEventListener('click', function () {
      customPick = {};
      template.forEach(function (id) { customPick[id] = true; });
      renderCustomPbcDrawer();
    });

    /* The 96-checkbox list that used to sit at the foot of this page is gone. Everything it could do is
       now done where the reader is already looking: the + tile in each band opens a dialog scoped to
       that band, and a feature ticks its own modules. A third control over the same state was one
       more thing to keep in sync and one more reason to scroll. */

    append(body, [
      block('Start from', presets, true),
      block('What it becomes', schemaHost, true),
      block('Package', summaryHost, 'is-half'),
      /* The business question, and the only list on the page now: a reader who never touches the
         schema still gets an installable package out of it. */
      block('Pick business features', el('div', {},
        el('p', { class: 'dg-cap' }, rich('Click a feature to add the modules it needs — ✓ means the package has ' +
          'it, ◐ means part of it is there. Clicking a ✓ takes it back out, along with anything that was ' +
          'only there to support it; hover a ✓ to see what would go.')),
        featureHost), true),
      block('Manifest for vc-build', manifestHost, true)
    ]);

    redraw();
  }

  function renderMoleculeDrawer(molecule) {
    if (molecule.kind === 'module') { renderModuleMoleculeDrawer(molecule); return; }

    document.getElementById('drawer-eyebrow').textContent = 'Molecule · reserved';
    document.getElementById('drawer-title').textContent = molecule.name;

    var body = document.getElementById('drawer-body');
    clearDrawerBody(body);

    append(body, el('p', { class: 'd-lead' }, rich(molecule.sub || '')));
    append(body, el('div', { class: 'd-note' },
      el('strong', { class: 'd-note-label', text: 'Reserved' }),
      ' — this molecule is a placeholder. The tile exists so the shape of the whole picture is visible; the content is not written yet.'));

    append(body, [
      block('Planned contents', list(molecule.planned)),
      block('Material that already exists', docLinks(molecule.docs)),
      pills('Atoms it will compose', (molecule.atoms || []).map(function (ref) {
        var atom = byId(ATOMS, ref);
        return atom ? el('button', { type: 'button', class: 'pill', text: atom.name,
          onclick: function () { openHash('atom', atom.id, nodes.atoms[atom.id]); } }) : null;
      }).filter(Boolean))
    ]);
  }

  // ---------------------------------------------------------------- open / close

  /* Where "close" goes back to, deepest last. A module opened from a package page is a step deeper,
     not a new place: closing it should land back on the package the reader was reading, and only a
     second close should return to the poster. `fromDrawer` is what tells the two apart — a link
     inside the panel pushes, a tile on the poster starts fresh. */
  var navStack = [];
  var fromDrawer = false;

  function navLabel(entry) {
    if (!entry) return null;
    var item = entry.kind === 'cell' ? (byId(CELLS, entry.id) || (entry.id === CUSTOM_PBC.id ? CUSTOM_PBC : null))
      : entry.kind === 'feature' ? featureById(entry.id)
      : entry.kind === 'atom' ? byId(ATOMS, entry.id)
      : entry.kind === 'layer' ? byId(LAYERS, entry.id)
      : byId(MOLECULES, entry.id);
    return (item && item.name) || entry.id;
  }

  /* The close button says which it is, because a ✕ that navigates somewhere is a lie. */
  function syncCloseButton() {
    var button = document.getElementById('drawer-close');
    var back = navStack.length ? navStack[navStack.length - 1] : null;
    button.textContent = back ? '↩' : '✕';
    button.title = back ? 'Back to ' + navLabel(back) + ' ( Esc )' : 'Close details ( Esc )';
    button.setAttribute('aria-label', back ? 'Back to ' + navLabel(back) : 'Close details (Esc)');
  }

  function openHash(kind, id, trigger) {
    lastTrigger = trigger || lastTrigger;
    var next = '#/' + kind + '/' + id;
    var same = state.open && state.open.kind === kind && state.open.id === id;
    if (!fromDrawer) navStack.length = 0;          // a poster tile is a fresh start, not a step deeper
    else if (state.open && !same) navStack.push(state.open);
    if (location.hash === next) openFromHash();
    else location.hash = next;
  }

  function clearActive() {
    [nodes.atoms, nodes.layers, nodes.cells, nodes.molecules].forEach(function (group) {
      Object.keys(group).forEach(function (key) { group[key].classList.remove('is-active'); });
    });
  }

  function openFromHash() {
    /* Any navigation ends the dialog: it belongs to the page that opened it. */
    closeModulePicker();

    var match = /^#\/(atom|layer|cell|molecule|feature)\/(.+)$/.exec(location.hash || '');
    if (!match) { closeDrawer(true); return; }

    var kind = match[1];
    var id = decodeURIComponent(match[2]);
    /* Module tiles are addressed by module id — #/molecule/VirtoCommerce.Core. A link written against
       the old derived slug (#/molecule/mod-core) still resolves through the second lookup, so nothing
       already pasted goes dead; the address bar then shows the id form. */
    var item = kind === 'atom' ? byId(ATOMS, id)
      : kind === 'layer' ? byId(LAYERS, id)
      : kind === 'cell' ? (byId(CELLS, id) || (id === CUSTOM_PBC.id ? CUSTOM_PBC : null))
      : kind === 'feature' ? featureById(id)
      : byId(MOLECULES, id) || (function () {
          for (var i = 0; i < MOLECULES.length; i++) {
            if (MOLECULES[i].slug === id) return MOLECULES[i];
          }
          return null;
        })();

    /* A legacy slug resolves, then rewrites itself to the canonical id so the address bar and any
       copied link agree from that point on. */
    if (item && kind === 'molecule' && item.id !== id) {
      location.replace('#/molecule/' + encodeURIComponent(item.id));
      return;
    }

    if (!item) {
      document.getElementById('drawer-eyebrow').textContent = 'Not found';
      document.getElementById('drawer-title').textContent = id;
      var body = document.getElementById('drawer-body');
      clearDrawerBody(body);
      append(body, el('p', { class: 'empty' }, 'No ' + kind + ' with id "' + id + '" exists in the content files.'));
      showDrawer();
      return;
    }

    clearActive();
    if (kind === 'cell') {
      renderCellDrawer(item);
      if (nodes.cells[id]) nodes.cells[id].classList.add('is-active');
    } else if (kind === 'feature') {
      /* A feature has no tile of its own — it is reached from a package page or the builder — so
         nothing lights up on the poster behind it. */
      renderFeatureDrawer(item);
    } else if (kind === 'atom') {
      renderAtomDrawer(item);
      if (nodes.atoms[id]) nodes.atoms[id].classList.add('is-active');
      if (item.layer && nodes.layers[item.layer]) nodes.layers[item.layer].classList.add('is-active');
    } else if (kind === 'layer') {
      renderLayerDrawer(item);
      if (nodes.layers[id]) nodes.layers[id].classList.add('is-active');
    } else {
      renderMoleculeDrawer(item);
      if (nodes.molecules[id]) nodes.molecules[id].classList.add('is-active');
    }

    /* Browser back walks the same path the stack records, so if the new location is what the stack was
       holding, that step has been taken — drop it instead of letting it queue up behind the reader. */
    var top = navStack.length ? navStack[navStack.length - 1] : null;
    if (top && top.kind === kind && top.id === id) navStack.pop();

    state.open = { kind: kind, id: id };
    syncCloseButton();
    showDrawer();
  }

  function showDrawer() {
    drawer.hidden = false;
    scrim.hidden = false;
    // First point at which a topology has a box to measure: the panel was hidden until now.
    redrawTopologies();
    drawer.querySelector('.drawer-body').scrollTop = 0;
    var title = document.getElementById('drawer-title');
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  }

  /* Expanded mode is sticky: someone who wants the room usually wants it for the
     next atom too, so it survives closing the drawer and reloading the page. */
  function setExpanded(expanded) {
    drawer.classList.toggle('is-full', expanded);
    // The grid tracks change width with the panel, so every turn point moves.
    redrawTopologies();
    // Full-screen covers the poster entirely, so it genuinely is modal there.
    drawer.setAttribute('aria-modal', expanded ? 'true' : 'false');

    var button = document.getElementById('drawer-expand');
    button.textContent = expanded ? '⤡' : '⤢';
    button.setAttribute('aria-pressed', expanded ? 'true' : 'false');
    button.title = (expanded ? 'Collapse to side panel' : 'Expand to full screen') + ' ( f )';
    button.setAttribute('aria-label', expanded
      ? 'Collapse details panel back to the side'
      : 'Expand details panel to full screen');

    try { localStorage.setItem('vc-atomic-map-drawer-full', expanded ? '1' : '0'); } catch (e) { /* ignore */ }
  }

  function toggleExpanded() {
    setExpanded(!drawer.classList.contains('is-full'));
  }

  function closeDrawer(silent) {
    /* One step back before closing: a reader who opened a module from a package page expects to land
       on that package again, not on the poster with their place lost. */
    if (!silent && navStack.length) {
      var back = navStack.pop();
      location.hash = '#/' + back.kind + '/' + encodeURIComponent(back.id);
      return;
    }

    drawer.hidden = true;
    scrim.hidden = true;
    clearActive();
    state.open = null;
    navStack.length = 0;
    syncCloseButton();
    if (!silent && location.hash) location.hash = '';
    if (lastTrigger && document.body.contains(lastTrigger)) lastTrigger.focus();
  }

  // ---------------------------------------------------------------- keyboard

  function visibleTiles() {
    return Array.prototype.filter.call(document.querySelectorAll('.tile'), function (tile) {
      return !tile.classList.contains('is-dim');
    });
  }

  function moveTileFocus(delta, absolute) {
    var tiles = visibleTiles();
    if (!tiles.length) return;
    var index = tiles.indexOf(document.activeElement);
    var next;
    if (absolute === 'first') next = 0;
    else if (absolute === 'last') next = tiles.length - 1;
    else if (index === -1) next = 0;
    else next = Math.min(tiles.length - 1, Math.max(0, index + delta));
    tiles[next].focus();
  }

  document.addEventListener('keydown', function (event) {
    var target = event.target;
    var typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

    /* The module dialog is the innermost thing open, so it answers Escape first — otherwise one press
       would shut the whole panel behind it. Nothing else on the page listens while it is up. */
    if (pickerHost) {
      if (event.key === 'Escape') { closeModulePicker(); event.preventDefault(); }
      return;
    }

    if (event.key === 'Escape') {
      if (!drawer.hidden) { closeDrawer(); event.preventDefault(); }
      else if (state.query) { setQuery(''); document.getElementById('search').focus(); event.preventDefault(); }
      return;
    }
    if (typing) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    if (event.key === '/') { document.getElementById('search').focus(); event.preventDefault(); return; }
    if (event.key === '?') { toggleLegend(); event.preventDefault(); return; }
    if ((event.key === 'f' || event.key === 'F') && !drawer.hidden) {
      toggleExpanded(); event.preventDefault(); return;
    }

    if (target && target.classList && target.classList.contains('tile')) {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { moveTileFocus(1); event.preventDefault(); }
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { moveTileFocus(-1); event.preventDefault(); }
      else if (event.key === 'Home') { moveTileFocus(0, 'first'); event.preventDefault(); }
      else if (event.key === 'End') { moveTileFocus(0, 'last'); event.preventDefault(); }
    }
  });

  // ---------------------------------------------------------------- wiring

  function setQuery(value) {
    state.query = value;
    var input = document.getElementById('search');
    if (input.value !== value) input.value = value;
    applyFilter();
  }

  function toggleLegend() {
    var legend = document.getElementById('legend');
    var button = document.getElementById('legend-toggle');
    var show = legend.hidden;
    legend.hidden = !show;
    button.setAttribute('aria-expanded', show ? 'true' : 'false');
  }

  var THEMES = { auto: { next: 'light', glyph: '◐', label: 'Theme: follows system' },
                 light: { next: 'dark', glyph: '☀', label: 'Theme: light' },
                 dark: { next: 'auto', glyph: '☾', label: 'Theme: dark' } };

  function setTheme(name) {
    var theme = THEMES[name] ? name : 'auto';
    document.documentElement.setAttribute('data-theme', theme);
    var button = document.getElementById('theme-toggle');
    button.textContent = THEMES[theme].glyph;
    button.title = THEMES[theme].label + ' — click for ' + THEMES[theme].next;
    button.setAttribute('aria-label', THEMES[theme].label + '. Activate for ' + THEMES[theme].next + ' theme.');
    try { localStorage.setItem('vc-atomic-map-theme', theme); } catch (e) { /* file:// or blocked storage */ }
  }

  function init() {
    renderLegend();
    renderFilters();
    renderArchitecture();
    renderAtoms();
    renderMolecules();
    renderCells();
    renderBrand();
    renderFooter();
    applyFilter();

    document.getElementById('search').addEventListener('input', function (event) { setQuery(event.target.value); });
    document.getElementById('search-clear').addEventListener('click', function () {
      setQuery('');
      document.getElementById('search').focus();
    });
    document.getElementById('legend-toggle').addEventListener('click', toggleLegend);
    /* Capture phase, so this runs before the clicked control's own handler and openHash can tell a
       link inside the panel (a step deeper) from a tile on the poster (a fresh start). */
    document.addEventListener('click', function (event) {
      fromDrawer = !!(event.target && event.target.closest && event.target.closest('#drawer-body'));
    }, true);

    document.getElementById('drawer-close').addEventListener('click', function () { closeDrawer(); });
    document.getElementById('drawer-expand').addEventListener('click', toggleExpanded);
    /* Clicking away is "get me out", not "go back one" — the scrim drops the whole trail. */
    scrim.addEventListener('click', function () { navStack.length = 0; closeDrawer(); });

    var wasFull = '0';
    try { wasFull = localStorage.getItem('vc-atomic-map-drawer-full') || '0'; } catch (e) { /* ignore */ }
    setExpanded(wasFull === '1');

    var stored = 'auto';
    try { stored = localStorage.getItem('vc-atomic-map-theme') || 'auto'; } catch (e) { /* ignore */ }
    setTheme(stored);
    document.getElementById('theme-toggle').addEventListener('click', function () {
      setTheme(THEMES[document.documentElement.getAttribute('data-theme')] ?
        THEMES[document.documentElement.getAttribute('data-theme')].next : 'light');
    });

    window.addEventListener('hashchange', openFromHash);
    if (location.hash) openFromHash();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* ---------- hidden toggles, shared with the other presentations ----------
     b = bubbles, c = a ginger cat that naps until the pointer comes near. Copied from
     presentations/virto-cloud.html; the only local changes are where the cat perches (there are no
     slides here, so it sits on the poster's top-right corner) and the bubble colours, which come
     from the map's own tokens instead of a hard-coded blue. */
  function typingInAField(e) {
    var el = e.target, tag = (el && el.tagName) || '';
    return tag === 'INPUT' || tag === 'TEXTAREA' || (el && el.isContentEditable);
  }

  /* One napping animal, parameterised: which element, which key, which corner, and the class prefix its
     SVG parts use. The cat and the dog differ only in those four things, and a copy of forty lines
     would have drifted the moment one of them was tweaked. */
  function napOnCorner(opts) {
    var el = document.getElementById(opts.id);
    if (!el) return;

    function place() {
      var host = document.querySelector('main') || document.body;
      var r = host.getBoundingClientRect();
      el.style.left = (opts.corner === 'left'
        ? Math.round(r.left + 18)
        : Math.round(r.right - el.offsetWidth - 26)) + 'px';
      el.style.top = Math.round(r.top - el.offsetHeight + 34) + 'px';
    }

    var pupils = el.querySelectorAll('.' + opts.prefix + '-pupil');
    var WAKE = 250;   // px: a pointer closer than this wakes it
    addEventListener('mousemove', function (ev) {
      if (!el.classList.contains('show')) return;
      var r = el.getBoundingClientRect();
      var ex = r.left + opts.eye[0] * r.width, ey = r.top + opts.eye[1] * r.height;
      var dx = ev.clientX - ex, dy = ev.clientY - ey, d = Math.hypot(dx, dy);
      if (d > WAKE) { el.classList.add('sleeping'); return; }
      el.classList.remove('sleeping');
      var m = 2.6, ox = (dx / (d || 1) * m).toFixed(2), oy = (dy / (d || 1) * m).toFixed(2);
      pupils.forEach(function (pupil) { pupil.style.transform = 'translate(' + ox + 'px,' + oy + 'px)'; });
    });
    addEventListener('resize', function () { if (el.classList.contains('show')) place(); });
    addEventListener('scroll', function () { if (el.classList.contains('show')) place(); }, { passive: true });
    addEventListener('keydown', function (e) {
      if (typingInAField(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code !== opts.key) return;
      if (el.classList.contains('show')) el.classList.remove('show', 'sleeping');
      else { place(); el.classList.add('show', 'sleeping'); }
    });
  }

  /* c = the ginger cat on the right, d = the dog on the left. The eye coordinates are fractions of the
     SVG's own viewBox, which is why they differ: the two animals face opposite ways. */
  napOnCorner({ id: 'catEgg', key: 'KeyC', corner: 'right', prefix: 'cat', eye: [158 / 190, 58 / 112] });
  napOnCorner({ id: 'dogEgg', key: 'KeyD', corner: 'left', prefix: 'dog', eye: [42 / 190, 52 / 112] });

  (function bubbleToggle() {
    var cv = document.getElementById('bubbles');
    if (!cv) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W = 0, H = 0, dpr = 1, bubbles = [], running = false, raf = 0, t = 0;
    function mk(init) {
      var r = 1.5 + Math.random() * 3.2;
      return { x: Math.random() * W, y: init ? Math.random() * H : H + r + Math.random() * 30,
               r: r, v: .5 + Math.random() * 1.0, ph: Math.random() * 6.28, wob: .3 + Math.random() * .6 };
    }
    function size() {
      dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function seed() { bubbles = Array.from({ length: Math.max(28, Math.round(W / 16)) }, function () { return mk(true); }); }
    function burst() {
      var n = Math.max(18, Math.round(W / 26));
      for (var i = 0; i < n; i++) { var b = mk(false); b.y = H * (0.55 + Math.random() * 0.45); bubbles.push(b); }
    }
    /* --focus is the map's own accent, so the bubbles read as part of this poster rather than as a
       transplant from the deck they came from. */
    function ink(alpha) {
      var focus = getComputedStyle(document.documentElement).getPropertyValue('--focus').trim() || '#1668dc';
      return focus + (alpha === 'fill' ? '33' : '73');   // 20% / 45% as hex alpha
    }
    function frame() {
      ctx.clearRect(0, 0, W, H); t += 0.016;
      var fill = ink('fill'), stroke = ink('stroke');
      for (var i = 0; i < bubbles.length; i++) {
        var b = bubbles[i];
        b.y -= b.v; b.x += Math.sin(t * 0.9 + b.ph) * b.wob * 0.3;
        if (b.y + b.r < -4) bubbles[i] = mk(false);
        ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.283);
        ctx.fillStyle = fill; ctx.fill();
        ctx.lineWidth = 1; ctx.strokeStyle = stroke; ctx.stroke();
      }
      if (running && !reduce) raf = requestAnimationFrame(frame);
    }
    function start() { if (running) return; running = true; if (!W) size(); seed(); burst(); cv.style.opacity = '1'; frame(); }
    function stop() {
      running = false; cancelAnimationFrame(raf); cv.style.opacity = '0';
      setTimeout(function () { if (!running) ctx.clearRect(0, 0, W, H); }, 650);
    }
    addEventListener('resize', function () { if (running) { size(); seed(); } });
    addEventListener('keydown', function (e) {
      if (typingInAField(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code === 'KeyB') { if (running) stop(); else start(); }
    });
  })();

})();
