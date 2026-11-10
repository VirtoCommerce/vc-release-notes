# Modules (architecture layer)

> The unit of everything. A modular monolith of vertical slices: one bounded context per module, split into three projects, discovered and loaded at runtime.

- Tags: `Core`, `Data`, `Web`, `module.manifest`
- On the map: `#/layer/modules`

## What to know

- `Module.Core` — domain models, service interfaces, events, `ModuleConstants` (permissions, settings, literals). Distributable as a NuGet package, so other modules can depend on your contracts without your implementation.
- `Module.Data` — EF Core entities, migrations, repositories, service implementations, event handlers, cache regions. Also NuGet-distributable.
- `Module.Web` — REST controllers, Admin SPA assets, localizations, `Module.cs`, `module.manifest`. Application layer only, never a package.
- Relationships between modules: **Uses** (calls another module's API), **Extends** (overrides a type via `AbstractTypeFactory`), **Reacts to** (handles integration events). Prefer *reacts to* — it is the only one that does not create a compile-time dependency.
- Namespacing is mechanical: `VirtoCommerce.{Module}.{Core|Data|Web}`.

## Types of module you will actually build

- **All-in-one**: XAPI + services + CRUD + Admin UI in one bounded context. The default for a real feature — Catalog, Order and Pricing are all this shape.
- **CRUD module**: Domain + EF Core + REST + Admin UI, no GraphQL. Back-office-only concerns: reference data, internal registries.
- **XAPI module**: GraphQL schema, queries, mutations and types over services that already exist. Adds a storefront experience without touching the domain.
- **Provider module**: Implements a registration contract — payment, shipping or tax provider. Small, focused, swappable per store.
- **Engine module**: Adapts one port to one technology, selected in configuration: search provider (Elasticsearch / Lucene / Azure Search), or background-job engine.
- **Integration module**: Talks to an external system (ERP, WMS, CRM), usually driven by event handlers and background jobs rather than by requests.

## Pitfalls

- A module without a valid `module.manifest` will not load — there is no convention-based fallback.
- Never edit vendor module source. Derive a type and register the override, handle an event, or use a dynamic property; anything else you cannot upgrade.
- When you add a property to a vendor type, prefix it with your solution abbreviation so a future vendor property cannot collide with it.
- Manifest dependencies use caret SemVer ranges (`^1.2.3` means `>=1.2.3 <2.0.0`), and `platformVersion` must be pinned.

## Documentation

- [Modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)
- [Essential modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/01-overview/)
- [Create a new module](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/Tutorials/create-new-module-from-scratch/)
- [Extensibility overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Extensibility/overview/)
- [vc-cli-module-template (the scaffold)](https://github.com/VirtoCommerce/vc-cli-module-template/tree/main/templates/vc-module-dba-template)
