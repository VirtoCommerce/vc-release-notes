# Price Export Import (`VirtoCommerce.PriceExportImport`)

> This module adds prices export and import functionality using it for price management.

- Latest version: 3.1003.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-price-export-import
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.PriceExportImport`

## For business analysts

Bulk price loading and extraction as files, per price list.

## For architects

No entities and no migrations — four dependencies and three settings. It is the price-shaped sibling of the catalog CSV module, and the module whose traffic pattern caused the reindex storms Pricing's notes warn about.

## For developers

Every imported row raises `PriceChangedEvent`, and the pricing handler enqueues one index job per SKU. Turn `Pricing.Search.EventBasedIndexation.Enable` off for the load, then reindex once.

## Use it when

- Prices arrive as spreadsheets from a supplier or an ERP
- A price list must be replaced in bulk rather than edited
- Someone non-technical owns the price file

## Do not use it when

- An integration can push prices through the API
- You have not planned the indexation cost — this is the classic case that overwhelms it
- The requirement is a rule, not a file: use pricing assignments

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1011.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1051.0
- [Generic Export](VirtoCommerce.Export.md) (`VirtoCommerce.Export`) ≥ 3.1006.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1010.0

## REST controllers

- `api/pricing/import` · 4 actions · [vc-module-price-export-import/src/VirtoCommerce.PriceExportImportModule.Web/Controllers/Api/ImportController.cs](https://github.com/VirtoCommerce/vc-module-price-export-import/blob/dev/src/VirtoCommerce.PriceExportImportModule.Web/Controllers/Api/ImportController.cs)

## Permissions

- `pricing:simpleImport`

## Settings

- `PriceExportImport.Export.LimitOfLines`
- `PriceExportImport.Import.FileMaxSize`
- `PriceExportImport.Import.LimitOfLines`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Bulk price import** (Pricing): Replace a whole price list from a supplier file.

## Documentation

- [Price Export and Import module user documentation](https://docs.virtocommerce.org/platform/user-guide/price-export-import/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.PriceExportImport)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-price-export-import/)
