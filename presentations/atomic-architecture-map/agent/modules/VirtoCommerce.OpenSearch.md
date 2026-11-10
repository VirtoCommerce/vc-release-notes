# Open Search (`VirtoCommerce.OpenSearch`)

> Indexed search functionality with OpenSearch

- Latest version: 3.1004.0 (needs platform 3.1073.0)
- Repository: https://github.com/VirtoCommerce/vc-module-open-search
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.OpenSearch`

## For business analysts

Search served by OpenSearch.

## For architects

A Search adapter with five settings, for deployments standardised on OpenSearch rather than Elasticsearch. Same document builders, different engine.

## For developers

Compatibility is close but not identical to Elasticsearch — verify analyser and query behaviour with your own data rather than assuming parity.

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

- `VirtoCommerce.Search.OpenSearch.DeleteDuplicateIndexes`
- `VirtoCommerce.Search.OpenSearch.IndexTotalFieldsLimit`
- `VirtoCommerce.Search.OpenSearch.NGramTokenFilter.MaxGram`
- `VirtoCommerce.Search.OpenSearch.NGramTokenFilter.MinGram`
- `VirtoCommerce.Search.OpenSearch.TokenFilter`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Documentation

- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Search)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-open-search)
