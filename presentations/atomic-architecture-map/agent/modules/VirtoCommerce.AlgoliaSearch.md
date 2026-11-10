# Algolia Search (`VirtoCommerce.AlgoliaSearch`)

> Indexed search functionality with Algolia Search Engine

- Latest version: 3.1002.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-algolia-search
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AlgoliaSearch`

## For business analysts

Search delivered by Algolia, aimed at fast, typo-tolerant storefront search.

## For architects

A Search adapter with two settings. The engine is hosted and its relevance model is its own, so tuning moves out of the platform and into Algolia's dashboard.

## For developers

Records are pushed from the platform's builders; per-record cost and index size are the constraints to design for, not query latency.

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

## Permissions

- `algoliasearch:access`

## Settings

- `VirtoCommerce.Search.AlgoliaSearch.SortReplicas`
- `VirtoCommerce.Search.AlgoliaSearch.Version`

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Documentation

- [Algolia Search module user documentation](https://docs.virtocommerce.org/platform/user-guide/algolia/overview/)
- [Algolia Search module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/integration/algolia/)
- [Algolia Search configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#algolia)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-algolia-search)
