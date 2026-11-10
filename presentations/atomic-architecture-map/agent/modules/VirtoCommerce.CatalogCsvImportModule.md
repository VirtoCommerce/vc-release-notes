# CSV Catalog Export and Import (`VirtoCommerce.CatalogCsvImportModule`)

> Enables seamless export and import of catalog data in CSV format, simplifying data management and integration with external systems.

- Latest version: 3.1010.0 (needs platform 3.1076.0)
- Repository: https://github.com/VirtoCommerce/vc-module-catalog-csv-export-import
- Area: Catalog & product data
- On the map: `#/molecule/VirtoCommerce.CatalogCsvImportModule`

## For business analysts

Bulk product loading and extraction through CSV files, with a mapping a merchandiser can save.

## For architects

No storage of its own — six dependencies and two settings, working through Catalog and the platform's file handling. Catalog-specific where the generic Import module is not.

## For developers

The write path is the expensive part: every row publishes events, so suppress them or turn event-based indexation off and reindex once. Read the Suppress events atom before a large load.

## Use it when

- Product data arrives as spreadsheets, which it usually does
- A merchandiser needs to load or extract catalogue data without a developer
- The mapping is reused between loads

## Do not use it when

- A system can call the API — files are for people
- The data is not catalogue data: use the generic Import module
- You are loading a whole catalogue for the first time without planning the indexation cost

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1010.0
- [Catalog](VirtoCommerce.Catalog.md) (`VirtoCommerce.Catalog`) ≥ 3.1048.0
- [Commerce core](VirtoCommerce.Core.md) (`VirtoCommerce.Core`) ≥ 3.1012.0
- [Inventory](VirtoCommerce.Inventory.md) (`VirtoCommerce.Inventory`) ≥ 3.1010.0
- [Pricing](VirtoCommerce.Pricing.md) (`VirtoCommerce.Pricing`) ≥ 3.1008.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1009.0

## REST controllers

- `api/catalogcsvimport` · 4 actions · [vc-module-catalog-csv-export-import/src/VirtoCommerce.CatalogCsvImportModule.Web/Controllers/Api/CatalogModuleExportImportController.cs](https://github.com/VirtoCommerce/vc-module-catalog-csv-export-import/blob/dev/src/VirtoCommerce.CatalogCsvImportModule.Web/Controllers/Api/CatalogModuleExportImportController.cs)

## Settings

- `CatalogCsvImport.CreateDictionaryValues`
- `CatalogCsvImport.ExportFileNameTemplate`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Product Information Management](../packages/pim.md)

## Business features it serves

- **Bulk product import & export** (Product data): Load or extract thousands of products as files, with the mapping saved for next time.

## Key features

- **Export catalog data to CSV**: Extract product and category information into CSV format for easy editing and sharing.
- **Import catalog data from CSV**: Bring updated or new catalog data into the platform from CSV files.
- **Dynamic properties support**: Export and import dynamic properties seamlessly.
- **Multiple product images**: Manage image URLs and groups during export and import.
- **Configurable property mapping**: Define custom mappings for CSV columns during import.
- **Customizable column delimiter**: Choose a delimiter for CSV files to suit your needs.
- **Create new dictionary values**: Optionally allow the creation of new dictionary values during import (default: disabled).
- **Bulk update ready**: Simplify bulk updates by exporting data, modifying it in bulk, and importing the updated data back.

## Documentation

- [Catalog CSV Export and Import module user documentation](https://docs.virtocommerce.org/platform/user-guide/catalog-csv-export-import/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.CatalogCsvImportModule)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-catalog-csv-export-import/)
