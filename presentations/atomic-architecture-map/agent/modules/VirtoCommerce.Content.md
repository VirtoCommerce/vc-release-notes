# Content (`VirtoCommerce.Content`)

> Easily create, edit, and publish content such as pages, blog posts, and news articles.

- Latest version: 3.1009.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-content
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.Content`

## For business analysts

The editorial side of a storefront: pages, blog posts, blocks, menus and the theme itself, edited per store. It is what a marketing team changes without a release.

## For architects

Barely a database module — two entities, both about menus. Everything else lives in blob storage, which is why it depends on Assets **and** on both storage providers, and why its content is deployed rather than migrated. Three index builders make pages searchable alongside products. Content is per store, so Store is a required dependency.

## For developers

Work through the content API per store and content type rather than touching blobs, and remember that the storefront reads themes and pages at runtime — a change is visible without a rebuild, and a bad change is visible just as fast. Menus are the only part with relational structure and its own change events.

## Use it when

- Pages, blocks, menus or theme files are the thing being managed
- Editorial content has to be searchable next to catalog data
- A storefront needs per-store content without a deployment

## Do not use it when

- You need structured product data — that is Catalog, with a schema behind it
- You expect database migrations to move your content: it is files in blob storage
- You want a page builder experience — that is a separate module on top of this one

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Azure Blob Storage Assets Provider](VirtoCommerce.AzureBlobAssets.md) (`VirtoCommerce.AzureBlobAssets`) ≥ 3.1009.0
- [File Systems Assets Provider](VirtoCommerce.FileSystemAssets.md) (`VirtoCommerce.FileSystemAssets`) ≥ 3.1006.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `MenuLinkListEntity`
- `MenuLinkEntity`

## Events it publishes

- `ContentFileChangedEvent`

## Events it handles

- `ContentFileChangedEvent`
- `MenuLinkListChangedEvent`

## REST controllers

- `api/content/{contentType}/{storeId}` · 14 actions · [vc-module-content/src/VirtoCommerce.ContentModule.Web/Controllers/Api/ContentController.cs](https://github.com/VirtoCommerce/vc-module-content/blob/dev/src/VirtoCommerce.ContentModule.Web/Controllers/Api/ContentController.cs)
- `api/cms/{storeId}/menu` · 5 actions · [vc-module-content/src/VirtoCommerce.ContentModule.Web/Controllers/Api/MenuController.cs](https://github.com/VirtoCommerce/vc-module-content/blob/dev/src/VirtoCommerce.ContentModule.Web/Controllers/Api/MenuController.cs)

## Search index builders

- [vc-module-content/src/VirtoCommerce.ContentModule.Data/Search/ContentIndexDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-content/blob/dev/src/VirtoCommerce.ContentModule.Data/Search/ContentIndexDocumentBuilder.cs)
- [vc-module-content/src/VirtoCommerce.ContentModule.Data/Search/ContentIndexDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-content/blob/dev/src/VirtoCommerce.ContentModule.Data/Search/ContentIndexDocumentChangesProvider.cs)
- [vc-module-content/src/VirtoCommerce.ContentModule.Web/Module.cs](https://github.com/VirtoCommerce/vc-module-content/blob/dev/src/VirtoCommerce.ContentModule.Web/Module.cs)

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 8.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Pages, blocks & menus** (Content & experience): Editorial content per store, changed by marketing without a release.
- **Multi-language storefronts** (Content & experience): Sell in each market’s language, including the back office.

## Key features

- Themes Management on UI
- Pages and blogs management on UI
- Link lists management
- Manage documents in markdown format

## Documentation

- [Content module user documentation](https://docs.virtocommerce.org/platform/user-guide/content/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Content)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-content/)
