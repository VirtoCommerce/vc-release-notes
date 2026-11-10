# Elastic App Search (`VirtoCommerce.ElasticAppSearch`)

> Search functionality with Elastic App Search service

- Latest version: 3.1003.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-elastic-app-search
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.ElasticAppSearch`

## For business analysts

Search through Elastic App Search's managed relevance tuning.

## For architects

A Search adapter with one setting and two permissions of its own — relevance is tuned in the service, not in code.

## For developers

Useful when a merchandiser should tune search without a release; the trade is that tuning lives outside your repository.

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

- `elasticappsearch:access`
- `elasticappsearch:diagnostic`

## Settings

- `ElasticAppSearch.MaxFacetValueCount`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Key features

- Fulltext Search Provider compatible with Elastic App Search version 8.12 and above.
- Boosting Profile functionality.
- Dynamic Boosting Concatenation: The provider combines dynamic boosting with query and static boosting from the Search Relevance Tuning panel.

## Documentation

- [Elastic App Search module user documentation](https://docs.virtocommerce.org/platform/user-guide/elastic-app-search/overview/)
- [Elastic App Search module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/integration/elastic-app-search-overview/)
- [Elastic App Search configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#elastic-app-search)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.ElasticAppSearch)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-elastic-app-search/)
