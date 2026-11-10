# Shipping (`VirtoCommerce.Shipping`)

> Add shipping methods management

- Latest version: 3.1011.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-shipping
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.Shipping`

## For business analysts

How goods reach the buyer: the shipping methods a store offers, their rates, and — for buy-online, pick-up-in-store — the physical locations a shopper can collect from.

## For architects

The same port-and-adapter shape as Payment, with ShipStation as the external adapter, plus one thing Payment does not have: pickup locations are searchable, which is why Search is a required dependency and why `Shipping.Bopis.Search.EventBasedIndexation.Enabled` exists. Seven modules require it. Rates for the built-in fixed-rate method are settings, not data.

## For developers

Register a shipping method in code and let the store configure it; each method carries its own settings. Pickup locations have their own change events and their own indexation date setting, so a bulk import of locations needs the same treatment as any other indexed entity. Google Maps keys for BOPIS are settings.

## Use it when

- A store needs new shipping options, or rates have to differ by store
- Click-and-collect is in scope — pickup locations and their fulfillment relations live here
- You are integrating a carrier or rate service

## Do not use it when

- You need what was shipped — that is a shipment document on the order
- Stock at a location is the question: that is Inventory's fulfillment centre
- You want tracking history: the carrier owns it, and the order records the reference

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Owns these entities

- `StoreShippingMethodEntity`
- `PickupLocationEntity`
- `PickupFulfillmentRelationEntity`

## Events it handles

- `PickupLocationChangedEvent`

## REST controllers

- `api/shipping/pickup-locations` · 6 actions · [vc-module-shipping/src/VirtoCommerce.ShippingModule.Web/Controllers/Api/PickupLocationsController.cs](https://github.com/VirtoCommerce/vc-module-shipping/blob/dev/src/VirtoCommerce.ShippingModule.Web/Controllers/Api/PickupLocationsController.cs)
- `api/shipping` · 4 actions · [vc-module-shipping/src/VirtoCommerce.ShippingModule.Web/Controllers/Api/ShippingModuleController.cs](https://github.com/VirtoCommerce/vc-module-shipping/blob/dev/src/VirtoCommerce.ShippingModule.Web/Controllers/Api/ShippingModuleController.cs)

## Search index builders

- [vc-module-shipping/src/VirtoCommerce.ShippingModule.Data/Search/Indexed/PickupLocationChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-shipping/blob/dev/src/VirtoCommerce.ShippingModule.Data/Search/Indexed/PickupLocationChangesProvider.cs)
- [vc-module-shipping/src/VirtoCommerce.ShippingModule.Data/Search/Indexed/PickupLocationDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-shipping/blob/dev/src/VirtoCommerce.ShippingModule.Data/Search/Indexed/PickupLocationDocumentBuilder.cs)

## Permissions

- `shipping:create`
- `shipping:delete`
- `shipping:read`
- `shipping:update`

## Settings

- `Shipping.Bopis.GoogleMaps.ApiKey`
- `Shipping.Bopis.GoogleMaps.Enabled`
- `Shipping.Bopis.Search.EventBasedIndexation.Enabled`
- `VirtoCommerce.Search.IndexingJobs.IndexationDate.PickupLocation`
- `VirtoCommerce.Shipping.FixedRateShippingMethod.Air.Rate`
- `VirtoCommerce.Shipping.FixedRateShippingMethod.Ground.Rate`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 16.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Shipping methods & rates** (Cart & checkout): Delivery options per store, priced by rule or by carrier.
- **Buy online, pick up in store** (Cart & checkout): Shoppers choose a location to collect from, based on what is actually in stock there.

## Key features

- Register custom shipping methods in code and expose them to the admin UI.
- Manage the full list of shipping methods from the admin UI, with priority and per-store activation.
- Edit per-method settings directly from the store's shipping tab.
- Built-in **Fixed Rate** shipping method with configurable Ground and Air rates.
- Built-in **BOPIS** (Buy Online, Pickup In Store) shipping method with full pickup-location management.
- **Pickup locations CRUD**: create, update, delete and search locations with address, contacts and geo-coordinates.
- **Google Maps integration** for visualizing and picking pickup-location coordinates (optional, requires API key).
- **Indexed search** for pickup locations via the Search module, with event-based re-indexation out of the box.
- Permission-scoped access (`shipping:read`, `shipping:create`, `shipping:update`, `shipping:delete`) and a `SelectedStoreScope` to limit shipping management to specific stores.
- Public REST API to work with shipping methods, pickup locations and indexed search.

## Documentation

- [Shipping module user documentation](https://docs.virtocommerce.org/platform/user-guide/shipping/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Shipping)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-shipping)
