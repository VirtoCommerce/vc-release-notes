# Lucene Search (`VirtoCommerce.LuceneSearch`)

> Indexed search functionality with Lucene engine

- Latest version: 3.1006.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-lucene-search
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.LuceneSearch`

## For business analysts

Search that runs in-process, with no service to install — the developer default.

## For architects

A Search adapter with no settings at all: it writes an index to local disk. That makes it perfect for a laptop and wrong for a cluster, because local disk is not shared between instances.

## For developers

Use it to develop and test; do not scale out on it. If two instances disagree about search results, this is why.

## Use it when

- A developer machine or a CI run needs search without infrastructure
- You are demonstrating the platform with nothing else installed

## Do not use it when

- Any deployment with more than one instance — the index is on local disk
- You need analysers or relevance tuning: reach for a real engine
- Production, in general

## Required modules

- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.

## Documentation

- [Lucene Search module user documentation](https://docs.virtocommerce.org/platform/user-guide/lucene/overview/)
- [Lucene Search module developer documentation](https://docs.virtocommerce.org/platform/developer-guide/Fundamentals/Indexed-Search/integration/lucene/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.LuceneSearch)
- [Lucene Search configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#lucene)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-lucene-search)
