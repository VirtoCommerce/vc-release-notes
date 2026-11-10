# Product Snapshot (`VirtoCommerce.ProductSnapshot`)

> The Product Snapshot module captures and stores product information at the moment an order is created.
  This ensures that customers and store operators always have access to the exact product details (prices, properties, images, descriptions)
  that were valid at the time of purchase, even if the product catalog is later modified or products are deleted.

- Latest version: 3.1005.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-product-snapshot
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.ProductSnapshot`

## For business analysts

A frozen copy of what a product looked like at a point in time — what the customer actually saw when they ordered.

## For architects

One entity and six migrations over three dependencies. It exists because Catalog is mutable and evidence must not be: this is the same instinct that makes an order line copy its price.

## For developers

Two declared events mark snapshot creation. Snapshots grow without bound, so decide retention deliberately — nothing in the module will prune them for you.

## Use it when

- Disputes need proof of what was displayed
- Regulated products require a record of published claims
- You must reconstruct a historical page

## Do not use it when

- Current product data is the question — read Catalog
- You want change history of fields: that is the change log
- Storage growth is unbudgeted

## Required modules

- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1007.0
- [Order Experience API](VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`) ≥ 3.1004.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1014.0

## Owns these entities

- `OrderProductSnapshotEntity`

## Events it handles

- `OrderChangedEvent`

## REST controllers

- `api/product-snapshots` · 1 actions · [vc-module-product-snapshot/src/VirtoCommerce.ProductSnapshot.Web/Controllers/Api/ProductSnapshotController.cs](https://github.com/VirtoCommerce/vc-module-product-snapshot/blob/dev/src/VirtoCommerce.ProductSnapshot.Web/Controllers/Api/ProductSnapshotController.cs)

## Permissions

- `product-snapshot:access`
- `product-snapshot:create`
- `product-snapshot:delete`
- `product-snapshot:read`
- `product-snapshot:update`

## Settings

- `ProductSnapshot.Enabled`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 6.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Product history snapshots** (Product data): Keep proof of what a product looked like when someone ordered it.

## Key features

- **Automatic snapshot creation** — listens for the `OrderChangedEvent` and asynchronously creates product snapshots when a new order is placed.
- **Full product data capture** — stores product info, assets, properties, and editorial reviews as a serialized JSON document.
- **Configurable** — snapshot creation can be enabled or disabled through a platform setting.
- **Catalog fallback** — products not covered by a snapshot are loaded by xOrder's `OrderProductResolver.LoadProductsAsync` from the live catalog. The fallback is provided by xOrder, not by this module.
- **Granular permissions** — access, create, read, update, and delete operations are controlled by dedicated permissions.
- **Extendable Product Snapshot Page** - the module provides extension points (productSnapshotDetails metaform and widget-container) on the Product Snapshot details page to display custom information related to the snapshot, such as links to related orders or custom product attributes.
- **REST API** — retrieve a product snapshot via `GET /api/product-snapshots/order/{orderId}/product/{productId}`.
- **GraphQL / Experience API integration** — the `LoadorderProductSnapshotMiddleware` transparently injects snapshots into the `ExternalOrderProducts` pipeline, so X-Order consumers receive snapshot data without additional queries.
- **Multi-database support** — SQL Server, MySQL, and PostgreSQL are supported out of the box.
- **Async snapshot creation (Soon)** — snapshot generation runs in the background to avoid impacting order processing performance. If snapshot creation fails, it is logged but does not block the order from being created.
