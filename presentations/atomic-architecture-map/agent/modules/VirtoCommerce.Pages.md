# Virto Pages (`VirtoCommerce.Pages`)

> Provides a robust and flexible solution for managing content in digital commerce scenarios. Decoupling the CMS post-publishing ensures long-term efficiency, adaptability, and performance.

- Latest version: 3.1013.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-pages
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.Pages`

## For business analysts

Simple content pages managed alongside the catalogue.

## For architects

No storage at all and **five index document builders** over four dependencies — its value is making pages searchable next to products rather than storing them. That is an unusual shape: all read projection, no write model.

## For developers

Because everything is projection, a content change becomes visible after indexation. If a page is missing from search, look at the job, not the data.

## Use it when

- Pages should appear in site search beside products
- Content lives in Content or an external CMS and must be findable
- You need paging and filtering over pages

## Do not use it when

- You need to author pages — that is Content or Page Builder
- Results must be instant: this is index-backed
- There is nothing to index yet

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [SEO](VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`) ≥ 3.1005.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Events it handles

- `PagesDomainEvent`

## REST controllers

- `api/pages` · 1 actions · [vc-module-pages/src/VirtoCommerce.Pages.Web/Controllers/Api/PagesController.cs](https://github.com/VirtoCommerce/vc-module-pages/blob/dev/src/VirtoCommerce.Pages.Web/Controllers/Api/PagesController.cs)

## Search index builders

- [vc-module-pages/src/VirtoCommerce.Pages.Data/Handlers/PageChangedHandler.cs](https://github.com/VirtoCommerce/vc-module-pages/blob/dev/src/VirtoCommerce.Pages.Data/Handlers/PageChangedHandler.cs)
- [vc-module-pages/src/VirtoCommerce.Pages.Data/Search/PageIndexDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-pages/blob/dev/src/VirtoCommerce.Pages.Data/Search/PageIndexDocumentBuilder.cs)
- [vc-module-pages/src/VirtoCommerce.Pages.Data/Search/PageIndexDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-pages/blob/dev/src/VirtoCommerce.Pages.Data/Search/PageIndexDocumentChangesProvider.cs)
- [vc-module-pages/src/VirtoCommerce.Pages.Web/Module.cs](https://github.com/VirtoCommerce/vc-module-pages/blob/dev/src/VirtoCommerce.Pages.Web/Module.cs)
- [vc-module-pages/tests/VirtoCommerce.Pages.Tests/PageIndexDocumentChangesProviderTests.cs](https://github.com/VirtoCommerce/vc-module-pages/blob/dev/tests/VirtoCommerce.Pages.Tests/PageIndexDocumentChangesProviderTests.cs)

## Permissions

- `Pages:create`
- `Pages:delete`
- `Pages:read`
- `Pages:update`

## Settings

- `VirtoPages.Enable`
- `VirtoPages.MissingTranslationBehavior`
- `VirtoPages.ScheduledSync.Enable`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Lightweight content pages** (Content & experience): A few informational pages managed beside the catalogue, without a CMS to run.

## Key features

- **CMS-Agnostic Architecture**: CMS is required only during the design phase. Once published, content is stored in Virto Pages for use without real-time CMS dependency.
- **Hosted Content Pages**: Save pages retrieved from a CMS into the Virto platform for efficient management.
- **Content Scenarios:**
- **Public Pages**: Accessible to all users.
- **Private Pages:** Restricted to authorized users.
- **Personalized Pages:** Tailored content for specific user groups.
- **Scheduled Publishing:** Define start and end dates for content visibility.
- **Retrieve Pages by permalink**: Access pages easily using unique identifiers or user-friendly URLs.
- **Retrieve Pages by ID**: Access pages easily using unique identifiers or user-friendly URLs.
- **Full-Text Search Capabilities:** Quickly search and retrieve pages by keyword.
- **Index Rebuild**: Rebuild the full-text search index from the admin UI or via background jobs through the platform's standard indexing infrastructure.
- **Content Providers**: Pluggable abstraction for pulling pages from 3rd-party CMS platforms. CMS integration modules implement `IPageContentProvider` to supply pages for indexing.
- **Scheduled Sync**: Periodic background synchronization of modified pages from content providers. Disabled by default; enable via the `VirtoPages.ScheduledSync.Enable` setting.
- **Export/Import**: Backup and restore pages through the platform's generic export/import mechanism.

## Documentation

- [Pages module user documentation](https://docs.virtocommerce.org/platform/user-guide/pages/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Pages/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Pages)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-pages)
