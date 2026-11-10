# Import (`VirtoCommerce.Import`)

> Provides flexible functionality for writing Importers

- Latest version: 3.1004.0 (needs platform 3.1007.27)
- Repository: https://github.com/VirtoCommerce/vc-module-Import
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.Import`

## For business analysts

Getting data in from files: an import profile describes the mapping once, and every run is recorded with its errors, so a failed load can be explained rather than guessed at.

## For architects

The mirror of Export, and notably heavier: it depends on Assets, Catalog, Customer and Notifications, because it reads uploaded files, writes commerce data and mails the outcome. Two entities carry the profile and the run history. Its limits are settings — file size, line count, error threshold — which is how an import fails loudly at a known boundary instead of exhausting a host.

## For developers

Write an importer against the module's abstraction rather than a controller that parses a file, and let the profile carry the mapping. Before a large run, remember what the write path costs: events fan out per row, so suppress them or turn event-based indexation off and reindex once. Note it has only one localization, so back-office text is effectively English.

## Use it when

- Data arrives as files and the mapping is reused rather than one-off
- An operator needs to see what a load did, and what it rejected
- Import limits must be enforced before a host runs out of memory

## Do not use it when

- A system can call the API directly — an import profile is for files, not integrations
- You are loading a whole catalogue for the first time: plan the indexation cost first
- The source is a queue or a stream — that is EventBus, in the other direction

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1001.3
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1002.10
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1000.7
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1001.8

## Owns these entities

- `ImportProfileEntity`
- `ImportRunHistoryEntity`

## REST controllers

- `api/import` · 12 actions · (vc-module-Import/src/VirtoCommerce.ImportModule.Web/Controllers/Api/ImportController.cs)
- `api/import` · 1 actions · (vc-module-Import/src/VirtoCommerce.ImportModule.Web/Controllers/Api/OrganizationController.cs)

## Permissions

- `import:access`
- `import:create`
- `import:delete`
- `import:execute`
- `import:read`
- `import:update`

## Settings

- `Import.DefaultImportReporter`
- `Import.FileMaxSize`
- `Import.LimitOfLines`
- `Import.MaxErrorsCountThreshold`
- `Import.RemainingEstimator`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 16.

## Business features it serves

- **File import with audit** (Integration & operations): Reusable import profiles, with every run and rejection recorded.

## Key features

- **Pluggable importers** — modules register `IDataImporter` implementations with their own reader, writer, validation, settings, and authorization requirement
- **Import profiles** — named, reusable configurations that bind an importer to a source file and importer-specific settings
- **Built-in CSV support** — `CsvDataReader` based on CsvHelper class maps, with configurable delimiter and page size, plus a CSV error reporter
- **Background processing** — imports run as Hangfire jobs, with at most one concurrent run per profile
- **Live progress** — push notifications with processed, total, and error counts plus an estimated remaining time
- **Resumable runs** — readers that implement `IImportDataReader<TCursor>` save a cursor every N pages, so an interrupted run continues from the last checkpoint
- **Error handling and reports** — errors are collected per record up to a configurable threshold and can be written to a downloadable report
- **Run history and notifications** — every run is recorded with its statistics, and the user who started it receives an email when it completes
- **Organization scoping** — for users who belong to an organization, profile and history searches, runs, and resumes are limited to that organization
- **Multi-database support** — SQL Server, MySQL, and PostgreSQL via dedicated EF Core provider assemblies

## Documentation

- [Data import developer guide](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Data-Import/01-main-concept/)
- [Import App](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Data-Import/import-app/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Import)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-import/)
