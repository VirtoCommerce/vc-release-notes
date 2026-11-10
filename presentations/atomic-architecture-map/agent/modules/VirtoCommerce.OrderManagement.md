# Order Management (Business Rules) (`VirtoCommerce.OrderManagement`)

> Consolidates order management business rules.

- Latest version: 3.1004.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-order-management
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.OrderManagement`

## For business analysts

The back-office workspace for handling orders — the queues, filters and actions a service agent uses all day.

## For architects

No storage and no schema: three dependencies and an optional fourth, five permissions, and a back office UI. It is a presentation layer over Orders, which is why it can be installed and removed without touching data.

## For developers

Extend the workspace rather than the order document when the requirement is 'the agent needs to see X'. Nothing here is authoritative — a wrong value is Orders' to fix.

## Use it when

- Agents work orders in bulk and need a purpose-built screen
- The default order UI does not match how the team operates
- You want to add actions without changing the order model

## Do not use it when

- The data model needs changing — that is Orders
- A storefront needs order data: that is XOrder
- You expect it to hold state: it holds none

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1000.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0

## Optional modules

- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1000.0

## REST controllers

- `api/order-management` · 1 actions · [vc-module-order-management/src/VirtoCommerce.OrderManagement.Web/Controllers/Api/OrderManagementController.cs](https://github.com/VirtoCommerce/vc-module-order-management/blob/dev/src/VirtoCommerce.OrderManagement.Web/Controllers/Api/OrderManagementController.cs)

## Permissions

- `order-management:access`
- `order-management:create`
- `order-management:delete`
- `order-management:read`
- `order-management:update`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Agent order workspace** (Orders & fulfilment): A purpose-built screen for the people who work orders all day.

## Key features

- **Add products to an existing order.** `PUT api/order-management/add-items/{orderId}` appends new line items, evaluates prices via `VirtoCommerce.XCatalog` when available, and persists the order in a single round trip.
- **Preserves unsaved UI edits.** After Add Product, previously-selected line-item statuses, edited quantities and prices, and any order-level edits are kept. The client reconciles the fresh server entity with the local state by diffing against the baseline so the user's in-flight work is not wiped.
- **Correct optimistic concurrency after Add Product.** The client adopts the server-refreshed `rowVersion`/`modifiedDate` as part of the reconcile, so the next Save does not raise "The order has been modified by another user" (409).
- **Clear validation of store references.** Add-items requests fail fast with an `InvalidOperationException` naming the missing store id when the order references a store that no longer exists, instead of bubbling a cryptic `NullReferenceException` from the catalog search pipeline.
- **Resilient price evaluation.** Price lookup via `SearchProductQuery` is best-effort — if the pipeline is unavailable or fails for any reason, the new line item is still created (with Price = 0) and logged, rather than the whole request erroring out.
- **Back Office toolbar buttons.** Registers **Add Product** and **Remove** toolbar actions on the Order Line Items blade.
- **GraphQL schema scope `order-management`.** A scoped schema is exposed at the platform GraphQL endpoint for experience-API consumers.

## Documentation

- [Module on GitHub](https://github.com/VirtoCommerce/vc-module-order-management)
- [Orders module](https://github.com/VirtoCommerce/vc-module-order)
