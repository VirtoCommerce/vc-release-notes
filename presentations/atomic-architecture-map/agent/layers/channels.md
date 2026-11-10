# Channels (architecture layer)

> Every surface that talks to the platform, and the protocol each one speaks. Presentation is fully separated from business logic, so every channel — including the back office — is just an API client.

- Tags: `vc-frontend`, `GraphQL`, `Admin UI`, `AI agents`
- On the map: `#/layer/channels`

## What to know

- `vc-frontend` — Vue 3 · TypeScript · Vite · TailwindCSS · Yarn 4. Storefront-less: it talks straight to XAPI over GraphQL, with no ASP.NET middleware in between. Follows Atomic Design, which is where the atom/molecule vocabulary on this poster comes from.
- Admin UI ("Commerce Manager") — AngularJS 1.8.3 + Webpack 5 + SASS, using the blades navigation pattern. Since platform 3.1092 it is the Admin AngularJS module rather than part of `Platform.Web/wwwroot`; each module still contributes its own scripts, templates and localizations.
- Admin Shell — the Vue 3 back office on VC-Shell, also a module. Module screens arrive as plugins, and while the AngularJS UI is installed too, its screens open inside Admin Shell in an embedded frame. Which back office owns the site root is set by `VirtoCommerce:PlatformUI:RootApp`; with neither installed the platform serves APIs only.
- VC-Shell — Vue 3 + Module Federation, the host behind the Vendor Portal and other vertical apps. Loads plugin remotes from the canonical `GET /api/apps/{appId}/manifest`.
- Custom standalone SPAs — served via the platform `<apps>` mechanism, and extensible through the same manifest contract as the other hosts.
- AI agents — the UCP module (`VirtoCommerce.UCP`) publishes a Universal Commerce Protocol profile at `/.well-known/ucp` and an MCP server at `/ucp/mcp`, so an agent can discover the store, search the catalogue, build a cart and hand off to checkout. `UCP` (Google with Shopify, announced January 2026) defines the commerce conversation; `MCP` carries it as tools. Since platform 3.1095 an agent is registered as an OAuth application and granted tokens for named resources such as that MCP endpoint.

## Pitfalls

- The Admin UI is back-office only. It is never the customer-facing surface, and its AngularJS age says nothing about the storefront stack.
- Admin UI assets are built into the source `wwwroot/dist`, but a running platform serves the installed module's copy — a webpack build alone does not update a running instance.
- Every back-office host converges on one contract: `GET /api/apps/{appId}/manifest`, driven by the same `module.manifest` dependency graph as .NET install order. `POST /api/frontend-modules` survives only as a deprecated alias.
- The platform core does not implement MCP or UCP; the UCP module does. Treat any agent as an untrusted client: give it its own OAuth application limited to the resources it needs, not an API key for a privileged account.

## Documentation

- [Architecture reference](https://docs.virtocommerce.org/platform/developer-guide/latest/Back-End-Architecture/02-conceptual-overview/)
- [Back-office modularity](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/07-backoffice-app-modularity/)
- [VC-Shell implementation spec](https://docs.virtocommerce.org/platform/developer-guide/latest/Fundamentals/Modularity/07-backoffice-app-modularity/)
- [Blades and navigation](https://docs.virtocommerce.org/platform/developer-guide/latest/Platform-Manager/Extensibility-Points/blades-and-navigation/)
- [Universal Commerce Protocol (ucp.dev)](https://ucp.dev/)
