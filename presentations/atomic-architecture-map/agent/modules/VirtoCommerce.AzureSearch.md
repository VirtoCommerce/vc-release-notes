# Azure Search (`VirtoCommerce.AzureSearch`)

> Search functionality with Elastic Azure Search service

- Latest version: 3.1009.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-azure-search
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.AzureSearch`

## For business analysts

Search served by Azure AI Search instead of a self-hosted engine.

## For architects

A Search adapter with three settings — the managed-service trade: less to operate, less to tune. Natural fit when the rest of the deployment is already Azure.

## For developers

Index definitions come from the platform's document builders; the service's own tuning knobs are outside them. Watch service tier limits before a full reindex.

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

- `VirtoCommerce.Search.AzureSearch.NGramTokenFilter.MaxGram`
- `VirtoCommerce.Search.AzureSearch.NGramTokenFilter.MinGram`
- `VirtoCommerce.Search.AzureSearch.TokenFilter`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Documentation

- [Azure Search module user documentation](https://docs.virtocommerce.org/platform/user-guide/azure-search/overview/)
- [Azure Search module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/integration/configuring-azure-cognitive-search/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.AzureSearch)
- [Azure Search configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#azure-search)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-azure-search)
