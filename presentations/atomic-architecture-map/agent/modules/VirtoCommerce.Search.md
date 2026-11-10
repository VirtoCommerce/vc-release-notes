# Search Core (`VirtoCommerce.Search`)

> Defines Core Abstractions for indexed search functionality above different search providers, like: Elasticsearch, Azure Search, etc.

- Latest version: 3.1015.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-search
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.Search`

## For business analysts

The engine room behind every product list, filter and search box. It holds no business data of its own — it describes how other modules' data is turned into searchable documents, and keeps those documents in step with the database.

## For architects

The clearest port-and-adapter in the platform: **no database, no entities, no migrations, and no module dependencies**. Providers — Elasticsearch, Azure Search, OpenSearch, Algolia, Lucene — plug in behind it, and twelve document builders are contributed by the modules that own the data. That inversion is why Catalog, Customer, Orders and Pricing all list Search as a dependency and none of them knows which engine is running. Indexing is a background job, so an index host and a request host can be different machines.

## For developers

Contribute an `IIndexDocumentBuilder` for your own entity rather than writing to the index directly, and let the changes provider tell the job what moved. `VirtoCommerce.Search.IndexingJobs.CronExpression` and `.Enable` control the schedule; `search:index:rebuild` is the permission behind a full reindex. Partial document update exists for the case where one field changed and the whole document need not be rebuilt.

## Use it when

- Anything must be searchable, filterable or facetable at storefront scale
- You are adding your own entity to the index — write a document builder, not an index writer
- A provider needs swapping, or a second index has to be built alongside the live one

## Do not use it when

- You need a transactional read of the current row — the index is eventually consistent, on purpose
- You are looking for the data itself: this module stores none of it
- A single record must be correct the instant it is written — read the owning module, not the index

## REST controllers

- `api/search/index-field-settings` · 5 actions · [vc-module-search/src/VirtoCommerce.SearchModule.Web/Controllers/Api/IndexFieldSettingController.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Web/Controllers/Api/IndexFieldSettingController.cs)
- `api/search/indexes` · 7 actions · [vc-module-search/src/VirtoCommerce.SearchModule.Web/Controllers/Api/SearchIndexationModuleController.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Web/Controllers/Api/SearchIndexationModuleController.cs)

## Search index builders

- [vc-module-search/src/VirtoCommerce.SearchModule.Core/BackgroundJobs/IIndexingJobService.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/BackgroundJobs/IIndexingJobService.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Core/Extensions/IndexDocumentConfigurationExtensions.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/Extensions/IndexDocumentConfigurationExtensions.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Core/Model/IndexDocumentChange.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/Model/IndexDocumentChange.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Core/Model/IndexDocumentSource.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/Model/IndexDocumentSource.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Core/Services/IIndexDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/Services/IIndexDocumentBuilder.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Core/Services/IIndexDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Core/Services/IIndexDocumentChangesProvider.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Data/BackgroundJobs/IndexingJobs.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Data/BackgroundJobs/IndexingJobs.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Data/Services/BatchIndexingOptions.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Data/Services/BatchIndexingOptions.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Data/Services/DummyIndexDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Data/Services/DummyIndexDocumentBuilder.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Data/Services/IndexDocumentChangeFeedFactoryAdapter.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Data/Services/IndexDocumentChangeFeedFactoryAdapter.cs)
- [vc-module-search/src/VirtoCommerce.SearchModule.Data/Services/IndexingManager.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/src/VirtoCommerce.SearchModule.Data/Services/IndexingManager.cs)
- [vc-module-search/tests/VirtoCommerce.SearchModule.Tests/DocumentSource.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/tests/VirtoCommerce.SearchModule.Tests/DocumentSource.cs)
- [vc-module-search/tests/VirtoCommerce.SearchModule.Tests/IndexingJobServiceContractTests.cs](https://github.com/VirtoCommerce/vc-module-search/blob/dev/tests/VirtoCommerce.SearchModule.Tests/IndexingJobServiceContractTests.cs)

## Permissions

- `search:index:access`
- `search:index:manage`
- `search:index:read`
- `search:index:rebuild`

## Settings

- `VirtoCommerce.Search.IndexPartitionSize`
- `VirtoCommerce.Search.IndexSettings`
- `VirtoCommerce.Search.IndexingJobs.CronExpression`
- `VirtoCommerce.Search.IndexingJobs.CurrentJobId`
- `VirtoCommerce.Search.IndexingJobs.Enable`
- `VirtoCommerce.Search.PartialDocumentUpdate.Enable`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Faceted search & filters** (Catalog & discovery): Shoppers narrow a large assortment by the properties that matter to them.
- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Key features

- **Pluggable provider model**: swap search engines without changing the rest of the platform.
- **Multi-document support**: index and search multiple document types in a unified way.
- **Per-document provider & scope routing**: select provider/scope per document type via configuration.
- **Indexing orchestration**: supports full rebuild and incremental “changes” indexation.
- **Blue-green indexation support**: supports backup indices and index swap for providers that implement it.
- **Scheduled background jobs**: recurring indexation via Hangfire, controllable by platform settings.
- **Search phrase parsing**: query/phrase parsing infrastructure (ANTLR-based) for consistent request building.
- **Admin integration**: API endpoints, permissions, and back office UI assets/localization for managing indexing.

## Documentation

- [Search module user documentation](https://docs.virtocommerce.org/platform/user-guide/search/overview/)
- [Search module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Search)
- [Search providers configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#search)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-search)
