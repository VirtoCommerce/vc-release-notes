# API edge (architecture layer)

> Where the outside world meets the platform. Two shapes with two jobs: GraphQL as the business API a channel talks to — queries and mutations both — and REST for full CRUD and the back office.

- Tags: `XAPI /graphql`, `REST /api`, `Swagger`, `SignalR`
- On the map: `#/layer/api-edge`

## What to know

- XAPI (Experience API) — a BFF built on GraphQL, shipped as modules: `xCatalog`, `xCart`, `xOrder`, `xCMS`, `xProfile` over the shared `VirtoCommerce.xApi` core. It is a full business API — queries *and* mutations, so a storefront never needs REST — and one round trip returns exactly the shape a screen needs.
- REST — the complete surface. Every module exposes controllers under `/api/…`; this is what the Admin SPA and integration middleware use.
- Swagger / OpenAPI — generated per module plus a combined document, so a module's API is browsable and client-generatable the moment it loads.
- SignalR — server-to-client push for long-running work (`/pushNotificationHub`), with a Redis or Azure SignalR backplane when scaled out.
- Outbound WebHooks — the platform calling you, rather than you polling it.

## Choosing between them

- **Storefront**: XAPI / GraphQL. A business API: purpose-shaped queries and mutations, batched, one round trip per screen.
- **Back office & admin**: REST. Full CRUD, per-endpoint permissions, Swagger-documented.
- **Integration & ETL**: REST + WebHooks, usually through integration middleware rather than point-to-point.
- **Progress & live updates**: SignalR push notifications — never poll a job endpoint in a loop.

## Pitfalls

- MVC is configured with `AddNewtonsoftJson`, so REST serialization is Newtonsoft — not `System.Text.Json`. Custom converters must be written against Newtonsoft.
- The platform uses MVC controllers throughout; there are no Minimal API endpoints to copy as a pattern.
- XAPI lives in a separate repository (`vc-module-x-api`) — it is a module set, not part of the platform core. `vc-module-experience-api` is the archived predecessor; do not start from it.

## Documentation

- [Swagger endpoints](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/swagger-api/)
- [Secure Web API](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Security/authorization/overview/)
- [Polymorphic types in Swagger](https://docs.virtocommerce.org/platform/developer-guide/latest/Tutorials-and-How-tos/How-tos/type-inheritance-support-in-swagger/)
