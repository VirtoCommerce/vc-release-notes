---
name: profiling-virto-modules
description: Use when adding or refreshing a Virto Commerce module page in the atomic architecture map — profiling a module from its repository, writing or reviewing module.json, or running that across the whole module catalogue
---

# Profiling Virto Commerce modules

## Overview

A module page has two halves, and keeping them apart is the whole point:

| Half | Source | Written by |
|---|---|---|
| `facts` | `module.manifest`, project layout, C#, README — at a **git ref**, not the working tree | `tools/module-profile.js` — never a human |
| `notes` | judgment: who cares, when to reach for it, what it owns | you, following the rules below |

**A generated sentence that reads like judgment is worse than an empty field**, because the reader cannot tell which is which. Leave `notes` empty rather than paraphrasing the tagline. A profile with no notes renders as a facts-only page, which reads as *not written yet* — the honest state.

## The loop

```bash
node tools/build-active-modules.js --online          # registry → the catalogue (96 modules)
node tools/sync-module-icons.js --online             # icons + accents + families
node tools/module-profile.js vc-module-webhooks --ref origin/dev --online
# ... author the notes block by hand ...
node tools/build-modules.js                          # JSON → content/modules.generated.js
node check-content.js --online                       # gate
```

Then open the page and look at it. The checker proves the data resolves; it cannot tell you the page reads badly.

**Always pass `--ref origin/dev`.** Every checkout here sits on whatever branch someone was last working on — webhooks was on `feat/VCST-5163-stable-15`, ucp on `feat/VCST-5339-mcp-csharp`. Facts read from those describe work in progress, not the module. The tool fetches the ref and exports it to a temp directory, so nothing in the working tree is touched: no checkout, no stash, no branch switch. `facts.git.readFrom` records which route was used and `facts.git.sha` pins it.

**Always pass `--online` to the registry tools.** A local `vc-modules` clone goes stale silently — this one sat two entries behind master, which hid UCP and SalesRep and kept a wrong title for Background Jobs.

## Which modules

Active = the registry's newest published version is **≥ 3.1000.0** — 96 of 109 entries on master. The other 13 are archived, pre-3.1, or test artifacts and must not appear. The generator enforces this; never hand-add a module below the floor.

## The page, block by block

This order is deliberate: what it is, who cares, what it does, when to use it, then the readout, then the links.

| Block | Source | Notes |
|---|---|---|
| Overview | `readme.overview` | the README's own words |
| What it means for you | `notes.forAnalyst` / `forArchitect` / `forDeveloper` | one line each, three audiences |
| Key features | `readme.keyFeatures` | quoted, not rewritten |
| Reach for it when · Do not reach for it when | `notes` | a matched half-width pair — they are read against each other |
| Module summary | `facts` | one readout: dependencies first, then databases, permissions, settings, entities, events, GraphQL, search index, languages |
| EF Core entities | `notes.owns` | the aggregate roots it is the source of truth for |
| Reference | `documentation` + README links | names derived from the URL, so every module page says "Source code on GitHub" |

Rules the format depends on:
- **Dependencies lead the summary.** Whether a module can be deployed alone is the first thing a solution architect needs.
- **No counts in list rows.** "4 — A, B, C, D" makes the reader check arithmetic; the names alone read faster.
- **Events, not a count of handlers.** A module that subscribes through `IEventHandlerRegistrar` picks its events at runtime — say that instead of "1 handler".
- **Every page ends with provenance**: the repo, the ref, the sha, the date, and whether notes are authored.

## Writing the notes block

Three audiences, one line each, and they must not say the same thing three ways.

- **`forAnalyst`** — the business capability in the language of the business. No class names, no project names.
- **`forArchitect`** — the seam: what it owns, what it must be deployed with, what breaks without it. Cite dependencies and stores, not features.
- **`forDeveloper`** — the extension point you will touch first: the service to override, the event to handle, the setting that changes behaviour.
- **`owns`** — take `facts.entities`, then keep only genuine aggregate roots.
- **`reachForItWhen` / `doNotReachForItWhen`** — two to four lines each. The second list is the valuable one: "use the search index, not this", "this is a provider, install the port too".

**Rules**
1. Never restate `tagline` or `readme.overview`. If a note adds nothing, delete it.
2. Every claim traces to a fact in the profile or to a file you read. If you cannot point at the source, cut the sentence.
3. Name the version you read (`facts.manifestVersion`) when a claim is version-specific.
4. Re-running the extractor preserves authored notes — facts are overwritten, `notes` is carried across. Never re-type them.

## Facts worth reading before you write

| Field | Tells you |
|---|---|
| `dependsOn` / `optionalDependencies` | whether the module can be deployed alone — the Cell question |
| `databaseProviders` | SQL Server / MySQL / PostgreSQL support, per provider project |
| `restControllers[].route`, `.actions`, `.authorizedActions` | the REST surface, and whether any action is unprotected |
| `permissions`, `settings` | what an administrator can grant and configure |
| `domainEventsPublished`, `handledEvents`, `subscribesDynamically` | how others react to it, and what it reacts to |
| `graphqlBuilders` | whether it has an XAPI surface at all |
| `indexDocumentBuilders` | whether it feeds the search index (so bulk writes need a reindex) |
| `entities`, `migrationCount` | how much schema it owns |
| `hasAdminUi`, `localizations` | whether the back office shows it, and in how many languages |

## Common mistakes

- **Profiling the working tree.** Without `--ref origin/dev` you are documenting someone's feature branch. Check `facts.git.readFrom`.
- **Trusting a README's "Depends on".** Most have none, and those that do drift. `module.manifest` is the only authority, and it carries the `optional="true"` flag the README never mentions.
- **Believing the local registry clone.** Pass `--online`, or you will publish a stale title and miss recent modules.
- **Counting setting groups as settings.** `Name = "Webhooks|General"` is a group label; a setting name is dotted.
- **Counting test code as behaviour.** A test fake implementing `IEventHandler<T>` once made "T" look like a domain event. The extractor excludes `tests/`.
- **Editing `content/modules.generated.js`.** It is generated. Edit the JSON and re-run the builder.

## Scaling across the catalogue

```bash
node tools/module-profile.js --all --ref origin/dev --online
```

One pass over every active module with a checkout: fetch, export the ref, extract, preserve notes. Facts only — notes are then authored a module at a time, highest-traffic first (Catalog, Cart, Orders, Customer, Pricing, Inventory, Store, Search, Content). The checker prints `module profiles: N (M with authored notes)` so the written share is always visible.

A module without a local checkout cannot be profiled; its tile still opens a registry-only page. Clone it, or leave it — do not hand-write facts for it.
