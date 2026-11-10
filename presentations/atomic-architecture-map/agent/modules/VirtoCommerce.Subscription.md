# Subscriptions (`VirtoCommerce.Subscription`)

> Represent recurrent subscriptions functionality

- Latest version: 3.1007.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-subscription
- Area: Orders & fulfilment
- On the map: `#/molecule/VirtoCommerce.Subscription`

## For business analysts

Recurring orders: a shopper subscribes, and the platform places the repeat orders on schedule.

## For architects

Two entities and 11 migrations over five dependencies, with nine settings — the schedule, retry and numbering behaviour is configuration. Four declared events, because a subscription's lifecycle is what other systems care about.

## For developers

The recurring run is a background job, so a subscription host needs a worker. Failures are a business flow, not an exception: read the settings for retry and dunning behaviour before writing your own.

## Use it when

- Revenue is recurring — replenishment, service plans, memberships
- Orders must be created without the customer returning
- A subscription's pause, resume and cancel need to be modelled

## Do not use it when

- A one-off order with a reminder is enough
- Payment authorisation cannot be stored: recurring charges need a gateway that supports it
- You are on a request-only host with no background worker

## Required modules

- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## Owns these entities

- `SubscriptionEntity`

## Events it handles

- `OrderChangedEvent`
- `SubscriptionChangedEvent`

## REST controllers

- `api/subscriptions` · 14 actions · [vc-module-subscription/src/VirtoCommerce.SubscriptionModule.Web/Controllers/Api/SubscriptionModuleController.cs](https://github.com/VirtoCommerce/vc-module-subscription/blob/dev/src/VirtoCommerce.SubscriptionModule.Web/Controllers/Api/SubscriptionModuleController.cs)

## Permissions

- `paymentplan:manage`
- `subscription:access`
- `subscription:create`
- `subscription:delete`
- `subscription:read`
- `subscription:update`

## Settings

- `Subscription.CronExpression`
- `Subscription.CronExpressionOrdersJob`
- `Subscription.EnableSubscriptionOrdersCreateJob`
- `Subscription.EnableSubscriptionProcessJob`
- `Subscription.EnableSubscriptions`
- `Subscription.ExportImport.Description`
- `Subscription.PastDue.Delay`
- `Subscription.Status`
- `Subscription.SubscriptionNewNumberTemplate`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 11.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Subscriptions & recurring orders** (Orders & fulfilment): Repeat orders placed on schedule, with pause, resume and cancel.

## Key features

- Trial periods
- Grace periods
- Free subscriptions
- Product or bundle selling on a subscription
- Multiple products via one subscription
- View a list of existing subscriptions with filtration and sorting
- View full subscription history with all notifications, invoices and changes
- Update active subscriptions (including payment plan changes)
- Manual invoicing on subscription with any amount
- Notifications for each life phase and subscription events
- Possibility to use templates for notifications
- Possibility to edit notification templates and manage the list of notification types
- View information about upcomming invoice

## Documentation

- [Subscription module user documentation](https://docs.virtocommerce.org/platform/user-guide/subscription/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Subscription)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-subscription)
