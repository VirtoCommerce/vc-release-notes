# Sales Rep (`VirtoCommerce.SalesRep`)

> Virto Commerce Sales Rep

- Latest version: 3.1018.0 (needs platform 3.1091.0)
- Repository: https://github.com/VirtoCommerce/vc-module-sales-rep
- Area: Customer
- On the map: `#/molecule/VirtoCommerce.SalesRep`

## For business analysts

A sales representative working on behalf of a customer: seeing their accounts, building baskets for them and placing orders in their name.

## For architects

The largest schema surface in the catalogue — **19 builders** — and ten required dependencies, because impersonating a customer touches profile, cart, order and pricing at once. One index builder of its own. No database: it composes.

## For developers

Acting-on-behalf-of is an authorisation problem before it is an API problem: the rep's own permissions and the customer's scope both apply, and getting that wrong exposes one customer's data to another.

## Use it when

- A storefront, app or agent needs data shaped for one round trip
- You are extending an existing query or mutation rather than adding an endpoint
- The host should serve only this capability's API surface

## Do not use it when

- Back-office CRUD — that is the module's REST controller
- You need a table: these modules own no schema, they compose other modules' services
- Bulk writes: a mutation per row is slower than the owning module's import path

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Shopping Cart](VirtoCommerce.Cart.md) (`VirtoCommerce.Cart`) ≥ 3.1012.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1032.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1028.0
- [File Experience API](VirtoCommerce.FileExperienceApi.md) (`VirtoCommerce.FileExperienceApi`) ≥ 3.1004.0
- [Notifications](VirtoCommerce.Notifications.md) (`VirtoCommerce.Notifications`) ≥ 3.1018.0
- [Order Management](VirtoCommerce.Orders.md) (`VirtoCommerce.Orders`) ≥ 3.1018.0
- [Push Messages](VirtoCommerce.PushMessages.md) (`VirtoCommerce.PushMessages`) ≥ 3.1004.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0
- [Core Experience API](VirtoCommerce.Xapi.md) (`VirtoCommerce.Xapi`) ≥ 3.1027.0
- [Cart Experience API](VirtoCommerce.XCart.md) (`VirtoCommerce.XCart`) ≥ 3.1039.0
- [Frontend Experience API](VirtoCommerce.XFrontend.md) (`VirtoCommerce.XFrontend`) ≥ 3.1005.0
- [Order Experience API](VirtoCommerce.XOrder.md) (`VirtoCommerce.XOrder`) ≥ 3.1011.0

## Optional modules

- [Google Analytics 4](VirtoCommerce.GoogleEcommerceAnalytics.md) (`VirtoCommerce.GoogleEcommerceAnalytics`) ≥ 4.1006.0
- [Marketing](VirtoCommerce.Marketing.md) (`VirtoCommerce.Marketing`) ≥ 3.1009.0
- [Task Management](VirtoCommerce.TaskManagement.md) (`VirtoCommerce.TaskManagement`) ≥ 3.1005.0

## Owns these entities

- `DocumentMetadataEntity`

## Events it handles

- `AssetEntryChangedEvent`
- `CartChangedEvent`
- `OrderChangedEvent`

## REST controllers

- `api/sales-rep` · 1 actions · [vc-module-sales-rep/src/VirtoCommerce.SalesRep.Web/Controllers/Api/SalesRepAnalyticsDiagnosticsController.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.Web/Controllers/Api/SalesRepAnalyticsDiagnosticsController.cs)
- `api/sales-rep` · 10 actions · [vc-module-sales-rep/src/VirtoCommerce.SalesRep.Web/Controllers/Api/SalesRepController.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.Web/Controllers/Api/SalesRepController.cs)
- `api/sales-rep/documents` · 7 actions · [vc-module-sales-rep/src/VirtoCommerce.SalesRep.Web/Controllers/Api/SalesRepDocumentsController.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.Web/Controllers/Api/SalesRepDocumentsController.cs)

## GraphQL builders

- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/CustomerSalesRepsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/CustomerSalesRepsQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepActivitiesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepActivitiesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCartFilterRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCartFilterRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCouponsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCouponsQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerActivitySummaryQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerActivitySummaryQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerFilterRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerFilterRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerInsightsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerInsightsQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerOrderQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerOrderQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerOrdersQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerOrdersQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerSortRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomerSortRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomersQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepCustomersQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepDocumentCategoriesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepDocumentCategoriesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepDocumentQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepDocumentQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepDocumentsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepDocumentsQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepLayoutQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepLayoutQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrderFilterRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrderFilterRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrderQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrderQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrderSortRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrderSortRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrdersQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepOrdersQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepSearchQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepSearchQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskFilterRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskFilterRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskSortRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskSortRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTasksQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTasksQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskTypesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTaskTypesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTopSellerFilterRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTopSellerFilterRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTopSellerSortRulesQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTopSellerSortRulesQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTopSellersQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/SalesRepTopSellersQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/Statistics/SalesRepCustomerCartStatisticsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/Statistics/SalesRepCustomerCartStatisticsQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/Statistics/SalesRepCustomerCountsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/Statistics/SalesRepCustomerCountsQueryBuilder.cs)
- [vc-module-sales-rep/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/Statistics/SalesRepCustomerOrderStatisticsQueryBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/src/VirtoCommerce.SalesRep.ExperienceApi/Queries/Statistics/SalesRepCustomerOrderStatisticsQueryBuilder.cs)
- [vc-module-sales-rep/tests/VirtoCommerce.SalesRep.Tests/ComponentTests/Infrastructure/TestGraphQlConfiguration.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/tests/VirtoCommerce.SalesRep.Tests/ComponentTests/Infrastructure/TestGraphQlConfiguration.cs)
- [vc-module-sales-rep/tests/VirtoCommerce.SalesRep.Tests/ComponentTests/SalesRepEndpointGateTests.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/tests/VirtoCommerce.SalesRep.Tests/ComponentTests/SalesRepEndpointGateTests.cs)
- [vc-module-sales-rep/tests/VirtoCommerce.SalesRep.Tests/StorefrontE2E/Infrastructure/StorefrontServices.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/tests/VirtoCommerce.SalesRep.Tests/StorefrontE2E/Infrastructure/StorefrontServices.cs)
- [vc-module-sales-rep/tests/VirtoCommerce.SalesRep.Tests/StorefrontE2E/Infrastructure/StorefrontShellSchemaBuilder.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/tests/VirtoCommerce.SalesRep.Tests/StorefrontE2E/Infrastructure/StorefrontShellSchemaBuilder.cs)

## Search index builders

- [vc-module-sales-rep/tests/VirtoCommerce.SalesRep.Tests/ComponentTests/Infrastructure/SalesRepTestContext.cs](https://github.com/VirtoCommerce/vc-module-sales-rep/blob/dev/tests/VirtoCommerce.SalesRep.Tests/ComponentTests/Infrastructure/SalesRepTestContext.cs)

## Permissions

- `sales-rep-documents:read`
- `sales-rep-documents:write`
- `sales-rep:access`
- `sales-rep:diagnostics`

## Settings

- `SalesRep.Enabled`
- `SalesRep.Statistics.CartCacheExpirationMinutes`
- `SalesRep.Statistics.CartInvalidateOnChange`
- `SalesRep.Statistics.CustomerCountsCacheExpirationMinutes`
- `SalesRep.Statistics.CustomerCountsInvalidateOnChange`
- `SalesRep.Statistics.OrderCacheExpirationMinutes`
- `SalesRep.Statistics.OrderInvalidateOnChange`
- `SalesRep.Statistics.TopSellerCacheExpirationMinutes`
- `SalesRep.Statistics.TopSellerInvalidateOnChange`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 6.

## Business features it serves

- **Ordering on behalf of a customer** (B2B buying): A sales representative works inside the customer’s account and places the order for them.

## Key features

- Manage sales representatives from a dedicated back-office app — create, edit, block/unblock and delete
- Assign a rep the customer organizations they serve (a per-organization role); a global role marks a user as a rep without tying them to any specific customer
- Manage the rep's login account: store, password and lockout
- Model a rep from existing platform data (a contact, a login account and a role) with no new database tables
- Let buyers see the sales reps supporting their organization
- Let reps see the customers they serve, each with the rep's latest order for that customer
- Show a customer information card — organization, primary contact and account type
- List and filter the orders a rep created for their customers
- Show dashboard **statistics** for a rep — order purchases, average order value and order counts, with period-over-period comparison, converted to one currency
- Add cart/project statistics (e.g. *active projects*) and *my-customers* counters (customers who ordered in a period, new customers)
- Show inline per-customer purchase figures on the customers list (YTD / prior-year totals, order counts, first/last order) via a batched per-row statistics field — no N+1
- Filter the orders/customers lists and every statistics block by a single, optional, server-defined **filter rule** (aggregated order statuses / cart kinds / customer segments), and order the lists by a server-defined **sort rule** (orders: *recent* / *total*; customers: *my last orders* / *ytd purchases* / *name*; top sellers: *by units* / *by revenue*) — one rule name per axis, with an optional X-Order-style `:asc`/`:desc` suffix to reverse a rule where that's meaningful; both filter and sort are overridable per project
- Rank a rep's **top-selling products** (dashboard + per-customer) by units or revenue over a period, optionally within a product category
- Scope the orders list to an optional created-date **period**
- Send a push notification and/or email to the members of a customer organization
- Publish a shopping list (wishlist) to a customer organization the rep serves — its members open it read-only ("Recommended by your Sales Rep") and add items to their cart, with an optional email/push notification
- Share a curated **documents library** with sales reps — a back-office manager uploads categorized sales materials (price lists, catalogs, guides), optionally pinning one and annotating summary / page count / preview; reps browse, search and download them from the storefront
- Show a rep an **activity feed** of their customers — orders placed, customers assigned, and (from Google Analytics 4) searches, product views and sign-ins — merged newest-first with per-category counters
- Show **customer insights** per customer or across all of them: top/recent search phrases, browsed products, last sign-in and visit count, sourced from tracked storefront activity
- Diagnose the Google Analytics connection from the back office — a staged checklist ending in a probe that runs the real feature query
- Toggle the storefront Sales Rep UI per store

## Documentation

- [VCST-5142 — Sales Rep Hub](https://virtocommerce.atlassian.net/browse/VCST-5142)
- [#1 — VCST-5293: Sales rep VC-Shell administration UI](https://github.com/VirtoCommerce/vc-module-sales-rep/pull/1)
- [#2 — VCST-4907 / VCST-5304 / VCST-5308: X-API endpoints for customers and sales reps](https://github.com/VirtoCommerce/vc-module-sales-rep/pull/2)
- [VCST-5309: Sales rep dashboard statistics, sort rules & Top Sellers](https://virtocommerce.atlassian.net/browse/VCST-5309)
- [VCST-5310 / VCST-5331: Push & email messaging to customer members](https://virtocommerce.atlassian.net/browse/VCST-5310)
- [VCST-5332: Publish a shopping list to a customer organization](https://virtocommerce.atlassian.net/browse/VCST-5332)
- [#12 — VCST-5730: Sales Rep documents library](https://github.com/VirtoCommerce/vc-module-sales-rep/pull/12)
- [Sales Rep Hub epic](https://virtocommerce.atlassian.net/browse/VCST-5142)
