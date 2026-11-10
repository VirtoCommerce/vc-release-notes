# CMS Experience API (`VirtoCommerce.XCMS`)

> Integrates with content management systems, facilitating seamless content delivery and management.

- Latest version: 3.1009.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-cms
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.XCMS`

## For business analysts

Pages, blocks and menus delivered to a storefront through the same GraphQL endpoint as products.

## For architects

Three schema builders over Content, with two optional dependencies — so a content Cell can run without the commerce modules at all. That makes it the cheapest capability to split out, and the usual first split in practice.

## For developers

Content comes from blob storage through Content's services; a query here composes rather than reads files. Cache with care: editorial changes are expected to appear without a deployment.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Content](VirtoCommerce.Content.md) (`VirtoCommerce.Content`) ≥ 3.1006.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0

## Optional modules

- [Virto Pages](VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`) ≥ 3.1012.0
- [CMS Page Builder](VirtoCommerce.PageBuilderModule.md) (`VirtoCommerce.PageBuilderModule`) ≥ 3.1031.0

## GraphQL builders

- [vc-module-x-cms/src/VirtoCommerce.XCMS.Data/Schemas/BuilderPageSchema.cs](https://github.com/VirtoCommerce/vc-module-x-cms/blob/dev/src/VirtoCommerce.XCMS.Data/Schemas/BuilderPageSchema.cs)
- [vc-module-x-cms/src/VirtoCommerce.XCMS.Data/Schemas/ContentSchema.cs](https://github.com/VirtoCommerce/vc-module-x-cms/blob/dev/src/VirtoCommerce.XCMS.Data/Schemas/ContentSchema.cs)
- [vc-module-x-cms/src/VirtoCommerce.XCMS.Data/Schemas/PageDocumentSchema.cs](https://github.com/VirtoCommerce/vc-module-x-cms/blob/dev/src/VirtoCommerce.XCMS.Data/Schemas/PageDocumentSchema.cs)

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Content over API** (Content & experience): A storefront fetches pages and menus from the same endpoint as its products.

## Key features

- **Page documents**: Retrieve page documents from the search index for the current date and context.
- **Dynamic content**: Deliver CMS content personalized by user, organization, store, and culture.
- **Routing support**: Resolve pages and content based on requested URLs and store configuration.
- **Search and filtering**: Filter pages by keyword, culture, and other contextual attributes.

## Documentation

- [xCMS module documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Content/overview/)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-x-cms)
