# White Labeling (`VirtoCommerce.WhiteLabeling`)

> Provides White labeling functionality for organizations

- Latest version: 3.1007.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-white-labeling
- Area: Content & CMS
- On the map: `#/molecule/VirtoCommerce.WhiteLabeling`

## For business analysts

Running several brands from one installation, each with its own logo, colours and identity.

## For architects

One entity and nine migrations over five dependencies, with one GraphQL builder so the storefront can ask which brand it is serving. It layers on Store's multi-store model rather than replacing it.

## For developers

Two declared events cover branding changes. Treat the storefront as the consumer: the module supplies values, the theme decides what to do with them.

## Use it when

- One platform must serve several brands or customer-specific portals
- B2B customers expect their own look
- Branding should be data, not a deployed theme per brand

## Do not use it when

- A single brand — Store settings and a theme are enough
- The requirement is different content, not different branding: that is Content per store
- Brands need separate data: that is a separate store, or a separate installation

## Required modules

- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1006.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [CMS Experience API](VirtoCommerce.XCMS.md) (`VirtoCommerce.XCMS`) ≥ 3.1008.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Image Tools](VirtoCommerce.ImageTools.md) (`VirtoCommerce.ImageTools`) ≥ 3.1006.0

## Owns these entities

- `WhiteLabelingSettingEntity`

## REST controllers

- `api/white-labeling` · 5 actions · [vc-module-white-labeling/src/VirtoCommerce.WhiteLabeling.Web/Controllers/Api/WhiteLabelingController.cs](https://github.com/VirtoCommerce/vc-module-white-labeling/blob/dev/src/VirtoCommerce.WhiteLabeling.Web/Controllers/Api/WhiteLabelingController.cs)

## GraphQL builders

- [vc-module-white-labeling/src/VirtoCommerce.WhiteLabeling.ExperienceApi/Queries/GetWhiteLabelingSettingsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-white-labeling/blob/dev/src/VirtoCommerce.WhiteLabeling.ExperienceApi/Queries/GetWhiteLabelingSettingsQueryBuilder.cs)

## Permissions

- `WhiteLabeling:create`
- `WhiteLabeling:delete`
- `WhiteLabeling:read`
- `WhiteLabeling:update`

## Settings

- `WhiteLabeling.ThemePresetNames`
- `WhiteLabeling.WhiteLabelingEnabled`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 9.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Per-brand branding** (Content & experience): Each brand or customer portal gets its own identity from data, not a separate deployment.

## Key features

- **Branding Configuration**: Display organization-specific logos, favicons, colors, and footer links post-login.
- **White labeling**: Resolve branding based on the organization context after user authentication.
- **Integration with Virto Frontend:** Seamlessly integrate customized branding elements into Virto Commerce Storefront.
- **Custom Domain:** Assign a custom domain with the organization to allow branding activation on the first visit.
- **Change My Organization Logo:** Organization maintainers can update their organization's logo through a self-service option..
- **Automated FavIcon Generation**: The module uses [Virto Commerce Image Tools module](https://github.com/VirtoCommerce/vc-module-image-tools/) for fav icon generation.

## Documentation

- [White Labeling module user documentation](https://docs.virtocommerce.org/platform/user-guide/white-labeling/overview/)
- [GraphQL API](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/White-labeling/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.WhiteLabeling)
- [Configuration](https://docs.virtocommerce.org/platform/developer-guide/Configuration-Reference/appsettingsjson/#__tabbed_5_2)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-white-labeling)
