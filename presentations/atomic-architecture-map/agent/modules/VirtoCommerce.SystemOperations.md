# System Operations (`VirtoCommerce.SystemOperations`)

> Developer tools page with centralized platform maintenance operations.

- Latest version: 3.1003.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-system-operations
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.SystemOperations`

## For business analysts

Housekeeping the platform needs done — maintenance operations run on demand or on a schedule.

## For architects

No dependencies, no entities, three migrations, one permission. Small on purpose: it is a place to put operations that would otherwise become scripts on somebody's laptop.

## For developers

Register an operation rather than shipping a console app — it inherits scheduling, permissions and visibility in the back office.

## Use it when

- A maintenance task must be runnable by an operator, not a developer
- Cleanup should be scheduled and auditable
- A script is about to be written that nobody will find again

## Do not use it when

- The work is business logic — it belongs in a module
- It must run per record on change: that is an event handler
- You need an approval flow around it

## REST controllers

- `api/system-operations/migrations` · 1 actions · [vc-module-system-operations/src/VirtoCommerce.SystemOperations.Web/Controllers/Api/SystemOperationsMigrationsController.cs](https://github.com/VirtoCommerce/vc-module-system-operations/blob/dev/src/VirtoCommerce.SystemOperations.Web/Controllers/Api/SystemOperationsMigrationsController.cs)

## Permissions

- `systemoperations:migrations:export`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Scheduled maintenance operations** (Integration & operations): Routine housekeeping runs on a schedule instead of on someone’s memory.

## Key features

- **Developer Tools Navigation** — Dynamic section listing all registered developer tools from the platform, with automatic icon/color assignment per tool type (Health, Hangfire, Swagger, GraphQL, etc.). Click opens in the same iframe, Ctrl+click opens in a new tab. External tools open in a new tab automatically.
- **Platform Information** — Auto-loaded on page open. Displays platform version, environment mode, database provider, runtime, and license details. Includes Copy to Clipboard and Download as `vc-platform-info.json`.
- **Reset Cache** — Clear all platform in-memory caches. Useful after direct database changes or configuration updates.
- **Restart Platform** — Gracefully restart the application with automatic polling until the platform is back online.
- **Install Sample Data** — Discover and install sample data packages for demos, development, or evaluation environments. Includes pre-flight state check, automatic state reset for repeat installs, inline progress bar with live status from the Hangfire job, and cancel support.
- **Export Platform Data** — Create a full platform backup with module/entry selection (Select All / Unselect All), real-time progress streaming, cancel support, and a download link on completion.
- **Import Platform Data** — Restore platform data from a previously exported ZIP backup with module/entry selection, real-time progress streaming, and cancel support.
- **Download Package JSON** — Export `vc-package.json` with all installed modules and versions for environment replication. Includes a ready-to-copy `vc-build Install` command for restoring modules from the downloaded file.
- **Module Load Sequence** — View the dependency-resolved loading order of all installed modules with Copy to Clipboard support.
- **Export Migration Scripts** — Download a ZIP of the EF Core database migration SQL that startup would apply — for the platform, security and every installed module — grouped per target database, with a `_databases.md`/`_databases.json` mapping of which context lives in which database. **Idempotent** by default (safe to run on another environment at any migration state; needs no DB connection); a **pending-only** delta mode is also available. Nothing is applied. This lets you review schema changes with a DBA and run them manually on another environment before it starts — the approach Microsoft [recommends for production](https://learn.microsoft.com/ef/core/managing-schemas/migrations/applying). See [Migration export](#migration-export) below.
- **Plugin Extensibility (Module Federation)** — Other modules can ship UI cards that render alongside the built-in ones, discovered automatically via the platform's modularity framework. See [Plugin extensibility](#plugin-extensibility-module-federation) below.
