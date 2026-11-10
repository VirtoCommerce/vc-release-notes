# Catalog Personalization (`VirtoCommerce.CatalogPersonalization`)

> Help businesses personalize their categories and products to specific User Groups

- Latest version: 3.1010.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-catalog-personalization
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.CatalogPersonalization`

## For business analysts

Showing different products to different shoppers — by segment, behaviour or membership.

## For architects

Three entities, nine migrations, and **two index document builders**: personalisation is projected into the search index rather than evaluated per request, which is what makes it survive storefront traffic. Three dependencies only.

## For developers

Tagging drives the index, so a personalisation change needs a reindex to become visible — the trade-off for its speed. Two declared events tell you when that is needed.

## Use it when

- Different audiences should see different catalogues
- Segments already exist in customer data and should drive merchandising
- Personalised results must be as fast as ordinary search

## Do not use it when

- A single promotion covers it — Marketing is lighter
- You need per-request personalisation with no index delay
- Segments are not defined: this module applies them, it does not invent them

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Owns these entities

- `TagEntity`
- `TaggedItemEntity`
- `TaggedItemOutlineEntity`

## Events it publishes

- `TaggedItemChangedEvent`
- `TaggedItemChangingEvent`

## Events it handles

- `TaggedItemChangedEvent`

## REST controllers

- `api/personalization` · 6 actions · [vc-module-catalog-personalization/src/VirtoCommerce.CatalogPersonalizationModule.Web/Controllers/Api/PersonalizationModuleController.cs](https://github.com/VirtoCommerce/vc-module-catalog-personalization/blob/dev/src/VirtoCommerce.CatalogPersonalizationModule.Web/Controllers/Api/PersonalizationModuleController.cs)

## Search index builders

- [vc-module-catalog-personalization/src/VirtoCommerce.CatalogPersonalizationModule.Data/Search/Indexing/TaggedItemDocumentBuilderBase.cs](https://github.com/VirtoCommerce/vc-module-catalog-personalization/blob/dev/src/VirtoCommerce.CatalogPersonalizationModule.Data/Search/Indexing/TaggedItemDocumentBuilderBase.cs)
- [vc-module-catalog-personalization/src/VirtoCommerce.CatalogPersonalizationModule.Data/Search/Indexing/TaggedItemIndexChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-catalog-personalization/blob/dev/src/VirtoCommerce.CatalogPersonalizationModule.Data/Search/Indexing/TaggedItemIndexChangesProvider.cs)

## Permissions

- `personalization:update`

## Settings

- `CatalogPersonalization.CronExpression`
- `CatalogPersonalization.EnableOutlinesSynchronizationJob`
- `CatalogPersonalization.EventBasedIndexation`
- `CatalogPersonalization.LogTaggedItemsChanges`
- `CatalogPersonalization.TagsInheritancePolicy`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 9.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Personalised assortment** (Catalog & discovery): Different audiences see different products, without maintaining a second catalogue.

## Key features

- **Catalog visibility personalization**: Control who sees what in your storefront with the Catalog Personalization module.
- **Flexible User Group propagation**: Choose the propagation policy that works best for your catalog hierarchy with the User Group Propagation Policies feature.
- **Filtering with User Groups**: Improve storefront search results by assigning User Groups to Product Categories with the User Groups for Products or Categories Filtration feature.
- **Efficient User Group assignment**: Save time and effort with the Assign User Groups feature, allowing you to easily create and assign User Groups to Catalog Objects.

## Documentation

- [Catalog Personalization module user documentation](https://docs.virtocommerce.org/platform/user-guide/catalog-personalization/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.CatalogPersonalization)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-catalog-personalization)
