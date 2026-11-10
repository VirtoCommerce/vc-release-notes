# Purchase (package)

> Cart and checkout on top of someone else’s catalog — your own, or several vendor APIs.

- Audience: Transact
- Modules: 38, for platform 3.1076.0
- Manifest: https://github.com/VirtoCommerce/vc-modules/blob/master/pbc/purchase-packages.json
- On the map: `#/cell/purchase`

## Overview

This package is crucial if you already have an e-commerce catalog or are building a marketplace that aggregates catalog data from multiple vendor APIs, like Amazon or Booking. Virto Commerce can be used to build cart and checkout experiences for placing orders.

## Business outcomes

- Add cart and checkout to a catalogue you already have — yours, or several vendors’ APIs.
- Take money: payment methods per store, with the gateway of the business’s choosing.
- Quote shipping and tax before the shopper commits, not after.
- Turn a basket into an order document that finance and fulfilment can both work from.
- Apply promotions and coupons at checkout, changed by marketing rather than by a release.
- Sell to organisations: a buyer orders on behalf of their company, within their limits.

## Business features included

- **Product catalogue** (Catalog & discovery): Hold products, variations and categories with the attributes that describe them.
- **Faceted search & filters** (Catalog & discovery): Shoppers narrow a large assortment by the properties that matter to them.
- **Catalogue over API** (Catalog & discovery): Any channel — web, app, marketplace, AI agent — reads the catalogue through one GraphQL endpoint.
- **SEO-friendly URLs & redirects** (Catalog & discovery): Readable addresses for every product and page, and redirects when something moves.
- **Product data authoring** (Product data): Category managers create and edit product data in one place instead of in spreadsheets.
- **Images, video & documents** (Product data): Rich media on products, stored wherever the deployment keeps files.
- **Units & measurements** (Product data): Sell by weight, length or volume with units the business actually uses.
- **Price lists & assignments** (Pricing): Different prices for different audiences, decided per request rather than stored per product.
- **Bulk price import** (Pricing): Replace a whole price list from a supplier file.
- **Multiple currencies** (Pricing): Sell in the currencies each market expects, with rates you control.
- **Tax calculation** (Pricing): Tax worked out per order rather than typed in, by whichever provider you choose.
- **Shopping cart** (Cart & checkout): A basket that survives between visits and recalculates as it changes.
- **Cart & checkout over API** (Cart & checkout): A storefront drives the whole basket and checkout flow in single round trips.
- **Wish lists** (Cart & checkout): Shoppers save products for later, in one list or several.
- **Payment methods** (Cart & checkout): Offer the ways to pay each store needs, configured rather than coded.
- **Pay by invoice or on account** (Cart & checkout): B2B buyers order now and settle later, with no gateway involved.
- **Shipping methods & rates** (Cart & checkout): Delivery options per store, priced by rule or by carrier.
- **Abandoned-cart reminders** (Cart & checkout): Shoppers who left something behind are reminded, on a schedule you set.
- **Order management** (Orders & fulfilment): The committed record of a sale, with everything that happens to it afterwards.
- **Order history for shoppers** (Orders & fulfilment): Customers see and act on their own orders from the storefront.
- **Stock & fulfilment centres** (Orders & fulfilment): Know what is available and where it sits, and stop selling what is gone.
- **Companies & buyer accounts** (B2B buying): Sell to organisations: their people, their structure, and who may order.
- **Customer self-service** (B2B buying): A customer administrator manages their own colleagues and addresses, within your limits.
- **Fast reordering** (B2B buying): Buyers rebuild a basket from a previous order or a saved list instead of searching again.
- **Customer records** (Customer & accounts): Contacts, addresses, notes and preferences behind every order.
- **Customer import & export** (Customer & accounts): Migrate contacts in, and pull lists out, as files.
- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.
- **Pages, blocks & menus** (Content & experience): Editorial content per store, changed by marketing without a release.
- **Multiple storefronts** (Content & experience): Several stores, markets or brands from one installation, each configured its own way.
- **File uploads from the storefront** (Content & experience): Customers attach documents to orders and quotes, and get them back later.
- **Multi-language storefronts** (Content & experience): Sell in each market’s language, including the back office.
- **Promotions & discounts** (Marketing & loyalty): Campaign rules that change what a shopper pays, configured rather than coded.
- **Coupons with usage limits** (Marketing & loyalty): Codes that can be limited per customer and reported on afterwards.
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

- **xapi**: [File Experience API](../modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`), [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`), [Cart Experience API](../modules/VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`), [Catalog Experience API](../modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`), [Order Experience API](../modules/VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`), [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
- **services**: [Shopping Cart](../modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`), [Catalog](../modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`), [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`), [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`), [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`), [Inventory](../modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`), [Marketing](../modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`), [Native Payment Methods](../modules/VirtoCommerce.NativePaymentMethods.md) (`VirtoCommerce.NativePaymentMethods`), [Order Management](../modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`), [Payment](../modules/VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`), [Price Export Import](../modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`), [Pricing](../modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`), [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`), [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`), [Shipping](../modules/VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`), [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`), [Tax Core](../modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`)
- **platform**: [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`), [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`), [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`), [Backup & Restore](../modules/VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`), [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`), [Generic Export](../modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`)
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
- [Shopping Cart](../modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`)
- [Catalog](../modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
- [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`)
- [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`)
- [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`)
- [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`)
- [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`)
- [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`)
- [Generic Export](../modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`)
- [File Experience API](../modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`)
- [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- [Inventory](../modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`)
- [Marketing](../modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`)
- [Native Payment Methods](../modules/VirtoCommerce.NativePaymentMethods.md) (`VirtoCommerce.NativePaymentMethods`)
- [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
- [Order Management](../modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`)
- [Payment](../modules/VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`)
- [Price Export Import](../modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`)
- [Pricing](../modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`)
- [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`)
- [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`)
- [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`)
- [Shipping](../modules/VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`)
- [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`)
- [Tax Core](../modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`)
- [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)
- [Cart Experience API](../modules/VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`)
- [Catalog Experience API](../modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`)
- [Order Experience API](../modules/VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`)
- [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
