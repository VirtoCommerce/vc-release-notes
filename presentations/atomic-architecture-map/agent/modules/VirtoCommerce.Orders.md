# Order Management (`VirtoCommerce.Orders`)

> Document based flexible order management system.

- Latest version: 3.1020.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-order
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.Orders`

## For business analysts

What was actually bought, and everything that happens afterwards: payments, captures, invoices, shipments, refunds and returns, each a document with its own status. This is the record the business reports on and the one auditors read.

## For architects

The most coupled module in the catalogue — eleven required dependencies and not one optional, so an order host is close to a full commerce host. It copies what it needs at capture time rather than pointing at live data: an order line keeps its own price and product name, which is why an order from last year still reads correctly after the catalog has moved on. Four index builders feed the search index, and `Order.AdjustInventory` decides whether placing an order moves stock.

## For developers

Three change-event pairs — order, payment, shipment — are the extension surface, and status transitions are where solution code usually lands. Numbering is a setting, not code: `Order.CustomerOrderNewNumberTemplate` and its siblings. Twenty-eight settings in total, so read them before adding a configuration of your own.

## Use it when

- You need the committed record of a sale, or anything derived from it
- Fulfilment, payment capture or returns have to be modelled
- A downstream system needs to react to an order changing state — subscribe to `OrderChangedEvent`

## Do not use it when

- The shopper has not checked out yet — that is a cart, and it is deliberately a different document
- You want to change a historical price: an order holds a copy on purpose, and rewriting it rewrites history
- You are deploying a small host — eleven required dependencies mean this is not the module to isolate first

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Shopping Cart](VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`) ≥ 3.1011.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1010.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Payment](VirtoCommerce.Payment.md) (`VirtoCommerce.Payment`) ≥ 3.1010.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1009.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `CustomerOrderEntity`
- `LineItemEntity`
- `PaymentInEntity`
- `ShipmentEntity`
- `CaptureEntity`
- `InvoiceEntity`
- `RefundEntity`

## Events it publishes

- `OrderChangedEvent`

## Events it handles

- `ObjectSettingChangedEvent`
- `OrderChangedEvent`

## REST controllers

- `api/order/customerOrders` · 24 actions · [vc-module-order/src/VirtoCommerce.OrdersModule.Web/Controllers/Api/OrderModuleController.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Web/Controllers/Api/OrderModuleController.cs)
- `api/order/payments` · 9 actions · [vc-module-order/src/VirtoCommerce.OrdersModule.Web/Controllers/Api/OrderModulePaymentsController.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Web/Controllers/Api/OrderModulePaymentsController.cs)
- `api/order/shipments` · 3 actions · [vc-module-order/src/VirtoCommerce.OrdersModule.Web/Controllers/Api/OrderModuleShipmentsController.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Web/Controllers/Api/OrderModuleShipmentsController.cs)

## Search index builders

- [vc-module-order/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/CustomerOrderChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/CustomerOrderChangesProvider.cs)
- [vc-module-order/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/CustomerOrderDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/CustomerOrderDocumentBuilder.cs)
- [vc-module-order/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/PurchasedProductsChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/PurchasedProductsChangesProvider.cs)
- [vc-module-order/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/PurchasedProductsDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-order/blob/dev/src/VirtoCommerce.OrdersModule.Data/Search/Indexed/PurchasedProductsDocumentBuilder.cs)

## Permissions

- `order:access`
- `order:capture_payment`
- `order:create`
- `order:dashboardstatistics:view`
- `order:delete`
- `order:invoice:download`
- `order:payment:execute_callback`
- `order:read`
- `order:read_prices`
- `order:refund`
- `order:update`
- `order:update_shipments`
- `order_samples:read_prices_direct`
- `order_samples:read_prices_indirect`

## Settings

- `Invoice.Status`
- `Order.AdjustInventory`
- `Order.CaptureNewNumberTemplate`
- `Order.CustomerOrderNewNumberTemplate`
- `Order.DashboardStatistics.Enable`
- `Order.DashboardStatistics.RangeMonths`
- `Order.EventBasedPurchasedProductIndexation.Enable`
- `Order.InitialProcessingStatus`
- `Order.InitialStatus`
- `Order.LogOrderChanges`
- `Order.MaxOrderDocumentCount`
- `Order.OrderPaidAndOrderSentNotifications.Enable`
- `Order.PaymentInNewNumberTemplate`
- `Order.PaymentShipmentStatusChangedNotifications.Enable`
- `Order.PurchasedProductIndexation.Enable`
- `Order.PurchasedProductStoreFilter.Enable`
- `Order.RefundNewNumberTemplate`
- `Order.Search.EventBasedIndexation.Enable`
- `Order.SendOrderNotifications`
- `Order.ShipmentNewNumberTemplate`
- `Order.Status`
- `Order.Validation.Enable`
- `OrderLineItem.InitialStatus`
- `OrderLineItem.Statuses`
- `PaymentIn.Status`
- `Refund.Status`
- `Shipment.Status`
- `VirtoCommerce.Search.IndexingJobs.IndexationDate.CustomerOrder`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 104.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Purchase](../packages/purchase.md)

## Business features it serves

- **Order management** (Orders & fulfilment): The committed record of a sale, with everything that happens to it afterwards.
- **Fast reordering** (B2B buying): Buyers rebuild a basket from a previous order or a saved list instead of searching again.
- **Sales reporting in Power BI** (Integration & operations): A ready sales dashboard and sales analysis in Power BI, opened from the back office.

## Key features

- **Document-based structure**: Orders contain related documents (payments, shipments, addresses) that map to any business process complexity
- **Status management**: Independent status tracking for each document type in the order hierarchy
- **Order editing**: Modify products, quantities, prices, discounts, and add promotion coupons
- **Draft orders**: Save and manage order drafts with postponed confirmation
- **Order cloning**: Create repeated orders with configurable frequency
- **Change history**: Complete audit trail of all order modifications
- **Dynamic properties**: Extend orders with custom fields and metadata
- **Number templates**: Configurable order, payment, shipment, and refund number generation with counter reset options
- **Payment documents**: Track payment history, gateway transactions, and billing information
- Support for multiple payment methods per order
- Payment captures and authorization tracking
- Payment status lifecycle (New → Authorized → Paid → Refunded)
- **Shipment documents**: Manage fulfillment, packages, pick-up, and delivery details
- Multiple shipping methods support
- Shipment status tracking (New → PickPack → ReadyToSend → Sent)
- Split shipments and partial fulfillment
- **Refund documents**: Handle refund requests and processing with status tracking
- **Capture documents**: Track payment capture operations for authorized payments
- **Custom documents**: Extend with additional document types and dynamic fields
- **Invoice management**: Generate and manage PDF invoices
- **Configurable validation**: Enable or disable validation rules through settings (sync/async support)
- **Document count limits**: Define maximum number of child documents per order (default: 20)
- Prevents performance degradation
- Ensures storage optimization
- Maintains data consistency
- Validation at both order-level and per-document-level
- **Hierarchical validation**: Validates entire operation tree using `IOperation` interface
- **Graceful error handling**: Clear exception messages with detailed document breakdown
- **FluentValidation**: Built on FluentValidation framework for extensible validation rules
- **Custom validators**: Easy to add business-specific validation logic
- **Advanced search**: Search orders by customer, date, status, store, total, and custom criteria
- **Event-based indexing**: Automatic search index updates on order changes
- **Purchased product tracking**: Index purchased products for analytics and reporting
- **Store-specific filters**: Filter purchased products by store
- **REST API**: Full CRUD operations for orders and documents
- **GraphQL API**: Modern query interface for storefront integration
- **Search capabilities**: Advanced search with pagination and filtering
- **External system sync**: Designed for integration with ERP and other processing systems
- **Event-based architecture**: Publish domain events for order changes and lifecycle transitions
- `OrderChangeEvent` / `OrderChangedEvent`
- `OrderPaymentStatusChangedEvent`
- `OrderShipmentStatusChangedEvent`
- **Integration modules** (optional, install separately):
- **[Webhooks Module](https://github.com/VirtoCommerce/vc-module-webhooks)**: Send order events to external REST APIs with retry logic and authentication
- **[Event Bus Module](https://github.com/VirtoCommerce/vc-module-event-bus)**: Publish events to message queues (Azure Event Grid) using CloudEvents format
- **Email notifications**: Configurable email templates for order lifecycle events
- Order created
- Order status changed
- Order cancelled
- Order paid
- Order sent
- Payment status changed
- Shipment status changed
- **Invoice generation**: PDF invoice generation with customizable templates
- **Localization**: Multi-language support for notifications (10 languages)
- **Role-based access control**: Granular permissions for order operations
- `order:read` - View orders
- `order:create` - Create new orders
- `order:update` - Modify existing orders
- `order:delete` - Delete orders
- `order:access` - Access order module
- `order:read_prices` - View order prices
- `order:update_shipments` - Manage shipments
- `order:capture_payment` - Capture payments
- `order:refund` - Process refunds
- `order:dashboardstatistics:view` - View dashboard statistics
- **Scope-based access**: Restrict access by store or organization

## Documentation

- [Order module user documentation](https://docs.virtocommerce.org/platform/user-guide/order-management/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Order/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Orders)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-order/)
