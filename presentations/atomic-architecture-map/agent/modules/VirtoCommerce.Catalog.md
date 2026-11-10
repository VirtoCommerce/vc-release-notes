# Catalog (`VirtoCommerce.Catalog`)

> Easily manage your products, categories, variations, and properties

- Latest version: 3.1052.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-catalog
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.Catalog`

## For business analysts

The product record itself: what you sell, how it is grouped into catalogs and categories, and the properties, measures, images and videos that describe it. Everything a shopper searches or filters on starts as data in here, and so does everything a merchandiser edits.

## For architects

The largest owned schema on the map — 33 entities and 94 migrations — and the module the most others point at by id. It cannot be installed alone: Search is a REQUIRED dependency, not an optional one, because the read path is the index rather than the tables. Four index document builders feed that index, so any bulk write leaves the index behind until a reindex catches up.

## For developers

Eighteen declared change events make this the module you subscribe to rather than call into — `ProductChangedEvent` and `CategoryChangedEvent` are the two most handled events in the platform. Sixteen controllers under `api/catalog/…` cover the write side; for reads at scale go through the index or the catalog experience API instead.

## Use it when

- You need the source of truth for products, categories or properties
- A module must react to a product or category change — subscribe to its events rather than polling
- You are modelling anything a merchandiser maintains: variations, measures, associations, videos

## Do not use it when

- You are serving a storefront listing or a faceted search — that is the index, and going to the tables will not scale
- You need a price: prices live in Pricing and are evaluated, not stored on the product
- You are writing thousands of products in a loop — suppress events or turn event-based indexation off, then reindex once
- You want a product's stock: that is Inventory, and it is deliberately a separate module

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Backup & Restore](VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`) ≥ 3.1007.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [SEO](VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`) ≥ 3.1006.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Optional modules

- [Bulk Actions](VirtoCommerce.BulkActionsModule.md) (`VirtoCommerce.BulkActionsModule`) ≥ 3.1004.0
- [Generic Export](VirtoCommerce.Export.md) (`VirtoCommerce.Export`) ≥ 3.1005.0

## Owns these entities

- `CatalogEntity`
- `CategoryEntity`
- `ItemEntity`
- `PropertyEntity`
- `AssociationEntity`
- `EditorialReviewEntity`

## Events it publishes

- `CatalogChangedEvent`
- `CatalogChangingEvent`
- `CategoryChangedEvent`
- `CategoryChangingEvent`
- `ProductChangedEvent`
- `ProductChangingEvent`
- `PropertyChangedEvent`
- `PropertyChangingEvent`

## Events it handles

- `CategoryChangedEvent`
- `ProductChangedEvent`
- `ProductChangingEvent`

## REST controllers

- `api/catalog/automatic-link-queries` · 5 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/AutomaticLinkQueryController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/AutomaticLinkQueryController.cs)
- `api/catalog/aggregationproperties` · 3 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogBrowseFiltersController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogBrowseFiltersController.cs)
- `api/catalog/products/associations` · 6 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleAssociationsController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleAssociationsController.cs)
- `api/catalog/barcode-search` · 3 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleBarcodeSearchController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleBarcodeSearchController.cs)
- `api/brand-settings` · 2 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleBrandSettingController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleBrandSettingController.cs)
- `api/catalog/catalogs` · 9 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleCatalogsController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleCatalogsController.cs)
- `api/catalog/categories` · 13 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleCategoriesController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleCategoriesController.cs)
- `api/catalog/products/configurations` · 4 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleConfigurationsController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleConfigurationsController.cs)
- `api/catalog/search` · 3 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleIndexedSearchController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleIndexedSearchController.cs)
- `api/catalog/listentries` · 8 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleListEntryController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleListEntryController.cs)
- `api/catalog/measures` · 7 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleMeasuresController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleMeasuresController.cs)
- `api/catalog/products` · 15 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleProductsController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleProductsController.cs)
- `api/catalog/product-sortings` · 3 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleProductSortingController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleProductSortingController.cs)
- `api/catalog/properties` · 8 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModulePropertiesController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModulePropertiesController.cs)
- `api/catalog/dictionaryitems` · 4 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModulePropertyDictionaryItemsController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModulePropertyDictionaryItemsController.cs)
- `api/catalog/propertygroups` · 4 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModulePropertyGroupsController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModulePropertyGroupsController.cs)
- `api/catalog/videos` · 6 actions · [vc-module-catalog/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleVideosController.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Web/Controllers/Api/CatalogModuleVideosController.cs)

## Search index builders

- [vc-module-catalog/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/CategoryDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/CategoryDocumentBuilder.cs)
- [vc-module-catalog/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/CategoryDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/CategoryDocumentChangesProvider.cs)
- [vc-module-catalog/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/ProductDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/ProductDocumentBuilder.cs)
- [vc-module-catalog/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/ProductDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-catalog/blob/dev/src/VirtoCommerce.CatalogModule.Data/Search/Indexing/ProductDocumentChangesProvider.cs)

## Permissions

- `bulk-action:category:change`
- `bulk-action:properties:update`
- `catalog:BrowseFilters:Read`
- `catalog:BrowseFilters:Update`
- `catalog:access`
- `catalog:add-external-image`
- `catalog:categories:create`
- `catalog:categories:delete`
- `catalog:categories:link`
- `catalog:categories:read`
- `catalog:categories:update`
- `catalog:configurations:delete`
- `catalog:configurations:read`
- `catalog:configurations:update`
- `catalog:create`
- `catalog:custom-property:edit`
- `catalog:delete`
- `catalog:dictionary-property:edit`
- `catalog:export`
- `catalog:import`
- `catalog:metadata-property:edit`
- `catalog:products:create`
- `catalog:products:delete`
- `catalog:products:link`
- `catalog:products:read`
- `catalog:products:update`
- `catalog:read`
- `catalog:update`
- `measures:access`
- `measures:create`
- `measures:delete`
- `measures:read`
- `measures:update`

## Settings

- `Catalog.AssociationGroups`
- `Catalog.BackupRestore.BatchSize`
- `Catalog.BackupRestore.ErrorPolicy`
- `Catalog.BrandStoreSetting.BrandCatalogId`
- `Catalog.BrandStoreSetting.BrandPropertyName`
- `Catalog.BrandStoreSetting.BrandsEnabled`
- `Catalog.BrowseFilters.FilteredBrowsing`
- `Catalog.BrowseFilters.FilteredBrowsingMigrated`
- `Catalog.CategoryDescriptionTypes`
- `Catalog.EditorialReviewTypes`
- `Catalog.ImageCategories`
- `Catalog.ProductConfigurationMaximumFiles`
- `Catalog.Search.BarcodeScannerEnabled`
- `Catalog.Search.BarcodeSearchFields`
- `Catalog.Search.DefaultAggregationSize`
- `Catalog.Search.EventBasedIndexation.Enable`
- `Catalog.Search.IndexLinkPriorityFields`
- `Catalog.Search.ProductSortings`
- `Catalog.Search.UseCatalogIndexedSearchInManager`
- `Catalog.Search.UseFullObjectIndexStoring`
- `Catalog.UseSeoDeduplication`
- `VirtoCommerce.Search.IndexingJobs.IndexationDate.Category`
- `VirtoCommerce.Search.IndexingJobs.IndexationDate.Product`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 94.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Product catalogue** (Catalog & discovery): Hold products, variations and categories with the attributes that describe them.
- **Faceted search & filters** (Catalog & discovery): Shoppers narrow a large assortment by the properties that matter to them.
- **Product data authoring** (Product data): Category managers create and edit product data in one place instead of in spreadsheets.
- **Images, video & documents** (Product data): Rich media on products, stored wherever the deployment keeps files.
- **Units & measurements** (Product data): Sell by weight, length or volume with units the business actually uses.

## Key features

- Master and Virtual catalogs
- Multiple languages
- Multiple currencies
- Physical and Digital products
- Subscription products
- SEO Information
- Product Variations
- Product & Category attributes
- Flexible properties inheritance
- Sort and filter product listing based on any attribute
- Associations
- Personalization
- Categories taxonomy
- Full-text search engine
- Enterprise ready - supports millions of the products

## Documentation

- [Catalog module user documentation](https://docs.virtocommerce.org/platform/user-guide/catalog/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Catalog/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-catalog)
