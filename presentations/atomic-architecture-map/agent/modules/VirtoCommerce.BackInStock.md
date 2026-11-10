# Back In Stock (`VirtoCommerce.BackInStock`)

> Provides customer ability to subscribe for notification, when product is back in stock.

- Latest version: 3.1005.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-back-in-stock
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.BackInStock`

## For business analysts

"Tell me when it is available again" — shoppers subscribe to an out-of-stock product and are mailed when it returns.

## For architects

One entity and nine migrations over seven dependencies, because the notification path needs inventory, catalog, customer, store and notifications together. One GraphQL builder for the storefront subscribe action.

## For developers

It reacts to stock changes rather than polling, and the send is a background job — so a host without a worker collects subscriptions and never mails them. Two declared events for downstream automation.

## Use it when

- Stock-outs cost sales and the business wants the demand signal
- Shoppers should be told rather than left to check
- Waiting-list demand is worth reporting on

## Do not use it when

- Inventory is never short — the feature has nothing to do
- You want a general newsletter: that is marketing, not this
- There is no background worker in the deployment

## Required modules

- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1000.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1000.0
- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1000.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1000.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1000.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1015.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1000.0

## Owns these entities

- `BackInStockSubscriptionEntity`

## Events it handles

- `InventoryChangedEvent`

## REST controllers

- `api/back-in-stock/subscriptions` · 5 actions · [vc-module-back-in-stock/src/VirtoCommerce.BackInStock.Web/Controllers/Api/BackInStockSubscriptionController.cs](https://github.com/VirtoCommerce/vc-module-back-in-stock/blob/dev/src/VirtoCommerce.BackInStock.Web/Controllers/Api/BackInStockSubscriptionController.cs)

## GraphQL builders

- [vc-module-back-in-stock/src/VirtoCommerce.BackInStock.ExperienceApi/Queries/BackInStockSubscriptionsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-back-in-stock/blob/dev/src/VirtoCommerce.BackInStock.ExperienceApi/Queries/BackInStockSubscriptionsQueryBuilder.cs)

## Permissions

- `BackInStock:subscription:access`
- `BackInStock:subscription:create`
- `BackInStock:subscription:delete`
- `BackInStock:subscription:read`
- `BackInStock:subscription:update`

## Settings

- `BackInStock.BatchSize`
- `BackInStock.Enable`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 9.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Back-in-stock alerts** (Catalog & discovery): Shoppers ask to be told when a sold-out product returns, and the demand is recorded.

## Key features

- **Native Integration with Virto Commerce Frontend.**
- **"Notify Me When In Stock" Button.** Automatically displays a subscription button on product detail pages when inventory reaches zero. Customers can opt into notifications without leaving the page.
- **Self-Service Subscription Management.** Authenticated customers can view and manage their active subscriptions in a dedicated "Back In Stock" list. They can remove subscriptions for products they no longer wish to track.
- **Real-Time Email Notifications.** Triggers email notifications immediately when product inventory is updated from zero to a positive value. Notifications include product details and direct links to the product page.
- **Automatic Subscription Cleanup.**
- **Back Office Subscription Management.**
- **Ready for Export & Analysis.**

## Documentation

- [Back-in-stock module user documentation](https://docs.virtocommerce.org/platform/user-guide/back-in-stock/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.BackInStock)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Back-in-stock/overview/)
- [Back-in-stock notifications in the Frontend Application](https://docs.virtocommerce.org/storefront/user-guide/shopping/back-in-stock-notifications/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-back-in-stock)
