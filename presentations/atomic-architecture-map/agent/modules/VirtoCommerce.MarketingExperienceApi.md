# Marketing Experience API (`VirtoCommerce.MarketingExperienceApi`)

> Experience Api extension for Marketing

- Latest version: 3.1004.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-marketing-experience-api
- Area: Marketing & loyalty
- On the map: `#/molecule/VirtoCommerce.MarketingExperienceApi`

## For business analysts

Campaign content and promotions as a storefront sees them — what to show, where, and to whom.

## For architects

Two schema builders over Marketing. Three required dependencies and no storage: personalised content is evaluated per request, which is why a marketing Cell is usually folded into the catalog host rather than deployed alone.

## For developers

Dynamic content placement is evaluated live; cache the query result, not the decision, or a campaign change will not appear.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1010.0
- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1001.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1015.0

## GraphQL builders

- [vc-module-marketing-experience-api/src/VirtoCommerce.MarketingExperienceApi.Data/Queries/EvaluateDynamicContentQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-marketing-experience-api/blob/dev/src/VirtoCommerce.MarketingExperienceApi.Data/Queries/EvaluateDynamicContentQueryBuilder.cs)
- [vc-module-marketing-experience-api/src/VirtoCommerce.MarketingExperienceApi.Data/Queries/PromotionCouponsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-marketing-experience-api/blob/dev/src/VirtoCommerce.MarketingExperienceApi.Data/Queries/PromotionCouponsQueryBuilder.cs)

## Permissions

- `MarketingExperienceApi:create`
- `MarketingExperienceApi:delete`
- `MarketingExperienceApi:read`
- `MarketingExperienceApi:update`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Targeted on-site content** (Marketing & loyalty): Banners and blocks that change by audience, place or campaign.

## Key features

- Allows you to evaluate dynamic content based on dynamic conditions.
- Ready for banners, slideshow, popup, etc.

## Documentation

- [xMarketing module documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Marketing/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-marketing-experience-api/)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
