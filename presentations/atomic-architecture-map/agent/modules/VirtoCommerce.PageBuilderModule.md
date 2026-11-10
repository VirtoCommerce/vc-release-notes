# CMS Page Builder (`VirtoCommerce.PageBuilderModule`)

> Compose pages in visual page builder.

- Latest version: 3.1041.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-pagebuilder
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.PageBuilderModule`

## For business analysts

Building storefront pages from blocks by dragging, so marketing composes layouts without a developer.

## For architects

The heaviest content module: ten entities, including shared components that many pages reuse, six required dependencies and one optional, nine declared events and thirteen permissions. Version 3.1022.0 — among the most actively released in the catalogue.

## For developers

Blocks are the extension point: register a block type with its schema and it appears in the editor. Rendering is the storefront's job, so a new block needs both halves to ship together.

## Use it when

- Marketing must compose pages without a release
- Layouts vary per campaign or per store
- A design system should be exposed as blocks

## Do not use it when

- A single static page — Content is lighter
- The storefront cannot render new block types: both halves are needed
- An external CMS already owns page composition

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Content](VirtoCommerce.Content.md) (`VirtoCommerce.Content`) ≥ 3.1006.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Optional modules

- [Virto Pages](VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`) ≥ 3.1012.0

## Owns these entities

- `FileEntity`
- `GroupedPageBuilderPageEntity`
- `MultilanguagePageEntity`
- `PageBuilderAssetReferenceEntity`
- `PageBuilderContentEntity`
- `PageBuilderPageEntity`
- `PageBuilderSharedComponentAssetReferenceEntity`
- `PageBuilderSharedComponentContentEntity`
- `PageBuilderSharedComponentEntity`
- `PageBuilderSharedComponentReferenceEntity`

## Events it publishes

- `PageBuilderContentChangedEvent`
- `PageBuilderPageChangedEvent`
- `PageBuilderSharedComponentContentChangedEvent`

## Events it handles

- `GroupedPageBuilderPageChangedEvent`
- `PageBuilderPageChangedEvent`
- `PageBuilderSharedComponentContentChangedEvent`

## REST controllers

- `api/page-builder-multilanguage-pages` · 15 actions · [vc-module-pagebuilder/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/MultilanguagePageController.cs](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/MultilanguagePageController.cs)
- `api/page-builder-assets` · 2 actions · [vc-module-pagebuilder/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderAssetsController.cs](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderAssetsController.cs)
- `api/pagebuilder` · 21 actions · [vc-module-pagebuilder/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderController.cs](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderController.cs)
- `api/page-builder-pages` · 16 actions · [vc-module-pagebuilder/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderPageController.cs](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderPageController.cs)
- `api/page-builder-pages` · 4 actions · [vc-module-pagebuilder/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderPageSettingsController.cs](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderPageSettingsController.cs)
- `api/page-builder-shared-components` · 8 actions · [vc-module-pagebuilder/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderSharedComponentsController.cs](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/src/VirtoCommerce.PageBuilderModule.Web/Controllers/Api/PageBuilderSharedComponentsController.cs)

## Permissions

- `builder:access`
- `builder:create`
- `builder:delete`
- `builder:promote`
- `builder:publish`
- `builder:read`
- `builder:shared-components:create`
- `builder:shared-components:delete`
- `builder:shared-components:read`
- `builder:shared-components:update`
- `builder:templates`
- `builder:theme`
- `builder:update`

## Settings

- `VirtoCommerce.PageBuilderModule.General.OzAgentUrl`
- `VirtoCommerce.PageBuilderModule.General.StorePreviewPath`
- `VirtoCommerce.PageBuilderModule.General.StoreUrl`
- `VirtoCommerce.PageBuilderModule.Migration.AssetReferenceIndexMigrated`
- `VirtoCommerce.PageBuilderModule.Migration.MetadataFromContentMigrated`
- `VirtoCommerce.PageBuilderModule.Store.GitContentEnabled`
- `VirtoCommerce.PageBuilderModule.Store.PreviewUserIds`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 27.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Visual page building** (Content & experience): Marketing composes layouts from blocks by dragging, with a live preview.

## Key features

- Build a new landing page visually without developer.
- AI assistant (Virto OZ) — generate, edit, diagnose, and bulk-update pages from a text prompt. See [AI Assistant for Page Builder](https://github.com/VirtoCommerce/vc-module-pagebuilder/blob/dev/docs/ai-assistant.md).
- Theme editor.
- Ecommerce page customization (Preview).
- Preview content.
- Block library.
- Seo by design.
- Mobile-friendliness by design
- Block management with Drag and drop, Copy, Paste, Hide, etc.
- Integration with Virto Frontend.
- Native Extensibility Framework.
- Permissions.
- Platform Backup & Restore support.

## Documentation

- [PageBuidler module user documentation](https://docs.virtocommerce.org/platform/user-guide/page-builder/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.PageBuilderModule)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-pagebuilder)
