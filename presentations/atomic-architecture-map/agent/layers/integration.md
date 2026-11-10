# Integration (architecture layer)

> How the platform joins an existing business ecosystem. Integration is not one problem — it is a different problem for buyers, for your own team and for your suppliers, and the platform opens a different door for each. Middleware does the translating rather than either side compromising its model.

- Tags: `xAPI`, `REST`, `middleware`, `UCP/MCP`, `EventBus`, `WebHooks`
- On the map: `#/layer/integration`

## What to know

- Integration is a different problem for each audience — buyers, your own team, your suppliers — and handing all three the same generic API is how projects over-run. **Match the door to the audience**; the matrix above is that decision.
- The doors are not mutually exclusive. Most projects run several in parallel, and every door reads and writes the same data under the same rules, so nothing drifts apart.
- Integration middleware — a translation layer between the platform and ERP / WMS / CRM / PIM. Keeps foreign models out of your domain and lets each side change independently.
- Master vs reference data — decide per entity which system owns the truth. This single decision determines the direction of every sync you will build.
- The proof is volume, not a demo: **HEINEKEN runs 250 integrations across 25 operating companies** on one Virto Commerce foundation, and hundreds of enterprise-system integrations are delivered across the customer base — ERP, CRM, PIM, WMS, payments, tax, search and marketplaces (as of 2026-06-30).

## Which door to open

- **Admin UI · configuration**: **Check this door first, every time.** A large share of what looks like integration work is configuration: catalogs and content, price lists and contracts, promotions, organizations and roles, stores, currencies, languages — and the settings of the integrations themselves. If a business person can describe the change in business terms, it is usually a setting rather than a project.
- **xAPI · a person on a screen**: The experience API. A screen asks for exactly the data it needs in one request, and the platform resolves who the buyer is, which organization they belong to and what they have negotiated **before** it answers. Choose it for a storefront, a mobile app, a partner-branded portal or a rep selling on a customer's behalf — a new surface is then a new front end, not a new back end.
- **REST · a system you already own**: Every module publishes an open REST API with an OpenAPI schema — **the same API the admin screens use**, so nothing is trapped in a screen. Choose it for logic your business is genuinely built on, for high-volume data movement, or for an internal tool that needs complete control.
- **Integration middleware · the back office**: Azure Function Apps (the default in Virto delivery), Logic Apps, Boomi, MuleSoft, Kafka, or client-owned. **For multi-system landscapes this is the normal architecture, not the fallback**: orchestration, transformation, routing, retries and client-specific business logic belong here, especially when the integration team is not the commerce team. It imports the OpenAPI schema, so connecting SAP is a mapping — prices and stock in, orders out, invoices back.
- **Punchout · the buyer's procurement system**: Your largest customers buy from Coupa, Ariba or Jaggaer, because that is where budgets and approvals live. Punchout answers those systems in **cXML**: the buyer clicks your catalog from inside their tool, lands already identified with the right organization and contract prices, shops normally, and the finished cart goes back for approval and a PO. Choose it the moment a customer says they can only buy through their procurement platform.
- **UCP over MCP · an AI agent**: The `VirtoCommerce.UCP` module exposes the **Universal Commerce Protocol** through an MCP endpoint — an open standard for agent-driven commerce, so agents discover products, build a cart and check out against your real catalog, pricing and order rules. One endpoint, every compliant agent, no per-agent integration.
- **Vendor APIs · a supplier with its own IT**: A supplier's own systems create products and offers, update price and inventory, and receive and fulfil their orders — scoped strictly to their account and still subject to your moderation. Choose it for strategic suppliers with the volume to justify a system-to-system link.
- **Vendor middleware · the long tail**: Most suppliers cannot meet you at your API: they have a spreadsheet, an SFTP drop, or an API built for something else. One middleware flow collects whatever they can produce, validates and normalizes it, and calls the vendor APIs on their behalf. **The next supplier is a mapping, not a project.**
- **Vendor Portal · a supplier with no IT at all**: A login instead of an integration: register and get approved, create or bulk-import products and offers, keep price and stock current, see and fulfil orders. Make it the default for every new supplier and graduate the high-volume ones to middleware or API when the volume justifies it.
- **Events out · EventBus and WebHooks**: Not a door in, but the way the platform tells other systems something happened. EventBus bridges domain events onto Azure Service Bus, RabbitMQ or Kafka; WebHooks does configurable outbound HTTP per event type. Both are installable modules, not platform core.

## Pitfalls

- Integration events are at-least-once in practice. Handlers must be idempotent; assume every message can arrive twice.
- EventBus and WebHooks are installable modules, not platform core — the tiles on this poster reflect that.
- Point-to-point integration between the platform and each external system is the trap middleware exists to prevent.
- The most expensive integration is the one that never needed to exist — a ticket raised because a price list, a promotion or an approval limit could only be changed by a developer. Check the Admin UI door before scoping anything.
- Hand-written integration code has a running cost: every field the ERP team renames becomes a ticket, a release and a deployment window. That cost, not the build, is what middleware is bought to avoid.
- **Punchout is named in the Integration Capabilities deck but is not in the public module registry** and has no public repository. Treat it as a delivered capability to scope with the Virto team, not a package you can install from `vc-package.json`.

## Documentation

- [Integration Capabilities (presentation)](https://virtocommerce.github.io/vc-release-notes/presentations/integration-capabilities.html)
- [Architecture reference](https://docs.virtocommerce.org/platform/developer-guide/latest/Back-End-Architecture/02-conceptual-overview/)
- [Extending using events](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Event-Driven-Development/using-domain-events/)
- [vc-module-ucp (GitHub)](https://github.com/VirtoCommerce/vc-module-ucp)
- [Universal Commerce Protocol (ucp.dev)](https://ucp.dev/)
