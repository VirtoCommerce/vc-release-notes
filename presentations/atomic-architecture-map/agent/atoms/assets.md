# Assets & blob storage (As)

> Binary storage for images, imports and exports — behind a provider the platform core does not ship.

- Family: Infra & ops
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: infrastructure
- Verified against platform 3.1096.0
- On the map: `#/atom/assets`

## Pattern

Port and adapter selected by configuration. `VirtoCommerce.Assets` owns the contract and the asset UI; a provider module supplies the backing store — `VirtoCommerce.AzureBlobAssets` for Azure Blob, `VirtoCommerce.FileSystemAssets` for local disk.

## When to use

- Anything binary: product images, attachments, generated documents, import and export files
- Handing a caller a public URL for a stored blob, via `IBlobUrlResolver`
- Claim-check for background jobs — store the file, pass its URL in the payload

## Avoid

- The filesystem provider on more than one instance. Instances do not share a disk, so an upload lands on whichever node served the request
- Storing binaries in the relational database
- Serving large assets through the API instead of putting a CDN in front of blob storage
- Assuming the abstraction exists in a bare platform — without the module there is no blob API at all

## Note

There is no blob abstraction in `vc-platform` itself — verified by grep. `IBlobStorageProvider` lives in the Assets module, so a platform without it installed has no way to store a file beyond raw `System.IO`.

## API

- `IBlobStorageProvider — OpenRead / OpenWrite / SearchAsync / RemoveAsync` · (vc-module-assets — VirtoCommerce.AssetsModule.Core.Assets)
- `IBlobUrlResolver.GetAbsoluteUrl` · (vc-module-assets — turns a blob key into a public URL)
- `IAssetEntryService / IAssetEntrySearchService` · (vc-module-assets — the managed asset catalogue)
- `VirtoCommerce.Assets + AzureBlobAssets | FileSystemAssets` · (module ids from the vc-modules registry)

## Example

```csharp
// The provider is injected; which store backs it is a deployment choice.
public class ReportService(IBlobStorageProvider blobs, IBlobUrlResolver urls)
{
    public async Task<string> Save(string name, Stream content)
    {
        var blobUrl = $"reports/{name}";

        await using (var target = await blobs.OpenWriteAsync(blobUrl))
        {
            await content.CopyToAsync(target);
        }

        // Hand back an absolute URL — never a local path, which means nothing
        // to another instance or to the browser.
        return urls.GetAbsoluteUrl(blobUrl);
    }
}
```

## Pitfalls

- Blob URLs are keys, not paths. Resolve to an absolute URL with `IBlobUrlResolver` before handing one to a client.
- `IBlobStorageProvider` exposes sync and async pairs (`OpenRead` / `OpenReadAsync`). Prefer the async ones in request and job paths.
- The filesystem provider is a development convenience. Scaling out without switching to blob storage produces missing-image bugs that affect only some requests.
- Assets live outside the database, so they are outside its transactions and outside its backup.

## Documentation

- [Configuring asset blob storage](https://docs.virtocommerce.org/platform/developer-guide/latest/Getting-Started/Post-Installation-Steps/03-configuring-asset-blob-storage/)
- [vc-module-assets (GitHub)](https://github.com/VirtoCommerce/vc-module-assets)

## See also

- [File operations](file-operations.md): Rollbackable file-system operations and zip handling. Blob and asset storage is a module, not platform core.
- [Indexed search](search.md): The read path the catalogue actually depends on — and one more engine to keep consistent with the database.
- [Backup & restore](backup-restore.md): The platform-wide data transfer mechanism a module opts into — backup, restore, seeding and environment moves.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.

## Topic

Part of **Deployment schema**: From one container to a scaled-out, multi-instance cluster.
