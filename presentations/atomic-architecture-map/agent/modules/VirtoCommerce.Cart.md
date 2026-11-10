# Shopping Cart (`VirtoCommerce.Cart`)

> Shopping cart / checkout functionality

- Latest version: 3.1014.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-cart
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.Cart`

## For business analysts

The basket a shopper is filling, including named wish lists, and what it totals before checkout — line items, discounts, coupons, shipments, payments and taxes as they stand right now. Nothing here is a record of a sale; it is the state of an intention.

## For architects

A high-churn store with no back-office UI: it is written on almost every storefront interaction, and it needs seven modules to be present — Assets, Core, Customer, Notifications, Payment, Shipping, Store — which makes it a poor candidate for a small host. Search is optional, so a cart host can be deployed without an index. Obsolete carts are pruned by a scheduled job, not by a person, and its 105 migrations reflect how often that schema has moved.

## For developers

Two declared events, `CartChangeEvent` before the save and `CartChangedEvent` after it, are how you hook cart behaviour without forking the module — validation and totals recalculation both ride on them. `api/carts` carries 24 actions; the storefront path is xCart, not this REST surface.

## Use it when

- You need the current, uncommitted state of what a shopper intends to buy
- You are adding a wish list, a saved cart or a shared cart feature
- Checkout has to recalculate totals, taxes or shipping before an order exists

## Do not use it when

- The sale has happened — an order is a separate document in Orders, with its own copy of the prices
- You want cart history or analytics: carts are pruned on a schedule and are not an archive
- You are on a storefront: talk to xCart, which is built for one round trip per page

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1010.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1009.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Optional modules

- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Owns these entities

- `ShoppingCartEntity`
- `LineItemEntity`
- `ShipmentEntity`
- `PaymentEntity`
- `CouponEntity`
- `ProductWishlistEntity`

## Events it handles

- `CartChangeEvent`
- `CartChangedEvent`

## REST controllers

- `api/carts` · 24 actions · [vc-module-cart/src/VirtoCommerce.CartModule.Web/Controllers/Api/CartModuleController.cs](https://github.com/VirtoCommerce/vc-module-cart/blob/dev/src/VirtoCommerce.CartModule.Web/Controllers/Api/CartModuleController.cs)

## Permissions

- `cart:access`
- `cart:create`
- `cart:delete`
- `cart:read`
- `cart:update`

## Settings

- `Cart.AbandonedCartReminder.CronExpression`
- `Cart.AbandonedCartReminder.Enable`
- `Cart.AbandonedCartReminder.HoursUntilCartAbandoned`
- `Cart.CronDeleteObsoleteCarts`
- `Cart.EnableDeleteObsoleteCarts`
- `Cart.HardDeleteDelayDays`
- `Cart.MaximumCountPerDeleteObsoleteCartsJobExecution`
- `Cart.PortionDeleteObsoleteCarts`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 108.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Shopping cart** (Cart & checkout): A basket that survives between visits and recalculates as it changes.
- **Wish lists** (Cart & checkout): Shoppers save products for later, in one list or several.
- **Abandoned-cart reminders** (Cart & checkout): Shoppers who left something behind are reminded, on a schedule you set.
- **Fast reordering** (B2B buying): Buyers rebuild a basket from a previous order or a saved list instead of searching again.

## Key features

- **Multiple carts support**: If the user is using more than one cart at the same time, all of the carts will be supported by the Virto Commerce Cart module.
- **Named lists**: The user can add the desired products to the  wishlist , which will be saved in the cart. The user can later use the products added to the wishlist to make an order. The wishlist details will be saved by the VirtoCommerce.Cart module.
- **Grouping multiple carts to one order**: If the user is using more than one cart, the final order will be created by grouping the details from all the carts filled out by user.
- **Anonymous carts**: The user can put products to cart and submit order anonymously, without creating an account.
- **Stock reservation**: The selected products will be reserved in stock after adding them to the cart.
- **Multiple payments methods**: The user can choose the payment methods he wants before checkout.
- **Create new cart from orders history**: The user can add products to a new cart using the previously completed orders (orders history).

## Documentation

- [Cart Module user documentation](https://docs.virtocommerce.org/platform/user-guide/cart/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Cart/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Cart)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-cart/)
