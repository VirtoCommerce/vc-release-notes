# Event Bus (`VirtoCommerce.EventBus`)

> The module enables you to be notified of new messages or changes via a Message Queue of your choice

- Latest version: 3.1011.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-event-bus
- Area: Platform services
- On the map: `#/molecule/VirtoCommerce.EventBus`

## For business analysts

A way to tell other systems what happened in the store, through a message queue rather than a phone call: you subscribe a queue to the events you care about and the platform posts them there.

## For architects

The durable half of outbound integration, where WebHooks is the immediate half. It depends on nothing, keeps its own subscriptions and provider connections, and logs every connection attempt — four entities, one of which exists purely for that audit trail. Like WebHooks it subscribes to domain events **dynamically**, so any module's events become routable without it knowing about them. No admin UI: this is configured through its API.

## For developers

Raise proper domain events in your own module and they become subscribable here for free — that is the whole contract. Choose this over WebHooks when delivery must survive the receiver being down, because a queue holds what an HTTP call drops. Subscriptions and provider connections are data, so a new integration is configuration rather than a release.

## Use it when

- An external system needs a durable, ordered-ish stream of what happened
- The receiver cannot be trusted to be online when the event occurs
- Integration middleware already consumes a queue you would rather publish to

## Do not use it when

- A simple HTTP callback is enough — that is WebHooks, with less infrastructure
- The reaction belongs inside the platform: use a domain event handler, in-process and transactional
- You are exporting a bulk snapshot — that is Export, not an event per row

## Owns these entities

- `SubscriptionEntity`
- `SubscriptionEventEntity`
- `ProviderConnectionEntity`
- `ProviderConnectionLogEntity`

## REST controllers

- `api/eventbus` · 5 actions · [vc-module-event-bus/src/VirtoCommerce.EventBusModule.Web/Controllers/Api/ConnectionsController.cs](https://github.com/VirtoCommerce/vc-module-event-bus/blob/dev/src/VirtoCommerce.EventBusModule.Web/Controllers/Api/ConnectionsController.cs)
- `api/eventbus` · 1 actions · [vc-module-event-bus/src/VirtoCommerce.EventBusModule.Web/Controllers/Api/ConnectionsLogController.cs](https://github.com/VirtoCommerce/vc-module-event-bus/blob/dev/src/VirtoCommerce.EventBusModule.Web/Controllers/Api/ConnectionsLogController.cs)
- `api/eventbus` · 6 actions · [vc-module-event-bus/src/VirtoCommerce.EventBusModule.Web/Controllers/Api/SubscriptionsController.cs](https://github.com/VirtoCommerce/vc-module-event-bus/blob/dev/src/VirtoCommerce.EventBusModule.Web/Controllers/Api/SubscriptionsController.cs)

## Permissions

- `eventbus:events:read`
- `eventbus:subscriptions:access`
- `eventbus:subscriptions:delete`
- `eventbus:subscriptions:read`
- `eventbus:subscriptions:update`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 9.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Event streaming to a queue** (Integration & operations): A durable stream of changes for integrations that must not miss one.

## Key features

- **Multi-provider architecture** — pluggable provider model allows registering custom event bus providers alongside the built-in Azure Event Grid provider
- **Automatic domain event discovery** — scans all loaded assemblies at startup and exposes every `IEvent` implementation as a subscribable event
- **Dual configuration sources** — subscriptions and connections can be defined in application settings or managed at runtime through the database via REST API
- **JsonPath event filtering** — each subscription supports a `JsonPath` expression to selectively forward only matching events
- **Liquid payload transformation** — Scriban/Liquid templates allow reshaping event payloads before delivery to the destination provider
- **CloudEvents data format** — the Azure Event Grid provider emits events using the [CloudEvents](https://cloudevents.io/) specification
- **Connection error logging** — failed event deliveries are persisted as provider connection logs with status, error message, and payload for diagnostics
- **Multi-database support** — supports SQL Server, MySQL, and PostgreSQL as persistence backends

## Documentation

- [Scriban syntax](https://github.com/scriban/scriban/tree/master/doc)
- [Test your Scriban-template](https://scribanonline.azurewebsites.net)
- [Event Bus module user documentation](https://docs.virtocommerce.org/platform/user-guide/event-bus/overview/)
- [REST API reference](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.EventBus)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-event-bus/)
