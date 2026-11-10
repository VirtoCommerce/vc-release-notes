# Order Experience API (`VirtoCommerce.XOrder`)

> Focuses on order processing, providing robust support for order lifecycle management.

- Latest version: 3.1017.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-x-order
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.XOrder`

## For business analysts

Order history and order detail for a signed-in shopper, plus the mutations that let them act on an order.

## For architects

Nine schema builders over Orders. Six required dependencies and a hard line at the cart boundary: it needs XCart's chain, which is why an order Cell and a purchase Cell are usually the same host.

## For developers

Authorisation is the interesting part — an order query must be scoped to the caller, so extend the authorization requirements rather than the query when adding a field a customer should not see.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1008.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1010.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Cart Experience API](VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`) ≥ 3.1042.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1023.0

## GraphQL builders

- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/BaseQueries/BaseSearchOrderQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/BaseQueries/BaseSearchOrderQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/OrderLineItemStatusesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/OrderLineItemStatusesQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/OrderStatusesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/OrderStatusesQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/PaymentStatusesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/PaymentStatusesQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/SearchOrderQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/SearchOrderQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/SearchOrganizationOrderQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/SearchOrganizationOrderQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Queries/ShipmentStatusesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Queries/ShipmentStatusesQueryBuilder.cs)
- [vc-module-x-order/src/VirtoCommerce.XOrder.Data/Schemas/OrderSchema.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/src/VirtoCommerce.XOrder.Data/Schemas/OrderSchema.cs)
- [vc-module-x-order/tests/VirtoCommerce.XOrder.Tests/GraphQLSingletonMediatorInjectionTests.cs](https://github.com/VirtoCommerce/vc-module-x-order/blob/dev/tests/VirtoCommerce.XOrder.Tests/GraphQLSingletonMediatorInjectionTests.cs)

## Settings

- `XOrder.CreateAnonymousOrderEnabled`
- `XOrder.ShippingAddressPolicy`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Order history for shoppers** (Orders & fulfilment): Customers see and act on their own orders from the storefront.

## Documentation

- [xOrder module documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Order/overview/)
- [Experience API Documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [Getting started](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/getting-started/)
- [How to use GraphiQL](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/graphiql/)
- [How to use Postman](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/postman/)
- [How to extend](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/x-api-extensions/)
- [Virto Commerce Frontend architecture](https://docs.virtocommerce.org/storefront/developer-guide/architecture/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-x-order)
