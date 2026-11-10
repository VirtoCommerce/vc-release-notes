# Bulk Actions (`VirtoCommerce.BulkActionsModule`)

> Bulk actions module

- Latest version: 3.1006.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-bulk-actions
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.BulkActionsModule`

## For business analysts

Doing the same thing to many records at once from the back office — recategorise, change properties, publish.

## For architects

One dependency, no storage, two permissions: it is an infrastructure module that other modules register actions with, which is why Catalog lists it as an *optional* dependency rather than a required one.

## For developers

Register a bulk action instead of writing a loop in a controller — you inherit progress reporting and the job pipeline. The actions run in the background, so they need a worker.

## Use it when

- An operator must change hundreds of records without a script
- Your module has an operation that should be applicable in bulk
- Progress and cancellation matter to the person waiting

## Do not use it when

- A one-off data fix — a migration or a query is more honest
- The change is a rule that should apply automatically
- There is no background worker to run the job

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0

## REST controllers

- `api/bulk/actions` · 4 actions · [vc-module-bulk-actions/src/VirtoCommerce.BulkActionsModule.Web/Controllers/Api/BulkActionsController.cs](https://github.com/VirtoCommerce/vc-module-bulk-actions/blob/dev/src/VirtoCommerce.BulkActionsModule.Web/Controllers/Api/BulkActionsController.cs)

## Permissions

- `bulk-actions:execute`
- `bulk-actions:read`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Bulk editing** (Product data): Recategorise or re-tag hundreds of records in one action rather than one at a time.

## Key features

- **Extensible Provider Model** — Register custom bulk actions by implementing a small set of interfaces (`IBulkActionFactory`, `IDataSourceFactory`) and adding a `BulkActionProvider` to the storage.
- **Asynchronous Background Execution** — Bulk actions run as Hangfire background jobs, preventing long-running operations from blocking the API.
- **Real-Time Progress Tracking** — Push notifications report processed/total counts, descriptions, and errors to the UI in real time.
- **Job Cancellation** — Running bulk action jobs can be cancelled via the REST API using cancellation tokens.
- **Permission-Based Authorization** — Each registered bulk action provider declares its required permissions, which are checked against the current user before execution.
- **Polymorphic Context Deserialization** — Automatically resolves `BulkActionContext` subtypes via `PolymorphJsonConverter`, enabling strongly-typed action contexts across modules.

## Documentation

- [Bulk Actions Module Documentation](https://docs.virtocommerce.org/platform/developer-guide/Modules/VirtoCommerce.BulkActionsModule/)
- [REST API Reference](https://docs.virtocommerce.org/platform/developer-guide/Modules/VirtoCommerce.BulkActionsModule/api/)
- [GitHub Repository](https://github.com/VirtoCommerce/vc-module-bulk-actions)
