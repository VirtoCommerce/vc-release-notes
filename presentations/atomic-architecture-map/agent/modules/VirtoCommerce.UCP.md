# Universal Commerce Protocol (`VirtoCommerce.UCP`)

> Universal Commerce Protocol facade for Virto Commerce capabilities.

- Latest version: 3.1010.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-ucp
- Area: AI
- On the map: `#/molecule/VirtoCommerce.UCP`

## For business analysts

A standard protocol front door — Universal Commerce Protocol — so external agents and marketplaces can discover, browse, and buy without a bespoke integration.

## For architects

A protocol adapter with **no storage and no schema**: six required dependencies (Xapi, XCatalog, XCart, Store, Orders, Marketing) and seven controllers that translate UCP calls into in-process XAPI calls — no extra HTTP hop. It also exposes an MCP endpoint at `/ucp/mcp`, which is how an AI agent talks to it. Public endpoints are published without the `/api` prefix.

## For developers

It composes; it owns nothing. Fix wrong data in the module that owns it. Read the README before assuming coverage — it is a Preview, and the protocol surface is narrower than the platform's own.

## Use it when

- An external agent or marketplace must transact without a custom integration
- You want an MCP endpoint for AI clients over commerce capabilities
- A standard protocol is a procurement requirement

## Do not use it when

- Your own storefront is the client — XAPI is richer and closer
- You need a capability UCP does not cover yet
- Production certainty: it is a preview module

## Required modules

- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1023.0
- [Cart Experience API](VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`) ≥ 3.1038.0
- [Order Experience API](VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`) ≥ 3.1014.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1009.0

## Optional modules

- [Azure Application Insights](VirtoCommerce.ApplicationInsights.md) (`VirtoCommerce.ApplicationInsights`) ≥ 3.1005.0
- [Open Telemetry](VirtoCommerce.OpenTelemetry.md) (`VirtoCommerce.OpenTelemetry`) ≥ 3.1002.0

## REST controllers

- `ucp/v1/carts` · 5 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpCartController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpCartController.cs)
- `ucp/v1/catalog` · 2 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpCatalogController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpCatalogController.cs)
- `ucp/v1/checkouts` · 4 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpCheckoutController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpCheckoutController.cs)
- `ucp/v1/geography` · 3 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpGeographyController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpGeographyController.cs)
- `ucp/v1/internal/handoff` · 1 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpHandoffController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpHandoffController.cs)
- `null` · 1 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpOAuthMetadataController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpOAuthMetadataController.cs)
- `ucp/v1/orders` · 2 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpOrderController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpOrderController.cs)
- `/.well-known/ucp` · 1 actions · [vc-module-ucp/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpProfileController.cs](https://github.com/VirtoCommerce/vc-module-ucp/blob/dev/src/VirtoCommerce.UCP.Web/Controllers/Api/UcpProfileController.cs)

## Permissions

- `ucp:access`
- `ucp:create`
- `ucp:delete`
- `ucp:read`
- `ucp:update`

## Settings

- `UCP.Enabled`

## Business features it serves

- **Agent & marketplace protocol** (AI & agents): External agents and marketplaces browse and buy through a standard protocol, including MCP.

## Key features

- **UCP discovery profile** — `/.well-known/ucp` publishes supported capabilities, default store metadata, endpoint metadata, headers, auth shape, integration guidance, payment handlers, and structured error codes
- **Catalog search and product details** — catalog search and product detail lookup through in-process XCatalog GraphQL
- **Cart assembly** — create, buyer-scoped list, get, and full-state update through XCart GraphQL with UCP replacement semantics
- **Checkout handoff** — checkout snapshot and hosted handoff with address prefill; temporary handoff sessions stored in Redis with TTL when the Platform Redis connection is configured. Without Redis, sessions are kept in process memory, which is only suitable for a single instance.
- **Order tracking** — order status, totals, line items, and shipment tracking by order id, order number, or cart id after handoff
- **Geography lookup** — country and region resolution through the platform `ICountriesService` for checkout address normalization
- **Streamable HTTP MCP server** — `/ucp/mcp` with typed UCP commerce tools for the installed storefront/platform, built on the official C# MCP SDK
- **Unified anonymous and authenticated buyer flows** — the same `/ucp/mcp` endpoint and the same tools support anonymous shopping or buyer identity from Virto Commerce Platform OAuth claims
- **Safe cart upgrade** — `update_cart` can verify an anonymous buyer capability and delegate anonymous-to-authenticated cart merging to XCart
- **Structured UCP errors** — machine-readable error codes with correlation id support

## Documentation

- [Virto Commerce Documentation](https://docs.virtocommerce.org)
- [GraphQL Storefront API Reference (xAPI)](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-ucp/)
