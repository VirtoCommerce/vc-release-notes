# Catalog Experience API (`VirtoCommerce.XCatalog`)

> Manages all catalog-related operations, from product listings to detailed item information.

- Latest version: 3.1024.0 (needs platform 3.1083.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-catalog
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.XCatalog`

## For business analysts

Product, category and search queries for a storefront — the read side of the catalogue, shaped for a page rather than for a table.

## For architects

Eight schema builders over Catalog, and the module that makes a catalog-read Cell possible: it declares three optional dependencies, so it can be deployed without pricing, inventory or marketing and simply returns less. Reads go to the index, not the catalog tables.

## For developers

Extend `ProductType` and the search query through the factory to add solution fields. Watch the N+1: resolve child collections through DataLoader, and remember a reindex is what makes new fields visible.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0

## Optional modules

- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1010.0
- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1009.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1008.0

## GraphQL builders

- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Queries/CatalogQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Queries/CatalogQueryBuilder.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Queries/ChildCategoriesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Queries/ChildCategoriesQueryBuilder.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Queries/GetBrandQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Queries/GetBrandQueryBuilder.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Queries/ProductSuggestionsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Queries/ProductSuggestionsQueryBuilder.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Queries/SearchBrandQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Queries/SearchBrandQueryBuilder.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Queries/SearchProductQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Queries/SearchProductQueryBuilder.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Schemas/DigitalCatalogSchema.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Schemas/DigitalCatalogSchema.cs)
- [vc-module-x-catalog/src/VirtoCommerce.XCatalog.Data/Schemas/InventorySchema.cs](https://github.com/VirtoCommerce/vc-module-x-catalog/blob/dev/src/VirtoCommerce.XCatalog.Data/Schemas/InventorySchema.cs)

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Catalogue over API** (Catalog & discovery): Any channel — web, app, marketplace, AI agent — reads the catalogue through one GraphQL endpoint.

## Documentation

- [xCatalog module documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Catalog/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-x-catalog)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
