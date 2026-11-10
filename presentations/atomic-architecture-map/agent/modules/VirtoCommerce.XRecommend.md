# Product Recommendations (`VirtoCommerce.XRecommend`)

> Recommendations encourage users to expand their search and browse more broadly. Users can jump to similar or complementary items if they don’t find a precise match.

- Latest version: 3.1003.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-recommend
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.XRecommend`

## For business analysts

Product recommendations for a storefront — "customers also bought", trending, and similar lists.

## For architects

Four schema builders and, unusually for an X module, two entities and 15 migrations of its own: it stores the recommendation data it serves rather than deriving it live. Two dependencies only, so it attaches to a catalog Cell cheaply.

## For developers

Four declared events make its data subscribable. Treat recommendation quality as data, not code — the module gives you the surface and the storage, not the algorithm.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1015.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1014.0

## Owns these entities

- `HistoricalEventEntity`
- `SearchQueryEntity`

## GraphQL builders

- [vc-module-x-recommend/src/VirtoCommerce.XRecommend.Data/Queries/CatalogQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-recommend/blob/dev/src/VirtoCommerce.XRecommend.Data/Queries/CatalogQueryBuilder.cs)
- [vc-module-x-recommend/src/VirtoCommerce.XRecommend.Data/Queries/GetRecentlyBrowsedQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-recommend/blob/dev/src/VirtoCommerce.XRecommend.Data/Queries/GetRecentlyBrowsedQueryBuilder.cs)
- [vc-module-x-recommend/src/VirtoCommerce.XRecommend.Data/Queries/GetRecommendationsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-recommend/blob/dev/src/VirtoCommerce.XRecommend.Data/Queries/GetRecommendationsQueryBuilder.cs)
- [vc-module-x-recommend/src/VirtoCommerce.XRecommend.Data/Queries/SearchHistoryQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-recommend/blob/dev/src/VirtoCommerce.XRecommend.Data/Queries/SearchHistoryQueryBuilder.cs)

## Settings

- `XRecommend.MinConversionEventsCount`
- `XRecommend.RecommendationsEnabled`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 15.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Product recommendations** (Catalog & discovery): "Customers also bought" and similar lists on product and basket pages.

## Key features

- **Semantic Similarity**: Utilizes Elastic Search machine learning model to recommend products that are semantically similar to the given product.
- **Customizable**: Parameters such as the number of recommendations can be easily adjusted.
- **Extendable**: You can extend the current `related-products` model or add your own custom recommendation algorithms.
- **Easy Integration**: Provides a toggle setting to your store setting to enable or disable recommendations on your front-end app.

## Documentation

- [xRecommend module user documentation](https://docs.virtocommerce.org/platform/user-guide/recommend/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Recommend/overview/)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-x-recommend)
