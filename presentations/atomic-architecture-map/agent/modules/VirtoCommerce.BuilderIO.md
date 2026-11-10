# Builder.io (`VirtoCommerce.BuilderIO`)

> Integration module for Builder.io

- Latest version: 3.1006.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-builder-io
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.BuilderIO`

## For business analysts

Visual page building in Builder.io, with the result rendered by the Virto storefront.

## For architects

A CMS bridge: no storage, two dependencies plus one optional, two settings and four permissions. Its name in the registry — "Builder.io" — is one of the few titles that is already correct.

## For developers

Pages come from Builder.io's API; the storefront renders their component tree. Component parity between the editor and the storefront is the integration work.

## Use it when

- Marketing wants visual editing with live preview
- Page composition should not require a release
- The team already owns Builder.io

## Do not use it when

- Structured commerce data — that stays in the platform
- The storefront cannot render Builder components yet
- You need offline authoring

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1000.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0

## Optional modules

- [Virto Pages](VirtoCommerce.Pages.md) (`VirtoCommerce.Pages`) ≥ 3.1004.0

## REST controllers

- `api/builder-io` · 1 actions · [vc-module-builder-io/src/VirtoCommerce.BuilderIO.Web/Controllers/Api/BuilderIoController.cs](https://github.com/VirtoCommerce/vc-module-builder-io/blob/dev/src/VirtoCommerce.BuilderIO.Web/Controllers/Api/BuilderIoController.cs)
- `api/pages/builder-io` · 1 actions · [vc-module-builder-io/src/VirtoCommerce.BuilderIO.Web/Controllers/Api/PagesBuilderIOController.cs](https://github.com/VirtoCommerce/vc-module-builder-io/blob/dev/src/VirtoCommerce.BuilderIO.Web/Controllers/Api/PagesBuilderIOController.cs)

## Permissions

- `builderio:access`
- `builderio:delete`
- `builderio:read`
- `builderio:update`

## Settings

- `BuilderIO.Enable`
- `BuilderIO.PublicApiKey`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Content from an external CMS** (Content & experience): Editors keep working in the CMS the business already owns.

## Documentation

- [Builder.io](https://www.builder.io)
- [Builder.io Content API](https://www.builder.io/c/docs/content-api)
- [Builder.io Querying Cheatsheet](https://www.builder.io/c/docs/querying)
- [Builder.io SDK source](https://github.com/BuilderIO/builder/blob/main/packages/core/src/builder.class.ts)
- [Builder.io module user documentation](https://docs.virtocommerce.org/platform/user-guide/integrations/builder-io/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.BuilderIO)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-builder-io)
