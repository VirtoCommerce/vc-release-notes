# Webhooks (`VirtoCommerce.WebHooks`)

> Manage user defined webhooks

- Latest version: 3.1007.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-webhooks
- Area: Integrations & providers
- On the map: `#/molecule/VirtoCommerce.WebHooks`

## For business analysts

Lets the business subscribe an external system to things that happen in the store — an order placed, a price changed — without a developer writing an integration for each one. Someone configures the endpoint and the fields to send in the back office, and every delivery attempt is auditable afterwards.

## For architects

The platform's only built-in outbound integration edge. It turns in-process domain events into HTTP POSTs, which means it is the boundary where a Virto event stops being transactional: delivery is a background job with retries, not part of the writing transaction. It declares no module dependencies, so it can be installed on any host — but it needs a background-jobs worker to deliver anything, and it owns four tables of its own.

## For developers

You rarely code against it. Raise a proper domain event in your module and it becomes subscribable automatically, because the module resolves DomainEvent types from every loaded assembly at runtime. The two knobs that change behaviour are settings, not code: Webhooks.General.SendRetryCount and Webhooks.General.LatestErrorCount.

## Use it when

- An external system needs to react to store changes and you do not want it polling your API
- Integration middleware wants a change stream rather than a nightly diff
- A partner asked for callbacks and you need the delivery attempts on record

## Do not use it when

- The reaction belongs inside the platform — that is a domain event handler, in-process and transactional
- You need guaranteed, ordered delivery: this is retried HTTP with exponential backoff, not a broker. Reach for EventBus and a real queue
- The payload would carry data the receiving endpoint should not see — field selection is per webhook and easy to over-share
- The events come from a bulk import: suppress events or turn event-based indexation off first, or one import fans out into thousands of callbacks

## Owns these entities

- `WebhookEntity`
- `WebhookEventEntity`
- `WebHookPayloadEntity`
- `WebhookFeedEntryEntity`

## REST controllers

- `api/webhooks` · 9 actions · [vc-module-webhooks/src/VirtoCommerce.WebHooksModule.Web/Controllers/Api/WebhooksController.cs](https://github.com/VirtoCommerce/vc-module-webhooks/blob/dev/src/VirtoCommerce.WebHooksModule.Web/Controllers/Api/WebhooksController.cs)

## Permissions

- `webhooks:access`
- `webhooks:delete`
- `webhooks:feed:read`
- `webhooks:read`
- `webhooks:update`

## Settings

- `Webhooks.General.LatestErrorCount`
- `Webhooks.General.SendRetryCount`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 17.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Identity Provider](../packages/idp.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Outbound webhooks** (Integration & operations): External systems are told when something happens, without polling your API.

## Key features

- **Automatic event discovery** — resolves all `DomainEvent` types from the platform and installed modules at runtime
- **Selective payload composition** — choose specific entity properties to include in the notification body, with access to previous values for change tracking
- **Multiple authentication schemes** — None, HTTP Basic, Bearer Token, and Custom Header
- **Resilient delivery** — configurable retry policy with exponential backoff powered by Polly (default: 3 retries at 1, 2, 4 minute intervals)
- **Execution audit log (Feed)** — records request/response headers, body, HTTP status, error messages, and attempt counts for every webhook invocation
- **Background processing** — notifications are dispatched asynchronously via Hangfire with a 5-second debounce delay and processed in batches of 20
- **Permission-based access control** — granular permissions for read, update, delete, and feed access
- **Multi-database support** — SQL Server, MySQL, and PostgreSQL via dedicated EF Core provider assemblies

## Documentation

- [Webhooks module user documentation](https://docs.virtocommerce.org/platform/user-guide/webhooks/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.WebHooks)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-webhooks/)
