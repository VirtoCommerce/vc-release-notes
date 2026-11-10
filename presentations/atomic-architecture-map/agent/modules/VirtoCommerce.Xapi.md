# Core Experience API (`VirtoCommerce.Xapi`)

> Module represents a core functionality for GraphQL and other XAPI modules

- Latest version: 3.1030.0 (needs platform 3.1078.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-api
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.Xapi`

## For business analysts

The front door for every storefront and AI client: one GraphQL endpoint where a caller asks for exactly the fields it needs.

## For architects

The core of the experience-API tier — 15 schema builders of its own, and the machinery every other X module plugs into. No database. It declares an incompatibility with the deprecated VirtoCommerce.ExperienceApi, so the two cannot be installed together, and nine settings gate introspection, the playground, complexity limits and WebSocket keep-alive.

## For developers

Query and mutation types resolve through `AbstractTypeFactory`, so a solution extends a shipped query instead of forking it. Builders are singletons — resolve the mediator per request through `context.GetMediator()`, never in a constructor (the old ctor is `[Obsolete]`, diagnostic VC0015).

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [SEO](VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`) ≥ 3.1005.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Optional modules

- [Azure Application Insights](VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`) ≥ 3.1005.0
- [Tax Core](VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`) ≥ 3.1007.0

## Cannot be installed with

- `VirtoCommerce.ExperienceApi`

## GraphQL builders

- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/BaseQueries/QueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/BaseQueries/QueryBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/BaseQueries/RequestBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/BaseQueries/RequestBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/BaseQueries/SearchQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/BaseQueries/SearchQueryBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Extensions/ServiceCollectionExtensions.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Extensions/ServiceCollectionExtensions.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/ISchemaBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/ISchemaBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/SchemaFactory.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/SchemaFactory.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Infrastructure/ScopedSchemaFactory.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Infrastructure/ScopedSchemaFactory.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Core/Queries/BaseQueries/LocalizedSettingQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Core/Queries/BaseQueries/LocalizedSettingQueryBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Data/Queries/GetStoreQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Data/Queries/GetStoreQueryBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Data/Queries/SlugInfoQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Data/Queries/SlugInfoQueryBuilder.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Data/Schemas/CoreSchema.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Data/Schemas/CoreSchema.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Data/Schemas/DynamicPropertySchema.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Data/Schemas/DynamicPropertySchema.cs)
- [vc-module-x-api/src/VirtoCommerce.Xapi.Data/Schemas/SubscriptionSchema.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/src/VirtoCommerce.Xapi.Data/Schemas/SubscriptionSchema.cs)
- [vc-module-x-api/tests/VirtoCommerce.Xapi.Tests/BaseQueries/RequestBuilderTests.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/tests/VirtoCommerce.Xapi.Tests/BaseQueries/RequestBuilderTests.cs)
- [vc-module-x-api/tests/VirtoCommerce.Xapi.Tests/GraphQLSingletonMediatorInjectionTests.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/tests/VirtoCommerce.Xapi.Tests/GraphQLSingletonMediatorInjectionTests.cs)
- [vc-module-x-api/tests/VirtoCommerce.Xapi.Tests/Infrastructure/ScopedSchemaFactoryTests.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/tests/VirtoCommerce.Xapi.Tests/Infrastructure/ScopedSchemaFactoryTests.cs)
- [vc-module-x-api/tests/VirtoCommerce.Xapi.Tests/RequestScopedCacheInjectionTests.cs](https://github.com/VirtoCommerce/vc-module-x-api/blob/dev/tests/VirtoCommerce.Xapi.Tests/RequestScopedCacheInjectionTests.cs)

## Permissions

- `VirtoCommerce:GraphQL`
- `VirtoCommerce:GraphQLComplexityValidation`
- `VirtoCommerce:GraphQLDistributedLock`
- `VirtoCommerce:GraphQLPlayground`
- `VirtoCommerce:GraphQLWebSocket`
- `VirtoCommerce:Stores`

## Settings

- `Frontend.CatalogEmptyCategoriesEnabled`
- `Frontend.CatalogMenuLinkListName`
- `Frontend.ContinueShoppingLink`
- `Frontend.PageTitleDivider`
- `Frontend.PageTitleStoreNameAlign`
- `Frontend.PageTitleWithStoreName`
- `Frontend.SupportPhoneNumber`
- `VirtoCommerce.Platform.EnvironmentName`
- `XAPI.Security.ReturnModuleVersion`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Catalogue over API** (Catalog & discovery): Any channel — web, app, marketplace, AI agent — reads the catalogue through one GraphQL endpoint.
- **Cart & checkout over API** (Cart & checkout): A storefront drives the whole basket and checkout flow in single round trips.

## Key features

- [xAPI](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/): Core business API module.
- [xCatalog](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Catalog/overview/): Manages catalog-related operations.
- [xCart](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Cart/overview/): Handles cart-related functionalities.
- [xOrders](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Order/overview/): Manages order processing.
- [xProfile](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Profile/overview/): Handles My Customer and My Organization functionalities.

## Documentation

- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
