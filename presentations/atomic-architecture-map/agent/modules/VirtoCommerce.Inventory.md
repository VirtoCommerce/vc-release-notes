# Inventory (`VirtoCommerce.Inventory`)

> Simplify inventory management functionality

- Latest version: 3.1012.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-inventory
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.Inventory`

## For business analysts

How much of each product is available, and where it physically sits — stock per fulfillment centre, plus the reservations that stop two shoppers buying the last one. It answers "can we ship this?", which is a different question from "do we sell this?".

## For architects

A deliberately small module — four entities — that Catalog does not contain, because stock changes on a different clock from product data and would otherwise drag the catalog schema with it. It depends on Catalog and Search, and its two index builders project availability into the catalog index, which is what lets a storefront filter on "in stock" without a per-product call. Reservation transactions are its own ledger, so overselling is a data question rather than a race in application code.

## For developers

It reacts to `ProductChangedEvent` to keep availability aligned, and raises its own inventory and fulfillment-centre change events for anything downstream. Seventeen actions on one controller, every one permission-checked. `Inventory.Search.EventBasedIndexation.Enable` is the switch to turn off before a bulk stock import, or every row becomes an index job.

## Use it when

- Availability drives what a shopper may buy or where it ships from
- You are modelling warehouses, stores as pick-up points, or stock transfers
- Overselling must be prevented — reservations are what the transaction ledger is for

## Do not use it when

- You need the product itself: this module holds quantities, not descriptions
- A storefront needs an in-stock filter at scale — that comes from the index this module feeds
- You are recording what shipped: that is a shipment on the order, and it is Orders' document

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Owns these entities

- `InventoryEntity`
- `FulfillmentCenterEntity`
- `InventoryReservationTransactionEntity`

## Events it publishes

- `InventoryChangedEvent`
- `InventoryChangingEvent`

## Events it handles

- `FulfillmentCenterChangedEvent`
- `InventoryChangedEvent`
- `ProductChangedEvent`

## REST controllers

- `api` · 17 actions · [vc-module-inventory/src/VirtoCommerce.InventoryModule.Web/Controllers/Api/InventoryModuleController.cs](https://github.com/VirtoCommerce/vc-module-inventory/blob/dev/src/VirtoCommerce.InventoryModule.Web/Controllers/Api/InventoryModuleController.cs)

## Search index builders

- [vc-module-inventory/src/VirtoCommerce.InventoryModule.Data/Search/Indexing/ProductAvailabilityChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-inventory/blob/dev/src/VirtoCommerce.InventoryModule.Data/Search/Indexing/ProductAvailabilityChangesProvider.cs)
- [vc-module-inventory/src/VirtoCommerce.InventoryModule.Data/Search/Indexing/ProductAvailabilityDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-inventory/blob/dev/src/VirtoCommerce.InventoryModule.Data/Search/Indexing/ProductAvailabilityDocumentBuilder.cs)

## Permissions

- `inventory:access`
- `inventory:create`
- `inventory:delete`
- `inventory:fulfillment:delete`
- `inventory:fulfillment:edit`
- `inventory:fulfillment:read`
- `inventory:read`
- `inventory:update`

## Settings

- `Inventory.ExportImport.PageSize`
- `Inventory.LogInventoryChanges`
- `Inventory.Search.EventBasedIndexation.Enable`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 21.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Buy online, pick up in store** (Cart & checkout): Shoppers choose a location to collect from, based on what is actually in stock there.
- **Stock & fulfilment centres** (Orders & fulfilment): Know what is available and where it sits, and stop selling what is gone.

## Key features

- Inventory tracking
- Stock level controlling
- Fulfillment center management
- Preoder and backorder functions included
- Easily customized

## Documentation

- [Inventory module user documentation](https://docs.virtocommerce.org/platform/user-guide/inventory/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Inventory)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-inventory)
