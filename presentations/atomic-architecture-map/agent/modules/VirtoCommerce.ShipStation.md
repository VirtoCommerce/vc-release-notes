# ShipStation Integration (`VirtoCommerce.ShipStation`)

> Enables synchronizing customer orders with ShipStation

- Latest version: 3.1002.0 (needs platform 3.1002.0)
- Repository: https://github.com/VirtoCommerce/vc-module-ShipStation
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.ShipStation`

## For business analysts

Shipping rates and labels through ShipStation.

## For architects

A Shipping adapter with two permissions and no settings of its own — configuration lives with the shipping method it registers.

## For developers

Rates come from the carrier at quote time, so treat them as remote and cache them per basket shape; label creation belongs after the order exists, not during checkout.

## Use it when

- Carrier rates must be live rather than fixed
- Labels and fulfilment are handled outside the platform
- The business already runs ShipStation

## Do not use it when

- Fixed or free shipping — the built-in method is simpler
- You need warehouse stock: that is Inventory
- Tracking history: the carrier owns it

## Required modules

- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0

## REST controllers

- `api/shipstation/{storeId}` · 2 actions · (vc-module-ShipStation/src/VirtoCommerce.ShipStationModule.Web/Controllers/Api/ShipStationController.cs)

## Permissions

- `ShipStation:read`
- `ShipStation:update`

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Live carrier rates & labels** (Cart & checkout): Quote real shipping prices at checkout and print labels afterwards.

## Key features

- Export orders specified by store
- Updating order's and shipping's statuses when shipstation make an action

## Documentation

- [ShipStation module user documentation](https://docs.virtocommerce.org/platform/user-guide/shipstation/overview/)
- [ShipStation integration guide](https://help.shipstation.com/hc/en-us/articles/360025856192-Custom-Store-Development-Guide)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.ShipStation)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-shipstation/)
