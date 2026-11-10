# Business features

> What the business asks for, mapped to the modules that deliver it and the published packages that include all of them. A slot written as "A or B" can be filled by either module.

## Catalog & discovery

- **Product catalogue**: Hold products, variations and categories with the attributes that describe them.
  - Modules: [Catalog](modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Faceted search & filters**: Shoppers narrow a large assortment by the properties that matter to them.
  - Modules: [Catalog](modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`); [Search Core](modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Catalogue over API**: Any channel — web, app, marketplace, AI agent — reads the catalogue through one GraphQL endpoint.
  - Modules: [Catalog Experience API](modules/VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`); [Core Experience API](modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md)
- **Personalised assortment**: Different audiences see different products, without maintaining a second catalogue.
  - Modules: [Catalog Personalization](modules/VirtoCommerce.CatalogPersonalization.md) (`VirtoCommerce.CatalogPersonalization`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Product Information Management](packages/pim.md)
- **Product recommendations**: "Customers also bought" and similar lists on product and basket pages.
  - Modules: [Product Recommendations](modules/VirtoCommerce.XRecommend.md) (`VirtoCommerce.XRecommend`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Related products by rule**: Accessories, alternatives and cross-sells generated from rules instead of linked by hand.
  - Modules: [Dynamic Associations](modules/VirtoCommerce.DynamicAssociationsModule.md) (`VirtoCommerce.DynamicAssociationsModule`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Ratings & reviews**: Shoppers rate and review products, with moderation before anything appears.
  - Modules: [Rating and Reviews](modules/VirtoCommerce.CustomerReviews.md) (`VirtoCommerce.CustomerReviews`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Back-in-stock alerts**: Shoppers ask to be told when a sold-out product returns, and the demand is recorded.
  - Modules: [Back In Stock](modules/VirtoCommerce.BackInStock.md) (`VirtoCommerce.BackInStock`)
  - Packages: [Virto Start](packages/virto-start.md)
- **SEO-friendly URLs & redirects**: Readable addresses for every product and page, and redirects when something moves.
  - Modules: [SEO](modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Sitemaps for search engines**: Search engines discover the whole catalogue instead of crawling their way in.
  - Modules: [Sitemap Generator](modules/VirtoCommerce.Sitemaps.md) (`VirtoCommerce.Sitemaps`)
  - Packages: [Virto Start](packages/virto-start.md)

## Product data

- **Product data authoring**: Category managers create and edit product data in one place instead of in spreadsheets.
  - Modules: [Catalog](modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Catalog started from Shopify’s taxonomy**: A new catalog gets a widely used category tree, attributes and allowed values instead of an empty one.
  - Modules: [Shopify Taxonomy Importer](modules/VirtoCommerce.ShopifyTaxonomy.md) (`VirtoCommerce.ShopifyTaxonomy`)
  - Packages: none yet; build a custom package
- **Bulk product import & export**: Load or extract thousands of products as files, with the mapping saved for next time.
  - Modules: [CSV Catalog Export and Import](modules/VirtoCommerce.CatalogCsvImportModule.md) (`VirtoCommerce.CatalogCsvImportModule`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Product Information Management](packages/pim.md)
- **Bulk editing**: Recategorise or re-tag hundreds of records in one action rather than one at a time.
  - Modules: [Bulk Actions](modules/VirtoCommerce.BulkActionsModule.md) (`VirtoCommerce.BulkActionsModule`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Product Information Management](packages/pim.md)
- **Data completeness scoring**: See which products are not ready to publish, per channel, before a customer finds the gap.
  - Modules: [Catalog Publishing](modules/VirtoCommerce.CatalogPublishing.md) (`VirtoCommerce.CatalogPublishing`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Product Information Management](packages/pim.md)
- **Images, video & documents**: Rich media on products, stored wherever the deployment keeps files.
  - Modules: [Assets Management](modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`); [Catalog](modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Automatic image sizes**: One upload becomes every size the storefront needs.
  - Modules: [Image Tools](modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Product history snapshots**: Keep proof of what a product looked like when someone ordered it.
  - Modules: [Product Snapshot](modules/VirtoCommerce.ProductSnapshot.md) (`VirtoCommerce.ProductSnapshot`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Units & measurements**: Sell by weight, length or volume with units the business actually uses.
  - Modules: [Commerce core](modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`); [Catalog](modules/VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)

## Pricing

- **Price lists & assignments**: Different prices for different audiences, decided per request rather than stored per product.
  - Modules: [Pricing](modules/VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Bulk price import**: Replace a whole price list from a supplier file.
  - Modules: [Price Export Import](modules/VirtoCommerce.PriceExportImport.md) (`VirtoCommerce.PriceExportImport`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Contracted prices**: Negotiated rates for a customer or organisation, valid for an agreed period.
  - Modules: [Contracts](modules/VirtoCommerce.Contracts.md) (`VirtoCommerce.Contracts`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Multiple currencies**: Sell in the currencies each market expects, with rates you control.
  - Modules: [Commerce core](modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`); [Store](modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Tax calculation**: Tax worked out per order rather than typed in, by whichever provider you choose.
  - Modules: [Tax Core](modules/VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Jurisdiction-grade tax**: Real rates, exemptions and filing data from a tax service.
  - Modules: [Avalara Tax Provider](modules/VirtoCommerce.AvalaraTax.md) (`VirtoCommerce.AvalaraTax`)
  - Packages: [Virto Start](packages/virto-start.md)

## Cart & checkout

- **Shopping cart**: A basket that survives between visits and recalculates as it changes.
  - Modules: [Shopping Cart](modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Cart & checkout over API**: A storefront drives the whole basket and checkout flow in single round trips.
  - Modules: [Cart Experience API](modules/VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`); [Core Experience API](modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Wish lists**: Shoppers save products for later, in one list or several.
  - Modules: [Shopping Cart](modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Payment methods**: Offer the ways to pay each store needs, configured rather than coded.
  - Modules: [Payment](modules/VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Card payments via gateway**: Take card payments without card data entering your systems.
  - Modules: [Payment](modules/VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`); [Authorize.Net Payment Method](modules/VirtoCommerce.AuthorizeNetPayment.md) (`VirtoCommerce.AuthorizeNetPayment`) or [CyberSource Payment](modules/VirtoCommerce.CyberSourcePayment.md) (`VirtoCommerce.CyberSourcePayment`) or [Datatrans Payment](modules/VirtoCommerce.Datatrans.md) (`VirtoCommerce.Datatrans`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Card data kept in a vault**: Sensitive payment details live outside the platform, which shrinks what has to be audited.
  - Modules: [Skyflow](modules/VirtoCommerce.Skyflow.md) (`VirtoCommerce.Skyflow`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Pay by invoice or on account**: B2B buyers order now and settle later, with no gateway involved.
  - Modules: [Native Payment Methods](modules/VirtoCommerce.NativePaymentMethods.md) (`VirtoCommerce.NativePaymentMethods`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Shipping methods & rates**: Delivery options per store, priced by rule or by carrier.
  - Modules: [Shipping](modules/VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Live carrier rates & labels**: Quote real shipping prices at checkout and print labels afterwards.
  - Modules: [ShipStation Integration](modules/VirtoCommerce.ShipStation.md) (`VirtoCommerce.ShipStation`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Buy online, pick up in store**: Shoppers choose a location to collect from, based on what is actually in stock there.
  - Modules: [Buy online pickup in store (BOPIS) Experience API](modules/VirtoCommerce.XPickup.md) (`VirtoCommerce.XPickup`); [Shipping](modules/VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`); [Inventory](modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Abandoned-cart reminders**: Shoppers who left something behind are reminded, on a schedule you set.
  - Modules: [Shopping Cart](modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`); [Notifications](modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)

## Orders & fulfilment

- **Order management**: The committed record of a sale, with everything that happens to it afterwards.
  - Modules: [Order Management](modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Agent order workspace**: A purpose-built screen for the people who work orders all day.
  - Modules: [Order Management (Business Rules)](modules/VirtoCommerce.OrderManagement.md) (`VirtoCommerce.OrderManagement`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Order history for shoppers**: Customers see and act on their own orders from the storefront.
  - Modules: [Order Experience API](modules/VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Stock & fulfilment centres**: Know what is available and where it sits, and stop selling what is gone.
  - Modules: [Inventory](modules/VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Returns & refunds**: Handle goods coming back and money going out, as separate steps that can fail apart.
  - Modules: [Returns](modules/VirtoCommerce.Return.md) (`VirtoCommerce.Return`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Subscriptions & recurring orders**: Repeat orders placed on schedule, with pause, resume and cancel.
  - Modules: [Subscriptions](modules/VirtoCommerce.Subscription.md) (`VirtoCommerce.Subscription`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Configurable status flows**: The states an order or quote can move through, changed as the business changes.
  - Modules: [State Machine](modules/VirtoCommerce.StateMachine.md) (`VirtoCommerce.StateMachine`)
  - Packages: none yet; build a custom package
- **Approvals & assigned tasks**: Human steps in a process get an owner, a due date and a record.
  - Modules: [Task Management](modules/VirtoCommerce.TaskManagement.md) (`VirtoCommerce.TaskManagement`)
  - Packages: [Virto Start](packages/virto-start.md)

## B2B buying

- **Companies & buyer accounts**: Sell to organisations: their people, their structure, and who may order.
  - Modules: [Companies and Contacts](modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Customer self-service**: A customer administrator manages their own colleagues and addresses, within your limits.
  - Modules: [Commerce Profile Experience API](modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Customer & Organizations](packages/crm.md)
- **Quote negotiation**: A buyer asks for a price, a salesperson answers, and the agreed quote becomes an order.
  - Modules: [Quotes](modules/VirtoCommerce.Quote.md) (`VirtoCommerce.Quote`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Ordering on behalf of a customer**: A sales representative works inside the customer’s account and places the order for them.
  - Modules: [Sales Rep](modules/VirtoCommerce.SalesRep.md) (`VirtoCommerce.SalesRep`)
  - Packages: none yet; build a custom package
- **Fast reordering**: Buyers rebuild a basket from a previous order or a saved list instead of searching again.
  - Modules: [Shopping Cart](modules/VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`); [Order Management](modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)

## Customer & accounts

- **Customer records**: Contacts, addresses, notes and preferences behind every order.
  - Modules: [Companies and Contacts](modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Customer import & export**: Migrate contacts in, and pull lists out, as files.
  - Modules: [Customer Export Import](modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Single sign-on**: People sign in with an identity your organisation already trusts.
  - Modules: [Azure Active Directory Single Sign-On](modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`) or [OpenID Connect](modules/VirtoCommerce.OpenIdConnectModule.md) (`VirtoCommerce.OpenIdConnectModule`) or [Google Single Sign-On](modules/VirtoCommerce.GoogleSSO.md) (`VirtoCommerce.GoogleSSO`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **A customer’s own identity provider**: Each buying organisation authenticates against its own directory, whichever standard one it is.
  - Modules: [OpenID Connect](modules/VirtoCommerce.OpenIdConnectModule.md) (`VirtoCommerce.OpenIdConnectModule`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Two-factor sign-in**: After the password, a code sent by email — required for everyone, per store, or per customer organisation.
  - Modules: [Multi-Factor Authentication](modules/VirtoCommerce.MFA.md) (`VirtoCommerce.MFA`)
  - Packages: none yet; build a custom package
- **Sign-in with an emailed code**: Shoppers sign in with a one-time code sent to their email, with no password to remember.
  - Modules: [OTP Sign-In](modules/VirtoCommerce.OTP.md) (`VirtoCommerce.OTP`)
  - Packages: none yet; build a custom package
- **Sign-in with passkeys**: Staff and customers sign in with a fingerprint, face or device PIN instead of a password.
  - Modules: [Passkeys](modules/VirtoCommerce.Passkeys.md) (`VirtoCommerce.Passkeys`)
  - Packages: none yet; build a custom package
- **Data export & erasure requests**: Answer a subject access or deletion request across everything the platform holds.
  - Modules: [GDPR](modules/VirtoCommerce.GDPR.md) (`VirtoCommerce.GDPR`)
  - Packages: [Virto Start](packages/virto-start.md)

## Content & experience

- **Pages, blocks & menus**: Editorial content per store, changed by marketing without a release.
  - Modules: [Content](modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Visual page building**: Marketing composes layouts from blocks by dragging, with a live preview.
  - Modules: [CMS Page Builder](modules/VirtoCommerce.PageBuilderModule.md) (`VirtoCommerce.PageBuilderModule`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Content over API**: A storefront fetches pages and menus from the same endpoint as its products.
  - Modules: [CMS Experience API](modules/VirtoCommerce.XCMS.md) (`VirtoCommerce.XCMS`)
  - Packages: [Virto Start](packages/virto-start.md), [Customer & Organizations](packages/crm.md)
- **News & articles**: Announcements and editorial articles with their own dates and categories.
  - Modules: [News](modules/VirtoCommerce.News.md) (`VirtoCommerce.News`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Multiple storefronts**: Several stores, markets or brands from one installation, each configured its own way.
  - Modules: [Store](modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Per-brand branding**: Each brand or customer portal gets its own identity from data, not a separate deployment.
  - Modules: [White Labeling](modules/VirtoCommerce.WhiteLabeling.md) (`VirtoCommerce.WhiteLabeling`)
  - Packages: [Virto Start](packages/virto-start.md), [Customer & Organizations](packages/crm.md)
- **Content from an external CMS**: Editors keep working in the CMS the business already owns.
  - Modules: [Contentful](modules/VirtoCommerce.Contentful.md) (`VirtoCommerce.Contentful`) or [Sanity](modules/VirtoCommerce.Sanity.md) (`VirtoCommerce.Sanity`) or [Builder.io](modules/VirtoCommerce.BuilderIO.md) (`VirtoCommerce.BuilderIO`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Lightweight content pages**: A few informational pages managed beside the catalogue, without a CMS to run.
  - Modules: [Virto Pages](modules/VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Storefront settings over API**: A storefront configures itself — theme, locale, feature flags — from the same endpoint as its data.
  - Modules: [Frontend Experience API](modules/VirtoCommerce.XFrontend.md) (`VirtoCommerce.XFrontend`)
  - Packages: [Virto Start](packages/virto-start.md)
- **File uploads from the storefront**: Customers attach documents to orders and quotes, and get them back later.
  - Modules: [File Experience API](modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md), [Customer & Organizations](packages/crm.md)
- **Multi-language storefronts**: Sell in each market’s language, including the back office.
  - Modules: [Store](modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`); [Content](modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)

## Marketing & loyalty

- **Promotions & discounts**: Campaign rules that change what a shopper pays, configured rather than coded.
  - Modules: [Marketing](modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Coupons with usage limits**: Codes that can be limited per customer and reported on afterwards.
  - Modules: [Marketing](modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`)
  - Packages: [Virto Start](packages/virto-start.md), [Purchase](packages/purchase.md)
- **Targeted on-site content**: Banners and blocks that change by audience, place or campaign.
  - Modules: [Marketing Experience API](modules/VirtoCommerce.MarketingExperienceApi.md) (`VirtoCommerce.MarketingExperienceApi`); [Marketing](modules/VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Loyalty points & tiers**: Customers earn and spend rewards, with balances the storefront can show.
  - Modules: [Loyalty](modules/VirtoCommerce.Loyalty.md) (`VirtoCommerce.Loyalty`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Transactional email & SMS**: Order confirmations and alerts, with wording editable and delivery on record.
  - Modules: [Notifications](modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Funnel & revenue analytics**: Marketing measures the funnel in the analytics tool it already uses.
  - Modules: [Google Analytics 4](modules/VirtoCommerce.GoogleEcommerceAnalytics.md) (`VirtoCommerce.GoogleEcommerceAnalytics`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Session recordings & heatmaps**: Watch how shoppers actually behave, instead of arguing about it.
  - Modules: [Hotjar](modules/VirtoCommerce.Hotjar.md) (`VirtoCommerce.Hotjar`)
  - Packages: none yet; build a custom package

## Integration & operations

- **Outbound webhooks**: External systems are told when something happens, without polling your API.
  - Modules: [Webhooks](modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Event streaming to a queue**: A durable stream of changes for integrations that must not miss one.
  - Modules: [Event Bus](modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Data export as files**: Any module’s data pulled out as CSV or JSON, on demand, from the back office.
  - Modules: [Generic Export](modules/VirtoCommerce.Export.md) (`VirtoCommerce.Export`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **File import with audit**: Reusable import profiles, with every run and rejection recorded.
  - Modules: [Import](modules/VirtoCommerce.Import.md) (`VirtoCommerce.Import`)
  - Packages: none yet; build a custom package
- **Background processing**: Long or scheduled work runs outside the request, and survives a restart.
  - Modules: [Background Jobs](modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Audit trail**: A record of who changed what, kept for as long as compliance requires.
  - Modules: [Audit Log](modules/VirtoCommerce.AuditLog.md) (`VirtoCommerce.AuditLog`)
  - Packages: none yet; build a custom package
- **Backup & restore**: Move data between environments, and rehearse recovery rather than assume it.
  - Modules: [Backup & Restore](modules/VirtoCommerce.BackupRestore.md) (`VirtoCommerce.BackupRestore`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md)
- **Operational monitoring**: See what a running instance is doing, and why it stopped.
  - Modules: [Azure Application Insights](modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`) or [Open Telemetry](modules/VirtoCommerce.OpenTelemetry.md) (`VirtoCommerce.OpenTelemetry`) or [Seq log sink](modules/VirtoCommerce.SeqLog.md) (`VirtoCommerce.SeqLog`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Search engine of your choice**: Run search on the engine your infrastructure already provides, hosted or managed.
  - Modules: [Search Core](modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`); [Elastic Search 8](modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`) or [Elastic Search 9](modules/VirtoCommerce.ElasticSearch9.md) (`VirtoCommerce.ElasticSearch9`) or [Azure Search](modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`) or [Algolia Search](modules/VirtoCommerce.AlgoliaSearch.md) (`VirtoCommerce.AlgoliaSearch`) or [Open Search](modules/VirtoCommerce.OpenSearch.md) (`VirtoCommerce.OpenSearch`) or [Elastic App Search](modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`) or [Lucene Search](modules/VirtoCommerce.LuceneSearch.md) (`VirtoCommerce.LuceneSearch`)
  - Packages: [Virto Start](packages/virto-start.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **File storage backend**: Decide where uploaded files live — a local disk, or cloud storage behind a CDN.
  - Modules: [Assets Management](modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`); [Azure Blob Storage Assets Provider](modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`) or [File Systems Assets Provider](modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
  - Packages: [Virto Start](packages/virto-start.md), [Identity Provider](packages/idp.md), [Digital Catalog](packages/digital-catalog.md), [Purchase](packages/purchase.md), [Product Information Management](packages/pim.md), [Customer & Organizations](packages/crm.md)
- **Central configuration & feature flags**: Change settings and switch features on across every instance without a redeploy.
  - Modules: [Azure App Configuration](modules/VirtoCommerce.AzureAppConfiguration.md) (`VirtoCommerce.AzureAppConfiguration`)
  - Packages: none yet; build a custom package
- **Environment comparison**: See exactly how staging differs from production before a release goes wrong.
  - Modules: [Environments Compare](modules/VirtoCommerce.EnvironmentsCompare.md) (`VirtoCommerce.EnvironmentsCompare`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Scheduled maintenance operations**: Routine housekeeping runs on a schedule instead of on someone’s memory.
  - Modules: [System Operations](modules/VirtoCommerce.SystemOperations.md) (`VirtoCommerce.SystemOperations`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Back office for staff**: A screen where staff manage the catalogue, orders and customers. Without one, the platform serves APIs only.
  - Modules: [Admin Angular JS](modules/VirtoCommerce.AdminAngularJs.md) (`VirtoCommerce.AdminAngularJs`) or [Admin Shell](modules/VirtoCommerce.AdminShell.md) (`VirtoCommerce.AdminShell`)
  - Packages: none yet; build a custom package
- **Extendable back office**: Teams add their own back-office screens without rebuilding the application.
  - Modules: [Frontend Modules Registry](modules/VirtoCommerce.ModuleFederation.md) (`VirtoCommerce.ModuleFederation`)
  - Packages: none yet; build a custom package
- **Ad-hoc reporting**: Answer a data question today, without a BI project.
  - Modules: [Sql Queries](modules/VirtoCommerce.SqlQueries.md) (`VirtoCommerce.SqlQueries`)
  - Packages: [Virto Start](packages/virto-start.md)
- **Sales reporting in Power BI**: A ready sales dashboard and sales analysis in Power BI, opened from the back office.
  - Modules: [Power BI Commerce Reports](modules/VirtoCommerce.PowerBiReports.md) (`VirtoCommerce.PowerBiReports`); [Order Management](modules/VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`)
  - Packages: none yet; build a custom package

## AI & agents

- **AI provider foundation**: A configured model provider that features can use, with access permissioned.
  - Modules: [AI](modules/VirtoCommerce.AI.md) (`VirtoCommerce.AI`)
  - Packages: none yet; build a custom package
- **Agent & marketplace protocol**: External agents and marketplaces browse and buy through a standard protocol, including MCP.
  - Modules: [Universal Commerce Protocol](modules/VirtoCommerce.UCP.md) (`VirtoCommerce.UCP`)
  - Packages: none yet; build a custom package
- **In-app alerts for staff**: People working in the back office are told when their long job finishes.
  - Modules: [Push Messages](modules/VirtoCommerce.PushMessages.md) (`VirtoCommerce.PushMessages`)
  - Packages: [Virto Start](packages/virto-start.md)
