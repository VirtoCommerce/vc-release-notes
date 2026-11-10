# News (`VirtoCommerce.News`)

> Module allowing content managers to publish news articles

- Latest version: 3.1006.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-news
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.News`

## For business analysts

News and announcement articles, with their own publishing dates and categories.

## For architects

Five entities and 12 migrations over one dependency, plus four GraphQL builders — it serves the storefront directly rather than through Content. That independence is why it can be installed on a content Cell alone.

## For developers

Two declared events for downstream automation. Its own schema means articles are relational and queryable, unlike Content's blob-backed pages — choose accordingly.

## Use it when

- Editorial articles need dates, categories and their own lifecycle
- A storefront queries news through GraphQL
- News must be searchable and paged like data, not like files

## Do not use it when

- A one-off landing page — that is Content
- You need a full CMS with layouts: Page Builder or an external CMS
- Articles come from an external system that owns them

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1015.0

## Owns these entities

- `NewsArticleEntity`

## REST controllers

- `api/news` · 15 actions · [vc-module-news/src/VirtoCommerce.News.Web/Controllers/Api/NewsArticleController.cs](https://github.com/VirtoCommerce/vc-module-news/blob/dev/src/VirtoCommerce.News.Web/Controllers/Api/NewsArticleController.cs)

## GraphQL builders

- [vc-module-news/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticleAuthorQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-news/blob/dev/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticleAuthorQueryBuilder.cs)
- [vc-module-news/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticleQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-news/blob/dev/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticleQueryBuilder.cs)
- [vc-module-news/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticlesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-news/blob/dev/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticlesQueryBuilder.cs)
- [vc-module-news/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticleTagsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-news/blob/dev/src/VirtoCommerce.News.ExperienceApi/Queries/NewsArticleTagsQueryBuilder.cs)

## Permissions

- `news:access`
- `news:create`
- `news:delete`
- `news:publish`
- `news:read`
- `news:update`

## Settings

- `News.Enabled`
- `News.UseNewsPrefixInLinks`
- `News.UseStoreDefaultLanguage`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 12.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **News & articles** (Content & experience): Announcements and editorial articles with their own dates and categories.

## Key features

- Write articles using extended markup
- Localize articles to multiple languages
- Select multiple target user groups
- Shedule articles publishing
- Clone articles
- Setup SEO data
