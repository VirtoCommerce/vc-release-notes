# Cart Experience API (`VirtoCommerce.XCart`)

> Dedicated to cart-related functionalities, ensuring efficient handling of shopping cart and checkout operations.

- Latest version: 3.1046.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-cart
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.XCart`

## For business analysts

Everything a shopper does with a basket, as one API: add, change, apply a coupon, quote shipping, and start checkout.

## For architects

Nine schema builders over Cart, and ten required dependencies — the widest of the X modules, because a cart mutation touches pricing, tax, shipping, payment and inventory in one call. That coupling is why a purchase Cell usually carries catalog with it.

## For developers

Cart mutations are the hot write path: they run cart validation and totals recalculation, so keep custom logic in cart event handlers rather than in a resolver, and expect events to fire from every mutation.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Shopping Cart](VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`) ≥ 3.1014.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1008.0
- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1010.0
- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1009.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1010.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1008.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1009.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1023.0

## Events it handles

- `CartChangedEvent`

## GraphQL builders

- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/GetCartQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/GetCartQueryBuilder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/GetConfigurationItemsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/GetConfigurationItemsQueryBuilder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/GetPricesSumQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/GetPricesSumQueryBuilder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/GetProductConfigurationQueryBulder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/GetProductConfigurationQueryBulder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/GetSavedForLaterListQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/GetSavedForLaterListQueryBuilder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/PickupLocationsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/PickupLocationsQueryBuilder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Queries/SearchCartQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Queries/SearchCartQueryBuilder.cs)
- [vc-module-x-cart/src/VirtoCommerce.XCart.Data/Schemas/PurchaseSchema.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/src/VirtoCommerce.XCart.Data/Schemas/PurchaseSchema.cs)
- [vc-module-x-cart/tests/VirtoCommerce.XCart.Tests/GraphQLSingletonMediatorInjectionTests.cs](https://github.com/VirtoCommerce/vc-module-x-cart/blob/dev/tests/VirtoCommerce.XCart.Tests/GraphQLSingletonMediatorInjectionTests.cs)

## Settings

- `XPurchase.IsSelectedForCheckout`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Cart & checkout over API** (Cart & checkout): A storefront drives the whole basket and checkout flow in single round trips.

## Documentation

- [xCart documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Cart/overview/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-x-cart)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
