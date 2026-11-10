# Indexed search (Se)

> The read path the catalogue actually depends on — and one more engine to keep consistent with the database.

- Family: Data & domain
- Adoption: **Module**. Ships outside platform core: install the module or tool.
- Layer: infrastructure
- Verified against platform 3.1096.0
- On the map: `#/atom/search`

## Pattern

Port and adapter over an index, with documents built by contributors. `VirtoCommerce.Search` owns `ISearchProvider` and `IIndexingManager`; an engine module implements the port — Elasticsearch 8/9, OpenSearch, Lucene, Azure Search, Elastic App Search or Algolia. Modules contribute `IIndexDocumentBuilder`s, so one document is assembled from several sources rather than owned by one.

## When to use

- Catalogue browse, search and faceting — at any real catalogue size this is the only viable read path
- Filtering or aggregating over fields that would be expensive in SQL
- Adding your own field to an existing document, by contributing a builder instead of forking the owning module

## Avoid

- Treating the index as the source of truth. It is a projection, and it can be rebuilt
- Reading from the index immediately after a write and expecting your change — indexing is asynchronous
- Lucene in a scaled-out deployment; it is a local index, so every instance would hold its own copy
- Reindexing everything on every change when `IndexChangesAsync` exists

## Note

Search is a module, not platform core, and the engine behind it is a further module chosen per deployment — the same port-and-adapter shape as background-job engines: one active provider, selected in configuration.

## API

- `ISearchProvider — SearchAsync / IndexAsync / RemoveAsync / DeleteIndexAsync` · (vc-module-search — VirtoCommerce.SearchModule.Core.Services)
- `IIndexingManager — IndexAllDocumentsAsync / IndexChangesAsync / GetIndexStateAsync` · (vc-module-search — orchestrates full and incremental indexing)
- `IIndexDocumentBuilder` · (vc-module-search — how a module contributes fields to a document)
- `IIndexingJobService` · (vc-module-search — scheduled and on-demand indexing)
- `VirtoCommerce.Search + ElasticSearch8 | ElasticSearch9 | LuceneSearch | AzureSearch | OpenSearch` · (module ids from the vc-modules registry)

## Example

```csharp
// Contribute fields to a document type instead of forking the module that owns it.
public class MyProductFieldsBuilder(IMyService service) : IIndexDocumentBuilder
{
    public async Task<IList<IndexDocument>> GetDocumentsAsync(IList<string> documentIds)
    {
        var extras = await service.GetAsync(documentIds);

        return extras.Select(x =>
        {
            var doc = new IndexDocument(x.ProductId);
            doc.AddFilterableString("abcVendorCode", x.VendorCode);
            return doc;
        }).ToList();
    }
}

// Incremental beats full: index what changed, not the whole catalogue.
await _indexingManager.IndexChangesAsync(options, progress => { }, cancellationToken);
```

## Pitfalls

- There is a consistency window between a write and the index reflecting it. Every "the change is saved but the list still shows the old value" report starts here.
- A document is assembled from every registered builder for its type, so one slow builder slows indexing for everyone contributing to that document.
- Engine versions are separate modules (`ElasticSearch8` vs `ElasticSearch9`) — check which matches your server before installing.
- `IIndexingManager.IndexDocumentsAsync` has `[Obsolete]` overloads without a `CancellationToken` (VC0014); use the cancellation-aware ones.
- The synchronous members of `IIndexingJobService` are `[Obsolete]` (VC0015) and now throw `NotImplementedException`; call `EnqueueAsync`, `EnqueueIndexAndDeleteDocumentsAsync` and `CancelIndexationAsync`. `StartStopRecurringJobs` does nothing any more: recurring indexing is declared when the module initializes.

## Documentation

- [Indexed search overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Indexed-Search/overview/)
- [Indexing overview](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Indexed-Search/indexing/overview/)
- [Blue-green indexing](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Indexed-Search/indexing/blue-green-indexing/)
- [Configuring Elasticsearch](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Indexed-Search/integration/configuring-elasticsearch/)
- [vc-module-search (GitHub)](https://github.com/VirtoCommerce/vc-module-search)

## See also

- [Assets & blob storage](assets.md): Binary storage for images, imports and exports — behind a provider the platform core does not ship.
- [EF Core & migrations](ef-core.md): EF Core 10 across three database providers — which is why a migration is never written just once.
- [Background jobs](background-jobs.md): Durable queued work that outlives the request, behind an engine-agnostic facade.
- [Domain events](domain-events.md): The preferred way for modules to react to each other without depending on each other.

## Topic

Part of **Search & indexing**: The read path the catalog actually depends on.
