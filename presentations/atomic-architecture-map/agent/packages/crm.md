# Customer & Organizations (package)

> Customer and company data as a CRM, for managing relationships across the lifecycle.

- Audience: Customer data
- Modules: 25, for platform 3.1076.0
- Manifest: https://github.com/VirtoCommerce/vc-modules/blob/master/pbc/crm-packages.json
- On the map: `#/cell/crm`

## Overview

If you need just a CRM, Virto Commerce can play this role, allowing you to grant access to CRM data. This package is essential for managing customer interactions and data throughout the customer lifecycle, improving business relationships and customer retention.

## Business outcomes

- Hold the companies you sell to, their people, and the relationships between them.
- Model B2B structure: who belongs to which organisation, and what each of them may do.
- Let a customer administrator manage their own colleagues, within limits you set.
- Migrate contacts in and pull lists out in bulk, as files.
- Find a customer or company instantly, however many you hold.
- Keep other systems in step — a customer change is an event, not a nightly export.

## Business features included

- **SEO-friendly URLs & redirects** (Catalog & discovery): Readable addresses for every product and page, and redirects when something moves.
- **Automatic image sizes** (Product data): One upload becomes every size the storefront needs.
- **Multiple currencies** (Pricing): Sell in the currencies each market expects, with rates you control.
- **Companies & buyer accounts** (B2B buying): Sell to organisations: their people, their structure, and who may order.
- **Customer self-service** (B2B buying): A customer administrator manages their own colleagues and addresses, within your limits.
- **Customer records** (Customer & accounts): Contacts, addresses, notes and preferences behind every order.
- **Customer import & export** (Customer & accounts): Migrate contacts in, and pull lists out, as files.
- **Single sign-on** (Customer & accounts): People sign in with an identity your organisation already trusts.
- **Pages, blocks & menus** (Content & experience): Editorial content per store, changed by marketing without a release.
- **Content over API** (Content & experience): A storefront fetches pages and menus from the same endpoint as its products.
- **Multiple storefronts** (Content & experience): Several stores, markets or brands from one installation, each configured its own way.
- **Per-brand branding** (Content & experience): Each brand or customer portal gets its own identity from data, not a separate deployment.
- **File uploads from the storefront** (Content & experience): Customers attach documents to orders and quotes, and get them back later.
- **Multi-language storefronts** (Content & experience): Sell in each market’s language, including the back office.
- **Transactional email & SMS** (Marketing & loyalty): Order confirmations and alerts, with wording editable and delivery on record.
- **Outbound webhooks** (Integration & operations): External systems are told when something happens, without polling your API.
- **Event streaming to a queue** (Integration & operations): A durable stream of changes for integrations that must not miss one.
- **Background processing** (Integration & operations): Long or scheduled work runs outside the request, and survives a restart.
- **Operational monitoring** (Integration & operations): See what a running instance is doing, and why it stopped.
- **Search engine of your choice** (Integration & operations): Run search on the engine your infrastructure already provides, hosted or managed.
- **File storage backend** (Integration & operations): Decide where uploaded files live — a local disk, or cloud storage behind a CDN.

## Modules by layer

- **xapi**: [File Experience API](../modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`), [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`), [CMS Experience API](../modules/VirtoCommerce.XCMS.md) (`VirtoCommerce.XCMS`), [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
- **services**: [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`), [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`), [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`), [Image Tools](../modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`), [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`), [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`), [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`), [White Labeling](../modules/VirtoCommerce.WhiteLabeling.md) (`VirtoCommerce.WhiteLabeling`)
- **platform**: [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`), [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`), [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`), [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- **integration**: [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`), [Azure Blob Storage Assets Provider](../modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`), [Azure Search](../modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`), [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`), [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`), [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- **outbound**: [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`), [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`), [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)

## All modules

- [Azure Application Insights](../modules/VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`)
- [Assets Management](../modules/VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`)
- [Azure Active Directory Single Sign-On](../modules/VirtoCommerce.AzureAD.md) (`VirtoCommerce.AzureAD`)
- [Azure Blob Storage Assets Provider](../modules/VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`)
- [Azure Search](../modules/VirtoCommerce.AzureSearch.md) (`VirtoCommerce.AzureSearch`)
- [Background Jobs](../modules/VirtoCommerce.BackgroundJobs.md) (`VirtoCommerce.BackgroundJobs`)
- [Content](../modules/VirtoCommerce.Content.md) (`VirtoCommerce.Content`)
- [Commerce core](../modules/VirtoCommerce.Core.md) (`VirtoCommerce.Core`)
- [Companies and Contacts](../modules/VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`)
- [Customer Export Import](../modules/VirtoCommerce.CustomerExportImport.md) (`VirtoCommerce.CustomerExportImport`)
- [Elastic App Search](../modules/VirtoCommerce.ElasticAppSearch.md) (`VirtoCommerce.ElasticAppSearch`)
- [Elastic Search 8](../modules/VirtoCommerce.ElasticSearch8.md) (`VirtoCommerce.ElasticSearch8`)
- [Event Bus](../modules/VirtoCommerce.EventBus.md) (`VirtoCommerce.EventBus`)
- [File Experience API](../modules/VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`)
- [File Systems Assets Provider](../modules/VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`)
- [Image Tools](../modules/VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`)
- [Notifications](../modules/VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`)
- [Commerce Profile Experience API](../modules/VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`)
- [Search Core](../modules/VirtoCommerce.Search.md) (`VirtoCommerce.Search`)
- [SEO](../modules/VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`)
- [Store](../modules/VirtoCommerce.Store.md) (`VirtoCommerce.Store`)
- [Webhooks](../modules/VirtoCommerce.WebHooks.md) (`VirtoCommerce.WebHooks`)
- [White Labeling](../modules/VirtoCommerce.WhiteLabeling.md) (`VirtoCommerce.WhiteLabeling`)
- [CMS Experience API](../modules/VirtoCommerce.XCMS.md) (`VirtoCommerce.XCMS`)
- [Core Experience API](../modules/VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`)
