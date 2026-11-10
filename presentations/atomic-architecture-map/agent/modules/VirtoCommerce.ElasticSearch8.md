# Elastic Search 8 (`VirtoCommerce.ElasticSearch8`)

> Indexed search functionality with Elastic 8 engines

- Latest version: 3.1011.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-elastic-search-8
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.ElasticSearch8`

## For business analysts

The search engine behind product listings and filters, on Elasticsearch 8.

## For architects

A Search adapter: one dependency, no schema. Twelve settings — the largest configuration surface of any provider here — which is where analysers, certificates and connection details live.

## For developers

Provider selection is configuration; your code talks to Search's abstractions. Check the settings before blaming the index: analyser choices change results more than document builders do.

## Use it when

- This engine is the one your infrastructure already runs or your hosting provides
- Search behaviour or scale has outgrown the current provider
- You need the provider's own features — synonyms, analysers, vector search

## Do not use it when

- Two providers at once: the platform binds one at a time
- You want to change what is indexed — that is the owning module's document builder
- The problem is stale results: that is indexation, not the engine

## Required modules

- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Settings

- `VirtoCommerce.Search.ElasticSearch8.IndexTotalFieldsLimit`
- `VirtoCommerce.Search.ElasticSearch8.KeywordBoost`
- `VirtoCommerce.Search.ElasticSearch8.MinScore`
- `VirtoCommerce.Search.ElasticSearch8.MinScorePerDocumentType`
- `VirtoCommerce.Search.ElasticSearch8.NGramTokenFilter.MaxGram`
- `VirtoCommerce.Search.ElasticSearch8.NGramTokenFilter.MinGram`
- `VirtoCommerce.Search.ElasticSearch8.SemanticBoost`
- `VirtoCommerce.Search.ElasticSearch8.SemanticModelId`
- `VirtoCommerce.Search.ElasticSearch8.SemanticPipelineName`
- `VirtoCommerce.Search.ElasticSearch8.SemanticSearchType`
- `VirtoCommerce.Search.ElasticSearch8.SemanticVectorModelDimensions`
- `VirtoCommerce.Search.ElasticSearch8.TokenFilter`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Key features

- Full-text search with new .NET client for Elasticsearch.
- Semantic Search.
- Hybrid Mode Search - combine the best search results from full-text and semantic queries.
- Third-party ML models support.

## Documentation

- [Elastic Search 8 module user documentation](https://docs.virtocommerce.org/platform/user-guide/elastic-search-8/overview/)
- [Elastic Search 8 module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/integration/elastic-search-8/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.ElasticSearch8)
- [Search providers configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#search)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-elastic-search-8)
