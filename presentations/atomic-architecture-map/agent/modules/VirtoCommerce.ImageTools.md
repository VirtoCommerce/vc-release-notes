# Image Tools (`VirtoCommerce.ImageTools`)

> Image tools helps to automate thumbnail generation procedures with resizing and cropping

- Latest version: 3.1010.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-image-tools
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.ImageTools`

## For business analysts

Thumbnails and image variants generated automatically, so one uploaded photo serves a grid, a gallery and a phone.

## For architects

Three entities and seven migrations over a single dependency (Assets), with four declared events. It reacts to blob changes, which is why an upload produces derivatives without anyone asking.

## For developers

Generation is background work driven by asset events — a host without a worker will store originals and never produce variants. Five settings define the option sets; add a size there rather than in code.

## Use it when

- Product images need consistent sizes across a storefront
- Bandwidth or Core Web Vitals matter
- Editors should upload once and not think about formats

## Do not use it when

- A CDN already transforms images on the fly
- You need the original: this module adds variants, it does not replace them
- No background worker is deployed

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0

## Owns these entities

- `ThumbnailOptionEntity`

## Events it handles

- `BlobCreatedEvent`

## REST controllers

- `api/image/thumbnails/options` · 5 actions · [vc-module-image-tools/src/VirtoCommerce.ImageToolsModule.Web/Controllers/Api/ThumbnailsOptionsController.cs](https://github.com/VirtoCommerce/vc-module-image-tools/blob/dev/src/VirtoCommerce.ImageToolsModule.Web/Controllers/Api/ThumbnailsOptionsController.cs)
- `api/image/thumbnails/tasks` · 7 actions · [vc-module-image-tools/src/VirtoCommerce.ImageToolsModule.Web/Controllers/Api/ThumbnailsTasksController.cs](https://github.com/VirtoCommerce/vc-module-image-tools/blob/dev/src/VirtoCommerce.ImageToolsModule.Web/Controllers/Api/ThumbnailsTasksController.cs)

## Permissions

- `thumbnail:access`

## Settings

- `ImageTools.Thumbnails.AllowedImageFormats`
- `ImageTools.Thumbnails.EnableImageProcessJob`
- `ImageTools.Thumbnails.EventBasedThumbnailGeneration`
- `ImageTools.Thumbnails.ImageProcessJobCronExpression`
- `ImageTools.Thumbnails.ProcessBatchSize`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 7.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Automatic image sizes** (Product data): One upload becomes every size the storefront needs.

## Key features

- **Multi-Format Support**: Process raster images (JPEG, PNG, WebP, BMP) and vector graphics (SVG)
- **Flexible Resize Methods**:
- `FixedSize` - Proportional fit within specified dimensions with optional padding
- `FixedWidth` - Maintain aspect ratio, resize to target width
- `FixedHeight` - Maintain aspect ratio, resize to target height
- `Crop` - Crop to exact dimensions using configurable anchor positions
- **Background Processing**: Batch thumbnail generation via Hangfire jobs with progress tracking
- **Event-Driven Generation**: Automatic thumbnail creation on blob upload events
- **Incremental Processing**: Only process new or modified images since last run
- **Extensible Architecture**: Plugin-based format handlers for easy addition of new formats

## Documentation

- [Image Tools module user documentation](https://docs.virtocommerce.org/platform/user-guide/thumbnails/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.ImageTools)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-image-tools)
