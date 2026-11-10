# File operations (Fo)

> Rollbackable file-system operations and zip handling. Blob and asset storage is a module, not platform core.

- Family: Infra & ops
- Adoption: **Platform**. Platform-native. This is the Virto way.
- Layer: platform
- Verified against platform 3.1096.0
- On the map: `#/atom/file-operations`

## Pattern

Transactional file operations with rollback. `ITransactionFileManager` records operations (`CreateDirectory`, `Delete`, `SafeDelete`) as `IRollbackableOperation`s so a failed multi-step file change can be undone; `IZipFileWrapper` abstracts archive reading and extraction.

## When to use

- Multi-step file changes that must not leave a half-written state — module install being the platform's own case
- Reading or extracting archives (module packages, import bundles)
- Deleting files where a missing file should not be an exception (`SafeDelete`)

## Avoid

- Expecting blob or asset storage here. There is no blob abstraction in the platform — that is the Assets module
- Local file paths as durable storage in a scaled-out deployment; instances do not share a disk
- Direct `System.IO` calls for multi-step changes you would need to unwind

## API

- `ITransactionFileManager` · [src/VirtoCommerce.Platform.Core/TransactionFileManager/ITransactionFileManager.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/TransactionFileManager/ITransactionFileManager.cs)
- `IRollbackableOperation` · [src/VirtoCommerce.Platform.Core/TransactionFileManager/IRollbackableOperation.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/TransactionFileManager/IRollbackableOperation.cs)
- `IZipFileWrapper` · [src/VirtoCommerce.Platform.Core/ZipFile/IZipFileWrapper.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/ZipFile/IZipFileWrapper.cs)
- `IPathMapper` · [src/VirtoCommerce.Platform.Core/Common/IPathMapper.cs](https://github.com/VirtoCommerce/vc-platform/blob/dev/src/VirtoCommerce.Platform.Core/Common/IPathMapper.cs)

## Example

```csharp
// The full transactional surface, from Core/TransactionFileManager:
public interface ITransactionFileManager
{
    void CreateDirectory(string path);
    void Delete(string path);
    void SafeDelete(string path);   // absent file is not an error
}

// Archives — used by module install to unpack a package.
using var archive = _zipFileWrapper.OpenRead(packagePath);
_zipFileWrapper.Extract(packagePath, targetDirectory);
```

## Pitfalls

- There is no `IBlobStorageProvider` in the platform — verified by grep. Product images, imports and exports live behind the Assets module, so do not look for it here.
- Local disk is per instance. A file written on one instance is invisible to the others, which turns into "works on my node" bugs.
- Rollback only covers operations you performed through the manager. Mixing in direct `System.IO` calls leaves those unwound.

## See also

- [Backup & restore](backup-restore.md): The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.
- [Module catalog & install](module-catalog.md): How modules are found, chosen, copied and loaded — including at runtime, from a gallery.
- [External tool processes](external-processes.md): Launching an external command-line tool from the platform, portably across Windows and Linux.
