# Generic Export (`VirtoCommerce.Export`)

> Generic export functionality

- Latest version: 3.1007.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-export
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.Export`

## For business analysts

A single way to get data out of the platform as a file — pick the type, pick the fields, choose CSV or JSON, download the result.

## For architects

A provider-based port with **no database of its own**: modules register their entities as exportable, and the CSV and JSON writers ship as separate projects. Its only dependency is Assets, because the output is a file and files belong there. That is why adding "export my entity" to a module is a registration rather than a new endpoint and a new download path.

## For developers

Register your type with the export infrastructure instead of writing a bespoke endpoint — you inherit field selection, paging, the file naming template and the download permission. `Export.FileNameTemplate` is the setting that decides what the user receives.

## Use it when

- A user needs data as a file, on demand, from the back office
- Your module's entities should be exportable like every other module's
- A one-off extract would otherwise become a bespoke endpoint

## Do not use it when

- The consumer is a system, not a person — an API or a queue beats a file
- You need a scheduled feed: wrap it in a background job rather than a manual download
- The volume is a full catalogue migration — that is bulk import/export tooling, not an ad-hoc file

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0

## Owns these entities

- `TestSearchEntity`

## REST controllers

- `api/export` · 6 actions · [vc-module-export/src/VirtoCommerce.ExportModule.Web/Controllers/Api/ExportController.cs](https://github.com/VirtoCommerce/vc-module-export/blob/dev/src/VirtoCommerce.ExportModule.Web/Controllers/Api/ExportController.cs)

## Permissions

- `export:access`
- `export:download`

## Settings

- `Export.FileNameTemplate`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Data export as files** (Integration & operations): Any module’s data pulled out as CSV or JSON, on demand, from the back office.

## Key features

- **Pluggable export type registry** — Other modules register their exportable entity types at startup; the export module discovers and exposes them through a single API.
- **Multiple export providers** — Ships with JSON (hierarchical) and CSV (tabular) providers out of the box; additional providers can be added via DI.
- **Background job execution** — Export tasks are queued as Hangfire background jobs, keeping API responses non-blocking and supporting cancellation.
- **Real-time progress notifications** — Push notifications report export progress (processed/total counts, errors, completion) to the calling client.
- **Property-level filtering** — Callers can select which properties to include in the export, and the module strips excluded properties before writing.
- **Tabular conversion** — Entities that implement `ITabularConvertible` can be flattened for CSV export while retaining their full hierarchy for JSON export.
- **Paged data retrieval** — A generic `ExportPagedDataSource` base class handles pagination, so consuming modules only need to implement the data-fetch logic.
- **Fluent type registration** — `ExportedTypeDefinitionBuilder` and its extension methods provide a fluent API for registering export types with metadata, data sources, and groups.
- **Configurable file naming** — Export file names are generated from a configurable template with timestamp formatting.
- **OR-based authorization** — The `AuthorizeAny` attribute allows endpoints to accept any one of several permissions (e.g., platform export OR module download).

## Documentation

- [Generic Export module user documentation](https://docs.virtocommerce.org/platform/user-guide/generic-export/overview/)
- [REST API Reference](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Export)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-export)
