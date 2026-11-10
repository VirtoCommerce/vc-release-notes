# Customer Export Import (`VirtoCommerce.CustomerExportImport`)

> This module adds customers export and import functionality. Use it for customer management.

- Latest version: 3.1004.0 (needs platform 3.1095.0)
- Repository: https://github.com/VirtoCommerce/vc-module-customer-export-import
- Area: Customer
- On the map: `#/molecule/VirtoCommerce.CustomerExportImport`

## For business analysts

Bulk loading and extraction of contacts and organisations as files.

## For architects

No storage — three dependencies, four settings, working through Customer. The same shape as its catalog and price siblings, which is what makes bulk data management predictable across modules.

## For developers

Member writes raise member events, and Customer feeds four index builders — so a large contact load carries the same indexation cost as a catalogue load. Plan it the same way.

## Use it when

- Customer data is migrated from another system
- Organisations and their members arrive as spreadsheets
- An operator needs to extract contacts for a campaign or an audit

## Do not use it when

- An integration can use the API
- Authentication accounts are the requirement — those are platform users, not members
- Personal data may not leave the system: an export file is a data-protection decision

## Required modules

- [Assets Management](VirtoCommerce.Assets.md) (`VirtoCommerce.Assets`) ≥ 3.1011.0
- [Companies and Contacts](VirtoCommerce.Customer.md) (`VirtoCommerce.Customer`) ≥ 3.1033.0
- [Store](VirtoCommerce.Store.md) (`VirtoCommerce.Store`) ≥ 3.1013.0

## REST controllers

- `api/customer/export` · 2 actions · [vc-module-customer-export-import/src/VirtoCommerce.CustomerExportImportModule.Web/Controllers/Api/ExportController.cs](https://github.com/VirtoCommerce/vc-module-customer-export-import/blob/dev/src/VirtoCommerce.CustomerExportImportModule.Web/Controllers/Api/ExportController.cs)
- `api/customer/import` · 4 actions · [vc-module-customer-export-import/src/VirtoCommerce.CustomerExportImportModule.Web/Controllers/Api/ImportController.cs](https://github.com/VirtoCommerce/vc-module-customer-export-import/blob/dev/src/VirtoCommerce.CustomerExportImportModule.Web/Controllers/Api/ImportController.cs)

## Permissions

- `customer:simpleExport`
- `customer:simpleImport`

## Settings

- `CustomerExportImport.Export.LimitOfLines`
- `CustomerExportImport.Import.AddressRegionStrongValidation`
- `CustomerExportImport.Import.FileMaxSize`
- `CustomerExportImport.Import.LimitOfLines`

## Packages that include it

- [Virto Start](../packages/virto-start.md)
- [Digital Catalog](../packages/digital-catalog.md)
- [Purchase](../packages/purchase.md)
- [Product Information Management](../packages/pim.md)
- [Customer & Organizations](../packages/crm.md)

## Business features it serves

- **Customer import & export** (Customer & accounts): Migrate contacts in, and pull lists out, as files.

## Key features

- Export and update contacts
- Export and update organizations
- Migrate contacts, organizations, and accounts from another system

## Documentation

- [Customer Export and Import module user documentation](https://docs.virtocommerce.org/platform/user-guide/customer-export-import/overview/)
- [REST API](https://virtostart-demo-admin.govirto.com/docs/index.html?urls.primaryName=VirtoCommerce.CustomerExportImport)
- [View on GitHub](https://github.com/VirtoCommerce/vc-module-customer-export-import/)
