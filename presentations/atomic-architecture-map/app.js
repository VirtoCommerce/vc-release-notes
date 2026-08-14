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

  function pbcSchema(layers) {
    return el('div', { class: 'pbc-schema' }, PBC_LAYERS.map(function (layer) {
      var ids = (layers && layers[layer.key]) || [];
      return el('div', { class: 'pbc-layer is-' + layer.key + (ids.length ? '' : ' is-empty') },
        el('div', { class: 'pbc-layer-head' },
          el('span', { class: 'pbc-layer-name', text: layer.name }),
          el('span', { class: 'pbc-layer-hint', text: layer.hint }),
          el('span', { class: 'pbc-layer-n', text: String(ids.length) })),
        ids.length
          ? el('div', { class: 'pbc-layer-body' }, ids.map(moduleChip))
          : el('div', { class: 'pbc-layer-empty', text: 'nothing in this layer — the capability does not reach it' }));
    }));
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
      el('pre', {}, el('code', {}, highlight(snippet.code, snippet.lang))));
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

  function renderCellDrawer(cell) {
    if (cell.id === 'custom') { renderCustomPbcDrawer(); return; }

    var eyebrow = document.getElementById('drawer-eyebrow');
    eyebrow.textContent = '';
    append(eyebrow, [
      el('span', { class: 'cell-split is-yes', text: 'Packaged Business Capability' }),
      el('span', { text: '· ' + cell.moduleCount + ' modules' }),
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

      block('Install it', el('div', {},
        el('p', { class: 'dg-cap' }, rich('A PBC is a package manifest in `vc-modules/pbc`, installed with the ' +
          'vc-build CLI. Versions in that file are ignored on this map — the tier documents composition, and a ' +
          'pinned version goes stale long before the module set does.')),
        snippetBlock({ lang: 'bash',
          code: 'vc-build install -PackageManifestPath "' + cell.manifest + '"' })), true),

      block('How a request travels', pbcSchema(cell.layers), true),

      cell.unlisted && cell.unlisted.length
        ? block('Named in the package but not in the registry', list(cell.unlisted.map(function (id) {
            return '`' + id + '` — the package file is ahead of, or behind, the module registry';
          })), 'is-half')
        : null,

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
  var customPick = {};

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

  function customLayers(ids) {
    var layers = { xapi: [], services: [], platform: [], integration: [], outbound: [] };
    var famOf = window.VC_MODULE_FAMILY || {};
    var OUTBOUND = { 'VirtoCommerce.EventBus': 1, 'VirtoCommerce.WebHooks': 1, 'VirtoCommerce.Notifications': 1 };
    ids.forEach(function (id) {
      var key = /^VirtoCommerce\.(Xapi|X[A-Z]|ProfileExperienceApiModule|MarketingExperienceApi|FileExperienceApi|SalesRep|UCP)/.test(id) ? 'xapi'
        : OUTBOUND[id] ? 'outbound'
        : famOf[id] === 'integrations' ? 'integration'
        : famOf[id] === 'platform' ? 'platform'
        : 'services';
      layers[key].push(id);
    });
    return layers;
  }

  function renderCustomPbcDrawer() {
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

    function redraw() {
      var picked = Object.keys(customPick).filter(function (k) { return customPick[k]; });
      var closed = pbcDependencyClosure(picked);

      schemaHost.textContent = '';
      append(schemaHost, pbcSchema(customLayers(closed.ids)));

      summaryHost.textContent = '';
      append(summaryHost, factRows([
        ['Chosen', picked.length ? String(picked.length) + ' module(s)' : 'nothing yet — pick a capability below'],
        closed.added.length ? ['Pulled in', closed.added.length + ' required dependency(ies): ' +
          closed.added.map(function (id) { return '`' + id.replace('VirtoCommerce.', '') + '`'; }).join(' ')] : null,
        ['Package size', String(closed.ids.length) + ' modules in total']
      ]));

      manifestHost.textContent = '';
      var manifest = '{\n  "ManifestVersion": "2.0",\n  "PlatformVersion": "' +
        (META.platformVersion || '3.1058.0') + '",\n  "Modules": [\n' +
        closed.ids.map(function (id) { return '    { "Id": "' + id + '" }'; }).join(',\n') +
        '\n  ]\n}';
      append(manifestHost, snippetBlock({ lang: 'json', code: manifest }));
    }

    /* Preset buttons: start from a published PBC rather than from an empty page, which is how a real
       custom package begins. */
    var presets = el('div', { class: 'pbc-presets' }, CELLS.map(function (c) {
      return el('button', { type: 'button', class: 'chip', text: c.name,
        title: 'Start from ' + c.name + ' (' + c.moduleCount + ' modules)',
        onclick: function () {
          customPick = {};
          (c.modules || []).forEach(function (id) { customPick[id] = true; });
          renderCustomPbcDrawer();
        } });
    }).concat([
      el('button', { type: 'button', class: 'chip', text: 'Clear',
        onclick: function () { customPick = {}; renderCustomPbcDrawer(); } })
    ]));

    /* The picker, grouped by the same families as the Molecules tier. */
    var famOrder = window.VC_MODULE_FAMILY_ORDER || [];
    var famOf = window.VC_MODULE_FAMILY || {};
    var picker = el('div', { class: 'pbc-picker' }, famOrder.map(function (g) {
      var members = MODULE_TILES.filter(function (m) { return famOf[m.moduleId] === g.id; });
      if (!members.length) return null;
      return el('div', { class: 'pbc-picker-group' },
        el('div', { class: 'pbc-picker-head', style: g.hex ? '--accent:' + g.hex : null },
          el('span', { class: 'mol-family-swatch', 'aria-hidden': 'true' }),
          el('span', { class: 'mol-family-name', text: g.name })),
        el('div', { class: 'pbc-picker-body' }, members.map(function (m) {
          var id = m.moduleId;
          var label = el('label', { class: 'pbc-pick' + (customPick[id] ? ' is-on' : ''),
                                    style: MODULE_ACCENTS[id] ? '--accent:' + MODULE_ACCENTS[id] : null,
                                    title: id });
          var box = el('input', { type: 'checkbox' });
          box.checked = !!customPick[id];
          box.addEventListener('change', function () {
            customPick[id] = box.checked;
            label.classList.toggle('is-on', box.checked);
            redraw();
          });
          append(label, [box, MODULE_ACCENTS[id] ? moduleIcon(id, 18) : null,
                         el('span', { class: 'pbc-pick-name', text: m.name })]);
          return label;
        })));
    }).filter(Boolean));

    append(body, [
      block('Start from', presets, true),
      block('What it becomes', schemaHost, true),
      block('Package', summaryHost, 'is-half'),
      block('Manifest for vc-build', manifestHost, true),
      block('Pick capabilities', picker, true)
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

  function openHash(kind, id, trigger) {
    lastTrigger = trigger || lastTrigger;
    var next = '#/' + kind + '/' + id;
    if (location.hash === next) openFromHash();
    else location.hash = next;
  }

  function clearActive() {
    [nodes.atoms, nodes.layers, nodes.cells, nodes.molecules].forEach(function (group) {
      Object.keys(group).forEach(function (key) { group[key].classList.remove('is-active'); });
    });
  }

  function openFromHash() {
    var match = /^#\/(atom|layer|cell|molecule)\/(.+)$/.exec(location.hash || '');
    if (!match) { closeDrawer(true); return; }

    var kind = match[1];
    var id = decodeURIComponent(match[2]);
    /* Module tiles are addressed by module id — #/molecule/VirtoCommerce.Core. A link written against
       the old derived slug (#/molecule/mod-core) still resolves through the second lookup, so nothing
       already pasted goes dead; the address bar then shows the id form. */
    var item = kind === 'atom' ? byId(ATOMS, id)
      : kind === 'layer' ? byId(LAYERS, id)
      : kind === 'cell' ? (byId(CELLS, id) || (id === CUSTOM_PBC.id ? CUSTOM_PBC : null))
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

    state.open = { kind: kind, id: id };
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
    drawer.hidden = true;
    scrim.hidden = true;
    clearActive();
    state.open = null;
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
    applyFilter();

    document.getElementById('search').addEventListener('input', function (event) { setQuery(event.target.value); });
    document.getElementById('search-clear').addEventListener('click', function () {
      setQuery('');
      document.getElementById('search').focus();
    });
    document.getElementById('legend-toggle').addEventListener('click', toggleLegend);
    document.getElementById('drawer-close').addEventListener('click', function () { closeDrawer(); });
    document.getElementById('drawer-expand').addEventListener('click', toggleExpanded);
    scrim.addEventListener('click', function () { closeDrawer(); });

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
