# Digital Catalog (package)

> Catalog data over API and frontend — search, browse and filter, with no ability to buy.

- Audience: Catalog read
- Modules: 34, for platform 3.1076.0
- Manifest: https://github.com/VirtoCommerce/vc-modules/blob/master/pbc/digital-catalog-packages.json
- On the map: `#/cell/digital-catalog`

## Overview

A must-have if you need to grant access to your catalog data via Frontend or API without the ability to buy products. This package supports modern scenarios with advanced search, browsing and filtering capabilities, making it ideal for businesses that require robust catalog management solutions.

## Business outcomes

- Expose your catalogue to any channel — web, app, marketplace, AI agent — through one API.
- Shoppers find things: faceted search, filters and browse over a large assortment.
- Show different audiences different catalogues, without a second catalogue to maintain.
- Know what is not ready to publish before a customer finds the gap.
- No checkout, so no payment scope, no tax rules, and a much smaller thing to run.
- Editorial content and images sit beside the product data and are searchable with it.

## Business features included

- **Product catalogue** (Catalog & discovery): Hold products, variations and categories with the attributes that describe them.
- **Faceted search & filters** (Catalog & discovery): Shoppers narrow a large assortment by the properties that matter to them.
- **Catalogue over API** (Catalog & discovery): Any channel — web, app, marketplace, AI agent — reads the catalogue through one GraphQL endpoint.
- **Personalised assortment** (Catalog & discovery): Different audiences see different products, without maintaining a second catalogue.
- **SEO-friendly URLs & redirects** (Catalog & discovery): Readable addresses for every product and page, and redirects when something moves.
- **Product data authoring** (Product data): Category managers create and edit product data in one place instead of in spreadsheets.
- **Bulk product import & export** (Product data): Load or extract thousands of products as files, with the mapping saved for next time.
- **Bulk editing** (Product data): Recategorise or re-tag hundreds of records in one action rather than one at a time.
- **Data completeness scoring** (Product data): See which products are not ready to publish, per channel, before a customer finds the gap.
- **Images, video & documents** (Product data): Rich media on products, stored wherever the deployment keeps files.
- **Automatic image sizes** (Product data): One upload becomes every size the storefront needs.
- **Units & measurements** (Product data): Sell by weight, length or volume with units the business actually uses.
- **Price lists & assignments** (Pricing): Different prices for different audiences, decided per request rather than stored per product.
- **Bulk price import** (Pricing): Replace a whole price list from a supplier file.
- **Multiple currencies** (Pricing): Sell in the currencies each market expects, with rates you control.
- **Tax calculation** (Pricing): Tax worked out per order rather than typed in, by whichever provider you choose.
- **Stock & fulfilment centres** (Orders & fulfilment): Know what is available and where it sits, and stop selling what is gone.
- **Companies & buyer accounts** (B2B buying): Sell to organisations: their people, their structure, and who may order.
- **Customer self-service** (B2B buying): A customer administrator manages their own colleagues and addresses, within your limits.
- **Customer records** (Customer & accounts): Contacts, addresses, notes and preferences behind every order.
- **Customer import & export** (Customer & accounts): Migrate contacts in, and pull lists out, as files.
- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.
- **Pages, blocks & menus** (Content & experience): Editorial content per store, changed by marketing without a release.
- **Multiple storefronts** (Content & experience): Several stores, markets or brands from one installation, each configured its own way.
- **Multi-language storefronts** (Content & experience): Sell in each market’s language, including the back office.
- **Transactional email & SMS** (Marketing & loyalty): Order confirmations and alerts, with wording editable and delivery on record.
- **Outbound webhooks** (Integration & operations): External systems are told when something happens, without polling your API.
- **Event streaming to a queue** (Integration & operations): A durable stream of changes for integrations that must not miss one.
- **Data export as files** (Integration & operations): Any module’s data pulled out as CSV or JSON, on demand, from the back office.
- **Background processing** (Integration & operations): Long or scheduled work runs outside the request, and survives a restart.
- **Backup & restore** (Integration & operations): Move data between environments, and rehearse recovery rather than assume it.
- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.
- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.
- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.

## Modules by layer

- **xapi**: [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`), [Catalog Experience API](../modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`), [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
- **services**: [Catalog](../modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`), [CSV Catalog Export and Import](../modules/VirtoCommerce.CatalogCsvImportModule.md) (`VirtoCommerce.CatalogCsvImportModule`), [Catalog Personalization](../modules/VirtoCommerce.CatalogPersonalization.md) (`VirtoCommerce.CatalogPersonalization`), [Catalog Publishing](../modules/VirtoCommerce.CatalogPublishing.md) (`VirtoCommerce.CatalogPublishing`), [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`), [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`), [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`), [Image Tools](../modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`), [Inventory](../modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`), [Price Export Import](../modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`), [Pricing](../modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`), [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`), [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`), [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`), [Tax Core](../modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`)
- **platform**: [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`), [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`), [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`), [Backup & Restore](../modules/VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`), [Bulk Actions](../modules/VirtoCommerce.BulkActionsModule.md) (`VirtoCommerce.BulkActionsModule`), [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`), [Generic Export](../modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`)
- **integration**: [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`), [Azure Blob Storage Assets Provider](../modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`), [Azure Search](../modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`), [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`), [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`), [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- **outbound**: [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`), [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`), [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)

## All modules

- [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`)
- [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`)
- [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`)
- [Azure Blob Storage Assets Provider](../modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`)
- [Azure Search](../modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`)
- [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`)
- [Backup & Restore](../modules/VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`)
- [Bulk Actions](../modules/VirtoCommerce.BulkActionsModule.md) (`VirtoCommerce.BulkActionsModule`)
- [Catalog](../modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
- [CSV Catalog Export and Import](../modules/VirtoCommerce.CatalogCsvImportModule.md) (`VirtoCommerce.CatalogCsvImportModule`)
- [Catalog Personalization](../modules/VirtoCommerce.CatalogPersonalization.md) (`VirtoCommerce.CatalogPersonalization`)
- [Catalog Publishing](../modules/VirtoCommerce.CatalogPublishing.md) (`VirtoCommerce.CatalogPublishing`)
- [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`)
- [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`)
- [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`)
- [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`)
- [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`)
- [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`)
- [Generic Export](../modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`)
- [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- [Image Tools](../modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`)
- [Inventory](../modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`)
- [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
- [Price Export Import](../modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`)
- [Pricing](../modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`)
- [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`)
- [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`)
- [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`)
- [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`)
- [Tax Core](../modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`)
- [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)
- [Catalog Experience API](../modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`)
- [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
