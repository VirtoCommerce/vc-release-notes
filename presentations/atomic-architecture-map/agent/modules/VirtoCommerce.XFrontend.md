# Frontend Experience API (`VirtoCommerce.XFrontend`)

> Built on top of the Virto Commerce XAPI platform, the Frontend Experience API exposes optimized queries specifically for rendering and user experience scenarios.

- Latest version: 3.1009.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-frontend
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.XFrontend`

## For business analysts

The settings and metadata a Virto storefront needs to configure itself — theme, locale, feature flags — served through the same endpoint as its data.

## For architects

One schema builder and seven settings: it exists so the frontend has a single place to ask "how am I configured?" instead of reading store, content and platform settings separately. One optional dependency keeps it installable on a thin host.

## For developers

Treat it as the contract between vc-frontend and the platform: add a field here when the frontend needs to know something, rather than teaching the frontend three APIs.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Commerce Profile Experience API](VirtoCommerce.ProfileExperienceApiModule.md) (`VirtoCommerce.ProfileExperienceApiModule`) ≥ 3.1020.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0

## Optional modules

- [White Labeling](VirtoCommerce.WhiteLabeling.md) (`VirtoCommerce.WhiteLabeling`) ≥ 3.1005.0

## GraphQL builders

- [vc-module-x-frontend/src/VirtoCommerce.XFrontend.Data/Queries/PageContextQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-frontend/blob/dev/src/VirtoCommerce.XFrontend.Data/Queries/PageContextQueryBuilder.cs)
- [vc-module-x-frontend/src/VirtoCommerce.XFrontend.Data/Queries/SignInMethodsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-frontend/blob/dev/src/VirtoCommerce.XFrontend.Data/Queries/SignInMethodsQueryBuilder.cs)
- [vc-module-x-frontend/src/VirtoCommerce.XFrontend.Data/Queries/SignInQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-frontend/blob/dev/src/VirtoCommerce.XFrontend.Data/Queries/SignInQueryBuilder.cs)

## Settings

- `XFrontend.BrandProfile.ContactPhone`
- `XFrontend.BrandProfile.Description`
- `XFrontend.BrandProfile.FoundingDate`
- `XFrontend.BrandProfile.LogoUrl`
- `XFrontend.BrandProfile.SameAs`
- `XFrontend.BrandProfile.ShareImageUrl`
- `XFrontend.BrandProfile.Tagline`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Storefront settings over API** (Content & experience): A storefront configures itself — theme, locale, feature flags — from the same endpoint as its data.

## Key features

- **Optimized queries** tailored for frontend rendering needs
- **Single GraphQL endpoint** providing combined contextual data
- Fetches aggregated information required to render a page efficiently
- Extends Virto Commerce GraphQL schema with `pageContext` query
- Returns a combined object consisting of:
- **SlugInfoType**
- **StoreType**
- **WhiteLabelingSettingsType**
- **UserType**
