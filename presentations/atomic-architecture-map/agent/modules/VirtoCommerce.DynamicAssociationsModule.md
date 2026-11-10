# Dynamic Associations (`VirtoCommerce.DynamicAssociationsModule`)

> Dynamic rule based product associations module

- Latest version: 3.1005.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-dynamic-associations
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.DynamicAssociationsModule`

## For business analysts

Rules that relate products to each other automatically — accessories, alternatives, cross-sells — instead of a merchandiser linking each pair by hand.

## For architects

One entity and six migrations over four dependencies. The rules produce associations that Catalog then serves, so it writes into the catalog's association model rather than keeping a parallel one.

## For developers

Two declared events cover rule changes. Evaluation is batch work: expect a job, and expect the results to be as stale as the last run.

## Use it when

- Related-product lists are too large to curate by hand
- Association rules follow data — brand, category, price band
- Merchandisers want rules, not pairs

## Do not use it when

- A handful of hand-picked associations — Catalog already does that
- Recommendations based on behaviour: that is XRecommend
- You need results the instant a product changes

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1009.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `AssociationEntity`

## Events it publishes

- `AssociationChangedEvent`
- `AssociationChangingEvent`

## Events it handles

- `AssociationChangedEvent`

## REST controllers

- `api/dynamicassociations` · 7 actions · [vc-module-dynamic-associations/src/VirtoCommerce.DynamicAssociationsModule.Web/Controllers/Api/AssociationsController.cs](https://github.com/VirtoCommerce/vc-module-dynamic-associations/blob/dev/src/VirtoCommerce.DynamicAssociationsModule.Web/Controllers/Api/AssociationsController.cs)

## Permissions

- `dynamic-association:access`
- `dynamic-association:create`
- `dynamic-association:delete`
- `dynamic-association:read`
- `dynamic-association:update`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 6.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Related products by rule** (Catalog & discovery): Accessories, alternatives and cross-sells generated from rules instead of linked by hand.

## Key features

- Creating product associations using dynamic conditions
- Use extendable evaluation mechanisms

## Documentation

- [Dynamic Associations module user documentation](https://docs.virtocommerce.org/platform/user-guide/dynamic-associations/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.DynamicAssociationsModule)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-dynamic-associations)
