# Backup & Restore (`VirtoCommerce.BackupRestore`)

> The Backup & Restore module provides full platform backup and restore (export/import) for Virto Commerce. It packages platform data (users, roles, permissions, settings and dynamic properties) together with the data of all installed modules into a single, optionally AES-256 encrypted ZIP archive, and restores it on demand with real-time progress tracking and sample data installation.

- Latest version: 3.1009.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-backup-restore
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.BackupRestore`

## For business analysts

Taking a copy of the platform's data and putting it back — for migrations, environments and recovery drills.

## For architects

One dependency, no schema of its own, six permissions. It orchestrates each module's own export and import, which is why a module that does not participate is silently missing from a backup.

## For developers

Implement the backup contract in your module or its data will not be in the archive. Restores are destructive by nature — the permissions exist for that reason.

## Use it when

- Data must move between environments
- A recovery drill has to be rehearsed rather than assumed
- A module's data should be part of the platform's archive

## Do not use it when

- Database-level backups already cover the requirement
- You need point-in-time recovery: that is the database's job
- The data is files in blob storage — those are not in the database archive

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0

## REST controllers

- `api/platform` · 4 actions · [vc-module-backup-restore/src/VirtoCommerce.BackupRestore.Web/Controllers/Api/BackupRestoreController.cs](https://github.com/VirtoCommerce/vc-module-backup-restore/blob/dev/src/VirtoCommerce.BackupRestore.Web/Controllers/Api/BackupRestoreController.cs)
- `api/platform` · 6 actions · [vc-module-backup-restore/src/VirtoCommerce.BackupRestore.Web/Controllers/Api/SampleDataController.cs](https://github.com/VirtoCommerce/vc-module-backup-restore/blob/dev/src/VirtoCommerce.BackupRestore.Web/Controllers/Api/SampleDataController.cs)

## Permissions

- `platform:backuprestore:access`
- `platform:backuprestore:backup`
- `platform:backuprestore:restore`
- `platform:backuprestore:storage`
- `platform:export`
- `platform:import`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Backup & restore** (Integration & operations): Move data between environments, and rehearse recovery rather than assume it.

## Key features

- **Full platform backup** — exports security data (roles, users, user API keys), settings, and dynamic properties (including dictionary items), plus the data of every installed module that participates via `IExportSupport`.
- **One-click restore** — imports a backup back into the platform, creating or merging entities; domain events are suppressed during restore to avoid cascading side effects, and the operator who started the restore is preserved so their session is not invalidated.
- **Optional AES-256 encryption** — password-protected ZIP archives; the generated password is shown once. `Manifest.json` is always written unencrypted so the import UI can detect encryption and prompt before reading protected entries.
- **Module participation model** — any module that implements `IExportSupport` / `IImportSupport` is automatically included in backups and restores; no per-module wiring required.
- **Streaming & memory-efficient** — large JSON collections are read and written in pages (batches of 50) so big datasets never load fully into memory.
- **Real-time progress** — export and restore run as Hangfire background jobs and stream a structured progress log (info/warning/error) to the admin UI via push notifications.
- **Sample data installation** — discovers and imports sample datasets, and contributes the sample-data step to the platform setup wizard.
- **Backward compatible** — preserves the original `api/platform/*` routes, permission strings, backup ZIP layout, and admin UI; the implementation satisfies both the modern `IBackupRestoreManager` and the legacy `IPlatformExportImportManager`.

## Documentation

- [Backup and restore user documentation](https://docs.virtocommerce.org/platform/user-guide/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.BackupRestore)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-backup-restore/)
