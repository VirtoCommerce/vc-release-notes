# Elastic Search 9 (`VirtoCommerce.ElasticSearch9`)

> Indexed search functionality with Elastic 9 engines.

- Latest version: 3.1006.0 (needs platform 3.1073.0)
- Repository: https://github.com/VirtoCommerce/vc-module-elastic-search-9
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.ElasticSearch9`

## For business analysts

The same search capability on Elasticsearch 9.

## For architects

The forward-looking Elasticsearch adapter, with the same twelve-setting surface as the 8.x one. Two adapters for one engine family exist so an upgrade is an install, not a migration.

## For developers

Run one at a time. Treat a major-version move as a reindex exercise: build the new index alongside, then switch.

## Use it when

- This engine is the one your infrastructure already runs or your hosting provides
- Search behaviour or scale has outgrown the current provider
- You need the provider's own features — synonyms, analysers, vector search

## Do not use it when

- Two providers at once: the platform binds one at a time
- You want to change what is indexed — that is the owning module's document builder
- The problem is stale results: that is indexation, not the engine

## Required modules

- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1000.0

## Settings

- `VirtoCommerce.Search.ElasticSearch9.IndexTotalFieldsLimit`
- `VirtoCommerce.Search.ElasticSearch9.KeywordBoost`
- `VirtoCommerce.Search.ElasticSearch9.MinScore`
- `VirtoCommerce.Search.ElasticSearch9.MinScorePerDocumentType`
- `VirtoCommerce.Search.ElasticSearch9.NGramTokenFilter.MaxGram`
- `VirtoCommerce.Search.ElasticSearch9.NGramTokenFilter.MinGram`
- `VirtoCommerce.Search.ElasticSearch9.SemanticBoost`
- `VirtoCommerce.Search.ElasticSearch9.SemanticModelId`
- `VirtoCommerce.Search.ElasticSearch9.SemanticPipelineName`
- `VirtoCommerce.Search.ElasticSearch9.SemanticSearchType`
- `VirtoCommerce.Search.ElasticSearch9.SemanticVectorModelDimensions`
- `VirtoCommerce.Search.ElasticSearch9.TokenFilter`

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Key features

- Full-text search with new .NET client for Elasticsearch.
- Semantic Search.
- Hybrid Mode Search - combine the best search results from full-text and semantic queries.
- Third-party ML models support.

## Documentation

- [Elastic Search 9 module user documentation](https://docs.virtocommerce.org/platform/user-guide/elastic-search-8/overview/)
- [Elastic Search 9 module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/integration/elastic-search-8/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.ElasticSearch9)
- [Search providers configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#search)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-elastic-search-9)
