# Virto Start (package)

> A running B2B or B2C store out of the box, with the Virto Commerce Frontend already wired in.

- Audience: Whole solution
- Modules: 81, for platform 3.1076.0
- Manifest: https://github.com/VirtoCommerce/vc-modules/blob/master/pbc/virto-start-packages.json
- On the map: `#/cell/virto-start`

## Overview

Ideal for businesses that want a quick and hassle-free start with common B2B and B2C e-commerce configurations. This package is perfect for getting up and running swiftly, with native integration with Virto Commerce Frontend.

## Business outcomes

- A shopper can find products, fill a basket and pay — the whole path works on day one.
- Search, filter and browse a large catalogue at storefront speed.
- Sell to companies as well as people: organisations, their buyers, and who may order.
- Run campaigns and discounts without a release — promotions and coupons are configuration.
- Publish editorial pages and menus beside the products, edited by marketing.
- Tell other systems what happened — orders and changes stream out over webhooks or a queue.

## Business features included

- **Product catalogue** (Catalog & discovery): Hold products, variations and categories with the attributes that describe them.
- **Faceted search & filters** (Catalog & discovery): Shoppers narrow a large assortment by the properties that matter to them.
- **Catalogue over API** (Catalog & discovery): Any channel — web, app, marketplace, AI agent — reads the catalogue through one GraphQL endpoint.
- **Personalised assortment** (Catalog & discovery): Different audiences see different products, without maintaining a second catalogue.
- **Product recommendations** (Catalog & discovery): "Customers also bought" and similar lists on product and basket pages.
- **Related products by rule** (Catalog & discovery): Accessories, alternatives and cross-sells generated from rules instead of linked by hand.
- **Ratings & reviews** (Catalog & discovery): Shoppers rate and review products, with moderation before anything appears.
- **Back-in-stock alerts** (Catalog & discovery): Shoppers ask to be told when a sold-out product returns, and the demand is recorded.
- **SEO-friendly URLs & redirects** (Catalog & discovery): Readable addresses for every product and page, and redirects when something moves.
- **Sitemaps for search engines** (Catalog & discovery): Search engines discover the whole catalogue instead of crawling their way in.
- **Product data authoring** (Product data): Category managers create and edit product data in one place instead of in spreadsheets.
- **Bulk product import & export** (Product data): Load or extract thousands of products as files, with the mapping saved for next time.
- **Bulk editing** (Product data): Recategorise or re-tag hundreds of records in one action rather than one at a time.
- **Data completeness scoring** (Product data): See which products are not ready to publish, per channel, before a customer finds the gap.
- **Images, video & documents** (Product data): Rich media on products, stored wherever the deployment keeps files.
- **Automatic image sizes** (Product data): One upload becomes every size the storefront needs.
- **Product history snapshots** (Product data): Keep proof of what a product looked like when someone ordered it.
- **Units & measurements** (Product data): Sell by weight, length or volume with units the business actually uses.
- **Price lists & assignments** (Pricing): Different prices for different audiences, decided per request rather than stored per product.
- **Bulk price import** (Pricing): Replace a whole price list from a supplier file.
- **Contracted prices** (Pricing): Negotiated rates for a customer or organisation, valid for an agreed period.
- **Multiple currencies** (Pricing): Sell in the currencies each market expects, with rates you control.
- **Tax calculation** (Pricing): Tax worked out per order rather than typed in, by whichever provider you choose.
- **Jurisdiction-grade tax** (Pricing): Real rates, exemptions and filing data from a tax service.
- **Shopping cart** (Cart & checkout): A basket that survives between visits and recalculates as it changes.
- **Cart & checkout over API** (Cart & checkout): A storefront drives the whole basket and checkout flow in single round trips.
- **Wish lists** (Cart & checkout): Shoppers save products for later, in one list or several.
- **Payment methods** (Cart & checkout): Offer the ways to pay each store needs, configured rather than coded.
- **Card payments via gateway** (Cart & checkout): Take card payments without card data entering your systems.
- **Card data kept in a vault** (Cart & checkout): Sensitive payment details live outside the platform, which shrinks what has to be audited.
- **Pay by invoice or on account** (Cart & checkout): B2B buyers order now and settle later, with no gateway involved.
- **Shipping methods & rates** (Cart & checkout): Delivery options per store, priced by rule or by carrier.
- **Live carrier rates & labels** (Cart & checkout): Quote real shipping prices at checkout and print labels afterwards.
- **Buy online, pick up in store** (Cart & checkout): Shoppers choose a location to collect from, based on what is actually in stock there.
- **Abandoned-cart reminders** (Cart & checkout): Shoppers who left something behind are reminded, on a schedule you set.
- **Order management** (Orders & fulfilment): The committed record of a sale, with everything that happens to it afterwards.
- **Agent order workspace** (Orders & fulfilment): A purpose-built screen for the people who work orders all day.
- **Order history for shoppers** (Orders & fulfilment): Customers see and act on their own orders from the storefront.
- **Stock & fulfilment centres** (Orders & fulfilment): Know what is available and where it sits, and stop selling what is gone.
- **Returns & refunds** (Orders & fulfilment): Handle goods coming back and money going out, as separate steps that can fail apart.
- **Subscriptions & recurring orders** (Orders & fulfilment): Repeat orders placed on schedule, with pause, resume and cancel.
- **Approvals & assigned tasks** (Orders & fulfilment): Human steps in a process get an owner, a due date and a record.
- **Companies & buyer accounts** (B2B buying): Sell to organisations: their people, their structure, and who may order.
- **Customer self-service** (B2B buying): A customer administrator manages their own colleagues and addresses, within your limits.
- **Quote negotiation** (B2B buying): A buyer asks for a price, a salesperson answers, and the agreed quote becomes an order.
- **Fast reordering** (B2B buying): Buyers rebuild a basket from a previous order or a saved list instead of searching again.
- **Customer records** (Customer & accounts): Contacts, addresses, notes and preferences behind every order.
- **Customer import & export** (Customer & accounts): Migrate contacts in, and pull lists out, as files.
- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.
- **A customer’s own identity provider** (Customer & accounts): Each buying organisation authenticates against its own directory, whichever standard one it is.
- **Data export & erasure requests** (Customer & accounts): Answer a subject access or deletion request across everything the platform holds.
- **Pages, blocks & menus** (Content & experience): Editorial content per store, changed by marketing without a release.
- **Visual page building** (Content & experience): Marketing composes layouts from blocks by dragging, with a live preview.
- **Content over API** (Content & experience): A storefront fetches pages and menus from the same endpoint as its products.
- **News & articles** (Content & experience): Announcements and editorial articles with their own dates and categories.
- **Multiple storefronts** (Content & experience): Several stores, markets or brands from one installation, each configured its own way.
- **Per-brand branding** (Content & experience): Each brand or customer portal gets its own identity from data, not a separate deployment.
- **Content from an external CMS** (Content & experience): Editors keep working in the CMS the business already owns.
- **Lightweight content pages** (Content & experience): A few informational pages managed beside the catalogue, without a CMS to run.
- **Storefront settings over API** (Content & experience): A storefront configures itself — theme, locale, feature flags — from the same endpoint as its data.
- **File uploads from the storefront** (Content & experience): Customers attach documents to orders and quotes, and get them back later.
- **Multi-language storefronts** (Content & experience): Sell in each market’s language, including the back office.
- **Promotions & discounts** (Marketing & loyalty): Campaign rules that change what a shopper pays, configured rather than coded.
- **Coupons with usage limits** (Marketing & loyalty): Codes that can be limited per customer and reported on afterwards.
- **Targeted on-site content** (Marketing & loyalty): Banners and blocks that change by audience, place or campaign.
- **Loyalty points & tiers** (Marketing & loyalty): Customers earn and spend rewards, with balances the storefront can show.
- **Transactional email & SMS** (Marketing & loyalty): Order confirmations and alerts, with wording editable and delivery on record.
- **Funnel & revenue analytics** (Marketing & loyalty): Marketing measures the funnel in the analytics tool it already uses.
- **Outbound webhooks** (Integration & operations): External systems are told when something happens, without polling your API.
- **Event streaming to a queue** (Integration & operations): A durable stream of changes for integrations that must not miss one.
- **Data export as files** (Integration & operations): Any module’s data pulled out as CSV or JSON, on demand, from the back office.
- **Background processing** (Integration & operations): Long or scheduled work runs outside the request, and survives a restart.
- **Backup & restore** (Integration & operations): Move data between environments, and rehearse recovery rather than assume it.
- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.
- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.
- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.
- **Environment comparison** (Integration & operations): See exactly how staging differs from production before a release goes wrong.
- **Scheduled maintenance operations** (Integration & operations): Routine housekeeping runs on a schedule instead of on someone’s memory.
- **Ad-hoc reporting** (Integration & operations): Answer a data question today, without a BI project.
- **In-app alerts for staff** (AI & agents): People working in the back office are told when their long job finishes.

## Modules by layer

- **xapi**: [File Experience API](../modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`), [Marketing Experience API](../modules/VirtoCommerce.MarketingExperienceApi.md) (`VirtoCommerce.MarketingExperienceApi`), [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`), [CMS Experience API](../modules/VirtoCommerce.XCMS.md) (`VirtoCommerce.XCMS`), [Cart Experience API](../modules/VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`), [Catalog Experience API](../modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`), [Frontend Experience API](../modules/VirtoCommerce.XFrontend.md) (`VirtoCommerce.XFrontend`), [Order Experience API](../modules/VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`), [Buy online pickup in store (BOPIS) Experience API](../modules/VirtoCommerce.XPickup.md) (`VirtoCommerce.XPickup`), [Product Recommendations](../modules/VirtoCommerce.XRecommend.md) (`VirtoCommerce.XRecommend`), [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
- **services**: [Back In Stock](../modules/VirtoCommerce.BackInStock.md) (`VirtoCommerce.BackInStock`), [Shopping Cart](../modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`), [Catalog](../modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`), [CSV Catalog Export and Import](../modules/VirtoCommerce.CatalogCsvImportModule.md) (`VirtoCommerce.CatalogCsvImportModule`), [Catalog Personalization](../modules/VirtoCommerce.CatalogPersonalization.md) (`VirtoCommerce.CatalogPersonalization`), [Catalog Publishing](../modules/VirtoCommerce.CatalogPublishing.md) (`VirtoCommerce.CatalogPublishing`), [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`), [Contracts](../modules/VirtoCommerce.Contracts.md) (`VirtoCommerce.Contracts`), [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`), [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`), [Rating and Reviews](../modules/VirtoCommerce.CustomerReviews.md) (`VirtoCommerce.CustomerReviews`), [Dynamic Associations](../modules/VirtoCommerce.DynamicAssociationsModule.md) (`VirtoCommerce.DynamicAssociationsModule`), [GDPR](../modules/VirtoCommerce.GDPR.md) (`VirtoCommerce.GDPR`), [Image Tools](../modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`), [Inventory](../modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`), [Loyalty](../modules/VirtoCommerce.Loyalty.md) (`VirtoCommerce.Loyalty`), [Marketing](../modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`), [Native Payment Methods](../modules/VirtoCommerce.NativePaymentMethods.md) (`VirtoCommerce.NativePaymentMethods`), [News](../modules/VirtoCommerce.News.md) (`VirtoCommerce.News`), [OpenID Connect](../modules/VirtoCommerce.OpenIdConnectModule.md) (`VirtoCommerce.OpenIdConnectModule`), [Order Management (Business Rules)](../modules/VirtoCommerce.OrderManagement.md) (`VirtoCommerce.OrderManagement`), [Order Management](../modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`), [CMS Page Builder](../modules/VirtoCommerce.PageBuilderModule.md) (`VirtoCommerce.PageBuilderModule`), [Virto Pages](../modules/VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`), [Payment](../modules/VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`), [Price Export Import](../modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`), [Pricing](../modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`), [Product Snapshot](../modules/VirtoCommerce.ProductSnapshot.md) (`VirtoCommerce.ProductSnapshot`), [Quotes](../modules/VirtoCommerce.Quote.md) (`VirtoCommerce.Quote`), [Returns](../modules/VirtoCommerce.Return.md) (`VirtoCommerce.Return`), [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`), [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`), [Shipping](../modules/VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`), [Sitemap Generator](../modules/VirtoCommerce.Sitemaps.md) (`VirtoCommerce.Sitemaps`), [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`), [Subscriptions](../modules/VirtoCommerce.Subscription.md) (`VirtoCommerce.Subscription`), [Tax Core](../modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`), [White Labeling](../modules/VirtoCommerce.WhiteLabeling.md) (`VirtoCommerce.WhiteLabeling`)
- **platform**: [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`), [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`), [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`), [Backup & Restore](../modules/VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`), [Bulk Actions](../modules/VirtoCommerce.BulkActionsModule.md) (`VirtoCommerce.BulkActionsModule`), [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`), [Environments Compare](../modules/VirtoCommerce.EnvironmentsCompare.md) (`VirtoCommerce.EnvironmentsCompare`), [Generic Export](../modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`), [Push Messages](../modules/VirtoCommerce.PushMessages.md) (`VirtoCommerce.PushMessages`), [Sql Queries](../modules/VirtoCommerce.SqlQueries.md) (`VirtoCommerce.SqlQueries`), [System Operations](../modules/VirtoCommerce.SystemOperations.md) (`VirtoCommerce.SystemOperations`), [Task Management](../modules/VirtoCommerce.TaskManagement.md) (`VirtoCommerce.TaskManagement`)
- **integration**: [Authorize.Net Payment Method](../modules/VirtoCommerce.AuthorizeNetPayment.md) (`VirtoCommerce.AuthorizeNetPayment`), [Avalara Tax Provider](../modules/VirtoCommerce.AvalaraTax.md) (`VirtoCommerce.AvalaraTax`), [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`), [Azure Blob Storage Assets Provider](../modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`), [Azure Search](../modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`), [Builder.io](../modules/VirtoCommerce.BuilderIO.md) (`VirtoCommerce.BuilderIO`), [CyberSource Payment](../modules/VirtoCommerce.CyberSourcePayment.md) (`VirtoCommerce.CyberSourcePayment`), [Datatrans Payment](../modules/VirtoCommerce.Datatrans.md) (`VirtoCommerce.Datatrans`), [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`), [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`), [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`), [Google Analytics 4](../modules/VirtoCommerce.GoogleEcommerceAnalytics.md) (`VirtoCommerce.GoogleEcommerceAnalytics`), [Google Single Sign-On](../modules/VirtoCommerce.GoogleSSO.md) (`VirtoCommerce.GoogleSSO`), [Lucene Search](../modules/VirtoCommerce.LuceneSearch.md) (`VirtoCommerce.LuceneSearch`), [Open Search](../modules/VirtoCommerce.OpenSearch.md) (`VirtoCommerce.OpenSearch`), [ShipStation Integration](../modules/VirtoCommerce.ShipStation.md) (`VirtoCommerce.ShipStation`), [Skyflow](../modules/VirtoCommerce.Skyflow.md) (`VirtoCommerce.Skyflow`)
- **outbound**: [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`), [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`), [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)

## All modules

- [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`)
- [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`)
- [Authorize.Net Payment Method](../modules/VirtoCommerce.AuthorizeNetPayment.md) (`VirtoCommerce.AuthorizeNetPayment`)
- [Avalara Tax Provider](../modules/VirtoCommerce.AvalaraTax.md) (`VirtoCommerce.AvalaraTax`)
- [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`)
- [Azure Blob Storage Assets Provider](../modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`)
- [Azure Search](../modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`)
- [Back In Stock](../modules/VirtoCommerce.BackInStock.md) (`VirtoCommerce.BackInStock`)
- [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`)
- [Backup & Restore](../modules/VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`)
- [Builder.io](../modules/VirtoCommerce.BuilderIO.md) (`VirtoCommerce.BuilderIO`)
- [Bulk Actions](../modules/VirtoCommerce.BulkActionsModule.md) (`VirtoCommerce.BulkActionsModule`)
- [Shopping Cart](../modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`)
- [Catalog](../modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
- [CSV Catalog Export and Import](../modules/VirtoCommerce.CatalogCsvImportModule.md) (`VirtoCommerce.CatalogCsvImportModule`)
- [Catalog Personalization](../modules/VirtoCommerce.CatalogPersonalization.md) (`VirtoCommerce.CatalogPersonalization`)
- [Catalog Publishing](../modules/VirtoCommerce.CatalogPublishing.md) (`VirtoCommerce.CatalogPublishing`)
- [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`)
- [Contracts](../modules/VirtoCommerce.Contracts.md) (`VirtoCommerce.Contracts`)
- [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`)
- [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`)
- [Rating and Reviews](../modules/VirtoCommerce.CustomerReviews.md) (`VirtoCommerce.CustomerReviews`)
- [CyberSource Payment](../modules/VirtoCommerce.CyberSourcePayment.md) (`VirtoCommerce.CyberSourcePayment`)
- [Datatrans Payment](../modules/VirtoCommerce.Datatrans.md) (`VirtoCommerce.Datatrans`)
- [Dynamic Associations](../modules/VirtoCommerce.DynamicAssociationsModule.md) (`VirtoCommerce.DynamicAssociationsModule`)
- [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`)
- [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`)
- [Environments Compare](../modules/VirtoCommerce.EnvironmentsCompare.md) (`VirtoCommerce.EnvironmentsCompare`)
- [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`)
- [Generic Export](../modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`)
- [File Experience API](../modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`)
- [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- [GDPR](../modules/VirtoCommerce.GDPR.md) (`VirtoCommerce.GDPR`)
- [Google Analytics 4](../modules/VirtoCommerce.GoogleEcommerceAnalytics.md) (`VirtoCommerce.GoogleEcommerceAnalytics`)
- [Google Single Sign-On](../modules/VirtoCommerce.GoogleSSO.md) (`VirtoCommerce.GoogleSSO`)
- [Image Tools](../modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`)
- [Inventory](../modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`)
- [Loyalty](../modules/VirtoCommerce.Loyalty.md) (`VirtoCommerce.Loyalty`)
- [Lucene Search](../modules/VirtoCommerce.LuceneSearch.md) (`VirtoCommerce.LuceneSearch`)
- [Marketing](../modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`)
- [Marketing Experience API](../modules/VirtoCommerce.MarketingExperienceApi.md) (`VirtoCommerce.MarketingExperienceApi`)
- [Native Payment Methods](../modules/VirtoCommerce.NativePaymentMethods.md) (`VirtoCommerce.NativePaymentMethods`)
- [News](../modules/VirtoCommerce.News.md) (`VirtoCommerce.News`)
- [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
- [OpenID Connect](../modules/VirtoCommerce.OpenIdConnectModule.md) (`VirtoCommerce.OpenIdConnectModule`)
- [Open Search](../modules/VirtoCommerce.OpenSearch.md) (`VirtoCommerce.OpenSearch`)
- [Order Management (Business Rules)](../modules/VirtoCommerce.OrderManagement.md) (`VirtoCommerce.OrderManagement`)
- [Order Management](../modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`)
- [CMS Page Builder](../modules/VirtoCommerce.PageBuilderModule.md) (`VirtoCommerce.PageBuilderModule`)
- [Virto Pages](../modules/VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`)
- [Payment](../modules/VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`)
- [Price Export Import](../modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`)
- [Pricing](../modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`)
- [Product Snapshot](../modules/VirtoCommerce.ProductSnapshot.md) (`VirtoCommerce.ProductSnapshot`)
- [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`)
- [Push Messages](../modules/VirtoCommerce.PushMessages.md) (`VirtoCommerce.PushMessages`)
- [Quotes](../modules/VirtoCommerce.Quote.md) (`VirtoCommerce.Quote`)
- [Returns](../modules/VirtoCommerce.Return.md) (`VirtoCommerce.Return`)
- [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`)
- [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`)
- [ShipStation Integration](../modules/VirtoCommerce.ShipStation.md) (`VirtoCommerce.ShipStation`)
- [Shipping](../modules/VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`)
- [Sitemap Generator](../modules/VirtoCommerce.Sitemaps.md) (`VirtoCommerce.Sitemaps`)
- [Skyflow](../modules/VirtoCommerce.Skyflow.md) (`VirtoCommerce.Skyflow`)
- [Sql Queries](../modules/VirtoCommerce.SqlQueries.md) (`VirtoCommerce.SqlQueries`)
- [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`)
- [Subscriptions](../modules/VirtoCommerce.Subscription.md) (`VirtoCommerce.Subscription`)
- [System Operations](../modules/VirtoCommerce.SystemOperations.md) (`VirtoCommerce.SystemOperations`)
- [Task Management](../modules/VirtoCommerce.TaskManagement.md) (`VirtoCommerce.TaskManagement`)
- [Tax Core](../modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`)
- [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)
- [White Labeling](../modules/VirtoCommerce.WhiteLabeling.md) (`VirtoCommerce.WhiteLabeling`)
- [CMS Experience API](../modules/VirtoCommerce.XCMS.md) (`VirtoCommerce.XCMS`)
- [Cart Experience API](../modules/VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`)
- [Catalog Experience API](../modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`)
- [Frontend Experience API](../modules/VirtoCommerce.XFrontend.md) (`VirtoCommerce.XFrontend`)
- [Order Experience API](../modules/VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`)
- [Buy online pickup in store (BOPIS) Experience API](../modules/VirtoCommerce.XPickup.md) (`VirtoCommerce.XPickup`)
- [Product Recommendations](../modules/VirtoCommerce.XRecommend.md) (`VirtoCommerce.XRecommend`)
- [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
