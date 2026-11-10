# Backup & restore (Br)

> The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.

- Family: Modularity
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/backup-restore`

## Pattern

Per-module export and import contributors coordinated by a platform manager. A module implements `IExportSupport` and `IImportSupport`, writing to and reading from a stream while reporting progress and honouring cancellation. The manifest records what a package contains.

## When to use

- Making your module's data part of platform export and import
- Shipping sample data for a demo or a new environment
- Moving configuration and data between environments

## Avoid

- Loading everything into memory before writing. Stream it, or large tenants fail
- Ignoring the progress callback — an import with no feedback looks hung
- Implementing only the obsolete `ICancellationToken` overload in new code

## Note

The platform owns the contracts; the platform-wide backup and restore experience ships as the **`VirtoCommerce.BackupRestore`** module (`vc-module-backup-restore`) today. Per-domain export/import is a different thing again — catalogue CSV, prices and customers each have their own module.

## API

- `IExportSupport` · [src/VirtoCommerce.Platform.Core/ExportImport/IExportSupport.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ExportImport/IExportSupport.cs)
- `IImportSupport` · [src/VirtoCommerce.Platform.Core/ExportImport/IImportSupport.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ExportImport/IImportSupport.cs)
- `IPlatformExportImportManager` · [src/VirtoCommerce.Platform.Core/ExportImport/IPlatformExportImportManager.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ExportImport/IPlatformExportImportManager.cs)
- `ExportImportProgressInfo` · [src/VirtoCommerce.Platform.Core/ExportImport/ExportImportProgressInfo.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ExportImport/ExportImportProgressInfo.cs)
- `PlatformExportManifest` · [src/VirtoCommerce.Platform.Core/ExportImport/PlatformExportManifest.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ExportImport/PlatformExportManifest.cs)

## Example

```csharp
// Implement the CancellationToken overload. The obsolete ICancellationToken one
// (VC0014) exists only so older modules keep compiling.
public class MyModuleExportImport : IExportSupport, IImportSupport
{
    public async Task ExportAsync(Stream outStream, ExportImportOptions options,
        Action<ExportImportProgressInfo> progressCallback, CancellationToken cancellationToken)
    {
        progressCallback(new ExportImportProgressInfo { Description = "Exporting my entities" });

        // Stream in batches — never materialise the whole table.
        await foreach (var batch in ReadBatches(cancellationToken))
        {
            await WriteBatch(outStream, batch, cancellationToken);
        }
    }
}
```

## Pitfalls

- Both interfaces carry two overloads; the obsolete `ICancellationToken` one throws `NotImplementedException` by default and the modern one bridges to it via `CancellationTokenWrapper`. Implement the modern one.
- Import order across modules matters when data references other modules' data — the platform manager sequences it, so do not assume you can import standalone.
- Export runs against live data. On a large tenant it is a background job with real duration, not a request.

## Documentation

- [vc-module-backup-restore (GitHub)](https://github.com/VirtoCommerce/vc-module-backup-restore)

## See also

- [Cancellation](cancellation.md): Threading a cancellation signal all the way down — and the obsolete shim you will still meet in older code.
- [Job progress](job-progress.md): Reporting how far a long job has got, so the UI can show it instead of spinning.
- [JSON serialization](json-serialization.md): The platform's REST API serializes with Newtonsoft, not System.Text.Json. Custom converters must match.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
