# Pricing (`VirtoCommerce.Pricing`)

> Robust pricing management functionality based on price list and dynamic evaluation

- Latest version: 3.1011.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-pricing
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.Pricing`

## For business analysts

What a product costs, and why: price lists, the assignments that decide which list applies to whom, and an evaluation step that picks the price for a given shopper, store and currency. A price is a decision made per request, not a number stored on the product.

## For architects

Small in schema — six entities against Catalog's 33 — and heavy in traffic, because evaluation runs on the read path. Its merged-price tables exist so the answer can be precomputed rather than derived per request. Two index builders project prices into the catalog index, which is the seam that makes price filtering possible and also the seam that goes stale after a bulk import: `Pricing.Search.EventBasedIndexation.Enable` is the switch to turn off before one.

## For developers

Evaluate through `IPricingEvaluatorService` with a `PriceEvaluationContext` — never read a price row directly, or you will miss assignments, tiers and currency. `PriceChangedEvent` is what other modules subscribe to; the one that matters most is the handler that enqueues reindexing per changed SKU.

## Use it when

- You need the price a specific shopper should see, in their store and currency
- Pricing rules are the thing being modelled: lists, assignments, tiers, recommended prices
- A bulk price import needs to be planned — this is where the indexation cost lands

## Do not use it when

- You want the price a customer actually paid — that is on the order line, copied at checkout
- You are reading price rows to compute a price yourself: evaluation exists because assignment order is not obvious
- You are importing thousands of price lists with events live — that fans out into one index job per SKU per list

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Search Core](VirtoCommerce.Search.md) (`VirtoCommerce.Search`) ≥ 3.1010.0

## Optional modules

- [Generic Export](VirtoCommerce.Export.md) (`VirtoCommerce.Export`) ≥ 3.1005.0

## Owns these entities

- `PricelistEntity`
- `PriceEntity`
- `PricelistAssignmentEntity`
- `MergedPriceEntity`

## Events it publishes

- `PriceChangedEvent`
- `PriceChangingEvent`

## Events it handles

- `ObjectSettingChangedEvent`
- `PriceChangedEvent`
- `ProductChangedEvent`

## REST controllers

- `api/pricing/evaluate` · 32 actions · [vc-module-pricing/src/VirtoCommerce.PricingModule.Web/Controllers/Api/PricingModuleController.cs](https://github.com/VirtoCommerce/vc-module-pricing/blob/dev/src/VirtoCommerce.PricingModule.Web/Controllers/Api/PricingModuleController.cs)

## Search index builders

- [vc-module-pricing/src/VirtoCommerce.PricingModule.Core/Services/IPricingDocumentChangesProvider.cs](https://github.com/VirtoCommerce/vc-module-pricing/blob/dev/src/VirtoCommerce.PricingModule.Core/Services/IPricingDocumentChangesProvider.cs)
- [vc-module-pricing/src/VirtoCommerce.PricingModule.Data/Search/ProductPriceDocumentBuilder.cs](https://github.com/VirtoCommerce/vc-module-pricing/blob/dev/src/VirtoCommerce.PricingModule.Data/Search/ProductPriceDocumentBuilder.cs)

## Permissions

- `pricing:access`
- `pricing:create`
- `pricing:delete`
- `pricing:export`
- `pricing:read`
- `pricing:update`

## Settings

- `Pricing.ExportImport.PageSize`
- `Pricing.Indexing.Enable`
- `Pricing.Indexing.PriceIndexingValue`
- `Pricing.LogPricingChanges`
- `Pricing.RecommendedPricePercent`
- `Pricing.Search.EventBasedIndexation.Enable`
- `VirtoCommerce.Search.IndexingJobs.IndexationDate.Pricing.Calendar`

## Database

Providers: SqlServer, MySql, PostgreSql. Migrations: 16.

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Price lists & assignments** (Pricing): Different prices for different audiences, decided per request rather than stored per product.

## Key features

- The system supports multiple **Pricelists**, i.e. the same product item may have different price in different price lists.
- Each **Catalog** can have its own list of **Pricelists**.
- Every **Pricelists** should have a unique Name-ID, and single currency.
- Each **Pricelists** contains a list of product prices with single currency.
- The system supports **Tier Pricing** and it is a way to encourage shoppers to buy larger quantities of a product by applying discounts based on the quantity ordered.
- The system supports static discounts on products and allows the user to specify the discount on each item on the list.
- In order to make the **Pricelists** active, it should be assigned to a specific **Catalog** in the system. The system allows the user to specify specific rules and conditions that can also be assigned to the **Pricelists**. These specific rules and conditions will influence the price calculation and define to which user categories or Organizations the pricelist will be displayed. This is a so-called **Dynamic Assignment**.
- The system allows expanding the **Dynamic Assignment** tree and it completely depends on the organization business needs. Any condition or rule can be added without changing the Module logic.
- The system allows assigning one **Pricelists** to several different **Catalogs**. The **Pricelists** is integrated into the **Catalog**.
- The system allows specify the **Pricelists** priority and therefore display on **Storefront** the **Pricelists** with higher priority.

## Documentation

- [Pricing module user documentation](https://docs.virtocommerce.org/platform/user-guide/pricing/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.Pricing)
- [View on Github](https://github.com/VirtoCommerce/vc-module-pricing)
