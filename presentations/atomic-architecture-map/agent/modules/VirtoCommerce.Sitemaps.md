# Sitemap Generator (`VirtoCommerce.Sitemaps`)

> Simplifies the process of generating sitemaps for online stores

- Latest version: 3.1008.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-sitemaps
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.Sitemaps`

## For business analysts

The sitemap.xml search engines read, generated from the catalogue, categories and pages.

## For architects

Two entities and ten migrations over six dependencies, and **fifteen settings** — the largest configuration surface among content modules, because what belongs in a sitemap is entirely policy.

## For developers

Generation is a background job over large record sets: size limits and partitioning are settings, not code. Regenerate after bulk catalogue changes or the file lies.

## Use it when

- Search engines must discover the whole catalogue
- SEO requires control over what is listed and how often
- A storefront has more URLs than a crawler will find unaided

## Do not use it when

- The site is behind a login — a sitemap has no audience
- You need redirects or metadata: that is the SEO module
- No worker is deployed to run the generation

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Content](VirtoCommerce.Content.md) (`VirtoCommerce.Content`) ≥ 3.1006.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `SitemapEntity`

## REST controllers

- `api/sitemaps` · 12 actions · [vc-module-sitemaps/src/VirtoCommerce.SitemapsModule.Web/Controllers/Api/SitemapsModuleApiController.cs](https://github.com/VirtoCommerce/vc-module-sitemaps/blob/dev/src/VirtoCommerce.SitemapsModule.Web/Controllers/Api/SitemapsModuleApiController.cs)

## Permissions

- `sitemaps:access`
- `sitemaps:create`
- `sitemaps:delete`
- `sitemaps:exportToStoreAssets`
- `sitemaps:read`
- `sitemaps:update`

## Settings

- `Sitemap.AcceptedFilenameExtensions`
- `Sitemap.BlogPagePriority`
- `Sitemap.BlogPageUpdateFrequency`
- `Sitemap.CategoryPagePriority`
- `Sitemap.CategoryPageUpdateFrequency`
- `Sitemap.ExportToAssets.EnableExportToAssetsJob`
- `Sitemap.ExportToAssets.JobCronExpression`
- `Sitemap.FilenameSeparator`
- `Sitemap.IncludeDefaultStoreLanguageInUrl`
- `Sitemap.IncludeImages`
- `Sitemap.ProductPagePriority`
- `Sitemap.ProductPageUpdateFrequency`
- `Sitemap.RecordsLimitPerFile`
- `Sitemap.SearchBunchSize`
- `sitemap.xml`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 10.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Sitemaps for search engines** (Catalog & discovery): Search engines discover the whole catalogue instead of crawling their way in.

## Key features

- Async Sitemap generator
- Support big catalogs
- Export products and categories
- Rich API

## Documentation

- [Sitemaps module users documentation](https://docs.virtocommerce.org/platform/user-guide/sitemaps/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Sitemaps)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-sitemaps/)
