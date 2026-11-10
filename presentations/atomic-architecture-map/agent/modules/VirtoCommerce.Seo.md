# SEO (`VirtoCommerce.Seo`)

> Infrastructure for managing SEO metadata across the platform

- Latest version: 3.1009.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-seo
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.Seo`

## For business analysts

The addresses your storefront exposes to the world: friendly URLs for products, categories and pages, redirects when something moves, and a record of links that now lead nowhere.

## For architects

It depends on nothing and resolves permalinks through a scoring pipeline, which is what lets one slug belong to different objects in different stores and languages without ambiguity. The interesting seam is that it both **raises and handles** `SeoInfoNotFoundEvent`: a miss becomes an event other modules can answer, which is how a custom resolver joins the pipeline instead of replacing it. Broken-link detection is a switch, not an assumption.

## For developers

Subscribe to `SeoInfoNotFoundEvent` to resolve a slug your own module owns; do not fork the resolver. `Seo.Enabled` and `Seo.BrokenLinkDetection.Enabled` gate the module's work, so a headless or API-only deployment can turn it off entirely. Redirect rules are data, so marketing can move a URL without a release.

## Use it when

- A URL has to be friendly, stable, or moved without breaking inbound links
- Your module owns objects that need addressable slugs per store and language
- You need to know which links are broken before a customer finds out

## Do not use it when

- The page content is the question — that is Content
- You are building an API-only solution with no crawlable surface: turn it off instead
- You want analytics on traffic: this module records broken links, not visits

## Owns these entities

- `RedirectRuleEntity`
- `BrokenLinkEntity`

## Events it handles

- `SeoInfoNotFoundEvent`

## REST controllers

- `api/seo/broken-links` · 6 actions · [vc-module-seo/src/VirtoCommerce.Seo.Web/Controllers/Api/BrokenLinksController.cs](https://github.com/VirtoCommerce/vc-module-seo/blob/dev/src/VirtoCommerce.Seo.Web/Controllers/Api/BrokenLinksController.cs)
- `api/seo/redirect-rules` · 6 actions · [vc-module-seo/src/VirtoCommerce.Seo.Web/Controllers/Api/RedirectRulesController.cs](https://github.com/VirtoCommerce/vc-module-seo/blob/dev/src/VirtoCommerce.Seo.Web/Controllers/Api/RedirectRulesController.cs)
- `api/seoinfos` · 5 actions · [vc-module-seo/src/VirtoCommerce.Seo.Web/Controllers/Api/SeoController.cs](https://github.com/VirtoCommerce/vc-module-seo/blob/dev/src/VirtoCommerce.Seo.Web/Controllers/Api/SeoController.cs)

## Permissions

- `seo:access`
- `seo:create`
- `seo:delete`
- `seo:read`
- `seo:update`

## Settings

- `Seo.BrokenLinkDetection.Enabled`
- `Seo.Enabled`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 12.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **SEO-friendly URLs & redirects** (Catalog & discovery): Readable addresses for every product and page, and redirects when something moves.

## Key features

- **SEO Metadata Resolution** — Resolves SEO records (slugs, page titles, meta descriptions, keywords) per entity, store, language, and organization using a composite resolver that aggregates multiple `ISeoResolver` implementations.
- **Best-Match Scoring Pipeline** — A 6-stage pipeline (Original, Filtered, Scored, FilteredScore, Ordered, Final) selects the most relevant SEO entry when multiple candidates match a permalink, with configurable object type priorities.
- **Redirect Rules** — Static or regex-based URL rewrite rules with priority ordering and capture group substitution (`$1`, `$2`, etc.), validated via FluentValidation.
- **Broken Link Detection** — Event-driven tracking of unresolved permalinks. When no SEO info is found, a `SeoInfoNotFoundEvent` triggers a Hangfire background job that records or updates the broken link with hit count and timestamp.
- **SEO Duplicates Detection** — Extensible `ISeoDuplicatesDetector` interface for identifying conflicting SEO entries within an object's relationships (default implementation is a no-op).
- **Explain / Debug Tool** — REST API endpoint and Admin UI widget that traces the full permalink resolution pipeline stage by stage for diagnostics, including the SEO records a resolver rejected and why.
- **Export / Import** — Streaming JSON-based export and import of redirect rules and broken links with batch processing (100 items per batch) and progress reporting.
- **Multi-Database Support** — EF Core providers for SQL Server, MySQL, and PostgreSQL with version-controlled migrations.

## Documentation

- [https://docs.virtocommerce.org/platform/user-guide/push-messages/overview/](https://docs.virtocommerce.org/platform/user-guide/seo/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Push-messages/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.PushMessages)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-seo/)
