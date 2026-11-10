# Store (`VirtoCommerce.Store`)

> Multi store management with individual store settings

- Latest version: 3.1014.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-store
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.Store`

## For business analysts

Each storefront as a configurable thing: its languages, currencies, the fulfillment centres it ships from, its email verification and anonymous-shopping rules, and which other stores it trusts. One installation can run many brands or markets from here.

## For architects

The tenancy seam of a Virto solution. Almost every commerce module takes a `storeId` and resolves behaviour through this module, which is why Cart, Catalog, Orders, Content and Marketing all list it as a required dependency — and why it, in turn, depends on almost nothing (Core, Notifications, Seo). Trusted groups make cross-store data sharing explicit rather than implied.

## For developers

Behaviour is settings, not code: `Stores.IsSpa`, `Stores.SeoLinksType`, `Stores.TaxCalculationEnabled`, `Stores.AllowAnonymousUsers`, `Stores.EmailVerificationRequired`. Note it exposes a single permission, `store:read` — store configuration is read widely and written rarely, so authorisation for writes lives with the platform's module-management permissions.

## Use it when

- Anything must vary per storefront — language, currency, tax, SEO, login scheme
- You are adding a market, a brand or a B2B portal to an existing installation
- Data has to be shared between stores deliberately, through trusted groups

## Do not use it when

- You need the theme or the pages a store renders — that is Content
- You are looking for per-user settings: this is per-store configuration
- You want to authorise a write: this module publishes one read permission, by design

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [SEO](VirtoCommerce.Seo.md) (`VirtoCommerce.Seo`) ≥ 3.1005.0

## Owns these entities

- `StoreEntity`
- `StoreCurrencyEntity`
- `StoreLanguageEntity`
- `StoreFulfillmentCenterEntity`
- `StoreTrustedGroupEntity`
- `StoreAuthenticationSchemeEntity`

## Events it publishes

- `StoreChangedEvent`

## Events it handles

- `StoreChangedEvent`
- `UserVerificationEmailEvent`

## REST controllers

- `api/store-authentication-schemes/{storeId}` · 2 actions · [vc-module-store/src/VirtoCommerce.StoreModule.Web/Controllers/Api/StoreAuthenticationSchemeController.cs](https://github.com/VirtoCommerce/vc-module-store/blob/dev/src/VirtoCommerce.StoreModule.Web/Controllers/Api/StoreAuthenticationSchemeController.cs)
- `api/stores` · 11 actions · [vc-module-store/src/VirtoCommerce.StoreModule.Web/Controllers/Api/StoreModuleController.cs](https://github.com/VirtoCommerce/vc-module-store/blob/dev/src/VirtoCommerce.StoreModule.Web/Controllers/Api/StoreModuleController.cs)

## Permissions

- `store:read`

## Settings

- `Stores.AllowAnonymousUsers`
- `Stores.EmailVerificationEnabled`
- `Stores.EmailVerificationRequired`
- `Stores.EnablePriceRoundingForTotalsCalculation`
- `Stores.IsSpa`
- `Stores.SeoLinksType`
- `Stores.States`
- `Stores.TaxCalculationEnabled`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 21.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Multiple currencies** (Pricing): Sell in the currencies each market expects, with rates you control.
- **Multiple storefronts** (Content & experience): Several stores, markets or brands from one installation, each configured its own way.
- **Multi-language storefronts** (Content & experience): Sell in each market’s language, including the back office.

## Key features

- **Multi-store management** — Create, update, delete, and search stores with configurable properties including name, URL, catalog, time zone, country, and region.
- **Per-store asset public URL** — Serve each store's asset (image) URLs from its own domain (e.g. a store-specific CDN) instead of the shared platform/CDN domain via the `Store.AssetPublicUrl` property and the `IStoreAssetPublicUrlResolver` service.
- **Per-store currency and language support** — Configure multiple currencies and languages per store with a designated default for each.
- **Fulfillment center assignment** — Assign primary and alternate fulfillment centers for orders and returns per store.
- **Store authentication schemes** — Manage per-store authentication providers (password login, external SSO) with ordering and activation controls.
- **SEO support** — Store-level SEO info management with configurable SEO link types (None, Short, Collapsed, Long) and best-match SEO resolution.
- **Email verification** — Configurable email verification flow that sends confirmation emails to store users via the Notifications module.
- **Dynamic email notifications** — Send dynamic notifications with custom fields to store or administrator email addresses.
- **Trusted groups** — Define groups of stores that share user logins across storefronts.
- **Login on behalf** — Check whether a contact has permission to log in on behalf of another user within a store context.
- **Public store settings** — Expose publicly accessible (anonymous) store settings grouped by module.
- **Scoped security** — Restrict permissions (read, update, delete) to specific stores via `StoreSelectedScope`.
- **Export/Import** — Full store data export and import with batched JSON serialization.
- **Change logging** — Automatic change log entries for store modifications via background jobs.

## Documentation

- [Store module user documentation](https://docs.virtocommerce.org/platform/user-guide/store/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Store/overview/)
- [REST API reference](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Store)
- [GitHub repository](https://github.com/VirtoCommerce/vc-module-store)
