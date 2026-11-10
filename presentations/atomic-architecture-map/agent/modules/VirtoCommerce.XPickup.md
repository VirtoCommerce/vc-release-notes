# Buy online pickup in store (BOPIS) Experience API (`VirtoCommerce.XPickup`)

> Handles buy online pickup in store (BOPIS) operations

- Latest version: 3.1008.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-pickup
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.XPickup`

## For business analysts

Buy online, pick up in store: which locations can fulfil a basket, and where a shopper chooses to collect.

## For architects

Two schema builders over Shipping's pickup locations and Inventory's availability — a small module whose value is joining two others at the API edge. Five settings, and it needs both of those modules present.

## For developers

Availability per location is an index read; a location's data is Shipping's. Nothing here is authoritative, so fix a wrong pickup option in the owning module.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1010.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1009.0
- [Shopping Cart](VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`) ≥ 3.1011.0

## GraphQL builders

- [vc-module-x-pickup/src/VirtoCommerce.XPickup.Data/Queries/GetProductPickupLocationsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-pickup/blob/dev/src/VirtoCommerce.XPickup.Data/Queries/GetProductPickupLocationsQueryBuilder.cs)
- [vc-module-x-pickup/src/VirtoCommerce.XPickup.Data/Queries/SearchCartPickupLocationsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-pickup/blob/dev/src/VirtoCommerce.XPickup.Data/Queries/SearchCartPickupLocationsQueryBuilder.cs)

## Settings

- `XPickup.Enabled`
- `XPickup.GlobalTransferAvailabilityNote`
- `XPickup.GlobalTransferEnabled`
- `XPickup.TodayAvailabilityNote`
- `XPickup.TransferAvailabilityNote`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Buy online, pick up in store** (Cart & checkout): Shoppers choose a location to collect from, based on what is actually in stock there.

## Key features

- Configurable product pickup location details (fulfillment centers, address, geolocation)
- Integration with inventory data (inventory tracking, available in stock quantity)
- Available pickup points in product details page
- Pickup point selection and confirmation in customer cart
