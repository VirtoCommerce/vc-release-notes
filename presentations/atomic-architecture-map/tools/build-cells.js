#!/usr/bin/env node
/* vc-modules/pbc/*.json  →  content/cells.generated.js
 *
 * A Cell on this map is a Packaged Business Capability, and Virto publishes those as installable
 * package manifests. So the tier stops being authored prose about which modules "should" go together
 * and becomes a projection of what `vc-build install` actually installs.
 *
 * Two manifest shapes exist in the folder and both are read: the flat `Modules` array (crm) and the
 * newer `Sources[].Modules` form (everything else). **Versions are ignored on purpose** — the map
 * documents composition, and a pinned version in a package file goes stale far faster than the set
 * of modules does.
 *
 * Usage: node tools/build-cells.js [--online] [--check]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'content/cells.generated.js');
const LOCAL_PBC = 'C:/Projects/git/VirtoCommerce/vc-modules/pbc';
const RAW = 'https://raw.githubusercontent.com/VirtoCommerce/vc-modules/refs/heads/master/pbc/';
const ONLINE = process.argv.includes('--online');
const CHECK = process.argv.includes('--check');

/* Order, titles and the one-line business framing come from the readme's own PBC list, in its order:
   Virto Start, IdP, Digital Catalog, Purchase, PIM, CRM. The readme is the published description, so
   the wording here follows it rather than inventing a second vocabulary. */
const PBCS = [
  { file: 'virto-start-packages.json', id: 'virto-start', name: 'Virto Start',
    sub: 'A running B2B or B2C store out of the box, with the Virto Commerce Frontend already wired in.',
    audience: 'Whole solution',
    overview: 'Ideal for businesses that want a quick and hassle-free start with common B2B and B2C ' +
      'e-commerce configurations. This package is perfect for getting up and running swiftly, with ' +
      'native integration with Virto Commerce Frontend.' },
  { file: 'idp-packages.json', id: 'idp', name: 'Identity Provider',
    sub: 'Virto as the identity provider: authenticating users and authorising their access to other applications.',
    audience: 'Identity',
    overview: 'Virto Commerce can be used as an Identity Provider, essential for organizations needing ' +
      'secure and efficient user identity management. This system authenticates users\u2019 identities and ' +
      'authorizes their access to various applications and services, enhancing security and streamlining ' +
      'customer authentication processes.' },
  { file: 'digital-catalog-packages.json', id: 'digital-catalog', name: 'Digital Catalog',
    sub: 'Catalog data over API and frontend \u2014 search, browse and filter, with no ability to buy.',
    audience: 'Catalog read',
    overview: 'A must-have if you need to grant access to your catalog data via Frontend or API without ' +
      'the ability to buy products. This package supports modern scenarios with advanced search, browsing ' +
      'and filtering capabilities, making it ideal for businesses that require robust catalog management ' +
      'solutions.' },
  { file: 'purchase-packages.json', id: 'purchase', name: 'Purchase',
    sub: 'Cart and checkout on top of someone else\u2019s catalog \u2014 your own, or several vendor APIs.',
    audience: 'Transact',
    overview: 'This package is crucial if you already have an e-commerce catalog or are building a ' +
      'marketplace that aggregates catalog data from multiple vendor APIs, like Amazon or Booking. Virto ' +
      'Commerce can be used to build cart and checkout experiences for placing orders.' },
  { file: 'pim-packages.json', id: 'pim', name: 'Product Information Management',
    sub: 'Product data management for category managers, without a storefront attached.',
    audience: 'Authoring',
    overview: 'If you need just a PIM, Virto Commerce can play this role by granting access for category ' +
      'managers, building and improving e-commerce catalogs. PIM is indispensable for companies looking to ' +
      'streamline their product data management to match specific business needs.' },
  { file: 'crm-packages.json', id: 'crm', name: 'Customer & Organizations',
    sub: 'Customer and company data as a CRM, for managing relationships across the lifecycle.',
    audience: 'Customer data',
    overview: 'If you need just a CRM, Virto Commerce can play this role, allowing you to grant access to ' +
      'CRM data. This package is essential for managing customer interactions and data throughout the ' +
      'customer lifecycle, improving business relationships and customer retention.' }
];

/* The tier-level framing, from the same readme. Every PBC page opens with it, because the question
   "what is a PBC?" comes before "what is in this one?". */
const PBC_INTRO =
  'Packaged Business Capabilities (PBCs) are a core component of Virto Commerce\u2019s modular and flexible ' +
  'approach, known as the Virto Atomic Architecture. These PBCs are designed to encapsulate specific ' +
  'business functionalities, making them an ideal choice for decision-makers across various business entities.';

function loadManifest(file) {
  if (ONLINE) {
    const raw = execFileSync('curl', ['-s', '--max-time', '30', RAW + file], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
    return JSON.parse(raw);
  }
  return JSON.parse(fs.readFileSync(path.join(LOCAL_PBC, file), 'utf8'));
}

/* Both manifest shapes, one answer. Versions are dropped here and nowhere else, so the rest of the
   pipeline cannot accidentally start believing them. */
function modulesOf(manifest) {
  const ids = new Set();
  for (const m of manifest.Modules || []) if (m && m.Id) ids.add(m.Id);
  for (const src of Object.values(manifest.Sources || {})) {
    for (const m of (src && src.Modules) || []) if (m && m.Id) ids.add(m.Id);
  }
  return [...ids].sort();
}

/* The catalogue and the family map, so a Cell's modules can be drawn with the same icons, colours and
   names as the Molecules tier. A PBC module that is no longer active is worth reporting rather than
   hiding: it means the package file is behind the registry. */
global.window = {};
eval(fs.readFileSync(path.join(ROOT, 'content/modules-active.js'), 'utf8'));
eval(fs.readFileSync(path.join(ROOT, 'content/module-accents.js'), 'utf8'));
const CATALOGUE = new Map((global.window.VC_ACTIVE_MODULES || []).map(m => [m.id, m]));
const FAMILY = global.window.VC_MODULE_FAMILY || {};

/* Layers for the schema, top to bottom: what a client talks to, what serves it, what it talks out to.
   Assignment is by module id and by family, both facts we already hold, so no third list to maintain. */
const XAPI = /^VirtoCommerce\.(Xapi|X[A-Z]|ProfileExperienceApiModule|MarketingExperienceApi|FileExperienceApi|SalesRep|UCP)/;
const INTEGRATION = new Set(['integrations']);
const OUTBOUND = new Set(['VirtoCommerce.EventBus', 'VirtoCommerce.WebHooks', 'VirtoCommerce.Notifications']);

function layerOf(id) {
  if (XAPI.test(id)) return 'xapi';
  if (OUTBOUND.has(id)) return 'outbound';
  if (INTEGRATION.has(FAMILY[id])) return 'integration';
  if (FAMILY[id] === 'platform') return 'platform';
  return 'services';
}

const cells = PBCS.map(pbc => {
  const manifest = loadManifest(pbc.file);
  const ids = modulesOf(manifest);
  const known = ids.filter(id => CATALOGUE.has(id));
  const unknown = ids.filter(id => !CATALOGUE.has(id));

  const layers = { xapi: [], services: [], platform: [], integration: [], outbound: [] };
  for (const id of known) layers[layerOf(id)].push(id);

  return {
    id: pbc.id,
    name: pbc.name,
    sub: pbc.sub,
    overview: pbc.overview,
    intro: PBC_INTRO,
    audience: pbc.audience,
    manifest: 'pbc/' + pbc.file,
    manifestUrl: 'https://github.com/VirtoCommerce/vc-modules/blob/master/pbc/' + pbc.file,
    platformVersion: manifest.PlatformVersion || null,
    moduleCount: known.length,
    modules: known,
    /* Named in the package but not in the active registry — the package file is behind. */
    unlisted: unknown,
    layers: layers
  };
});

const body = [
  '/* GENERATED by tools/build-cells.js from vc-modules/pbc/*.json — do not edit by hand.',
  ' * ' + cells.length + ' Packaged Business Capabilities, ' +
    cells.reduce((n, c) => n + c.moduleCount, 0) + ' module references in total.',
  ' * Versions in the package files are deliberately ignored: this tier documents composition.',
  ' */',
  'window.VC_MAP_PBC = ' + JSON.stringify(cells) + ';',
  ''
].join('\n');

if (CHECK) {
  const current = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (current !== body) { console.error('cells.generated.js is STALE — run node tools/build-cells.js --online'); process.exit(1); }
  console.log('cells.generated.js is up to date (' + cells.length + ' PBCs)');
} else {
  fs.writeFileSync(OUT, body);
  console.log('wrote content/cells.generated.js — ' + cells.length + ' PBCs' + (ONLINE ? ' (read from master)' : ' (read from the local clone)'));
  for (const c of cells) {
    const l = c.layers;
    console.log('  ' + c.name.padEnd(32) + String(c.moduleCount).padStart(3) + ' modules  ' +
      'xapi ' + l.xapi.length + ' · services ' + l.services.length + ' · platform ' + l.platform.length +
      ' · integrations ' + l.integration.length + ' · outbound ' + l.outbound.length +
      (c.unlisted.length ? '   NOT IN REGISTRY: ' + c.unlisted.join(', ') : ''));
  }
}
