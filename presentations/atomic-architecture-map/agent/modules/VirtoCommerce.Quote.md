# Quotes (`VirtoCommerce.Quote`)

> Quoter enables business users to execute quote requests online. Once initiated, an online conversation takes place with internal users who interact with the business user's request. The internal user can set prices for quantity breaks or discounts. The quote is then made available to the business user online. The business user can accept the quote and place the order, continue the conversation, or reject the quote.

- Latest version: 3.1007.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-quote
- Area: Cart & checkout
- On the map: `#/molecule/VirtoCommerce.Quote`

## For business analysts

Request for quote: a buyer asks for a price, a sales person answers, and an agreed quote becomes an order. The B2B negotiation step that B2C does not have.

## For architects

Thirteen required dependencies — the second most coupled module in the catalogue after Orders — because a quote spans catalog, pricing, cart, order, customer and notifications. Eight entities and 34 migrations of its own, plus three GraphQL builders, so it is a full capability rather than a hook.

## For developers

A quote is its own document with its own status flow; do not model it as a cart with a flag. Three schema builders mean the storefront path is GraphQL, and one declared event is what downstream automation should subscribe to.

## Use it when

- Prices are negotiated rather than published
- A sales person must approve or adjust before an order exists
- B2B buyers expect a quote document they can circulate internally

## Do not use it when

- Prices are fixed — a cart plus a promotion is simpler
- You need the sale itself: a quote converts into an order, and the order is authoritative
- The host must stay small: thirteen dependencies make this a full commerce install

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1000.0
- [Shopping Cart](VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`) ≥ 3.1000.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1000.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1007.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1008.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1000.0
- [Shipping](VirtoCommerce.Shipping.md) (`VirtoCommerce.Shipping`) ≥ 3.1000.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1006.0
- [Tax Core](VirtoCommerce.Tax.md) (`VirtoCommerce.Tax`) ≥ 3.1003.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1026.0
- [Cart Experience API](VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`) ≥ 3.1042.0
- [Catalog Experience API](VirtoCommerce.XCatalog.md) (`VirtoCommerce.XCatalog`) ≥ 3.1023.0

## Owns these entities

- `QuoteRequestEntity`

## Events it handles

- `QuoteRequestChangeEvent`

## REST controllers

- `api/quote/requests` · 10 actions · [vc-module-quote/src/VirtoCommerce.QuoteModule.Web/Controllers/Api/QuoteModuleController.cs](https://github.com/VirtoCommerce/vc-module-quote/blob/dev/src/VirtoCommerce.QuoteModule.Web/Controllers/Api/QuoteModuleController.cs)

## GraphQL builders

- [vc-module-quote/src/VirtoCommerce.QuoteModule.ExperienceApi/Queries/QuoteAttachmentOptionsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-quote/blob/dev/src/VirtoCommerce.QuoteModule.ExperienceApi/Queries/QuoteAttachmentOptionsQueryBuilder.cs)
- [vc-module-quote/src/VirtoCommerce.QuoteModule.ExperienceApi/Queries/QuoteQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-quote/blob/dev/src/VirtoCommerce.QuoteModule.ExperienceApi/Queries/QuoteQueryBuilder.cs)
- [vc-module-quote/src/VirtoCommerce.QuoteModule.ExperienceApi/Queries/QuotesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-quote/blob/dev/src/VirtoCommerce.QuoteModule.ExperienceApi/Queries/QuotesQueryBuilder.cs)

## Permissions

- `quote:access`
- `quote:create`
- `quote:delete`
- `quote:read`
- `quote:update`

## Settings

- `Quotes.DefaultStatus`
- `Quotes.EnableQuotes`
- `Quotes.FileUploadScopeName`
- `Quotes.QuoteRequestNewNumberTemplate`
- `Quotes.Status`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 37.

## Packages that include it

- [Virto Start](../packages/virto-start.md)

## Business features it serves

- **Quote negotiation** (B2B buying): A buyer asks for a price, a salesperson answers, and the agreed quote becomes an order.

## Key features

- Unlimited number of tiers
- Discounts per tier or for the whole quote
- Full line items' management even after the initial quote was created
- Attachments, dynamic properties support
- Regular order is produced once the quote is confirmed by a customer

## Documentation

- [Quote module user documentation](https://docs.virtocommerce.org/platform/user-guide/quotes/overview/)
- [GraphQL API documentation](https://docs.virtocommerce.org/platform/developer-guide/GraphQL-Storefront-API-Reference-xAPI/Quote/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Quote)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-quote)
