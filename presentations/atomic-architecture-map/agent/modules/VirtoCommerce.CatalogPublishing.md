# Catalog Publishing (`VirtoCommerce.CatalogPublishing`)

> Allow you to see progress on filling in information about products and marks missed info.

- Latest version: 3.1010.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-catalog-publishing
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.CatalogPublishing`

## For business analysts

A completeness check before products go live: which required fields, images or prices are missing, per channel.

## For architects

Five entities and 11 migrations over two dependencies, with two index builders — completeness is evaluated in bulk and projected, not computed on a page. No settings: the rules are data.

## For developers

Define evaluators for your own completeness rules. Because results are indexed, a rule change means re-evaluation; treat it as a batch job, not a validation hook.

## Use it when

- Merchandisers must know what is not ready to publish
- Different channels have different minimum data requirements
- Data quality needs a number attached to it

## Do not use it when

- You need hard validation at save time — that is a changing-event handler
- One channel with obvious rules: a report may be cheaper
- You expect it to fix data: it measures

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1008.0

## Owns these entities

- `CompletenessChannelCurrencyEntity`
- `CompletenessChannelEntity`
- `CompletenessChannelLanguageEntity`
- `CompletenessDetailEntity`
- `CompletenessEntryEntity`

## REST controllers

- `api/completeness` · 9 actions · [vc-module-catalog-publishing/src/VirtoCommerce.CatalogPublishingModule.Web/Controllers/Api/CompletenessController.cs](https://github.com/VirtoCommerce/vc-module-catalog-publishing/blob/dev/src/VirtoCommerce.CatalogPublishingModule.Web/Controllers/Api/CompletenessController.cs)

## Search index builders

- [vc-module-catalog-publishing/src/VirtoCommerce.CatalogPublishingModule.Data/Search/Indexing/ProductCompletenessChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-catalog-publishing/blob/dev/src/VirtoCommerce.CatalogPublishingModule.Data/Search/Indexing/ProductCompletenessChangesProvider.cs)
- [vc-module-catalog-publishing/src/VirtoCommerce.CatalogPublishingModule.Data/Search/Indexing/ProductCompletenessDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-catalog-publishing/blob/dev/src/VirtoCommerce.CatalogPublishingModule.Data/Search/Indexing/ProductCompletenessDocumentBuilder.cs)

## Permissions

- `channel:access`
- `channel:create`
- `channel:delete`
- `channel:read`
- `channel:update`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 11.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Data completeness scoring** (Product data): See which products are not ready to publish, per channel, before a customer finds the gap.

## Key features

- Control product quality (completeness) for multiple sales channels
- View list of incomplete products
- Find and highlight missing information in product details
- Extendable evaluation process

## Documentation

- [Catalog Publishing module documentation](https://docs.virtocommerce.org/platform/user-guide/catalog-publishing/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.CatalogPublishing)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-catalog-publishing/)
